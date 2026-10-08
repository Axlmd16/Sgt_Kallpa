import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import athletesApi from "@/features/athletes/services/athletes.api";
import { useInvalidateInscriptions } from "@/features/athletes/hooks/useInscriptions";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { ArrowLeft, UserPlus } from "lucide-react";

const CreateAthletePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { invalidateAthletes } = useInvalidateInscriptions();

  const handleSubmit = async (athleteData) => {
    setLoading(true);
    setError(null);

    try {
      await athletesApi.create(athleteData);
      toast.success(MESSAGES.SUCCESS.ATHLETE_CREATED, {
        description: MESSAGES.SUCCESS.ATHLETE_CREATED_DESC,
      });
      // Invalidar cache para que aparezca el nuevo deportista
      invalidateAthletes();
      navigate(ROUTES.INSCRIPTION);
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(MESSAGES.ERROR.ATHLETE_CREATE, {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.INSCRIPTION);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a la lista
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="bg-primary/10 p-1 rounded-md">
              <UserPlus size={14} />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Nuevo Deportista
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Registrar Deportista
          </h1>
          <p className="text-slate-500 text-sm">
            Completa el formulario para agregar un nuevo deportista.
          </p>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <DeportistaForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              error={error}
              isMenor={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAthletePage;
