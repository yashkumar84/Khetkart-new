import { Router } from "express";
import { User } from "../models/User";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const page = Number((req.query.page as string) || 1);
  const pageSize = Number((req.query.pageSize as string) || 20);
  const q = (req.query.q as string) || "";
  const filter: any = q ? { $or: [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }] } : {};
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    User.countDocuments(filter),
  ]);
  res.json({ users, total, page, pageSize });
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });
  const user = await User.create({ name, email, password, role: role || "user" });
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const update = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({ user });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id).lean();
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
