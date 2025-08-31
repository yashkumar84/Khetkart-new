import type { Category } from "@/store/products";
import { useNavigate } from "react-router-dom";

const tiles: { key: Category; img: string }[] = [
  {
    key: "Vegetables",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "Fruits",
    img: "https://images.unsplash.com/photo-1437750769465-301382cdf094?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "Milk",
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "Crops",
    img: "https://images.unsplash.com/photo-1592853625600-6b0a305f2f5a?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function CategoryTiles() {
  const navigate = useNavigate();
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {tiles.map((t) => (
        <button
          key={t.key}
          onClick={() => navigate(`/shop?category=${encodeURIComponent(t.key)}`)}
          className="group overflow-hidden rounded-xl border text-left"
        >
          <div className="aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line */}
            <img
              src={t.img}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              alt={t.key}
            />
          </div>
          <div className="p-3 font-semibold">{t.key}</div>
        </button>
      ))}
    </div>
  );
}
