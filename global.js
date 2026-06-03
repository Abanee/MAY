/* ═══════════════════════════════════════════════════════
   AURA DETAILING — Global JavaScript
   Custom Cursor, Smooth Scroll (Lenis), Nav scroll, Reveals
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PAGE TRANSITION ──────────────────────────────── */
  const transition = document.querySelector('.page-transition');
  if (transition) {
    setTimeout(() => { transition.style.opacity = '0'; }, 50);
    document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('javascript')) {
          e.preventDefault();
          transition.style.opacity = '1';
          setTimeout(() => { window.location.href = href; }, 400);
        }
      });
    });
  }



  /* ── LENIS SMOOTH SCROLL ──────────────────────────── */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -80, duration: 1.6 });
      });
    });
  }

  /* ── NAVBAR SCROLL BEHAVIOR ──────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE MENU ──────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translateY(6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-6px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── SCROLL REVEALS ───────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    reveals.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.0,
            delay: parseFloat(el.dataset.delay || 0),
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });
  } else {
    // Fallback: IntersectionObserver
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── MAGNETIC BUTTONS ─────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── GLASS CARD SPOTLIGHT ─────────────────────────── */
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });

  /* ── GSAP PARALLAX ────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax || 0.3);
      gsap.to(el, {
        yPercent: speed * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });
  }

});
