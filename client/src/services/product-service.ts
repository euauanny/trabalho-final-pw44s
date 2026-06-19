import type { IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const productURL = "/products";

const findAll = async (categoryId?: number): Promise<IResponse> => {
  try {
    // Lista produtos. Se categoryId existir, envia como query param: /products?categoryId=...
    const data = await api.get(productURL, { params: categoryId ? { categoryId } : {} });
    return {
      status: 200,
      success: true,
      message: "Lista de produtos carregada com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao carregar a lista de produtos",
      data: err.response?.data,
    };
  }
};

const findById = async (id: number): Promise<IResponse> => {
  try {
    // Busca um produto especifico pelo id: GET /products/{id}.
    const data = await api.get(`${productURL}/${id}`);
    return {
      status: 200,
      success: true,
      message: "Produto carregado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao carregar o produto",
      data: err.response?.data,
    };
  }
};

const ProductService = {
  findAll,
  findById,
};

export default ProductService;
