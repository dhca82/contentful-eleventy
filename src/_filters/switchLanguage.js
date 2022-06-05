module.exports = function (collection, page) {
  const newLocale = page.locale === 'sv-SE' ? 'en' : 'sv-SE'
  const entry = collection.find(
    (entry) =>
      entry.data.currentPage.locale === newLocale && entry.data.currentPage.id === page.id
  )
  if (entry && entry.data.currentPage) {
    return entry.data.currentPage.url
  } else {
    return newLocale === 'en' ? '/en/' : '/'
  }
}
