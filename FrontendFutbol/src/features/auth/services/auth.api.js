/**
 * API de Autenticación
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con autenticación.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const unwrapData = (response) => response?.data?.data ?? response?.data ?? null;

/**
 * Servicio de autenticación
 * Contiene todos los métodos para interactuar con la API de auth
 */
const authApi = {
  /**
   * Inicia sesión con credenciales
   */
  login: async (credentials) => {
    const response = await http.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return unwrapData(response);
  },

  /**
   * Cierra la sesión del usuario actual
   * Invalida el token en el servidor
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  logout: async () => {
    // El backend actual no expone logout; limpiamos solo en cliente.
    return { status: "success" };
  },

  /**
   * Solicita recuperación de contraseña
   * Envía un email con instrucciones para restablecer
   *
   */
  forgotPassword: async (email) => {
    const response = await http.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return unwrapData(response);
  },

  /**
   * Restablece la contraseña con un token
   */
  resetPassword: async (data) => {
    const response = await http.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token: data.token,
      new_password: data.password || data.new_password,
    });
    return unwrapData(response);
  },

  /**
   * Obtiene los datos del usuario actual
   * Usa el token almacenado para identificar al usuario
   */
  getCurrentUser: async () => {
    const response = await http.get(API_ENDPOINTS.AUTH.ME);
    return unwrapData(response);
  },

  /**
   * Refresca el token de autenticación
   * @param {string} refreshToken - Token de refresco
   */
  refreshToken: async (refreshToken) => {
    const response = await http.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });
    return unwrapData(response);
  },

  /**
   * Cambia la contraseña del usuario autenticado
   */
  changePassword: async (data) => {
    const response = await http.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return unwrapData(response);
  },
};

export default authApi;
