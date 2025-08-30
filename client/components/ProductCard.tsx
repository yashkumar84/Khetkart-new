import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Product } from "@/store/products";
import { useCart } from "@/store/cart";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const [wish, setWish] = useState(false);
  const off = p.discountPrice
    ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
    : 0;
  return (
    <Card className="group overflow-hidden">
      <CardHeader className="p-0">
        <Link to={`/product/${p._id}`}>
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.images?.[0] || "/placeholder.svg"}
              alt={p.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="space-y-1 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold line-clamp-1">{p.title}</h3>
          <div className="flex items-center gap-2">
            {off > 0 && <Badge variant="secondary">{off}% OFF</Badge>}
            <button
              aria-label="wishlist"
              onClick={() => setWish(!wish)}
              className={`rounded p-1 ${wish ? "text-primary" : "text-muted-foreground"}`}
            >
              <Heart
                className="h-4 w-4"
                fill={wish ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-bold">₹{p.discountPrice ?? p.price}</div>
          {p.discountPrice && (
            <div className="text-sm text-muted-foreground line-through">
              ₹{p.price}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full" onClick={() => add(p, 1)}>
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
