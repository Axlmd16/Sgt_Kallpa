/**
 * TechnicalAssessmentForm - Diseño con mejor espaciado e iconos
 */

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Target,
  Save,
  Star,
  FileText,
  CircleDot,
  ArrowRight,
  Crosshair,
  Footprints,
  Move,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/shared/components/Button";

const SCALE = [
  {
    value: "Poor",
    label: "Pobre",
    score: 1,
    color: "bg-error/20 text-error border-error/30",
  },
  {
    value: "Average",
    label: "Regular",
    score: 2,
    color: "bg-warning/20 text-warning border-warning/30",
  },
  {
    value: "Good",
    label: "Bueno",
    score: 3,
    color: "bg-info/20 text-info border-info/30",
  },
  {
    value: "Excellent",
    label: "Excelente",
    score: 4,
    color: "bg-success/20 text-success border-success/30",
  },
];

const SKILLS = [
  {
    id: "ball_control",
    label: "Control de Balón",
    icon: CircleDot,
    description: "Primera recepción y dominio",
  },
  {
    id: "short_pass",
    label: "Pase Corto",
    icon: ArrowRight,
    description: "Precisión a corta distancia",
  },
  {
    id: "long_pass",
    label: "Pase Largo",
    icon: Move,
    description: "Cambios de orientación",
  },
  {
    id: "shooting",
    label: "Disparo",
    icon: Crosshair,
    description: "Potencia y precisión",
  },
  {
    id: "dribbling",
    label: "Regate",
    icon: Footprints,
    description: "Capacidad de superar rivales",
  },
];

const TechnicalAssessmentForm = ({
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

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      ball_control: "Average",
      short_pass: "Average",
      long_pass: "Average",
      shooting: "Average",
      dribbling: "Average",
      observations: "",
    },
  });

  const watchedValues = SKILLS.map((s) => watch(s.id));

  const score = useMemo(() => {
    const scores = watchedValues.map((v) => {
      const opt = SCALE.find((s) => s.value === v);
      return opt?.score || 2;
    });
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { avg: avg.toFixed(1), pct: Math.round((avg / 4) * 100) };
  }, [watchedValues]);

  useEffect(() => {
    if (isEdit && testData) {
      setSelectedAthlete({
        id: testData.athlete_id,
        full_name: testData.athlete_name,
      });
      SKILLS.forEach((s) => setValue(s.id, testData[s.id] || "Average"));
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
        ...SKILLS.reduce((acc, s) => ({ ...acc, [s.id]: formData[s.id] }), {}),
        observations: formData.observations,
      };
      if (isEdit) {
        await mutation.mutateAsync({ testId: testData.id, data: payload });
        toast.success("Evaluación actualizada");
      } else {
        await mutation.mutateAsync({
          ...payload,
          evaluation_id: parseInt(evaluationId),
          date: new Date().toISOString(),
        });
        toast.success("Evaluación registrada");
      }
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating technical assessment:", error);
      // El toast ya se maneja en onError del hook useCreateTechnicalAssessment
    }
  };

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-200 bg-primary/5">
        <div className="bg-primary/10 p-2.5 rounded-xl">
          <Target size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">Evaluación Técnica</h3>
          <p className="text-sm text-slate-500">{selectedAthlete?.full_name}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg">
          <Star size={16} className="text-warning" fill="currentColor" />
          <span className="text-lg font-bold text-slate-900">{score.avg}</span>
          <span className="text-sm text-slate-500">/ 4</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
        {/* Skills Evaluation */}
        <div className="space-y-4">
          {SKILLS.map((skill) => {
            const IconComponent = skill.icon;
            const currentValue = watch(skill.id);

            return (
              <div key={skill.id} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {/* Skill Info */}
                  <div className="flex items-center gap-3 w-48 shrink-0">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <IconComponent size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">
                        {skill.label}
                      </p>
                      <p className="text-xs text-slate-500">
                        {skill.description}
                      </p>
                    </div>
                  </div>

                  {/* Rating Options */}
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    {SCALE.map((opt) => (
                      <label
                        key={opt.value}
                        className={`cursor-pointer text-center py-3 px-2 rounded-lg border-2 transition-all ${
                          currentValue === opt.value
                            ? opt.color + " border-current"
                            : "bg-white border-transparent hover:border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register(skill.id)}
                          className="sr-only"
                        />
                        <div className="text-xl font-bold">{opt.score}</div>
                        <div className="text-xs mt-0.5">{opt.label}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-warning" fill="currentColor" />
              <span className="text-sm font-medium text-slate-700">
                Puntuación General
              </span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              {score.pct}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all bg-linear-to-r from-primary/80 to-primary"
              style={{ width: `${score.pct}%` }}
            />
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
            placeholder="Fortalezas, áreas de mejora, recomendaciones de entrenamiento..."
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
            {isEdit ? "Actualizar Evaluación" : "Registrar Evaluación"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TechnicalAssessmentForm;
