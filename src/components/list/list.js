class ListContainer extends HTMLElement {
  #params
  #page

  constructor() {
    super()
    this.setAttribute('aria-live', 'polite')
    this.setAttribute('aria-busy', false)
  }

  connectedCallback() {
    this.style.minHeight = this.offsetHeight + 'px'
    this.initParams()
  }

  set isLoading(value) {
    this.setAttribute('aria-busy', value)
  }
  get isLoading() {
    return this.getAttribute('aria-busy') === 'true'
  }

  get page() {
    return this.#page
  }
  set page(value) {
    this.#page = value
    this.update()
  }

  get total() {
    return this.getAttribute('total')
  }
  set total(value) {
    this.setAttribute('total', value)
  }

  get shouldUpdateUrl() {
    return this.getAttribute('update-url') === 'true'
  }

  get count() {
    return this.children.length
  }

  set params(value) {
    this.#page = 0
    this.#params = value
    this.update(true)
  }

  createFetchUrl(fromStart) {
    let url = this.getAttribute('fetch-url')
    url.includes('?') ? (url += '&') : (url += '?')
    let searchParams = this.createFilterParams()
    if (fromStart) {
      searchParams.set('take', 7 * (this.#page + 1))
    } else {
      searchParams.set('skip', this.#page > 0 ? this.#page * 7 : 0)
      searchParams.set('take', 7)
    }
    url += searchParams.toString()
    return url
  }

  async update(replace = false, fromStart = false) {
    if(this.shouldUpdateUrl) {
      this.updateUrl()
    }
    const fetchUrl = this.createFetchUrl(fromStart)
    let result = this.getResultFromCache(fetchUrl)
    if (result === null) {
      this.isLoading = true
      result = await this.fetchResult(fetchUrl)
      this.cacheResult(fetchUrl, result)
    }
    this.total = result.total
    setTimeout(
      () => {
        this.updateDOM(result.html, replace)
        this.isLoading = false
        this.dispatchEvent(new Event('list-updated'))
      },
      fromStart ? 0 : 200
    )
  }

  async fetchResult(fetchUrl) {
    const response = await fetch(fetchUrl)
    return await response.json()
  }

  cacheResult(key, result) {
    sessionStorage.setItem(key, JSON.stringify(result))
  }
  getResultFromCache(key) {
    return JSON.parse(sessionStorage.getItem(key))
  }

  updateDOM(html, replace) {
    if (replace) {
      this.innerHTML = html
    } else {
      this.insertAdjacentHTML('beforeend', html)
    }
  }

  updateUrl() {
    const urlParams = this.createFilterParams()
    if (this.#page > 0) urlParams.set('page', this.#page)
    const queryString = urlParams.toString()
    let newState = queryString !== '' ? `?${queryString}` : location.pathname
    window.history.replaceState(null, null, newState)
  }

  initParams() {
    const params = new URLSearchParams(location.search)
    this.#page = parseInt(params.get('page')) || 0
    params.delete('page')
    this.#params = Array.from(params.entries()).map((param) => {
      return { name: param[0], value: param[1] }
    })
    if (this.#params.length > 0 || this.#page > 0) {
      this.update(true, true)
    }
    this.dispatchEvent(new CustomEvent('list-initialized', { detail: this.#params }))
  }

  createFilterParams() {
    let searchParams = new URLSearchParams()
    this.#params.forEach((param) => {
      searchParams.has(param.name)
        ? searchParams.set(param.name, searchParams.get(param.name) + ',' + param.value)
        : searchParams.set(param.name, param.value)
    })
    return searchParams
  }
}
customElements.define('list-container', ListContainer)