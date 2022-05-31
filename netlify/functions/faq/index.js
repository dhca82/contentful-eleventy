const client = require('../../../src/_contentful/client.js')
const nunjucks = require('nunjucks')
const documentToHtmlString = require('@contentful/rich-text-html-renderer').documentToHtmlString;

exports.handler = async function (event, context) {

  const { tag, region } = event.queryStringParameters
  const skip = parseInt(event.queryStringParameters.skip) || 0
  const take = parseInt(event.queryStringParameters.take) || 7

  const response = await client.getEntries({
    content_type: 'detail',
    include: 10,
    limit: take,
    skip: skip,
    'metadata.tags.sys.id[in]': tag,
  })

  const items = Array.from(response.items).map((entry) => {
    return {
      summary: entry.fields.summary,
      text: documentToHtmlString(entry.fields.text),
    }
  })

  const env = nunjucks.configure(['./', './node_modules/node_nunjucks/'])
  const template = env.getTemplate('./src/includes/parts/detail.njk')

  let html = ''
  items.forEach((item) => {
    html += template.render({ detail: item })
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      html: html,
      total: response.total
    })
  }
}
