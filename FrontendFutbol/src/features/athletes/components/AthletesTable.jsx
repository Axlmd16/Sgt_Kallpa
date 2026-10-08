import PropTypes from "prop-types";
import Button from "@/shared/components/Button";
import {
  User,
  UserRoundPen,
  CirclePower,
  IdCard,
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  UserX,
  CheckCircle2,
  XCircle,
  Mars,
  Venus,
  CircleHelp,
  Eye,
  UserCheck,
  MoreVertical,
} from "lucide-react";

function AthletesTable({
  athletes = [],
  onEdit,
  onDelete,
  onViewDetail,
  onPromote,
  loading = false,
}) {
  // Badge estilos e iconos por estamento (type_athlete)
  const getEstamentoConfig = (typeAthlete) => {
    const configs = {
      administrativos: {
        class: "badge-primary",
        icon: Briefcase,
        label: "Administrativos",
      },
      docentes: {
        class: "badge-secondary",
        icon: BookOpen,
        label: "Docentes",
      },
      estudiantes: {
        class: "badge-info",
        icon: GraduationCap,
        label: "Estudiantes",
      },
      trabajadores: {
        class: "badge-accent",
        icon: Users,
        label: "Trabajadores",
      },
      externos: {
        class: "badge-warning",
        icon: UserX,
        label: "Externos",
      },
    };
    const key = (typeAthlete || "").toLowerCase();
    return configs[key] || { class: "badge-neutral", icon: User, label: "N/A" };
  };

  // Config de sexo con iconos
  const getSexConfig = (sex) => {
    const configs = {
      Male: { label: "Masculino", class: "badge-info", icon: Mars },
      Female: { label: "Femenino", class: "badge-secondary", icon: Venus },
      Other: { label: "Otro", class: "badge-neutral", icon: CircleHelp },
    };
    return (
      configs[sex] || {
        label: sex || "N/A",
        class: "badge-neutral",
        icon: CircleHelp,
      }
    );
  };

  // Estado vacío mejorado
  if (!loading && athletes.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body flex flex-col items-center justify-center py-12">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No hay deportistas
          </h3>
          <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">
            No se encontraron deportistas con los filtros seleccionados.
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
                Deportista
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Estamento
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Sexo
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
            {athletes.map((athlete) => (
              <tr
                key={athlete.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Deportista Info */}
                <td className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/5 ring-2 ring-base-200">
                        {athlete.photo ? (
                          <img
                            src={athlete.photo}
                            alt={athlete.full_name}
                            className="object-cover rounded-full"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-sm font-bold text-primary">
                            {athlete.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-sm">
                        {athlete.full_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {athlete.dni || "Sin documento"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Estamento con icono */}
                <td className="text-center">
                  {(() => {
                    const config = getEstamentoConfig(athlete.type_athlete);
                    const IconComponent = config.icon;
                    return (
                      <span
                        className={`badge ${config.class} badge-sm badge-soft badge-outline gap-1 font-medium`}
                      >
                        <IconComponent size={12} />
                        {config.label}
                      </span>
                    );
                  })()}
                </td>

                {/* Sexo con icono */}
                <td className="text-center">
                  {(() => {
                    const config = getSexConfig(athlete.sex);
                    const IconComponent = config.icon;
                    return (
                      <span
                        className={`badge badge-outline ${config.class} badge-sm badge-soft gap-1`}
                      >
                        <IconComponent size={12} />
                        {config.label}
                      </span>
                    );
                  })()}
                </td>

                {/* Estado con icono */}
                <td className="text-center">
                  {athlete.is_active ? (
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
                  <div className="flex items-center justify-end gap-1">
                    {/* Botón Ver detalle - siempre visible */}
                    <div
                      className="tooltip tooltip-left"
                      data-tip="Ver detalle"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-square btn-ghost text-primary hover:bg-primary/10 hover:scale-105 transition-transform"
                        onClick={() => onViewDetail && onViewDetail(athlete)}
                      >
                        <Eye size={18} />
                      </Button>
                    </div>

                    {/* Dropdown de acciones secundarias */}
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-sm btn-square hover:bg-base-200"
                      >
                        <MoreVertical size={18} className="text-slate-500" />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-xl z-50 w-52 p-2 shadow-lg border border-base-200"
                      >
                        {/* Editar */}
                        <li>
                          <button
                            onClick={() => onEdit && onEdit(athlete)}
                            className="flex items-center gap-2 text-info"
                          >
                            <UserRoundPen size={16} />
                            Editar
                          </button>
                        </li>

                        {/* Activar/Desactivar */}
                        <li>
                          <button
                            onClick={() => onDelete && onDelete(athlete)}
                            className={`flex items-center gap-2 ${
                              athlete.is_active
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            <CirclePower size={16} />
                            {athlete.is_active ? "Dar de baja" : "Activar"}
                          </button>
                        </li>

                        {/* Promover a Pasante - solo si está activo, no es pasante ya, y hay handler */}
                        {athlete.is_active &&
                          onPromote &&
                          !athlete.has_account && (
                            <li>
                              <button
                                onClick={() => onPromote(athlete)}
                                className="flex items-center gap-2 text-accent"
                              >
                                <UserCheck size={16} />
                                Promover a Pasante
                              </button>
                            </li>
                          )}
                      </ul>
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

AthletesTable.propTypes = {
  athletes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      full_name: PropTypes.string.isRequired,
      dni: PropTypes.string,
      photo: PropTypes.string,
      type_athlete: PropTypes.string,
      sex: PropTypes.string,
      is_active: PropTypes.bool,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func,
  onPromote: PropTypes.func,
  loading: PropTypes.bool,
};

export default AthletesTable;
