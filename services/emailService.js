const nodemailer = require('nodemailer');
require('dotenv').config(); // To load environment variables

// Create a transporter using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., 'smtp.gmail.com'
    port: process.env.SMTP_PORT, // e.g., 587
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app-specific password
    },
});

// Function to send an email
const sendEmail = async (to, subject, text, html = null) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER, // Sender's address
            to, // Recipient's address
            subject, // Email subject
            text, // Plain text body
            html, // HTML body (optional)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
