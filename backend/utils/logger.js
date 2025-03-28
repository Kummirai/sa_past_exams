const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: 'logs/server.log' }), // Logs to file
  ],
});

// Create a stream object for morgan
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = { logger };
