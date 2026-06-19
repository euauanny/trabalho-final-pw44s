import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: AuthenticatedUser;
  handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<void>;
  handleLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estado global que informa se existe usuario logado e quais sao os dados dele.
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>();

  useEffect(() => {
    // Ao recarregar a pagina, tenta restaurar login salvo no localStorage.
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const token = JSON.parse(storedToken);
      setAuthenticatedUser(JSON.parse(storedUser));
      setAuthenticated(true);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = async (authenticationResponse: AuthenticationResponse) => {
    // Salva token e usuario para manter a sessao mesmo apos atualizar a pagina.
    localStorage.setItem("token", JSON.stringify(authenticationResponse.token));
    localStorage.setItem("user", JSON.stringify(authenticationResponse.user));
    api.defaults.headers.common.Authorization = `Bearer ${authenticationResponse.token}`;

    setAuthenticatedUser(authenticationResponse.user);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    // Remove dados da sessao e limpa o header Authorization das proximas requisicoes.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.common.Authorization = "";

    setAuthenticated(false);
    setAuthenticatedUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, authenticatedUser, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
