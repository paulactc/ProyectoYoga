const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { nombre, email, mensaje } = req.body;
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }
  // TODO: enviar email con nodemailer o Resend
  console.log('Contacto recibido:', { nombre, email, mensaje });
  res.json({ success: true });
});

module.exports = router;
