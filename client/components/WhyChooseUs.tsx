import {
  Leaf,
  ShieldCheck,
  Truck,
  Users,
  Sprout,
  HandCoins,
} from "lucide-react";

export default function WhyChooseUs() {
  const items = [
    {
      icon: Leaf,
      title: "Fresh & Natural",
      sub: "Sourced daily from local farms",
    },
    {
      icon: ShieldCheck,
      title: "Quality Checked",
      sub: "Multi-step quality inspection",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      sub: "Same-day delivery in your area",
    },
    {
      icon: Users,
      title: "Farmer Empowerment",
      sub: "Fair prices paid to farmers",
    },
    {
      icon: Sprout,
      title: "Sustainable",
      sub: "Eco-conscious packaging and logistics",
    },
    {
      icon: HandCoins,
      title: "Best Value",
      sub: "Transparent pricing with deals",
    },
  ];
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Why choose us</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, sub }, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-muted-foreground">{sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
