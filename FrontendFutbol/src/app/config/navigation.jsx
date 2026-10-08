/**
 * Navegación (Sidebar) por rol
 */

import {
  ChartNoAxesCombined,
  ClockCheck,
  FileText,
  LayoutGrid,
  LogOut,
  NotepadText,
  UserPlus2,
  Users2,
} from "lucide-react";
import { ROUTES } from "./constants";
import { ROLES } from "./roles";

export const getRoleLabel = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "Administrador";
    case ROLES.ENTRENADOR:
      return "Entrenador";
    case ROLES.PASANTE:
      return "Pasante";
    default:
      return "Usuario";
  }
};

/** Iconos para el sidebar */
export const NAV_ICONS = {
  dashboard: <LayoutGrid size={16} />,
  users: <Users2 size={16} />,
  inscription: <UserPlus2 size={16} />,
  evaluations: <NotepadText size={16} />,
  statistics: <ChartNoAxesCombined size={16} />,
  reports: <FileText size={16} />,
  attendance: <ClockCheck size={16} />,
  logout: <LogOut size={16} />,
};

const baseItems = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: "dashboard" },
];

/**
 * Define que links se va a mostrarr, cambiar en el archivo "Constants" (Ppor si acaso) y se protegen en RoleRouter
 */
export const getSidebarItems = (role) => {
  if (role === ROLES.ADMIN) {
    return [
      ...baseItems,
      { label: "Usuarios", to: ROUTES.USERS, icon: "users" },
      {
        label: "Inscripciones",
        to: ROUTES.INSCRIPTION,
        icon: "inscription",
      },
      { label: "Asistencias", to: ROUTES.ATTENDANCE, icon: "attendance" },
      { label: "Evaluaciones", to: ROUTES.EVALUATIONS, icon: "evaluations" },
      { label: "Estadísticas", to: ROUTES.STATISTICS, icon: "statistics" },
      { label: "Reportes", to: ROUTES.REPORTS, icon: "reports" },
    ];
  }

  if (role === ROLES.ENTRENADOR) {
    return [
      ...baseItems,
      {
        label: "Inscripciones",
        to: ROUTES.INSCRIPTION,
        icon: "inscription",
      },
      { label: "Asistencias", to: ROUTES.ATTENDANCE, icon: "attendance" },
      { label: "Evaluaciones", to: ROUTES.EVALUATIONS, icon: "evaluations" },
      { label: "Estadísticas", to: ROUTES.STATISTICS, icon: "statistics" },
      { label: "Reportes", to: ROUTES.REPORTS, icon: "reports" },
    ];
  }

  if (role === ROLES.PASANTE) {
    return [
      ...baseItems,
      { label: "Asistencias", to: ROUTES.ATTENDANCE, icon: "attendance" },
      { label: "Evaluaciones", to: ROUTES.EVALUATIONS, icon: "evaluations" },
      { label: "Estadísticas", to: ROUTES.STATISTICS, icon: "statistics" },
      { label: "Reportes", to: ROUTES.REPORTS, icon: "reports" },
    ];
  }

  return baseItems;
};
