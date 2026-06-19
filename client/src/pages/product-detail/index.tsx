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

const getProductDetails = (description: string) => {
  // A descricao do backend segue: marca, desconto, estoque e avaliacao.
  const brand = description.split(".")[0]?.trim();
  const stock = description.match(/Estoque:\s*([^.]*)/i)?.[1]?.trim();
  const rating = description.match(/Avaliacao:\s*([\d.,]+)/i)?.[1]?.trim();

  return { brand, stock, rating };
};

export const ProductDetailPage = () => {
  // Guarda o produto carregado pelo id da URL.
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

      // Busca no backend o produto individual: GET /products/{id}.
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

  const productDetails = getProductDetails(product.description);

  const handleAddProduct = () => {
    // Produto so pode ir ao carrinho se o usuario estiver logado.
    if (!authenticated) {
      showToast({
        severity: "warn",
        summary: "Login necessario",
        detail: "Entre na sua conta para usar o carrinho.",
      });
      navigate("/login", { state: { from: location } });
      return;
    }

    // Usa o CartContext para adicionar o produto atual.
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
          <span className="detail-category">{product.category?.name}</span>
          <h1>{product.name}</h1>
          <div className="detail-attributes">
            <div className="detail-attribute">
              <i className="pi pi-tag" />
              <div>
                <small>Marca</small>
                <strong>{productDetails.brand}</strong>
              </div>
            </div>
            <div className="detail-attribute">
              <i className="pi pi-box" />
              <div>
                <small>Estoque</small>
                <strong>{productDetails.stock || "Nao informado"}</strong>
              </div>
            </div>
            <div className="detail-attribute">
              <i className="pi pi-star-fill" />
              <div>
                <small>Avaliacao</small>
                <strong>{productDetails.rating || "Nao informada"}</strong>
              </div>
            </div>
          </div>
          <div className="detail-purchase">
            <div>
              <small>Preco</small>
              <strong>{formatCurrency(product.price)}</strong>
            </div>
            <Button
              label="Adicionar ao carrinho"
              icon="pi pi-shopping-cart"
              onClick={handleAddProduct}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
