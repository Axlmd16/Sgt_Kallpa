import React from "react";
import PropTypes from "prop-types";
import { CheckCircle, XCircle, Users } from "lucide-react";

/**
 * Tabla de asistencia modernizada con estilo Dashboard.
 * Versión Compacta.
 */
function AttendanceTable({
  athletes = [],
  attendanceData = {},
  onToggleAttendance,
  onJustificationChange,
  onMarkAllPresent,
  onMarkAllAbsent,
  loading = false,
}) {
  // Configuración de tipos con colores semánticos
  const formatAthleteType = (type) => {
    const types = {
      EXTERNOS: {
        label: "Escuela",
        class: "bg-blue-100 text-blue-700 border-blue-200",
      },
      ESTUDIANTES: {
        label: "Estudiante",
        class: "bg-purple-100 text-purple-700 border-purple-200",
      },
      DOCENTES: {
        label: "Docente",
        class: "bg-emerald-100 text-emerald-700 border-emerald-200",
      },
      TRABAJADORES: {
        label: "Trabajador",
        class: "bg-orange-100 text-orange-700 border-orange-200",
      },
      ADMINISTRATIVOS: {
        label: "Admin",
        class: "bg-slate-100 text-slate-700 border-slate-200",
      },
    };
    return types[type] || { label: type, class: "badge-ghost" };
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body items-center py-12">
          <span className="loading loading-spinner loading-md text-primary mb-2"></span>
          <span className="text-slate-400 text-sm font-medium animate-pulse">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body items-center py-12 text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Users size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            No hay atletas listados
          </h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Cambia la fecha o filtros para ver resultados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dashboard Stats */}

      {/* Main Table Card */}
      <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
        {/* Table Header Actions */}
        <div className="px-4 py-3 border-b border-base-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-sm text-slate-700">
            Listado de Atletas ({athletes.length})
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-xs btn-ghost hover:bg-red-50 text-red-500 normal-case font-medium"
              onClick={onMarkAllAbsent}
              title="Marcar todos como ausentes"
            >
              <XCircle size={14} />
              Ausentes
            </button>
            <button
              type="button"
              className="btn btn-xs btn-ghost hover:bg-emerald-50 text-emerald-600 normal-case font-medium"
              onClick={onMarkAllPresent}
              title="Marcar todos como presentes"
            >
              <CheckCircle size={14} />
              Presentes
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50/80">
              <tr className="border-b border-base-200">
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-4 w-10">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                  Atleta
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 w-32">
                  Tipo
                </th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 w-40">
                  Estado
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pr-4 min-w-[200px]">
                  Justificación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200/60">
              {athletes.map((athlete, index) => {
                const attendance = attendanceData[athlete.id] || {
                  is_present: false,
                  justification: "",
                };
                const typeInfo = formatAthleteType(athlete.type_athlete);
                const isPresent = attendance.is_present;
                const isJustified =
                  !isPresent &&
                  attendance.justification &&
                  attendance.justification.trim() !== "";

                return (
                  <tr
                    key={athlete.id}
                    className={`transition-colors ${
                      isPresent
                        ? "hover:bg-slate-50/50"
                        : isJustified
                          ? "bg-amber-50/40 hover:bg-amber-50/70"
                          : "hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 pl-4 text-center text-slate-400 font-mono text-xs">
                      {index + 1}
                    </td>

                    {/* Atleta */}
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-base-200 ${
                              isPresent
                                ? "bg-linear-to-br from-primary/20 to-primary/5 text-primary"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <span>
                              {athlete.full_name?.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">
                            {athlete.full_name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {athlete.dni}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${typeInfo.class}`}
                      >
                        {typeInfo.label}
                      </span>
                    </td>

                    {/* Estado Switch */}
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="checkbox"
                          className="toggle toggle-sm toggle-success"
                          checked={isPresent === true}
                          onChange={() =>
                            onToggleAttendance(athlete.id, !isPresent)
                          }
                        />
                        <span
                          className={`text-xs font-medium min-w-[70px] text-left ${
                            isPresent
                              ? "text-success"
                              : isJustified
                                ? "text-warning"
                                : "text-slate-400"
                          }`}
                        >
                          {isPresent
                            ? "Presente"
                            : isJustified
                              ? "Justificado"
                              : "Ausente"}
                        </span>
                      </div>
                    </td>

                    {/* Justificación */}
                    <td className="py-3 pr-4">
                      <div
                        className={`transition-opacity ${
                          isPresent ? "opacity-30" : "opacity-100"
                        }`}
                      >
                        <input
                          type="text"
                          className={`
                            input input-sm input-bordered w-full bg-white text-xs
                            ${isPresent ? "cursor-not-allowed" : ""}
                            ${!isPresent && !attendance.justification ? "border-amber-300 focus:border-amber-400" : ""}
                          `}
                          placeholder={
                            isPresent
                              ? ""
                              : "Escribe el motivo de la ausencia..."
                          }
                          value={attendance.justification || ""}
                          onChange={(e) =>
                            onJustificationChange(athlete.id, e.target.value)
                          }
                          disabled={isPresent}
                          maxLength={500}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

AttendanceTable.propTypes = {
  athletes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      full_name: PropTypes.string.isRequired,
      dni: PropTypes.string.isRequired,
      type_athlete: PropTypes.string,
    }),
  ),
  attendanceData: PropTypes.object,
  onToggleAttendance: PropTypes.func.isRequired,
  onJustificationChange: PropTypes.func.isRequired,
  onMarkAllPresent: PropTypes.func.isRequired,
  onMarkAllAbsent: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AttendanceTable;
