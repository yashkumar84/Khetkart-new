import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";

interface AdminUser { _id: string; name: string; email: string; role: string; createdAt: string }
interface Product { _id: string; title: string; category: string; isPublished: boolean }
interface OrderItem { title: string; quantity: number }
interface Order { _id: string; createdAt: string; finalTotal: number; status: string; items: OrderItem[] }

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const [u, o, p] = await Promise.all([
        api<{ users: AdminUser[] }>("/users", { auth: true }),
        api<{ orders: Order[] }>("/orders", { auth: true }),
        api<{ products: Product[] }>("/products", { auth: true }),
      ]);
      setUsers(u.users);
      setOrders(o.orders);
      setProducts(p.products);
    })();
  }, []);

  const revenue = useMemo(() => orders.reduce((s, o) => s + (o.finalTotal || 0), 0), [orders]);
  const topProducts = useMemo(() => {
    const map = new Map<string, { title: string; qty: number }>();
    for (const o of orders) for (const it of o.items) {
      const cur = map.get(it.title) || { title: it.title, qty: 0 };
      cur.qty += it.quantity; map.set(it.title, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);
  const ordersByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const d = new Date(o.createdAt).toISOString().slice(0, 10);
      map.set(d, (map.get(d) || 0) + 1);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [orders]);

  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container space-y-8 py-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardHeader>Users</CardHeader><CardContent><div className="text-3xl font-extrabold">{users.length}</div></CardContent></Card>
            <Card><CardHeader>Orders</CardHeader><CardContent><div className="text-3xl font-extrabold">{orders.length}</div></CardContent></Card>
            <Card><CardHeader>Revenue</CardHeader><CardContent><div className="text-3xl font-extrabold">₹{revenue}</div></CardContent></Card>
            <Card><CardHeader>Products</CardHeader><CardContent><div className="text-3xl font-extrabold">{products.length}</div></CardContent></Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>Orders per day</CardHeader>
              <CardContent>
                <div className="h-56 overflow-x-auto">
                  <div className="grid grid-cols-12 items-end gap-2">
                    {ordersByDay.map(([d, count]) => (
                      <div key={d} className="text-center">
                        <div className="mx-auto w-4 rounded bg-primary" style={{ height: `${Math.min(100, count * 12)}px` }} />
                        <div className="mt-1 text-xs text-muted-foreground">{d.slice(5)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>Top products</CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Title</TableHead><TableHead>Qty</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((t) => (
                      <TableRow key={t.title}><TableCell>{t.title}</TableCell><TableCell>{t.qty}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>Recent orders</CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>ID</TableHead><TableHead>Status</TableHead><TableHead>Total</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 8).map((o) => (
                      <TableRow key={o._id}>
                        <TableCell>#{o._id.slice(-6)}</TableCell>
                        <TableCell>{o.status}</TableCell>
                        <TableCell>₹{o.finalTotal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3 text-right text-sm"><Link className="underline" to="/admin/orders">View all</Link></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>Latest users</CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 8).map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3 text-right text-sm"><Link className="underline" to="/admin/users">Manage users</Link></div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
