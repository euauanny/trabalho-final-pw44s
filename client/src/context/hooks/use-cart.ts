import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

// Hook curto para acessar carrinho, totais e funcoes de carrinho.
export const useCart = () => useContext(CartContext);
