import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";

export const RegisterPage = () => {
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
  const toast = useRef<Toast>(null);

  const onSubmit = async (data: IUserRegister) => {
    setLoading(true);
    const response = await signup(data);

    if (response.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Usuario cadastrado.",
        life: 2500,
      });
      setTimeout(() => navigate("/login"), 800);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Nao foi possivel cadastrar. Verifique usuario, email e senha.",
        life: 3500,
      });
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <Toast ref={toast} />
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
