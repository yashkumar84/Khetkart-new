import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import HomeHero from "@/components/HomeHero";
import USPStrip from "@/components/USPStrip";
import CategoryTiles from "@/components/CategoryTiles";
import { useEffect, useMemo, useState } from "react";
import { useProducts } from "@/store/products";
import { useT } from "@/i18n";
import { useCart } from "@/store/cart";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Index() {
  const { products, fetch, query } = useProducts() as any;
  const t = useT();
  const { items } = useCart();
  const [cat, setCat] = useState("");
  const [inStock, setInStock] = useState(true);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    fetch({});
  }, [fetch]);

  useEffect(() => {
    fetch({
      category: (cat as any) || "",
      inStock,
      discountOnly,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }, [cat, inStock, discountOnly, minPrice, maxPrice]);

  const emptySearch =
    Array.isArray(products) &&
    products.length === 0 &&
    (query?.length ?? 0) > 0;

  const recommended = useMemo(() => {
    const cats = new Set(items.map((i) => i.product.category));
    if (cats.size === 0) return [] as typeof products;
    return products.filter((p: any) => cats.has(p.category)).slice(0, 8);
  }, [items, products]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8 space-y-10">
        <HomeHero />
        <USPStrip />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t("shop_by_category")}</h2>
          <CategoryBar />
          <CategoryTiles />
        </section>

        <section className="space-y-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <Label>Category</Label>
              <Select value={cat} onValueChange={(v) => setCat(v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Milk">Milk</SelectItem>
                  <SelectItem value="Crops">Crops</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Min Price</Label>
              <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div>
              <Label>Max Price</Label>
              <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={inStock} onCheckedChange={setInStock} />
              <Label>In stock</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={discountOnly} onCheckedChange={setDiscountOnly} />
              <Label>Discounts</Label>
            </div>
          </div>

          <h2 className="text-xl font-semibold">{t("top_deals")}</h2>
          {emptySearch ? (
            <div className="rounded border p-6 text-center text-muted-foreground">
              No products found.
            </div>
          ) : products.length === 0 ? (
            <div className="rounded border p-6 text-center">
              <div className="mb-2 font-semibold">
                {t("empty_products_title")}
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {t("empty_products_sub")}
              </p>
              <button
                className="inline-flex items-center rounded bg-primary px-4 py-2 text-primary-foreground"
                onClick={async () => {
                  await fetch("/api/seed/full", { method: "POST" });
                  fetch({});
                }}
              >
                {t("seed_demo")}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map((p: any) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </section>

        {recommended.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Recommended for you</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recommended.map((p: any) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
