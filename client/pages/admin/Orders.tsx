import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Order { _id: string; finalTotal: number; status: string; createdAt: string }

export default function AdminOrders() {
  const [rows, setRows] = useState<Order[]>([]);
  async function load() { const res = await api<{ orders: Order[] }>("/orders", { auth: true }); setRows(res.orders); }
  useEffect(() => { load(); }, []);

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
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>#{o._id.slice(-6)}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell>₹{o.finalTotal}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="secondary" onClick={async () => { await api(`/orders/${o._id}/status`, { method: "POST", auth: true, body: JSON.stringify({ status: "Confirmed" }) }); load(); }}>Confirm</Button>
                    <Button size="sm" onClick={async () => { await api(`/orders/${o._id}/status`, { method: "POST", auth: true, body: JSON.stringify({ status: "Delivered" }) }); load(); }}>Deliver</Button>
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
