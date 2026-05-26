const mongoose = require('mongoose');

// ORDER
const orderSchema = new mongoose.Schema({
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Guest checkout fields
  guestName: { type: String, trim: true },
  guestEmail: { type: String, trim: true },
  guestPhone: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
  note: { type: String, trim: true },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// REVIEW
const reviewSchema = new mongoose.Schema({
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  guestName: { type: String, trim: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Review too long'],
  },
  createdAt: { type: Date, default: Date.now },
});

// CATEGORY
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

module.exports = {
  Order: mongoose.model('Order', orderSchema),
  Review: mongoose.model('Review', reviewSchema),
  Category: mongoose.model('Category', categorySchema),
};
