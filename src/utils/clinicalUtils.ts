import { ClinicalPlan } from '../types/clinical';
import { CATEGORIES, LEVEL_LABEL } from '../data/seedExercises';
import { DIGITO_GROUPS, ytPointUrl, DIGITO_TECNICA, DIGITO_GENERAL } from '../data/digitopunctureData';
import { TCM_PATRONES } from '../data/tcmPatternsData';

import { LOGO_DATA_URI } from './logoDataUri';
export { LOGO_DATA_URI };

export const AUTHORIZED_EMAILS: string[] = [
  'jcontreras.ktr@gmail.com',
  'gerald.barra369@gmail.com',
  'jorgehreyesa@gmail.com',
  'nicolas.cataldo.07@gmail.com',
  'titaelc@yahoo.es',
  'kat.cruz.kretulis@gmail.com',
  'contacto@acupuntura-chile.cl',
  'energia.plateada3311@gmail.com',
  'lucasguggiari27@gmail.com',
  'reservasacumaule@gmail.com',
  'jorgecastrogonzalez@gmail.com',
  'femoralesgo@gmail.com',
  'm.painecura.g@gmail.com'
];

export function isAuthorizedEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_EMAILS.some(e => e.toLowerCase() === normalized);
}

export function uid(): string {
  return 'x' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function todayStr(): string {
  const d = new Date();
  return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function isoHoy(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function fmtIso(iso?: string): string {
  const p = String(iso || '').split('-');
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : String(iso || '');
}

export function fmtIsoCorta(iso?: string): string {
  const p = String(iso || '').split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}` : String(iso || '');
}

export function diasDesde(iso?: string): number {
  const p = String(iso || '').split('-');
  if (p.length !== 3) return 0;
  return Math.floor((Date.now() - new Date(+p[0], +p[1] - 1, +p[2]).getTime()) / 86400000);
}

export function pacKey(n?: string): string {
  return String(n || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export function ytExerciseUrl(nombre: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    nombre + ' ejercicio kinesiologia rehabilitacion'
  )}`;
}

export function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let dim = 480;
        let q = 0.72;
        let out = '';
        for (let i = 0; i < 4; i++) {
          const s = Math.min(1, dim / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(img.width * s));
          c.height = Math.max(1, Math.round(img.height * s));
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, c.width, c.height);
            out = c.toDataURL('image/jpeg', q);
            if (out.length < 180000) break;
          }
          dim = Math.round(dim * 0.8);
          q = Math.max(0.5, q - 0.08);
        }
        resolve(out);
      };
      img.src = fr.result as string;
    };
    fr.readAsDataURL(file);
  });
}

export function planToWhatsAppText(plan: ClinicalPlan): string {
  const lines: string[] = [];
  lines.push('🏥 *AcupunturaChile — Pauta de Ejercicios*');
  lines.push('');
  lines.push(
    `*Paciente:* ${plan.paciente}${
      plan.edad ? ` (${plan.edad}${plan.sexo ? `, ${plan.sexo}` : ''})` : plan.sexo ? ` (${plan.sexo})` : ''
    }`
  );
  if (plan.diagnostico) lines.push(`*Diagnóstico / motivo:* ${plan.diagnostico}`);
  if (plan.profesional) lines.push(`*Profesional:* ${plan.profesional}`);
  lines.push(`*Fecha:* ${plan.fecha}`);
  lines.push('');

  const byCat: Record<string, typeof plan.items> = {
    flexibilidad: [],
    fortalecimiento: [],
    aerobico: []
  };
  plan.items.forEach(it => {
    if (byCat[it.categoria]) byCat[it.categoria].push(it);
  });

  (Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).forEach(cat => {
    if (!byCat[cat] || byCat[cat].length === 0) return;
    lines.push(`*— ${CATEGORIES[cat].label.toUpperCase()} —*`);
    byCat[cat].forEach((it, i) => {
      lines.push(`${i + 1}. *${it.nombre}* (${LEVEL_LABEL[it.nivel]})`);
      lines.push(`   📋 ${it.detalle}`);
      if (it.notaItem) lines.push(`   ℹ️ Nota: ${it.notaItem}`);
      lines.push(`   ▶️ Video: ${ytExerciseUrl(it.nombre)}`);
    });
    lines.push('');
  });

  if (plan.notas) {
    lines.push('*Indicaciones generales:*');
    lines.push(plan.notas);
    lines.push('');
  }

  // Progresión 4 semanas
  const PROG_FRASE: Record<string, string> = {
    sube2: 'Cada 2 semanas, si no hay dolor, suba un nivel de carga.',
    sube1: 'Cada semana, si no hay dolor, suba un nivel de carga.',
    mantener: 'Mantenga la misma carga durante las 4 semanas.'
  };
  lines.push(
    `📈 *PLAN DE 4 SEMANAS:* ${plan.frecuencia || 3} días por semana. ${
      PROG_FRASE[plan.progModo] || PROG_FRASE.sube2
    }`
  );
  lines.push('');

  // Digitopuntura
  if (plan.digito && plan.digito.puntos.length > 0) {
    const g = DIGITO_GROUPS.find(x => x.id === plan.digito?.grupoId);
    lines.push(`*— DIGITOPUNTURA${g ? ': ' + g.nombre.toUpperCase() : ''} —*`);
    plan.digito.puntos.forEach((p, i) => {
      lines.push(
        `${i + 1}. *${p.cod} · ${p.nombre}*${p.emb ? ' ⚠️ (no aplicar en embarazo)' : ''}`
      );
      lines.push(`   📍 Dónde: ${p.ubic}`);
      lines.push(`   👆 Cómo: ${p.uso}`);
      lines.push(`   ▶️ Video: ${ytPointUrl(p)}`);
    });
    lines.push('Presión firme pero tolerable, 30-60 segundos por punto, 1-2 veces al día.');
    lines.push('');
  }

  // Medicina Tradicional China
  if (plan.tcm && plan.tcm.patron) {
    const p = TCM_PATRONES.find(x => x.id === plan.tcm?.patron);
    if (p) {
      lines.push(`☯️ *RECOMENDACIONES COMPLEMENTARIAS (MTC):*`);
      lines.push(`• Autocuidado: ${p.autocuidado.slice(0, 2).join('; ')}.`);
      lines.push(`• Alimentación: ${p.dieta.slice(0, 2).join('; ')}.`);
      lines.push('');
    }
  }

  // Semáforo de seguridad
  lines.push('🚦 *CÓMO SABER SI VA BIEN:*');
  lines.push('🟢 Dolor 0-2/10: continúe y avance con normalidad.');
  lines.push('🟡 Dolor 3-5/10: repita la semana o baje un nivel de carga.');
  lines.push('🔴 Dolor >5/10, dolor en pecho, mareo o pérdida de fuerza: deténgase y consulte.');

  return lines.join('\n');
}

export function escapeHtml(s: string): string {
  return String(s || '').replace(/[&<>"']/g, c => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return c;
    }
  });
}

export function generateStandaloneMobileHtml(
  plan: ClinicalPlan,
  puntoFotos: Record<string, string> = {}
): string {
  const css = `
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;color:#0f172a;background:#f8fafc;line-height:1.5;-webkit-text-size-adjust:100%;}
    .wrap{background:#fff;border-radius:20px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,.08);border:1px solid #e2e8f0;}
    .hdr{border-bottom:3px solid #0284c7;padding-bottom:14px;margin-bottom:16px;display:flex;align-items:center;gap:14px;}
    .ex{border-left:4px solid #0284c7;padding:12px 14px;margin-bottom:12px;background:#f8fafc;border-radius:0 12px 12px 0;border-top:1px solid #f1f5f9;border-right:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9;}
    .ex.fort{border-left-color:#c2410c;} .ex.aero{border-left-color:#16a34a;} .ex.flex{border-left-color:#0284c7;}
    h2{font-size:1.1rem;font-weight:700;margin:22px 0 10px;color:#0f172a;}
    .muted{color:#64748b;font-size:.85rem;}
    a.yt{display:inline-block;margin-top:6px;background:#fee2e2;color:#b91c1c;font-weight:700;font-size:.82rem;padding:.35rem .75rem;border-radius:99px;text-decoration:none;}
    .reg{width:100%;border-collapse:collapse;font-size:.82rem;margin-top:8px;}
    .reg td,.reg th{border:1px solid #e2e8f0;padding:8px 4px;text-align:center;}
    .reg th{background:#f1f5f9;color:#475569;}
    .reg input[type=checkbox]{width:22px;height:22px;accent-color:#0284c7;cursor:pointer;}
    .reg select{font-size:.85rem;padding:4px;border-radius:6px;border:1px solid #cbd5e1;}
    .sem-box{border-left:5px solid;padding:7px 12px;margin-bottom:6px;border-radius:0 8px 8px 0;font-size:.85rem;}
    @media print{body{background:#fff;padding:0;} .wrap{box-shadow:none;border:none;padding:0;} .noprint{display:none;}}
  `;

  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const reg = `
    <h2>Mi registro semanal</h2>
    <p class="muted" style="margin:0 0 10px;">Marque los días que realizó su pauta y anote su nivel de dolor al finalizar cada semana. Se guarda automáticamente en este dispositivo.</p>
    <table class="reg">
      <thead><tr><th>Semana</th>${dias.map(d => `<th>${d}</th>`).join('')}<th>Dolor</th></tr></thead>
      <tbody>
        ${[1, 2, 3, 4]
          .map(
            s => `<tr>
            <td><b>Sem ${s}</b></td>
            ${dias
              .map(
                (d, i) =>
                  `<td><input type="checkbox" data-k="d${s}_${i}" aria-label="Semana ${s} ${d}"></td>`
              )
              .join('')}
            <td><select data-k="p${s}"><option value="">–</option>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              .map(n => `<option>${n}</option>`)
              .join('')}</select></td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  `;

  const script = `<script>
    (function(){
      var K = "pauta_" + ${JSON.stringify(String(plan.id || plan.paciente || 'x'))};
      var S = {};
      try{ S = JSON.parse(localStorage.getItem(K) || "{}"); }catch(e){}
      document.querySelectorAll("[data-k]").forEach(function(el){
        var k = el.getAttribute("data-k");
        if(el.type === "checkbox"){
          el.checked = !!S[k];
        } else if(S[k] !== undefined){
          el.value = S[k];
        }
        el.addEventListener("change", function(){
          S[k] = el.type === "checkbox" ? el.checked : el.value;
          try{ localStorage.setItem(K, JSON.stringify(S)); }catch(e){}
        });
      });
    })();
  <\/script>`;

  // Ejercicios html
  const byCat: Record<string, typeof plan.items> = {
    flexibilidad: [],
    fortalecimiento: [],
    aerobico: []
  };
  plan.items.forEach(it => {
    if (byCat[it.categoria]) byCat[it.categoria].push(it);
  });

  let exHtml = '';
  (Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).forEach(cat => {
    if (!byCat[cat] || byCat[cat].length === 0) return;
    exHtml += `<h2 style="color:${CATEGORIES[cat].sheetBorder};">${CATEGORIES[cat].label}</h2>`;
    byCat[cat].forEach((it, i) => {
      exHtml += `
        <div class="ex ${it.categoria === 'fortalecimiento' ? 'fort' : it.categoria === 'aerobico' ? 'aero' : 'flex'}">
          <div>
            <b>${i + 1}. ${escapeHtml(it.nombre)}</b> — <span class="muted">${LEVEL_LABEL[it.nivel]}</span><br>
            <span>${escapeHtml(it.detalle)}</span>
            ${it.notaItem ? `<br><i class="muted">Nota: ${escapeHtml(it.notaItem)}</i>` : ''}
            <br><a class="yt" href="${ytExerciseUrl(it.nombre)}" target="_blank" rel="noopener">▶ Ver video demostrativo</a>
          </div>
        </div>
      `;
    });
  });

  // Digitopuntura html
  let digitoHtml = '';
  if (plan.digito && plan.digito.puntos.length > 0) {
    const g = DIGITO_GROUPS.find(x => x.id === plan.digito?.grupoId);
    digitoHtml += `<h2 style="color:#7c3aed;">Digitopuntura${g ? ' — ' + escapeHtml(g.nombre) : ''}</h2>`;
    plan.digito.puntos.forEach((p, i) => {
      const userPhoto = puntoFotos[p.cod];
      digitoHtml += `
        <div style="border-left:4px solid #7c3aed;background:#f8fafc;padding:10px 14px;margin-bottom:10px;border-radius:0 12px 12px 0;display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;">
          ${
            userPhoto
              ? `<div><img src="${userPhoto}" alt="${escapeHtml(p.cod)}" style="width:120px;height:auto;border-radius:8px;border:1px solid #cbd5e1;"></div>`
              : ''
          }
          <div style="flex:1;min-width:180px;">
            <b>${i + 1}. ${escapeHtml(p.cod)} · ${escapeHtml(p.nombre)}</b>${
        p.emb ? ' <span style="color:#dc2626;font-size:.8rem;font-weight:bold;">⚠️ Evitar en embarazo</span>' : ''
      }<br>
            <span style="font-size:.88rem;"><b>Dónde:</b> ${escapeHtml(p.ubic)}</span><br>
            <span style="font-size:.88rem;"><b>Cómo:</b> ${escapeHtml(p.uso)}</span><br>
            <a class="yt" href="${ytPointUrl(p)}" target="_blank" rel="noopener">▶ Ver video del punto</a>
          </div>
        </div>
      `;
    });
    digitoHtml += `<p class="muted" style="font-size:.82rem;">${escapeHtml(DIGITO_TECNICA)}</p>`;
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Pauta — ${escapeHtml(plan.paciente)}</title>
  <style>${css}</style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <img src="${LOGO_DATA_URI}" alt="AcupunturaChile" style="width:54px;height:54px;border-radius:10px;object-fit:cover;">
      <div>
        <div style="font-size:1.25rem;font-weight:bold;color:#0f172a;">AcupunturaChile</div>
        <div class="muted">Pauta de Ejercicios y Rehabilitación</div>
      </div>
    </div>
    <div style="margin-bottom:14px;font-size:.9rem;">
      <b>Paciente:</b> ${escapeHtml(plan.paciente)}${plan.edad ? ` · <b>Edad:</b> ${escapeHtml(plan.edad)}` : ''}${
    plan.sexo ? ` · <b>Sexo:</b> ${escapeHtml(plan.sexo)}` : ''
  }<br>
      ${plan.diagnostico ? `<b>Diagnóstico:</b> ${escapeHtml(plan.diagnostico)}<br>` : ''}
      ${plan.profesional ? `<b>Profesional:</b> ${escapeHtml(plan.profesional)}<br>` : ''}
      <b>Fecha:</b> ${escapeHtml(plan.fecha)}
    </div>

    ${exHtml}

    ${plan.notas ? `<h2>Indicaciones generales</h2><p style="font-size:.9rem;">${escapeHtml(plan.notas).replace(/\n/g, '<br>')}</p>` : ''}

    <h2>Plan de 4 semanas</h2>
    <p style="font-size:.9rem;margin:0 0 10px;"><b>Frecuencia recomendada:</b> ${plan.frecuencia || 3} días por semana, con al menos un día de descanso entre sesiones de fortalecimiento.</p>

    ${digitoHtml}

    ${reg}

    <h2>Semáforo de seguridad</h2>
    <div class="sem-box" style="border-left-color:#16a34a;background:#f0fdf4;">🟢 <b>Verde (Dolor 0-2/10):</b> continúe con normalidad y avance gradualmente.</div>
    <div class="sem-box" style="border-left-color:#d97706;background:#fffbeb;">🟡 <b>Amarillo (Dolor 3-5/10):</b> reduzca repeticiones, descanse o baje de nivel.</div>
    <div class="sem-box" style="border-left-color:#dc2626;background:#fef2f2;">🔴 <b>Rojo (Dolor &gt;5/10, mareo, opresión torácica):</b> detenga la pauta y consulte a su profesional.</div>

    <p class="muted" style="margin-top:20px;text-align:center;">Los videos son referenciales; respete siempre la técnica y dosificación acordada en consulta.</p>
  </div>
  ${script}
</body>
</html>`;
}
