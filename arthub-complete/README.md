# ArtHub - Original Art Marketplace

A full-stack web application for browsing and purchasing original artworks.

## Tech Stack
- **Frontend:** React (SPA), React Router, Axios, Chart.js
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT, bcryptjs
- **Email:** Nodemailer
- **Docs:** Swagger UI
- **DevOps:** Docker, Docker Compose

---

## How to run locally with Docker

### Requirements
- Docker Desktop installed and running

### Steps

1. Open terminal in the `arthub-complete` folder

2. Start everything:
```
docker-compose up
```

3. Open browser:
```
http://localhost:3000
```

4. Seed the database:
```
http://localhost:3000/db → click "Setup"
```

5. Start React (in a second terminal):
```
cd arthub-client
npm install
npm start
```

6. React app runs on:
```
http://localhost:3001
```

---

## User Roles

guest- can browse and buy artworks
buyer- can browse, buy artworks and leave reviews, when ordering info is automaticlly filled
admin-full access

## Admin Login
Email: admin@arthub.com
Password: admin123

## API Documentation
```
http://localhost:3000/api/docs
```

## External API
Unsplash API - used for home decor inspiration images

## Validation Rules

Email must be valid format
Password minimum 6 characters

## MongoDB Collections
1. Users - buyers and admin
2. Artworks - original artworks (depends on Categories)
3. Categories - Abstract, Realism, Portrait, Landscape, Digital
4. Orders - purchase orders 
5. Reviews - artwork reviews 
