import { Truck, Leaf, BadgeIndianRupee } from "lucide-react";

export default function USPStrip() {
  const items = [
    { icon: Truck, text: "Fast Delivery" },
    { icon: Leaf, text: "Fresh from Farms" },
    { icon: BadgeIndianRupee, text: "Best Prices Everyday" },
  ];
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {items.map(({ icon: Icon, text }, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
        >
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="font-medium">{text}</div>
        </div>
      ))}
    </section>
  );
}
