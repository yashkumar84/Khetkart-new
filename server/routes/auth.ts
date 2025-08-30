import { Router } from "express";
import { User } from "../models/User";
import { signJwt } from "../utils/jwt";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: string;
    };
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });
    const user = await User.create({
      name,
      email,
      password,
      role: (role as any) || "user",
    });
    const token = signJwt({ sub: user.id, role: user.role });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signJwt({ sub: user.id, role: user.role });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message || "Login failed" });
  }
});

// Seed demo users
router.post("/seed-demo", async (_req, res) => {
  const demos = [
    {
      name: "Admin",
      email: "admin@khetkart.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "User",
      email: "user@khetkart.com",
      password: "user123",
      role: "user",
    },
    {
      name: "Delivery",
      email: "delivery@khetkart.com",
      password: "delivery123",
      role: "delivery",
    },
    {
      name: "Farmer",
      email: "farmer@khetkart.com",
      password: "farmer123",
      role: "farmer",
    },
  ] as const;
  const results: any[] = [];
  for (const d of demos) {
    const exists = await User.findOne({ email: d.email });
    if (!exists) {
      const created = await User.create(d as any);
      results.push({ email: created.email, created: true });
    } else {
      results.push({ email: d.email, created: false });
    }
  }
  res.json({ seeded: results });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById((req as any).user.id).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
    },
  });
});

router.put("/me", requireAuth, async (req, res) => {
  const { name, address, phone } = req.body as {
    name?: string;
    address?: string;
    phone?: string;
  };
  const user = await User.findByIdAndUpdate(
    (req as any).user.id,
    { name, address, phone },
    { new: true },
  ).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
    },
  });
});

export default router;
