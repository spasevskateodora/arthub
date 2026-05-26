const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  medium: {
    type: String,
    enum: ['oil', 'acrylic', 'watercolor', 'pencil', 'digital', 'mixed', 'other'],
  },
  dimensions: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
    min: 1900,
    max: 2099,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be at least $1'],
  },
  image: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Artwork', artworkSchema);
