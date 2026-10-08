/**
 * RepresentativesTable - Tabla de representantes con expansión para ver atletas
 * Sigue el mismo estilo de UserTable.jsx
 */

import { useState } from "react";
import PropTypes from "prop-types";
import Button from "@/shared/components/Button";
import {
  Users,
  ChevronDown,
  ChevronUp,
  UserRoundPen,
  CirclePower,
  User,
  Phone,
  Mail,
  Eye,
} from "lucide-react";

// Tipos de parentesco
const RELATIONSHIP_LABELS = {
  Father: "Padre",
  Mother: "Madre",
  "Legal Guardian": "Tutor Legal",
  FATHER: "Padre",
  MOTHER: "Madre",
  LEGAL_GUARDIAN: "Tutor Legal",
};

function RepresentativesTable({
  representatives = [],
  onEdit,
  onToggleStatus,
  onViewAthletes,
  onViewAthlete,
  loading = false,
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  // Obtener label de parentesco
  const getRelationshipLabel = (type) => {
    return RELATIONSHIP_LABELS[type] || type;
  };

  // Colores de parentesco
  const getRelationshipBadge = (type) => {
    const colors = {
      Father: "bg-blue-100 text-blue-700 border-blue-200",
      FATHER: "bg-blue-100 text-blue-700 border-blue-200",
      Mother: "bg-pink-100 text-pink-700 border-pink-200",
      MOTHER: "bg-pink-100 text-pink-700 border-pink-200",
      "Legal Guardian": "bg-amber-100 text-amber-700 border-amber-200",
      LEGAL_GUARDIAN: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[type] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  // Toggle expandir fila
  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
    if (onViewAthletes && expandedRow !== id) {
      onViewAthletes(id);
    }
  };

  // Estado vacío
  if (!loading && representatives.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body flex flex-col items-center justify-center py-12">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Users size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No hay representantes registrados
          </h3>
          <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">
            Los representantes se crean automáticamente al registrar un
            deportista menor de edad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden mt-5">
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* HEAD */}
          <thead className="bg-slate-50/80">
            <tr className="border-b border-base-200">
              <th className="w-10"></th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-2">
                Representante
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Identificación
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Parentesco
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Atletas
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Estado
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pr-6">
                Acciones
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-base-200/60">
            {representatives.map((rep) => (
              <>
                {/* Fila principal */}
                <tr
                  key={rep.id}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(rep.id)}
                >
                  {/* Expandir */}
                  <td className="py-4 pl-4">
                    <button className="btn btn-ghost btn-xs btn-square">
                      {expandedRow === rep.id ? (
                        <ChevronUp size={16} className="text-primary" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Representante (Avatar + Info) */}
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-secondary/20 to-secondary/5 ring-2 ring-base-200 flex items-center justify-center">
                          <User size={18} className="text-secondary" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">
                          {rep.full_name}
                        </span>
                        {rep.email && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={10} />
                            {rep.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Identificación */}
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm text-slate-700">
                        {rep.dni}
                      </span>
                      {rep.phone && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone size={10} />
                          {rep.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Parentesco */}
                  <td className="text-center py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRelationshipBadge(
                        rep.relationship_type
                      )}`}
                    >
                      {getRelationshipLabel(rep.relationship_type)}
                    </span>
                  </td>

                  {/* Número de atletas */}
                  <td className="text-center py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      <Users size={12} />
                      {rep.athletes_count || 0}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="text-center py-4">
                    {rep.is_active ? (
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
                  <td
                    className="text-right py-4 pr-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-square btn-sm text-info hover:bg-info/10"
                        onClick={() => onEdit(rep)}
                        title="Editar representante"
                      >
                        <UserRoundPen size={16} />
                      </Button>

                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className={`btn-square btn-sm ${
                          rep.is_active
                            ? "text-error hover:bg-error/10"
                            : "text-success hover:bg-success/10"
                        }`}
                        onClick={() => onToggleStatus && onToggleStatus(rep)}
                        title={rep.is_active ? "Desactivar" : "Activar"}
                      >
                        <CirclePower size={16} />
                      </Button> */}
                    </div>
                  </td>
                </tr>

                {/* Fila expandida - Atletas asociados */}
                {expandedRow === rep.id && (
                  <tr key={`${rep.id}-expanded`} className="bg-slate-50/50">
                    <td colSpan={7} className="py-4 px-6">
                      <div className="pl-8 border-l-2 border-primary/30">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <Users size={14} className="text-primary" />
                          Deportistas representados
                        </h4>

                        {rep.athletes && rep.athletes.length > 0 ? (
                          <div className="grid gap-2">
                            {rep.athletes.map((athlete) => (
                              <div
                                key={athlete.id}
                                className="flex items-center justify-between bg-white rounded-lg p-3 border border-base-200 hover:border-primary/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="avatar">
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/20 to-primary/5">
                                      <img
                                        src="/img/user.png"
                                        alt={athlete.full_name}
                                        className="object-cover rounded-full"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-sm text-slate-800">
                                      {athlete.full_name}
                                    </span>
                                    <span className="text-xs text-slate-500 ml-2">
                                      DNI: {athlete.dni}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="btn-square btn-xs text-primary hover:bg-primary/10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onViewAthlete && onViewAthlete(athlete);
                                    }}
                                    title="Ver detalle"
                                  >
                                    <Eye size={18} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic">
                            No hay atletas asociados a este representante.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

RepresentativesTable.propTypes = {
  representatives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      full_name: PropTypes.string.isRequired,
      dni: PropTypes.string.isRequired,
      phone: PropTypes.string,
      email: PropTypes.string,
      relationship_type: PropTypes.string.isRequired,
      is_active: PropTypes.bool.isRequired,
      athletes_count: PropTypes.number,
      athletes: PropTypes.array,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func,
  onViewAthletes: PropTypes.func,
  onViewAthlete: PropTypes.func,
  loading: PropTypes.bool,
};

export default RepresentativesTable;
