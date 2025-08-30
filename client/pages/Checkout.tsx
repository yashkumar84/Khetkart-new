import Navbar from "@/components/Navbar";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/i18n";

export default function Checkout() {
  const { items, clear, total } = useCart();
  const { place } = useOrders();
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const nav = useNavigate();
  const t = useT();

  return (
    <div>
      <Navbar />
      <main className="container grid gap-6 py-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold">{t("checkout")}</h1>
          <div className="space-y-2">
            <Label htmlFor="address">{t("delivery_address")}</Label>
            <Input id="address" placeholder="House no, street, city" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon">{t("coupon")}</Label>
            <Input id="coupon" placeholder="SAVE10" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
          </div>
        </div>
        <div className="rounded border p-4">
          <div className="flex justify-between"><span>{t("items")}</span><span>{items.length}</span></div>
          <div className="flex justify-between"><span>{t("total")}</span><span>₹{total()}</span></div>
          <div className="mt-3 space-y-2">
            <Button className="w-full" onClick={async () => {
              if (!address) return;
              const payload = items.map((i) => ({ productId: i.product._id, quantity: i.quantity }));
              const order = await place(payload, address, coupon || undefined);
              clear();
              nav(`/orders#${order._id}`);
            }}>{t("place_order_cod")}</Button>
            <Button className="w-full" variant="secondary" disabled>{t("pay_online_soon")}</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
