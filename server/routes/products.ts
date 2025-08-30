import { Router } from "express";
import { Product } from "../models/Product";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

// Public list with filters and search
router.get("/", async (req, res) => {
  const { q, category, minPrice, maxPrice, discountOnly, published } = req.query as Record<string, string>;
  const filter: any = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (typeof published !== "undefined") filter.isPublished = published === "true";
  if (discountOnly === "true") filter.discountPrice = { $exists: true, $ne: null };
  const price: any = {};
  if (minPrice) price.$gte = Number(minPrice);
  if (maxPrice) price.$lte = Number(maxPrice);
  if (Object.keys(price).length) filter.price = price;
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ products });
});

router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id).lean();
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ product: p });
});

// Admin/farmer create product
router.post("/", requireAuth, requireRole("admin", "farmer"), async (req, res) => {
  const { title, description, images, price, discountPrice, stock, category, isPublished } = req.body;
  if (!title || !price || !category) return res.status(400).json({ message: "Missing fields" });
  const created = await Product.create({
    title,
    description,
    images: images || [],
    price,
    discountPrice,
    stock: stock ?? 0,
    category,
    isPublished: isPublished ?? false,
    createdBy: (req as any).user.id,
  });
  res.status(201).json({ product: created });
});

router.put("/:id", requireAuth, requireRole("admin", "farmer"), async (req, res) => {
  const update = req.body;
  const p = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ product: p });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

router.post("/:id/publish", requireAuth, requireRole("admin"), async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, { isPublished: true }, { new: true });
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ product: p });
});

router.post("/:id/unpublish", requireAuth, requireRole("admin"), async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, { isPublished: false }, { new: true });
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ product: p });
});

export default router;
