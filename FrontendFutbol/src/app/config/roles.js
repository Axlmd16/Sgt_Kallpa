/**
 * Configuración de Roles y Permisos
 * Define los roles del sistema y sus permisos asociados.
 */

/**
 * Enumeración de roles disponibles en el sistema
 */
export const ROLES = {
  ADMIN: "Administrator",
  ENTRENADOR: "Coach",
  PASANTE: "Intern",
};

/**
 * Configuración de permisos por rol
 * Define qué acciones puede realizar cada rol
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManageInscriptions: true,
    canViewReports: true,
    canCreateEvaluations: true,
    canEditEvaluations: true,
    canDeleteEvaluations: true,
    canViewStatistics: true,
    canExportData: true,
    canManageSettings: true,
    canTakeAttendance: true,
    canEditAttendance: true,
    canViewAttendance: true,
  },
  [ROLES.ENTRENADOR]: {
    canManageUsers: false,
    canManageInscriptions: true,
    canViewReports: true,
    canCreateEvaluations: true,
    canEditEvaluations: true,
    canDeleteEvaluations: false,
    canViewStatistics: true,
    canExportData: true,
    canManageSettings: false,
    canTakeAttendance: true,
    canEditAttendance: true,
    canViewAttendance: true,
  },
  [ROLES.PASANTE]: {
    canManageUsers: false,
    canManageInscriptions: false,
    canViewReports: true,
    canCreateEvaluations: true,
    canEditEvaluations: true,
    canDeleteEvaluations: false,
    canViewStatistics: true,
    canExportData: true,
    canManageSettings: false,
    canTakeAttendance: true,
    canEditAttendance: true,
    canViewAttendance: true,
  },
};

/**
 * Rutas accesibles por rol
 * Define qué rutas puede acceder cada rol
 */
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: [
    "/dashboard",
    "/users",
    "/users/create",
    "/users/edit",
    "/seguimiento",
    "/seguimiento/evaluations",
    "/seguimiento/statistics",
    "/seguimiento/reports",
    "/seguimiento/attendance",

    "/settings",
  ],
  [ROLES.ENTRENADOR]: [
    "/dashboard",
    "/inscription",
    "/inscription/deportista",
    "/inscription/menor",
    "/inscription/create",
    "/inscription/edit",
    "/seguimiento",
    "/seguimiento/evaluations",
    "/seguimiento/statistics",
    "/seguimiento/reports",
    "/seguimiento/attendance",
  ],
  [ROLES.PASANTE]: [
    "/dashboard",
    "/seguimiento/statistics",
    "/seguimiento/reports",
    "/seguimiento/evaluations",
    "/seguimiento/attendance",
  ],
};

/**
 * Verifica si un rol tiene acceso a una ruta específica
 */
export const hasRouteAccess = (role, path) => {
  if (!role || !path) return false;
  const allowedRoutes = ROLE_ROUTES[role] || [];
  return allowedRoutes.some((route) => path.startsWith(route));
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export const hasPermission = (role, permission) => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.[permission] === true;
};

/**
 * Obtiene todos los permisos de un rol
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || {};
};

/**
 * Lista de roles para mostrar en selectores
 */
export const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: "Administrador" },
  { value: ROLES.ENTRENADOR, label: "Entrenador" },
  { value: ROLES.PASANTE, label: "Pasante" },
];
