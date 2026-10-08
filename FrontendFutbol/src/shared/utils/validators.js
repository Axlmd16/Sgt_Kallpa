/**
 * ==============================================
 * Validators - Kallpa UNL
 * ==============================================
 * 
 * Utilidades de validación reutilizables.
 */

export const isEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

export const isPhoneEC = (value = '') => /^[0-9]{10}$/.test(String(value).trim());

export const minLength = (value = '', min = 1) => String(value).trim().length >= min;

export const required = (value) => String(value ?? '').trim().length > 0;
