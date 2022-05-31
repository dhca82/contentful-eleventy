import { LitElement, css } from 'lit'

class ToggleIcon extends LitElement {
  static properties = {
    open: { reflect: true, type: Boolean },
  }
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(var(--spacing) * 3);
      height: calc(var(--spacing) * 3);
      background: var(--subtle-action-color, hsl(0, 0%, 90%));
      border-radius: 50%;
      transition:transform ease 200ms;
    }
    :host:before,
    :host:after {
      content: '';
      display: block;
      height: 3px;
      width: 1.2em;
      background: #fff;
      position: absolute;
    }
    :host:after {
      transform: rotate(90deg);
    }
    :host([open]):after {
      content: none;
    }
    :host(.press) {
      transform:scale(1.1);
    }
  `
  updated() {
    this.setAttribute('aria-label', this.open ? '-' : '+')
    this.classList.add('press')
    setTimeout(() => {
      this.classList.remove('press')
    }, 200)
  }
}
customElements.define('a-toggle-icon', ToggleIcon)
