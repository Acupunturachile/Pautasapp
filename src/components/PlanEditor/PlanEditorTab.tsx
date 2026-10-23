import React, { useState, useId } from 'react';
import {
  Exercise,
  PlanItem,
  ClinicalPlan,
  ExerciseLevel,
  CustomTemplate,
  DigitoPoint,
  ExerciseCategory
} from '../../types/clinical';
import { AREAS, CATEGORIES, LEVEL_LABEL } from '../../data/seedExercises';
import { ExerciseIconBadge } from '../../data/exerciseIcons';
import {
  DIGITO_GROUPS,
  DIGITO_REGIONES,
  renderPointSvg,
  ytPointUrl,
  findSuggestedDigitoGroup
} from '../../data/digitopunctureData';
import { sugerirPerfilCarga } from '../../data/clinicalSafetyData';
import { PRESET_TEMPLATES } from '../../data/templatesData';
import { TCM_PATRONES, TCM_POR_GRUPO, ALL_POINTS_MAP } from '../../data/tcmPatternsData';
import {
  uid,
  todayStr,
  ytExerciseUrl,
  resizeImageFile
} from '../../utils/clinicalUtils';

const MIN_EJERCICIOS_PAUTA = 4;
const EDAD_RANGOS = ['Menor de 18', '18-30', '31-45', '46-60', '61-75', 'Mayor de 75'];
const SEXOS = ['Femenino', 'Masculino', 'Otro / prefiere no decir'];
const CONDICIONES = ['Sedentario', 'Activo moderado', 'Activo / entrenado'];

const PROG_MODOS: Record<string, { label: string; step: number }> = {
  sube2: { label: 'Subir un nivel cada 2 semanas (recomendado)', step: 2 },
  sube1: { label: 'Subir un nivel cada semana (rápida)', step: 1 },
  mantener: { label: 'Mantener el nivel elegido durante 4 semanas', step: 0 }
};

interface PlanEditorTabProps {
  exercises: Exercise[];
  puntoFotos: Record<string, string>;
  misPlantillas: CustomTemplate[];
  onSavePlan: (plan: Omit<ClinicalPlan, 'id'> & { id?: string }) => ClinicalPlan;
  onSavePlantilla: (plt: CustomTemplate) => void;
  onDeletePlantilla: (id: string) => void;
  onSavePuntoFoto: (cod: string, dataUrl: string) => void;
  onDeletePuntoFoto: (cod: string) => void;
  onOpenGeneratedPlan: (plan: ClinicalPlan) => void;
  initialDraft?: Partial<ClinicalPlan> | null;
}

export const PlanEditorTab: React.FC<PlanEditorTabProps> = ({
  exercises,
  puntoFotos,
  misPlantillas,
  onSavePlan,
  onSavePlantilla,
  onDeletePlantilla,
  onSavePuntoFoto,
  onDeletePuntoFoto,
  onOpenGeneratedPlan,
  initialDraft
}) => {
  // Form Draft State
  const [paciente, setPaciente] = useState(initialDraft?.paciente || '');
  const [edad, setEdad] = useState(initialDraft?.edad || '');
  const [sexo, setSexo] = useState(initialDraft?.sexo || '');
  const [condicion, setCondicion] = useState(initialDraft?.condicion || '');
  const [condicionMedica, setCondicionMedica] = useState(initialDraft?.condicionMedica || '');
  const [diagnostico, setDiagnostico] = useState(initialDraft?.diagnostico || '');
  const [profesional, setProfesional] = useState(initialDraft?.profesional || '');
  const [fecha, setFecha] = useState(initialDraft?.fecha || todayStr());
  const [notas, setNotas] = useState(initialDraft?.notas || '');
  const [items, setItems] = useState<PlanItem[]>(initialDraft?.items || []);

  // Progression & Frecuencia
  const [frecuencia, setFrecuencia] = useState<number>(initialDraft?.frecuencia || 3);
  const [progModo, setProgModo] = useState<string>(initialDraft?.progModo || 'sube2');

  // Digitopuntura
  const [digitoGrupoId, setDigitoGrupoId] = useState<string>(initialDraft?.digito?.grupoId || '');
  const [digitoPuntos, setDigitoPuntos] = useState<DigitoPoint[]>(initialDraft?.digito?.puntos || []);

  // TCM
  const [tcmPatron, setTcmPatron] = useState<string>(initialDraft?.tcm?.patron || '');
  const [tcmLengua, setTcmLengua] = useState<string>(initialDraft?.tcm?.lengua || '');
  const [tcmPulso, setTcmPulso] = useState<string>(initialDraft?.tcm?.pulso || '');

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('todas');
  const [filterArea, setFilterArea] = useState<string>('todas');

  // Templates
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [nuevaPlantillaNombre, setNuevaPlantillaNombre] = useState('');
  const [confirmDelPlt, setConfirmDelPlt] = useState(false);

  // Errors & UI feedback
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Profile initial workload recommendation
  const determineInitialLevel = (): ExerciseLevel => {
    if (edad === '61-75' || edad === 'Mayor de 75' || edad === 'Menor de 18') return 'bajo';
    return condicion === 'Sedentario' || !condicion ? 'bajo' : 'moderado';
  };

  // Add exercise to draft
  const handleAddExercise = (ex: Exercise, level: ExerciseLevel) => {
    const newItem: PlanItem = {
      itemId: uid(),
      exId: ex.id,
      nombre: ex.nombre,
      categoria: ex.categoria,
      area: ex.area,
      descripcion: ex.descripcion,
      nivel: level,
      detalle: ex.niveles[level],
      notaItem: '',
      icon: ex.icon,
      progresion: ex.progresion || ''
    };
    setItems(prev => [...prev, newItem]);
    setFormError('');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(it => it.itemId !== itemId));
  };

  const handleMoveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setItems(copy);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<PlanItem>) => {
    setItems(prev => prev.map(it => (it.itemId === itemId ? { ...it, ...updates } : it)));
  };

  // Handle Digitopuntura Group selection
  const handleSelectDigitoGroup = (groupId: string) => {
    setDigitoGrupoId(groupId);
    const g = DIGITO_GROUPS.find(x => x.id === groupId);
    if (g) {
      setDigitoPuntos(g.puntos.slice(0, 3).map(p => ({ ...p })));
    } else {
      setDigitoPuntos([]);
    }
  };

  // Template handling
  const handleApplyTemplate = (templateId: string) => {
    const preset = PRESET_TEMPLATES.find(p => p.id === templateId);
    const custom = misPlantillas.find(p => p.id === templateId);
    const baseLevel = determineInitialLevel();

    if (preset) {
      const matchedItems: PlanItem[] = [];
      preset.ex.forEach(exName => {
        const found = exercises.find(e => e.nombre.toLowerCase() === exName.toLowerCase());
        if (found) {
          matchedItems.push({
            itemId: uid(),
            exId: found.id,
            nombre: found.nombre,
            categoria: found.categoria,
            area: found.area,
            descripcion: found.descripcion,
            nivel: baseLevel,
            detalle: found.niveles[baseLevel],
            notaItem: '',
            icon: found.icon,
            progresion: found.progresion || ''
          });
        }
      });
      setItems(matchedItems);
      if (!diagnostico.trim()) setDiagnostico(preset.diag);
      if (preset.digito) handleSelectDigitoGroup(preset.digito);
      setFrecuencia(preset.frec);
      if (!notas.trim()) {
        setNotas(`Realizar ${preset.frec} veces por semana. Suspender ante dolor agudo o malestar inusual.`);
      }
      triggerToast(`Plantilla "${preset.nombre}" cargada con carga inicial ${baseLevel}.`);
    } else if (custom) {
      const matchedItems: PlanItem[] = [];
      custom.items.forEach(cItem => {
        const found = exercises.find(e => e.nombre.toLowerCase() === cItem.nombre.toLowerCase());
        if (found) {
          matchedItems.push({
            itemId: uid(),
            exId: found.id,
            nombre: found.nombre,
            categoria: found.categoria,
            area: found.area,
            descripcion: found.descripcion,
            nivel: cItem.nivel,
            detalle: cItem.detalle || found.niveles[cItem.nivel],
            notaItem: cItem.notaItem || '',
            icon: found.icon,
            progresion: found.progresion || ''
          });
        }
      });
      setItems(matchedItems);
      if (!diagnostico.trim() && custom.diag) setDiagnostico(custom.diag);
      if (custom.digito) handleSelectDigitoGroup(custom.digito);
      if (custom.frec) setFrecuencia(custom.frec);
      if (custom.notas) setNotas(custom.notas);
      triggerToast(`Plantilla personalizada "${custom.nombre}" cargada.`);
    }
  };

  const handleSaveCustomTemplate = () => {
    if (!nuevaPlantillaNombre.trim()) {
      triggerToast('Ingrese un nombre para su plantilla.');
      return;
    }
    if (items.length === 0) {
      triggerToast('Agregue ejercicios antes de guardar la plantilla.');
      return;
    }
    const newPlt: CustomTemplate = {
      id: uid(),
      propia: true,
      nombre: nuevaPlantillaNombre.trim(),
      diag: diagnostico,
      digito: digitoGrupoId,
      frec: frecuencia,
      notas: notas,
      items: items.map(it => ({
        nombre: it.nombre,
        nivel: it.nivel,
        detalle: it.detalle,
        notaItem: it.notaItem
      }))
    };
    onSavePlantilla(newPlt);
    setSelectedTemplateId(newPlt.id);
    setNuevaPlantillaNombre('');
    triggerToast('Plantilla guardada con éxito.');
  };

  // Image upload
  const handleUploadPhoto = async (cod: string, file: File) => {
    try {
      const dataUrl = await resizeImageFile(file);
      onSavePuntoFoto(cod, dataUrl);
      triggerToast(`Foto para ${cod} guardada.`);
    } catch (err) {
      triggerToast('Error al procesar la imagen.');
    }
  };

  // Reset Draft
  const handleResetDraft = () => {
    setPaciente('');
    setEdad('');
    setSexo('');
    setCondicion('');
    setCondicionMedica('');
    setDiagnostico('');
    setProfesional('');
    setFecha(todayStr());
    setNotas('');
    setItems([]);
    setDigitoGrupoId('');
    setDigitoPuntos([]);
    setTcmPatron('');
    setTcmLengua('');
    setTcmPulso('');
    setFormError('');
    triggerToast('Pauta reiniciada.');
  };

  // Generate Plan action
  const handleGeneratePlan = () => {
    setFormError('');
    if (!paciente.trim()) {
      setFormError('Por favor ingrese el nombre del paciente.');
      return;
    }
    if (items.length < MIN_EJERCICIOS_PAUTA) {
      setFormError(
        `La pauta debe contener al menos ${MIN_EJERCICIOS_PAUTA} ejercicios (actualmente contiene ${items.length}).`
      );
      return;
    }

    const planToSave: Omit<ClinicalPlan, 'id'> = {
      paciente: paciente.trim(),
      edad: edad || undefined,
      sexo: sexo || undefined,
      condicion: condicion || undefined,
      condicionMedica: condicionMedica || undefined,
      diagnostico: diagnostico.trim(),
      profesional: profesional.trim(),
      fecha: fecha || todayStr(),
      notas: notas.trim(),
      items: items,
      frecuencia,
      progModo,
      digito: digitoPuntos.length > 0 ? { grupoId: digitoGrupoId, puntos: digitoPuntos } : undefined,
      tcm: tcmPatron ? { patron: tcmPatron, lengua: tcmLengua, pulso: tcmPulso } : undefined,
      createdAt: Date.now()
    };

    const saved = onSavePlan(planToSave);
    onOpenGeneratedPlan(saved);
  };

  // Filter exercises
  const filteredExercises = exercises.filter(e => {
    if (filterCat !== 'todas' && e.categoria !== filterCat) return false;
    if (filterArea !== 'todas' && e.area !== filterArea) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.nombre.toLowerCase().includes(q) ||
        e.area.toLowerCase().includes(q) ||
        e.descripcion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const suggestedGroup = findSuggestedDigitoGroup(diagnostico);
  const selectedCustomTemplate = misPlantillas.find(p => p.id === selectedTemplateId);

  // Generate unique IDs for form labels
  const pacienteId = useId();
  const edadId = useId();
  const sexoId = useId();
  const condicionId = useId();
  const condicionMedicaId = useId();
  const diagnosticoId = useId();
  const profesionalId = useId();
  const fechaId = useId();
  const templateSelectId = useId();
  const newTemplateNameId = useId();
  const filterCatId = useId();
  const filterAreaId = useId();
  const tcmPatronId = useId();
  const tcmLenguaId = useId();
  const tcmPulsoId = useId();
  const frecuenciaId = useId();
  const progModoId = useId();
  const notasId = useId();

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Main Grid: Left = Picker & Patient, Right = Draft Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Patient Card */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Ficha del Paciente</span>
              <span className="text-xs font-normal text-slate-400">Datos clínicos</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label htmlFor={pacienteId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Paciente <span className="text-red-500">*</span>
                </label>
                <input
                  id={pacienteId}
                  type="text"
                  placeholder="Ej: Carolina Rojas M."
                  value={paciente}
                  onChange={e => setPaciente(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={edadId} className="block text-xs font-semibold text-slate-700 mb-1">Rango de edad</label>
                  <select
                    id={edadId}
                    value={edad}
                    onChange={e => setEdad(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  >
                    <option value="">Seleccionar edad</option>
                    {EDAD_RANGOS.map(a => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={sexoId} className="block text-xs font-semibold text-slate-700 mb-1">Sexo biológico</label>
                  <select
                    id={sexoId}
                    value={sexo}
                    onChange={e => setSexo(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  >
                    <option value="">Seleccionar sexo</option>
                    {SEXOS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={condicionId} className="block text-xs font-semibold text-slate-700 mb-1">Actividad previa</label>
                  <select
                    id={condicionId}
                    value={condicion}
                    onChange={e => setCondicion(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  >
                    <option value="">Nivel de actividad</option>
                    {CONDICIONES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={fechaId} className="block text-xs font-semibold text-slate-700 mb-1">Fecha de emisión</label>
                  <input
                    id={fechaId}
                    type="text"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={condicionMedicaId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Condición médica especial (opcional)
                </label>
                <input
                  id={condicionMedicaId}
                  type="text"
                  placeholder="Ej: Hipertensión controlada, artrosis leve..."
                  value={condicionMedica}
                  onChange={e => setCondicionMedica(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label htmlFor={diagnosticoId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnóstico / Motivo de Consulta
                </label>
                <input
                  id={diagnosticoId}
                  type="text"
                  placeholder="Ej: Lumbalgia mecánica subaguda L4-L5"
                  value={diagnostico}
                  onChange={e => setDiagnostico(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label htmlFor={profesionalId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Profesional Tratante
                </label>
                <input
                  id={profesionalId}
                  type="text"
                  placeholder="Ej: Klgo. Juan Contreras"
                  value={profesional}
                  onChange={e => setProfesional(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                />
              </div>

              {sugerirPerfilCarga(edad, condicion) && (
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                  <span className="font-semibold">⚠️ Recomendación de carga:</span>{' '}
                  {sugerirPerfilCarga(edad, condicion)}
                </div>
              )}
            </div>
          </section>

          {/* Exercise Search & Selection Catalog */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Catálogo de Ejercicios</h2>

            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Buscar por nombre, zona o descripción..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={filterCatId} className="sr-only">Filtrar por categoría</label>
                  <select
                    id={filterCatId}
                    value={filterCat}
                    onChange={e => setFilterCat(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700"
                  >
                    <option value="todas">Todas las categorías</option>
                    {(Object.keys(CATEGORIES) as ExerciseCategory[]).map(cat => (
                      <option key={cat} value={cat}>
                        {CATEGORIES[cat].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={filterAreaId} className="sr-only">Filtrar por área anatómica</label>
                  <select
                    id={filterAreaId}
                    value={filterArea}
                    onChange={e => setFilterArea(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700"
                  >
                    <option value="todas">Todas las áreas</option>
                    {AREAS.map(ar => (
                      <option key={ar} value={ar}>
                        {ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto max-h-[500px] space-y-2.5 pr-1 divide-y divide-slate-100">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No se encontraron ejercicios con los filtros actuales.
                </div>
              ) : (
                filteredExercises.map(ex => {
                  const catDef = CATEGORIES[ex.categoria];
                  const inDraftCount = items.filter(it => it.nombre === ex.nombre).length;

                  return (
                    <div key={ex.id} className="pt-2.5 first:pt-0">
                      <div className="flex items-start gap-3">
                        <ExerciseIconBadge iconKey={ex.icon} exerciseName={ex.nombre} size={36} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${catDef.badgeClass}`}
                            >
                              {catDef.label}
                            </span>
                            <span className="text-[11px] text-slate-500">{ex.area}</span>
                            {inDraftCount > 0 && (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full">
                                En pauta ({inDraftCount})
                              </span>
                            )}
                          </div>

                          <h3 className="text-xs font-bold text-slate-900 leading-snug">{ex.nombre}</h3>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{ex.descripcion}</p>

                          <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-50">
                            <a
                              href={ytExerciseUrl(ex.nombre)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                            >
                              <span>▶ Video</span>
                            </a>

                            {/* Level Action Buttons */}
                            <div className="flex items-center gap-1">
                              {(['bajo', 'moderado', 'alto'] as ExerciseLevel[]).map(lvl => (
                                <button
                                  key={lvl}
                                  onClick={() => handleAddExercise(ex, lvl)}
                                  title={ex.niveles[lvl]}
                                  className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors cursor-pointer"
                                >
                                  +{lvl.charAt(0).toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Column (7 cols) - Draft Builder */}
        <div className="lg:col-span-7 space-y-5">
          {/* Rapid Pathology Templates */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Pautas Rápidas por Diagnóstico</h2>
            <p className="text-xs text-slate-500 mb-3">
              Carga una selección balanceada de ejercicios, puntos de digitopuntura y pauta de progresión.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label htmlFor={templateSelectId} className="sr-only">Seleccionar plantilla</label>
                <select
                  id={templateSelectId}
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white"
                >
                  <option value="">Seleccione una plantilla...</option>
                  <optgroup label="Patologías Frecuentes">
                    {PRESET_TEMPLATES.map(pt => (
                      <option key={pt.id} value={pt.id}>
                        {pt.nombre} ({pt.ex.length} ejercicios)
                      </option>
                    ))}
                  </optgroup>
                  {misPlantillas.length > 0 && (
                    <optgroup label="Mis Plantillas Personalizadas">
                      {misPlantillas.map(mt => (
                        <option key={mt.id} value={mt.id}>
                          ⭐ {mt.nombre} ({mt.items.length} ejercicios)
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApplyTemplate(selectedTemplateId)}
                  disabled={!selectedTemplateId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Cargar a Pauta
                </button>
              </div>
            </div>

            {selectedCustomTemplate && (
              <div className="mt-2 text-xs flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-600">Plantilla propia: {selectedCustomTemplate.nombre}</span>
                {confirmDelPlt ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onDeletePlantilla(selectedCustomTemplate.id);
                        setSelectedTemplateId('');
                        setConfirmDelPlt(false);
                      }}
                      className="px-2 py-0.5 bg-red-600 text-white rounded-md text-[10px] font-bold"
                    >
                      Sí, borrar
                    </button>
                    <button
                      onClick={() => setConfirmDelPlt(false)}
                      className="px-2 py-0.5 text-slate-600 hover:text-slate-900 text-[10px]"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelPlt(true)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Eliminar plantilla
                  </button>
                )}
              </div>
            )}

            {/* Save current draft as custom template */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <label htmlFor={newTemplateNameId} className="sr-only">Nombre para guardar plantilla</label>
              <input
                id={newTemplateNameId}
                type="text"
                placeholder="Guardar pauta actual como plantilla propia..."
                value={nuevaPlantillaNombre}
                onChange={e => setNuevaPlantillaNombre(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
              />
              <button
                onClick={handleSaveCustomTemplate}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                Guardar Plantilla
              </button>
            </div>
          </section>

          {/* Draft Items List */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Ejercicios Prescritos ({items.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Mínimo recomendado: {MIN_EJERCICIOS_PAUTA} ejercicios por prescripción
                </p>
              </div>

              {items.length > 0 && (
                <button
                  onClick={handleResetDraft}
                  className="text-xs text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
                >
                  Limpiar todo
                </button>
              )}
            </div>

            {/* Progress bar towards minimum requirement */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  items.length >= MIN_EJERCICIOS_PAUTA ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{
                  width: `${Math.min(100, (items.length / MIN_EJERCICIOS_PAUTA) * 100)}%`
                }}
              />
            </div>

            {items.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-700">Aún no hay ejercicios en la pauta</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Seleccione ejercicios del catálogo a la izquierda o cargue una de las pautas rápidas sugeridas.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((it, idx) => {
                  return (
                    <div
                      key={it.itemId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
                    >
                      <div className="flex items-start gap-3">
                        <ExerciseIconBadge iconKey={it.icon} exerciseName={it.nombre} size={36} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold text-slate-900">
                              {idx + 1}. {it.nombre}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                                CATEGORIES[it.categoria].badgeClass
                              }`}
                            >
                              {CATEGORIES[it.categoria].label}
                            </span>
                            <span className="text-xs font-semibold text-blue-700">
                              · {LEVEL_LABEL[it.nivel]}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs mb-2">
                            <a
                              href={ytExerciseUrl(it.nombre)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                            >
                              <span>▶ Video referencia</span>
                            </a>
                            <span className="text-slate-300">|</span>
                            {/* Change level buttons */}
                            <div className="flex items-center gap-1">
                              {(['bajo', 'moderado', 'alto'] as ExerciseLevel[]).map(lvl => (
                                <button
                                  key={lvl}
                                  onClick={() => {
                                    const ex = exercises.find(e => e.nombre === it.nombre);
                                    handleUpdateItem(it.itemId, {
                                      nivel: lvl,
                                      detalle: ex?.niveles[lvl] || it.detalle
                                    });
                                  }}
                                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold cursor-pointer ${
                                    it.nivel === lvl
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                  }`}
                                >
                                  {lvl.charAt(0).toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Editable Detalle */}
                          <div className="space-y-1.5">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 block">
                                Dosificación / Indicación para el paciente
                              </label>
                              <textarea
                                rows={2}
                                value={it.detalle}
                                onChange={e => handleUpdateItem(it.itemId, { detalle: e.target.value })}
                                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                              />
                            </div>

                            <div>
                              <input
                                type="text"
                                placeholder="Nota personalizada (ej: usar almohada bajo cuello, no sobrepasar 90°)..."
                                value={it.notaItem}
                                onChange={e => handleUpdateItem(it.itemId, { notaItem: e.target.value })}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                              />
                            </div>
                          </div>

                          {it.progresion && (
                            <div className="mt-2 text-[11px] text-slate-600 bg-slate-100/70 p-2 rounded-lg border border-slate-200/60">
                              <span className="font-semibold text-slate-800">📈 Progresión clínica:</span>{' '}
                              {it.progresion}
                            </div>
                          )}
                        </div>

                        {/* Order & Delete Controls */}
                        <div className="flex flex-col gap-1 items-center shrink-0">
                          <button
                            onClick={() => handleMoveItem(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer text-xs"
                            title="Mover arriba"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveItem(idx, 1)}
                            disabled={idx === items.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer text-xs"
                            title="Mover abajo"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => handleRemoveItem(it.itemId)}
                            className="p-1 text-red-500 hover:text-red-700 cursor-pointer text-xs font-bold"
                            title="Eliminar de la pauta"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Digitopuntura Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Digitopuntura Anatómica Complementaria
              </h2>
              <p className="text-xs text-slate-500">
                Puntos seleccionados según diagnóstico para alivio neuromodular en domicilio.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Grupo de diagnóstico sugerido
              </label>
              <select
                value={digitoGrupoId}
                onChange={e => handleSelectDigitoGroup(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
              >
                <option value="">Sin digitopuntura complementaria</option>
                {DIGITO_REGIONES.map(([region, ids]) => (
                  <optgroup key={region} label={region}>
                    {ids.map(id => {
                      const g = DIGITO_GROUPS.find(x => x.id === id);
                      return g ? (
                        <option key={g.id} value={g.id}>
                          {g.nombre}
                        </option>
                      ) : null;
                    })}
                  </optgroup>
                ))}
              </select>

              {suggestedGroup && digitoGrupoId !== suggestedGroup.id && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-2">
                  <span>
                    💡 Sugerido para tu diagnóstico: <b>{suggestedGroup.nombre}</b>
                  </span>
                  <button
                    onClick={() => handleSelectDigitoGroup(suggestedGroup.id)}
                    className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-semibold rounded-lg shrink-0 cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
              )}
            </div>

            {/* Points list */}
            {digitoPuntos.length > 0 && (
              <div className="space-y-3 pt-2">
                {digitoPuntos.map((pt, pIdx) => {
                  const svgRaw = renderPointSvg(pt.cod, 130);
                  const userPhoto = puntoFotos[pt.cod];

                  return (
                    <div
                      key={pt.cod}
                      className="p-3.5 rounded-xl border border-purple-200/70 bg-purple-50/20 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        {/* Scheme and Photo */}
                        <div className="flex items-center gap-2 shrink-0">
                          {svgRaw && (
                            <div
                              dangerouslySetInnerHTML={{ __html: svgRaw }}
                              className="shrink-0 overflow-hidden rounded-lg shadow-xs"
                            />
                          )}
                          {userPhoto && (
                            <div className="shrink-0 text-center">
                              <img
                                src={userPhoto}
                                alt={pt.cod}
                                className="w-[110px] h-[100px] object-cover rounded-lg border border-purple-200 shadow-xs"
                              />
                              <button
                                onClick={() => onDeletePuntoFoto(pt.cod)}
                                className="text-[10px] text-red-600 hover:text-red-700 font-semibold block mt-1"
                              >
                                Quitar foto
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                              {pt.cod}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {pIdx + 1}. {pt.nombre}
                            </span>
                            {pt.emb && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-md">
                                ⚠️ Evitar en embarazo
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-600">
                            <b>Dónde:</b> {pt.ubic}
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 block">
                              Instrucción de autoaplicación:
                            </label>
                            <textarea
                              rows={2}
                              value={pt.uso}
                              onChange={e => {
                                const val = e.target.value;
                                setDigitoPuntos(prev =>
                                  prev.map((p, i) => (i === pIdx ? { ...p, uso: val } : p))
                                );
                              }}
                              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <a
                              href={ytPointUrl(pt)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-purple-700 hover:text-purple-800 font-semibold inline-flex items-center gap-1"
                            >
                              <span>▶ Video demostrativo</span>
                            </a>

                            <label className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold cursor-pointer">
                              📷 {userPhoto ? 'Cambiar foto' : 'Subir foto propia'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadPhoto(pt.cod, file);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* TCM Pattern Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Patrón de Medicina Tradicional China (Opcional)
            </h2>

            <div className="space-y-2">
              <div>
                <label htmlFor={tcmPatronId} className="sr-only">Seleccionar patrón de Medicina Tradicional China</label>
                <select
                  id={tcmPatronId}
                  value={tcmPatron}
                  onChange={e => setTcmPatron(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                >
                  <option value="">Sin patrón de MTC definido</option>
                  {TCM_PATRONES.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={tcmLenguaId} className="sr-only">Observación de lengua</label>
                  <input
                    id={tcmLenguaId}
                    type="text"
                    placeholder="Lengua (color, saburra, marcas)..."
                    value={tcmLengua}
                    onChange={e => setTcmLengua(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor={tcmPulsoId} className="sr-only">Observación de pulso</label>
                  <input
                    id={tcmPulsoId}
                    type="text"
                    placeholder="Pulso (en cuerda, fino, rápido)..."
                    value={tcmPulso}
                    onChange={e => setTcmPulso(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                  />
                </div>
              </div>

              {tcmPatron && (
                (() => {
                  const pat = TCM_PATRONES.find(x => x.id === tcmPatron);
                  if (!pat) return null;
                  return (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div>
                        <span className="font-bold text-slate-900">{pat.nombre}:</span>{' '}
                        <span className="text-slate-600">{pat.sintomas}</span>
                      </div>
                      <div className="text-slate-700">
                        <b>Principio de tratamiento:</b> <i>{pat.principio}</i>
                      </div>

                      {/* Variant point substitutions */}
                      {digitoPuntos.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="font-bold text-slate-800 block mb-1">
                            Puntos variantes para este patrón:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pat.variantes.map(vCod => {
                              const alreadyIn = digitoPuntos.some(p => p.cod === vCod);
                              const ptData = ALL_POINTS_MAP[vCod];
                              if (!ptData) return null;

                              return (
                                <button
                                  key={vCod}
                                  onClick={() => {
                                    if (alreadyIn) {
                                      triggerToast(`${vCod} ya está en la pauta.`);
                                      return;
                                    }
                                    // replace last point or append
                                    setDigitoPuntos(prev => {
                                      const copy = [...prev];
                                      copy[copy.length - 1] = { ...ptData, variante: true, patron: tcmPatron };
                                      return copy;
                                    });
                                    triggerToast(`Punto ${vCod} incorporado.`);
                                  }}
                                  className={`text-xs px-2 py-1 rounded-lg border font-semibold cursor-pointer ${
                                    alreadyIn
                                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-400'
                                  }`}
                                >
                                  {vCod} {alreadyIn ? '✓' : '+ sustituir'}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </section>

          {/* Frecuencia y Progresión 4 semanas */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Dosificación Semanal y Plan de 4 Semanas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor={frecuenciaId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Frecuencia de sesiones
                </label>
                <select
                  id={frecuenciaId}
                  value={frecuencia}
                  onChange={e => setFrecuencia(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                >
                  <option value={2}>2 días por semana</option>
                  <option value={3}>3 días por semana (recomendado)</option>
                  <option value={4}>4 días por semana</option>
                  <option value={5}>5 días por semana</option>
                </select>
              </div>

              <div>
                <label htmlFor={progModoId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Regla de progresión
                </label>
                <select
                  id={progModoId}
                  value={progModo}
                  onChange={e => setProgModo(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900"
                >
                  {Object.keys(PROG_MODOS).map(k => (
                    <option key={k} value={k}>
                      {PROG_MODOS[k].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <b>Itinerario clínico:</b> {PROG_MODOS[progModo]?.label}. Mantenga siempre al menos 24 a 48
              horas de descanso entre sesiones de fortalecimiento muscular.
            </p>
          </section>

          {/* Indicaciones Generales */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <label htmlFor={notasId} className="text-sm font-bold text-slate-900 block">
              Indicaciones Generales para el Paciente
            </label>
            <textarea
              id={notasId}
              rows={3}
              placeholder="Ej: Realizar los ejercicios después de aplicar calor suave en la zona lumbar. Hidratarse adecuadamente. Suspender si aparece dolor superior a 4/10..."
              value={notas}
              onChange={e => setNotas(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
            />
          </section>

          {/* Form Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            {formError ? (
              <div className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-200 flex-1">
                ⚠️ {formError}
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Al generar, la pauta se guardará automáticamente y abrirá la vista para descargar al celular.
              </div>
            )}

            <button
              onClick={handleGeneratePlan}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>Generar Pauta Clínica</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
