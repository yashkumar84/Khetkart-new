import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import { useEffect } from "react";
import { useProducts } from "@/store/products";
import { useT } from "@/i18n";

export default function Index() {
  const { products, fetch } = useProducts();
  const t = useT();

  useEffect(() => { fetch({}); }, [fetch]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8 space-y-10">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/40 p-8">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t("hero_title")}</h1>
              <p className="mt-3 text-muted-foreground">{t("hero_sub")}</p>
            </div>
            <div className="aspect-[16/9] rounded-xl bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t("shop_by_category")}</h2>
          <CategoryBar />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t("top_deals")}</h2>
          {products.length === 0 ? (
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

        <section className="rounded-xl border p-6 text-center">
          <div className="text-lg font-semibold">{t("natural_fresh_local")}</div>
          <p className="text-muted-foreground">{t("sourced_direct")}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
