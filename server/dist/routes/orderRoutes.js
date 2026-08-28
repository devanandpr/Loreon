"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// =====================================================
// POST /api/orders
// Create a new order
// =====================================================
router.post("/", authMiddleware_1.authenticate, async (req, res) => {
    try {
        const { customer, items, subtotal, shipping, total, paymentMethod, } = req.body;
        // -------------------------------------------------
        // Authentication check
        // -------------------------------------------------
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        // IMPORTANT:
        // Store userId before entering Prisma transaction.
        // This prevents TypeScript errors with req.user.
        const userId = req.user.userId;
        // -------------------------------------------------
        // Validate customer information
        // -------------------------------------------------
        if (!customer ||
            !customer.name ||
            !customer.email ||
            !customer.phone ||
            !customer.address ||
            !customer.city ||
            !customer.state ||
            !customer.pincode) {
            return res.status(400).json({
                success: false,
                message: "Complete customer information is required",
            });
        }
        // -------------------------------------------------
        // Validate items
        // -------------------------------------------------
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one product",
            });
        }
        // -------------------------------------------------
        // Validate payment method
        // -------------------------------------------------
        const selectedPaymentMethod = paymentMethod || "COD";
        const allowedPaymentMethods = [
            "COD",
            "ONLINE",
        ];
        if (!allowedPaymentMethods.includes(selectedPaymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }
        // -------------------------------------------------
        // Create order + update stock atomically
        // -------------------------------------------------
        const order = await prisma_1.default.$transaction(async (tx) => {
            const orderItems = [];
            // ---------------------------------------------
            // Validate every product
            // ---------------------------------------------
            for (const item of items) {
                if (!item.id) {
                    throw new Error("Product ID is required");
                }
                if (typeof item.quantity !== "number" ||
                    item.quantity <= 0) {
                    throw new Error("Invalid product quantity");
                }
                const product = await tx.product.findUnique({
                    where: {
                        id: item.id,
                    },
                });
                if (!product) {
                    throw new Error(`Product not found: ${item.id}`);
                }
                // -------------------------------------------
                // Check stock
                // -------------------------------------------
                if (product.stock <
                    item.quantity) {
                    throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
                }
                // -------------------------------------------
                // Store product price from database
                // -------------------------------------------
                //
                // IMPORTANT:
                // We don't trust the price sent by the
                // frontend.
                //
                // The database price is used instead.
                // -------------------------------------------
                orderItems.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price,
                });
                // -------------------------------------------
                // Reduce stock
                // -------------------------------------------
                await tx.product.update({
                    where: {
                        id: product.id,
                    },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            // -------------------------------------------------
            // Create order
            // -------------------------------------------------
            const createdOrder = await tx.order.create({
                data: {
                    customerName: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    city: customer.city,
                    state: customer.state,
                    pincode: customer.pincode,
                    userId: userId,
                    subtotal: Number(subtotal),
                    shipping: Number(shipping),
                    total: Number(total),
                    paymentMethod: selectedPaymentMethod,
                    // Payment starts as PENDING
                    paymentStatus: "PENDING",
                    // Order starts as PENDING
                    status: "PENDING",
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return createdOrder;
        });
        // -------------------------------------------------
        // Success response
        // -------------------------------------------------
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    }
    catch (error) {
        console.error("Order creation failed:", error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to create order",
        });
    }
});
// =====================================================
// GET /api/orders/my-orders
// Get orders belonging to logged-in customer
// =====================================================
router.get("/my-orders", authMiddleware_1.authenticate, async (req, res) => {
    try {
        // -------------------------------------------------
        // Authentication check
        // -------------------------------------------------
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const userId = req.user.userId;
        // -------------------------------------------------
        // Find customer's orders
        // -------------------------------------------------
        const orders = await prisma_1.default.order.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });
        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    }
    catch (error) {
        console.error("Error fetching customer orders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your orders",
        });
    }
});
// =====================================================
// GET /api/orders
// Admin: Get all orders
// =====================================================
router.get("/", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (_req, res) => {
    try {
        const orders = await prisma_1.default.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
});
// =====================================================
// GET /api/orders/:id
// Get a single order
//
// Admin:
// Can view any order.
//
// Customer:
// Can only view their own order.
// =====================================================
router.get("/:id", authMiddleware_1.authenticate, async (req, res) => {
    try {
        // -------------------------------------------------
        // Authentication check
        // -------------------------------------------------
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        // -------------------------------------------------
        // Find order
        // -------------------------------------------------
        const order = await prisma_1.default.order.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        // -------------------------------------------------
        // Order doesn't exist
        // -------------------------------------------------
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        // -------------------------------------------------
        // Customer authorization
        // -------------------------------------------------
        if (req.user.role !== "ADMIN" &&
            order.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this order",
            });
        }
        // -------------------------------------------------
        // Success
        // -------------------------------------------------
        return res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
});
// =====================================================
// PATCH /api/orders/:id/status
// Admin: Update order status
// =====================================================
router.patch("/:id/status", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        // -------------------------------------------------
        // Allowed statuses
        // -------------------------------------------------
        const allowedStatuses = [
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];
        // -------------------------------------------------
        // Validate status
        // -------------------------------------------------
        if (!status ||
            !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status. Allowed values: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED",
            });
        }
        // -------------------------------------------------
        // Check order
        // -------------------------------------------------
        const existingOrder = await prisma_1.default.order.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        // -------------------------------------------------
        // Update order status
        // -------------------------------------------------
        const updatedOrder = await prisma_1.default.order.update({
            where: {
                id: req.params.id,
            },
            data: {
                status: status,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
        });
    }
});
exports.default = router;
