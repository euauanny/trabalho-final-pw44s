import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { useToast } from "@/context/hooks/use-toast";

export const RegisterPage = () => {
  // Formulario de cadastro controlado pelo React Hook Form.
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegister>({
    defaultValues: { username: "", password: "", displayName: "", email: "" },
  });
  const [loading, setLoading] = useState(false);
  const { signup } = AuthService;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const onSubmit = async (data: IUserRegister) => {
    // Envia os dados para POST /users por meio do AuthService.
    setLoading(true);
    const response = await signup(data);

    if (response.success) {
      // Cadastro concluido: mostra feedback e manda para login.
      showToast({
        severity: "success",
        summary: "Sucesso",
        detail: "Usuario cadastrado.",
        life: 2500,
      });
      setTimeout(() => navigate("/login"), 800);
    } else {
      // Cadastro falhou: backend pode ter recusado username/email/senha.
      showToast({
        severity: "error",
        summary: "Erro",
        detail: "Nao foi possivel cadastrar. Verifique usuario, email e senha.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <Card title="Criar conta" className="auth-card">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3">
          <div>
            <label className="block mb-2">Nome</label>
            <Controller
              name="displayName"
              control={control}
              rules={{ required: "Campo obrigatorio" }}
              render={({ field }) => (
                <InputText {...field} className={errors.displayName ? "p-invalid w-full" : "w-full"} />
              )}
            />
            {errors.displayName && <small className="p-error">{errors.displayName.message}</small>}
          </div>

          <div>
            <label className="block mb-2">Usuario</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Campo obrigatorio", minLength: { value: 4, message: "Minimo 4 caracteres" } }}
              render={({ field }) => (
                <InputText {...field} className={errors.username ? "p-invalid w-full" : "w-full"} />
              )}
            />
            {errors.username && <small className="p-error">{errors.username.message}</small>}
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Campo obrigatorio" }}
              render={({ field }) => (
                <InputText {...field} type="email" className={errors.email ? "p-invalid w-full" : "w-full"} />
              )}
            />
            {errors.email && <small className="p-error">{errors.email.message}</small>}
          </div>

          <div>
            <label className="block mb-2">Senha</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Campo obrigatorio",
                minLength: { value: 6, message: "Minimo 6 caracteres" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                  message: "Use maiuscula, minuscula e numero",
                },
              }}
              render={({ field }) => (
                <Password
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
            label="Registrar"
            icon="pi pi-user-plus"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          />
          <div className="text-center">
            <small>
              Ja tem uma conta? <Link to="/login">Fazer login</Link>
            </small>
          </div>
        </form>
      </Card>
    </div>
  );
};
