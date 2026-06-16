// Parallax
const heroImg     = document.querySelector('.hero-image img');
const heroSection = document.querySelector('.hero');
const bannerImg   = document.querySelector('.photo-banner-img');
const bannerSection = document.querySelector('.photo-banner');

function onScroll() {
  const scrollY = window.scrollY;

  if (window.innerWidth > 768 && heroImg) {
    if (scrollY <= heroSection.offsetHeight + 200) {
      heroImg.style.transform = `translateY(${scrollY * 0.22}px)`;
    }
  }

  if (bannerImg && bannerSection) {
    const rect    = bannerSection.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (visible) {
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.18;
      bannerImg.style.transform = `translateY(${offset}px)`;
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// Menú móvil
const toggle   = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Formulario de contacto → API
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn     = this.querySelector('button[type="submit"]');
  const nombre  = this.querySelector('[name="nombre"]').value.trim();
  const email   = this.querySelector('[name="email"]').value.trim();
  const mensaje = this.querySelector('[name="mensaje"]').value.trim();

  btn.disabled = true; btn.textContent = 'Enviando…';

  try {
    const res  = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre, email, mensaje }),
    });
    const data = await res.json();
    btn.textContent = data.success ? '¡Enviado! ✓' : 'Error al enviar';
    if (data.success) this.reset();
  } catch {
    btn.textContent = 'Error al enviar';
  }

  setTimeout(() => { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }, 3000);
});
