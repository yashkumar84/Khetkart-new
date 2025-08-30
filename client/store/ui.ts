import { create } from "zustand";

type Lang = "en" | "hi";

interface UIState {
  dark: boolean;
  lang: Lang;
  toggleDark: () => void;
  setLang: (l: Lang) => void;
}

function applyDark(dark: boolean) {
  const root = document.documentElement;
  if (dark) root.classList.add("dark");
  else root.classList.remove("dark");
}

export const useUI = create<UIState>((set, get) => ({
  dark: typeof window !== "undefined" ? localStorage.getItem("kk_dark") === "1" : false,
  lang: (typeof window !== "undefined" ? (localStorage.getItem("kk_lang") as Lang) : "en") || "en",
  toggleDark() {
    const next = !get().dark;
    if (typeof window !== "undefined") localStorage.setItem("kk_dark", next ? "1" : "0");
    applyDark(next);
    set({ dark: next });
  },
  setLang(l) {
    if (typeof window !== "undefined") localStorage.setItem("kk_lang", l);
    set({ lang: l });
  },
}));

// apply on load
if (typeof window !== "undefined") {
  const dark = localStorage.getItem("kk_dark") === "1";
  applyDark(dark);
}
