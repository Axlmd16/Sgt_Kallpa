/**
 * Ruta por rol
 *
 * Componente que restringe el acceso a rutas basándose
 * en el rol del usuario autenticado.
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { USER_DATA_KEY, ROUTES } from "../config/constants";

const RoleRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();

  const userData = localStorage.getItem(USER_DATA_KEY);

  // Si no hay datos de usuario, se redirecciona al login
  if (!userData) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  // Parsear datos del usuario
  let user;
  try {
    user = JSON.parse(userData);
  } catch (error) {
    // Limpiar datos corruptos y redirigir al login
    console.error("[RoleRoute] Error parsing user data:", error);
    localStorage.removeItem(USER_DATA_KEY);
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  // Obtener el rol del usuario
  const userRole = user?.role || user?.rol;

  // Verificar si el rol del usuario está en los roles permitidos
  const hasAccess = allowedRoles.includes(userRole);

  // Si no tiene acceso, mostrar página de acceso denegado o redirigir
  if (!hasAccess) {
    // Redirigir al dashboard con mensaje
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        state={{
          accessDenied: true,
          message: "No tienes permisos para acceder a esta sección",
        }}
        replace
      />
    );

    //Todo:  Mostrar componente de acceso denegado (Preguntar a ver que tal)
    // return <AccessDeniedPage />;
  }

  return <Outlet />;
};

RoleRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleRoute;
