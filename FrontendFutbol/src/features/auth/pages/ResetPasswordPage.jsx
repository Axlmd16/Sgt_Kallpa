/**
 * ==============================================
 * Página de Restablecer Contraseña - Kallpa UNL
 * ==============================================
 *
 * Permite al usuario establecer una nueva contraseña
 * usando el token recibido por email.
 *
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import useAuth from "../hooks/useAuth";
import { ROUTES, VALIDATION } from "@/app/config/constants";

/**
 * ResetPasswordPage - Página para establecer nueva contraseña
 *
 * @returns {JSX.Element} Página de reset de contraseña
 */
const ResetPasswordPage = () => {
  // ==============================================
  // ESTADO
  // ==============================================

  // Obtener token de los parámetros de URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Estado del formulario
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  // Hook de autenticación
  const { resetPassword, loading, error, clearError } = useAuth();

  // ==============================================
  // EFECTOS
  // ==============================================

  /**
   * Verificar que existe token en la URL
   */
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  // ==============================================
  // VALIDACIÓN
  // ==============================================

  /**
   * Valida un campo específico
   * @param {string} name - Nombre del campo
   * @param {string} value - Valor del campo
   * @returns {string} Mensaje de error o cadena vacía
   */
  const validateField = (name, value) => {
    switch (name) {
      case "password":
        if (!value) return "La contraseña es requerida";
        if (value.length < VALIDATION.PASSWORD_MIN_LENGTH) {
          return `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
        }
        return "";

      case "passwordConfirmation":
        if (!value) return "Confirma tu contraseña";
        if (value !== formData.password) {
          return "Las contraseñas no coinciden";
        }
        return "";

      default:
        return "";
    }
  };

  /**
   * Valida todo el formulario
   * @returns {boolean} true si es válido
   */
  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==============================================
  // MANEJADORES
  // ==============================================

  /**
   * Maneja cambios en los inputs
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (validateForm()) {
      await resetPassword({
        token,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      });
    }
  };

  // ==============================================
  // RENDER - TOKEN INVÁLIDO
  // ==============================================

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 text-center">
            {/* Icono de error */}
            <div className="mx-auto h-16 w-16 bg-error/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-base-content mb-2">
              Enlace inválido
            </h2>

            <p className="text-base-content/70 mb-6">
              El enlace para restablecer tu contraseña no es válido o ha
              expirado. Por favor, solicita uno nuevo.
            </p>

            <div className="space-y-3">
              <Link to={ROUTES.FORGOT_PASSWORD}>
                <Button variant="primary" fullWidth>
                  Solicitar nuevo enlace
                </Button>
              </Link>

              <Link
                to={ROUTES.LOGIN}
                className="block text-sm text-primary hover:text-primary/80 font-medium"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER - FORMULARIO

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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-base-content">
              Nueva contraseña
            </h1>
            <p className="mt-2 text-base-content/70">
              Ingresa tu nueva contraseña para continuar.
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

            {/* Campo de nueva contraseña */}
            <Input
              label="Nueva contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={formErrors.password}
              disabled={loading}
              required
              autoComplete="new-password"
            />

            {/* Campo de confirmación */}
            <Input
              label="Confirmar contraseña"
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              placeholder="••••••••"
              error={formErrors.passwordConfirmation}
              disabled={loading}
              required
              autoComplete="new-password"
            />

            {/* Indicador de fortaleza */}
            <div className="text-sm text-base-content/60">
              <p>La contraseña debe tener:</p>
              <ul className="list-disc list-inside mt-1">
                <li
                  className={
                    formData.password.length >= 8 ? "text-success" : ""
                  }
                >
                  Mínimo 8 caracteres
                </li>
              </ul>
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Cambiar contraseña
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

export default ResetPasswordPage;
