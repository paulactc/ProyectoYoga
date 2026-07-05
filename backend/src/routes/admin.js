const express        = require('express');
const router         = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const { executeQuery } = require('../config/database');

router.use(verifyToken, verifyRole(['admin']));

// GET /api/admin/usuarios — lista todas las usuarias con estado de suscripción
router.get('/usuarios', async (req, res) => {
  const result = await executeQuery(`
    SELECT
      u.id,
      u.nombre,
      u.email,
      u.created_at,
      s.estado      AS sub_estado,
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

// POST /api/admin/suscripcion/:userId/activar — activa suscripción manual (testing / gracias)
router.post('/suscripcion/:userId/activar', async (req, res) => {
  const { userId } = req.params;
  const meses = Number(req.body?.meses) || 12;

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

  if (!result.success) return res.status(500).json({ success: false, error: result.error });
  res.json({ success: true, fechaFin });
});

// POST /api/admin/suscripcion/:userId/cancelar
router.post('/suscripcion/:userId/cancelar', async (req, res) => {
  const result = await executeQuery(
    `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW()
     WHERE usuario_id = ? AND estado = 'activa'`,
    [req.params.userId]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

module.exports = router;
