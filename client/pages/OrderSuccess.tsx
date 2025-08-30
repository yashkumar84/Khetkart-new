import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div>
      <Navbar />
      <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="text-3xl font-extrabold text-primary">Order Placed!</div>
        <div className="text-muted-foreground">Your order #{id?.slice(-6)} has been placed successfully.</div>
        <div className="flex gap-2">
          <Link to="/" className="underline">Continue Shopping</Link>
          <span>•</span>
          <Link to="/orders" className="underline">View Orders</Link>
        </div>
      </main>
    </div>
  );
}
