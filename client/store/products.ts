import { create } from "zustand";
import { api, isApiAvailable } from "@/lib/api";

export type Category = "Vegetables" | "Fruits" | "Milk" | "Crops" | "Others";

export interface Product {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  unit?: string;
  soldUnits?: number;
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
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
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
    if (typeof params?.inStock !== "undefined" && params?.inStock)
      q.set("inStock", "true");
    if (typeof params?.minPrice === "number")
      q.set("minPrice", String(params!.minPrice));
    if (typeof params?.maxPrice === "number")
      q.set("maxPrice", String(params!.maxPrice));
    q.set("published", "true");
    try {
      const ok = await isApiAvailable();
      if (!ok) throw new Error("API unavailable");
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
