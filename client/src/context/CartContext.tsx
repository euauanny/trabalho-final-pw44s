import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ICartItem, IProduct } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";

interface CartContextType {
  cart: ICartItem[];
  totalItems: number;
  total: number;
  addProduct: (product: IProduct) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeProduct: (productId: number) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext({} as CartContextType);

export const CartProvider = ({ children }: CartProviderProps) => {
  const { authenticated, authenticatedUser } = useAuth();
  // Cada usuario tem uma chave propria no localStorage para nao misturar carrinhos.
  const cartKey = authenticatedUser?.username
    ? `cart:${authenticatedUser.username}`
    : undefined;
  const [cart, setCart] = useState<ICartItem[]>([]);

  useEffect(() => {
    // Quando troca login/usuario, carrega o carrinho daquele usuario ou limpa se deslogado.
    if (!authenticated || !cartKey) {
      setCart([]);
      return;
    }

    const saved = localStorage.getItem(cartKey);
    setCart(saved ? JSON.parse(saved) : []);
  }, [authenticated, cartKey]);

  useEffect(() => {
    // Persiste o carrinho sempre que ele muda.
    if (authenticated && cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [authenticated, cart, cartKey]);

  const addProduct = (product: IProduct) => {
    // Adiciona um produto; se ja existir no carrinho, aumenta a quantidade.
    if (!product.id) {
      return;
    }

    setCart((current) => {
      const exists = current.find((item) => item.product.id === product.id);
      if (exists) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // Atualiza a quantidade; quantidade zero ou negativa remove o item.
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeProduct = (productId: number) => {
    // Remove um produto filtrando pelo id.
    setCart((current) => current.filter((item) => item.product.id !== productId));
  };

  // Limpa todos os itens do carrinho do usuario atual.
  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    // Soma todas as quantidades para exibir a badge do menu.
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const total = useMemo(
    // Calcula o valor total do carrinho.
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, totalItems, total, addProduct, updateQuantity, removeProduct, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
