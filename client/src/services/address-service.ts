import type { IAddress, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const addressURL = "/addresses";

const findAll = async (): Promise<IResponse> => {
  try {
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

const AddressService = {
  findAll,
  save,
};

export default AddressService;
