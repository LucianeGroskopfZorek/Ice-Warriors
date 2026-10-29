const images = [
  { src: '../ice_021.jpg', alt: 'Recuperação com gelo', label: 'Recovery Ice' },
  { src: '../ice_022.jpg', alt: 'Terapia em ambiente moderno', label: 'Ambiente Premium' },
  { src: '../ice_023.jpg', alt: 'Massagem esportiva', label: 'Massagem Esportiva' },
  { src: '../ice_024.jpg', alt: 'Tratamento de relaxamento', label: 'Relaxamento' },
  { src: '../ice_025.jpg', alt: 'Sessão de contraste', label: 'Contraste Térmico' },
  { src: '../ice_026.jpg', alt: 'Vista da estrutura de recuperação', label: 'Studio de Recuperação' },
  { src: '../Ice_Warriors_fronte_loja.png', alt: 'Fachada da loja', label: 'Loja Ice Warriors' },
  { src: '../marca_d_agua_Ice_warriors.png', alt: 'Marca d’água da marca', label: 'Branding' },
  { src: '../modelo_no_gelo.png', alt: 'Modelo em ambiente congelado', label: 'Modelo no Gelo' }
];

const carouselTrack = document.getElementById('carouselTrack');
const carouselDots = document.getElementById('carouselDots');
const galleryGrid = document.getElementById('galleryGrid');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.querySelector('.theme-toggle');
const formContato = document.getElementById('formContato');
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const journeyItems = Array.from(document.querySelectorAll('.journey-item'));
const tempCards = Array.from(document.querySelectorAll('.temp-card'));
const benefitCards = Array.from(document.querySelectorAll('.benefit-card'));
const priceCards = Array.from(document.querySelectorAll('.price-card'));
const faqItems = Array.from(document.querySelectorAll('.faq-item'));
const gallerySlides = Array.from(document.querySelectorAll('.gallery-slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const protocolVisuals = Array.from(document.querySelectorAll('.protocol-visual'));
const protocolItems = Array.from(document.querySelectorAll('.protocol-item'));
const heroStats = Array.from(document.querySelectorAll('[data-count]'));
const comboTabs = Array.from(document.querySelectorAll('.combo-tab'));
const comboPanels = Array.from(document.querySelectorAll('.combo-panel'));
const comboButtons = Array.from(document.querySelectorAll('.combo-cta'));
const comboSteps = Array.from(document.querySelectorAll('.combo-step'));

let activeIndex = 0;
let activeSlide = 0;
let protocolIndex = 0;
let autoGalleryTimer = null;

function renderCarousel() {
  carouselTrack.innerHTML = images
    .map((image, index) => `
      <div class="carousel-slide" aria-hidden="${index === activeIndex ? 'false' : 'true'}">
        <img src="${image.src}" alt="${image.alt}">
        <div class="carousel-caption">${image.label}</div>
      </div>
    `)
    .join('');

  carouselTrack.style.transform = `translateX(-${activeIndex * 100}%)`;

  carouselDots.innerHTML = images
    .map((_, index) => `
      <button
        class="dot ${index === activeIndex ? 'active' : ''}"
        type="button"
        aria-label="Ir para a imagem ${index + 1}"
        data-index="${index}"
      ></button>
    `)
    .join('');

  document.querySelectorAll('.dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      activeIndex = Number(dot.dataset.index);
      renderCarousel();
    });
  });
}

function renderGrid() {
  const gridImages = images.slice(1);

  galleryGrid.innerHTML = gridImages
    .map(
      (image) => `
        <img src="${image.src}" alt="${image.alt}">
      `
    )
    .join('');
}

function showNextSlide() {
  activeIndex = (activeIndex + 1) % images.length;
  renderCarousel();
}

function showPrevSlide() {
  activeIndex = (activeIndex - 1 + images.length) % images.length;
  renderCarousel();
}

function initScrollProgress() {
  const updateProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${Math.min(Math.max(pct, 0), 100)}%`);

    const header = document.querySelector('.site-header');
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
}

function splitHeadingText() {
  const headings = document.querySelectorAll('.section-header h2, .plunge-copy h2, .shift-copy h2, .community-banner h2, .visit-copy h2, .faq-wrap h2, .hero-copy h1');

  headings.forEach((heading) => {
    if (heading.dataset.split === 'true') return;
    heading.dataset.split = 'true';

    const text = heading.textContent.trim();
    if (!text) return;

    const words = text.split(/\s+/).map((word) => `<span class="word-split">${word}</span>`).join(' ');
    heading.innerHTML = words;
    heading.setAttribute('aria-label', text);
  });
}

function initScrollReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const delayedReveal = (selector, delay = 0) => {
    selector.forEach((item, index) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        item.classList.add('is-visible');
        return;
      }
      setTimeout(() => item.classList.add('is-visible'), delay * index);
    });
  };

  delayedReveal(journeyItems, 60);
  delayedReveal(tempCards, 80);
  delayedReveal(benefitCards, 90);
  delayedReveal(priceCards, 100);
}

function initNavSpy() {
  const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = '#' + entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === id;
          link.classList.toggle('is-active', active);
        });
      });
    },
    {
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0.2
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  const setToggleState = (isLight) => {
    themeToggle.classList.toggle('is-light', isLight);
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to Night mode' : 'Switch to Frost mode');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    const copy = themeToggle.querySelector('.toggle-copy');
    if (copy) {
      copy.textContent = isLight ? 'Night' : 'Frost';
    }
  };

  const storedTheme = localStorage.getItem('ice-warriors-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isLight = storedTheme ? storedTheme === 'light' : systemPrefersLight;
  applyTheme(isLight);
  setToggleState(isLight);

  themeToggle.addEventListener('click', () => {
    const nextIsLight = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
    applyTheme(nextIsLight);
    setToggleState(nextIsLight);
  });
}

function applyTheme(isLight) {
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  document.body.classList.toggle('light-theme', isLight);
  localStorage.setItem('ice-warriors-theme', isLight ? 'light' : 'dark');
}

function initFaq() {
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!button || !answer) return;

    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      const shouldHide = !open;
      answer.hidden = shouldHide;

      if (open) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      } else {
        answer.style.maxHeight = '0px';
      }
    };

    if (item.classList.contains('is-open')) {
      answer.hidden = false;
      setOpen(true);
    }

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((faqItem) => {
        const faqButton = faqItem.querySelector('.faq-question');
        const faqAnswer = faqItem.querySelector('.faq-answer');

        if (!faqButton || !faqAnswer) return;
        faqItem.classList.remove('is-open');
        faqButton.setAttribute('aria-expanded', 'false');
        faqAnswer.hidden = true;
        faqAnswer.style.maxHeight = '0px';
      });

      if (!isOpen) {
        setOpen(true);
      }
    });
  });
}

function initForm() {
  if (!formContato) return;

  formContato.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    const submitButton = this.querySelector('button[type="submit"]');
    if (!submitButton) return;

    submitButton.disabled = true;
    submitButton.dataset.originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.classList.add('is-sending');

    setTimeout(() => {
      submitButton.textContent = 'Request sent ✓';
      submitButton.classList.remove('is-sending');
      submitButton.classList.add('is-sent');
      this.reset();

      setTimeout(() => {
        submitButton.textContent = submitButton.dataset.originalText || 'Request a consult';
        submitButton.disabled = false;
        submitButton.classList.remove('is-sent');
      }, 2100);
    }, 650);
  });
}

function renderGallery(index) {
  if (!gallerySlides.length) return;
  const safeIndex = (index + gallerySlides.length) % gallerySlides.length;
  activeSlide = safeIndex;

  const track = document.querySelector('.gallery-track');
  if (track) {
    track.style.transform = `translateX(-${safeIndex * 100}%)`;
  }

  gallerySlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === safeIndex);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === safeIndex);
    dot.setAttribute('aria-label', `Show slide ${dotIndex + 1}`);
  });
}

function startGalleryAutoPlay() {
  if (!gallerySlides.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  autoGalleryTimer = setInterval(() => {
    renderGallery(activeSlide + 1);
  }, 5000);
}

function initGallery() {
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      renderGallery(activeSlide - 1);
      if (autoGalleryTimer) {
        clearInterval(autoGalleryTimer);
        startGalleryAutoPlay();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      renderGallery(activeSlide + 1);
      if (autoGalleryTimer) {
        clearInterval(autoGalleryTimer);
        startGalleryAutoPlay();
      }
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      renderGallery(index);
      if (autoGalleryTimer) {
        clearInterval(autoGalleryTimer);
        startGalleryAutoPlay();
      }
    });
  });

  renderGallery(0);
  startGalleryAutoPlay();
}

function initProtocolCarousel() {
  if (!protocolItems.length || !protocolVisuals.length) return;

  const setActiveProtocol = (index) => {
    protocolIndex = index;
    protocolItems.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === index);
    });
    protocolVisuals.forEach((visual, visualIndex) => {
      visual.classList.toggle('is-active', visualIndex === index);
    });

    const protocolProgress = ((index + 1) / protocolItems.length) * 100;
    document.documentElement.style.setProperty('--protocol-progress', protocolProgress.toFixed(2));
  };

  const onScroll = () => {
    const items = protocolItems;
    const viewportMid = window.innerHeight * 0.6;
    let active = 0;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
        active = index;
      }
    });

    setActiveProtocol(active);
  };

  protocolItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => setActiveProtocol(index));
    item.addEventListener('focusin', () => setActiveProtocol(index));
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const heroBackground = document.querySelector('.hero-bg');
  const heroParticles = document.querySelector('.hero-particles');
  const heroCard = document.querySelector('.hero-card-main');

  if (!mediaQuery.matches || !heroBackground || !heroParticles || !heroCard) {
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const update = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    heroBackground.style.transform = `translate(${currentX * 0.4}px, ${currentY * 0.4}px) scale(1.08)`;
    heroParticles.style.transform = `translate(${currentX * 0.7}px, ${currentY * 0.7}px)`;
    heroCard.style.transform = `translate(${currentX * 0.9}px, ${currentY * 0.9}px)`;

    requestAnimationFrame(update);
  };

  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    targetX = x * 18;
    targetY = y * 18;
  }, { passive: true });

  requestAnimationFrame(update);
}

function initCountUp() {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = Number(entry.target.dataset.count || 0);
        const suffix = entry.target.textContent.includes('°') ? '°' : '';

        let current = 0;
        const duration = 1200;
        const start = performance.now();

        const tick = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          current = Math.round(target * progress);
          entry.target.textContent = `${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            entry.target.textContent = `${target}${suffix}`;
          }
        };

        requestAnimationFrame(tick);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  heroStats.forEach((stat) => countObserver.observe(stat));
  tempCards.forEach((card) => {
    const value = card.querySelector('.temp-value');
    if (value) countObserver.observe(value);
  });
}

function initMenuToggle() {
  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const targetSelector = this.getAttribute('href');
      if (!targetSelector || targetSelector === '#') return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function initScrollRevealFallback() {
  if (CSS.supports('animation-timeline: view()')) return;

  const fallbackObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => fallbackObserver.observe(item));
}

function initComboTabs() {
  if (!comboTabs.length || !comboPanels.length) return;

  comboTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      comboTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });

      comboPanels.forEach((panel) => {
        const isActive = panel.dataset.panel === target;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    });
  });
}

function initComboAnimations() {
  if (!comboSteps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const delay = entry.target.dataset.index ? Number(entry.target.dataset.index) * 120 : 0;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  comboSteps.forEach((step, index) => {
    step.dataset.index = String(index);
    observer.observe(step);
  });
}

function initComboCta() {
  if (!comboButtons.length) return;

  comboButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const cardName = button.dataset.cardName || 'combo';
      const messageField = document.getElementById('message');
      const visitSection = document.getElementById('visit');

      if (messageField) {
        messageField.value = `Tenho interesse no combo: ${cardName}`;
        messageField.focus();
      }

      if
