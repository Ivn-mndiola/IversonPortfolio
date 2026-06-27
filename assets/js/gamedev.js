/**
 * Philippine Game Dev Experience - Prototyping Interactions
 * Handles scroll reveal animations and active navbar link updates.
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. SCROLL REVEAL ANIMATIONS
  const fadeElements = document.querySelectorAll(".fade-in");

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  fadeElements.forEach((el) => revealOnScroll.observe(el));


  // 2. NAVBAR ACTIVE STATE TRACKING
  const sections = document.querySelectorAll("header[id], section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href").includes(sectionId)) {
            link.classList.add("active");
          }
        });
      }
    });
  });

});