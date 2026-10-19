class HomepagePartsSlider extends HTMLElement {
  constructor() {
    super();
    this.handleBlockSelect = this.handleBlockSelect.bind(this);
    this.handleSectionLoad = this.handleSectionLoad.bind(this);
    this.onResize = this.onResize.bind(this);
    this.cleanups = [];
    this.isConnectedComponent = false;
    this.currentIndex = 0;
    this.resizeTimeout = null;
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
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
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

    this.cards = Array.from(this.querySelectorAll('.hp-ps-card'));
    const N = this.cards.length;
    if (N === 0) return;

    this.titleEl = this.querySelector('.hp-ps-title');
    this.bodyEl = this.querySelector('.hp-ps-body');
    this.ctaEl = this.querySelector('.hp-ps-cta');
    this.desktopDots = Array.from(this.querySelectorAll('.hp-ps-dots--desktop .hp-ps-dot'));
    this.mobileDots = Array.from(this.querySelectorAll('.hp-ps-mobile-controls .hp-ps-dot'));
    this.prevButtons = Array.from(this.querySelectorAll('.hp-ps-arrow--prev'));
    this.nextButtons = Array.from(this.querySelectorAll('.hp-ps-arrow--next'));
    this.deck = this.querySelector('.hp-ps-deck');

    this.cards.forEach((card, i) => {
      const onCardClick = (e) => {
        e.preventDefault();
        if (i !== this.currentIndex) {
          this.updateStack(i);
        }
      };
      card.addEventListener('click', onCardClick);
      this.cleanups.push(() => card.removeEventListener('click', onCardClick));
    });

    this.prevButtons.forEach((btn) => {
      const onPrevClick = (e) => {
        e.preventDefault();
        this.updateStack(this.currentIndex - 1);
      };
      btn.addEventListener('click', onPrevClick);
      this.cleanups.push(() => btn.removeEventListener('click', onPrevClick));
    });

    this.nextButtons.forEach((btn) => {
      const onNextClick = (e) => {
        e.preventDefault();
        this.updateStack(this.currentIndex + 1);
      };
      btn.addEventListener('click', onNextClick);
      this.cleanups.push(() => btn.removeEventListener('click', onNextClick));
    });

    this.desktopDots.forEach((dot, i) => {
      const onDotClick = (e) => {
        e.preventDefault();
        this.updateStack(i);
      };
      dot.addEventListener('click', onDotClick);
      this.cleanups.push(() => dot.removeEventListener('click', onDotClick));
    });

    this.mobileDots.forEach((dot, i) => {
      const onDotClick = (e) => {
        e.preventDefault();
        this.updateStack(i);
      };
      dot.addEventListener('click', onDotClick);
      this.cleanups.push(() => dot.removeEventListener('click', onDotClick));
    });

    if (this.deck) {
      let touchStartX = 0;
      let touchEndX = 0;

      const onTouchStart = (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
        }
      };

      const onTouchEnd = (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchEndX = e.changedTouches[0].screenX;
          const diffX = touchEndX - touchStartX;
          if (Math.abs(diffX) > 40) {
            if (diffX < 0) {
              this.updateStack(this.currentIndex + 1);
            }
            if (diffX > 0) {
              this.updateStack(this.currentIndex - 1);
            }
          }
        }
      };

      this.deck.addEventListener('touchstart', onTouchStart, { passive: true });
      this.deck.addEventListener('touchend', onTouchEnd, { passive: true });
      this.cleanups.push(() => {
        this.deck.removeEventListener('touchstart', onTouchStart);
        this.deck.removeEventListener('touchend', onTouchEnd);
      });
    }

    window.addEventListener('resize', this.onResize);
    this.cleanups.push(() => window.removeEventListener('resize', this.onResize));

    this.updateStack(0);
  }

  onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.updateStack(this.currentIndex);
    }, 150);
  }

  updateStack(index) {
    if (!this.cards || !this.cards.length) return;
    const N = this.cards.length;
    this.currentIndex = ((index % N) + N) % N;
    const isSmall = window.innerWidth < 990;
    const mult = isSmall ? 3.5 : 7.0;

    this.cards.forEach((card, i) => {
      let d = i - this.currentIndex;
      if (d > Math.floor(N / 2)) d -= N;
      if (d < -Math.floor(N / 2)) d += N;

      const isNow = d === 0;
      const a = Math.abs(d);

      const tf = isNow
        ? 'translateX(0) scale(1) rotate(0deg)'
        : 'translateX(' + (d * mult).toFixed(1) + '%) scale(' + (1 - a * 0.055).toFixed(3) + ') rotate(' + (d * 1.8).toFixed(1) + 'deg)';
      const op = isNow ? 1 : Math.max(0.45, 1 - a * 0.16);
      const z = 20 - a;
      const shadow = isNow ? '0 18px 44px rgba(17, 24, 39, 0.16)' : '0 10px 26px rgba(17, 24, 39, 0.10)';

      card.style.transform = tf;
      card.style.opacity = op;
      card.style.zIndex = z;
      card.style.boxShadow = shadow;
      card.setAttribute('aria-hidden', isNow ? 'false' : 'true');
      card.classList.toggle('is-active', isNow);
    });

    if (this.desktopDots) {
      this.desktopDots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === this.currentIndex);
        dot.setAttribute('aria-selected', i === this.currentIndex ? 'true' : 'false');
      });
    }

    if (this.mobileDots) {
      this.mobileDots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === this.currentIndex);
        dot.setAttribute('aria-selected', i === this.currentIndex ? 'true' : 'false');
      });
    }

    const activeCard = this.cards[this.currentIndex];
    if (activeCard) {
      const newTitle = activeCard.dataset.title;
      const newBody = activeCard.dataset.body;
      const newCta = activeCard.dataset.cta;
      const newUrl = activeCard.dataset.url;

      if (this.titleEl && newTitle && this.titleEl.textContent !== newTitle) {
        this.titleEl.style.opacity = '0';
        setTimeout(() => {
          this.titleEl.textContent = newTitle;
          this.titleEl.style.opacity = '1';
        }, 120);
      }

      if (this.bodyEl && newBody && this.bodyEl.textContent !== newBody) {
        this.bodyEl.style.opacity = '0';
        setTimeout(() => {
          this.bodyEl.textContent = newBody;
          this.bodyEl.style.opacity = '1';
        }, 120);
      }

      if (this.ctaEl) {
        if (newCta) {
          const svg = this.ctaEl.querySelector('svg');
          this.ctaEl.textContent = newCta + ' ';
          if (svg) {
            this.ctaEl.appendChild(svg);
          }
          if (!svg) {
            this.ctaEl.insertAdjacentHTML(
              'beforeend',
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;"><path d="M4 12h15"></path><path d="m13 6 6 6-6 6"></path></svg>'
            );
          }
        }
        if (newUrl) {
          this.ctaEl.href = newUrl;
        }
      }
    }
  }

  handleBlockSelect(e) {
    const block = e.target;
    if (!block || !this.contains(block)) return;

    const card = block.classList.contains('hp-ps-card') ? block : block.querySelector('.hp-ps-card');
    if (card && this.cards) {
      const idx = this.cards.indexOf(card);
      if (idx >= 0) {
        this.updateStack(idx);
      }
    }
  }

  handleSectionLoad(e) {
    const section = e.target;
    if (section === this || (section && typeof section.contains === 'function' && section.contains(this))) {
      this.init();
    }
  }
}

if (!customElements.get('homepage-parts-slider')) {
  customElements.define('homepage-parts-slider', HomepagePartsSlider);
}
