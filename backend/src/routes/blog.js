const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// GET /api/blog — artículos publicados, para la lista pública
router.get('/', async (req, res) => {
  const result = await executeQuery(
    `SELECT slug, titulo, resumen, imagen_portada, imagen_portada_alt, tiempo_lectura, created_at
     FROM blog_posts WHERE publicado = TRUE ORDER BY created_at DESC`
  );
  if (!result.success) return res.status(500).json({ success: false });
  res.json({ success: true, data: result.data });
});

// GET /api/blog/:slug — un artículo publicado, con el contenido completo
router.get('/:slug', async (req, res) => {
  const result = await executeQuery(
    `SELECT slug, titulo, resumen, imagen_portada, imagen_portada_alt, tiempo_lectura, contenido, created_at
     FROM blog_posts WHERE slug = ? AND publicado = TRUE`,
    [req.params.slug]
  );
  if (!result.success) return res.status(500).json({ success: false });
  if (result.data.length === 0) return res.status(404).json({ success: false, message: 'Artículo no encontrado' });

  const post = result.data[0];
  post.contenido = JSON.parse(post.contenido);
  res.json({ success: true, data: post });
});

module.exports = router;
