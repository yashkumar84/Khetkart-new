import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface Order {
  _id: string;
  finalTotal: number;
  status: string;
  createdAt: string;
}

export default function DeliveryDashboard() {
  const [rows, setRows] = useState<Order[]>([]);
  async function load() {
    const res = await api<{ orders: Order[] }>("/delivery/assigned", {
      auth: true,
    });
    setRows(res.orders);
  }
  useEffect(() => {
    const token = localStorage.getItem("kk_token");
    if (!token) return;
    load();
  }, []);

  return (
    <ProtectedRoute role="delivery">
      <div>
        <Navbar />
        <main className="container py-8">
          <h1 className="mb-4 text-2xl font-bold">Assigned Orders</h1>
          <div className="space-y-3">
            {rows.map((o) => (
              <div
                key={o._id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <div className="font-semibold">Order #{o._id.slice(-6)}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-bold">₹{o.finalTotal}</div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await api(`/delivery/${o._id}/picked`, {
                        method: "POST",
                        auth: true,
                      });
                      load();
                    }}
                  >
                    Picked Up
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await api(`/delivery/${o._id}/delivered`, {
                        method: "POST",
                        auth: true,
                      });
                      load();
                    }}
                  >
                    Delivered
                  </Button>
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="text-muted-foreground">
                No assigned orders yet.
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
