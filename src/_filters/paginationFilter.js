module.exports = function (pagination) {
  if(pagination.pageNumber > 0) {
    return pagination.pageNumber + '/'
  }
  return ''
}
