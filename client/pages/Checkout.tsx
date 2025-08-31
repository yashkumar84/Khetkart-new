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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(15)
    .regex(/^\d{10,15}$/, "Phone must be digits"),
  address: z.string().min(6, "Address too short"),
});

type FormData = z.infer<typeof schema>;

export default function Checkout() {
  const { items, clear, total } = useCart();
  const { place } = useOrders();
  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<{
    percent: number;
    amount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const nav = useNavigate();
  const t = useT();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const subtotal = useMemo(() => total(), [items]);
  const discount = couponInfo?.amount ?? 0;
  const final = Math.max(0, subtotal - discount);

  useEffect(() => {
    setCouponInfo(null);
  }, [coupon]);

  async function onSubmit(values: FormData) {
    setError(null);
    if (!items.length) {
      setError("Cart is empty");
      toast.error("Cart is empty");
      return;
    }
    setPlacing(true);
    try {
      const payload = items.map((i) => ({
        productId: i.product._id,
        quantity: i.quantity,
      }));
      const order = await place(
        payload,
        values.address,
        couponInfo ? coupon : undefined,
      );
      clear();
      reset();
      toast.success("Order placed");
      nav(`/order-success/${order._id}`);
    } catch (e: any) {
      setError(e?.message || "Failed to place order");
      toast.error(e?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div>
      <Navbar />
      <main className="container grid gap-6 py-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">{t("checkout")}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {formState.errors.name && (
                <div className="text-xs text-destructive">
                  {formState.errors.name.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="9999999999" {...register("phone")} />
              {formState.errors.phone && (
                <div className="text-xs text-destructive">
                  {formState.errors.phone.message}
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">{t("delivery_address")}</Label>
              <Input
                id="address"
                placeholder="House no, street, city"
                {...register("address")}
              />
              {formState.errors.address && (
                <div className="text-xs text-destructive">
                  {formState.errors.address.message}
                </div>
              )}
            </div>
          </form>

          <div className="space-y-2">
            <Label htmlFor="coupon">{t("coupon")}</Label>
            <div className="flex gap-2">
              <Input
                id="coupon"
                placeholder="SAVE10"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              />
              <Button
                disabled={!coupon || validating}
                onClick={async () => {
                  setValidating(true);
                  setCouponError(null);
                  try {
                    const res = await api<{
                      valid: boolean;
                      discountPercent?: number;
                      discountAmount?: number;
                      message?: string;
                    }>(
                      `/coupons/validate?code=${encodeURIComponent(coupon)}&amount=${subtotal}`,
                    );
                    if (res.valid) {
                      setCouponInfo({
                        percent: res.discountPercent || 0,
                        amount: res.discountAmount || 0,
                      });
                      toast.success("Coupon applied");
                    } else {
                      setCouponInfo(null);
                      const msg = res.message || "Coupon is not valid";
                      setCouponError(msg);
                      toast.error(msg);
                    }
                  } catch (e: any) {
                    setCouponInfo(null);
                    const msg = e?.message || "Coupon is not valid";
                    setCouponError(msg);
                    toast.error(msg);
                  } finally {
                    setValidating(false);
                  }
                }}
              >
                Apply
              </Button>
              {couponInfo && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCouponInfo(null);
                    setCoupon("");
                    toast("Coupon removed");
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
            {couponInfo && (
              <div className="text-sm text-green-600">
                Applied {couponInfo.percent}% off · -₹{couponInfo.amount}
              </div>
            )}
            {couponError && (
              <div className="text-sm text-destructive">{couponError}</div>
            )}
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("items")}</span>
              <span>{items.length}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-₹{discount}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>{t("total")}</span>
              <span>₹{final}</span>
            </div>
          </div>
          {error && (
            <div className="mt-3 rounded bg-destructive/10 p-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="mt-4 space-y-2">
            <Button
              className="w-full"
              type="submit"
              disabled={placing}
              onClick={handleSubmit(onSubmit)}
            >
              {placing ? "Placing..." : t("place_order_cod")}
            </Button>
            <Button className="w-full" variant="secondary" disabled>
              {t("pay_online_soon")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
