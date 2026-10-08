/**
 * Modal de Búsqueda de Atletas
 *
 * Permite buscar y seleccionar un atleta por nombre, apellido o DNI.
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, User, Check } from "lucide-react";

const AthleteSearchModal = ({
  isOpen,
  onClose,
  athletes = [],
  onSelect,
  selectedAthleteId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  // Focus en el input al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // Limpiar búsqueda al cerrar
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filtrar atletas por búsqueda
  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) {
      return athletes;
    }

    const query = searchQuery.toLowerCase().trim();
    return athletes.filter((athlete) => {
      const fullName = (athlete.full_name || "").toLowerCase();
      const dni = (athlete.dni || "").toLowerCase();
      return fullName.includes(query) || dni.includes(query);
    });
  }, [athletes, searchQuery]);

  const handleSelect = (athlete) => {
    onSelect(athlete);
    onClose();
  };

  const handleClearSelection = () => {
    onSelect(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Buscar Deportista</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={18} />
          </button>
        </div>

        {/* Buscador */}
        <div className="form-control mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
              size={18}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Opción: Todos los deportistas */}
        <button
          onClick={handleClearSelection}
          className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
            !selectedAthleteId
              ? "bg-primary/10 border border-primary"
              : "hover:bg-base-200 border border-transparent"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
            <User size={20} className="text-base-content/60" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Todos los deportistas</p>
            <p className="text-xs text-base-content/60">
              No filtrar por deportista específico
            </p>
          </div>
          {!selectedAthleteId && <Check className="text-primary" size={20} />}
        </button>

        {/* Lista de resultados */}
        <div className="divider my-2 text-xs">
          {filteredAthletes.length} deportista
          {filteredAthletes.length !== 1 ? "s" : ""} encontrado
          {filteredAthletes.length !== 1 ? "s" : ""}
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {filteredAthletes.length === 0 ? (
            <div className="text-center py-8 text-base-content/50">
              <User className="mx-auto mb-2" size={32} />
              <p>No se encontraron deportistas</p>
            </div>
          ) : (
            filteredAthletes.map((athlete) => {
              const isSelected = selectedAthleteId === String(athlete.id);
              return (
                <button
                  key={athlete.id}
                  onClick={() => handleSelect(athlete)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-base-200 border border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="avatar placeholder">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary">
                      <span className="text-sm font-bold">
                        {(athlete.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate">{athlete.full_name}</p>
                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                      <span>DNI: {athlete.dni || "N/A"}</span>
                      <span className="badge badge-xs badge-ghost">
                        {athlete.type_athlete || "Sin tipo"}
                      </span>
                    </div>
                  </div>

                  {/* Check si seleccionado */}
                  {isSelected && (
                    <Check className="text-primary shrink-0" size={20} />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default AthleteSearchModal;
