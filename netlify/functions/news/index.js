const client = require('../../../src/_contentful/client.js')
const nunjucks = require('nunjucks')

exports.handler = async function (event, context) {

  const { tag, region } = event.queryStringParameters
  const skip = parseInt(event.queryStringParameters.skip) || 0
  const take = parseInt(event.queryStringParameters.take) || 7

  const response = await client.getEntries({
    content_type: 'news',
    include: 10,
    limit: take,
    skip: skip,
    'metadata.tags.sys.id[in]': tag,
    'fields.region.sys.contentType.sys.id': 'region',
    'fields.region.fields.slug': region,
  })

  const items = Array.from(response.items).map((entry) => {
    return {
      name: entry.fields.title,
      url: `/${entry.fields.region?.fields.slug}/nyheter/${entry.fields.slug}/`,
    }
  })

  const env = nunjucks.configure(['./', './node_modules/node_nunjucks/'])
  const template = env.getTemplate('./src/includes/parts/card.njk')

  let html = ''
  items.forEach((item) => {
    html += template.render({ card: item })
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      html: html,
      total: response.total
    })
  }
}
