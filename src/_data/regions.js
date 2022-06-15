const client = require('../_contentful/client.js')
const blockResolver = require('../_contentful/blockResolver.js')
const urlResolver = require('../_contentful/urlResolver.js')

module.exports = async function (configData) {
  const response = await client.getEntries({
    content_type: 'region',
    include: 10,
  })

  const pages = Array.from(response.items).map((entry) => {
    return {
      locale: 'sv-SE',
      name: entry.fields.name,
      title: entry.fields.title,
      introduction: entry.fields.introduction,
      slug: entry.fields.slug,
      url: urlResolver(entry),
      id: entry.sys.id,
      parentId: null,
      previewPath: `/__preview/${entry.sys.id}`,
      blocks: blockResolver(entry.fields.sections),
      type: 'region'
    }
  })

  return pages
}