/* ============================================================
   ArtisanGrid — dashboard.js
   Customer Dashboard: Ratings · Booking · Live Tracking · Tabs
   ============================================================ */

(function () {
    'use strict';





/* ──────────────────────────────────────────────────────────────
   3. BOOKING WIDGET — Category pills + price estimates
────────────────────────────────────────────────────────────── */
const BOOK_PRICES = {
    electrical: { range: '$60 — $150', avail: '⚡ Electricians available in ~6 min' },
    plumbing:   { range: '$45 — $120', avail: '🔧 Plumbers available in ~12 min' },
    carpentry:  { range: '$55 — $200', avail: '🪚 Carpenters available in ~20 min' },
    hvac:       { range: '$80 — $250', avail: '❄️ HVAC technicians available in ~18 min' },
    general:    { range: '$40 — $130', avail: '🛠️ Handymen available in ~8 min' },
    painting:   { range: '$70 — $320', avail: '🖌️ Painters available in ~30 min' },
};

const bookPills   = document.querySelectorAll('#book-pills .pill');
const bookPriceEl = document.getElementById('book-price-range');
const bookAvailEl = document.getElementById('book-avail');

bookPills.forEach(pill => {
    pill.addEventListener('click', function () {
        bookPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        const cat = this.dataset.category;
        const data = BOOK_PRICES[cat];
        if (!data) return;

        if (bookPriceEl) {
            bookPriceEl.style.opacity = '0';
            bookPriceEl.style.transition = 'opacity 0.2s';
            setTimeout(() => {
                bookPriceEl.textContent  = data.range;
                bookPriceEl.style.opacity = '1';
            }, 200);
        }
        if (bookAvailEl) {
            bookAvailEl.style.opacity = '0';
            setTimeout(() => {
                bookAvailEl.textContent = data.avail;
                bookAvailEl.style.opacity = '1';
            }, 200);
        }
    });
});

/* ── Booking Submit ──────────────────────────────────────── */
const bookBtn     = document.getElementById('book-btn');
const bookInput   = document.getElementById('book-input');
const bookSuccess = document.getElementById('booking-success');

if (bookBtn) {
    bookBtn.addEventListener('click', () => {
        const val = bookInput ? bookInput.value.trim() : '';
        if (!val) {
            if (bookInput) {
                bookInput.focus();
                bookInput.closest('.cta-bar').style.boxShadow = '0 0 0 2px rgba(239,68,68,0.4)';
                setTimeout(() => { bookInput.closest('.cta-bar').style.boxShadow = ''; }, 1800);
            }
            return;
        }

        // Show success
        bookBtn.textContent = 'Dispatching… ✓';
        bookBtn.style.background = 'rgba(16,185,129,0.2)';
        bookBtn.style.color = 'var(--color-4)';
        bookBtn.disabled = true;

        if (bookSuccess) {
            bookSuccess.classList.remove('hidden');
        }

        setTimeout(() => {
            bookBtn.textContent = 'Request Dispatch →';
            bookBtn.style.background = '';
            bookBtn.style.color = '';
            bookBtn.disabled = false;
            if (bookInput) bookInput.value = '';
            setTimeout(() => {
                if (bookSuccess) bookSuccess.classList.add('hidden');
            }, 3500);
        }, 2000);
    });
}

/* ──────────────────────────────────────────────────────────────
   4. STAR RATING SYSTEM
────────────────────────────────────────────────────────────── */
const starRatings = {}; // { jobId: number }

const STAR_HINTS = ['', 'Poor — not recommended', 'Below average', 'Good work', 'Great experience!', 'Outstanding — 5 stars!'];

function initStarWidget(jobId) {
    const starsContainer = document.getElementById(`stars-${jobId}`);
    const hintEl         = document.getElementById(`hint-${jobId}`);
    const submitBtn      = document.getElementById(`submit-${jobId}`);
    if (!starsContainer) return;

    const stars = starsContainer.querySelectorAll('.star');

    function updateStars(val, isHover) {
        stars.forEach((s, i) => {
            s.classList.remove('selected', 'hovered');
            if (i < val) {
                s.classList.add(isHover ? 'hovered' : 'selected');
            }
        });
    }

    // Hover effect
    stars.forEach((star, idx) => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.val);
            updateStars(val, true);
            if (hintEl) {
                hintEl.textContent = STAR_HINTS[val];
                hintEl.style.color = 'var(--color-3)';
            }
        });
    });

    starsContainer.addEventListener('mouseleave', () => {
        // Restore to selected state on leave
        const current = starRatings[jobId] || 0;
        updateStars(current, false);
        if (hintEl) {
            hintEl.textContent = current ? STAR_HINTS[current] : 'Tap a star to rate';
            hintEl.style.color = current ? 'var(--volt)' : '';
        }
    });

    // Click to select
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.dataset.val);
            starRatings[jobId] = val;
            updateStars(val, false);

            if (hintEl) {
                hintEl.textContent = STAR_HINTS[val];
                hintEl.style.color = 'var(--volt)';
            }

            // Enable submit
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        });
    });

    // Submit
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const rating = starRatings[jobId];
            if (!rating) return;

            const textEl = document.getElementById(`text-${jobId}`);
            const review = textEl ? textEl.value.trim() : '';

            submitReview(jobId, rating, review);
        });
    }
}

function submitReview(jobId, rating, reviewText) {
    const card   = document.getElementById(`review-card-${jobId}`);
    const widget = document.getElementById(`widget-${jobId}`);
    const submitBtn = document.getElementById(`submit-${jobId}`);

    if (submitBtn) {
        submitBtn.textContent = 'Submitting…';
        submitBtn.disabled = true;
    }

    setTimeout(() => {
        // Swap widget for submitted display
        if (widget) {
            const starStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            const textHtml = reviewText
                ? `<p class="submitted-text font-mono">"${reviewText}"</p>`
                : `<p class="submitted-text font-mono" style="font-style:normal;color:var(--text-muted)">No written review submitted.</p>`;

            widget.innerHTML = `
                <div class="submitted-review" style="border-top:1px solid var(--border);margin-top:20px;padding-top:18px">
                    <div class="submitted-stars font-mono">${starStr}</div>
                    <div class="star-hint font-mono" style="color:var(--volt);margin-top:6px;margin-bottom:0">${rating} out of 5 stars</div>
                    ${textHtml}
                    <div class="font-mono text-xs" style="color:var(--text-muted);margin-top:12px">Submitted just now</div>
                </div>
            `;
        }

        // Update card status badge
        if (card) {
            card.dataset.status = 'reviewed';
            const dateEl = card.querySelector('.review-card-date');
            if (dateEl) {
                const existing = dateEl.querySelector('.badge-pending');
                if (existing) {
                    const span = document.createElement('span');
                    span.className = 'badge-reviewed';
                    span.textContent = 'REVIEWED ✓';
                    existing.replaceWith(span);
                }
            }
            // Update top border
            card.classList.add('review-card--reviewed');
            const style = document.createElement('style');
            style.textContent = `#review-card-${jobId}::before { background: var(--volt) !important; }`;
            document.head.appendChild(style);
        }

        // Update stats
        updateReviewStats();

        // Update tab counts
        refreshTabCounts();

    }, 700);
}

// Skip a review (just close the widget)
window.skipReview = function (jobId) {
    const widget = document.getElementById(`widget-${jobId}`);
    if (widget) {
        widget.style.transition = 'opacity 0.3s, max-height 0.4s';
        widget.style.opacity = '0';
        setTimeout(() => {
            widget.style.display = 'none';
        }, 300);
    }
};

/* ──────────────────────────────────────────────────────────────
   5. HISTORY TABS — filter review cards
────────────────────────────────────────────────────────────── */
const historyTabs = document.querySelectorAll('.history-tab');

historyTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        historyTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;
        const cards  = document.querySelectorAll('.review-card');

        cards.forEach(card => {
            const status = card.dataset.status;
            const show =
                filter === 'all'      ? true :
                filter === 'pending'  ? status === 'pending' :
                filter === 'reviewed' ? status === 'reviewed' :
                true;

            if (show) {
                card.classList.remove('hidden-by-filter');
            } else {
                card.classList.add('hidden-by-filter');
            }
        });
    });
});

function refreshTabCounts() {
    const allCards      = document.querySelectorAll('.review-card');
    const pendingCards  = document.querySelectorAll('.review-card[data-status="pending"]');
    const reviewedCards = document.querySelectorAll('.review-card[data-status="reviewed"]');

    const tabAll      = document.querySelector('.history-tab[data-filter="all"]');
    const tabPending  = document.querySelector('.history-tab[data-filter="pending"]');
    const tabReviewed = document.querySelector('.history-tab[data-filter="reviewed"]');

    if (tabAll)      tabAll.textContent      = `All Completed (${allCards.length})`;
    if (tabPending)  tabPending.textContent  = `Awaiting Review (${pendingCards.length})`;
    if (tabReviewed) tabReviewed.textContent = `Reviewed (${reviewedCards.length})`;
}

/* ──────────────────────────────────────────────────────────────
   6. LIVE ETA COUNTDOWN for active jobs
────────────────────────────────────────────────────────────── */
const etaEl = document.getElementById('job-eta-1');
let etaMinutes = 8;

function tickETA() {
    if (!etaEl) return;
    // Slowly count down
    if (etaMinutes > 1) {
        etaMinutes -= 1;
        etaEl.textContent = `${etaMinutes} min`;
        etaEl.classList.add('eta-counting');
    } else {
        etaEl.textContent = 'Arriving…';
        etaEl.style.color = 'var(--color-4)';
        clearInterval(etaTimer);
    }
}
const etaTimer = setInterval(tickETA, 30000); // tick every 30s

/* ──────────────────────────────────────────────────────────────
   7. JOB PROGRESS SIMULATION — gentle increment
────────────────────────────────────────────────────────────── */
const progressFill = document.getElementById('job-progress-1');
let progressVal = 58;

function tickProgress() {
    if (!progressFill) return;
    if (progressVal < 98) {
        progressVal += Math.random() * 0.4;
        progressFill.style.width = progressVal.toFixed(1) + '%';

        // Update the label
        const progressLabel = progressFill.closest('.job-progress-wrap');
        if (progressLabel) {
            const span = progressLabel.querySelector('.flex span:last-child');
            if (span) span.textContent = Math.round(progressVal) + '%';
        }
    }
}
setInterval(tickProgress, 8000);

/* ──────────────────────────────────────────────────────────────
   8. ARTISAN COUNT SIMULATION (same ticker as homepage)
────────────────────────────────────────────────────────────── */
const artisanCountEl  = document.getElementById('artisan-count');
const footerCountEl   = document.getElementById('footer-count');

function updateLiveCounts() {
    const count  = 138 + Math.floor(Math.random() * 28);
    const sector = Math.floor(Math.random() * 14) + 1;
    if (artisanCountEl) {
        artisanCountEl.style.opacity = '0';
        artisanCountEl.style.transition = 'opacity 0.35s';
        setTimeout(() => {
            artisanCountEl.textContent = `${count} Verified Artisans Active in Sector ${sector}`;
            artisanCountEl.style.opacity = '1';
        }, 350);
    }
    if (footerCountEl) footerCountEl.textContent = `${count} artisans online`;
}
setInterval(updateLiveCounts, 5000);

/* ──────────────────────────────────────────────────────────────
   9. UPDATE STATS after review submission
────────────────────────────────────────────────────────────── */
function updateReviewStats() {
    const pendingCount  = document.querySelectorAll('.review-card[data-status="pending"]').length;
    const reviewedCount = document.querySelectorAll('.review-card[data-status="reviewed"]').length;

    const statRating = document.getElementById('stat-rating');
    if (statRating && reviewedCount > 1) {
        statRating.textContent = '5.0';
    }
}

/* ──────────────────────────────────────────────────────────────
   10. SCROLL-TRIGGERED REVEAL — cards fade in on scroll
────────────────────────────────────────────────────────────── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
    const revealEls = document.querySelectorAll('.job-card, .review-card, .dash-stat-card');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = entry.target.style.transform.replace('translateY(18px)', '');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach((el, i) => {
        el.style.opacity    = '0';
        el.style.transform  = (el.style.transform || '') + ' translateY(18px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s, border-color 0.25s, box-shadow 0.25s`;
        revealObs.observe(el);
    });
}

/* ──────────────────────────────────────────────────────────────
   11. SMOOTH SCROLL for anchor links
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
   12. INIT
────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initStarWidget('2815');
    initStarWidget('2801');
    refreshTabCounts();

    // Restore active tab
    const savedTab = localStorage.getItem('active_dash_tab') || 'overview';
    window.switchDashboardTab(savedTab);
});

/* ──────────────────────────────────────────────────────────────
   13. RTL / LTR DIRECTION TOGGLER
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

/* ──────────────────────────────────────────────────────────────
   14. DASHBOARD TAB SWITCHING SYSTEM
   ────────────────────────────────────────────────────────────── */
const sidebarTabs = document.querySelectorAll('.dash-nav-item');
const tabContents = document.querySelectorAll('.dash-tab-content');

sidebarTabs.forEach(btn => {
    btn.addEventListener('click', function () {
        const targetTab = this.dataset.tab;
        
        sidebarTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        tabContents.forEach(content => {
            if (content.id === `tab-${targetTab}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
        
        localStorage.setItem('active_dash_tab', targetTab);
    });
});

window.switchDashboardTab = function (tabName) {
    const btn = document.querySelector(`.dash-nav-item[data-tab="${tabName}"]`);
    if (btn) btn.click();
};

/* ── Profile settings save feedback ───────────────────────── */
const saveProfileBtn = document.getElementById('save-profile-btn');
const profileName = document.getElementById('profile-name');
const cardHolderName = document.getElementById('card-holder-name');

if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
        saveProfileBtn.textContent = 'Saving… ✓';
        saveProfileBtn.disabled = true;
        saveProfileBtn.style.opacity = '0.7';
        
        if (profileName && cardHolderName) {
            cardHolderName.textContent = profileName.value.trim();
            const greetingName = document.querySelector('.dash-greeting span');
            if (greetingName) greetingName.textContent = profileName.value.trim();
            const sidebarName = document.querySelector('.dsp-name');
            if (sidebarName) sidebarName.textContent = profileName.value.trim();
        }
        
        setTimeout(() => {
            saveProfileBtn.textContent = 'Save Changes';
            saveProfileBtn.disabled = false;
            saveProfileBtn.style.opacity = '1';
            alert('Profile settings saved successfully!');
        }, 1000);
    });
}
})();

