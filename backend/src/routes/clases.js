const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const CLASES = [
  { id: 1, titulo: 'Vinyasa Despertar',    duracion: 30, nivel: 1, descripcion: 'Activa el cuerpo con suavidad. Perfecta para comenzar el día o cuando el tiempo escasea.' },
  { id: 2, titulo: 'Flow Profundo',        duracion: 60, nivel: 2, descripcion: 'Secuencia fluida que trabaja la fuerza, la flexibilidad y la presencia plena.' },
  { id: 3, titulo: 'Pranayama y Silencio', duracion: 30, nivel: 1, descripcion: 'Respiración consciente y meditación guiada para calmar la mente y centrar la energía.' },
  { id: 4, titulo: 'Vinyasa Avanzado',     duracion: 60, nivel: 3, descripcion: 'Posturas desafiantes y transiciones avanzadas para quienes quieren profundizar.' },
  { id: 5, titulo: 'Movilidad y Cuidado',  duracion: 30, nivel: 1, descripcion: 'Cuida tus articulaciones y mejora el rango de movimiento. Ideal para todas las edades.' },
  { id: 6, titulo: 'Yang & Yin',           duracion: 60, nivel: 2, descripcion: 'Combina movimiento dinámico con posturas pasivas sostenidas para un equilibrio total.' },
];

router.get('/', (req, res) => {
  res.json({ success: true, data: CLASES });
});

router.get('/:id', verifyToken, (req, res) => {
  const clase = CLASES.find(c => c.id === Number(req.params.id));
  if (!clase) return res.status(404).json({ success: false, message: 'Clase no encontrada' });
  res.json({ success: true, data: clase });
});

module.exports = router;
