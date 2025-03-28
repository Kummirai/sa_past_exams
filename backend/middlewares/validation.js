const { body, validationResult } = require('express-validator');

exports.registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/\d/),
  body('firstName').notEmpty().trim().escape(),
  body('lastName').notEmpty().trim().escape(),
  body('gradeLevel').optional().isIn(['7', '8', '9', '10', '11', '12', 'teacher']),
  body('province').optional().isIn(['EC', 'FS', 'GP', 'KZN', 'LP', 'MP', 'NW', 'NC', 'WC'])
];

exports.loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};