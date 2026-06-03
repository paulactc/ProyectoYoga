document.addEventListener('DOMContentLoaded', async () => {
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) toggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  await refreshSubscriptionStatus();
  const u = getUser();

  if (!u) {
    document.getElementById('cuentaLogin').style.display = 'block';
    return;
  }

  document.getElementById('cuentaDashboard').style.display = 'grid';

  const saludo = document.getElementById('cuentaSaludo');
  saludo.innerHTML = `Hola <strong>${escHTML(u.nombre)}</strong> <span class="cuenta-saludo-sub">(<a href="#" onclick="logout();return false;">¿no eres ${escHTML(u.nombre.split(' ')[0])}? Cerrar sesión</a>)</span>`;

  document.getElementById('suscripcionEstado').textContent = u.subscribed
    ? 'Tu suscripción mensual está activa.'
    : 'No tienes ninguna suscripción activa. Actívala por 17 €/mes.';

  document.getElementById('detNombre').value = u.nombre;
  document.getElementById('detEmail').value  = u.email;

  document.getElementById('detallesForm').addEventListener('submit', async e => {
    e.preventDefault();
    const nombre = document.getElementById('detNombre').value.trim();
    const email  = document.getElementById('detEmail').value.trim();
    const btn    = e.target.querySelector('button[type="submit"]');

    btn.disabled = true; btn.textContent = 'Guardando…';

    const data = await apiFetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify({ nombre, email }),
    });

    if (data.success) {
      const auth = getAuth();
      auth.user.nombre = nombre;
      auth.user.email  = email;
      saveAuth(auth.token, auth.user);
      btn.textContent = '¡Guardado! ✓';
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Guardar cambios'; }, 2000);
    } else {
      alert(data.message || 'Error al guardar');
      btn.disabled = false; btn.textContent = 'Guardar cambios';
    }
  });

  document.querySelectorAll('.cuenta-nav-item[data-panel]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const panel = link.dataset.panel;
      document.querySelectorAll('.cuenta-nav-item').forEach(l => l.classList.remove('cuenta-nav-active'));
      link.classList.add('cuenta-nav-active');
      document.querySelectorAll('.cuenta-panel-content').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + panel).classList.add('active');
    });
  });
});
