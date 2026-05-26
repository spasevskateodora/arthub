# ArtHub — Original Art Marketplace

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

| Role | Access |
|------|--------|
| Guest | Browse gallery, view artworks, read reviews |
| Buyer | Register, place orders, leave reviews |
| Admin | Full access — add/edit/delete artworks, manage orders, view dashboard |

## Admin Login
- Email: `admin@arthub.com`
- Password: `admin123`

## API Documentation
```
http://localhost:3000/api/docs
```

## External API
- **Met Museum API** — museum artworks for inspiration section

---

## Validation Rules

| Field | Rule |
|-------|------|
| Email | Must match regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ |
| Password | Minimum 6 characters |
| First/Last name | Required, non-empty |
| Price | Number, minimum 1 |
| Year | Number, 1900–2099 |
| Image | JPG, PNG or WEBP, max 10MB |

---

## MongoDB Collections
1. **Users** — buyers and admin
2. **Artworks** — original artworks (depends on Categories)
3. **Categories** — Abstract, Realism, Portrait, Landscape, Digital
4. **Orders** — purchase orders (depends on Artworks)
5. **Reviews** — artwork reviews (depends on Artworks)
