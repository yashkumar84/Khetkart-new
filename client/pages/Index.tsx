import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import HomeHero from "@/components/HomeHero";
import USPStrip from "@/components/USPStrip";
import CategoryTiles from "@/components/CategoryTiles";
import { useEffect } from "react";
import { useProducts } from "@/store/products";
import { useT } from "@/i18n";

export default function Index() {
  const { products, fetch, query } = useProducts() as any;
  const t = useT();

  useEffect(() => { fetch({}); }, [fetch]);

  const emptySearch = Array.isArray(products) && products.length === 0 && (query?.length ?? 0) > 0;

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
          <h2 className="text-xl font-semibold">{t("top_deals")}</h2>
          {emptySearch ? (
            <div className="rounded border p-6 text-center text-muted-foreground">No products found.</div>
          ) : products.length === 0 ? (
            <div className="rounded border p-6 text-center">
              <div className="mb-2 font-semibold">{t("empty_products_title")}</div>
              <p className="mb-4 text-sm text-muted-foreground">{t("empty_products_sub")}</p>
              <button
                className="inline-flex items-center rounded bg-primary px-4 py-2 text-primary-foreground"
                onClick={async () => { await fetch('/api/seed/full', { method: 'POST' }); fetch({}); }}
              >
                {t("seed_demo")}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
