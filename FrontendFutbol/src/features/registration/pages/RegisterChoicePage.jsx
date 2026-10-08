/**
 * ==============================================
 * Página de Elección de Registro - Kallpa UNL
 * ==============================================
 * 
 * Permite elegir si se registrará a la escuela o al club.
 * Diseño profesional y limpio utilizando DaisyUI/Tailwind.
 */

import { useNavigate } from 'react-router-dom';
import PublicNavbar from '@/shared/components/PublicNavbar';
import Button from '@/shared/components/Button';
import { ROUTES } from '@/app/config/constants';
import { User, School, ArrowRight } from 'lucide-react'; // Suponiendo que tienes lucide-react instalado (está en package.json)

const RegisterChoicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200">
      <PublicNavbar />

      <main className="container mx-auto px-4 py-16 lg:py-24">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-base-content">
            Únete a <span className="text-primary">Kallpa UNL</span>
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Elige tu camino. Ya seas un deportista en formación o un atleta de competición, 
            tenemos el espacio ideal para tu desarrollo.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* OPCIÓN 1: ESCUELA */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-base-300">
            <div className="card-body items-center text-center p-10">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <School className="w-10 h-10 text-primary" />
              </div>
              <h2 className="card-title text-2xl font-bold mb-2">Escuela Formativa</h2>
              <p className="text-base-content/70 mb-8">
                Diseñado para menores de edad. Comienza el proceso registrando primero los datos del representante legal y luego la información del deportista.
              </p>
              <div className="card-actions w-full">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate(ROUTES.REGISTER_SCHOOL)} 
                  fullWidth
                  className="rounded-full shadow-lg hover:shadow-primary/50"
                  icon={ArrowRight}
                >
                  Registrar en Escuela
                </Button>
              </div>
            </div>
          </div>

          {/* OPCIÓN 2: CLUB */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-base-300">
            <div className="card-body items-center text-center p-10">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="card-title text-2xl font-bold mb-2">Club de Alto Rendimiento</h2>
              <p className="text-base-content/70 mb-8">
                Para deportistas mayores o élite. Registro directo con tus datos personales para acceder a entrenamientos especializados.
              </p>
              <div className="card-actions w-full">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate(ROUTES.REGISTER_CLUB)} 
                  fullWidth
                  className="rounded-full shadow-lg hover:shadow-secondary/50"
                  icon={ArrowRight}
                >
                  Registrar en Club
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-16 text-center">
          <p className="text-base-content/60 mb-4">¿Ya tienes cuenta?</p>
          <Button 
            variant="ghost" 
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-primary hover:text-primary-focus hover:bg-primary/5"
          >
            Iniciar Sesión
          </Button>
          <div className="mt-4">
             <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LANDING)}>
              Volver al inicio
            </Button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default RegisterChoicePage;
