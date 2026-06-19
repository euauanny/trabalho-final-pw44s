import type { IUserRegister, IUserLogin, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const signup = async (user: IUserRegister): Promise<IResponse> => {
  try {
    // Cadastra novo usuario no backend: POST /users.
    const data = await api.post("/users", user);
    return {
      status: 200,
      success: true,
      message: "Usuario cadastrado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status ?? 400,
      success: false,
      message: "Usuario nao pode ser cadastrado",
      data: err.response?.data,
    };
  }
};

const login = async (user: IUserLogin): Promise<IResponse> => {
  try {
    // Autentica usuario no backend: POST /login. A resposta traz token JWT e dados do usuario.
    const data = await api.post("/login", user);
    return {
      status: 200,
      success: true,
      message: "Login bem-sucedido",
      data: data.data,
    };
  } catch (err: any) {
    return {
      status: err.response?.status ?? 401,
      success: false,
      message: "Usuario ou senha invalidos",
      data: err.response?.data,
    };
  }
};

const AuthService = {
  signup,
  login,
};

export default AuthService;
