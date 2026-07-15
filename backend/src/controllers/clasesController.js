const { executeQuery } = require('../config/database');

async function getFeedback(req, res) {
  const { id } = req.params;
  const result = await executeQuery(
    `SELECT f.id, f.texto, f.created_at, u.nombre
     FROM feedback_clases f
     JOIN usuarios u ON u.id = f.usuario_id
     WHERE f.clase_id = ? AND f.visible = TRUE
     ORDER BY f.created_at DESC
     LIMIT 20`,
    [id]
  );
  if (!result.success) {
    return res.status(500).json({ success: false, message: 'Error al cargar las reseñas' });
  }
  return res.json({ success: true, data: result.data });
}

async function postFeedback(req, res) {
  const { id } = req.params;
  const { texto } = req.body;
  const usuario_id = req.user.id;

  if (!texto || texto.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'El texto es demasiado corto' });
  }
  if (texto.trim().length > 1000) {
    return res.status(400).json({ success: false, message: 'Máximo 1000 caracteres' });
  }

  const existsResult = await executeQuery(
    'SELECT id FROM feedback_clases WHERE usuario_id = ? AND clase_id = ?',
    [usuario_id, id]
  );
  if (existsResult.success && existsResult.data.length > 0) {
    return res.status(409).json({ success: false, message: 'Ya has compartido tu experiencia en esta clase' });
  }

  const result = await executeQuery(
    'INSERT INTO feedback_clases (usuario_id, clase_id, texto) VALUES (?, ?, ?)',
    [usuario_id, id, texto.trim()]
  );
  if (!result.success) {
    return res.status(500).json({ success: false, message: 'Error al guardar la reseña' });
  }

  return res.status(201).json({ success: true, message: '¡Gracias por compartir!' });
}

module.exports = { getFeedback, postFeedback };
