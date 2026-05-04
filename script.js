/* ============================================================
   NOVA ENTERTAINMENT — script.js
   ============================================================ */

/* ─── PRELOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2000);
});

/* ─── STICKY HEADER ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── HAMBURGER / MOBILE NAV ─── */
const hamburger    = document.getElementById('hamburger');
const mobileNav    = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  mobileOverlay.classList.toggle('open', isOpen);
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileOverlay.addEventListener('click', closeMobileNav);

function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Toggle a collapsible item in the mobile nav.
 * Called via onclick="toggleMobileItem(this)" in the HTML.
 * @param {HTMLElement} el  — the <li> element
 */
function toggleMobileItem(el) {
  // Prevent the anchor link from navigating
  event.preventDefault();
  el.classList.toggle('open');
}

/* ─── HERO SLIDER ─── */
let currentSlide  = 0;
const slides       = document.querySelectorAll('.slide');
const dots         = document.querySelectorAll('.dot');
const slideCounter = document.getElementById('currentSlide');
let autoplayTimer;

/**
 * Jump to a specific slide index.
 * @param {number} idx
 */
function goToSlide(idx) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = (idx + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  slideCounter.textContent = String(currentSlide + 1).padStart(2, '0');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide()  { goToSlide(currentSlide - 1); }

function startAutoplay()  { autoplayTimer = setInterval(nextSlide, 5000); }
function resetAutoplay()  { clearInterval(autoplayTimer); startAutoplay(); }

document.getElementById('nextBtn').addEventListener('click', () => {
  nextSlide();
  resetAutoplay();
});
document.getElementById('prevBtn').addEventListener('click', () => {
  prevSlide();
  resetAutoplay();
});

// Start the slider
startAutoplay();

// Expose goToSlide globally so inline onclick="goToSlide(n)" works
window.goToSlide = goToSlide;

/* ─── ARTIST TABS ─── */
/**
 * Switch between artist category tabs.
 * Called via onclick="switchTab(this, 'musicians')" in the HTML.
 * @param {HTMLElement} btn   — the clicked tab button
 * @param {string}      tabId — id suffix, e.g. 'musicians'
 */
function switchTab(btn, tabId) {
  document.querySelectorAll('.artist-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.artists-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}

// Expose globally for inline onclick
window.switchTab      = switchTab;
window.toggleMobileItem = toggleMobileItem;

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
