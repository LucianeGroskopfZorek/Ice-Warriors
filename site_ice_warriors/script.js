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
const revealItems = document.querySelectorAll('.reveal');
const faqItems = document.querySelectorAll('.faq-item');
const gallerySlides = Array.from(document.querySelectorAll('.gallery-slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const formContato = document.getElementById('formContato');

let activeIndex = 0;
let activeSlide = 0;

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

function renderGallery(index) {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  activeSlide = (index + gallerySlides.length) % gallerySlides.length;
  track.style.transform = `translateX(-${activeSlide * 100}%)`;

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === activeSlide);
  });

  gallerySlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === activeSlide);
  });
}

function applyTheme(isLight) {
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  document.body.classList.toggle('light-theme', isLight);
  themeToggle.textContent = isLight ? 'Dark' : 'Frost';
  themeToggle.setAttribute('aria-label', isLight ? 'Toggle dark theme' : 'Toggle light theme');
}

prevBtn.addEventListener('click', showPrevSlide);
nextBtn.addEventListener('click', showNextSlide);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => renderGallery(index));
});

setInterval(() => {
  if (gallerySlides.length > 1) {
    renderGallery(activeSlide + 1);
  }
}, 5000);

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

themeToggle.addEventListener('click', () => {
  const isLight = !document.body.classList.contains('light-theme');
  applyTheme(isLight);
});

applyTheme(document.body.classList.contains('light-theme'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (!button || !answer) return;

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove('is-open');
      const faqButton = faqItem.querySelector('.faq-question');
      const faqAnswer = faqItem.querySelector('.faq-answer');

      if (faqButton) faqButton.setAttribute('aria-expanded', 'false');
      if (faqAnswer) faqAnswer.hidden = true;
    });

    if (!isOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});

document.getElementById('formContato').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
  this.reset();
});

// Efeito de rolagem suave
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

renderCarousel();
renderGrid();
renderGallery(0);
