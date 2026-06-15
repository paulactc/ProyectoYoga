require('dotenv').config();
const { testConnection } = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Start serving immediately so Railway health checks pass
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  testConnection();
});
