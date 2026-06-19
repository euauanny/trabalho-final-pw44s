import { createContext, useRef } from "react";
import type { ReactNode } from "react";
import { Toast } from "primereact/toast";
import type { ToastMessage } from "primereact/toast";

interface ToastContextType {
  showToast: (message: ToastMessage) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext({} as ToastContextType);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const toast = useRef<Toast>(null);

  const showToast = (message: ToastMessage) => {
    // Funcao global para qualquer pagina exibir mensagem de feedback.
    toast.current?.show({ life: 3000, ...message });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext };
