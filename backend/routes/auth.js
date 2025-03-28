const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { registerValidation, loginValidation, validate } = require('../middlewares/validation');

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', authController.logout);
// Add other auth routes

module.exports = router;