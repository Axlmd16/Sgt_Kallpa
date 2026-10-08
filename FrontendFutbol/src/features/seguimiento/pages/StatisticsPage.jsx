/**
 * StatisticsPage Component
 *
 * Dashboard de estadísticas del club con métricas clave,
 * asistencia y rendimiento en tests.
 * Usa TanStack Query para cache de datos.
 */

import React, { useState } from "react";
import { toast } from "sonner";
import { BarChart3, RefreshCw } from "lucide-react";

// Componentes compartidos
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader";

// Componentes de estadísticas
import {
  StatisticsFilters,
  StatisticsViewToggle,
  OverviewView,
  AttendanceView,
  TestsView,
} from "../components/StadisticsComponents";

// Hooks de estadísticas con cache
import {
  useClubOverview,
  useAttendanceStats,
  useTestPerformance,
  useInvalidateStatistics,
} from "../hooks/useStatistics";

/**
 * Página de estadísticas del club
 */
function StatisticsPage() {
  // Filtros
  const [filters, setFilters] = useState({
    type_athlete: "",
    sex: "",
    start_date: "",
    end_date: "",
  });

  // Vista activa
  const [activeView, setActiveView] = useState("overview");

  // Queries con cache
  const {
    data: clubOverview,
    isLoading: overviewLoading,
    isFetching: overviewFetching,
  } = useClubOverview(filters);

  const {
    data: attendanceStats,
    isLoading: attendanceLoading,
    isFetching: attendanceFetching,
  } = useAttendanceStats(filters);

  const {
    data: testPerformance,
    isLoading: testsLoading,
    isFetching: testsFetching,
  } = useTestPerformance(filters);

  // Invalidador de cache
  const { invalidateAll } = useInvalidateStatistics();

  // Estados derivados
  const loading = overviewLoading || attendanceLoading || testsLoading;
  const refreshing = overviewFetching || attendanceFetching || testsFetching;

  // Refrescar datos (invalida cache y fuerza recarga)
  const handleRefresh = () => {
    invalidateAll();
    toast.success("Actualizando estadísticas...");
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      type_athlete: "",
      sex: "",
      start_date: "",
      end_date: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <BarChart3 size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Módulo de Seguimiento
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Estadísticas del Club
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Visualiza métricas clave, asistencia y rendimiento
            </p>
          </div>

          {/* Botón Refrescar */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Actualizar
          </Button>
        </div>

        {/* Filtros */}
        <StatisticsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClear={handleClearFilters}
        />

        {/* Toggle de vistas */}
        <StatisticsViewToggle
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Vista General */}
        {activeView === "overview" && (
          <OverviewView
            clubOverview={clubOverview}
            attendanceStats={attendanceStats}
          />
        )}

        {/* Vista Asistencia */}
        {activeView === "attendance" && (
          <AttendanceView attendanceStats={attendanceStats} />
        )}

        {/* Vista Tests */}
        {activeView === "tests" && (
          <TestsView testPerformance={testPerformance} />
        )}
      </div>
    </div>
  );
}

export default StatisticsPage;
