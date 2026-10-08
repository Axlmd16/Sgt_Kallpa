/**
 * YoyoTestForm - Diseño con secciones y mejor espaciado
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  RefreshCw,
  Save,
  Hash,
  Trophy,
  XCircle,
  TrendingUp,
  FileText,
  Info,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/shared/components/Button";

const VO2_TABLE = {
  15.1: 42.4,
  15.5: 46.0,
  16.1: 49.0,
  16.3: 50.5,
  16.5: 51.9,
  17.1: 54.3,
  17.5: 56.8,
  18.1: 58.9,
  18.5: 60.8,
  19.1: 62.4,
  19.5: 64.0,
  20.1: 65.4,
  20.5: 66.7,
};

const YoyoTestForm = ({
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

  // Límites razonables
  const MIN_SHUTTLES = 10;
  const MAX_SHUTTLES = 400; // evita distancias irreales
  const MIN_LEVEL = 12.0;
  const MAX_LEVEL = 20.5; // acorde a VO2_TABLE
  const MAX_FAILURES = 2; // el test se da por terminado a 2 fallos

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      shuttle_count: isEdit ? testData?.shuttle_count : "",
      final_level: isEdit ? testData?.final_level : "",
      failures: isEdit ? testData?.failures : 0,
      observations: isEdit ? testData?.observations : "",
    },
  });

  const finalLevel = watch("final_level");
    // Normalizar final_level en el input para mostrar siempre un decimal
    const handleFinalLevelBlur = (event) => {
      const raw = String(event.target.value ?? "").trim();
      if (!raw) return;
      // Si es entero, anexar .0; si ya tiene decimal, dejarlo
      if (/^\d+$/.test(raw)) {
        setValue("final_level", `${raw}.0`, { shouldValidate: true, shouldDirty: true });
        return;
      }
      // Si es válido con un decimal, mantenerlo, pero normalizar a un decimal fijo
      const num = Number(raw);
      if (Number.isFinite(num)) {
        setValue("final_level", num.toFixed(1), { shouldValidate: true, shouldDirty: true });
      }
    };

  const shuttles = watch("shuttle_count");
  const failures = watch("failures");

  const parsedShuttles = Number(shuttles);
  const isValidShuttlesDistance =
    Number.isFinite(parsedShuttles) &&
    parsedShuttles >= MIN_SHUTTLES &&
    parsedShuttles <= MAX_SHUTTLES;

  const vo2 = VO2_TABLE[finalLevel] || null;
  const distance = isValidShuttlesDistance ? parsedShuttles * 40 : null;

  const validateFinalLevel = (value) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return "El nivel final es obligatorio";
    // Aceptar enteros y con un decimal; setValueAs ya convierte enteros a X.0
    const isValidFormat = /^\d{1,2}(?:\.\d)?$/.test(normalized);
    if (!isValidFormat)
      return "Nivel final: formato inválido. Usa XX.Y (ej: 16.3, 18.2)";
    const num = parseFloat(normalized);
    if (num < MIN_LEVEL)
      return `Nivel final debe ser al menos ${MIN_LEVEL.toFixed(1)}`;
    if (num > MAX_LEVEL)
      return `Nivel final no puede superar ${MAX_LEVEL.toFixed(1)}`;
    return true;
  };

  const validateShuttles = (value) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return "Los shuttles son obligatorios";
    if (!/^\d+$/.test(normalized)) return "Ingresa solo números";
    const num = parseInt(normalized, 10);
    if (num < MIN_SHUTTLES) return `Mínimo permitido: ${MIN_SHUTTLES}`;
    if (num > MAX_SHUTTLES) return `Máximo permitido: ${MAX_SHUTTLES}`;
    return true;
  };

  const validateFailures = (value) => {
    const normalized = String(value ?? "").trim();
    if (normalized === "") return true; // opcional
    if (!/^\d+$/.test(normalized)) return "Ingresa solo números";
    const num = parseInt(normalized, 10);
    if (num < 0) return "No puede ser negativo";
    if (num > MAX_FAILURES) return `Máximo permitido: ${MAX_FAILURES}`;
    return true;
  };

  useEffect(() => {
    if (isEdit && testData) {
      setSelectedAthlete({
        id: testData.athlete_id,
        full_name: testData.athlete_name,
      });
      setValue("shuttle_count", testData.shuttle_count);
      setValue("final_level", testData.final_level);
      setValue("failures", testData.failures);
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
    const shuttlesValue = Number(formData.shuttle_count);
    if (
      !Number.isFinite(shuttlesValue) ||
      shuttlesValue < MIN_SHUTTLES ||
      shuttlesValue > MAX_SHUTTLES
    ) {
      toast.error(`Shuttles debe estar entre ${MIN_SHUTTLES} y ${MAX_SHUTTLES}`);
      return;
    }
    const levelValue = parseFloat(formData.final_level);
    if (!Number.isFinite(levelValue) || levelValue < MIN_LEVEL || levelValue > MAX_LEVEL) {
      toast.error(
        `Nivel final debe estar entre ${MIN_LEVEL.toFixed(1)} y ${MAX_LEVEL.toFixed(1)}`
      );
      return;
    }
    const failuresValue = Number(failures);
    if (failuresValue < 0 || failuresValue > MAX_FAILURES) {
      toast.error(`Fallos debe estar entre 0 y ${MAX_FAILURES}`);
      return;
    }
    try {
      const payload = {
        athlete_id: selectedAthlete.id,
        shuttle_count: shuttlesValue,
        final_level: levelValue.toFixed(1),
        failures: failuresValue,
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
        shuttle_count: "",
        final_level: "",
        failures: 0,
        observations: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating yoyo test:", error);
      // El toast ya se maneja en onError del hook useCreateYoyoTest
    }
  };

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-200 bg-success/5">
        <div className="bg-success/10 p-2.5 rounded-xl">
          <RefreshCw size={20} className="text-success" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">Test Yoyo IR1</h3>
          <p className="text-sm text-slate-500">{selectedAthlete?.full_name}</p>
        </div>
        {vo2 && (
          <div className="text-right bg-success/10 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1 text-success">
              <Activity size={14} />
              <span className="text-sm font-bold">VO₂máx: ~{vo2}</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-5 space-y-6">
        {/* Performance Data */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Datos de Rendimiento
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Shuttles */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-500">
                  Shuttles Completados
                </label>
                {distance && (
                  <span className="badge badge-success badge-sm gap-1">
                    <TrendingUp size={10} />≈{distance.toLocaleString()}m
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={MIN_SHUTTLES}
                  max={MAX_SHUTTLES}
                  placeholder="47"
                  {...register("shuttle_count", {
                    validate: validateShuttles,
                  })}
                  className={`input input-bordered bg-white flex-1 ${
                    errors.shuttle_count ? "input-error" : ""
                  }`}
                />
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Info size={12} />
                  <span>×40m cada uno</span>
                </div>
              </div>
              {errors.shuttle_count && (
                <p className="mt-2 text-xs text-error">
                  {errors.shuttle_count.message}
                </p>
              )}
            </div>

            {/* Level */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-500">
                  Nivel Final Alcanzado
                </label>
                <Trophy size={14} className="text-warning" />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="16.3"
                  {...register("final_level", {
                    setValueAs: (v) => {
                      const t = String(v ?? "").trim();
                      if (/^\d+$/.test(t)) return `${t}.0`;
                      return t;
                    },
                    validate: validateFinalLevel,
                  })}
                  onBlur={handleFinalLevelBlur}
                  className={`input input-bordered bg-white flex-1 ${
                    errors.final_level ? "input-error" : ""
                  }`}
                />
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Info size={12} />
                  <span>Ej: 16.3</span>
                </div>
              </div>
              {errors.final_level && (
                <p className="mt-2 text-xs text-error">
                  {errors.final_level.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Failures */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Control de Fallos
            </span>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1.5 block">
                  Número de fallos registrados
                </label>
                <input
                  type="number"
                  min={0}
                  max={MAX_FAILURES}
                  placeholder="0"
                  {...register("failures", {
                    validate: validateFailures,
                  })}
                  className={`input input-bordered bg-white flex-1 ${
                    errors.failures ? "input-error" : ""
                  }`}
                />
              </div>
              <div className="bg-warning/10 text-warning text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                <Info size={14} />
                <span>El test termina automáticamente con 2 fallos</span>
              </div>
            </div>
          </div>
        </div>

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
            placeholder="Fatiga observada, condiciones climáticas, técnica de carrera..."
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

export default YoyoTestForm;
