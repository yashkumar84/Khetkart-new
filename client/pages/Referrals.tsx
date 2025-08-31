import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { useEffect, useMemo, useState } from "react";
import { api, isApiAvailable } from "@/lib/api";
import { toast } from "sonner";

interface ReferralEntry {
  _id: string;
  code: string;
  rewardReferrer: number;
  rewardReferred: number;
  createdAt: string;
  referred?: { name: string; email: string };
}

export default function Referrals() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>("");
  const [applyCode, setApplyCode] = useState("");
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [coins, setCoins] = useState<number>(user?.coins || 0);
  const [stats, setStats] = useState<{ totalReferred: number; totalEarned: number } | null>(null);
  const [wAmount, setWAmount] = useState<string>("");
  const [wMethod, setWMethod] = useState<string>("");
  const [wDetails, setWDetails] = useState<string>("");

  const shareLink = useMemo(() => {
    if (!code) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/register?ref=${code}`;
  }, [code]);

  async function loadAll() {
    setLoading(true);
    try {
      const ok = await isApiAvailable();
      if (!ok) throw new Error("API unavailable");
      const [codeRes, histRes, statRes] = await Promise.all([
        api<{ code: string }>("/referrals/code", { auth: true }),
        api<{ referrals: ReferralEntry[] }>("/referrals/history", { auth: true }),
        api<{ coins: number; totalReferred: number; totalEarned: number }>("/referrals/stats", { auth: true }),
      ]);
      setCode(codeRes.code);
      setReferrals(histRes.referrals || []);
      setCoins(statRes.coins || 0);
      setStats({ totalReferred: statRes.totalReferred || 0, totalEarned: statRes.totalEarned || 0 });
      // sync auth store coins
      if (user) setUser({ ...user, coins: statRes.coins } as any);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApply() {
    const c = applyCode.trim().toUpperCase();
    if (!c) return;
    try {
      const res = await api<{ coins: number }>("/referrals/apply", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ code: c }),
      });
      toast.success("Referral applied successfully");
      setApplyCode("");
      setCoins(res.coins || 0);
      if (user) setUser({ ...user, coins: res.coins } as any);
      loadAll();
    } catch (e: any) {
      toast.error(e?.message || "Failed to apply code");
    }
  }

  async function handleWithdraw() {
    const amt = Math.floor(Number(wAmount || 0));
    if (!amt || amt <= 0) return;
    try {
      const res = await api<{ coins: number }>("/referrals/withdraw", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ amount: amt, method: wMethod, details: wDetails }),
      });
      toast.success("Withdrawal requested");
      setWAmount("");
      setWMethod("");
      setWDetails("");
      setCoins(res.coins || 0);
      if (user) setUser({ ...user, coins: res.coins } as any);
    } catch (e: any) {
      toast.error(e?.message || "Failed to request withdrawal");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8 space-y-6">
        <h1 className="text-2xl font-bold">Refer & Earn</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your referral code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input value={code} readOnly className="uppercase tracking-widest" />
                <Button onClick={() => { navigator.clipboard.writeText(code); toast.success("Code copied"); }}>Copy</Button>
              </div>
              <Label className="text-sm">Share link</Label>
              <div className="flex items-center gap-2">
                <Input value={shareLink} readOnly />
                <Button onClick={() => { navigator.clipboard.writeText(shareLink); toast.success("Link copied"); }}>Copy</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apply a referral code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input placeholder="Enter code" value={applyCode} onChange={(e) => setApplyCode(e.target.value)} className="uppercase" />
                <Button onClick={handleApply}>Apply</Button>
              </div>
              <div className="text-sm text-muted-foreground">You can't apply your own code and can only apply once.</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold">{coins} coins</div>
              <div className="text-sm text-muted-foreground">Total referred: {stats?.totalReferred ?? 0} · Total earned: {stats?.totalEarned ?? 0} coins</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Withdraw coins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label className="text-sm">Amount</Label>
              <Input type="number" min={1} value={wAmount} onChange={(e) => setWAmount(e.target.value)} />
              <Label className="text-sm">Method (UPI/Bank)</Label>
              <Input placeholder="e.g. UPI id or bank details" value={wMethod} onChange={(e) => setWMethod(e.target.value)} />
              <Label className="text-sm">Details</Label>
              <Input placeholder="Account details" value={wDetails} onChange={(e) => setWDetails(e.target.value)} />
              <Button disabled={!wAmount} onClick={handleWithdraw}>Request withdrawal</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Referral history</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-24 animate-pulse rounded bg-muted/30" />
            ) : referrals.length === 0 ? (
              <div className="text-sm text-muted-foreground">No referrals yet. Share your code to start earning.</div>
            ) : (
              <div className="divide-y">
                {referrals.map((r) => (
                  <div key={r._id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <div className="font-medium">{r.referred?.name || r.referred?.email || "New user"}</div>
                      <div className="text-muted-foreground">Code: {r.code} · You earned {r.rewardReferrer} coins</div>
                    </div>
                    <div className="text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
