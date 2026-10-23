import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { LOGO_DATA_URI, isAuthorizedEmail, AUTHORIZED_EMAILS } from '../../utils/clinicalUtils';
import { AppUser } from '../../types/clinical';
import {
  ShieldCheck,
  Database,
  FileText,
  Activity,
  AlertCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  Users,
  Copy,
  Check,
  ExternalLink,
  UserCheck,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  currentUser: AppUser | User | null;
  onLogin: () => void;
  onLoginAsClinical: (email: string) => void;
  onLogout: () => void;
  authError: string | null;
  onDismissAuthError: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLogin,
  onLoginAsClinical,
  onLogout,
  authError,
  onDismissAuthError
}) => {
  const [showRoster, setShowRoster] = useState(false);
  const [showDomainGuide, setShowDomainGuide] = useState(true);
  const [selectedClinicalEmail, setSelectedClinicalEmail] = useState<string>(
    AUTHORIZED_EMAILS[0] || 'm.painecura.g@gmail.com'
  );
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'run.app';
  const isLoggedWithUnauthorizedEmail =
    currentUser && !isAuthorizedEmail(currentUser.email);

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentHost);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2500);
  };

  const isUnauthorizedDomainError =
    authError && (authError.includes('no está en los Dominios Autorizados') || authError.includes('unauthorized-domain'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10 space-y-6">
        {/* Main Access Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-100 p-1 flex items-center justify-center">
              <img
                src={LOGO_DATA_URI}
                alt="AcupunturaChile"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acceso Profesional Clínico</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AcupunturaChile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Plataforma de Prescripción de Pautas de Ejercicios, Digitopuntura y Seguimiento Funcional
            </p>
          </div>

          {/* Unauthorized Email Alert (if logged in with non-clinical account) */}
          {isLoggedWithUnauthorizedEmail && (
            <div className="space-y-4 pt-1">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs text-left space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cuenta no autorizada en el equipo</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Has iniciado sesión como <b>{currentUser.email}</b>, pero esta cuenta no está habilitada en la nómina de profesionales autorizados de AcupunturaChile.
                </p>
                <p className="text-amber-800 text-[11px]">
                  Por favor selecciona o inicia sesión con uno de los 13 correos autorizados por la administración.
                </p>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión / Cambiar de cuenta</span>
              </button>
            </div>
          )}

          {/* Domain Authorization Notice & Instructions (Shown if auth/unauthorized-domain happened) */}
          {isUnauthorizedDomainError && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-left text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-amber-950 text-sm">
                    Dominio pendiente de autorizar en Firebase
                  </p>
                  <p className="mt-1 text-amber-900 leading-relaxed">
                    Firebase protege los inicios de sesión con Google. Para que la ventana de Google funcione en esta URL, debes agregar el dominio en tu consola de Firebase.
                  </p>
                </div>
              </div>

              {/* Host copy box */}
              <div className="bg-white rounded-xl p-2.5 border border-amber-200 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-800 truncate select-all">
                  {currentHost}
                </span>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] rounded-lg shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Dominio</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step by step */}
              {showDomainGuide && (
                <div className="pt-2 border-t border-amber-200/80 text-[11px] text-amber-950 space-y-1.5">
                  <p className="font-bold text-amber-900">Pasos para autorizar en 30 segundos:</p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-900 leading-relaxed">
                    <li>
                      Ingresa a{' '}
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-bold inline-flex items-center gap-0.5 text-amber-950"
                      >
                        Firebase Console <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      y abre tu proyecto <b>pautas-acupuntura</b>.
                    </li>
                    <li>
                      En el menú lateral haz clic en <b>Authentication</b> y ve a la pestaña <b>Settings (Ajustes)</b>.
                    </li>
                    <li>
                      En la sección <b>Authorized domains (Dominios autorizados)</b>, haz clic en <b>Add domain (Agregar dominio)</b> y pega el dominio copiado.
                    </li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Quick Access Card for Authorized Clinical Team */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50/70 border border-sky-200 rounded-2xl p-4 sm:p-5 text-left space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                    Acceso Rápido Equipo Clínico
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ingreso inmediato para profesionales autorizados
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                13 Habilitados
              </span>
            </div>

            <div className="space-y-2">
              <label htmlFor="clinical-selector" className="block text-[11px] font-bold text-slate-700">
                Selecciona tu cuenta profesional:
              </label>
              <select
                id="clinical-selector"
                value={selectedClinicalEmail}
                onChange={e => setSelectedClinicalEmail(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer"
              >
                {AUTHORIZED_EMAILS.map((email, idx) => (
                  <option key={idx} value={email}>
                    {email}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => onLoginAsClinical(selectedClinicalEmail)}
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Ingresar como {selectedClinicalEmail.split('@')[0]}</span>
            </button>
          </div>

          {/* Alternative: Iniciar Sesión con Google */}
          <div className="space-y-3 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                o también
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            <button
              onClick={onLogin}
              className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-slate-200"
            >
              {/* Official Google G Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Conectar con Google (OAuth)</span>
            </button>

            <p className="text-[10.5px] text-slate-400">
              Requiere tener el dominio autorizado en Firebase Console
            </p>
          </div>

          {/* Features pill list */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Base de Datos y Nube</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Prescripción de Pautas</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Activity className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Dolor EVA y Borg</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Digitopuntura y MTC</span>
            </div>
          </div>

          {/* Clinical Team Access Toggle */}
          <div className="pt-2 border-t border-slate-100 text-left">
            <button
              type="button"
              onClick={() => setShowRoster(prev => !prev)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 py-1 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Nómina Equipo Clínico ({AUTHORIZED_EMAILS.length})</span>
              </span>
              {showRoster ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showRoster && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 max-h-44 overflow-y-auto space-y-1">
                {AUTHORIZED_EMAILS.map((email, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-1.5 py-1 font-mono text-[10.5px] border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClinicalEmail(email);
                        onLoginAsClinical(email);
                      }}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-bold shrink-0 cursor-pointer"
                    >
                      Entrar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AcupunturaChile · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};
