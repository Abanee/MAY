/**
 * POPCRAFT — Main Scripts
 * Artisan Gourmet Popcorn Co.
 * Version: 1.0.0
 */

'use strict';

/* ============================================================
   0.  IMMEDIATE BOOTSTRAP (Theme + Direction)
   Apply saved settings before DOM paint to avoid flash
   ============================================================ */
(function bootstrapSettings() {
  // Theme
  const savedTheme   = localStorage.getItem('popcraft-theme');
  const prefersTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersTheme)) {
    document.documentElement.classList.add('dark');
  }
  // Direction (LTR/RTL)
  const savedDir = localStorage.getItem('popcraft-dir') || 'ltr';
  document.documentElement.dir = savedDir;
})();


/* ============================================================
   MAIN INIT — runs when DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. THEME & DIRECTION TOGGLES
     ---------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMob = document.getElementById('theme-toggle-mob');
  const dirToggle   = document.getElementById('dir-toggle');
  const dirToggleMob = document.getElementById('dir-toggle-mob');

  function syncThemeUI() {
    const isDark = document.documentElement.classList.contains('dark');
    const text = isDark ? '☀️' : '🌙';
    if (themeToggle) themeToggle.textContent = text;
    if (themeToggleMob) themeToggleMob.textContent = text;
  }

  // Sync theme UI
  syncThemeUI();

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('popcraft-theme', isDark ? 'dark' : 'light');
    syncThemeUI();
  };

  themeToggle?.addEventListener('click', handleThemeToggle);
  themeToggleMob?.addEventListener('click', handleThemeToggle);

  function syncDirUI() {
    const isRtl = document.documentElement.dir === 'rtl';
    const text = isRtl ? 'RTL' : 'LTR';
    if (dirToggle) dirToggle.textContent = text;
    if (dirToggleMob) dirToggleMob.textContent = text;
  }

  // Sync direction UI
  syncDirUI();

  const handleDirToggle = () => {
    const isRtl = document.documentElement.dir === 'rtl';
    const newDir = isRtl ? 'ltr' : 'rtl';
    document.documentElement.dir = newDir;
    localStorage.setItem('popcraft-dir', newDir);
    syncDirUI();
  };

  dirToggle?.addEventListener('click', handleDirToggle);
  dirToggleMob?.addEventListener('click', handleDirToggle);


  /* ----------------------------------------------------------
     2. MOBILE MENU
     ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobCloseBtn = document.getElementById('mob-close-btn');

  function closeMobileMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobCloseBtn?.addEventListener('click', closeMobileMenu);

  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', closeMobileMenu)
  );

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  /* ----------------------------------------------------------
     3. SMOOTH SCROLL FOR ANCHOR LINKS
     ---------------------------------------------------------- */
  const NAV_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
     4. STICKY NAV — hide on scroll-down, show on scroll-up
     ---------------------------------------------------------- */
  const mainNav = document.getElementById('main-nav');
  let lastY    = 0;
  let ticking  = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (mainNav) {
          if (currentY > 120 && currentY > lastY) {
            mainNav.style.transform = 'translateY(-105%)';
          } else {
            mainNav.style.transform = 'translateY(0)';
          }
        }
        lastY   = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  /* ----------------------------------------------------------
     5. SCROLL PROGRESS BAR
     ---------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');

  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${(scrolled / total) * 100}%`;
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     6. ACTIVE NAV HIGHLIGHT ON SCROLL
     ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
              const isActive = href === `#${id}`;
              link.classList.toggle('active', isActive);
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));
  }


  /* ----------------------------------------------------------
     7. SCROLL REVEAL (IntersectionObserver)
     ---------------------------------------------------------- */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const revealEls = document.querySelectorAll(revealSelectors);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     8. CART NOTIFICATION TOAST
     ---------------------------------------------------------- */
  const cartToast    = document.getElementById('cart-toast');
  const toastText    = document.getElementById('toast-text');
  let   toastTimer   = null;
  let   cartCount    = 0;
  const cartCountEl  = document.getElementById('cart-count');

  function showToast(message) {
    if (!cartToast) return;
    if (toastText) toastText.textContent = message;
    cartToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => cartToast.classList.remove('show'), 3200);
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const card       = this.closest('.flavor-card');
      const flavorName = card?.querySelector('.flavor-name')?.textContent ?? 'Item';
      cartCount++;
      if (cartCountEl) cartCountEl.textContent = cartCount;
      showToast(`${flavorName} added to cart!`);

      // Brief button feedback
      const orig = this.innerHTML;
      this.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Added!`;
      this.style.background = 'var(--accent-gold)';
      this.style.color = '#fff';
      setTimeout(() => {
        this.innerHTML = orig;
        this.style.background = '';
        this.style.color = '';
      }, 1800);
    });
  });


  /* ----------------------------------------------------------
     9. PRICING TOGGLE (Monthly ↔ Annual)
     ---------------------------------------------------------- */
  const billingToggle = document.getElementById('billing-toggle');
  const billingLabel  = document.getElementById('billing-label');
  const monthlyPrices = document.querySelectorAll('.price-monthly');
  const annualPrices  = document.querySelectorAll('.price-annual');
  const annualSavings = document.querySelectorAll('.annual-saving');

  let isAnnual = false;

  billingToggle?.addEventListener('click', () => {
    isAnnual = !isAnnual;
    billingToggle.classList.toggle('active', isAnnual);

    monthlyPrices.forEach(el => el.classList.toggle('hidden', isAnnual));
    annualPrices.forEach(el => el.classList.toggle('hidden', !isAnnual));
    annualSavings.forEach(el => {
      el.style.opacity = isAnnual ? '1' : '0';
      el.style.transform = isAnnual ? 'translateY(0)' : 'translateY(4px)';
    });

    if (billingLabel) {
      billingLabel.textContent = isAnnual ? 'Annual  — Save 20%' : 'Monthly';
    }
  });

  // Init annual saving styles
  annualSavings.forEach(el => {
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(4px)';
  });


  /* ----------------------------------------------------------
     10. STORE LOCATOR — MOCK SEARCH
     ---------------------------------------------------------- */
  const zipInput      = document.getElementById('zip-input');
  const searchBtn     = document.getElementById('zip-search-btn');
  const storeResults  = document.getElementById('store-results');
  const storeEmpty    = document.getElementById('store-empty');

  const STORES = [
    {
      type:     'Specialty Food Store',
      name:     'The Gourmet Pantry',
      address:  '142 West 73rd St, New York, NY 10023',
      phone:    '(212) 555-0192',
      hours:    'Mon – Sat: 9 am – 9 pm  •  Sun: 10 am – 7 pm',
      distance: '0.3 mi',
    },
    {
      type:     'Artisan Market',
      name:     'Fine & Fancy Foods',
      address:  '88 Newbury Street, Boston, MA 02116',
      phone:    '(617) 555-0148',
      hours:    'Daily: 10 am – 8 pm',
      distance: '0.7 mi',
    },
    {
      type:     'Luxury Grocer',
      name:     'Provisions Market',
      address:  '340 Valencia St, San Francisco, CA 94103',
      phone:    '(415) 555-0231',
      hours:    'Mon – Sun: 8 am – 10 pm',
      distance: '1.2 mi',
    },
    {
      type:     'Artisan Market',
      name:     'The Artisan Cellar',
      address:  '530 N Michigan Ave, Chicago, IL 60611',
      phone:    '(312) 555-0374',
      hours:    'Mon – Sat: 10 am – 8 pm  •  Sun: 11 am – 6 pm',
      distance: '1.8 mi',
    }
  ];

  function renderStores(list = STORES) {
    if (!storeResults) return;
    storeResults.innerHTML = '';

    if (storeEmpty) storeEmpty.classList.toggle('hidden', list.length > 0);

    const countEl = document.getElementById('results-count');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${list.length}</strong> retail locations`;
    }

    list.forEach((store, i) => {
      const el = document.createElement('div');
      el.className = `store-card reveal`;
      el.setAttribute('style', `transition-delay: ${i * 80}ms`);
      el.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div class="flex-1">
            <p style="font-size:0.62rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent-gold);margin-bottom:0.4rem">${store.type}</p>
            <h4 style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:600;margin-bottom:0.25rem;color:var(--text-primary)">${store.name}</h4>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.2rem">${store.address}</p>
            <p style="font-size:0.78rem;color:var(--text-secondary)">${store.hours}</p>
          </div>
          <div class="shrink-0 text-right">
            <span style="font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--accent-gold);display:block">${store.distance}</span>
            <span style="font-size:0.7rem;color:var(--text-secondary)">from you</span>
          </div>
        </div>
        <div style="margin-top:1.1rem;padding-top:1.1rem;border-top:1px solid var(--border-color);display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap">
          <a href="https://maps.google.com?q=${encodeURIComponent(store.address)}" target="_blank" rel="noopener" class="btn-primary" style="font-size:0.7rem;padding:0.5rem 1.1rem;border:1px solid transparent;display:inline-flex;align-items:center;gap:0.35rem">
            📍 DIRECTIONS
          </a>
          <a href="tel:${store.phone.replace(/\D/g,'')}" class="btn-ghost" style="font-size:0.7rem;padding:0.5rem 1.1rem;display:inline-flex;align-items:center;gap:0.35rem">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 4.18 2 2 0 015 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            ${store.phone}
          </a>
        </div>
      `;
      storeResults.appendChild(el);
      // Trigger reveal after append
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('revealed')));
    });
  }

  // Initial render
  renderStores();

  function doSearch() {
    const zip = zipInput?.value.trim();
    if (!zip) return;

    // Animate out
    if (storeResults) {
      storeResults.style.opacity = '0';
      storeResults.style.transform = 'translateY(10px)';
      storeResults.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    }
    setTimeout(() => {
      renderStores(STORES); // always show all 3 (mock)
      if (storeResults) {
        storeResults.style.opacity = '1';
        storeResults.style.transform = 'translateY(0)';
      }
    }, 280);
  }

  searchBtn?.addEventListener('click', doSearch);
  zipInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });


  /* ----------------------------------------------------------
     11. NEWSLETTER FORM
     ---------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletter-form');

  newsletterForm?.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const btn   = newsletterForm.querySelector('button');

    if (!input?.value.trim()) return;

    if (btn) {
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#059669';
      input.value = '';
      input.disabled = true;
    }
    setTimeout(() => {
      if (btn) { btn.textContent = 'Subscribe'; btn.style.background = ''; }
      if (input) input.disabled = false;
    }, 5000);
  });


  /* ----------------------------------------------------------
     12. MARQUEE — duplicate content for seamless loop
     ---------------------------------------------------------- */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const originalContent = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = originalContent + originalContent;
  }


  /* ----------------------------------------------------------
     13. LAZY PARALLAX ON HERO DECORATION
     ---------------------------------------------------------- */
  const heroDeco = document.getElementById('hero-deco-circle');
  if (heroDeco) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.25;
      heroDeco.style.transform = `translateY(${y}px)`;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     14. FLAVOR CATALOG PAGE — Filter, Sort, Search
     ---------------------------------------------------------- */
  const filterChips    = document.querySelectorAll('.filter-chip');
  const sortSelect     = document.getElementById('sort-select');
  const catalogSearch  = document.getElementById('catalog-search');
  const flavorCards    = document.querySelectorAll('.flavor-card-detail');
  const resultsCountEl = document.getElementById('results-count');
  const noResultsEl    = document.getElementById('no-results');

  if (filterChips.length && flavorCards.length) {
    let activeFilter = 'all';
    let activeSort   = 'default';
    let searchQuery  = '';

    function getCardMeta(card) {
      return {
        category: card.dataset.category || '',
        price:    parseFloat(card.dataset.price) || 0,
        name:     (card.dataset.name    || '').toLowerCase(),
        order:    parseInt(card.dataset.order)   || 0,
        isNew:    card.dataset.new      === 'true',
      };
    }

    function applyFiltersAndSort() {
      const grid = document.getElementById('flavor-catalog-grid');
      if (!grid) return;

      let visible   = 0;
      const cardArr = Array.from(flavorCards);

      // 1. Filter visibility
      cardArr.forEach(card => {
        const { category, name } = getCardMeta(card);
        const matchFilter = activeFilter === 'all' || category.split(' ').includes(activeFilter);
        const matchSearch = !searchQuery || name.includes(searchQuery);
        const show = matchFilter && matchSearch;
        card.dataset.hidden = show ? 'false' : 'true';
        card.style.display  = show ? '' : 'none';
        if (show) visible++;
      });

      // 2. Sort visible cards
      const visibleCards = cardArr.filter(c => c.dataset.hidden !== 'true');
      visibleCards.sort((a, b) => {
        const am = getCardMeta(a), bm = getCardMeta(b);
        if (activeSort === 'price-asc')  return am.price - bm.price;
        if (activeSort === 'price-desc') return bm.price - am.price;
        if (activeSort === 'name-asc')   return am.name.localeCompare(bm.name);
        if (activeSort === 'newest')     return (bm.isNew ? 1 : 0) - (am.isNew ? 1 : 0);
        return am.order - bm.order;
      });

      // 3. Re-append in sorted order
      visibleCards.forEach(card => grid.appendChild(card));

      // 4. Update results count
      if (resultsCountEl) {
        resultsCountEl.innerHTML =
          `Showing <strong>${visible}</strong> of <strong>${flavorCards.length}</strong> flavors`;
      }

      // 5. No-results state
      if (noResultsEl) noResultsEl.classList.toggle('hidden', visible > 0);

      // 6. Re-trigger scroll reveals
      visibleCards.forEach((card, i) => {
        card.classList.remove('revealed');
        card.style.transitionDelay = `${i * 55}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('revealed')));
      });
    }

    // Filter chips
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.dataset.filter;
        applyFiltersAndSort();
      });
    });

    // Sort dropdown
    sortSelect?.addEventListener('change', e => {
      activeSort = e.target.value;
      applyFiltersAndSort();
    });

    // Live search
    let searchDebounce;
    catalogSearch?.addEventListener('input', e => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyFiltersAndSort();
      }, 220);
    });

    // Initial render
    applyFiltersAndSort();
  }

  /* ----------------------------------------------------------
     15. WISHLIST TOGGLE (Flavor Catalog)
     ---------------------------------------------------------- */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
      const on = this.classList.contains('active');
      this.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
    });
  });

  /* ----------------------------------------------------------
     16. INTERACTIVE CINEMATIC CANVAS POPCORN PHYSICS
     ---------------------------------------------------------- */
  const canvas = document.getElementById('popcorn-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('hero');
    const heroImage = document.getElementById('hero-image');

    // Preload image assets
    const imgCorn1 = new Image();
    imgCorn1.src = 'Assets/corn1.png';
    const imgCorn2 = new Image();
    imgCorn2.src = 'Assets/corn2.png';
    const cornImages = [imgCorn1, imgCorn2];

    let canvasWidth = 0;
    let canvasHeight = 0;

    function resizeCanvas() {
      if (!heroSection) return;
      canvasWidth = heroSection.clientWidth;
      canvasHeight = heroSection.clientHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse interactive state
    const mouse = { x: -1000, y: -1000, active: false };
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    class PopcornPiece {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        this.x = Math.random() * canvasWidth;
        // If initial, scatter vertically; otherwise start above screen
        this.y = isInitial ? Math.random() * (canvasHeight * 0.7) - 100 : -50;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 2 + 1;
        this.gravity = 0.12 + Math.random() * 0.08;
        this.size = Math.random() * 22 + 20; // 20px to 42px scale
        this.angle = Math.random() * Math.PI * 2;
        this.vAngle = (Math.random() - 0.5) * 0.04;
        this.img = cornImages[Math.floor(Math.random() * cornImages.length)];
        this.bounces = 0;
        this.opacity = 1;
        this.isInsideBucket = false;
        this.life = 1.0;
      }

      update(heroRect) {
        // Apply physics
        this.vy += this.gravity;
        this.vy *= 0.99; // Vertical friction
        this.vx *= 0.985; // Horizontal friction
        
        // Wind drift
        this.vx += Math.sin(Date.now() * 0.0012 + this.x * 0.01) * 0.04;

        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.vAngle;

        // Bouncing/collision with cursor
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const force = (90 - dist) / 90;
            const forceAngle = Math.atan2(dy, dx);
            this.vx += Math.cos(forceAngle) * force * 2.2;
            this.vy += Math.sin(forceAngle) * force * 2.2;
            this.vAngle += (Math.random() - 0.5) * 0.08;
          }
        }

        // Bouncing/collision with bucket rim
        if (heroImage && heroRect && !this.isInsideBucket) {
          const imgX = heroRect.left;
          const imgY = heroRect.top;
          const imgW = heroRect.width;
          const imgH = heroRect.height;

          // Define collision rim at the top of the bucket
          // PopCraft gourmet popcorn bucket is centered in the image
          const rimMinX = imgX + imgW * 0.22;
          const rimMaxX = imgX + imgW * 0.78;
          const rimY = imgY + imgH * 0.35; // Top opening of the bucket in Hero.png

          if (this.x > rimMinX && this.x < rimMaxX) {
            // Slight concave dipping curve for bucket opening
            const dx = (this.x - (rimMinX + rimMaxX) / 2) / (rimMaxX - rimMinX); // -0.5 to 0.5
            const rimCurveY = rimY + Math.abs(dx) * 10;

            if (this.y + this.size / 2 >= rimCurveY && this.y - this.size / 2 <= rimCurveY + 20 && this.vy > 0) {
              if (this.bounces < 2) {
                // Bounce!
                this.vy = -this.vy * (0.35 + Math.random() * 0.15); // Reverse and dampen velocity
                this.vx = (this.x - (imgX + imgW / 2)) / (imgW / 2) * 2.5 + (Math.random() - 0.5) * 1.5;
                this.vAngle = (Math.random() - 0.5) * 0.2;
                this.bounces++;
                // Push slightly out of bounds to avoid repeating checks
                this.y = rimCurveY - this.size / 2 - 2;
              } else {
                // Fades into bucket
                this.isInsideBucket = true;
              }
            }
          }
        }

        // Slide into bucket fading logic
        if (this.isInsideBucket) {
          this.opacity -= 0.045;
          this.vy *= 0.84;
          this.vx *= 0.84;
        }

        // Boundary checks
        if (this.y > canvasHeight + 60 || this.x < -60 || this.x > canvasWidth + 60) {
          return false;
        }
        if (this.opacity <= 0.02) {
          return false;
        }

        return true;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const particles = [];
    const maxParticles = 35;
    let spawnTimer = 0;
    const spawnInterval = 380; // milliseconds
    let lastTime = 0;

    // Fill screen with some initial scattered particles so it has kernels from start
    for (let i = 0; i < 8; i++) {
      particles.push(new PopcornPiece(true));
    }

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const dt = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Get image rect bounds
      let heroRect = null;
      if (heroImage) {
        const imgBounds = heroImage.getBoundingClientRect();
        const canvasBounds = canvas.getBoundingClientRect();
        heroRect = {
          left: imgBounds.left - canvasBounds.left,
          top: imgBounds.top - canvasBounds.top,
          width: imgBounds.width,
          height: imgBounds.height
        };
      }

      // Update and draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.update(heroRect)) {
          p.draw();
        } else {
          particles.splice(i, 1);
        }
      }

      // Spawn manager
      spawnTimer += dt;
      if (spawnTimer >= spawnInterval && particles.length < maxParticles) {
        spawnTimer = 0;
        particles.push(new PopcornPiece(false));
      }

      requestAnimationFrame(animate);
    }

    // Load control
    let loadedCount = 0;
    let animationStarted = false;
    function assetLoaded() {
      loadedCount++;
      if (loadedCount >= cornImages.length && !animationStarted) {
        animationStarted = true;
        requestAnimationFrame(animate);
      }
    }

    imgCorn1.onload = assetLoaded;
    imgCorn2.onload = assetLoaded;
    
    // Fallback if cached
    if (imgCorn1.complete) assetLoaded();
    if (imgCorn2.complete) assetLoaded();
  }

  /* ----------------------------------------------------------
     17. HOME 2 - BEVERAGE PAIRING TOOL
     ---------------------------------------------------------- */
  const pairingOptions = document.querySelectorAll('.pairing-option');
  const pairingResultBox = document.getElementById('pairing-result-box');

  const PAIRINGS = {
    wine: {
      title: "Chardonnay / Pinot Noir & Truffle Parmesan",
      desc: "The buttery, rich profile of an oak-aged Chardonnay matches our white truffle aroma perfectly, while a light Pinot Noir brings out the earthiness of real aged Parmesan.",
      image: "Assets/fla1.jpg",
      flavor: "Truffle Parmesan",
      intensity: "70%",
      notes: ["Black Truffle", "Aged Parmesan", "Sea Salt"]
    },
    beer: {
      title: "Crisp IPA & Sriracha Lime",
      desc: "A hoppy, crisp India Pale Ale cuts right through the bold heat of our sriracha glaze, with the lime zest highlighting citrusy hop notes.",
      image: "Assets/fla8.jpg",
      flavor: "Sriracha Lime",
      intensity: "80%",
      notes: ["Sriracha", "Key Lime", "Black Pepper"]
    },
    coffee: {
      title: "Dark Roast Espresso & Miso Butterscotch",
      desc: "The bold bitterness of dark roast coffee or espresso creates a spectacular contrast with the buttery, sweet, and salty umami notes of our miso butterscotch.",
      image: "Assets/fla7.jpg",
      flavor: "Miso Butterscotch",
      intensity: "60%",
      notes: ["White Miso", "Butterscotch", "Demerara Sugar"]
    },
    tea: {
      title: "Ceremonial Matcha & Matcha White Chocolate",
      desc: "Earthy, green ceremonial matcha tea balances the sweet, creamy notes of white chocolate, creating a clean and sophisticated afternoon pairing.",
      image: "Assets/fla3.jpg",
      flavor: "Matcha White Chocolate",
      intensity: "55%",
      notes: ["Ceremonial Matcha", "White Chocolate", "Coconut Sugar"]
    }
  };

  if (pairingOptions.length && pairingResultBox) {
    pairingOptions.forEach(option => {
      option.addEventListener('click', () => {
        const beverage = option.getAttribute('data-beverage');
        const data = PAIRINGS[beverage];
        if (!data) return;

        // Toggle active class
        pairingOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Fade out result box, update, and fade in
        pairingResultBox.classList.remove('show');
        
        setTimeout(() => {
          pairingResultBox.innerHTML = `
            <div class="flex flex-col md:flex-row gap-6 items-start">
              <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[var(--border-color)]">
                <img src="${data.image}" alt="${data.flavor}" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <div style="font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent-gold); margin-bottom: 0.35rem;">Recommended Pairing</div>
                <h4 class="font-display text-xl font-bold mb-2" style="color: var(--text-primary);">${data.title}</h4>
                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${data.desc}</p>
                
                <div class="flex flex-wrap items-center gap-6 mt-4">
                  <div>
                    <span style="font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary);">Flavor</span>
                    <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">${data.flavor}</div>
                  </div>
                  <div>
                    <span style="font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary);">Intensity</span>
                    <div style="font-size: 0.9rem; font-weight: 600; color: var(--accent-gold);">${data.intensity}</div>
                  </div>
                  <div>
                    <span style="font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary);">Notes</span>
                    <div class="flex flex-wrap gap-1.5 mt-1">
                      ${data.notes.map(n => `<span class="flavor-note-pill" style="font-size: 0.62rem; padding: 0.1rem 0.5rem; background: var(--bg-surface-2); border: 1px solid var(--border-color); border-radius: 20px; color: var(--text-secondary);">${n}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          pairingResultBox.classList.add('show');
        }, 250);
      });
    });

    // Trigger first item
    pairingOptions[0]?.click();
  }

  /* ----------------------------------------------------------
     18. HOME 2 - TASTING FLIGHT BUILDER
     ---------------------------------------------------------- */
  const flightSlots = document.querySelectorAll('.flight-slot');
  const flightAddBtns = document.querySelectorAll('.flight-add-btn');
  const flightOrderBtn = document.getElementById('flight-order-btn');
  let flightState = [null, null, null]; // holds { name: '...', image: '...' } or null

  function updateFlightUI() {
    flightSlots.forEach((slot, idx) => {
      const item = flightState[idx];
      if (item) {
        slot.classList.add('filled');
        slot.innerHTML = `
          <button class="flight-remove-btn" data-idx="${idx}" aria-label="Remove ${item.name}">✕</button>
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-full" />
          <span class="flight-slot-label">${item.name}</span>
        `;
        // Bind remove event
        slot.querySelector('.flight-remove-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          removeFlightItem(idx);
        });
      } else {
        slot.classList.remove('filled');
        slot.innerHTML = `
          <span style="font-size: 1.25rem; color: var(--text-secondary); opacity: 0.5;">+</span>
          <span class="flight-slot-label">Slot ${idx + 1}</span>
        `;
      }
    });

    // Enable/disable order button
    if (flightOrderBtn) {
      const filledCount = flightState.filter(Boolean).length;
      if (filledCount === 3) {
        flightOrderBtn.disabled = false;
        flightOrderBtn.textContent = "Order Custom Flight Box ($39.99)";
        flightOrderBtn.style.opacity = "1";
        flightOrderBtn.style.cursor = "pointer";
      } else {
        flightOrderBtn.disabled = true;
        flightOrderBtn.textContent = `Select ${3 - filledCount} More Flavor${3 - filledCount > 1 ? 's' : ''}`;
        flightOrderBtn.style.opacity = "0.6";
        flightOrderBtn.style.cursor = "not-allowed";
      }
    }
  }

  function addFlightItem(name, image) {
    const emptyIdx = flightState.indexOf(null);
    if (emptyIdx === -1) {
      showToast("Your Flight Box is full! Remove an item to add another.");
      return;
    }
    flightState[emptyIdx] = { name, image };
    updateFlightUI();
    showToast(`${name} added to slot ${emptyIdx + 1}!`);
  }

  function removeFlightItem(idx) {
    const item = flightState[idx];
    flightState[idx] = null;
    updateFlightUI();
    if (item) {
      showToast(`Removed ${item.name} from slot ${idx + 1}`);
    }
  }

  if (flightSlots.length) {
    flightAddBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-flavor');
        const image = btn.getAttribute('data-image') || 'Assets/fla1.jpg';
        addFlightItem(name, image);
      });
    });

    if (flightOrderBtn) {
      flightOrderBtn.addEventListener('click', () => {
        const items = flightState.filter(Boolean).map(i => i.name).join(', ');
        cartCount++;
        if (cartCountEl) cartCountEl.textContent = cartCount;
        showToast(`Added Flight Box (${items}) to cart!`);
        // Reset state
        flightState = [null, null, null];
        updateFlightUI();
      });
    }

    // Initialize UI
    updateFlightUI();
  }

  /* ----------------------------------------------------------
     19. HOME 2 - INTERACTIVE PROCESS TIMELINE
     ---------------------------------------------------------- */
  const processSteps = document.querySelectorAll('.process-step-trigger');
  const processContent = document.getElementById('process-detail-content');

  const PROCESS_DETAILS = {
    1: {
      title: "1. Premium Seed Selection",
      desc: "We source our single-origin organic kernels exclusively from heritage farms in Nebraska and Indiana. We select only the highest density kernels to ensure maximum expansion and fluffiness when popped.",
      tip: "We use white mushroom kernels for caramel coating and butterfly kernels for savory rubs."
    },
    2: {
      title: "2. Precision Air-Popping",
      desc: "Instead of bathing kernels in oil, we pop them using dry high-velocity air at exactly 460°F. This creates a clean, crunchier canvas and eliminates heavy oil odors.",
      tip: "Air-popping preserves the organic grain's natural fiber and nutty aroma."
    },
    3: {
      title: "3. Small-Batch Seasoning",
      desc: "Each batch is transferred to a hand-rotated copper drum. We drizzle warm organic ghee or olive oil, then hand-dust our signature custom-ground spice blends.",
      tip: "This ensures every single kernel has perfect, even coverage without getting soggy."
    },
    4: {
      title: "4. Slow-Bake Curing",
      desc: "After seasoning, the popcorn is slowly cured in warm ovens for 12 minutes to set the flavor profile and locked-in caramel crunchiness.",
      tip: "Bake-curing ensures that the crunch stays fresh for weeks without any artificial preservatives."
    }
  };

  if (processSteps.length && processContent) {
    processSteps.forEach(step => {
      step.addEventListener('click', () => {
        const stepNum = step.getAttribute('data-step');
        const data = PROCESS_DETAILS[stepNum];
        if (!data) return;

        // Update active class
        processSteps.forEach(s => {
          s.classList.remove('active');
          s.style.borderColor = 'var(--border-color)';
        });
        step.classList.add('active');
        step.style.borderColor = 'var(--accent-gold)';

        // Update content
        processContent.innerHTML = `
          <h4 class="font-display text-2xl font-bold mb-3" style="color:var(--text-primary)">${data.title}</h4>
          <p class="leading-relaxed mb-4" style="color:var(--text-secondary); font-size: 0.95rem;">${data.desc}</p>
          <div class="p-4 rounded" style="background: var(--bg-surface-2); border-left: 3px solid var(--accent-gold);">
            <div style="font-size:0.75rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--accent-gold); margin-bottom: 0.25rem;">Pro Tip</div>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${data.tip}</p>
          </div>
        `;
      });
    });

    // Click first step to init
    processSteps[0]?.click();
  }

  /* ----------------------------------------------------------
     23. AUTH FORM HANDLING (LOGIN & SIGNUP)
     ---------------------------------------------------------- */
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();

    if (!email || !password) {
      showToast('Please fill out all fields.');
      return;
    }

    // Simulate login success
    showToast('✓ Successfully logged in! Redirecting...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });

  signupForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const password = document.getElementById('signup-password')?.value.trim();
    const confirm = document.getElementById('signup-confirm')?.value.trim();
    const terms = document.getElementById('terms')?.checked;

    if (!name || !email || !password || !confirm) {
      showToast('Please fill out all fields.');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      showToast('Passwords do not match.');
      return;
    }

    if (!terms) {
      showToast('You must agree to the Terms of Service.');
      return;
    }

    // Simulate signup success
    showToast('✓ Account created successfully! Redirecting...');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  });

  // Bind simulated Apple / Google clicks
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.querySelector('span')?.textContent.trim() || 'Social';
      showToast(`Redirecting to ${provider} authentication...`);
      setTimeout(() => {
        showToast(`✓ Authenticated via ${provider}!`);
      }, 1500);
    });
  });

  // Contact Form Simulator (Find Us page)
  const contactForm = document.getElementById('findus-contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const subject = document.getElementById('contact-subject')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all fields.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const origContent = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending...`;
    submitBtn.style.background = 'var(--text-secondary)';

    setTimeout(() => {
      showToast('✓ Message sent successfully! We will contact you soon.');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = origContent;
      submitBtn.style.background = '';
    }, 1500);
  });

  /* ----------------------------------------------------------
     24. STATS COUNTER ANIMATION (Index Page)
     ---------------------------------------------------------- */
  const statsSection = document.getElementById('stats-strip');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statsSection && statNumbers.length) {
    const animateCounters = () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const suffix = stat.getAttribute('data-suffix') || '';
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          // Easing out quad
          const easeProgress = progress * (2 - progress);
          const currentValue = Math.floor(easeProgress * target);

          stat.innerHTML = `${currentValue}${suffix}<span style="font-size:2rem">+</span>`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            stat.innerHTML = `${target}${suffix}<span style="font-size:2rem">+</span>`;
          }
        };

        requestAnimationFrame(updateCounter);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }

  /* ----------------------------------------------------------
     18. BLOG PAGE — Filter, Search, and Modal Detail View
     ---------------------------------------------------------- */
  const blogChips = document.querySelectorAll('.blog-filter-chip');
  const blogSearch = document.getElementById('blog-search');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogModal = document.getElementById('blog-modal');
  const blogModalClose = document.getElementById('blog-modal-close');
  
  if (blogCards.length > 0) {
    let activeFilter = 'all';
    let searchQuery = '';
    
    function applyBlogFilters() {
      let visible = 0;
      blogCards.forEach(card => {
        const category = card.dataset.category || '';
        const title = (card.dataset.title || '').toLowerCase();
        const excerpt = (card.dataset.excerpt || '').toLowerCase();
        
        const matchesFilter = activeFilter === 'all' || category.split(' ').includes(activeFilter);
        const matchesSearch = !searchQuery || title.includes(searchQuery) || excerpt.includes(searchQuery);
        
        const show = matchesFilter && matchesSearch;
        card.dataset.hidden = show ? 'false' : 'true';
        card.style.display = show ? '' : 'none';
        
        if (show) visible++;
      });
      
      const noResults = document.getElementById('blog-no-results');
      if (noResults) {
        noResults.classList.toggle('hidden', visible > 0);
      }
      
      // Re-trigger reveal animation for visible cards
      const visibleCards = Array.from(blogCards).filter(c => c.dataset.hidden !== 'true');
      visibleCards.forEach((card, i) => {
        card.classList.remove('revealed');
        card.style.transitionDelay = `${i * 40}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('revealed')));
      });
    }
    
    blogChips.forEach(chip => {
      chip.addEventListener('click', () => {
        blogChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.dataset.filter;
        applyBlogFilters();
      });
    });
    
    let searchDebounce;
    blogSearch?.addEventListener('input', e => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyBlogFilters();
      }, 200);
    });
    
    // Article Content Database (high-fidelity data)
    const ARTICLE_DATA = {
      'heirloom-grains': {
        tag: 'Artisan Craft',
        title: 'The Secret to the Perfect Crunch: Heirloom Grains Explained',
        date: 'June 8, 2026',
        readTime: '5 min read',
        author: 'Marcus Vance · Sourcing Lead',
        image: 'Assets/ind1.jpg',
        content: `
          <p>Have you ever wondered why some popcorn is light, fluffy, and tender, while other kernels pop into small, dense, and tooth-cracking shards? The secret isn't the temperature of the oil or the shape of the pot — it's the genetics of the grain itself.</p>
          <p>At PopCraft, we strictly source non-GMO heirloom heritage grains. These ancient grains have been preserved by family farms for generations, selected for their thin, soft hulls that break down completely during the popping process. This means virtually zero hulls get stuck in your teeth, resulting in a cleaner, more enjoyable crunch.</p>
          <h2>The Anatomy of a Kernel</h2>
          <p>Every popcorn kernel contains a tiny droplet of water surrounded by a hard circle of starch. When heated, the water turns to steam, creating pressure. Once the hull can no longer hold the pressure, it explodes. Our heirloom grains pop up to 40 times their original size, creating huge surface areas designed to catch and hold our hand-tossed spices.</p>
          <blockquote>"The standard commercial popcorn kernel has been bred for durability during machine harvesting and cross-country transport — not for taste. Heirloom grains, on the other hand, are bred entirely for flavor, texture, and aroma."</blockquote>
          <h3>Why Non-GMO Matters</h3>
          <p>By keeping our grains completely non-hybridized and organic, we preserve the rich, nutty corn flavor that is lost in industrialized farming. When you bite into PopCraft popcorn, you are tasting the grain exactly as nature intended.</p>
        `
      },
      'wine-pairing': {
        tag: 'Recipes',
        title: 'Popcorn & Fine Wine: The Ultimate Pairing Guide',
        date: 'May 28, 2026',
        readTime: '7 min read',
        author: 'Elena Rostova · Flavor Sommelier',
        image: 'Assets/ind2.jpg',
        content: `
          <p>Think popcorn is just for movie nights and soda cans? Think again. The world of gourmet snack pairings is rapidly evolving, and our artisan popcorn is finding its place on the most sophisticated tasting menus. With its complex fat, salt, and acid profiles, PopCraft popcorn makes a surprising and delicious companion to fine wines.</p>
          <p>Here is our official sommelier guide to bringing your next wine and popcorn tasting to life.</p>
          <h2>1. Truffle Parmesan & Oaked Chardonnay</h2>
          <p>The rich, earthy flavors of our shaved black truffle and the sharp tang of 24-month aged Parmigiano-Reggiano demand a wine with body. An oaked Chardonnay from Napa Valley offers buttery tones and balanced acidity that slice through the richness of the cheese while complementing the woodsy truffle notes.</p>
          <h2>2. Spicy Caramel & Off-Dry Riesling</h2>
          <p>Spicy foods can easily overwhelm a highly tannic red wine. Instead, pair our fiery cayenne-infused Spicy Caramel with a chilled, off-dry German Riesling. The subtle sweetness of the wine tempers the heat, while its vibrant, crisp acidity cleanses the palate after each buttery bite.</p>
          <blockquote>"A great pairing is a conversation. One element highlights what is hidden in the other."</blockquote>
          <h2>3. Classic Sea Salt & Champagne</h2>
          <p>When in doubt, go classic. The natural salinity of Breton fleur de sel combined with grass-fed cultured butter is a match made in heaven for the high acidity and effervescence of a true French Champagne or a premium Cava. The bubbles cut through the fat, creating a light, airy flavor sensation.</p>
        `
      },
      'sourcing-lavender': {
        tag: 'Sourcing',
        title: 'Behind the Scenes: Sourcing Lavender from Provence',
        date: 'May 15, 2026',
        readTime: '6 min read',
        author: 'Chloé Mercier · Botanical Buyer',
        image: 'Assets/ind3.jpg',
        content: `
          <p>Every spring, the hills of Provence, France, transform into a rolling sea of vibrant purple. This is the home of <em>Lavandula angustifolia</em>, the culinary-grade lavender that gives our seasonal Lavender Honey popcorn its signature floral notes.</p>
          <p>Sourcing botanical ingredients for gourmet foods is a delicate craft. Too much lavender, and the popcorn tastes like soap; too little, and the botanical aroma is lost. Here is how we ensure we get the perfect harvest every year.</p>
          <h2>The Altitude Difference</h2>
          <p>True culinary lavender grows best at high altitudes (above 800 meters). At these elevations, the plants grow slower, concentrating their essential oils and producing a sweeter, less camphorous aroma. We partner with a family-owned cooperative in the Luberon Valley that has been harvesting lavender by hand for over a century.</p>
          <blockquote>"We harvest during the brief two-week window in July when the flowers are in full bloom and the bees are most active. This is when the sugar content in the nectar is at its absolute peak."</blockquote>
          <h3>The Drying Process</h3>
          <p>Once harvested, the flowers are naturally dried in the Provencal sun before the buds are gently shaken from the stems. These pure, fragrant buds are then shipped directly to our kitchen, where they are infused into warm organic wildflower honey to glaze our fresh-popped kernels.</p>
        `
      },
      'taste-science': {
        tag: 'Science',
        title: 'Sweet vs. Savory: The Science of Taste Balancing',
        date: 'April 29, 2026',
        readTime: '4 min read',
        author: 'Dr. Aris Thorne · Food Scientist',
        image: 'Assets/ind4.jpg',
        content: `
          <p>Why is it that after eating a bag of salty chips, we immediately crave something sweet? And after eating chocolate, why do we want a salty pretzel? This is not just a lack of self-control; it's a physiological phenomenon known as sensory-specific satiety, and it lies at the heart of our flavor development process.</p>
          <h2>The Magic of Contrast</h2>
          <p>Our brains are wired to seek out a variety of nutrients. When we consume salt, our tongue's sweet receptors (specifically a protein called SGLT1) are activated, preparing our body to absorb sugars. By combining these two contrasting flavors in a single snack, we create a tasting loop that keeps the palate excited.</p>
          <blockquote>"By balancing sweet butterscotch with Japanese shiro miso, we satisfy both cravings simultaneously, achieving what food scientists call 'hedonic escalation' — where each bite tastes even better than the last."</blockquote>
          <h2>Designing Miso Butterscotch</h2>
          <p>When developing our Miso Butterscotch flavor, we tested over thirty ratios of salt, sugar, and umami. The key was shiro (white) miso. It offers a mild, creamy salinity and fermented depth that tempers the sweet intensity of Demerara sugar, creating a perfect balance that never fatigue your tastebuds.</p>
        `
      },
      'our-story': {
        tag: 'Company',
        title: 'The Story of PopCraft: From a Single Copper Kettle',
        date: 'April 10, 2026',
        readTime: '8 min read',
        author: 'Abigail Sterling · Founder',
        image: 'Assets/ind5.jpg',
        content: `
          <p>Before PopCraft was in boutique stores and kitchens across the country, it was just a smell. A warm, rich, buttery aroma wafting out of a small garage in Brooklyn, New York.</p>
          <p>It started in 2019 with a single, battered copper kettle, a bag of Indiana heirloom corn, and a simple question: Why has popcorn been relegated to cheap stadium food and microwave bags filled with chemicals?</p>
          <h2>The Early Batches</h2>
          <p>For the first six months, I burned more corn than I popped. I experimented with different oils — olive, avocado, sunflower — before discovering that organic, cold-pressed coconut oil provided the cleanest, light-tasting base. I hand-stirred every batch with a wooden paddle, testing spice blends on friends and neighbors.</p>
          <blockquote>"We sold our first fifty bags at a local farmers' market. They sold out in twenty minutes. That's when I knew we were onto something."</blockquote>
          <h3>Growing But Staying Small</h3>
          <p>Today, while our kitchen has grown, our core philosophy remains unchanged. We still pop in relatively small batches. We still toss our seasonings by hand. We refuse to use artificial preservatives, colors, or flavor enhancers. Because some things are simply better made the hard way.</p>
        `
      },
      'topping-bars': {
        tag: 'Recipes',
        title: 'Upgrade Your Movie Night: Gourmet Popcorn Topping Bars',
        date: 'March 20, 2026',
        readTime: '5 min read',
        author: 'Elena Rostova · Flavor Sommelier',
        image: 'Assets/ind6.jpg',
        content: `
          <p>The standard movie night is getting an upgrade. While a bag of warm, salted popcorn is always a classic, setting up an interactive gourmet topping bar is an easy way to turn a simple night in into a memorable tasting party.</p>
          <p>Whether you're hosting a birthday, a movie marathon, or a casual get-together, here is how to build the ultimate popcorn bar.</p>
          <h2>The Base Selection</h2>
          <p>Start with three distinct bases. We recommend our **Classic Sea Salt** (neutral savory), **Truffle Parmesan** (rich savory), and **Spicy Caramel** (sweet/spicy). This ensures all your guests have a canvas that suits their preferences.</p>
          <h2>Elevated Toppings</h2>
          <p>Set out small bowls filled with gourmet mix-ins. Some of our favorite combinations include:</p>
          <ul>
            <li><strong>The Mediterranean:</strong> Toasted pine nuts, finely crumbled feta, and fresh rosemary needles to mix into Classic Sea Salt.</li>
            <li><strong>The Sweet Treat:</strong> Dark chocolate shavings, freeze-dried raspberries, and toasted coconut flakes to pair with Spicy Caramel.</li>
            <li><strong>The Umami Bomb:</strong> Furikake seasoning, toasted sesame seeds, and a light drizzle of sriracha on Truffle Parmesan.</li>
          </ul>
          <blockquote>"Let your guests experiment. Popcorn is the ultimate culinary chameleon."</blockquote>
        `
      }
    };
    
    // Open modal handler
    const openModal = (articleId) => {
      const article = ARTICLE_DATA[articleId];
      if (!article || !blogModal) return;
      
      // Populate content
      const tagEl = blogModal.querySelector('.blog-modal-tag');
      const titleEl = blogModal.querySelector('.blog-modal-title');
      const metaEl = blogModal.querySelector('.blog-modal-meta');
      const imgWrap = blogModal.querySelector('.blog-modal-hero-img-wrap');
      const bodyEl = blogModal.querySelector('.blog-modal-body-text');
      
      if (tagEl) tagEl.textContent = article.tag;
      if (titleEl) titleEl.textContent = article.title;
      if (metaEl) {
        metaEl.innerHTML = `
          <span>${article.date}</span>
          <div style="width:4px; height:4px; border-radius:50%; background:var(--text-secondary); margin: 0 4px; display: inline-block; vertical-align: middle;"></div>
          <span>${article.readTime}</span>
          <div style="width:4px; height:4px; border-radius:50%; background:var(--text-secondary); margin: 0 4px; display: inline-block; vertical-align: middle;"></div>
          <span>${article.author}</span>
        `;
      }
      if (imgWrap) {
        imgWrap.innerHTML = `<img src="${article.image}" alt="${article.title}" class="blog-modal-hero-img" />`;
      }
      if (bodyEl) bodyEl.innerHTML = article.content;
      
      // Open modal
      blogModal.classList.add('open');
      blogModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Accessibility: trap focus
      const closeBtn = blogModal.querySelector('.blog-modal-close-btn');
      closeBtn?.focus();
    };
    
    // Close modal handler
    const closeModal = () => {
      if (!blogModal) return;
      blogModal.classList.remove('open');
      blogModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    
    // Wire up blog cards and read-more buttons
    blogCards.forEach(card => {
      const articleId = card.dataset.id;
      if (!articleId) return;
      
      // Clicking the card title, image, or read more button opens the modal
      const clickableElements = card.querySelectorAll('.blog-card-title, .blog-card-img-wrap, .blog-card-read-more');
      clickableElements.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          openModal(articleId);
        });
      });
    });
    
    // Featured post click
    const featuredPost = document.querySelector('.featured-blog-post');
    if (featuredPost) {
      const articleId = featuredPost.dataset.id;
      if (articleId) {
        const clickable = featuredPost.querySelectorAll('.fbp-title, .fbp-img, .fbp-read-more');
        clickable.forEach(el => {
          el.style.cursor = 'pointer';
          el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(articleId);
          });
        });
      }
    }
    
    // Close events
    blogModalClose?.addEventListener('click', closeModal);
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && blogModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Universal Password Visibility Toggle
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.relative');
      const input = container?.querySelector('input');
      if (!input) return;
      
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');
      
      eyeOpen?.classList.toggle('hidden', !isPassword);
      eyeClosed?.classList.toggle('hidden', isPassword);
    });
  });

}); // END DOMContentLoaded


// END DOMContentLoaded

