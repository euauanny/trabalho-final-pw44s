import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import type { ICategory, IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import { useCart } from "@/context/hooks/use-cart";

const pageSize = 8;

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [first, setFirst] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addProduct } = useCart();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const loadCategories = async () => {
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
      const response = await ProductService.findAll(selectedCategory);
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data as IProduct[]);
        setFirst(0);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Nao foi possivel carregar os produtos.",
          life: 3000,
        });
      }
      setLoading(false);
    };

    loadProducts();
  }, [selectedCategory]);

  const visibleProducts = useMemo(
    () => products.slice(first, first + pageSize),
    [first, products]
  );

  const categoryOptions = [
    { label: "Todas as categorias", value: undefined },
    ...categories.map((category) => ({ label: category.name, value: category.id })),
  ];

  return (
    <div className="store-page">
      <Toast ref={toast} />

      <section className="store-hero">
        <div>
          <p className="eyebrow">Loja de beleza</p>
          <h1>Produtos para maquiagem, perfume e cuidado diario</h1>
          <p>
            Catalogo conectado ao backend Spring, carrinho persistido no navegador
            e compra finalizada somente com usuario autenticado.
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
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <Link to={`/products/${product.id}`} className="product-image-link">
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
                    label="Adicionar"
                    icon="pi pi-shopping-cart"
                    onClick={() => {
                      addProduct(product);
                      toast.current?.show({
                        severity: "success",
                        summary: "Carrinho",
                        detail: "Produto adicionado.",
                        life: 1800,
                      });
                    }}
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
