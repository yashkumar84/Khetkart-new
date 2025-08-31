import { create } from "zustand";
import { api } from "@/lib/api";
import { useCart } from "./cart";

type Role = "user" | "admin" | "farmer" | "delivery";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (u: AuthUser | null, t?: string | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("kk_token") : null,
  loading: false,
  async login(email, password) {
    set({ loading: true });
    const res = await api<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("kk_token", res.token);
    // personalize cart to this user
    useCart.getState().setOwner(res.user.id);
    set({ user: res.user, token: res.token, loading: false });
  },
  async register(name, email, password) {
    set({ loading: true });
    const res = await api<{ token: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("kk_token", res.token);
    // personalize cart to this user
    useCart.getState().setOwner(res.user.id);
    set({ user: res.user, token: res.token, loading: false });
  },
  logout() {
    localStorage.removeItem("kk_token");
    // clear and detach cart from any user
    useCart.getState().setOwner(null);
    set({ user: null, token: null });
  },
  setUser(u, t) {
    if (t) localStorage.setItem("kk_token", t);
    // when auth user changes, bind cart to that user (or clear if null)
    useCart.getState().setOwner(u?.id ?? null);
    set({ user: u, token: t ?? null });
  },
}));
