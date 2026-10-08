import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserForm from "../components/UserForm";
import usersApi from "../services/users.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { UserPlus, ChevronLeft } from "lucide-react";
import Button from "../../../shared/components/Button";

const CreateUserPage = () => {
  // ESTADO
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Maneja el envío del formulario
  const handleSubmit = async (userData) => {
    setLoading(true);

    try {
      await usersApi.create(userData);

      toast.success(MESSAGES.SUCCESS.USER_CREATED, {
        description: MESSAGES.SUCCESS.USER_CREATED_DESC,
      });

      // Navegar a la lista de usuarios
      navigate(ROUTES.USERS);
    } catch {
      // El interceptor de http.js ya maneja los toasts para todos los errores
      // No hacemos nada aquí para evitar toast duplicado
    } finally {
      setLoading(false);
    }
  };

  // Maneja la cancelación
  const handleCancel = () => {
    navigate(ROUTES.USERS);
  };

  // ==============================================
  // RENDER

  return (
    <div className=" bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none " />
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
              <UserPlus size={14} />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Nuevo Usuario
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Crear Usuario
          </h1>
        </div>

        {/* Card con formulario */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <UserForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              isEdit={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
