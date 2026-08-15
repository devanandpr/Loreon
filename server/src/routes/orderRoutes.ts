import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      customer,
      items,
      subtotal,
      shipping,
      total,
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

    // Create order and update stock atomically
    const order = await prisma.$transaction(async (tx) => {
      const orderItems = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.id,
          },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
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

      return tx.order.create({
        data: {
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,

          subtotal,
          shipping,
          total,

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
    console.error("Order creation failed:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    });
  }
});

export default router;