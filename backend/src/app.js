const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/suscripcion', require('./routes/suscripcion'));
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/clases',      require('./routes/clases'));

// Serve compiled frontend in production
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

module.exports = app;
