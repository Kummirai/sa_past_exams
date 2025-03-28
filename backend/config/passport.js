const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { query } = require('./db');
const { logger } = require('../utils/logger');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req.cookies?.token
  ]),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const result = await query('SELECT * FROM users WHERE user_id = $1', [payload.userId]);
    if (!result.rows[0]) {
      return done(null, false);
    }
    return done(null, result.rows[0]);
  } catch (error) {
    logger.error('JWT verification error:', error);
    return done(error, false);
  }
}));

module.exports = passport;