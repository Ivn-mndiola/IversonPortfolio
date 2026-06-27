document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Reveal Animation Logic
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger immediately on load

  // 2. Mockup Carousel Slider Logic (Infinite Loop)
  const track = document.getElementById('mockupTrack');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');

  if (track && prevBtn && nextBtn) {

    // Clone all cards and append/prepend them for seamless looping
    const originalCards = Array.from(track.querySelectorAll('.mockup-card'));
    const totalOriginal = originalCards.length;

    // Append clones at the end (for next looping)
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    // Prepend clones at the start (for prev looping)
    originalCards.slice().reverse().forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.prepend(clone);
    });

    const getScrollAmount = () => {
      const card = track.querySelector('.mockup-card');
      if (card) {
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        return card.offsetWidth + gap;
      }
      return 300;
    };

    // Start scrolled to the first real card (past the prepended clones)
    const jumpToRealStart = () => {
      const amount = getScrollAmount();
      track.scrollLeft = amount * totalOriginal;
    };
    jumpToRealStart();

    let isScrolling = false;

    const handleLoopReset = () => {
      const amount = getScrollAmount();
      const totalWidth = amount * totalOriginal;
      const cloneStart = amount * totalOriginal;   // where real cards start
      const cloneEnd = amount * totalOriginal * 2; // where end clones start

      // If scrolled into the end clones, jump back to real start
      if (track.scrollLeft >= cloneEnd) {
        track.scrollLeft = cloneStart;
      }
      // If scrolled into the front clones, jump to real end
      if (track.scrollLeft < totalWidth * 0.5 - amount) {
        track.scrollLeft = cloneEnd - amount;
      }
    };

    nextBtn.addEventListener('click', () => {
      if (isScrolling) return;
      isScrolling = true;
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      setTimeout(() => {
        handleLoopReset();
        isScrolling = false;
      }, 400);
    });

    prevBtn.addEventListener('click', () => {
      if (isScrolling) return;
      isScrolling = true;
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      setTimeout(() => {
        handleLoopReset();
        isScrolling = false;
      }, 400);
    });
  }

  // 3. Social Media Slider (Seamless Centered Loop + Active Glow Logic)
  const socialTrack = document.getElementById('socialTrack');
  const socialTrackWrapper = document.querySelector('.social-track-wrapper');
  const socialPrev = document.querySelector('.social-prev');
  const socialNext = document.querySelector('.social-next');
  const dotsContainer = document.getElementById('socialDots');

  if (socialTrack && socialTrackWrapper && socialPrev && socialNext && dotsContainer) {
    const originalCards = Array.from(socialTrack.querySelectorAll('.social-card'));
    const total = originalCards.length;

    // 1. Build dots
    originalCards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'social-dot' + (i === 0 ? ' active' : '');
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.social-dot'));

    // 2. Clone cards for infinite loop
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      socialTrack.appendChild(clone);
    });
    originalCards.slice().reverse().forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      socialTrack.prepend(clone);
    });

    // 3. Setup State
    let currentIndex = total; 
    let isAnimating = false;
    const allCards = Array.from(socialTrack.querySelectorAll('.social-card'));

    // Calculate transform to perfectly center the active card
    const getTransformValue = (index) => {
      const cardWidth = allCards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(socialTrack).gap) || 20;
      const step = cardWidth + gap;
      
      const wrapperWidth = socialTrackWrapper.offsetWidth;
      const centerOffset = (wrapperWidth / 2) - (cardWidth / 2);
      
      return -(index * step) + centerOffset;
    };

    // Master Focus Sync: Lights up target card AND its offscreen clones to prevent jump glitches
    const syncFocus = (activeRealIdx) => {
      allCards.forEach((card, idx) => {
        card.classList.toggle('active', idx % total === activeRealIdx);
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === activeRealIdx));
    };

    // Initialize position instantly + light up Card 1
    socialTrack.style.transition = 'none';
    socialTrack.style.transform = `translateX(${getTransformValue(currentIndex)}px)`;
    syncFocus(0);

    // 4. Slide Logic
    const slideTo = (index) => {
      if (isAnimating) return;
      isAnimating = true;

      currentIndex = index;
      
      socialTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      socialTrack.style.transform = `translateX(${getTransformValue(currentIndex)}px)`;

      // Normalize index to real range (0 to total-1)
      let realIndex = (currentIndex - total) % total;
      if (realIndex < 0) realIndex += total;
      
      syncFocus(realIndex);

      // Seamlessly reset the loop in the background
      setTimeout(() => {
        let jump = false;
        
        if (currentIndex < total) {
          currentIndex += total;
          jump = true;
        } else if (currentIndex >= total * 2) {
          currentIndex -= total;
          jump = true;
        }

        if (jump) {
          socialTrack.style.transition = 'none';
          socialTrack.style.transform = `translateX(${getTransformValue(currentIndex)}px)`;
          socialTrack.offsetHeight; // Force reflow
        }
        isAnimating = false;
      }, 400); 
    };

    // 5. Event Listeners
    socialNext.addEventListener('click', () => slideTo(currentIndex + 1));
    socialPrev.addEventListener('click', () => slideTo(currentIndex - 1));
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => slideTo(i + total));
    });

    // Click any side image to smoothly slide it into the center light
    allCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (currentIndex !== idx) slideTo(idx);
      });
    });
    
    // Keep it centered beautifully when the user resizes the browser window
    window.addEventListener('resize', () => {
      socialTrack.style.transition = 'none';
      socialTrack.style.transform = `translateX(${getTransformValue(currentIndex)}px)`;
    });
  }
});