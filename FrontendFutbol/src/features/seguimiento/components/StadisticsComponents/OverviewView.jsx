/**
 * OverviewView Component
 *
 * Vista general de estadísticas del club con KPIs,
 * distribuciones y gráficos complementarios.
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Users,
  UserCheck,
  Target,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import KPICard from "./KPICard";
import { GENDER_OPTIONS } from "@/app/config/constants";

// Colores para los gráficos
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

// Helper para traducir género usando constantes
const getGenderES = (sex) => {
  if (!sex) return "No especificado";
  const normalized = sex.toUpperCase();
  const found = GENDER_OPTIONS.find((g) => g.value === normalized);
  return found?.label || sex;
};

function OverviewView({ clubOverview, attendanceStats }) {
  if (!clubOverview) {
    return (
      <div className="text-center py-8 text-base-content/60">
        No hay datos de resumen disponibles
      </div>
    );
  }

  // Preparar datos para gráficos
  const typeChartData =
    clubOverview.athletes_by_type?.map((item, index) => ({
      name: item.type_athlete,
      value: item.count,
      fill: COLORS[index % COLORS.length],
    })) || [];

  const genderChartData =
    clubOverview.athletes_by_gender?.map((item) => ({
      name: getGenderES(item.sex),
      value: item.count,
      fill: item.sex === "MALE" || item.sex === "M" ? "#3B82F6" : "#EC4899",
    })) || [];

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          title="Total Deportistas"
          value={clubOverview.total_athletes || 0}
          subtitle={`${clubOverview.active_athletes || 0} activos`}
          color="primary"
        />
        <KPICard
          icon={UserCheck}
          title="Tasa de Asistencia"
          value={`${attendanceStats?.overall_attendance_rate || 0}%`}
          subtitle="Promedio general"
          color="success"
        />
        <KPICard
          icon={Target}
          title="Evaluaciones"
          value={clubOverview.total_evaluations || 0}
          subtitle="Total realizadas"
          color="info"
        />
        <KPICard
          icon={Award}
          title="Tests Completados"
          value={clubOverview.total_tests || 0}
          subtitle="Todas las categorías"
          color="warning"
        />
      </div>

      {/* Distribución con gráficos pequeños y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Por tipo de atleta */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Users size={18} className="text-primary" />
              Distribución por Tipo
            </h3>
            <div className="flex items-center gap-4">
              {/* Mini gráfico */}
              <div className="w-24 h-24 shrink-0">
                {typeChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={40}
                        dataKey="value"
                      >
                        {typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Atletas"]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-content/40 text-xs">
                    Sin datos
                  </div>
                )}
              </div>
              {/* Lista de datos */}
              <div className="flex-1 space-y-1.5">
                {clubOverview.athletes_by_type?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-base-content/80">
                        {item.type_athlete}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.count}</span>
                      <span className="text-base-content/50 text-xs">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
                {(!clubOverview.athletes_by_type ||
                  clubOverview.athletes_by_type.length === 0) && (
                  <p className="text-base-content/50 text-sm">Sin datos</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Por género */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Activity size={18} className="text-secondary" />
              Distribución por Género
            </h3>
            <div className="flex items-center gap-4">
              {/* Mini gráfico */}
              <div className="w-24 h-24 shrink-0">
                {genderChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={40}
                        dataKey="value"
                      >
                        {genderChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Atletas"]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-content/40 text-xs">
                    Sin datos
                  </div>
                )}
              </div>
              {/* Stats de género */}
              <div className="flex-1 space-y-2">
                {clubOverview.athletes_by_gender?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            item.sex === "MALE" || item.sex === "M"
                              ? "#3B82F6"
                              : "#EC4899",
                        }}
                      />
                      <span className="text-base-content/80 text-sm">
                        {getGenderES(item.sex)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.count}</span>
                      <span className="text-base-content/50 text-xs">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
                {(!clubOverview.athletes_by_gender ||
                  clubOverview.athletes_by_gender.length === 0) && (
                  <p className="text-base-content/50 text-sm">Sin datos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de estado */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-4">
          <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-success" />
            Estado General del Club
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <p className="text-2xl font-bold text-success">
                {clubOverview.active_athletes || 0}
              </p>
              <p className="text-xs text-base-content/60">Activos</p>
            </div>
            <div className="text-center p-3 bg-error/10 rounded-lg">
              <p className="text-2xl font-bold text-error">
                {clubOverview.inactive_athletes || 0}
              </p>
              <p className="text-xs text-base-content/60">Inactivos</p>
            </div>
            <div className="text-center p-3 bg-info/10 rounded-lg">
              <p className="text-2xl font-bold text-info">
                {clubOverview.total_evaluations || 0}
              </p>
              <p className="text-xs text-base-content/60">Evaluaciones</p>
            </div>
            <div className="text-center p-3 bg-warning/10 rounded-lg">
              <p className="text-2xl font-bold text-warning">
                {clubOverview.total_tests || 0}
              </p>
              <p className="text-xs text-base-content/60">Tests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

OverviewView.propTypes = {
  clubOverview: PropTypes.shape({
    total_athletes: PropTypes.number,
    active_athletes: PropTypes.number,
    inactive_athletes: PropTypes.number,
    athletes_by_type: PropTypes.array,
    athletes_by_gender: PropTypes.array,
    total_evaluations: PropTypes.number,
    total_tests: PropTypes.number,
  }),
  attendanceStats: PropTypes.shape({
    overall_attendance_rate: PropTypes.number,
  }),
};

export default OverviewView;
