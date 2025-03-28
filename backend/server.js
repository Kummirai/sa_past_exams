const app = require('./app');
const http = require('http');
const { logger } = require('./utils/logger');
const { connectDB } = require('./config/db');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Database connection
connectDB()
  .then(() => {
    logger.info('Database connected successfully');
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(error => {
    logger.error('Database connection failed:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});