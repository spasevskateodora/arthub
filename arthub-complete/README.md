# ArtHub - Original Art Marketplace

Full-stack web app for browsing and purchasing original artworks.

## Tech Stack
Frontend: React, React Router, Axios, Chart.js
Backend: Node.js, Express, MongoDB, Mongoose
Auth: JWT, bcryptjs
DevOps: Docker, Docker Compose

---

## How to run

1. Open terminal in `arthub-complete` folder
2. Start server and database:
   docker-compose up
3. Open second terminal, start React:
   cd arthub-client
   npm install
   npm start
4. Open browser: http://localhost:3001
5. Seed database: http://localhost:3000/db - click Setup

---

## User Roles
- Guest - browse gallery and view artworks
- Buyer - register, place orders, leave reviews
- Admin - full access, add/edit/delete artworks, manage orders

Admin login: admin@arthub.com / admin123

---

## API Docs
http://localhost:3000/api/docs

---

## External API
Unsplash API - art inspiration images on home page

---

## MongoDB Collections
1. Users
2. Artworks
3. Categories
4. Orders
5. Reviews