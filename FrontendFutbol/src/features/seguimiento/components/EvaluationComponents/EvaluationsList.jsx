/**
 * EvaluationsList Component
 *
 * Muestra una lista de evaluaciones con opciones
 * para ver detalles, editar y eliminar
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "@/shared/hooks/useDebounce";
import {
  Edit2,
  Trash2,
  Eye,
  Plus,
  Filter,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Activity,
} from "lucide-react";
import {
  useEvaluations,
  useDeleteEvaluation,
} from "../../hooks/useEvaluations";
import { formatDate } from "@/shared/utils/dateUtils";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

const EvaluationsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [deletingEvaluation, setDeletingEvaluation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const pageSize = 10;

  // Debounce para búsqueda
  const debouncedSearch = useDebounce(searchName, 500);
  const debouncedLocation = useDebounce(filterLocation, 500);

  const { data, isLoading, error } = useEvaluations({
    page: page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    date: filterDate || undefined,
    location: debouncedLocation || undefined,
  });

  const deleteEvaluation = useDeleteEvaluation();

  // Obtener datos de la respuesta paginada
  // El backend devuelve: { status, message, data: { items, total, page, limit } }
  const paginatedData = data?.data || data || {};
  const evaluations = Array.isArray(paginatedData.items) 
    ? paginatedData.items 
    : Array.isArray(paginatedData) 
    ? paginatedData 
    : [];
  const totalCount = paginatedData.total || evaluations.length;

  // Todos los filtros se hacen en el backend
  const filteredEvaluations = evaluations;

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasActiveFilters = debouncedSearch || filterDate || debouncedLocation;

  React.useEffect(() => {
    setPage(1); // Resetear a página 1 cuando cambian los filtros
  }, [hasActiveFilters]);

  const handleDelete = (evaluation) => {
    setDeletingEvaluation(evaluation);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingEvaluation) {
      deleteEvaluation.mutate(deletingEvaluation.id);
      setIsDeleteModalOpen(false);
      setDeletingEvaluation(null);
    }
  };

  const handleClearFilters = () => {
    setSearchName("");
    setFilterDate("");
    setFilterLocation("");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className=" bg-slate-50 flex items-center justify-center">
        <div className="card bg-base-100 shadow-sm border border-base-300 p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className=" bg-slate-50 p-6">
        <div className="alert alert-error">
          <span>Error al cargar evaluaciones</span>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <ClipboardList size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Módulo de Seguimiento
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Evaluaciones
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Gestiona las evaluaciones y tests de tus atletas.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/seguimiento/evaluations/create")}
            className="gap-2"
          >
            <Plus size={16} />
            Nueva Evaluación
          </Button>
        </div>

        {/* Filters Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-primary" />
              <span className="font-medium text-base-content text-sm">
                Filtros
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda por nombre */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Nombre</span>
                </label>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="input input-bordered input-sm w-full bg-white"
                />
              </div>

              {/* Filtro por fecha */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Fecha</span>
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="input input-bordered input-sm w-full bg-white"
                />
              </div>

              {/* Búsqueda por ubicación */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs">Ubicación</span>
                </label>
                <input
                  type="text"
                  placeholder="Buscar por ubicación..."
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="input input-bordered input-sm w-full bg-white"
                />
              </div>
            </div>

            {/* Limpiar filtros */}
            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  onClick={handleClearFilters}
                  className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-base-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-6">
                    Nombre
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                    Fecha
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                    Hora
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
                    Ubicación
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pr-6">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200/60">
                {filteredEvaluations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                          <ClipboardList size={32} className="text-primary" />
                        </div>
                        <p className="text-slate-500">
                          {hasActiveFilters
                            ? "No hay evaluaciones que coincidan con los filtros"
                            : "No hay evaluaciones disponibles"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEvaluations.map((evaluation) => (
                    <tr
                      key={evaluation.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Name with icon */}
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ClipboardList size={18} className="text-primary" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {evaluation.name}
                            </span>
                            {evaluation.observations && (
                              <span className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">
                                {evaluation.observations}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Date with icon */}
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="text-slate-700 text-sm font-medium">
                            {formatDate(evaluation.date)}
                          </span>
                        </div>
                      </td>
                      {/* Time with icon */}
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span className="text-slate-700 text-sm">
                            {evaluation.time}
                          </span>
                        </div>
                      </td>
                      {/* Location with icon */}
                      <td className="py-4">
                        {evaluation.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-warning" />
                            <span className="text-slate-700 text-sm">
                              {evaluation.location}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              navigate(
                                `/seguimiento/evaluations/${evaluation.id}`
                              )
                            }
                            className="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary/10"
                          >
                            <Eye size={14} />
                            Ver
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/seguimiento/evaluations/${evaluation.id}/edit`
                              )
                            }
                            className="btn btn-ghost btn-sm btn-square text-warning hover:bg-warning/10"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(evaluation)}
                            disabled={deleteEvaluation.isPending}
                            className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 bg-base-100 px-4 py-3 rounded-xl border border-base-300">
            <div className="text-sm text-slate-500">
              Mostrando{" "}
              <span className="font-medium text-slate-900">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              a{" "}
              <span className="font-medium text-slate-900">
                {Math.min(page * pageSize, totalCount)}
              </span>{" "}
              de{" "}
              <span className="font-medium text-slate-900">
                {totalCount}
              </span>{" "}
              resultados
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-ghost"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              <div className="join">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calcular qué páginas mostrar
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  if (pageNum > totalPages || pageNum < 1) return null;
                  return (
                    <button
                      key={pageNum}
                      className={`join-item btn btn-sm ${
                        page === pageNum ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                className="btn btn-sm btn-ghost"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen && deletingEvaluation !== null}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEvaluation(null);
        }}
        title="Confirmar Eliminación"
        size="medium"
      >
        {deletingEvaluation && (
          <div className="space-y-6">
            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="bg-error/10 p-4 rounded-full">
                <Trash2 size={48} className="text-error" />
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-slate-900">
                ¿Está seguro que desea eliminar esta evaluación?
              </p>
              <div className="bg-slate-100 rounded-lg p-4 space-y-1">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Nombre:</span>{" "}
                  {deletingEvaluation.name}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Fecha:</span>{" "}
                  {formatDate(deletingEvaluation.date)}
                </p>
                {deletingEvaluation.location && (
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Ubicación:</span>{" "}
                    {deletingEvaluation.location}
                  </p>
                )}
              </div>
              <p className="text-sm text-slate-500 pt-2">
                Esta acción eliminará la evaluación y todos sus tests asociados.
              </p>
              <p className="text-sm font-semibold text-error">
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingEvaluation(null);
                }}
                className="btn btn-ghost btn-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteEvaluation.isPending}
                className="btn btn-error btn-sm gap-1"
              >
                <Trash2 size={14} />
                {deleteEvaluation.isPending ? "Eliminando..." : "Eliminar Evaluación"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EvaluationsList;
