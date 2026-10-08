/**
 * Hook de Autenticación
 */

import { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../services/auth.api";
import { AuthContext } from "@/app/providers/AuthProvider";
import { ROUTES, MESSAGES } from "@/app/config/constants";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch (error) {
    console.warn("[Auth] No se pudo decodificar el token", error);
    return null;
  }
};

/**
 * useAuth - Hook principal de autenticación
 *
 * Proporciona:
 * - login: Función para iniciar sesión
 * - logout: Función para cerrar sesión
 * - forgotPassword: Función para recuperar contraseña
 * - resetPassword: Función para restablecer contraseña
 * - loading: Estado de carga
 * - error: Mensaje de error actual
 * - clearError: Función para limpiar errores
 *
 * @returns {Object} Objeto con funciones y estado de auth
 *
 * @example
 * const { login, loading, error } = useAuth();
 *
 * const handleSubmit = async (data) => {
 *   const success = await login(data);
 *   if (success) navigate('/dashboard');
 * };
 */
const useAuth = () => {
  // Estado de carga para operaciones async
  const [loading, setLoading] = useState(false);

  // Estado de error
  const [error, setError] = useState(null);

  // Obtener funciones del contexto de autenticación
  const { saveAuthData, clearAuthData, user, isAuthenticated } =
    useContext(AuthContext);

  // Hook de navegación
  const navigate = useNavigate();

  // FUNCIÓN HELPER REUTILIZABLE
  /**
   * Ejecuta una operación async con manejo de loading y errores
   * Función interna reutilizable para evitar duplicación de try/catch
   */
  const executeOperation = useCallback(async (operation, options = {}) => {
    const { successMessage, onSuccess } = options;

    setError(null);
    setLoading(true);

    try {
      const result = await operation();

      if (successMessage) {
        console.log("[Auth Success]:", successMessage);
        // TODO: Integrar con sistema de notificaciones (toast) (Pregintar por si acaso)
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      console.error("[Auth Error]:", errorMessage);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // FUNCIONES DE AUTENTICACIÓN
  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param {Object} credentials - Email/username y password
   * @returns {Promise<boolean>} true si el login fue exitoso
   */
  const login = useCallback(
    async (credentials) => {
      const result = await executeOperation(() => authApi.login(credentials), {
        successMessage: MESSAGES.SUCCESS.LOGIN,
        onSuccess: (data) => {
          const accessToken = data?.access_token || data?.token;
          const refreshToken = data?.refresh_token;
          const claims = accessToken ? decodeJwtPayload(accessToken) : null;
          const userData = claims
            ? {
                id: claims.sub,
                email: claims.email,
                role: claims.role,
                full_name: claims.full_name,
              }
            : data?.user;

          // Guardar tokens y datos mínimos del usuario
          saveAuthData(accessToken, userData, refreshToken);

          // Navegar al dashboard
          navigate(ROUTES.DASHBOARD, { replace: true });
        },
      });

      return result !== null;
    },
    [executeOperation, saveAuthData, navigate]
  );

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<boolean>} true si el logout fue exitoso
   */
  const logout = useCallback(async () => {
    const result = await executeOperation(
      async () => {
        // Intentar cerrar sesión en el servidor
        try {
          await authApi.logout();
        } catch {
          // Continuar incluso si falla el logout en el servidor
          console.warn(
            "[Auth] Server logout failed, proceeding with local logout"
          );
        }
        return true;
      },
      {
        successMessage: MESSAGES.SUCCESS.LOGOUT,
        onSuccess: () => {
          // Limpiar datos de autenticación
          clearAuthData();

          // Navegar al login
          navigate(ROUTES.LOGIN, { replace: true });
        },
      }
    );

    return result !== null;
  }, [executeOperation, clearAuthData, navigate]);

  /**
   * Solicita recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<boolean>} true si la solicitud fue exitosa
   */
  const forgotPassword = useCallback(
    async (email) => {
      const result = await executeOperation(
        () => authApi.forgotPassword(email),
        {
          successMessage: MESSAGES.SUCCESS.PASSWORD_RESET_SENT,
        }
      );

      return result !== null;
    },
    [executeOperation]
  );

  /**
   * Restablece la contraseña con un token
   * @param {Object} data - Token, password y confirmación
   * @returns {Promise<boolean>} true si se restableció correctamente
   */
  const resetPassword = useCallback(
    async (data) => {
      const result = await executeOperation(() => authApi.resetPassword(data), {
        successMessage: MESSAGES.SUCCESS.PASSWORD_CHANGED,
        onSuccess: () => {
          // Navegar al login después de cambiar contraseña
          navigate(ROUTES.LOGIN, {
            replace: true,
            state: {
              message: "Contraseña actualizada. Por favor, inicia sesión.",
            },
          });
        },
      });

      return result !== null;
    },
    [executeOperation, navigate]
  );

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // RETORNO DEL HOOK

  return {
    // Funciones de autenticación
    login,
    logout,
    forgotPassword,
    resetPassword,

    // Estado
    loading,
    error,
    user,
    isAuthenticated,

    // Helpers
    clearError,
  };
};

export default useAuth;
