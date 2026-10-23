import React, { useState } from 'react';
import { TrackingSession, ClinicalPlan } from '../../types/clinical';
import { INSTRUMENTOS, getInstrumento } from '../../data/outcomeMeasuresData';
import {
  isoHoy,
  fmtIso,
  fmtIsoCorta,
  pacKey,
  diasDesde
} from '../../utils/clinicalUtils';

interface TrackingTabProps {
  plans: ClinicalPlan[];
  sesiones: TrackingSession[];
  onSaveSesion: (ses: Omit<TrackingSession, 'id'> & { id?: string }) => void;
  onDeleteSesion: (id: string) => void;
  onNewPlanForPatient: (patientKey: string) => void;
}

export const TrackingTab: React.FC<TrackingTabProps> = ({
  plans,
  sesiones,
  onSaveSesion,
  onDeleteSesion,
  onNewPlanForPatient
}) => {
  // Build list of all distinct patients
  const patientsMap = React.useMemo(() => {
    const m: Record<string, { key: string; nombre: string }> = {};
    plans.forEach(p => {
      const k = pacKey(p.paciente);
      if (k && !m[k]) m[k] = { key: k, nombre: p.paciente };
    });
    sesiones.forEach(s => {
      if (s.key && !m[s.key]) m[s.key] = { key: s.key, nombre: s.paciente };
    });
    return Object.values(m).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [plans, sesiones]);

  const [selectedPatientKey, setSelectedPatientKey] = useState<string>(() => {
    return patientsMap.length > 0 ? patientsMap[0].key : '';
  });

  // Keep selected patient valid if list changes
  React.useEffect(() => {
    if (!selectedPatientKey && patientsMap.length > 0) {
      setSelectedPatientKey(patientsMap[0].key);
    }
  }, [patientsMap, selectedPatientKey]);

  // Session form state
  const [formIso, setFormIso] = useState<string>(isoHoy());
  const [formEva, setFormEva] = useState<string>('');
  const [formInstr, setFormInstr] = useState<string>('');
  const [formPuntaje, setFormPuntaje] = useState<string>('');
  const [formBorg, setFormBorg] = useState<string>('');
  const [formNotas, setFormNotas] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Table vs Chart view toggle
  const [showEvaTable, setShowEvaTable] = useState(false);
  const [showFuncTable, setShowFuncTable] = useState(false);
  const [selectedInstrumentFilter, setSelectedInstrumentFilter] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Active patient sessions
  const currentPatientSessions = React.useMemo(() => {
    return sesiones
      .filter(s => s.key === selectedPatientKey)
      .sort((a, b) => (a.iso === b.iso ? (a.createdAt || 0) - (b.createdAt || 0) : a.iso < b.iso ? -1 : 1));
  }, [sesiones, selectedPatientKey]);

  const activePatientName =
    patientsMap.find(p => p.key === selectedPatientKey)?.nombre || 'Paciente seleccionado';

  // Instruments used for this patient
  const patientInstruments = React.useMemo(() => {
    const ids = Array.from(new Set(currentPatientSessions.map(s => s.instr).filter(Boolean)));
    return ids
      .map(id => getInstrumento(id))
      .filter((ins): ins is NonNullable<typeof ins> => ins !== undefined);
  }, [currentPatientSessions]);

  const activeInstrument =
    getInstrumento(selectedInstrumentFilter) || (patientInstruments.length > 0 ? patientInstruments[0] : null);

  // Clinical Alerts calculation
  const alerts = React.useMemo(() => {
    const list: { nivel: 'verde' | 'amarillo' | 'rojo' | 'gris'; msg: string }[] = [];
    const evaSessions = currentPatientSessions.filter(s => s.eva !== '' && s.eva != null);

    if (evaSessions.length === 0) {
      return [{ nivel: 'gris', msg: 'Sin registros de dolor aún. Ingrese la primera sesión de control.' }];
    }

    const first = Number(evaSessions[0].eva);
    const last = Number(evaSessions[evaSessions.length - 1].eva);
    const prev = evaSessions.length > 1 ? Number(evaSessions[evaSessions.length - 2].eva) : null;

    if (last >= 7) {
      list.push({
        nivel: 'rojo',
        msg: `Dolor severo actual (EVA ${last}/10): reevalúe la dosificación y descarte banderas rojas.`
      });
    }

    if (prev !== null && last - prev >= 2) {
      list.push({
        nivel: 'rojo',
        msg: `El dolor aumentó en ${last - prev} puntos desde la sesión previa. Modere la carga de ejercicio.`
      });
    }

    if (evaSessions.length >= 3 && first > 0 && last >= first - 0.5 && last < 7 && !(prev !== null && last - prev >= 2)) {
      list.push({
        nivel: 'amarillo',
        msg: 'Tres o más sesiones sin reducción significativa del dolor: reevalúe el diagnóstico o la técnica.'
      });
    }

    if (evaSessions.length >= 2 && first > 0 && (first - last) / first >= 0.3 && last <= 3) {
      list.push({
        nivel: 'verde',
        msg: `Evolución clínica favorable: reducción del dolor del ${Math.round(
          ((first - last) / first) * 100
        )}% respecto al valor basal.`
      });
    }

    // Function evolution
    if (activeInstrument) {
      const funcSessions = currentPatientSessions.filter(
        s => s.instr === activeInstrument.id && s.puntaje !== '' && s.puntaje != null
      );
      if (funcSessions.length >= 2) {
        const a = Number(funcSessions[0].puntaje);
        const z = Number(funcSessions[funcSessions.length - 1].puntaje);
        const mejora = activeInstrument.peorAlto ? a - z : z - a;
        const pct = Math.round((mejora / activeInstrument.max) * 100);

        if (pct >= 10) {
          list.push({
            nivel: 'verde',
            msg: `Funcionalidad (${activeInstrument.nombre.split(' ·')[0]}): mejoría del ${pct}% respecto al inicio.`
          });
        } else if (pct <= -10) {
          list.push({
            nivel: 'amarillo',
            msg: `Funcionalidad (${activeInstrument.nombre.split(' ·')[0]}): declive del ${Math.abs(
              pct
            )}% respecto al inicio.`
          });
        }
      }
    }

    const lastDate = currentPatientSessions[currentPatientSessions.length - 1]?.iso;
    if (lastDate && diasDesde(lastDate) > 30) {
      list.push({
        nivel: 'amarillo',
        msg: `Han transcurrido ${diasDesde(lastDate)} días sin control presencial ni registro clínico.`
      });
    }

    if (list.length === 0) {
      list.push({ nivel: 'gris', msg: 'Evolución dentro de rangos normales de control.' });
    }

    return list;
  }, [currentPatientSessions, activeInstrument]);

  // Handle submit session
  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedPatientKey) {
      setFormError('Seleccione un paciente de la lista.');
      return;
    }

    const evaVal = formEva.trim() === '' ? '' : Number(formEva);
    const puntajeVal = formPuntaje.trim() === '' ? '' : Number(formPuntaje);
    const borgVal = formBorg.trim() === '' ? '' : Number(formBorg);
    const inst = getInstrumento(formInstr);

    if (evaVal === '' && puntajeVal === '' && borgVal === '') {
      setFormError('Ingrese al menos un dato (Dolor EVA, Cuestionario de función o Escala de Borg).');
      return;
    }

    if (evaVal !== '' && (isNaN(evaVal) || evaVal < 0 || evaVal > 10)) {
      setFormError('La escala de dolor EVA debe estar entre 0 y 10.');
      return;
    }

    if (puntajeVal !== '') {
      if (!inst) {
        setFormError('Seleccione el instrumento correspondiente al puntaje de función.');
        return;
      }
      if (isNaN(puntajeVal) || puntajeVal < 0 || puntajeVal > inst.max) {
        setFormError(`El puntaje de ${inst.nombre} debe estar entre 0 y ${inst.max}.`);
        return;
      }
    }

    if (borgVal !== '' && (isNaN(borgVal) || borgVal < 6 || borgVal > 20)) {
      setFormError('La escala de esfuerzo percibido de Borg debe estar entre 6 y 20.');
      return;
    }

    onSaveSesion({
      key: selectedPatientKey,
      paciente: activePatientName,
      iso: formIso || isoHoy(),
      eva: evaVal,
      instr: puntajeVal !== '' ? formInstr : '',
      puntaje: puntajeVal,
      borg: borgVal,
      notas: formNotas.trim()
    });

    setFormEva('');
    setFormPuntaje('');
    setFormBorg('');
    setFormNotas('');
  };

  // Prepare chart series
  const evaSeries = currentPatientSessions
    .filter(s => s.eva !== '' && s.eva != null)
    .map(s => ({ iso: s.iso, v: Number(s.eva), nota: s.notas }));

  const funcSeries = activeInstrument
    ? currentPatientSessions
        .filter(s => s.instr === activeInstrument.id && s.puntaje !== '' && s.puntaje != null)
        .map(s => ({ iso: s.iso, v: Number(s.puntaje), nota: s.notas }))
    : [];

  return (
    <div className="space-y-6">
      {/* Patient Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Paciente en Seguimiento:
          </label>
          <select
            value={selectedPatientKey}
            onChange={e => {
              setSelectedPatientKey(e.target.value);
              setSelectedInstrumentFilter('');
            }}
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white"
          >
            {patientsMap.length === 0 ? (
              <option value="">Aún no hay pacientes registrados</option>
            ) : (
              patientsMap.map(p => (
                <option key={p.key} value={p.key}>
                  {p.nombre}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedPatientKey && (
          <button
            onClick={() => onNewPlanForPatient(selectedPatientKey)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200/80 transition-colors cursor-pointer whitespace-nowrap"
          >
            + Nueva Pauta para este Paciente
          </button>
        )}
      </div>

      {patientsMap.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs shadow-xs">
          Aún no existen pacientes registrados. Cree una pauta de ejercicios para iniciar el seguimiento.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Log Session + Alerts */}
          <div className="lg:col-span-5 space-y-5">
            {/* Log Session Card */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-1">Registrar Control / Sesión</h2>
              <p className="text-xs text-slate-500 mb-3">
                Monitoreo del dolor, esfuerzo y cuestionarios funcionales validados.
              </p>

              <form onSubmit={handleSubmitSession} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formIso}
                    onChange={e => setFormIso(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nivel de Dolor (EVA 0 a 10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    placeholder="0 = Sin dolor, 10 = Dolor máximo imaginable"
                    value={formEva}
                    onChange={e => setFormEva(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cuestionario funcional
                    </label>
                    <select
                      value={formInstr}
                      onChange={e => setFormInstr(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800"
                    >
                      <option value="">Sin cuestionario</option>
                      {INSTRUMENTOS.map(ins => (
                        <option key={ins.id} value={ins.id}>
                          {ins.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Puntaje {formInstr && `(0-${getInstrumento(formInstr)?.max})`}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder={
                        formInstr
                          ? `0 a ${getInstrumento(formInstr)?.max} ${getInstrumento(formInstr)?.unidad}`
                          : 'Puntaje'
                      }
                      value={formPuntaje}
                      onChange={e => setFormPuntaje(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Esfuerzo Percibido en Sesión (Borg 6 a 20)
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    placeholder="Ej: 11-12 (ligero), 13-14 (algo duro)..."
                    value={formBorg}
                    onChange={e => setFormBorg(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Observaciones clínicas / tolerancia a cargas
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Tolera bien la serie de puentes, leve molestia al final..."
                    value={formNotas}
                    onChange={e => setFormNotas(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                  />
                </div>

                {formError && (
                  <div className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    ⚠️ {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Registrar Sesión de Control
                </button>
              </form>
            </section>

            {/* Alerts & Clinical Status */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Estado Clínico y Alertas</h2>
              <div className="space-y-2">
                {alerts.map((al, idx) => {
                  const borderCol =
                    al.nivel === 'rojo'
                      ? 'border-red-400 bg-red-50/70 text-red-900'
                      : al.nivel === 'amarillo'
                      ? 'border-amber-400 bg-amber-50/70 text-amber-900'
                      : al.nivel === 'verde'
                      ? 'border-emerald-400 bg-emerald-50/70 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600';

                  const badge =
                    al.nivel === 'rojo'
                      ? '🔴'
                      : al.nivel === 'amarillo'
                      ? '🟡'
                      : al.nivel === 'verde'
                      ? '🟢'
                      : 'ℹ️';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border-l-4 border text-xs font-medium leading-relaxed ${borderCol}`}
                    >
                      <span className="mr-1.5">{badge}</span>
                      {al.msg}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column (7 cols): Charts + History */}
          <div className="lg:col-span-7 space-y-5">
            {/* EVA Chart Card */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Evolución del Dolor (Escala EVA)</h3>
                  <p className="text-xs text-slate-500">Valores de 0 a 10 registrados por sesión</p>
                </div>
                <button
                  onClick={() => setShowEvaTable(prev => !prev)}
                  className="text-xs text-blue-700 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  {showEvaTable ? 'Ver gráfico' : 'Ver tabla de datos'}
                </button>
              </div>

              {evaSeries.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Sin registros de dolor aún para este paciente.
                </div>
              ) : showEvaTable ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 text-left">Fecha</th>
                        <th className="py-2 text-center">EVA (/10)</th>
                        <th className="py-2 text-left">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {evaSeries.map((pt, i) => (
                        <tr key={i}>
                          <td className="py-2 text-slate-700 font-medium">{fmtIso(pt.iso)}</td>
                          <td className="py-2 text-center font-bold text-blue-700">{pt.v}</td>
                          <td className="py-2 text-slate-500 italic">{pt.nota || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <SimpleSvgLineChart
                  data={evaSeries}
                  min={0}
                  max={10}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  unit="/10"
                  color="#0284c7"
                />
              )}
            </section>

            {/* Functional Instrument Chart Card */}
            {patientInstruments.length > 0 && activeInstrument && (
              <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Cuestionario: {activeInstrument.nombre}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeInstrument.peorAlto
                        ? 'Menor puntaje indica menor discapacidad / mejoría'
                        : 'Mayor puntaje indica mayor funcionalidad / mejoría'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {patientInstruments.length > 1 && (
                      <select
                        value={activeInstrument.id}
                        onChange={e => setSelectedInstrumentFilter(e.target.value)}
                        className="text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {patientInstruments.map(ins => (
                          <option key={ins.id} value={ins.id}>
                            {ins.nombre.split(' ·')[0]}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => setShowFuncTable(prev => !prev)}
                      className="text-xs text-blue-700 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      {showFuncTable ? 'Ver gráfico' : 'Ver tabla'}
                    </button>
                  </div>
                </div>

                {funcSeries.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No hay puntajes registrados con este cuestionario.
                  </div>
                ) : showFuncTable ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2 text-left">Fecha</th>
                          <th className="py-2 text-center">Puntaje</th>
                          <th className="py-2 text-left">Observaciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {funcSeries.map((pt, i) => (
                          <tr key={i}>
                            <td className="py-2 text-slate-700 font-medium">{fmtIso(pt.iso)}</td>
                            <td className="py-2 text-center font-bold text-amber-700">
                              {pt.v} {activeInstrument.unidad}
                            </td>
                            <td className="py-2 text-slate-500 italic">{pt.nota || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <SimpleSvgLineChart
                    data={funcSeries}
                    min={0}
                    max={activeInstrument.max}
                    ticks={[
                      0,
                      Math.round(activeInstrument.max * 0.25),
                      Math.round(activeInstrument.max * 0.5),
                      Math.round(activeInstrument.max * 0.75),
                      activeInstrument.max
                    ]}
                    unit={` ${activeInstrument.unidad}`}
                    color="#d97706"
                  />
                )}
              </section>
            )}

            {/* Session History List */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Historial de Sesiones Registradas ({currentPatientSessions.length})
              </h3>

              {currentPatientSessions.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Sin sesiones registradas para este paciente.
                </p>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {currentPatientSessions
                    .slice()
                    .reverse()
                    .map(ses => {
                      const instObj = getInstrumento(ses.instr);

                      return (
                        <div
                          key={ses.id}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900">{fmtIso(ses.iso)}</span>
                              {ses.eva !== '' && ses.eva != null && (
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                                  EVA {ses.eva}/10
                                </span>
                              )}
                              {ses.puntaje !== '' && ses.puntaje != null && instObj && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                                  {instObj.nombre.split(' ·')[0]}: {ses.puntaje}
                                  {instObj.unidad}
                                </span>
                              )}
                              {ses.borg !== '' && ses.borg != null && (
                                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-semibold">
                                  Borg: {ses.borg}
                                </span>
                              )}
                            </div>

                            {ses.notas && <p className="text-slate-600 italic">"{ses.notas}"</p>}
                          </div>

                          {confirmDeleteId === ses.id ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  if (ses.id) onDeleteSesion(ses.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-slate-500 text-[10px]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(ses.id || null)}
                              className="text-slate-400 hover:text-red-600 text-xs font-bold p-1 shrink-0 cursor-pointer"
                              title="Eliminar este control"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

// SVG Line Chart Component with Interactive Hover & Tooltip
function SimpleSvgLineChart({
  data,
  min,
  max,
  ticks,
  unit,
  color
}: {
  data: { iso: string; v: number; nota?: string }[];
  min: number;
  max: number;
  ticks: number[];
  unit: string;
  color: string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const W = 580;
  const H = 200;
  const L = 38;
  const R = 40;
  const T = 16;
  const B = 28;
  const iw = W - L - R;
  const ih = H - T - B;

  const getX = (i: number) => L + (data.length === 1 ? iw / 2 : (iw * i) / (data.length - 1));
  const getY = (val: number) => T + ih * (1 - (val - min) / (max - min || 1));

  const pathD = data.map((pt, i) => `${i === 0 ? 'M' : 'L'}${getX(i).toFixed(1)} ${getY(pt.v).toFixed(1)}`).join(' ');

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Horizontal grid lines */}
        {ticks.map(t => (
          <g key={t}>
            <line
              x1={L}
              x2={W - R}
              y1={getY(t)}
              y2={getY(t)}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x={L - 6}
              y={getY(t) + 3}
              textAnchor="end"
              fontSize="10"
              className="fill-slate-400 font-mono"
            >
              {t}
            </text>
          </g>
        ))}

        {/* X Axis labels */}
        {data.map((pt, i) => {
          const step = Math.max(1, Math.ceil(data.length / 6));
          if (i % step !== 0 && i !== data.length - 1) return null;
          return (
            <text
              key={i}
              x={getX(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              className="fill-slate-400 font-mono"
            >
              {fmtIsoCorta(pt.iso)}
            </text>
          );
        })}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points & Interactive Zones */}
        {data.map((pt, i) => {
          const cx = getX(i);
          const cy = getY(pt.v);
          const isHovered = hoverIndex === i;

          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 4}
                fill={color}
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all"
              />
              {/* Invisible touch/hover target */}
              <circle
                cx={cx}
                cy={cy}
                r={16}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && hoverIndex !== null && (
        <div
          className="absolute pointer-events-none bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700 whitespace-nowrap z-20"
          style={{
            left: `${(getX(hoverIndex) / W) * 100}%`,
            top: `${Math.max(0, (getY(activePoint.v) / H) * 100 - 24)}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-bold">
            {fmtIso(activePoint.iso)}: {activePoint.v}
            {unit}
          </div>
          {activePoint.nota && <div className="text-[10px] text-slate-300">"{activePoint.nota}"</div>}
        </div>
      )}
    </div>
  );
}
