(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');

  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      mobileMenu.hidden = true;
      document.body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileMenu.hidden = open;
      document.body.classList.toggle('menu-open', !open);
    });

    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const filters = document.querySelectorAll('.filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const value = filter.dataset.filter;
      filters.forEach(button => button.classList.toggle('active', button === filter));
      portfolioItems.forEach(item => {
        item.classList.toggle('is-hidden', value !== 'all' && item.dataset.category !== value);
      });
    });
  });

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxImage.src = item.dataset.image;
      lightboxImage.alt = item.querySelector('img')?.alt || item.dataset.title;
      lightboxCaption.textContent = item.dataset.title || '';
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox?.open && typeof lightbox.close === 'function') lightbox.close();
    else lightbox?.removeAttribute('open');
  };
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });

  const bookingForm = document.querySelector('#booking-form');
  const status = document.querySelector('#form-status');

  bookingForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service') || '').trim();
    const timing = String(data.get('timing') || '').trim();
    const note = String(data.get('note') || '').trim();

    if (!name || !phone || !service) {
      status.textContent = 'Please add your name, phone and service.';
      return;
    }

    const message = [
      'Hi Happy in the Head, I’d like to book a visit.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      timing ? `Preferred day / time: ${timing}` : '',
      note ? `Note: ${note}` : ''
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/919819622325?text=${encodeURIComponent(message)}`;
    status.textContent = 'Opening WhatsApp…';
    window.open(whatsappUrl, '_blank', 'noopener');
  });

  // Keep internal anchor navigation reliable when the sticky header is present.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
