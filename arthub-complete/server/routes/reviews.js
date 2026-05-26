// ===== REVIEWS =====
const express = require('express');
const reviewsRouter = express.Router();
const categoriesRouter = express.Router();
const { Review, Category } = require('../models/index');
const { auth, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/reviews/{artworkId}:
 *   get:
 *     summary: Get reviews for an artwork
 *     tags: [Reviews]
 */
reviewsRouter.get('/:artworkId', async (req, res) => {
  try {
    const reviews = await Review.find({ artwork: req.params.artworkId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Add a review
 *     tags: [Reviews]
 */
reviewsRouter.post('/', async (req, res) => {
  try {
    const { artworkId, rating, comment, guestName } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const review = new Review({ artwork: artworkId, rating, comment, guestName });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
reviewsRouter.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== CATEGORIES =====

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 */
categoriesRouter.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

categoriesRouter.post('/', auth, adminOnly, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = { reviewsRouter, categoriesRouter };
