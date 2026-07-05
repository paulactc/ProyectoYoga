const express         = require('express');
const router          = express.Router();
const { verifyToken } = require('../middleware/auth');
const { executeQuery } = require('../config/database');

// GET — progreso del usuario (con fechas de completado)
router.get('/progress', verifyToken, async (req, res) => {
  const result = await executeQuery(
    'SELECT clase_id, created_at AS completed_at FROM travesia_progress WHERE usuario_id = ? ORDER BY created_at',
    [req.user.id]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data });
});

// POST — marcar clase como completada
router.post('/progress/:claseId', verifyToken, async (req, res) => {
  const result = await executeQuery(
    'INSERT IGNORE INTO travesia_progress (usuario_id, clase_id) VALUES (?, ?)',
    [req.user.id, req.params.claseId]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true });
});

// GET — plan de práctica del usuario
router.get('/plan', verifyToken, async (req, res) => {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS travesia_plans (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL UNIQUE,
      plan_type  VARCHAR(10) NOT NULL DEFAULT '3m',
      start_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  const result = await executeQuery(
    "SELECT plan_type, DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date FROM travesia_plans WHERE usuario_id = ?",
    [req.user.id]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data[0] || null });
});

// POST — crear / cambiar plan (start_date se fija al día de creación y no cambia al editar)
router.post('/plan', verifyToken, async (req, res) => {
  const { plan_type } = req.body;
  if (!['3m', '6m'].includes(plan_type)) return res.status(400).json({ success: false, error: 'plan_type inválido' });

  // Crear tabla si no existe (por si la migración fue omitida en Railway)
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS travesia_plans (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL UNIQUE,
      plan_type  VARCHAR(10) NOT NULL DEFAULT '3m',
      start_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const today = new Date().toISOString().slice(0, 10);
  const result = await executeQuery(
    `INSERT INTO travesia_plans (usuario_id, plan_type, start_date)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE plan_type = ?, updated_at = CURRENT_TIMESTAMP`,
    [req.user.id, plan_type, today, plan_type]
  );
  if (!result.success) return res.status(500).json({ success: false, error: result.error });

  const plan = await executeQuery(
    "SELECT plan_type, DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date FROM travesia_plans WHERE usuario_id = ?",
    [req.user.id]
  );
  if (!plan.success || !plan.data?.[0]) return res.status(500).json({ success: false, error: plan.error });
  res.json({ success: true, data: plan.data[0] });
});

module.exports = router;
