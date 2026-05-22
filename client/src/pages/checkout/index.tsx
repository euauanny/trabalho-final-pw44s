import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import type { IAddress } from "@/commons/types";
import { useCart } from "@/context/hooks/use-cart";
import AddressService from "@/services/address-service";
import CepService from "@/services/cep-service";
import OrderService from "@/services/order-service";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const emptyAddress: IAddress = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
};

export const CheckoutPage = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>();
  const [paymentMethod, setPaymentMethod] = useState("CARTAO");
  const [loading, setLoading] = useState(false);
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { control, handleSubmit, reset, getValues } = useForm<IAddress>({
    defaultValues: emptyAddress,
  });

  const loadAddresses = async () => {
    const response = await AddressService.findAll();
    if (response.success && Array.isArray(response.data)) {
      const loaded = response.data as IAddress[];
      setAddresses(loaded);
      setSelectedAddressId(loaded[0]?.id);
    }
  };

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }
    loadAddresses();
  }, []);

  const handleCepBlur = async () => {
    const address = await CepService.findAddressByCep(getValues("cep"));
    if (address) {
      reset({ ...getValues(), ...address });
    }
  };

  const saveAddress = async (address: IAddress) => {
    const response = await AddressService.save(address);
    if (response.success) {
      toast.current?.show({
        severity: "success",
        summary: "Endereco",
        detail: "Endereco cadastrado.",
        life: 2500,
      });
      reset(emptyAddress);
      await loadAddresses();
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Nao foi possivel cadastrar o endereco.",
        life: 3000,
      });
    }
  };

  const finishOrder = async () => {
    if (!selectedAddressId) {
      toast.current?.show({
        severity: "warn",
        summary: "Endereco",
        detail: "Selecione ou cadastre um endereco.",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    const response = await OrderService.checkout({
      addressId: selectedAddressId,
      items: cart.map((item) => ({
        productId: item.product.id!,
        quantity: item.quantity,
      })),
    });

    if (response.success) {
      clearCart();
      navigate("/orders");
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Nao foi possivel finalizar o pedido.",
        life: 3000,
      });
    }
    setLoading(false);
  };

  const addressOptions = addresses.map((address) => ({
    label: `${address.logradouro}, ${address.numero} - ${address.bairro}`,
    value: address.id,
  }));

  return (
    <div className="checkout-page">
      <Toast ref={toast} />
      <div className="page-title-row">
        <div>
          <h1>Finalizar compra</h1>
          <p>Confirme endereco, pagamento e itens do pedido.</p>
        </div>
      </div>

      <section className="checkout-layout">
        <div className="checkout-main">
          <Card title="Endereco de entrega">
            <Dropdown
              value={selectedAddressId}
              options={addressOptions}
              onChange={(event) => setSelectedAddressId(event.value)}
              placeholder="Selecione um endereco"
              className="w-full mb-4"
            />

            <form onSubmit={handleSubmit(saveAddress)} className="address-form">
              <Controller
                name="cep"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputText {...field} placeholder="CEP" onBlur={handleCepBlur} />
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
              <Button type="submit" label="Salvar endereco" icon="pi pi-map-marker" />
            </form>
          </Card>

          <Card title="Pagamento">
            <Dropdown
              value={paymentMethod}
              options={[
                { label: "Cartao de credito", value: "CARTAO" },
                { label: "Pix", value: "PIX" },
                { label: "Boleto", value: "BOLETO" },
              ]}
              onChange={(event) => setPaymentMethod(event.value)}
              className="w-full"
            />
          </Card>
        </div>

        <aside className="summary-panel">
          <h2>Itens</h2>
          {cart.map((item) => (
            <div className="summary-line" key={item.product.id}>
              <span>{item.quantity}x {item.product.name}</span>
              <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <Button
            label="Finalizar pedido"
            icon="pi pi-check"
            loading={loading}
            onClick={finishOrder}
          />
          <small>Pagamento selecionado: {paymentMethod}</small>
        </aside>
      </section>
    </div>
  );
};
