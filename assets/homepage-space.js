(function () {
  'use strict';

  function initShopBySpace() {
    const spaceSections = document.querySelectorAll('.hp-space');
    if (!spaceSections.length) return;

    spaceSections.forEach((section) => {
      const tabs = Array.from(section.querySelectorAll('.hp-space-tab'));
      const panels = Array.from(section.querySelectorAll('.hp-space-panel'));

      function initPanel(panel) {
        if (!panel) return;
        const pins = Array.from(panel.querySelectorAll('.hp-space-pin'));
        const miniCards = Array.from(panel.querySelectorAll('.hp-space-mini-card'));
        const rail = panel.querySelector('.hp-space-rail');
        const railPrevBtn = panel.querySelector('.hp-space-rail-arrow--prev');
        const railNextBtn = panel.querySelector('.hp-space-rail-arrow--next');
        const sideNavPrevBtn = panel.querySelector('.hp-space-side-nav-arrow--prev');
        const sideNavNextBtn = panel.querySelector('.hp-space-side-nav-arrow--next');

        const sideMedia = panel.querySelector('.hp-space-side-media');
        const sideTitle = panel.querySelector('.hp-space-side-title');
        const sideDesc = panel.querySelector('.hp-space-side-desc');
        const sideCta = panel.querySelector('.hp-space-side-cta');
        const sideLinksWrap = panel.querySelector('.hp-space-side-links');

        let currentIndex = 0;
        const itemsCount = Math.max(pins.length, miniCards.length);

        function updateActiveItem(index) {
          if (itemsCount === 0) return;
          currentIndex = (index + itemsCount) % itemsCount;

          pins.forEach((pin, i) => {
            const isActive = i === currentIndex;
            pin.classList.toggle('is-active', isActive);
            pin.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          });

          miniCards.forEach((card, i) => {
            const isActive = i === currentIndex;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-selected', isActive ? 'true' : 'false');
            if (isActive && rail) {
              const railRect = rail.getBoundingClientRect();
              const cardRect = card.getBoundingClientRect();
              if (cardRect.left < railRect.left || cardRect.right > railRect.right) {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }
          });

          if (railPrevBtn) {
            railPrevBtn.style.display = currentIndex > 0 ? 'inline-flex' : 'none';
          }
          if (railNextBtn) {
            railNextBtn.style.display = currentIndex < itemsCount - 1 ? 'inline-flex' : 'none';
          }

          const activeSource = miniCards[currentIndex] || pins[currentIndex];
          if (!activeSource) return;

          const matchingMiniCard = miniCards[currentIndex];
          const miniImg = (activeSource.querySelector && activeSource.querySelector('.hp-space-mini-img')) || (matchingMiniCard && matchingMiniCard.querySelector('.hp-space-mini-img'));
          const fallbackImgSrc = miniImg ? (miniImg.currentSrc || miniImg.src || miniImg.getAttribute('src')) : '';
          const newImgSrc = (activeSource.dataset && activeSource.dataset.sideImg && activeSource.dataset.sideImg.trim() !== '')
            ? activeSource.dataset.sideImg
            : fallbackImgSrc;

          if (sideMedia) {
            let sideImg = sideMedia.querySelector('.hp-space-side-img, img');
            if (newImgSrc) {
              if (!sideImg) {
                sideImg = document.createElement('img');
                sideImg.className = 'hp-space-side-img';
                sideMedia.appendChild(sideImg);
              }
              sideImg.removeAttribute('srcset');
              sideImg.removeAttribute('sizes');
              sideImg.src = newImgSrc;
              sideImg.alt = activeSource.dataset.sideTitle || 'Panasonic Replacement Part';
              sideImg.style.display = 'block';
            } else if (sideImg) {
              sideImg.style.display = 'none';
            }
          }

          const newTitle = activeSource.dataset.sideTitle;
          if (newTitle && sideTitle) {
            sideTitle.textContent = newTitle;
          }

          const newDesc = activeSource.dataset.sideDesc;
          if (newDesc && sideDesc) {
            sideDesc.textContent = newDesc;
          }

          const newCtaText = activeSource.dataset.sideCta;
          const newCtaUrl = activeSource.dataset.sideCtaUrl;
          if (sideCta) {
            if (newCtaText) {
              const svgIcon = sideCta.querySelector('svg');
              sideCta.textContent = newCtaText + ' ';
              if (svgIcon) {
                sideCta.appendChild(svgIcon);
              } else {
                sideCta.insertAdjacentHTML('beforeend', '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;"><path d="M4 12h15"></path><path d="m13 6 6 6-6 6"></path></svg>');
              }
            }
            if (newCtaUrl) {
              sideCta.href = newCtaUrl;
            }
          }

          if (sideLinksWrap) {
            const allLinkGroups = panel.querySelectorAll('.hp-space-side-links-group');
            if (allLinkGroups.length) {
              allLinkGroups.forEach((group, i) => {
                group.style.display = i === currentIndex ? 'flex' : 'none';
              });
            }
          }
        }

        pins.forEach((pin, i) => {
          pin.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveItem(i);
          });

          pin.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              updateActiveItem(i);
            }
          });
        });

        miniCards.forEach((card, i) => {
          card.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveItem(i);
          });
        });

        if (railNextBtn) {
          railNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveItem(currentIndex + 1);
          });
        }

        if (railPrevBtn) {
          railPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveItem(currentIndex - 1);
          });
        }

        if (sideNavNextBtn) {
          sideNavNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveItem(currentIndex + 1);
          });
        }

        if (sideNavPrevBtn) {
          sideNavPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveItem(currentIndex - 1);
          });
        }

        panel._updateActiveItem = updateActiveItem;

        updateActiveItem(0);
      }

      if (panels.length) {
        panels.forEach((panel) => initPanel(panel));
      } else {
        initPanel(section);
      }

      tabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          tabs.forEach((t) => {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

          const spaceCategory = tab.dataset.spaceTab;
          if (spaceCategory && panels.length) {
            panels.forEach((p) => {
              const isMatch = p.dataset.spacePanel === spaceCategory;
              p.classList.toggle('is-active', isMatch);
              if (isMatch) {
                if (typeof p._updateActiveItem === 'function') {
                  const activeCard = p.querySelector('.hp-space-mini-card.is-active');
                  const activeIdx = activeCard ? parseInt(activeCard.dataset.spaceIndex || '0', 10) : 0;
                  p._updateActiveItem(activeIdx);
                }
                const activeCard = p.querySelector('.hp-space-mini-card.is-active');
                const rail = p.querySelector('.hp-space-rail');
                if (activeCard && rail) {
                  activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
              }
            });
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShopBySpace);
  } else {
    initShopBySpace();
  }

  document.addEventListener('shopify:section:load', (e) => {
    if (e.target.classList.contains('section-homepage-shop-by-space') || e.target.querySelector('.hp-space')) {
      initShopBySpace();
    }
  });

  document.addEventListener('shopify:block:select', (e) => {
    const block = e.target;
    const pin = block.classList.contains('hp-space-pin') ? block : block.querySelector('.hp-space-pin');
    const miniCard = block.classList.contains('hp-space-mini-card') ? block : block.querySelector('.hp-space-mini-card');
    const tab = block.classList.contains('hp-space-tab') ? block : block.querySelector('.hp-space-tab');
    const target = pin || miniCard || tab;
    if (target) {
      target.click();
    }
  });
})();
