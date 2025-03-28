const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const { generateToken } = require('../services/auth');
const { sendVerificationEmail } = require('../services/email');
const { logger } = require('../utils/logger');

// Register User
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, gradeLevel, province } = req.body;
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gradeLevel,
      province
    });

    await sendVerificationEmail(newUser.email, newUser.verification_token);

    const token = generateToken(newUser.user_id, newUser.role);
    await Session.create(newUser.user_id, token, req.ip, req.headers['user-agent']);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.user_id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.user_id, user.role);
    await Session.create(user.user_id, token, req.ip, req.headers['user-agent']);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Logout User
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: 'No token found' });
    }

    await Session.delete(token);
    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
