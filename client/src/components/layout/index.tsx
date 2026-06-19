import { Outlet } from "react-router-dom";
import TopMenu from "@/components/top-menu";

export function Layout() {
  return (
    <>
      <TopMenu />
      <main className="page-shell">
        {/* Outlet e onde o React Router renderiza a pagina correspondente a rota atual. */}
        <Outlet />
      </main>
    </>
  );
}
