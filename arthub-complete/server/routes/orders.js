// ===== ORDERS =====
const express = require('express');
const ordersRouter = express.Router();
const { Order } = require('../models/index');
const Artwork = require('../models/Artwork');
const { auth, adminOnly } = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/mailer');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Order placed
 */
ordersRouter.post('/', async (req, res) => {
  try {
    const { artworkId, guestName, guestEmail, guestPhone, address, city, country, note } = req.body;

    const artwork = await Artwork.findById(artworkId);
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
    if (!artwork.available) return res.status(400).json({ error: 'Artwork is already sold' });

    const order = new Order({
      artwork: artworkId,
      guestName,
      guestEmail,
      guestPhone,
      address,
      city,
      country,
      note,
      totalPrice: artwork.price,
    });

    await order.save();

    // Mark artwork as sold
    artwork.available = false;
    await artwork.save();

    // Send confirmation email
    await sendOrderConfirmation(guestEmail, guestName, artwork.title, artwork.price);

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
ordersRouter.get('/', auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('artwork').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
ordersRouter.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = { ordersRouter };
