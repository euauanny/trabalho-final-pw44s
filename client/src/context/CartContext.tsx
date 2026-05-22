import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ICartItem, IProduct } from "@/commons/types";

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
  const [cart, setCart] = useState<ICartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product: IProduct) => {
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
    setCart((current) => current.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const total = useMemo(
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
