import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

// ========================================
// POST /api/products
// Create a new product
// ========================================

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      id,
      slug,
      name,
      brand,
      category,
      price,
      originalPrice,
      rating,
      reviews,
      image,
      description,
      badge,
      isFeatured,
      stock,
    } = req.body;

    // Basic validation
    if (
      !id ||
      !slug ||
      !name ||
      !brand ||
      !category ||
      price === undefined ||
      rating === undefined ||
      reviews === undefined ||
      !image ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Required product information is missing",
      });
    }

    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
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
    const product = await prisma.product.create({
      data: {
        id,
        slug,
        name,
        brand,
        category,
        price: Number(price),
        originalPrice:
          originalPrice !== undefined &&
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
  } catch (error) {
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

router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
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

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      slug,
      name,
      brand,
      category,
      price,
      originalPrice,
      rating,
      reviews,
      image,
      description,
      badge,
      isFeatured,
      stock,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
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

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        slug,
        name,
        brand,
        category,
        price: Number(price),
        originalPrice:
          originalPrice !== undefined &&
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
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});


// ========================================
// GET /api/products/:id
// Get single product
// ========================================

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
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
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

export default router;