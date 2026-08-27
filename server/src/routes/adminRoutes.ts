import { Router, Response } from "express";
import prisma from "../lib/prisma";
import {
  authenticate,
  requireAdmin,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

const router = Router();

// ========================================
// GET /api/admin/dashboard
// Admin dashboard statistics
// ========================================

router.get(
  "/dashboard",
  authenticate,
  requireAdmin,
  async (_req: AuthenticatedRequest, res: Response) => {
    try {
      // Get basic counts
      const totalProducts = await prisma.product.count();

      const totalOrders = await prisma.order.count();

      const totalCustomers = await prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      });

      // Get all orders for revenue calculation
      const orders = await prisma.order.findMany({
        select: {
          total: true,
          status: true,
        },
      });

      const totalRevenue = orders
        .filter((order) => order.status !== "CANCELLED")
        .reduce((sum, order) => sum + order.total, 0);

      const pendingOrders = orders.filter(
        (order) => order.status === "PENDING"
      ).length;

      // Recent orders
      const recentOrders = await prisma.order.findMany({
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
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to load admin dashboard",
      });
    }
  }
);

export default router;