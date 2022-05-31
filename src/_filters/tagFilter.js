module.exports = function (collection, tags, take = 100) {
  return collection.filter((entry) => {
    let include
    entry.data.currentPage.tags.forEach((tag) => {
      include = tags.includes(tag)
      if (include) return
    })
    return include
  })
  .slice(0, take)
  .map(entry => {
    return {
      name: entry.data.currentPage.name,
      url: entry.url
    }
  })
}
