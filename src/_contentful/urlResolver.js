module.exports = (entry, url = '') => {
  return resolve(entry, url)
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
