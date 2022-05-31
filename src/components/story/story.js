import { LitElement, css, html } from 'lit'

class Story extends LitElement {
  static styles = css`
    :host {

    }
  `
  firstUpdated() {
    
  }
  render() {
    return html`
      <slot></slot>
    `
  }
}
customElements.define('peppr-story', Story)
