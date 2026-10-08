/**
 * EvaluationsPage - Página Principal de Evaluaciones
 *
 * Maneja la visualización de evaluaciones y navegación
 * entre diferentes vistas
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import EvaluationsList from "../components/EvaluationComponents/EvaluationsList";
import EvaluationForm from "../components/EvaluationComponents/EvaluationForm";
import EvaluationDetail from "../components/EvaluationComponents/EvaluationDetail";
import AddTestsForm from "../components/tests/AddTestsForm";

const EvaluationsPage = () => {
  return (
    <div>
      <Routes>
        {/* Lista de evaluaciones */}
        <Route index element={<EvaluationsList />} />

        {/* Crear nueva evaluación */}
        <Route path="create" element={<EvaluationForm isEdit={false} />} />

        {/* Detalle y edición */}
        <Route path=":id" element={<EvaluationDetail />} />
        <Route path=":id/edit" element={<EvaluationForm isEdit={true} />} />
        <Route path=":id/add-tests" element={<AddTestsForm />} />
      </Routes>
    </div>
  );
};

export default EvaluationsPage;
