import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt?: string;
}

export default function AdminCoupons() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const [expiresAt, setExpiresAt] = useState<string>("");

  async function load() {
    const res = await api<{ coupons: Coupon[] }>("/coupons", { auth: true });
    setRows(res.coupons);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container py-8">
          <h1 className="mb-4 text-2xl font-bold">Coupons</h1>
          <div className="mb-6 grid gap-3 md:grid-cols-4">
            <Input
              placeholder="CODE"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <Input
              type="number"
              placeholder="%"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
            />
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <Button
              onClick={async () => {
                await api("/coupons", {
                  method: "POST",
                  auth: true,
                  body: JSON.stringify({
                    code,
                    discountPercent: percent,
                    expiresAt,
                  }),
                });
                setCode("");
                setPercent(10);
                setExpiresAt("");
                load();
              }}
            >
              Create
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.code}</TableCell>
                  <TableCell>{c.discountPercent}%</TableCell>
                  <TableCell>
                    {c.expiresAt
                      ? new Date(c.expiresAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>{c.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        await api(`/coupons/${c._id}`, {
                          method: "PUT",
                          auth: true,
                          body: JSON.stringify({ isActive: !c.isActive }),
                        });
                        load();
                      }}
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await api(`/coupons/${c._id}`, {
                          method: "DELETE",
                          auth: true,
                        });
                        load();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>
    </ProtectedRoute>
  );
}
