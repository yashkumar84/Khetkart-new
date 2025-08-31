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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  isPublished: boolean;
  category: string;
  images?: string[];
  publishRequested?: boolean;
  isDeclined?: boolean;
  createdBy?: { name: string; email: string; role: string };
}

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("10");
  const [unit, setUnit] = useState("kg");
  async function load() {
    const res = await api<{ products: Product[] }>("/products?sort=created_desc", { auth: true });
    setRows(res.products);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container py-8">
          <h1 className="mb-4 text-2xl font-bold">Products</h1>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Create Product</h2>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-6">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Input
                placeholder="Discount Price"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Milk">Milk</SelectItem>
                  <SelectItem value="Crops">Crops</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Image URL (or leave empty to upload)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                id="file"
                onChange={() => {}}
              />
              <Input
                placeholder="Unit (e.g., kg, pcs, L)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              <Input
                placeholder="Stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <div className="md:col-span-6">
                <Button
                  onClick={async () => {
                    try {
                      let img = image.trim();
                      const fileInput = document.getElementById(
                        "file",
                      ) as HTMLInputElement | null;
                      const f = fileInput?.files?.[0] || null;
                      if (f) {
                        const fd = new FormData();
                        fd.append("file", f);
                        const res = await fetch("/api/upload/image", {
                          method: "POST",
                          body: fd,
                          headers: {
                            Authorization:
                              `Bearer ${localStorage.getItem("kk_token")}` ||
                              "",
                          },
                        });
                        if (!res.ok) throw new Error(await res.text());
                        const data = await res.json();
                        img = data.url;
                      }
                      await api("/products", {
                        method: "POST",
                        auth: true,
                        body: JSON.stringify({
                          title,
                          price: Number(price),
                          discountPrice: discount
                            ? Number(discount)
                            : undefined,
                          category,
                          images: img ? [img] : [],
                          unit,
                          stock: Number(stock),
                          isPublished: false,
                        }),
                      });
                      toast.success("Product created");
                      setTitle("");
                      setPrice("");
                      setDiscount("");
                      (
                        document.getElementById(
                          "file",
                        ) as HTMLInputElement | null
                      )?.value &&
                        ((
                          document.getElementById("file") as HTMLInputElement
                        ).value = "");
                      setImage("");
                      setStock("10");
                      setCategory("Vegetables");
                      load();
                    } catch (e: any) {
                      toast.error(e?.message || "Failed to create product");
                    }
                  }}
                >
                  Create Product
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="unpublished">Unpublished</TabsTrigger>
              <TabsTrigger value="pending">Publish Requests</TabsTrigger>
              <TabsTrigger value="declined">Declined</TabsTrigger>
            </TabsList>
            {([
              ["all", rows],
              ["published", rows.filter(p => p.isPublished)],
              ["unpublished", rows.filter(p => !p.isPublished && !p.isDeclined)],
              ["pending", rows.filter(p => p.publishRequested)],
              ["declined", rows.filter(p => p.isDeclined)],
            ] as const).map(([key, list]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Sold</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.images && p.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.images[0]} alt={p.title} className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted" />
                            )}
                            <div>{p.title}</div>
                          </div>
                        </TableCell>
                        <TableCell>₹{p.discountPrice ?? p.price}</TableCell>
                        <TableCell>{(p as any).unit || ""}</TableCell>
                        <TableCell>{(p as any).soldUnits ?? 0}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>
                          <div>{p.createdBy?.name || "-"}</div>
                          <div className="text-xs text-muted-foreground">{p.createdBy?.email || ""}</div>
                        </TableCell>
                        <TableCell>
                          {p.isDeclined ? "Declined" : p.isPublished ? "Published" : p.publishRequested ? "Pending" : "Unpublished"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {p.isPublished ? (
                            <Button size="sm" variant="secondary" onClick={async () => { await api(`/products/${p._id}/unpublish`, { method: "POST", auth: true }); load(); }}>Unpublish</Button>
                          ) : (
                            <Button size="sm" onClick={async () => { await api(`/products/${p._id}/publish`, { method: "POST", auth: true }); load(); }}>Publish</Button>
                          )}
                          {!p.isPublished && (
                            <Button size="sm" variant="outline" onClick={async () => { await api(`/products/${p._id}/decline`, { method: "POST", auth: true }); load(); }}>Decline</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
