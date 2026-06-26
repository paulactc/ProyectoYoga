const express         = require('express');
const router          = express.Router();
const { verifyToken } = require('../middleware/auth');
const { executeQuery } = require('../config/database');

// GET — progreso del usuario autenticado
router.get('/progress', verifyToken, async (req, res) => {
  const result = await executeQuery(
    'SELECT clase_id FROM travesia_progress WHERE usuario_id = ?',
    [req.user.id]
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data.map(r => r.clase_id) });
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

module.exports = router;
