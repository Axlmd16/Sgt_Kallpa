/**
 * ==============================================
 * Formatters - Kallpa UNL
 * ==============================================
 * 
 * Utilidades de formateo reutilizables.
 */

export const formatDate = (dateLike) => {
  if (!dateLike) return '';
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
};

export const formatNumber = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('es-EC').format(n);
};

export const formatPercent = (value, decimals = 0) => {
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  return `${n.toFixed(decimals)}%`;
};
