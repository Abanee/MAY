/* ============================================================
   ArtisanGrid — pages.js
   Interactive enhancements for Home2, Services, Artisans,
   Pricing, About pages
   ============================================================ */

(function () {
    'use strict';

    /* ── Shared helpers ─────────────────────────────────────── */
    const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);





/* ── Utility bar live count (shared) ─────────────────────── */
const artisanCount = $('artisan-count');
if (artisanCount) {
    setInterval(() => {
        const count = 138 + Math.floor(Math.random() * 22);
        const sector = Math.floor(Math.random() * 14) + 1;
        artisanCount.textContent = `${count} Verified Artisans Active in Sector ${sector}`;
    }, 5000);
}

/* ── Scroll reveal (shared) ────────────────────────────────── */
const revealEls = $$('.service-preview-card, .testimonial-card, .trust-card, .artisan-strip-card, .artisan-dir-card, .pricing-how-card, .plan-card, .about-stat-card, .process-card, .artisan-card, .bento-card, .faq-item, .timeline-item');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = entry.target.style.transform.replace('translateY(20px)', 'translateY(0)');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach((el, i) => {
    if (prefersReduced) return;
    el.style.opacity = '0';
    el.style.transform = (el.style.transform || '') + ' translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
    revealObserver.observe(el);
});

/* ── Smooth scroll ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* ══════════════════════════════════════════════════════════
   HOME 2 — CTA button feedback
══════════════════════════════════════════════════════════ */
const h2Cta = $('h2-cta-btn');
const h2Search = $('h2-search');
if (h2Cta && h2Search) {
    h2Cta.addEventListener('click', () => {
        const val = h2Search.value.trim();
        if (!val) { h2Search.focus(); return; }
        const orig = h2Cta.textContent;
        h2Cta.textContent = 'Matching… ✓';
        h2Cta.style.background = '#a8cc00';
        setTimeout(() => { h2Cta.textContent = orig; h2Cta.style.background = ''; }, 2200);
    });
}

/* ══════════════════════════════════════════════════════════
   SERVICES — search filter
══════════════════════════════════════════════════════════ */
const svcSearchInput = $('svc-search');
const svcSearchBtn = $('svc-search-btn');
if (svcSearchBtn && svcSearchInput) {
    function doServiceSearch() {
        const q = svcSearchInput.value.trim().toLowerCase();
        const blocks = $$('.service-category-block');
        if (!q) { blocks.forEach(b => { b.style.display = ''; }); return; }
        blocks.forEach(block => {
            const text = block.textContent.toLowerCase();
            block.style.display = text.includes(q) ? '' : 'none';
        });
    }
    svcSearchBtn.addEventListener('click', doServiceSearch);
    svcSearchInput.addEventListener('keyup', e => { if (e.key === 'Enter') doServiceSearch(); });
}

/* ══════════════════════════════════════════════════════════
   ARTISANS — trade filter + sort
══════════════════════════════════════════════════════════ */
const tradePills = $$('#trade-filters .pill');
const artisanCards = $$('.artisan-dir-card[data-trade]');

tradePills.forEach(pill => {
    pill.addEventListener('click', function () {
        tradePills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        artisanCards.forEach(card => {
            if (filter === 'all' || card.dataset.trade === filter) {
                card.style.display = '';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* ══════════════════════════════════════════════════════════
   PRICING — FAQ accordion
══════════════════════════════════════════════════════════ */
const faqBtns = $$('.faq-question');
faqBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        // Close all
        faqBtns.forEach(b => {
            b.setAttribute('aria-expanded', 'false');
            const ans = document.getElementById(b.getAttribute('aria-controls'));
            if (ans) ans.classList.remove('open');
        });
        // Toggle clicked
        if (!isOpen) {
            this.setAttribute('aria-expanded', 'true');
            const ans = document.getElementById(this.getAttribute('aria-controls'));
            if (ans) ans.classList.add('open');
        }
    });
});

/* ══════════════════════════════════════════════════════════
   PARALLAX — hero bg on mousemove (Home 2)
══════════════════════════════════════════════════════════ */
const photoBg = document.querySelector('.photo-hero-bg');
if (photoBg && !prefersReduced) {
    document.addEventListener('mousemove', e => {
        const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
        const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
        photoBg.style.transform = `scale(1.04) translate(${xRatio * -6}px, ${yRatio * -4}px)`;
    });
}

/* ══════════════════════════════════════════════════════════
   PRICE TABLE — hover accent rows
══════════════════════════════════════════════════════════ */
const priceRows = $$('.price-row');
priceRows.forEach(row => {
    const accentColor = row.dataset.color;
    if (!accentColor) return;
    row.addEventListener('mouseenter', () => {
        row.style.boxShadow = `inset 3px 0 0 ${accentColor}`;
    });
    row.addEventListener('mouseleave', () => {
        row.style.boxShadow = '';
    });
});

/* ══════════════════════════════════════════════════════════
   TICKER — ensure ticker works if the original script isn't loaded
══════════════════════════════════════════════════════════ */
// (Ticker is handled by CSS animation, nothing extra needed here)



/* ──────────────────────────────────────────────────────────────
   PRICING PAGE CUSTOM INTERACTIVES
   ────────────────────────────────────────────────────────────── */

// --- 1. Dual Plan Toggler ---
const toggleHomeowners = document.getElementById('toggle-homeowners');
const toggleArtisans = document.getElementById('toggle-artisans');
const groupHomeowners = document.getElementById('group-homeowners');
const groupArtisans = document.getElementById('group-artisans');

if (toggleHomeowners && toggleArtisans && groupHomeowners && groupArtisans) {
    // Initialize state to avoid relying purely on CSS class
    groupArtisans.style.display = 'none';
    groupHomeowners.style.display = 'grid'; // .plans-grid uses grid

    toggleHomeowners.addEventListener('click', () => {
        toggleHomeowners.classList.add('active');
        toggleArtisans.classList.remove('active');
        groupHomeowners.style.display = 'grid';
        groupArtisans.style.display = 'none';
    });

    toggleArtisans.addEventListener('click', () => {
        toggleArtisans.classList.add('active');
        toggleHomeowners.classList.remove('active');
        groupArtisans.style.display = 'grid';
        groupHomeowners.style.display = 'none';
    });
}

// --- 2. Toast Alert System ---
function showToast(message, icon = '📋') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
        <span class="custom-toast-icon">${icon}</span>
        <span class="custom-toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Fade-in trigger
    setTimeout(() => toast.classList.add('show'), 50);

    // Self-destruct sequence
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

// --- 3. Coupon Copying Logic ---
const copyButtons = document.querySelectorAll('.promo-copy-btn');
copyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const code = this.getAttribute('data-code');
        if (!code) return;

        navigator.clipboard.writeText(code).then(() => {
            const originalText = this.querySelector('.copy-text').textContent;
            const originalIcon = this.querySelector('.copy-icon').textContent;
            
            // Visual Active State Update
            this.classList.add('copied');
            this.querySelector('.copy-text').textContent = 'Copied!';
            this.querySelector('.copy-icon').textContent = '✓';

            showToast(`Promo code "${code}" copied to clipboard!`, '✅');

            // Reset state
            setTimeout(() => {
                this.classList.remove('copied');
                this.querySelector('.copy-text').textContent = originalText;
                this.querySelector('.copy-icon').textContent = originalIcon;
            }, 2000);
        }).catch(() => {
            showToast('Unable to copy code. Please type manually.', '⚠️');
        });
    });
});

// --- 4. Pricing Estimator Logic ---
const ESTIMATOR_DB = {
    electrical: [
        { name: "Outlet Installation", std: [60, 95], time: "1–2 hrs" },
        { name: "Lighting & Fixtures", std: [75, 160], time: "1–3 hrs" },
        { name: "Panel Upgrade", std: [800, 2400], time: "4–8 hrs" },
        { name: "Full Rewire", std: [1500, 5000], time: "2–5 days" },
        { name: "Circuit Breaker", std: [120, 250], time: "1–2 hrs" },
        { name: "EV Charger Install", std: [400, 900], time: "2–4 hrs" }
    ],
    plumbing: [
        { name: "Leak Repair", std: [45, 120], time: "1–3 hrs" },
        { name: "Tap & Fixture", std: [55, 130], time: "1–2 hrs" },
        { name: "Drain Cleaning", std: [80, 200], time: "1–3 hrs" },
        { name: "Water Heater", std: [300, 900], time: "2–4 hrs" },
        { name: "Pipe Replacement", std: [200, 800], time: "1–2 days" },
        { name: "Emergency Call-Out", std: [150, 350], time: "2–5 hrs" }
    ],
    carpentry: [
        { name: "Door Installation", std: [80, 200], time: "2–4 hrs" },
        { name: "Window Framing", std: [120, 350], time: "3–6 hrs" },
        { name: "Cabinet Build", std: [400, 1800], time: "1–3 days" },
        { name: "Deck & Pergola", std: [1200, 6000], time: "2–5 days" },
        { name: "Flooring", std: [150, 600], time: "1–2 days" },
        { name: "Trim & Moulding", std: [55, 180], time: "2–5 hrs" }
    ],
    hvac: [
        { name: "AC Service", std: [80, 200], time: "2–4 hrs" },
        { name: "Boiler Repair", std: [150, 500], time: "2–5 hrs" },
        { name: "Duct Cleaning", std: [300, 700], time: "3–6 hrs" },
        { name: "Thermostat Install", std: [80, 220], time: "1–2 hrs" },
        { name: "New Unit Install", std: [1500, 5000], time: "1–2 days" },
        { name: "Emergency HVAC", std: [200, 450], time: "2–4 hrs" }
    ],
    painting: [
        { name: "Interior Rooms", std: [200, 600], time: "1–2 days" },
        { name: "Exterior Facade", std: [800, 3000], time: "2–5 days" },
        { name: "Trim & Skirting", std: [40, 120], time: "3–6 hrs" },
        { name: "Feature Wall", std: [120, 350], time: "4–8 hrs" },
        { name: "Surface Prep", std: [60, 200], time: "2–5 hrs" },
        { name: "Doors & Frames", std: [50, 150], time: "3–6 hrs" }
    ],
    general: [
        { name: "Furniture Assembly", std: [35, 90], time: "1–3 hrs" },
        { name: "Drywall Patching", std: [50, 180], time: "2–4 hrs" },
        { name: "Hanging & Mounting", std: [35, 100], time: "1 hr" },
        { name: "Lock & Security", std: [60, 220], time: "1–2 hrs" },
        { name: "Tiling", std: [200, 800], time: "1–2 days" },
        { name: "Home Inspection", std: [150, 400], time: "3–5 hrs" }
    ]
};

const estTradeSelect = document.getElementById('est-trade');
const estServiceSelect = document.getElementById('est-service');
const estStdPriceText = document.getElementById('est-std-price');
const estMemPriceText = document.getElementById('est-mem-price');
const estSavingsText = document.getElementById('est-savings');
const estDurationText = document.getElementById('est-duration');

if (estTradeSelect && estServiceSelect && estStdPriceText && estMemPriceText && estSavingsText && estDurationText) {
    
    function populateServices(tradeKey) {
        estServiceSelect.innerHTML = '';
        const services = ESTIMATOR_DB[tradeKey] || [];
        services.forEach((svc, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = svc.name;
            estServiceSelect.appendChild(opt);
        });
    }

    function calculateEstimate() {
        const tradeKey = estTradeSelect.value;
        const svcIndex = parseInt(estServiceSelect.value);
        const service = (ESTIMATOR_DB[tradeKey] || [])[svcIndex];

        if (!service) return;

        const lowStd = service.std[0];
        const highStd = service.std[1];

        // Member gets a flat 10% discount
        const lowMem = Math.round(lowStd * 0.9);
        const highMem = Math.round(highStd * 0.9);

        const savingsMax = highStd - highMem;

        // Animate rates update
        estStdPriceText.textContent = `$${lowStd} – $${highStd}`;
        estMemPriceText.textContent = `$${lowMem} – $${highMem}`;
        estSavingsText.textContent = `Save up to $${savingsMax}`;
        estDurationText.textContent = service.time;
    }

    estTradeSelect.addEventListener('change', () => {
        populateServices(estTradeSelect.value);
        calculateEstimate();
    });

    estServiceSelect.addEventListener('change', calculateEstimate);

    // Initial setup load
    populateServices('electrical');
    calculateEstimate();
}
})();
