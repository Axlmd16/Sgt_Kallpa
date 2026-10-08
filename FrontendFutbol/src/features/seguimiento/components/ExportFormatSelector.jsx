/**
 * Componente Selector de Formato de Exportación
 *
 * Permite elegir entre PDF, CSV o XLSX para descargar el reporte.
 */

import { FileText, FileSpreadsheet, Table } from "lucide-react";

const EXPORT_FORMATS = [
  {
    value: "pdf",
    label: "PDF",
    description: "Formato visual con estilo",
    icon: FileText,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    value: "csv",
    label: "CSV",
    description: "Para análisis en Excel",
    icon: Table,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    value: "xlsx",
    label: "XLSX",
    description: "Hoja de cálculo Excel",
    icon: FileSpreadsheet,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
];

const ExportFormatSelector = ({
  selectedFormat,
  onFormatChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {EXPORT_FORMATS.map((format) => {
        const Icon = format.icon;
        const isSelected = selectedFormat === format.value;

        return (
          <button
            key={format.value}
            onClick={() => !disabled && onFormatChange(format.value)}
            disabled={disabled}
            className={`
              relative p-5 rounded-lg border-2 transition-all duration-200
              ${
                isSelected
                  ? `${format.borderColor} ${format.bgColor} shadow-md scale-105`
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
                  isSelected ? format.bgColor : "bg-slate-50"
                }`}
              >
                <Icon
                  size={32}
                  className={isSelected ? format.color : "text-slate-600"}
                />
              </div>
              <div>
                <h4
                  className={`font-semibold ${
                    isSelected ? "text-slate-900" : "text-slate-700"
                  }`}
                >
                  {format.label}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {format.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ExportFormatSelector;
