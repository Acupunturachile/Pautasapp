import React from 'react';
import { User } from 'firebase/auth';
import { Cloud, CloudCheck, RefreshCw, LogIn, LogOut } from 'lucide-react';
import { LOGO_DATA_URI } from '../utils/clinicalUtils';
import { AppUser } from '../types/clinical';

export type ActiveTab = 'crear' | 'biblioteca' | 'digito' | 'seguimiento' | 'guardadas';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedPlansCount: number;
  cloudConnected?: boolean;
  isSyncing?: boolean;
  user?: User | AppUser | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  savedPlansCount,
  cloudConnected = false,
  isSyncing = false,
  user = null,
  onLogin,
  onLogout
}) => {
  const tabs: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: 'crear', label: 'Crear Pauta' },
    { id: 'biblioteca', label: 'Biblioteca' },
    { id: 'digito', label: 'Digitopuntura' },
    { id: 'seguimiento', label: 'Seguimiento' },
    { id: 'guardadas', label: 'Guardadas', badge: savedPlansCount }
  ];

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={LOGO_DATA_URI}
              alt="AcupunturaChile"
              className="w-11 h-11 rounded-xl object-contain shadow-xs border border-slate-200 bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  AcupunturaChile
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  Pautas de Ejercicios
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rehabilitación terapéutica, digitopuntura y seguimiento funcional
              </p>
            </div>
          </div>

          {/* Mobile Right Bar */}
          <div className="md:hidden flex items-center gap-2">
            {cloudConnected ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Nube
              </span>
            ) : null}
            {user && onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation & Cloud Status */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          {/* Cloud Sync Status Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            {isSyncing ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="font-medium">Sincronizando...</span>
              </span>
            ) : cloudConnected ? (
              <span
                title="Conectado a Firebase Firestore. Los datos se respaldan en la nube."
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium"
              >
                <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nube Activa (Firestore)</span>
              </span>
            ) : (
              <span
                title="Conectando con Firebase Firestore"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200"
              >
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span>Nube</span>
              </span>
            )}

            {/* Google User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover shadow-xs"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs text-slate-800 font-bold max-w-[140px] truncate leading-tight">
                    {user.displayName || 'Profesional'}
                  </span>
                  <span className="text-[10px] text-slate-500 max-w-[140px] truncate">
                    {user.email}
                  </span>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Cerrar sesión"
                    className="ml-1 inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline text-[11px]">Salir</span>
                  </button>
                )}
              </div>
            ) : onLogin ? (
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                <LogIn className="w-3 h-3 text-slate-500" />
                <span>Iniciar con Google</span>
              </button>
            ) : null}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto shrink-0 w-full sm:w-auto">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
