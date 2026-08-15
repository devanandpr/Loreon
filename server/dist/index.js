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
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
// Root
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Loreon API",
        version: "1.0.0",
    });
});
// Health Check
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});
// Product Routes
app.use("/api/products", productRoutes_1.default);
// Order Routes
app.use("/api/orders", orderRoutes_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 [Loreon API] Server running on http://localhost:${PORT}`);
});
