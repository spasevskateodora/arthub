const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static HTML files (Дел 1 wireframes)
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/artworks', require('./routes/artworks'));
app.use('/api/users', require('./routes/users'));
const { ordersRouter } = require('./routes/orders');
const { reviewsRouter } = require('./routes/reviews');
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/categories', require('./routes/categories'));
app.use('/db', require('./routes/db'));

// Swagger docs
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArtHub API',
      version: '1.0.0',
      description: 'REST API for ArtHub - Original Art Marketplace',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./server/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/swagger.json', (req, res) => res.json(swaggerSpec));

// Root → serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/arthub';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB:', MONGO_URI);
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
