/**
 * CoachDashboard - Dashboard para Entrenadores
 * Acceso a inscripciones, asistencias, evaluaciones, estadísticas y reportes
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/config/constants";
import useAuth from "@/features/auth/hooks/useAuth";
import { DashboardCard, WelcomeHeader, QuickActions } from "../components";
import {
  UserPlus,
  ClipboardCheck,
  BarChart3,
  FileText,
  CalendarCheck,
  Clock,
  X,
} from "lucide-react";

const CoachDashboard = () => {
  const { user } = useAuth();
  const [showReminder, setShowReminder] = useState(true);

  const quickActions = [
    { label: "Tomar Asistencia", icon: CalendarCheck, to: ROUTES.ATTENDANCE },
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
      title: "Asistencias",
      description:
        "Registra la asistencia diaria de los deportistas y consulta el historial.",
      icon: CalendarCheck,
      to: ROUTES.ATTENDANCE,
      color: "primary",
      badge: "Hoy",
    },
    {
      title: "Inscripciones",
      description:
        "Registrar deportistas adultos y menores con sus respectivos datos.",
      icon: UserPlus,
      to: ROUTES.INSCRIPTION,
      color: "secondary",
    },
    {
      title: "Evaluaciones",
      description:
        "Crea y gestiona evaluaciones: tests de sprint, resistencia, yo-yo y técnicos.",
      icon: ClipboardCheck,
      to: ROUTES.EVALUATIONS,
      color: "accent",
    },
    {
      title: "Estadísticas",
      description:
        "Visualiza métricas de rendimiento y progreso de tus deportistas.",
      icon: BarChart3,
      to: ROUTES.STATISTICS,
      color: "info",
    },
    {
      title: "Reportes",
      description:
        "Genera reportes de asistencia, evaluaciones y estadísticas en múltiples formatos.",
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

      {/* Recordatorio de asistencia */}
      {showReminder && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base-content text-sm">
              Recordatorio de Asistencia
            </h3>
            <p className="text-xs text-base-content/60">
              No olvides registrar la asistencia del día de hoy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.ATTENDANCE}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-content text-xs font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Ir a Asistencias
            </Link>
            <button
              onClick={() => setShowReminder(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base-content/40 hover:text-base-content hover:bg-base-200 transition-all"
              aria-label="Cerrar recordatorio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Módulos principales */}
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

export default CoachDashboard;
