import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product { _id: string; title: string; price: number; discountPrice?: number; isPublished: boolean; category: string }

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("10");
  async function load() { const res = await api<{ products: Product[] }>("/products", { auth: true }); setRows(res.products); }
  useEffect(() => { load(); }, []);

  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container py-8">
          <h1 className="mb-4 text-2xl font-bold">Products</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>₹{p.discountPrice ?? p.price}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.isPublished ? "Published" : "Unpublished"}</TableCell>
                  <TableCell>
                    {p.isPublished ? (
                      <Button size="sm" variant="secondary" onClick={async () => { await api(`/products/${p._id}/unpublish`, { method: "POST", auth: true }); load(); }}>Unpublish</Button>
                    ) : (
                      <Button size="sm" onClick={async () => { await api(`/products/${p._id}/publish`, { method: "POST", auth: true }); load(); }}>Publish</Button>
                    )}
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
