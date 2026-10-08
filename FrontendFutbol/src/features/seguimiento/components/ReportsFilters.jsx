/**
 * Componente de Filtros para Reportes
 *
 * Permite seleccionar criterios de filtrado para generar reportes personalizados.
 */

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { ESTAMENTO_FILTER_OPTIONS } from "@/app/config/constants";

const ReportsFilters = ({ athletes = [], onFilter, isLoading = false }) => {
  const [filters, setFilters] = useState({
    category: "",
    athlete_id: "",
  });

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };

    // Si cambia la categoría, resetear el deportista seleccionado
    if (field === "category") {
      newFilters.athlete_id = "";
    }

    setFilters(newFilters);
    // Aplicar filtros automáticamente
    onFilter(newFilters);
  };

  // Filtrar atletas según categoría seleccionada
  const filteredAthletes = useMemo(() => {
    if (!filters.category) {
      return athletes;
    }
    return athletes.filter(
      (athlete) => athlete.type_athlete === filters.category
    );
  }, [athletes, filters.category]);

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-primary" />
          <span className="font-medium text-base-content text-sm">
            Filtros Opcionales
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categoría */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Tipo de Atleta</span>
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              disabled={isLoading}
              className="select select-bordered select-sm w-full bg-base-100"
            >
              {ESTAMENTO_FILTER_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Deportista */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Deportista Específico</span>
            </label>
            <select
              value={filters.athlete_id}
              onChange={(e) => handleFilterChange("athlete_id", e.target.value)}
              disabled={isLoading || filteredAthletes.length === 0}
              className="select select-bordered select-sm w-full bg-base-100"
            >
              <option value="">Todos los deportistas</option>
              {filteredAthletes.map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.full_name}
                </option>
              ))}
            </select>
            {filters.category && filteredAthletes.length === 0 && (
              <p className="text-xs text-warning mt-1">
                No hay deportistas de tipo {filters.category}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilters;
