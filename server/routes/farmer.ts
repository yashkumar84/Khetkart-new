import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { Product } from "../models/Product";
import { User } from "../models/User";

const router = Router();

router.post("/apply", requireAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    (req as any).user.id,
    { role: "farmer" },
    { new: true },
  );
  res.json({
    user: {
      id: user!.id,
      name: user!.name,
      email: user!.email,
      role: user!.role,
    },
  });
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
