const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { executeQuery } = require('../config/database');

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados envíos. Inténtalo más tarde.' },
});

// GET /api/testimonios — opiniones aprobadas, para mostrar en la web
router.get('/', async (req, res) => {
  const result = await executeQuery(
    `SELECT nombre, texto, created_at FROM testimonios WHERE aprobado = TRUE ORDER BY created_at DESC LIMIT 20`
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data });
});

// POST /api/testimonios — una alumna envía su opinión (queda pendiente de aprobación)
router.post('/', submitLimiter, async (req, res) => {
  const { nombre, texto } = req.body;

  if (!nombre || !texto) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }
  if (nombre.length > 100) {
    return res.status(400).json({ success: false, message: 'El nombre es demasiado largo' });
  }
  if (texto.length > 1000) {
    return res.status(400).json({ success: false, message: 'El mensaje no puede superar los 1000 caracteres' });
  }

  const result = await executeQuery(
    `INSERT INTO testimonios (nombre, texto, aprobado) VALUES (?, ?, FALSE)`,
    [nombre.trim(), texto.trim()]
  );
  if (!result.success) return res.status(500).json({ success: false, message: 'No se pudo enviar. Inténtalo de nuevo.' });

  res.json({ success: true });
});

module.exports = router;
