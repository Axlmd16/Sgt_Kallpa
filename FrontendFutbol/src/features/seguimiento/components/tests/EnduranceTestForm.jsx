/**
 * EnduranceTestForm - Diseño con secciones y mejor espaciado
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Heart,
  Save,
  Timer,
  Ruler,
  Activity,
  FileText,
  Info,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/shared/components/Button";

const EnduranceTestForm = ({
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

  // Límites razonables para evitar basura y overflow en backend
  const MAX_DURATION_MIN = 240; // 4 horas como tope alto
  const MAX_DISTANCE_M = 50000; // 50 km como tope alto
  const MIN_DURATION_MIN = 30; // mínimo aceptable solicitado
  const MIN_DISTANCE_M = 2000; // mínimo razonable para 30 minutos (ritmo caminata rápida)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      min_duration: isEdit ? testData?.min_duration : 12,
      total_distance_m: isEdit ? testData?.total_distance_m : "",
      observations: isEdit ? testData?.observations : "",
    },
  });

  const duration = watch("min_duration");
  const distance = watch("total_distance_m");
  const MAX_SPEED_KMH = 15; // ritmo mínimo aceptable: ~4 min/km

  const validatePositive = (
    value,
    { min = 0, max, emptyMsg, invalidMsg, minMsg, maxMsg, maxDigits = 9 }
  ) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return emptyMsg || "Este campo es obligatorio";
    if (normalized.replace(".", "").length > maxDigits)
      return maxMsg || "Valor demasiado grande";
    if (!/^[-+]?\d+(\.\d+)?$/.test(normalized))
      return invalidMsg || "Ingresa solo números";
    const num = parseFloat(normalized);
    if (!Number.isFinite(num)) return invalidMsg || "Ingresa un número válido";
    if (num < min) return minMsg || `Debe ser mayor o igual a ${min}`;
    if (typeof max === "number" && num > max)
      return maxMsg || `Debe ser menor o igual a ${max}`;
    return true;
  };

  const metrics = (() => {
    const dur = parseFloat(duration);
    const dist = parseFloat(distance);
    if (!dur || !dist || dur <= 0 || dist <= 0) return null;
    const km = dist / 1000;
    const speed = (km / dur) * 60;
    const pace = dur / km;
    return {
      speed: speed.toFixed(1),
      rawSpeed: speed,
      pace: `${Math.floor(pace)}:${Math.round((pace % 1) * 60)
        .toString()
        .padStart(2, "0")}`,
      km: km.toFixed(2),
    };
  })();

  useEffect(() => {
    if (isEdit && testData) {
      setSelectedAthlete({
        id: testData.athlete_id,
        full_name: testData.athlete_name,
      });
      setValue("min_duration", testData.min_duration);
      setValue("total_distance_m", testData.total_distance_m);
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
    const durationValue = Number(formData.min_duration);
    const distanceValue = Number(formData.total_distance_m);
    if (!Number.isFinite(durationValue) || durationValue <= 0) {
      toast.error("La duración debe ser un número mayor a 0");
      return;
    }
    if (durationValue < MIN_DURATION_MIN) {
      toast.error(`La duración debe ser al menos ${MIN_DURATION_MIN} minutos`);
      return;
    }
    if (durationValue > MAX_DURATION_MIN) {
      toast.error(`La duración no puede superar ${MAX_DURATION_MIN} minutos`);
      return;
    }
    if (!Number.isFinite(distanceValue) || distanceValue <= 0) {
      toast.error("La distancia debe ser un número mayor a 0");
      return;
    }
    if (distanceValue < MIN_DISTANCE_M) {
      toast.error(`La distancia debe ser al menos ${MIN_DISTANCE_M} metros`);
      return;
    }
    if (distanceValue > MAX_DISTANCE_M) {
      toast.error(`La distancia no puede superar ${MAX_DISTANCE_M} metros`);
      return;
    }
    const km = distanceValue / 1000;
    const speedKmh = (km / durationValue) * 60;
    if (speedKmh > MAX_SPEED_KMH) {
      toast.error(
        `Los valores ingresados generan una velocidad irreal (${speedKmh.toFixed(
          1,
        )} km/h). Verifica distancia y duración.`,
      );
      return;
    }
    try {
      const payload = {
        athlete_id: selectedAthlete.id,
        min_duration: durationValue,
        total_distance_m: distanceValue,
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
      reset({ min_duration: 12, total_distance_m: "", observations: "" });
      onSuccess();
    } catch (error) {
      console.error("Error creating endurance test:", error);
      // El toast se maneja en onError del hook useCreateEnduranceTest
    }
  };

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-200 bg-error/5">
        <div className="bg-error/10 p-2.5 rounded-xl">
          <Heart size={20} className="text-error" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">
            Test de Resistencia (Cooper)
          </h3>
          <p className="text-sm text-slate-500">{selectedAthlete?.full_name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-5 space-y-6">
        {/* Test Parameters */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Timer size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Parámetros del Test
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-500">
                  Duración del Test
                </label>
                <Timer size={14} className="text-slate-400" />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="12"
                  {...register("min_duration", {
                    validate: (v) =>
                      validatePositive(v, {
                        min: MIN_DURATION_MIN,
                        max: MAX_DURATION_MIN,
                        maxDigits: 4,
                        emptyMsg: "La duración es obligatoria",
                        invalidMsg: "Formato inválido, usa solo números",
                        minMsg: `La duración debe ser al menos ${MIN_DURATION_MIN} minutos`,
                        maxMsg: `La duración no puede superar ${MAX_DURATION_MIN} minutos`,
                      }),
                  })}
                  className={`input input-bordered bg-white flex-1 ${
                    errors.min_duration ? "input-error" : ""
                  }`}
                />
                <span className="text-sm text-slate-600">minutos</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                <Info size={12} />
                <span>Test Cooper estándar: 12 minutos</span>
              </div>
              {errors.min_duration && (
                <p className="mt-2 text-xs text-error">
                  {errors.min_duration.message}
                </p>
              )}
            </div>

            {/* Distance */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-500">
                  Distancia Recorrida
                </label>
                <Ruler size={14} className="text-slate-400" />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="2500"
                  {...register("total_distance_m", {
                    validate: (v) =>
                      validatePositive(v, {
                        min: MIN_DISTANCE_M,
                        max: MAX_DISTANCE_M,
                        maxDigits: 6,
                        emptyMsg: "La distancia es obligatoria",
                        invalidMsg: "Formato inválido, usa solo números",
                        minMsg: `La distancia debe ser al menos ${MIN_DISTANCE_M} m`,
                        maxMsg: `La distancia no puede superar ${MAX_DISTANCE_M} m`,
                      }),
                  })}
                  className={`input input-bordered bg-white flex-1 ${
                    errors.total_distance_m ? "input-error" : ""
                  }`}
                />
                <span className="text-sm text-slate-600">metros</span>
              </div>
              {metrics && (
                <div className="text-xs text-success mt-2 font-medium">
                  = {metrics.km} kilómetros
                </div>
              )}
              {errors.total_distance_m && (
                <p className="mt-2 text-xs text-error">
                  {errors.total_distance_m.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Calculated Metrics */}
        {metrics && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Métricas Calculadas
              </span>
            </div>
            {metrics?.rawSpeed > MAX_SPEED_KMH && (
              <div className="alert alert-warning mb-3 text-sm">
                <div>
                  <span>
                    El ritmo calculado ({metrics.speed} km/h) es demasiado alto. Verifica que la distancia y duración sean correctas (mínimo ~4 min/km).
                  </span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-success/5 border border-success/20 rounded-lg p-4 flex items-center gap-4">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Gauge size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Velocidad Promedio</p>
                  <p className="text-xl font-bold text-slate-900">
                    {metrics.speed}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      km/h
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-4 flex items-center gap-4">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Timer size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ritmo (Pace)</p>
                  <p className="text-xl font-bold text-slate-900">
                    {metrics.pace}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      min/km
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Observaciones
            </span>
            <span className="text-xs text-slate-400">(opcional)</span>
          </div>
          <textarea
            placeholder="Condiciones climáticas, fatiga observada, frecuencia cardíaca final..."
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

export default EnduranceTestForm;
