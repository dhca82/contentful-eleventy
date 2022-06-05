module.exports = (entry, locale = 'sv-SE', url = '') => {
  if(locale === 'sv-SE') {
    return resolve(entry, url)
  }
  return '/' + locale + resolve(entry, url)
}

resolve = (entry, url = '') => {
  if(entry.fields.slug) {
    url = entry.fields.slug + '/' + url;
  }
  if(entry.fields.parent) {
    url = resolve(entry.fields.parent, url)
  }
  else {
    url = '/' + url
  }
  return url;
}
