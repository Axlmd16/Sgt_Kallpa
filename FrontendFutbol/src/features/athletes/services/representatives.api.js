/**
 * API de Representantes
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de representantes.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const representativesApi = {
  /**
   * Obtiene la lista de representantes con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página
   * @param {number} params.limit - Cantidad por página
   * @param {string} params.search - Término de búsqueda
   * @returns {Promise<Object>} Lista paginada de representantes
   */
  getAll: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.REPRESENTATIVES.GET_ALL, {
      params,
    });
    return response.data;
  },

  /**
   * Obtiene un representante por su ID
   * @param {string|number} id - ID del representante
   * @returns {Promise<Object>} Datos del representante
   */
  getById: async (id) => {
    const response = await http.get(API_ENDPOINTS.REPRESENTATIVES.BY_ID(id));
    return response.data;
  },

  /**
   * Busca un representante por DNI
   * @param {string} dni - DNI del representante
   * @returns {Promise<Object|null>} Datos del representante o null si no existe
   */
  getByDni: async (dni) => {
    try {
      const response = await http.get(
        API_ENDPOINTS.REPRESENTATIVES.BY_DNI(dni)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Crea un nuevo representante
   * @param {Object} data - Datos del nuevo representante
   * @returns {Promise<Object>} Representante creado
   */
  create: async (data) => {
    const response = await http.post(
      API_ENDPOINTS.REPRESENTATIVES.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Actualiza un representante existente
   * @param {string|number} id - ID del representante
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Representante actualizado
   */
  update: async (id, data) => {
    const response = await http.put(
      API_ENDPOINTS.REPRESENTATIVES.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Desactiva un representante (soft delete)
   * @param {string|number} id - ID del representante
   * @returns {Promise<Object>} Resultado de la operación
   */
  deactivate: async (id) => {
    const response = await http.patch(
      API_ENDPOINTS.REPRESENTATIVES.DEACTIVATE(id)
    );
    return response.data;
  },

  /**
   * Activa un representante
   * @param {string|number} id - ID del representante
   * @returns {Promise<Object>} Resultado de la operación
   */
  activate: async (id) => {
    const response = await http.patch(
      API_ENDPOINTS.REPRESENTATIVES.ACTIVATE(id)
    );
    return response.data;
  },
};

export default representativesApi;
