/**
 * EvaluationDetail Component
 *
 * Muestra los detalles de una evaluación
 * y permite agregar tests
 */

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit2,
  ArrowLeft,
  Plus,
  X,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Activity,
  Zap,
  Heart,
  RefreshCcw,
  Target,
  Eye,
  Timer,
  Ruler,
  TrendingUp,
  Gauge,
  Trash2,
} from "lucide-react";
import {
  useEvaluationById,
  useTestsByEvaluation,
  useUpdateSprintTest,
  useUpdateYoyoTest,
  useUpdateEnduranceTest,
  useUpdateTechnicalAssessment,
  useDeleteSprintTest,
  useDeleteYoyoTest,
  useDeleteEnduranceTest,
  useDeleteTechnicalAssessment,
} from "../../hooks/useEvaluations";
import { useQuery } from "@tanstack/react-query";
import athletesApi from "../../services/athletes.api";
import { formatDate } from "@/shared/utils/dateUtils";
import useDebounce from "@/shared/hooks/useDebounce";
import EditTestForm from "../tests/EditTestForm";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

const EvaluationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filterTestType, setFilterTestType] = React.useState("all");
  const [searchAthlete, setSearchAthlete] = React.useState("");
  const [editingTest, setEditingTest] = React.useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [viewingTest, setViewingTest] = React.useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [deletingTest, setDeletingTest] = React.useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Hooks de mutación para actualizar tests
  const updateSprintTest = useUpdateSprintTest();
  const updateYoyoTest = useUpdateYoyoTest();
  const updateEnduranceTest = useUpdateEnduranceTest();
  const updateTechnicalAssessment = useUpdateTechnicalAssessment();

  // Hooks de mutación para eliminar tests
  const deleteSprintTest = useDeleteSprintTest();
  const deleteYoyoTest = useDeleteYoyoTest();
  const deleteEnduranceTest = useDeleteEnduranceTest();
  const deleteTechnicalAssessment = useDeleteTechnicalAssessment();

  const { data, isLoading, error } = useEvaluationById(id);
  
  // Debounce búsqueda para evitar demasiadas llamadas
  const debouncedSearch = useDebounce(searchAthlete, 500);
  
  const {
    data: testsData,
    isLoading: testsLoading,
    refetch: refetchTests,
  } = useTestsByEvaluation(id, { search: debouncedSearch || undefined });

  const evaluation = data?.data;
  const allTests = testsData?.all || [];

  // Hook para obtener datos de atletas con caché
  const { data: athletesData } = useQuery({
    queryKey: ["athletes", "all"],
    queryFn: () => athletesApi.getAll({ page: 1, limit: 100 }),
    staleTime: 10 * 60 * 1000,
  });

  const athletes = React.useMemo(() => {
    if (!athletesData) return [];
    if (athletesData.items && Array.isArray(athletesData.items)) {
      return athletesData.items;
    }
    if (athletesData.data) {
      if (Array.isArray(athletesData.data)) {
        return athletesData.data;
      }
      if (athletesData.data.items && Array.isArray(athletesData.data.items)) {
        return athletesData.data.items;
      }
    }
    if (Array.isArray(athletesData)) {
      return athletesData;
    }
    return [];
  }, [athletesData]);

  const getAthleteName = React.useCallback(
    (athleteId) => {
      if (!athletes || athletes.length === 0) {
        return `Atleta ${athleteId}`;
      }
      const athlete = athletes.find((a) => a.id === athleteId);
      if (!athlete) {
        return `Atleta ${athleteId}`;
      }
      if (athlete.full_name) {
        return athlete.full_name;
      }
      const firstName = athlete.first_name || athlete.firstName || "";
      const lastName = athlete.last_name || athlete.lastName || "";
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
      return firstName || lastName || `Atleta ${athleteId}`;
    },
    [athletes]
  );

  // Filtrar tests por tipo (búsqueda se hace en el backend)
  const filteredTests = React.useMemo(() => {
    let filtered = allTests;
    if (filterTestType !== "all") {
      filtered = filtered.filter((test) => test.test_type === filterTestType);
    }
    return filtered;
  }, [allTests, filterTestType]);

  const formatTestType = (test) => {
    const types = {
      sprint_test: "Test de Velocidad",
      yoyo_test: "Test Yoyo",
      endurance_test: "Test de Resistencia",
      technical_assessment: "Evaluación Técnica",
    };
    return (
      types[test.test_type] || test.test_type?.replace(/_/g, " ") || "Test"
    );
  };

  const getTestTypeColor = (testType) => {
    const colors = {
      sprint_test: "badge-info",
      yoyo_test: "badge-success",
      endurance_test: "badge-warning",
      technical_assessment: "badge-secondary",
    };
    return colors[testType] || "badge-neutral";
  };

  const handleEditTest = (test) => {
    const freshTest = allTests.find((t) => t.id === test.id) || test;
    setEditingTest(freshTest);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTest(null);
  };

  const getUpdateMutation = (testType) => {
    switch (testType) {
      case "sprint_test":
        return updateSprintTest;
      case "yoyo_test":
        return updateYoyoTest;
      case "endurance_test":
        return updateEnduranceTest;
      case "technical_assessment":
        return updateTechnicalAssessment;
      default:
        return null;
    }
  };

  const handleDeleteTest = (test) => {
    setDeletingTest(test);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTest = async () => {
    if (!deletingTest) return;

    try {
      switch (deletingTest.test_type) {
        case "sprint_test":
          await deleteSprintTest.mutateAsync(deletingTest.id);
          break;
        case "yoyo_test":
          await deleteYoyoTest.mutateAsync(deletingTest.id);
          break;
        case "endurance_test":
          await deleteEnduranceTest.mutateAsync(deletingTest.id);
          break;
        case "technical_assessment":
          await deleteTechnicalAssessment.mutateAsync(deletingTest.id);
          break;
        default:
          console.error("Tipo de test desconocido:", deletingTest.test_type);
          return;
      }
      
      // Refrescar la lista de tests después de eliminar
      refetchTests();
      
      // Cerrar modal
      setIsDeleteModalOpen(false);
      setDeletingTest(null);
    } catch (error) {
      console.error("Error al eliminar test:", error);
    }
  };

  const testTypeFilters = [
    { id: "all", label: "Todos" },
    { id: "sprint_test", label: "Velocidad" },
    { id: "yoyo_test", label: "Yoyo" },
    { id: "endurance_test", label: "Resistencia" },
    { id: "technical_assessment", label: "Técnica" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card bg-base-100 shadow-sm border border-base-300 p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <span>Error al cargar la evaluación</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Back button */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <button
          onClick={() => navigate("/seguimiento/evaluations")}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a evaluaciones
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <ClipboardList size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Detalle de Evaluación
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {evaluation.name}
            </h1>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/seguimiento/evaluations/${id}/edit`)}
            className="gap-2"
          >
            <Edit2 size={16} />
            Editar Evaluación
          </Button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Fecha */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Fecha
                  </p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(evaluation.date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hora */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-info/10 p-2 rounded-lg">
                  <Clock size={20} className="text-info" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Hora
                  </p>
                  <p className="font-semibold text-slate-900">
                    {evaluation.time}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <MapPin size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Ubicación
                  </p>
                  <p className="font-semibold text-slate-900">
                    {evaluation.location || "Sin especificar"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tests Count */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Activity size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Tests
                  </p>
                  <p className="font-semibold text-slate-900">
                    {allTests.length} registrados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observations */}
        {evaluation.observations && (
          <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-primary" />
                <span className="font-medium text-sm">Observaciones</span>
              </div>
              <p className="text-slate-600 text-sm">
                {evaluation.observations}
              </p>
            </div>
          </div>
        )}

        {/* Tests Section */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="font-semibold text-lg text-slate-900">
                Tests Registrados
              </h2>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  navigate(`/seguimiento/evaluations/${id}/add-tests`)
                }
                className="gap-2"
              >
                <Plus size={16} />
                Agregar Test
              </Button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre de atleta..."
                value={searchAthlete}
                onChange={(e) => setSearchAthlete(e.target.value)}
                className="input input-bordered input-sm w-full md:w-80 bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {testTypeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterTestType(filter.id)}
                  className={`btn btn-sm ${
                    filterTestType === filter.id
                      ? "btn-primary"
                      : "btn-ghost border border-base-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Tests Grid */}
            {testsLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                  <Activity size={32} className="text-primary" />
                </div>
                <p className="text-slate-500">
                  {allTests.length === 0
                    ? "No hay tests registrados en esta evaluación"
                    : "No hay tests que coincidan con los filtros"}
                </p>
                {allTests.length === 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/seguimiento/evaluations/${id}/add-tests`)
                    }
                    className="mt-4"
                  >
                    Agregar primer test
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-slate-600 font-medium">
                        Tipo de Test
                      </th>
                      <th className="text-slate-600 font-medium">Atleta</th>
                      <th className="text-slate-600 font-medium">Fecha</th>
                      <th className="text-slate-600 font-medium text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test) => {
                      const testTypeConfig = {
                        sprint_test: {
                          icon: <Zap size={16} />,
                          bgColor: "bg-info/10",
                          textColor: "text-info",
                          badge: "badge-info badge-soft",
                        },
                        yoyo_test: {
                          icon: <RefreshCcw size={16} />,
                          bgColor: "bg-success/10",
                          textColor: "text-success",
                          badge: "badge-success badge-soft",
                        },
                        endurance_test: {
                          icon: <Heart size={16} />,
                          bgColor: "bg-error/10",
                          textColor: "text-error",
                          badge: "badge-error badge-soft",
                        },
                        technical_assessment: {
                          icon: <Target size={16} />,
                          bgColor: "bg-secondary/10",
                          textColor: "text-secondary",
                          badge: "badge-secondary badge-soft",
                        },
                      };

                      const config = testTypeConfig[test.test_type] || {
                        icon: "📋",
                        bgColor: "bg-slate-100",
                        textColor: "text-slate-600",
                        badge: "badge-ghost",
                      };

                      return (
                        <tr key={test.id} className="hover:bg-slate-50/50">
                          {/* Type */}
                          <td>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-sm`}
                              >
                                {config.icon}
                              </span>
                              <span
                                className={`badge ${config.badge} badge-sm`}
                              >
                                {formatTestType(test)}
                              </span>
                            </div>
                          </td>
                          {/* Athlete */}
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                                {getAthleteName(test.athlete_id).charAt(0)}
                              </div>
                              <span className="font-medium text-slate-800">
                                {getAthleteName(test.athlete_id)}
                              </span>
                            </div>
                          </td>
                          {/* Date */}
                          <td className="text-slate-600">
                            {formatDate(test.date)}
                          </td>
                          {/* Actions */}
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setViewingTest(test);
                                  setIsViewModalOpen(true);
                                }}
                                className="btn btn-ghost btn-sm gap-1 text-info hover:bg-info/10"
                              >
                                <Eye size={14} />
                                Ver
                              </button>
                              <button
                                onClick={() => handleEditTest(test)}
                                className="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary/10"
                              >
                                <Edit2 size={14} />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteTest(test)}
                                className="btn btn-ghost btn-sm gap-1 text-error hover:bg-error/10"
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-100 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">
                  Editar {formatTestType(editingTest)}
                </h2>
                <button
                  onClick={handleCloseEditModal}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  <X size={20} />
                </button>
              </div>

              <EditTestForm
                test={editingTest}
                mutation={getUpdateMutation(editingTest.test_type)}
                onSuccess={() => {
                  refetchTests();
                  handleCloseEditModal();
                }}
                onCancel={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Test Details Modal */}
      <Modal
        isOpen={isViewModalOpen && viewingTest !== null}
        onClose={() => setIsViewModalOpen(false)}
        title={viewingTest ? formatTestType(viewingTest) : ""}
        size="large"
      >
        {viewingTest && (
          <div className="space-y-6">
            {/* Info del atleta */}
            <div className="bg-info/10 rounded-lg p-4">
              <p className="text-sm">
                Atleta:{" "}
                <strong>{getAthleteName(viewingTest.athlete_id)}</strong>
                {" • "}Fecha: <strong>{formatDate(viewingTest.date)}</strong>
              </p>
            </div>

            {/* Sprint Test */}
            {viewingTest.test_type === "sprint_test" && (
              <>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Ruler size={16} className="text-primary" />
                    Datos Registrados
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Timer
                        size={18}
                        className="text-slate-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Distancia
                        </p>
                        <p className="font-medium">
                          {viewingTest.distance_meters}m
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Zap
                        size={18}
                        className="text-yellow-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Tiempo 0-10m
                        </p>
                        <p className="font-medium">
                          {viewingTest.time_0_10_s}s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Zap
                        size={18}
                        className="text-orange-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Tiempo 0-30m
                        </p>
                        <p className="font-medium">
                          {viewingTest.time_0_30_s}s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-success" />
                    Métricas Calculadas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <Timer
                        size={18}
                        className="text-success shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Tiempo 10-30m
                        </p>
                        <p className="font-medium text-success">
                          {viewingTest.time_10_30_s?.toFixed(2) || "—"}s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <Gauge
                        size={18}
                        className="text-success shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Vel. Promedio
                        </p>
                        <p className="font-medium text-success">
                          {viewingTest.avg_speed_ms?.toFixed(2) || "—"} m/s
                        </p>
                        <p className="text-xs text-base-content/50">
                          ≈{" "}
                          {viewingTest.avg_speed_ms
                            ? (viewingTest.avg_speed_ms * 3.6).toFixed(1)
                            : "—"}{" "}
                          km/h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <Zap size={18} className="text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Vel. Máxima
                        </p>
                        <p className="font-medium text-success">
                          {viewingTest.estimated_max_speed?.toFixed(2) || "—"}{" "}
                          m/s
                        </p>
                        <p className="text-xs text-base-content/50">
                          ≈{" "}
                          {viewingTest.estimated_max_speed
                            ? (viewingTest.estimated_max_speed * 3.6).toFixed(1)
                            : "—"}{" "}
                          km/h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Yoyo Test */}
            {viewingTest.test_type === "yoyo_test" && (
              <>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <RefreshCcw size={16} className="text-primary" />
                    Datos Registrados
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Activity
                        size={18}
                        className="text-blue-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">Shuttles</p>
                        <p className="font-medium">
                          {viewingTest.shuttle_count}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Target
                        size={18}
                        className="text-purple-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Nivel Final
                        </p>
                        <p className="font-medium">{viewingTest.final_level}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <X size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-base-content/60">Fallos</p>
                        <p className="font-medium">{viewingTest.failures}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-success" />
                    Métricas Calculadas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <Ruler
                        size={18}
                        className="text-success shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Distancia Total
                        </p>
                        <p className="font-medium text-success">
                          {viewingTest.total_distance || "—"}m
                        </p>
                        <p className="text-xs text-base-content/50">
                          ={" "}
                          {viewingTest.total_distance
                            ? (viewingTest.total_distance / 1000).toFixed(2)
                            : "—"}{" "}
                          km
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <Heart
                        size={18}
                        className="text-success shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          VO₂ Máximo
                        </p>
                        <p className="font-medium text-success">
                          {viewingTest.vo2_max?.toFixed(1) || "—"} ml/kg/min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Endurance Test */}
            {viewingTest.test_type === "endurance_test" && (
              <>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-primary" />
                    Datos Registrados
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Timer
                        size={18}
                        className="text-blue-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">Duración</p>
                        <p className="font-medium">
                          {viewingTest.min_duration} minutos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Ruler
                        size={18}
                        className="text-orange-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Distancia
                        </p>
                        <p className="font-medium">
                          {viewingTest.total_distance_m}m
                        </p>
                        <p className="text-xs text-base-content/50">
                          = {(viewingTest.total_distance_m / 1000).toFixed(2)}{" "}
                          km
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-success" />
                    Métricas Calculadas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <Gauge
                        size={18}
                        className="text-success shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          Ritmo (Pace)
                        </p>
                        <p className="font-medium text-success">
                          {viewingTest.pace_min_per_km?.toFixed(2) || "—"}{" "}
                          min/km
                        </p>
                        <p className="text-xs text-base-content/50">
                          ≈{" "}
                          {viewingTest.pace_min_per_km
                            ? (60 / viewingTest.pace_min_per_km).toFixed(1)
                            : "—"}{" "}
                          km/h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <Heart
                        size={18}
                        className="text-success shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-base-content/60">
                          VO₂ Máximo
                        </p>
                        <p className="font-medium text-success">
                          {viewingTest.estimated_vo2max?.toFixed(1) || "—"}{" "}
                          ml/kg/min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Technical Assessment */}
            {viewingTest.test_type === "technical_assessment" && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target size={16} className="text-primary" />
                  Habilidades Técnicas
                </h4>
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="text-base-content/60">
                        <th>Habilidad</th>
                        <th>Nivel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: "ball_control", label: "Control de Balón" },
                        { key: "short_pass", label: "Pase Corto" },
                        { key: "long_pass", label: "Pase Largo" },
                        { key: "shooting", label: "Disparo" },
                        { key: "dribbling", label: "Regate" },
                      ].map((skill) => {
                        const levelMap = {
                          Excellent: "Excelente",
                          Good: "Bueno",
                          Average: "Regular",
                          Poor: "Bajo",
                        };
                        const value = viewingTest[skill.key];
                        return (
                          <tr key={skill.key}>
                            <td className="font-medium">{skill.label}</td>
                            <td>
                              <span
                                className={`badge badge-sm ${
                                  value === "Excellent"
                                    ? "badge-success"
                                    : value === "Good"
                                    ? "badge-info"
                                    : value === "Average"
                                    ? "badge-warning"
                                    : "badge-error"
                                }`}
                              >
                                {levelMap[value] || value || "—"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Observations */}
            {viewingTest.observations && (
              <div className="bg-base-200/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Observaciones</h4>
                <p className="text-sm text-base-content/70">
                  {viewingTest.observations}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-2 pt-4 border-t border-base-200">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDeleteTest(viewingTest);
                }}
                className="btn btn-error btn-sm gap-1"
              >
                <Trash2 size={14} />
                Eliminar Test
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditTest(viewingTest);
                  }}
                  className="btn btn-primary btn-sm gap-1"
                >
                  <Edit2 size={14} />
                  Editar Test
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen && deletingTest !== null}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTest(null);
        }}
        title="Confirmar Eliminación"
        size="medium"
      >
        {deletingTest && (
          <div className="space-y-6">
            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="bg-error/10 p-4 rounded-full">
                <Trash2 size={48} className="text-error" />
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-slate-900">
                ¿Está seguro que desea eliminar este test?
              </p>
              <div className="bg-slate-100 rounded-lg p-4 space-y-1">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Tipo:</span>{" "}
                  {formatTestType(deletingTest)}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Atleta:</span>{" "}
                  {getAthleteName(deletingTest.athlete_id)}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Fecha:</span>{" "}
                  {formatDate(deletingTest.date)}
                </p>
              </div>
              <p className="text-sm text-slate-500 pt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingTest(null);
                }}
                className="btn btn-ghost btn-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTest}
                className="btn btn-error btn-sm gap-1"
              >
                <Trash2 size={14} />
                Eliminar Test
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EvaluationDetail;
