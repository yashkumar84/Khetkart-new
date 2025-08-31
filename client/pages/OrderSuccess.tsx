import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useOrders } from "@/store/orders";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const { id } = useParams();
  const { orders, mine } = useOrders();

  useEffect(() => {
    if (!orders.length) void mine();
  }, [orders.length]);

  const order = useMemo(() => orders.find((o) => o._id === id), [orders, id]);

  return (
    <div>
      <Navbar />
      <main className="container flex min-h-[60vh] flex-col items-center justify-center py-10">
        <div className="w-full max-w-lg rounded-lg border p-6 text-center">
          <div className="mx-auto mb-3 text-green-600">
            <CheckCircle className="mx-auto h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold">Order Placed!</h1>
          <p className="mt-1 text-muted-foreground">
            Your order #{id?.slice(-6)} has been placed successfully.
          </p>
          {order && (
            <div className="mt-4 rounded bg-muted/40 p-3 text-sm">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{order.items.reduce((s, it) => s + it.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid</span>
                <span>₹{order.finalTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span>{order.status}</span>
              </div>
            </div>
          )}
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
