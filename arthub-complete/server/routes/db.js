const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');
const User = require('../models/User');
const { Order, Review, Category } = require('../models/index');

// GET /db — show options page
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ArtHub — DB Tools</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 60px auto; padding: 20px; }
        h1 { font-size: 22px; margin-bottom: 8px; }
        p { color: #777; font-size: 14px; margin-bottom: 30px; }
        button {
          display: block; width: 100%; padding: 12px;
          margin-bottom: 12px; font-size: 14px; cursor: pointer; border: 1px solid #ccc;
        }
        .danger { background: #b00020; color: white; border-color: #b00020; }
        .success { background: #2e7d32; color: white; border-color: #2e7d32; }
        .msg { padding: 12px; margin-top: 16px; font-size: 13px; display:none; }
        .msg.show { display: block; }
        .msg.ok { background: #e8f5e9; color: #2e7d32; border: 1px solid #b2d8b2; }
        .msg.err { background: #ffebee; color: #b00020; border: 1px solid #f5c2c2; }
        a { font-size: 13px; color: #6D1A2A; }
      </style>
    </head>
    <body>
      <h1>ArtHub — Database Tools</h1>
      <p>Use these tools for testing only.</p>

      <button class="danger" onclick="clearDB()">🗑 Clear All Data</button>
      <button class="success" onclick="seedDB()">🌱 Setup (Categories + Admin)</button>
      <a href="/">← Back to gallery</a>

      <div class="msg" id="msg"></div>

      <script>
        async function clearDB() {
          if (!confirm('Delete ALL data from the database?')) return;
          const res = await fetch('/db/clear', { method: 'DELETE' });
          const data = await res.json();
          showMsg(data.message, res.ok);
        }
        async function seedDB() {
          const res = await fetch('/db/seed', { method: 'POST' });
          const data = await res.json();
          showMsg(data.message, res.ok);
        }
        function showMsg(text, ok) {
          const el = document.getElementById('msg');
          el.textContent = text;
          el.className = 'msg show ' + (ok ? 'ok' : 'err');
        }
      </script>
    </body>
    </html>
  `);
});

// DELETE /db/clear
router.delete('/clear', async (req, res) => {
  try {
    await Promise.all([
      Artwork.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Category.deleteMany({}),
    ]);
    res.json({ message: '✅ All data cleared.' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error: ' + err.message });
  }
});

// POST /db/seed — only categories + admin
router.post('/seed', async (req, res) => {
  try {
    await Promise.all([
      Artwork.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Category.deleteMany({}),
    ]);

    // Categories
    await Category.insertMany([
      { name: 'Abstract', slug: 'abstract' },
      { name: 'Realism', slug: 'realism' },
      { name: 'Portrait', slug: 'portrait' },
      { name: 'Landscape', slug: 'landscape' },
      { name: 'Digital', slug: 'digital' },
    ]);

    // Admin user only
    const admin = new User({
      firstName: 'Admin',
      lastName: 'ArtHub',
      email: process.env.ADMIN_EMAIL || 'admin@arthub.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    });
    await admin.save();

    res.json({ message: '✅ Ready! Categories created and admin account set up. You can now add your artworks.' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error: ' + err.message });
  }
});

module.exports = router;
