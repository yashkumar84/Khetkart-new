import { Router } from "express";
import { Product } from "../models/Product";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

// Public list with filters and search
router.get("/", async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    discountOnly,
    published,
    inStock,
    page,
    pageSize,
    sort,
  } = req.query as Record<string, string>;
  const filter: any = {};
  if (q) filter.title = new RegExp(q, "i");
  if (category) filter.category = category;
  if (typeof published !== "undefined")
    filter.isPublished = published === "true";
  if (discountOnly === "true")
    filter.discountPrice = { $exists: true, $ne: null };
  if (inStock === "true") filter.stock = { $gt: 0 };
  const price: any = {};
  if (minPrice) price.$gte = Number(minPrice);
  if (maxPrice) price.$lte = Number(maxPrice);
  if (Object.keys(price).length) filter.price = price;

  const sortMap: Record<string, any> = {
    created_desc: { createdAt: -1 },
    created_asc: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };
  const sortBy = sortMap[sort || "created_desc"] || { createdAt: -1 };

  const p = Math.max(1, Number(page || 0));
  const ps = Math.max(1, Math.min(60, Number(pageSize || 0)));
  if (p && ps) {
    const [list, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .populate("createdBy", "name email role")
        .skip((p - 1) * ps)
        .limit(ps)
        .lean(),
      Product.countDocuments(filter),
    ]);
    return res.json({ products: list, total, page: p, pageSize: ps });
  }

  const products = await Product.find(filter)
    .sort(sortBy)
    .populate("createdBy", "name email role")
    .lean();
  res.json({ products, total: products.length });
});

router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id).lean();
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ product: p });
});

// Admin/farmer create product
router.post(
  "/",
  requireAuth,
  requireRole("admin", "farmer"),
  async (req, res) => {
    const {
      title,
      description,
      images,
      price,
      discountPrice,
      stock,
      unit,
      category,
      isPublished,
    } = req.body;
    if (!title || !price || !category)
      return res.status(400).json({ message: "Missing fields" });
    const actor = (req as any).user;
    const role = actor?.role;
    const created = await Product.create({
      title,
      description,
      images: images || [],
      price,
      discountPrice,
      stock: stock ?? 0,
      category,
      unit,
      isPublished: role === "admin" ? (typeof isPublished === "boolean" ? isPublished : true) : false,
      publishRequested: role === "farmer" ? true : false,
      isDeclined: false,
      createdBy: actor.id,
    });
    res.status(201).json({ product: created });
  },
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "farmer"),
  async (req, res) => {
    const update = req.body;
    const p = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json({ product: p });
  },
);

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

router.post(
  "/:id/publish",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true },
    );
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json({ product: p });
  },
);

router.post(
  "/:id/unpublish",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true },
    );
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json({ product: p });
  },
);

export default router;
