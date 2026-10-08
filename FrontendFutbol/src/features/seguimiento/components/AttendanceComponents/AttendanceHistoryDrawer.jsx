import React from "react";
import PropTypes from "prop-types";
import { X, Calendar, ChevronRight } from "lucide-react";

/**
 * Drawer para mostrar el historial de fechas de asistencia.
 */
function HistoryDrawer({
  isOpen,
  onClose,
  dates = [],
  onSelectDate,
  selectedDate,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col h-full border-l border-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-lg text-slate-800">Historial</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {dates.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No hay registros anteriores.
            </div>
          ) : (
            dates.map((date) => (
              <button
                key={date}
                onClick={() => {
                  onSelectDate(date);
                  onClose();
                }}
                className={`
                            w-full flex items-center justify-between p-3 rounded-xl text-left transition-all border
                            ${
                              selectedDate === date
                                ? "bg-primary text-primary-content border-primary shadow-md shadow-primary/20"
                                : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                            }
                        `}
              >
                <div className="flex items-center gap-3">
                  <Calendar
                    size={18}
                    className={
                      selectedDate === date
                        ? "text-primary-content"
                        : "text-slate-400"
                    }
                  />
                  <span className="font-medium text-sm">
                    {new Date(date + "T00:00:00").toLocaleDateString("es-EC", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {selectedDate === date && <ChevronRight size={16} />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

HistoryDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dates: PropTypes.arrayOf(PropTypes.string),
  onSelectDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.string,
};

export default HistoryDrawer;
