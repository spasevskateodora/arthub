const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (to, firstName) => {
  try {
    await transporter.sendMail({
      from: `"ArtHub" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to ArtHub!',
      html: `
        <h2>Welcome, ${firstName}!</h2>
        <p>Thank you for joining ArtHub. You can now browse and purchase original artworks.</p>
        <a href="http://localhost:3000">Visit ArtHub</a>
      `,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const sendOrderConfirmation = async (to, name, artworkTitle, price) => {
  try {
    await transporter.sendMail({
      from: `"ArtHub" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed — ${artworkTitle}`,
      html: `
        <h2>Thank you for your order, ${name}!</h2>
        <p>Your order for <strong>${artworkTitle}</strong> ($${price}) has been received.</p>
        <p>The artist will contact you shortly to arrange collection.</p>
        <a href="http://localhost:3000">Visit ArtHub</a>
      `,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendWelcomeEmail, sendOrderConfirmation };
