const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register',        AuthController.register);
router.post('/verify-email',    AuthController.verifyEmail);
router.post('/login',           AuthController.login);
router.get('/me',               verifyToken, AuthController.verifyToken);
router.put('/me',               verifyToken, AuthController.updateProfile);
router.post('/forgot-password', AuthController.requestPasswordReset);
router.post('/reset-password',  AuthController.resetPassword);

module.exports = router;
