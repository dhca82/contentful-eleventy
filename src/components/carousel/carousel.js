import { LitElement, css, html } from 'lit'

class Carousel extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 4em 0;
    }
    .outer {
      overflow-x: auto;
      scrollbar-width: none;
      width: 100vw;
      scroll-snap-type: x mandatory;
    }
    .inner {
      display: flex;
      justify-content: flex-start;
      gap: 16px;
      box-sizing: border-box;
    }
  `
  firstUpdated() {
    const prevSiblingWidth = this.previousElementSibling.offsetWidth
    const outsideMargin =
      (document.documentElement.clientWidth - prevSiblingWidth) / 2
    const items = this.querySelectorAll('peppr-carousel-item')
    const itemWidth = (prevSiblingWidth + 16) / 3
    const innerWidth = itemWidth * items.length + outsideMargin * 2

    this.shadowRoot.querySelector('.inner').style.cssText = `
      padding: 0 ${outsideMargin}px 0 ${outsideMargin}px;
      width: ${innerWidth - 16}px;
    `

    this.shadowRoot.querySelector('.outer').style.cssText = `
      scroll-padding: 0 0 0 ${outsideMargin}px;
    `
  }
  render() {
    return html`
      <div class="outer">
        <div class="inner">
          <slot></slot>
        </div>
      </div>
    `
  }
}
customElements.define('peppr-carousel', Carousel)

class CarouselItem extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      scroll-snap-align: start;
    }
  `
  render() {
    return html` <slot></slot> `
  }
}
customElements.define('peppr-carousel-item', CarouselItem)
