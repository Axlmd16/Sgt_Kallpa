/**
 * useInscriptions Hook
 *
 * Custom hook para manejar deportistas, representantes y pasantes con TanStack Query.
 * Implementa cache de 5 minutos para evitar recargas innecesarias.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import athletesApi from "../services/athletes.api";
import representativesApi from "../services/representatives.api";
import internsApi from "../services/interns.api";

// Query keys centralizados para invalidación consistente
export const INSCRIPTIONS_KEYS = {
  all: ["inscriptions"],
  athletes: (filters) => ["inscriptions", "athletes", filters],
  representatives: (filters) => ["inscriptions", "representatives", filters],
  interns: (filters) => ["inscriptions", "interns", filters],
  athleteDetail: (id) => ["inscriptions", "athlete", id],
  representativeDetail: (id) => ["inscriptions", "representative", id],
};

// Configuración de cache común
const CACHE_CONFIG = {
  staleTime: 1000 * 60 * 5, // 5 minutos
  gcTime: 1000 * 60 * 10, // 10 minutos antes de garbage collection
  retry: 1,
};

/**
 * Hook para obtener lista de deportistas con paginación y filtros
 * @param {Object} params - Parámetros de consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Cantidad por página
 * @param {string} params.search - Término de búsqueda
 * @param {string} params.type_athlete - Filtro por tipo de atleta
 */
export const useAthletes = (params = {}) => {
  // Limpiar parámetros vacíos para keys consistentes
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null
    )
  );

  return useQuery({
    queryKey: INSCRIPTIONS_KEYS.athletes(cleanParams),
    queryFn: () => athletesApi.getAll(cleanParams),
    ...CACHE_CONFIG,
    select: (response) => ({
      items: response?.data?.items || [],
      total: response?.data?.total || 0,
    }),
  });
};

/**
 * Hook para obtener lista de representantes con paginación y filtros
 * @param {Object} params - Parámetros de consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Cantidad por página
 * @param {string} params.search - Término de búsqueda
 */
export const useRepresentatives = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null
    )
  );

  return useQuery({
    queryKey: INSCRIPTIONS_KEYS.representatives(cleanParams),
    queryFn: () => representativesApi.getAll(cleanParams),
    ...CACHE_CONFIG,
    select: (response) => ({
      items: response?.data?.items || response?.items || [],
      total: response?.data?.total || response?.total || 0,
    }),
  });
};

/**
 * Hook para obtener lista de pasantes con paginación y filtros
 * @param {Object} params - Parámetros de consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Cantidad por página
 * @param {string} params.search - Término de búsqueda
 */
export const useInterns = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null
    )
  );

  return useQuery({
    queryKey: INSCRIPTIONS_KEYS.interns(cleanParams),
    queryFn: () => internsApi.getAll(cleanParams),
    ...CACHE_CONFIG,
    select: (response) => ({
      items: response?.data?.items || [],
      total: response?.data?.total || 0,
    }),
  });
};

/**
 * Hook para promover un atleta a pasante
 */
export const usePromoteAthlete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ athleteId, data }) => internsApi.promote(athleteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscriptions", "interns"] });
    },
  });
};

/**
 * Hook para obtener detalle de un deportista
 * @param {string|number} athleteId - ID del deportista
 */
export const useAthleteDetail = (athleteId) => {
  return useQuery({
    queryKey: INSCRIPTIONS_KEYS.athleteDetail(athleteId),
    queryFn: () => athletesApi.getById(athleteId),
    ...CACHE_CONFIG,
    enabled: !!athleteId,
    select: (response) => response?.data || null,
  });
};

/**
 * Hook para obtener detalle de un representante
 * @param {string|number} representativeId - ID del representante
 */
export const useRepresentativeDetail = (representativeId) => {
  return useQuery({
    queryKey: INSCRIPTIONS_KEYS.representativeDetail(representativeId),
    queryFn: () => representativesApi.getById(representativeId),
    ...CACHE_CONFIG,
    enabled: !!representativeId,
    select: (response) => response?.data || null,
  });
};

/**
 * Hook para invalidar datos de inscripciones (forzar recarga)
 */
export const useInvalidateInscriptions = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: INSCRIPTIONS_KEYS.all });
    },
    invalidateAthletes: () => {
      queryClient.invalidateQueries({
        queryKey: ["inscriptions", "athletes"],
      });
    },
    invalidateRepresentatives: () => {
      queryClient.invalidateQueries({
        queryKey: ["inscriptions", "representatives"],
      });
    },
    invalidateInterns: () => {
      queryClient.invalidateQueries({
        queryKey: ["inscriptions", "interns"],
      });
    },
    invalidateAthlete: (athleteId) => {
      queryClient.invalidateQueries({
        queryKey: INSCRIPTIONS_KEYS.athleteDetail(athleteId),
      });
    },
  };
};
