/**
 * AddTestsForm Component - Versión Optimizada
 *
 * Layout con tabs de tipo de test siempre visibles
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  Zap,
  RefreshCw,
  Heart,
  Target,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import {
  useCreateSprintTest,
  useCreateYoyoTest,
  useCreateEnduranceTest,
  useCreateTechnicalAssessment,
  useEvaluationById,
} from "../../hooks/useEvaluations";
import useDebounce from "@/shared/hooks/useDebounce";
import athletesApi from "../../services/athletes.api";
import SprintTestForm from "./SprintTestForm";
import YoyoTestForm from "./YoyoTestForm";
import EnduranceTestForm from "./EnduranceTestForm";
import TechnicalAssessmentForm from "./TechnicalAssessmentForm";

const TEST_TYPES = [
  { id: "sprint", label: "Velocidad", icon: Zap, color: "warning" },
  { id: "yoyo", label: "Yoyo", icon: RefreshCw, color: "success" },
  { id: "endurance", label: "Resistencia", icon: Heart, color: "error" },
  { id: "technical", label: "Técnica", icon: Target, color: "primary" },
];

const ATHLETE_TYPES = {
  EXTERNOS: { label: "Externos", color: "badge-info" },
  ESTUDIANTES: { label: "Estudiante", color: "badge-secondary" },
  DOCENTES: { label: "Docente", color: "badge-success" },
  TRABAJADORES: { label: "Trabajador", color: "badge-warning" },
  ADMINISTRATIVOS: { label: "Admin", color: "badge-primary" },
};

const AddTestsForm = () => {
  const navigate = useNavigate();
  const { id: evaluationId } = useParams();

  const [selectedTestType, setSelectedTestType] = useState("sprint");
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: evaluationData, isLoading: loadingEvaluation } =
    useEvaluationById(evaluationId);
  const createSprintTest = useCreateSprintTest();
  const createYoyoTest = useCreateYoyoTest();
  const createEnduranceTest = useCreateEnduranceTest();
  const createTechnicalAssessment = useCreateTechnicalAssessment();

  const evaluation = evaluationData?.data;

  const fetchAthletes = useCallback(async () => {
    setLoadingAthletes(true);
    try {
      const params = {
        page: 1,
        limit: 50,
        search: debouncedSearch || undefined,
        type_athlete: typeFilter || undefined,
        is_active: true,
      };
      const response = await athletesApi.getAll(params);
      if (response.status === "success" && response.data) {
        const activeAthletes = (response.data.items || []).filter(
          (a) => a.is_active
        );
        setAthletes(activeAthletes);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingAthletes(false);
    }
  }, [debouncedSearch, typeFilter]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const handleTestSuccess = () => {
    // Keep same athlete and test type for continuous registration
  };

  if (loadingEvaluation) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    // <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-200 px-4 py-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate(`/seguimiento/evaluations/${evaluationId}`)
              }
              className="btn btn-ghost btn-sm btn-square"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-semibold text-slate-900 text-sm">
                Agregar Tests
              </h1>
              <p className="text-xs text-slate-500">{evaluation?.name}</p>
            </div>
          </div>

          {selectedAthlete && (
            <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full">
              <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-xs font-bold">
                  {selectedAthlete.full_name?.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[200px] truncate">
                {selectedAthlete.full_name}
              </span>
              <button
                onClick={() => setSelectedAthlete(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Athletes */}
        <div className="w-72 bg-base-100 border-r border-base-200 flex flex-col shrink-0">
          {/* Header */}
          <div className="p-3 border-b border-base-200 bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-primary" />
              <span className="text-sm font-medium text-slate-700">
                Atletas
              </span>
              <span className="badge badge-primary badge-sm">
                {athletes.length}
              </span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered input-sm w-full pl-9 bg-white"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="px-3 py-2 border-b border-base-200">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="select select-bordered select-sm w-full bg-white"
            >
              <option value="">Todos los tipos</option>
              <option value="EXTERNOS">Externos</option>
              <option value="ESTUDIANTES">Estudiantes</option>
              <option value="DOCENTES">Docentes</option>
              <option value="TRABAJADORES">Trabajadores</option>
            </select>
          </div>

          {/* Athletes List */}
          <div className="flex-1 overflow-y-auto">
            {loadingAthletes ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-sm text-primary"></span>
              </div>
            ) : athletes.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Users size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Sin resultados</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {athletes.map((athlete) => {
                  const isSelected = selectedAthlete?.id === athlete.id;
                  const typeInfo = ATHLETE_TYPES[athlete.type_athlete] || {
                    label: "N/A",
                    color: "badge-ghost",
                  };

                  return (
                    <button
                      key={athlete.id}
                      onClick={() => setSelectedAthlete(athlete)}
                      title={athlete.full_name}
                      className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 transition-all ${
                        isSelected
                          ? "bg-primary/10 ring-1 ring-primary/30"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isSelected ? (
                          <Check size={16} />
                        ) : (
                          athlete.full_name?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {athlete.full_name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`badge badge-xs ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          {athlete.dni && (
                            <span className="text-xs text-slate-400">
                              {athlete.dni}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Selection indicator */}
                      {isSelected && (
                        <ChevronRight
                          size={16}
                          className="text-primary shrink-0"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Test Type Tabs + Form */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Test Type Tabs - Always visible */}
          <div className="bg-base-100 border-b border-base-200 px-4 py-2 shrink-0">
            <div className="flex gap-1">
              {TEST_TYPES.map((test) => {
                const IconComponent = test.icon;
                const isSelected = selectedTestType === test.id;

                return (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTestType(test.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? `bg-${test.color}/10 text-${test.color} border border-${test.color}/30`
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <IconComponent size={14} />
                    {test.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {!selectedAthlete ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-slate-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users size={24} className="text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-700 text-sm mb-1">
                    Selecciona un Atleta
                  </h3>
                  <p className="text-xs text-slate-400">
                    Elige un atleta de la lista izquierda
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                {selectedTestType === "sprint" && (
                  <SprintTestForm
                    evaluationId={evaluationId}
                    selectedAthlete={selectedAthlete}
                    hideAthleteSelector
                    mutation={createSprintTest}
                    onSuccess={handleTestSuccess}
                  />
                )}
                {selectedTestType === "yoyo" && (
                  <YoyoTestForm
                    evaluationId={evaluationId}
                    selectedAthlete={selectedAthlete}
                    hideAthleteSelector
                    mutation={createYoyoTest}
                    onSuccess={handleTestSuccess}
                  />
                )}
                {selectedTestType === "endurance" && (
                  <EnduranceTestForm
                    evaluationId={evaluationId}
                    selectedAthlete={selectedAthlete}
                    hideAthleteSelector
                    mutation={createEnduranceTest}
                    onSuccess={handleTestSuccess}
                  />
                )}
                {selectedTestType === "technical" && (
                  <TechnicalAssessmentForm
                    evaluationId={evaluationId}
                    selectedAthlete={selectedAthlete}
                    hideAthleteSelector
                    mutation={createTechnicalAssessment}
                    onSuccess={handleTestSuccess}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTestsForm;
