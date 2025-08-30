import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  isPublished: boolean;
}

export default function FarmerDashboard() {
  const [rows, setRows] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Vegetables");

  async function load() {
    const res = await api<{ products: Product[] }>("/farmer/my-products", {
      auth: true,
    });
    setRows(res.products);
  }
  // Only load when role is farmer; prevents unauthorized fetch before redirect
  useEffect(() => {
    const token = localStorage.getItem("kk_token");
    if (!token) return;
    load();
  }, []);

  return (
    <ProtectedRoute role="farmer">
      <div>
        <Navbar />
        <main className="container grid gap-8 py-8 md:grid-cols-3">
          <section className="rounded border p-4 space-y-3">
            <h1 className="text-xl font-bold">Add Product</h1>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <Button
              onClick={async () => {
                await api("/products", {
                  method: "POST",
                  auth: true,
                  body: JSON.stringify({
                    title,
                    price: Number(price),
                    category,
                    images: [],
                    stock: 10,
                    isPublished: false,
                  }),
                });
                setTitle("");
                setPrice("");
                load();
              }}
            >
              Submit for Approval
            </Button>
            <div className="text-xs text-muted-foreground">
              Admin will publish your product.
            </div>
          </section>
          <section className="md:col-span-2">
            <h2 className="mb-3 text-xl font-bold">My Products</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>₹{p.price}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>
                      {p.isPublished ? "Published" : "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
