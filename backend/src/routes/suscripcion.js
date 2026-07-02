const express = require('express');
const router  = express.Router();
const SuscripcionController = require('../controllers/suscripcionController');
const { verifyToken } = require('../middleware/auth');

router.get('/estado',    verifyToken, SuscripcionController.getEstado);
router.post('/checkout', verifyToken, SuscripcionController.createCheckout);
router.post('/cancelar', verifyToken, SuscripcionController.cancelar);

module.exports = router;
