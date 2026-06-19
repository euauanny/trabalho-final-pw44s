import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import type { ICategory, IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";
import { useToast } from "@/context/hooks/use-toast";

const pageSize = 8;

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const HomePage = () => {
  // Estados da tela: produtos, categorias, filtro, pagina atual e loading.
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [first, setFirst] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addProduct } = useCart();
  const { authenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      // Carrega categorias do backend para alimentar o Dropdown de filtro.
      const response = await CategoryService.findAll();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data as ICategory[]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      // Carrega produtos do backend. Se houver categoria selecionada, busca com filtro.
      const response = await ProductService.findAll(selectedCategory);
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data as IProduct[]);
        setFirst(0);
      } else {
        showToast({
          severity: "error",
          summary: "Erro",
          detail: "Nao foi possivel carregar os produtos.",
        });
      }
      setLoading(false);
    };

    loadProducts();
  }, [selectedCategory]);

  const visibleProducts = useMemo(
    // Recorta apenas os produtos da pagina atual.
    () => products.slice(first, first + pageSize),
    [first, products]
  );

  // Opcoes exibidas no Dropdown de categorias.
  const categoryOptions = [
    { label: "Todas as categorias", value: undefined },
    ...categories.map((category) => ({ label: category.name, value: category.id })),
  ];

  const handleAddProduct = (product: IProduct) => {
    // Regra de negocio: so usuario logado pode usar o carrinho.
    if (!authenticated) {
      showToast({
        severity: "warn",
        summary: "Login necessario",
        detail: "Entre na sua conta para usar o carrinho.",
      });
      navigate("/login", { state: { from: location } });
      return;
    }

    // Se estiver logado, adiciona no CartContext e mostra feedback.
    addProduct(product);
    showToast({
      severity: "success",
      summary: "Carrinho",
      detail: "Produto adicionado.",
      life: 1800,
    });
  };

  return (
    <div className="store-page">
      <section className="store-hero">
        <div>
          <p className="eyebrow">PinkChic</p>
          <h1>Produtos para maquiagem, perfume e cuidado diario</h1>
          <p>
           By Auanny Comerlato
          </p>
        </div>
      </section>

      <section className="toolbar-row">
        <div>
          <h2>Produtos</h2>
          <span>{products.length} itens encontrados</span>
        </div>
        <Dropdown
          value={selectedCategory}
          options={categoryOptions}
          onChange={(event) => setSelectedCategory(event.value)}
          placeholder="Filtrar por categoria"
          className="category-filter"
        />
      </section>

      {loading ? (
        <div className="empty-state">Carregando produtos...</div>
      ) : (
        <>
          <section className="product-grid">
            {/* Renderiza um card para cada produto da pagina atual. */}
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <Link to={`/products/${product.id}`} className="product-image-link">
                  {/* urlImage vem do backend e aponta para a pasta public/img do frontend. */}
                  <img
                    src={product.urlImage || "https://placehold.co/600x600/fce7f3/9f1239?text=Beauty"}
                    alt={product.name}
                  />
                </Link>
                <div className="product-card-body">
                  <span>{product.category?.name}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{formatCurrency(product.price)}</strong>
                  <Button
                    label={"Adicionar ao carrinho"}
                    icon="pi pi-shopping-cart"
                    onClick={() => handleAddProduct(product)}
                  />
                </div>
              </article>
            ))}
          </section>

          <Paginator
            first={first}
            rows={pageSize}
            totalRecords={products.length}
            onPageChange={(event) => setFirst(event.first)}
          />
        </>
      )}
    </div>
  );
};
