import Navbar from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/store/products";
import { useCart } from "@/store/cart";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { add } = useCart();

  useEffect(() => {
    (async () => {
      const res = await api<{ product: Product }>(`/products/${id}`);
      setProduct(res.product);
    })();
  }, [id]);

  if (!product)
    return (
      <div>
        <Navbar />
        <main className="container py-10">Loading...</main>
      </div>
    );

  const price = product.discountPrice ?? product.price;

  return (
    <div>
      <Navbar />
      <main className="container grid gap-8 py-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded bg-muted">
          {/* eslint-disable-next-line */}
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            className="h-full w-full object-cover"
            alt={product.title}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mt-2 text-muted-foreground">{product.category}</div>
          <div className="mt-4 flex items-baseline gap-2">
            <div className="text-2xl font-extrabold">₹{price}</div>
            {product.discountPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ₹{product.price}
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>
          <div className="mt-6 flex gap-2">
            <Button onClick={() => add(product, 1)}>Add to cart</Button>
          </div>
        </div>
      </main>
      <section className="container py-10">
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            Delivery in 10-30 mins • COD available • Freshly sourced from farms
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
