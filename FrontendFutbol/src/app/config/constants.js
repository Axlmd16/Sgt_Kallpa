/**
 * Archivo centralizado de constantes del sistema.
 */

/**
 * Clave para almacenar el token de autenticación
 */
export const AUTH_TOKEN_KEY = "kallpa_auth_token";

/**
 * Clave para almacenar el refresh token
 */
export const AUTH_REFRESH_TOKEN_KEY = "kallpa_refresh_token";

/**
 * Clave para almacenar información del usuario
 */
export const USER_DATA_KEY = "kallpa_user_data";

/**
 * Clave para almacenar preferencias del usuario
 */
export const USER_PREFERENCES_KEY = "kallpa_preferences";

// RUTAS DE LA APLICACIÓN

export const ROUTES = {
  // Landing
  LANDING: "/",

  //? Rutas públicas (sin autenticación)
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Registro público
  REGISTER: "/register",
  REGISTER_SCHOOL: "/register/escuela",
  REGISTER_CLUB: "/register/club",

  // Rutas de registro de atletas para clubes y escuelas
  INSCRIPTION: "/inscription",
  INSCRIPTION_DEPORTISTA: "/inscription/deportista",
  INSCRIPTION_MENOR: "/inscription/menor",
  INSCRIPTION_CREATE: "/inscription/create",
  INSCRIPTION_EDIT: "/inscription/edit/:id",
  ATHLETE_DETAIL: "/inscription/athlete/:id",
  REPRESENTATIVE_EDIT: "/inscription/representative/edit/:id",

  //? Rutas privadas (requieren autenticación)
  DASHBOARD: "/dashboard",

  // Usuarios
  USERS: "/users",
  USERS_CREATE: "/users/create",
  USERS_EDIT: "/users/edit/:id",

  // //   Inscripción
  //   INSCRIPTION: '/inscription',
  //   INSCRIPTION_DEPORTISTA: '/inscription/deportista',
  //   INSCRIPTION_MENOR: '/inscription/menor',

  // Seguimiento
  SEGUIMIENTO: "/seguimiento",
  EVALUATIONS: "/seguimiento/evaluations",
  STATISTICS: "/seguimiento/statistics",
  ATTENDANCE: "/seguimiento/attendance",
  REPORTS: "/seguimiento/reports",

  // Perfil y configuración
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  SETTINGS: "/settings",
};

// ==============================================
// CONFIGURACIÓN DE PAGINACIÓN

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

// ==============================================
// MENSAJES DEL SISTEMA

export const MESSAGES = {
  // Éxito
  SUCCESS: {
    LOGIN: "¡Bienvenido a Kallpa UNL!",
    LOGOUT: "Sesión cerrada correctamente",
    CREATED: "Registro creado exitosamente",
    UPDATED: "Registro actualizado exitosamente",
    DELETED: "Registro eliminado exitosamente",
    PASSWORD_RESET_SENT: "Se ha enviado un correo con las instrucciones",
    PASSWORD_CHANGED: "Contraseña actualizada correctamente",
    // Usuarios
    USER_CREATED: "Usuario creado exitosamente",
    USER_CREATED_DESC: "El nuevo usuario ha sido registrado en el sistema.",
    USER_UPDATED: "Usuario actualizado",
    USER_UPDATED_DESC: "Los cambios han sido guardados correctamente.",
    USER_DEACTIVATED: "Usuario desactivado",
    USER_DEACTIVATED_DESC: (name) => `${name} ha sido desactivado del sistema.`,
    // Deportistas
    ATHLETE_CREATED: "Deportista creado exitosamente",
    ATHLETE_CREATED_DESC:
      "El nuevo deportista ha sido registrado en el sistema.",
    ATHLETE_UPDATED: "Deportista actualizado",
    ATHLETE_UPDATED_DESC: "Los cambios han sido guardados correctamente.",
    ATHLETE_DEACTIVATED: "Deportista dado de baja",
    ATHLETE_DEACTIVATED_DESC: (name) =>
      `${name} ha sido dado de baja del sistema.`,
    ATHLETE_ACTIVATED: "Deportista activado",
    ATHLETE_ACTIVATED_DESC: (name) =>
      `${name} ha sido activado nuevamente en el sistema.`,
  },

  // Errores
  ERROR: {
    GENERIC: "Ocurrió un error inesperado",
    NETWORK: "Error de conexión. Verifica tu internet",
    UNAUTHORIZED: "No estás autorizado para realizar esta acción",
    NOT_FOUND: "El recurso solicitado no existe",
    VALIDATION: "Por favor, verifica los datos ingresados",
    LOGIN_FAILED: "Credenciales inválidas",
    // Usuarios
    USER_CREATE: "Error al crear usuario",
    USER_UPDATE: "Error al actualizar usuario",
    USER_DEACTIVATE: "Error al desactivar usuario",
    USER_LOAD: "No se pudo cargar el usuario",
    USER_SELF_DEACTIVATE: "No puedes desactivarte a ti mismo",
    USER_SELF_DEACTIVATE_DESC:
      "Por seguridad, no está permitido desactivar tu propia cuenta.",
    // Deportistas
    ATHLETE_CREATE: "Error al crear deportista",
    ATHLETE_UPDATE: "Error al actualizar deportista",
    ATHLETE_DEACTIVATE: "Error al dar de baja al deportista",
    ATHLETE_ACTIVATE: "Error al activar al deportista",
    ATHLETE_LOAD: "No se pudo cargar la lista de deportistas",
  },

  // Confirmaciones
  CONFIRM: {
    DELETE: "¿Estás seguro de eliminar este registro?",
    LOGOUT: "¿Deseas cerrar sesión?",
    UNSAVED_CHANGES: "Tienes cambios sin guardar. ¿Deseas continuar?",
  },
};

// CONFIGURACIÓN DE VALIDACIONES

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^[0-9]{10}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CI_PATTERN: /^[0-9]{10}$/,
};

// ESTADOS Y OPCIONES

/**
 * Estados de evaluación
 */
export const EVALUATION_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/**
 * Tipos de test deportivos
 */
export const TEST_TYPES = {
  SPRINT: "sprint",
  ENDURANCE: "endurance",
  YOYO: "yoyo",
  TECHNICAL: "technical",
};

/**
 * Etiquetas de tipos de test en español
 */
export const TEST_TYPE_LABELS = {
  "Sprint Test": {
    name: "Test de Velocidad",
    shortName: "Velocidad",
    color: "#3B82F6",
  },
  "YoYo Test": { name: "Test YoYo", shortName: "YoYo", color: "#10B981" },
  "Endurance Test": {
    name: "Test de Resistencia",
    shortName: "Resistencia",
    color: "#F59E0B",
  },
  "Technical Assessment": {
    name: "Evaluación Técnica",
    shortName: "Técnica",
    color: "#8B5CF6",
  },
};

/**
 * Estados de asistencia
 */
export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
};

/**
 * Géneros
 */
export const GENDER_OPTIONS = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Femenino" },
  { value: "OTHER", label: "Otro" },
];

/**
 * Categorías deportivas por edad
 */
export const SPORT_CATEGORIES = [
  { value: "sub8", label: "Sub-8", minAge: 6, maxAge: 8 },
  { value: "sub10", label: "Sub-10", minAge: 8, maxAge: 10 },
  { value: "sub12", label: "Sub-12", minAge: 10, maxAge: 12 },
  { value: "sub14", label: "Sub-14", minAge: 12, maxAge: 14 },
  { value: "sub16", label: "Sub-16", minAge: 14, maxAge: 16 },
  { value: "sub18", label: "Sub-18", minAge: 16, maxAge: 18 },
];

/**
 * Tipos de identificación
 */
export const TYPE_IDENTIFICATION_OPTIONS = [
  { value: "dni", label: "Cédula" },
  { value: "passport", label: "Pasaporte" },
  { value: "ruc", label: "RUC" },
];

/**
 * Tipos de estamento
 */
export const TYPE_STAMENT_OPTIONS = [
  { value: "administrativos", label: "Administrativos" },
  { value: "docentes", label: "Docentes" },
  { value: "estudiantes", label: "Estudiantes" },
  { value: "trabajadores", label: "Trabajadores" },
  { value: "externos", label: "Externos" },
];

/**
 * Opciones de estamento para filtros (valores en UPPERCASE como espera el backend)
 */
export const ESTAMENTO_FILTER_OPTIONS = [
  { value: "", label: "Todos los estamentos" },
  { value: "ESTUDIANTES", label: "Estudiantes" },
  { value: "DOCENTES", label: "Docentes" },
  { value: "ADMINISTRATIVOS", label: "Administrativos" },
  { value: "TRABAJADORES", label: "Trabajadores" },
  { value: "EXTERNOS", label: "Externos" },
];

/**
 * Tipos de relación (parentesco) para representantes
 */
export const RELATIONSHIP_TYPE_OPTIONS = [
  { value: "FATHER", label: "Padre" },
  { value: "MOTHER", label: "Madre" },
  { value: "LEGAL_GUARDIAN", label: "Tutor Legal" },
];

// ==============================================
//? CONFIGURACIÓN DE FECHAS

export const DATE_FORMATS = {
  SHORT: "DD/MM/YYYY",
  LONG: "DD [de] MMMM [de] YYYY",
  WITH_TIME: "DD/MM/YYYY HH:mm",
  ISO: "YYYY-MM-DD",
  TIME_ONLY: "HH:mm",
};

// ==============================================
//? CONFIGURACIÓN DE API

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/accounts/login",
    LOGOUT: "/accounts/logout",
    REFRESH: "/accounts/refresh",
    FORGOT_PASSWORD: "/accounts/password-reset/request",
    RESET_PASSWORD: "/accounts/password-reset/confirm",
    CHANGE_PASSWORD: "/accounts/change-password",
    ME: "/users/me",
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
    GET_ALL: "/users/all",
    CREATE: "/users/create",
    UPDATE: (id) => `/users/update/${id}`,
    DESACTIVATE: (id) => `/users/desactivate/${id}`,
    ACTIVATE: (id) => `/users/activate/${id}`,
  },

  // Athletes
  ATHLETES: {
    BASE: "/athletes",
    BY_ID: (id) => `/athletes/${id}`,
    GET_ALL: "/athletes/all",
    CREATE: "/athletes/register-unl",
    REGISTER_MINOR: "/athletes/register-minor",
    UPDATE: (id) => `/athletes/update/${id}`,
    DESACTIVATE: (id) => `/athletes/desactivate/${id}`,
    ACTIVATE: (id) => `/athletes/activate/${id}`,
  },

  // Evaluations
  EVALUATIONS: {
    BASE: "/evaluations",
    BY_ID: (id) => `/evaluations/${id}`,
    BY_USER: (userId) => `/evaluations/user/${userId}`,
    CREATE: "/evaluations",
    UPDATE: (id) => `/evaluations/${id}`,
    DELETE: (id) => `/evaluations/${id}`,
  },

  // Tests
  TESTS: {
    SPRINT: "/sprint-tests",
    ENDURANCE: "/endurance-tests",
    YOYO: "/yoyo-tests",
    TECHNICAL: "/technical-assessments",
  },

  // Statistics
  STATISTICS: {
    BASE: "/statistics",
    OVERVIEW: "/statistics/overview",
    ATTENDANCE: "/statistics/attendance",
    TESTS: "/statistics/tests",
    BY_ATHLETE: (id) => `/statistics/athlete/${id}`,
    UPDATE_SPORTS_STATS: (id) => `/statistics/athlete/${id}/sports-stats`,
    TESTS_HISTORY: (id) => `/statistics/athlete/${id}/tests-history`,
  },

  // Attendance
  ATTENDANCE: {
    BASE: "/attendances",
    BULK: "/attendances/bulk",
    BY_DATE: "/attendances/by-date",
    SUMMARY: "/attendances/summary",
    DATES: "/attendances/dates",
  },

  // Representatives
  REPRESENTATIVES: {
    BASE: "/representatives",
    GET_ALL: "/representatives/all",
    BY_ID: (id) => `/representatives/${id}`,
    BY_DNI: (dni) => `/representatives/by-dni/${dni}`,
    CREATE: "/representatives/create",
    UPDATE: (id) => `/representatives/update/${id}`,
    DEACTIVATE: (id) => `/representatives/deactivate/${id}`,
    ACTIVATE: (id) => `/representatives/activate/${id}`,
  },

  // Interns (Pasantes)
  INTERNS: {
    GET_ALL: "/users/interns",
    PROMOTE: (athleteId) => `/users/promote-athlete/${athleteId}`,
    ACTIVATE: (id) => `/users/interns/${id}/activate`,
    DEACTIVATE: (id) => `/users/interns/${id}/deactivate`,
  },

  // Reports
  REPORTS: {
    GENERATE: "/reports",
  },
};
