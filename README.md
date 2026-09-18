# Forge Market — Online Store SPA

Full-stack shopping app with a **Spring Boot** backend (DummyJSON proxy + checkout validation)
and a **React** frontend (catalog, filters, search, cart, checkout).

## Project structure

```
/home/user/online-store/
├── backend/    # Spring Boot 3 (Java 17), port 8080
└── frontend/   # React + Vite + JavaScript, port 5173
```

## Features

- Product catalog with category filtering and debounced search
- Product detail page with dynamic routing (`/products/:id`)
- Shopping cart with React Context global state
- Cart persistence in `localStorage`
- Checkout form validation (client + server Bean Validation)
- Loading and error states throughout the UI

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+ and npm

## Run backend

```bash
cd /home/user/Online-Store/backend
mvn spring-boot:run
```

API base: `http://localhost:8080/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (`limit`, `skip`, `category`, `search`) |
| GET | `/api/products/{id}` | Product detail |
| GET | `/api/categories` | Category list |
| POST | `/api/checkout` | Validate & place order |
| GET | `/api/health` | Health check |

## Run frontend

```bash
cd /home/user/Online-Store/frontend
npm install
npm start
# or: npm run dev
```

Open `http://localhost:5173`

API URL is configured in `.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Tech notes

- Product data is fetched from [DummyJSON](https://dummyjson.com) by the Java backend
- Cart is client-side only and survives page refresh via `localStorage`
- Checkout posts cart + shipping details to the backend for validation
