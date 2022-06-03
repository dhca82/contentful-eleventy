const urlResolver = require('./urlResolver');

const documentToHtmlString = require('@contentful/rich-text-html-renderer').documentToHtmlString;

module.exports = (data) => {
  if(!data) return;
  return data.map(entry => {
    switch(entry.sys.contentType.sys.id) {
      case 'richText': {
        return {
          html: documentToHtmlString(entry.fields.body),
          type: 'richText',
          id: entry.sys.id
        }
      }
      case 'hero': {
        return {
          title: entry.fields.title,
          text: entry.fields.text,
          link: urlResolver(entry.fields.link),
          linkText: entry.fields.linkText,
          type: 'hero',
          id: entry.sys.id,
          image: entry.fields.image
        }
      }
      case 'newsSection': {
        return {
          tags: entry.metadata.tags.map(tag => tag.sys.id),
          region: entry.fields.region?.fields.slug,
          title: entry.fields.title,
          type: 'news',
          id: entry.sys.id
        }
      }
      case 'cards': {
        return {
          title: entry.fields.title,
          type: 'cards',
          cards: entry.fields.cards.map(card => {
            return {
              title: card.fields.title,
              tagline: card.fields.tagline,
              description: card.fields.description,
              link: urlResolver(card.fields.link),
              linkText: card.fields.linkText,
              image: card.fields.image
            }
          })
        }
      }
      case 'accordion': {
        return {
          title: entry.fields.title,
          type: 'faq',
          tags: entry.metadata.tags.map(tag => tag.sys.id),
          items: entry.fields.items.map(item => {
            return {
              summary: item.fields.summary,
              text: documentToHtmlString(item.fields.text),
              tags: item.metadata.tags.map(tag => tag.sys.id)
            } 
          })
        }
      }
      case 'story': {
        return {
          title: entry.fields.title,
          type: 'story',
        }
      }
      default: {
        console.warn(`Warning: Cannot resolve block of type ${entry.sys.contentType.sys.id}`)
      }
    }
  })
}