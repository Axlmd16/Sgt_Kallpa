import React from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  Search,
  Filter,
  Users,
  GraduationCap,
  Briefcase,
  UserCog,
} from "lucide-react";

/**
 * Componente de filtros para la página de asistencia.
 * Versión Compacta.
 */
function AttendanceForm({
  date,
  typeFilter,
  searchTerm,
  onDateChange,
  onTypeFilterChange,
  onSearchChange,
}) {
  // Configuración de tabs con iconos
  const tabs = [
    { id: "", label: "Todos", icon: Users },
    { id: "EXTERNOS", label: "Escuela", icon: Users },
    { id: "ESTUDIANTES", label: "Estudiantes", icon: GraduationCap },
    { id: "DOCENTES", label: "Docentes", icon: GraduationCap },
    { id: "TRABAJADORES", label: "Trabajadores", icon: Briefcase },
    { id: "ADMINISTRATIVOS", label: "Admin", icon: UserCog },
  ];

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
      <div className="card-body p-4">
        {/* Header del Filtro */}
        <div className="flex items-center gap-2 mb-4 text-slate-700">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <Filter size={16} />
          </div>
          <h3 className="font-semibold text-sm">Filtros de Búsqueda</h3>
        </div>

        <div className="flex flex-col gap-4">
          {/* Fila 1: Inputs Principales */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Grupo Fecha y Hora (Combinados visualmente) */}
            <div className="md:col-span-4 flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-slate-50/50 h-10">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Calendar size={14} />
                </div>
                <input
                  type="date"
                  className="w-full pl-9 pr-2 py-2 bg-white border-none focus:outline-none text-xs font-medium text-slate-700 placeholder-slate-400 h-full"
                  value={date}
                  onChange={(e) => onDateChange(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Buscador */}
            <div className="md:col-span-8 relative group h-10">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-xs font-medium text-slate-700 placeholder-slate-400 h-full"
                placeholder="Buscar por nombre o número de cédula..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
              />
              {/* Botón para limpiar búsqueda */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Fila 2: Tabs de Tipo (Segmented Control) */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
              Filtrar por Tipo
            </label>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = typeFilter === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTypeFilterChange(tab.id)}
                    className={`
                    relative group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border
                    ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm transform scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }
                  `}
                  >
                    <Icon
                      size={12}
                      className={
                        isActive
                          ? "text-primary-content"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AttendanceForm.propTypes = {
  date: PropTypes.string.isRequired,
  typeFilter: PropTypes.string,
  searchTerm: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
  onTypeFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default AttendanceForm;
