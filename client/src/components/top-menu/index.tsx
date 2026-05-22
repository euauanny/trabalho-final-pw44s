import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { useCart } from "@/context/hooks/use-cart";

const TopMenu = () => {
  const navigate = useNavigate();
  const { authenticated, authenticatedUser, handleLogout } = useAuth();
  const { totalItems } = useCart();

  const items: MenuItem[] = [
    { label: "Produtos", icon: "pi pi-shopping-bag", command: () => navigate("/") },
    { label: "Carrinho", icon: "pi pi-shopping-cart", command: () => navigate("/cart") },
    ...(authenticated
      ? [{ label: "Pedidos", icon: "pi pi-list-check", command: () => navigate("/orders") }]
      : []),
  ];

  const start = (
    <button className="brand-button" type="button" onClick={() => navigate("/")}>
      <span className="brand-mark">B</span>
      <span className="brand-name">Beauty Store</span>
    </button>
  );

  const end = (
    <div className="top-menu-actions">
      <Button
        icon="pi pi-shopping-cart"
        className="p-button-text"
        onClick={() => navigate("/cart")}
        tooltip="Carrinho"
      />
      {totalItems > 0 && <Badge value={totalItems} severity="danger" />}

      {authenticated ? (
        <>
          <span className="user-name">{authenticatedUser?.displayName}</span>
          <Button
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={() => {
              handleLogout();
              navigate("/");
            }}
            tooltip="Sair"
          />
        </>
      ) : (
        <Button
          label="Entrar"
          icon="pi pi-sign-in"
          className="p-button-sm"
          onClick={() => navigate("/login")}
        />
      )}
    </div>
  );

  return <Menubar className="app-menubar" model={items} start={start} end={end} />;
};

export default TopMenu;
