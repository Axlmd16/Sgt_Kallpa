/**
 * Utilidades para evaluación de rendimiento deportivo
 * Los valores están normalizados en escala 0-100
 */

/**
 * Obtiene el nivel de rendimiento basado en un valor 0-100
 * @param {number} value - Valor de la estadística (0-100)
 * @returns {{ level: string, color: string, badgeClass: string }}
 */
export const getPerformanceLevel = (value) => {
  if (value == null || isNaN(value)) {
    return {
      level: "Sin datos",
      color: "text-base-content/50",
      badgeClass: "badge-ghost",
    };
  }

  if (value >= 80) {
    return {
      level: "Excelente",
      color: "text-success",
      badgeClass: "badge-success",
    };
  }
  if (value >= 60) {
    return {
      level: "Bueno",
      color: "text-info",
      badgeClass: "badge-info",
    };
  }
  if (value >= 40) {
    return {
      level: "Regular",
      color: "text-warning",
      badgeClass: "badge-warning",
    };
  }
  return {
    level: "Bajo",
    color: "text-error",
    badgeClass: "badge-error",
  };
};

/**
 * Formatea el valor de estadística para mostrar
 * @param {number} value - Valor de la estadística
 * @returns {string} Valor formateado
 */
export const formatStatValue = (value) => {
  if (value == null || isNaN(value)) return "-";
  return `${Math.round(value)} / 100`;
};

/**
 * Escala de rendimiento para documentación
 */
export const PERFORMANCE_SCALE = [
  { min: 80, max: 100, level: "Excelente", color: "success" },
  { min: 60, max: 79, level: "Bueno", color: "info" },
  { min: 40, max: 59, level: "Regular", color: "warning" },
  { min: 0, max: 39, level: "Bajo", color: "error" },
];
