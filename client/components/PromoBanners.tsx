import { Badge } from "@/components/ui/badge";
import { ShoppingBag, BadgePercent } from "lucide-react";
import { Link } from "react-router-dom";

export default function PromoBanners() {
  const banners = [
    {
      title: "Weekend Mega Sale",
      sub: "Up to 30% off on seasonal fruits",
      cta: "Shop Fruits",
      to: "/shop?category=Fruits",
      icon: BadgePercent,
      img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Daily Essentials",
      sub: "Fresh milk and dairy delivered early",
      cta: "Shop Dairy",
      to: "/shop?category=Milk",
      icon: ShoppingBag,
      img: "https://images.unsplash.com/photo-1563630423918-b58f07335a4f?q=80&w=1600&auto=format&fit=crop",
    },
  ];
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {banners.map((b, i) => (
        <Link
          key={i}
          to={b.to}
          className="group overflow-hidden rounded-2xl border bg-card shadow-sm"
        >
          <div className="relative">
            {/* eslint-disable-next-line */}
            <img
              src={b.img}
              alt={b.title}
              className="h-56 w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <Badge
                variant="secondary"
                className="mb-2 bg-white/90 text-black"
              >
                {b.cta}
              </Badge>
              <div className="text-xl font-semibold">{b.title}</div>
              <div className="text-sm opacity-90">{b.sub}</div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
