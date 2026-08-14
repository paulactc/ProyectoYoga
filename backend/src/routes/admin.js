const express        = require('express');
const router         = express.Router();
const rateLimit      = require('express-rate-limit');
const { verifyToken, verifyRole } = require('../middleware/auth');
const { executeQuery } = require('../config/database');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas peticiones al panel admin.' },
});

router.use(adminLimiter, verifyToken, verifyRole(['admin']));

function parseUserId(param) {
  const id = parseInt(param, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

// GET /api/admin/usuarios — lista todas las usuarias con estado de suscripción
router.get('/usuarios', async (req, res) => {
  const result = await executeQuery(`
    SELECT
      u.id,
      u.nombre,
      u.email,
      u.created_at,
      s.estado       AS sub_estado,
      s.fecha_inicio AS sub_inicio,
      s.fecha_fin    AS sub_fin,
      s.stripe_subscription_id
    FROM usuarios u
    LEFT JOIN suscripciones s
      ON s.usuario_id = u.id
      AND s.estado = 'activa'
      AND s.fecha_fin >= CURDATE()
    ORDER BY u.created_at DESC
  `);
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data });
});

// POST /api/admin/suscripcion/:userId/activar
router.post('/suscripcion/:userId/activar', async (req, res) => {
  const userId = parseUserId(req.params.userId);
  if (!userId) return res.status(400).json({ success: false, message: 'userId inválido' });

  const meses = parseInt(req.body?.meses, 10);
  if (!Number.isFinite(meses) || meses < 1 || meses > 24) {
    return res.status(400).json({ success: false, message: 'meses debe estar entre 1 y 24' });
  }

  const hoy = new Date();
  const fin = new Date(hoy);
  fin.setMonth(fin.getMonth() + meses);
  const fechaInicio = hoy.toISOString().split('T')[0];
  const fechaFin    = fin.toISOString().split('T')[0];

  await executeQuery(
    `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW()
     WHERE usuario_id = ? AND estado = 'activa'`,
    [userId]
  );

  const result = await executeQuery(
    `INSERT INTO suscripciones
       (usuario_id, estado, importe, fecha_inicio, fecha_fin, stripe_subscription_id)
     VALUES (?, 'activa', 0, ?, ?, 'manual_admin')`,
    [userId, fechaInicio, fechaFin]
  );

  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, fechaFin });
});

// POST /api/admin/suscripcion/:userId/cancelar
router.post('/suscripcion/:userId/cancelar', async (req, res) => {
  const userId = parseUserId(req.params.userId);
  if (!userId) return res.status(400).json({ success: false, message: 'userId inválido' });

  const result = await executeQuery(
    `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW()
     WHERE usuario_id = ? AND estado = 'activa'`,
    [userId]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

// GET /api/admin/testimonios — todas las opiniones, pendientes primero
router.get('/testimonios', async (req, res) => {
  const result = await executeQuery(
    `SELECT id, nombre, texto, aprobado, created_at FROM testimonios ORDER BY aprobado ASC, created_at DESC`
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data });
});

// POST /api/admin/testimonios/:id/aprobar
router.post('/testimonios/:id/aprobar', async (req, res) => {
  const id = parseUserId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'id inválido' });

  const result = await executeQuery(`UPDATE testimonios SET aprobado = TRUE WHERE id = ?`, [id]);
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

// DELETE /api/admin/testimonios/:id
router.delete('/testimonios/:id', async (req, res) => {
  const id = parseUserId(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'id inválido' });

  const result = await executeQuery(`DELETE FROM testimonios WHERE id = ?`, [id]);
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

module.exports = router;
