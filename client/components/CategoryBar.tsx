import { Button } from "@/components/ui/button";
import { useProducts, type Category } from "@/store/products";
import { useT } from "@/i18n";

const cats: Category[] = ["Vegetables", "Fruits", "Milk", "Crops", "Others"];

export default function CategoryBar() {
  const { fetch, category } = useProducts();
  const t = useT();
  return (
    <div className="flex flex-wrap gap-2">
      {cats.map((c) => (
        <Button key={c} variant={category === c ? "default" : "secondary"} onClick={() => fetch({ category: c })}>{t(`cat_${c}`)}</Button>
      ))}
      <Button variant={!category ? "default" : "secondary"} onClick={() => fetch({ category: "" as any })}>{t("all")}</Button>
    </div>
  );
}
