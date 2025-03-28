const { body, validationResult } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        body('email').isEmail().normalizeEmail(),
        body('password')
          .isLength({ min: 8 })
          .withMessage('Password must be at least 8 characters long')
          .matches(/[A-Z]/)
          .withMessage('Password must contain at least one uppercase letter')
          .matches(/[a-z]/)
          .withMessage('Password must contain at least one lowercase letter')
          .matches(/\d/)
          .withMessage('Password must contain at least one number'),
        body('firstName').notEmpty().trim().escape(),
        body('lastName').notEmpty().trim().escape(),
        body('gradeLevel')
          .optional({ checkFalsy: true })
          .isIn(['7', '8', '9', '10', '11', '12', 'teacher'])
          .withMessage('Invalid grade level'),
        body('province')
          .optional({ checkFalsy: true })
          .isIn(['EC', 'FS', 'GP', 'KZN', 'LP', 'MP', 'NW', 'NC', 'WC'])
          .withMessage('Invalid province')
      ];
    }
    case 'login': {
      return [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty()
      ];
    }
    case 'forgotPassword': {
      return [
        body('email').isEmail().normalizeEmail()
      ];
    }
    case 'resetPassword': {
      return [
        body('password')
          .isLength({ min: 8 })
          .withMessage('Password must be at least 8 characters long')
          .matches(/[A-Z]/)
          .withMessage('Password must contain at least one uppercase letter')
          .matches(/[a-z]/)
          .withMessage('Password must contain at least one lowercase letter')
          .matches(/\d/)
          .withMessage('Password must contain at least one number')
      ];
    }
  }
};

exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};