/**
 * PromoteAthleteModal Component
 *
 * Modal para promover un atleta a pasante.
 * Solicita email y contraseña para crear la cuenta.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@/shared/components/Modal";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { Mail, Lock, Eye, EyeOff, UserCheck } from "lucide-react";

function PromoteAthleteModal({
  isOpen,
  onClose,
  athlete,
  onConfirm,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Limpiar form al cerrar
  const handleClose = () => {
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  // Validar formulario
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onConfirm({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  // Actualizar campo
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Limpiar error al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Promover a Pasante"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Info del atleta */}
        <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-xl border border-accent/20">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <UserCheck size={24} className="text-accent" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {athlete?.full_name || "Atleta"}
            </p>
            <p className="text-sm text-slate-500">
              DNI: {athlete?.dni || "N/A"}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Crea una cuenta para que este atleta pueda acceder al sistema como
          pasante. Podrá gestionar asistencias, evaluaciones y ver reportes.
        </p>

        {/* Email */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <Input
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange("email")}
            icon={<Mail size={16} className="text-slate-400" />}
            error={errors.email}
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Contraseña</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange("password")}
              icon={<Lock size={16} className="text-slate-400" />}
              error={errors.password}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Confirmar Contraseña</span>
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            icon={<Lock size={16} className="text-slate-400" />}
            error={errors.confirmPassword}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Promover a Pasante
          </Button>
        </div>
      </form>
    </Modal>
  );
}

PromoteAthleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    full_name: PropTypes.string,
    dni: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default PromoteAthleteModal;
