import { useEffect } from "react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, children, size = "default" }) => {
  // Mantenemos tu lógica de bloqueo de scroll y Escape, es excelente para UX.
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  // Si no está abierto, no renderizamos nada para evitar conflictos de z-index
  if (!isOpen) return null;

  const sizeClasses = {
    default: "",
    large: "max-w-3xl",
    xlarge: "max-w-4xl",
  };

  return (
    // 'modal-open' fuerza la visibilidad ya que controlamos el estado con React
    // 'modal-bottom sm:modal-middle' hace que en móvil salga de abajo, y en PC al centro
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      {/* Caja del Modal */}
      <div className={`modal-box relative ${sizeClasses[size] || ""}`}>
        {/* Botón de cerrar (X) flotante en la esquina */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Título */}
        {title && <h3 className="font-bold text-lg pr-8 mb-4">{title}</h3>}

        {/* Contenido */}
        <div className="py-2">{children}</div>
      </div>

      {/* Backdrop (Fondo oscuro) */}
      {/* Al hacer clic fuera, se ejecuta onClose */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["default", "large", "xlarge"]),
};

export default Modal;
