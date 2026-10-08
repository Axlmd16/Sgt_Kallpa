/**
 * InternDashboard - Dashboard para Pasantes
 * Acceso a asistencias, evaluaciones, estadísticas y reportes
 */

import { ROUTES } from "@/app/config/constants";
import useAuth from "@/features/auth/hooks/useAuth";
import { DashboardCard, WelcomeHeader, QuickActions } from "../components";
import {
  ClipboardCheck,
  BarChart3,
  FileText,
  CalendarCheck,
  BookOpen,
} from "lucide-react";

const InternDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    { label: "Tomar Asistencia", icon: CalendarCheck, to: ROUTES.ATTENDANCE },
    {
      label: "Nueva Evaluación",
      icon: ClipboardCheck,
      to: `${ROUTES.EVALUATIONS}/create`,
    },
    { label: "Ver Estadísticas", icon: BarChart3, to: ROUTES.STATISTICS },
    { label: "Generar Reporte", icon: FileText, to: ROUTES.REPORTS },
  ];

  const modules = [
    {
      title: "Asistencias",
      description:
        "Registra la asistencia diaria de los deportistas asignados.",
      icon: CalendarCheck,
      to: ROUTES.ATTENDANCE,
      color: "primary",
    },
    {
      title: "Evaluaciones",
      description: "Aplica tests físicos y técnicos a los deportistas.",
      icon: ClipboardCheck,
      to: ROUTES.EVALUATIONS,
      color: "accent",
    },
    {
      title: "Estadísticas",
      description: "Consulta métricas y análisis de rendimiento deportivo.",
      icon: BarChart3,
      to: ROUTES.STATISTICS,
      color: "info",
    },
    {
      title: "Reportes",
      description: "Genera reportes de datos para análisis y documentación.",
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

      {/* Tip para pasantes */}
      <div className="bg-gradient-to-r from-info/10 via-info/5 to-transparent rounded-2xl border border-info/20 p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-info text-info-content flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base-content text-sm">Consejo</h3>
          <p className="text-xs text-base-content/60">
            Revisa las estadísticas para identificar áreas de mejora. Usa los
            reportes para documentar tu trabajo.
          </p>
        </div>
      </div>

      {/* Módulos disponibles */}
      <div>
        <h2 className="text-lg font-semibold text-base-content mb-4">
          Mis Herramientas
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

export default InternDashboard;
