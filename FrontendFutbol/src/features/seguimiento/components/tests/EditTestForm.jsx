/**
 * EditTestForm Component
 *
 * Componente que renderiza el formulario apropiado
 * según el tipo de test a editar
 */

import React from "react";
import SprintTestForm from "./SprintTestForm";
import YoyoTestForm from "./YoyoTestForm";
import EnduranceTestForm from "./EnduranceTestForm";
import TechnicalAssessmentForm from "./TechnicalAssessmentForm";

const EditTestForm = ({ test, mutation, onSuccess, onCancel }) => {
  // Al editar, ocultamos el selector de atleta ya que el atleta ya está asignado
  const commonProps = {
    evaluationId: test.evaluation_id,
    mutation,
    onSuccess,
    isEdit: true,
    testData: test,
    onCancel,
    hideAthleteSelector: true, // Ocultar selector en edición
  };

  const renderForm = () => {
    switch (test.test_type) {
      case "sprint_test":
        return <SprintTestForm {...commonProps} />;
      case "yoyo_test":
        return <YoyoTestForm {...commonProps} />;
      case "endurance_test":
        return <EnduranceTestForm {...commonProps} />;
      case "technical_assessment":
        return <TechnicalAssessmentForm {...commonProps} />;
      default:
        return (
          <div className="alert alert-warning">
            <span>Tipo de test no soportado: {test.test_type}</span>
          </div>
        );
    }
  };

  return renderForm();
};

export default EditTestForm;
