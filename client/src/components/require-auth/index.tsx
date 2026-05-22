import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

export function RequireAuth() {
  const { authenticated } = useAuth();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
