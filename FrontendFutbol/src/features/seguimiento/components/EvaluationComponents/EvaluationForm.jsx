/**
 * EvaluationForm Component - Rediseño
 * Layout más ancho con mejor uso del espacio
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Save,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateEvaluation,
  useUpdateEvaluation,
  useEvaluationById,
} from "../../hooks/useEvaluations";
import { getCurrentUser } from "@/shared/utils/authUtils";
import Button from "@/shared/components/Button";

const EvaluationForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      location: "",
      observations: "",
    },
  });

  const currentUser = getCurrentUser();
  const createEvaluation = useCreateEvaluation();
  const updateEvaluation = useUpdateEvaluation();
  const {
    data: evaluationData,
    isLoading: isLoadingData,
    error: evaluationError,
  } = useEvaluationById(id);

  useEffect(() => {
    if (isEdit && evaluationData?.data) {
      const evaluation = evaluationData.data;
      setValue("name", evaluation.name);
      setValue("date", evaluation.date.split("T")[0]);
      setValue("time", evaluation.time);
      setValue("location", evaluation.location || "");
      setValue("observations", evaluation.observations || "");
    }
  }, [evaluationData, isEdit, setValue]);

  const onSubmit = async (formData) => {
    const today = new Date().toISOString().split("T")[0];
    if (formData.date < today) {
      toast.error("La fecha no puede ser anterior a hoy");
      return;
    }

    const normalizeDate = (value) => {
      if (!value) return value;
      if (value.includes("-")) return value.slice(0, 10);
      if (value.includes("/")) {
        const [mm, dd, yyyy] = value.split("/");
        if (yyyy && mm && dd) {
          return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
        }
      }
      return value;
    };

    const selectedDate = normalizeDate(formData.date);
    const timeHHMM = (formData.time || "00:00").slice(0, 5);
    const dateTimeIso = `${selectedDate}T${timeHHMM}:00`;

    const payload = {
      ...formData,
      date: dateTimeIso,
    };

    if (!isEdit) {
      payload.user_id = currentUser?.id;
    }

    try {
      if (isEdit) {
        await updateEvaluation.mutateAsync({ id, data: payload });
        toast.success("Evaluación actualizada");
        setTimeout(() => navigate("/seguimiento/evaluations"), 1000);
      } else {
        const result = await createEvaluation.mutateAsync(payload);
        toast.success("Evaluación creada", {
          description: "Ahora puedes agregar tests",
        });
        setTimeout(() => {
          navigate(`/seguimiento/evaluations/${result.data.id}/add-tests`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      // Extraer mensaje de error del backend
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Error al guardar la evaluación";
      setError(errorMessage);
    }
  };

  if (isEdit && isLoadingData) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isEdit && !isLoadingData && (evaluationError || !evaluationData?.data)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-error shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">
                Esta evaluación no existe
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Verifica el identificador o vuelve a la lista de evaluaciones.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/seguimiento/evaluations")}
            >
              Volver a evaluaciones
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/seguimiento/evaluations")}
            className="btn btn-ghost btn-sm btn-square"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ClipboardList size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">
                {isEdit ? "Editar Evaluación" : "Nueva Evaluación"}
              </h1>
              <p className="text-xs text-slate-500">
                {isEdit
                  ? "Modifica los datos de la evaluación"
                  : "Crea una evaluación para registrar tests"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Error Alert */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-error shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-error mb-1">Error</h3>
                <p className="text-sm text-error/90">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="btn btn-ghost btn-sm btn-square shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
              {/* Name */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <ClipboardList size={14} />
                  Nombre de la Evaluación
                  <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Evaluación Física Pre-Temporada 2024"
                  {...register("name", {
                    required: "El nombre es requerido",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                  className="input input-bordered w-full bg-white"
                />
                {errors.name && (
                  <p className="text-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Date/Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={14} />
                    Fecha
                    <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("date", { required: "La fecha es requerida" })}
                    className="input input-bordered w-full bg-white"
                  />
                  {errors.date && (
                    <p className="text-error text-xs mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Clock size={14} />
                    Hora
                    <span className="text-error">*</span>
                  </label>
                  <input
                    type="time"
                    {...register("time", { required: "La hora es requerida" })}
                    className="input input-bordered w-full bg-white"
                  />
                  {errors.time && (
                    <p className="text-error text-xs mt-1">
                      {errors.time.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <MapPin size={14} />
                  Ubicación
                  <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Estadio, Cancha Principal, Gimnasio"
                  {...register("location")}
                  className="input input-bordered w-full bg-white"
                />
              </div>

              {/* Observations */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <FileText size={14} />
                  Observaciones
                  <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  placeholder="Notas adicionales, objetivos de la evaluación, equipos a evaluar..."
                  rows="3"
                  {...register("observations")}
                  className="textarea textarea-bordered w-full bg-white"
                />
              </div>

              {/* Info Note for Create */}
              {!isEdit && (
                <div className="bg-info/5 border border-info/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Plus size={18} className="text-info shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-info">
                      Después de crear
                    </p>
                    <p className="text-xs text-info/80">
                      Serás redirigido para agregar tests de velocidad,
                      resistencia, Yoyo y evaluaciones técnicas.
                    </p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-base-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/seguimiento/evaluations")}
                  className="flex-1 md:flex-none"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={
                    createEvaluation.isPending || updateEvaluation.isPending
                  }
                  disabled={
                    createEvaluation.isPending || updateEvaluation.isPending
                  }
                  className="flex-1 md:flex-none gap-2"
                >
                  <Save size={16} />
                  {isEdit ? "Guardar Cambios" : "Crear Evaluación"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;
