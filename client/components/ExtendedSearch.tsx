import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExtendedSearch() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const navigate = useNavigate();
  function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat) params.set("category", cat);
    navigate(params.toString() ? `/shop?${params.toString()}` : "/shop");
  }
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search fresh produce (e.g. tomatoes, milk, apples)"
          className="h-12 rounded-full text-base"
        />
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="h-12 rounded-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Milk">Milk</SelectItem>
            <SelectItem value="Crops">Crops</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="h-12 rounded-full">Search</Button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        Popular:
        {["Vegetables","Fruits","Milk"].map((t) => (
          <button
            key={t}
            onClick={() => { setCat(t); navigate(`/shop?category=${encodeURIComponent(t)}`); }}
            className="rounded-full border px-3 py-1 hover:bg-accent"
            type="button"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
