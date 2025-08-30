import { create } from "zustand";
import { api } from "@/lib/api";
import type { Product } from "./products";

export interface OrderItem { productId: string; title: string; price: number; quantity: number }
export interface Order {
  _id: string;
  items: OrderItem[];
  finalTotal: number;
  status: "Placed" | "Confirmed" | "Out for delivery" | "Delivered" | "Cancelled";
  address: string;
  createdAt: string;
}

interface State {
  orders: Order[];
  place: (items: Array<{ productId: string; quantity: number }>, address: string, couponCode?: string) => Promise<Order>;
  mine: () => Promise<void>;
}

export const useOrders = create<State>((set) => ({
  orders: [],
  async place(items, address, couponCode) {
    const res = await api<{ order: Order }>("/orders", { method: "POST", auth: true, body: JSON.stringify({ items, address, couponCode }) });
    set((s) => ({ orders: [res.order, ...s.orders] }));
    return res.order;
  },
  async mine() {
    const res = await api<{ orders: Order[] }>("/orders/mine", { auth: true });
    set({ orders: res.orders });
  },
}));
