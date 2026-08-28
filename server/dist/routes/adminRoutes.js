"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// ========================================
// GET /api/admin/dashboard
// Admin dashboard statistics
// ========================================
router.get("/dashboard", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (_req, res) => {
    try {
        // Get basic counts
        const totalProducts = await prisma_1.default.product.count();
        const totalOrders = await prisma_1.default.order.count();
        const totalCustomers = await prisma_1.default.user.count({
            where: {
                role: "CUSTOMER",
            },
        });
        // Get all orders for revenue calculation
        const orders = await prisma_1.default.order.findMany({
            select: {
                total: true,
                status: true,
            },
        });
        const totalRevenue = orders
            .filter((order) => order.status !== "CANCELLED")
            .reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
        // Recent orders
        const recentOrders = await prisma_1.default.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            statistics: {
                totalProducts,
                totalOrders,
                totalCustomers,
                totalRevenue,
                pendingOrders,
            },
            recentOrders,
        });
    }
    catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard",
        });
    }
});
exports.default = router;
