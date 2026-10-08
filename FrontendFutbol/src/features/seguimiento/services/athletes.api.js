/**
 * API de Atletas
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de atletas.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const athletesApi = {
  /**
   * Obtiene la lista de atletas con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página
   * @param {number} params.limit - Cantidad por página
   * @param {string} [params.search] - Término de búsqueda por nombre o DNI
   * @param {string} [params.type_athlete] - Tipo de atleta
   * @param {string} [params.sex] - Sexo del atleta
   * @returns {Promise<Object>} Lista paginada de atletas
   */
  getAll: async (params = {}) => {
    const response = await http.get(API_ENDPOINTS.ATHLETES.GET_ALL, { params });
    return response.data;
  },

  /**
   * Obtiene un atleta por su ID
   * @param {string|number} id - ID del atleta
   * @returns {Promise<Object>} Datos del atleta
   */
  getById: async (id) => {
    const response = await http.get(API_ENDPOINTS.ATHLETES.BY_ID(id));
    return response.data;
  },

  /**
   * Registra un nuevo atleta UNL
   * @param {Object} athleteData - Datos del nuevo atleta
   * @returns {Promise<Object>} Atleta creado
   */
  create: async (athleteData) => {
    const response = await http.post(
      API_ENDPOINTS.ATHLETES.CREATE,
      athleteData
    );
    return response.data;
  },
};

export default athletesApi;
