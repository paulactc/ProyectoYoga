const express = require('express');
const router  = express.Router();
const SuscripcionController = require('../controllers/suscripcionController');
const { verifyToken } = require('../middleware/auth');

router.get('/estado',    verifyToken, SuscripcionController.getEstado);
// Suscripción mensual retirada de la venta (ahora solo Pack Raíz de pago único).
// Se comenta para que nadie pueda crear una suscripción nueva llamando a la
// API directamente. /estado y /cancelar se mantienen activas por si queda
// alguna usuaria con una suscripción mensual todavía en curso.
// router.post('/checkout', verifyToken, SuscripcionController.createCheckout);
router.post('/cancelar', verifyToken, SuscripcionController.cancelar);

module.exports = router;
