import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { useProducts } from "@/store/products";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, ShoppingCart, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useT } from "@/i18n";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleDark, lang, setLang } = useUI();
  const navigate = useNavigate();
  const { fetch } = useProducts();
  const { items } = useCart();
  const t = useT();
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 400);

  useEffect(() => {
    if (dq.trim().length === 0) return; // avoid empty
    fetch({ q: dq });
    navigate("/");
  }, [dq]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="bg-gradient-to-r from-primary/10 via-accent/20 to-secondary/40 py-2 text-center text-xs text-foreground/80">
        {t("banner")}
      </div>
      <div className="container flex h-16 items-center gap-3">
        <Link to="/" className="font-extrabold text-xl text-primary">
          {t("app_name")}
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm ml-6">
          <Link to="/" className="hover:text-primary">
            {t("nav_home")}
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-primary">
              {t("nav_admin")}
            </Link>
          )}
          {user?.role === "farmer" && (
            <Link to="/farmer" className="hover:text-primary">
              {t("nav_farmer")}
            </Link>
          )}
          {user?.role === "delivery" && (
            <Link to="/delivery" className="hover:text-primary">
              {t("nav_delivery")}
            </Link>
          )}
        </nav>
        <div className="ml-auto flex max-w-xl flex-1 items-center gap-2">
          <Input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_placeholder")}
            className="rounded-full"
          />
          <Select value={lang} onValueChange={(v) => setLang(v as any)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("english")}</SelectItem>
              <SelectItem value="hi">{t("hindi")}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            aria-label="toggle theme"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button type="button" variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </Link>
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="secondary" asChild>
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin"
                      : user.role === "farmer"
                        ? "/farmer"
                        : user.role === "delivery"
                          ? "/delivery"
                          : "/orders"
                  }
                >
                  <User className="mr-2 h-4 w-4" /> {user.name.split(" ")[0]}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/profile">Profile</Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  toast.success("Logged out");
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/login">{t("login")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
