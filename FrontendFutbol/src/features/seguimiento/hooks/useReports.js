/**
 * Hook personalizado para gestión de Reportes
 *
 * Encapsula la lógica de generación y descarga de reportes.
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import reportsApi from "@/features/seguimiento/services/reports.api";

export const useReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Genera y descarga un reporte según el tipo especificado
   */
  const generateAndDownloadReport = useCallback(
    async (reportType, format, filters = {}) => {
      if (!reportType) {
        setError("Selecciona un tipo de reporte");
        toast.error("Selecciona un tipo de reporte");
        return false;
      }

      if (!format) {
        setError("Selecciona un formato para generar el reporte");
        toast.error("Selecciona un formato para generar el reporte");
        return false;
      }

      // Validar rango de fechas solo si ambas están presentes
      if (filters.start_date && filters.end_date) {
        const start = new Date(filters.start_date);
        const end = new Date(filters.end_date);
        if (start > end) {
          setError("La fecha inicio no puede ser mayor a la fecha fin");
          toast.error("Rango de fechas inválido", {
            description:
              "La fecha inicio debe ser menor o igual a la fecha fin",
          });
          return false;
        }
      }
      //Verificamos si el reporte es de tipo estadísticas Y si NO se ha seleccionado un deportista
      if (reportType === "statistics" && !filters.athlete_id) {
        toast.error("Seleccione un deportista");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Construir payload
        const payload = {
          format: format.toLowerCase(),
          ...(filters.athlete_type && { athlete_type: filters.athlete_type }),
          ...(filters.athlete_id && { athlete_id: filters.athlete_id }),
          ...(filters.sex && { sex: filters.sex }),
          ...(filters.start_date && { start_date: filters.start_date }),
          ...(filters.end_date && { end_date: filters.end_date }),
        };

        console.info(`[reports] Generando reporte ${reportType}:`, payload);

        // Llamar al endpoint correspondiente
        let response;
        switch (reportType) {
          case "attendance":
            response = await reportsApi.generateAttendanceReport(payload);
            break;
          case "tests":
            response = await reportsApi.generateTestsReport(payload);
            break;
          case "statistics":
            response = await reportsApi.generateStatisticsReport(payload);
            break;
          default:
            throw new Error(`Tipo de reporte no válido: ${reportType}`);
        }

        console.info("[reports] Respuesta recibida:", {
          type: response?.type,
          size: response?.size,
          isBlob: response instanceof Blob,
        });

        // Generar nombre del archivo
        const timestamp = new Date().toISOString().split("T")[0];
        const reportTypeNames = {
          attendance: "asistencia",
          tests: "tests",
          statistics: "estadisticas",
        };
        const fileName = `reporte_${
          reportTypeNames[reportType]
        }_${timestamp}.${format.toLowerCase()}`;

        console.info("[reports] Iniciando descarga:", fileName);

        // Descargar archivo
        reportsApi.downloadFile(response, fileName);

        console.info("[reports] Proceso completado");
        toast.success("Reporte descargado exitosamente");
        return true;
      } catch (err) {
        let errorMessage = err.message || "Error al generar el reporte";

        // Intentar leer mensajes del backend
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const parsed = JSON.parse(text);
            errorMessage = parsed.message || parsed.detail || errorMessage;
          } catch (_) {
            // mantener mensaje previo
          }
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        setError(errorMessage);
        toast.error("Error al generar reporte", {
          description: errorMessage,
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    generateAndDownloadReport,
    clearError,
  };
};

export default useReports;
