import { useAuth } from "@/store/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }: { role?: "admin" | "user" | "delivery" | "farmer"; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
