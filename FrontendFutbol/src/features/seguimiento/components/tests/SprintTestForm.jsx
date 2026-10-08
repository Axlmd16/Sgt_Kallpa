/**
 * SprintTestForm - Diseño con secciones y mejor espaciado
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Zap,
  Save,
  Ruler,
  Timer,
  TrendingUp,
  FileText,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/shared/components/Button";

const SprintTestForm = ({
  evaluationId,
  mutation,
  onSuccess,
  isEdit = false,
  testData = null,
  onCancel,
  selectedAthlete: selectedAthleteProp = null,
  hideAthleteSelector = false,
}) => {
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      distance_meters: isEdit ? testData?.distance_meters : 30,
      time_0_10_s: isEdit ? testData?.time_0_10_s : "",
      time_0_30_s: isEdit ? testData?.time_0_30_s : "",
      observations: isEdit ? testData?.observations : "",
    },
  });

  const distanceValue = watch("distance_meters");
  const time10 = watch("time_0_10_s");
  const time30 = watch("time_0_30_s");

  const totalDistanceNumeric = parseFloat(distanceValue);
  const hasValidDistance =
    Number.isFinite(totalDistanceNumeric) && totalDistanceNumeric > 0;
  const totalDistanceLabel = hasValidDistance ? totalDistanceNumeric : 30;
  const partialDistanceLabel = hasValidDistance
    ? Math.min(10, totalDistanceNumeric)
    : 10;

  const isNumericString = (value) => {
    const normalized = String(value ?? "").trim();
    return normalized.length > 0 && /^\d+(\.\d+)?$/.test(normalized);
  };

  const validatePositiveNumber = (
    value,
    invalidMessage = "Formato inválido, usa solo números",
    emptyMessage = "El valor es obligatorio",
    { maxDigits } = {}
  ) => {
    if (value === undefined || value === null || String(value).trim() === "") {
      return emptyMessage;
    }
    if (!isNumericString(value)) return invalidMessage;
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return invalidMessage;
    if (maxDigits && String(value).replace(".", "").length > maxDigits)
      return "Valor demasiado grande";
    if (num <= 0) return "El valor debe ser mayor a 0";
    return true;
  };

  const MAX_SPRINT_SPEED_MS_TOTAL = 12.0; // velocidad máxima razonable para el tramo completo
  const MAX_SPRINT_SPEED_MS_SHORT = 12.0; // mismo tope para tramos cortos (0-10 m)
  const MIN_SPRINT_SPEED_MS = 2.22; // velocidad mínima aceptable (~2.22 m/s)

  const validateTimeForDistance = (value, distance) => {
    const baseValidation = validatePositiveNumber(
      value,
      "Formato inválido, ingresa solo números",
      "El tiempo es obligatorio",
      { maxDigits: 6 }
    );
    if (baseValidation !== true) return baseValidation;

    const num = parseFloat(value);
    const dist = Number(distance);
    if (!Number.isFinite(dist) || dist <= 0) {
      return "Ingresa una distancia válida";
    }
    // Min override para parciales muy cortos (<=10 m): al menos 1s
    if (dist <= 10 && num < 1) {
      return `El tiempo mínimo para ${dist} m es 1.00 s`;
    }

    const speed = dist / num;
    const maxSpeed = dist <= 15 ? MAX_SPRINT_SPEED_MS_SHORT : MAX_SPRINT_SPEED_MS_TOTAL;
    const minTime = dist / maxSpeed;
    const maxTime = dist / MIN_SPRINT_SPEED_MS;
    const tolerance = 0.01; // permitir ligera variación por redondeo

    if (speed > maxSpeed) {
      return `Tiempo demasiado bajo para ${dist} m (velocidad ${speed.toFixed(
        1
      )} m/s, mínimo ${minTime.toFixed(2)} s)`;
    }
    if (num < minTime) {
      return `El tiempo mínimo para ${dist} m es ${minTime.toFixed(2)} s`;
    }
    if (num - maxTime > tolerance) {
      return `El tiempo máximo para ${dist} m es ${maxTime.toFixed(2)} s`;
    }
    return true;
  };

  const speed10m =
    time10 > 0 && partialDistanceLabel > 0
      ? (partialDistanceLabel / parseFloat(time10)).toFixed(2)
      : null;
  const speedTotal =
    time30 > 0 && totalDistanceLabel > 0
      ? (totalDistanceLabel / parseFloat(time30)).toFixed(2)
      : null;

  useEffect(() => {
    if (isEdit && testData) {
      setSelectedAthlete({
        id: testData.athlete_id,
        full_name: testData.athlete_name,
      });
      setValue("distance_meters", testData.distance_meters);
      setValue("time_0_10_s", testData.time_0_10_s);
      setValue("time_0_30_s", testData.time_0_30_s);
      setValue("observations", testData.observations || "");
    }
  }, [isEdit, testData, setValue]);

  useEffect(() => {
    if (!isEdit && selectedAthleteProp) setSelectedAthlete(selectedAthleteProp);
  }, [selectedAthleteProp, isEdit]);

  const onSubmit = async (formData) => {
    if (!selectedAthlete) {
      toast.error("Selecciona un atleta");
      return;
    }
    try {
      const payload = {
        athlete_id: selectedAthlete.id,
        distance_meters: parseFloat(formData.distance_meters),
        time_0_10_s: parseFloat(formData.time_0_10_s),
        time_0_30_s: parseFloat(formData.time_0_30_s),
        observations: formData.observations,
      };
      if (isEdit) {
        await mutation.mutateAsync({ testId: testData.id, data: payload });
        toast.success("Test actualizado");
      } else {
        await mutation.mutateAsync({
          ...payload,
          evaluation_id: parseInt(evaluationId),
          date: new Date().toISOString(),
        });
        toast.success("Test registrado");
      }
      reset({
        distance_meters: 30,
        time_0_10_s: "",
        time_0_30_s: "",
        observations: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating sprint test:", error);
      // El toast ya se maneja en onError del hook useCreateSprintTest
    }
  };

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-200 bg-warning/5">
        <div className="bg-warning/10 p-2.5 rounded-xl">
          <Zap size={20} className="text-warning" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">Test de Velocidad</h3>
          <p className="text-sm text-slate-500">{selectedAthlete?.full_name}</p>
        </div>
        {(speed10m || speedTotal) && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-success">
              <TrendingUp size={14} />
              <span className="text-sm font-medium">Métricas activas</span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="p-5 space-y-6"
      >
        {/* Distance Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ruler size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Configuración de Distancia
            </span>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <label className="text-xs text-slate-500 mb-1.5 block">
              Distancia total del sprint
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                {...register("distance_meters", {
                  required: "La distancia es obligatoria",
                  validate: (v) => {
                    const base = validatePositiveNumber(
                      v,
                      "Formato inválido, ingresa solo números",
                      "La distancia es obligatoria"
                    );
                    if (base !== true) return base;
                    const num = parseFloat(v);
                    if (num > 60) return "La distancia máxima para sprint es 60 metros";
                    return true;
                  },
                })}
                className={`input input-bordered bg-white w-32 ${
                  errors.distance_meters ? "input-error" : ""
                }`}
                max="60"
                min="1"
              />
              <span className="text-sm text-slate-600">metros</span>
              <div className="flex-1"></div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Info size={12} />
                <span>Estándar: 30m</span>
              </div>
            </div>
            {errors.distance_meters && (
              <p className="mt-2 text-xs text-error">
                {errors.distance_meters.message}
              </p>
            )}
          </div>
        </div>

        {/* Times Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Timer size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Tiempos Registrados
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Time 0-10m */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-500">
                  Parcial 0 - {partialDistanceLabel} metros
                </label>
                {speed10m && (
                  <span className="badge badge-success badge-sm gap-1">
                    <TrendingUp size={10} />
                    {speed10m} m/s
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  placeholder="1.85"
                  {...register("time_0_10_s", {
                    required: "El tiempo es obligatorio",
                    validate: (v) =>
                      validateTimeForDistance(
                        v,
                        partialDistanceLabel
                      ),
                  })}
                  className={`input input-bordered bg-white flex-1 ${
                    errors.time_0_10_s ? "input-error" : ""
                  }`}
                />
                <span className="text-sm text-slate-600 w-12">seg</span>
              </div>
              {errors.time_0_10_s && (
                <p className="mt-2 text-xs text-error">
                  {errors.time_0_10_s.message}
                </p>
              )}
            </div>

            {/* Time 0-30m */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-500">
                  Total 0 - {totalDistanceLabel} metros
                </label>
                {speedTotal && (
                  <span className="badge badge-success badge-sm gap-1">
                    <TrendingUp size={10} />
                    {speedTotal} m/s
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  placeholder="3.95"
                  {...register("time_0_30_s", {
                    required: "El tiempo es obligatorio",
                    validate: (v) => {
                      const base = validateTimeForDistance(
                        v,
                        totalDistanceLabel
                      );
                      if (base !== true) return base;

                      const t10 = parseFloat(time10);
                      const t30 = parseFloat(v);
                      if (
                        Number.isFinite(t10) &&
                        Number.isFinite(t30) &&
                        t30 < t10
                      ) {
                        return "El tiempo total debe ser mayor o igual al parcial 0-10 m";
                      }

                      return true;
                    },
                  })}
                  className={`input input-bordered bg-white flex-1 ${
                    errors.time_0_30_s ? "input-error" : ""
                  }`}
                />
                <span className="text-sm text-slate-600 w-12">seg</span>
              </div>
              {errors.time_0_30_s && (
                <p className="mt-2 text-xs text-error">
                  {errors.time_0_30_s.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Observations Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Observaciones
            </span>
            <span className="text-xs text-slate-400">(opcional)</span>
          </div>
          <textarea
            placeholder="Notas sobre el rendimiento, condiciones del test, fatiga observada..."
            rows="3"
            {...register("observations")}
            className="textarea textarea-bordered w-full bg-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-base-200">
          {isEdit && onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={mutation.isPending}
            className="gap-2"
          >
            <Save size={16} />
            {isEdit ? "Actualizar Test" : "Registrar Test"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SprintTestForm;
