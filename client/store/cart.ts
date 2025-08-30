import { create } from "zustand";
import { Product } from "./products";

export interface CartItem { product: Product; quantity: number }

interface CartState {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add(p, qty = 1) {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.product._id === p._id);
    if (idx >= 0) items[idx] = { product: p, quantity: items[idx].quantity + qty };
    else items.push({ product: p, quantity: qty });
    set({ items });
  },
  remove(id) {
    set({ items: get().items.filter((i) => i.product._id !== id) });
  },
  clear() { set({ items: [] }); },
  total() { return get().items.reduce((s, i) => s + (i.product.discountPrice ?? i.product.price) * i.quantity, 0); },
}));
