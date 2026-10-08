import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { ROLE_OPTIONS } from "@/app/config/roles";
import { VALIDATION } from "@/app/config/constants";
import { useForm, useWatch } from "react-hook-form";
import { TYPE_IDENTIFICATION_OPTIONS } from "../../../app/config/constants";
import { TYPE_STAMENT_OPTIONS } from "../../../app/config/constants";
import { User, MapPin, Shield, Phone, Mail, Check, X } from "lucide-react";

// Componente para mostrar la fortaleza de la contraseña
const PasswordStrengthIndicator = ({ password }) => {
  const checks = [
    { label: "8+", valid: password.length >= 8 },
    { label: "A-Z", valid: /[A-Z]/.test(password) },
    { label: "a-z", valid: /[a-z]/.test(password) },
    { label: "0-9", valid: /[0-9]/.test(password) },
    { label: "!@#", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const strength = checks.filter((c) => c.valid).length;
  const strengthColors = {
    0: "bg-slate-200",
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-lime-500",
    5: "bg-green-500",
  };

  return (
    <div className="space-y-1">
      {/* Barra de progreso */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 w-6 rounded-full transition-colors ${
              i <= strength ? strengthColors[strength] : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      {/* Lista de requisitos compacta */}
      <div className="flex gap-1.5 text-[9px]">
        {checks.map((check) => (
          <span
            key={check.label}
            className={`flex items-center ${
              check.valid ? "text-green-600" : "text-slate-400"
            }`}
          >
            {check.valid ? <Check size={8} /> : <X size={8} />}
            {check.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// Componente para encabezados de sección
// eslint-disable-next-line no-unused-vars
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-base-200">
    <div className="bg-primary/10 p-1 rounded-md">
      <Icon size={12} className="text-primary" />
    </div>
    <h3 className="text-xs font-semibold text-slate-700">{title}</h3>
  </div>
);

const UserForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const defaultRole = ROLE_OPTIONS?.[0]?.value ?? "Administrador";
  const defaultTypeId = TYPE_IDENTIFICATION_OPTIONS?.[0]?.value ?? "dni";
  const defaultTypeStament = TYPE_STAMENT_OPTIONS?.[0]?.value ?? "estudiante";

  const normalizedTypeIdentification = useMemo(() => {
    const raw = (initialData?.type_identification ?? "").toString().trim();
    const upper = raw.toUpperCase();
    if (upper === "CEDULA") return "dni";
    if (upper === "PASSPORT") return "passport";
    if (upper === "RUC") return "ruc";

    const lower = raw.toLowerCase();
    if (["dni", "passport", "ruc"].includes(lower)) return lower;

    return "";
  }, [initialData?.type_identification]);

  const normalizedTypeStament = useMemo(() => {
    const raw = (initialData?.type_stament ?? "").toString().trim();
    const lower = raw.toLowerCase();
    if (
      [
        "administrativos",
        "docentes",
        "estudiantes",
        "trabajadores",
        "externos",
      ].includes(lower)
    ) {
      return lower;
    }
    return "";
  }, [initialData?.type_stament]);

  const defaultValues = useMemo(
    () => ({
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      dni: initialData?.dni || "",
      password: "",
      passwordConfirmation: "",
      role: initialData?.role || defaultRole,
      type_identification:
        normalizedTypeIdentification ||
        initialData?.type_identification ||
        defaultTypeId,
      type_stament:
        normalizedTypeStament ||
        initialData?.type_stament ||
        defaultTypeStament,
      direction: initialData?.direction || "",
      phone: initialData?.phone || "",
    }),
    [
      defaultRole,
      defaultTypeId,
      defaultTypeStament,
      initialData,
      normalizedTypeIdentification,
      normalizedTypeStament,
    ],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const password = useWatch({ control, name: "password" });
  const typeIdentification = useWatch({ control, name: "type_identification" });

  const identificationRules = useMemo(() => {
    // Valores esperados en el frontend: dni | ruc | passport
    switch (typeIdentification) {
      case "ruc":
        return {
          label: "RUC",
          min: 13,
          max: 13,
          inputMode: "numeric",
          maxLength: 13,
          placeholder: "13 dígitos",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (!/^\d{13}$/.test(v))
              return "El RUC debe tener exactamente 13 dígitos";
            return true;
          },
        };
      case "passport":
        return {
          label: "Pasaporte",
          min: 6,
          max: 15,
          inputMode: "text",
          maxLength: 15,
          placeholder: "6–15 caracteres",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (v.length < 6 || v.length > 15) {
              return "El pasaporte debe tener entre 6 y 15 caracteres";
            }
            if (!/^[A-Za-z0-9]+$/.test(v)) {
              return "El pasaporte solo permite caracteres alfanuméricos";
            }
            return true;
          },
        };
      case "dni":
      default:
        return {
          label: "Cédula",
          min: 10,
          max: 10,
          inputMode: "numeric",
          maxLength: 10,
          placeholder: "10 dígitos",
          validate: (value) => {
            const v = (value ?? "").toString().trim();
            if (!/^\d{10}$/.test(v))
              return "La cédula debe tener exactamente 10 dígitos";
            return true;
          },
        };
    }
  }, [typeIdentification]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onValidSubmit = (data) => {
    const dataToSubmit = { ...data };

    // Campo solo de UI (confirmación), nunca se envía al backend
    delete dataToSubmit.passwordConfirmation;

    // En edición, omitir campos que no se pueden modificar
    if (isEdit) {
      delete dataToSubmit.dni;
      delete dataToSubmit.type_identification;
      delete dataToSubmit.email;
      delete dataToSubmit.role;

      // También omitir contraseña si está vacía
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }
    }

    onSubmit(dataToSubmit);
  };

  // ==============================================
  // RENDER
  // ==============================================

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="space-y-4"
      noValidate
    >
      {/* Sección: Datos Personales */}
      <div>
        <SectionHeader icon={User} title="Datos Personales" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Nombres */}
          <Input
            label="Nombres"
            type="text"
            name="first_name"
            placeholder="Ej: Juan Carlos"
            error={errors.first_name?.message}
            disabled={loading}
            required
            {...register("first_name", {
              required: "El nombre es requerido",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
          />

          {/* Apellidos */}
          <Input
            label="Apellidos"
            type="text"
            name="last_name"
            placeholder="Ej: Pérez García"
            error={errors.last_name?.message}
            disabled={loading}
            required
            {...register("last_name", {
              required: "El apellido es requerido",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
          />

          {/* Tipo de identificacion */}
          <div>
            <label className="label py-0.5">
              <span className="label-text text-xs font-medium text-slate-600">
                Tipo de identificación <span className="text-error">*</span>
              </span>
            </label>
            <select
              {...register("type_identification", {
                required: "Selecciona un tipo de identificación",
              })}
              disabled={loading || isEdit}
              className={`select select-bordered select-sm w-full ${isEdit ? "bg-slate-100 text-slate-600 cursor-not-allowed" : "bg-white"}`}
            >
              {TYPE_IDENTIFICATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.type_identification?.message ? (
              <p className="mt-1 text-xs text-error">
                {errors.type_identification.message}
              </p>
            ) : null}
            {isEdit && (
              <p className="text-xs text-slate-500 mt-1">
                Este campo no se puede modificar
              </p>
            )}
          </div>

          {/* Dni (Obligatorio) */}
          <div>
            <Input
              label="Número de identificación"
              type="text"
              name="dni"
              placeholder={identificationRules.placeholder}
              error={errors.dni?.message}
              disabled={loading || isEdit}
              required={!isEdit}
              inputMode={identificationRules.inputMode}
              maxLength={identificationRules.maxLength}
              {...register("dni", {
                required: !isEdit && "El número de identificación es requerido",
                validate: !isEdit ? identificationRules.validate : undefined,
              })}
            />
            {isEdit && (
              <p className="text-xs text-slate-500 mt-1">
                Este campo no se puede modificar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sección: Información de Contacto */}
      <div>
        <SectionHeader icon={MapPin} title="Información de Contacto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Email */}
          <div>
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              placeholder="usuario@unl.edu.ec"
              error={errors.email?.message}
              disabled={loading || isEdit}
              required={!isEdit}
              icon={<Mail size={14} className="text-slate-400" />}
              {...register("email", {
                required: !isEdit && "El email es requerido",
                pattern: !isEdit
                  ? {
                      value: VALIDATION.EMAIL_PATTERN,
                      message: "Ingresa un email válido",
                    }
                  : undefined,
              })}
            />
            {isEdit && (
              <p className="text-xs text-slate-500 mt-1">
                Este campo no se puede modificar
              </p>
            )}
          </div>

          {/* Teléfono (Opcional) */}
          <Input
            label="Teléfono"
            type="text"
            name="phone"
            placeholder="10 dígitos"
            error={errors.phone?.message}
            disabled={loading}
            inputMode="numeric"
            maxLength={10}
            icon={<Phone size={14} className="text-slate-400" />}
            {...register("phone", {
              validate: (value) => {
                const v = (value ?? "").toString().trim();
                if (!v) return true;
                if (!/^\d{10}$/.test(v))
                  return "El teléfono debe tener exactamente 10 dígitos";
                return true;
              },
            })}
          />

          {/* Dirección (Opcional) - Full width */}
          <div className="md:col-span-2">
            <Input
              label="Dirección"
              type="text"
              name="direction"
              placeholder="Av. Siempre Viva 123, Ciudad"
              error={errors.direction?.message}
              disabled={loading}
              {...register("direction")}
              icon={<MapPin size={14} className="text-slate-400" />}
            />
          </div>
        </div>
      </div>

      {/* Sección: Acceso y Rol */}
      <div>
        <SectionHeader icon={Shield} title="Acceso y Rol" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Tipo de estamento */}
          <div>
            <label className="label py-0.5">
              <span className="label-text text-xs font-medium text-slate-600">
                Estamento <span className="text-error">*</span>
              </span>
            </label>
            <select
              {...register("type_stament", {
                required: "Selecciona un estamento",
              })}
              disabled={loading}
              className="select select-bordered select-sm w-full bg-white"
            >
              {TYPE_STAMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.type_stament?.message ? (
              <p className="mt-1 text-xs text-error">
                {errors.type_stament.message}
              </p>
            ) : null}
          </div>

          {/* Rol */}
          <div>
            <label className="label py-0.5">
              <span className="label-text text-xs font-medium text-slate-600">
                Rol <span className="text-error">*</span>
              </span>
            </label>
            <select
              {...register("role", { required: "Selecciona un rol" })}
              disabled={loading || isEdit}
              className={`select select-bordered select-sm w-full ${isEdit ? "bg-slate-100 text-slate-600 cursor-not-allowed" : "bg-white"}`}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.role?.message ? (
              <p className="mt-1 text-xs text-error">{errors.role.message}</p>
            ) : null}
            {isEdit && (
              <p className="text-xs text-slate-500 mt-1">
                Este campo no se puede modificar
              </p>
            )}
          </div>

          {/* Contraseña - Solo mostrar en creación */}
          {!isEdit && (
            <div className="space-y-1">
              <Input
                label="Contraseña"
                type="password"
                name="password"
                placeholder="••••••••"
                error={errors.password?.message}
                disabled={loading}
                required
                {...register("password", {
                  required: "La contraseña es requerida",
                  validate: (value) => {
                    if (!value) return true;
                    if (value.length < VALIDATION.PASSWORD_MIN_LENGTH) {
                      return `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
                    }
                    if (!/[A-Z]/.test(value)) {
                      return "Debe contener al menos una mayúscula";
                    }
                    if (!/[a-z]/.test(value)) {
                      return "Debe contener al menos una minúscula";
                    }
                    if (!/[0-9]/.test(value)) {
                      return "Debe contener al menos un número";
                    }
                    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                      return "Debe contener al menos un carácter especial (!@#$%^&*)";
                    }
                    return true;
                  },
                })}
              />
              {/* Indicador de seguridad de contraseña */}
              {password && <PasswordStrengthIndicator password={password} />}
            </div>
          )}

          {/* Confirmar contraseña - Solo mostrar en creación */}
          {!isEdit && (
            <Input
              label="Confirmar contraseña"
              type="password"
              name="passwordConfirmation"
              placeholder="••••••••"
              error={errors.passwordConfirmation?.message}
              disabled={loading}
              required={!!password}
              {...register("passwordConfirmation", {
                validate: (value) => {
                  if (!password && !value) return true;
                  if (password && !value) return "Confirma la contraseña";
                  if (value !== password) return "Las contraseñas no coinciden";
                  return true;
                },
              })}
            />
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {isEdit ? "Guardar cambios" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
};

// Validación de PropTypes
UserForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isEdit: PropTypes.bool,
};

export default UserForm;
