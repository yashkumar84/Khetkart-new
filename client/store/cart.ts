import { create } from "zustand";
import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  total: () => number;
}

function load() {
  if (typeof window === "undefined") return [] as CartItem[];
  try {
    return JSON.parse(localStorage.getItem("kk_cart") || "[]");
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  if (typeof window !== "undefined")
    localStorage.setItem("kk_cart", JSON.stringify(items));
}

export const useCart = create<CartState>((set, get) => ({
  items: load(),
  add(p, qty = 1) {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.product._id === p._id);
    if (idx >= 0)
      items[idx] = { product: p, quantity: items[idx].quantity + qty };
    else items.push({ product: p, quantity: qty });
    save(items);
    set({ items });
  },
  remove(id) {
    const items = get().items.filter((i) => i.product._id !== id);
    save(items);
    set({ items });
  },
  inc(id) {
    const items = get().items.map((i) =>
      i.product._id === id ? { ...i, quantity: i.quantity + 1 } : i,
    );
    save(items);
    set({ items });
  },
  dec(id) {
    const items = get().items.map((i) =>
      i.product._id === id
        ? { ...i, quantity: Math.max(1, i.quantity - 1) }
        : i,
    );
    save(items);
    set({ items });
  },
  clear() {
    save([]);
    set({ items: [] });
  },
  total() {
    return get().items.reduce(
      (s, i) => s + (i.product.discountPrice ?? i.product.price) * i.quantity,
      0,
    );
  },
}));
