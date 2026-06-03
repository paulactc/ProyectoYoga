const express = require('express');
const router = express.Router();
const SuscripcionController = require('../controllers/suscripcionController');
const { verifyToken } = require('../middleware/auth');

router.get('/estado',   verifyToken, SuscripcionController.getEstado);
router.post('/activar', verifyToken, SuscripcionController.activar);
router.post('/cancelar',verifyToken, SuscripcionController.cancelar);

module.exports = router;
