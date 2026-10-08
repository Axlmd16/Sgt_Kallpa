/**
 * API de Pasantes (Interns)
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de pasantes.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const internsApi = {
  /**
   * Obtiene la lista de pasantes con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página
   * @param {number} params.limit - Cantidad por página
   * @param {string} params.search - Término de búsqueda
   * @returns {Promise<Object>} Lista paginada de pasantes
   */
  getAll: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.INTERNS.GET_ALL, { params });
    return response.data;
  },

  /**
   * Promueve un atleta a pasante
   * @param {number} athleteId - ID del atleta a promover
   * @param {Object} data - Datos para crear la cuenta
   * @param {string} data.email - Email del pasante
   * @param {string} data.password - Contraseña del pasante
   * @returns {Promise<Object>} Datos del pasante creado
   */
  promote: async (athleteId, data) => {
    const response = await http.post(
      API_ENDPOINTS.INTERNS.PROMOTE(athleteId),
      data
    );
    return response.data;
  },

  /**
   * Activa un pasante
   * @param {number} id - ID del pasante
   * @returns {Promise<Object>} Respuesta del servidor
   */
  activate: async (id) => {
    const response = await http.patch(API_ENDPOINTS.INTERNS.ACTIVATE(id));
    return response.data;
  },

  /**
   * Desactiva un pasante
   * @param {number} id - ID del pasante
   * @returns {Promise<Object>} Respuesta del servidor
   */
  deactivate: async (id) => {
    const response = await http.patch(API_ENDPOINTS.INTERNS.DEACTIVATE(id));
    return response.data;
  },
};

export default internsApi;
