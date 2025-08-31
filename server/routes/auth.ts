import { Router } from "express";
import { User } from "../models/User";
import { signJwt } from "../utils/jwt";
import { requireAuth } from "../middlewares/auth";
import crypto from "crypto";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, referralCode: inputCode } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: string;
      referralCode?: string | null;
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

    // ensure user has a referral code by default
    function genCode(base: string) {
      const clean = (base || "KK").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `${clean}${suffix}`;
    }
    if (!(user as any).referralCode) {
      let code = genCode(user.name);
      while (await User.findOne({ referralCode: code })) {
        code = genCode(user.name);
      }
      (user as any).referralCode = code;
      await user.save();
    }

    // apply referral if provided and valid
    const { Referral } = await import("../models/Referral");
    const REFERRER_REWARD = Number(process.env.REFERRER_REWARD || 50);
    const REFERRED_REWARD = Number(process.env.REFERRED_REWARD || 20);
    const codeIn = (inputCode || "").trim().toUpperCase();
    if (codeIn) {
      const referrer = await User.findOne({ referralCode: codeIn });
      if (referrer && String(referrer._id) !== String(user._id)) {
        (user as any).referredBy = referrer._id as any;
        (user as any).coins = ((user as any).coins || 0) + REFERRED_REWARD;
        (referrer as any).coins = ((referrer as any).coins || 0) + REFERRER_REWARD;
        await Promise.all([user.save(), referrer.save()]);
        await Referral.create({
          code: codeIn,
          referrer: referrer._id,
          referred: user._id,
          rewardReferrer: REFERRER_REWARD,
          rewardReferred: REFERRED_REWARD,
        });
      }
    }

    const token = signJwt({ sub: user.id, role: user.role });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: (user as any).coins || 0,
        referralCode: (user as any).referralCode || null,
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
        coins: (user as any).coins || 0,
        referralCode: (user as any).referralCode || null,
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
      avatar: (user as any).avatar,
      coins: (user as any).coins || 0,
      referralCode: (user as any).referralCode || null,
    },
  });
});

router.put("/me", requireAuth, async (req, res) => {
  const { name, address, phone, avatar } = req.body as {
    name?: string;
    address?: string;
    phone?: string;
    avatar?: string;
  };
  const user = await User.findByIdAndUpdate(
    (req as any).user.id,
    { name, address, phone, avatar },
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
      avatar: (user as any).avatar,
      coins: (user as any).coins || 0,
      referralCode: (user as any).referralCode || null,
    },
  });
});

router.post("/change-password", requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body as {
    oldPassword: string;
    newPassword: string;
  };
  const user = await User.findById((req as any).user.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  const ok = await user.comparePassword(oldPassword);
  if (!ok) return res.status(400).json({ message: "Invalid current password" });
  user.password = newPassword;
  await user.save();
  res.json({ ok: true });
});

router.post("/forgot", async (req, res) => {
  const { email } = req.body as { email: string };
  const user = await User.findOne({ email });
  if (!user) return res.json({ ok: true });
  const token = crypto.randomBytes(24).toString("hex");
  user.set({
    resetToken: token,
    resetExpires: new Date(Date.now() + 60 * 60 * 1000),
  });
  await user.save();
  // In real app, send email with token link
  res.json({ ok: true, token });
});

router.post("/reset", async (req, res) => {
  const { email, token, newPassword } = req.body as {
    email: string;
    token: string;
    newPassword: string;
  };
  const user = await User.findOne({ email, resetToken: token });
  if (!user || !user.resetExpires || user.resetExpires.getTime() < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  user.set({ password: newPassword, resetToken: null, resetExpires: null });
  await user.save();
  res.json({ ok: true });
});

export default router;
