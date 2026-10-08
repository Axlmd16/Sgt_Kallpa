/**
 * ==============================================
 * Registro Escuela (Público) - Fútbol UNL
 * ==============================================
 *
 * Página de registro de atletas menores para la escuela.
 * Layout de dos columnas: info lateral + formulario.
 * Flujo de 2 pasos: Representante → Deportista (menor).
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PublicNavbar from "@/shared/components/PublicNavbar";
import Button from "@/shared/components/Button";
import RepresentanteForm from "@/features/inscription/components/RepresentanteForm";
import DeportistaForm from "@/features/inscription/components/DeportistaForm";
import inscriptionApi from "@/features/inscription/services/inscription.api";
import { useInvalidateInscriptions } from "@/features/athletes/hooks/useInscriptions";
import { MESSAGES, ROUTES, VALIDATION } from "@/app/config/constants";
import {
  CheckCircle,
  ArrowLeft,
  Home,
  UserPlus,
  GraduationCap,
  ClipboardList,
  Phone,
  HelpCircle,
  Users,
  User,
} from "lucide-react";

const RegisterSchoolPage = () => {
  const navigate = useNavigate();
  const { invalidateAthletes, invalidateRepresentatives } =
    useInvalidateInscriptions();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [athleteName, setAthleteName] = useState("");

  const [representanteData, setRepresentanteData] = useState({});
  const [representanteErrors, setRepresentanteErrors] = useState({});
  const [lastRepLookupDni, setLastRepLookupDni] = useState(null);
  const [athleteData, setAthleteData] = useState(null);

  const stepTitle = useMemo(() => {
    if (step === 1) return "Datos del Representante";
    return "Datos del Deportista (Menor)";
  }, [step]);

  const validateRepresentante = () => {
    const errors = {};

    // DNI requerido
    if (!representanteData.dni?.trim()) {
      errors.dni = "La cédula es requerida";
    } else if (!VALIDATION.CI_PATTERN.test(representanteData.dni)) {
      errors.dni = "Ingresa una cédula válida (10 dígitos)";
    }

    // Nombres y apellidos requeridos
    if (!representanteData.first_name?.trim()) {
      errors.first_name = "Los nombres son requeridos";
    }
    if (!representanteData.last_name?.trim()) {
      errors.last_name = "Los apellidos son requeridos";
    }

    // Parentesco requerido
    if (!representanteData.relationship_type) {
      errors.relationship_type = "El parentesco es requerido";
    }

    // Email opcional pero validar formato si se proporciona
    if (
      representanteData.email?.trim() &&
      !VALIDATION.EMAIL_PATTERN.test(representanteData.email)
    ) {
      errors.email = "Ingresa un email válido";
    }

    // Teléfono opcional pero validar formato si se proporciona
    if (
      representanteData.phone?.trim() &&
      !VALIDATION.PHONE_PATTERN.test(representanteData.phone)
    ) {
      errors.phone = "Ingresa un teléfono válido (10 dígitos)";
    }

    setRepresentanteErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }
    navigate(ROUTES.REGISTER);
  };

  const handleContinueFromRepresentative = () => {
    setError(null);
    if (!validateRepresentante()) return;
    setStep(2);
  };

  // Autocompletar datos del representante si la cédula ya existe
  useEffect(() => {
    const dni = (representanteData?.dni || "").trim();
    if (dni.length !== 10 || !VALIDATION.CI_PATTERN.test(dni)) return;
    if (dni === lastRepLookupDni) return; // evitar refetch si ya se cargó

    let cancelled = false;
    const fetchRep = async () => {
      try {
        const res = await inscriptionApi.getRepresentativeByDni(dni);
        const rep = res?.data?.data || res?.data || res; // ResponseSchema<data> o payload directo
        if (!rep || cancelled) return;

        // Derivar nombres si solo viene full_name: usar último par de tokens como apellidos
        let firstName = rep.first_name || rep.firstName || "";
        let lastName = rep.last_name || rep.lastName || "";
        // Si falta cualquiera de los dos, intentar derivar desde full_name
        if ((!firstName || !lastName) && rep.full_name) {
          const parts = rep.full_name.trim().split(/\s+/);
          if (parts.length >= 4) {
            lastName = lastName || parts.slice(-2).join(" ");
            firstName = firstName || parts.slice(0, -2).join(" ");
          } else if (parts.length === 3) {
            lastName = lastName || parts.slice(-2).join(" ");
            firstName = firstName || parts[0];
          } else if (parts.length === 2) {
            if (!firstName && !lastName) {
              [firstName, lastName] = parts;
            } else if (!firstName) {
              firstName = parts[0];
            } else if (!lastName) {
              lastName = parts[1];
            }
          } else if (!firstName) {
            firstName = rep.full_name;
          }
        }

        // Parentesco: admite varios alias y normaliza a uppercase
        const relationshipRaw =
          rep.relationship_type ||
          rep.relationship_type?.value ||
          rep.relationshipType ||
          rep.relationship ||
          rep.parentesco ||
          rep.tipo_parentesco ||
          rep.relation ||
          rep.kinship ||
          rep.parentesco_nombre ||
          rep.relationship_name ||
          "";

        // Normalizar parentesco: quitar prefijos como "Relationship.", reemplazar separadores y upper-case
        const relationshipUpper = relationshipRaw
          .toString()
          .trim()
          .replace(/^RELATIONSHIP\./i, "")
          .replace(/-/g, "_")
          .replace(/\s+/g, "_")
          .toUpperCase();

        const relationship = (() => {
          if (!relationshipUpper) return "";
          if (["PADRE", "PAPA", "FATHER"].includes(relationshipUpper)) return "FATHER";
          if (["MADRE", "MAMA", "MOTHER"].includes(relationshipUpper)) return "MOTHER";
          if (["TUTOR", "LEGAL_GUARDIAN", "TUTOR_LEGAL", "TUTOR LEGAL", "ACUDIENTE"].includes(relationshipUpper))
            return "LEGAL_GUARDIAN";
          return relationshipUpper; // fallback
        })();

        // Dirección: intentar alias conocidos, si no dejar previa o vacío
        const direction =
          rep.direction ||
          rep.address ||
          rep.direccion ||
          rep.address_line ||
          rep.addressLine ||
          rep.address_line1 ||
          rep.address_line_1 ||
          rep.address_line_2 ||
          rep.address1 ||
          rep.address2 ||
          rep.residence ||
          rep.domicilio ||
          rep.dir ||
          rep.location ||
          rep.city ||
          rep.parish ||
          rep.province ||
          "";

        setRepresentanteData((prev) => ({
          ...prev,
          first_name: firstName || prev.first_name || "",
          last_name: lastName || prev.last_name || "",
          dni: rep.dni || dni,
          phone: rep.phone || prev.phone || "",
          email: rep.email || prev.email || "",
          direction: direction || prev.direction || "",
          relationship_type: relationship || prev.relationship_type || "",
        }));
        setLastRepLookupDni(dni);
        toast.success("Datos del representante cargados automáticamente");
      } catch (err) {
        // Si es 404, ignoramos; otros errores se notifican
        const status = err?.response?.status;
        if (status === 404) return;
        const msg =
          err?.response?.data?.detail || err?.message || "No se pudo verificar la cédula";
        toast.error(msg);
      }
    };

    fetchRep();
    return () => {
      cancelled = true;
    };
  }, [representanteData?.dni, lastRepLookupDni]);

  const handleSubmitSchool = async (athletePayload) => {
    setLoading(true);
    setError(null);

    // Declarar fuera del try para usarlos en el catch
    let cleanAthlete = null;
    let cleanRepresentative = null;

    try {
      // Filtrar solo los campos que el backend espera para atletas menores
      // El backend NO acepta: type_stament, type_identification (los fija internamente)
      cleanAthlete = {
        first_name: athletePayload.first_name?.trim() || "",
        last_name: athletePayload.last_name?.trim() || "",
        dni: athletePayload.dni?.trim() || "",
        birth_date: athletePayload.birth_date,
        sex: athletePayload.sex,
        height: athletePayload.height ? parseFloat(athletePayload.height) : null,
        weight: athletePayload.weight ? parseFloat(athletePayload.weight) : null,
        direction: athletePayload.direction?.trim() || "S/N",
        phone: athletePayload.phone?.trim() || "S/N",
      };

      cleanRepresentative = {
        ...representanteData,
        first_name: representanteData.first_name?.trim() || "",
        last_name: representanteData.last_name?.trim() || "",
        dni: representanteData.dni?.trim() || "",
        phone: representanteData.phone?.trim() || "",
        email: representanteData.email?.trim() || "",
        direction: representanteData.direction?.trim() || "",
      };

      if (
        cleanAthlete.dni &&
        cleanRepresentative.dni &&
        cleanAthlete.dni === cleanRepresentative.dni
      ) {
        throw new Error(
          "La cédula del deportista y del representante no pueden ser la misma. Usa datos distintos."
        );
      }

      setAthleteData(cleanAthlete);

      await inscriptionApi.registerMenor({
        athlete: cleanAthlete,
        representative: cleanRepresentative,
      });

      setAthleteName(
        `${athletePayload.first_name} ${athletePayload.last_name}`
      );

      toast.success("¡Registro exitoso!", {
        description: "El deportista ha sido registrado correctamente.",
      });

      // Invalidar cache para que aparezcan los nuevos datos
      invalidateAthletes();
      invalidateRepresentatives();

      setRegistrationSuccess(true);
    } catch (err) {
      let errorMessage =
        err?.response?.data?.detail || err?.message || MESSAGES.ERROR.GENERIC;

      // Si el backend rechaza porque la cédula del representante ya existe como deportista
      if (
        cleanRepresentative?.dni &&
        typeof errorMessage === "string" &&
        errorMessage.includes(cleanRepresentative.dni)
      ) {
        errorMessage =
          "La cédula del representante ya está registrada como deportista. Usa otro representante o una cédula distinta.";
      }
      toast.error("Error en el registro", {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PANTALLA DE ÉXITO (Simplificada)
  // ==========================================
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-base-200">
        <PublicNavbar />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
              <div className="bg-success py-8 px-6">
                <div className="flex flex-col items-center text-success-content">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h1 className="text-2xl font-bold text-center">
                    ¡Registro Exitoso!
                  </h1>
                </div>
              </div>

              <div className="card-body p-6">
                <p className="text-lg text-center text-base-content mb-6">
                  <span className="font-bold text-primary">{athleteName}</span>{" "}
                  ha sido registrado correctamente.
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.LANDING)}
                    className="w-full"
                  >
                    <Home className="w-4 h-4" />
                    Volver al inicio
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setRegistrationSuccess(false);
                      setAthleteName("");
                      setStep(1);
                      setRepresentanteData({});
                      setAthleteData(null);
                    }}
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4" />
                    Registrar otro deportista
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // FORMULARIO DE REGISTRO (Layout 2 columnas)
  // ==========================================
  return (
    <div className="min-h-screen bg-base-200">
      <PublicNavbar />

      <main className="container mx-auto px-4 py-4">
        {/* Botón volver */}
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1 text-base-content/60 hover:text-primary transition-colors text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? "Volver a opciones" : "Volver al paso anterior"}
        </button>

        {/* Layout de dos columnas */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* ========== PANEL LATERAL IZQUIERDO ========== */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-4 space-y-4">
              {/* Card de información */}
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                    <h2 className="font-bold text-base-content">
                      Registro Escuela
                    </h2>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Inscribe a tu hijo/a en la Escuela de Fútbol de la UNL.
                    Formación deportiva de calidad.
                  </p>
                </div>
              </div>

              {/* Stepper vertical dinámico */}
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body p-4">
                  <h3 className="text-sm font-semibold text-base-content mb-3">
                    Proceso de registro
                  </h3>
                  <ul className="steps steps-vertical text-xs">
                    <li
                      className={`step ${step >= 1 ? "step-primary" : ""}`}
                      data-content={step > 1 ? "✓" : "1"}
                    >
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Representante
                      </div>
                    </li>
                    <li
                      className={`step ${step >= 2 ? "step-primary" : ""}`}
                      data-content="2"
                    >
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Deportista
                      </div>
                    </li>
                    <li className="step" data-content="3">
                      ¡Listo!
                    </li>
                  </ul>
                </div>
              </div>

              {/* Indicador de paso actual */}
              <div className="card bg-primary/10 border border-primary/20">
                <div className="card-body p-4">
                  <p className="text-xs font-medium text-primary">
                    Paso {step} de 2
                  </p>
                  <p className="text-sm font-semibold text-base-content">
                    {stepTitle}
                  </p>
                </div>
              </div>

              {/* Info de campos obligatorios */}
              <div className="card bg-info/10 border border-info/20">
                <div className="card-body p-4">
                  <div className="flex items-start gap-2">
                    <ClipboardList className="w-4 h-4 text-info mt-0.5 shrink-0" />
                    <p className="text-xs text-base-content/70">
                      Los campos marcados con{" "}
                      <span className="text-error font-bold">*</span> son
                      obligatorios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ayuda */}
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-base-content/60" />
                    <h3 className="text-sm font-semibold text-base-content">
                      ¿Necesitas ayuda?
                    </h3>
                  </div>
                  <p className="text-xs text-base-content/60 mb-2">
                    Contacta al equipo de soporte.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Phone className="w-3 h-3" />
                    <span>07 123 4567</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ========== FORMULARIO (DERECHA) ========== */}
          <div className="flex-1">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 lg:p-6">
                {/* Mostrar error global si existe */}
                {error && (
                  <div className="alert alert-error mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* PASO 1: Formulario de Representante */}
                {step === 1 && (
                  <>
                    <RepresentanteForm
                      initialData={representanteData}
                      onChange={(data) => {
                        setRepresentanteData(data);
                        if (Object.keys(representanteErrors).length)
                          setRepresentanteErrors({});
                      }}
                      errors={representanteErrors}
                      disabled={loading}
                    />

                    <div className="divider"></div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => navigate(ROUTES.REGISTER)}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleContinueFromRepresentative}
                        disabled={loading}
                      >
                        Continuar al paso 2
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Button>
                    </div>
                  </>
                )}

                {/* PASO 2: Formulario de Deportista (menor) */}
                {step === 2 && (
                  <DeportistaForm
                    initialData={athleteData}
                    onSubmit={handleSubmitSchool}
                    onCancel={goBack}
                    loading={loading}
                    error={error}
                    isMenor
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterSchoolPage;
