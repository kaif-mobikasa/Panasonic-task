/**
 * Homepage Popular Parts & Accessories Interactive Script - Panasonic OS 2.0 Theme
 * Controls category tab filtering, carousel scroll navigation, arrow visibility conditions, and wishlist toggles
 */

function initHomepageProducts() {
  const sections = document.querySelectorAll('.hp-products');
  sections.forEach(section => {
    const tabs = section.querySelectorAll('[data-prod-tab]');
    const track = section.querySelector('[data-products-track]');
    const cards = section.querySelectorAll('.hp-product-card');
    const prevBtn = section.querySelector('[data-prod-prev]');
    const nextBtn = section.querySelector('[data-prod-next]');

    /**
     * Update arrow visibility:
     * - Prev button ONLY shows if there is scroll space on the left (scrollLeft > 10)
     * - Next button ONLY shows if there is scroll space on the right (scrollLeft < maxScroll - 10)
     */
    function updateArrowVisibility() {
      if (!track) return;
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (prevBtn) {
        if (scrollLeft > 10) {
          prevBtn.style.display = 'inline-flex';
        } else {
          prevBtn.style.display = 'none';
        }
      }

      if (nextBtn) {
        if (maxScroll > 10 && scrollLeft < maxScroll - 10) {
          nextBtn.style.display = 'inline-flex';
        } else if (maxScroll <= 10) {
          nextBtn.style.display = 'none';
        } else {
          nextBtn.style.display = 'none';
        }
      }
    }

    // Category Tabs Filtering
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const category = tab.getAttribute('data-prod-tab');

        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category || cardCat === 'all') {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });

        if (track) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
          setTimeout(updateArrowVisibility, 200);
        }
      });
    });

    // Prev / Next Scroll Navigation
    if (track) {
      track.addEventListener('scroll', updateArrowVisibility, { passive: true });
      window.addEventListener('resize', updateArrowVisibility);

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const firstCard = track.querySelector('.hp-product-card:not(.is-hidden)');
          const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 20 : 300;
          track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
          setTimeout(updateArrowVisibility, 350);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const firstCard = track.querySelector('.hp-product-card:not(.is-hidden)');
          const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 20 : 300;
          track.scrollBy({ left: cardWidth, behavior: 'smooth' });
          setTimeout(updateArrowVisibility, 350);
        });
      }

      // Initial checks
      updateArrowVisibility();
      setTimeout(updateArrowVisibility, 200);
      setTimeout(updateArrowVisibility, 600);
    }

    // Wishlist Toggle
    const wishButtons = section.querySelectorAll('[data-wishlist-btn]');
    wishButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('is-active');
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initHomepageProducts);
document.addEventListener('shopify:section:load', (e) => {
  if (e.target.classList.contains('section-homepage-featured-products') || e.target.querySelector('.hp-products')) {
    initHomepageProducts();
  }
});
