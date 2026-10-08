import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { ROUTES } from "@/app/config/constants";

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Mensaje de error del servidor */}
      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Error de autenticación</p>
            <p className="text-sm opacity-80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Campo de email */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-base-content">
          <Mail className="w-4 h-4 text-primary" />
          Correo electrónico
        </label>
        <div className="relative group">
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            disabled={loading}
            autoComplete="email"
            className={`input w-full h-14 pl-5 pr-5 text-base bg-base-200/50 border-2 rounded-xl focus:bg-base-100 focus:border-primary focus:outline-none transition-all ${errors.email ? "border-error bg-error/5" : "border-transparent hover:border-base-300"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ingresa un email válido",
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-error text-sm flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Campo de contraseña */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-base-content">
          <Lock className="w-4 h-4 text-primary" />
          Contraseña
        </label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            disabled={loading}
            autoComplete="current-password"
            className={`input w-full h-14 pl-5 pr-14 text-base bg-base-200/50 border-2 rounded-xl focus:bg-base-100 focus:border-primary focus:outline-none transition-all ${errors.password ? "border-error bg-error/5" : "border-transparent hover:border-base-300"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 8,
                message: "Mínimo 8 caracteres",
              },
            })}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-base-content/40 hover:text-primary hover:bg-primary/10 transition-all"
            tabIndex={-1}
            disabled={loading}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-error text-sm flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Link de contraseña olvidada */}
      <div className="flex justify-end">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary font-medium transition-colors"
        >
          <KeyRound className="w-4 h-4" />
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-content font-semibold text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:shadow-none flex items-center justify-center gap-2 transition-all"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>Iniciar sesión</span>
          </>
        )}
      </button>
    </form>
  );
};

// Validación de PropTypes
LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default LoginForm;
