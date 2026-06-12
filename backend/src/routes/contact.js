const express = require('express');
const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', (req, res) => {
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

  // TODO: enviar email con nodemailer o Resend
  console.log('Contacto recibido:', { nombre, email, mensaje: mensaje.slice(0, 100) });
  res.json({ success: true });
});

module.exports = router;
