import React from "react";
import Button from "../../../shared/components/Button";
import { CirclePower, UserRoundPen, Users } from "lucide-react";
import { ROLE_OPTIONS } from "../../../app/config/roles";
import PropTypes from "prop-types";

function UserTable({ users = [], onEdit, onDelete, loading = false }) {
  // Función auxiliar para obtener etiqueta de rol
  const getRoleLabel = (role) => {
    const roleOption = ROLE_OPTIONS.find((opt) => opt.value === role);
    return roleOption?.label || role;
  };

  // Función auxiliar para colores de rol
  const getRoleBadgeClasses = (role) => {
    const colors = {
      Administrator: "bg-primary/10 text-primary border-primary/20",
      Coach: "bg-info/10 text-info border-info/20",
      Intern: "bg-success/10 text-success border-success/20",
    };
    return colors[role] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  // Estado vacío
  if (!loading && users.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body flex flex-col items-center justify-center py-12">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Users size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No hay usuarios registrados
          </h3>
          <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">
            Comienza agregando un nuevo usuario al sistema para gestionar el
            acceso a la plataforma.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* HEAD */}
          <thead className="bg-slate-50/80">
            <tr className="border-b border-base-200">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-6">
                Usuario
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Identificación
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                Rol
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
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Usuario (Avatar + Info) */}
                <td className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/5 ring-2 ring-base-200">
                        <img
                          src={user.photo || "/img/user.png"}
                          alt={user.full_name}
                          className="object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-sm">
                        {user.full_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Identificación */}
                <td className="py-4">
                  <span className="font-mono text-sm text-slate-700">
                    {user.dni || (
                      <span className="text-slate-400 italic font-sans">
                        No registrado
                      </span>
                    )}
                  </span>
                </td>

                {/* Rol */}
                <td className="text-center py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeClasses(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>

                {/* Estado */}
                <td className="text-center py-4">
                  {user.is_active ? (
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
                <td className="text-right py-4 pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-square btn-sm text-info hover:bg-info/10"
                      onClick={() => onEdit(user)}
                      title="Editar usuario"
                    >
                      <UserRoundPen size={16} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`btn-square btn-sm ${
                        user.is_active
                          ? "text-error hover:bg-error/10"
                          : "text-success hover:bg-success/10"
                      }`}
                      onClick={() => onDelete && onDelete(user)}
                      title={
                        user.is_active
                          ? "Desactivar usuario"
                          : "Activar usuario"
                      }
                    >
                      <CirclePower size={16} />
                    </Button>
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

// Validación de PropTypes
UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      full_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      dni: PropTypes.string,
      role: PropTypes.string.isRequired,
      is_active: PropTypes.bool.isRequired,
      photo: PropTypes.string,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default UserTable;
