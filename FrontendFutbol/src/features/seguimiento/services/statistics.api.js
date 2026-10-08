/**
 * API de Estadísticas
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con estadísticas del club.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const statisticsApi = {
  /**
   * Obtiene métricas generales del club
   * @param {Object} params - Parámetros opcionales
   * @param {string} [params.type_athlete] - Filtro por tipo de atleta
   * @param {string} [params.sex] - Filtro por sexo
   * @returns {Promise<Object>} Métricas del club
   */
  getClubOverview: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.STATISTICS.OVERVIEW, {
      params,
    });
    return response.data;
  },

  /**
   * Obtiene estadísticas de asistencia
   * @param {Object} params - Parámetros de consulta
   * @param {string} [params.start_date] - Fecha de inicio (YYYY-MM-DD)
   * @param {string} [params.end_date] - Fecha de fin (YYYY-MM-DD)
   * @param {string} [params.type_athlete] - Filtro por tipo de atleta
   * @param {string} [params.sex] - Filtro por sexo
   * @returns {Promise<Object>} Estadísticas de asistencia
   */
  getAttendanceStats: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.STATISTICS.ATTENDANCE, {
      params,
    });
    return response.data;
  },

  /**
   * Obtiene estadísticas de rendimiento en tests
   * @param {Object} params - Parámetros de consulta
   * @param {string} [params.start_date] - Fecha de inicio (YYYY-MM-DD)
   * @param {string} [params.end_date] - Fecha de fin (YYYY-MM-DD)
   * @param {string} [params.type_athlete] - Filtro por tipo de atleta
   * @returns {Promise<Object>} Estadísticas de tests
   */
  getTestPerformance: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.STATISTICS.TESTS, {
      params,
    });
    return response.data;
  },
};

export default statisticsApi;
