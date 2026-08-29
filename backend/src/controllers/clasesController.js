const { executeQuery } = require('../config/database');
const { notifyAdminNuevaOpinion } = require('../services/emailService');

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
    'INSERT INTO feedback_clases (usuario_id, clase_id, texto, visible) VALUES (?, ?, ?, FALSE)',
    [usuario_id, id, texto.trim()]
  );
  if (!result.success) {
    return res.status(500).json({ success: false, message: 'Error al guardar la reseña' });
  }

  try {
    await notifyAdminNuevaOpinion({ nombre: req.user.nombre, texto: texto.trim(), origen: `Clase: ${id}` });
  } catch (notifyErr) {
    console.error('Error notificando nueva opinión al admin:', notifyErr.message);
  }

  return res.status(201).json({ success: true, message: '¡Gracias por compartir! Se publicará en cuanto la revise.' });
}

async function registrarVista(req, res) {
  const { id } = req.params;
  const usuario_id = req.user.id;

  const result = await executeQuery(
    `INSERT INTO vistas_clase (usuario_id, clase_id, veces_vista, primera_vista, ultima_vista)
     VALUES (?, ?, 1, NOW(), NOW())
     ON DUPLICATE KEY UPDATE veces_vista = veces_vista + 1, ultima_vista = NOW()`,
    [usuario_id, id]
  );
  if (!result.success) {
    return res.status(500).json({ success: false, message: 'Error al registrar la vista' });
  }
  return res.json({ success: true });
}

module.exports = { getFeedback, postFeedback, registrarVista };
