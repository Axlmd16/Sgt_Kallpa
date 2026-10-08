import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Activity,
  BarChart3,
  ArrowRight,
  Users,
  Timer,
  FileText,
  Target,
  Award,
  CalendarCheck,
  TrendingUp,
  CheckCircle,
  Zap,
  Shield,
  Smartphone,
  Star,
  Play,
  Clock,
  Trophy,
  LineChart,
  Menu,
  X,
  ChevronRight,
  Download,
  MessageSquare,
  Mail,
} from "lucide-react";
import PublicNavbar from "../../../shared/components/PublicNavbar";
import { ROUTES } from "@/app/config/constants";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="drawer">
      <input id="mobile-menu" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <PublicNavbar showAuthButtons={true} />

        {/* Hero Section - Full Width Image Background */}
        <section className="relative min-h-screen flex items-center bg-base-300">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral/95 via-neutral/85 to-neutral/70" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 relative z-10">
            <div className="max-w-3xl">
              <div className="badge badge-primary gap-2 mb-6 px-4 py-3">
                <Activity className="w-4 h-4" />
                PLATAFORMA DEPORTIVA LÍDER
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Gestión inteligente
                <span className="block text-primary mt-2">para tu club</span>
              </h1>

              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Registra deportistas, evalúa rendimiento y genera reportes
                profesionales. La solución completa para escuelas de fútbol
                formativo.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg gap-2 shadow-xl">
                  Inscribir deportista
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to={ROUTES.LOGIN} className="btn btn-outline btn-lg gap-2 text-white border-white hover:bg-white hover:text-neutral">
                  Iniciar sesión
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Gestión de deportistas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Tests físicos y técnicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Reportes PDF</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-primary text-primary-content py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Datos seguros</span>
              </div>
              <div className="divider divider-horizontal m-0"></div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Escuelas formativas</span>
              </div>
              <div className="divider divider-horizontal m-0"></div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Fútbol formativo UNL</span>
              </div>
              <div className="divider divider-horizontal m-0"></div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span className="font-semibold">Seguimiento completo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="funcionalidades" className="py-24 bg-base-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="badge badge-primary badge-lg mb-4">
                Funcionalidades
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-base-content mb-6">
                Todo para tu escuela de fútbol
              </h2>
              <p className="text-xl text-base-content/70">
                Herramientas profesionales diseñadas para potenciar el
                desarrollo de tus deportistas.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-primary flex items-center justify-center mb-4">
                    <ClipboardList className="w-7 h-7 text-primary-content" />
                  </div>
                  <h3 className="card-title text-xl">
                    Inscripción de deportistas
                  </h3>
                  <p className="text-base-content/70">
                    Registra jugadores menores con representante legal o
                    deportistas mayores de edad de forma rápida, segura y
                    completamente digital.
                  </p>
                  <div className="card-actions mt-4">
                    <div className="badge badge-outline badge-sm">Menores</div>
                    <div className="badge badge-outline badge-sm">Mayores</div>
                    <div className="badge badge-outline badge-sm">
                      Representantes
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-secondary flex items-center justify-center mb-4">
                    <CalendarCheck className="w-7 h-7 text-secondary-content" />
                  </div>
                  <h3 className="card-title text-xl">Control de asistencias</h3>
                  <p className="text-base-content/70">
                    Registro detallado de asistencia a entrenamientos con
                    reportes automáticos.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-info flex items-center justify-center mb-4">
                    <Timer className="w-7 h-7 text-info-content" />
                  </div>
                  <h3 className="card-title text-xl">Tests físicos</h3>
                  <p className="text-base-content/70">
                    Pruebas de velocidad, resistencia y Yo-Yo test con
                    estándares deportivos.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-warning flex items-center justify-center mb-4">
                    <Target className="w-7 h-7 text-warning-content" />
                  </div>
                  <h3 className="card-title text-xl">Evaluación técnica</h3>
                  <p className="text-base-content/70">
                    Califica pase, control, regate y tiro para identificar
                    fortalezas.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-success flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-success-content" />
                  </div>
                  <h3 className="card-title text-xl">Reportes PDF</h3>
                  <p className="text-base-content/70">
                    Genera reportes individuales y grupales con gráficos de
                    evolución.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-accent flex items-center justify-center mb-4">
                    <LineChart className="w-7 h-7 text-accent-content" />
                  </div>
                  <h3 className="card-title text-xl">Analytics</h3>
                  <p className="text-base-content/70">
                    Dashboard completo con métricas de rendimiento, progreso y
                    comparativas grupales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-base-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <div className="badge badge-secondary badge-lg mb-4">
                  ¿Por qué Kallpa?
                </div>
                <h2 className="text-4xl font-bold text-base-content mb-6">
                  Optimiza tu tiempo y mejora resultados
                </h2>
                <p className="text-xl text-base-content/70 mb-8">
                  Deja de perder horas en tareas administrativas y enfócate en
                  lo que realmente importa: el desarrollo de tus deportistas.
                </p>

                <div className="space-y-4">
                  <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base-content mb-1">
                            Ahorra 10+ horas semanales
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            Automatiza tareas repetitivas y procesos
                            administrativos
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base-content mb-1">
                            Datos seguros y respaldados
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            Infraestructura en la nube con respaldo automático
                            24/7
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Smartphone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base-content mb-1">
                            Acceso desde cualquier lugar
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            Disponible en web y dispositivos móviles
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base-content mb-1">
                            Seguimiento del progreso
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            Visualiza la evolución de cada deportista en el
                            tiempo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-base-200 flex items-center justify-center">
                  <BarChart3 className="w-48 h-48 text-base-content/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-base-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="badge badge-success badge-lg mb-4">
                Testimonios
              </div>
              <h2 className="text-4xl font-bold text-base-content mb-4">
                Lo que dicen nuestros usuarios
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-base-content/80 mb-6">
                    "Kallpa transformó completamente la gestión de nuestra
                    escuela. Ahora podemos hacer seguimiento detallado de cada
                    deportista."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content w-12">
                        <span className="font-bold">CM</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Carlos Mendoza</div>
                      <div className="text-sm text-base-content/70">
                        Entrenador Principal
                      </div>
                      <div className="text-xs text-base-content/50">
                        Academia Deportiva Loja
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-base-content/80 mb-6">
                    "Los reportes automáticos nos ahorran horas de trabajo. La
                    plataforma es intuitiva y profesional."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-secondary text-secondary-content w-12">
                        <span className="font-bold">MR</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">María Rodríguez</div>
                      <div className="text-sm text-base-content/70">
                        Directora Técnica
                      </div>
                      <div className="text-xs text-base-content/50">
                        Club Formativo UNL
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-base-content/80 mb-6">
                    "Como padre, me encanta poder ver el progreso de mi hijo en
                    tiempo real. Totalmente recomendado."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-accent text-accent-content w-12">
                        <span className="font-bold">JS</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Jorge Sánchez</div>
                      <div className="text-sm text-base-content/70">
                        Padre de Deportista
                      </div>
                      <div className="text-xs text-base-content/50">
                        Usuario
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section className="py-24 bg-base-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-base-content mb-4">
                Inscribe a tu deportista
              </h2>
              <p className="text-xl text-base-content/70">
                Selecciona el tipo de inscripción según la edad del deportista.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Escuela Formativa */}
              <div className="card bg-base-100 border-2 border-base-300 hover:border-primary shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="card-title text-2xl">Escuela Formativa</h3>
                  <p className="text-base-content/70 mb-4">
                    Para deportistas <strong>menores de edad</strong>. El
                    registro lo realiza el padre, madre o representante legal.
                  </p>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block gap-2">
                      Inscribir menor
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Club Deportivo */}
              <div className="card bg-base-100 border-2 border-base-300 hover:border-secondary shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="w-14 h-14 bg-secondary/10 flex items-center justify-center mb-4">
                    <Award className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="card-title text-2xl">Club Deportivo UNL</h3>
                  <p className="text-base-content/70 mb-4">
                    Para deportistas <strong>mayores de edad</strong>. Registro
                    personal directo sin necesidad de representante.
                  </p>
                  <div className="card-actions">
                    <button className="btn btn-secondary btn-block gap-2">
                      Inscribirme
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral text-neutral-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary flex items-center justify-center">
                  <span className="text-primary-content font-bold text-xl">
                    K
                  </span>
                </div>
                <div>
                  <div className="font-bold">Kallpa UNL</div>
                  <div className="text-xs opacity-60">
                    Sistema de Gestión Deportiva
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm opacity-70">
                <a className="hover:opacity-100 cursor-pointer">
                  Iniciar sesión
                </a>
                <a className="hover:opacity-100 cursor-pointer">Registrarse</a>
              </div>
            </div>

            <div className="divider"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-70">
              <p>
                © 2026 Universidad Nacional de Loja. Todos los derechos
                reservados.
              </p>
              <div className="flex gap-4">
                <a className="hover:opacity-100">
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a className="hover:opacity-100">
                  <Mail className="w-5 h-5" />
                </a>
                <a className="hover:opacity-100">
                  <Award className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Menu Drawer */}
      <div className="drawer-side z-50">
        <label htmlFor="mobile-menu" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-100">
          <li className="mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <span className="text-primary-content font-bold text-xl">
                  K
                </span>
              </div>
              <div>
                <div className="font-bold">Kallpa UNL</div>
                <div className="text-xs opacity-60">
                  Sistema de Gestión Deportiva
                </div>
              </div>
            </div>
          </li>
          <div className="divider"></div>
          <li>
            <a className="btn btn-ghost">Iniciar sesión</a>
          </li>
          <li>
            <a className="btn btn-primary">Registrarse</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
