const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { query } = require('./config/db');
const { logger } = require('./utils/logger');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

console.log('Initializing Express application...');

// Initialize Express app
const app = express();

console.log('Loading middleware...');

// Middleware
app.use(helmet());
console.log('-> Helmet security middleware loaded');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
console.log(`-> CORS configured for origin: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);

app.use(morgan('combined', { stream: logger.stream }));
console.log('-> Morgan request logging middleware loaded');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('-> Body parsing middleware loaded');

app.use(cookieParser());
console.log('-> Cookie parser middleware loaded');

app.use(passport.initialize());
console.log('-> Passport authentication middleware initialized');

// Database connection test
app.get('/api/health', async (req, res) => {
  console.log('Health check endpoint called');
  try {
    await query('SELECT 1');
    console.log('Database connection verified');
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    logger.error('Database health check failed:', error);
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

console.log('Setting up routes...');

// Routes
app.use('/api/auth', authRoutes);
console.log('-> Auth routes mounted at /api/auth');

app.use('/api/users', userRoutes);
console.log('-> User routes mounted at /api/users');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

console.log('Express application setup complete');
module.exports = app;