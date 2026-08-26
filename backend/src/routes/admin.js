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

// GET /api/admin/usuarios — lista todas las usuarias con estado de suscripción y packs comprados
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
      s.stripe_subscription_id,
      cp.packs       AS pack_slugs,
      cp.pack_fecha  AS pack_created_at
    FROM usuarios u
    LEFT JOIN suscripciones s
      ON s.usuario_id = u.id
      AND s.estado = 'activa'
      AND s.fecha_fin >= CURDATE()
    LEFT JOIN (
      SELECT usuario_id, GROUP_CONCAT(pack_slug) AS packs, MAX(created_at) AS pack_fecha
      FROM compras_pack
      GROUP BY usuario_id
    ) cp ON cp.usuario_id = u.id
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

// GET /api/admin/opiniones — todo el feedback de la web (formulario general,
// meditaciones y clases), pendientes primero
router.get('/opiniones', async (req, res) => {
  const [testimonios, feedbackMed, feedbackClases] = await Promise.all([
    executeQuery(`SELECT id, nombre, texto, aprobado AS visible, created_at FROM testimonios`),
    executeQuery(`
      SELECT f.id, u.nombre, f.texto, f.visible, f.created_at, m.titulo AS contexto
      FROM feedback_meditacion f
      JOIN usuarios u ON u.id = f.usuario_id
      JOIN meditaciones m ON m.id = f.meditacion_id
    `),
    executeQuery(`
      SELECT f.id, u.nombre, f.texto, f.visible, f.created_at, c.titulo AS contexto
      FROM feedback_clases f
      JOIN usuarios u ON u.id = f.usuario_id
      LEFT JOIN clases c ON c.id = CAST(f.clase_id AS UNSIGNED)
    `),
  ]);

  if (!testimonios.success || !feedbackMed.success || !feedbackClases.success) {
    return res.status(500).json({ success: false });
  }

  const data = [
    ...testimonios.data.map(t => ({ ...t, tipo: 'general', origen: 'Opinión general' })),
    ...feedbackMed.data.map(f => ({ ...f, tipo: 'meditacion', origen: `Meditación: ${f.contexto}` })),
    ...feedbackClases.data.map(f => ({ ...f, tipo: 'clase', origen: f.contexto ? `Clase: ${f.contexto}` : 'Clase' })),
  ].sort((a, b) => Number(a.visible) - Number(b.visible) || new Date(b.created_at) - new Date(a.created_at));

  res.json({ success: true, data });
});

const TABLAS_OPINION = {
  general: { tabla: 'testimonios', campoVisible: 'aprobado' },
  meditacion: { tabla: 'feedback_meditacion', campoVisible: 'visible' },
  clase: { tabla: 'feedback_clases', campoVisible: 'visible' },
};

// POST /api/admin/opiniones/:tipo/:id/aprobar
router.post('/opiniones/:tipo/:id/aprobar', async (req, res) => {
  const cfg = TABLAS_OPINION[req.params.tipo];
  const id = parseUserId(req.params.id);
  if (!cfg || !id) return res.status(400).json({ success: false, message: 'Parámetros inválidos' });

  const result = await executeQuery(`UPDATE ${cfg.tabla} SET ${cfg.campoVisible} = TRUE WHERE id = ?`, [id]);
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

// DELETE /api/admin/opiniones/:tipo/:id
router.delete('/opiniones/:tipo/:id', async (req, res) => {
  const cfg = TABLAS_OPINION[req.params.tipo];
  const id = parseUserId(req.params.id);
  if (!cfg || !id) return res.status(400).json({ success: false, message: 'Parámetros inválidos' });

  const result = await executeQuery(`DELETE FROM ${cfg.tabla} WHERE id = ?`, [id]);
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

module.exports = router;
