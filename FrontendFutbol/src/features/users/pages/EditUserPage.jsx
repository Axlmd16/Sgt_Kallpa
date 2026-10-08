import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import UserForm from "../components/UserForm";
import Loader from "@/shared/components/Loader";
import usersApi from "../services/users.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { ChevronLeft, UserRoundPen, UserX } from "lucide-react";
import Button from "../../../shared/components/Button";

const EditUserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Obtener ID de la URL
  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * Obtiene los datos del usuario
   */
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const response = await usersApi.getById(id);
        setUser(response?.data ?? null);
      } catch (err) {
        setLoadError(err.message || MESSAGES.ERROR.USER_LOAD);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (userData) => {
    setSaving(true);

    try {
      await usersApi.update(id, userData);

      toast.success(MESSAGES.SUCCESS.USER_UPDATED, {
        description: MESSAGES.SUCCESS.USER_UPDATED_DESC,
      });

      // Navegar a la lista de usuarios
      navigate(ROUTES.USERS);
    } catch {
      // El interceptor de http.js ya maneja los toasts para todos los errores
      // No hacemos nada aquí para evitar toast duplicado
    } finally {
      setSaving(false);
    }
  };

  /**
   * Maneja la cancelación
   */
  const handleCancel = () => {
    navigate(ROUTES.USERS);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
        {/* Fondo decorativo */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body items-center text-center py-12">
              <div className="bg-error/10 p-4 rounded-full mb-4">
                <UserX size={32} className="text-error" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Usuario no encontrado
              </h2>
              <p className="text-slate-500 mt-2 max-w-sm">
                {loadError ||
                  "El usuario que buscas no existe o fue eliminado."}
              </p>
              <button
                onClick={handleCancel}
                className="mt-6 text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
              >
                <ChevronLeft size={18} />
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <Button
          onClick={handleCancel}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium transition-colors"
        >
          <ChevronLeft size={18} />
          Volver a la lista
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="bg-primary/10 p-1 rounded-md">
              <UserRoundPen size={14} />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Editar Usuario
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Editar Usuario
          </h1>
          <p className="text-slate-500 text-sm">
            Modifica los datos del usuario{" "}
            <strong className="text-slate-700">{user?.full_name}</strong>
          </p>
        </div>

        {/* Card con formulario */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <UserForm
              initialData={user}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={saving}
              isEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
