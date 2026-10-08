/**
 * Componente Botón de Generación de Reporte
 *
 * Botón especializado para generar y descargar reportes
 * con estados de carga y feedback.
 */

import { Download, AlertCircle, CheckCircle } from "lucide-react";
import Button from "@/shared/components/Button";
import { toast } from "sonner";

const GenerateReportButton = ({
  reportType,
  format,
  filters,
  onGenerate,
  isLoading = false,
  disabled = false,
  error = null,
}) => {
  const handleClick = () => {
    if (isLoading) return;
      if (!reportType){
        toast.error("Selecciona un tipo de reporte", {
          description:
            "Por favor selecciona el tipo de reporte que deseas generar",
        });
        return;
      }
    

    if (!format) {
      toast.error("Selecciona un formato", {
        description:
          "Por favor selecciona un formato de exportación (PDF, CSV o XLSX)",
      });
      return;
    }

    onGenerate();
  };

  const hasFilters = Object.values(filters).some((v) => v);

  const reportTypeNames = {
    attendance: "Asistencia",
    tests: "Evaluaciones y Tests",
    statistics: "Estadísticas Generales",
  };

  return (
    <div className="space-y-4">
      {/* Resumen de selección */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-4">
          <h3 className="font-semibold text-base-content text-sm mb-3">
            Resumen del Reporte
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-start gap-2">
              <div className="shrink-0 mt-0.5">
                {reportType ? (
                  <CheckCircle size={16} className="text-success" />
                ) : (
                  <AlertCircle size={16} className="text-warning" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500">Tipo de reporte</p>
                <p
                  className={`text-sm font-medium ${
                    reportType ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {reportType ? reportTypeNames[reportType] : "No seleccionado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="shrink-0 mt-0.5">
                {format ? (
                  <CheckCircle size={16} className="text-success" />
                ) : (
                  <AlertCircle size={16} className="text-warning" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500">Formato seleccionado</p>
                <p
                  className={`text-sm font-medium ${
                    format ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {format ? format.toUpperCase() : "No seleccionado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="shrink-0 mt-0.5">
                <CheckCircle
                  size={16}
                  className={hasFilters ? "text-success" : "text-slate-300"}
                />
              </div>
              <div>
                <p className="text-xs text-slate-500">Filtros aplicados</p>
                <p
                  className={`text-sm font-medium ${
                    hasFilters ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {hasFilters ? "Sí" : "No (todos los datos)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Botón de descarga */}
      <Button
        onClick={handleClick}
        variant="primary"
        size="lg"
        disabled={disabled || isLoading || !format || !reportType}
        loading={isLoading}
        fullWidth
        className="gap-2"
      >
        <Download size={20} />
        {isLoading ? "Generando reporte..." : "Descargar Reporte"}
      </Button>

      {(!reportType || !format) && (
        <p className="text-xs text-slate-500 text-center">
          💡{" "}
          {!reportType
            ? "Selecciona un tipo de reporte"
            : "Selecciona un formato de exportación"}{" "}
          para continuar
        </p>
      )}
    </div>
  );
};

export default GenerateReportButton;
