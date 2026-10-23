import React from 'react';

function svgWrap(inner: string, size = 56): React.ReactElement {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#0369a1"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

const HD = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="7" fill="#0284c7" stroke="none"/>`;
const AC = 'stroke="#0f766e" stroke-width="3"';
const ah = (x: number, y: number, dx: number, dy: number) => {
  const l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, px = -uy, py = ux;
  return `<path d="M${(x - 7 * ux + 4.5 * px).toFixed(1)} ${(y - 7 * uy + 4.5 * py).toFixed(1)} L${x} ${y} L${(x - 7 * ux - 4.5 * px).toFixed(1)} ${(y - 7 * uy - 4.5 * py).toFixed(1)}" ${AC}/>`;
};
const ar = (x1: number, y1: number, x2: number, y2: number) => `<path d="M${x1} ${y1} L${x2} ${y2}" ${AC}/>` + ah(x2, y2, x2 - x1, y2 - y1);
const arc = (d: string, x: number, y: number, dx: number, dy: number) => `<path d="${d}" ${AC}/>` + ah(x, y, dx, dy);
const floor = (y: number) => `<path d="M8 ${y} L92 ${y}" stroke="#cbd5e1" stroke-width="3"/>`;
const chair = `<path d="M34 62 L72 62 M34 40 L34 62 M36 62 L36 88 M70 62 L70 88" stroke-width="3"/>`;

export const RAW_ICONS: Record<string, string> = {
  // Base
  seated_stretch: '<circle cx="42" cy="24" r="8" fill="#0284c7" stroke="none"/><path d="M42 32 L42 55 L60 70"/><path d="M42 55 L25 68"/><path d="M42 40 L65 30"/><path d="M25 68 L20 78 M60 70 L68 78"/><path d="M15 78 L85 78"/>',
  standing_stretch: '<circle cx="50" cy="18" r="8" fill="#0284c7" stroke="none"/><path d="M50 26 L50 60"/><path d="M50 60 L38 90 M50 60 L62 90"/><path d="M50 34 L30 20"/><path d="M30 20 L26 40"/><path d="M50 34 L70 45"/>',
  supine_stretch: '<circle cx="18" cy="55" r="8" fill="#0284c7" stroke="none"/><path d="M26 55 L55 55"/><path d="M55 55 L60 30 L70 15"/><path d="M55 55 L80 60"/><path d="M15 78 L85 78"/>',
  lunge_stretch: '<circle cx="50" cy="16" r="8" fill="#0284c7" stroke="none"/><path d="M50 24 L48 50"/><path d="M48 50 L30 62 L24 85"/><path d="M48 50 L68 58 L70 85"/><path d="M50 30 L34 22 M50 30 L66 40"/>',
  isometric: '<circle cx="30" cy="24" r="8" fill="#0284c7" stroke="none"/><path d="M30 32 L30 55 L55 62"/><path d="M55 62 L82 60"/><path d="M30 45 L52 40"/><path d="M70 55 L74 65 M78 55 L82 65"/>',
  band_exercise: '<circle cx="50" cy="16" r="8" fill="#0284c7" stroke="none"/><path d="M50 24 L50 58"/><path d="M50 58 L38 88 M50 58 L62 88"/><path d="M50 32 L28 40 Q18 44 22 55"/><path d="M50 32 L72 40 Q82 44 78 55"/>',
  bridge: '<circle cx="20" cy="62" r="8" fill="#0284c7" stroke="none"/><path d="M28 62 L45 62 L62 42 L80 44"/><path d="M45 62 L48 82"/><path d="M62 42 L66 82"/>',
  side_lying: '<circle cx="16" cy="50" r="8" fill="#0284c7" stroke="none"/><path d="M24 50 L55 50"/><path d="M55 50 L80 34"/><path d="M40 50 L44 80"/>',
  plank_core: '<circle cx="18" cy="46" r="8" fill="#0284c7" stroke="none"/><path d="M26 48 L80 60"/><path d="M26 48 L18 68"/><path d="M80 60 L86 75"/>',
  squat_strength: '<circle cx="50" cy="16" r="8" fill="#0284c7" stroke="none"/><path d="M50 24 L50 48"/><path d="M50 48 L34 62 L34 85"/><path d="M50 48 L66 62 L66 85"/><path d="M50 30 L30 34 M50 30 L70 34"/>',
  calf_raise: '<circle cx="50" cy="14" r="8" fill="#0284c7" stroke="none"/><path d="M50 22 L50 62"/><path d="M50 62 L40 82 L40 88"/><path d="M50 62 L60 82 L60 88"/><path d="M50 30 L36 42 M50 30 L64 42"/>',
  cardio_walk: '<circle cx="46" cy="16" r="8" fill="#0284c7" stroke="none"/><path d="M46 24 L48 55"/><path d="M48 55 L32 80"/><path d="M48 55 L68 75"/><path d="M46 32 L30 45 M46 32 L66 26"/>',
  cardio_cycle: '<circle cx="70" cy="70" r="14"/><circle cx="26" cy="70" r="14"/><circle cx="55" cy="24" r="8" fill="#0284c7" stroke="none"/><path d="M55 32 L45 55 L70 70 M45 55 L26 70 M45 55 L62 45"/>',
  cardio_step: '<rect x="55" y="66" width="30" height="16"/><circle cx="45" cy="18" r="8" fill="#0284c7" stroke="none"/><path d="M45 26 L48 50"/><path d="M48 50 L65 66"/><path d="M48 50 L30 75"/>',
  cardio_pool: '<circle cx="46" cy="34" r="8" fill="#0284c7" stroke="none"/><path d="M46 42 L48 62"/><path d="M48 62 L34 74"/><path d="M48 62 L64 72"/><path d="M10 78 Q22 72 34 78 T58 78 T82 78"/>',

  // Specific anatomical
  cervical_flexext: HD(44, 22) + '<path d="M42 31 L40 60 L62 60 L62 86"/><path d="M40 42 L52 54"/>' + chair + arc('M60 12 Q72 22 62 34', 62, 34, -3, 5),
  trapecio_lateral: HD(57, 20) + '<path d="M50 30 L54 27"/><path d="M34 36 L66 36"/><path d="M50 30 L50 66"/><path d="M66 36 L72 24 L60 16"/><path d="M34 36 L30 58"/>' + ar(32, 38, 32, 52) + '<path d="M50 66 L40 90 M50 66 L60 90"/>',
  pendulo_hombro: HD(26, 40) + '<path d="M32 46 L58 62"/><path d="M58 62 L54 90 M58 62 L68 90"/><path d="M40 52 L36 74"/><path d="M34 56 L20 60 L8 60" stroke-width="3"/>' + arc('M26 80 A9 9 0 1 1 42 80', 42, 80, 3, 4),
  capsular_hombro: HD(50, 16) + '<path d="M50 24 L50 60"/><path d="M50 60 L40 90 M50 60 L60 90"/><path d="M58 32 L32 38"/><path d="M42 32 L62 44 L40 40"/>' + ar(30, 44, 40, 40),
  rotacion_tronco: HD(46, 22) + '<path d="M44 31 L42 60 L62 60 L62 86"/><path d="M42 40 L54 44 L44 48"/>' + chair + arc('M28 34 Q42 20 58 30', 58, 30, 5, 3),
  zancada_cadera: '<circle cx="50" cy="16" r="8" fill="#0284c7" stroke="none"/><path d="M50 24 L48 50"/><path d="M48 50 L30 62 L24 85"/><path d="M48 50 L68 58 L70 85"/><path d="M50 30 L34 22 M50 30 L66 40"/>' + ar(36, 46, 50, 52),
  isquios_supino: HD(14, 62) + '<path d="M22 62 L52 62"/><path d="M52 62 L86 62"/><path d="M52 62 L66 26"/><path d="M30 60 L60 44"/>' + arc('M74 26 Q70 14 58 14', 58, 14, -5, 0) + floor(80),
  rodilla_flexext: chair + HD(44, 22) + '<path d="M42 31 L40 60 L62 60"/><path d="M62 60 L88 50"/><path d="M42 42 L52 54"/>' + arc('M66 78 Q84 74 88 60', 88, 60, 2, -5),
  tobillo_pared: '<path d="M84 8 L84 90" stroke-width="3"/>' + HD(44, 18) + '<path d="M44 26 L46 58"/><path d="M44 34 L80 38"/><path d="M46 58 L66 72 L64 90"/><path d="M46 58 L26 90"/>' + ar(60, 66, 74, 66),
  isometrico_cuad: HD(24, 34) + '<path d="M26 42 L30 62 L84 62"/><path d="M28 52 L20 66"/><circle cx="56" cy="67" r="5"/>' + ar(46, 48, 46, 57) + ar(68, 48, 68, 57) + floor(76),
  sentadilla_asistida: '<path d="M18 28 L18 64 M18 64 L34 64 M20 64 L20 88" stroke-width="3"/>' + HD(46, 22) + '<path d="M46 30 L54 52"/><path d="M54 52 L72 62 L68 88"/><path d="M48 36 L22 42"/>',
  puente: HD(20, 62) + '<path d="M28 62 L45 62 L62 42 L80 44"/><path d="M45 62 L48 82"/><path d="M62 42 L66 82"/>' + ar(56, 34, 56, 22) + floor(86),
  abduccion_lateral: HD(16, 50) + '<path d="M24 50 L52 50"/><path d="M52 50 L80 58"/><path d="M52 50 L84 32"/><path d="M36 50 L40 70"/>' + ar(88, 52, 88, 38) + floor(78),
  elevacion_talones: HD(50, 14) + '<path d="M50 22 L50 62"/><path d="M50 62 L42 84 L48 90"/><path d="M50 62 L58 84 L64 90"/><path d="M50 30 L34 44 M50 30 L66 44"/>' + ar(26, 76, 26, 60) + ar(74, 76, 74, 60),
  remo_banda: HD(40, 16) + '<path d="M40 24 L40 58"/><path d="M40 58 L30 90 M40 58 L50 90"/><path d="M40 34 L26 46 L34 40"/><path d="M34 40 L90 40" stroke="#0f766e" stroke-width="3" stroke-dasharray="5 4"/><circle cx="90" cy="40" r="3" fill="#0f766e" stroke="none"/>' + ar(60, 52, 40, 52),
  rot_externa_banda: HD(50, 16) + '<path d="M50 24 L50 60"/><path d="M50 60 L40 90 M50 60 L60 90"/><path d="M50 32 L42 50 L58 52"/>' + arc('M60 58 Q36 66 26 50', 26, 50, -3, -6) + '<path d="M26 50 L8 50" stroke="#0f766e" stroke-width="3" stroke-dasharray="4 3"/>',
  plancha: '<circle cx="18" cy="46" r="8" fill="#0284c7" stroke="none"/><path d="M26 48 L80 60"/><path d="M26 48 L18 68"/><path d="M80 60 L86 75"/>' + floor(78),
  mckenzie: HD(24, 38) + '<path d="M30 48 L54 70 L88 72"/><path d="M34 54 L34 74"/>' + ar(18, 60, 18, 50) + floor(78),
  caminata: '<circle cx="46" cy="16" r="8" fill="#0284c7" stroke="none"/><path d="M46 24 L48 55"/><path d="M48 55 L32 80"/><path d="M48 55 L68 75"/><path d="M46 32 L30 45 M46 32 L66 26"/>' + floor(88),
  retraccion_escapular: HD(50, 16) + '<path d="M32 34 L68 34"/><path d="M50 24 L50 62"/><path d="M32 34 L24 46 L34 52"/><path d="M68 34 L76 46 L66 52"/>' + ar(32, 42, 44, 42) + ar(68, 42, 56, 42) + '<path d="M50 62 L42 90 M50 62 L58 90"/>',
  pectoral_marco: '<path d="M16 8 L16 92 M16 8 L40 8" stroke-width="3"/>' + HD(52, 18) + '<path d="M52 26 L54 58"/><path d="M52 32 L30 32 L28 12"/><path d="M54 58 L40 90 M54 58 L68 90"/>' + ar(66, 40, 52, 40),
  gato_camello: HD(22, 44) + '<path d="M28 48 Q52 28 74 48"/><path d="M30 48 L30 80 M74 48 L74 80"/>' + ar(88, 34, 88, 22) + ar(88, 44, 88, 56) + floor(86),
  bird_dog: HD(30, 38) + '<path d="M36 46 L68 46"/><path d="M40 46 L40 78 M64 46 L64 78"/><path d="M36 44 L8 40"/><path d="M68 46 L94 52"/>' + floor(86),
  gemelo_pared: '<path d="M86 8 L86 90" stroke-width="3"/>' + HD(46, 18) + '<path d="M46 26 L48 56"/><path d="M46 34 L82 36"/><path d="M48 56 L64 70 L66 90"/><path d="M48 56 L24 90"/>' + ar(18, 70, 18, 86),
  equilibrio_monopodal: HD(50, 16) + '<path d="M50 24 L50 56"/><path d="M50 56 L50 90"/><path d="M50 56 L68 66 L62 80"/><path d="M50 34 L24 38 M50 34 L76 38"/>' + floor(90),
  muneca_estiramiento: '<path d="M10 40 L58 40"/><path d="M58 40 L68 62"/><path d="M90 66 L72 60" stroke-width="4"/>' + arc('M70 44 Q80 50 74 58', 74, 58, -2, 3),
  muneca_excentrico: '<path d="M8 62 L66 62" stroke-width="3"/><path d="M12 50 L58 50 L74 52"/><path d="M76 40 L76 62 M70 44 L82 44 M70 58 L82 58" stroke-width="3"/>' + arc('M86 56 Q94 48 86 38', 86, 38, -3, -4),
  respiracion: HD(14, 62) + '<path d="M22 62 L54 62 L66 44 L78 62"/><path d="M28 58 L42 52"/>' + ar(40, 50, 40, 38) + arc('M2 50 Q8 44 14 50', 14, 50, 5, 2) + floor(80),
  sentarse_pararse: '<path d="M30 60 L54 60 M32 60 L32 88 M52 60 L52 88 M30 36 L30 60" stroke-width="3"/>' + HD(46, 22) + '<path d="M46 30 L56 50"/><path d="M56 50 L66 60 L64 88"/><path d="M48 36 L72 40"/>' + ar(84, 72, 84, 50),
  piriforme_4: HD(14, 62) + '<path d="M22 62 L48 62"/><path d="M48 62 L62 38 L78 62"/><path d="M48 62 L70 44 L56 40"/><path d="M30 58 L56 46"/>' + floor(80),
  elevacion_pierna: HD(14, 62) + '<path d="M22 62 L50 62"/><path d="M50 62 L62 46 L66 62"/><path d="M50 62 L86 36"/>' + ar(90, 52, 90, 40) + floor(80),
  rodilla_pecho: HD(14, 62) + '<path d="M22 62 L50 62 L88 62"/><path d="M50 62 L36 44 L52 36"/><path d="M26 58 L42 44"/>' + floor(80),
  cuadriceps_pie: '<path d="M26 12 L26 92" stroke-width="3"/>' + HD(50, 16) + '<path d="M50 24 L50 56"/><path d="M50 56 L50 90"/><path d="M50 56 L54 76 L70 62"/><path d="M50 34 L68 52 L70 62"/><path d="M50 34 L30 32"/>' + ar(76, 70, 76, 60),
  pelota_pie: chair + HD(46, 20) + '<path d="M44 29 L42 60 L62 60 L62 80"/><path d="M62 80 L76 80"/><circle cx="68" cy="86" r="5"/>' + '<path d="M52 93 L88 93" ' + AC + '/>' + ah(88, 93, 1, 0) + ah(52, 93, -1, 0)
};

export const ICON_LABEL: Record<string, string> = {
  seated_stretch: 'Estiramiento sentado',
  standing_stretch: 'Estiramiento de pie',
  supine_stretch: 'Estiramiento acostado',
  lunge_stretch: 'Estiramiento en zancada',
  isometric: 'Isométrico sentado',
  band_exercise: 'Ejercicio con banda',
  bridge: 'Puente',
  side_lying: 'Decúbito lateral',
  plank_core: 'Plancha',
  squat_strength: 'Sentadilla',
  calf_raise: 'Elevación de talones',
  cardio_walk: 'Caminata',
  cardio_cycle: 'Bicicleta',
  cardio_step: 'Step-up',
  cardio_pool: 'Piscina',
  cervical_flexext: 'Cuello: flexión y extensión',
  trapecio_lateral: 'Cuello: inclinación lateral',
  pendulo_hombro: 'Hombro: péndulo de Codman',
  capsular_hombro: 'Hombro: brazo cruzado',
  rotacion_tronco: 'Rotación de tronco sentado',
  zancada_cadera: 'Zancada (flexores de cadera)',
  isquios_supino: 'Isquiotibiales acostado',
  rodilla_flexext: 'Rodilla sentado: flexión y extensión',
  tobillo_pared: 'Tobillo en pared',
  isometrico_cuad: 'Isométrico de cuádriceps',
  sentadilla_asistida: 'Sentadilla asistida',
  puente: 'Puente de glúteos',
  abduccion_lateral: 'Abducción de cadera lateral',
  elevacion_talones: 'Elevación de talones',
  remo_banda: 'Remo con banda',
  rot_externa_banda: 'Rotación externa con banda',
  plancha: 'Plancha abdominal',
  mckenzie: 'Extensión en prono (McKenzie)',
  caminata: 'Caminata en plano',
  retraccion_escapular: 'Retracción escapular',
  pectoral_marco: 'Pectoral en marco de puerta',
  gato_camello: 'Gato-camello (cuatro apoyos)',
  bird_dog: 'Bird-dog',
  gemelo_pared: 'Gemelo en pared',
  equilibrio_monopodal: 'Equilibrio en un pie',
  muneca_estiramiento: 'Muñeca: estiramiento',
  muneca_excentrico: 'Muñeca con peso',
  respiracion: 'Respiración diafragmática',
  sentarse_pararse: 'Sentarse y pararse',
  piriforme_4: 'Piriforme (figura 4)',
  elevacion_pierna: 'Elevación de pierna recta',
  rodilla_pecho: 'Rodilla al pecho',
  cuadriceps_pie: 'Cuádriceps de pie',
  pelota_pie: 'Rodar pelota bajo el pie'
};

const ICON_BY_NAME: Record<string, string> = {
  'Flexión-extensión cervical suave': 'cervical_flexext',
  'Estiramiento de trapecio superior': 'trapecio_lateral',
  'Círculos de hombro (péndulo de Codman)': 'pendulo_hombro',
  'Estiramiento capsular posterior de hombro': 'capsular_hombro',
  'Rotación de tronco en sedente': 'rotacion_tronco',
  'Estiramiento de flexores de cadera (zancada)': 'zancada_cadera',
  'Estiramiento de isquiotibiales supino': 'isquios_supino',
  'Flexo-extensión activa de rodilla': 'rodilla_flexext',
  'Movilidad de tobillo en dorsiflexión (pared)': 'tobillo_pared',
  'Isométricos de cuádriceps': 'isometrico_cuad',
  'Sentadilla parcial asistida': 'sentadilla_asistida',
  'Puente de glúteos': 'puente',
  'Abducción de cadera en decúbito lateral': 'abduccion_lateral',
  'Elevación de talones (gastrocnemio)': 'elevacion_talones',
  'Remo con banda elástica': 'remo_banda',
  'Rotación externa de hombro con banda': 'rot_externa_banda',
  'Plancha abdominal (core)': 'plancha',
  'Extensión lumbar en prono (McKenzie)': 'mckenzie',
  'Caminata en superficie plana': 'caminata',
  'Retracción escapular (apretar omóplatos)': 'retraccion_escapular',
  'Estiramiento de pectoral en marco de puerta': 'pectoral_marco',
  'Movilidad de columna en cuatro apoyos (gato-camello)': 'gato_camello',
  'Bird-dog (brazo y pierna opuestos)': 'bird_dog',
  'Estiramiento de gemelo en pared': 'gemelo_pared',
  'Equilibrio en un pie': 'equilibrio_monopodal',
  'Estiramiento de flexores y extensores de muñeca': 'muneca_estiramiento',
  'Fortalecimiento de muñeca con peso liviano': 'muneca_excentrico',
  'Respiración diafragmática': 'respiracion',
  'Sentarse y pararse de una silla': 'sentarse_pararse',
  'Estiramiento de piriforme (figura 4)': 'piriforme_4',
  'Elevación de pierna recta': 'elevacion_pierna',
  'Rodilla al pecho (lumbar)': 'rodilla_pecho',
  'Estiramiento de cuádriceps de pie': 'cuadriceps_pie',
  'Rodar pelota bajo el pie (fascia plantar)': 'pelota_pie'
};

export function resolveIconKey(key?: string, nombre?: string): string {
  if (nombre && ICON_BY_NAME[nombre]) {
    return ICON_BY_NAME[nombre];
  }
  if (key && RAW_ICONS[key]) {
    return key;
  }
  return 'standing_stretch';
}

export function ExerciseIconBadge({
  iconKey,
  exerciseName,
  size = 48,
  className = ''
}: {
  iconKey?: string;
  exerciseName?: string;
  size?: number;
  className?: string;
}): React.ReactElement {
  const resolved = resolveIconKey(iconKey, exerciseName);
  const rawSvg = RAW_ICONS[resolved] || RAW_ICONS.standing_stretch;

  return (
    <div
      className={`bg-sky-50/70 border border-sky-100 rounded-xl p-1.5 flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      {svgWrap(rawSvg, size)}
    </div>
  );
}
