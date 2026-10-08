/**
 * InternsTable Component
 *
 * Tabla para mostrar y gestionar pasantes del club.
 */

import PropTypes from "prop-types";
import Button from "@/shared/components/Button";
import { UserCheck, CirclePower, Mail, Calendar, User } from "lucide-react";

function InternsTable({ interns = [], onToggleStatus, loading = false }) {
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Estado vacío mejorado
  if (!loading && interns.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body flex flex-col items-center justify-center py-12">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <UserCheck size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No hay pasantes
          </h3>
          <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">
            No se han promovido atletas a pasantes aún. Puedes promover un
            atleta desde la pestaña de Deportistas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden mt-5">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-base-200">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-6">
                Pasante
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Email
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Fecha de Alta
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Estado
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pr-6">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/60">
            {interns.map((intern) => (
              <tr
                key={intern.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Pasante Info */}
                <td className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 ring-2 ring-base-200">
                        <span className="flex items-center justify-center w-full h-full text-sm font-bold text-accent">
                          {intern.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-sm">
                        {intern.full_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {intern.dni || "Sin documento"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span>{intern.email}</span>
                  </div>
                </td>

                {/* Fecha de Alta */}
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{formatDate(intern.created_at)}</span>
                  </div>
                </td>

                {/* Estado */}
                <td className="text-center">
                  {intern.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Inactivo
                    </span>
                  )}
                </td>

                {/* Acciones */}
                <td className="text-right pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className="tooltip tooltip-left"
                      data-tip={intern.is_active ? "Desactivar" : "Activar"}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`btn-square btn-ghost hover:scale-105 transition-transform ${
                          intern.is_active
                            ? "text-warning hover:bg-warning/10"
                            : "text-success hover:bg-success/10"
                        }`}
                        onClick={() => onToggleStatus && onToggleStatus(intern)}
                      >
                        <CirclePower size={18} />
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

InternsTable.propTypes = {
  interns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      user_id: PropTypes.number,
      full_name: PropTypes.string.isRequired,
      dni: PropTypes.string,
      email: PropTypes.string.isRequired,
      athlete_id: PropTypes.number,
      is_active: PropTypes.bool,
      created_at: PropTypes.string,
    })
  ),
  onToggleStatus: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default InternsTable;
