import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { PlanEditorTab } from './components/PlanEditor/PlanEditorTab';
import { ExerciseLibraryTab } from './components/ExerciseLibrary/ExerciseLibraryTab';
import { DigitopunctureTab } from './components/Digitopuncture/DigitopunctureTab';
import { TrackingTab } from './components/Tracking/TrackingTab';
import { SavedPlansTab } from './components/SavedPlans/SavedPlansTab';
import { PlanSheetModal } from './components/PlanSheet/PlanSheetModal';
import { LoginPage } from './components/Auth/LoginPage';
import { useClinicalData } from './hooks/useClinicalData';
import { ClinicalPlan } from './types/clinical';
import { pacKey, todayStr, isAuthorizedEmail, AUTHORIZED_EMAILS, LOGO_DATA_URI } from './utils/clinicalUtils';

export default function App() {
  const {
    currentUser,
    authLoading,
    cloudConnected,
    isSyncing,
    permissionNotice,
    dismissPermissionNotice,
    authError,
    dismissAuthError,
    loginWithGoogle,
    loginAsClinicalUser,
    logout,
    exercises,
    plans,
    puntoFotos,
    sesiones,
    misPlantillas,
    saveExercise,
    deleteExercise,
    savePlan,
    deletePlan,
    savePuntoFoto,
    deletePuntoFoto,
    saveSesion,
    deleteSesion,
    savePlantilla,
    deletePlantilla
  } = useClinicalData();

  const [activeTab, setActiveTab] = useState<ActiveTab>('crear');
  const [viewingPlan, setViewingPlan] = useState<ClinicalPlan | null>(null);
  const [activeDraft, setActiveDraft] = useState<Partial<ClinicalPlan> | null>(null);

  // Tab switching
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setViewingPlan(null);
  };

  // When a plan is created/opened
  const handleOpenPlan = (plan: ClinicalPlan) => {
    setViewingPlan(plan);
  };

  // Duplicate an existing plan
  const handleDuplicatePlan = (plan: ClinicalPlan) => {
    setActiveDraft({
      paciente: plan.paciente,
      edad: plan.edad,
      sexo: plan.sexo,
      condicion: plan.condicion,
      condicionMedica: plan.condicionMedica,
      diagnostico: plan.diagnostico,
      profesional: plan.profesional,
      fecha: todayStr(),
      notas: plan.notas,
      items: plan.items.map(it => ({ ...it, itemId: 'x' + Math.random().toString(36).slice(2, 9) })),
      frecuencia: plan.frecuencia,
      progModo: plan.progModo,
      digito: plan.digito,
      tcm: plan.tcm
    });
    setViewingPlan(null);
    setActiveTab('crear');
  };

  // Direct create for an existing patient from tracking
  const handleNewPlanForPatient = (patientKey: string) => {
    const existing = plans.find(p => pacKey(p.paciente) === patientKey);
    if (existing) {
      handleDuplicatePlan(existing);
    } else {
      setActiveDraft({
        paciente: patientKey,
        fecha: todayStr(),
        items: []
      });
      setViewingPlan(null);
      setActiveTab('crear');
    }
  };

  // Jump to tracking from saved plans
  const handleGoToTracking = (patientKey: string) => {
    setActiveTab('seguimiento');
    setViewingPlan(null);
  };

  // Apply digitopuncture from guide tab to current draft
  const handleApplyDigitoToDraft = (groupId: string, patternId?: string) => {
    setActiveDraft(prev => ({
      ...prev,
      digito: {
        grupoId: groupId,
        puntos: []
      },
      tcm: patternId
        ? {
            patron: patternId,
            lengua: prev?.tcm?.lengua || '',
            pulso: prev?.tcm?.pulso || ''
          }
        : prev?.tcm
    }));
    setActiveTab('crear');
  };

  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);

  const handleCopyHost = () => {
    navigator.clipboard.writeText(window.location.hostname);
    setCopiedHost(true);
    setTimeout(() => setCopiedHost(false), 3000);
  };

  const handleCopyRules = () => {
    const emailsList = AUTHORIZED_EMAILS.map(e => `          '${e}'`).join(',\n');
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthorizedClinicalUser() {
      return request.auth != null &&
        (request.auth.token.email.lower() in [
${emailsList}
        ]);
    }

    match /{document=**} {
      allow read, write: if isAuthorizedClinicalUser();
    }
  }
}`;
    navigator.clipboard.writeText(rules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 3000);
  };

  // 1. Initial Auth Loading Splash
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-2xl border border-white/20 mb-4 animate-pulse">
          <img
            src={LOGO_DATA_URI}
            alt="AcupunturaChile"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-3 text-slate-200 text-sm font-medium">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span>Iniciando sistema clínico AcupunturaChile...</span>
        </div>
      </div>
    );
  }

  // 2. Initial Login Page Gate
  // If not logged in or logged in with an unauthorized email, display the Login screen exclusively
  const isAuthorized = currentUser && isAuthorizedEmail(currentUser.email);

  if (!currentUser || !isAuthorized) {
    return (
      <LoginPage
        currentUser={currentUser}
        onLogin={loginWithGoogle}
        onLoginAsClinical={loginAsClinicalUser}
        onLogout={logout}
        authError={authError}
        onDismissAuthError={dismissAuthError}
      />
    );
  }

  // 3. Full System Interface (only accessible after successful authorized login)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        savedPlansCount={plans.length}
        cloudConnected={cloudConnected}
        isSyncing={isSyncing}
        user={currentUser}
        onLogin={loginWithGoogle}
        onLogout={logout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Domain authorization error banner */}
        {authError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 shadow-xs text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-sm text-red-950">
                Dominio pendiente de autorizar en Firebase
              </p>
              <p className="mt-1 text-red-800 leading-relaxed">
                {authError}
              </p>
            </div>
            <button
              onClick={dismissAuthError}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl shrink-0 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Firestore permissions alert */}
        {permissionNotice && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 shadow-xs text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Permisos de Firestore o sincronización restringida</span>
              </p>
              <p className="mt-1 text-amber-800 leading-relaxed">
                Firestore reportó un aviso de permisos. Verifica que tu cuenta de Google esté autorizada o copia las reglas de seguridad para actualizarlas en Firebase Console.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleCopyRules}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-amber-900 border border-amber-300 font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
                title="Copia las reglas con todos los correos para pegarlas en Firebase Console"
              >
                {copiedRules ? '✓ Reglas copiadas' : 'Copiar Reglas de Seguridad'}
              </button>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                <span>Reconectar Google</span>
              </button>
              <button
                type="button"
                onClick={dismissPermissionNotice}
                className="px-2.5 py-1.5 text-amber-800 hover:text-amber-950 font-medium cursor-pointer text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Clinical local banner with domain authorization helper if cloud is not connected yet */}
        {!cloudConnected && currentUser && isAuthorized && (
          <div className="mb-6 bg-sky-50/80 border border-sky-200 text-sky-950 rounded-2xl p-3.5 shadow-xs text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
              <div>
                <p className="font-bold text-sky-950">
                  Modo Local Equipo Clínico Activo · Profesional: {currentUser.email}
                </p>
                <p className="mt-0.5 text-sky-800 text-[11px] leading-relaxed">
                  Tus pautas y registros se guardan y respaldan en este equipo. Para habilitar sincronización en tiempo real en la nube Firebase, autoriza el dominio en Firebase Console.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleCopyHost}
                className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-800 font-bold border border-sky-300 rounded-xl cursor-pointer text-[11px] shadow-2xs transition-colors flex items-center gap-1"
              >
                {copiedHost ? '✓ ¡Dominio Copiado!' : `📋 Copiar Dominio (${typeof window !== 'undefined' ? window.location.hostname : 'run.app'})`}
              </button>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl cursor-pointer text-[11px] shadow-2xs transition-colors"
              >
                Conectar con Google
              </button>
            </div>
          </div>
        )}

        {viewingPlan ? (
          <PlanSheetModal
            plan={viewingPlan}
            puntoFotos={puntoFotos}
            onClose={() => setViewingPlan(null)}
          />
        ) : (
          <>
            {activeTab === 'crear' && (
              <PlanEditorTab
                key={activeDraft ? JSON.stringify(activeDraft) : 'fresh'}
                exercises={exercises}
                puntoFotos={puntoFotos}
                misPlantillas={misPlantillas}
                onSavePlan={savePlan}
                onSavePlantilla={savePlantilla}
                onDeletePlantilla={deletePlantilla}
                onSavePuntoFoto={savePuntoFoto}
                onDeletePuntoFoto={deletePuntoFoto}
                onOpenGeneratedPlan={handleOpenPlan}
                initialDraft={activeDraft}
              />
            )}

            {activeTab === 'biblioteca' && (
              <ExerciseLibraryTab
                exercises={exercises}
                onSaveExercise={saveExercise}
                onDeleteExercise={deleteExercise}
              />
            )}

            {activeTab === 'digito' && (
              <DigitopunctureTab
                puntoFotos={puntoFotos}
                onSavePuntoFoto={savePuntoFoto}
                onDeletePuntoFoto={deletePuntoFoto}
                onApplyToCurrentDraft={handleApplyDigitoToDraft}
              />
            )}

            {activeTab === 'seguimiento' && (
              <TrackingTab
                plans={plans}
                sesiones={sesiones}
                onSaveSesion={saveSesion}
                onDeleteSesion={deleteSesion}
                onNewPlanForPatient={handleNewPlanForPatient}
              />
            )}

            {activeTab === 'guardadas' && (
              <SavedPlansTab
                plans={plans}
                onOpenPlan={handleOpenPlan}
                onDuplicatePlan={handleDuplicatePlan}
                onGoToTracking={handleGoToTracking}
                onDeletePlan={deletePlan}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
