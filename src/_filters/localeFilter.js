module.exports = function (collection, locale) {
  return collection.filter(entry => entry.data.currentPage.locale === locale)
}
