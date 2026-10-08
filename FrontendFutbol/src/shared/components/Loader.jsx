/**
 * ==============================================
 * Loader / Spinner - Kallpa UNL
 * ==============================================
 * 
 * Indicador de carga reutilizable.
 */

import PropTypes from 'prop-types';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-4',
};

const Loader = ({ size = 'md' }) => {
  return (
    <div
      className={[
        'animate-spin rounded-full border-gray-300 border-t-blue-600',
        sizes[size] || sizes.md,
      ].join(' ')}
      aria-label="Cargando"
      role="status"
    />
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Loader;
