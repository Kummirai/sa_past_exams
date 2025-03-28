const { query } = require('../config/db');
const { logger } = require('../utils/logger');

class Session {
  static async create(userId, token, ipAddress, userAgent) {
    const result = await query(
      `INSERT INTO sessions 
       (user_id, token, ip_address, user_agent, expires_at) 
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days') 
       RETURNING session_id`,
      [userId, token, ipAddress, userAgent]
    );
    return result.rows[0];
  }

  static async invalidate(token) {
    await query(
      'UPDATE sessions SET is_active = FALSE WHERE token = $1',
      [token]
    );
  }

  // Add other session model methods
}

module.exports = Session;