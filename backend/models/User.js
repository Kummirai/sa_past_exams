const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');

class User {
  static async create({ email, password, firstName, lastName, gradeLevel, province }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();
    
    try {
      const result = await db.query(
        `INSERT INTO users 
         (email, password_hash, first_name, last_name, grade_level, province, verification_token, verification_expires) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '24 hours') 
         RETURNING user_id, email, first_name, last_name, is_verified`,
        [email, hashedPassword, firstName, lastName, gradeLevel, province, verificationToken]
      );
      
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  static async verifyUser(token) {
    try {
      const result = await db.query(
        `UPDATE users 
         SET is_verified = TRUE, verification_token = NULL, verification_expires = NULL 
         WHERE verification_token = $1 AND verification_expires > NOW() 
         RETURNING user_id, email, first_name, last_name`,
        [token]
      );
      return result.rows[0];
    } catch (error) {
      logger.error(`Error verifying user: ${error.message}`);
      throw error;
    }
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    try {
      await db.query(
        'UPDATE users SET password_hash = $1 WHERE user_id = $2',
        [hashedPassword, userId]
      );
    } catch (error) {
      logger.error(`Error updating password: ${error.message}`);
      throw error;
    }
  }

  static async createResetToken(email) {
    const resetToken = uuidv4();
    try {
      const result = await db.query(
        `UPDATE users 
         SET reset_token = $1, reset_expires = NOW() + INTERVAL '1 hour' 
         WHERE email = $2 
         RETURNING email, reset_token`,
        [resetToken, email]
      );
      return result.rows[0];
    } catch (error) {
      logger.error(`Error creating reset token: ${error.message}`);
      throw error;
    }
  }

  static async resetPassword(token, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    try {
      const result = await db.query(
        `UPDATE users 
         SET password_hash = $1, reset_token = NULL, reset_expires = NULL 
         WHERE reset_token = $2 AND reset_expires > NOW() 
         RETURNING user_id, email`,
        [hashedPassword, token]
      );
      return result.rows[0];
    } catch (error) {
      logger.error(`Error resetting password: ${error.message}`);
      throw error;
    }
  }
}

module.exports = User;