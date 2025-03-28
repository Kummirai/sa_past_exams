const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');

class User {
  static async create({ email, password, firstName, lastName, gradeLevel, province }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();
    
    const result = await query(
      `INSERT INTO users 
       (email, password_hash, first_name, last_name, grade_level, province, verification_token) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING user_id, email, first_name, last_name, grade_level, province, verification_token`,
      [email, hashedPassword, firstName, lastName, gradeLevel, province, verificationToken]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(userId) {
    const result = await query(
      'SELECT * FROM users WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  }

  // Add other user model methods
}

module.exports = User;