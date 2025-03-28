const { logger } = require('../utils/logger');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      gradeLevel: user.grade_level,
      province: user.province
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add other user controller methods