/**
 * Selector de Tipo de Reporte
 *
 * Permite seleccionar entre los tipos de reportes disponibles.
 */

import { ClipboardList, Activity, BarChart3 } from "lucide-react";

const REPORT_TYPES = [
  {
    value: "attendance",
    label: "Asistencia",
    description: "Reporte de asistencias por deportista",
    icon: ClipboardList,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    value: "tests",
    label: "Evaluaciones y Tests",
    description: "Resultados de pruebas físicas",
    icon: Activity,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    value: "statistics",
    label: "Estadísticas Generales",
    description: "Resumen ejecutivo del club",
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

const ReportTypeSelector = ({
  selectedType,
  onTypeChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {REPORT_TYPES.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.value;

        return (
          <button
            key={type.value}
            onClick={() => !disabled && onTypeChange(type.value)}
            disabled={disabled}
            className={`
              relative p-5 rounded-lg border-2 transition-all duration-200
              ${
                isSelected
                  ? `${type.borderColor} ${type.bgColor} shadow-md scale-105`
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isSelected ? type.bgColor : "bg-slate-50"
                }`}
              >
                <Icon
                  size={32}
                  className={isSelected ? type.color : "text-slate-600"}
                />
              </div>
              <div>
                <h4
                  className={`font-semibold ${
                    isSelected ? "text-slate-900" : "text-slate-700"
                  }`}
                >
                  {type.label}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {type.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ReportTypeSelector;
