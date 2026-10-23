import React from 'react';
import { ClinicalPlan } from '../../types/clinical';
import { CATEGORIES, LEVEL_LABEL } from '../../data/seedExercises';
import { ExerciseIconBadge } from '../../data/exerciseIcons';
import {
  DIGITO_GROUPS,
  DIGITO_TECNICA,
  renderPointSvg,
  ytPointUrl,
  DIGITO_POS
} from '../../data/digitopunctureData';
import { TCM_PATRONES } from '../../data/tcmPatternsData';
import {
  LOGO_DATA_URI,
  generateStandaloneMobileHtml,
  ytExerciseUrl
} from '../../utils/clinicalUtils';

interface PlanSheetModalProps {
  plan: ClinicalPlan;
  puntoFotos: Record<string, string>;
  onClose: () => void;
}

export const PlanSheetModal: React.FC<PlanSheetModalProps> = ({
  plan,
  puntoFotos,
  onClose
}) => {
  const handleDownloadMobileHtml = () => {
    const htmlContent = generateStandaloneMobileHtml(plan, puntoFotos);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pauta_${plan.paciente.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Group items by category
  const byCat: Record<string, typeof plan.items> = {
    flexibilidad: [],
    fortalecimiento: [],
    aerobico: []
  };
  plan.items.forEach(it => {
    if (byCat[it.categoria]) byCat[it.categoria].push(it);
  });

  const tcmPatternObj = plan.tcm?.patron ? TCM_PATRONES.find(p => p.id === plan.tcm?.patron) : null;
  const digitoGroupObj = plan.digito?.grupoId ? DIGITO_GROUPS.find(g => g.id === plan.digito?.grupoId) : null;

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30">
        <button
          onClick={onClose}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>← Volver a Editar</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadMobileHtml}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            title="Descarga un archivo interactivo autónomo que funciona sin internet en el celular del paciente"
          >
            <span>📱 Descargar para Celular</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Card */}
      <div
        id="printable-sheet"
        className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-8 print:p-0 print:border-none print:shadow-none"
      >
        {/* Sheet Header */}
        <div className="border-b-2 border-blue-600 pb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={LOGO_DATA_URI}
              alt="AcupunturaChile"
              className="w-16 h-16 rounded-2xl object-contain border border-slate-200 shrink-0 bg-white p-1"
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                AcupunturaChile
              </h1>
              <p className="text-sm font-semibold text-blue-700">
                Pauta de Ejercicios Terapéuticos y Rehabilitación
              </p>
              <p className="text-xs text-slate-500">
                Programa personalizado de autoaplicación clínica y movimiento activo
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 hidden sm:block">
            <div className="font-bold text-slate-800">Fecha de emisión</div>
            <div>{plan.fecha}</div>
          </div>
        </div>

        {/* Patient Metadata Grid */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wider">
              Paciente
            </span>
            <span className="font-bold text-slate-900 text-sm">{plan.paciente}</span>
          </div>

          <div>
            <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wider">
              Edad / Sexo
            </span>
            <span className="font-semibold text-slate-800">
              {plan.edad || 'No especificada'}
              {plan.sexo ? ` · ${plan.sexo}` : ''}
            </span>
          </div>

          <div>
            <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wider">
              Profesional Tratante
            </span>
            <span className="font-semibold text-slate-800">
              {plan.profesional || 'AcupunturaChile'}
            </span>
          </div>

          {plan.diagnostico && (
            <div className="sm:col-span-2">
              <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wider">
                Diagnóstico / Motivo
              </span>
              <span className="font-semibold text-slate-900">{plan.diagnostico}</span>
            </div>
          )}

          <div>
            <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wider">
              Frecuencia Prescrita
            </span>
            <span className="font-bold text-blue-700">
              {plan.frecuencia || 3} días por semana
            </span>
          </div>
        </div>

        {/* Exercise Items Categorized */}
        <div className="space-y-6">
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(catKey => {
            const catItems = byCat[catKey];
            if (!catItems || catItems.length === 0) return null;
            const catDef = CATEGORIES[catKey];

            return (
              <div key={catKey} className="space-y-3 break-inside-avoid">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <h2 className="text-base font-bold text-slate-900">{catDef.label}</h2>
                  <span className="text-xs text-slate-400">({catItems.length} ejercicios)</span>
                </div>

                <div className="space-y-3">
                  {catItems.map((it, idx) => (
                    <div
                      key={it.itemId}
                      className="p-4 rounded-2xl bg-slate-50/70 border-l-4 border border-slate-200/80 flex items-start gap-4 break-inside-avoid"
                      style={{ borderLeftColor: catDef.sheetBorder }}
                    >
                      <ExerciseIconBadge iconKey={it.icon} exerciseName={it.nombre} size={42} />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">
                            {idx + 1}. {it.nombre}
                          </span>
                          <span className="text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {LEVEL_LABEL[it.nivel]}
                          </span>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          {it.detalle}
                        </p>

                        {it.notaItem && (
                          <p className="text-xs text-slate-600 italic">
                            <b>Nota:</b> {it.notaItem}
                          </p>
                        )}

                        <div className="pt-1">
                          <a
                            href={ytExerciseUrl(it.nombre)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                          >
                            <span>▶ Ver demostración en video</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* General Clinical Instructions */}
        {plan.notas && (
          <div className="space-y-2 break-inside-avoid">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
              Indicaciones Generales y Cuidados
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              {plan.notas}
            </div>
          </div>
        )}

        {/* 4-Week Progression Schedule & Compliance Table */}
        <div className="space-y-3 break-inside-avoid">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
            Planificación y Registro de Cumplimiento (4 Semanas)
          </h2>
          <p className="text-xs text-slate-600">
            Realice los ejercicios <b>{plan.frecuencia || 3} días por semana</b>, respetando al menos 24 horas de descanso entre sesiones de fortalecimiento. Registre su cumplimiento diario y califique su nivel de dolor al finalizar cada semana.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border border-slate-200 p-2 text-left">Semana</th>
                  <th className="border border-slate-200 p-2 text-center">Lun</th>
                  <th className="border border-slate-200 p-2 text-center">Mar</th>
                  <th className="border border-slate-200 p-2 text-center">Mié</th>
                  <th className="border border-slate-200 p-2 text-center">Jue</th>
                  <th className="border border-slate-200 p-2 text-center">Vie</th>
                  <th className="border border-slate-200 p-2 text-center">Sáb</th>
                  <th className="border border-slate-200 p-2 text-center">Dom</th>
                  <th className="border border-slate-200 p-2 text-center">Dolor final (0-10)</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map(sem => (
                  <tr key={sem} className="text-slate-800">
                    <td className="border border-slate-200 p-2 font-bold">Semana {sem}</td>
                    {[0, 1, 2, 3, 4, 5, 6].map(d => (
                      <td key={d} className="border border-slate-200 p-2 text-center text-slate-300">
                        ☐
                      </td>
                    ))}
                    <td className="border border-slate-200 p-2 text-center text-slate-400">
                      _____ / 10
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Digitopuntura Section */}
        {plan.digito && plan.digito.puntos.length > 0 && (
          <div className="space-y-4 break-inside-avoid">
            <div className="border-b border-purple-200 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-purple-900">
                Puntos de Digitopuntura Complementaria
                {digitoGroupObj && ` · ${digitoGroupObj.nombre}`}
              </h2>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Neuromodulación
              </span>
            </div>

            <p className="text-xs text-slate-600">{DIGITO_TECNICA}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {plan.digito.puntos.map((pt, idx) => {
                const svgRaw = renderPointSvg(pt.cod, 120);
                const userPhoto = puntoFotos[pt.cod];
                const pos = DIGITO_POS[pt.cod];

                return (
                  <div
                    key={pt.cod}
                    className="p-3.5 rounded-2xl bg-purple-50/20 border border-purple-200 flex flex-col justify-between space-y-3 break-inside-avoid"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">
                          {pt.cod}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {pos?.bil ? '↔ Ambos lados' : '● Línea media'}
                        </span>
                      </div>

                      <div className="font-bold text-sm text-slate-900">
                        {idx + 1}. {pt.nombre}
                      </div>

                      {pt.emb && (
                        <span className="text-[10px] font-bold text-red-600 block">
                          ⚠️ No aplicar en embarazo
                        </span>
                      )}

                      {/* Scheme & Photo */}
                      <div className="flex justify-center gap-2 py-1">
                        {svgRaw && (
                          <div
                            dangerouslySetInnerHTML={{ __html: svgRaw }}
                            className="rounded-lg overflow-hidden border border-slate-200 shadow-xs"
                          />
                        )}
                        {userPhoto && (
                          <img
                            src={userPhoto}
                            alt={pt.cod}
                            className="w-[100px] h-[95px] object-cover rounded-lg border border-purple-200"
                          />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-700">
                        <b>Dónde:</b> {pt.ubic}
                      </p>
                      <p className="text-[11px] text-slate-700">
                        <b>Cómo:</b> {pt.uso}
                      </p>
                    </div>

                    <a
                      href={ytPointUrl(pt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-purple-700 hover:text-purple-800 inline-flex items-center gap-1"
                    >
                      <span>▶ Video de ubicación</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Traditional Chinese Medicine */}
        {tcmPatternObj && (
          <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 break-inside-avoid text-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Orientación desde la Medicina Tradicional China</span>
              <span className="text-[11px] font-semibold text-slate-500">{tcmPatternObj.nombre}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <b className="text-slate-900 block mb-1">🌿 Recomendaciones de Autocuidado:</b>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {tcmPatternObj.autocuidado.map((ac, i) => (
                    <li key={i}>{ac}</li>
                  ))}
                </ul>
              </div>

              <div>
                <b className="text-slate-900 block mb-1">🥗 Orientación Nutricional:</b>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {tcmPatternObj.dieta.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Safety Traffic Light */}
        <div className="space-y-2.5 break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            Semáforo de Seguridad Durante el Ejercicio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 text-emerald-950">
              <b className="text-emerald-800 block">🟢 Verde (Dolor 0-2/10)</b>
              <span>Sin dolor o molestia leve. Continúe la pauta con normalidad.</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-amber-950">
              <b className="text-amber-800 block">🟡 Amarillo (Dolor 3-5/10)</b>
              <span>Dolor moderado que cede al minuto. Reduzca repeticiones o descanse.</span>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-950">
              <b className="text-red-800 block">🔴 Rojo (Dolor &gt;5/10)</b>
              <span>Dolor agudo, mareo, opresión. Detenga el ejercicio y consulte a su profesional.</span>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            <b>AcupunturaChile</b> · Terapia Física, Acupuntura & Kinesiología
          </div>
          <div className="text-center sm:text-right">
            Firma / Timbre del Profesional
          </div>
        </div>
      </div>
    </div>
  );
};
