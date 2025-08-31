import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { Product } from "../models/Product";
import { User } from "../models/User";

const router = Router();

router.post("/apply", requireAuth, async (_req, res) => {
  return res.status(403).json({ message: "Only admin can assign roles" });
});

router.get(
  "/my-products",
  requireAuth,
  requireRole("farmer"),
  async (req, res) => {
    const list = await Product.find({ createdBy: (req as any).user.id }).sort({
      createdAt: -1,
    });
    res.json({ products: list });
  },
);

export default router;
