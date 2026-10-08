/**
 * Health Check Provider - Kallpa UNL
 *
 * Provider que verifica el estado del backend antes de mostrar la app.
 * Si el backend no está disponible, muestra una pantalla de error amigable.
 */

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";

// URL base del API (sin el prefijo /api/v1)
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

/**
 * Contexto para el estado de salud del backend
 */
const HealthCheckContext = createContext(null);

/**
 * Hook para acceder al estado de salud
 */
export const useHealthCheck = () => {
  const context = useContext(HealthCheckContext);
  if (!context) {
    throw new Error("useHealthCheck debe usarse dentro de HealthCheckProvider");
  }
  return context;
};

/**
 * Componente de pantalla de error cuando el servicio no está disponible
 */
const ServiceUnavailableScreen = ({ onRetry, isRetrying }) => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Card principal */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            {/* Ícono de error */}
            <div className="mb-4">
              <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Título */}
            <h1 className="card-title text-2xl text-base-content">
              Servicio no disponible
            </h1>

            {/* Mensaje */}
            <p className="text-base-content/70 mb-4">
              Estamos teniendo problemas técnicos en este momento. Nuestro
              equipo ya está trabajando para solucionarlo.
            </p>

            {/* Detalles adicionales */}
            <div className="bg-base-200 rounded-box p-4 w-full text-left mb-4">
              <p className="text-sm text-base-content/60 mb-2 font-medium">
                Esto puede deberse a:
              </p>
              <ul className="text-sm text-base-content/70 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="badge badge-xs badge-neutral"></span>
                  Mantenimiento programado
                </li>
                <li className="flex items-center gap-2">
                  <span className="badge badge-xs badge-neutral"></span>
                  Problemas de conexión con el servidor
                </li>
                <li className="flex items-center gap-2">
                  <span className="badge badge-xs badge-neutral"></span>
                  Alta demanda del sistema
                </li>
              </ul>
            </div>

            {/* Botón de reintentar */}
            <div className="card-actions w-full">
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="btn btn-primary w-full"
              >
                {isRetrying ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Verificando conexión...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Intentar nuevamente
                  </>
                )}
              </button>
            </div>

            {/* Texto de ayuda */}
            <p className="text-xs text-base-content/50 mt-2">
              Si el problema persiste, contacta al administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ServiceUnavailableScreen.propTypes = {
  onRetry: PropTypes.func.isRequired,
  isRetrying: PropTypes.bool.isRequired,
};

/**
 * Componente de carga inicial
 */
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
        <p className="text-base-content/70">Conectando con el servidor...</p>
      </div>
    </div>
  );
};

/**
 * Provider principal de Health Check
 */
const HealthCheckProvider = ({ children }) => {
  const [status, setStatus] = useState("checking"); // 'checking' | 'healthy' | 'unhealthy'
  const [isRetrying, setIsRetrying] = useState(false);
  const [healthData, setHealthData] = useState(null);

  /**
   * Verifica el estado del backend
   */
  const checkHealth = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 10000, // 10 segundos de timeout
      });

      const data = response.data;

      // Verificar si el status es success y la DB está conectada
      if (data.status === "success" && data.data?.database === "connected") {
        setHealthData(data.data);
        setStatus("healthy");
        return true;
      } else {
        // El backend responde pero hay problemas (ej: DB desconectada)
        setHealthData(data.data);
        setStatus("unhealthy");
        return false;
      }
    } catch (error) {
      console.error("[HealthCheck] Error:", error.message);
      setHealthData(null);
      setStatus("unhealthy");
      return false;
    }
  }, []);

  /**
   * Función para reintentar la conexión
   */
  const retry = useCallback(async () => {
    setIsRetrying(true);
    await checkHealth();
    setIsRetrying(false);
  }, [checkHealth]);

  /**
   * Verificar salud al montar el componente
   */
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  /**
   * Verificar salud periódicamente cuando está unhealthy
   */
  useEffect(() => {
    if (status === "unhealthy") {
      const interval = setInterval(() => {
        checkHealth();
      }, 30000); // Reintentar cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [status, checkHealth]);

  // Valor del contexto
  const contextValue = {
    status,
    healthData,
    isHealthy: status === "healthy",
    retry,
  };

  // Mostrar pantalla de carga mientras verifica
  if (status === "checking") {
    return <LoadingScreen />;
  }

  // Mostrar pantalla de error si el servicio no está disponible
  if (status === "unhealthy") {
    return <ServiceUnavailableScreen onRetry={retry} isRetrying={isRetrying} />;
  }

  // Si está sano, renderizar la aplicación
  return (
    <HealthCheckContext.Provider value={contextValue}>
      {children}
    </HealthCheckContext.Provider>
  );
};

HealthCheckProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HealthCheckProvider;
