/**
 * Homepage Parts Experience Slider Section JavaScript
 * Implements 3D stacked card deck sliding and text synchronization
 * Matches Figma Desktop & Mobile specifications and Homepage 01-dc.html logic
 */

(function () {
  'use strict';

  function initPartsSliders() {
    const sections = document.querySelectorAll('.hp-parts-slider');
    if (!sections.length) return;

    sections.forEach((section) => {
      if (section.dataset.initialized === 'true') return;
      section.dataset.initialized = 'true';

      const cards = Array.from(section.querySelectorAll('.hp-ps-card'));
      const N = cards.length;
      if (N === 0) return;

      const titleEl = section.querySelector('.hp-ps-title');
      const bodyEl = section.querySelector('.hp-ps-body');
      const ctaEl = section.querySelector('.hp-ps-cta');
      const desktopDots = Array.from(section.querySelectorAll('.hp-ps-dots--desktop .hp-ps-dot'));
      const mobileDots = Array.from(section.querySelectorAll('.hp-ps-mobile-controls .hp-ps-dot'));
      const prevButtons = Array.from(section.querySelectorAll('.hp-ps-arrow--prev'));
      const nextButtons = Array.from(section.querySelectorAll('.hp-ps-arrow--next'));
      const deck = section.querySelector('.hp-ps-deck');

      let currentIndex = 0;

      function updateStack(index) {
        currentIndex = ((index % N) + N) % N;
        const isSmall = window.innerWidth < 990;
        const mult = isSmall ? 3.5 : 7.0;

        // 1. Calculate & apply 3D transforms to cards
        cards.forEach((card, i) => {
          let d = i - currentIndex;
          if (d > Math.floor(N / 2)) d -= N;
          if (d < -Math.floor(N / 2)) d += N;

          const isNow = d === 0;
          const a = Math.abs(d);

          const tf = isNow
            ? 'translateX(0) scale(1) rotate(0deg)'
            : `translateX(${(d * mult).toFixed(1)}%) scale(${(1 - a * 0.055).toFixed(3)}) rotate(${(d * 1.8).toFixed(1)}deg)`;
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

        // 2. Update Dots
        desktopDots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === currentIndex);
          dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
        });

        mobileDots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === currentIndex);
          dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
        });

        // 3. Update Text Content with subtle fade
        const activeCard = cards[currentIndex];
        if (activeCard) {
          const newTitle = activeCard.dataset.title;
          const newBody = activeCard.dataset.body;
          const newCta = activeCard.dataset.cta;
          const newUrl = activeCard.dataset.url;

          if (titleEl && newTitle && titleEl.textContent !== newTitle) {
            titleEl.style.opacity = '0';
            setTimeout(() => {
              titleEl.textContent = newTitle;
              titleEl.style.opacity = '1';
            }, 120);
          }

          if (bodyEl && newBody && bodyEl.textContent !== newBody) {
            bodyEl.style.opacity = '0';
            setTimeout(() => {
              bodyEl.textContent = newBody;
              bodyEl.style.opacity = '1';
            }, 120);
          }

          if (ctaEl) {
            if (newCta) {
              const svg = ctaEl.querySelector('svg');
              ctaEl.textContent = newCta + ' ';
              if (svg) {
                ctaEl.appendChild(svg);
              } else {
                ctaEl.insertAdjacentHTML(
                  'beforeend',
                  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;"><path d="M4 12h15"></path><path d="m13 6 6 6-6 6"></path></svg>'
                );
              }
            }
            if (newUrl) {
              ctaEl.href = newUrl;
            }
          }
        }
      }

      // Card click event
      cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          if (i !== currentIndex) {
            updateStack(i);
          }
        });
      });

      // Prev & Next buttons
      prevButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          updateStack(currentIndex - 1);
        });
      });

      nextButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          updateStack(currentIndex + 1);
        });
      });

      // Pagination dots click
      desktopDots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          updateStack(i);
        });
      });

      mobileDots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          updateStack(i);
        });
      });

      // Touch Swipe handling on the card deck
      if (deck) {
        let touchStartX = 0;
        let touchEndX = 0;

        deck.addEventListener(
          'touchstart',
          (e) => {
            touchStartX = e.changedTouches[0].screenX;
          },
          { passive: true }
        );

        deck.addEventListener(
          'touchend',
          (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 40) {
              if (diffX < 0) {
                updateStack(currentIndex + 1); // Swipe left
              } else {
                updateStack(currentIndex - 1); // Swipe right
              }
            }
          },
          { passive: true }
        );
      }

      // Handle screen resize smoothly
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          updateStack(currentIndex);
        }, 150);
      });

      // Initial layout update
      updateStack(0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPartsSliders);
  } else {
    initPartsSliders();
  }

  // Shopify Theme Editor support
  document.addEventListener('shopify:section:load', (e) => {
    if (e.target.classList.contains('section-homepage-parts-slider') || e.target.querySelector('.hp-parts-slider')) {
      initPartsSliders();
    }
  });

  document.addEventListener('shopify:block:select', (e) => {
    const block = e.target;
    const card = block.classList.contains('hp-ps-card') ? block : block.querySelector('.hp-ps-card');
    if (card) {
      card.click();
    }
  });
})();
