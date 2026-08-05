const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/auth');
const PackController = require('../controllers/packController');

router.get('/estado',    verifyToken, PackController.getEstado);
router.post('/checkout', verifyToken, PackController.createCheckout);

module.exports = router;
