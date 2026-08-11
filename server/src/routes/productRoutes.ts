import { Router, Request, Response } from "express";
import { PRODUCTS } from "../data/products/index";

const router = Router();

// ========================================
// GET /api/products
// Get all products
// ========================================

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: PRODUCTS.length,
    products: PRODUCTS,
  });
});

// ========================================
// GET /api/products/:id
// Get single product
// ========================================

router.get("/:id", (req: Request, res: Response) => {
  const product = PRODUCTS.find(
    (item) => item.id === req.params.id
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product: product,
  });
});

export default router;