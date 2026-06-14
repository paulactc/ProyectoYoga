const { executeQuery } = require('../config/database');

async function getSeries(req, res) {
  const result = await executeQuery(`
    SELECT
      s.id, s.titulo, s.descripcion, s.slug, s.orden,
      m.id AS med_id, m.titulo AS med_titulo, m.descripcion AS med_desc,
      m.duracion, m.orden AS med_orden, m.src, m.disponible
    FROM series_meditacion s
    LEFT JOIN meditaciones m ON m.serie_id = s.id
    WHERE s.activa = TRUE
    ORDER BY s.orden, m.orden
  `);

  if (!result.success) {
    return res.status(500).json({ success: false, message: 'Error al cargar las series' });
  }

  const seriesMap = new Map();
  for (const row of result.data) {
    if (!seriesMap.has(row.id)) {
      seriesMap.set(row.id, {
        id: row.id,
        titulo: row.titulo,
        descripcion: row.descripcion,
        slug: row.slug,
        orden: row.orden,
        meditaciones: [],
      });
    }
    if (row.med_id) {
      seriesMap.get(row.id).meditaciones.push({
        id: row.med_id,
        titulo: row.med_titulo,
        descripcion: row.med_desc,
        duracion: row.duracion,
        orden: row.med_orden,
        src: row.src,
        disponible: !!row.disponible,
      });
    }
  }

  return res.json({ success: true, data: [...seriesMap.values()] });
}

async function getFeedback(req, res) {
  const { id } = req.params;
  const result = await executeQuery(
    `SELECT f.id, f.texto, f.created_at, u.nombre
     FROM feedback_meditacion f
     JOIN usuarios u ON u.id = f.usuario_id
     WHERE f.meditacion_id = ? AND f.visible = TRUE
     ORDER BY f.created_at DESC
     LIMIT 20`,
    [id]
  );

  if (!result.success) {
    return res.status(500).json({ success: false, message: 'Error al cargar los feedbacks' });
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

  const medResult = await executeQuery('SELECT id FROM meditaciones WHERE id = ?', [id]);
  if (!medResult.success || medResult.data.length === 0) {
    return res.status(404).json({ success: false, message: 'Meditación no encontrada' });
  }

  const existsResult = await executeQuery(
    'SELECT id FROM feedback_meditacion WHERE usuario_id = ? AND meditacion_id = ?',
    [usuario_id, id]
  );
  if (existsResult.success && existsResult.data.length > 0) {
    return res.status(409).json({ success: false, message: 'Ya has enviado tu feedback para esta meditación' });
  }

  const result = await executeQuery(
    'INSERT INTO feedback_meditacion (usuario_id, meditacion_id, texto) VALUES (?, ?, ?)',
    [usuario_id, id, texto.trim()]
  );

  if (!result.success) {
    return res.status(500).json({ success: false, message: 'Error al guardar el feedback' });
  }

  return res.status(201).json({ success: true, message: '¡Gracias por tu feedback!' });
}

module.exports = { getSeries, getFeedback, postFeedback };
