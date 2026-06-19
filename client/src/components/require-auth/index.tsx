import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

export function RequireAuth() {
  const { authenticated } = useAuth();
  const location = useLocation();

  if (!authenticated) {
    // Guarda a rota que o usuario tentou acessar para voltar apos o login.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se estiver logado, libera a pagina filha da rota protegida.
  return <Outlet />;
}
