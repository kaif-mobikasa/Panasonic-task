class HomepageFaq extends HTMLElement {
  constructor() {
    super();
    this.handleBlockSelect = this.handleBlockSelect.bind(this);
    this.handleSectionLoad = this.handleSectionLoad.bind(this);
    this.cleanups = [];
    this.isConnectedComponent = false;
  }

  connectedCallback() {
    if (this.isConnectedComponent) return;
    this.isConnectedComponent = true;
    this.init();
    document.addEventListener('shopify:block:select', this.handleBlockSelect);
    document.addEventListener('shopify:section:load', this.handleSectionLoad);
  }

  disconnectedCallback() {
    this.isConnectedComponent = false;
    this.destroy();
    document.removeEventListener('shopify:block:select', this.handleBlockSelect);
    document.removeEventListener('shopify:section:load', this.handleSectionLoad);
  }

  destroy() {
    if (Array.isArray(this.cleanups)) {
      this.cleanups.forEach((cleanup) => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    }
    this.cleanups = [];
  }

  init() {
    this.destroy();

    const faqButtons = Array.from(this.querySelectorAll('[data-faq-toggle]'));
    if (!faqButtons.length) return;

    faqButtons.forEach((btn) => {
      const onBtnClick = (e) => {
        e.preventDefault();
        const item = btn.closest('.hp-faq-item');
        if (!item) return;

        const isOpen = item.classList.contains('is-open');
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      };

      const onBtnKeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      };

      btn.addEventListener('click', onBtnClick);
      btn.addEventListener('keydown', onBtnKeydown);

      this.cleanups.push(() => {
        btn.removeEventListener('click', onBtnClick);
        btn.removeEventListener('keydown', onBtnKeydown);
      });
    });
  }

  handleBlockSelect(e) {
    const block = e.target;
    if (!block || !this.contains(block)) return;

    const item = block.classList.contains('hp-faq-item') ? block : block.querySelector('.hp-faq-item');
    if (!item) return;

    const btn = item.querySelector('[data-faq-toggle]');
    if (!item.classList.contains('is-open') && btn) {
      btn.click();
    }
  }

  handleSectionLoad(e) {
    const section = e.target;
    if (section === this || (section && typeof section.contains === 'function' && section.contains(this))) {
      this.init();
    }
  }
}

if (!customElements.get('homepage-faq')) {
  customElements.define('homepage-faq', HomepageFaq);
}
