/**
 * Homepage How It Works (3 Steps) Interactive Script - Panasonic OS 2.0 Theme
 * Controls mobile swipe rail scroll snapping and pagination dot synchronization
 */

function initHomepageSteps() {
  const track = document.querySelector('[data-steps-track]');
  const dots = document.querySelectorAll('[data-steps-dot]');
  if (!track || !dots.length) return;

  function updateActiveDot() {
    const cards = track.querySelectorAll('.hp-step-card');
    if (!cards.length) return;

    const scrollLeft = track.scrollLeft;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 32; // card gap + arrow width approximate pitch
    const pitch = cardWidth + gap;

    const activeIndex = Math.max(0, Math.min(dots.length - 1, Math.round(scrollLeft / pitch)));

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIndex);
    });
  }

  track.addEventListener('scroll', updateActiveDot, { passive: true });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      const cards = track.querySelectorAll('.hp-step-card');
      if (cards[idx]) {
        cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initHomepageSteps);
document.addEventListener('shopify:section:load', (e) => {
  if (e.target.classList.contains('section-homepage-how-it-works') || e.target.querySelector('[data-steps-track]')) {
    initHomepageSteps();
  }
});
