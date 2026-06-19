import type { ICheckout, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const findAll = async (): Promise<IResponse> => {
  try {
    // Lista pedidos do usuario autenticado: GET /orders.
    const data = await api.get("/orders");
    return {
      status: 200,
      success: true,
      message: "Pedidos carregados com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao carregar pedidos",
      data: err.response?.data,
    };
  }
};

const checkout = async (payload: ICheckout): Promise<IResponse> => {
  try {
    // Finaliza a compra enviando endereco e itens do carrinho: POST /orders/checkout.
    const data = await api.post("/orders/checkout", payload);
    return {
      status: 201,
      success: true,
      message: "Pedido finalizado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao finalizar pedido",
      data: err.response?.data,
    };
  }
};

const OrderService = {
  findAll,
  checkout,
};

export default OrderService;
