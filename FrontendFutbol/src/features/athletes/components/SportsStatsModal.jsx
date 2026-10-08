/**
 * SportsStatsModal
 * Modal para editar estadísticas deportivas de un atleta
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import { Trophy, Target, Award, AlertTriangle } from "lucide-react";

const SportsStatsModal = ({
  isOpen,
  onClose,
  onSave,
  stats = {},
  athleteName = "",
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    matches_played: 0,
    goals: 0,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
  });

  // Sincronizar con stats cuando cambia
  useEffect(() => {
    if (stats) {
      setFormData({
        matches_played: stats.matches_played || 0,
        goals: stats.goals || 0,
        assists: stats.assists || 0,
        yellow_cards: stats.yellow_cards || 0,
        red_cards: stats.red_cards || 0,
      });
    }
  }, [stats]);

  const handleChange = (field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Estadísticas Deportivas"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Info del atleta */}
        <div className="bg-info/10 rounded-lg p-3 flex items-center gap-2">
          <Trophy size={18} className="text-info" />
          <span className="text-sm">
            Editando estadísticas de <strong>{athleteName}</strong>
          </span>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-2 gap-4">
          {/* Partidos jugados */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium flex items-center gap-1">
                <Target size={14} className="text-primary" />
                Partidos jugados
              </span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.matches_played}
              onChange={(e) => handleChange("matches_played", e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>

          {/* Goles */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium flex items-center gap-1">
                <Award size={14} className="text-success" />
                Goles
              </span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.goals}
              onChange={(e) => handleChange("goals", e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>

          {/* Asistencias */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium flex items-center gap-1">
                <Target size={14} className="text-info" />
                Asistencias
              </span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.assists}
              onChange={(e) => handleChange("assists", e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>

          {/* Tarjetas amarillas */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium flex items-center gap-1">
                <AlertTriangle size={14} className="text-warning" />
                Tarjetas amarillas
              </span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.yellow_cards}
              onChange={(e) => handleChange("yellow_cards", e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>

          {/* Tarjetas rojas */}
          <div className="form-control col-span-2 sm:col-span-1">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium flex items-center gap-1">
                <AlertTriangle size={14} className="text-error" />
                Tarjetas rojas
              </span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.red_cards}
              onChange={(e) => handleChange("red_cards", e.target.value)}
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};

SportsStatsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    matches_played: PropTypes.number,
    goals: PropTypes.number,
    assists: PropTypes.number,
    yellow_cards: PropTypes.number,
    red_cards: PropTypes.number,
  }),
  athleteName: PropTypes.string,
  loading: PropTypes.bool,
};

export default SportsStatsModal;
