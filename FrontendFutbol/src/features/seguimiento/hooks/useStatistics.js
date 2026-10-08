/**
 * useStatistics Hook
 *
 * Custom hook para manejar estadísticas con TanStack Query.
 * Implementa cache de 5 minutos para evitar recargas innecesarias.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import statisticsApi from "../services/statistics.api";
// Import from athletes feature (has getStats method)
import athletesApi from "@/features/athletes/services/athletes.api";
import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

// Query keys centralizados para invalidación consistente
export const STATISTICS_KEYS = {
  all: ["statistics"],
  overview: (filters) => ["statistics", "overview", filters],
  attendance: (filters) => ["statistics", "attendance", filters],
  tests: (filters) => ["statistics", "tests", filters],
  athlete: (id) => ["statistics", "athlete", id],
  athleteTestsHistory: (id) => ["statistics", "athlete", id, "tests-history"],
};

// Configuración de cache común
const CACHE_CONFIG = {
  staleTime: 1000 * 60 * 5, // 5 minutos
  gcTime: 1000 * 60 * 10, // 10 minutos antes de garbage collection
  retry: 1,
};

/**
 * Hook para obtener el overview del club
 * @param {Object} filters - Filtros opcionales (type_athlete, sex, start_date, end_date)
 */
export const useClubOverview = (filters = {}) => {
  // Limpiar filtros vacíos para keys consistentes
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined),
  );

  return useQuery({
    queryKey: STATISTICS_KEYS.overview(cleanFilters),
    queryFn: () => statisticsApi.getClubOverview(cleanFilters),
    ...CACHE_CONFIG,
    select: (response) =>
      response?.status === "success" ? response.data : null,
  });
};

/**
 * Hook para obtener estadísticas de asistencia
 * @param {Object} filters - Filtros opcionales (type_athlete, sex, start_date, end_date)
 */
export const useAttendanceStats = (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined),
  );

  return useQuery({
    queryKey: STATISTICS_KEYS.attendance(cleanFilters),
    queryFn: () => statisticsApi.getAttendanceStats(cleanFilters),
    ...CACHE_CONFIG,
    select: (response) =>
      response?.status === "success" ? response.data : null,
  });
};

/**
 * Hook para obtener rendimiento en tests
 * @param {Object} filters - Filtros opcionales (type_athlete, start_date, end_date)
 */
export const useTestPerformance = (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined),
  );

  return useQuery({
    queryKey: STATISTICS_KEYS.tests(cleanFilters),
    queryFn: () => statisticsApi.getTestPerformance(cleanFilters),
    ...CACHE_CONFIG,
    select: (response) =>
      response?.status === "success" ? response.data : null,
  });
};

/**
 * Hook para obtener estadísticas individuales de un atleta
 * @param {string|number} athleteId - ID del atleta
 */
export const useAthleteStats = (athleteId) => {
  return useQuery({
    queryKey: STATISTICS_KEYS.athlete(athleteId),
    queryFn: () => athletesApi.getStats(athleteId),
    ...CACHE_CONFIG,
    enabled: !!athleteId,
    select: (response) =>
      response?.status === "success" ? response.data : null,
  });
};

/**
 * Hook para obtener información del atleta
 * @param {string|number} athleteId - ID del atleta
 */
export const useAthleteInfo = (athleteId) => {
  return useQuery({
    queryKey: ["athlete", "info", athleteId],
    queryFn: () => athletesApi.getById(athleteId),
    ...CACHE_CONFIG,
    enabled: !!athleteId,
    select: (response) => response?.data || null,
  });
};

/**
 * Hook para obtener historial de tests de un atleta
 * @param {string|number} athleteId - ID del atleta
 */
export const useAthleteTestsHistory = (athleteId) => {
  return useQuery({
    queryKey: STATISTICS_KEYS.athleteTestsHistory(athleteId),
    queryFn: async () => {
      const response = await http.get(
        API_ENDPOINTS.STATISTICS.TESTS_HISTORY(athleteId),
      );
      return response.data;
    },
    ...CACHE_CONFIG,
    enabled: !!athleteId,
    select: (response) =>
      response?.status === "success" ? response.data : null,
  });
};

/**
 * Hook para invalidar todas las estadísticas (forzar recarga)
 * Útil para el botón "Actualizar"
 */
export const useInvalidateStatistics = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: STATISTICS_KEYS.all });
    },
    invalidateOverview: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics", "overview"] });
    },
    invalidateAttendance: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics", "attendance"] });
    },
    invalidateTests: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics", "tests"] });
    },
    invalidateAthlete: (athleteId) => {
      queryClient.invalidateQueries({
        queryKey: STATISTICS_KEYS.athlete(athleteId),
      });
      queryClient.invalidateQueries({
        queryKey: ["athlete", "info", athleteId],
      });
    },
  };
};
