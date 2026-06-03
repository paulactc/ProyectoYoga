const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const { executeQuery } = require('../config/database');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

class AuthController {
  static async register(req, res) {
    try {
      const { nombre, email, telefono, password } = req.body;
      if (!nombre || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
      }
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres' });
      }

      const existing = await executeQuery('SELECT id FROM usuarios WHERE email = ?', [email]);
      if (existing.success && existing.data.length > 0) {
        return res.status(409).json({ success: false, message: 'Ya existe una cuenta con este email' });
      }

      const hashed      = await bcrypt.hash(password, 12);
      const rawToken    = crypto.randomBytes(32).toString('hex');
      const tokenHash   = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt   = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await executeQuery(
        'UPDATE email_verifications SET used = TRUE WHERE email = ? AND used = FALSE',
        [email]
      );
      await executeQuery(
        `INSERT INTO email_verifications (token, email, nombre, telefono, hashed_password, expires_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [tokenHash, email, nombre, telefono || null, hashed, expiresAt]
      );

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5500';
      const verifyUrl   = `${frontendUrl}/verify-email.html?token=${rawToken}`;

      try {
        await sendVerificationEmail(email, nombre, verifyUrl);
      } catch (emailErr) {
        console.error('Error enviando email de verificación:', emailErr.message);
        return res.status(500).json({
          success: false,
          message: 'No se pudo enviar el email de confirmación. Comprueba tu dirección o inténtalo más tarde.',
        });
      }

      res.status(200).json({
        success: true,
        pending: true,
        message: 'Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.',
      });
    } catch (err) {
      console.error('Error en register:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, message: 'Token requerido' });
      }

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const result    = await executeQuery(
        'SELECT * FROM email_verifications WHERE token = ? AND used = FALSE AND expires_at > NOW()',
        [tokenHash]
      );

      if (!result.success || result.data.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El enlace no es válido o ha expirado. Vuelve a registrarte para recibir uno nuevo.',
        });
      }

      const pending = result.data[0];

      const existingUser = await executeQuery('SELECT id FROM usuarios WHERE email = ?', [pending.email]);
      if (existingUser.success && existingUser.data.length > 0) {
        await executeQuery('UPDATE email_verifications SET used = TRUE WHERE id = ?', [pending.id]);
        return res.status(409).json({ success: false, message: 'Esta cuenta ya ha sido activada. Puedes iniciar sesión.' });
      }

      const createResult = await executeQuery(
        'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)',
        [pending.nombre, pending.email, pending.telefono, pending.hashed_password]
      );

      if (!createResult.success) {
        return res.status(500).json({ success: false, message: 'Error al crear la cuenta' });
      }

      await executeQuery('UPDATE email_verifications SET used = TRUE WHERE id = ?', [pending.id]);

      const userId = createResult.data.insertId;
      const jwtToken = jwt.sign(
        { id: userId, email: pending.email, nombre: pending.nombre, rol: 'suscriptor' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        message: '¡Cuenta activada correctamente!',
        data: {
          user:  { id: userId, nombre: pending.nombre, email: pending.email, rol: 'suscriptor' },
          token: jwtToken,
        },
      });
    } catch (err) {
      console.error('Error en verifyEmail:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
      }

      const result = await executeQuery(
        'SELECT id, nombre, email, password, rol, activo FROM usuarios WHERE email = ?',
        [email]
      );

      if (!result.success || result.data.length === 0) {
        return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
      }

      const user = result.data[0];

      if (!user.activo) {
        return res.status(401).json({ success: false, message: 'Cuenta desactivada' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        data: { user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }, token },
      });
    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async verifyToken(req, res) {
    try {
      const result = await executeQuery(
        'SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND activo = TRUE',
        [req.user.id]
      );

      if (!result.success || result.data.length === 0) {
        return res.status(401).json({ success: false, message: 'Token inválido' });
      }

      res.json({ success: true, data: { user: result.data[0] } });
    } catch (err) {
      console.error('Error en verifyToken:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email requerido' });
      }

      const genericResponse = {
        success: true,
        message: 'Si el email existe, recibirás un enlace para restablecer la contraseña',
      };

      const result = await executeQuery(
        'SELECT id, email FROM usuarios WHERE email = ? AND activo = TRUE',
        [email]
      );

      if (!result.success || result.data.length === 0) {
        return res.json(genericResponse);
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await executeQuery(
        'UPDATE password_resets SET used = TRUE WHERE email = ? AND used = FALSE',
        [email]
      );
      await executeQuery(
        'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
        [email, tokenHash, expiresAt]
      );

      // TODO: enviar email con nodemailer/Resend usando resetToken
      console.log('Reset URL:', `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

      res.json(genericResponse);
    } catch (err) {
      console.error('Error en requestPasswordReset:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { nombre, email } = req.body;
      if (!nombre || !email) {
        return res.status(400).json({ success: false, message: 'Nombre y email requeridos' });
      }
      const existing = await executeQuery(
        'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        [email, req.user.id]
      );
      if (existing.success && existing.data.length > 0) {
        return res.status(409).json({ success: false, message: 'Ese email ya está en uso' });
      }
      await executeQuery(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, req.user.id]
      );
      res.json({ success: true, message: 'Perfil actualizado' });
    } catch (err) {
      console.error('Error en updateProfile:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Token y nueva contraseña requeridos' });
      }

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const result = await executeQuery(
        'SELECT * FROM password_resets WHERE token = ? AND used = FALSE AND expires_at > NOW()',
        [tokenHash]
      );

      if (!result.success || result.data.length === 0) {
        return res.status(400).json({ success: false, message: 'El enlace no es válido o ha expirado' });
      }

      const record = result.data[0];
      const hashed = await bcrypt.hash(newPassword, 12);

      await executeQuery('UPDATE usuarios SET password = ? WHERE email = ?', [hashed, record.email]);
      await executeQuery('UPDATE password_resets SET used = TRUE WHERE id = ?', [record.id]);

      res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      console.error('Error en resetPassword:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}

module.exports = AuthController;
