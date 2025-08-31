import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { User } from "../models/User";
import { Referral } from "../models/Referral";
import { Payout } from "../models/Payout";

const router = Router();

const REFERRER_REWARD = Number(process.env.REFERRER_REWARD || 50);
const REFERRED_REWARD = Number(process.env.REFERRED_REWARD || 20);

function genCode(base: string) {
  const clean = base
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${clean}${suffix}`;
}

router.get("/code", requireAuth, async (req, res) => {
  const user = await User.findById((req as any).user.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  if (!user.referralCode) {
    let code = genCode(user.name || "KK");
    // ensure uniqueness
    // eslint-disable-next-line no-constant-condition
    while (await User.findOne({ referralCode: code })) {
      code = genCode(user.name || "KK");
    }
    user.referralCode = code;
    await user.save();
  }
  res.json({ code: user.referralCode });
});

router.post("/apply", requireAuth, async (req, res) => {
  const { code } = req.body as { code: string };
  if (!code) return res.status(400).json({ message: "Code required" });
  const me = await User.findById((req as any).user.id);
  if (!me) return res.status(404).json({ message: "Not found" });
  if (me.referralCode && me.referralCode === code)
    return res.status(400).json({ message: "Cannot apply your own code" });
  if (me.referredBy)
    return res.status(400).json({ message: "Referral already applied" });

  const referrer = await User.findOne({ referralCode: code });
  if (!referrer) return res.status(404).json({ message: "Invalid code" });

  me.referredBy = referrer._id;
  me.coins = (me.coins || 0) + REFERRED_REWARD;
  referrer.coins = (referrer.coins || 0) + REFERRER_REWARD;
  await Promise.all([me.save(), referrer.save()]);

  const entry = await Referral.create({
    code,
    referrer: referrer._id,
    referred: me._id,
    rewardReferrer: REFERRER_REWARD,
    rewardReferred: REFERRED_REWARD,
  });

  res.json({ ok: true, referral: entry, coins: me.coins });
});

router.get("/history", requireAuth, async (req, res) => {
  const list = await Referral.find({ referrer: (req as any).user.id })
    .sort({ createdAt: -1 })
    .populate("referred", "name email")
    .lean();
  res.json({ referrals: list });
});

router.get("/stats", requireAuth, async (req, res) => {
  const me = await User.findById((req as any).user.id).lean();
  if (!me) return res.status(404).json({ message: "Not found" });
  const totalReferred = await Referral.countDocuments({ referrer: me._id });
  const totalEarnedAgg = await Referral.aggregate([
    { $match: { referrer: me._id } },
    { $group: { _id: null, total: { $sum: "$rewardReferrer" } } },
  ]);
  const totalEarned = totalEarnedAgg[0]?.total || 0;
  res.json({ coins: me.coins || 0, totalReferred, totalEarned });
});

router.post("/withdraw", requireAuth, async (req, res) => {
  const { amount, method, details } = req.body as {
    amount: number;
    method?: string;
    details?: string;
  };
  const me = await User.findById((req as any).user.id);
  if (!me) return res.status(404).json({ message: "Not found" });
  const amt = Math.floor(Number(amount || 0));
  if (!amt || amt <= 0)
    return res.status(400).json({ message: "Invalid amount" });
  if ((me.coins || 0) < amt)
    return res.status(400).json({ message: "Insufficient coins" });
  me.coins = (me.coins || 0) - amt;
  await me.save();
  const payout = await Payout.create({
    user: me._id,
    amount: amt,
    method,
    details,
    status: "pending",
  });
  res.json({ ok: true, payout, coins: me.coins });
});

router.post("/request-custom", requireAuth, async (req, res) => {
  const { desiredCode } = req.body as { desiredCode: string };
  const me = await User.findById((req as any).user.id);
  if (!me) return res.status(404).json({ message: "Not found" });
  const code = (desiredCode || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{4,12}$/.test(code))
    return res.status(400).json({ message: "Invalid code format" });
  const exists = await User.findOne({ referralCode: code });
  if (exists) return res.status(409).json({ message: "Code already taken" });
  me.requestedCode = code;
  me.requestedCodeStatus = "pending" as any;
  await me.save();
  res.json({
    ok: true,
    requestedCode: me.requestedCode,
    status: me.requestedCodeStatus,
  });
});

router.post(
  "/approve-custom/:userId",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { userId } = req.params as { userId: string };
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Not found" });
    const desired = (user.requestedCode || "").toUpperCase();
    if (!desired) return res.status(400).json({ message: "No requested code" });
    const exists = await User.findOne({ referralCode: desired });
    if (exists) return res.status(409).json({ message: "Code already taken" });
    user.referralCode = desired;
    user.requestedCodeStatus = "approved" as any;
    await user.save();
    res.json({
      ok: true,
      user: {
        id: user.id,
        referralCode: user.referralCode,
        status: user.requestedCodeStatus,
      },
    });
  },
);

router.post(
  "/decline-custom/:userId",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { userId } = req.params as { userId: string };
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Not found" });
    user.requestedCodeStatus = "rejected" as any;
    await user.save();
    res.json({ ok: true });
  },
);

router.get(
  "/admin/list",
  requireAuth,
  requireRole("admin"),
  async (_req, res) => {
    const list = await Referral.find({})
      .sort({ createdAt: -1 })
      .populate("referrer", "name email referralCode")
      .populate("referred", "name email")
      .lean();
    res.json({ referrals: list });
  },
);

router.get(
  "/admin/overview",
  requireAuth,
  requireRole("admin"),
  async (_req, res) => {
    const agg = await Referral.aggregate([
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const users = await User.find({ _id: { $in: agg.map((a: any) => a._id) } })
      .select("name email referralCode")
      .lean();
    const out = agg.map((a: any) => {
      const u = users.find((x) => String(x._id) === String(a._id));
      return { referrer: u, count: a.count };
    });
    res.json({ overview: out });
  },
);

export default router;
