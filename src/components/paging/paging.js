class Paging extends HTMLElement {
  #button
  #listContainer

  constructor() {
    super()
    this.#button = this.querySelector('button')
    this.#listContainer = document.getElementById(this.getAttribute('for'))
    this.#button.addEventListener('click', this.handleButtonClick.bind(this))
    this.#listContainer.addEventListener('list-updated', this.handleUpdated.bind(this))
  }

  get hidden() {
    return this.style.display === 'none'
  }
  set hidden(value) {
    value ? (this.style.display = 'none') : this.style.removeProperty('display')
  }

  handleButtonClick() {
    this.#listContainer.page = this.#listContainer.page + 1
  }

  handleUpdated() {
    this.hidden = this.#listContainer.count >= this.#listContainer.total
  }
}
customElements.define('paging-container', Paging)
