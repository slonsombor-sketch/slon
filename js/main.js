/**
 * Restoran Slon — main.js
 * Navigacija, parallax, scroll animacije, lightbox, forma
 */

(function () {
  'use strict';

  // ============================================================
  // 1. NAVIGACIJA — scroll behavior + hamburger
  // ============================================================
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const heroScroll = document.getElementById('hero-scroll');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
      nav.classList.add('nav--transparent');
    }

    // Sakrij scroll indikator posle 20% visine prozora
    if (heroScroll) {
      if (window.scrollY > window.innerHeight * 0.2) {
        heroScroll.classList.add('hidden');
      } else {
        heroScroll.classList.remove('hidden');
      }
    }
  }

  // Hamburger toggle
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  // Zatvori mobilni meni na klik na link
  const mobileLinks = mobileMenu.querySelectorAll('.nav__mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Zatvori na Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMobileMenu();
    }
  });

  // ============================================================
  // 2. AKTIVAN NAV LINK (highlight na osnovu scroll pozicije)
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ============================================================
  // 3. PARALLAX HERO
  // ============================================================
  const heroBg = document.getElementById('hero-bg');

  function updateParallax() {
    if (!heroBg) return;
    const scrolled = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    if (scrolled > heroHeight) return;
    const offset = scrolled * 0.4;
    heroBg.style.transform = `translateY(${offset}px)`;
  }

  // ============================================================
  // 4. SCROLL ANIMACIJE (Intersection Observer)
  // ============================================================
  const animElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  animElements.forEach(el => observer.observe(el));

  // ============================================================
  // 5. LIGHTBOX GALERIJA
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const galleryItems = document.querySelectorAll('[data-lightbox]');
  const galleryImages = [];
  let currentLightboxIndex = 0;

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push({ src: img.src, alt: img.alt });
      item.addEventListener('click', () => openLightbox(i));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Otvori sliku: ' + img.alt);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    }
  });

  function openLightbox(index) {
    currentLightboxIndex = index;
    showLightboxImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showLightboxImage(index) {
    if (!galleryImages[index]) return;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    currentLightboxIndex = index;
  }

  function prevImage() {
    const newIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightboxImage(newIndex);
  }

  function nextImage() {
    const newIndex = (currentLightboxIndex + 1) % galleryImages.length;
    showLightboxImage(newIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

  // Klik van slike zatvara lightbox
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Tastatura
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // ============================================================
  // 6. REZERVACIJA FORMA
  // ============================================================
  const form = document.getElementById('reservation-form');
  const formSuccess = document.getElementById('form-success');
  const guestsInput = document.getElementById('guests');
  const guestsMinus = document.getElementById('guests-minus');
  const guestsPlus = document.getElementById('guests-plus');
  const dateInput = document.getElementById('date');

  // Postavi minimum datum na danas
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Stepper za goste
  if (guestsMinus) {
    guestsMinus.addEventListener('click', () => {
      const val = parseInt(guestsInput.value);
      if (val > 1) guestsInput.value = val - 1;
    });
  }

  if (guestsPlus) {
    guestsPlus.addEventListener('click', () => {
      const val = parseInt(guestsInput.value);
      if (val < 20) guestsInput.value = val + 1;
    });
  }

  // Validacija forme
  function validateField(id, errorId, condition) {
    const field = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!field || !error) return condition;

    if (!condition) {
      field.classList.add('error');
      error.classList.add('visible');
      return false;
    } else {
      field.classList.remove('error');
      error.classList.remove('visible');
      return true;
    }
  }

  function validateForm() {
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const date = document.getElementById('date');
    const time = document.getElementById('time');

    let valid = true;
    if (!validateField('name', 'name-error', name && name.value.trim().length > 1)) valid = false;
    if (!validateField('phone', 'phone-error', phone && phone.value.trim().length > 5)) valid = false;
    if (!validateField('date', 'date-error', date && date.value !== '')) valid = false;
    if (!validateField('time', 'time-error', time && time.value !== '')) valid = false;
    return valid;
  }

  // Ukloni error na input
  ['name', 'phone', 'date', 'time'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errorEl = document.getElementById(id + '-error');
        if (errorEl) errorEl.classList.remove('visible');
      });
    }
  });

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm()) return;

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Slanje...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          form.style.display = 'none';
          formSuccess.classList.add('visible');
        } else {
          // Fallback — otvori mailto
          const name = document.getElementById('name').value;
          const phone = document.getElementById('phone').value;
          const date = document.getElementById('date').value;
          const time = document.getElementById('time').value;
          const guests = document.getElementById('guests').value;
          const note = document.getElementById('note').value;
          const subject = encodeURIComponent('Rezervacija — ' + name);
          const body = encodeURIComponent(
            `Ime: ${name}\nTelefon: ${phone}\nDatum: ${date}\nVreme: ${time}\nGosti: ${guests}\nNapomena: ${note}`
          );
          window.location.href = `mailto:restoranslon@gmail.com?subject=${subject}&body=${body}`;
        }
      } catch {
        // Mreža nije dostupna — koristi mailto fallback
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const subject = encodeURIComponent('Rezervacija — ' + name);
        const body = encodeURIComponent(`Ime: ${name}\nTelefon: ${phone}`);
        window.location.href = `mailto:restoranslon@gmail.com?subject=${subject}&body=${body}`;
      }
    });
  }

  // ============================================================
  // 7. SMOOTH SCROLL za nav linkove
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ============================================================
  // 8. SCROLL EVENT — throttled
  // ============================================================
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNav();
        updateActiveLink();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Init
  updateNav();
  updateActiveLink();

  // ============================================================
  // Back to top button
  // ============================================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('back-to-top--visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
