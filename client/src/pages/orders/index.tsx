import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import type { IOrder } from "@/commons/types";
import OrderService from "@/services/order-service";
import { useToast } from "@/context/hooks/use-toast";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      // Busca historico de pedidos do usuario autenticado.
      const response = await OrderService.findAll();
      if (response.success && Array.isArray(response.data)) {
        setOrders(response.data as IOrder[]);
      } else {
        showToast({
          severity: "error",
          summary: "Erro",
          detail: "Nao foi possivel carregar os pedidos.",
        });
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="orders-page">
      <div className="page-title-row">
        <div>
          <h1>Meus pedidos</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">Nenhum pedido encontrado.</div>
      ) : (
        <div className="orders-list">
          {/* Cada pedido vira um Card com cabecalho, total e itens comprados. */}
          {orders.map((order) => (
            <Card key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h2>Pedido #{order.id}</h2>
                  <span>{new Date(order.date).toLocaleString("pt-BR")}</span>
                </div>
                <Tag value={formatCurrency(order.total)} severity="success" />
              </div>
              <div className="order-items">
                {order.items?.map((item) => (
                  <div className="summary-line" key={`${order.id}-${item.productId}`}>
                    <span>{item.quantity}x {item.productName}</span>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
