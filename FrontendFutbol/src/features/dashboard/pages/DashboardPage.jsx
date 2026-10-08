/**
 * Dashboard por rol
 */

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/app/config/roles";
import AdminDashboard from "./AdminDashboard";
import CoachDashboard from "./CoachDashboard";
import InternDashboard from "./InternDashboard";

const DashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role || user?.rol;
  const location = useLocation();
  const navigate = useNavigate();

  // Mostrar toast de acceso denegado si viene de RoleRoute
  useEffect(() => {
    if (location.state?.accessDenied) {
      toast.error(
        location.state.message ||
          "No tienes permisos para acceder a esta sección"
      );
      // Limpiar el state para evitar que se muestre nuevamente al recargar
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  if (role === ROLES.ADMIN) return <AdminDashboard />;
  if (role === ROLES.ENTRENADOR) return <CoachDashboard />;
  if (role === ROLES.PASANTE) return <InternDashboard />;

  // Fallback simple
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Tu rol actual no tiene un dashboard específico configurado.
      </p>
    </div>
  );
};

export default DashboardPage;
