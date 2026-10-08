/**
 * AdminDashboard - Dashboard para Administradores
 * Acceso completo a todas las funcionalidades
 */

import { ROUTES } from "@/app/config/constants";
import useAuth from "@/features/auth/hooks/useAuth";
import { DashboardCard, WelcomeHeader, QuickActions } from "../components";
import {
  Users,
  UserPlus,
  ClipboardCheck,
  BarChart3,
  FileText,
  Settings,
  UserCog,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    { label: "Nuevo Usuario", icon: UserCog, to: ROUTES.USERS_CREATE },
    {
      label: "Inscribir Deportista",
      icon: UserPlus,
      to: ROUTES.INSCRIPTION_DEPORTISTA,
    },
    {
      label: "Nueva Evaluación",
      icon: ClipboardCheck,
      to: `${ROUTES.EVALUATIONS}/create`,
    },
    { label: "Generar Reporte", icon: FileText, to: ROUTES.REPORTS },
  ];

  const modules = [
    {
      title: "Gestión de Usuarios",
      description:
        "Crear, editar y administrar usuarios del sistema. Gestiona permisos y accesos.",
      icon: UserCog,
      to: ROUTES.USERS,
      color: "primary",
      badge: "Admin",
    },
    {
      title: "Inscripciones",
      description:
        "Registrar deportistas adultos y menores. Gestiona representantes y documentos.",
      icon: UserPlus,
      to: ROUTES.INSCRIPTION,
      color: "secondary",
    },
    {
      title: "Evaluaciones",
      description:
        "Crear y administrar evaluaciones deportivas: tests físicos, técnicos y yo-yo.",
      icon: ClipboardCheck,
      to: ROUTES.EVALUATIONS,
      color: "accent",
    },
    {
      title: "Estadísticas",
      description:
        "Consulta métricas de rendimiento, asistencia y progreso de los deportistas.",
      icon: BarChart3,
      to: ROUTES.STATISTICS,
      color: "info",
    },
    {
      title: "Reportes",
      description:
        "Genera y exporta reportes en PDF, CSV y XLSX con datos de asistencia y evaluaciones.",
      icon: FileText,
      to: ROUTES.REPORTS,
      color: "success",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header de bienvenida */}
      <WelcomeHeader user={user} />

      {/* Acciones rápidas */}
      <QuickActions actions={quickActions} />

      {/* Módulos principales */}
      <div>
        <h2 className="text-lg font-semibold text-base-content mb-4">
          Módulos del Sistema
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <DashboardCard key={index} {...module} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
