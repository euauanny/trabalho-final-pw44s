import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
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
  // Enderecos cadastrados do usuario logado.
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
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
    // GET /addresses retorna apenas enderecos do usuario autenticado.
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
    // Ao sair do campo CEP, consulta ViaCEP para preencher logradouro/bairro.
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
    const addressToSave = editingAddress
      ? { ...address, id: editingAddress.id, userId: editingAddress.userId }
      : address;
    const response = editingAddress
      ? await AddressService.update(addressToSave)
      : await AddressService.save(addressToSave);

    if (response.success) {
      showToast({
        severity: "success",
        summary: "Endereco",
        detail: editingAddress
          ? "Endereco atualizado com sucesso."
          : "Endereco cadastrado com sucesso.",
      });
      setEditingAddress(null);
      reset(emptyAddress);
      await loadAddresses();
    } else {
      showToast({
        severity: "error",
        summary: "Erro",
        detail: editingAddress
          ? "Nao foi possivel atualizar o endereco."
          : "Nao foi possivel cadastrar o endereco.",
      });
    }
  };

  const startEditing = (address: IAddress) => {
    setEditingAddress(address);
    reset(address);
  };

  const cancelEditing = () => {
    setEditingAddress(null);
    reset(emptyAddress);
  };

  const removeAddress = async (address: IAddress) => {
    if (!address.id) {
      return;
    }

    const response = await AddressService.remove(address.id);
    if (response.success) {
      if (editingAddress?.id === address.id) {
        cancelEditing();
      }
      setAddresses((current) => current.filter((item) => item.id !== address.id));
      showToast({
        severity: "success",
        summary: "Endereco",
        detail: "Endereço excluido com sucesso.",
      });
    } else {
      showToast({
        severity: "error",
        summary: "Erro",
        detail: "Nao foi possivel excluir o endereço.",
      });
    }
  };

  const confirmRemoveAddress = (address: IAddress) => {
    confirmDialog({
      header: "Excluir endereço",
      message: "Deseja excluir este endereço?",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Excluir",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => removeAddress(address),
    });
  };

  return (
    <div className="account-page">
      <ConfirmDialog />
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

          <Card title={editingAddress ? "Editar endereco" : "Cadastrar novo endereco"}>
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
                label={editingAddress ? "Atualizar endereco" : "Salvar endereco"}
                icon={editingAddress ? "pi pi-check" : "pi pi-map-marker"}
                loading={isSubmitting}
              />
              {editingAddress && (
                <Button
                  type="button"
                  label="Cancelar edição"
                  icon="pi pi-times"
                  severity="secondary"
                  outlined
                  onClick={cancelEditing}
                />
              )}
            </form>
          </Card>
        </div>

        <Card title="Enderecos cadastrados" className="account-addresses">
          {addresses.length === 0 ? (
            <div className="empty-state compact">Nenhum endereco cadastrado.</div>
          ) : (
            <div className="address-list">
              {/* Renderiza todos os enderecos retornados pelo backend. */}
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
                  <div className="address-actions">
                    <Button
                      type="button"
                      label="Editar"
                      icon="pi pi-pencil"
                      size="small"
                      text
                      onClick={() => startEditing(address)}
                    />
                    <Button
                      type="button"
                      label="Excluir"
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      text
                      onClick={() => confirmRemoveAddress(address)}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};
