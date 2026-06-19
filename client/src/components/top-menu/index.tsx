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

  // Itens do menu mudam conforme o login. Carrinho, pedidos e conta so aparecem autenticados.
  const items: MenuItem[] = [
    { label: "Produtos", icon: "pi pi-shopping-bag", command: () => navigate("/") },
    ...(authenticated
      ? [
          { label: "Carrinho", icon: "pi pi-shopping-cart", command: () => navigate("/cart") },
          { label: "Pedidos", icon: "pi pi-list-check", command: () => navigate("/orders") },
          { label: "Minha conta", icon: "pi pi-user", command: () => navigate("/account") },
        ]
      : []),
  ];

  // Marca clicavel que sempre volta para a Home.
  const start = (
    <button className="brand-button" type="button" onClick={() => navigate("/")}>
     <span className="brand-mark">P</span>
      <span className="brand-name">PinkChic</span>
    </button>
  );

  // Lado direito do menu: login quando deslogado; carrinho, usuario e sair quando logado.
  const end = (
    <div className="top-menu-actions">
      {authenticated ? (
        <>
          <Button
            icon="pi pi-shopping-cart"
            className="p-button-text"
            onClick={() => navigate("/cart")}
            tooltip="Carrinho"
          />
          {totalItems > 0 && <Badge value={totalItems} severity="danger" />}
          <Button
            label={authenticatedUser?.displayName || "Minha conta"}
            icon="pi pi-user"
            className="p-button-text account-button"
            onClick={() => navigate("/account")}
          />
          <Button
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={() => {
              // Logout limpa token/usuario e volta para a pagina inicial.
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
