/* ============================================================
   ArtisanGrid — contact.js
   Contact page: form validation, SLA bar animation, FAQ
   ============================================================ */
(function () {
    'use strict';

    /* ── Helpers ──────────────────────────────────────────────── */
    const $  = (id) => document.getElementById(id);
    const $$ = (sel) => document.querySelectorAll(sel);

/* ── Contact Form Validation & Submit ─────────────────────── */
(function initContactForm() {
    const form    = $('contact-form');
    const submit  = $('cf-submit-btn');
    const success = $('cf-success');
    if (!form) return;

    function showErr(id, msg) {
        const el = $(id);
        if (el) { el.textContent = msg; }
    }
    function clearErr(id) { showErr(id, ''); }

    function validateEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }

    function validate() {
        let ok = true;
        const name     = $('cf-name');
        const email    = $('cf-email');
        const topic    = $('cf-topic');
        const subject  = $('cf-subject');
        const message  = $('cf-message');
        const privacy  = $('cf-privacy');

        clearErr('cf-name-err');
        clearErr('cf-email-err');
        clearErr('cf-topic-err');
        clearErr('cf-subject-err');
        clearErr('cf-msg-err');
        clearErr('cf-privacy-err');

        if (!name.value.trim()) {
            showErr('cf-name-err', 'Please enter your name.');
            ok = false;
        }
        if (!email.value.trim() || !validateEmail(email.value)) {
            showErr('cf-email-err', 'Please enter a valid email address.');
            ok = false;
        }
        if (!topic.value) {
            showErr('cf-topic-err', 'Please choose a topic.');
            ok = false;
        }
        if (!subject.value.trim()) {
            showErr('cf-subject-err', 'Please enter a subject.');
            ok = false;
        }
        if (message.value.trim().length < 20) {
            showErr('cf-msg-err', 'Message must be at least 20 characters.');
            ok = false;
        }
        if (!privacy.checked) {
            showErr('cf-privacy-err', 'You must agree to the Privacy Policy.');
            ok = false;
        }
        return ok;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) return;

        // Show loading state
        submit.disabled = true;
        submit.textContent = 'Sending…';

        // Simulate async send (1.6s)
        setTimeout(function () {
            const emailEcho = $('cfs-email-echo');
            if (emailEcho) emailEcho.textContent = $('cf-email').value.trim();

            form.style.display = 'none';
            success.classList.remove('hidden');
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1600);
    });

    // Live-clear errors on input
    ['cf-name','cf-email','cf-topic','cf-subject','cf-message'].forEach(function(id) {
        const el = $(id);
        if (el) {
            el.addEventListener('input', function() {
                const errId = id + '-err';
                if (id === 'cf-message') clearErr('cf-msg-err');
                else clearErr(errId);
            });
        }
    });
})();

/* ── SLA Bars: animate in on scroll ──────────────────────── */
(function initSLABars() {
    const bars = $$('.sla-bar');
    if (!bars.length) return;

    // Store target widths and reset to 0 initially
    bars.forEach(function(bar) {
        bar._targetWidth = bar.style.width;
        bar.style.width = '0%';
    });

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const bar = entry.target;
                // Small delay for stagger effect
                const idx = Array.from(bars).indexOf(bar);
                setTimeout(function() {
                    bar.style.width = bar._targetWidth;
                }, idx * 120);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(function(bar) { observer.observe(bar); });
})();

/* ── FAQ Accordion ────────────────────────────────────────── */
(function initFAQ() {
    const buttons = $$('[id^="cfaq-"][id$="-btn"]');
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            const answerId = btn.getAttribute('aria-controls');
            const answer   = $(answerId);
            const chevron  = btn.querySelector('.faq-chevron');

            // Close all others
            buttons.forEach(function(other) {
                if (other !== btn) {
                    other.setAttribute('aria-expanded', 'false');
                    const otherId  = other.getAttribute('aria-controls');
                    const otherAns = $(otherId);
                    if (otherAns) otherAns.style.maxHeight = null;
                    const otherChev = other.querySelector('.faq-chevron');
                    if (otherChev) otherChev.style.transform = '';
                }
            });

            // Toggle current
            if (expanded) {
                btn.setAttribute('aria-expanded', 'false');
                if (answer) answer.style.maxHeight = null;
                if (chevron) chevron.style.transform = '';
            } else {
                btn.setAttribute('aria-expanded', 'true');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
        });
    });
})();

/* ── Team Status: randomize "Away/Online" periodically ─────── */
(function initTeamStatus() {
    const awayMembers = $$('.ctm-status.away');
    if (!awayMembers.length) return;

    setInterval(function() {
        awayMembers.forEach(function(el) {
            const wasOnline = el.classList.contains('available');
            if (Math.random() > 0.6) {
                el.classList.toggle('available');
                el.classList.toggle('away');
                el.textContent = el.classList.contains('available') ? '● Online' : '◌ Away';
            }
        });
    }, 8000);
})();
})();
