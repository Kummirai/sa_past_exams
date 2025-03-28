const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validate } = require('../middlewares/validation');

// Register route
router.post(
  '/register',
  validate('register'),
  authController.register
);

// Login route
router.post(
  '/login',
  validate('login'),
  authController.login
);

// Email verification route
router.get(
  '/verify-email/:token',
  authController.verifyEmail
);

// Forgot password route
router.post(
  '/forgot-password',
  validate('forgotPassword'),
  authController.forgotPassword
);

// Reset password route
router.post(
  '/reset-password/:token',
  validate('resetPassword'),
  authController.resetPassword
);

// Logout route
router.post(
  '/logout',
  authController.logout
);

module.exports = router;