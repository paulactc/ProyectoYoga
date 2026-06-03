const AUTH_KEY = 'ytv_auth';
const API_URL  = 'http://localhost:3000/api';

function escHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Cache ──────────────────────────────────────────────────────
function getAuth()      { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } }
function getToken()     { return getAuth()?.token  || null; }
function getUser()      { return getAuth()?.user   || null; }
function isSubscribed() { return !!(getUser()?.subscribed); }

function saveAuth(token, user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
}
function clearAuth() { localStorage.removeItem(AUTH_KEY); }

// ── API helper ─────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token   = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  return res.json();
}

// ── Sync suscripción desde el servidor ─────────────────────────
async function refreshSubscriptionStatus() {
  if (!getToken()) return;
  try {
    const data = await apiFetch('/suscripcion/estado');
    if (data.success) {
      const auth = getAuth();
      if (auth) {
        auth.user.subscribed = data.data.subscribed;
        saveAuth(auth.token, auth.user);
      }
    }
  } catch { /* sin conexión, usa caché */ }
}

// ── Toggle contraseña ─────────────────────────────────────────
const SVG_EYE      = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SVG_EYE_OFF  = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

function togglePw(btn) {
  const input   = btn.parentElement.querySelector('input');
  const visible = input.type === 'text';
  input.type    = visible ? 'password' : 'text';
  btn.innerHTML = visible ? SVG_EYE : SVG_EYE_OFF;
  btn.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
}

// ── Acciones ───────────────────────────────────────────────────
function logout() {
  clearAuth();
  window.location.href = 'index.html';
}

function toggleMiCuenta()  { document.getElementById('miCuentaDropdown').classList.toggle('open'); }
function openLoginModal()  { document.getElementById('loginModal').classList.add('open'); }
function closeLoginModal() { document.getElementById('loginModal').classList.remove('open'); }

async function handleLogin(e) {
  e.preventDefault();
  const f      = e.target;
  const email  = f.email.value.trim();
  const pw     = f.password.value;
  const btn    = f.querySelector('button[type="submit"]');
  const errEl  = f.querySelector('.auth-error');

  btn.disabled = true; btn.textContent = 'Entrando…'; errEl.textContent = '';

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pw }),
    });
    if (data.success) {
      saveAuth(data.data.token, { ...data.data.user, subscribed: false });
      await refreshSubscriptionStatus();
      closeLoginModal();
      location.reload();
    } else {
      errEl.textContent   = data.message || 'Error al iniciar sesión';
      btn.disabled = false; btn.textContent = 'Entrar';
    }
  } catch {
    errEl.textContent   = 'No se pudo conectar con el servidor';
    btn.disabled = false; btn.textContent = 'Entrar';
  }
}

// ── Modal login ────────────────────────────────────────────────
function injectLoginModal() {
  const modal = document.createElement('div');
  modal.id = 'loginModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content modal-auth">
      <button class="modal-close" onclick="closeLoginModal()">&times;</button>
      <h3>Iniciar sesión</h3>
      <form onsubmit="handleLogin(event)">
        <input type="email" name="email" placeholder="Tu email" required autocomplete="email" />
        <div class="input-pw-wrap">
          <input type="password" name="password" placeholder="Tu contraseña" required autocomplete="current-password" />
          <button type="button" class="pw-toggle" onclick="togglePw(this)" aria-label="Mostrar contraseña">${SVG_EYE}</button>
        </div>
        <p class="auth-error" style="color:#b04040;font-size:0.85rem;min-height:1.2em;margin-top:-0.25rem"></p>
        <button type="submit" class="btn" style="width:100%;margin-top:0.25rem">Entrar</button>
      </form>
      <p class="auth-modal-foot">¿Aún no tienes cuenta? <a href="suscripcion.html">Suscribirme →</a></p>
    </div>
  `;
  modal.addEventListener('click', e => { if (e.target === modal) closeLoginModal(); });
  document.body.appendChild(modal);
}

// ── Nav ────────────────────────────────────────────────────────
function initNav() {
  const u  = getUser();
  const el = document.getElementById('navActions');
  if (!el) return;

  if (u) {
    el.innerHTML = `
      <div class="mi-cuenta-wrap">
        <button class="btn btn-sm btn-outline" onclick="toggleMiCuenta()">
          Mi cuenta <span class="dropdown-arrow">▾</span>
        </button>
        <div class="mi-cuenta-dropdown" id="miCuentaDropdown">
          <p class="dropdown-name">Hola, <strong>${escHTML(u.nombre.split(' ')[0])}</strong></p>
          ${u.subscribed ? '<span class="dropdown-tag">Activa ✓</span>' : ''}
          <a href="mi-cuenta.html" class="dropdown-item">Mi cuenta</a>
          <button class="dropdown-item dropdown-item-danger" onclick="logout()">Cerrar sesión</button>
        </div>
      </div>
    `;
    document.addEventListener('click', e => {
      const wrap = document.querySelector('.mi-cuenta-wrap');
      if (wrap && !wrap.contains(e.target)) {
        const d = document.getElementById('miCuentaDropdown');
        if (d) d.classList.remove('open');
      }
    });
  } else {
    el.innerHTML = `
      <button class="btn btn-sm btn-ghost" onclick="openLoginModal()">Iniciar sesión</button>
      <a href="suscripcion.html" class="btn btn-sm">Suscribirse</a>
    `;
  }
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  injectLoginModal();
  await refreshSubscriptionStatus();
  initNav();
});
