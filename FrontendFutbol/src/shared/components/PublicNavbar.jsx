/**
 * ==============================================
 * Navbar Público - Kallpa UNL
 * ==============================================
 *
 * Navbar elegante con efecto glassmorphism.
 */

import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/app/config/constants";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

const PublicNavbar = ({ showAuthButtons = true }) => {
  const location = useLocation();
  const isLogin = location.pathname === ROUTES.LOGIN;
  const isRegister = location.pathname.startsWith(ROUTES.REGISTER);
  const isLanding = location.pathname === ROUTES.LANDING;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // En landing usamos transparente, en otras páginas usamos sólido
  const navbarBg = isLanding
    ? isScrolled
      ? "bg-base-100/95 backdrop-blur-lg shadow-lg"
      : "bg-transparent"
    : "bg-base-100 shadow-sm";

  const textColor =
    isLanding && !isScrolled ? "text-white" : "text-base-content";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to={ROUTES.LANDING} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content font-bold text-lg shadow-lg group-hover:shadow-primary/30 transition-shadow">
              K
            </div>
            <span
              className={`font-bold text-lg hidden sm:inline transition-colors ${textColor}`}
            >
              Kallpa UNL
            </span>
          </Link>

          {/* Botones desktop */}
          {showAuthButtons && (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                to={ROUTES.LOGIN}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isLogin
                    ? "bg-primary text-primary-content"
                    : isLanding && !isScrolled
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-base-content/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${
                  isRegister
                    ? "bg-primary/50 text-primary-content cursor-not-allowed"
                    : "bg-primary text-primary-content hover:bg-primary/90 hover:shadow-primary/30"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Registrarse
              </Link>
            </div>
          )}

          {/* Botón menú móvil */}
          {showAuthButtons && (
            <button
              className={`sm:hidden p-2 rounded-lg transition-colors ${
                isLanding && !isScrolled
                  ? "text-white hover:bg-white/10"
                  : "text-base-content hover:bg-base-200"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && showAuthButtons && (
        <div className="sm:hidden bg-base-100 border-t border-base-200 shadow-xl">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to={ROUTES.LOGIN}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium transition-colors ${
                isLogin
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content hover:bg-base-300"
              }`}
            >
              <LogIn className="w-5 h-5" />
              Iniciar sesión
            </Link>
            <Link
              to={ROUTES.REGISTER}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold bg-primary text-primary-content"
            >
              <UserPlus className="w-5 h-5" />
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

PublicNavbar.propTypes = {
  showAuthButtons: PropTypes.bool,
};

export default PublicNavbar;
