/**
 * RepresentanteForm - Formulario de datos del representante
 * Soporta modo creación (embebido con onChange) y modo edición (standalone con onSubmit)
 * Similar a UserForm en estilo y funcionalidad
 */

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { Users, Phone, Save } from "lucide-react";
import { RELATIONSHIP_TYPE_OPTIONS, VALIDATION } from "@/app/config/constants";

const RepresentanteForm = ({
  initialData = null,
  onChange,
  onSubmit,
  onCancel,
  errors: externalErrors = {},
  disabled = false,
  loading = false,
  error = null,
  isEdit = false,
}) => {
  // Ref para evitar llamar onChange en el primer render
  const isFirstRender = useRef(true);

  // Normalizar relationship_type a uppercase para el select
  const normalizedRelationshipType = useMemo(() => {
    const raw = (initialData?.relationship_type ?? "").toString().trim();
    if (!raw) return "";
    return raw.toUpperCase();
  }, [initialData?.relationship_type]);

  // Valores por defecto
  const defaultValues = useMemo(
    () => ({
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      dni: initialData?.dni || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      direction: initialData?.direction || "",
      relationship_type: normalizedRelationshipType || "",
    }),
    [initialData, normalizedRelationshipType]
  );

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  // Sincronizar con datos externos (solo cuando initialData cambia desde afuera)
  useEffect(() => {
    if (initialData) {
      reset(defaultValues);
    }
  }, [initialData, defaultValues, reset]);

  // Actualizar valores sin reset completo cuando llegan campos nuevos (para autocompletar)
  useEffect(() => {
    if (!initialData) return;
    Object.entries(defaultValues).forEach(([key, val]) => {
      if (val !== undefined) setValue(key, val);
    });
  }, [defaultValues, initialData, setValue]);

  // Suscribirse a cambios del formulario usando watch callback (solo en modo no-edición)
  useEffect(() => {
    if (isEdit) return; // En modo edición no usamos onChange

    const subscription = watch((data) => {
      // Evitar el primer render para no causar loop
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (onChange) {
        onChange(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange, isEdit]);

  // Handler para submit en modo edición
  const onValidSubmit = (data) => {
    if (onSubmit) {
      // No enviar DNI en edición (no es editable)
      const dataToSubmit = { ...data };
      if (isEdit) {
        delete dataToSubmit.dni;
      }
      onSubmit(dataToSubmit);
    }
  };

  // Header de sección
  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="pb-3 border-b border-base-300">
      <div className="flex items-center gap-2 text-base-content">
        <Icon className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {subtitle && (
        <p className="text-sm text-base-content/60 mt-1 ml-7">{subtitle}</p>
      )}
    </div>
  );

  // Combinar errores internos y externos
  const getError = (field) =>
    errors[field]?.message || externalErrors[field] || null;

  // Contenido del formulario (compartido entre ambos modos)
  const formContent = (
    <div className="space-y-6">
      {/* Error del servidor */}
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ==================== SECCIÓN: DATOS DEL REPRESENTANTE ==================== */}
      <SectionHeader
        icon={Users}
        title="Datos del Representante"
        subtitle={
          isEdit
            ? "Modifica la información del representante legal."
            : "Información del padre, madre o tutor legal del deportista menor de edad."
        }
      />

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
        {/* DNI - Solo editable en modo creación */}
        {isEdit ? (
          <div className="flex flex-col">
            <label className="py-0.5">
              <span className="label-text text-xs font-medium text-slate-600">
                Cédula del Representante
              </span>
            </label>
            <div className="flex items-center gap-2 h-8 px-3 bg-base-200 rounded-lg border border-base-300">
              <span className="font-mono text-sm">{initialData?.dni}</span>
              <span className="text-xs text-base-content/50">
                (No editable)
              </span>
            </div>
          </div>
        ) : (
          <Input
            label="Cédula del Representante"
            type="text"
            placeholder="1234567890"
            error={getError("dni")}
            disabled={disabled || loading}
            required
            maxLength={10}
            inputMode="numeric"
            {...register("dni", {
              required: "La cédula es requerida",
              pattern: {
                value: VALIDATION.CI_PATTERN,
                message: "Ingresa una cédula válida (10 dígitos)",
              },
            })}
          />
        )}

        {/* Nombres */}
        <Input
          label="Nombres"
          type="text"
          placeholder="Ej: María Elena"
          error={getError("first_name")}
          disabled={disabled || loading}
          required
          {...register("first_name", {
            required: "Los nombres son requeridos",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
          })}
        />

        {/* Apellidos */}
        <Input
          label="Apellidos"
          type="text"
          placeholder="Ej: García López"
          error={getError("last_name")}
          disabled={disabled || loading}
          required
          {...register("last_name", {
            required: "Los apellidos son requeridos",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
          })}
        />

        {/* Parentesco */}
        <div className="flex flex-col">
          <label className="py-0.5">
            <span className="label-text text-xs font-medium text-slate-600">
              Parentesco <span className="text-error">*</span>
            </span>
          </label>
          <select
            className={`select w-full select-sm select-bordered bg-white ${
              getError("relationship_type") ? "select-error" : ""
            }`}
            disabled={disabled || loading}
            {...register("relationship_type", {
              required: "El parentesco es requerido",
            })}
          >
            <option value="">Seleccionar...</option>
            {RELATIONSHIP_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {getError("relationship_type") && (
            <span className="text-error text-xs mt-1">
              {getError("relationship_type")}
            </span>
          )}
        </div>

        {/* Teléfono */}
        <Input
          label="Teléfono"
          type="tel"
          placeholder="Ej: 0987654321"
          error={getError("phone")}
          disabled={disabled || loading}
          maxLength={10}
          inputMode="numeric"
          {...register("phone", {
            pattern: {
              value: /^0[0-9]{9}$/,
              message: "El teléfono debe tener 10 dígitos y empezar con 0",
            },
          })}
        />

        {/* Email */}
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="Ej: representante@email.com"
          error={getError("email")}
          disabled={disabled || loading}
          {...register("email", {
            pattern: {
              value: VALIDATION.EMAIL_PATTERN,
              message: "Ingresa un email válido",
            },
          })}
        />

        {/* Dirección - ocupa más espacio */}
        <div className="md:col-span-2 lg:col-span-3">
          <Input
            label="Dirección"
            type="text"
            placeholder="Ej: Av. Principal #123, Barrio Centro, Ciudad"
            error={getError("direction")}
            disabled={disabled || loading}
            {...register("direction")}
          />
        </div>
      </div>

      {/* ==================== SECCIÓN: INFORMACIÓN IMPORTANTE (solo en modo creación) ==================== */}
      {!isEdit && (
        <>
          <div className="pb-3 border-b border-base-300 pt-2">
            <div className="flex items-center gap-2 text-base-content">
              <Phone className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold text-lg">Información Importante</h3>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="alert alert-info text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <p className="font-medium">Importante:</p>
              <p>
                El representante será el contacto principal para todas las
                comunicaciones relacionadas con el deportista y deberá autorizar
                su participación en actividades y competencias.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Botones (solo en modo edición) */}
      {isEdit && (
        <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save size={16} />
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  );

  // En modo edición envolvemos con form, sino solo retornamos el contenido
  if (isEdit) {
    return (
      <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
        {formContent}
      </form>
    );
  }

  return formContent;
};

RepresentanteForm.propTypes = {
  initialData: PropTypes.object,
  onChange: PropTypes.func, // Requerido en modo creación
  onSubmit: PropTypes.func, // Requerido en modo edición
  onCancel: PropTypes.func, // Requerido en modo edición
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
  isEdit: PropTypes.bool,
};

export default RepresentanteForm;
