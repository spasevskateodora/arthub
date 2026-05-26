const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Artwork = require('../models/Artwork');
const { auth, adminOnly } = require('../middleware/auth');

// Setup image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../client/images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Only images allowed'));
  }
});

/**
 * @swagger
 * /api/artworks:
 *   get:
 *     summary: Get all artworks
 *     tags: [Artworks]
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.available !== undefined) filter.available = req.query.available === 'true';
    const artworks = await Artwork.find(filter).populate('category').sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/artworks/{id}:
 *   get:
 *     summary: Get artwork by ID
 *     tags: [Artworks]
 */
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate('category');
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/artworks:
 *   post:
 *     summary: Add new artwork (Admin only)
 *     tags: [Artworks]
 */
router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/images/${req.file.filename}` : '';
    const artwork = new Artwork({ ...req.body, image: imageUrl });
    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/artworks/{id}:
 *   put:
 *     summary: Update artwork (Admin only)
 *     tags: [Artworks]
 */
router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = `/images/${req.file.filename}`;
    const artwork = await Artwork.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
    res.json(artwork);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/artworks/{id}:
 *   delete:
 *     summary: Delete artwork (Admin only)
 *     tags: [Artworks]
 */
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const artwork = await Artwork.findByIdAndDelete(req.params.id);
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
    res.json({ message: 'Artwork deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
