/**
 * StatsHelpModal
 * Modal que explica cómo se calculan las estadísticas de rendimiento
 */

import PropTypes from "prop-types";
import Modal from "@/shared/components/Modal";
import { HelpCircle, Zap, Heart, Target } from "lucide-react";
import { PERFORMANCE_SCALE } from "@/shared/utils/performanceUtils";

const StatsHelpModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="¿Cómo se calculan las estadísticas?"
    >
      <div className="space-y-6">
        {/* Intro */}
        <div className="bg-info/10 rounded-lg p-4">
          <p className="text-sm">
            Las estadísticas físicas están{" "}
            <strong>normalizadas en una escala de 0 a 100</strong>. Son índices
            de rendimiento calculados a partir de pruebas físicas reales.
          </p>
        </div>

        {/* Scale Table */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <HelpCircle size={16} className="text-primary" />
            Escala de Rendimiento
          </h4>
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="text-base-content/60">
                  <th>Rango</th>
                  <th>Nivel</th>
                  <th>Indicador</th>
                </tr>
              </thead>
              <tbody>
                {PERFORMANCE_SCALE.map((item) => (
                  <tr key={item.level}>
                    <td className="font-mono">
                      {item.min} - {item.max}
                    </td>
                    <td className="font-medium">{item.level}</td>
                    <td>
                      <span className={`badge badge-${item.color} badge-sm`}>
                        {item.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Explanation */}
        <div>
          <h4 className="font-semibold mb-3">Estadísticas Físicas</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
              <Zap size={20} className="text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Velocidad</p>
                <p className="text-xs text-base-content/60">
                  Basada en tests de sprint. Menor tiempo = mayor puntuación.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
              <Heart size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Resistencia</p>
                <p className="text-xs text-base-content/60">
                  Basada en tests YoYo y de resistencia. Mayor distancia = mayor
                  puntuación.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
              <Target size={20} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Agilidad</p>
                <p className="text-xs text-base-content/60">
                  Basada en evaluaciones técnicas y de coordinación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-base-200/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-sm">Ejemplos</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            <li>
              • Velocidad <strong>85</strong> →{" "}
              <span className="text-success">Excelente</span>
            </li>
            <li>
              • Resistencia <strong>65</strong> →{" "}
              <span className="text-info">Bueno</span>
            </li>
            <li>
              • Agilidad <strong>45</strong> →{" "}
              <span className="text-warning">Regular</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

StatsHelpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatsHelpModal;
