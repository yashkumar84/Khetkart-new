import { create } from "zustand";
import { api } from "@/lib/api";

export type Category = "Vegetables" | "Fruits" | "Milk" | "Crops" | "Others";

export interface Product {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  category: Category;
  isPublished: boolean;
}

interface State {
  products: Product[];
  loading: boolean;
  query: string;
  category: Category | "";
  fetch: (params?: {
    q?: string;
    category?: Category | "";
    discountOnly?: boolean;
  }) => Promise<void>;
}

export const useProducts = create<State>((set, get) => ({
  products: [],
  loading: false,
  query: "",
  category: "",
  async fetch(params) {
    set({ loading: true });
    const q = new URLSearchParams();
    const state = get();
    const query = params?.q ?? state.query;
    const cat = params?.category ?? state.category;
    if (query) q.set("q", query);
    if (cat) q.set("category", cat);
    if (params?.discountOnly) q.set("discountOnly", "true");
    q.set("published", "true");
    try {
      const res = await api<{ products: Product[] }>(
        `/products?${q.toString()}`,
      );
      set({
        products: res.products,
        loading: false,
        query: query || "",
        category: cat || "",
      });
    } catch (_e) {
      set({
        products: [],
        loading: false,
        query: query || "",
        category: cat || "",
      });
    }
  },
}));
