import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { Order } from "../models/Order";

const router = Router();

router.get(
  "/assigned",
  requireAuth,
  requireRole("delivery"),
  async (req, res) => {
    const orders = await Order.find({ assignedTo: (req as any).user.id }).sort({
      createdAt: -1,
    });
    res.json({ orders });
  },
);

router.post(
  "/:id/picked",
  requireAuth,
  requireRole("delivery"),
  async (req, res) => {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedTo: (req as any).user.id },
      { status: "Out for delivery" },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json({ order });
  },
);

router.post(
  "/:id/delivered",
  requireAuth,
  requireRole("delivery"),
  async (req, res) => {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedTo: (req as any).user.id },
      { status: "Delivered" },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json({ order });
  },
);

export default router;
