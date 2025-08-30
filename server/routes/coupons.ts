import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { Coupon } from "../models/Coupon";

const router = Router();

// Admin: list coupons
router.get("/", requireAuth, requireRole("admin"), async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  res.json({ coupons });
});

// Admin: create coupon
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { code, discountPercent, isActive, expiresAt, description } = req.body as {
    code: string; discountPercent: number; isActive?: boolean; expiresAt?: string; description?: string;
  };
  if (!code || typeof discountPercent !== "number") return res.status(400).json({ message: "Missing fields" });
  const exists = await Coupon.findOne({ code: code.toUpperCase() });
  if (exists) return res.status(409).json({ message: "Coupon already exists" });
  const c = await Coupon.create({ code: code.toUpperCase(), discountPercent, isActive: isActive ?? true, description, expiresAt: expiresAt ? new Date(expiresAt) : undefined });
  res.status(201).json({ coupon: c });
});

// Admin: update coupon
router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { discountPercent, isActive, expiresAt, description } = req.body as { discountPercent?: number; isActive?: boolean; expiresAt?: string; description?: string };
  const update: any = { description };
  if (typeof discountPercent === "number") update.discountPercent = discountPercent;
  if (typeof isActive === "boolean") update.isActive = isActive;
  if (typeof expiresAt !== "undefined") update.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
  const c = await Coupon.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json({ coupon: c });
});

// Admin: delete coupon
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const c = await Coupon.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

// Public: validate coupon for an amount
router.get("/validate", async (req, res) => {
  const code = (req.query.code as string)?.toUpperCase();
  const amount = Number(req.query.amount || 0);
  if (!code) return res.status(400).json({ valid: false, message: "Missing code" });
  const c = await Coupon.findOne({
    code,
    isActive: true,
    $or: [ { expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } } ],
  }).lean();
  if (!c) return res.json({ valid: false, message: "Invalid or expired coupon" });
  const discountAmount = Math.round((amount * c.discountPercent) / 100);
  res.json({ valid: true, discountPercent: c.discountPercent, discountAmount });
});

export default router;
