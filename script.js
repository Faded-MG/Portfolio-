const body = document.body;
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const logoBtn = document.getElementById('logoBtn');
const loadingScreen = document.getElementById('loadingScreen');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const counters = document.querySelectorAll('.stat-value');
const revealElements = document.querySelectorAll('.reveal');
const typingText = document.getElementById('typingText');
const heroSection = document.querySelector('.hero-section');

let logoClicks = 0;

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.hidden = expanded;
});

[...mobileLinks].forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const sections = document.querySelectorAll('section[id]');
const offset = 80;

const updateActiveNav = () => {
  const scrollPos = window.scrollY + offset;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      const id = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
};

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
};

window.addEventListener('scroll', () => {
  updateActiveNav();
  updateScrollProgress();
  backToTop.classList.toggle('show', window.scrollY > 450);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      if (entry.target.classList.contains('stat-value')) {
        animateCounter(entry.target);
      }
    }
  });
}, {
  threshold: 0.18,
});

const animateCounter = element => {
  const target = Number(element.dataset.target);
  const duration = 1800;
  let start = 0;
  const stepTime = Math.abs(Math.floor(duration / target));
  const increment = target > 0 ? 1 : 0;
  const timer = setInterval(() => {
    start += increment;
    element.textContent = start;
    if (start >= target) {
      element.textContent = target + (target > 9 ? '+' : '');
      clearInterval(timer);
    }
  }, Math.max(stepTime, 14));
};

revealElements.forEach(el => observer.observe(el));

counters.forEach(counter => observer.observe(counter));

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filterValue = button.dataset.filter;
    projectCards.forEach(card => {
      const category = card.dataset.category;
      card.style.display = filterValue === 'all' || category === filterValue ? 'grid' : 'none';
    });
  });
});

const enablePointerEffects = event => {
  const x = event.clientX / window.innerWidth * 100;
  const y = event.clientY / window.innerHeight * 100;
  document.documentElement.style.setProperty('--mouse-x', `${x}%`);
  document.documentElement.style.setProperty('--mouse-y', `${y}%`);
};

window.addEventListener('mousemove', enablePointerEffects);

const typingPhrases = [
  'Computer Science Student',
  'Aspiring iOS Developer',
  'Designer of clean interfaces',
  'Focused on elegant experiences'
];
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typePhrase = () => {
  const currentPhrase = typingPhrases[typingIndex];
  if (isDeleting) {
    charIndex -= 1;
    typingText.textContent = currentPhrase.substring(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingPhrases.length;
    }
  } else {
    charIndex += 1;
    typingText.textContent = currentPhrase.substring(0, charIndex);
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
    }
  }
  const delay = isDeleting ? 70 : 130;
  setTimeout(typePhrase, delay);
};

typePhrase();

logoBtn.addEventListener('click', () => {
  logoClicks += 1;
  if (logoClicks === 5) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = 'Secret unlocked: keep exploring the details.';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
    logoClicks = 0;
  }
});

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hide');
  }, 450);
  updateActiveNav();
  updateScrollProgress();
});
