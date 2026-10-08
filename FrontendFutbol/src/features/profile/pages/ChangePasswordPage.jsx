import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Save, ArrowLeft } from "lucide-react";

import authApi from "@/features/auth/services/auth.api";
import { ROUTES, MESSAGES } from "@/app/config/constants";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });

      if (response && response.status === "success") {
        toast.success(response.message || MESSAGES.SUCCESS.UPDATED);
        navigate(ROUTES.PROFILE);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || MESSAGES.ERROR.GENERIC;
      // Limpiar prefijos comunes de errores de backend si es necesario
      const cleanMessage = errorMessage.replace("Value error, ", "");
      toast.error(cleanMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-12">
      {/* Banner Section */}
      <div className="h-48 w-full bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => navigate(ROUTES.PROFILE)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="card-title text-2xl font-bold flex items-center gap-2">
                  <Lock className="text-secondary" size={24} />
                  Cambiar Contraseña
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Contraseña Actual
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña actual"
                    className={`input input-bordered w-full ${
                      errors.current_password ? "input-error" : ""
                    }`}
                    {...register("current_password", {
                      required: "La contraseña actual es requerida",
                    })}
                    disabled={loading}
                  />
                  {errors.current_password && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.current_password.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="divider">Nueva Contraseña</div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Nueva Contraseña
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa la nueva contraseña"
                    className={`input input-bordered w-full ${
                      errors.new_password ? "input-error" : ""
                    }`}
                    {...register("new_password", {
                      required: "La nueva contraseña es requerida",
                      minLength: {
                        value: 8,
                        message: "Debe tener al menos 8 caracteres",
                      },
                    })}
                    disabled={loading}
                  />
                  {errors.new_password && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.new_password.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Confirmar Nueva Contraseña
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    className={`input input-bordered w-full ${
                      errors.confirm_password ? "input-error" : ""
                    }`}
                    {...register("confirm_password", {
                      required: "Debes confirmar la contraseña",
                      validate: (val) => {
                        if (watch("new_password") != val) {
                          return "Las contraseñas no coinciden";
                        }
                      },
                    })}
                    disabled={loading}
                  />
                  {errors.confirm_password && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.confirm_password.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="card-actions justify-end mt-8">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate(ROUTES.PROFILE)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <Save size={18} />
                    )}
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
