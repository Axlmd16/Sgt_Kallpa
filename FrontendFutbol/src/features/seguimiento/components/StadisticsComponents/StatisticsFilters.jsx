/**
 * StatisticsFilters Component
 *
 * Filtros para estadísticas: presets de fecha, tipo de atleta,
 * sexo y rango de fechas personalizado.
 */

import React from "react";
import PropTypes from "prop-types";
import { Filter } from "lucide-react";
import {
  ESTAMENTO_FILTER_OPTIONS,
  GENDER_OPTIONS,
} from "@/app/config/constants";

const datePresets = [
  { label: "Últimos 7 días", days: 7 },
  { label: "Últimos 30 días", days: 30 },
  { label: "Últimos 90 días", days: 90 },
  { label: "Este año", days: 365 },
];

function StatisticsFilters({ filters, onFiltersChange, onClear }) {
  const applyDatePreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    onFiltersChange({
      ...filters,
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    });
  };

  const handleChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-primary" />
          <span className="font-medium text-base-content text-sm">Filtros</span>
        </div>

        {/* Presets de fecha */}
        <div className="flex flex-wrap gap-2 mb-4">
          {datePresets.map((preset) => (
            <button
              key={preset.days}
              onClick={() => applyDatePreset(preset.days)}
              className="btn btn-sm btn-ghost border border-base-300 hover:bg-primary/10 hover:border-primary"
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={onClear}
            className="btn btn-sm btn-ghost text-error hover:bg-error/10"
          >
            Limpiar
          </button>
        </div>

        {/* Filtros principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tipo de atleta */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Tipo de Atleta</span>
            </label>
            <select
              value={filters.type_athlete}
              onChange={(e) => handleChange("type_athlete", e.target.value)}
              className="select select-bordered select-sm w-full bg-base-100"
            >
              {ESTAMENTO_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sexo */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Sexo</span>
            </label>
            <select
              value={filters.sex}
              onChange={(e) => handleChange("sex", e.target.value)}
              className="select select-bordered select-sm w-full bg-base-100"
            >
              <option value="">Todos</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Desde</span>
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              className="input input-bordered input-sm w-full bg-base-100"
            />
          </div>

          {/* Fecha fin */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Hasta</span>
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleChange("end_date", e.target.value)}
              className="input input-bordered input-sm w-full bg-base-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

StatisticsFilters.propTypes = {
  filters: PropTypes.shape({
    type_athlete: PropTypes.string,
    sex: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default StatisticsFilters;
