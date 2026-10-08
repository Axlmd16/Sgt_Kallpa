/**
 * API de Asistencias
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de asistencias.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const attendanceApi = {
  /**
   * Crea o actualiza asistencias en lote para una fecha específica
   * @param {Object} data - Datos de asistencia
   * @param {string} data.date - Fecha en formato YYYY-MM-DD
   * @param {string} [data.time] - Hora opcional en formato HH:MM
   * @param {Array} data.records - Lista de registros de asistencia
   * @param {number} data.records[].athlete_id - ID del atleta
   * @param {boolean} data.records[].is_present - Si está presente
   * @param {string} [data.records[].justification] - Justificación si está ausente
   * @returns {Promise<Object>} Resultado del registro
   */
  createBulk: async (data) => {
    const response = await http.post(API_ENDPOINTS.ATTENDANCE.BULK, data);
    return response.data;
  },

  /**
   * Obtiene asistencias por fecha con filtros opcionales
   * @param {Object} params - Parámetros de consulta
   * @param {string} params.date - Fecha en formato YYYY-MM-DD (requerido)
   * @param {string} [params.type_athlete] - Tipo de atleta para filtrar
   * @param {string} [params.search] - Búsqueda por nombre o DNI
   * @param {number} [params.page] - Página
   * @param {number} [params.limit] - Límite por página
   * @returns {Promise<Object>} Lista paginada de asistencias
   */
  getByDate: async (params) => {
    const response = await http.get(API_ENDPOINTS.ATTENDANCE.BY_DATE, {
      params,
    });
    return response.data;
  },

  /**
   * Obtiene resumen estadístico de asistencia por fecha
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Object>} Resumen con total, presentes y ausentes
   */
  getSummary: async (date) => {
    const response = await http.get(API_ENDPOINTS.ATTENDANCE.SUMMARY, {
      params: { date },
    });
    return response.data;
  },

  /**
   * Obtiene lista de fechas con registros de asistencia
   * @returns {Promise<Object>} Lista de fechas
   */
  getDates: async () => {
    const response = await http.get(API_ENDPOINTS.ATTENDANCE.DATES);
    return response.data;
  },
};

export default attendanceApi;
