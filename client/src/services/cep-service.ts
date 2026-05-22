import type { IAddress } from "@/commons/types";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  erro?: boolean;
}

const findAddressByCep = async (cep: string): Promise<Partial<IAddress> | null> => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) {
    return null;
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) {
    return null;
  }

  return {
    cep: data.cep,
    logradouro: data.logradouro,
    complemento: data.complemento,
    bairro: data.bairro,
  };
};

const CepService = {
  findAddressByCep,
};

export default CepService;
