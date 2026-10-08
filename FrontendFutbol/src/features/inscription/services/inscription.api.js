import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const inscriptionApi = {
  /**
   * Register a new adult athlete (UNL)
   * @param {Object} athletePayload
   * @returns {Promise}
   */
  registerDeportista: async (athletePayload) => {
    const response = await http.post(
      API_ENDPOINTS.ATHLETES.CREATE,
      athletePayload,
      { skipErrorToast: true }
    );
    return response.data;
  },

  /**
   * Register a minor athlete with their representative
   * @param {Object} payload - { representative: {...}, athlete: {...} }
   * @returns {Promise}
   */
  registerMenor: async (payload) => {
    const response = await http.post(
      API_ENDPOINTS.ATHLETES.REGISTER_MINOR,
      payload,
      { skipErrorToast: true }
    );
    return response.data;
  },

  /**
   * Check if a representative exists by DNI
   * @param {string} dni
   * @returns {Promise}
   */
  getRepresentativeByDni: async (dni) => {
    try {
      const response = await http.get(`/representatives/by-dni/${dni}`);
      return response.data;
    } catch (error) {
      // Si es 404, retornar null (representante no existe)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

export default inscriptionApi;
