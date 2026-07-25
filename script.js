/* ============================================================
   PRIMESHIELD SOLUTIONS — INTERACTION SCRIPT
   1. Initialization & Loader
   2. Custom Cursor
   3. Magnetic Elements
   4. Mobile Menu & Scroll Locking
   5. Reveal on Scroll
   6. Counter Animation
   7. Beautiful Custom Select
   8. Contact Form Handler
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. INITIALIZATION & LOADER ----------
  const loader = document.getElementById('loader');

  if (loader) {
    lockScroll();
    window.addEventListener('load', () => {
      const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
      const delay = isHomePage ? 3000 : 800; // 3s on home, 800ms fallback
      setTimeout(() => {
        loader.classList.add('hidden');
        unlockScroll();
        revealHeroLetters();
      }, delay);
    });
  } else {
    // If no loader (other pages), unlock scroll immediately
    unlockScroll();
  }

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- 2. CUSTOM CURSOR ----------
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (window.matchMedia('(min-width: 769px)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRing) {
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
      }
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverables = document.querySelectorAll('a, button, .magnetic, .value-card, .preview-card, .custom-check, .select-trigger, .option');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ---------- 3. MAGNETIC ELEMENTS ----------
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---------- 4. MOBILE MENU & SCROLL LOCKING ----------
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      lockScroll();
    });
  }
  if (menuClose) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      unlockScroll();
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        unlockScroll();
      });
    });
  }

  // ---------- 5. REVEAL ON SCROLL ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));

  // ---------- 6. COUNTER ANIMATION ----------
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(counter) {
    const target = parseInt(counter.dataset.count);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // ---------- 7. BEAUTIFUL CUSTOM SELECT ----------
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(select => {
    const trigger = select.querySelector('.select-trigger');
    const options = select.querySelectorAll('.option');
    const valueDisplay = select.querySelector('.select-value');
    const hiddenInput = select.querySelector('input[type="hidden"]');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = select.classList.contains('open');
      customSelects.forEach(s => s.classList.remove('open'));
      if (!isOpen) {
        select.classList.add('open');
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const value = opt.dataset.value;
        const text = opt.textContent;
        valueDisplay.textContent = text;
        valueDisplay.classList.remove('placeholder');
        hiddenInput.value = value;
        select.classList.remove('open');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
      customSelects.forEach(s => s.classList.remove('open'));
    }
  });

  // ---------- 8. CONTACT FORM HANDLER ----------
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Transmitting...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      
      try {
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => { object[key] = value; });
        const json = JSON.stringify(object);

        const response = await fetch(form.action, {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: json
        });

        if (response.ok) {
          const toast = document.createElement('div');
          toast.className = 'toast';
          toast.innerHTML = `
            <div class="toast-dot"></div>
            <div>
              <div class="toast-title">Transmission Received</div>
              <div class="toast-msg">We will respond within one business day.</div>
            </div>
          `;
          document.body.appendChild(toast);
          
          setTimeout(() => toast.classList.add('show'), 100);
          
          setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
          }, 4000);
          
          form.reset();
          const selectVal = form.querySelector('.select-value');
          if (selectVal) {
            selectVal.textContent = 'Service Required';
            selectVal.classList.add('placeholder');
          }
        } else {
          alert('Submission failed. Please email us directly at info@primeshield.co.ke');
        }
      } catch (error) {
        alert('Network error. Please try again later.');
      } finally {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
  }

  // ---------- HERO LETTER REVEAL ----------
  function revealHeroLetters() {
    const line1 = document.getElementById('heroLine1');
    const line2 = document.getElementById('heroLine2');
    
    [line1, line2].forEach(line => {
      if (!line) return;
      const text = line.textContent;
      line.innerHTML = '';
      
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'hero-letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px)';
        span.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        span.style.transitionDelay = `${i * 40}ms`;
        
        if (line.id === 'heroLine2') span.style.fontStyle = 'italic';
        
        line.appendChild(span);
        
        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        }, 100);
      });
    });
  }

  // ---------- SCROLL LOCK UTILITY ----------
  function lockScroll() {
    document.body.classList.add('no-scroll');
  }
  function unlockScroll() {
    document.body.classList.remove('no-scroll');
  }

  // ---------- PARALLAX ON HERO SHIELD ----------
  const shieldWrap = document.querySelector('.shield-visual');
  if (shieldWrap) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        shieldWrap.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    });
  }

  // ---------- CONSOLE SIGNATURE ----------
  console.log('%cPRIMESHIELD SOLUTIONS LIMITED','color:#0244D0;font-family:serif;font-size:24px;font-weight:300;');
  console.log('%cBuilt on Trust.','color:#051539;font-family:serif;font-size:14px;font-style:italic;');
  console.log('%c→ Forged in vigilance by Dw33pY','color:#7A8599;font-family:monospace;font-size:11px;');
});