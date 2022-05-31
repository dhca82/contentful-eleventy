module.exports = {
  pageType: (data) => data.currentPage.type,
  title: (data) => {
    return data.currentPage.name
  },
  eleventyNavigation: {
    key: (data) => data.currentPage.id,
    parent: (data) => data.currentPage.parentId,
    title: (data) => data.currentPage.name,
  },
};
