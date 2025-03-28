const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const { generateToken } = require('../services/auth');
const { sendVerificationEmail } = require('../services/email');
const { logger } = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, gradeLevel, province } = req.body;
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = await User.create({
      email,
      password,
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

// Add other auth controller methods (login, logout, etc.)