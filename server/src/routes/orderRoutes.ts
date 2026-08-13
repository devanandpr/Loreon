import { Router, Request, Response } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  try {
    const { customer, items, subtotal, shipping, total } = req.body;

    // Basic validation
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer information and cart items are required.",
      });
    }

    const order = {
      id: `ORD-${Date.now()}`,
      customer,
      items,
      subtotal,
      shipping,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("New Order:", order);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

export default router;