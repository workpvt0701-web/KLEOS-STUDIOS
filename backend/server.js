/* =====================================================================
   KLEOS — backend/server.js
   A small Express server that powers:
     1. the contact form  (POST /api/contact)  -> sends you an email
     2. analytics logging  (POST /api/analytics) -> records page views
   ---------------------------------------------------------------------
   You do NOT need this to put the site online. The frontend works on its
   own (GitHub Pages). Add this backend later when you want a real contact
   form and view tracking. The deployment guide walks through it.
   ===================================================================== */

const express = require('express');
const cors = require('cors');
require('dotenv').config();           // loads variables from .env

const app = express();
app.use(express.json());

// --- CORS: only allow your live frontend to talk to this server -------
// UPDATE: replace with your GitHub Pages URL, e.g.
//   https://yourusername.github.io
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// --- Routes -----------------------------------------------------------
app.use('/api/contact', require('./routes/contact'));
app.use('/api/analytics', require('./routes/analytics'));

// simple health check so you can confirm the server is alive
app.get('/', (req, res) => res.send('Kleos backend is running.'));

// --- Start ------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kleos backend listening on port ${PORT}`));
