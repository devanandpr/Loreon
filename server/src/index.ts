import express, {
  Express,
  Request,
  Response,
} from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import productRoutes from "./routes/productRoutes";

import {
  authenticate,
  AuthenticatedRequest,
} from "./middleware/authMiddleware";

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN ||
      "http://localhost:3000",
    credentials: true,
  })
);

// ========================================
// ROOT
// ========================================

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Loreon API",
    version: "1.0.0",
  });
});

// ========================================
// HEALTH CHECK
// ========================================

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// AUTHENTICATED USER
// GET /api/auth/me
// ========================================

app.get(
  "/api/auth/me",
  authenticate,
  (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    res.status(200).json({
      success: true,
      message: "You are authenticated",
      user: req.user,
    });
  }
);

// ========================================
// PRODUCT ROUTES
// ========================================

app.use(
  "/api/products",
  productRoutes
);

// ========================================
// ORDER ROUTES
// ========================================

app.use(
  "/api/orders",
  orderRoutes
);

// ========================================
// AUTHENTICATION ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);

// ========================================
// ADMIN ROUTES
// ========================================

app.use(
  "/api/admin",
  adminRoutes
);

// ========================================
// 404 HANDLER
// ========================================

app.use(
  (
    _req: Request,
    res: Response
  ) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  }
);

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
    _next: Function
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(
    `🚀 [Loreon API] Server running on http://localhost:${PORT}`
  );
});