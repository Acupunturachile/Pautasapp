import React, { useState } from 'react';
import {
  DIGITO_GROUPS,
  DIGITO_REGIONES,
  DIGITO_TECNICA,
  DIGITO_GENERAL,
  DIGITO_SEMAFORO,
  renderPointSvg,
  ytPointUrl,
  DIGITO_POS
} from '../../data/digitopunctureData';
import { TCM_PATRONES, TCM_POR_GRUPO, ALL_POINTS_MAP } from '../../data/tcmPatternsData';
import { resizeImageFile } from '../../utils/clinicalUtils';

interface DigitopunctureTabProps {
  puntoFotos: Record<string, string>;
  onSavePuntoFoto: (cod: string, dataUrl: string) => void;
  onDeletePuntoFoto: (cod: string) => void;
  onApplyToCurrentDraft?: (groupId: string, patternId?: string) => void;
}

export const DigitopunctureTab: React.FC<DigitopunctureTabProps> = ({
  puntoFotos,
  onSavePuntoFoto,
  onDeletePuntoFoto,
  onApplyToCurrentDraft
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('cervical');
  const [selectedPatternId, setSelectedPatternId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const selectedGroup = DIGITO_GROUPS.find(g => g.id === selectedGroupId) || DIGITO_GROUPS[0];
  const relatedPatterns = TCM_POR_GRUPO[selectedGroupId] || [];
  const selectedPattern = TCM_PATRONES.find(p => p.id === selectedPatternId);

  const handleUploadPhoto = async (cod: string, file: File) => {
    try {
      const dataUrl = await resizeImageFile(file);
      onSavePuntoFoto(cod, dataUrl);
      triggerToast(`Foto para ${cod} guardada.`);
    } catch (e) {
      triggerToast('Error al procesar la imagen.');
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Header Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Guía Clínica de Digitopuntura por Región
            </h2>
            <p className="text-xs text-slate-500">
              Esquemas anatómicos de precisión para neuromodulación periférica y analgesia refleja.
            </p>
          </div>

          {onApplyToCurrentDraft && (
            <button
              onClick={() => {
                onApplyToCurrentDraft(selectedGroupId, selectedPatternId);
                triggerToast(`Puntos de ${selectedGroup.nombre} aplicados a la pauta.`);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              Aplicar a Pauta Actual →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seleccione la región o diagnóstico
            </label>
            <select
              value={selectedGroupId}
              onChange={e => {
                setSelectedGroupId(e.target.value);
                setSelectedPatternId('');
              }}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patrón de Medicina China (MTC)
            </label>
            <select
              value={selectedPatternId}
              onChange={e => setSelectedPatternId(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Seleccionar patrón de MTC...</option>
              {relatedPatterns.length > 0 && (
                <optgroup label="Frecuentes en este diagnóstico">
                  {relatedPatterns.map(pId => {
                    const pat = TCM_PATRONES.find(x => x.id === pId);
                    return pat ? (
                      <option key={pat.id} value={pat.id}>
                        {pat.nombre}
                      </option>
                    ) : null;
                  })}
                </optgroup>
              )}
              <optgroup label="Otros Patrones">
                {TCM_PATRONES.filter(p => !relatedPatterns.includes(p.id)).map(pat => (
                  <option key={pat.id} value={pat.id}>
                    {pat.nombre}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Technique Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
          <span className="font-bold text-slate-900">📌 Técnica de Autoaplicación:</span> {DIGITO_TECNICA}
        </div>
      </div>

      {/* Points Detail Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Puntos Anatómicos Clave · {selectedGroup.nombre}</span>
          <span className="text-xs text-slate-400 font-normal">
            {selectedGroup.puntos.length} puntos seleccionados
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedGroup.puntos.map((pt, i) => {
            const svgRaw = renderPointSvg(pt.cod, 160);
            const userPhoto = puntoFotos[pt.cod];
            const pos = DIGITO_POS[pt.cod];

            return (
              <div
                key={pt.cod}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">
                        {pt.cod}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {i + 1}. {pt.nombre}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {pos?.bil ? '↔ Ambos lados' : '● Línea media'}
                    </span>
                  </div>

                  {pt.emb && (
                    <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5">
                      <span>⚠️</span> Contraindicado en el embarazo
                    </div>
                  )}

                  {/* Schemes: SVG + Photo */}
                  <div className="flex gap-3 items-start justify-center py-1">
                    {svgRaw && (
                      <div className="text-center">
                        <div
                          dangerouslySetInnerHTML={{ __html: svgRaw }}
                          className="shadow-xs rounded-xl overflow-hidden"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Esquema anatómico
                        </span>
                      </div>
                    )}

                    {userPhoto && (
                      <div className="text-center">
                        <img
                          src={userPhoto}
                          alt={pt.cod}
                          className="w-[140px] h-[130px] object-cover rounded-xl border border-slate-200 shadow-xs"
                        />
                        <button
                          onClick={() => onDeletePuntoFoto(pt.cod)}
                          className="text-[10px] text-red-600 hover:text-red-700 font-semibold mt-1 block w-full text-center cursor-pointer"
                        >
                          Quitar foto
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Anatomical Details */}
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-700">
                      <b className="text-slate-900">Ubicación precisa:</b> {pt.ubic}
                    </p>
                    <p className="text-slate-700">
                      <b className="text-slate-900">Presión y maniobra:</b> {pt.uso}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={ytPointUrl(pt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                  >
                    <span>▶ Ver en YouTube</span>
                  </a>

                  <label className="text-blue-700 hover:text-blue-800 font-semibold cursor-pointer">
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
            );
          })}
        </div>

        {selectedGroup.precaucion && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <b>Precaución para esta zona:</b> {selectedGroup.precaucion}
          </div>
        )}
      </div>

      {/* TCM Pattern Detail Card */}
      {selectedPattern && (
        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                Patrón Energético de Medicina Tradicional China
              </span>
              <h3 className="text-base font-bold text-slate-900">{selectedPattern.nombre}</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">
              {selectedPattern.principio}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">{selectedPattern.sintomas}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <b className="text-slate-900">Signos de lengua:</b>{' '}
              <span className="text-slate-700">{selectedPattern.lengua}</span>
            </div>
            <div>
              <b className="text-slate-900">Signos de pulso:</b>{' '}
              <span className="text-slate-700">{selectedPattern.pulso}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1.5">
              <span className="font-bold text-purple-900 block">🌿 Pautas de Autocuidado</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {selectedPattern.autocuidado.map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1.5">
              <span className="font-bold text-emerald-900 block">🥗 Orientación Nutricional</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {selectedPattern.dieta.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Variant Points in this Pattern */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 block mb-2">
              Puntos de acupresión complementarios recomendados en este patrón:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedPattern.variantes.map(vCod => {
                const pt = ALL_POINTS_MAP[vCod];
                if (!pt) return null;
                return (
                  <div
                    key={vCod}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2"
                  >
                    <span className="font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                      {vCod}
                    </span>
                    <span className="font-semibold text-slate-800">{pt.nombre}</span>
                    <span className="text-[11px] text-slate-500">({pt.ubic.slice(0, 35)}...)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Acupressure Safety Traffic Light */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">
          Semáforo de Seguridad en la Presión de Puntos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DIGITO_SEMAFORO.map(s => (
            <div
              key={s.color}
              className="p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs"
              style={{ backgroundColor: s.bg, borderLeftColor: s.color, borderLeftWidth: 4 }}
            >
              <div className="font-bold" style={{ color: s.color }}>
                {s.emoji} {s.titulo}
              </div>
              <p className="text-slate-700">{s.criterio}</p>
              <p className="text-slate-600 italic">{s.accion}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-2">{DIGITO_GENERAL}</p>
      </div>
    </div>
  );
};
