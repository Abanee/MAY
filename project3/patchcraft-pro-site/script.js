/* ================================================================
   PATCHCRAFT PRO — script.js
   Vanilla JS: Theme + Direction toggles, Navbar, Patch Previewer,
   Catalog Filters, Bulk Pricing Calculator, Toast notifications
   ================================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     SAFE STORAGE HELPERS
     (falls back silently if storage is blocked,
     e.g. inside a sandboxed preview)
     ────────────────────────────────────────── */
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  /* ──────────────────────────────────────────
     INIT — runs once DOM is ready
     ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide) lucide.createIcons();

    initThemeToggle();
    initDirectionToggle();
    initNavbarScroll();
    initMobileMenu();
    initPatchPreviewer();
    initCatalogFilters();
    initBulkCalculator();
    initToastButtons();
    initJourneyStepper();
    initSportFilters();
    initRosterEstimator();
    initCounterReveal();
    initPricingPage();

    // Re-enable transitions one frame after first paint so the
    // initial theme application doesn't animate from a flash state.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('no-transitions');
      });
    });
  });


  /* ══════════════════════════════════════════
     THEME TOGGLE (dark / light)
     ══════════════════════════════════════════ */
  function initThemeToggle() {
    var html = document.documentElement;
    var buttons = [
      document.getElementById('theme-toggle'),
      document.getElementById('theme-toggle-mobile')
    ].filter(Boolean);

    var metaThemeColor = document.getElementById('meta-theme-color');

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      });
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'light' ? '#FAF8F4' : '#0A0F1C');
      }
      storageSet('pcp-theme', theme);
    }

    function toggleTheme() {
      var current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });

    // Follow system preference live, only if the user hasn't chosen manually
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
        if (!storageGet('pcp-theme')) {
          applyTheme(e.matches ? 'light' : 'dark');
        }
      });
    }
  }


  /* ══════════════════════════════════════════
     DIRECTION TOGGLE (LTR / RTL)
     ══════════════════════════════════════════ */
  function initDirectionToggle() {
    var html = document.documentElement;
    var labelDesktop = document.getElementById('dir-toggle-label');
    var labelMobile = document.getElementById('dir-toggle-label-mobile');
    var buttons = [
      document.getElementById('dir-toggle'),
      document.getElementById('dir-toggle-mobile')
    ].filter(Boolean);

    function applyDirection(dir) {
      html.setAttribute('dir', dir);
      if (labelDesktop) labelDesktop.textContent = dir.toUpperCase();
      if (labelMobile) labelMobile.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-label', 'Switch to ' + (dir === 'ltr' ? 'right-to-left' : 'left-to-right') + ' layout');
      });
      storageSet('pcp-dir', dir);
    }

    function toggleDirection() {
      var current = html.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
    }

    // Sync the labels to whatever direction was set by the
    // anti-flash inline script before this file loaded.
    applyDirection(html.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', toggleDirection);
    });
  }


  /* ══════════════════════════════════════════
     NAVBAR — scroll background
     ══════════════════════════════════════════ */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function update() {
      if (window.scrollY > 24) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }


  /* ══════════════════════════════════════════
     MOBILE MENU
     ══════════════════════════════════════════ */
  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      var isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!isOpen));
      var icon = btn.querySelector('i');
      if (icon && window.lucide) {
        icon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
        lucide.createIcons();
      }
    });

    // Close the menu after tapping a nav link
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        var icon = btn.querySelector('i');
        if (icon && window.lucide) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }


  /* ══════════════════════════════════════════
     HERO — QUICK SPEC PREVIEWER
     ══════════════════════════════════════════ */
  function initPatchPreviewer() {
    var typeButtons = document.querySelectorAll('.patch-type-btn');
    var preview = document.getElementById('patch-preview');
    if (!typeButtons.length || !preview) return;

    var specs = {
      embroidered: { material: 'Wool/Poly', colors: 'Up to 12', backing: 'Iron-on' },
      woven:       { material: 'Polyester', colors: 'Up to 8',  backing: 'Sew-on' },
      pvc:         { material: 'Soft PVC',  colors: 'Up to 6',  backing: 'Velcro' }
    };

    var elMaterial = document.getElementById('spec-material');
    var elColors = document.getElementById('spec-colors');
    var elBacking = document.getElementById('spec-backing');
    var previewImg = document.getElementById('patch-preview-img');

    var typeImgMap = {
      embroidered: 'Asset/home2hero1.jpg',
      woven: 'Asset/home2hero2.jpg',
      pvc: 'Asset/home2hero3.jpg'
    };

    typeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.getAttribute('data-type');

        typeButtons.forEach(function (b) { b.classList.remove('active-type'); });
        btn.classList.add('active-type');

        if (previewImg && typeImgMap[type]) {
          previewImg.src = typeImgMap[type];
          previewImg.alt = type.charAt(0).toUpperCase() + type.slice(1);
        }

        var spec = specs[type];
        if (spec) {
          if (elMaterial) elMaterial.textContent = spec.material;
          if (elColors) elColors.textContent = spec.colors;
          if (elBacking) elBacking.textContent = spec.backing;
        }
      });
    });
  }


  /* ══════════════════════════════════════════
     CATALOG FILTERS
     ══════════════════════════════════════════ */
  function initCatalogFilters() {
    var categoryInputs = document.querySelectorAll('#category-filters input[name="category"]');
    var styleInputs = document.querySelectorAll('#style-filters input[type="checkbox"]');
    var cards = document.querySelectorAll('.product-card');
    var visibleCount = document.getElementById('visible-count');
    var noResults = document.getElementById('no-results');
    var clearBtn = document.getElementById('clear-filters');
    var resetBtn = document.getElementById('reset-filters');

    if (!cards.length) return;

    function applyFilters() {
      var activeCategory = 'all';
      categoryInputs.forEach(function (input) {
        if (input.checked) activeCategory = input.value;
      });

      var activeStyles = [];
      styleInputs.forEach(function (input) {
        if (input.checked) activeStyles.push(input.value);
      });

      var visible = 0;

      cards.forEach(function (card) {
        var matchesCategory = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
        var matchesStyle = activeStyles.length === 0 || activeStyles.indexOf(card.getAttribute('data-style')) !== -1;
        var shouldShow = matchesCategory && matchesStyle;

        if (shouldShow) {
          if (card.classList.contains('hidden-by-filter')) {
            card.classList.remove('hidden-by-filter');
            card.classList.remove('appearing');
            // force reflow so the animation restarts reliably
            void card.offsetWidth;
            card.classList.add('appearing');
          }
          visible++;
        } else {
          card.classList.add('hidden-by-filter');
        }
      });

      if (visibleCount) visibleCount.textContent = String(visible);
      if (noResults) noResults.classList.toggle('hidden', visible !== 0);
    }

    function clearFilters() {
      categoryInputs.forEach(function (input) {
        input.checked = input.value === 'all';
      });
      styleInputs.forEach(function (input) { input.checked = false; });
      applyFilters();
    }

    categoryInputs.forEach(function (input) {
      input.addEventListener('change', applyFilters);
    });
    styleInputs.forEach(function (input) {
      input.addEventListener('change', applyFilters);
    });
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    if (resetBtn) resetBtn.addEventListener('click', clearFilters);

    applyFilters();
  }


  /* ══════════════════════════════════════════
     BULK PRICING CALCULATOR
     ══════════════════════════════════════════ */
  function initBulkCalculator() {
    var slider = document.getElementById('qty-slider');
    var numberInput = document.getElementById('qty-input');
    if (!slider || !numberInput) return;

    var priceValueEl = document.getElementById('price-value');
    var priceTierLabelEl = document.getElementById('price-tier-label');
    var totalValueEl = document.getElementById('total-value');
    var savingsLabelEl = document.getElementById('savings-label');
    var prodTimeEl = document.getElementById('prod-time');
    var tierRows = document.querySelectorAll('.tier-table-row');

    // Mirrors the static table in the markup
    var tiers = [
      { min: 50,   max: 99,   price: 4.50, days: 14, label: '50–99 units tier' },
      { min: 100,  max: 249,  price: 3.20, days: 12, label: '100–249 units tier' },
      { min: 250,  max: 499,  price: 2.40, days: 10, label: '250–499 units tier' },
      { min: 500,  max: 999,  price: 1.80, days: 8,  label: '500–999 units tier' },
      { min: 1000, max: 2499, price: 1.20, days: 6,  label: '1,000–2,499 units tier' },
      { min: 2500, max: 5000, price: 0.85, days: 5,  label: '2,500+ units tier' }
    ];

    var basePrice = tiers[0].price;

    function getTier(qty) {
      for (var i = tiers.length - 1; i >= 0; i--) {
        if (qty >= tiers[i].min) return tiers[i];
      }
      return tiers[0];
    }

    function bump(el) {
      if (!el) return;
      el.classList.remove('value-animating');
      void el.offsetWidth;
      el.classList.add('value-animating');
    }

    function updateSliderFill(qty) {
      var min = parseInt(slider.min, 10);
      var max = parseInt(slider.max, 10);
      var pct = ((qty - min) / (max - min)) * 100;
      slider.style.setProperty('--fill', pct + '%');
    }

    function render(qty) {
      qty = Math.max(50, Math.min(5000, qty));
      var tier = getTier(qty);
      var total = Math.round(qty * tier.price);
      var savings = Math.round((1 - tier.price / basePrice) * 100);

      if (priceValueEl) { priceValueEl.textContent = tier.price.toFixed(2); bump(priceValueEl); }
      if (priceTierLabelEl) priceTierLabelEl.textContent = tier.label;
      if (totalValueEl) { totalValueEl.textContent = total.toLocaleString('en-US'); bump(totalValueEl); }
      if (savingsLabelEl) {
        savingsLabelEl.textContent = savings > 0 ? ('Save ' + savings + '% vs base price') : 'Entry-level pricing tier';
      }
      if (prodTimeEl) { prodTimeEl.textContent = String(tier.days); bump(prodTimeEl); }

      tierRows.forEach(function (row) {
        var min = parseInt(row.getAttribute('data-min'), 10);
        var max = parseInt(row.getAttribute('data-max'), 10);
        row.classList.toggle('active-tier', qty >= min && qty <= max);
      });

      updateSliderFill(qty);
    }

    function setQty(qty, source) {
      qty = Math.max(50, Math.min(5000, Math.round(qty / 10) * 10));
      if (source !== 'slider') slider.value = String(qty);
      if (source !== 'input') numberInput.value = String(qty);
      render(qty);
    }

    slider.addEventListener('input', function () {
      setQty(parseInt(slider.value, 10), 'slider');
    });

    numberInput.addEventListener('input', function () {
      var val = parseInt(numberInput.value, 10);
      if (isNaN(val)) return;
      setQty(val, 'input');
    });

    numberInput.addEventListener('blur', function () {
      var val = parseInt(numberInput.value, 10);
      if (isNaN(val)) val = 50;
      setQty(val, 'input');
    });

    // Initial paint
    setQty(parseInt(slider.value, 10) || 250, 'init');
  }


  /* ══════════════════════════════════════════
     TOAST — "Quick Add to Quote"
     ══════════════════════════════════════════ */
  function initToastButtons() {
    var toast = document.getElementById('toast');
    var toastMessage = document.getElementById('toast-message');
    var quoteButtons = document.querySelectorAll('.quick-quote-btn');
    if (!toast || !quoteButtons.length) return;

    var hideTimer = null;

    function showToast(text) {
      if (toastMessage) toastMessage.textContent = text;
      toast.classList.add('show');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        toast.classList.remove('show');
      }, 2600);
    }

    quoteButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var product = btn.getAttribute('data-product');
        showToast(product ? ('Added "' + product + '" to quote') : 'Added to quote successfully!');
      });
    });
  }


  /* ══════════════════════════════════════════
     HOME PAGE — ORDER JOURNEY STEPPER
     Auto-cycles through the production steps and
     supports manual click details switching.
     ══════════════════════════════════════════ */
  function initJourneyStepper() {
    var steps = document.querySelectorAll('.journey-step');
    var panes = document.querySelectorAll('.journey-detail-pane');
    if (!steps.length) return;

    var i = 0;
    var autoCycleInterval = null;

    function setActive(index) {
      steps.forEach(function (step, idx) {
        step.classList.remove('is-active');
        step.classList.toggle('is-done', idx < index);
      });
      steps[index].classList.add('is-active');

      panes.forEach(function (pane, idx) {
        if (idx === index) {
          pane.classList.remove('hidden');
          // simple fade-in effect via browser opacity
          pane.style.opacity = '0';
          pane.style.transform = 'translateY(8px)';
          pane.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          requestAnimationFrame(function() {
            pane.style.opacity = '1';
            pane.style.transform = 'translateY(0)';
          });
        } else {
          pane.classList.add('hidden');
        }
      });
    }

    // Attach click events for manual interaction
    steps.forEach(function (step, index) {
      step.addEventListener('click', function () {
        clearInterval(autoCycleInterval);
        setActive(index);
        i = index;
      });
    });

    setActive(0);

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    autoCycleInterval = setInterval(function () {
      i = (i + 1) % steps.length;
      setActive(i);
    }, 4500);
  }


  /* ══════════════════════════════════════════
     SPORTS TEAMS PAGE — SPORT FILTER CHIPS
     ══════════════════════════════════════════ */
  function initSportFilters() {
    var chips = document.querySelectorAll('.sport-chip');
    var cards = document.querySelectorAll('.player-card');
    var countEl = document.getElementById('roster-visible-count');
    if (!chips.length || !cards.length) return;

    function applySport(sport) {
      var visible = 0;
      cards.forEach(function (card) {
        var match = sport === 'all' || card.getAttribute('data-sport') === sport;
        card.classList.toggle('hidden-by-sport', !match);
        if (match) visible++;
      });
      if (countEl) countEl.textContent = String(visible);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active-sport'); });
        chip.classList.add('active-sport');
        applySport(chip.getAttribute('data-sport'));
      });
    });

    applySport('all');
  }


  /* ══════════════════════════════════════════
     SPORTS TEAMS PAGE — ROSTER SIZE ESTIMATOR
     ══════════════════════════════════════════ */
  function initRosterEstimator() {
    var slider = document.getElementById('roster-slider');
    var numberInput = document.getElementById('roster-input');
    if (!slider || !numberInput) return;

    var patchesPerPlayer = 3; // crest, name, number set
    var pricePerPatch = 2.10;

    var rosterSizeEl = document.getElementById('roster-size-value');
    var totalPatchesEl = document.getElementById('roster-total-patches');
    var totalCostEl = document.getElementById('roster-total-cost');
    var leadTimeEl = document.getElementById('roster-lead-time');

    function leadTimeFor(size) {
      if (size >= 60) return 7;
      if (size >= 30) return 9;
      return 12;
    }

    function bump(el) {
      if (!el) return;
      el.classList.remove('value-animating');
      void el.offsetWidth;
      el.classList.add('value-animating');
    }

    function updateSliderFill(val) {
      var min = parseInt(slider.min, 10);
      var max = parseInt(slider.max, 10);
      var pct = ((val - min) / (max - min)) * 100;
      slider.style.setProperty('--fill', pct + '%');
    }

    function render(size) {
      size = Math.max(parseInt(slider.min, 10), Math.min(parseInt(slider.max, 10), size));
      var totalPatches = size * patchesPerPlayer;
      var totalCost = Math.round(totalPatches * pricePerPatch);

      if (rosterSizeEl) rosterSizeEl.textContent = String(size);
      if (totalPatchesEl) { totalPatchesEl.textContent = totalPatches.toLocaleString('en-US'); bump(totalPatchesEl); }
      if (totalCostEl) { totalCostEl.textContent = totalCost.toLocaleString('en-US'); bump(totalCostEl); }
      if (leadTimeEl) leadTimeEl.textContent = String(leadTimeFor(size));

      updateSliderFill(size);
    }

    function setSize(size, source) {
      size = Math.max(10, Math.min(100, Math.round(size)));
      if (source !== 'slider') slider.value = String(size);
      if (source !== 'input') numberInput.value = String(size);
      render(size);
    }

    slider.addEventListener('input', function () {
      setSize(parseInt(slider.value, 10), 'slider');
    });
    numberInput.addEventListener('input', function () {
      var val = parseInt(numberInput.value, 10);
      if (isNaN(val)) return;
      setSize(val, 'input');
    });
    numberInput.addEventListener('blur', function () {
      var val = parseInt(numberInput.value, 10);
      if (isNaN(val)) val = 10;
      setSize(val, 'input');
    });

    setSize(parseInt(slider.value, 10) || 24, 'init');
  }


  /* ══════════════════════════════════════════
     ANIMATED STAT COUNTERS (index.html hero strip)
     ══════════════════════════════════════════ */
  function initCounterReveal() {
    var counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10);
      if (isNaN(target)) return;
      var suffix = el.getAttribute('data-count-suffix') || '';
      var duration = 1200;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!window.IntersectionObserver) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ══════════════════════════════════════════
     PRICING PAGE - CALCULATOR & FAQ ACCORDION
     ══════════════════════════════════════════ */
  function initPricingPage() {
    // 1. Calculator Logic
    var slider = document.getElementById('qty-slider-pricing');
    var numberInput = document.getElementById('qty-input-pricing');
    if (slider && numberInput) {
      var pricePerUnitEl = document.getElementById('price-per-unit');
      var totalCostEl = document.getElementById('total-cost-pricing');
      var turnaroundTimeEl = document.getElementById('turnaround-time');
      var tierBadgeEl = document.getElementById('tier-badge');
      var sizeButtons = document.querySelectorAll('.size-select-btn');
      
      var sizeMultiplier = 0.8; // Default to 2" size (which has multiplier 0.8)

      var tiers = [
        { min: 50,   max: 99,   price: 4.50, days: 14, label: 'Starter (Base Rate)' },
        { min: 100,  max: 249,  price: 3.20, days: 12, label: 'Starter (Save 29%)' },
        { min: 250,  max: 499,  price: 2.40, days: 10, label: 'Team Pro (Save 47%)' },
        { min: 500,  max: 999,  price: 1.80, days: 8,  label: 'Team Pro (Save 60%)' },
        { min: 1000, max: 2499, price: 1.20, days: 6,  label: 'Enterprise (Save 73%)' },
        { min: 2500, max: 5000, price: 0.85, days: 5,  label: 'Enterprise (Save 81% ★)' }
      ];

      var basePrice = tiers[0].price;

      function getTier(qty) {
        for (var i = tiers.length - 1; i >= 0; i--) {
          if (qty >= tiers[i].min) return tiers[i];
        }
        return tiers[0];
      }

      function updateSliderFill(qty) {
        var min = parseInt(slider.min, 10);
        var max = parseInt(slider.max, 10);
        var pct = ((qty - min) / (max - min)) * 100;
        slider.style.setProperty('--fill', pct + '%');
      }

      function render(qty) {
        qty = Math.max(50, Math.min(5000, qty));
        var tier = getTier(qty);
        var calculatedPrice = tier.price * sizeMultiplier;
        var total = Math.round(qty * calculatedPrice);

        if (pricePerUnitEl) {
          pricePerUnitEl.textContent = calculatedPrice.toFixed(2);
        }
        if (totalCostEl) {
          totalCostEl.textContent = total.toLocaleString('en-US');
        }
        if (turnaroundTimeEl) {
          turnaroundTimeEl.textContent = String(tier.days);
        }
        if (tierBadgeEl) {
          tierBadgeEl.textContent = tier.label;
        }

        updateSliderFill(qty);
      }

      function setQty(qty, source) {
        qty = Math.max(50, Math.min(5000, Math.round(qty / 10) * 10));
        if (source !== 'slider') slider.value = String(qty);
        if (source !== 'input') numberInput.value = String(qty);
        render(qty);
      }

      slider.addEventListener('input', function () {
        setQty(parseInt(slider.value, 10), 'slider');
      });

      numberInput.addEventListener('input', function () {
        var val = parseInt(numberInput.value, 10);
        if (isNaN(val)) return;
        setQty(val, 'input');
      });

      numberInput.addEventListener('blur', function () {
        var val = parseInt(numberInput.value, 10);
        if (isNaN(val)) val = 50;
        setQty(val, 'input');
      });

      // Size buttons selector logic
      sizeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          sizeButtons.forEach(function (b) { b.classList.remove('active-size'); });
          btn.classList.add('active-size');
          sizeMultiplier = parseFloat(btn.getAttribute('data-size-multiplier')) || 1.0;
          setQty(parseInt(slider.value, 10), 'init');
        });
      });

      // Initial state
      setQty(250, 'init');
    }

    // 2. FAQ Accordion Logic
    var faqButtons = document.querySelectorAll('.faq-btn');
    faqButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var content = btn.nextElementSibling;
        var icon = btn.querySelector('i[data-lucide="chevron-down"]');
        if (!content) return;
        
        var isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        } else {
          content.classList.add('hidden');
          if (icon) icon.classList.remove('rotate-180');
        }
      });
    });
  }

})();
