/**
 * EditRepresentativePage - Página para editar un representante
 * Usa RepresentanteForm en modo edición y TanStack Query para cache
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Loader from "@/shared/components/Loader";
import RepresentanteForm from "@/features/inscription/components/RepresentanteForm";
import representativesApi from "@/features/athletes/services/representatives.api";
import {
  useRepresentativeDetail,
  useInvalidateInscriptions,
} from "@/features/athletes/hooks/useInscriptions";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { ArrowLeft, UserCog, AlertCircle } from "lucide-react";

const EditRepresentativePage = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { invalidateRepresentatives } = useInvalidateInscriptions();

  // Usar TanStack Query para cache (5 min staleTime)
  const {
    data: representative,
    isLoading: loading,
    error: fetchError,
  } = useRepresentativeDetail(id);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);

    try {
      await representativesApi.update(id, formData);
      toast.success("Representante actualizado", {
        description: "Los datos se guardaron correctamente.",
      });
      invalidateRepresentatives();
      navigate(ROUTES.INSCRIPTION);
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error("Error al actualizar", {
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.INSCRIPTION);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  // Not found state
  if ((!representative && !loading) || fetchError) {
    return (
      <div className="space-y-6 p-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 text-base-content/60 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Volver a la lista</span>
        </button>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body items-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-error" />
            </div>
            <h2 className="text-xl font-bold text-base-content">
              Representante no encontrado
            </h2>
            <p className="text-base-content/60 max-w-sm">
              {fetchError?.message ||
                error ||
                "El representante que buscas no existe o fue eliminado."}
            </p>
            <button
              onClick={handleCancel}
              className="btn btn-primary btn-sm mt-4"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-secondary/5 to-transparent pointer-events-none" />

      <div className="px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a la lista
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-secondary mb-2">
            <span className="bg-secondary/10 p-1.5 rounded-md">
              <UserCog size={16} />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Editar Representante
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {representative?.full_name}
          </h1>
          <p className="text-slate-500 text-sm">
            Modifica los datos del representante legal.
          </p>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-6">
            <RepresentanteForm
              initialData={representative}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={saving}
              error={error}
              isEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRepresentativePage;
