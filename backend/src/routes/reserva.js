const express = require('express');
const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIAS_VALIDOS = ['lunes', 'miercoles'];
const DESTINO  = process.env.CONTACT_EMAIL || 'paulact39@gmail.com';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDias(dias) {
  const nombres = { lunes: 'Lunes', miercoles: 'Miércoles' };
  return dias.map(d => nombres[d]).join(' y ');
}

router.post('/', async (req, res) => {
  const { nombre, email, telefono, dias } = req.body;

  if (!nombre || !email || !Array.isArray(dias) || dias.length === 0) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: 'El formato del email no es válido' });
  }
  if (!dias.every(d => DIAS_VALIDOS.includes(d))) {
    return res.status(400).json({ success: false, message: 'Día no válido' });
  }
  if (nombre.length > 100) {
    return res.status(400).json({ success: false, message: 'El nombre es demasiado largo' });
  }
  if (telefono && telefono.length > 30) {
    return res.status(400).json({ success: false, message: 'El teléfono no es válido' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method:  'POST',
      headers: {
        'api-key':      process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender:      { name: 'Yoga Tierra Viva · Web', email: process.env.SMTP_FROM || 'paulact39@gmail.com' },
        to:          [{ email: DESTINO }],
        replyTo:     { email, name: nombre },
        subject:     `Reserva de clase presencial · ${escapeHtml(nombre)} · ${formatDias(dias)}`,
        htmlContent: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#2c2c2c;">
            <h2 style="font-size:1.3rem;font-weight:400;color:#8b5e3c;margin-bottom:1.5rem">
              Nueva reserva de clase presencial
            </h2>
            <p><strong>Vinyasa Yoga · Chiclana de la Frontera</strong></p>
            <p><strong>Día(s) preferido(s):</strong> ${formatDias(dias)}, 19:00h (1h15)</p>
            <hr style="border:none;border-top:1px solid #e8e2da;margin:1.25rem 0"/>
            <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#8b5e3c">${escapeHtml(email)}</a></p>
            ${telefono ? `<p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>` : ''}
            <hr style="border:none;border-top:1px solid #e8e2da;margin:1.25rem 0"/>
            <p style="font-size:0.78rem;color:#bbb">Puedes responder directamente a este email para confirmar la plaza a ${escapeHtml(nombre)}.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Error Brevo reserva:', body);
      return res.status(500).json({ success: false, message: 'No se pudo enviar la reserva. Inténtalo de nuevo.' });
    }

    console.log('Reserva enviada a', DESTINO, 'desde', email, 'para', dias.join(','));
    res.json({ success: true });
  } catch (err) {
    console.error('Error enviando reserva:', err.message);
    res.status(500).json({ success: false, message: 'Error de conexión. Inténtalo de nuevo.' });
  }
});

module.exports = router;
