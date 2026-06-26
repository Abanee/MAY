/* ============================================================
   ArtisanGrid — pages.js
   Interactive enhancements for Home2, Services, Artisans,
   Pricing, About pages
   ============================================================ */

'use strict';

/* ── Shared helpers ─────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ── Theme Toggler (shared with all pages) ──────────────── */
const themeToggleBtn = $('theme-toggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        const sunIcon = this.querySelector('.sun-icon');
        const moonIcon = this.querySelector('.moon-icon');
        if (isLight) {
            if (sunIcon) { sunIcon.style.transform = 'rotate(18deg)'; setTimeout(() => { sunIcon.style.transform = ''; }, 200); }
        } else {
            if (moonIcon) { moonIcon.style.transform = 'rotate(-18deg)'; setTimeout(() => { moonIcon.style.transform = ''; }, 200); }
        }
    });
}

/* ── Mobile Menu (shared) ────────────────────────────────── */
const menuToggle = $('menu-toggle');
const mobileMenu = $('mobile-menu');
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
        const isOpen = !mobileMenu.classList.contains('hidden');
        this.setAttribute('aria-expanded', String(isOpen));
        const spans = this.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'translateY(6px) rotate(45deg)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });
}

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
   RTL / LTR DIRECTION TOGGLER
   ────────────────────────────────────────────────────────────── */
const rtlToggleBtn = document.getElementById('rtl-toggle');
if (rtlToggleBtn) {
    const label = rtlToggleBtn.querySelector('.rtl-label');
    const updateLabel = () => {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        if (label) label.textContent = isRtl ? 'LTR' : 'RTL';
    };
    updateLabel();

    rtlToggleBtn.addEventListener('click', function () {
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
}
