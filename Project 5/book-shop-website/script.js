(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (document.body.classList.contains('dashboard-page')) return;

  /* ---------- LOADER ---------- */
  const loaderEl = document.getElementById('loader');
  if (loaderEl) {
    window.addEventListener('load', () => { setTimeout(() => loaderEl.classList.add('loaded'), 500); });
  }

  /* ---------- THEME ---------- */
  const root = document.documentElement;
  const sun = $('#icon-sun'), moon = $('#icon-moon');
  
  // Preload hero images to prevent flickering on theme toggle
  const imgLight = new Image(); imgLight.src = 'Assets/heroimage.png';
  const imgDark = new Image(); imgDark.src = 'Assets/home1herodark.png';

  const applyTheme = (dark) => {
    root.classList.toggle('dark', dark);
    if (sun) sun.style.opacity = dark ? 0 : 1;
    if (moon) moon.style.opacity = dark ? 1 : 0;
    
    const heroLightEl = $('#hero-img-light');
    const heroDarkEl = $('#hero-img-dark');
    if (heroLightEl && heroDarkEl) {
      if (dark) {
        heroLightEl.classList.add('hidden');
        heroDarkEl.classList.remove('hidden');
      } else {
        heroDarkEl.classList.add('hidden');
        heroLightEl.classList.remove('hidden');
      }
    }
  };
  const saved = localStorage.getItem('mf-theme');
  applyTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  const themeToggleBtn = $('#theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const dark = !root.classList.contains('dark');
      applyTheme(dark);
      localStorage.setItem('mf-theme', dark ? 'dark' : 'light');
    });
  }

  /* ---------- RTL TOGGLE ---------- */
  const applyRTL = (rtl) => {
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    const btns = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile');
    btns.forEach(b => { if (b) b.textContent = rtl ? 'LTR' : 'RTL'; });
    localStorage.setItem('mf-rtl', rtl ? '1' : '0');
  };
  const savedRTL = localStorage.getItem('mf-rtl') === '1';
  applyRTL(savedRTL);
  document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile').forEach(btn => {
    if (btn) btn.addEventListener('click', () => applyRTL(root.getAttribute('dir') !== 'rtl'));
  });

  /* ---------- NAV: glass on scroll + progress + back to top ---------- */
  const nav = $('#site-nav');
  const progress = $('#progress-bar');
  const backTop = $('#back-to-top');
  if (nav && progress) {
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
      if (backTop) {
        if (y > 600) { backTop.style.opacity = 1; backTop.style.pointerEvents = 'auto'; }
        else { backTop.style.opacity = 0; backTop.style.pointerEvents = 'none'; }
      }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- MOBILE MENU ---------- */
  const menuBtn = $('#menu-toggle'), mobileMenu = $('#mobile-menu');
  if (menuBtn && mobileMenu) {
    let menuOpen = false;
    const toggleMenu = (state) => {
      menuOpen = typeof state === 'boolean' ? state : !menuOpen;
      if (menuOpen) {
        mobileMenu.style.maxHeight = (mobileMenu.scrollHeight + 40) + 'px';
        menuBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.style.maxHeight = '0px';
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    };
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    $$('#mobile-menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('click', (e) => {
      if (menuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1280 && menuOpen) toggleMenu(false);
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- CURSOR SPOTLIGHT ---------- */
  const glow = $('#cursor-glow');
  if (glow && !reduceMotion) {
    document.addEventListener('mousemove', (e) => {
      glow.style.setProperty('--x', e.clientX + 'px');
      glow.style.setProperty('--y', e.clientY + 'px');
    }, { passive: true });
  }

  /* ---------- HERO PARTICLES ---------- */
  const particleField = $('#particles');
  if (particleField && !reduceMotion) {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.bottom = '-10px';
      s.style.animationDuration = (10 + Math.random() * 14) + 's';
      s.style.animationDelay = (Math.random() * 12) + 's';
      s.style.opacity = 0.2 + Math.random() * 0.4;
      particleField.appendChild(s);
    }
  }

  /* ---------- SCROLL REVEALS ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); } });
  }, { threshold: 0.15 });
  $$('.reveal-scroll, .invite-card, .note-card').forEach(el => revealObserver.observe(el));

  // hero text reveal (immediate, staggered)
  requestAnimationFrame(() => setTimeout(() => $$('.reveal').forEach(el => el.classList.add('in')), 300));

  /* ---------- TIMELINE ---------- */
  const timelineItems = $$('.timeline-item');
  const timelineFill = $('#timeline-fill');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
  }, { threshold: 0.4 });
  timelineItems.forEach(el => timelineObserver.observe(el));

  const timelineSection = $('#timeline');
  if (timelineSection) {
    const updateFill = () => {
      const r = timelineSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height;
      const visible = Math.min(Math.max(vh * 0.6 - r.top, 0), total);
      timelineFill.style.height = `${Math.min((visible / total) * 100, 100)}%`;
    };
    document.addEventListener('scroll', updateFill, { passive: true });
    updateFill();
  }

  /* ---------- STAT COUNTERS ---------- */
  const statEls = $$('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { animateCount(en.target); statObserver.unobserve(en.target); } });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  /* ---------- ARRIVALS CAROUSEL ---------- */
  const track = $('#arrivals-track');
  $('#arr-next')?.addEventListener('click', () => track.scrollBy({ left: 260, behavior: 'smooth' }));
  $('#arr-prev')?.addEventListener('click', () => track.scrollBy({ left: -260, behavior: 'smooth' }));

  /* ---------- WISHLIST TOGGLE ---------- */
  $$('.btn-wishlist').forEach(btn => btn.addEventListener('click', () => btn.classList.toggle('active')));

  /* ---------- SEARCH MODAL ---------- */
  const searchModal = $('#search-modal');
  const openSearch = () => {
    searchModal.classList.remove('hidden');
    searchModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#search-input').focus(), 100);
  };
  const closeSearch = () => {
    searchModal.classList.add('hidden');
    searchModal.classList.remove('open');
    document.body.style.overflow = '';
  };
  $('#search-open').addEventListener('click', openSearch);
  $('#search-close').addEventListener('click', closeSearch);
  $('#search-backdrop').addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
  });

  /* ---------- ROTATING LITERARY QUOTES ---------- */
  const quotes = [
    { text: 'A room without books is like a body without a soul.', author: 'Marcus Tullius Cicero' },
    { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway' },
    { text: 'Books are a uniquely portable magic.', author: 'Stephen King' },
    { text: 'The reading of all good books is like conversation with the finest minds of past centuries.', author: 'René Descartes' },
    { text: 'A book is a dream that you hold in your hand.', author: 'Neil Gaiman' },
  ];
  let qi = 0;
  const qText = $('#quote-text'), qAuthor = $('#quote-author');
  if (qText) {
    setInterval(() => {
      qi = (qi + 1) % quotes.length;
      qText.style.opacity = 0; qAuthor.style.opacity = 0;
      setTimeout(() => {
        qText.textContent = quotes[qi].text;
        qAuthor.textContent = `— ${quotes[qi].author}`;
        qText.style.opacity = 1; qAuthor.style.opacity = 1;
      }, 400);
    }, 5000);
  }

  /* ---------- NEWSLETTER FORM ---------- */
  const nlForm = $('#newsletter-form');
  nlForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#newsletter-msg').textContent = '✓ You\u2019re on the list — welcome to the reading room.';
    nlForm.reset();
  });

  /* ---------- SMOOTH ANCHOR CLOSE MOBILE ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
    if (menuOpen) { menuOpen = false; mobileMenu.style.maxHeight = '0px'; }
  }));
})();

/* =====================================================================
   HOME 2 — "THE ENDLESS LIBRARY" interactions
   All blocks guarded so this file stays safe to share with Home 1.
   ===================================================================== */
(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hero = $('#h2-hero');
  if (!hero) return; // not on this page

  /* ---------- HALLWAY PARALLAX (scroll + mouse) ---------- */
  const wallL = $('.h2-wall-l'), wallR = $('.h2-wall-r'), vanish = $('.h2-vanish-glow');
  const spotlight = $('.h2-spotlight');
  if (!reduceMotion) {
    let mx = 0.5, my = 0.5;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      if (spotlight) { spotlight.style.setProperty('--sx', (mx * 100) + '%'); spotlight.style.setProperty('--sy', (my * 100) + '%'); spotlight.style.opacity = 1; }
      const shiftX = (mx - 0.5) * 14;
      const shiftY = (my - 0.5) * 8;
      if (wallL) wallL.style.transform = `rotateY(48deg) translate(${shiftX}px, ${shiftY}px)`;
      if (wallR) wallR.style.transform = `rotateY(-48deg) translate(${shiftX}px, ${shiftY}px)`;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => { if (spotlight) spotlight.style.opacity = 0; });

    document.addEventListener('scroll', () => {
      const r = hero.getBoundingClientRect();
      const p = Math.min(Math.max(-r.top / (r.height || 1), 0), 1);
      if (wallL) wallL.style.filter = `brightness(${1 - p * 0.4})`;
      if (wallR) wallR.style.filter = `brightness(${1 - p * 0.4})`;
      if (vanish) vanish.style.transform = `translate(-50%, ${-50 - p * 12}%) scale(${1 + p * 0.3})`;
    }, { passive: true });
  }

  /* ---------- HALLWAY DUST + FLOATING FRAGMENTS ---------- */
  const dustField = $('#h2-dust');
  if (dustField && !reduceMotion) {
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.bottom = '-10px';
      s.style.animationDuration = (9 + Math.random() * 12) + 's';
      s.style.animationDelay = (Math.random() * 10) + 's';
      dustField.appendChild(s);
    }
  }
  const fragField = $('#h2-fragments');
  if (fragField && !reduceMotion) {
    const shapes = ['📄', '🕊️'];
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div');
      s.className = 'h2-fragment';
      s.style.left = (10 + Math.random() * 80) + '%';
      s.style.bottom = (Math.random() * 30) + '%';
      s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      s.style.animationDuration = (14 + Math.random() * 10) + 's';
      s.style.animationDelay = (Math.random() * 14) + 's';
      s.innerHTML = '<svg width="14" height="18" viewBox="0 0 14 18"><rect width="14" height="18" rx="1" fill="#FAF7F2" opacity="0.6"/></svg>';
      fragField.appendChild(s);
    }
  }

  /* ---------- ANALOG CLOCK ---------- */
  const hourHand = $('.h2-hour'), minHand = $('.h2-min');
  if (hourHand && minHand) {
    const tick = () => {
      const now = new Date();
      const h = now.getHours() % 12, m = now.getMinutes();
      hourHand.setAttribute('transform', `rotate(${h * 30 + m * 0.5} 32 32)`);
      minHand.setAttribute('transform', `rotate(${m * 6} 32 32)`);
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- RADIAL GENRE WHEEL ---------- */
  const spokes = $$('.h2-spoke');
  const hubTitle = $('.h2-hub-title'), hubDesc = $('.h2-hub-desc'), hubCount = $('.h2-hub-count');
  const defaultHub = hubTitle ? { title: hubTitle.textContent, desc: hubDesc.textContent, count: hubCount.textContent } : null;
  spokes.forEach(sp => {
    const setHub = () => {
      if (!hubTitle) return;
      hubTitle.textContent = sp.dataset.genre || defaultHub.title;
      hubDesc.textContent = sp.dataset.desc || defaultHub.desc;
      hubCount.textContent = sp.dataset.count || defaultHub.count;
    };
    sp.addEventListener('mouseenter', setHub);
    sp.addEventListener('focus', setHub);
    sp.addEventListener('mouseleave', () => { if (defaultHub) { hubTitle.textContent = defaultHub.title; hubDesc.textContent = defaultHub.desc; hubCount.textContent = defaultHub.count; } });
  });

  /* ---------- WINDING JOURNEY SCROLL REVEAL ---------- */
  const stopObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); stopObserver.unobserve(en.target); } });
  }, { threshold: 0.35 });
  $$('.h2-stop').forEach(el => stopObserver.observe(el));

  /* ---------- GENERIC h2 SCROLL REVEAL ---------- */
  const h2RevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); h2RevealObserver.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$('.h2-reveal').forEach(el => h2RevealObserver.observe(el));

  /* ---------- TOUCH FALLBACK: tap-to-flip / tap-to-open on touch devices ---------- */
  if (window.matchMedia('(hover: none)').matches) {
    $$('.h2-id-wrap, .h2-book, .h2-pick-cover').forEach(el => {
      el.addEventListener('click', (e) => {
        const already = el.classList.contains('h2-touch-open');
        $$('.h2-touch-open').forEach(o => { if (o !== el) o.classList.remove('h2-touch-open'); });
        el.classList.toggle('h2-touch-open', !already);
      });
    });
  }

  /* ---------- ENVELOPE ANIMATION ON NEWSLETTER SUBMIT ---------- */
  const envelope = $('#h2-envelope');
  const h2Form = $('#newsletter-form');
  if (envelope && h2Form) {
    h2Form.addEventListener('submit', () => {
      envelope.classList.add('h2-sent');
      setTimeout(() => envelope.classList.remove('h2-sent'), 2200);
    });
  }

  /* ---------- HOME1/HOME2 THEME SYNC NOTE ----------
     Theme toggle, loader, nav scroll state, search modal, mobile menu,
     magnetic buttons, cursor glow, stat counters, back-to-top and the
     newsletter handler are already wired by the shared block above —
     Home 2 reuses those ids/classes directly. */
})();

/* =====================================================================
   ABOUT PAGE — interactions
   Guarded so this file stays safe to share across Home 1 / Home 2 / About.
   ===================================================================== */
(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const aboutHero = $('#ab-hero');
  if (!aboutHero) return; // not on this page

  /* ---------- FAQ ACCORDION ---------- */
  $$('.ab-faq-item').forEach(item => {
    const btn = item.querySelector('.ab-faq-q');
    const panel = item.querySelector('.ab-faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.ab-faq-item.open').forEach(o => {
        if (o !== item) { o.classList.remove('open'); o.querySelector('.ab-faq-a').style.maxHeight = '0px'; o.querySelector('.ab-faq-q').setAttribute('aria-expanded', 'false'); }
      });
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : '0px';
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- COMPARISON ROWS SCROLL REVEAL ---------- */
  const compareObserver = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('in'), i * 60);
        compareObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  $$('.ab-compare-row').forEach(el => compareObserver.observe(el));

  /* ---------- TOUCH FALLBACK: tap-to-open book / tap-to-flip portrait ---------- */
  if (window.matchMedia('(hover: none)').matches) {
    $$('.ab-book, .ab-team-wrap').forEach(el => {
      el.addEventListener('click', () => {
        const already = el.classList.contains('ab-touch-open');
        $$('.ab-touch-open').forEach(o => { if (o !== el) o.classList.remove('ab-touch-open'); });
        el.classList.toggle('ab-touch-open', !already);
      });
    });
  }
})();

/* =====================================================================
   MEMBER DASHBOARD — interactions
   Guarded so this file stays safe to share across Home 1 / Home 2 / About / Dashboard.
   ===================================================================== */
(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const dash = $('#sidebar');
  if (!dash) return; // not on this page

  /* ===================== DATA ===================== */
  const BOOKS = [
    { id:1, title:"The Midnight Library", author:"Matt Haig", genre:"Fiction", cover:"midnight-library", status:"borrowed", due:"Jul 22, 2026" },
    { id:2, title:"Piranesi", author:"Susanna Clarke", genre:"Fantasy", cover:"piranesi", status:"borrowed", due:"Jul 25, 2026" },
    { id:3, title:"The Silent Patient", author:"Alex Michaelides", genre:"Mystery", cover:"silent-patient", status:"borrowed", due:"Jul 29, 2026" },
    { id:4, title:"Educated", author:"Tara Westover", genre:"Non-Fiction", cover:"educated", status:"borrowed", due:"Aug 02, 2026" },
    { id:5, title:"Circe", author:"Madeline Miller", genre:"Fantasy", cover:"circe", status:"reserved" },
    { id:6, title:"Klara and the Sun", author:"Kazuo Ishiguro", genre:"Fiction", cover:"klara-sun", status:"reserved" },
    { id:7, title:"Beach Read", author:"Emily Henry", genre:"Romance", cover:"beach-read", status:"wishlist" },
    { id:8, title:"Project Hail Mary", author:"Andy Weir", genre:"Fiction", cover:"hail-mary", status:"wishlist" },
    { id:9, title:"The Song of Achilles", author:"Madeline Miller", genre:"Fantasy", cover:"achilles", status:"wishlist" },
    { id:10, title:"Atomic Habits", author:"James Clear", genre:"Non-Fiction", cover:"atomic-habits", status:"wishlist" },
    { id:11, title:"Gone Girl", author:"Gillian Flynn", genre:"Mystery", cover:"gone-girl", status:"wishlist" },
  ];

  const RECOMMENDED = [
    { title:"Tomorrow, and Tomorrow, and Tomorrow", author:"Gabrielle Zevin", cover:"tomorrow-x3" },
    { title:"Lessons in Chemistry", author:"Bonnie Garmus", cover:"lessons-chem" },
    { title:"The Vanishing Half", author:"Brit Bennett", cover:"vanishing-half" },
    { title:"Hamnet", author:"Maggie O'Farrell", cover:"hamnet" },
  ];

  const ACTIVITY = [
    { icon:"task_alt", text:"You returned <b>The Night Circus</b>", time:"2 hours ago" },
    { icon:"auto_stories", text:"You borrowed <b>Educated</b>", time:"Yesterday" },
    { icon:"favorite", text:"Added <b>Gone Girl</b> to wishlist", time:"2 days ago" },
    { icon:"military_tech", text:"Earned the <b>Night Owl Reader</b> badge", time:"4 days ago" },
  ];

  const DUE_DATES = [
    { title:"The Midnight Library", due:"Jul 22", urgent:true },
    { title:"Piranesi", due:"Jul 25", urgent:false },
    { title:"The Silent Patient", due:"Jul 29", urgent:false },
  ];

  const NOTIFICATIONS = [
    { id:1, cat:"due", icon:"schedule", title:"Book due in 4 days", body:"“The Midnight Library” is due Jul 22, 2026.", time:"1h ago", unread:true },
    { id:2, cat:"reservation", icon:"bookmark", title:"Reservation ready", body:"“Circe” is ready for pickup at the front desk.", time:"5h ago", unread:true },
    { id:3, cat:"announcement", icon:"campaign", title:"Extended weekend hours", body:"We're now open till 9pm on Saturdays this summer.", time:"1d ago", unread:true },
    { id:4, cat:"event", icon:"celebration", title:"Author talk this Friday", body:"Join Madeline Miller for a reading & signing, 6pm.", time:"2d ago", unread:false },
    { id:5, cat:"due", icon:"schedule", title:"Book returned on time", body:"Thanks for returning “The Night Circus” early.", time:"3d ago", unread:false },
    { id:6, cat:"reservation", icon:"bookmark", title:"Reservation expiring soon", body:"Your hold on “Klara and the Sun” expires in 2 days.", time:"3d ago", unread:false },
  ];

  const BADGES = [
    { icon:"local_fire_department", label:"18-Day Streak" },
    { icon:"military_tech", label:"Night Owl" },
    { icon:"auto_stories", label:"50 Books Club" },
    { icon:"star", label:"Top Reviewer" },
    { icon:"emoji_events", label:"Genre Explorer" },
    { icon:"bolt", label:"Speed Reader" },
  ];

  const GENRES = [ {g:"Fiction",p:38},{g:"Fantasy",p:27},{g:"Mystery",p:20},{g:"Non-Fiction",p:15} ];
  const MONTHS = [ ["Jan",4],["Feb",6],["Mar",5],["Apr",8],["May",7],["Jun",9],["Jul",6] ];

  /* ===================== HELPERS ===================== */
  const cover = (seed) => `https://picsum.photos/seed/${seed}/240/340`;

  /* ===================== VIEW SWITCHING ===================== */
  function switchView(view){
    $$('.view').forEach(v => v.classList.add('hidden'));
    const target = $(`.view[data-view="${view}"]`);
    target.classList.remove('hidden');
    void target.offsetWidth; // restart animation
    target.classList.remove('view'); target.offsetWidth; target.classList.add('view');

    $$('.nav-item[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    closeDrawer();
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('.nav-item[data-view]');
    if (btn) switchView(btn.dataset.view);
  });

  /* ===================== DARK MODE ===================== */
  /* Shares the 'mf-theme' key with the public site (index/about/home2) so the
     preference stays consistent when a member moves between the site and dashboard. */
  const root = document.documentElement;
  function setDark(on){
    root.classList.toggle('dark', on);
    $('#dark-icon').textContent = on ? 'light_mode' : 'dark_mode';
    localStorage.setItem('mf-theme', on ? 'dark' : 'light');
  }
  const savedTheme = localStorage.getItem('mf-theme');
  setDark(savedTheme ? savedTheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  $('#dark-toggle').addEventListener('click', () => setDark(!root.classList.contains('dark')));

  /* ===================== SIDEBAR: DRAWER + COLLAPSE ===================== */
  const sidebar = $('#sidebar'), overlay = $('#drawer-overlay');
  function openDrawer(){ sidebar.classList.add('open'); overlay.classList.remove('hidden'); }
  function closeDrawer(){ if (window.innerWidth < 1024){ sidebar.classList.remove('open'); overlay.classList.add('hidden'); } }
  $('#hamburger').addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);
  $('#collapse-btn').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

  /* ===================== ANIMATED COUNTERS ===================== */
  function animateCounters(root=document){
    $$('.stat-number[data-count], p[data-count]', root).forEach(el => {
      const target = +el.dataset.count;
      let cur = 0; const step = Math.max(1, Math.ceil(target/40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target){ cur = target; clearInterval(t); }
        el.textContent = cur;
      }, 22);
    });
  }

  /* ===================== TOASTS ===================== */
  function showToast(msg, type='info'){
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span class="material-symbols-outlined !text-[18px]">${type==='success'?'check_circle':'info'}</span><span>${msg}</span>`;
    $('#toast-container').appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(()=>el.remove(), 300); }, 3200);
  }

  /* ===================== RIPPLE ===================== */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.ripple');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const dot = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    dot.className = 'ripple-dot';
    dot.style.width = dot.style.height = size+'px';
    dot.style.left = (e.clientX - rect.left - size/2)+'px';
    dot.style.top = (e.clientY - rect.top - size/2)+'px';
    btn.appendChild(dot);
    setTimeout(()=>dot.remove(), 650);
  });

  /* ===================== RENDER: BOOK CARD ===================== */
  function bookCard(b){
    const statusMap = { borrowed:['status-borrowed','Borrowed'], reserved:['status-reserved','Reserved'], wishlist:['status-available','Available'] };
    const [cls,label] = statusMap[b.status];
    const actionBtn = b.status === 'borrowed'
      ? `<div class="flex gap-1.5 mt-1"><button class="btn-mini flex-1 !text-[11px]" onclick="showToast('“${b.title}” renewed for 14 more days.','success')">Renew</button><button class="btn-mini flex-1 !text-[11px] !bg-hairline-light dark:!bg-hairline-dark !text-ink-light dark:!text-ink-dark" onclick="showToast('“${b.title}” marked as returned.','success')">Return</button></div>`
      : b.status === 'reserved'
      ? `<button class="btn-mini w-full !text-[11px] mt-1" onclick="showToast('Reservation for “${b.title}” cancelled.','info')">Cancel Hold</button>`
      : `<button class="btn-mini w-full !text-[11px] mt-1" onclick="showToast('“${b.title}” added to Quick Borrow.','success')">Borrow</button>`;

    return `<div class="book-card" data-title="${b.title.toLowerCase()}" data-genre="${b.genre}">
      <div class="dash-cover-wrap"><span class="status-pill ${cls}">${label}</span><img src="${cover(b.cover)}" loading="lazy" alt="${b.title} cover"></div>
      <div>
        <p class="text-[13px] font-semibold leading-snug truncate">${b.title}</p>
        <p class="text-[11px] text-ink-light/50 dark:text-ink-dark/50">${b.author}</p>
        ${b.due ? `<p class="text-[10px] text-accent-light dark:text-accent-dark mt-0.5">Due ${b.due}</p>` : ''}
      </div>
      ${actionBtn}
    </div>`;
  }

  function renderRecommended(){
    $('#recommended-grid').innerHTML = RECOMMENDED.map(b => `
      <div class="book-card">
        <div class="dash-cover-wrap"><img src="${cover(b.cover)}" loading="lazy" alt="${b.title} cover"></div>
        <p class="text-[12px] font-semibold leading-snug truncate">${b.title}</p>
        <p class="text-[10px] text-ink-light/50 dark:text-ink-dark/50 truncate">${b.author}</p>
      </div>`).join('');
  }

  function renderMyBooks(tab='borrowed'){
    const grid = $('#mybooks-grid');
    grid.innerHTML = Array(5).fill('<div class="skeleton aspect-[2/3]"></div>').join('');
    setTimeout(() => {
      const q = ($('#books-search').value || '').toLowerCase();
      const genre = $('#genre-filter').value;
      const list = BOOKS.filter(b => b.status === tab)
        .filter(b => b.title.toLowerCase().includes(q))
        .filter(b => !genre || b.genre === genre);
      grid.innerHTML = list.length ? list.map(bookCard).join('') : `<p class="col-span-full text-sm text-ink-light/50 dark:text-ink-dark/50 py-10 text-center">No books match your search.</p>`;
    }, 350);
  }

  function renderActivityTimeline(){
    $('#activity-timeline').innerHTML = ACTIVITY.map(a => `
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-full bg-primary-light/10 dark:bg-primary-dark/15 grid place-items-center shrink-0">
          <span class="material-symbols-outlined !text-[18px] text-primary-light dark:text-primary-dark">${a.icon}</span>
        </div>
        <div class="text-[13px]"><p>${a.text}</p><p class="text-[11px] text-ink-light/40 dark:text-ink-dark/40 mt-0.5">${a.time}</p></div>
      </div>`).join('');
  }

  function renderDueDates(){
    $('#due-dates-list').innerHTML = DUE_DATES.map(d => `
      <div class="flex items-center justify-between text-sm">
        <span class="truncate pr-2">${d.title}</span>
        <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full ${d.urgent ? 'bg-accent-light/15 text-accent-light dark:bg-accent-dark/20 dark:text-accent-dark' : 'bg-panel-light dark:bg-panel-dark text-ink-light/60 dark:text-ink-dark/60'}">${d.due}</span>
      </div>`).join('');
  }

  function renderMonthlyChart(){
    const max = Math.max(...MONTHS.map(m=>m[1]));
    $('#monthly-chart').innerHTML = MONTHS.map(([m,v]) => `
      <div class="flex-1 flex flex-col items-center gap-2">
        <div class="w-full flex items-end justify-center" style="height:112px">
          <div class="bar-mini ${m==='Jul'?'active':''}" style="width:60%;height:${(v/max)*100}%"></div>
        </div>
        <span class="text-[10px] text-ink-light/50 dark:text-ink-dark/50">${m}</span>
      </div>`).join('');
  }

  function renderGenreBars(){
    $('#genre-bars').innerHTML = GENRES.map(g => `
      <div>
        <div class="flex justify-between text-[12px] mb-1"><span>${g.g}</span><span class="text-ink-light/50 dark:text-ink-dark/50">${g.p}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${g.p}%"></div></div>
      </div>`).join('');
  }

  function renderBadges(){
    $('#badges-grid').innerHTML = BADGES.map(b => `
      <div class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-panel-light dark:bg-panel-dark text-center">
        <span class="material-symbols-outlined text-accent-light dark:text-accent-dark !text-[24px]">${b.icon}</span>
        <span class="text-[10px] font-medium leading-tight">${b.label}</span>
      </div>`).join('');
  }

  function renderReadingTimeline(){
    const items = [
      ["Jul 16, 2026","Finished <b>The Night Circus</b> — 4.5★ rating"],
      ["Jul 09, 2026","Started <b>The Midnight Library</b>"],
      ["Jun 28, 2026","Finished <b>Circe</b> — 5★ rating"],
      ["Jun 14, 2026","Joined the Summer Reading Challenge"],
    ];
    $('#reading-timeline').innerHTML = items.map(([d,t]) => `
      <div class="flex gap-4">
        <div class="w-20 shrink-0 text-[11px] text-ink-light/40 dark:text-ink-dark/40 pt-0.5">${d}</div>
        <div class="relative pl-4 border-l-2 border-hairline-light dark:border-hairline-dark pb-1 text-[13px]">
          <span class="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-accent-light dark:bg-accent-dark"></span>${t}
        </div>
      </div>`).join('');
  }

  function renderNotifications(filter='all'){
    const list = $('#notifications-list');
    list.innerHTML = Array(4).fill('<div class="skeleton h-16"></div>').join('');
    setTimeout(() => {
      const items = NOTIFICATIONS.filter(n => filter==='all' || n.cat===filter);
      list.innerHTML = items.map(n => `
        <div class="card-block flex items-start gap-4 !py-4 ${n.unread ? '' : 'opacity-60'}" data-id="${n.id}">
          <div class="w-10 h-10 rounded-full bg-primary-light/10 dark:bg-primary-dark/15 grid place-items-center shrink-0">
            <span class="material-symbols-outlined !text-[19px] text-primary-light dark:text-primary-dark">${n.icon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2"><p class="text-sm font-semibold">${n.title}</p>${n.unread ? '<span class="w-1.5 h-1.5 rounded-full bg-accent-light dark:bg-accent-dark"></span>' : ''}</div>
            <p class="text-[12.5px] text-ink-light/60 dark:text-ink-dark/60 mt-0.5">${n.body}</p>
            <p class="text-[11px] text-ink-light/35 dark:text-ink-dark/35 mt-1.5">${n.time}</p>
          </div>
        </div>`).join('') || `<p class="text-sm text-ink-light/50 dark:text-ink-dark/50 text-center py-10">No notifications in this category.</p>`;
    }, 300);
  }
  function markAllRead(){
    NOTIFICATIONS.forEach(n => n.unread = false);
    $('#nav-notif-badge').remove();
    renderNotifications($('.chip-filter.active')?.dataset.filter || 'all');
    showToast('All notifications marked as read.','success');
  }

  /* ===================== EVENT WIRING ===================== */
  $$('#mybooks-tabs .tab-btn').forEach(b => b.addEventListener('click', () => {
    $$('#mybooks-tabs .tab-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    renderMyBooks(b.dataset.tab);
  }));
  $('#books-search').addEventListener('input', () => renderMyBooks($('.tab-btn.active').dataset.tab));
  $('#genre-filter').addEventListener('change', () => renderMyBooks($('.tab-btn.active').dataset.tab));
  $$('#notif-filters .chip-filter').forEach(b => b.addEventListener('click', () => {
    $$('#notif-filters .chip-filter').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    renderNotifications(b.dataset.filter);
  }));
  $('#global-search').addEventListener('input', e => {
    if (e.target.value.length > 1) switchView('mybooks'), $('#books-search').value = e.target.value, renderMyBooks('borrowed');
  });

  /* ===================== INIT ===================== */
  $('#current-date').textContent = new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });

  renderRecommended();
  renderActivityTimeline();
  renderDueDates();
  renderMyBooks('borrowed');
  renderMonthlyChart();
  renderGenreBars();
  renderBadges();
  renderReadingTimeline();
  renderNotifications('all');
  animateCounters();
  setTimeout(() => showToast('Welcome back, Eleanor! 4 books currently borrowed.','info'), 700);


  /* ---------- EXPOSE FOR INLINE onclick HANDLERS ---------- */
  window.switchView = switchView;
  window.showToast = showToast;
  window.markAllRead = markAllRead;
})();

/* =====================================================================
   BOOK COLLECTION PAGE — interactions
   Guarded so this file stays safe to share across all pages.
   ===================================================================== */
(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  if (!$('#bc-hero')) return; // not on this page

  const cover = seed => `https://picsum.photos/seed/${seed}/240/340`;

  const BOOKS = [
    { id:1, title:"The Cartographer's Silence", author:"Inés Roldán", genre:"Fiction", cover:"cart-silence", rating:4.5, status:"available", pages:312, summary:"A cartographer follows a map with no names across three continents." },
    { id:2, title:"Marrow Deep", author:"Halle Osei", genre:"Mystery", cover:"marrow-deep", rating:4.2, status:"borrowed", pages:344, summary:"A forensic anthropologist returns to the town that made her leave." },
    { id:3, title:"Signal & Static", author:"Tomas Reyes", genre:"Science Fiction", cover:"signal-static", rating:4.7, status:"available", pages:288, summary:"A radio operator intercepts a message that shouldn't exist yet." },
    { id:4, title:"Beach Read", author:"Emily Henry", genre:"Romance", cover:"beach-read", rating:4.3, status:"reserved", pages:361, summary:"Two rival writers swap genres for a summer on the lake." },
    { id:5, title:"A Quiet Ascent", author:"Renata Mbeki", genre:"Biography", cover:"quiet-ascent", rating:4.6, status:"available", pages:298, summary:"The unlikely rise of a mountaineer who started climbing at 40." },
    { id:6, title:"Empires of Salt", author:"Devon Kessler", genre:"History", cover:"empires-salt", rating:4.4, status:"available", pages:412, summary:"How ancient trade routes reshaped three continents." },
    { id:7, title:"Small Mercies", author:"Adaeze Nwosu", genre:"Children's Books", cover:"small-mercies", rating:4.8, status:"available", pages:64, summary:"A lighthouse keeper who collects lost things, for young readers." },
    { id:8, title:"The Machine Garden", author:"Priya Nair", genre:"Technology", cover:"machine-garden", rating:4.1, status:"borrowed", pages:276, summary:"An engineer's field notes on building gentler machines." },
    { id:9, title:"Atomic Habits", author:"James Clear", genre:"Self-Development", cover:"atomic-habits", rating:4.9, status:"available", pages:320, summary:"Tiny changes, remarkable results — a proven framework for habits." },
    { id:10, title:"The Founder's Table", author:"Jonas Eklund", genre:"Business", cover:"founders-table", rating:4.0, status:"available", pages:256, summary:"Lessons from a decade of dinners with first-time founders." },
    { id:11, title:"The Slow Migration", author:"Jonas Eklund", genre:"History", cover:"slow-migration", rating:4.3, status:"available", pages:204, summary:"Essays following the arctic tern's 44,000-mile yearly journey." },
    { id:12, title:"The Quiet Orchard", author:"Marta Wren", genre:"Fiction", cover:"quiet-orchard", rating:4.2, status:"reserved", pages:312, summary:"A widow rebuilds her late husband's orchard, branch by branch." },
    { id:13, title:"Circuit & Bone", author:"Saoirse Fallon", genre:"Science Fiction", cover:"circuit-bone", rating:4.5, status:"available", pages:342, summary:"A prosthetics designer uncovers a conspiracy in her own hands." },
    { id:14, title:"Gone Girl", author:"Gillian Flynn", genre:"Mystery", cover:"gone-girl", rating:4.4, status:"borrowed", pages:432, summary:"A marriage unravels into something far darker than it seems." },
  ];

  const statusMeta = { available: ['status-available','Available'], borrowed: ['status-borrowed','Borrowed'], reserved: ['status-reserved','Reserved'] };
  const stars = r => { const f = Math.round(r); return '★'.repeat(f) + `<span class="opacity-30">${'★'.repeat(5-f)}</span>`; };

  function bookCard(b){
    const [cls,label] = statusMeta[b.status];
    return `<div class="book-card">
      <div class="dash-cover-wrap"><span class="status-pill ${cls}">${label}</span><img src="${cover(b.cover)}" loading="lazy" alt="${b.title} cover"></div>
      <div>
        <p class="text-[13.5px] font-semibold leading-snug">${b.title}</p>
        <p class="text-[11.5px] text-ink-light/50 dark:text-ink-dark/50">${b.author} · ${b.genre}</p>
        <p class="text-[11px] text-accent-light dark:text-accent-dark mt-0.5">${stars(b.rating)} <span class="text-ink-light/40 dark:text-ink-dark/40">${b.rating}</span></p>
        <p class="text-[11.5px] text-ink-light/55 dark:text-ink-dark/55 mt-1 leading-snug">${b.summary}</p>
      </div>
      <button class="btn-mini w-full !text-[11px] mt-1" onclick="bcToast('“${b.title}” — full details are a member perk.')">View Details</button>
    </div>`;
  }

  function render(){
    const grid = $('#discovery-grid');
    grid.innerHTML = Array(8).fill('<div class="skeleton aspect-[2/3]"></div>').join('');
    setTimeout(() => {
      const q = ($('#disc-search').value || '').toLowerCase();
      const genre = $('#disc-genre').value;
      const author = $('#disc-author').value;
      const avail = $('#disc-availability').value;
      const sort = $('#disc-sort').value;

      let list = BOOKS
        .filter(b => b.title.toLowerCase().includes(q))
        .filter(b => !genre || b.genre === genre)
        .filter(b => !author || b.author === author)
        .filter(b => !avail || b.status === avail);

      if (sort === 'newest') list = [...list].reverse();
      else if (sort === 'popular' || sort === 'rated') list = [...list].sort((a,b) => b.rating - a.rating);
      else if (sort === 'az') list = [...list].sort((a,b) => a.title.localeCompare(b.title));

      $('#discovery-count').textContent = `${list.length} book${list.length===1?'':'s'} found`;
      grid.innerHTML = list.length ? list.map(bookCard).join('') : `<p class="col-span-full text-sm text-ink-light/50 dark:text-ink-dark/50 py-14 text-center">No books match your search — try different filters.</p>`;
    }, 300);
  }

  ['disc-search','disc-genre','disc-author','disc-availability','disc-sort'].forEach(id => {
    $(`#${id}`)?.addEventListener('input', render);
    $(`#${id}`)?.addEventListener('change', render);
  });

  /* genre grid → jump to discovery, pre-filtered */
  $$('.bc-genre-card').forEach(card => card.addEventListener('click', () => {
    $('#disc-genre').value = card.dataset.genre;
    render();
    $('#discovery').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  /* hero search → jump to discovery, pre-filtered (covers both button click and Enter key) */
  $('#hero-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#disc-search').value = $('#hero-search-input').value;
    $('#disc-genre').value = $('#hero-genre-select').value;
    render();
    $('#discovery').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* lightweight page-local toast (reuses the shared .toast styles) */
  window.bcToast = function(msg){
    let box = $('#bc-toast-box');
    if (!box) { box = document.createElement('div'); box.id = 'bc-toast-box'; box.className = 'fixed bottom-24 right-7 z-[70] flex flex-col gap-2'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast info';
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 2800);
  };

  render();
})();

/* =====================================================================
   MEMBERSHIP PLANS PAGE — interactions
   Guarded so this file stays safe to share across all pages.
   ===================================================================== */
(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  if (!$('#mem-hero')) return; // not on this page

  /* ---------- PARTICLES (hero + join) ---------- */
  function spawnParticles(containerId, count) {
    const el = document.getElementById(containerId);
    if (!el) return;
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.style.cssText = [
        'position:absolute',
        'width:' + (Math.random() * 3 + 1) + 'px',
        'height:' + (Math.random() * 3 + 1) + 'px',
        'border-radius:50%',
        'background:rgba(250,247,242,' + (Math.random() * 0.3 + 0.1) + ')',
        'left:' + Math.random() * 100 + '%',
        'top:' + Math.random() * 100 + '%',
        'animation:floatUp ' + (Math.random() * 14 + 8) + 's linear ' + Math.random() * 10 + 's infinite'
      ].join(';');
      el.appendChild(span);
    }
  }
  spawnParticles('mem-particles', 35);
  spawnParticles('mem-join-particles', 20);

  /* ---------- HERO REVEAL ---------- */
  const heroReveals = $$('#mem-hero .reveal');
  setTimeout(() => {
    heroReveals.forEach(el => el.classList.add('in'));
  }, 200);

  /* ---------- CARD PARALLAX on mouse move ---------- */
  const cardWrap = document.getElementById('mem-card-wrap');
  if (cardWrap) {
    document.addEventListener('mousemove', (e) => {
      const rect = cardWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      cardWrap.style.transform = `perspective(1200px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg)`;
    });
  }

  /* ---------- BILLING TOGGLE ---------- */
  const billToggle = document.getElementById('bill-toggle');
  let isAnnual = false;
  if (billToggle) {
    billToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      billToggle.setAttribute('aria-checked', isAnnual ? 'true' : 'false');
      $$('.plan-price').forEach(el => {
        const val = isAnnual ? el.dataset.annual : el.dataset.monthly;
        el.textContent = val;
        el.style.transition = 'all .3s';
        el.style.transform = 'scale(1.08)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 300);
      });
      $$('.plan-annual-note').forEach(el => {
        el.innerHTML = isAnnual ? ('&#8377;' + el.dataset.annualNote) : '';
      });
    });
  }

  /* ---------- PLAN BUTTONS ---------- */
  $$('.mem-plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = btn.dataset.plan;
      const price = btn.dataset.price;
      showToast('info', `Opening ${plan} plan — &#8377;${price}/mo`);
      rippleEffect(btn, e);
    });
  });

  /* ---------- RIPPLE --- */
  function rippleEffect(el, e) {
    if (!e) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const dot = document.createElement('span');
    dot.className = 'ripple-dot';
    dot.style.cssText = [
      'width:' + size + 'px',
      'height:' + size + 'px',
      'left:' + (e.clientX - rect.left - size / 2) + 'px',
      'top:' + (e.clientY - rect.top - size / 2) + 'px'
    ].join(';');
    el.appendChild(dot);
    setTimeout(() => { dot.remove(); }, 700);
  }

  /* ---------- TOAST ---------- */
  function showToast(type, msg) {
    let zone = document.getElementById('toast-zone');
    if (!zone) {
      zone = document.createElement('div');
      zone.id = 'toast-zone';
      zone.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col gap-3 items-center pointer-events-none';
      document.body.appendChild(zone);
    }
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span>' + msg + '</span>';
    zone.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => { toast.remove(); }, 400);
    }, 3000);
  }

  /* ---------- NEWSLETTER FORM ---------- */
  const nlForm = document.getElementById('mem-nl-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('mem-nl-email').value.trim();
      const msg = document.getElementById('mem-nl-msg');
      if (!email || !email.includes('@')) {
        msg.textContent = 'Please enter a valid email address.';
        return;
      }
      msg.textContent = 'Welcome to the reading circle! Check your inbox soon.';
      nlForm.reset();
      showToast('success', 'Subscribed to Letters from the Library!');
      setTimeout(() => { msg.textContent = ''; }, 5000);
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.style.transitionDelay || '0s';
        setTimeout(() => { el.classList.add('in'); }, parseFloat(delay) * 1000);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal-scroll').forEach(el => revealObs.observe(el));

  /* ---------- TIMELINE ITEMS REVEAL ---------- */
  const timelineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        timelineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.mem-step').forEach(el => timelineObs.observe(el));

  /* ---------- ANIMATED COUNTERS ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const start = 0;
    const duration = 1800;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  $$('.mem-counter').forEach(el => counterObs.observe(el));
})();

/* =====================================================================
   CONTACT & AUTH PAGES — interactions
   Guarded so this file stays safe to share across all pages.
   ===================================================================== */
(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Helper for toasts on these pages
  function showLocalToast(type, msg) {
    let zone = document.getElementById('toast-zone');
    if (!zone) {
      zone = document.createElement('div');
      zone.id = 'toast-zone';
      zone.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col gap-3 items-center pointer-events-none';
      document.body.appendChild(zone);
    }
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span>' + msg + '</span>';
    zone.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => { toast.remove(); }, 400);
    }, 3000);
  }

  // 1. Contact Form Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const msgPlaceholder = document.getElementById('contact-form-msg');

      if (!name || !email || !subject || !message) {
        msgPlaceholder.textContent = 'Please fill out all required fields.';
        msgPlaceholder.className = 'text-xs text-center text-red-500 h-4 mt-2 font-medium';
        return;
      }
      if (!email.includes('@')) {
        msgPlaceholder.textContent = 'Please enter a valid email address.';
        msgPlaceholder.className = 'text-xs text-center text-red-500 h-4 mt-2 font-medium';
        return;
      }

      msgPlaceholder.textContent = 'Sending message...';
      msgPlaceholder.className = 'text-xs text-center text-primary-light dark:text-primary-dark h-4 mt-2 font-medium';

      setTimeout(() => {
        msgPlaceholder.textContent = 'Message sent successfully! We will get back to you soon.';
        msgPlaceholder.className = 'text-xs text-center text-green-600 dark:text-[#4FAF8F] h-4 mt-2 font-medium';
        contactForm.reset();
        showLocalToast('success', 'Message sent successfully!');
        setTimeout(() => { msgPlaceholder.textContent = ''; }, 5000);
      }, 1200);
    });
  }

  // 2. Login Form Handler
  const loginForm = document.getElementById('credentials-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value.trim();
      const authMsg = document.getElementById('auth-msg');

      if (!email || !pass) {
        authMsg.textContent = 'Please enter both email and password.';
        authMsg.className = 'text-xs text-center text-red-500 h-4 mt-4 font-medium';
        return;
      }
      if (!email.includes('@')) {
        authMsg.textContent = 'Please enter a valid email address.';
        authMsg.className = 'text-xs text-center text-red-500 h-4 mt-4 font-medium';
        return;
      }

      authMsg.textContent = 'Signing in...';
      authMsg.className = 'text-xs text-center text-primary-light dark:text-primary-dark h-4 mt-4 font-medium';

      setTimeout(() => {
        showLocalToast('success', 'Logged in successfully! Redirecting...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      }, 1000);
    });
  }

  // 3. Sign-Up Form Handler
  const signupForm = document.getElementById('credentials-signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const pass = document.getElementById('signup-pass').value.trim();
      const authMsg = document.getElementById('auth-msg');

      if (!name || !email || !pass) {
        authMsg.textContent = 'Please fill out all fields.';
        authMsg.className = 'text-xs text-center text-red-500 h-4 mt-4 font-medium';
        return;
      }
      if (!email.includes('@')) {
        authMsg.textContent = 'Please enter a valid email address.';
        authMsg.className = 'text-xs text-center text-red-500 h-4 mt-4 font-medium';
        return;
      }
      if (pass.length < 6) {
        authMsg.textContent = 'Password must be at least 6 characters.';
        authMsg.className = 'text-xs text-center text-red-500 h-4 mt-4 font-medium';
        return;
      }

      authMsg.textContent = 'Creating account...';
      authMsg.className = 'text-xs text-center text-primary-light dark:text-primary-dark h-4 mt-4 font-medium';

      setTimeout(() => {
        showLocalToast('success', 'Account created! Welcome to Marlowe & Finch.');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      }, 1000);
    });
  }
})();

/* =====================================================================
   LUXURY CINEMATIC HERO BOOK ENGINE
   ===================================================================== */
(function initLuxuryHeroBook() {
  const coverFront = document.getElementById('coverFront');
  const leaf1 = document.getElementById('leaf1');
  const leaf2 = document.getElementById('leaf2');
  const leaf3 = document.getElementById('leaf3');
  const leaf4 = document.getElementById('leaf4');
  
  const heroHeading = document.getElementById('heroHeading');
  const heroParagraph = document.getElementById('heroParagraph');
  const heroButtons = document.getElementById('heroButtons');

  if (!coverFront) return;

  // Initial Z-Index Stacking
  if (leaf1) leaf1.style.zIndex = '40';
  if (leaf2) leaf2.style.zIndex = '30';
  if (leaf3) leaf3.style.zIndex = '20';
  if (leaf4) leaf4.style.zIndex = '10';

  // Intro Animation Sequence
  // Step 1: Wait 400ms then open cover
  setTimeout(() => {
    coverFront.classList.add('is-open');

    // Step 2: Turn Leaf 1 ("Marlowe & Finch") after 1400ms
    setTimeout(() => {
      if (leaf1) {
        leaf1.style.zIndex = '60'; // Boost during flight
        leaf1.classList.add('turned-1');
        setTimeout(() => { leaf1.style.zIndex = '10'; }, 1100);
      }

      // Step 3: Turn Leaf 2 ("Curated Collections") after 1200ms
      setTimeout(() => {
        if (leaf2) {
          leaf2.style.zIndex = '60';
          leaf2.classList.add('turned-2');
          setTimeout(() => { leaf2.style.zIndex = '12'; }, 1100);
        }

        // Step 4: Turn Leaf 3 ("Reading Rooms") after 1200ms
        setTimeout(() => {
          if (leaf3) {
            leaf3.style.zIndex = '60';
            leaf3.classList.add('turned-3');
            setTimeout(() => { leaf3.style.zIndex = '14'; }, 1100);
          }

          // Step 5: Turn Leaf 4 ("Members Library") after 1200ms
          setTimeout(() => {
            if (leaf4) {
              leaf4.style.zIndex = '60';
              leaf4.classList.add('turned-4');
              setTimeout(() => { leaf4.style.zIndex = '16'; }, 1100);
            }

            // Step 6: Fade upward Left Editorial Text after last page turn
            setTimeout(() => {
              if (heroHeading) {
                heroHeading.style.opacity = '1';
                heroHeading.style.transform = 'translateY(0)';
              }
              if (heroParagraph) {
                heroParagraph.style.opacity = '1';
                heroParagraph.style.transform = 'translateY(0)';
              }
              if (heroButtons) {
                heroButtons.style.opacity = '1';
                heroButtons.style.transform = 'translateY(0)';
              }
            }, 600);

          }, 1200);
        }, 1200);
      }, 1200);
    }, 1400);
  }, 400);

  // Mouse Interaction (Max 4deg Tilt & Natural Shadow Shift)
  const heroSection = document.getElementById('hero');
  const book3D = document.getElementById('book3D');
  const bookShadow = document.getElementById('bookShadow');

  if (heroSection && book3D) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (-y / (rect.height / 2)) * 4; // Max 4 deg
      const tiltY = (x / (rect.width / 2)) * 4;   // Max 4 deg

      book3D.style.transform = `rotateX(${14 + tiltX}deg) rotateY(${-8 + tiltY}deg)`;
      if (bookShadow) {
        bookShadow.style.transform = `rotateX(80deg) translateX(${tiltY * 3.5}px) translateY(${tiltX * 2}px)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      book3D.style.transform = `rotateX(14deg) rotateY(-8deg)`;
      if (bookShadow) {
        bookShadow.style.transform = `rotateX(80deg)`;
      }
    });
  }
})();

