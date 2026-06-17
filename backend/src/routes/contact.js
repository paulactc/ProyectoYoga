const express = require('express');
const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DESTINO  = process.env.CONTACT_EMAIL || 'paulact39@gmail.com';

router.post('/', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: 'El formato del email no es válido' });
  }
  if (nombre.length > 100) {
    return res.status(400).json({ success: false, message: 'El nombre es demasiado largo' });
  }
  if (mensaje.length > 2000) {
    return res.status(400).json({ success: false, message: 'El mensaje no puede superar los 2000 caracteres' });
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
        subject:     `Mensaje de contacto de ${nombre}`,
        htmlContent: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#2c2c2c;">
            <h2 style="font-size:1.3rem;font-weight:400;color:#8b5e3c;margin-bottom:1.5rem">
              Nuevo mensaje desde Yoga Tierra Viva
            </h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#8b5e3c">${email}</a></p>
            <hr style="border:none;border-top:1px solid #e8e2da;margin:1.25rem 0"/>
            <p style="white-space:pre-wrap;line-height:1.7;color:#444">${mensaje}</p>
            <hr style="border:none;border-top:1px solid #e8e2da;margin:1.25rem 0"/>
            <p style="font-size:0.78rem;color:#bbb">Puedes responder directamente a este email para contestar a ${nombre}.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Error Brevo contacto:', body);
      return res.status(500).json({ success: false, message: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' });
    }

    console.log('Contacto enviado a', DESTINO, 'desde', email);
    res.json({ success: true });
  } catch (err) {
    console.error('Error enviando contacto:', err.message);
    res.status(500).json({ success: false, message: 'Error de conexión. Inténtalo de nuevo.' });
  }
});

module.exports = router;
