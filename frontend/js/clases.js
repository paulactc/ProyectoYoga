const CLASES = [
  {
    id: 1,
    titulo: 'Vinyasa Despertar',
    duracion: 30,
    nivel: 1,
    descripcion: 'Activa el cuerpo con suavidad. Perfecta para comenzar el día o cuando el tiempo escasea.',
    imagen: 'images/yoga-30.jpg',
  },
  {
    id: 2,
    titulo: 'Flow Profundo',
    duracion: 60,
    nivel: 2,
    descripcion: 'Secuencia fluida que trabaja la fuerza, la flexibilidad y la presencia plena.',
    imagen: 'images/yoga-37.jpg',
  },
  {
    id: 3,
    titulo: 'Pranayama y Silencio',
    duracion: 30,
    nivel: 1,
    descripcion: 'Respiración consciente y meditación guiada para calmar la mente y centrar la energía.',
    imagen: 'images/yoga-36.jpg',
  },
  {
    id: 4,
    titulo: 'Vinyasa Avanzado',
    duracion: 60,
    nivel: 3,
    descripcion: 'Posturas desafiantes y transiciones avanzadas para quienes quieren profundizar.',
    imagen: 'images/yoga-21.jpg',
  },
  {
    id: 5,
    titulo: 'Movilidad y Cuidado',
    duracion: 30,
    nivel: 1,
    descripcion: 'Cuida tus articulaciones y mejora el rango de movimiento. Ideal para todas las edades.',
    imagen: 'images/yoga-18.jpg',
  },
  {
    id: 6,
    titulo: 'Yang & Yin',
    duracion: 60,
    nivel: 2,
    descripcion: 'Combina movimiento dinámico con posturas pasivas sostenidas para un equilibrio total.',
    imagen: 'images/yoga-30.jpg',
  },
];

const NIVEL_LABEL = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' };

let filtroDuracion = 'todos';
let filtroNivel = 'todos';

function renderClases() {
  const grid = document.getElementById('clasesGrid');
  const sub = isSubscribed();
  const visibles = CLASES.filter(c => {
    const okDur = filtroDuracion === 'todos' || String(c.duracion) === filtroDuracion;
    const okNiv = filtroNivel === 'todos' || String(c.nivel) === filtroNivel;
    return okDur && okNiv;
  });

  if (visibles.length === 0) {
    grid.innerHTML = '<p class="no-results">No hay clases con estos filtros. Prueba otra combinación.</p>';
    return;
  }

  grid.innerHTML = visibles.map(c => renderCard(c, sub)).join('');
}

function renderCard(c, sub) {
  const nivelLabel = NIVEL_LABEL[c.nivel];
  const nivelClass = 'nivel-' + c.nivel;
  const badges = `
    <div class="clase-badges">
      <span class="badge badge-dur">${c.duracion} min</span>
      <span class="badge badge-niv ${nivelClass}">${nivelLabel}</span>
    </div>`;

  if (sub) {
    return `
      <article class="clase-card">
        <div class="clase-card-img" style="background-image:url('${c.imagen}')"></div>
        <div class="clase-card-body">
          ${badges}
          <h3>${c.titulo}</h3>
          <p>${c.descripcion}</p>
          <button class="btn btn-sm" onclick="openModal(${c.id})">Ver clase →</button>
        </div>
      </article>`;
  }

  return `
    <article class="clase-card clase-locked">
      <div class="clase-card-img" style="background-image:url('${c.imagen}')">
        <div class="lock-overlay">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
      </div>
      <div class="clase-card-body">
        ${badges}
        <h3>${c.titulo}</h3>
        <p>${c.descripcion}</p>
        <a href="suscripcion.html" class="btn btn-sm btn-outline">Suscribirme →</a>
      </div>
    </article>`;
}

function openModal(id) {
  const c = CLASES.find(x => x.id === id);
  if (!c) return;
  document.getElementById('modalTitle').textContent = c.titulo;
  document.getElementById('modalNivel').textContent = NIVEL_LABEL[c.nivel];
  document.getElementById('modalDuracion').textContent = c.duracion + ' min';
  document.getElementById('videoModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('videoModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  await refreshSubscriptionStatus();

  const banner = document.getElementById('subBanner');
  if (banner && isSubscribed()) banner.style.display = 'none';

  renderClases();

  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const grupo = pill.dataset.grupo;
      pill.closest('.filtro-pills').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (grupo === 'duracion') filtroDuracion = pill.dataset.valor;
      if (grupo === 'nivel') filtroNivel = pill.dataset.valor;
      renderClases();
    });
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('videoModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
