const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authenticate } = require('../middlewares/auth');

router.get('/profile', authenticate, userController.getProfile);
// Add other user routes

module.exports = router;