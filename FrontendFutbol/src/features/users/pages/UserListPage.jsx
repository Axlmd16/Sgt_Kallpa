import UserTable from "../components/UserTable";
import usersApi from "../services/users.api";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "@/features/auth/hooks/useAuth";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Modal from "@/shared/components/Modal";
import Loader from "@/shared/components/Loader";
import useDebounce from "@/shared/hooks/useDebounce";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { Search, UserPlus, Users, Filter } from "lucide-react";
import { ROLE_OPTIONS } from "../../../app/config/roles";

// Opciones de filtro por estado
const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

const UserListPage = () => {
  // ESTADO
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Nuevo filtro de estado

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Modal de confirmación de estado
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    user: null,
    loading: false,
  });

  // Navegación
  const navigate = useNavigate();

  // Usuario actual logueado
  const { user: currentUser } = useAuth();

  // Debounce para búsqueda (800ms para dar tiempo a escribir)
  const debouncedSearch = useDebounce(searchTerm, 800);

  // ==============================================

  // Obtiene la lista de usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
        is_active: statusFilter === "" ? undefined : statusFilter === "true",
      };

      const response = await usersApi.getAll(params);

      setUsers(response.data?.items || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    roleFilter,
    statusFilter,
  ]);

  // Efecto para cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Resetear a página 1 cuando cambia el término de búsqueda (después del debounce)
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, roleFilter, statusFilter]);

  // ==============================================

  // Navega a la página de crear usuario
  const handleCreate = () => {
    navigate(ROUTES.USERS_CREATE);
  };

  // Abre el modal de confirmación para cambiar estado
  const handleStatusClick = (user) => {
    // Validar que no intente desactivarse a sí mismo
    if (currentUser?.id === user.id && user.is_active) {
      toast.error(MESSAGES.ERROR.USER_SELF_DEACTIVATE, {
        description: MESSAGES.ERROR.USER_SELF_DEACTIVATE_DESC,
      });
      return;
    }

    setStatusModal({
      isOpen: true,
      user,
      loading: false,
    });
  };

  // Confirma y ejecuta el cambio de estado
  const handleStatusConfirm = async () => {
    if (!statusModal.user) return;

    setStatusModal((prev) => ({ ...prev, loading: true }));
    const isActive = statusModal.user.is_active;

    try {
      if (isActive) {
        await usersApi.desactivate(statusModal.user.id);
        toast.success(MESSAGES.SUCCESS.USER_DEACTIVATED, {
          description: MESSAGES.SUCCESS.USER_DEACTIVATED_DESC(
            statusModal.user.full_name,
          ),
        });
      } else {
        await usersApi.activate(statusModal.user.id);
        toast.success("Usuario activado", {
          description: `${statusModal.user.full_name} ha sido activado correctamente.`,
        });
      }

      // Cerrar modal y recargar lista
      setStatusModal({ isOpen: false, user: null, loading: false });
      fetchUsers();
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(
        isActive ? MESSAGES.ERROR.USER_DEACTIVATE : "Error al activar usuario",
        {
          description: errorMessage,
        },
      );
      setStatusModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
  };

  //Cierra el modal de estado
  const handleStatusCancel = () => {
    setStatusModal({ isOpen: false, user: null, loading: false });
  };

  // Navega a la página de editar usuario
  const handleEdit = (user) => {
    navigate(`/users/edit/${user.id}`);
  };

  // Maneja cambio de página
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <Users size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Gestión de Usuarios
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Lista de Usuarios del Sistema
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Gestiona los usuarios registrados en la plataforma
            </p>
          </div>

          {/* Botón Agregar Usuario */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCreate}
            className="gap-2"
          >
            <UserPlus size={16} />
            Agregar Usuario
          </Button>
        </div>

        {/* Filtros */}
        <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-primary" />
              <span className="font-medium text-base-content text-sm">
                Filtros
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <label className="label py-1">
                  <span className="label-text text-xs">Buscar</span>
                </label>
                <Input
                  type="text"
                  placeholder="Buscar por nombre, dni o email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={16} className="text-slate-400" />}
                  className="input-sm"
                />
              </div>

              {/* Filtro por rol */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Rol</span>
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="select select-bordered select-sm w-full bg-base-100"
                >
                  <option value="">Todos los roles</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Estado</span>
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select select-bordered select-sm w-full bg-base-100"
                >
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón limpiar */}
            {(searchTerm || roleFilter || statusFilter) && (
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleClearFilters}
                  className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg flex items-center justify-between">
            <p>{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchUsers}
              className="text-error hover:bg-error/10"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Tabla */}
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleStatusClick}
          loading={loading}
        />

        {/* Paginación */}
        {pagination.total > pagination.limit && (
          <div className="mt-6 flex justify-center">
            <div className="card bg-base-100 shadow-sm border border-base-300 px-4 py-3">
              <nav className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="btn-sm"
                >
                  Anterior
                </Button>

                <span className="text-sm text-slate-600 font-medium">
                  Página {pagination.page} de{" "}
                  {Math.ceil(pagination.total / pagination.limit)}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={
                    pagination.page >=
                    Math.ceil(pagination.total / pagination.limit)
                  }
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="btn-sm"
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de estado */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={handleStatusCancel}
        title={
          statusModal.user?.is_active ? "Desactivar usuario" : "Activar usuario"
        }
      >
        <p className="text-slate-600">
          ¿Estás seguro de{" "}
          {statusModal.user?.is_active ? "desactivar" : "activar"} al usuario{" "}
          <strong className="text-slate-900">
            {statusModal.user?.full_name}
          </strong>
          ?{statusModal.user?.is_active && " Esta acción no se puede deshacer."}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={handleStatusCancel}
            disabled={statusModal.loading}
          >
            Cancelar
          </Button>

          <Button
            variant={statusModal.user?.is_active ? "danger" : "primary"}
            onClick={handleStatusConfirm}
            loading={statusModal.loading}
          >
            {statusModal.user?.is_active ? "Desactivar" : "Activar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserListPage;
