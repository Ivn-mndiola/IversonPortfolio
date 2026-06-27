/**
 * projects.js — Optimized slider for Iverson's portfolio
 * GPU-accelerated transitions, roster cycling, keyboard + touch support
 * Mobile hamburger menu included
 */

(() => {
  'use strict';

  /* ─── DOM refs ─── */
  const slides      = Array.from(document.querySelectorAll('.slide'));
  const prevBtn     = document.querySelector('.arrow-prev');
  const nextBtn     = document.querySelector('.arrow-next');
  const trackerFill = document.querySelector('.tracker-fill');
  const trackerNums = document.querySelector('.tracker-numbers');
  const total       = slides.length;

  let current     = 0;
  let isAnimating = false;

  /* ─── Roster (Danes slide) ─── */
  const rosterFaces = Array.from(document.querySelectorAll('.roster-face'));
  let rosterIndex   = 0;
  let rosterTimer   = null;

  /* ─── Reduced-motion check ─── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TRANSITION_MS  = prefersReduced ? 0 : 650;

  /* ─── GPU hint: promote slides to their own compositor layer ─── */
  slides.forEach(slide => {
    slide.style.willChange = 'opacity, visibility';
    slide.style.transform  = 'translateZ(0)';
  });

  /* ─── Tracker update ─── */
  function updateTracker(index) {
    const pct   = ((index + 1) / total) * 100;
    trackerFill.style.width = `${pct}%`;
    const label = String(index + 1).padStart(2, '0');
    const tot   = String(total).padStart(2, '0');
    trackerNums.textContent = `${label}/${tot}`;
  }

  /* ─── Roster cycling (only while Danes slide is active) ─── */
  function startRoster() {
    if (!rosterFaces.length) return;
    rosterTimer = setInterval(() => {
      rosterFaces[rosterIndex].classList.remove('active-face');
      rosterIndex = (rosterIndex + 1) % rosterFaces.length;
      rosterFaces[rosterIndex].classList.add('active-face');
    }, 2500);
  }

  function stopRoster() {
    clearInterval(rosterTimer);
    rosterTimer = null;
  }

  /* ─── Core go-to-slide ─── */
  function goTo(next) {
    if (isAnimating || next === current) return;
    isAnimating = true;

    if (current === 0) stopRoster();

    slides[current].classList.remove('active');
    slides[next].classList.add('active');
    current = next;

    updateTracker(current);

    if (current === 0) startRoster();

    setTimeout(() => { isAnimating = false; }, TRANSITION_MS);
  }

  function goPrev() { goTo((current - 1 + total) % total); }
  function goNext() { goTo((current + 1) % total); }

  /* ─── Arrow controls ─── */
  prevBtn?.addEventListener('click', goPrev);
  nextBtn?.addEventListener('click', goNext);

  /* ─── Keyboard ─── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goPrev();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMobileMenu();
  });

  /* ─── Touch / swipe ─── */
  let touchStartX = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 48) { dx < 0 ? goNext() : goPrev(); }
  }, { passive: true });

  /* ─── Init slider ─── */
  updateTracker(0);
  startRoster();


  /* ════════════════════════════════
     MOBILE HAMBURGER MENU
     ════════════════════════════════ */
  const mobileStyles = document.createElement('style');
  mobileStyles.textContent = `
    .hamburger {
      display: none;
      position: fixed;
      top: 32px;
      right: 20px;
      z-index: 200;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      cursor: pointer;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: background 0.2s;
    }
    .hamburger:hover { background: rgba(255,255,255,0.12); }
    .hamburger span {
      display: block;
      width: 20px;
      height: 1.5px;
      background: #fff;
      border-radius: 2px;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
      transform-origin: center;
    }
    .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    .mobile-nav-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 150;
      background: rgba(3,7,18,0.93);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      opacity: 0;
      transition: opacity 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    .mobile-nav-overlay.open { opacity: 1; }
    .mobile-nav-overlay a {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      text-transform: uppercase;
      transform: translateY(12px);
      opacity: 0;
      transition: color 0.2s,
                  transform 0.35s cubic-bezier(0.34,1.6,0.64,1),
                  opacity 0.35s ease;
    }
    .mobile-nav-overlay.open a          { transform: translateY(0); opacity: 1; }
    .mobile-nav-overlay.open a:nth-child(1) { transition-delay: 0.05s; }
    .mobile-nav-overlay.open a:nth-child(2) { transition-delay: 0.10s; }
    .mobile-nav-overlay.open a:nth-child(3) { transition-delay: 0.15s; }
    .mobile-nav-overlay.open a:nth-child(4) { transition-delay: 0.20s; }
    .mobile-nav-overlay.open a:nth-child(5) { transition-delay: 0.25s; }
    .mobile-nav-overlay a:hover,
    .mobile-nav-overlay a.active { color: #fff; }

    @media (max-width: 768px) {
      .hamburger { display: flex; }
      nav .nav-links { display: none !important; }
      /* Pull arrows inside safe zone so they don't fight the hamburger */
      .arrow-prev { left: 12px; }
      .arrow-next { right: 12px; }
      /* Tracker sits lower on small screens */
      .slide-tracker { bottom: 24px; left: 50%; transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(mobileStyles);

  /* Build hamburger button */
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(hamburger);

  /* Build overlay */
  const overlay = document.createElement('nav');
  overlay.className = 'mobile-nav-overlay';

  const mobileNavItems = [
    { href: 'index.html',          label: 'Home' },
    { href: 'projects.html',       label: 'Projects' },
    { href: 'index.html#services', label: 'Services' },
    { href: 'index.html#about',    label: 'About' },
    { href: 'index.html#contact',  label: 'Contact' },
  ];

  mobileNavItems.forEach(item => {
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.href === 'projects.html') a.classList.add('active');

    a.addEventListener('click', e => {
      e.preventDefault();
      closeMobileMenu();
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = item.href; }, 360);
    });

    overlay.appendChild(a);
  });

  document.body.appendChild(overlay);

  function openMobileMenu() {
    overlay.style.display = 'flex';
    overlay.getBoundingClientRect(); // force reflow
    overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    setTimeout(() => { overlay.style.display = ''; }, 360);
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

})();