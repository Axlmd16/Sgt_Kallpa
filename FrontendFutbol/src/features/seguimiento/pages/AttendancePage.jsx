import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Save,
  CalendarCheck,
  RefreshCw,
  ChevronRight,
  History,
} from "lucide-react";

// Componentes
import AttendanceForm from "../components/AttendanceComponents/AttendanceForm";
import AttendanceTable from "../components/AttendanceComponents/AttendanceTable";
import AttendanceHistoryDrawer from "../components/AttendanceComponents/AttendanceHistoryDrawer";
import Button from "@/shared/components/Button";

// Servicios
import attendanceApi from "../services/attendance.api";
import athletesApi from "../services/athletes.api";

// Hooks
import useDebounce from "@/shared/hooks/useDebounce";

/**
 * Página principal de registro de asistencia de atletas.
 * Diseño moderno con barra de acciones flotante.
 */
function AttendancePage() {
  // Estado de filtros
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Estado de datos
  const [athletes, setAthletes] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Historial
  const [showHistory, setShowHistory] = useState(false);
  const [historyDates, setHistoryDates] = useState([]);

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  // Debounce para búsqueda
  const debouncedSearch = useDebounce(searchTerm, 500);

  // ==========================================
  // CARGAR HISTORIAL DE FECHAS
  // ==========================================
  const fetchHistoryDates = useCallback(async () => {
    try {
      const response = await attendanceApi.getDates();
      if (response.status === "success") {
        setHistoryDates(response.data || []);
      }
    } catch {
      // Silenciar error de historial - no es crítico para el flujo principal
    }
  }, []);

  useEffect(() => {
    fetchHistoryDates();
  }, [fetchHistoryDates]);

  // ==========================================
  // CARGAR ATLETAS Y ASISTENCIA
  // ==========================================

  const fetchAthletes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        type_athlete: typeFilter || undefined,
        is_active: true, // Solo atletas activos para asistencia
      };

      // 1. Cargar lista de atletas
      // 2. Cargar asistencias existentes para la fecha seleccionada
      const [athletesResponse, attendanceResponse] = await Promise.all([
        athletesApi.getAll(params),
        attendanceApi.getByDate({ date, ...params }),
      ]);

      if (athletesResponse.status === "success" && athletesResponse.data) {
        const athletesList = athletesResponse.data.items || [];
        setAthletes(athletesList);
        setPagination((prev) => ({
          ...prev,
          total: athletesResponse.data.total || 0,
        }));

        // Mapa de asistencia existente por athlete_id
        const existingAttendanceMap = {};
        if (
          attendanceResponse.status === "success" &&
          attendanceResponse.data
        ) {
          // Ajustar según la estructura de respuesta de getByDate
          // Si llega como lista directa o dentro de data.items
          const records = Array.isArray(attendanceResponse.data)
            ? attendanceResponse.data
            : attendanceResponse.data.items || [];
          records.forEach((record) => {
            existingAttendanceMap[record.athlete_id] = {
              is_present: record.is_present,
              justification: record.justification,
            };
          });
        }

        // Inicializar datos de asistencia
        const initialAttendance = {};
        athletesList.forEach((athlete) => {
          // Si existe registro previo, usarlo. Si no, DEFAULT: AUSENTE (false)
          initialAttendance[athlete.id] = existingAttendanceMap[athlete.id] || {
            is_present: false, // Default Ausente
            justification: "",
          };
        });
        setAttendanceData(initialAttendance);
      }
    } catch (error) {
      toast.error("Error al cargar datos", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Intente nuevamente",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, typeFilter, date]);

  // Cargar atletas cuando cambien los filtros
  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // ==========================================
  // HANDLERS DE ASISTENCIA
  // ==========================================

  /**
   * Alternar estado de asistencia de un atleta
   */
  const handleToggleAttendance = (athleteId, isPresent) => {
    setAttendanceData((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        is_present: isPresent,
        // Limpiar justificación si está presente
        justification: isPresent ? "" : prev[athleteId]?.justification || "",
      },
    }));
  };

  /**
   * Actualizar justificación de un atleta
   */
  const handleJustificationChange = (athleteId, justification) => {
    setAttendanceData((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        justification,
      },
    }));
  };

  /**
   * Marcar todos los atletas como presentes
   */
  const handleMarkAllPresent = () => {
    if (athletes.length === 0) return;

    setAttendanceData((prev) => {
      const updatedData = {};
      athletes.forEach((athlete) => {
        updatedData[athlete.id] = {
          ...prev[athlete.id],
          is_present: true,
          justification: "",
        };
      });
      return updatedData;
    });
    toast.success(`${athletes.length} atletas marcados como presentes`);
  };

  /**
   * Marcar todos los atletas como ausentes
   */
  const handleMarkAllAbsent = () => {
    if (athletes.length === 0) return;

    setAttendanceData((prev) => {
      const updatedData = {};
      athletes.forEach((athlete) => {
        updatedData[athlete.id] = {
          ...prev[athlete.id],
          is_present: false,
          justification: prev[athlete.id]?.justification || "",
        };
      });
      return updatedData;
    });
    toast.info(`${athletes.length} atletas marcados como ausentes`);
  };

  // ==========================================
  // GUARDAR ASISTENCIA
  // ==========================================

  const handleSaveAttendance = async () => {
    if (athletes.length === 0) {
      toast.warning("No hay atletas para registrar");
      return;
    }

    setSaving(true);

    try {
      // Preparar registros (Presentes O con justificación)
      const records = athletes
        .filter((athlete) => {
          const data = attendanceData[athlete.id];
          // Guardar si está presente O tiene justificación (aunque no esté presente)
          return (
            data?.is_present ||
            (data?.justification && data.justification.trim() !== "")
          );
        })
        .map((athlete) => ({
          athlete_id: athlete.id,
          is_present: attendanceData[athlete.id]?.is_present || false,
          justification: attendanceData[athlete.id]?.justification || null,
        }));

      const payload = {
        date: date,
        records: records,
      };

      const response = await attendanceApi.createBulk(payload);

      if (response.status === "success") {
        // Contar presentes para el mensaje
        const presentCount = records.filter((r) => r.is_present).length;
        const absentCount = records.length - presentCount;

        // Formatear fecha amigable
        const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
          "es-EC",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
          },
        );

        toast.success("¡Asistencia registrada!", {
          description: `${formattedDate} — ${presentCount} presentes, ${absentCount} ausentes`,
        });

        // Refrescar historial de fechas
        fetchHistoryDates();
      }
    } catch (error) {
      // El interceptor de http.js ya muestra toast para errores 422 (validación)
      // Solo mostramos toast para otros errores que no sean de validación
      const isValidationError = error?.response?.status === 422;

      if (!isValidationError) {
        toast.error("Error al guardar asistencia", {
          description:
            error?.response?.data?.message ||
            error.message ||
            "Intente nuevamente",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <CalendarCheck size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Módulo de Seguimiento
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Control de Asistencia
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Gestiona la asistencia diaria de los atletas.
            </p>
          </div>

          {/* Botón Historial */}
          <button
            onClick={() => setShowHistory(true)}
            className="btn btn-sm btn-secondary gap-2"
          >
            <History size={16} />
            Historial
            {historyDates.length > 0 && (
              <span className="badge badge-sm badge-primary badge-outline text-[10px]">
                {historyDates.length}
              </span>
            )}
          </button>
        </div>

        <AttendanceForm
          date={date}
          typeFilter={typeFilter}
          searchTerm={searchTerm}
          onDateChange={setDate}
          onTypeFilterChange={setTypeFilter}
          onSearchChange={setSearchTerm}
        />

        {/* Tabla de atletas */}
        <AttendanceTable
          athletes={athletes}
          attendanceData={attendanceData}
          onToggleAttendance={handleToggleAttendance}
          onJustificationChange={handleJustificationChange}
          onMarkAllPresent={handleMarkAllPresent}
          onMarkAllAbsent={handleMarkAllAbsent}
          loading={loading}
        />

        {/* Floating Action Island */}
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
            athletes.length > 0
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-slate-900/90 backdrop-blur-xl text-white px-2 py-1.5 rounded-2xl shadow-2xl shadow-slate-900/20 border border-white/10 flex items-center gap-2 min-w-[300px] sm:min-w-[400px] justify-between pl-4">
            {/* Info en la barra flotante */}
            <div className="flex flex-col">
              <div className="text-sm font-semibold flex items-center gap-1">
                <span className="text-white">{athletes.length}</span>{" "}
                <span className="text-slate-400 text-xs">atletas</span>
                <ChevronRight size={12} className="text-slate-600" />
                <span className="text-primary-content bg-primary px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {date}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 mx-1"></div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={fetchAthletes}
                disabled={loading}
                className="text-slate-300 hover:text-white hover:bg-white/10 border-transparent h-8 w-8 px-0 rounded-lg flex items-center justify-center"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAttendance}
                loading={saving}
                disabled={saving || athletes.length === 0}
                className="h-8 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-xs"
              >
                <Save size={14} className="mr-1.5" />
                Guardar
              </Button>
            </div>
          </div>
        </div>

        {/* Drawer de Historial */}
        <AttendanceHistoryDrawer
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          dates={historyDates}
          selectedDate={date}
          onSelectDate={setDate}
        />
      </div>
    </div>
  );
}

export default AttendancePage;
