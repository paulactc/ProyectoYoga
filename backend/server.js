require('dotenv').config();
const { testConnection } = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Migrations run first, then listen — prevents race condition where
// requests arrive before DB columns exist.
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(() => {
  // If DB never connects, still start the server so Railway health checks pass.
  app.listen(PORT, () => {
    console.log(`Servidor corriendo (sin BD) en http://localhost:${PORT}`);
  });
});
