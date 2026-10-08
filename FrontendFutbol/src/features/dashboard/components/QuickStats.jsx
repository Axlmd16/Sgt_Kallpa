/**
 * QuickStats - Estadísticas rápidas para el dashboard
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "primary",
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    info: "text-info bg-info/10",
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-success" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-error" />;
    return <Minus className="w-4 h-4 text-base-content/40" />;
  };

  const getTrendClass = () => {
    if (trend === "up") return "text-success bg-success/10";
    if (trend === "down") return "text-error bg-error/10";
    return "text-base-content/60 bg-base-200";
  };

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-xl ${colorClasses[color]} flex items-center justify-center`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {(trend || trendValue) && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendClass()}`}
          >
            {getTrendIcon()}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-base-content mb-1">
        {value}
      </p>
      <p className="text-sm text-base-content/60">{label}</p>
    </div>
  );
};

const QuickStats = ({ stats = [] }) => {
  if (!stats.length) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export { StatCard };
export default QuickStats;
