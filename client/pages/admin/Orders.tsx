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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  _id: string;
  total: number;
  discountTotal?: number;
  finalTotal: number;
  couponCode?: string;
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [rows, setRows] = useState<Order[]>([]);
  async function load() {
    const res = await api<{ orders: Order[] }>("/orders", { auth: true });
    setRows(res.orders);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container py-8">
          <h1 className="mb-4 text-2xl font-bold">Orders</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Coupon</TableHead>
                <TableHead>Original</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Final</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>#{o._id.slice(-6)}</TableCell>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell>{o.couponCode || "—"}</TableCell>
                  <TableCell>₹{o.total}</TableCell>
                  <TableCell>-₹{o.discountTotal || 0}</TableCell>
                  <TableCell>₹{o.finalTotal}</TableCell>
                  <TableCell className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={async (v) => {
                          await api(`/orders/${o._id}/status`, {
                            method: "POST",
                            auth: true,
                            body: JSON.stringify({ status: v }),
                          });
                          load();
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Placed">Placed</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Out for delivery">
                            Out for delivery
                          </SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={async () => {
                          await api(`/orders/${o._id}/status`, {
                            method: "POST",
                            auth: true,
                            body: JSON.stringify({ status: "Confirmed" }),
                          });
                          load();
                        }}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        onClick={async () => {
                          await api(`/orders/${o._id}/status`, {
                            method: "POST",
                            auth: true,
                            body: JSON.stringify({ status: "Delivered" }),
                          });
                          load();
                        }}
                      >
                        Deliver
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Delivery user id"
                        className="w-48"
                        id={`assign-${o._id}`}
                      />
                      <Button
                        size="sm"
                        onClick={async () => {
                          const el = document.getElementById(
                            `assign-${o._id}`,
                          ) as HTMLInputElement | null;
                          const id = el?.value?.trim();
                          if (!id) return;
                          await api(`/orders/${o._id}/assign`, {
                            method: "POST",
                            auth: true,
                            body: JSON.stringify({ deliveryUserId: id }),
                          });
                          load();
                        }}
                      >
                        Assign
                      </Button>
                    </div>
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
