/**
 * ==============================================
 * useDebounce - Kallpa UNL
 * ==============================================
 * 
 * Hook para debouncing de valores (ej: búsqueda en tiempo real)
 * sin necesidad de librerías externas.
 */

import { useEffect, useState } from 'react';

const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
