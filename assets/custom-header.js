/**
 * Custom Header Web Component
 * Panasonic Header Prototype - Shopify OS 2.0 Integration
 */

if (!customElements.get('custom-header')) {
  class CustomHeader extends HTMLElement {
    constructor() {
      super();
      this.closeMenuTimer = null;
      this.currentLvl = 0;
    }

    connectedCallback() {
      this.initDesktopMenu();
      this.initMobileNav();
      this.initMobileSearch();
      this.initAccessibility();
    }

    /* -----------------------------------------------------------------
     * Desktop Mega Menu Interaction
     * ----------------------------------------------------------------- */
    initDesktopMenu() {
      const menuTriggers = this.querySelectorAll('[data-mega-trigger]');
      const megaPanel = this.querySelector('[data-mega-panel]');

      if (!megaPanel) return;

      const openMenu = (trigger) => {
        clearTimeout(this.closeMenuTimer);
        this.setAttribute('data-menu-open', 'true');
        menuTriggers.forEach(t => t.setAttribute('aria-expanded', 'true'));
      };

      const closeMenu = () => {
        clearTimeout(this.closeMenuTimer);
        this.closeMenuTimer = setTimeout(() => {
          this.removeAttribute('data-menu-open');
          menuTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
          // Reset active views to default promo
          this.setActiveCat(null);
          this.setActiveSubcat(null);
        }, 150);
      };

      menuTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => openMenu(trigger));
        trigger.addEventListener('focus', () => openMenu(trigger));
        trigger.addEventListener('mouseleave', closeMenu);
      });

      megaPanel.addEventListener('mouseenter', () => clearTimeout(this.closeMenuTimer));
      megaPanel.addEventListener('mouseleave', closeMenu);

      // Desktop Category Hovers
      const catItems = this.querySelectorAll('[data-cat-item]');
      catItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const cat = item.getAttribute('data-cat-item');
          this.setActiveCat(cat);
        });
        item.addEventListener('focus', () => {
          const cat = item.getAttribute('data-cat-item');
          this.setActiveCat(cat);
        });
      });

      // Desktop Subcategory Hovers
      const subcatItems = this.querySelectorAll('[data-subcat-item]');
      subcatItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const subcat = item.getAttribute('data-subcat-item');
          this.setActiveSubcat(subcat);
        });
        item.addEventListener('focus', () => {
          const subcat = item.getAttribute('data-subcat-item');
          this.setActiveSubcat(subcat);
        });
      });
    }

    setActiveCat(catName) {
      const catViews = this.querySelectorAll('[data-cat-view]');
      const promoView = this.querySelector('[data-promo-view="main"]');

      catViews.forEach(view => {
        if (view.getAttribute('data-cat-view') === catName) {
          view.style.display = 'flex';
        } else {
          view.style.display = 'none';
        }
      });

      if (promoView) {
        promoView.style.display = catName ? 'none' : 'block';
      }
    }

    setActiveSubcat(subcatName) {
      const subcatViews = this.querySelectorAll('[data-subcat-view]');
      subcatViews.forEach(view => {
        if (view.getAttribute('data-subcat-view') === subcatName) {
          view.style.display = 'flex';
        } else {
          view.style.display = 'none';
        }
      });
    }

    /* -----------------------------------------------------------------
     * Mobile Navigation & Drill-Down
     * ----------------------------------------------------------------- */
    initMobileNav() {
      const navToggle = this.querySelector('[data-mobile-nav-toggle]');
      const navDrawer = this.querySelector('[data-mobile-nav-drawer]');

      if (!navToggle || !navDrawer) return;

      navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = this.getAttribute('data-mobile-nav-open') === 'true';
        if (isOpen) {
          this.closeMobileNav();
        } else {
          this.openMobileNav();
        }
      });

      // Drill-down navigation triggers
      const drillTriggers = this.querySelectorAll('[data-mobile-drill]');
      drillTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetLvl = parseInt(btn.getAttribute('data-mobile-drill'), 10);
          const cat = btn.getAttribute('data-mobile-cat');
          const subcat = btn.getAttribute('data-mobile-subcat');
          this.setMobileLevel(targetLvl, cat, subcat);
        });
      });

      // Back buttons
      const backButtons = this.querySelectorAll('[data-mobile-back]');
      backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const backTo = parseInt(btn.getAttribute('data-mobile-back'), 10);
          this.setMobileLevel(backTo);
        });
      });
    }

    openMobileNav() {
      this.setAttribute('data-mobile-nav-open', 'true');
      this.removeAttribute('data-mobile-search-open');
      const toggle = this.querySelector('[data-mobile-nav-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      this.setMobileLevel(0);
      document.body.style.overflow = 'hidden';
    }

    closeMobileNav() {
      this.removeAttribute('data-mobile-nav-open');
      const toggle = this.querySelector('[data-mobile-nav-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    setMobileLevel(lvl, cat = null, subcat = null) {
      this.currentLvl = lvl;
      const lvlBlocks = this.querySelectorAll('[data-mobile-lvl]');
      lvlBlocks.forEach(block => {
        const blockLvl = parseInt(block.getAttribute('data-mobile-lvl'), 10);
        if (blockLvl === lvl) {
          block.style.display = 'block';
        } else {
          block.style.display = 'none';
        }
      });

      if (cat) {
        const mobileCatViews = this.querySelectorAll('[data-mobile-cat-view]');
        mobileCatViews.forEach(v => {
          v.style.display = (v.getAttribute('data-mobile-cat-view') === cat) ? 'block' : 'none';
        });
      }

      if (subcat) {
        const mobileSubcatViews = this.querySelectorAll('[data-mobile-subcat-view]');
        mobileSubcatViews.forEach(v => {
          v.style.display = (v.getAttribute('data-mobile-subcat-view') === subcat) ? 'block' : 'none';
        });
      }
    }

    /* -----------------------------------------------------------------
     * Mobile Search Bar Toggle
     * ----------------------------------------------------------------- */
    initMobileSearch() {
      const searchToggle = this.querySelector('[data-mobile-search-toggle]');
      const searchInput = this.querySelector('[data-mobile-search-input]');

      if (!searchToggle) return;

      searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = this.getAttribute('data-mobile-search-open') === 'true';
        if (isOpen) {
          this.removeAttribute('data-mobile-search-open');
        } else {
          this.closeMobileNav();
          this.setAttribute('data-mobile-search-open', 'true');
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
          }
        }
      });
    }

    /* -----------------------------------------------------------------
     * Keyboard & ARIA Accessibility
     * ----------------------------------------------------------------- */
    initAccessibility() {
      // Escape key to close all overlays
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.removeAttribute('data-menu-open');
          this.closeMobileNav();
          this.removeAttribute('data-mobile-search-open');
        }
      });
    }
  }

  customElements.define('custom-header', CustomHeader);
}
