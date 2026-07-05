const express         = require('express');
const router          = express.Router();
const { verifyToken } = require('../middleware/auth');
const { executeQuery } = require('../config/database');

function parsePlanDays(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const parts = String(raw).split(',').map(Number);
  if (parts.length < 2 || parts.length > 7) return false;
  if (parts.some(d => isNaN(d) || d < 0 || d > 6)) return false;
  return parts.sort((a, b) => a - b).join(',');
}

async function tieneSubscripcionActiva(userId) {
  const r = await executeQuery(
    `SELECT id FROM suscripciones WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE()`,
    [userId]
  );
  return r.success && r.data.length > 0;
}

// GET — progreso del usuario (con fechas de completado)
router.get('/progress', verifyToken, async (req, res) => {
  const result = await executeQuery(
    'SELECT clase_id, created_at AS completed_at FROM travesia_progress WHERE usuario_id = ? ORDER BY created_at',
    [req.user.id]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data });
});

// POST — marcar clase como completada (solo suscriptoras activas)
router.post('/progress/:claseId', verifyToken, async (req, res) => {
  if (!await tieneSubscripcionActiva(req.user.id)) {
    return res.status(403).json({ success: false, error: 'Suscripción activa requerida' });
  }
  const result = await executeQuery(
    'INSERT IGNORE INTO travesia_progress (usuario_id, clase_id) VALUES (?, ?)',
    [req.user.id, req.params.claseId]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

// GET — plan de práctica (solo suscriptoras activas)
router.get('/plan', verifyToken, async (req, res) => {
  if (!await tieneSubscripcionActiva(req.user.id)) {
    return res.status(403).json({ success: false, error: 'Suscripción activa requerida' });
  }
  const result = await executeQuery(
    "SELECT plan_type, DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, plan_days FROM travesia_plans WHERE usuario_id = ?",
    [req.user.id]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data[0] || null });
});

// POST — crear / cambiar plan (solo suscriptoras activas)
router.post('/plan', verifyToken, async (req, res) => {
  if (!await tieneSubscripcionActiva(req.user.id)) {
    return res.status(403).json({ success: false, error: 'Suscripción activa requerida' });
  }
  const { plan_type, plan_days } = req.body;
  if (!['3m', '6m'].includes(plan_type)) {
    return res.status(400).json({ success: false, error: 'plan_type inválido' });
  }
  const validatedDays = parsePlanDays(plan_days);
  if (plan_days !== undefined && validatedDays === false) {
    return res.status(400).json({ success: false, error: 'plan_days inválido' });
  }
  const today = new Date().toISOString().slice(0, 10);

  const existing = await executeQuery(
    'SELECT id FROM travesia_plans WHERE usuario_id = ?',
    [req.user.id]
  );
  if (!existing.success) return res.status(500).json({ success: false });

  let writeResult;
  if (existing.data.length > 0) {
    writeResult = await executeQuery(
      'UPDATE travesia_plans SET plan_type = ?, plan_days = ?, updated_at = CURRENT_TIMESTAMP WHERE usuario_id = ?',
      [plan_type, validatedDays, req.user.id]
    );
    // Fallback por si la columna aún no existe en BD (migración pendiente)
    if (!writeResult.success && writeResult.error?.includes('plan_days')) {
      writeResult = await executeQuery(
        'UPDATE travesia_plans SET plan_type = ?, updated_at = CURRENT_TIMESTAMP WHERE usuario_id = ?',
        [plan_type, req.user.id]
      );
    }
  } else {
    writeResult = await executeQuery(
      'INSERT INTO travesia_plans (usuario_id, plan_type, start_date, plan_days) VALUES (?, ?, ?, ?)',
      [req.user.id, plan_type, today, validatedDays]
    );
    // Fallback por si la columna aún no existe en BD (migración pendiente)
    if (!writeResult.success && writeResult.error?.includes('plan_days')) {
      writeResult = await executeQuery(
        'INSERT INTO travesia_plans (usuario_id, plan_type, start_date) VALUES (?, ?, ?)',
        [req.user.id, plan_type, today]
      );
    }
  }
  if (!writeResult.success) return res.status(500).json({ success: false, error: writeResult.error });

  const plan = await executeQuery(
    "SELECT plan_type, DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, plan_days FROM travesia_plans WHERE usuario_id = ?",
    [req.user.id]
  );
  if (!plan.success || !plan.data?.[0]) return res.status(500).json({ success: false, error: plan.error });
  res.json({ success: true, data: plan.data[0] });
});

module.exports = router;
