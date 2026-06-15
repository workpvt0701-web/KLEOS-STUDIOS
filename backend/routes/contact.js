/* =====================================================================
   KLEOS — backend/routes/contact.js
   Receives the contact form and emails it to your inbox via Gmail.
   ---------------------------------------------------------------------
   You need a Gmail "App Password" (NOT your normal password):
     1. Turn on 2-Step Verification on your Google account.
     2. Go to Google Account > Security > App passwords.
     3. Generate one, copy the 16-character code into .env as EMAIL_PASSWORD.
   ===================================================================== */

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, subject, message } = req.body;

  // basic server-side validation
  if (!name || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,           // UPDATE: your Gmail (in .env)
        pass: process.env.EMAIL_PASSWORD   // UPDATE: your Gmail app password (in .env)
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,               // emails land in your own inbox
      replyTo: `${name}`,
      subject: `Kleos enquiry: ${subject}`,
      text: `From: ${name}\n\n${message}`
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send.' });
  }
});

module.exports = router;
