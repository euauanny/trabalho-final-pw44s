import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const CartPage = () => {
  const { cart, total, updateQuantity, removeProduct, clearCart } = useCart();
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <div className="page-title-row">
        <div>
          <h1>Carrinho</h1>
          <p>Revise os itens antes de finalizar a compra.</p>
        </div>
        {cart.length > 0 && (
          <Button
            label="Limpar"
            icon="pi pi-trash"
            className="p-button-outlined p-button-danger"
            onClick={clearCart}
          />
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          Seu carrinho esta vazio.
          <Button label="Ver produtos" icon="pi pi-shopping-bag" onClick={() => navigate("/")} />
        </div>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.product.id}>
                <img
                  src={item.product.urlImage || "https://placehold.co/300x300/fce7f3/9f1239?text=Beauty"}
                  alt={item.product.name}
                />
                <div>
                  <h3>{item.product.name}</h3>
                  <span>{formatCurrency(item.product.price)}</span>
                </div>
                <InputNumber
                  value={item.quantity}
                  min={1}
                  showButtons
                  buttonLayout="horizontal"
                  decrementButtonIcon="pi pi-minus"
                  incrementButtonIcon="pi pi-plus"
                  onValueChange={(event) =>
                    updateQuantity(item.product.id!, Number(event.value || 1))
                  }
                />
                <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                <Button
                  icon="pi pi-times"
                  className="p-button-text p-button-danger"
                  onClick={() => removeProduct(item.product.id!)}
                  tooltip="Remover"
                />
              </article>
            ))}
          </div>
          <aside className="summary-panel">
            <h2>Resumo</h2>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <div className="summary-line">
              <span>Frete estimado</span>
              <strong>{formatCurrency(total > 250 ? 0 : 19.9)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatCurrency(total + (total > 250 ? 0 : 19.9))}</strong>
            </div>
            <Button
              label="Finalizar compra"
              icon="pi pi-check"
              onClick={() =>
                authenticated
                  ? navigate("/checkout")
                  : navigate("/login", { state: { from: { pathname: "/checkout" } } })
              }
            />
          </aside>
        </section>
      )}
    </div>
  );
};
