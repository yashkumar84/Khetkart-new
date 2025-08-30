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
      <main className="container py-8 space-y-8">
        <section className="rounded-lg bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 p-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Fresh Farm Delivery</h1>
          <p className="mt-2 text-muted-foreground">Vegetables • Fruits • Milk • Crops</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <CategoryBar />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
