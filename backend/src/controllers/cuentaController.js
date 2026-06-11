const bcrypt = require('bcryptjs');
const PDFDocument = require('pdfkit');
const { executeQuery } = require('../config/database');

class CuentaController {
  // ── Pedidos ──────────────────────────────────────────────────────────
  static async getPedidos(req, res) {
    try {
      const result = await executeQuery(
        `SELECT id, estado, importe, fecha_inicio, fecha_fin, created_at
         FROM suscripciones
         WHERE usuario_id = ?
         ORDER BY created_at DESC`,
        [req.user.id]
      );
      res.json({ success: true, data: result.success ? result.data : [] });
    } catch (err) {
      console.error('Error en getPedidos:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async getFactura(req, res) {
    try {
      const { id } = req.params;
      const result = await executeQuery(
        `SELECT s.id, s.estado, s.importe, s.fecha_inicio, s.fecha_fin, s.created_at,
                u.nombre, u.apellidos, u.email
         FROM suscripciones s
         JOIN usuarios u ON u.id = s.usuario_id
         WHERE s.id = ? AND s.usuario_id = ?`,
        [id, req.user.id]
      );

      if (!result.success || result.data.length === 0) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
      }

      const sub = result.data[0];

      const dirResult = await executeQuery(
        'SELECT nombre, apellidos, nif, calle, ciudad, provincia, cp, pais FROM direcciones WHERE usuario_id = ?',
        [req.user.id]
      );
      const dir = dirResult.success && dirResult.data.length > 0 ? dirResult.data[0] : null;

      // Factura completa si tiene NIF + dirección; simplificada en caso contrario
      const esCompleta = dir && dir.nif && dir.calle && dir.ciudad;

      const numFactura = `FAC-${new Date(sub.created_at).getFullYear()}-${String(sub.id).padStart(4, '0')}`;
      const tipoLabel = esCompleta ? 'FACTURA' : 'FACTURA SIMPLIFICADA';

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="factura-${numFactura}.pdf"`);
      doc.pipe(res);

      // ── Cabecera emisor ──
      doc.font('Helvetica-Bold').fontSize(22).fillColor('#000').text('Yoga Tierra Viva', 50, 50);
      doc.font('Helvetica').fontSize(10).fillColor('#666')
        .text('yogatierraviva.es', 50, 76)
        .text('hola@yogatierraviva.es', 50, 90);

      doc.fillColor('#000').font('Helvetica-Bold').fontSize(16)
        .text(tipoLabel, 400, 50, { align: 'right' });
      doc.font('Helvetica').fontSize(10).fillColor('#444')
        .text(`Nº ${numFactura}`, 400, 72, { align: 'right' })
        .text(`Fecha: ${new Date(sub.created_at).toLocaleDateString('es-ES')}`, 400, 86, { align: 'right' });

      doc.moveTo(50, 116).lineTo(545, 116).strokeColor('#c8b99a').lineWidth(1).stroke();

      // ── Datos destinatario ──
      let cursorY = 132;
      doc.fillColor('#000').font('Helvetica-Bold').fontSize(10).text('FACTURAR A:', 50, cursorY);
      cursorY += 16;

      const nombreCompleto = [
        (dir?.nombre || sub.nombre),
        (dir?.apellidos || sub.apellidos)
      ].filter(Boolean).join(' ');

      doc.font('Helvetica').fontSize(10).fillColor('#000').text(nombreCompleto, 50, cursorY);
      cursorY += 14;

      if (esCompleta) {
        if (dir.nif) { doc.text(`NIF/CIF: ${dir.nif}`, 50, cursorY); cursorY += 14; }
        if (dir.calle) { doc.text(dir.calle, 50, cursorY); cursorY += 14; }
        const localidad = [dir.cp, dir.ciudad].filter(Boolean).join(' ');
        if (localidad) { doc.text(localidad, 50, cursorY); cursorY += 14; }
        if (dir.provincia) { doc.text(dir.provincia, 50, cursorY); cursorY += 14; }
        if (dir.pais) { doc.text(dir.pais, 50, cursorY); cursorY += 14; }
      } else {
        doc.fillColor('#888').fontSize(8)
          .text('Factura simplificada — para factura completa añade NIF y dirección en Mi cuenta.', 50, cursorY);
        cursorY += 12;
      }

      doc.fillColor('#888').fontSize(9).text(sub.email, 50, cursorY + 2);

      // ── Tabla de conceptos ──
      const tableTop = Math.max(cursorY + 30, 240);
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#fff')
        .rect(50, tableTop, 495, 24).fill('#8c4e2f')
        .fillColor('#fff')
        .text('Descripción', 60, tableTop + 7)
        .text('Periodo', 270, tableTop + 7)
        .text('Importe', 470, tableTop + 7);

      const rowY = tableTop + 24;
      doc.rect(50, rowY, 495, 30).fill('#fdf8f2');
      doc.fillColor('#000').font('Helvetica').fontSize(10)
        .text('Suscripción mensual – Yoga Tierra Viva', 60, rowY + 10)
        .text(`${fmtDate(sub.fecha_inicio)} – ${fmtDate(sub.fecha_fin)}`, 270, rowY + 10)
        .text(`${Number(sub.importe).toFixed(2)} €`, 470, rowY + 10);

      // ── Total ──
      doc.moveTo(50, rowY + 44).lineTo(545, rowY + 44).strokeColor('#c8b99a').lineWidth(0.5).stroke();
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#000')
        .text('TOTAL', 370, rowY + 55)
        .text(`${Number(sub.importe).toFixed(2)} €`, 470, rowY + 55);

      // ── Nota legal ──
      doc.font('Helvetica').fontSize(8).fillColor('#999')
        .text('Operación exenta de IVA — art. 20.Uno.9.º LIVA (enseñanza). No sujeta a retención IRPF.',
          50, rowY + 85, { width: 495 });

      if (!esCompleta) {
        doc.fontSize(7).fillColor('#bbb')
          .text('Factura simplificada emitida conforme al art. 4 del RD 1619/2012.',
            50, rowY + 100, { width: 495 });
      }

      // ── Pie ──
      doc.fontSize(9).fillColor('#bbb')
        .text('Gracias por confiar en Yoga Tierra Viva.', 50, 770, { align: 'center', width: 495 });

      doc.end();
    } catch (err) {
      console.error('Error en getFactura:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  // ── Dirección ────────────────────────────────────────────────────────
  static async getDireccion(req, res) {
    try {
      const result = await executeQuery(
        'SELECT nombre, apellidos, nif, calle, ciudad, provincia, cp, pais FROM direcciones WHERE usuario_id = ?',
        [req.user.id]
      );
      const dir = result.success && result.data.length > 0 ? result.data[0] : null;
      res.json({ success: true, data: dir });
    } catch (err) {
      console.error('Error en getDireccion:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async saveDireccion(req, res) {
    try {
      const { nombre, apellidos, nif, calle, ciudad, provincia, cp, pais } = req.body;
      await executeQuery(
        `INSERT INTO direcciones (usuario_id, nombre, apellidos, nif, calle, ciudad, provincia, cp, pais)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           nombre = VALUES(nombre), apellidos = VALUES(apellidos), nif = VALUES(nif),
           calle = VALUES(calle), ciudad = VALUES(ciudad),
           provincia = VALUES(provincia), cp = VALUES(cp), pais = VALUES(pais)`,
        [req.user.id, nombre || null, apellidos || null, nif || null, calle || null, ciudad || null, provincia || null, cp || null, pais || 'España']
      );
      res.json({ success: true, message: 'Dirección guardada' });
    } catch (err) {
      console.error('Error en saveDireccion:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  // ── Métodos de pago ──────────────────────────────────────────────────
  static async getMetodosPago(req, res) {
    try {
      const result = await executeQuery(
        'SELECT id, tipo, ultimos_cuatro, mes_expiry, anio_expiry, predeterminado FROM metodos_pago WHERE usuario_id = ? ORDER BY predeterminado DESC, id ASC',
        [req.user.id]
      );
      res.json({ success: true, data: result.success ? result.data : [] });
    } catch (err) {
      console.error('Error en getMetodosPago:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async addMetodoPago(req, res) {
    try {
      const { tipo, ultimos_cuatro, mes_expiry, anio_expiry } = req.body;
      if (!ultimos_cuatro || !mes_expiry || !anio_expiry) {
        return res.status(400).json({ success: false, message: 'Datos de tarjeta incompletos' });
      }
      if (!/^\d{4}$/.test(ultimos_cuatro)) {
        return res.status(400).json({ success: false, message: 'Los últimos 4 dígitos no son válidos' });
      }
      const count = await executeQuery(
        'SELECT COUNT(*) as total FROM metodos_pago WHERE usuario_id = ?',
        [req.user.id]
      );
      const esPrimero = count.success && count.data[0].total === 0;
      const result = await executeQuery(
        'INSERT INTO metodos_pago (usuario_id, tipo, ultimos_cuatro, mes_expiry, anio_expiry, predeterminado) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, tipo || 'visa', ultimos_cuatro, mes_expiry, anio_expiry, esPrimero]
      );
      res.json({ success: true, message: 'Tarjeta añadida', id: result.data?.insertId });
    } catch (err) {
      console.error('Error en addMetodoPago:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async deleteMetodoPago(req, res) {
    try {
      const { id } = req.params;
      const check = await executeQuery(
        'SELECT id FROM metodos_pago WHERE id = ? AND usuario_id = ?',
        [id, req.user.id]
      );
      if (!check.success || check.data.length === 0) {
        return res.status(404).json({ success: false, message: 'Tarjeta no encontrada' });
      }
      await executeQuery('DELETE FROM metodos_pago WHERE id = ?', [id]);
      res.json({ success: true, message: 'Tarjeta eliminada' });
    } catch (err) {
      console.error('Error en deleteMetodoPago:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async setMetodoPredeterminado(req, res) {
    try {
      const { id } = req.params;
      const check = await executeQuery(
        'SELECT id FROM metodos_pago WHERE id = ? AND usuario_id = ?',
        [id, req.user.id]
      );
      if (!check.success || check.data.length === 0) {
        return res.status(404).json({ success: false, message: 'Tarjeta no encontrada' });
      }
      await executeQuery('UPDATE metodos_pago SET predeterminado = FALSE WHERE usuario_id = ?', [req.user.id]);
      await executeQuery('UPDATE metodos_pago SET predeterminado = TRUE WHERE id = ?', [id]);
      res.json({ success: true, message: 'Tarjeta predeterminada actualizada' });
    } catch (err) {
      console.error('Error en setMetodoPredeterminado:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  // ── Contraseña ───────────────────────────────────────────────────────
  static async changePassword(req, res) {
    try {
      const { passwordActual, passwordNueva } = req.body;
      if (!passwordActual || !passwordNueva) {
        return res.status(400).json({ success: false, message: 'Contraseña actual y nueva requeridas' });
      }
      if (passwordNueva.length < 8) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 8 caracteres' });
      }
      const result = await executeQuery(
        'SELECT password FROM usuarios WHERE id = ?',
        [req.user.id]
      );
      if (!result.success || result.data.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      const valid = await bcrypt.compare(passwordActual, result.data[0].password);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'La contraseña actual no es correcta' });
      }
      const hashed = await bcrypt.hash(passwordNueva, 12);
      await executeQuery('UPDATE usuarios SET password = ? WHERE id = ?', [hashed, req.user.id]);
      res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      console.error('Error en changePassword:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
}

module.exports = CuentaController;
