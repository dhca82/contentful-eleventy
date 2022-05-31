import { LitElement, html, css } from 'lit'

class FilterContainer extends LitElement {
  #listContainer
  #groups

  constructor() {
    super()
    this.handleFilter = this.handleFilter.bind(this)
    this.addEventListener('custom-filter', this.handleFilter)
  }

  static properties = {
    for: {},
    using: {},
  }

  connectedCallback() {
    this.#listContainer = document.getElementById(this.for)
    this.#groups = this.querySelectorAll('filter-group')
    this.#listContainer.addEventListener('list-initialized', (e) => {
      this.#groups.forEach((group) => {
        group.selected = e.detail
      })
    })
  }

  handleFilter(e) {
    this.syncParamsWithElements()
    this.requestUpdate()
  }

  syncParamsWithElements() {
    let newParams = []
    this.#groups.forEach((group) => {
      newParams = newParams.concat(group.selected)
    })
    this.#listContainer.params = newParams
  }

  render() {
    return html`<slot></slot>`
  }
}
customElements.define('filter-container', FilterContainer)

class FilterGroup extends LitElement {
  #buttons

  constructor() {
    super()
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.#buttons = this.querySelectorAll('button')
    this.initButtons()
  }

  static properties = {
    name: {},
    type: {},
  }

  get selected() {
    if (this.querySelector('button[value="all"][aria-selected="true"]')) return []
    return Array.from(this.#buttons)
      .filter((button) => button.getAttribute('aria-selected') === 'true')
      .map((button) => {
        return { name: this.name, value: button.value, text: button.innerText }
      })
  }
  set selected(value) {
    Array.from(this.#buttons).forEach((button) => {
      if (
        value.some((param) => param.name === this.name && param.value === button.value)
      ) {
        button.setAttribute('aria-selected', 'true')
      }
    })
  }

  initButtons() {
    this.#buttons.forEach((button) => {
      button.setAttribute('role', 'tab')
      button.addEventListener('click', this.handleButtonClick)
    })
  }

  handleButtonClick(e) {
    const current = e.currentTarget
    if (this.type === 'single') {
      this.clearAll()
    }
    const isSelected = current.getAttribute('aria-selected') === 'true'
    current.setAttribute('aria-selected', !isSelected)

    this.requestUpdate()
    this.dispatchEvent(new Event('custom-filter', { bubbles: true }))
  }

  clearAll() {
    this.#buttons.forEach((button) => button.setAttribute('aria-selected', false))
  }

  updated() {
    const allButton = this.querySelector('button[value="all"]')
    allButton?.setAttribute('aria-selected', this.selected.length === 0)
  }

  render() {
    return html` <slot></slot> `
  }
}
customElements.define('filter-group', FilterGroup)



