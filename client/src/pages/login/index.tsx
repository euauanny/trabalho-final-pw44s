import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { useAuth } from "@/context/hooks/use-auth";
import { useToast } from "@/context/hooks/use-toast";

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin>({ defaultValues: { username: "", password: "" } });
  const [loading, setLoading] = useState(false);
  const { login } = AuthService;
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const onSubmit = async (userLogin: IUserLogin) => {
    setLoading(true);
    const response = await login(userLogin);

    if (response.success && response.data) {
      await handleLogin(response.data as AuthenticationResponse);
      showToast({
        severity: "success",
        summary: "Bem-vinda",
        detail: "Login efetuado com sucesso.",
        life: 2000,
      });
      navigate(from || "/", { replace: true });
    } else {
      showToast({
        severity: "error",
        summary: "Erro",
        detail: "Usuario ou senha invalidos.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <Card title="Entrar" className="auth-card">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3">
          <div>
            <label htmlFor="username" className="block mb-2">
              Usuario
            </label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Informe o usuario" }}
              render={({ field }) => (
                <InputText
                  id="username"
                  {...field}
                  className={errors.username ? "p-invalid w-full" : "w-full"}
                />
              )}
            />
            {errors.username && <small className="p-error">{errors.username.message}</small>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">
              Senha
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Informe a senha" }}
              render={({ field }) => (
                <Password
                  id="password"
                  {...field}
                  toggleMask
                  feedback={false}
                  className={errors.password ? "p-invalid w-full" : "w-full"}
                  inputClassName="w-full"
                />
              )}
            />
            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          />
        </form>
        <div className="text-center mt-3">
          <small>
            Nao tem uma conta? <Link to="/register">Criar conta</Link>
          </small>
        </div>
      </Card>
    </div>
  );
};
