import Navbar from "@/components/Navbar";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/i18n";
import { api } from "@/lib/api";

export default function Checkout() {
  const { items, clear, total } = useCart();
  const { place } = useOrders();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<{ percent: number; amount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const nav = useNavigate();
  const t = useT();

  const subtotal = useMemo(() => total(), [items]);
  const discount = couponInfo?.amount ?? 0;
  const final = Math.max(0, subtotal - discount);

  useEffect(() => { setCouponInfo(null); }, [coupon]);

  return (
    <div>
      <Navbar />
      <main className="container grid gap-6 py-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">{t("checkout")}</h1>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9999999999" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">{t("delivery_address")}</Label>
              <Input id="address" placeholder="House no, street, city" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupon">{t("coupon")}</Label>
            <div className="flex gap-2">
              <Input id="coupon" placeholder="SAVE10" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
              <Button disabled={!coupon || validating} onClick={async () => {
                setValidating(true);
                try {
                  const res = await api<{ valid: boolean; discountPercent: number; discountAmount: number }>(`/coupons/validate?code=${encodeURIComponent(coupon)}&amount=${subtotal}`);
                  if (res.valid) setCouponInfo({ percent: res.discountPercent, amount: res.discountAmount });
                } finally {
                  setValidating(false);
                }
              }}>Apply</Button>
              {couponInfo && <Button variant="secondary" onClick={() => setCouponInfo(null)}>Remove</Button>}
            </div>
            {couponInfo && <div className="text-sm text-green-600">Applied {couponInfo.percent}% off · -₹{couponInfo.amount}</div>}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t("items")}</span><span>{items.length}</span></div>
            <div className="flex justify-between"><span>{t("subtotal")}</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Discount</span><span className="text-green-600">-₹{discount}</span></div>
            <div className="flex justify-between border-t pt-2 font-semibold"><span>{t("total")}</span><span>₹{final}</span></div>
          </div>
          <div className="mt-4 space-y-2">
            <Button className="w-full" onClick={async () => {
              if (!address) return;
              const payload = items.map((i) => ({ productId: i.product._id, quantity: i.quantity }));
              const order = await place(payload, address, couponInfo ? coupon : undefined);
              clear();
              nav(`/order-success/${order._id}`);
            }}>{t("place_order_cod")}</Button>
            <Button className="w-full" variant="secondary" disabled>{t("pay_online_soon")}</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
