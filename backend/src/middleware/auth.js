const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Token de acceso requerido' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await executeQuery(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (!result.success || result.data.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = result.data[0];
    if (!user.activo) {
      return res.status(401).json({ success: false, message: 'Usuario desactivado' });
    }

    req.user = { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expirado' });
    }
    console.error('Error en middleware auth:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const verifyRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  next();
};

module.exports = { verifyToken, verifyRole };
