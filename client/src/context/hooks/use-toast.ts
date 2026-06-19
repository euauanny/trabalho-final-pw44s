import { useContext } from "react";
import { ToastContext } from "@/context/ToastContext";

// Hook curto para exibir toasts globais em qualquer tela.
export const useToast = () => useContext(ToastContext);
