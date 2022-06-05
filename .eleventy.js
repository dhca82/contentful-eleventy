const { EleventyServerlessBundlerPlugin } = require('@11ty/eleventy')
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')
const client = require('./src/_contentful/client.js')
const tagFilter = require('./src/_filters/tagFilter')
const paginationFilter = require('./src/_filters/paginationFilter')
const localeFilter = require('./src/_filters/localeFilter')
const switchLanguage = require('./src/_filters/switchLanguage')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: 'serverless', // The serverless function name from your permalink object
    functionsDir: './netlify/functions/',
    copy: ['src/_filters/'],
  })

  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  eleventyConfig.addFilter('tagFilter', tagFilter)
  eleventyConfig.addFilter('paginationFilter', paginationFilter)
  eleventyConfig.addFilter('localeFilter', localeFilter)
  eleventyConfig.addFilter('switchLanguage', switchLanguage)

  const regions = [
    { id: '4JfA9RZrLouaiCQxej03mU', slug: 'stockholm' },
    { id: '1jcUBYvZmYRtnTqRlLwxgr', slug: 'kalmar' },
    { id: '2NipC9MXGxiu6cEwvLsx35', slug: 'centralt' },
  ]

  regions.forEach((region) => {
    eleventyConfig.addCollection(region.slug, function (collectionApi) {
      const news = collectionApi
        .getFilteredByTag('news')
        .filter((item) => item.data.currentPage.region?.id === region.id)
      return news
    })
  })

  eleventyConfig.setBrowserSyncConfig({
    //Reload browser when js/css bundles are built
    files: ['./dist/main.js', './dist/main.css'],
  })

  eleventyConfig.addGlobalData('global', async () => {
    const locales = await client.getLocales()
    return {
      //siteName: startPage.data.story.content.site_name,
      allLocales: locales.items.map(locale => locale.code),
      siteRootId: process.env.STARTPAGE_ID,
      lastBuilt: Date.now(),
    }
  })

  eleventyConfig.addGlobalData('localizedStrings', async () => {
    return {
      'sv-SE': {
        startUrl: '/',
        more: 'Mer',
        search: 'Sök',
        language: 'English',
        mypages: 'Mina sidor'
      },
      'en': {
        startUrl: '/en/',
        more: 'More',
        search: 'Search',
        language: 'Svenska',
        mypages: 'Log in'
      }
    }
  })

  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
    },
  }
}
