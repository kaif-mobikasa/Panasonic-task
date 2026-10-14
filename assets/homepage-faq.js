/**
 * Homepage FAQ Accordion Interactive Script
 * Handles toggle animations, accessibility, and theme customizer reloading
 */

function initHomepageFaq(context = document) {
  const faqSections = context.querySelectorAll('.hp-faq-section');
  if (!faqSections.length) return;

  faqSections.forEach((section) => {
    const faqButtons = section.querySelectorAll('[data-faq-toggle]');

    faqButtons.forEach((btn) => {
      // Prevent duplicate listener binding
      if (btn.dataset.faqInitialized === 'true') return;
      btn.dataset.faqInitialized = 'true';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.closest('.hp-faq-item');
        if (!item) return;

        const isOpen = item.classList.contains('is-open');

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
  });
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initHomepageFaq());
} else {
  initHomepageFaq();
}

// Support Shopify Theme Editor dynamic section reloads
document.addEventListener('shopify:section:load', (event) => {
  if (event.target && event.target.querySelector('.hp-faq-section')) {
    initHomepageFaq(event.target);
  }
});
