/* =====================================================================
   KLEOS — backend/routes/analytics.js
   Logs a page view per project to MongoDB so the admin panel can show
   which case study gets the most attention.
   ---------------------------------------------------------------------
   Needs a free MongoDB Atlas cluster. Put the connection string in .env
   as MONGODB_URI. The deployment guide explains the Atlas setup.
   ===================================================================== */

const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

let db = null;

// Connect once and reuse the connection.
async function getDb() {
  if (db) return db;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('kleos');
  return db;
}

// Record a view:  POST /api/analytics  { page: "bankai" }
router.post('/', async (req, res) => {
  const { page } = req.body;
  if (!page) return res.status(400).json({ error: 'page is required' });

  try {
    const database = await getDb();
    await database.collection('views').insertOne({
      page,
      timestamp: new Date()
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to log view.' });
  }
});

// Read totals (used by the admin panel):  GET /api/analytics
router.get('/', async (req, res) => {
  try {
    const database = await getDb();
    const totals = await database.collection('views').aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    res.json(totals);
  } catch (err) {
    console.error('Analytics read error:', err);
    res.status(500).json({ error: 'Failed to read analytics.' });
  }
});

module.exports = router;
