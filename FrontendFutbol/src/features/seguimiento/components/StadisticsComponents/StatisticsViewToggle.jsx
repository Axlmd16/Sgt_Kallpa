/**
 * StatisticsViewToggle Component
 *
 * Botones para cambiar entre vistas de estadísticas:
 * General, Asistencia, Tests e Individual.
 */

import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BarChart3, CalendarCheck, Activity, Users } from "lucide-react";
import { ROUTES } from "@/app/config/constants";

const views = [
  { id: "overview", label: "General", icon: BarChart3 },
  { id: "attendance", label: "Asistencia", icon: CalendarCheck },
  { id: "tests", label: "Tests", icon: Activity },
  { id: "individual", label: "Individual", icon: Users, navigate: true },
];

function StatisticsViewToggle({ activeView, onViewChange }) {
  const navigate = useNavigate();

  const handleViewChange = (view) => {
    if (view.navigate) {
      // Navegar a la página de atletas para estadísticas individuales
      navigate(ROUTES.INSCRIPTION);
    } else {
      onViewChange(view.id);
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => handleViewChange(view)}
          className={`btn btn-sm gap-2 ${
            activeView === view.id
              ? "btn-primary"
              : "btn-ghost border border-base-300"
          }`}
        >
          <view.icon size={16} />
          {view.label}
        </button>
      ))}
    </div>
  );
}

StatisticsViewToggle.propTypes = {
  activeView: PropTypes.oneOf(["overview", "attendance", "tests"]).isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default StatisticsViewToggle;
