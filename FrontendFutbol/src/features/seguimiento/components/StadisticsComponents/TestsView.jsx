/**
 * TestsView Component
 *
 * Vista de estadísticas de tests con información detallada
 * y gráficos complementarios para visualizar el progreso de los atletas.
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Activity,
  Award,
  BarChart3,
  Trophy,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
  Line,
  CartesianGrid,
} from "recharts";
import KPICard from "./KPICard";
import { TEST_TYPE_LABELS } from "@/app/config/constants";

// Helper para obtener nombre y color en español desde constantes
const getTestNameES = (testType) =>
  TEST_TYPE_LABELS[testType]?.name || testType;
const getTestShortName = (testType) =>
  TEST_TYPE_LABELS[testType]?.shortName || testType;
const getTestColor = (testType) =>
  TEST_TYPE_LABELS[testType]?.color || "#6B7280";

// Colores para gráficos
const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  warning: "#F59E0B",
  info: "#06B6D4",
  purple: "#8B5CF6",
};

// Custom tooltip para gráficos
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 border border-base-300 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-base-content text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value !== null ? entry.value : "N/A"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function TestsView({ testPerformance }) {
  if (!testPerformance) {
    return (
      <div className="text-center py-8 text-base-content/60">
        No hay datos de tests disponibles
      </div>
    );
  }

  // Preparar datos para gráfico con nombres cortos desde constantes
  const chartData =
    testPerformance.tests_by_type?.map((item) => ({
      name: getTestShortName(item.test_type),
      tests: item.total_tests,
      fill: getTestColor(item.test_type),
    })) || [];

  // Preparar datos para gráfico radar (rendimiento por tipo)
  const radarData =
    testPerformance.tests_by_type?.map((item) => ({
      subject: getTestShortName(item.test_type),
      promedio: item.avg_score || 0,
      maximo: item.max_score || 0,
      fullMark: 100,
    })) || [];

  // Preparar datos para gráfico comparativo de barras (promedio vs máximo)
  const comparisonData =
    testPerformance.tests_by_type?.map((item) => ({
      name: getTestShortName(item.test_type),
      promedio: item.avg_score || 0,
      minimo: item.min_score || 0,
      maximo: item.max_score || 0,
      color: getTestColor(item.test_type),
    })) || [];

  // Calcular estadísticas adicionales
  const avgOverall =
    testPerformance.tests_by_type?.length > 0
      ? (
          testPerformance.tests_by_type.reduce(
            (sum, t) => sum + (t.avg_score || 0),
            0,
          ) / testPerformance.tests_by_type.length
        ).toFixed(1)
      : 0;

  const maxScore =
    testPerformance.tests_by_type?.reduce(
      (max, t) => Math.max(max, t.max_score || 0),
      0,
    ) || 0;

  return (
    <div className="space-y-4">
      {/* KPIs - Fila superior */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          icon={Activity}
          title="Total de Tests"
          value={testPerformance.total_tests || 0}
          color="primary"
        />
        <KPICard
          icon={BarChart3}
          title="Tipos de Tests"
          value={testPerformance.tests_by_type?.length || 0}
          subtitle="Categorías"
          color="info"
        />
        <KPICard
          icon={Award}
          title="Atletas Evaluados"
          value={testPerformance.top_performers?.length || 0}
          color="success"
        />
        <KPICard
          icon={TrendingUp}
          title="Puntaje Promedio"
          value={avgOverall}
          subtitle="General"
          color="primary"
        />
        <KPICard
          icon={Target}
          title="Puntaje Máximo"
          value={maxScore}
          subtitle="Mejor resultado"
          color="warning"
        />
      </div>

      {/* Sección de Gráficos de Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico Radar - Rendimiento por tipo de test */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Target size={18} className="text-purple-500" />
              Rendimiento Comparativo por Tipo
            </h3>
            {radarData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={radarData}
                  >
                    <PolarGrid stroke="oklch(var(--bc)/0.2)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: "oklch(var(--bc)/0.7)" }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: "oklch(var(--bc)/0.5)" }}
                    />
                    <Radar
                      name="Promedio"
                      dataKey="promedio"
                      stroke={CHART_COLORS.primary}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Máximo"
                      dataKey="maximo"
                      stroke={CHART_COLORS.secondary}
                      fill={CHART_COLORS.secondary}
                      fillOpacity={0.3}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-base-content/50 text-sm">
                  Sin datos suficientes
                </p>
              </div>
            )}
            <p className="text-xs text-base-content/50 text-center mt-2">
              Compara el promedio vs máximo alcanzado en cada tipo de test
            </p>
          </div>
        </div>

        {/* Gráfico de Barras Comparativo - Promedio vs Máximo */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-info" />
              Progreso: Promedio vs Máximo
            </h3>
            {comparisonData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={comparisonData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(var(--bc)/0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "oklch(var(--bc)/0.6)" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "oklch(var(--bc)/0.6)" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar
                      dataKey="promedio"
                      name="Promedio"
                      fill={CHART_COLORS.primary}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                    <Line
                      type="monotone"
                      dataKey="maximo"
                      name="Máximo"
                      stroke={CHART_COLORS.warning}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.warning, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-base-content/50 text-sm">Sin datos</p>
              </div>
            )}
            <p className="text-xs text-base-content/50 text-center mt-2">
              Barras muestran promedio, línea muestra máximo alcanzado
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal - Tabla y distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Detalles por tipo de test */}
        <div className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Activity size={18} className="text-primary" />
              Rendimiento por Tipo de Test
            </h3>
            {testPerformance.tests_by_type?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="text-base-content/60">
                      <th>Tipo</th>
                      <th className="text-right">Tests</th>
                      <th className="text-right">Promedio</th>
                      <th className="text-right">Mín</th>
                      <th className="text-right">Máx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testPerformance.tests_by_type.map((item, index) => (
                      <tr key={index} className="hover:bg-base-200/50">
                        <td>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor: getTestColor(item.test_type),
                              }}
                            />
                            <span className="font-medium">
                              {getTestNameES(item.test_type)}
                            </span>
                          </div>
                        </td>
                        <td className="text-right font-semibold text-primary">
                          {item.total_tests}
                        </td>
                        <td className="text-right">
                          {item.avg_score !== null ? item.avg_score : "-"}
                        </td>
                        <td className="text-right text-base-content/60">
                          {item.min_score !== null ? item.min_score : "-"}
                        </td>
                        <td className="text-right text-base-content/60">
                          {item.max_score !== null ? item.max_score : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-base-content/50 text-sm text-center py-4">
                Sin tests registrados
              </p>
            )}
          </div>
        </div>

        {/* Mini gráfico */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <BarChart3 size={18} className="text-info" />
              Distribución
            </h3>
            {chartData.length > 0 ? (
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      stroke="oklch(var(--bc)/0.3)"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      stroke="oklch(var(--bc)/0.3)"
                      width={70}
                    />
                    <Tooltip
                      formatter={(value) => [value, "Tests"]}
                      contentStyle={{
                        backgroundColor: "oklch(var(--b1))",
                        border: "1px solid oklch(var(--b3))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="tests" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-base-content/50 text-sm text-center py-8">
                Sin datos
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top performers con gráfico de barras horizontales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ranking de deportistas */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Award size={18} className="text-warning" />
              Top Deportistas por Evaluaciones
            </h3>
            {testPerformance.top_performers?.length > 0 ? (
              <div className="space-y-3">
                {testPerformance.top_performers
                  .slice(0, 5)
                  .map((athlete, index) => {
                    const maxTests =
                      testPerformance.top_performers[0]?.tests_completed || 1;
                    const percentage =
                      (athlete.tests_completed / maxTests) * 100;

                    return (
                      <div
                        key={athlete.athlete_id}
                        className={`relative p-3 rounded-lg transition-all hover:scale-[1.01] ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30"
                            : index === 1
                              ? "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border border-gray-400/30"
                              : index === 2
                                ? "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border border-amber-600/30"
                                : "bg-base-200/50 border border-base-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                : index === 1
                                  ? "bg-gradient-to-br from-gray-300 to-gray-500"
                                  : index === 2
                                    ? "bg-gradient-to-br from-amber-500 to-amber-700"
                                    : "bg-base-content/30"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-base-content text-sm truncate">
                                {athlete.athlete_name}
                              </p>
                              <span className="text-sm font-bold text-primary ml-2">
                                {athlete.tests_completed} tests
                              </span>
                            </div>
                            {/* Barra de progreso */}
                            <div className="mt-1.5 h-1.5 bg-base-300 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  index === 0
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : index === 1
                                      ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                      : index === 2
                                        ? "bg-gradient-to-r from-amber-500 to-amber-700"
                                        : "bg-primary"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-base-content/50 text-sm text-center py-4">
                No hay datos de atletas destacados
              </p>
            )}
          </div>
        </div>

        {/* Gráfico de barras horizontales del ranking */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Trophy size={18} className="text-warning" />
              Ranking Visual de Tests Completados
            </h3>
            {testPerformance.top_performers?.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={testPerformance.top_performers
                      .slice(0, 5)
                      .map((a, i) => ({
                        name:
                          a.athlete_name?.split(" ")[0] || `Atleta ${i + 1}`,
                        tests: a.tests_completed,
                        fill:
                          i === 0
                            ? "#EAB308"
                            : i === 1
                              ? "#9CA3AF"
                              : i === 2
                                ? "#D97706"
                                : CHART_COLORS.primary,
                      }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(var(--bc)/0.1)"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: "oklch(var(--bc)/0.6)" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "oklch(var(--bc)/0.8)" }}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} tests`, "Completados"]}
                      contentStyle={{
                        backgroundColor: "oklch(var(--b1))",
                        border: "1px solid oklch(var(--b3))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="tests" radius={[0, 4, 4, 0]} barSize={25}>
                      {testPerformance.top_performers
                        .slice(0, 5)
                        .map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "#EAB308"
                                : index === 1
                                  ? "#9CA3AF"
                                  : index === 2
                                    ? "#D97706"
                                    : CHART_COLORS.primary
                            }
                          />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-base-content/50 text-sm">
                  Sin datos de ranking
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

TestsView.propTypes = {
  testPerformance: PropTypes.shape({
    total_tests: PropTypes.number,
    tests_by_type: PropTypes.array,
    top_performers: PropTypes.array,
  }),
};

export default TestsView;
