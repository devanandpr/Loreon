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
// POST /api/products
// Create a new product
// ========================================
router.post("/", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { id, slug, name, brand, category, price, originalPrice, rating, reviews, image, description, badge, isFeatured, stock, } = req.body;
        // Basic validation
        if (!id ||
            !slug ||
            !name ||
            !brand ||
            !category ||
            price === undefined ||
            rating === undefined ||
            reviews === undefined ||
            !image ||
            !description) {
            return res.status(400).json({
                success: false,
                message: "Required product information is missing",
            });
        }
        // Check if product already exists
        const existingProduct = await prisma_1.default.product.findFirst({
            where: {
                OR: [
                    { id },
                    { slug },
                ],
            },
        });
        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "A product with this ID or slug already exists",
            });
        }
        // Create product
        const product = await prisma_1.default.product.create({
            data: {
                id,
                slug,
                name,
                brand,
                category,
                price: Number(price),
                originalPrice: originalPrice !== undefined &&
                    originalPrice !== null &&
                    originalPrice !== ""
                    ? Number(originalPrice)
                    : null,
                rating: Number(rating),
                reviews: Number(reviews),
                image,
                description,
                badge: badge || null,
                isFeatured: Boolean(isFeatured),
                stock: Number(stock ?? 0),
            },
        });
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
});
// ========================================
// GET /api/products
// Get all products
// ========================================
router.get("/", async (_req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
});
// ========================================
// PUT /api/products/:id
// Update a product
// ========================================
router.put("/:id", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { slug, name, brand, category, price, originalPrice, rating, reviews, image, description, badge, isFeatured, stock, } = req.body;
        const existingProduct = await prisma_1.default.product.findUnique({
            where: {
                id,
            },
        });
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const product = await prisma_1.default.product.update({
            where: {
                id,
            },
            data: {
                slug,
                name,
                brand,
                category,
                price: Number(price),
                originalPrice: originalPrice !== undefined &&
                    originalPrice !== null &&
                    originalPrice !== ""
                    ? Number(originalPrice)
                    : null,
                rating: Number(rating),
                reviews: Number(reviews),
                image,
                description,
                badge: badge || null,
                isFeatured: Boolean(isFeatured),
                stock: Number(stock ?? 0),
            },
        });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
});
// ========================================
// DELETE /api/products/:id
// Delete a product
// ========================================
router.delete("/:id", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if product exists
        const existingProduct = await prisma_1.default.product.findUnique({
            where: {
                id,
            },
        });
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        // Delete product
        await prisma_1.default.product.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
});
// ========================================
// GET /api/products/:id
// Get single product
// ========================================
router.get("/:id", async (req, res) => {
    try {
        const product = await prisma_1.default.product.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
});
exports.default = router;
