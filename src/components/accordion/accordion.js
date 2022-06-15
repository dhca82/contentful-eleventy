import { LitElement, html, css } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

class Accordion extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: calc(var(--spacing) * 3);
    }
  `
  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `
  }
}
customElements.define('accordion-container', Accordion)

class AccordionItem extends LitElement {
  static properties = {
    open: { reflect: true, type: Boolean },
  }
  static styles = css`
    :host {
      display: block;
      border-bottom: 1px solid var(--border-color, rgba(0,0,0,0.1));
    }
    :host(:first-child) {
      border-top: 1px solid var(--border-color, rgba(0,0,0,0.1));
    }
    :host(:focus-within) a-toggle-icon {
      outline: var(--focus-outline);
      outline-offset: 3px;
    }
    :host(:focus-within) button {
      outline: none;
    }
    button {
      appearence: none;
      background: transparent;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: calc(var(--spacing) / 2) 0;
      border: none;
      cursor: pointer;
      align-items: center;
    }
  `
  constructor() {
    super()
    this._regionId = String(Date.now()) + Math.floor(Math.random() * 10000)
    this._labelId = String(Date.now()) + Math.floor(Math.random() * 10000)
  }

  render() {
    return html`
      <div>
        <button
          id="${this._labelId}"
          @click="${() => (this.open = !this.open)}"
          aria-expanded="${this.open ? 'true' : 'false'}"
          aria-controls="${this._regionId}"
          part="button"
        >
          <slot name="title"></slot>
          <a-toggle-icon part="icon"
            open="${ifDefined(this.open ? '' : undefined)}"
          ></a-toggle-icon>
        </button>
        <div
          id="${this._regionId}"
          aria-labelledby="${this._labelId}"
          role="region"
          style="${!this.open ? 'display:none' : ''}"
        >
          <slot></slot>
        </div>
      </div>
    `
  }
}

customElements.define('accordion-item', AccordionItem)
