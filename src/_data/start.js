const client = require('../_contentful/client.js')
const blockResolver = require('../_contentful/blockResolver.js')

module.exports = async function (configData) {
  let pages = []

  await Promise.all(
    configData.global.allLocales.map(async (locale) => {
      const response = await client.getEntries({
        content_type: 'startpage',
        include: 10,
        locale: locale,
      })
      pages = pages.concat(mapResponseToViewModel(response, locale))
    })
  )

  return pages
}

function mapResponseToViewModel(response, locale) {
  return response.items.map((entry) => {
    if(!entry.fields.title) return null
    return {
      locale: locale,
      name: entry.fields.title,
      slug: '',
      url: locale === 'sv-SE' ? '/' : '/en/',
      id: entry.sys.id,
      parentId: 0,
      previewPath: `/__preview/${entry.sys.id}`,
      blocks: blockResolver(entry.fields.sections, locale),
      type: 'start'
    }
  }).filter(entry => entry !== null)
}
