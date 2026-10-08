import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_TOKEN_KEY, ROUTES } from "../config/constants";

/**
 * ProtectedRoute - Componente de orden superior para rutas protegidas
 *
 * Funcionalidad:
 * - Verifica si existe un token de autenticación
 * - Si existe, renderiza las rutas hijas (Outlet)
 * - Si no existe, redirige al login guardando la ubicación actual
 */
const ProtectedRoute = () => {
  const location = useLocation();

  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    // Redirigir al login guardando la ubicación actual
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  // Si hay token, renderizar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
