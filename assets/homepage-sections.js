class HomepageHero extends HTMLElement {
  constructor() {
    super();
    this.handleBlockSelect = this.handleBlockSelect.bind(this);
    this.handleBlockDeselect = this.handleBlockDeselect.bind(this);
    this.handleSectionLoad = this.handleSectionLoad.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onDotsClick = this.onDotsClick.bind(this);
    this.onRootClick = this.onRootClick.bind(this);
    this.cleanups = [];
    this.isConnectedComponent = false;
    this.currentIndex = 0;
  }

  connectedCallback() {
    if (this.isConnectedComponent) return;
    this.isConnectedComponent = true;
    this.init();
    document.addEventListener('shopify:block:select', this.handleBlockSelect);
    document.addEventListener('shopify:block:deselect', this.handleBlockDeselect);
    document.addEventListener('shopify:section:load', this.handleSectionLoad);
  }

  disconnectedCallback() {
    this.isConnectedComponent = false;
    this.destroy();
    document.removeEventListener('shopify:block:select', this.handleBlockSelect);
    document.removeEventListener('shopify:block:deselect', this.handleBlockDeselect);
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

    this.stage = this.querySelector('.hp-hero-stage');
    this.slides = Array.from(this.querySelectorAll('[data-hero-slide]'));
    this.dots = Array.from(this.querySelectorAll('[data-hero-dot]'));
    this.prevBtn = this.querySelector('[data-hero-prev]');
    this.nextBtn = this.querySelector('[data-hero-next]');
    this.targetLabel = this.querySelector('[data-hero-target]');
    this.dotsContainer = this.querySelector('.hp-hero-dots');

    if (!this.slides.length) return;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', this.onPrevClick);
      this.cleanups.push(() => this.prevBtn.removeEventListener('click', this.onPrevClick));
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', this.onNextClick);
      this.cleanups.push(() => this.nextBtn.removeEventListener('click', this.onNextClick));
    }

    if (this.dotsContainer) {
      this.dotsContainer.addEventListener('click', this.onDotsClick);
      this.cleanups.push(() => this.dotsContainer.removeEventListener('click', this.onDotsClick));
    }

    this.addEventListener('click', this.onRootClick);
    this.cleanups.push(() => this.removeEventListener('click', this.onRootClick));

    this.goToSlide(0);
    if (this.stage) {
      this.stage.setAttribute('data-slider-ready', 'true');
    }
  }

  refreshElements() {
    this.slides = Array.from(this.querySelectorAll('[data-hero-slide]'));
    this.dots = Array.from(this.querySelectorAll('[data-hero-dot]'));
  }

  closeAllHotspots() {
    this.querySelectorAll('.hp-hotspot').forEach((spot) => spot.classList.remove('is-active'));
  }

  goToSlide(index) {
    this.refreshElements();
    if (!this.slides.length) return;

    let targetIdx = index;
    if (targetIdx < 0) targetIdx = this.slides.length - 1;
    if (targetIdx >= this.slides.length) targetIdx = 0;
    this.currentIndex = targetIdx;

    this.closeAllHotspots();

    this.slides.forEach((slide, i) => {
      const isCurrent = i === this.currentIndex;
      slide.classList.toggle('is-active', isCurrent);
      if (isCurrent) {
        const label = slide.getAttribute('data-appliance-label');
        if (this.targetLabel && label) {
          this.targetLabel.textContent = label;
        }
      }
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === this.currentIndex);
    });
  }

  onPrevClick(e) {
    e.preventDefault();
    this.goToSlide(this.currentIndex - 1);
  }

  onNextClick(e) {
    e.preventDefault();
    this.goToSlide(this.currentIndex + 1);
  }

  onDotsClick(e) {
    const dot = e.target.closest('[data-hero-dot]');
    if (!dot || !this.dotsContainer) return;
    e.preventDefault();
    const dotsArray = Array.from(this.dotsContainer.querySelectorAll('[data-hero-dot]'));
    const index = dotsArray.indexOf(dot);
    if (index >= 0) {
      this.goToSlide(index);
    }
  }

  onRootClick(e) {
    const pin = e.target.closest('.hp-hotspot-pin');
    if (pin) {
      e.preventDefault();
      e.stopPropagation();
      const spot = pin.closest('.hp-hotspot');
      if (!spot) return;
      const wasActive = spot.classList.contains('is-active');
      this.closeAllHotspots();
      if (!wasActive) {
        spot.classList.add('is-active');
      }
      return;
    }

    if (!e.target.closest('.hp-hotspot-card')) {
      this.closeAllHotspots();
    }
  }

  handleBlockSelect(e) {
    const target = e.target;
    if (!target || !this.contains(target)) return;

    const heroSlide = target.closest ? target.closest('[data-hero-slide]') : null;
    const hotspot = target.closest ? target.closest('.hp-hotspot') : null;

    if (hotspot) {
      const parentSlide = hotspot.closest('[data-hero-slide]');
      if (parentSlide && this.slides) {
        const slideIdx = this.slides.indexOf(parentSlide);
        if (slideIdx >= 0) {
          this.goToSlide(slideIdx);
        }
        hotspot.classList.add('is-active');
      }
      return;
    }

    if (heroSlide && this.slides) {
      const slideIdx = this.slides.indexOf(heroSlide);
      if (slideIdx >= 0) {
        this.goToSlide(slideIdx);
      }
    }
  }

  handleBlockDeselect(e) {
    const target = e.target;
    if (!target || !this.contains(target)) return;
    const hotspot = target.closest ? target.closest('.hp-hotspot') : null;
    if (hotspot) {
      hotspot.classList.remove('is-active');
    }
  }

  handleSectionLoad(e) {
    const section = e.target;
    if (section === this || (section && typeof section.contains === 'function' && section.contains(this))) {
      this.init();
    }
  }
}

if (!customElements.get('homepage-hero')) {
  customElements.define('homepage-hero', HomepageHero);
}

class HomepagePartsByType extends HTMLElement {
  constructor() {
    super();
    this.handleSectionLoad = this.handleSectionLoad.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.cleanups = [];
    this.isConnectedComponent = false;
  }

  connectedCallback() {
    if (this.isConnectedComponent) return;
    this.isConnectedComponent = true;
    this.init();
    document.addEventListener('shopify:section:load', this.handleSectionLoad);
  }

  disconnectedCallback() {
    this.isConnectedComponent = false;
    this.destroy();
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

    this.grid = this.querySelector('[data-hp-type-grid]');
    this.dots = Array.from(this.querySelectorAll('[data-hp-type-dot]'));
    if (!this.grid || !this.dots.length) return;

    this.grid.addEventListener('scroll', this.onScroll, { passive: true });
    this.cleanups.push(() => this.grid.removeEventListener('scroll', this.onScroll));

    this.dots.forEach((dot) => {
      const onDotClick = (e) => {
        e.preventDefault();
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        const targetScroll = idx === 0 ? 0 : (this.grid.scrollWidth - this.grid.clientWidth);
        this.grid.scrollTo({ left: targetScroll, behavior: 'smooth' });
      };
      dot.addEventListener('click', onDotClick);
      this.cleanups.push(() => dot.removeEventListener('click', onDotClick));
    });
  }

  onScroll() {
    if (!this.grid || !this.dots) return;
    const isPage2 = this.grid.scrollLeft > (this.grid.scrollWidth - this.grid.clientWidth) * 0.35;
    const activeIndex = isPage2 ? 1 : 0;
    this.dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIndex);
    });
  }

  handleSectionLoad(e) {
    const section = e.target;
    if (section === this || (section && typeof section.contains === 'function' && section.contains(this))) {
      this.init();
    }
  }
}

if (!customElements.get('homepage-parts-by-type')) {
  customElements.define('homepage-parts-by-type', HomepagePartsByType);
}

function initErrorCodeLookup(context = document) {
  const ecForm = context.querySelector('[data-ec-form]');
  const ecInput = context.querySelector('[data-ec-input]');
  const ecResult = context.querySelector('[data-ec-result]');

  if (!ecForm || !ecInput || ecForm.dataset.ecInit) return;
  ecForm.dataset.ecInit = 'true';

  ecForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = ecInput.value.trim().toUpperCase();
    if (!query) return;

    if (ecResult) {
      ecResult.style.display = 'block';
      const codeSpan = ecResult.querySelector('[data-ec-code]');
      if (codeSpan) codeSpan.textContent = query;
    }
  });
}

function initPartsTypeTabs(context = document) {
  const typeTabs = context.querySelectorAll('[data-type-tab]');
  typeTabs.forEach((tab) => {
    if (tab.dataset.tabInit) return;
    tab.dataset.tabInit = 'true';

    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = tab.getAttribute('data-type-tab');

      typeTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const items = context.querySelectorAll('[data-type-item]');
      items.forEach((item) => {
        if (cat === 'all' || item.getAttribute('data-type-cat') === cat) {
          item.style.display = 'flex';
        }
        if (cat !== 'all' && item.getAttribute('data-type-cat') !== cat) {
          item.style.display = 'none';
        }
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initErrorCodeLookup();
    initPartsTypeTabs();
  });
}
if (document.readyState !== 'loading') {
  initErrorCodeLookup();
  initPartsTypeTabs();
}
