// Floating Particles Effect
function createParticles() {
  const container = document.body;
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random sizes and positions
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;

    // Subtle colors (gold-ish)
    particle.style.background = `rgba(197, 160, 89, ${Math.random() * 0.3 + 0.1})`;

    // Animation
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 10;
    particle.style.animation = `drift ${duration}s linear ${delay}s infinite`;

    container.appendChild(particle);
  }
}

createParticles();

// Initialize AOS
AOS.init({
  duration: 1200,
  once: true,
  offset: 100,
});

// Initialize Swiper Gallery
const swiper = new Swiper('.swiper', {
  loop: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hero Background Slider Logic
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

if (slides.length > 0) {
  setInterval(nextSlide, 5000); // Change image every 5 seconds
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Countdown Logic
const targetDate = new Date('January 31, 2026 21:30:00').getTime();

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (document.getElementById('days')) {
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
  }

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById('countdown').innerHTML = "<h3>¡El Gran Día ha Llegado!</h3>";
  }
};

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Guest List Logic
const guestListDatalist = document.getElementById('guest-list');

async function loadGuestList() {
  try {
    const response = await fetch('./src/guests.json');
    const guests = await response.json();

    if (guestListDatalist) {
      guests.sort().forEach(guest => {
        const option = document.createElement('option');
        option.value = guest;
        guestListDatalist.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading guest list:', error);
  }
}

loadGuestList();

// RSVP Form Handling
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMessage = document.getElementById('rsvp-message');

// ¡REEMPLAZA ESTO CON TU URL DE GOOGLE APPS SCRIPT!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzR7BNLl7jJJ7cX8QBKjmITAXNrFaAvnbcDJTth2dGBOnnPeCjU7IvCvcRQUL1QkKLZ/exec';

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = rsvpForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      attendance: document.getElementById('attendance').value,
    };

    try {
      // If the URL is still the placeholder, we simulate success for testing
      if (GOOGLE_SCRIPT_URL === 'AGREGA_TU_URL_AQUI') {
        console.warn('Google Script URL not set. Simulating success.');
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Apps Script requires no-cors for simple redirection
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      // Show success message
      rsvpForm.classList.add('hidden');
      rsvpMessage.classList.remove('hidden');

    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Hubo un error al enviar tu confirmación. Por favor, reintenta.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
