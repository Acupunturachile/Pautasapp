import React, { useState, useMemo } from 'react';
import { ClinicalPlan } from '../../types/clinical';
import { pacKey } from '../../utils/clinicalUtils';
import { Layers, User, Calendar, PlusCircle, History } from 'lucide-react';

interface SavedPlansTabProps {
  plans: ClinicalPlan[];
  onOpenPlan: (plan: ClinicalPlan) => void;
  onDuplicatePlan: (plan: ClinicalPlan) => void;
  onGoToTracking: (patientKey: string) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedPlansTab: React.FC<SavedPlansTabProps> = ({
  plans,
  onOpenPlan,
  onDuplicatePlan,
  onGoToTracking,
  onDeletePlan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'grouped'>('cards');
  const [filterPatientKey, setFilterPatientKey] = useState<string | null>(null);

  // Group plans by patient key and sort chronologically (oldest to newest) to determine version sequence
  const patientHistoryMap = useMemo(() => {
    const map: Record<string, { patientName: string; plans: ClinicalPlan[] }> = {};
    plans.forEach(p => {
      const k = pacKey(p.paciente);
      if (!map[k]) {
        map[k] = { patientName: p.paciente, plans: [] };
      }
      map[k].plans.push(p);
    });

    // Sort each patient's plans chronologically
    Object.values(map).forEach(group => {
      group.plans.sort((a, b) => {
        if (a.fecha === b.fecha) {
          return (a.createdAt || 0) - (b.createdAt || 0);
        }
        return a.fecha.localeCompare(b.fecha);
      });
    });

    return map;
  }, [plans]);

  // Map each plan id to its version number for that patient (e.g., 1 for initial, 2 for 2nd plan)
  const planVersionMap = useMemo(() => {
    const vMap: Record<string, { version: number; total: number; isLatest: boolean }> = {};
    Object.values(patientHistoryMap).forEach(group => {
      const total = group.plans.length;
      group.plans.forEach((p, idx) => {
        vMap[p.id] = {
          version: idx + 1,
          total,
          isLatest: idx === total - 1
        };
      });
    });
    return vMap;
  }, [patientHistoryMap]);

  // Filter plans based on search and optional patient filter
  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      if (filterPatientKey && pacKey(p.paciente) !== filterPatientKey) {
        return false;
      }
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        p.paciente.toLowerCase().includes(q) ||
        (p.diagnostico && p.diagnostico.toLowerCase().includes(q)) ||
        (p.profesional && p.profesional.toLowerCase().includes(q)) ||
        (p.fecha && p.fecha.toLowerCase().includes(q))
      );
    });
  }, [plans, searchTerm, filterPatientKey]);

  // Grouped array for the 'grouped' view mode
  const patientGroups = useMemo(() => {
    const groups = Object.entries(patientHistoryMap).map(([key, data]) => ({
      key,
      patientName: data.patientName,
      plans: data.plans,
      latestPlan: data.plans[data.plans.length - 1]
    }));

    if (!searchTerm.trim()) return groups;
    const q = searchTerm.toLowerCase();
    return groups.filter(g =>
      g.patientName.toLowerCase().includes(q) ||
      g.plans.some(p => p.diagnostico?.toLowerCase().includes(q))
    );
  }, [patientHistoryMap, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Historial de Pautas Clínicas</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              Firebase Cloud Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {plans.length} {plans.length === 1 ? 'pauta registrada' : 'pautas registradas en la base de datos'} · {Object.keys(patientHistoryMap).length} pacientes con historial
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pautas</span>
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grouped'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Por Paciente</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar paciente o diagnóstico..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Patient filter chip if active */}
      {filterPatientKey && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-xl text-xs">
          <span>
            Mostrando únicamente historial de <b>{patientHistoryMap[filterPatientKey]?.patientName}</b> ({patientHistoryMap[filterPatientKey]?.plans.length} pautas)
          </span>
          <button
            onClick={() => setFilterPatientKey(null)}
            className="ml-auto underline font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            Ver todos los pacientes
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredPlans.length === 0 && viewMode === 'cards' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs shadow-xs">
          {plans.length === 0
            ? 'Aún no existen pautas guardadas en Firebase. Genere su primera pauta desde la pestaña "Crear Pauta".'
            : 'No se encontraron pautas que coincidan con la búsqueda.'}
        </div>
      ) : viewMode === 'grouped' ? (
        /* Grouped by Patient View: Clear History Timeline */
        <div className="space-y-4">
          {patientGroups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs shadow-xs">
              No se encontraron pacientes para mostrar.
            </div>
          ) : (
            patientGroups.map(group => (
              <div
                key={group.key}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-base border border-blue-100">
                      {group.patientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{group.patientName}</h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {group.plans.length} {group.plans.length === 1 ? 'pauta emitida' : 'pautas en historial'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Última atención: {group.latestPlan.fecha} · {group.latestPlan.diagnostico || 'Sin diagnóstico especificado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDuplicatePlan(group.latestPlan)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer"
                      title="Crear una nueva pauta para este paciente conservando sus antecedentes"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Nueva Pauta ({group.plans.length + 1}ª)</span>
                    </button>
                    <button
                      onClick={() => onGoToTracking(group.key)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Seguimiento EVA
                    </button>
                  </div>
                </div>

                {/* Timeline of all plans for this patient */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>Línea de tiempo de prescripciones</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.plans.map((p, idx) => {
                      const version = idx + 1;
                      const isLatest = idx === group.plans.length - 1;

                      return (
                        <div
                          key={p.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                            isLatest
                              ? 'bg-blue-50/40 border-blue-200'
                              : 'bg-slate-50/70 border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                  version === 1
                                    ? 'bg-slate-200 text-slate-800'
                                    : 'bg-blue-600 text-white'
                                }`}
                              >
                                {version === 1 ? 'Pauta 1 (Inicial)' : `Pauta ${version} (Evolución)`}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {p.fecha}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-800 mt-2 line-clamp-1">
                              {p.diagnostico || 'Diagnóstico no especificado'}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {p.items.length} ejercicios prescritos · {p.frecuencia || 3} d/sem
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                            <button
                              onClick={() => onOpenPlan(p)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                            >
                              Ver Pauta
                            </button>
                            <button
                              onClick={() => onDuplicatePlan(p)}
                              className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                            >
                              Duplicar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Regular Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlans.map(plan => {
            const hasDigito = plan.digito && plan.digito.puntos.length > 0;
            const hasTcm = !!plan.tcm?.patron;
            const versionInfo = planVersionMap[plan.id];
            const pKey = pacKey(plan.paciente);
            const totalForPatient = patientHistoryMap[pKey]?.plans.length || 1;

            return (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{plan.paciente}</h3>
                        {versionInfo && totalForPatient > 1 && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              versionInfo.version === 1
                                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            Pauta #{versionInfo.version}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        {plan.edad && <span>{plan.edad}</span>}
                        {plan.sexo && <span>· {plan.sexo}</span>}
                        <span>· {plan.fecha}</span>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-100">
                      {plan.items.length} ejercicios
                    </span>
                  </div>

                  {plan.diagnostico && (
                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <b className="text-slate-900">Diagnóstico:</b> {plan.diagnostico}
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    {plan.profesional && (
                      <span className="text-slate-500 font-medium">
                        Prof: {plan.profesional}
                      </span>
                    )}
                    {hasDigito && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                        Digitopuntura ({plan.digito?.puntos.length} pts)
                      </span>
                    )}
                    {hasTcm && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        MTC
                      </span>
                    )}
                    <span className="text-slate-500">
                      Frecuencia: {plan.frecuencia || 3} días/sem
                    </span>

                    {totalForPatient > 1 && !filterPatientKey && (
                      <button
                        onClick={() => setFilterPatientKey(pKey)}
                        className="text-blue-600 hover:text-blue-800 font-semibold underline ml-auto cursor-pointer"
                      >
                        Ver historial ({totalForPatient} pautas)
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onOpenPlan(plan)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Ver Pauta
                    </button>
                    <button
                      onClick={() => onDuplicatePlan(plan)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                      title="Crea una nueva pauta para este paciente conservando sus antecedentes"
                    >
                      Duplicar como Nueva Pauta
                    </button>
                    <button
                      onClick={() => onGoToTracking(pKey)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200/80 transition-colors cursor-pointer"
                    >
                      Seguimiento
                    </button>
                  </div>

                  <div>
                    {confirmDeleteId === plan.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDeletePlan(plan.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 text-slate-500 text-[11px] cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(plan.id)}
                        className="text-xs text-slate-400 hover:text-red-600 font-semibold p-1 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
