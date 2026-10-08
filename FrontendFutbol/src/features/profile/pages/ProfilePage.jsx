import useAuth from "@/features/auth/hooks/useAuth";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Edit2,
  Camera,
  Calendar,
  MapPin,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import usersApi from "@/features/users/services/users.api";
import { ROUTES } from "@/app/config/constants";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await usersApi.getMe();
      return response.status === "success" ? response.data : null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    retry: 1,
  });

  // Combinar datos: preferencia a userData, fallback a authUser
  const user = userData || authUser;

  const getInitials = (name) => {
    return name?.slice(0, 2).toUpperCase() || "US";
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const getRolLabel = (role) => {
    switch (role) {
      case "Administrator":
        return "Administrador";
      case "Coach":
        return "Entrenador";
      case "Intern":
        return "Pasante";
      default:
        return "Usuario";
    }
  };

  const getCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getUpdatedAt = (updatedAt) => {
    const date = new Date(updatedAt);
    const diffTime = Math.abs(date - new Date());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + " días";
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-12">
      {/* Banner Section */}
      <div className="h-48 w-full bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body items-center text-center pt-12 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div className="avatar indicator">
                    {/* <span className="indicator-item badge badge-secondary cursor-pointer p-1 rounded-full shadow-lg border-2 border-base-100 hover:scale-110 transition-transform">
                      <Camera size={14} className="text-white" />
                    </span> */}
                    <div className="w-32 h-32 rounded-full ring ring-base-100 ring-offset-2 bg-base-300 shadow-2xl overflow-hidden group">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-neutral to-neutral-focus text-neutral-content text-3xl font-bold">
                          {getInitials(user?.name || user?.email)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-1">
                  <h2 className="card-title text-2xl font-bold text-base-content">
                    {user?.full_name || "Usuario"}
                  </h2>
                  <p className="text-base-content/60 font-medium">
                    {user?.email}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="badge badge-primary badge-outline font-semibold uppercase text-xs tracking-wider">
                      {getRolLabel(user?.role || user?.rol || "Usuario")}
                    </span>
                    <span className="badge badge-ghost badge-xs bg-green-500/10 text-green-600 border-none font-medium px-2 py-1 h-auto">
                      Activo
                    </span>
                  </div>
                </div>

                <div className="divider my-4"></div>

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-base-content/70">
                      <Calendar size={16} />
                      <span>Miembro desde</span>
                      <span className="font-medium ml-auto">
                        {getCreatedAt(user?.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-actions w-full mt-6">
                  {/* <button className="btn btn-primary btn-block gap-2 shadow-primary/25 shadow-lg">
                    <Edit2 size={16} />
                    Editar Perfil
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <User className="text-primary" size={20} />
                    Información Personal
                  </h3>
                  {/* <button className="btn btn-ghost btn-sm btn-square text-base-content/50">
                    <Edit2 size={16} />
                  </button> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs uppercase font-bold text-base-content/50 tracking-wider">
                        Nombre Completo
                      </span>
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg border border-base-200/50">
                      <User size={18} className="text-base-content/40" />
                      <span className="font-medium text-base-content">
                        {user?.full_name || "No definido"}
                      </span>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs uppercase font-bold text-base-content/50 tracking-wider">
                        Correo Electrónico
                      </span>
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg border border-base-200/50">
                      <Mail size={18} className="text-base-content/40" />
                      <span className="font-medium text-base-content">
                        {user?.email || "No definido"}
                      </span>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs uppercase font-bold text-base-content/50 tracking-wider">
                        Teléfono
                      </span>
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg border border-base-200/50">
                      <Phone size={18} className="text-base-content/40" />
                      <span className="font-medium text-base-content">
                        {user?.phone || "No registrado"}
                      </span>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xs uppercase font-bold text-base-content/50 tracking-wider">
                        Ubicación
                      </span>
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg border border-base-200/50">
                      <MapPin size={18} className="text-base-content/40" />
                      <span className="font-medium text-base-content">
                        {user?.direction || "No registrado"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Shield className="text-secondary" size={20} />
                  Seguridad de la Cuenta
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-base-200/30 rounded-xl hover:bg-base-200/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                        <Key size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base-content">
                          Contraseña
                        </h4>
                        <p className="text-sm text-base-content/60">
                          Ultimo cambio hace {getUpdatedAt(user?.updated_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                    >
                      Cambiar
                    </button>
                  </div>

                  {/* Add more security options here if needed, e.g., 2FA */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
