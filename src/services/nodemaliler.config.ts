import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
 host: 'consulting.prabisha.com', // SMTP server hostname
  port: 587, // Port for the SMTP server (587 is commonly used for TLS)
  secure: false, // Set to true if your SMTP server uses SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, // Your email here
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP connection successful:', success);
  }
});
