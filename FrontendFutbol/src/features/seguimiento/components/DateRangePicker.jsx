/**
 * Componente Selector de Rango de Fechas
 *
 * Permite seleccionar un rango de fechas para filtrar reportes.
 */

import { useState } from "react";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

const DateRangePicker = ({ onDateRangeChange, disabled = false }) => {
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });

  const handleDateChange = (field, value) => {
    const newRange = { ...dateRange, [field]: value };

    // 1. Validar primero
    if (newRange.start_date && newRange.end_date) {
      if (new Date(newRange.start_date) > new Date(newRange.end_date)) {
        toast.error("Rango de fechas inválido");
        
        // 2. Limpiar el estado para que no se quede la fecha mala escrita
        setDateRange({ ...newRange, [field]: "" }); 
        return;
      }
    }

    // 3. Si pasó la validación, entonces guardamos y avisamos al padre
    setDateRange(newRange);
    
    if (newRange.start_date && newRange.end_date) {
      onDateRangeChange(newRange);
    } else if (!newRange.start_date && !newRange.end_date) {
      onDateRangeChange({ start_date: "", end_date: "" });
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-primary" />
          <span className="font-medium text-base-content text-sm">
            Rango de Fechas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Fecha</span>
            </label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => handleDateChange("start_date", e.target.value)}
              disabled={disabled}
              className="input input-bordered input-sm w-full bg-base-100"
            />
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-xs">Hasta</span>
            </label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => handleDateChange("end_date", e.target.value)}
              disabled={disabled}
              className="input input-bordered input-sm w-full bg-base-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
