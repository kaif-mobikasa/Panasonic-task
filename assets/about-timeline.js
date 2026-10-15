(function () {
  'use strict';

  function initTimelineSection(sectionEl) {
    if (!sectionEl || sectionEl.dataset.timelineInitialized === 'true') return;
    sectionEl.dataset.timelineInitialized = 'true';

    const tabs = sectionEl.querySelectorAll('.about-timeline-tab');
    const panels = sectionEl.querySelectorAll('.about-timeline-panel-item');
    if (!tabs.length || !panels.length) return;

    const duration = parseInt(sectionEl.dataset.duration || '6000', 10);
    const pauseOnHover = sectionEl.dataset.pauseHover === 'true';

    let currentIndex = 0;
    let timer = null;
    let isPaused = false;
    let startTime = 0;
    let remainingTime = duration;

    function resetBars() {
      tabs.forEach(function (tab) {
        const bar = tab.querySelector('.about-timeline-progress-bar');
        if (bar) {
          bar.style.transition = 'none';
          bar.style.width = '0%';
        }
      });
    }

    function activate(index, startWidthRatio) {
      if (index < 0 || index >= tabs.length) index = 0;
      currentIndex = index;

      clearTimeout(timer);
      resetBars();

      tabs.forEach(function (tab, i) {
        const isActive = i === index;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach(function (panel, i) {
        const isActive = i === index;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      const activeTab = tabs[index];
      const activeBar = activeTab ? activeTab.querySelector('.about-timeline-progress-bar') : null;

      const initialRatio = typeof startWidthRatio === 'number' ? startWidthRatio : 0;
      const timeLeft = duration * (1 - initialRatio);
      remainingTime = timeLeft;
      startTime = Date.now();

      if (activeBar) {
        activeBar.style.transition = 'none';
        activeBar.style.width = (initialRatio * 100) + '%';
        void activeBar.offsetWidth;
        activeBar.style.transition = 'width ' + timeLeft + 'ms linear';
        activeBar.style.width = '100%';
      }

      if (!isPaused) {
        timer = setTimeout(function () {
          activate((currentIndex + 1) % tabs.length, 0);
        }, timeLeft);
      }
    }

    function pause() {
      if (isPaused) return;
      isPaused = true;
      clearTimeout(timer);

      const elapsed = Date.now() - startTime;
      remainingTime = Math.max(0, remainingTime - elapsed);

      const activeTab = tabs[currentIndex];
      const activeBar = activeTab ? activeTab.querySelector('.about-timeline-progress-bar') : null;
      if (activeBar) {
        const computedWidth = window.getComputedStyle(activeBar).width;
        activeBar.style.transition = 'none';
        activeBar.style.width = computedWidth;
      }
      sectionEl.classList.add('is-paused');
    }

    function resume() {
      if (!isPaused) return;
      isPaused = false;
      sectionEl.classList.remove('is-paused');

      const activeTab = tabs[currentIndex];
      const activeBar = activeTab ? activeTab.querySelector('.about-timeline-progress-bar') : null;
      const currentWidthRatio = activeBar ? parseFloat(activeBar.style.width) / 100 : 0;

      activate(currentIndex, isNaN(currentWidthRatio) ? 0 : currentWidthRatio);
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        activate(idx, 0);
      });
    });

    if (pauseOnHover) {
      sectionEl.addEventListener('mouseenter', pause);
      sectionEl.addEventListener('mouseleave', resume);
    }

    activate(0, 0);

    document.addEventListener('shopify:block:select', function (event) {
      if (event.target && sectionEl.contains(event.target)) {
        const blockId = event.detail.blockId;
        const matchingTab = sectionEl.querySelector('[data-block-id="' + blockId + '"]');
        if (matchingTab) {
          const tabIndex = Array.prototype.indexOf.call(tabs, matchingTab);
          if (tabIndex > -1) activate(tabIndex, 0);
        }
      }
    });
  }

  function initAllTimelines() {
    const timelines = document.querySelectorAll('.about-timeline');
    timelines.forEach(initTimelineSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllTimelines);
  } else {
    initAllTimelines();
  }

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.classList.contains('section-about-timeline')) {
      const sectionEl = e.target.querySelector('.about-timeline');
      if (sectionEl) {
        sectionEl.dataset.timelineInitialized = 'false';
        initTimelineSection(sectionEl);
      }
    }
  });
})();
