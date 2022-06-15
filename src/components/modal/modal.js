import { LitElement, html, css } from 'lit'

class Modal extends LitElement {
  static styles = css`
    :host([open]) {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      inset: 0;
      z-index: 99;
    }
    :host([open]):before {
      content: '';
      display: block;
      inset: 0;
      position: fixed;
      background: rgba(0, 0, 0, 0.5);
      opacity: 1;
      transition: opacity 500ms ease;
    }
    :host(.opening):before,
    :host(.closing):before {
      opacity: 0;
    }
    dialog {
      display: block;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      position: static;
      min-height: 600px;
      width: 800px;
      background: #fff;
      z-index: 100;
      opacity: 1;
      transform: translateY(0);
      transition: opacity 200ms ease, transform 200ms ease;
    }
    :host(.opening) dialog,
    :host(.closing) dialog {
      opacity: 0;
      transform: translateY(50px);
    }
    button {
      position: absolute;
      right: 25px;
      top: 25px;
      appearance: none;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      gap: 10px;
      align-items: center;
      color: rgba(0, 0, 0, 0.3);
    }
  `
  static properties = {
    open: { type: Boolean, reflect: true },
  }
  constructor() {
    super()
    this.handleEscPress = this.handleEscPress.bind(this)
    this.handleTriggerClick = this.handleTriggerClick.bind(this)
    this.closeDialog = this.closeDialog.bind(this)

    this._trigger = document.querySelector(`[aria-controls="${this.getAttribute('id')}"]`)
    this.initTrigger()
    document.body.prepend(this)
  }
  updated(changedProperties) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.initDialog()
      }
    }
  }
  initTrigger() {
    this._trigger.setAttribute('aria-haspopup', 'true')
    this._trigger.setAttribute('aria-expanded', 'false')
    this._trigger.addEventListener('click', this.handleTriggerClick.bind(this))
  }
  initDialog() {
    this.open = true
    this._trigger.setAttribute('aria-expanded', 'true')
    this.classList.add('opening')
    document.querySelector('.page').setAttribute('inert', '')
    setTimeout(() => {
      this.classList.remove('opening')
      this.querySelector('input')?.focus()
      document.addEventListener('click', this.closeDialog)
      window.addEventListener('keyup', this.handleEscPress)
      document.dispatchEvent(new CustomEvent('modal-opened'))
    }, 50)
  }
  closed() {
    document.querySelector('.page').removeAttribute('inert', '')
    document.removeEventListener('click', this.closeDialog)
    window.removeEventListener('keyup', this.handleEscPress)
    this.classList.remove('closing')
    this.dispatchEvent(new CustomEvent('modal-closed'))
  }
  closeDialog() {
    this._trigger.setAttribute('aria-expanded', 'false')
    this.classList.add('closing')
    this.dispatchEvent(new CustomEvent('modal-closing'))
    setTimeout(() => {
      this.closed()
      this.open = false
    }, 500)
  }
  handleTriggerClick(e) {
    e.preventDefault()
    this.open ? (this.open = false) : (this.open = true)
  }
  handleEscPress(e) {
    if (e.key === 'Escape') {
      this.closeDialog()
    }
  }
  render() {
    if (!this.open) return
    
    return html`
      <dialog part="dialog" open @click="${(e) => e.stopPropagation()}">
        <button @click="${this.closeDialog}" aria-label="Stäng (esc)" part="close-button">
          Esc
          <cross-icon circle></cross-icon>
        </button>
        <slot></slot>
      </dialog>
    `
  }
}
customElements.define('modal-container', Modal)
