/**
 * ==============================================
 * Botón Base - Kallpa UNL
 * ==============================================
 *
 * Componente UI reutilizable.
 * - Variantes: primary, secondary, ghost, danger
 * - Tamaños: sm, md
 * - Estados: loading, disabled
 */

import PropTypes from "prop-types";

// Base DaisyUI (aprovecha variables del tema: primary, base-*, etc.)
const base = "btn inline-flex items-center justify-center gap-2";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-warning",
  info: "btn-info",
  accent: "btn-accent",
};

const sizes = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

const Button = ({
  type = "button",
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  title,
  loadingText = "Procesando...",
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      title={title}
      className={[
        base,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? "btn-block" : "",
        loading ? "loading loading-spinner" : "",
        className,
      ].join(" ")}
    >
      {loading ? loadingText : children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost", "danger", "info"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  loadingText: PropTypes.string,
};

export default Button;
