import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  User,
  Check,
  X,
} from "lucide-react";
import useDebounce from "@/shared/hooks/useDebounce";
import athletesApi from "../../services/athletes.api";

/**
 * AthletesSelectionList - Componente rediseñado para seleccionar atletas
 * Diseño moderno con mejor UX
 */
function AthletesSelectionList({
  selectedAthleteIds = [],
  onSelectionChange,
  multiSelect = false,
  loading: parentLoading = false,
  onSelectedAthleteChange = () => {},
}) {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Configuración de tipos de atleta
  const athleteTypes = {
    EXTERNOS: { label: "Externos", color: "bg-info/10 text-info" },
    ESTUDIANTES: {
      label: "Estudiante",
      color: "bg-secondary/10 text-secondary",
    },
    DOCENTES: { label: "Docente", color: "bg-success/10 text-success" },
    TRABAJADORES: { label: "Trabajador", color: "bg-warning/10 text-warning" },
    ADMINISTRATIVOS: { label: "Admin", color: "bg-primary/10 text-primary" },
  };

  const genderOptions = [
    { value: "", label: "Todos" },
    { value: "Male", label: "Masculino" },
    { value: "Female", label: "Femenino" },
  ];

  const typeOptions = [
    { value: "", label: "Todos los tipos" },
    { value: "EXTERNOS", label: "Externos" },
    { value: "ESTUDIANTES", label: "Estudiante" },
    { value: "DOCENTES", label: "Docente" },
    { value: "TRABAJADORES", label: "Trabajador" },
    { value: "ADMINISTRATIVOS", label: "Admin" },
  ];

  // Cargar atletas
  const fetchAthletes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        type_athlete: typeFilter || undefined,
        gender: genderFilter || undefined,
        is_active: true,
      };

      const response = await athletesApi.getAll(params);

      if (response.status === "success" && response.data) {
        const activeAthletes = (response.data.items || []).filter(
          (a) => a.is_active === true
        );
        setAthletes(activeAthletes);
        setPagination((prev) => ({
          ...prev,
          total: activeAthletes.length,
        }));
      }
    } catch (error) {
      console.error("Error al cargar atletas:", error);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    typeFilter,
    genderFilter,
  ]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // Manejar selección
  const handleToggleAthlete = (athleteId) => {
    const newSelection = selectedAthleteIds.includes(athleteId)
      ? []
      : [athleteId];

    onSelectionChange(newSelection);

    if (onSelectedAthleteChange) {
      const selectedAthlete =
        newSelection.length === 1
          ? athletes.find((a) => a.id === newSelection[0]) || null
          : null;
      onSelectedAthleteChange(selectedAthlete);
    }
  };

  const isSelected = (athleteId) => selectedAthleteIds.includes(athleteId);
  const selectedCount = selectedAthleteIds.length;
  const hasFilters = typeFilter || genderFilter;

  const clearFilters = () => {
    setTypeFilter("");
    setGenderFilter("");
    setSearchTerm("");
  };

  const getAthleteTypeInfo = (type) => {
    return (
      athleteTypes[type] || {
        label: type || "N/A",
        color: "bg-slate-100 text-slate-600",
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar atleta por nombre o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-sm w-full pl-10 bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn btn-sm gap-2 ${
            showFilters || hasFilters
              ? "btn-primary"
              : "btn-ghost border border-base-300"
          }`}
        >
          <Filter size={14} />
          Filtros
          {hasFilters && (
            <span className="badge badge-xs badge-white">
              {(typeFilter ? 1 : 0) + (genderFilter ? 1 : 0)}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="card bg-base-100 border border-base-300 p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="label py-0 pb-1">
                <span className="label-text text-xs">Tipo de Atleta</span>
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="select select-bordered select-sm w-full bg-white"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="label py-0 pb-1">
                <span className="label-text text-xs">Sexo</span>
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="select select-bordered select-sm w-full bg-white"
              >
                {genderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-sm btn-ghost text-error"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {loading ? (
            "Cargando atletas..."
          ) : (
            <>
              <span className="font-medium text-slate-900">
                {athletes.length}
              </span>{" "}
              atletas encontrados
            </>
          )}
        </span>
        {selectedCount > 0 && (
          <span className="badge badge-primary gap-1">
            <Check size={12} />
            {selectedCount} seleccionado
          </span>
        )}
      </div>

      {/* Athletes Grid */}
      <div className="border border-base-200 rounded-lg overflow-hidden">
        {loading || parentLoading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : athletes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <div className="bg-slate-100 p-4 rounded-full mb-3">
              <Users size={24} className="text-slate-400" />
            </div>
            <p className="font-medium">No se encontraron atletas</p>
            <p className="text-xs mt-1">
              Intenta con otros filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto divide-y divide-base-200">
            {athletes.map((athlete) => {
              const selected = isSelected(athlete.id);
              const typeInfo = getAthleteTypeInfo(athlete.type_athlete);

              return (
                <div
                  key={athlete.id}
                  onClick={() => handleToggleAthlete(athlete.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                    selected
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-slate-50 border-l-4 border-l-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-linear-to-br from-primary/10 to-primary/5"
                    }`}
                  >
                    {selected ? (
                      <Check size={18} />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {athlete.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm truncate">
                        {athlete.full_name}
                      </span>
                      <span className={`badge badge-xs ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      {athlete.dni && <span>CI: {athlete.dni}</span>}
                      {athlete.height && <span>• {athlete.height} cm</span>}
                      {athlete.weight && <span>• {athlete.weight} kg</span>}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected
                        ? "bg-primary border-primary"
                        : "border-slate-300"
                    }`}
                  >
                    {selected && <Check size={12} className="text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {!selectedCount && athletes.length > 0 && (
        <p className="text-xs text-slate-400 text-center">
          Haz clic en un atleta para seleccionarlo
        </p>
      )}
    </div>
  );
}

export default AthletesSelectionList;
