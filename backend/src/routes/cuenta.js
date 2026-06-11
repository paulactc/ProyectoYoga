const express = require('express');
const router = express.Router();
const CuentaController = require('../controllers/cuentaController');
const { verifyToken } = require('../middleware/auth');

router.get('/pedidos',                    verifyToken, CuentaController.getPedidos);
router.get('/pedidos/:id/factura',        verifyToken, CuentaController.getFactura);
router.get('/direccion',                  verifyToken, CuentaController.getDireccion);
router.put('/direccion',                  verifyToken, CuentaController.saveDireccion);
router.get('/metodos-pago',              verifyToken, CuentaController.getMetodosPago);
router.post('/metodos-pago',             verifyToken, CuentaController.addMetodoPago);
router.delete('/metodos-pago/:id',       verifyToken, CuentaController.deleteMetodoPago);
router.put('/metodos-pago/:id/predeterminado', verifyToken, CuentaController.setMetodoPredeterminado);
router.put('/password',                  verifyToken, CuentaController.changePassword);

module.exports = router;
