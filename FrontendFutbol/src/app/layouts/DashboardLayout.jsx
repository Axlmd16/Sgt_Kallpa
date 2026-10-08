/**
 * Layout protegido con Sidebar colapsable y responsive
 * Diseño moderno usando colores del tema UNL
 */

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  getRoleLabel,
  getSidebarItems,
  NAV_ICONS,
} from "@/app/config/navigation.jsx";
import { ROUTES } from "@/app/config/constants";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || user?.rol;
  const roleLabel = getRoleLabel(role);
  const items = getSidebarItems(role);

  const sidebarWidth = collapsed ? "w-20" : "w-64";

  const goToProfile = () => {
    navigate(ROUTES.PROFILE);
    if (mobileOpen) setMobileOpen(false);
  };

  /** Contenido del sidebar (reutilizado en desktop y mobile) */
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col bg-base-100 border-r border-base-300">
      {/* Header con logo */}
      <div className="px-4 py-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content font-bold text-lg">
                K
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold tracking-tight text-base-content">
                  KALLPA UNL
                </div>
                <div className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                  {roleLabel}
                </div>
              </div>
            </div>
          )}
          {collapsed && !isMobile && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-content font-bold text-lg mx-auto">
              K
            </div>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* User Profile - Simplificado */}
      <div className="px-3 py-4 border-b border-base-300">
        <button
          type="button"
          onClick={goToProfile}
          className={[
            "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors text-left",
            collapsed && !isMobile ? "justify-center" : "",
          ].join(" ")}
          title={
            collapsed && !isMobile ? user?.full_name || "Ver perfil" : undefined
          }
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.full_name || user.email || "Usuario"}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-base-300"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral text-neutral-content font-bold">
                {(
                  user?.full_name?.[0] ||
                  user?.email?.[0] ||
                  "U"
                ).toUpperCase()}
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-base-100" />
          </div>

          {/* User info - solo si no está colapsado */}
          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-base-content truncate">
                {user?.full_name || "Usuario"}
              </div>
              <div className="text-xs text-base-content/60 truncate">
                {user?.email}
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Section Label */}
      {(!collapsed || isMobile) && (
        <div className="px-5 pt-4 pb-2">
          <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
            Menú
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => isMobile && setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-primary text-primary-content"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200",
                    collapsed && !isMobile ? "justify-center px-3" : "",
                  ].join(" ")
                }
                end={item.to === "/dashboard"}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <span className="shrink-0">
                  {NAV_ICONS[item.icon] || NAV_ICONS.dashboard}
                </span>
                {(!collapsed || isMobile) && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Logout */}
      <div className="p-3 border-t border-base-300">
        <button
          type="button"
          onClick={logout}
          title={collapsed && !isMobile ? "Cerrar sesión" : undefined}
          className={[
            "flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
            "text-error/80 hover:text-error hover:bg-error/10",
            collapsed && !isMobile ? "justify-center" : "",
          ].join(" ")}
        >
          <LogOut size={20} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 bg-base-100 border-b border-base-300 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn btn-ghost btn-sm btn-square"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-content font-bold text-sm">
            K
          </div>
          <span className="font-bold text-base-content tracking-tight">
            KALLPA UNL
          </span>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarContent isMobile />
      </aside>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-30 hidden bg-base-100 shadow-sm transition-all duration-300 ease-out lg:block",
            sidebarWidth,
          ].join(" ")}
        >
          <SidebarContent />

          {/* Collapse toggle button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-circle btn-sm absolute -right-3 top-5"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </aside>

        {/* Main content */}
        <main
          className={[
            "min-h-screen flex-1 transition-all duration-300",
            collapsed ? "lg:ml-20" : "lg:ml-64",
          ].join(" ")}
        >
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
