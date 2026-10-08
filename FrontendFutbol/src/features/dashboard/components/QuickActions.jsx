/**
 * QuickActions - Acciones rápidas compactas para el dashboard
 */

import { Link } from "react-router-dom";

const QuickActions = ({ actions = [] }) => {
  if (!actions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Link
            key={index}
            to={action.to}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-200/70 hover:bg-primary hover:text-primary-content text-sm font-medium text-base-content/70 transition-all"
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
