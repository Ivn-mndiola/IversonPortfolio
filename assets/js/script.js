// ── 1. BIDIRECTIONAL SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    } else {
      e.target.classList.remove('visible'); 
    }
  });
}, { 
  threshold: 0.12,
  rootMargin: "0px 0px -20px 0px" 
});

reveals.forEach(el => revealObserver.observe(el));

// ── 2. INTENT-DRIVEN NAV & FADE TRANSITION ──
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    
    // CASE A: Links to a DIFFERENT page (projects.html)
    if (href && href.endsWith('.html')) {
        e.preventDefault(); 
        closeMobileMenu();
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    } 
    
    // CASE B: Links to a section on THIS page (#projects, #hero)
    else if (href && href.startsWith('#')) {
      e.preventDefault(); 
      closeMobileMenu();
      
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');

      const targetSection = document.querySelector(href);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ── 3. MOBILE HAMBURGER MENU ──

// Inject hamburger button + mobile nav styles dynamically
// (avoids touching the CSS file)
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
    background: rgba(7,16,48,0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    opacity: 0;
    transition: opacity 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .mobile-nav-overlay.open {
    opacity: 1;
  }
  .mobile-nav-overlay a {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s, transform 0.2s;
    transform: translateY(12px);
    opacity: 0;
    transition: color 0.2s, transform 0.35s cubic-bezier(0.34,1.6,0.64,1), opacity 0.35s ease;
  }
  .mobile-nav-overlay.open a {
    transform: translateY(0);
    opacity: 1;
  }
  .mobile-nav-overlay.open a:nth-child(1) { transition-delay: 0.05s; }
  .mobile-nav-overlay.open a:nth-child(2) { transition-delay: 0.10s; }
  .mobile-nav-overlay.open a:nth-child(3) { transition-delay: 0.15s; }
  .mobile-nav-overlay.open a:nth-child(4) { transition-delay: 0.20s; }
  .mobile-nav-overlay.open a:nth-child(5) { transition-delay: 0.25s; }
  .mobile-nav-overlay a:hover, .mobile-nav-overlay a.active { color: #fff; }

  @media (max-width: 768px) {
    .hamburger { display: flex; }
    nav .nav-links { display: none; }
    nav .nav-logo { top: 32px; }
  }
`;
document.head.appendChild(mobileStyles);

// Build hamburger button
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.setAttribute('aria-label', 'Toggle menu');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.innerHTML = '<span></span><span></span><span></span>';
document.body.appendChild(hamburger);

// Build overlay nav
const overlay = document.createElement('nav');
overlay.className = 'mobile-nav-overlay';

const mobileNavItems = [
  { href: '#hero',     label: 'Home' },
  { href: 'projects.html', label: 'Projects' },
  { href: '#services', label: 'Services' },
  { href: '#about',    label: 'About' },
  { href: '#contact',  label: 'Contact' },
];

mobileNavItems.forEach(item => {
  const a = document.createElement('a');
  a.href = item.href;
  a.textContent = item.label;

  // Mark active on current page section
  if (item.href === window.location.hash || (window.location.hash === '' && item.href === '#hero')) {
    a.classList.add('active');
  }

  a.addEventListener('click', e => {
    const href = a.getAttribute('href');

    if (href.endsWith('.html')) {
      e.preventDefault();
      closeMobileMenu();
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = href; }, 500);
    } else if (href.startsWith('#')) {
      e.preventDefault();
      closeMobileMenu();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  overlay.appendChild(a);
});

document.body.appendChild(overlay);

function openMobileMenu() {
  overlay.style.display = 'flex';
  // Force reflow so transition fires
  overlay.getBoundingClientRect();
  overlay.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  overlay.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  // Hide after transition
  setTimeout(() => { overlay.style.display = ''; }, 360);
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMobileMenu();
});