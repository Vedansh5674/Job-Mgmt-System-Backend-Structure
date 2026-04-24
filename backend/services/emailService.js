const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Initialize Nodemailer transporter
// Assumes you have SMTP credentials in your .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendApplicationEmail = async (to, jobTitle, status) => {
  if (process.env.NODE_ENV === 'test') return; // Skip sending in test mode
  
  try {
    const info = await transporter.sendMail({
      from: '"JobPortal" <noreply@jobportal.com>',
      to,
      subject: `Application Update: ${jobTitle}`,
      text: `Your application for the ${jobTitle} position has been updated to: ${status}.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Application Update</h2>
          <p>Your application for the <strong>${jobTitle}</strong> position has been updated to: <strong>${status}</strong>.</p>
          <p>Log in to your dashboard to view more details.</p>
          <br />
          <p>Best,</p>
          <p>The JobPortal Team</p>
        </div>
      `,
    });
    
    logger.info(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    logger.error('Error sending application email:', error);
  }
};

module.exports = { sendApplicationEmail };
