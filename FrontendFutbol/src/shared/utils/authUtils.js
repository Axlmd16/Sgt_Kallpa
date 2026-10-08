/**
 * Utilidades de Autenticación
 */

import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "@/app/config/constants";

/**
 * Obtiene el usuario actual desde localStorage
 * @returns {Object|null} Datos del usuario o null
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return null;
  }
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token o null
 */
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si está autenticado
 */
export const isAuthenticated = () => {
  return !!getAuthToken() && !!getCurrentUser();
};

/**
 * Obtiene un valor específico del usuario
 * @param {string} key - Clave del campo
 * @returns {any} Valor del campo
 */
export const getUserField = (key) => {
  const user = getCurrentUser();
  return user?.[key] || null;
};
