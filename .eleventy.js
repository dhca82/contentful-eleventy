const { EleventyServerlessBundlerPlugin } = require('@11ty/eleventy')
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')
const StoryblokClient = require('storyblok-js-client')
const tagFilter = require('./src/_filters/tagFilter')
const paginationFilter = require('./src/_filters/paginationFilter')

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
    // const client = new StoryblokClient({
    //   accessToken: process.env.CMS_ACCESS_TOKEN,
    // });
    // const startPage = await client.get(
    //   `cdn/stories/${process.env.STARTPAGE_ID}`
    // );
    return {
      //siteName: startPage.data.story.content.site_name,
      siteRootId: process.env.STARTPAGE_ID,
      lastBuilt: Date.now(),
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
