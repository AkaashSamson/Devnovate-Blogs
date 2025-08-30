import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
   
    host: 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
        user: process.env.SMTP_USER || 'your-email@example.com',
        pass: process.env.SMTP_PASS || 'your-email-password'
    },
    secure: process.env.SMTP_SECURE === 'true'
});

export default transporter;
