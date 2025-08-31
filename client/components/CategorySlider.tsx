import { useEffect, useState } from "react";
import { api, isApiAvailable } from "@/lib/api";
import type { Product, Category } from "@/store/products";
import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CategorySlider({
  title,
  category,
  discountOnly,
}: {
  title: string;
  category?: Category;
  discountOnly?: boolean;
}) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const ok = await isApiAvailable();
      if (!ok) return;
      const q = new URLSearchParams();
      if (category) q.set("category", category);
      if (discountOnly) q.set("discountOnly", "true");
      q.set("inStock", "true");
      q.set("published", "true");
      q.set("page", "1");
      q.set("pageSize", "16");
      try {
        const res = await api<{ products: Product[] }>(`/products?${q.toString()}`);
        setItems(res.products || []);
      } catch {
        setItems([]);
      }
    })();
  }, [category, discountOnly]);

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {items.map((p) => (
              <CarouselItem key={p._id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard p={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
