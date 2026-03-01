# Shop Ecom (MERN + Stripe + AI)

Full-stack e-commerce project with:
- Customer storefront (products, cart, checkout)
- Stripe Checkout payment flow
- AI shopping helper chat + recommendations
- User profile and order history
- Admin panel (dashboard, products, orders, users)

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Stripe, Groq

## Project Structure
```text
shop-ecom/
  client/   # React frontend
  server/   # Express API
```

## Features
### Customer
- Register / Login / Logout
- Browse products
- Add to cart and manage quantity
- Buy now + cart checkout via Stripe
- Payment success flow with order creation
- Order history
- AI chat helper for product guidance
- Profile page with dark mode toggle

### Admin
- Role-protected admin routes
- Dashboard metrics (products, orders, revenue)
- Product CRUD
- Order status updates
- User role management

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB connection string
- Stripe account (test keys)
- Groq API key

## Environment Variables
Create `.env` files in `server/` and `client/`.

### `server/.env`
```env
PORT=3000
NODE_ENV=development

MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<strong_random_secret>
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173

# Prefer STRIPE_SECRET_KEY
STRIPE_SECRET_KEY=<your_stripe_secret_key>
# Backward compatibility (legacy typo still supported)
STIRPE_SECRET_KEY=<optional_legacy_key>

GROQ_API_KEY=<your_groq_api_key>
```

### `client/.env`
```env
VITE_API_KEY=http://localhost:3000/api/v1
```

## Installation
From project root:
```bash
cd client && npm install
cd ../server && npm install
```

## Run in Development
Start backend:
```bash
cd server
npm run dev
```

Start frontend:
```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3000`

## Build Frontend
```bash
cd client
npm run build
```

## Lint Frontend
```bash
cd client
npm run lint
```

## Key API Endpoints
### Auth
- `POST /api/v1/signup`
- `POST /api/v1/login`
- `POST /api/v1/logout`
- `GET /api/v1/me`

### Products
- `GET /api/v1/allproducts`
- `GET /api/v1/product/:id`
- `POST /api/v1/addproduct` (admin)
- `PUT /api/v1/admin/product/:id` (admin)
- `DELETE /api/v1/admin/product/:id` (admin)

### Orders
- `POST /api/v1/order`
- `GET /api/v1/myorders`
- `GET /api/v1/admin/orders` (admin)
- `PUT /api/v1/admin/orders/:id/status` (admin)

### Users (Admin)
- `GET /api/v1/admin/users`
- `PUT /api/v1/admin/users/:id/role`

### Payments
- `POST /api/v1/checkout`

### AI
- `POST /api/v1/aichat`
- `POST /api/v1/airecommend`

## Admin Access
Admin UI is available at:
- `/admin`

Your logged-in user must have role: `admin`.

## Notes
- Product detail endpoint currently requires authenticated user.
- Use test Stripe keys in development.
- Do not commit real secrets to git. Keep `.env` private.

## License
For learning/demo purposes. Add a license if you plan public distribution.
