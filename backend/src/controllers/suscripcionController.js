const { executeQuery } = require('../config/database');

class SuscripcionController {
  static async getEstado(req, res) {
    try {
      const result = await executeQuery(
        `SELECT id, estado, fecha_inicio, fecha_fin
         FROM suscripciones
         WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE()
         ORDER BY fecha_fin DESC LIMIT 1`,
        [req.user.id]
      );

      const activa = result.success && result.data.length > 0;
      res.json({
        success: true,
        data: { subscribed: activa, suscripcion: activa ? result.data[0] : null },
      });
    } catch (err) {
      console.error('Error en getEstado:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async activar(req, res) {
    try {
      const existing = await executeQuery(
        `SELECT id FROM suscripciones
         WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE()`,
        [req.user.id]
      );

      if (existing.success && existing.data.length > 0) {
        return res.status(409).json({ success: false, message: 'Ya tienes una suscripción activa' });
      }

      const fechaInicio = new Date().toISOString().slice(0, 10);
      const fechaFin = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      // TODO: integrar Stripe antes de activar
      const result = await executeQuery(
        'INSERT INTO suscripciones (usuario_id, estado, fecha_inicio, fecha_fin) VALUES (?, "activa", ?, ?)',
        [req.user.id, fechaInicio, fechaFin]
      );

      if (!result.success) {
        return res.status(500).json({ success: false, message: 'Error al activar la suscripción' });
      }

      res.json({
        success: true,
        message: 'Suscripción activada',
        data: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
      });
    } catch (err) {
      console.error('Error en activar:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async cancelar(req, res) {
    try {
      const result = await executeQuery(
        `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW()
         WHERE usuario_id = ? AND estado = 'activa'`,
        [req.user.id]
      );

      if (!result.success || result.data.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'No tienes ninguna suscripción activa' });
      }

      res.json({ success: true, message: 'Suscripción cancelada correctamente' });
    } catch (err) {
      console.error('Error en cancelar:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}

module.exports = SuscripcionController;
