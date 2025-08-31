import { useAuth } from "@/store/auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  role,
  children,
}: {
  role?: "admin" | "user" | "delivery" | "farmer";
  children: JSX.Element;
}) {
  const { user, token, init } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    async function ensure() {
      if (!user && token && init) {
        await init();
      }
      if (active) setChecked(true);
    }
    ensure();
    return () => {
      active = false;
    };
  }, [user, token, init]);

  if (!checked && token && !user) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
