import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sun, Moon, ShoppingCart, User, Menu, LogOut, LayoutDashboard, Package, BadgeIndianRupee, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useT } from "@/i18n";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleDark, lang, setLang } = useUI();
  const navigate = useNavigate();
  const { items } = useCart();
  const t = useT();
  const [q, setQ] = useState("");

  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const query = q.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="bg-gradient-to-r from-primary/10 via-accent/20 to-secondary/40 py-2 text-center text-xs text-foreground/80">
        {t("banner")}
      </div>
      <div className="container flex h-16 items-center gap-3">
        {/* Left: brand + desktop nav */}
        <div className="flex items-center gap-3">
          <Link to="/" className="font-extrabold text-xl text-primary">
            {t("app_name")}
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-sm ml-4">
            <Link to="/shop" className="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground">Shop</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  More <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/referrals">Referrals</Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">{t("nav_admin")}</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === "farmer" && (
                  <DropdownMenuItem asChild>
                    <Link to="/farmer">{t("nav_farmer")}</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === "delivery" && (
                  <DropdownMenuItem asChild>
                    <Link to="/delivery">{t("nav_delivery")}</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Center: desktop search */}
        <form onSubmit={submitSearch} className="mx-auto hidden w-full max-w-xl items-center gap-2 md:flex">
          <Input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_placeholder")}
            className="rounded-full"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden md:inline-flex">{lang.toUpperCase()}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang("en" as any)}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("hi" as any)}>Hindi</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" variant="ghost" size="icon" onClick={toggleDark} aria-label="toggle theme">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button type="button" variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  {user?.avatar ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  {typeof user.coins === "number" && (
                    <span className="rounded-full border px-2 py-0.5 text-xs">{user.coins} <BadgeIndianRupee className="ml-1 inline h-3 w-3" /></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to={user.role === "admin" ? "/admin" : user.role === "farmer" ? "/farmer" : user.role === "delivery" ? "/delivery" : "/orders"}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/referrals"><BadgeIndianRupee className="mr-2 h-4 w-4" /> Referrals</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); toast.success("Logged out"); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">{t("login")}</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>{t("app_name")}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <form onSubmit={submitSearch} className="flex items-center gap-2">
                  <Input
                    name="q"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t("search_placeholder")}
                    className="rounded-full"
                  />
                  <Button type="submit" variant="secondary">Go</Button>
                </form>
                <div className="grid gap-2 text-sm">
                  <Link to="/shop" className="rounded px-2 py-2 hover:bg-accent" onClick={() => navigate("/shop")}>Shop</Link>
                  <Link to="/about" className="rounded px-2 py-2 hover:bg-accent">About</Link>
                  <Link to="/contact" className="rounded px-2 py-2 hover:bg-accent">Contact</Link>
                  <Link to="/referrals" className="rounded px-2 py-2 hover:bg-accent">Referrals</Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" className="rounded px-2 py-2 hover:bg-accent">{t("nav_admin")}</Link>
                  )}
                  {user?.role === "farmer" && (
                    <Link to="/farmer" className="rounded px-2 py-2 hover:bg-accent">{t("nav_farmer")}</Link>
                  )}
                  {user?.role === "delivery" && (
                    <Link to="/delivery" className="rounded px-2 py-2 hover:bg-accent">{t("nav_delivery")}</Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setLang("en" as any)} className={lang === "en" ? "border-primary" : ""}>EN</Button>
                  <Button variant="outline" onClick={() => setLang("hi" as any)} className={lang === "hi" ? "border-primary" : ""}>HI</Button>
                  <Button variant="ghost" onClick={toggleDark}>
                    {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
