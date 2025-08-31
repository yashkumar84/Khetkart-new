import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useEffect, useMemo, useState } from "react";
import { api, isApiAvailable } from "@/lib/api";
import type { Product, Category } from "@/store/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Shop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState<Record<Category | "Others", boolean>>({
    Vegetables: false,
    Fruits: false,
    Milk: false,
    Crops: false,
    Others: false,
  } as any);
  const [inStock, setInStock] = useState(true);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState("created_desc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedCategory = useMemo(() => {
    const keys = Object.keys(categories).filter((k) => (categories as any)[k]);
    return keys[0] || ""; // single select for now
  }, [categories]);

  async function load() {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (inStock) params.set("inStock", "true");
    if (discountOnly) params.set("discountOnly", "true");
    if (minPrice) params.set("minPrice", String(Number(minPrice)));
    if (maxPrice) params.set("maxPrice", String(Number(maxPrice)));
    params.set("published", "true");
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    params.set("sort", sort);
    try {
      const ok = await isApiAvailable();
      if (!ok) throw new Error("API unavailable");
      const res = await api<{ products: Product[]; total: number; page: number; pageSize: number }>(
        `/products?${params.toString()}`,
      );
      setProducts(res.products);
      setTotal(res.total || 0);
    } catch (e: any) {
      setError(e?.message || "Failed to load products");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sort]);

  useEffect(() => {
    setPage(1);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, selectedCategory, inStock, discountOnly, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shop</h1>
          <div className="md:hidden">
            <Button variant="secondary" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-12">
          <aside className={`md:col-span-3 space-y-4 ${sidebarOpen ? "" : "hidden md:block"}`}>
            <div className="rounded border p-4 space-y-3">
              <Label>Search</Label>
              <Input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="rounded border p-4 space-y-2">
              <Label>Category</Label>
              {(["Vegetables", "Fruits", "Milk", "Crops", "Others"] as const).map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(categories as any)[c]}
                    onChange={(e) => {
                      const next = { ...categories } as any;
                      // single-select behaviour: clear others when selecting
                      Object.keys(next).forEach((k) => (next[k] = false));
                      next[c] = e.target.checked;
                      setCategories(next);
                      setPage(1);
                    }}
                  />
                  {c}
                </label>
              ))}
            </div>
            <div className="rounded border p-4 space-y-2">
              <Label>Price</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>
            <div className="rounded border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Switch checked={inStock} onCheckedChange={(v) => setInStock(!!v)} />
                <Label>In stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={discountOnly} onCheckedChange={(v) => setDiscountOnly(!!v)} />
                <Label>Discounts</Label>
              </div>
            </div>
            <div className="rounded border p-4 space-y-2">
              <Label>Sort by</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_desc">Newest</SelectItem>
                  <SelectItem value="created_asc">Oldest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </aside>

          <section className="md:col-span-9">
            {error && (
              <div className="mb-3 rounded border border-destructive p-3 text-destructive">{error}</div>
            )}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-56 animate-pulse rounded border bg-muted/30" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded border p-6 text-center text-muted-foreground">No products found.</div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                  {products.map((p) => (
                    <ProductCard key={p._id} p={p} />
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} · {total} items
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                      Prev
                    </Button>
                    {Array.from({ length: totalPages }).slice(0, 7).map((_, idx) => {
                      const n = idx + 1;
                      return (
                        <Button
                          key={n}
                          variant={n === page ? "default" : "outline"}
                          onClick={() => setPage(n)}
                        >
                          {n}
                        </Button>
                      );
                    })}
                    <Button
                      variant="secondary"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                    <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 / page</SelectItem>
                        <SelectItem value="24">24 / page</SelectItem>
                        <SelectItem value="48">48 / page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
