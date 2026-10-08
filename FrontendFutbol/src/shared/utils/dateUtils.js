/**
 * Utilidades para manejo de fechas
 */

/**
 * Formatea una fecha ISO a formato local legible
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} Fecha formateada (DD/MM/YYYY)
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/**
 * Formatea una hora
 * @param {string} timeString - Hora en formato HH:mm
 * @returns {string} Hora formateada
 */
export const formatTime = (timeString) => {
  if (!timeString) return "-";
  return timeString;
};

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
 * @returns {string} Fecha actual
 */
export const getTodayISO = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Verifica si una fecha es en el futuro
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {boolean} true si la fecha es futura
 */
export const isFutureDate = (isoDate) => {
  const date = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Convierte una fecha local a formato ISO
 * @param {Date} date - Objeto Date
 * @returns {string} Fecha en formato ISO
 */
export const dateToISO = (date) => {
  return date.toISOString();
};
