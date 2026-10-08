/**
 * AttendanceView Component
 *
 * Vista de estadísticas de asistencia con información detallada
 * y gráficos complementarios.
 */

import React from "react";
import PropTypes from "prop-types";
import { Calendar, UserCheck, Users, TrendingUp, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import KPICard from "./KPICard";

function AttendanceView({ attendanceStats }) {
  if (!attendanceStats) {
    return (
      <div className="text-center py-8 text-base-content/60">
        No hay datos de asistencia disponibles
      </div>
    );
  }

  // Preparar datos para gráfico de tendencia (últimos registros)
  const trendData =
    attendanceStats.attendance_by_period
      ?.slice()
      .reverse()
      .slice(-10) // Solo últimos 10
      .map((item) => ({
        date: item.date?.slice(-5) || "",
        tasa: item.attendance_rate || 0,
      })) || [];

  return (
    <div className="space-y-4">
      {/* KPIs de asistencia */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={Calendar}
          title="Total Registros"
          value={attendanceStats.total_records || 0}
          color="primary"
        />
        <KPICard
          icon={UserCheck}
          title="Presentes"
          value={attendanceStats.total_present || 0}
          color="success"
        />
        <KPICard
          icon={Users}
          title="Ausentes"
          value={attendanceStats.total_absent || 0}
          color="error"
        />
        <KPICard
          icon={TrendingUp}
          title="Tasa General"
          value={`${attendanceStats.overall_attendance_rate || 0}%`}
          color="info"
        />
      </div>

      {/* Contenido principal: Tabla y gráfico lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tabla de asistencia por tipo */}
        <div className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Users size={18} className="text-primary" />
              Asistencia por Tipo de Atleta
            </h3>
            {attendanceStats.attendance_by_type?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="text-base-content/60">
                      <th>Tipo</th>
                      <th className="text-right">Total</th>
                      <th className="text-right">Presentes</th>
                      <th className="text-right">Tasa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceStats.attendance_by_type.map((item, index) => (
                      <tr key={index} className="hover:bg-base-200/50">
                        <td className="font-medium">{item.type_athlete}</td>
                        <td className="text-right">{item.total}</td>
                        <td className="text-right">{item.present}</td>
                        <td className="text-right">
                          <span
                            className={`badge badge-sm ${
                              item.attendance_rate >= 80
                                ? "badge-success"
                                : item.attendance_rate >= 60
                                ? "badge-warning"
                                : "badge-error"
                            }`}
                          >
                            {item.attendance_rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-base-content/50 text-sm text-center py-4">
                Sin datos de asistencia por tipo
              </p>
            )}
          </div>
        </div>

        {/* Mini gráfico de tendencia */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
              <Clock size={18} className="text-info" />
              Tendencia Reciente
            </h3>
            {trendData.length > 0 ? (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorTasa"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10B981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      stroke="oklch(var(--bc)/0.3)"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      stroke="oklch(var(--bc)/0.3)"
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Asistencia"]}
                      contentStyle={{
                        backgroundColor: "oklch(var(--b1))",
                        border: "1px solid oklch(var(--b3))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tasa"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorTasa)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-base-content/50 text-sm text-center py-8">
                Sin datos de tendencia
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Historial de asistencia por período */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-4">
          <h3 className="font-semibold text-base-content flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-primary" />
            Historial por Fecha
          </h3>
          {attendanceStats.attendance_by_period?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr className="text-base-content/60">
                    <th>Fecha</th>
                    <th className="text-right">Presentes</th>
                    <th className="text-right">Ausentes</th>
                    <th className="text-right">Tasa</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceStats.attendance_by_period
                    .slice(0, 10)
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-base-200/50">
                        <td className="font-medium">{item.date}</td>
                        <td className="text-right text-success">
                          {item.present_count}
                        </td>
                        <td className="text-right text-error">
                          {item.absent_count}
                        </td>
                        <td className="text-right">{item.attendance_rate}%</td>
                        <td>
                          <div
                            className={`w-16 h-1.5 rounded-full ${
                              item.attendance_rate >= 80
                                ? "bg-success"
                                : item.attendance_rate >= 60
                                ? "bg-warning"
                                : "bg-error"
                            }`}
                            style={{
                              width: `${item.attendance_rate}%`,
                              maxWidth: "100%",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-base-content/50 text-sm text-center py-4">
              Sin historial de asistencia
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

AttendanceView.propTypes = {
  attendanceStats: PropTypes.shape({
    total_records: PropTypes.number,
    total_present: PropTypes.number,
    total_absent: PropTypes.number,
    overall_attendance_rate: PropTypes.number,
    attendance_by_period: PropTypes.array,
    attendance_by_type: PropTypes.array,
  }),
};

export default AttendanceView;
