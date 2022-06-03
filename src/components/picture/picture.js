import { LitElement, html, css } from 'lit'

class Picture extends LitElement {
  static styles = css`
    :host {
      position:absolute;
      inset:0;
    
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `
  static properties = {
    src: {},
    width: {},
    height: {},
  }
  constructor() {
    super()
    
  }
  connectedCallback() {
    
    super.connectedCallback();
    console.log('width', this.offsetWidth)
    if(this.width = 'auto')
      this.width = this.offsetWidth
    if(this.height = 'auto')
      this.height = this.offsetHeight
  }
  render() {
    return html`
      <picture>
        <source
          srcset="
            ${this.src}?tr=w-${this.width},h-${this.height},
            ${this.src}?tr=w-${this.width * 2},h-${this.height * 2} 2x
          "
        />
        <img
          src="${this.src}?tr=w-${this.width},h-${this.height}"
          alt=""
          width="${this.width}"
          height="${this.height}"
        />
      </picture>
    `
  }
}
customElements.define('picture-container', Picture)
