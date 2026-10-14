/**
 * Homepage Sections Interactive Script - Panasonic Shopify OS 2.0 Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initFaqAccordions();
  initSpaceHotspots();
  initErrorCodeLookup();
  initPartsTypeTabs();
  initPartsTypeSlider();
});

/* --------------------------------------------------------------------------
   Hero Slider & Interactive Hotspots
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slider = document.querySelector('[data-hero-slider]');
  if (!slider) return;

  const slides = slider.querySelectorAll('[data-hero-slide]');
  const dots = slider.querySelectorAll('[data-hero-dot]');
  const prevBtn = slider.querySelector('[data-hero-prev]');
  const nextBtn = slider.querySelector('[data-hero-next]');
  const targetLabel = slider.querySelector('[data-hero-target]');

  if (!slides.length) return;

  let currentIndex = 0;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('is-active');
        const label = slide.getAttribute('data-appliance-label');
        if (targetLabel && label) {
          targetLabel.textContent = label;
        }
      } else {
        slide.classList.remove('is-active');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(i);
    });
  });

  // Hotspot Click / Toggle Behavior
  const hotspots = slider.querySelectorAll('.hp-hotspot');
  hotspots.forEach(spot => {
    const pin = spot.querySelector('.hp-hotspot-pin');
    if (!pin) return;

    pin.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isActive = spot.classList.contains('is-active');
      hotspots.forEach(s => s.classList.remove('is-active'));
      if (!isActive) {
        spot.classList.add('is-active');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hp-hotspot')) {
      hotspots.forEach(s => s.classList.remove('is-active'));
    }
  });
}

/* --------------------------------------------------------------------------
   FAQ Accordions
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const faqButtons = document.querySelectorAll('[data-faq-toggle]');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.closest('.hp-faq-item');
      if (!item) return;

      const isOpen = item.classList.contains('is-open');

      // Close other items if desired or keep toggling
      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Shop By Space Hotspots
   -------------------------------------------------------------------------- */
function initSpaceHotspots() {
  const pins = document.querySelectorAll('[data-space-pin]');
  pins.forEach(pin => {
    const togglePin = (e) => {
      e.preventDefault();
      const pinId = pin.getAttribute('data-space-pin');
      const popCard = document.querySelector(`[data-space-pop="${pinId}"]`);

      // Deactivate other pins in this section
      const parentStage = pin.closest('.hp-space-stage');
      if (parentStage) {
        parentStage.querySelectorAll('.hp-space-pin').forEach(p => {
          if (p !== pin) p.classList.remove('is-active');
        });
        parentStage.querySelectorAll('.hp-space-card-pop').forEach(c => {
          if (c !== popCard) c.classList.remove('is-open');
        });
      }

      pin.classList.toggle('is-active');
      if (popCard) popCard.classList.toggle('is-open');
    };

    pin.addEventListener('click', togglePin);
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') togglePin(e);
    });
  });

  // Close hotspots when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hp-space-pin') && !e.target.closest('.hp-space-card-pop')) {
      document.querySelectorAll('.hp-space-pin').forEach(p => p.classList.remove('is-active'));
      document.querySelectorAll('.hp-space-card-pop').forEach(c => c.classList.remove('is-open'));
    }
  });
}

/* --------------------------------------------------------------------------
   Error Code Lookup Tool
   -------------------------------------------------------------------------- */
function initErrorCodeLookup() {
  const ecForm = document.querySelector('[data-ec-form]');
  const ecInput = document.querySelector('[data-ec-input]');
  const ecResult = document.querySelector('[data-ec-result]');

  if (!ecForm || !ecInput) return;

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

/* --------------------------------------------------------------------------
   Shop Parts By Type Tabs
   -------------------------------------------------------------------------- */
function initPartsTypeTabs() {
  const typeTabs = document.querySelectorAll('[data-type-tab]');
  typeTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = tab.getAttribute('data-type-tab');

      typeTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const items = document.querySelectorAll('[data-type-item]');
      items.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-type-cat') === cat) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Parts By Type Mobile Dots & Scroll Sync
   -------------------------------------------------------------------------- */
function initPartsTypeSlider() {
  const grid = document.querySelector('[data-hp-type-grid]');
  const dots = document.querySelectorAll('[data-hp-type-dot]');
  if (!grid || !dots.length) return;

  grid.addEventListener('scroll', () => {
    const isPage2 = grid.scrollLeft > (grid.scrollWidth - grid.clientWidth) * 0.35;
    const activeIndex = isPage2 ? 1 : 0;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIndex);
    });
  }, { passive: true });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      const targetScroll = idx === 0 ? 0 : (grid.scrollWidth - grid.clientWidth);
      grid.scrollTo({ left: targetScroll, behavior: 'smooth' });
    });
  });
}
