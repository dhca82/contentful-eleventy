const client = require('../_contentful/client.js')
const blockResolver = require('../_contentful/blockResolver.js')

module.exports = async function (configData) {
  const response = await client.getEntries({
    content_type: 'startpage',
    include: 10,
  })

  const pages = Array.from(response.items).map((entry) => {
    return {
      name: entry.fields.title,
      slug: '',
      url: '/',
      id: entry.sys.id,
      parentId: 0,
      previewPath: `/__preview/${entry.sys.id}`,
      blocks: blockResolver(entry.fields.sections),
      type: 'start'
    }
  })

  return pages 
}