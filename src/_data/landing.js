const client = require('../_contentful/client.js')
const blockResolver = require('../_contentful/blockResolver.js')
const urlResolver = require('../_contentful/urlResolver.js')

module.exports = async function (configData) {
  let pages = []

  await Promise.all(
    configData.global.allLocales.map(async (locale) => {
      const response = await client.getEntries({
        content_type: 'landingPage',
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
    if(!entry.fields.slug) return null
    return {
      locale: locale,
      localizedUrls: [
        { 'sv-SE' : '/' },
        { 'en' : '/en/' }
      ],
      name: entry.fields.name,
      title: entry.fields.title,
      introduction: entry.fields.introduction,
      slug: entry.fields.slug,
      url: urlResolver(entry, locale),
      id: entry.sys.id,
      parentId: entry.fields.parent.sys.id,
      previewPath: `/__preview/${entry.sys.id}`,
      blocks: blockResolver(entry.fields.sections, locale),
      type: 'landing',
    }
  }).filter(entry => entry !== null)
}
