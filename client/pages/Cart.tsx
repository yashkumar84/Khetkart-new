import Navbar from "@/components/Navbar";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useT } from "@/i18n";

export default function Cart() {
  const { items, remove, clear, total, inc, dec } = useCart();
  const nav = useNavigate();
  const amount = total();
  const tr = useT();
  return (
    <div>
      <Navbar />
      <main className="container py-8">
        <h1 className="mb-4 text-2xl font-bold">{tr("cart")}</h1>
        {items.length === 0 ? (
          <div className="text-muted-foreground">{tr("cart_empty")} <Link className="underline" to="/">{tr("shop_now")}</Link></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.product._id} className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line */}
                    <img src={it.product.images?.[0] || "/placeholder.svg"} className="h-16 w-16 rounded object-cover" />
                    <div>
                      <div className="font-semibold">{it.product.title}</div>
                      <div className="text-sm text-muted-foreground">Qty: {it.quantity}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded border">
                      <button className="px-2 py-1" onClick={() => dec(it.product._id)}>-</button>
                      <div className="px-3">{it.quantity}</div>
                      <button className="px-2 py-1" onClick={() => inc(it.product._id)}>+</button>
                    </div>
                    <div className="font-bold">₹{(it.product.discountPrice ?? it.product.price) * it.quantity}</div>
                    <Button variant="ghost" onClick={() => remove(it.product._id)}>Remove</Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" onClick={clear}>Clear</Button>
            </div>
            <div className="rounded border p-4">
              <div className="flex justify-between"><span>{tr("subtotal")}</span><span>₹{amount}</span></div>
              <div className="mt-1 text-sm text-muted-foreground">{tr("delivery_calc")}</div>
              <Button className="mt-4 w-full" onClick={() => nav("/checkout")}>{tr("checkout")}</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
