"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ========================================
// MIDDLEWARE
// ========================================
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN ||
        "http://localhost:3000",
    credentials: true,
}));
// ========================================
// ROOT
// ========================================
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Loreon API",
        version: "1.0.0",
    });
});
// ========================================
// HEALTH CHECK
// ========================================
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});
// ========================================
// AUTHENTICATED USER
// GET /api/auth/me
// ========================================
app.get("/api/auth/me", authMiddleware_1.authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You are authenticated",
        user: req.user,
    });
});
// ========================================
// PRODUCT ROUTES
// ========================================
app.use("/api/products", productRoutes_1.default);
// ========================================
// ORDER ROUTES
// ========================================
app.use("/api/orders", orderRoutes_1.default);
// ========================================
// AUTHENTICATION ROUTES
// ========================================
app.use("/api/auth", authRoutes_1.default);
// ========================================
// ADMIN ROUTES
// ========================================
app.use("/api/admin", adminRoutes_1.default);
// ========================================
// 404 HANDLER
// ========================================
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});
// ========================================
// GLOBAL ERROR HANDLER
// ========================================
app.use((error, _req, res, _next) => {
    console.error("Unhandled server error:", error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});
// ========================================
// START SERVER
// ========================================
app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 [Loreon API] Server running on port ${PORT}`);
});
