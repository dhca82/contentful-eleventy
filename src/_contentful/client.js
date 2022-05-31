const contentful = require('contentful')

module.exports = contentful.createClient({
  space: process.env.CMS_SPACE,
  accessToken: process.env.CMS_ACCESS_TOKEN
})
