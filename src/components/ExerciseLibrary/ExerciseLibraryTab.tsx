import React, { useState } from 'react';
import { Exercise, ExerciseCategory } from '../../types/clinical';
import { AREAS, CATEGORIES, LEVEL_LABEL } from '../../data/seedExercises';
import { ExerciseIconBadge, ICON_LABEL, RAW_ICONS } from '../../data/exerciseIcons';
import { ytExerciseUrl } from '../../utils/clinicalUtils';

interface ExerciseLibraryTabProps {
  exercises: Exercise[];
  onSaveExercise: (ex: Omit<Exercise, 'id'> & { id?: string }) => void;
  onDeleteExercise: (id: string) => void;
}

export const ExerciseLibraryTab: React.FC<ExerciseLibraryTabProps> = ({
  exercises,
  onSaveExercise,
  onDeleteExercise
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('todas');
  const [selectedArea, setSelectedArea] = useState<string>('todas');

  // Edit / Create state
  const [isEditing, setIsEditing] = useState(false);
  const [editingEx, setEditingEx] = useState<Partial<Exercise> | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const handleStartCreate = () => {
    setEditingEx({
      nombre: '',
      categoria: 'flexibilidad',
      area: 'Cervical',
      icon: 'seated_stretch',
      descripcion: '',
      niveles: {
        bajo: '2 series x 8 rep, ritmo suave',
        moderado: '3 series x 10 rep, ritmo continuo',
        alto: '3 series x 12-15 rep con resistencia'
      },
      progresion: 'Avanzar repeticiones y tiempo antes de aumentar la carga.'
    });
    setFormError('');
    setIsEditing(true);
  };

  const handleStartEdit = (ex: Exercise) => {
    setEditingEx({ ...ex });
    setFormError('');
    setIsEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEx?.nombre?.trim()) {
      setFormError('El nombre del ejercicio es obligatorio.');
      return;
    }
    if (!editingEx?.descripcion?.trim()) {
      setFormError('La descripción del ejercicio es obligatoria.');
      return;
    }

    onSaveExercise({
      id: editingEx.id,
      nombre: editingEx.nombre.trim(),
      categoria: (editingEx.categoria as ExerciseCategory) || 'flexibilidad',
      area: editingEx.area || 'General / cuerpo completo',
      icon: editingEx.icon || 'standing_stretch',
      descripcion: editingEx.descripcion.trim(),
      niveles: {
        bajo: editingEx.niveles?.bajo?.trim() || 'A definir',
        moderado: editingEx.niveles?.moderado?.trim() || 'A definir',
        alto: editingEx.niveles?.alto?.trim() || 'A definir'
      },
      progresion: editingEx.progresion?.trim() || ''
    });

    setIsEditing(false);
    setEditingEx(null);
  };

  const filtered = exercises.filter(ex => {
    if (selectedCat !== 'todas' && ex.categoria !== selectedCat) return false;
    if (selectedArea !== 'todas' && ex.area !== selectedArea) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ex.nombre.toLowerCase().includes(q) ||
        ex.area.toLowerCase().includes(q) ||
        ex.descripcion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder="Buscar en el catálogo de ejercicios..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />

          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700"
          >
            <option value="todas">Todas las categorías</option>
            {(Object.keys(CATEGORIES) as ExerciseCategory[]).map(cat => (
              <option key={cat} value={cat}>
                {CATEGORIES[cat].label}
              </option>
            ))}
          </select>

          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700"
          >
            <option value="todas">Todas las áreas</option>
            {AREAS.map(ar => (
              <option key={ar} value={ar}>
                {ar}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
        >
          <span>+ Nuevo Ejercicio</span>
        </button>
      </div>

      {/* Edit / Create Modal */}
      {isEditing && editingEx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingEx.id ? 'Editar Ejercicio' : 'Nuevo Ejercicio para la Biblioteca'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingEx(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre del Ejercicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEx.nombre || ''}
                    onChange={e => setEditingEx({ ...editingEx, nombre: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                    placeholder="Ej: Estiramiento de psoas ilíaco..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={editingEx.categoria || 'flexibilidad'}
                    onChange={e =>
                      setEditingEx({
                        ...editingEx,
                        categoria: e.target.value as ExerciseCategory
                      })
                    }
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  >
                    {(Object.keys(CATEGORIES) as ExerciseCategory[]).map(cat => (
                      <option key={cat} value={cat}>
                        {CATEGORIES[cat].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Área Anatómica
                  </label>
                  <select
                    value={editingEx.area || 'General / cuerpo completo'}
                    onChange={e => setEditingEx({ ...editingEx, area: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  >
                    {AREAS.map(a => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Icono Representativo
                  </label>
                  <select
                    value={editingEx.icon || 'standing_stretch'}
                    onChange={e => setEditingEx({ ...editingEx, icon: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  >
                    {Object.keys(RAW_ICONS).map(k => (
                      <option key={k} value={k}>
                        {ICON_LABEL[k] || k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción / Técnica de Ejecución <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={editingEx.descripcion || ''}
                  onChange={e => setEditingEx({ ...editingEx, descripcion: e.target.value })}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  placeholder="Instrucción postural, alineación y precauciones biomecánicas..."
                />
              </div>

              {/* Levels */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Dosificación por Niveles de Carga
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Carga Baja (adaptación / fase aguda):
                  </label>
                  <input
                    type="text"
                    value={editingEx.niveles?.bajo || ''}
                    onChange={e =>
                      setEditingEx({
                        ...editingEx,
                        niveles: {
                          ...editingEx.niveles!,
                          bajo: e.target.value
                        }
                      })
                    }
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Carga Moderada (fase subaguda / progresión):
                  </label>
                  <input
                    type="text"
                    value={editingEx.niveles?.moderado || ''}
                    onChange={e =>
                      setEditingEx({
                        ...editingEx,
                        niveles: {
                          ...editingEx.niveles!,
                          moderado: e.target.value
                        }
                      })
                    }
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Carga Alta (consolidación / entrenamiento funcional):
                  </label>
                  <input
                    type="text"
                    value={editingEx.niveles?.alto || ''}
                    onChange={e =>
                      setEditingEx({
                        ...editingEx,
                        niveles: {
                          ...editingEx.niveles!,
                          alto: e.target.value
                        }
                      })
                    }
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Criterio de Progresión Clínica
                </label>
                <input
                  type="text"
                  value={editingEx.progresion || ''}
                  onChange={e => setEditingEx({ ...editingEx, progresion: e.target.value })}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                  placeholder="Ej: Aumentar el tiempo de mantención antes de subir series..."
                />
              </div>

              {formError && (
                <div className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  ⚠️ {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingEx(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Guardar en Biblioteca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ex => {
          const catDef = CATEGORIES[ex.categoria];

          return (
            <div
              key={ex.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ExerciseIconBadge iconKey={ex.icon} exerciseName={ex.nombre} size={40} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${catDef.badgeClass}`}
                      >
                        {catDef.label}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{ex.area}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{ex.nombre}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{ex.descripcion}</p>

                {/* Dosages Table */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-[11px]">
                  <div>
                    <span className="font-bold text-blue-700">Baja:</span>{' '}
                    <span className="text-slate-700">{ex.niveles.bajo}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Moderada:</span>{' '}
                    <span className="text-slate-700">{ex.niveles.moderado}</span>
                  </div>
                  <div>
                    <span className="font-bold text-amber-800">Alta:</span>{' '}
                    <span className="text-slate-700">{ex.niveles.alto}</span>
                  </div>
                </div>

                {ex.progresion && (
                  <div className="text-[11px] text-slate-500 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">Progresión:</span> {ex.progresion}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={ytExerciseUrl(ex.nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                >
                  <span>▶ Video YouTube</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(ex)}
                    className="p-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                    title="Editar ejercicio"
                  >
                    ✎ Editar
                  </button>

                  {confirmDeleteId === ex.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onDeleteExercise(ex.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold cursor-pointer"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-slate-600 text-[10px] cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(ex.id)}
                      className="p-1.5 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Eliminar de la biblioteca"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
