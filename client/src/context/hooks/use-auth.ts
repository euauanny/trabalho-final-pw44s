import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Hook curto para acessar autenticacao sem importar useContext em todas as paginas.
export const useAuth = () => useContext(AuthContext);
