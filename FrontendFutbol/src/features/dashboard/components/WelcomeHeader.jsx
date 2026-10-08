/**
 * WelcomeHeader - Encabezado de bienvenida elegante
 */

import { getRoleLabel } from "@/app/config/navigation";
import { Calendar, Sparkles } from "lucide-react";

const WelcomeHeader = ({ user }) => {
  const roleLabel = getRoleLabel(user?.role || user?.rol);

  // Obtener saludo según hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  // Nombre del usuario
  const userName = user?.full_name || user?.name || user?.nombre || "Usuario";

  // Obtener iniciales
  const getInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-base-100 rounded-2xl border border-base-200 shadow-sm">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-content flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
        {getInitials()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-base-content/50 text-sm">
          <Sparkles className="w-4 h-4 text-warning" />
          <span>{getGreeting()}</span>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-base-content truncate">
          {userName}
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-xs">
            {roleLabel}
          </span>
          <span className="text-base-content/40">•</span>
          <span className="text-base-content/50 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
