import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "@/app/config/constants";

const ForgotPasswordPage = () => {
  // ESTADO

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Hook de autenticación
  const { forgotPassword, loading, error, clearError } = useAuth();

  /**
   * Valida el email ingresado
   */
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("El email es requerido");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Ingresa un email válido");
      return false;
    }

    setEmailError("");
    return true;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (validateEmail()) {
      const success = await forgotPassword(email);
      if (success) {
        setSubmitted(true);
      }
    }
  };

  /**
   * Maneja cambios en el input de email
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 text-center">
            {/* Icono de éxito */}
            <div className="mx-auto h-16 w-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-base-content mb-2">
              ¡Revisa tu correo!
            </h2>

            <p className="text-base-content/70 mb-6">
              Si existe una cuenta con el email <strong>{email}</strong>,
              recibirás instrucciones para restablecer tu contraseña.
            </p>

            <Link
              to={ROUTES.LOGIN}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // RENDER - FORMULARIO
  // ==============================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-base-content">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mt-2 text-base-content/70">
              Ingresa tu email y te enviaremos instrucciones para recuperarla.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error del servidor */}
            {error && (
              <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Campo de email */}
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="tu@email.com"
              error={emailError}
              disabled={loading}
              required
              autoComplete="email"
            />

            {/* Botón de envío */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Enviar instrucciones
            </Button>

            {/* Link para volver */}
            <div className="text-center">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
