require('dotenv').config();
const { testConnection } = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
