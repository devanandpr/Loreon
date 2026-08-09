import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 5000;

// ================================
// Middleware
// ================================

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// ================================
// Routes
// ================================

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Loreon API",
    version: "1.0.0",
  });
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ================================
// Start Server
// ================================

app.listen(PORT, () => {
  console.log(
    `🚀 [Loreon API] Server running on http://localhost:${PORT}`
  );
});