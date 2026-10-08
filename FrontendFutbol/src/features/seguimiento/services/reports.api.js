/**
 * API de Reportes Deportivos
 *
 * Servicio que encapsula las llamadas HTTP para generación
 * y descarga de reportes en diferentes formatos.
 */

import http from "@/app/config/http";

const reportsApi = {
  /**
   * Genera reporte de asistencia
   * @param {Object} data - Datos del reporte
   * @param {string} data.format - Formato: 'pdf', 'xlsx', 'csv'
   * @param {string} data.start_date - Fecha inicio (YYYY-MM-DD)
   * @param {string} data.end_date - Fecha fin (YYYY-MM-DD)
   * @param {string} data.athlete_type - Tipo de atleta (opcional)
   * @param {string} data.sex - Sexo (opcional)
   * @returns {Promise<Blob>} Archivo descargable
   */
  generateAttendanceReport: async (data) => {
    try {
      console.info("[reportsApi] Generando reporte de asistencia:", data);

      const response = await http.post("/reports/attendance", data, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        error.message = parsed.message || "Error al generar reporte";
      }
      throw error;
    }
  },

  /**
   * Genera reporte de tests/evaluaciones
   * @param {Object} data - Datos del reporte
   * @param {string} data.format - Formato: 'pdf', 'xlsx', 'csv'
   * @param {string} data.start_date - Fecha inicio
   * @param {string} data.end_date - Fecha fin
   * @param {string} data.athlete_type - Tipo de atleta (opcional)
   * @returns {Promise<Blob>} Archivo descargable
   */
  generateTestsReport: async (data) => {
    try {
      console.info("[reportsApi] Generando reporte de tests:", data);

      const response = await http.post("/reports/tests", data, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      console.error("[reportsApi] Error en generateTestsReport:", error);
      throw error;
    }
  },

  /**
   * Genera reporte de estadísticas generales
   * @param {Object} data - Datos del reporte
   * @param {string} data.format - Formato: 'pdf', 'xlsx', 'csv'
   * @param {string} data.athlete_type - Tipo de atleta (opcional)
   * @param {string} data.sex - Sexo (opcional)
   * @returns {Promise<Blob>} Archivo descargable
   */
  generateStatisticsReport: async (data) => {
    try {
      console.info("[reportsApi] Generando reporte de estadísticas:", data);

      const response = await http.post("/reports/statistics", data, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      console.error("[reportsApi] Error en generateStatisticsReport:", error);
      throw error;
    }
  },

  /**
   * Descarga un archivo de reporte
   * @param {Blob} fileData - Datos del archivo
   * @param {string} fileName - Nombre del archivo
   */
  downloadFile: (fileData, fileName) => {
    try {
      console.info(
        "[downloadFile] Iniciando descarga de:",
        fileName,
        "Tamaño:",
        fileData?.size
      );

      // Crear URL del blob directamente
      let blob;
      if (fileData instanceof Blob) {
        blob = fileData;
      } else if (fileData instanceof ArrayBuffer) {
        blob = new Blob([fileData], { type: "application/octet-stream" });
      } else {
        // Fallback: envolver en Blob
        blob = new Blob([fileData], { type: fileData?.type || "application/octet-stream" });
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      // Limpieza
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
        console.info("[downloadFile] Limpieza completada");
      }, 500);

      return true;
    } catch (err) {
      console.error("[downloadFile] Error:", err);
      throw new Error("Error al descargar el archivo: " + err.message);
    }
  },
};

export default reportsApi;
