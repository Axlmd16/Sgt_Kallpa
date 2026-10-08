import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "@/app/config/constants";
import { Activity, Shield, Users, ArrowLeft, Home } from "lucide-react";

const LoginPage = () => {
  // HOOKS
  const navigate = useNavigate();
  const location = useLocation();

  // Hook de autenticación
  const { login, loading, error, isAuthenticated, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Obtener ruta de origen si existe
      const from = location.state?.from || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state?.from]);

  //    Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleLogin = async (credentials) => {
    await login(credentials);
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Decorativo (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-neutral overflow-hidden">
        {/* Botón volver - Desktop */}
        <Link
          to={ROUTES.LANDING}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </Link>

        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-neutral via-neutral/90 to-primary/30" />
        </div>

        {/* Contenido decorativo */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            {/* Logo grande */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                <span className="text-primary-content font-bold text-3xl">
                  K
                </span>
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">Kallpa UNL</h2>
                <p className="text-white/60 text-sm">
                  Sistema de Gestión Deportiva
                </p>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight">
              Gestiona tu escuela de{" "}
              <span className="text-primary">fútbol</span> de forma inteligente
            </h1>

            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Accede a tu cuenta para administrar deportistas, registrar
              asistencias, aplicar evaluaciones y generar reportes
              profesionales.
            </p>

            {/* Features mini */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-lg">Gestión completa de deportistas</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-lg">
                  Tests físicos y evaluaciones técnicas
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-lg">Datos seguros y respaldados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-base-100">
        {/* Botón volver - Móvil */}
        <div className="lg:hidden p-4">
          <Link
            to={ROUTES.LANDING}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Ir al inicio</span>
          </Link>
        </div>

        {/* Contenedor del formulario */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-12">
          <div className="w-full max-w-md">
            {/* Header del formulario */}
            <div className="text-center mb-10">
              {/* Logo móvil */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                  <span className="text-primary-content font-bold text-2xl">
                    K
                  </span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-extrabold text-base-content mb-3">
                Bienvenido
              </h1>
              <p className="text-base-content/60 text-lg">
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            {/* Mensaje de estado */}
            {location.state?.message && (
              <div className="mb-6 bg-success/10 border border-success/20 text-success px-4 py-3 rounded-xl">
                <p className="text-sm">{location.state.message}</p>
              </div>
            )}

            {/* Formulario */}
            <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
