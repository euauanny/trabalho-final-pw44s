import type { IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const findAll = async (): Promise<IResponse> => {
  try {
    const data = await api.get("/categories");
    return {
      status: 200,
      success: true,
      message: "Lista de categorias carregada com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao carregar a lista de categorias",
      data: err.response?.data,
    };
  }
};

const CategoryService = {
  findAll,
};

export default CategoryService;
