const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: `"SA Past Exams" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

// Add other email service methods