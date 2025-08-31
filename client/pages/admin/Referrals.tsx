import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  referralCode?: string | null;
  requestedCode?: string | null;
  requestedCodeStatus?: string | null;
}
interface ReferralRow {
  _id: string;
  code: string;
  createdAt: string;
  referrer?: { name: string; email: string; referralCode?: string };
  referred?: { name: string; email: string };
  rewardReferrer: number;
  rewardReferred: number;
}

export default function AdminReferrals() {
  const [pending, setPending] = useState<UserRow[]>([]);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [overview, setOverview] = useState<
    {
      referrer?: { name: string; email: string; referralCode?: string };
      count: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [usersRes, listRes, ovRes] = await Promise.all([
        api<{
          users: UserRow[];
          total: number;
          page: number;
          pageSize: number;
        }>("/users?page=1&pageSize=200", { auth: true }),
        api<{ referrals: ReferralRow[] }>("/referrals/admin/list", {
          auth: true,
        }),
        api<{
          overview: {
            referrer?: { name: string; email: string; referralCode?: string };
            count: number;
          }[];
        }>("/referrals/admin/overview", { auth: true }),
      ]);
      setPending(
        (usersRes.users || []).filter(
          (u) => u.requestedCodeStatus === "pending",
        ),
      );
      setReferrals(listRes.referrals || []);
      setOverview(ovRes.overview || []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container py-8 space-y-6">
          <h1 className="text-2xl font-bold">Referrals</h1>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-16 animate-pulse rounded bg-muted/30" />
              ) : overview.length === 0 ? (
                <div className="text-sm text-muted-foreground">No data</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referrer</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overview.map((o, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          {o.referrer?.name}{" "}
                          <div className="text-xs text-muted-foreground">
                            {o.referrer?.email}
                          </div>
                        </TableCell>
                        <TableCell>{o.referrer?.referralCode || "-"}</TableCell>
                        <TableCell>{o.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending custom code requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No pending requests
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Requested code</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.requestedCode}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              await api(`/referrals/approve-custom/${u._id}`, {
                                method: "POST",
                                auth: true,
                              });
                              toast.success("Approved");
                              load();
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={async () => {
                              await api(`/referrals/decline-custom/${u._id}`, {
                                method: "POST",
                                auth: true,
                              });
                              toast.success("Declined");
                              load();
                            }}
                          >
                            Decline
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All referral events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center gap-2">
                <Input
                  placeholder="Search by email"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              {loading ? (
                <div className="h-24 animate-pulse rounded bg-muted/30" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Referred</TableHead>
                      <TableHead>Rewards</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals
                      .filter(
                        (r) =>
                          !q ||
                          r.referrer?.email?.includes(q) ||
                          r.referred?.email?.includes(q),
                      )
                      .map((r) => (
                        <TableRow key={r._id}>
                          <TableCell>
                            {new Date(r.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {r.referrer?.name}
                            <div className="text-xs text-muted-foreground">
                              {r.referrer?.email}
                            </div>
                          </TableCell>
                          <TableCell>{r.code}</TableCell>
                          <TableCell>
                            {r.referred?.name}
                            <div className="text-xs text-muted-foreground">
                              {r.referred?.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            {r.rewardReferrer} / {r.rewardReferred}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
