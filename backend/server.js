const app = require('./app');
const http = require('http');
const { logger } = require('./utils/logger');
const { connectDB } = require('./config/db');

console.log('Starting server initialization...');

// Load environment variables
require('dotenv').config();
console.log('Environment variables loaded');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

console.log('Attempting database connection...');

// Database connection
connectDB()
  .then(() => {
    console.log('Database connection established successfully');
    logger.info('Database connected successfully');
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🕒 Started at: ${new Date().toISOString()}`);
      console.log('---------------------------------------');
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    logger.error('Database connection failed:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    logger.info('Process terminated');
    process.exit(0);
  });
});