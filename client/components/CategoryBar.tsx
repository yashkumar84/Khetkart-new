import { Button } from "@/components/ui/button";
import type { Category } from "@/store/products";
import { useT } from "@/i18n";
import { useNavigate, useLocation } from "react-router-dom";

const cats: Category[] = ["Vegetables", "Fruits", "Milk", "Crops", "Others"];

export default function CategoryBar() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const active = (params.get("category") as Category | null) || "";
  return (
    <div className="flex flex-wrap gap-2">
      {cats.map((c) => (
        <Button
          key={c}
          variant={active === c ? "default" : "secondary"}
          onClick={() => navigate(`/shop?category=${encodeURIComponent(c)}`)}
        >
          {t(`cat_${c}`)}
        </Button>
      ))}
      <Button
        variant={!active ? "default" : "secondary"}
        onClick={() => navigate("/shop")}
      >
        {t("all")}
      </Button>
    </div>
  );
}
