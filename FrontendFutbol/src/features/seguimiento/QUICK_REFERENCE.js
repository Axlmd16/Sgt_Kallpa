/**
 * GUÍA RÁPIDA - Sistema de Evaluaciones
 * 
 * Este archivo contiene ejemplos de uso rápido para el sistema de evaluaciones
 */

// ============================================================
// 1. IMPORTAR HOOKS EN UN COMPONENTE
// ============================================================

import {
  useEvaluations,
  useEvaluationById,
  useCreateEvaluation,
  useUpdateEvaluation,
  useDeleteEvaluation,
  useCreateSprintTest,
  useCreateYoyoTest,
  useCreateEnduranceTest,
  useCreateTechnicalAssessment,
} from "@/features/seguimiento/hooks/useEvaluations";

// ============================================================
// 2. USAR HOOKS EN COMPONENTES
// ============================================================

// Obtener lista de evaluaciones
const { data, isLoading, error } = useEvaluations({ skip: 0, limit: 20 });
const evaluations = data?.data || [];

// Obtener detalle de una evaluación
const { data: evalData } = useEvaluationById(evaluationId);
const evaluation = evalData?.data;

// ============================================================
// 3. CREAR EVALUACIÓN
// ============================================================

const createEvaluation = useCreateEvaluation();

const handleCreate = async (formData) => {
  try {
    const result = await createEvaluation.mutateAsync({
      name: formData.name,
      date: formData.date,           // YYYY-MM-DD
      time: formData.time,           // HH:mm
      user_id: currentUser.id,
      location: formData.location,   // opcional
      observations: formData.observations, // opcional
    });
    console.log("Evaluación creada:", result.data.id);
  } catch (error) {
    console.error("Error:", error);
  }
};

// ============================================================
// 4. EDITAR EVALUACIÓN
// ============================================================

const updateEvaluation = useUpdateEvaluation();

const handleUpdate = async (evaluationId, updateData) => {
  try {
    await updateEvaluation.mutateAsync({
      id: evaluationId,
      data: {
        name: updateData.name,          // opcional
        date: updateData.date,          // opcional
        time: updateData.time,          // opcional
        location: updateData.location,  // opcional
        observations: updateData.observations, // opcional
      },
    });
    console.log("Evaluación actualizada");
  } catch (error) {
    console.error("Error:", error);
  }
};

// ============================================================
// 5. ELIMINAR EVALUACIÓN
// ============================================================

const deleteEvaluation = useDeleteEvaluation();

const handleDelete = async (evaluationId) => {
  if (window.confirm("¿Estás seguro?")) {
    try {
      await deleteEvaluation.mutateAsync(evaluationId);
      console.log("Evaluación eliminada");
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

// ============================================================
// 6. CREAR TEST DE VELOCIDAD (SPRINT)
// ============================================================

const createSprintTest = useCreateSprintTest();

const handleCreateSprint = async (testData) => {
  try {
    await createSprintTest.mutateAsync({
      athlete_id: parseInt(testData.athlete_id),
      evaluation_id: parseInt(evaluationId),
      distance_meters: parseFloat(testData.distance_meters),
      time_0_10_s: parseFloat(testData.time_0_10_s),    // segundos
      time_0_30_s: parseFloat(testData.time_0_30_s),    // segundos
      date: new Date().toISOString(),
      observations: testData.observations,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// ============================================================
// 7. CREAR TEST YOYO
// ============================================================

const createYoyoTest = useCreateYoyoTest();

const handleCreateYoyo = async (testData) => {
  try {
    await createYoyoTest.mutateAsync({
      athlete_id: parseInt(testData.athlete_id),
      evaluation_id: parseInt(evaluationId),
      shuttle_count: parseInt(testData.shuttle_count),   // lanzaderas
      final_level: testData.final_level,                 // ej: "18.2"
      failures: parseInt(testData.failures),             // fallos
      date: new Date().toISOString(),
      observations: testData.observations,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// ============================================================
// 8. CREAR TEST DE RESISTENCIA
// ============================================================

const createEnduranceTest = useCreateEnduranceTest();

const handleCreateEndurance = async (testData) => {
  try {
    await createEnduranceTest.mutateAsync({
      athlete_id: parseInt(testData.athlete_id),
      evaluation_id: parseInt(evaluationId),
      min_duration: parseInt(testData.min_duration),     // minutos
      total_distance_m: parseFloat(testData.total_distance_m), // metros
      date: new Date().toISOString(),
      observations: testData.observations,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// ============================================================
// 9. CREAR EVALUACIÓN TÉCNICA
// ============================================================

const createTechnicalAssessment = useCreateTechnicalAssessment();

const handleCreateTechnical = async (testData) => {
  // Opciones válidas para escalas: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
  try {
    await createTechnicalAssessment.mutateAsync({
      athlete_id: parseInt(testData.athlete_id),
      evaluation_id: parseInt(evaluationId),
      ball_control: testData.ball_control,      // escala
      short_pass: testData.short_pass,          // escala
      long_pass: testData.long_pass,            // escala
      shooting: testData.shooting,              // escala
      dribbling: testData.dribbling,            // escala
      date: new Date().toISOString(),
      observations: testData.observations,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// ============================================================
// 10. NAVEGACIÓN
// ============================================================

import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Ir a lista de evaluaciones
navigate("/seguimiento/evaluations");

// Ir a crear evaluación
navigate("/seguimiento/evaluations/create");

// Ir a ver detalle de evaluación
navigate(`/seguimiento/evaluations/${evaluationId}`);

// Ir a editar evaluación
navigate(`/seguimiento/evaluations/${evaluationId}/edit`);

// Ir a agregar tests
navigate(`/seguimiento/evaluations/${evaluationId}/add-tests`);

// ============================================================
// 11. FORMATOS DE DATOS ESPERADOS
// ============================================================

// Fecha: YYYY-MM-DD
const date = "2024-01-15";

// Hora: HH:mm
const time = "10:30";

// ISO DateTime
const isoDateTime = new Date().toISOString(); // 2024-01-15T10:30:00.000Z

// Escalas técnicas
const scales = ["MUY_BAJO", "BAJO", "MEDIO", "ALTO", "MUY_ALTO"];

// ============================================================
// 12. MANEJO DE ERRORES
// ============================================================

// Los errores se muestran automáticamente como toast notificaciones
// Pero puedes capturarlos así:

const handleWithErrorHandling = async () => {
  try {
    await createEvaluation.mutateAsync(data);
  } catch (error) {
    const message = error.response?.data?.detail || "Error desconocido";
    console.error("Error detallado:", message);
    // Aquí puedes mostrar un modal de error si quieres
  }
};

// ============================================================
// 13. UTILITARIOS DE FECHA
// ============================================================

import {
  formatDate,
  formatTime,
  getTodayISO,
  isFutureDate,
} from "@/shared/utils/dateUtils";

// Formatear fecha para mostrar
const formattedDate = formatDate("2024-01-15T10:30:00"); // "15/01/2024"

// Formatear hora
const formattedTime = formatTime("10:30"); // "10:30"

// Obtener fecha de hoy en ISO
const today = getTodayISO(); // "2024-01-15"

// Verificar si es fecha futura
const isFuture = isFutureDate("2024-01-20"); // true/false

// ============================================================
// 14. UTILITARIOS DE AUTENTICACIÓN
// ============================================================

import {
  getCurrentUser,
  getAuthToken,
  isAuthenticated,
} from "@/shared/utils/authUtils";

// Obtener usuario actual
const user = getCurrentUser(); // { id: 1, name: "John", ... }

// Obtener ID del usuario
const userId = getCurrentUser()?.id;

// Verificar si está autenticado
const authenticated = isAuthenticated();

// ============================================================
// 15. COMPONENTES LISTOS PARA USAR
// ============================================================

// En la página EvaluationsPage.jsx se pueden usar todos estos:
import {
  EvaluationsList,      // Lista de evaluaciones
  EvaluationForm,       // Crear/editar evaluación
  EvaluationDetail,     // Ver detalles
  AddTestsForm,         // Agregar tests
} from "@/features/seguimiento/components";

// Uso:
// <EvaluationsList />
// <EvaluationForm isEdit={false} />
// <EvaluationForm isEdit={true} />
// <EvaluationDetail />
// <AddTestsForm />

// ============================================================
// 16. PAGINACIÓN EN LISTA DE EVALUACIONES
// ============================================================

const pageSize = 10;
const [page, setPage] = useState(0);

//const { data } = useEvaluations({
//  skip: page * pageSize,
//  limit: pageSize,
//});

const totalCount = data?.total || 0;
const totalPages = Math.ceil(totalCount / pageSize);

// ============================================================
// 17. EJEMPLO COMPLETO EN UN COMPONENTE
// ============================================================

/*
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateEvaluation } from '@/features/seguimiento/hooks/useEvaluations';
import { getCurrentUser } from '@/shared/utils/authUtils';

export default function MyEvaluationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const createEvaluation = useCreateEvaluation();
  const currentUser = getCurrentUser();

  const onSubmit = async (data) => {
    try {
      await createEvaluation.mutateAsync({
        ...data,
        user_id: currentUser.id,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      <input type="date" {...register('date', { required: true })} />
      <input type="time" {...register('time', { required: true })} />
      <button type="submit" disabled={createEvaluation.isPending}>
        Crear
      </button>
    </form>
  );
}
*/
