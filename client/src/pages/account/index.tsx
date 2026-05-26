import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import type { IAddress } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";
import { useToast } from "@/context/hooks/use-toast";
import AddressService from "@/services/address-service";
import CepService from "@/services/cep-service";

const emptyAddress: IAddress = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
};

export const AccountPage = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const { authenticatedUser } = useAuth();
  const { showToast } = useToast();
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting },
  } = useForm<IAddress>({ defaultValues: emptyAddress });

  const loadAddresses = async () => {
    const response = await AddressService.findAll();
    if (response.success && Array.isArray(response.data)) {
      setAddresses(response.data as IAddress[]);
    } else {
      showToast({
        severity: "error",
        summary: "Erro",
        detail: "Nao foi possivel carregar seus enderecos.",
      });
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleCepBlur = async () => {
    setLoadingAddress(true);
    const address = await CepService.findAddressByCep(getValues("cep"));
    if (address) {
      reset({ ...getValues(), ...address });
    } else if (getValues("cep")) {
      showToast({
        severity: "warn",
        summary: "CEP",
        detail: "CEP nao encontrado.",
      });
    }
    setLoadingAddress(false);
  };

  const saveAddress = async (address: IAddress) => {
    const response = await AddressService.save(address);
    if (response.success) {
      showToast({
        severity: "success",
        summary: "Endereco",
        detail: "Endereco cadastrado com sucesso.",
      });
      reset(emptyAddress);
      await loadAddresses();
    } else {
      showToast({
        severity: "error",
        summary: "Erro",
        detail: "Nao foi possivel cadastrar o endereco.",
      });
    }
  };

  return (
    <div className="account-page">
      <div className="page-title-row">
        <div>
          <h1>Minha conta</h1>
          <p>Confira seus dados e mantenha seus enderecos de entrega atualizados.</p>
        </div>
      </div>

      <section className="account-layout">
        <div className="account-main">
          <Card title="Dados da conta">
            <div className="account-name-card">
              <i className="pi pi-user" />
              <strong>{authenticatedUser?.displayName}</strong>
            </div>
          </Card>

          <Card title="Cadastrar novo endereco">
            <form onSubmit={handleSubmit(saveAddress)} className="address-form">
              <Controller
                name="cep"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="CEP"
                    onBlur={handleCepBlur}
                    disabled={loadingAddress}
                  />
                )}
              />
              <Controller
                name="logradouro"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <InputText {...field} placeholder="Logradouro" />}
              />
              <Controller
                name="numero"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <InputText {...field} placeholder="Numero" />}
              />
              <Controller
                name="bairro"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <InputText {...field} placeholder="Bairro" />}
              />
              <Controller
                name="complemento"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <InputText {...field} placeholder="Complemento" />}
              />
              <Button
                type="submit"
                label="Salvar endereco"
                icon="pi pi-map-marker"
                loading={isSubmitting}
              />
            </form>
          </Card>
        </div>

        <Card title="Enderecos cadastrados" className="account-addresses">
          {addresses.length === 0 ? (
            <div className="empty-state compact">Nenhum endereco cadastrado.</div>
          ) : (
            <div className="address-list">
              {addresses.map((address) => (
                <article className="address-item" key={address.id}>
                  <strong>
                    {address.logradouro}, {address.numero}
                  </strong>
                  <span>{address.bairro}</span>
                  <small>
                    CEP {address.cep}
                    {address.complemento ? ` - ${address.complemento}` : ""}
                  </small>
                </article>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};
