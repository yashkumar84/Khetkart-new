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
  return ownerId ? `kk_cart_${ownerId}` : "kk_cart_guest";
}

function load(ownerId: string | null) {
  if (typeof window === "undefined") return [] as CartItem[];
  const key = keyFor(ownerId);
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function save(items: CartItem[], ownerId: string | null) {
  if (typeof window === "undefined") return;
  const key = keyFor(ownerId);
  localStorage.setItem(key, JSON.stringify(items));
}

function mergeItems(a: CartItem[], b: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const it of [...a, ...b]) {
    const id = it.product._id;
    const existing = map.get(id);
    if (existing)
      map.set(id, { product: it.product, quantity: existing.quantity + it.quantity });
    else map.set(id, { product: it.product, quantity: it.quantity });
  }
  return Array.from(map.values());
}

export const useCart = create<CartState>((set, get) => ({
  items: load(null),
  ownerId: null,
  setOwner(userId) {
    const prevOwner = get().ownerId;
    const currentItems = get().items;
    // Persist current items under previous owner (guest or user)
    save(currentItems, prevOwner ?? null);
    // Load target owner's items
    const targetItems = load(userId);
    let nextItems = targetItems;
    // If logging in (guest -> user), merge guest items into user cart
    if (!prevOwner && userId) {
      nextItems = mergeItems(targetItems, currentItems);
      save(nextItems, userId);
      // Clear guest cart after merge
      try { localStorage.removeItem(keyFor(null)); } catch {}
    }
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
