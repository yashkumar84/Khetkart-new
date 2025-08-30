import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useOrders } from "@/store/orders";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n";

export default function Orders() {
  const { orders, mine } = useOrders();
  const t = useT();
  useEffect(() => { mine(); }, [mine]);

  return (
    <div>
      <Navbar />
      <main className="container py-8">
        <h1 className="mb-4 text-2xl font-bold">{t("my_orders")}</h1>
        <div className="space-y-3">
          {orders.map((o) => (
            <div id={o._id} key={o._id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order #{o._id.slice(-6)}</div>
                <Badge>{o.status}</Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="mt-2 text-sm">{t("items")}: {o.items.map((i) => `${i.title} x${i.quantity}`).join(", ")}</div>
              <div className="mt-1 font-bold">{t("total")}: ₹{o.finalTotal}</div>
            </div>
          ))}
          {orders.length === 0 && <div className="text-muted-foreground">No orders yet.</div>}
        </div>
      </main>
    </div>
  );
}
