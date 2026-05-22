import { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import type { IOrder } from "@/commons/types";
import OrderService from "@/services/order-service";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await OrderService.findAll();
      if (response.success && Array.isArray(response.data)) {
        setOrders(response.data as IOrder[]);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Nao foi possivel carregar os pedidos.",
          life: 3000,
        });
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="orders-page">
      <Toast ref={toast} />
      <div className="page-title-row">
        <div>
          <h1>Meus pedidos</h1>
          <p>Historico de compras realizadas pelo usuario autenticado.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">Nenhum pedido encontrado.</div>
      ) : (
        <div className="orders-list">
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
