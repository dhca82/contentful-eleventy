const client = require('../_contentful/client.js')
const blockResolver = require('../_contentful/blockResolver.js')
const urlResolver = require('../_contentful/urlResolver.js')
const documentToHtmlString = require('@contentful/rich-text-html-renderer').documentToHtmlString;

module.exports = async function (configData) {
  const response = await client.getEntries({
    content_type: 'news',
    include: 10,
  })

  const pages = Array.from(response.items).map((entry) => {
    return {
      name: entry.fields.title,
      slug: entry.fields.slug,
      url: `/${entry.fields.region?.fields.slug}/nyheter/${entry.fields.slug}/`,
      id: entry.sys.id,
      tags: entry.metadata.tags.map(tag => tag.sys.id),
      region: {
        id: entry.fields.region?.sys.id
      },
      previewPath: `/__preview/${entry.sys.id}`,
      body: documentToHtmlString(entry.fields.body),
    }
  })

  return pages
}

// resolveUrl = (entry, url = '') => {
//   if(entry.fields.slug) {
//     url = entry.fields.slug + '/' + url;
//   }
//   if(entry.fields.parent) {
//     url = resolveUrl(entry.fields.parent, url)
//   }
//   else {
//     url = '/' + url
//   }
//   return url;
// }