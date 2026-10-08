/**
 * API de Evaluaciones
 *
 * Servicio que encapsula todas las llamadas HTTP
 * relacionadas con la gestión de evaluaciones y tests.
 */

import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const evaluationsApi = {
  // ===============================================
  // EVALUACIONES - CRUD
  // ===============================================

  /**
   * Obtiene la lista de evaluaciones con paginación
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página (default: 1)
   * @param {number} params.limit - Cantidad por página
   * @param {number} [params.user_id] - Filtrar por usuario
   * @param {string} [params.search] - Búsqueda por nombre
   * @param {string} [params.date] - Filtrar por fecha (YYYY-MM-DD)
   * @param {string} [params.location] - Filtrar por ubicación
   * @returns {Promise<Object>} Lista paginada de evaluaciones con total
   */
  getAll: async (params = { page: 1, limit: 20 }) => {
    const response = await http.get(API_ENDPOINTS.EVALUATIONS.BASE, {
      params,
      skipErrorToast: true,
    });
    return response.data;
  },

  /**
   * Obtiene una evaluación por su ID
   * @param {string|number} id - ID de la evaluación
   * @returns {Promise<Object>} Datos de la evaluación
   */
  getById: async (id) => {
    const response = await http.get(API_ENDPOINTS.EVALUATIONS.BY_ID(id), {
      skipErrorToast: true,
    });
    return response.data;
  },

  /**
   * Obtiene evaluaciones de un usuario específico
   * @param {string|number} userId - ID del usuario
   * @returns {Promise<Object>} Evaluaciones del usuario
   */
  getByUser: async (userId) => {
    const response = await http.get(API_ENDPOINTS.EVALUATIONS.BY_USER(userId), {
      skipErrorToast: true,
    });
    return response.data;
  },

  /**
   * Crea una nueva evaluación
   * @param {Object} evaluationData - Datos de la evaluación
   * @param {string} evaluationData.name - Nombre de la evaluación
   * @param {string} evaluationData.date - Fecha ISO
   * @param {string} evaluationData.time - Hora (HH:mm)
   * @param {number} evaluationData.user_id - ID del usuario creador
   * @param {string} [evaluationData.location] - Ubicación (opcional)
   * @param {string} [evaluationData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Evaluación creada
   */
  create: async (evaluationData) => {
    const response = await http.post(
      API_ENDPOINTS.EVALUATIONS.CREATE,
      evaluationData,
      { skipErrorToast: true }
    );
    return response.data;
  },

  /**
   * Actualiza una evaluación existente
   * @param {string|number} id - ID de la evaluación
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Evaluación actualizada
   */
  update: async (id, updateData) => {
    const response = await http.put(
      API_ENDPOINTS.EVALUATIONS.UPDATE(id),
      updateData,
      { skipErrorToast: true }
    );
    return response.data;
  },

  /**
   * Elimina una evaluación (soft delete)
   * @param {string|number} id - ID de la evaluación
   * @returns {Promise<Object>} Evaluación eliminada
   */
  delete: async (id) => {
    const response = await http.delete(
      API_ENDPOINTS.EVALUATIONS.DELETE(id),
      { skipErrorToast: true }
    );
    return response.data;
  },

  // ===============================================
  // TESTS - SPRINT
  // ===============================================

  /**
   * Crea un test de velocidad (sprint)
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {number} testData.distance_meters - Distancia en metros
   * @param {number} testData.time_0_10_s - Tiempo 0-10m en segundos
   * @param {number} testData.time_0_30_s - Tiempo 0-30m en segundos
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createSprintTest: async (testData) => {
    const response = await http.post(API_ENDPOINTS.TESTS.SPRINT, testData, {
      skipErrorToast: true,
    });
    return response.data;
  },

  // ===============================================
  // TESTS - YOYO
  // ===============================================

  /**
   * Crea un test Yoyo
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {number} testData.shuttle_count - Número de lanzaderas
   * @param {string} testData.final_level - Nivel final alcanzado
   * @param {number} testData.failures - Cantidad de fallos
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createYoyoTest: async (testData) => {
    const response = await http.post(API_ENDPOINTS.TESTS.YOYO, testData, {
      skipErrorToast: true,
    });
    return response.data;
  },

  // ===============================================
  // TESTS - RESISTENCIA
  // ===============================================

  /**
   * Crea un test de resistencia
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {number} testData.min_duration - Duración en minutos
   * @param {number} testData.total_distance_m - Distancia total en metros
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createEnduranceTest: async (testData) => {
    const response = await http.post(
      API_ENDPOINTS.TESTS.ENDURANCE,
      testData,
      { skipErrorToast: true }
    );
    return response.data;
  },

  // ===============================================
  // TESTS - TÉCNICO
  // ===============================================

  /**
   * Crea una evaluación técnica
   * @param {Object} testData - Datos del test
   * @param {number} testData.athlete_id - ID del deportista
   * @param {string} testData.date - Fecha ISO
   * @param {number} testData.evaluation_id - ID de la evaluación
   * @param {string} testData.ball_control - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.short_pass - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.long_pass - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.shooting - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} testData.dribbling - Escala: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
   * @param {string} [testData.observations] - Observaciones (opcional)
   * @returns {Promise<Object>} Test creado
   */
  createTechnicalAssessment: async (testData) => {
    const response = await http.post(
      API_ENDPOINTS.TESTS.TECHNICAL,
      testData,
      { skipErrorToast: true }
    );
    return response.data;
  },

  // ===============================================
  // TESTS - OBTENER
  // ===============================================

  /**
   * Obtiene tests de velocidad (sprint) con paginación
   * @param {Object} params - Parámetros de filtrado
   * @param {number} [params.evaluation_id] - Filtrar por evaluación
   * @param {number} [params.athlete_id] - Filtrar por atleta
   * @param {string} [params.search] - Búsqueda por nombre de atleta
   * @param {number} [params.page] - Número de página (default: 1)
   * @param {number} [params.limit] - Límite de registros (default: 10)
   * @returns {Promise<Object>} { items: [], total: number }
   */
  getSprintTests: async (params = { page: 1, limit: 10 }) => {
    const response = await http.get(API_ENDPOINTS.TESTS.SPRINT, {
      params,
      skipErrorToast: true,
    });
    return response.data;
  },

  /**
   * Obtiene tests Yoyo con paginación
   * @param {Object} params - Parámetros de filtrado
   * @param {number} [params.evaluation_id] - Filtrar por evaluación
   * @param {number} [params.athlete_id] - Filtrar por atleta
   * @param {string} [params.search] - Búsqueda por nombre de atleta
   * @param {number} [params.page] - Número de página (default: 1)
   * @param {number} [params.limit] - Límite de registros (default: 10)
   * @returns {Promise<Object>} { items: [], total: number }
   */
  getYoyoTests: async (params = { page: 1, limit: 10 }) => {
    const response = await http.get(API_ENDPOINTS.TESTS.YOYO, {
      params,
      skipErrorToast: true,
    });
    return response.data;
  },

  /**
   * Obtiene tests de resistencia (endurance) con paginación
   * @param {Object} params - Parámetros de filtrado
   * @param {number} [params.evaluation_id] - Filtrar por evaluación
   * @param {number} [params.athlete_id] - Filtrar por atleta
   * @param {string} [params.search] - Búsqueda por nombre de atleta
   * @param {number} [params.page] - Número de página (default: 1)
   * @param {number} [params.limit] - Límite de registros (default: 10)
   * @returns {Promise<Object>} { items: [], total: number }
   */
  getEnduranceTests: async (params = { page: 1, limit: 10 }) => {
    const response = await http.get(API_ENDPOINTS.TESTS.ENDURANCE, {
      params,
      skipErrorToast: true,
    });
    return response.data;
  },

  /**
   * Obtiene evaluaciones técnicas con paginación
   * @param {Object} params - Parámetros de filtrado
   * @param {number} [params.evaluation_id] - Filtrar por evaluación
   * @param {number} [params.athlete_id] - Filtrar por atleta
   * @param {string} [params.search] - Búsqueda por nombre de atleta
   * @param {number} [params.page] - Número de página (default: 1)
   * @param {number} [params.limit] - Límite de registros (default: 10)
   * @returns {Promise<Object>} { items: [], total: number }
   */
  getTechnicalAssessments: async (params = { page: 1, limit: 10 }) => {
    const response = await http.get(API_ENDPOINTS.TESTS.TECHNICAL, {
      params,
      skipErrorToast: true,
    });
    return response.data;
  },

  // ===============================================
  // TESTS - ACTUALIZAR
  // ===============================================

  /**
   * Actualiza un test de velocidad
   * @param {number} testId - ID del test
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Test actualizado
   */
  updateSprintTest: async (testId, updateData) => {
    const response = await http.patch(
      `${API_ENDPOINTS.TESTS.SPRINT}/${testId}`,
      updateData
    );
    return response.data;
  },

  /**
   * Actualiza un test Yoyo
   * @param {number} testId - ID del test
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Test actualizado
   */
  updateYoyoTest: async (testId, updateData) => {
    const response = await http.patch(
      `${API_ENDPOINTS.TESTS.YOYO}/${testId}`,
      updateData
    );
    return response.data;
  },

  /**
   * Actualiza un test de resistencia
   * @param {number} testId - ID del test
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Test actualizado
   */
  updateEnduranceTest: async (testId, updateData) => {
    const response = await http.patch(
      `${API_ENDPOINTS.TESTS.ENDURANCE}/${testId}`,
      updateData
    );
    return response.data;
  },

  /**
   * Actualiza una evaluación técnica
   * @param {number} testId - ID del test
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Test actualizado
   */
  updateTechnicalAssessment: async (testId, updateData) => {
    const response = await http.patch(
      `${API_ENDPOINTS.TESTS.TECHNICAL}/${testId}`,
      updateData
    );
    return response.data;
  },

  // ===============================================
  // TESTS - ELIMINAR
  // ===============================================

  /**
   * Elimina un test de velocidad
   * @param {number} testId - ID del test
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  deleteSprintTest: async (testId) => {
    const response = await http.delete(
      `${API_ENDPOINTS.TESTS.SPRINT}/${testId}`
    );
    return response.data;
  },

  /**
   * Elimina un test Yoyo
   * @param {number} testId - ID del test
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  deleteYoyoTest: async (testId) => {
    const response = await http.delete(
      `${API_ENDPOINTS.TESTS.YOYO}/${testId}`
    );
    return response.data;
  },

  /**
   * Elimina un test de resistencia
   * @param {number} testId - ID del test
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  deleteEnduranceTest: async (testId) => {
    const response = await http.delete(
      `${API_ENDPOINTS.TESTS.ENDURANCE}/${testId}`
    );
    return response.data;
  },

  /**
   * Elimina una evaluación técnica
   * @param {number} testId - ID del test
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  deleteTechnicalAssessment: async (testId) => {
    const response = await http.delete(
      `${API_ENDPOINTS.TESTS.TECHNICAL}/${testId}`
    );
    return response.data;
  },

  // ===============================================
  // TESTS - CONSULTAS COMBINADAS
  // ===============================================

  /**
   * Obtiene todos los tests de una evaluación
   * @param {number} evaluationId - ID de la evaluación
   * @param {Object} options - Opciones de paginación y búsqueda
   * @param {number} [options.page] - Número de página
   * @param {number} [options.limit] - Límite de registros
   * @param {string} [options.search] - Búsqueda por nombre de atleta
   * @returns {Promise<Object>} Tests agrupados por tipo
   */
  getTestsByEvaluation: async (evaluationId, options = {}) => {
    const params = { 
      evaluation_id: evaluationId,
      page: options.page || 1,
      limit: options.limit || 100, // Límite máximo permitido por el backend
      ...(options.search && { search: options.search })
    };
    
    // Hacer llamadas en paralelo para obtener todos los tipos de test
    const [sprint, yoyo, endurance, technical] = await Promise.all([
      evaluationsApi.getSprintTests(params).catch(() => ({ data: { items: [], total: 0 } })),
      evaluationsApi.getYoyoTests(params).catch(() => ({ data: { items: [], total: 0 } })),
      evaluationsApi.getEnduranceTests(params).catch(() => ({ data: { items: [], total: 0 } })),
      evaluationsApi.getTechnicalAssessments(params).catch(() => ({ data: { items: [], total: 0 } })),
    ]);

    // Extraer datos de la respuesta del backend
    const sprintData = sprint.data || { items: [], total: 0 };
    const yoyoData = yoyo.data || { items: [], total: 0 };
    const enduranceData = endurance.data || { items: [], total: 0 };
    const technicalData = technical.data || { items: [], total: 0 };

    // Combinar todos los tests
    return {
      sprint_tests: sprintData.items || [],
      yoyo_tests: yoyoData.items || [],
      endurance_tests: enduranceData.items || [],
      technical_assessments: technicalData.items || [],
      all: [
        ...(sprintData.items || []),
        ...(yoyoData.items || []),
        ...(enduranceData.items || []),
        ...(technicalData.items || []),
      ],
      total: (sprintData.total || 0) + (yoyoData.total || 0) + (enduranceData.total || 0) + (technicalData.total || 0),
    };
  },
};

export default evaluationsApi;
