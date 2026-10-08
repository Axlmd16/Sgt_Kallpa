/**
 * ==============================================
 * Select Base - Kallpa UNL
 * ==============================================
 *
 * Select reutilizable con:
 * - label
 * - error
 * - placeholder
 * - opciones dinámicas
 * - soporte para formularios controlados
 */

import PropTypes from "prop-types";

const sizes = {
  sm: "select-sm",
  md: "select-md",
  lg: "select-lg",
};

const Select = ({
  label,
  error,
  options = [],
  placeholder = "Seleccione una opción",
  size = "md",
  className = "",
  id,
  disabled = false,
  ...props
}) => {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <select
        id={selectId}
        disabled={disabled}
        className={[
          "select select-bordered w-full",
          sizes[size] || sizes.md,
          error ? "select-error" : "",
          disabled ? "select-disabled" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

Select.propTypes = {
  /** Texto del label */
  label: PropTypes.string,
  /** Mensaje de error */
  error: PropTypes.string,
  /** Opciones del select: [{ value: 'x', label: 'X' }] */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  /** Texto del placeholder */
  placeholder: PropTypes.string,
  /** Tamaño: sm, md, lg */
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  /** Clases adicionales */
  className: PropTypes.string,
  /** ID del elemento */
  id: PropTypes.string,
  /** Nombre del campo (para formularios) */
  name: PropTypes.string,
  /** Valor seleccionado */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Handler de cambio */
  onChange: PropTypes.func,
  /** Estado deshabilitado */
  disabled: PropTypes.bool,
  /** Campo requerido */
  required: PropTypes.bool,
};

export default Select;
