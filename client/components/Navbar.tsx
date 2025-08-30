import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { useProducts } from "@/store/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleDark, lang, setLang } = useUI();
  const navigate = useNavigate();
  const { fetch } = useProducts();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center gap-3">
        <Link to="/" className="font-extrabold text-lg">KhetKart</Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q") as string;
            fetch({ q });
            navigate("/");
          }}
          className="ml-auto flex max-w-xl flex-1 items-center gap-2"
        >
          <Input name="q" placeholder={lang === "hi" ? "खोजें" : "Search"} />
          <Select value={lang} onValueChange={(v) => setLang(v as any)}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="ghost" size="icon" onClick={toggleDark} aria-label="toggle theme">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button type="button" variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="cart"><ShoppingCart className="h-5 w-5" /></Link>
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="secondary" asChild><Link to={user.role === "admin" ? "/admin" : "/orders"}><User className="mr-2 h-4 w-4" /> {user.name.split(" ")[0]}</Link></Button>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button asChild><Link to="/login">Login</Link></Button>
          )}
        </form>
      </div>
    </header>
  );
}
