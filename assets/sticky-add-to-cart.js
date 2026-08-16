import { Component } from '@theme/component';

/**
 * A fixed bottom bar (mobile only) that mirrors the real Add to cart button, shown once
 * the real button scrolls out of view, and delegates clicks to it so the actual
 * add-to-cart form submission, validation and animations stay in a single place.
 *
 * @typedef {object} Refs
 * @property {HTMLButtonElement} [button] - The sticky bar's own button.
 *
 * @extends Component<Refs>
 */
export class StickyAddToCartBar extends Component {
  connectedCallback() {
    super.connectedCallback();

    const sourceButton = this.closest('.product-information')?.querySelector('[name="add"][type="submit"]');

    if (!(sourceButton instanceof HTMLButtonElement)) return;

    this.#sourceButton = sourceButton;

    if (sourceButton.disabled && this.refs.button) {
      this.refs.button.disabled = true;
    }

    this.#observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      // Only reveal the bar once the real button has scrolled above the viewport.
      // Using `!isIntersecting` alone also fires when the button hasn't been
      // reached yet (e.g. it starts below the fold on page load), showing the
      // bar and duplicating the price before the user has scrolled at all.
      const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      this.toggleAttribute('data-visible', scrolledPast);
    });

    this.#observer.observe(sourceButton);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
  }

  /** @type {HTMLButtonElement | null} */
  #sourceButton = null;

  /** @type {IntersectionObserver | null} */
  #observer = null;

  handleClick() {
    this.#sourceButton?.click();
  }
}

if (!customElements.get('sticky-add-to-cart-bar')) {
  customElements.define('sticky-add-to-cart-bar', StickyAddToCartBar);
}
