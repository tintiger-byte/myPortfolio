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

  /* ─── Low-Pressure Casting Simulation Animation ─── */
  const castingSlide = document.getElementById('gpCastingSlide');
  const castingCanvas = document.getElementById('castingCanvas');
  
  if (castingSlide && castingCanvas) {
    const ctx = castingCanvas.getContext('2d');
    const img = castingSlide.querySelector('img');
    
    let state = 'idle'; // idle, rising, fillingPart1, fillingPart2, completed
    let progress = 0;
    let crucibleLevel = 1.0;
    let particles = [];
    let animationFrameId = null;
    let isAutoPlayed = false;
    let completionTimeout = null;

    // Resize canvas to overlay image perfectly
    function resizeCastingCanvas() {
      if (!img || !castingCanvas) return;
      
      const imgRect = img.getBoundingClientRect();
      const slideRect = castingSlide.getBoundingClientRect();
      
      const left = imgRect.left - slideRect.left;
      const top = imgRect.top - slideRect.top;
      
      castingCanvas.style.left = `${left}px`;
      castingCanvas.style.top = `${top}px`;
      castingCanvas.style.width = `${imgRect.width}px`;
      castingCanvas.style.height = `${imgRect.height}px`;
      
      // Fixed internal coordinates mapping
      castingCanvas.width = 400;
      castingCanvas.height = 400;
      
      // Draw initial state
      drawCastingState();
    }

    img.addEventListener('load', resizeCastingCanvas);
    window.addEventListener('resize', resizeCastingCanvas);
    
    // Force a resize check in case image is already loaded
    if (img.complete) {
      setTimeout(resizeCastingCanvas, 100);
    }

    // Spark Particles
    function createSpark(x, y, vx, vy) {
      return {
        x,
        y,
        vx: vx + (Math.random() - 0.5) * 3,
        vy: vy - Math.random() * 3,
        size: Math.random() * 2.5 + 0.8,
        alpha: 1.0,
        decay: Math.random() * 0.04 + 0.03,
        color: Math.random() > 0.45 ? '#FFD700' : '#FF4500' // Yellow or OrangeRed
      };
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    function drawCastingState() {
      ctx.clearRect(0, 0, 400, 400);

      // 1. 도가니 내부 쇳물 (Crucible Molten Metal - flows downwards)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(114, 172);
      ctx.bezierCurveTo(114, 260, 160, 340, 180, 364);
      ctx.lineTo(220, 364);
      ctx.bezierCurveTo(240, 340, 286, 260, 286, 172);
      ctx.closePath();
      ctx.clip();

      // 도가니 수위 (y축 176 ~ 220로 대폭 낮아져 하강 화살표 효과 극대화)
      const currentCrucibleY = 176 + (220 - 176) * (1.0 - crucibleLevel);
      
      const crucibleGrad = ctx.createLinearGradient(0, currentCrucibleY, 0, 364);
      crucibleGrad.addColorStop(0, '#FFD700'); // Hot golden yellow surface
      crucibleGrad.addColorStop(0.1, '#FF4500'); // Intense OrangeRed
      crucibleGrad.addColorStop(0.6, '#C91400'); // Deep Red
      crucibleGrad.addColorStop(1.0, '#3A0000'); // Dark Crimson
      ctx.fillStyle = crucibleGrad;

      // Wave effect
      ctx.beginPath();
      ctx.moveTo(100, currentCrucibleY);
      const waveTime = Date.now() * 0.006;
      for (let x = 100; x <= 300; x += 8) {
        const wave = Math.sin(x * 0.08 + waveTime) * 1.5;
        ctx.lineTo(x, currentCrucibleY + wave);
      }
      ctx.lineTo(300, 400);
      ctx.lineTo(100, 400);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. 중앙 관로 (Riser Tube: x = 191 ~ 209, y = 332 down to 149 - flows upwards ⬆️)
      if (state === 'rising' || state === 'fillingPart1' || state === 'fillingPart2' || state === 'completed') {
        let tubeTopY = 332;
        if (state === 'rising') {
          tubeTopY = 332 - (332 - 149) * progress;
          // Spawn sparks at the rising liquid front
          if (Math.random() < 0.7) {
            for (let k = 0; k < 2; k++) {
              particles.push(createSpark(200, tubeTopY, 0, -1.5));
            }
          }
        } else {
          tubeTopY = 149;
        }

        ctx.save();
        const tubeGrad = ctx.createLinearGradient(191, 0, 209, 0);
        tubeGrad.addColorStop(0, '#FF4500');
        tubeGrad.addColorStop(0.5, '#FFD700');
        tubeGrad.addColorStop(1, '#FF4500');
        ctx.fillStyle = tubeGrad;
        
        // Add metallic liquid glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(255, 69, 0, 0.8)';
        
        ctx.fillRect(191, tubeTopY, 18, 332 - tubeTopY);
        ctx.restore();
      }

      // 3. 상부 캐비티 파트 1 (좌우 대각선 유로 분기: 적색 화살표 경로 반영)
      if (state === 'fillingPart1' || state === 'fillingPart2' || state === 'completed') {
        const p1Progress = (state === 'fillingPart1') ? progress : 1.0;

        // 3a. 좌측 대각선 유로 (적색 화살표 - 내부 모서리로 향함)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(200, 149);
        ctx.lineTo(192, 149);
        ctx.lineTo(136, 134); // Inner edge
        ctx.lineTo(142, 126);
        ctx.lineTo(200, 142);
        ctx.closePath();
        ctx.clip();

        const leftX = 200 - (200 - 136) * p1Progress;
        let leftGrad = ctx.createLinearGradient(leftX, 0, 200, 0);
        leftGrad.addColorStop(0, '#FFD700');
        leftGrad.addColorStop(0.3, '#FF4500');
        leftGrad.addColorStop(1.0, '#990000');
        ctx.fillStyle = leftGrad;
        ctx.fillRect(leftX, 120, 200 - leftX, 35);
        ctx.restore();

        // 3b. 우측 대각선 유로 (적색 화살표 - 내부 모서리로 향함)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(200, 149);
        ctx.lineTo(208, 149);
        ctx.lineTo(264, 134); // Inner edge
        ctx.lineTo(258, 126);
        ctx.lineTo(200, 142);
        ctx.closePath();
        ctx.clip();

        const rightX = 200 + (264 - 200) * p1Progress;
        let rightGrad = ctx.createLinearGradient(200, 0, rightX, 0);
        rightGrad.addColorStop(0, '#990000');
        rightGrad.addColorStop(0.7, '#FF4500');
        rightGrad.addColorStop(1.0, '#FFD700');
        ctx.fillStyle = rightGrad;
        ctx.fillRect(200, 120, rightX - 200, 35);
        ctx.restore();

        if (state === 'fillingPart1' && Math.random() < 0.6) {
          // Sparks at diagonal flow front
          particles.push(createSpark(200 - (200 - 136) * p1Progress, 142 - 8 * p1Progress, -1, -0.5));
          particles.push(createSpark(200 + (264 - 200) * p1Progress, 142 - 8 * p1Progress, 1, -0.5));
        }
      }

      // 4. 상부 캐비티 파트 2 (양측 수직 대형 챔버: y = 134 down to 40 - flows upwards ⬆️ ⬆️)
      if (state === 'fillingPart2' || state === 'completed') {
        const p2Progress = (state === 'fillingPart2') ? progress : 1.0;
        const fillY = 134 - (134 - 40) * p2Progress;

        // 4a. 좌측 수직 챔버 (⬆️)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(118, 134);
        ctx.lineTo(112, 120);
        ctx.lineTo(112, 40);
        ctx.lineTo(138, 40);
        ctx.lineTo(138, 92);
        ctx.lineTo(134, 102);
        ctx.lineTo(134, 134);
        ctx.closePath();
        ctx.clip();

        let chamberGrad = ctx.createLinearGradient(0, fillY, 0, 134);
        chamberGrad.addColorStop(0, '#FFD700');
        chamberGrad.addColorStop(0.25, '#FF4500');
        chamberGrad.addColorStop(1.0, '#990000');
        ctx.fillStyle = chamberGrad;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF4500';
        ctx.fillRect(100, fillY, 50, 134 - fillY);
        ctx.restore();

        // 4b. 우측 수직 챔버 (⬆️)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(282, 134);
        ctx.lineTo(288, 120);
        ctx.lineTo(288, 40);
        ctx.lineTo(262, 40);
        ctx.lineTo(262, 92);
        ctx.lineTo(266, 102);
        ctx.lineTo(266, 134);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = chamberGrad;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF4500';
        ctx.fillRect(250, fillY, 50, 134 - fillY);
        ctx.restore();

        if (state === 'fillingPart2' && Math.random() < 0.7) {
          particles.push(createSpark(125 + (Math.random() - 0.5) * 12, fillY, 0, -1));
          particles.push(createSpark(275 + (Math.random() - 0.5) * 12, fillY, 0, -1));
        }
      }

      // Render sparks on top
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#FF4500';
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    function tickCasting() {
      // Update variables based on current state
      if (state === 'rising') {
        progress += 0.015;
        crucibleLevel = 1.0 - progress * 0.15; // crucible goes down to 0.85
        if (progress >= 1.0) {
          state = 'fillingPart1';
          progress = 0;
        }
      } else if (state === 'fillingPart1') {
        progress += 0.025;
        crucibleLevel = 0.85 - progress * 0.10; // crucible goes down to 0.75
        if (progress >= 1.0) {
          state = 'fillingPart2';
          progress = 0;
        }
      } else if (state === 'fillingPart2') {
        progress += 0.012; // slow down slightly for a grand filling effect
        crucibleLevel = 0.75 - progress * 0.25; // crucible goes down to 0.50
        if (progress >= 1.0) {
          state = 'completed';
          progress = 1.0;
          crucibleLevel = 0.50;
          onCastingFinished();
        }
      }

      updateParticles();
      drawCastingState();

      if (state !== 'completed' || particles.length > 0) {
        animationFrameId = requestAnimationFrame(tickCasting);
      } else {
        animationFrameId = null;
      }
    }

    function startCastingAnimation() {
      // Prevent restarting if already running
      if (state !== 'idle' && state !== 'completed') return;

      // Clear previous timeout/animation if any
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (completionTimeout) {
        clearTimeout(completionTimeout);
      }

      // Initialize
      state = 'rising';
      progress = 0;
      crucibleLevel = 1.0;
      particles = [];

      tickCasting();
    }

    function onCastingFinished() {
      // 3.5 seconds after completion, reset to idle so the user can play it again
      completionTimeout = setTimeout(() => {
        // Reset animation state
        state = 'idle';
        progress = 0;
        crucibleLevel = 1.0;
        particles = [];
        
        // Draw initial state (idle water surface ripple only)
        if (!animationFrameId) {
          drawCastingState();
        }
      }, 3500);
    }

    // Trigger on image click instead of button
    castingSlide.style.cursor = 'pointer';
    castingSlide.addEventListener('click', (e) => {
      e.stopPropagation();
      startCastingAnimation();
    });

    // Auto-trigger when carousel slide becomes active / visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isAutoPlayed) {
          isAutoPlayed = true;
          // Short delay for user focus
          setTimeout(() => {
            // Check if still visible
            const currentSlide = document.getElementById('gpCastingSlide');
            if (currentSlide) {
              startCastingAnimation();
            }
          }, 800);
        }
      });
    }, { threshold: 0.6 });

    observer.observe(castingSlide);

    // Keep background loop going for idle water ripple when not playing
    function idleRippleLoop() {
      if (state === 'idle' && !animationFrameId) {
        drawCastingState();
      }
      requestAnimationFrame(idleRippleLoop);
    }
    idleRippleLoop();
  }

})();
