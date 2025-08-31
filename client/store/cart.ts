import { create } from "zustand";
import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  ownerId: string | null;
  setOwner: (userId: string | null) => void;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  total: () => number;
}

function keyFor(ownerId: string | null) {
  return ownerId ? `kk_cart_${ownerId}` : null;
}

function load(ownerId: string | null) {
  if (typeof window === "undefined") return [] as CartItem[];
  const key = keyFor(ownerId);
  if (!key) return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function save(items: CartItem[], ownerId: string | null) {
  if (typeof window === "undefined") return;
  const key = keyFor(ownerId);
  if (!key) return; // do not persist carts for guests
  localStorage.setItem(key, JSON.stringify(items));
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  ownerId: null,
  setOwner(userId) {
    const prevOwner = get().ownerId;
    // Persist current items under previous owner (if any)
    if (prevOwner) save(get().items, prevOwner);
    // Switch owner and load that owner's cart
    const nextItems = load(userId);
    set({ ownerId: userId, items: nextItems });
  },
  add(p, qty = 1) {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.product._id === p._id);
    if (idx >= 0)
      items[idx] = { product: p, quantity: items[idx].quantity + qty };
    else items.push({ product: p, quantity: qty });
    save(items, get().ownerId);
    set({ items });
  },
  remove(id) {
    const items = get().items.filter((i) => i.product._id !== id);
    save(items, get().ownerId);
    set({ items });
  },
  inc(id) {
    const items = get().items.map((i) =>
      i.product._id === id ? { ...i, quantity: i.quantity + 1 } : i,
    );
    save(items, get().ownerId);
    set({ items });
  },
  dec(id) {
    const items = get().items.map((i) =>
      i.product._id === id
        ? { ...i, quantity: Math.max(1, i.quantity - 1) }
        : i,
    );
    save(items, get().ownerId);
    set({ items });
  },
  clear() {
    save([], get().ownerId);
    set({ items: [] });
  },
  total() {
    return get().items.reduce(
      (s, i) => s + (i.product.discountPrice ?? i.product.price) * i.quantity,
      0,
    );
  },
}));
