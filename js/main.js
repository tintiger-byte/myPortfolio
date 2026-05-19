/* ═══════════════════════════════════════
   SUK-HO SONG Portfolio — main.js
═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Navbar: scroll state & active link ─── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled shadow
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Hamburger menu ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });

  /* ─── Scroll Animation (Intersection Observer) ─── */
  const animateEls = document.querySelectorAll('[data-animate]');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger skill bars when card becomes visible
        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        bars.forEach(bar => {
          const w = bar.getAttribute('data-width');
          if (w) bar.style.width = w + '%';
        });

        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animateEls.forEach(el => animObserver.observe(el));

  /* ─── Skill bars (also trigger on section enter) ─── */
  const skillSection = document.getElementById('skills');
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        document.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
          const w = bar.getAttribute('data-width');
          setTimeout(() => {
            if (w) bar.style.width = w + '%';
          }, i * 120);
        });
      }
    });
  }, { threshold: 0.3 });

  if (skillSection) skillObserver.observe(skillSection);

  /* ─── Counter Animation ─── */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString();
      }
    }, 16);
  }

  const counterEls = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counterEls.forEach((el, i) => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          setTimeout(() => animateCounter(el, target, 1400), i * 150);
        });
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) counterObserver.observe(statsRow);

  /* ─── Smooth hover tilt on project cards ─── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  /* ─── Navbar link smooth scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Page load reveal ─── */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    });
  });

  /* ─── Carousel Component ─── */
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.next');
    const prevButton = carousel.querySelector('.prev');
    const dotsNav = carousel.querySelector('.carousel-indicators');
    const dots = Array.from(dotsNav.children);

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    function updateCarousel(index) {
      currentIndex = index;
      currentTranslate = currentIndex * -carousel.offsetWidth;
      prevTranslate = currentTranslate;
      track.style.transform = `translateX(${currentTranslate}px)`;
      
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    if (nextButton) {
      nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        let index = currentIndex + 1;
        if (index >= slides.length) index = 0;
        updateCarousel(index);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        let index = currentIndex - 1;
        if (index < 0) index = slides.length - 1;
        updateCarousel(index);
      });
    }

    if (dotsNav) {
      dotsNav.addEventListener('click', e => {
        e.stopPropagation();
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const index = dots.findIndex(d => d === targetDot);
        updateCarousel(index);
      });
    }

    // Touch events for swipe
    carousel.addEventListener('touchstart', touchStart, { passive: false });
    carousel.addEventListener('touchend', touchEnd);
    carousel.addEventListener('touchmove', touchMove, { passive: false });

    // Mouse events for drag
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', () => {
      if (isDragging) touchEnd();
    });
    carousel.addEventListener('mousemove', touchMove);

    function touchStart(event) {
      if(event.type.includes('mouse')) {
        event.preventDefault(); 
      }
      isDragging = true;
      startPos = getPositionX(event);
      animationID = requestAnimationFrame(animation);
      track.style.transition = 'none'; 
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }

    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -50 && currentIndex < slides.length - 1) currentIndex += 1;
      else if (movedBy > 50 && currentIndex > 0) currentIndex -= 1;
      else if (movedBy < -50 && currentIndex === slides.length - 1) currentIndex = 0; 
      else if (movedBy > 50 && currentIndex === 0) currentIndex = slides.length - 1;

      updateCarousel(currentIndex);
    }

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
      track.style.transform = `translateX(${currentTranslate}px)`;
      if (isDragging) requestAnimationFrame(animation);
    }

    window.addEventListener('resize', () => {
      track.style.transition = 'none';
      updateCarousel(currentIndex);
      setTimeout(() => {
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      }, 50);
    });
  });



  /* ─── Year Range Counter Animation ─── */
  let yearTimer = null;

  function animateYearCounter(el, start, target, duration) {
    if (yearTimer) clearInterval(yearTimer);

    let current = start;
    const range = target - start;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    el.textContent = start;

    yearTimer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) {
        clearInterval(yearTimer);
        yearTimer = null;
      }
    }, stepTime);
  }

  const yearCounterEl = document.querySelector('.year-counter');
  const replayCounterBtn = document.getElementById('replayCounterBtn');

  if (yearCounterEl) {
    const startVal = parseInt(yearCounterEl.getAttribute('data-start'), 10);
    const targetVal = parseInt(yearCounterEl.getAttribute('data-target'), 10);
    
    const triggerCounter = () => {
      animateYearCounter(yearCounterEl, startVal, targetVal, 3500);
    };

    const yearObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(triggerCounter, 300);
          yearObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    yearObserver.observe(yearCounterEl);

    if (replayCounterBtn) {
      replayCounterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerCounter();
      });
    }
  }

  /* ─── Match Education & Certification Card Heights ─── */
  function matchEduHeights() {
    const eduItems = document.querySelectorAll('.edu-item');
    const certItems = document.querySelectorAll('.cert-item');
    
    // Reset heights first to get natural heights
    eduItems.forEach(item => item.style.height = 'auto');
    certItems.forEach(item => item.style.height = 'auto');
    
    // Only match on desktop screens (viewport > 1024px)
    if (window.innerWidth > 1024) {
      const count = Math.min(eduItems.length, certItems.length);
      for (let i = 0; i < count; i++) {
        const eduHeight = eduItems[i].offsetHeight;
        const certHeight = certItems[i].offsetHeight;
        const maxHeight = Math.max(eduHeight, certHeight);
        
        eduItems[i].style.height = maxHeight + 'px';
        certItems[i].style.height = maxHeight + 'px';
      }
    }
  }

  // Bind events and run immediately
  window.addEventListener('load', matchEduHeights);
  window.addEventListener('resize', matchEduHeights);
  // Also run immediately in case DOM is already parsed
  matchEduHeights();

})();
