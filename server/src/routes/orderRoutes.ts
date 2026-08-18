import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  authenticate,
  requireAdmin,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

const router = Router();

// ========================================
// POST /api/orders
// Create a new order
// ========================================

router.post(
  "/",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
  customer,
  items,
  subtotal,
  shipping,
  total,
  paymentMethod,
} = req.body;

    // Basic validation
    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete customer information is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }
    if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "Authentication required",
  });
}
    // Create order and update stock atomically
    const order = await prisma.$transaction(async (tx) => {
      const orderItems: {
  productId: string;
  quantity: number;
  price: number;
}[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.id,
          },
        });

        if (!product) {
          throw new Error(
            `Product not found: ${item.id}`
          );
        }

        if (item.quantity <= 0) {
          throw new Error(
            `Invalid quantity for ${product.name}`
          );
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Not enough stock for ${product.name}. Available: ${product.stock}`
          );
        }

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        // Reduce stock
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

      // Create order
      return tx.order.create({
        data: {
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,

          userId: req.user?.userId,

          subtotal,
          shipping,
          total,
          paymentMethod: paymentMethod || "COD",

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
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Order creation failed:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    });
  }
});

// ========================================
// GET /api/orders/my-orders
// Get orders belonging to logged-in customer
// ========================================

router.get(
  "/my-orders",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const orders = await prisma.order.findMany({
        where: {
          userId: req.user.userId,
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
        },
      });

      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Error fetching customer orders:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch your orders",
      });
    }
  }
);

// ========================================
// GET /api/orders
// Get all orders
// ========================================

router.get(
  "/",
  authenticate,
  requireAdmin,
  async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

// ========================================
// GET /api/orders/:id
// Get a single order
// Admin: any order
// Customer: only their own order
// ========================================

router.get(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const order = await prisma.order.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Customers can only view their own orders
      if (
        req.user.role !== "ADMIN" &&
        order.userId !== req.user.userId
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this order",
        });
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(
        "Error fetching order:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch order",
      });
    }
  }
);

// ========================================
// PATCH /api/orders/:id/status
// Update order status
// ========================================

router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status } = req.body;

      // Allowed order statuses
      const allowedStatuses = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];

      // Validate status
      if (
        !status ||
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status. Allowed values: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED",
        });
      }

      // Check whether order exists
      const existingOrder =
        await prisma.order.findUnique({
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

      // Update status
      const updatedOrder =
        await prisma.order.update({
          where: {
            id: req.params.id,
          },
          data: {
            status,
          },
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
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      console.error(
        "Error updating order status:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to update order status",
      });
    }
  }
);

export default router;