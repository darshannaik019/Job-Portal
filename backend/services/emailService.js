import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

let transporter;

try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
      user: process.env.SMTP_USER || null,
      pass: process.env.SMTP_PASS || null,
    },
  });
} catch (error) {
  logger.warn(`Could not initialize Nodemailer transporter. Fallback to mock logs: ${error.message}`);
}

export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@careerpartner.com',
    to: options.email,
    subject: options.subject,
    html: options.html || options.message,
  };

  if (!transporter || !process.env.SMTP_USER) {
    logger.info(`[MOCK EMAIL SENT] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
  }
};
