/**
 * DashboardCard - Tarjeta reutilizable para el dashboard
 * Con efectos de hover y animaciones elegantes
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const DashboardCard = ({
  title,
  description,
  to,
  icon: Icon,
  color = "primary",
  badge,
  disabled = false,
}) => {
  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      iconBg: "bg-primary",
      iconText: "text-primary-content",
      hover: "hover:border-primary/50",
      badge: "bg-primary/20 text-primary",
    },
    secondary: {
      bg: "bg-secondary/10",
      iconBg: "bg-secondary",
      iconText: "text-secondary-content",
      hover: "hover:border-secondary/50",
      badge: "bg-secondary/20 text-secondary",
    },
    accent: {
      bg: "bg-accent/10",
      iconBg: "bg-accent",
      iconText: "text-accent-content",
      hover: "hover:border-accent/50",
      badge: "bg-accent/20 text-accent",
    },
    info: {
      bg: "bg-info/10",
      iconBg: "bg-info",
      iconText: "text-info-content",
      hover: "hover:border-info/50",
      badge: "bg-info/20 text-info",
    },
    success: {
      bg: "bg-success/10",
      iconBg: "bg-success",
      iconText: "text-success-content",
      hover: "hover:border-success/50",
      badge: "bg-success/20 text-success",
    },
    warning: {
      bg: "bg-warning/10",
      iconBg: "bg-warning",
      iconText: "text-warning-content",
      hover: "hover:border-warning/50",
      badge: "bg-warning/20 text-warning",
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  const CardContent = () => (
    <>
      {/* Header con icono */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-2xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center shadow-lg`}
        >
          {Icon && <Icon className="w-7 h-7" />}
        </div>
        {badge && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-base-content/60 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer con acción */}
      {to && !disabled && (
        <div className="mt-4 pt-4 border-t border-base-200 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">Acceder</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </>
  );

  if (disabled) {
    return (
      <div className="group relative bg-base-100 rounded-2xl border border-base-200 p-6 opacity-50 cursor-not-allowed flex flex-col">
        <CardContent />
        <div className="absolute inset-0 bg-base-100/50 rounded-2xl flex items-center justify-center">
          <span className="bg-base-300 text-base-content/60 px-3 py-1 rounded-full text-xs font-medium">
            No disponible
          </span>
        </div>
      </div>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        className={`group relative bg-base-100 rounded-2xl border-2 border-base-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colors.hover} flex flex-col`}
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="group relative bg-base-100 rounded-2xl border border-base-200 p-6 flex flex-col">
      <CardContent />
    </div>
  );
};

export default DashboardCard;
