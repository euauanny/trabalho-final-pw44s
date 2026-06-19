import type { IAddress, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const addressURL = "/addresses";

const findAll = async (): Promise<IResponse> => {
  try {
    // Lista enderecos do usuario autenticado: GET /addresses.
    const data = await api.get(addressURL);
    return {
      status: 200,
      success: true,
      message: "Enderecos carregados com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao carregar enderecos",
      data: err.response?.data,
    };
  }
};

const save = async (address: IAddress): Promise<IResponse> => {
  try {
    // Cadastra endereco para o usuario autenticado: POST /addresses.
    const data = await api.post(addressURL, address);
    return {
      status: 200,
      success: true,
      message: "Endereco salvo com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao salvar endereco",
      data: err.response?.data,
    };
  }
};

const update = async (address: IAddress): Promise<IResponse> => {
  try {
    const data = await api.put(`${addressURL}/${address.id}`, address);
    return {
      status: 200,
      success: true,
      message: "Endereco atualizado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao atualizar endereco",
      data: err.response?.data,
    };
  }
};

const remove = async (id: number): Promise<IResponse> => {
  try {
    await api.delete(`${addressURL}/${id}`);
    return {
      status: 204,
      success: true,
      message: "Endereco excluido com sucesso",
    };
  } catch (err: any) {
    return {
      status: err.response?.status,
      success: false,
      message: "Falha ao excluir endereco",
      data: err.response?.data,
    };
  }
};

const AddressService = {
  findAll,
  save,
  update,
  remove,
};

export default AddressService;
