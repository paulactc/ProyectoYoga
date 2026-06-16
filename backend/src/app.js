const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const app = express();

// Security headers
app.set('trust proxy', 1);
app.use(helmet());

// CORS: allow configured frontend URL, Railway public domain, and localhost dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server calls (no origin) and any listed origin
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin not allowed — ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados mensajes enviados. Inténtalo más tarde.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas peticiones. Espera un momento e inténtalo de nuevo.' },
});

app.use('/api/auth',        authLimiter,    require('./routes/auth'));
app.use('/api/suscripcion', apiLimiter,     require('./routes/suscripcion'));
app.use('/api/cuenta',      apiLimiter,     require('./routes/cuenta'));
app.use('/api/clases',        apiLimiter,     require('./routes/clases'));
app.use('/api/meditaciones', apiLimiter,     require('./routes/meditaciones'));
app.use('/api/contact',      contactLimiter, require('./routes/contact'));

// Serve compiled frontend in production
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

module.exports = app;
