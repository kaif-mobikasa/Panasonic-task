class AboutTimeline extends HTMLElement {
  constructor() {
    super();
    this.handleBlockSelect = this.handleBlockSelect.bind(this);
    this.handleSectionLoad = this.handleSectionLoad.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.cleanups = [];
    this.isConnectedComponent = false;
    this.timer = null;
    this.currentIndex = 0;
    this.isPaused = false;
    this.startTime = 0;
    this.remainingTime = 0;
    this.duration = 6000;
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
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (Array.isArray(this.cleanups)) {
      this.cleanups.forEach((cleanup) => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    }
    this.cleanups = [];
    this.resetBars();
  }

  init() {
    this.destroy();

    this.tabs = Array.from(this.querySelectorAll('.about-timeline-tab'));
    this.panels = Array.from(this.querySelectorAll('.about-timeline-panel-item'));
    if (!this.tabs.length || !this.panels.length) return;

    this.duration = parseInt(this.dataset.duration || '6000', 10);
    this.pauseOnHover = this.dataset.pauseHover === 'true';
    this.remainingTime = this.duration;
    this.isPaused = false;

    this.tabs.forEach((tab, idx) => {
      const onTabClick = (e) => {
        e.preventDefault();
        this.activate(idx, 0);
      };
      tab.addEventListener('click', onTabClick);
      this.cleanups.push(() => tab.removeEventListener('click', onTabClick));
    });

    if (this.pauseOnHover) {
      this.addEventListener('mouseenter', this.pause);
      this.addEventListener('mouseleave', this.resume);
      this.cleanups.push(() => {
        this.removeEventListener('mouseenter', this.pause);
        this.removeEventListener('mouseleave', this.resume);
      });
    }

    this.activate(0, 0);
  }

  resetBars() {
    if (!this.tabs) return;
    this.tabs.forEach((tab) => {
      const bar = tab.querySelector('.about-timeline-progress-bar');
      if (bar) {
        bar.style.transition = 'none';
        bar.style.width = '0%';
      }
    });
  }

  activate(index, startWidthRatio) {
    if (!this.tabs || !this.tabs.length) return;
    if (index < 0 || index >= this.tabs.length) index = 0;
    this.currentIndex = index;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.resetBars();

    this.tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    this.panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    const activeTab = this.tabs[index];
    const activeBar = activeTab ? activeTab.querySelector('.about-timeline-progress-bar') : null;

    const initialRatio = typeof startWidthRatio === 'number' ? startWidthRatio : 0;
    const timeLeft = this.duration * (1 - initialRatio);
    this.remainingTime = timeLeft;
    this.startTime = Date.now();

    if (activeBar) {
      activeBar.style.transition = 'none';
      activeBar.style.width = (initialRatio * 100) + '%';
      void activeBar.offsetWidth;
      activeBar.style.transition = 'width ' + timeLeft + 'ms linear';
      activeBar.style.width = '100%';
    }

    if (!this.isPaused) {
      this.timer = setTimeout(() => {
        this.activate((this.currentIndex + 1) % this.tabs.length, 0);
      }, timeLeft);
    }
  }

  pause() {
    if (this.isPaused || !this.tabs || !this.tabs.length) return;
    this.isPaused = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const elapsed = Date.now() - this.startTime;
    this.remainingTime = Math.max(0, this.remainingTime - elapsed);

    const activeTab = this.tabs[this.currentIndex];
    const activeBar = activeTab ? activeTab.querySelector('.about-timeline-progress-bar') : null;
    if (activeBar) {
      const computedWidth = window.getComputedStyle(activeBar).width;
      activeBar.style.transition = 'none';
      activeBar.style.width = computedWidth;
    }
    this.classList.add('is-paused');
  }

  resume() {
    if (!this.isPaused || !this.tabs || !this.tabs.length) return;
    this.isPaused = false;
    this.classList.remove('is-paused');

    const activeTab = this.tabs[this.currentIndex];
    const activeBar = activeTab ? activeTab.querySelector('.about-timeline-progress-bar') : null;
    const currentWidthRatio = activeBar ? parseFloat(activeBar.style.width) / 100 : 0;

    this.activate(this.currentIndex, isNaN(currentWidthRatio) ? 0 : currentWidthRatio);
  }

  handleBlockSelect(event) {
    if (event.target && this.contains(event.target)) {
      const blockId = event.detail ? event.detail.blockId : null;
      if (!blockId) return;
      const matchingTab = this.querySelector('[data-block-id="' + blockId + '"]');
      if (matchingTab && this.tabs) {
        const tabIndex = this.tabs.indexOf(matchingTab);
        if (tabIndex > -1) {
          this.activate(tabIndex, 0);
        }
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

if (!customElements.get('about-timeline')) {
  customElements.define('about-timeline', AboutTimeline);
}
