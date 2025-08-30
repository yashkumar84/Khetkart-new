import { Router } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { requireAuth, requireRole } from "../middlewares/auth";
import { Coupon } from "../models/Coupon";

const router = Router();

// Create order (COD or Online placeholder)
router.post("/", requireAuth, async (req, res) => {
  const { items, address, couponCode } = req.body as { items: Array<{ productId: string; quantity: number }>; address: string; couponCode?: string };
  if (!items?.length || !address) return res.status(400).json({ message: "Missing fields" });
  const dbItems = await Promise.all(items.map(async (it) => {
    const p = await Product.findById(it.productId);
    if (!p) throw new Error("Product not found");
    return { product: p._id, title: p.title, price: (p.discountPrice ?? p.price), quantity: it.quantity };
  }));
  const total = dbItems.reduce((s, it) => s + it.price * it.quantity, 0);
  let discountTotal = 0;
  if (couponCode) {
    const c = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] });
    if (c) discountTotal = Math.round((total * c.discountPercent) / 100);
  }
  const finalTotal = Math.max(0, total - discountTotal);
  const order = await Order.create({ user: (req as any).user.id, items: dbItems, total, discountTotal, finalTotal, address, status: "Placed" });
  res.status(201).json({ order });
});

router.get("/mine", requireAuth, async (req, res) => {
  const orders = await Order.find({ user: (req as any).user.id }).sort({ createdAt: -1 });
  res.json({ orders });
});

router.get("/", requireAuth, requireRole("admin"), async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders });
});

router.post("/:id/status", requireAuth, requireRole("admin", "delivery"), async (req, res) => {
  const { status } = req.body as { status: string };
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json({ order });
});

router.post("/:id/assign", requireAuth, requireRole("admin"), async (req, res) => {
  const { deliveryUserId } = req.body as { deliveryUserId: string };
  const order = await Order.findByIdAndUpdate(req.params.id, { assignedTo: deliveryUserId, status: "Out for delivery" }, { new: true });
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json({ order });
});

export default router;
