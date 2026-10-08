/**
 * AthleteDetailPage
 *
 * Página de detalle de deportista con estadísticas individuales,
 * asistencia, tests realizados y gráficos de progreso.
 * Usa TanStack Query para cache de datos.
 */

import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Activity,
  Calendar,
  ClipboardList,
  Zap,
  Heart,
  Target,
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Users,
  Phone,
  Mail,
  Pencil,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import {
  ROUTES,
  GENDER_OPTIONS,
  TEST_TYPE_LABELS,
} from "@/app/config/constants";
import {
  getPerformanceLevel,
  formatStatValue,
} from "@/shared/utils/performanceUtils";
import StatsHelpModal from "../components/StatsHelpModal";
import SportsStatsModal from "../components/SportsStatsModal";
import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

// Hooks de estadísticas con cache
import {
  useAthleteInfo,
  useAthleteStats,
  useAthleteTestsHistory,
} from "@/features/seguimiento/hooks/useStatistics";

// Colores para los gráficos
const CHART_COLORS = {
  "Sprint Test": "#f59e0b",
  "YoYo Test": "#ef4444",
  "Endurance Test": "#3b82f6",
  "Technical Assessment": "#10b981",
};

// Función para formatear fecha legible
const formatDateLabel = (dateStr) => {
  if (!dateStr) return "Sin fecha";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// Tooltip personalizado para los gráficos
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 shadow-xl rounded-xl p-4 border border-base-300 min-w-[180px]">
        <p className="font-semibold text-sm mb-2 text-base-content border-b border-base-200 pb-2">
          📅 {formatDateLabel(label)}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-base-content/70">
                  {entry.name}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: entry.color }}
              >
                {entry.value}
                <span className="text-xs font-normal text-base-content/50">
                  /100
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Helper functions
const getGenderLabel = (sex) => {
  if (!sex) return "No especificado";
  const normalized = sex.toUpperCase();
  const found = GENDER_OPTIONS.find((g) => g.value === normalized);
  return found?.label || sex;
};

const getTestLabel = (testType) => TEST_TYPE_LABELS[testType]?.name || testType;

// Helper para obtener etiqueta de parentesco
const getRelationshipLabel = (relationship) => {
  if (!relationship) return "-";
  const normalized = relationship.toUpperCase();
  const labels = {
    FATHER: "Padre",
    MOTHER: "Madre",
    LEGAL_GUARDIAN: "Tutor Legal",
  };
  return labels[normalized] || relationship;
};

function AthleteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSportsModal, setShowSportsModal] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState("all");

  // Queries con cache (5 minutos)
  const {
    data: athleteInfo,
    isLoading: infoLoading,
    isError: infoError,
    error: infoErrorData,
  } = useAthleteInfo(id);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useAthleteStats(id);

  // Historial de tests para gráficos de progreso
  const { data: testsHistory, isLoading: testsHistoryLoading } =
    useAthleteTestsHistory(id);

  const loading = infoLoading || statsLoading;
  const error = infoError ? infoErrorData?.message : null;

  // Preparar datos para gráficos
  const { progressData, radarData, testTypes } = useMemo(() => {
    if (!testsHistory?.tests_history?.length) {
      return { progressData: [], radarData: [], testTypes: [] };
    }

    // Tipos de test disponibles
    const availableTypes = [
      ...new Set(testsHistory.tests_history.map((t) => t.test_type)),
    ];

    // Datos para gráfico de progreso temporal (LineChart)
    // Agrupar por fecha y tipo de test
    const byDate = {};
    testsHistory.tests_history.forEach((test) => {
      const dateKey = test.date;
      if (!byDate[dateKey]) {
        byDate[dateKey] = { date: dateKey };
      }
      byDate[dateKey][test.test_type] = test.score;
    });
    const progressChartData = Object.values(byDate).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    // Datos para RadarChart (último puntaje por tipo)
    const summaryData = testsHistory.summary_by_type || {};
    const radarChartData = Object.entries(summaryData).map(([type, data]) => ({
      type: type.replace(" Test", "").replace(" Assessment", ""),
      score: data.last_score || 0,
      fullMark: 100,
    }));

    return {
      progressData: progressChartData,
      radarData: radarChartData,
      testTypes: availableTypes,
    };
  }, [testsHistory]);

  // Función para obtener icono de tendencia
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp size={16} className="text-success" />;
      case "declining":
        return <TrendingDown size={16} className="text-error" />;
      default:
        return <Minus size={16} className="text-base-content/50" />;
    }
  };

  const getTrendLabel = (trend) => {
    switch (trend) {
      case "improving":
        return "Mejorando";
      case "declining":
        return "Bajando";
      default:
        return "Estable";
    }
  };

  // Handler para guardar estadísticas deportivas
  const handleSaveSportsStats = async (formData) => {
    setSavingStats(true);
    try {
      await http.patch(
        API_ENDPOINTS.STATISTICS.UPDATE_SPORTS_STATS(id),
        formData,
      );
      toast.success("Estadísticas actualizadas", {
        description:
          "Las estadísticas deportivas se han guardado correctamente.",
      });
      setShowSportsModal(false);
      refetchStats(); // Refrescar datos
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error("Error al guardar", { description: message });
    } finally {
      setSavingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !athleteInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} className="text-error" />
        <p className="text-base-content/70">
          {error || "Atleta no encontrado"}
        </p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => navigate(ROUTES.INSCRIPTION)}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              {athleteInfo.full_name}
            </h1>
            <p className="text-base-content/60">Detalle del deportista</p>
          </div>
          <div className="ml-auto">
            <span
              className={`badge ${
                athleteInfo.is_active ? "badge-success" : "badge-error"
              } gap-1`}
            >
              {athleteInfo.is_active ? (
                <CheckCircle size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {athleteInfo.is_active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* Sections: General Info + Representative (side by side) */}
        <div
          className={`grid gap-4 ${
            athleteInfo.representative_id ? "lg:grid-cols-2" : ""
          }`}
        >
          {/* Section 1: General Info */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-base flex items-center gap-2 mb-4 pb-3 border-b border-base-200">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                Información del Deportista
              </h2>

              {athleteInfo.representative_id ? (
                // Layout compacto cuando hay representante
                <>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Nombre
                      </p>
                      <p className="font-medium text-sm">
                        {athleteInfo.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        DNI
                      </p>
                      <p className="font-medium font-mono text-sm">
                        {athleteInfo.dni}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Tipo
                      </p>
                      <span className="badge badge-ghost badge-xs">
                        {athleteInfo.type_athlete ||
                          athleteInfo.type_stament ||
                          "-"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Sexo
                      </p>
                      <p className="font-medium text-sm">
                        {getGenderLabel(athleteInfo.sex)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider">
                        Nacimiento
                      </p>
                      <p className="font-medium text-sm">
                        {athleteInfo.date_of_birth || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                        <Phone size={10} /> Teléfono
                      </p>
                      <p className="font-medium text-sm">
                        {athleteInfo.phone || "S/N"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-base-200/50 rounded-lg p-2.5 text-center">
                      <p className="text-base font-bold text-primary">
                        {athleteInfo.height || "-"}
                      </p>
                      <p className="text-[10px] text-base-content/60">
                        Altura (cm)
                      </p>
                    </div>
                    <div className="bg-base-200/50 rounded-lg p-2.5 text-center">
                      <p className="text-base font-bold text-primary">
                        {athleteInfo.weight || "-"}
                      </p>
                      <p className="text-[10px] text-base-content/60">
                        Peso (kg)
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // Layout horizontal cuando NO hay representante
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Nombre completo
                    </p>
                    <p className="font-medium">{athleteInfo.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      DNI
                    </p>
                    <p className="font-medium font-mono">{athleteInfo.dni}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Tipo
                    </p>
                    <span className="badge badge-ghost badge-sm">
                      {athleteInfo.type_athlete ||
                        athleteInfo.type_stament ||
                        "-"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Sexo
                    </p>
                    <p className="font-medium">
                      {getGenderLabel(athleteInfo.sex)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Fecha de nacimiento
                    </p>
                    <p className="font-medium">
                      {athleteInfo.date_of_birth || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Phone size={10} /> Teléfono
                    </p>
                    <p className="font-medium">{athleteInfo.phone || "S/N"}</p>
                  </div>
                  <div className="bg-base-200/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-primary">
                      {athleteInfo.height || "-"}
                    </p>
                    <p className="text-xs text-base-content/60">Altura (cm)</p>
                  </div>
                  <div className="bg-base-200/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-primary">
                      {athleteInfo.weight || "-"}
                    </p>
                    <p className="text-xs text-base-content/60">Peso (kg)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Representative Info (only for minors) */}
          {athleteInfo.representative_id && (
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-5">
                <h2 className="card-title text-base flex items-center justify-between mb-4 pb-3 border-b border-base-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Users size={16} className="text-secondary" />
                    </div>
                    Representante Legal
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        ROUTES.REPRESENTATIVE_EDIT.replace(
                          ":id",
                          athleteInfo.representative_id,
                        ),
                      )
                    }
                    className="btn btn-ghost btn-xs gap-1"
                    title="Editar representante"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="col-span-2">
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">
                      Nombre completo
                    </p>
                    <p className="font-medium text-sm">
                      {athleteInfo.representative_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">
                      DNI
                    </p>
                    <p className="font-medium font-mono text-sm">
                      {athleteInfo.representative_dni || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">
                      Parentesco
                    </p>
                    <span className="badge badge-secondary badge-sm">
                      {getRelationshipLabel(
                        athleteInfo.representative_relationship,
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                      <Phone size={10} /> Teléfono
                    </p>
                    <p className="font-medium text-sm">
                      {athleteInfo.representative_phone || "S/N"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider flex items-center gap-1">
                      <Mail size={10} /> Correo
                    </p>
                    <p
                      className="font-medium text-sm truncate"
                      title={athleteInfo.representative_email}
                    >
                      {athleteInfo.representative_email || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Individual Stats */}
        {stats && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-lg flex items-center gap-2 mb-4">
                <Activity size={20} className="text-info" />
                Estadísticas Individuales
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Physical Stats */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-base-content/80 flex items-center gap-2">
                      <Zap size={16} className="text-warning" />
                      Rendimiento Físico
                    </h3>
                    <button
                      className="btn btn-ghost btn-xs gap-1"
                      onClick={() => setShowHelpModal(true)}
                    >
                      <HelpCircle size={14} />
                      ¿Cómo se calculan?
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Speed */}
                    <div className="bg-base-200/50 rounded-lg p-3 text-center">
                      <Zap size={20} className="mx-auto mb-1 text-yellow-500" />
                      <p className="text-xl font-bold">
                        {formatStatValue(stats.speed)}
                      </p>
                      <p className="text-xs text-base-content/60 mb-1">
                        Velocidad
                      </p>
                      <span
                        className={`badge ${
                          getPerformanceLevel(stats.speed).badgeClass
                        } badge-sm`}
                      >
                        {getPerformanceLevel(stats.speed).level}
                      </span>
                    </div>
                    {/* Stamina */}
                    <div className="bg-base-200/50 rounded-lg p-3 text-center">
                      <Heart size={20} className="mx-auto mb-1 text-red-500" />
                      <p className="text-xl font-bold">
                        {formatStatValue(stats.stamina)}
                      </p>
                      <p className="text-xs text-base-content/60 mb-1">
                        Resistencia
                      </p>
                      <span
                        className={`badge ${
                          getPerformanceLevel(stats.stamina).badgeClass
                        } badge-sm`}
                      >
                        {getPerformanceLevel(stats.stamina).level}
                      </span>
                    </div>
                    {/* Agility */}
                    <div className="bg-base-200/50 rounded-lg p-3 text-center">
                      <Target
                        size={20}
                        className="mx-auto mb-1 text-green-500"
                      />
                      <p className="text-xl font-bold">
                        {formatStatValue(stats.agility)}
                      </p>
                      <p className="text-xs text-base-content/60 mb-1">
                        Agilidad
                      </p>
                      <span
                        className={`badge ${
                          getPerformanceLevel(stats.agility).badgeClass
                        } badge-sm`}
                      >
                        {getPerformanceLevel(stats.agility).level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Game Stats */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-base-content/80 flex items-center gap-2">
                      <Trophy size={16} className="text-amber-500" />
                      Rendimiento Deportivo
                    </h3>
                    <button
                      className="btn btn-ghost btn-xs gap-1"
                      onClick={() => setShowSportsModal(true)}
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">
                        Partidos jugados
                      </span>
                      <span className="font-bold">{stats.matches_played}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">Goles</span>
                      <span className="font-bold text-success">
                        {stats.goals}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">Asistencias</span>
                      <span className="font-bold text-info">
                        {stats.assists}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-200">
                      <span className="text-base-content/70">
                        Tarjetas amarillas
                      </span>
                      <span className="font-bold text-warning">
                        {stats.yellow_cards}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base-content/70">
                        Tarjetas rojas
                      </span>
                      <span className="font-bold text-error">
                        {stats.red_cards}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Attendance */}
        {stats && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <h2 className="card-title text-lg flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-success" />
                Asistencia
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-base-200/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {stats.attendance_total}
                  </p>
                  <p className="text-sm text-base-content/60">
                    Total registros
                  </p>
                </div>
                <div className="bg-success/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-success">
                    {stats.attendance_present}
                  </p>
                  <p className="text-sm text-base-content/60">Presentes</p>
                </div>
                <div className="bg-error/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-error">
                    {stats.attendance_absent}
                  </p>
                  <p className="text-sm text-base-content/60">Ausentes</p>
                </div>
                <div className="bg-info/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-info">
                    {stats.attendance_rate}%
                  </p>
                  <p className="text-sm text-base-content/60">
                    Tasa de asistencia
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Tests y Evaluaciones con Gráficos de Progreso */}
        {stats && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <ClipboardList size={20} className="text-secondary" />
                  Tests y Evaluaciones
                </h2>
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-base-content/50" />
                  <span className="text-sm text-base-content/60">
                    Progreso del deportista
                  </span>
                </div>
              </div>

              {/* KPIs de Tests */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-secondary/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-secondary">
                    {stats.tests_completed}
                  </p>
                  <p className="text-xs text-base-content/60">
                    Tests completados
                  </p>
                </div>
                {testsHistory?.summary_by_type &&
                  Object.entries(testsHistory.summary_by_type)
                    .slice(0, 3)
                    .map(([type, data]) => (
                      <div
                        key={type}
                        className="bg-base-200/50 rounded-lg p-4 text-center"
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <p
                            className="text-2xl font-bold"
                            style={{ color: CHART_COLORS[type] || "#6b7280" }}
                          >
                            {data.last_score}
                          </p>
                          {getTrendIcon(data.trend)}
                        </div>
                        <p className="text-xs text-base-content/60">
                          {type.replace(" Test", "").replace(" Assessment", "")}
                        </p>
                        <p className="text-[10px] text-base-content/40">
                          {getTrendLabel(data.trend)}
                        </p>
                      </div>
                    ))}
              </div>

              {testsHistory?.tests_history?.length > 0 ? (
                <>
                  {/* Gráficos de Progreso */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Gráfico de Progreso Temporal */}
                    <div className="bg-base-200/30 rounded-xl p-4">
                      <h3 className="font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" />
                        Progreso en el Tiempo
                      </h3>
                      {/* Filtro de tipo de test */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <button
                          className={`btn btn-xs ${
                            selectedTestType === "all"
                              ? "btn-primary"
                              : "btn-ghost"
                          }`}
                          onClick={() => setSelectedTestType("all")}
                        >
                          Todos
                        </button>
                        {testTypes.map((type) => (
                          <button
                            key={type}
                            className={`btn btn-xs ${
                              selectedTestType === type
                                ? "btn-primary"
                                : "btn-ghost"
                            }`}
                            onClick={() => setSelectedTestType(type)}
                            style={
                              selectedTestType === type
                                ? { backgroundColor: CHART_COLORS[type] }
                                : {}
                            }
                          >
                            {type
                              .replace(" Test", "")
                              .replace(" Assessment", "")}
                          </button>
                        ))}
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={progressData}>
                            <defs>
                              {testTypes.map((type) => (
                                <linearGradient
                                  key={type}
                                  id={`gradient-${type.replace(/\s+/g, "-")}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor={CHART_COLORS[type]}
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor={CHART_COLORS[type]}
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              ))}
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="opacity-30"
                            />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 10 }}
                              tickFormatter={(v) =>
                                new Date(v).toLocaleDateString("es", {
                                  month: "short",
                                  day: "numeric",
                                })
                              }
                            />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            {testTypes
                              .filter(
                                (type) =>
                                  selectedTestType === "all" ||
                                  selectedTestType === type,
                              )
                              .map((type) => (
                                <Area
                                  key={type}
                                  type="monotone"
                                  dataKey={type}
                                  name={type
                                    .replace(" Test", "")
                                    .replace(" Assessment", "")}
                                  stroke={CHART_COLORS[type]}
                                  fill={`url(#gradient-${type.replace(/\s+/g, "-")})`}
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  connectNulls
                                />
                              ))}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Radar Chart de Habilidades */}
                    {radarData.length >= 3 && (
                      <div className="bg-base-200/30 rounded-xl p-4">
                        <h3 className="font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                          <Target size={16} className="text-success" />
                          Perfil de Habilidades
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                              <PolarGrid />
                              <PolarAngleAxis
                                dataKey="type"
                                tick={{ fontSize: 11 }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fontSize: 9 }}
                              />
                              <Radar
                                name="Último Puntaje"
                                dataKey="score"
                                stroke="#8b5cf6"
                                fill="#8b5cf6"
                                fillOpacity={0.4}
                                strokeWidth={2}
                              />
                              <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Si hay menos de 3 tipos de test, mostrar resumen alternativo */}
                    {radarData.length < 3 && radarData.length > 0 && (
                      <div className="bg-base-200/30 rounded-xl p-4">
                        <h3 className="font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                          <Activity size={16} className="text-info" />
                          Resumen de Rendimiento
                        </h3>
                        <div className="space-y-4 mt-4">
                          {Object.entries(testsHistory.summary_by_type).map(
                            ([type, data]) => (
                              <div key={type} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{type}</span>
                                  <span className="flex items-center gap-2">
                                    {getTrendIcon(data.trend)}
                                    <span className="font-bold">
                                      {data.last_score}/100
                                    </span>
                                  </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-3">
                                  <div
                                    className="h-3 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${data.last_score}%`,
                                      backgroundColor: CHART_COLORS[type],
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-base-content/50">
                                  <span>Promedio: {data.avg_score}</span>
                                  <span>Mejor: {data.best_score}</span>
                                  <span>Tests: {data.count}</span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tabla de detalle de tests */}
                  <div className="bg-base-200/30 rounded-xl p-4">
                    <h3 className="font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                      <ClipboardList size={16} className="text-secondary" />
                      Historial de Tests
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr className="text-base-content/60">
                            <th>Fecha</th>
                            <th>Tipo de Test</th>
                            <th className="text-right">Valor</th>
                            <th className="text-right">Puntaje</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testsHistory.tests_history
                            .slice()
                            .reverse()
                            .slice(0, 10)
                            .map((test, index) => (
                              <tr key={index} className="hover:bg-base-200/50">
                                <td className="text-xs">
                                  {new Date(test.date).toLocaleDateString(
                                    "es",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </td>
                                <td>
                                  <span
                                    className="badge badge-sm"
                                    style={{
                                      backgroundColor:
                                        CHART_COLORS[test.test_type] + "20",
                                      color: CHART_COLORS[test.test_type],
                                      borderColor: CHART_COLORS[test.test_type],
                                    }}
                                  >
                                    {test.test_type
                                      .replace(" Test", "")
                                      .replace(" Assessment", "")}
                                  </span>
                                </td>
                                <td className="text-right font-mono text-sm">
                                  {test.raw_value} {test.raw_unit}
                                </td>
                                <td className="text-right">
                                  <span
                                    className="font-bold"
                                    style={{
                                      color: CHART_COLORS[test.test_type],
                                    }}
                                  >
                                    {test.score}
                                  </span>
                                  <span className="text-xs text-base-content/50">
                                    /100
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    {testsHistory.tests_history.length > 10 && (
                      <p className="text-xs text-base-content/50 text-center mt-2">
                        Mostrando los 10 tests más recientes de{" "}
                        {testsHistory.tests_history.length} totales
                      </p>
                    )}
                  </div>
                </>
              ) : testsHistoryLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-md text-secondary" />
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList
                    size={48}
                    className="mx-auto text-base-content/20 mb-3"
                  />
                  <p className="text-base-content/50">
                    No hay tests registrados para este deportista
                  </p>
                  <p className="text-xs text-base-content/40 mt-1">
                    Los gráficos de progreso aparecerán cuando se registren
                    tests
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help Modal */}
      <StatsHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* Sports Stats Modal */}
      <SportsStatsModal
        isOpen={showSportsModal}
        onClose={() => setShowSportsModal(false)}
        onSave={handleSaveSportsStats}
        stats={stats}
        athleteName={athleteInfo?.full_name || ""}
        loading={savingStats}
      />
    </>
  );
}

export default AthleteDetailPage;
