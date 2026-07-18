/* ============================================================
   ArtisanGrid — script.js
   UI Physics, Live Simulation, Interactions
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. LIVE DATA — Artisan Pool & Category Pricing
────────────────────────────────────────────────────────────── */
const ARTISANS = [
    { initials: 'MV', name: 'Marcus V.',  title: 'Master Plumber',       eta: '12 min', dist: '1.4 miles away', color: 'var(--color-1)', image: 'Assets/avatar_mv.png' },
    { initials: 'EK', name: 'Elena K.',   title: 'Senior Carpenter',      eta: '8 min',  dist: '0.9 miles away', color: 'var(--color-2)', image: 'Assets/avatar_ek.png' },
    { initials: 'TR', name: 'Tom R.',     title: 'HVAC Technician',        eta: '18 min', dist: '2.1 miles away', color: 'var(--color-5)', image: 'Assets/avatar_tr.png' },
    { initials: 'SB', name: 'Sophie B.',  title: 'Licensed Electrician',   eta: '6 min',  dist: '0.7 miles away', color: 'var(--color-4)', image: 'Assets/avatar_sb.png' },
    { initials: 'RO', name: 'Ray O.',     title: 'General Repairs',        eta: '14 min', dist: '1.8 miles away', color: 'var(--color-3)', image: 'Assets/avatar_ro.png' },
];

const PRICE_RANGES = {
    electrical: { low: '$60',  high: '$150', label: 'Electrical work' },
    plumbing:   { low: '$45',  high: '$120', label: 'Plumbing repairs' },
    carpentry:  { low: '$55',  high: '$200', label: 'Carpentry work' },
    hvac:       { low: '$80',  high: '$250', label: 'HVAC service' },
};

const TICKER_UPDATES = [
    'Electrical • Sarah M. booked an electrician — just now',
    'Rating • James R. rated Marcus V. ★★★★★ — 2 min ago',
    'HVAC • Emergency resolved in 18 mins — Park Slope',
    'Carpentry • Deck repair completed — Ray O. — 5 min ago',
    'Plumbing • Pipe burst fixed in Brooklyn Heights — 9 min ago',
    'Electrical • Panel upgrade complete — Sophie B. — 11 min ago',
    'Network • New artisan Elena K. — Senior Carpenter joined',
    'Plumbing • Hot water restored — Marcus V. — 3 min ago',
];

/* ──────────────────────────────────────────────────────────────
   2. DOM REFERENCES
────────────────────────────────────────────────────────────── */
const $  = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

const artisanCount    = $('artisan-count');
const footerCount     = $('footer-count');
const artisanAvatar   = $('artisan-avatar');
const artisanName     = $('artisan-name');
const artisanTitle    = $('artisan-title');
const etaValue        = $('eta-value');
const artisanDistance = $('artisan-distance');
const liveJobs        = $('live-jobs');
const avgEta          = $('avg-eta');
const priceLow        = $('price-low');
const priceHigh       = $('price-high');
const priceCat        = $('price-category');
const ctaBtn          = $('cta-btn');
const bentoCards      = $('bento-cards');
const menuToggle      = $('menu-toggle');
const mobileMenu      = $('mobile-menu');

/* ──────────────────────────────────────────────────────────────
   3. LIVE DOM SIMULATION — cycles every 4.5 s
────────────────────────────────────────────────────────────── */
let artisanIndex    = 0;
let prefersReduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fadeSwap(el, newText, newColor) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.35s ease';
    setTimeout(() => {
        if (el.tagName === 'IMG') {
            el.src = newText;
        } else {
            el.textContent = newText;
            if (newColor) el.style.background = newColor;
        }
        el.style.opacity = '1';
    }, 350);
}

function cycleArtisan() {
    if (!artisanAvatar || !artisanName || !artisanTitle || !etaValue || !artisanDistance) return;
    artisanIndex = (artisanIndex + 1) % ARTISANS.length;
    const a = ARTISANS[artisanIndex];

    fadeSwap(artisanAvatar, a.image);
    fadeSwap(artisanName,   a.name);
    fadeSwap(artisanTitle,  a.title);
    fadeSwap(etaValue,      a.eta);

    if (artisanDistance) artisanDistance.textContent = a.dist;

    // Randomise live metrics
    const count  = 138 + Math.floor(Math.random() * 28);
    const sector = Math.floor(Math.random() * 14) + 1;
    const jobs   = 32  + Math.floor(Math.random() * 35);
    const eta    = 4   + Math.floor(Math.random() * 14);

    const countText = `${count} Verified Artisans Active in Sector ${sector}`;
    fadeSwap(artisanCount, countText);

    liveJobs.style.transition = 'color 0.3s';
    liveJobs.textContent  = jobs;
    avgEta.textContent    = `${eta} min`;
    footerCount.textContent = `${count} artisans online`;
}

if (!prefersReduced) {
    setInterval(cycleArtisan, 4500);
}

/* ──────────────────────────────────────────────────────────────
   4. CATEGORY PILLS — click interaction + price update
────────────────────────────────────────────────────────────── */
const pills = $$('.pill');

pills.forEach(pill => {
    pill.addEventListener('click', function () {
        // Update active state
        pills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        // Sync with hero slideshow if active
        const cat = this.dataset.category;
        if (typeof syncSlideshowWithCategory === 'function') {
            syncSlideshowWithCategory(cat);
        }

        // Update pricing estimator (safeguarded)
        const range = PRICE_RANGES[cat];
        if (!range) return;

        if (priceLow && priceHigh && priceCat) {
            priceLow.style.transition  = 'opacity 0.25s';
            priceHigh.style.transition = 'opacity 0.25s';
            priceLow.style.opacity  = '0';
            priceHigh.style.opacity = '0';

            setTimeout(() => {
                priceLow.textContent  = range.low;
                priceHigh.textContent = range.high;
                priceCat.textContent  = range.label;
                priceLow.style.opacity  = '1';
                priceHigh.style.opacity = '1';
            }, 240);
        }
    });
});

/* ──────────────────────────────────────────────────────────────
   5. MAGNETIC CTA BUTTON — pull physics on hover + approach
────────────────────────────────────────────────────────────── */
let magnetActive = false;
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

if (ctaBtn) {
    // Fine-grained pull when mouse is directly over the button
    ctaBtn.addEventListener('mousemove', function (e) {
        if (isMobile()) return;
        const r  = this.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = (e.clientX - cx) * 0.2;
        const dy = (e.clientY - cy) * 0.28;
        this.style.transition = 'transform 0.1s ease, background 0.2s';
        this.style.transform  = `translate(${dx}px, ${dy}px)`;
    });

    ctaBtn.addEventListener('mouseleave', function () {
        magnetActive = false;
        this.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), background 0.2s';
        this.style.transform  = 'translate(0, 0)';
    });

    ctaBtn.addEventListener('mouseenter', function () {
        magnetActive = true;
    });
}

// Outer approach pull — activates within 80px radius of the button
document.addEventListener('mousemove', function (e) {
    if (!ctaBtn || magnetActive || isMobile()) return;

    const r  = ctaBtn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const d  = Math.hypot(e.clientX - cx, e.clientY - cy);

    if (d < 80) {
        const strength = Math.max(0, (80 - d) / 80);
        const dx = (e.clientX - cx) * strength * 0.12;
        const dy = (e.clientY - cy) * strength * 0.18;
        ctaBtn.style.transition = 'transform 0.15s ease, background 0.2s';
        ctaBtn.style.transform  = `translate(${dx}px, ${dy}px)`;
    } else if (!magnetActive) {
        ctaBtn.style.transform = 'translate(0, 0)';
    }
});

/* ──────────────────────────────────────────────────────────────
   6. AMBIENT PARALLAX — Bento cards float on mouse movement
────────────────────────────────────────────────────────────── */
const bentoCardEls = $$('.bento-card');
let rafId = null;
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

function animateParallax() {
    // Lerp toward target
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    bentoCardEls.forEach((card, i) => {
        const depth = i === 0 ? 1 : -0.65;
        const tx = currentX * 7 * depth;
        const ty = currentY * 5 * depth;
        card.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    rafId = requestAnimationFrame(animateParallax);
}

document.addEventListener('mousemove', function (e) {
    if (isMobile() || prefersReduced) return;
    // Normalise to -1 → +1
    targetX = -(e.clientX / window.innerWidth  - 0.5) * 2;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

document.addEventListener('mouseleave', function () {
    targetX = 0;
    targetY = 0;
});

if (!prefersReduced && bentoCardEls.length > 0) {
    animateParallax();
}

/* ──────────────────────────────────────────────────────────────
   7. MOBILE MENU TOGGLE
────────────────────────────────────────────────────────────── */
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
        const isOpen = !mobileMenu.classList.contains('hidden');
        this.setAttribute('aria-expanded', String(isOpen));
        // Animate hamburger to X
        const spans = this.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'translateY(6px) rotate(45deg)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        }
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });
}

/* ──────────────────────────────────────────────────────────────
   8. SMOOTH SCROLL for anchor links
────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ──────────────────────────────────────────────────────────────
   9. SCROLL-TRIGGERED REVEAL — Sections fade in on scroll
────────────────────────────────────────────────────────────── */
const revealTargets = $$('.process-card, .artisan-card, .bento-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity    = '1';
            entry.target.style.transform += ' translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach((el, i) => {
    if (prefersReduced) return;
    el.style.opacity    = '0';
    el.style.transform  = (el.style.transform || '') + ' translateY(18px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
    observer.observe(el);
});

/* ──────────────────────────────────────────────────────────────
   10. SEARCH INPUT — subtle glow on focus
────────────────────────────────────────────────────────────── */
const searchInput = $('search-input');
if (searchInput) {
    searchInput.addEventListener('focus', () => {
        searchInput.closest('.cta-bar').style.boxShadow =
            '0 0 0 1px rgba(18,118,108,0.4)';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.closest('.cta-bar').style.boxShadow = 'none';
    });
}

/* ──────────────────────────────────────────────────────────────
   11. CTA BUTTON — submit feedback
────────────────────────────────────────────────────────────── */
if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        const val = searchInput ? searchInput.value.trim() : '';
        if (!val) {
            searchInput && searchInput.focus();
            return;
        }
        const orig = ctaBtn.textContent;
        ctaBtn.textContent = 'Dispatching… ✓';
        ctaBtn.style.background = '#a8cc00';
        setTimeout(() => {
            ctaBtn.textContent = orig;
            ctaBtn.style.background = '';
        }, 2200);
    });
}

/* ──────────────────────────────────────────────────────────────
   12. THEME TOGGLER LOGIC — toggles light-theme and saves choice
────────────────────────────────────────────────────────────── */
const themeToggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');

themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Rotate icons on all theme buttons
        themeToggleBtns.forEach(b => {
            const sunIcon = b.querySelector('.sun-icon');
            const moonIcon = b.querySelector('.moon-icon');
            if (isLight) {
                if (sunIcon) sunIcon.style.transform = 'rotate(18deg)';
                setTimeout(() => { if (sunIcon) sunIcon.style.transform = ''; }, 200);
            } else {
                if (moonIcon) moonIcon.style.transform = 'rotate(-18deg)';
                setTimeout(() => { if (moonIcon) moonIcon.style.transform = ''; }, 200);
            }
        });
    });
});

/* ──────────────────────────────────────────────────────────────
   13. RTL / LTR DIRECTION TOGGLER
   ────────────────────────────────────────────────────────────── */
const rtlToggleBtns = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile');
if (rtlToggleBtns.length > 0) {
    const updateLabel = () => {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        rtlToggleBtns.forEach(btn => {
            const label = btn.querySelector('.rtl-label');
            if (label) label.textContent = isRtl ? 'LTR' : 'RTL';
        });
    };
    updateLabel();

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            if (isRtl) {
                document.documentElement.removeAttribute('dir');
                localStorage.setItem('dir', 'ltr');
            } else {
                document.documentElement.setAttribute('dir', 'rtl');
                localStorage.setItem('dir', 'rtl');
            }
            updateLabel();
        });
    });
}

/* ──────────────────────────────────────────────────────────────
   14. HERO SLIDESHOW — auto cycle + category sync
   ────────────────────────────────────────────────────────────── */
let syncSlideshowWithCategory = null;

(function() {
    const slideshowContainer = $('hero-slideshow-container');
    if (!slideshowContainer) return;

    const slides = slideshowContainer.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    // Categories mapping corresponding to the slide indices:
    // Index 0: Carpenter (Carpentry)
    // Index 1: Electric (Electrical)
    // Index 2: Plumber (Plumbing)
    const categories = ['carpentry', 'electrical', 'plumbing'];
    let currentSlide = 0;
    let slideshowTimer = null;
    const SLIDESHOW_INTERVAL = 2000; // 2 seconds transition

    function showSlide(index) {
        if (index < 0 || index >= slides.length) return;

        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        currentSlide = index;

        // Auto highlight the corresponding category pill on the left
        const targetCategory = categories[index];
        const matchingPill = document.querySelector(`.pill[data-category="${targetCategory}"]`);
        if (matchingPill) {
            pills.forEach(p => p.classList.remove('active'));
            matchingPill.classList.add('active');
        }
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startSlideshow() {
        stopSlideshow();
        slideshowTimer = setInterval(nextSlide, SLIDESHOW_INTERVAL);
    }

    function stopSlideshow() {
        if (slideshowTimer) {
            clearInterval(slideshowTimer);
        }
    }

    // Expose synchronization function to category pill clicks
    syncSlideshowWithCategory = function(category) {
        const index = categories.indexOf(category);
        if (index !== -1) {
            showSlide(index);
            startSlideshow(); // Reset cycle timer when manually triggered
        }
    };

    // Initialize slideshow
    showSlide(0);
    startSlideshow();
})();


/* ============================================================
   Neighborhood Coverage Checker
   ============================================================ */
(function initZipChecker() {
    const zipInput  = document.getElementById('zip-input');
    const zipBtn    = document.getElementById('zip-btn');
    const zipResult = document.getElementById('zip-result');
    if (!zipInput || !zipBtn || !zipResult) return;

    // Brooklyn/NYC zip codes with coverage data
    const COVERED_ZIPS = {
        '11201': { area: 'Brooklyn Heights',  artisans: 8,  avgEta: '11 min' },
        '11215': { area: 'Park Slope',        artisans: 12, avgEta: '9 min'  },
        '11211': { area: 'Williamsburg',      artisans: 17, avgEta: '7 min'  },
        '11231': { area: 'Carroll Gardens',   artisans: 6,  avgEta: '14 min' },
        '11218': { area: 'Kensington',        artisans: 9,  avgEta: '12 min' },
        '11205': { area: 'Fort Greene',       artisans: 7,  avgEta: '10 min' },
        '11207': { area: 'Bushwick',          artisans: 11, avgEta: '13 min' },
        '11231': { area: 'Red Hook',          artisans: 5,  avgEta: '16 min' },
        '11226': { area: 'Flatbush',          artisans: 14, avgEta: '8 min'  },
        '11217': { area: 'Park Slope North',  artisans: 10, avgEta: '10 min' },
        '10001': { area: 'Manhattan / Chelsea',artisans: 22, avgEta: '6 min'  },
        '10002': { area: 'Lower East Side',   artisans: 19, avgEta: '7 min'  },
        '10003': { area: 'East Village',      artisans: 15, avgEta: '8 min'  },
    };

    function checkZip() {
        const zip = zipInput.value.trim();
        if (!/^\d{5}$/.test(zip)) {
            zipResult.className = 'zip-result error';
            zipResult.style.display = 'block';
            zipResult.textContent = 'Please enter a valid 5-digit zip code.';
            return;
        }
        const data = COVERED_ZIPS[zip];
        if (data) {
            zipResult.className = 'zip-result success';
            zipResult.style.display = 'block';
            zipResult.innerHTML = `✓ Coverage confirmed for ${data.area} — <strong>${data.artisans} handymen active</strong>, avg. arrival <strong>${data.avgEta}</strong>.`;
        } else {
            zipResult.className = 'zip-result error';
            zipResult.style.display = 'block';
            zipResult.innerHTML = 'No active artisans in this area yet — <a href="contact.html" style="color:inherit;text-decoration:underline">request early access</a>.';
        }
    }

    zipBtn.addEventListener('click', checkZip);
    zipInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkZip(); });
    zipInput.addEventListener('input', () => {
        if (zipResult.style.display !== 'none') {
            zipResult.style.display = 'none';
        }
    });
})();

/* ============================================================
   Cost Estimator Component
   ============================================================ */
(function initEstimator() {
    const tradeBtns  = document.querySelectorAll('.est-trade-btn');
    const serviceEl  = document.getElementById('est-service-h1');
    const costEl     = document.getElementById('est-cost-h1');
    const durationEl = document.getElementById('est-duration-h1');
    if (!tradeBtns.length || !serviceEl) return;

    const TRADE_DATA = {
        electrical: {
            services: [
                { name: 'Outlet Installation',  cost: '$60 – $95',    dur: '1–2 hrs' },
                { name: 'Lighting & Fixtures',  cost: '$75 – $140',   dur: '1–3 hrs' },
                { name: 'Panel Upgrade',        cost: '$800 – $2,400',dur: '4–8 hrs' },
                { name: 'Full Rewire',          cost: '$3,500+',       dur: '2–3 days' },
                { name: 'Circuit Breaker',      cost: '$120 – $250',  dur: '1–2 hrs' },
                { name: 'EV Charger Install',   cost: '$400 – $900',  dur: '2–4 hrs' },
            ]
        },
        plumbing: {
            services: [
                { name: 'Leak Repair',          cost: '$75 – $150',   dur: '1–2 hrs' },
                { name: 'Drain Unclogging',     cost: '$80 – $200',   dur: '1–3 hrs' },
                { name: 'Faucet Replacement',   cost: '$90 – $175',   dur: '1–2 hrs' },
                { name: 'Pipe Burst Repair',    cost: '$150 – $500',  dur: '2–6 hrs' },
                { name: 'Water Heater',         cost: '$400 – $1,200',dur: '2–4 hrs' },
                { name: 'Toilet Replacement',   cost: '$120 – $300',  dur: '1–3 hrs' },
            ]
        },
        carpentry: {
            services: [
                { name: 'Door Repair',          cost: '$80 – $200',   dur: '1–3 hrs' },
                { name: 'Cabinet Installation', cost: '$200 – $800',  dur: '2–5 hrs' },
                { name: 'Flooring Repair',      cost: '$100 – $350',  dur: '2–6 hrs' },
                { name: 'Deck Build',           cost: '$3,000+',       dur: '3–5 days' },
                { name: 'Fence Install',        cost: '$800 – $2,500',dur: '1–2 days' },
                { name: 'Framing Work',         cost: '$500 – $2,000',dur: '1–3 days' },
            ]
        },
        hvac: {
            services: [
                { name: 'AC Tune-Up',           cost: '$80 – $150',   dur: '1–2 hrs' },
                { name: 'Filter Replacement',   cost: '$40 – $80',    dur: '30–60 min' },
                { name: 'Duct Cleaning',        cost: '$300 – $600',  dur: '2–4 hrs' },
                { name: 'AC Unit Install',      cost: '$1,500 – $4,000', dur: '4–8 hrs' },
                { name: 'Heat Pump Service',    cost: '$120 – $350',  dur: '2–3 hrs' },
                { name: 'Emergency Repair',     cost: '$150 – $500',  dur: '1–4 hrs' },
            ]
        },
        painting: {
            services: [
                { name: 'Room Interior',        cost: '$150 – $400',  dur: '4–8 hrs' },
                { name: 'Exterior Wall',        cost: '$500 – $2,000',dur: '1–3 days' },
                { name: 'Trim & Molding',       cost: '$80 – $200',   dur: '2–4 hrs' },
                { name: 'Ceiling Paint',        cost: '$100 – $300',  dur: '2–4 hrs' },
                { name: 'Cabinet Painting',     cost: '$400 – $1,000',dur: '1–2 days' },
                { name: 'Stucco/Texturing',     cost: '$200 – $600',  dur: '3–6 hrs' },
            ]
        },
        general: {
            services: [
                { name: 'Furniture Assembly',   cost: '$40 – $120',   dur: '1–3 hrs' },
                { name: 'Picture Hanging',      cost: '$30 – $75',    dur: '30–90 min' },
                { name: 'Caulking & Sealing',   cost: '$60 – $150',   dur: '1–3 hrs' },
                { name: 'Gutter Cleaning',      cost: '$80 – $200',   dur: '1–2 hrs' },
                { name: 'Power Washing',        cost: '$100 – $300',  dur: '1–3 hrs' },
                { name: 'Drywall Patch',        cost: '$75 – $200',   dur: '1–3 hrs' },
            ]
        }
    };

    let currentTrade = 'electrical';

    function populateServices(trade) {
        const data = TRADE_DATA[trade];
        if (!data || !serviceEl) return;
        serviceEl.innerHTML = '';
        data.services.forEach((svc, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = svc.name;
            serviceEl.appendChild(opt);
        });
        updateResult(trade, 0);
    }

    function updateResult(trade, index) {
        const svc = TRADE_DATA[trade].services[index];
        if (!svc) return;
        if (costEl)     costEl.textContent = svc.cost;
        if (durationEl) durationEl.textContent = svc.dur;
    }

    tradeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tradeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTrade = btn.dataset.trade;
            populateServices(currentTrade);
        });
    });

    serviceEl.addEventListener('change', () => {
        updateResult(currentTrade, parseInt(serviceEl.value, 10));
    });

    // Initialize
    populateServices('electrical');
})();
