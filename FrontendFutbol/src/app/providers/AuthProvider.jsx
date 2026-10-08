/**
 * Proveedor de Autenticación - Kallpa UNL
 *
 * Context Provider que maneja el estado global de autenticación.
 * Da acceso sobre el usuario actual y funciiones de authetificacion a trabes de toda la app.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import {
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
} from "../config/constants";

/**
 * Contexto de autenticación
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider - Componente proveedor del contexto de autenticación
 */
const AuthProvider = ({ children }) => {
  // Estado del usuario actual
  const [user, setUser] = useState(null);

  // Estado de carga inicial (verificando sesión existente)
  const [isLoading, setIsLoading] = useState(true);

  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Efecto para verificar sesión existente al cargar la app
   * Intenta recuperar datos del usuario desde localStorage
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Obtener token y datos del usuario
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userData = localStorage.getItem(USER_DATA_KEY);

        // Si existe token y datos, restaurar sesión
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Si hay error parseando, limpiar datos corruptos
        console.error("[AuthProvider] Error initializing auth:", error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      } finally {
        // Marcar como cargado
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // FUNCIONES DE AUTENTICACIÓN
  /**
   * Guarda los datos de autenticación en el estado y localStorage
   * @param {string} token - Access Token JWT
   * @param {Object} userData - Datos del usuario
   * @param {string} refreshToken - Refresh Token JWT (opcional)
   */
  const saveAuthData = useCallback((token, userData, refreshToken = null) => {
    // Guardar en localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
    }

    // Actualizar estado
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  /**
   * Limpia los datos de autenticación
   */
  const clearAuthData = useCallback(() => {
    // Limpiar localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);

    // Limpiar estado
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Actualiza los datos del usuario en el contexto
   * @param {Object} newUserData - Nuevos datos del usuario
   */
  const updateUser = useCallback(
    (newUserData) => {
      // Mezclar datos existentes con nuevos
      const updatedUser = { ...user, ...newUserData };

      // Actualizar localStorage
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));

      // Actualizar estado
      setUser(updatedUser);
    },
    [user]
  );

  // VALOR DEL CONTEXTO
  /**
   * Valor memoizado del contexto
   * Incluye estado y funciones de autenticación
   */
  const contextValue = useMemo(
    () => ({
      // Estado
      user,
      isLoading,
      isAuthenticated,

      // Funciones
      saveAuthData,
      clearAuthData,
      updateUser,

      // Helpers
      hasRole: (role) => user?.role === role || user?.rol === role,
      hasAnyRole: (roles) =>
        roles.includes(user?.role) || roles.includes(user?.rol),
    }),
    [user, isLoading, isAuthenticated, saveAuthData, clearAuthData, updateUser]
  );

  // RENDER
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Validación de PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
