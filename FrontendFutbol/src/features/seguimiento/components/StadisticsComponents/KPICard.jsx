/**
 * KPICard Component
 *
 * Tarjeta de indicador clave de rendimiento (KPI)
 * con icono, valor, título, subtítulo y tendencia opcional.
 */

import React from "react";
import PropTypes from "prop-types";
import { TrendingUp, TrendingDown } from "lucide-react";

function KPICard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color = "primary",
}) {
  // Map color names to Tailwind classes
  const colorClasses = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    secondary: { bg: "bg-secondary/10", text: "text-secondary" },
    success: { bg: "bg-success/10", text: "text-success" },
    error: { bg: "bg-error/10", text: "text-error" },
    warning: { bg: "bg-warning/10", text: "text-warning" },
    info: { bg: "bg-info/10", text: "text-info" },
    accent: { bg: "bg-accent/10", text: "text-accent" },
  };

  const colorClass = colorClasses[color] || colorClasses.primary;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${colorClass.bg}`}>
            <Icon size={24} className={colorClass.text} />
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend >= 0 ? "text-success" : "text-error"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-base-content">{value}</p>
          <p className="text-sm font-medium text-base-content mt-1">{title}</p>
          {subtitle && (
            <p className="text-xs text-base-content/60 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

KPICard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.number,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "error",
    "warning",
    "info",
    "accent",
  ]),
};

export default KPICard;
