/**
 * API de Deportistas
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de deportistas.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const athletesApi = {
  /**
   * Obtiene la lista de deportistas con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página
   * @param {number} params.limit - Cantidad por página
   * @param {string} params.search - Término de búsqueda
   * @param {string} params.category - Filtro por categoría
   * @returns {Promise<Object>} Lista paginada de deportistas
   */
  getAll: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.ATHLETES.GET_ALL, { params });
    return response.data;
  },

  /**
   * Obtiene un deportista por su ID
   * @param {string|number} id - ID del deportista
   * @returns {Promise<Object>} Datos del deportista
   */
  getById: async (id) => {
    const response = await http.get(API_ENDPOINTS.ATHLETES.BY_ID(id));
    return response.data;
  },

  /**
   * Crea un nuevo deportista
   * @param {Object} athleteData - Datos del nuevo deportista
   * @returns {Promise<Object>} Deportista creado
   */
  create: async (athleteData) => {
    const response = await http.post(
      API_ENDPOINTS.ATHLETES.CREATE,
      athleteData
    );
    return response.data;
  },

  /**
   * Actualiza un deportista existente
   * @param {string|number} id - ID del deportista
   * @param {Object} athleteData - Datos a actualizar
   * @returns {Promise<Object>} Deportista actualizado
   */
  update: async (id, athleteData) => {
    const response = await http.put(
      API_ENDPOINTS.ATHLETES.UPDATE(id),
      athleteData
    );
    return response.data;
  },

  /**
   * Da de baja un deportista (soft delete)
   * @param {string|number} id - ID del deportista
   * @returns {Promise<Object>} Deportista dado de baja
   */
  desactivate: async (id) => {
    const response = await http.patch(API_ENDPOINTS.ATHLETES.DESACTIVATE(id));
    return response.data;
  },

  /**
   * Activa un deportista (revierte soft delete)
   * @param {string|number} id - ID del deportista
   * @returns {Promise<Object>} Deportista activado
   */
  activate: async (id) => {
    const response = await http.patch(API_ENDPOINTS.ATHLETES.ACTIVATE(id));
    return response.data;
  },

  /**
   * Obtiene las estadísticas individuales de un deportista
   * @param {string|number} id - ID del deportista
   * @returns {Promise<Object>} Estadísticas del deportista
   */
  getStats: async (id) => {
    const response = await http.get(API_ENDPOINTS.STATISTICS.BY_ATHLETE(id));
    return response.data;
  },
};

export default athletesApi;
