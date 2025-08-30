import { create } from "zustand";
import { api } from "@/lib/api";

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
    set({ user: res.user, token: res.token, loading: false });
  },
  async register(name, email, password) {
    set({ loading: true });
    const res = await api<{ token: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("kk_token", res.token);
    set({ user: res.user, token: res.token, loading: false });
  },
  logout() {
    localStorage.removeItem("kk_token");
    set({ user: null, token: null });
  },
  setUser(u, t) {
    if (t) localStorage.setItem("kk_token", t);
    set({ user: u, token: t ?? null });
  },
}));
