const passport = require('passport');
const { logger } = require('../utils/logger');

exports.authenticate = passport.authenticate('jwt', { session: false });

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.user_id}`);
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};