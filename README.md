# LOREON — Full-Stack E-Commerce Platform

LOREON is a full-stack e-commerce platform built to demonstrate modern frontend development, backend API design, authentication, database management, inventory handling, and order processing.

The application provides a complete shopping workflow from browsing products to authentication, cart management, checkout, and order tracking.

## 🚀 Features

### Customer Features

* User registration and login
* JWT-based authentication
* Product browsing
* Product details and categories
* Persistent shopping cart
* Checkout and order creation
* Customer order history
* Individual order tracking
* Stock availability validation

### Admin Features

* Admin authentication and authorization
* Product creation
* Product updates
* Product deletion
* Inventory management
* View all customer orders
* Update order status

### Backend Features

* RESTful API architecture
* JWT authentication middleware
* Role-based authorization
* Password hashing using bcrypt
* PostgreSQL database
* Prisma ORM
* Transactional order creation
* Atomic inventory updates
* Request validation and error handling
* Helmet security middleware
* CORS configuration
* Request logging using Morgan

---

## 🏗️ Architecture

```text
                    LOREON
                      │
          ┌───────────┴───────────┐
          │                       │
      FRONTEND                 BACKEND
          │                       │
     Next.js / React          Node.js
     TypeScript               Express.js
     Tailwind CSS             TypeScript
     Zustand                  REST APIs
          │                       │
          └────── HTTP/REST ──────┘
                                  │
                              Prisma ORM
                                  │
                              PostgreSQL
```

The frontend communicates with the Express backend through HTTP REST APIs.

The backend handles authentication, business logic, orders, products, inventory, and database operations.

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Zustand

### Backend

* Node.js
* Express.js
* TypeScript
* REST APIs
* JWT
* bcrypt
* Helmet
* CORS
* Morgan

### Database

* PostgreSQL
* Prisma ORM

### Development Tools

* Git
* GitHub
* VS Code
* npm

---

## 🔐 Authentication

LOREON uses JWT-based authentication.

### Authentication Flow

```text
User
 │
 │ Login
 ▼
Next.js Frontend
 │
 │ POST /api/auth/login
 ▼
Express Backend
 │
 │ Verify email/password
 ▼
bcrypt
 │
 │ Generate JWT
 ▼
Frontend
 │
 │ Store authentication state
 ▼
Zustand
```

Protected API requests send the JWT using the Authorization header:

```text
Authorization: Bearer <token>
```

The backend verifies the token through authentication middleware before allowing access to protected resources.

LOREON also implements role-based authorization with:

* CUSTOMER
* ADMIN

---

## 🛒 Order Processing

Orders are created through the backend rather than trusting values supplied by the frontend.

The backend:

1. Authenticates the customer.
2. Validates customer information.
3. Validates the requested products.
4. Checks product availability.
5. Retrieves product prices from PostgreSQL.
6. Creates the order.
7. Creates the order items.
8. Reduces product stock.
9. Returns the created order.

Order creation and stock updates are performed inside a Prisma transaction so related database operations succeed or fail together.

```text
Customer
   ↓
Checkout
   ↓
POST /api/orders
   ↓
Authentication
   ↓
Validate Products
   ↓
Check Stock
   ↓
Create Order
   ↓
Create Order Items
   ↓
Update Stock
   ↓
Return Order
```

---

## 🗄️ Database Design

The application uses PostgreSQL with Prisma ORM.

Main entities:

```text
User
 │
 └── Order
       │
       ├── OrderItem ─── Product
       │
       └── Payment
```

### User

Stores customer and administrator accounts.

### Product

Stores product information including:

* Name
* Brand
* Category
* Price
* Rating
* Image
* Description
* Stock

### Order

Stores customer order information and order status.

### OrderItem

Connects products to orders and stores:

* Quantity
* Product price
* Product reference
* Order reference

### Payment

Stores payment information and payment status.

---

## 📡 REST API

The backend exposes REST endpoints for the application's main operations.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Product creation, updating, and deletion require administrator authorization.

### Orders

```text
POST  /api/orders
GET   /api/orders
GET   /api/orders/my-orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
```

---

## 📁 Project Structure

```text
ecommerce-platform/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── checkout/
│   │   │   └── order-success/
│   │   │
│   │   ├── components/
│   │   ├── data/
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   ├── useAuthStore.ts
│   │   │   └── useCartStore.ts
│   │   └── types/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   │
│   │   └── generated/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/devanandpr/ecommerce-platform.git
cd ecommerce-platform
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secure_jwt_secret"
PORT=5000
```

Do not commit `.env` files or secrets to GitHub.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 7. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

## 🔒 Security

The project includes several basic security practices:

* Password hashing with bcrypt
* JWT authentication
* Role-based authorization
* Protected admin routes
* Helmet security middleware
* CORS configuration
* Environment variables for sensitive configuration
* Server-side product price validation
* Server-side stock validation

---

## 📌 Key Engineering Concepts Demonstrated

LOREON demonstrates practical experience with:

* Full-stack application architecture
* REST API development
* Authentication and authorization
* JWT
* Password hashing
* React and Next.js
* TypeScript
* State management with Zustand
* PostgreSQL
* Prisma ORM
* Relational database design
* Database relationships
* Transactions
* Inventory management
* Error handling
* API integration
* Git and GitHub

---

## 🎯 Project Objective

The main objective of LOREON was to build a realistic full-stack application while gaining practical experience in designing frontend interfaces, developing backend services, connecting applications to relational databases, implementing authentication, and handling real-world business logic such as orders and inventory.

---

## 👨‍💻 Author

**Devanand P Ramesan**

* GitHub: https://github.com/devanandpr
* LinkedIn: https://linkedin.com/in/devanand-p-ramesan
* Email: [devanand0903@gmail.com](mailto:devanand0903@gmail.com)

---

## 📄 License

This project is intended for educational and portfolio purposes.
