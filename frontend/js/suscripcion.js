document.addEventListener('DOMContentLoaded', async () => {
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) toggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  await refreshSubscriptionStatus();
  const u = getUser();

  // Estado: ya suscrita
  if (u && isSubscribed()) {
    document.getElementById('subscribeForm').style.display = 'none';
    const el = document.getElementById('alreadySubscribed');
    el.style.display = 'block';
    el.querySelector('.ya-nombre').textContent = u.nombre.split(' ')[0];
    return;
  }

  // Estado: logada pero sin suscripción activa
  if (u && !isSubscribed()) {
    document.getElementById('subscribeForm').style.display = 'none';
    const el = document.getElementById('activateOnly');
    el.style.display = 'block';
    el.querySelector('.ya-nombre').textContent = u.nombre.split(' ')[0];

    document.getElementById('activateBtn').addEventListener('click', async () => {
      const btn = document.getElementById('activateBtn');
      btn.disabled = true; btn.textContent = 'Activando…';

      const data = await apiFetch('/suscripcion/activar', { method: 'POST' });
      if (data.success) {
        const auth = getAuth();
        auth.user.subscribed = true;
        saveAuth(auth.token, auth.user);
        location.reload();
      } else {
        btn.disabled = false; btn.textContent = 'Activar suscripción';
        alert(data.message || 'Error al activar la suscripción');
      }
    });
    return;
  }

  // Estado: no logada → registro + suscripción
  document.getElementById('subscribeForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const nombre    = this.querySelector('[name="nombre"]').value.trim();
    const email     = this.querySelector('[name="email"]').value.trim();
    const telefono  = this.querySelector('[name="telefono"]').value.trim();
    const password  = this.querySelector('[name="password"]').value;
    const password2 = this.querySelector('[name="password_confirm"]').value;
    const btn       = this.querySelector('button[type="submit"]');
    const errEl     = this.querySelector('.sub-error');

    errEl.textContent = '';

    // Validaciones frontend
    if (password.length < 8) {
      errEl.textContent = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }
    if (password !== password2) {
      errEl.textContent = 'Las contraseñas no coinciden';
      return;
    }

    btn.disabled = true; btn.textContent = 'Procesando…';

    try {
      // 1. Registrar usuario
      const regData = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, telefono: telefono || null, password }),
      });

      if (!regData.success) {
        errEl.textContent = regData.message || 'Error al crear la cuenta';
        btn.disabled = false; btn.textContent = 'Empezar ahora · 17€/mes';
        return;
      }

      // Email de verificación enviado
      if (regData.pending) {
        this.innerHTML = `
          <div class="subscribe-success">
            <div class="success-icon" style="font-size:1.6rem">📧</div>
            <h3>Revisa tu email</h3>
            <p>Hemos enviado un enlace de confirmación a <strong>${escHTML(email)}</strong>.</p>
            <p style="font-size:0.85rem">Haz clic en el enlace para activar tu cuenta y completar la suscripción.</p>
          </div>`;
        return;
      }
    } catch {
      errEl.textContent = 'No se pudo conectar con el servidor';
      btn.disabled = false; btn.textContent = 'Empezar ahora · 17€/mes';
    }
  });
});
