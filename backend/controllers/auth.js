const User = require('../models/User');
const Session = require('../models/Session');
const { generateToken } = require('../services/auth');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email');
const { validationResult } = require('express-validator');
const { logger } = require('../utils/logger');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, gradeLevel, province } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      gradeLevel: gradeLevel === 'teacher' ? null : gradeLevel,
      province,
      role: gradeLevel === 'teacher' ? 'teacher' : 'student'
    });

    // Send verification email
    await sendVerificationEmail(newUser.email, newUser.verification_token);

    // Generate JWT token
    const token = generateToken(newUser.user_id, newUser.role);

    // Create session
    await Session.create(newUser.user_id, token, req.ip, req.headers['user-agent']);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: newUser.user_id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        isVerified: newUser.is_verified
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, rememberMe } = req.body;

  try {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Generate JWT token
    const token = generateToken(user.user_id, user.role);

    // Create session
    await Session.create(user.user_id, token, req.ip, req.headers['user-agent']);

    // Update user login info
    await User.updateLoginInfo(user.user_id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 1 day
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isVerified: user.is_verified
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.verifyUser(token);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    res.json({ message: 'Email verified successfully', user });
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No account with that email exists' });
    }

    const { reset_token } = await User.createResetToken(email);
    await sendPasswordResetEmail(email, reset_token);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.resetPassword(token, password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      await Session.invalidate(token);
    }

    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({ message: 'Server error during logout' });
  }
};