
# Premium Taxi Booking Website UI

This Vite/React application keeps the original SS Tours & Travels homepage and adds a MongoDB-backed car marketplace, owner dashboard, quote flow, and admin dashboard.

## Frontend

```bash
npm install
npm run dev
```

The frontend reads `VITE_API_URL` and defaults to `http://localhost:5000/api`.

## Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set `MONGODB_URI`, `PORT`, and `FRONTEND_URL` in `backend/.env`. MongoDB can be local (`mongodb://localhost:27017/car-platform`) or a hosted MongoDB Atlas connection string.

To seed sample listings:

```bash
cd backend
npm run seed
```

For a production backend build, run `npm run build` followed by `npm start` inside `backend`.

## Routes

- `/cars` and `/cars/:id` — browse cars and request a quote.
- `/dashboard` — owner listing overview.
- `/dashboard/cars/new` and `/dashboard/cars/:id/edit` — create or edit listings.
- `/admin` and `/admin/quotes/:id` — quote and listing operations (authentication intentionally deferred).

The backend follows Routes → Controllers → Services → Mongoose Models. API responses use `{ success, message, data }` for success and `{ success, message, error }` for errors. New quote requests are retained in MongoDB and surfaced through the in-app notification endpoint polled by the admin dashboard.
  
