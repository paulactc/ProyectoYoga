const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/suscripcion', require('./routes/suscripcion'));
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/clases',      require('./routes/clases'));

module.exports = app;
