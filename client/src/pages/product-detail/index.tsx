import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";
import { useToast } from "@/context/hooks/use-toast";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ProductDetailPage = () => {
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct } = useCart();
  const { authenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        return;
      }

      const response = await ProductService.findById(Number(id));
      if (response.success) {
        setProduct(response.data as IProduct);
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="empty-state">Carregando produto...</div>;
  }

  if (!product) {
    return <div className="empty-state">Produto nao encontrado.</div>;
  }

  const handleAddProduct = () => {
    if (!authenticated) {
      showToast({
        severity: "warn",
        summary: "Login necessario",
        detail: "Entre na sua conta para usar o carrinho.",
      });
      navigate("/login", { state: { from: location } });
      return;
    }

    addProduct(product);
    showToast({
      severity: "success",
      summary: "Carrinho",
      detail: "Produto adicionado.",
      life: 1800,
    });
  };

  return (
    <div className="detail-page">
      <Button
        label="Voltar"
        icon="pi pi-arrow-left"
        className="p-button-text"
        onClick={() => navigate("/")}
      />
      <section className="detail-content">
        <div className="detail-image">
          <img
            src={product.urlImage || "https://placehold.co/900x900/fce7f3/9f1239?text=Beauty"}
            alt={product.name}
          />
        </div>
        <div className="detail-info">
          <span>{product.category?.name}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong>{formatCurrency(product.price)}</strong>
          <Button
            label={ "Adicionar ao carrinho"}
            icon="pi pi-shopping-cart"
            onClick={handleAddProduct}
          />
        </div>
      </section>
    </div>
  );
};
