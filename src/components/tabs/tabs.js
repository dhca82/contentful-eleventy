import { LitElement, html, css } from 'lit'



class Tabs extends LitElement {
  static properties = {}
  static styles = css`
    .hidden {
      display: none;
    }
    .tablist {
      display:flex;
      gap:3em;
      position:relative;
    }
    .selected {
      display:block;
      background:#000;
      height:3px;
      position:absolute;
      transition:all 200ms ease;
      bottom:0;
    }
    button {
      appearance:none;
      border:none;
      background:none;
      padding:0;
      margin:0;
      cursor:pointer;
      padding:.5em 0;
      font-size:var(--text-lg);
      font-weight:700;
    }
  `
  constructor() {
    super()
  }
  connectedCallback() {

    this.tabPanels = this.querySelectorAll('tab-panel')
    this.tabPanels.forEach((panel, i) => {
      panel.setAttribute('visible', i === 0)
    })

    //TODO: Ugly af
    document.addEventListener('modal-opened', () => {
      setTimeout(() => {
        this.setBorderOnSelected()
      },100) 
    })

    // this.tabTemplate = this.querySelector('template')
    super.connectedCallback()
  }
  disconnectedCallback() {
    super.disconnectedCallback()
  }

  firstUpdated() {
    this.setBorderOnSelected()
  }

  setBorderOnSelected() {
    const selectedTab = this.shadowRoot.querySelector('button[aria-selected="true"]')

    const bar = this.shadowRoot.querySelector('.selected')
    bar.style.cssText = `
      left:${selectedTab.offsetLeft}px;
      width:${selectedTab.offsetWidth}px;
    `
  }

  handleTabClick(e) {
    this.restoreAll()
    e.currentTarget.setAttribute('aria-selected', true)

    const bar = this.shadowRoot.querySelector('.selected')
    bar.style.cssText = `
      left:${e.currentTarget.offsetLeft}px;
      width:${e.currentTarget.offsetWidth}px;
    `
    let panel = document.getElementById(e.currentTarget.getAttribute('aria-controls'))
 
    panel.setAttribute('visible', true)
  }

  restoreAll() {
    this.tabPanels.forEach(panel => {
      panel.setAttribute('visible', false)
    })
    this.shadowRoot.querySelectorAll('button').forEach(tab => {
 
      tab.setAttribute('aria-selected', false)
    })
  }

  render() {
    const tabsHtml = Array.from(this.tabPanels).map((panel) => {
      return html`
        <button part="tab" role="tab" aria-selected="${panel.getAttribute('visible')}" aria-controls="${panel.id}" @click="${this.handleTabClick}">
          ${panel.getAttribute('aria-label')}
        </button>
      `
    })

    return html`
      <div role="tablist" class="tablist">
        ${tabsHtml}
        <span class="selected"></span>
      </div>
      <slot></slot>
    `
  }
}
customElements.define('tabs-container', Tabs)

class TabPanel extends LitElement {
  static properties = {
    visible: { reflect: true, type: Boolean },
    id: { reflect: true },
  }
  static styles = css`
    :host([visible='false']) {
      display: none;
    }
  `
  constructor() {
    super()
    this.setAttribute('role', 'tabpanel')
    this.id = String(Date.now()) + Math.floor(Math.random() * 10000)
  }
  firstUpdated() {}
  update() {
    super.update()
  }
  connectedCallback() {
    super.connectedCallback()
  }
  disconnectedCallback() {
    super.disconnectedCallback()
  }

  render() {
    return html`
      <div>
        <slot name="content"></slot>
      </div>
    `
  }
}
customElements.define('tab-panel', TabPanel)
