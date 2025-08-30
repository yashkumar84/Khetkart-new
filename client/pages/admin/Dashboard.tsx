import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container grid gap-4 py-8 md:grid-cols-3">
          <Card>
            <CardHeader>Users</CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold" id="users-count">—</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>Orders</CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold" id="orders-count">—</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>Revenue</CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold" id="revenue">₹—</div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
