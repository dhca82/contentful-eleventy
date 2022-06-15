import { LitElement, html, css } from 'lit'

class CrossIcon extends LitElement {
  static styles = css`
    svg:not(:root) {
      stroke: rgba(0, 0, 0, 1);
      fill: none;
      width: 100%;
      height: auto;
    }
    :host {
      display: block;
      width: 26px;
      height: 26px;
    } 
    :host([circle]) {
      background:#f1f1f1;
      border-radius:50%;
      padding:10px;
    }
  `
  static properties = {
    size: {},
    circle: {},
    stroke: {},
  }
  render() {
    return html`
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 5L5 15"
          stroke="black"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5 5L15 15"
          stroke="black"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `
  }
}
customElements.define('cross-icon', CrossIcon)
