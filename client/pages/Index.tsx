import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import { useEffect } from "react";
import { useProducts } from "@/store/products";

export default function Index() {
  const { products, fetch } = useProducts();

  useEffect(() => { fetch({}); }, [fetch]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8 space-y-10">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/40 p-8">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Fresh from Farm to Your Door</h1>
              <p className="mt-3 text-muted-foreground">Vegetables • Fruits • Milk • Crops • Delivered in minutes</p>
            </div>
            <div className="aspect-[16/9] rounded-xl bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Shop by Category</h2>
          <CategoryBar />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Top Deals</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border p-6 text-center">
          <div className="text-lg font-semibold">Natural • Fresh • Local</div>
          <p className="text-muted-foreground">Sourced directly from farms, no middlemen.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
