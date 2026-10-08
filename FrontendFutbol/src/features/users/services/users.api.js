/**
 * API de Usuarios
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de usuarios.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const usersApi = {
  /**
   * Obtiene la lista de usuarios con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página
   * @param {number} params.limit - Cantidad por página
   * @param {string} params.search - Término de búsqueda
   * @param {string} params.role - Filtro por rol
   * @returns {Promise<Object>} Lista paginada de usuarios
   */
  getAll: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.USERS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Obtiene un usuario por su ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  getById: async (id) => {
    const response = await http.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Usuario creado
   */
  create: async (userData) => {
    const response = await http.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  /**
   * Actualiza un usuario existente
   * @param {string|number} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  update: async (id, userData) => {
    const response = await http.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data;
  },

  /**
   * Desactiva un usuario (soft delete)
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Usuario desactivado
   */
  desactivate: async (id) => {
    const response = await http.patch(API_ENDPOINTS.USERS.DESACTIVATE(id));
    return response.data;
  },

  /**
   * Activa un usuario inactivo
   * @param {string|number} id - ID del usuario
   * @returns {Promise<Object>} Usuario activado
   */
  activate: async (id) => {
    const response = await http.patch(API_ENDPOINTS.USERS.ACTIVATE(id));
    return response.data;
  },

  /**
   * Cambia el estado activo/inactivo de un usuario
   * @param {string|number} id - ID del usuario
   * @param {boolean} active - Nuevo estado
   * @returns {Promise<Object>} Usuario actualizado
   */
  toggleStatus: async (id, active) => {
    const response = await http.patch(API_ENDPOINTS.USERS.BY_ID(id), {
      active,
    });
    return response.data;
  },

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} Datos del usuario actual
   */
  getMe: async () => {
    const response = await http.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};

export default usersApi;
