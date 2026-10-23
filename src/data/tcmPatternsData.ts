import { DIGITO_GROUPS } from './digitopunctureData';
import { DigitoPoint } from '../types/clinical';

export interface TCMPatternDef {
  id: string;
  nombre: string;
  sintomas: string;
  lengua: string;
  pulso: string;
  principio: string;
  variantes: string[];
  autocuidado: string[];
  dieta: string[];
}

export const TCM_PATRONES: TCMPatternDef[] = [
  {
    id: 'estanc_qi',
    nombre: 'Estancamiento de Qi (Hígado)',
    sintomas: 'Dolor o tensión que cambia de lugar, con sensación de distensión; empeora con el estrés y mejora al moverse; suspiros, irritabilidad.',
    lengua: 'normal o con bordes algo rojos o violáceos',
    pulso: 'en cuerda (tenso)',
    principio: 'Mover el Qi y armonizar el Hígado',
    variantes: ['LR3', 'LI4', 'GB34', 'PC6'],
    autocuidado: [
      'Caminar a paso suave y estirar el costado del cuerpo cada día',
      'Respiración abdominal lenta 5 minutos, 2 veces al día',
      'Pausas breves de movimiento cada hora si trabaja sentado'
    ],
    dieta: [
      'Comidas ligeras y regulares, con verduras de hoja',
      'Reducir alcohol, fritos y comidas muy picantes',
      'Evitar comer con prisa o estresado'
    ]
  },
  {
    id: 'estasis_sangre',
    nombre: 'Estasis de Sangre',
    sintomas: 'Dolor fijo y punzante en un punto preciso, peor de noche o tras reposo prolongado; antecedente de golpe, cirugía o lesión; posibles moretones.',
    lengua: 'violácea o con puntos morados',
    pulso: 'áspero (irregular)',
    principio: 'Activar la Sangre y eliminar la estasis',
    variantes: ['SP6', 'BL40', 'LR3'],
    autocuidado: [
      'Movimiento suave y frecuente; evite quedarse quieto por periodos largos',
      'Calor suave local solo si no hay inflamación aguda ni hinchazón',
      'Evite masajes profundos sobre zonas con moretones'
    ],
    dieta: [
      'Hidratación suficiente',
      'Reducir alcohol y tabaco',
      'Alimentos frescos y variados (verduras y legumbres)'
    ]
  },
  {
    id: 'frio_humedad',
    nombre: 'Frío-humedad (síndrome Bi)',
    sintomas: 'Dolor con pesadez y rigidez, que empeora con frío, humedad o lluvia y mejora con calor; articulaciones frías y pesadas.',
    lengua: 'pálida con saburra blanca o grasosa',
    pulso: 'tenso o resbaladizo, lento',
    principio: 'Dispersar el frío y la humedad, y calentar los canales',
    variantes: ['ST36', 'SP6', 'GV3', 'GB34'],
    autocuidado: [
      'Abrigar la zona (sobre todo lumbar y rodillas) y evitar corrientes de aire y ropa húmeda',
      'Calor local 15-20 minutos si no hay inflamación aguda',
      'Entrar en calor con movimiento suave antes de la pauta'
    ],
    dieta: [
      'Preferir alimentos y bebidas tibios o calientes, cocidos',
      'Limitar helados, bebidas heladas y exceso de lácteos fríos',
      'Infusión de jengibre fresco (si no tiene contraindicación)'
    ]
  },
  {
    id: 'def_rinon',
    nombre: 'Deficiencia de Riñón',
    sintomas: 'Dolor sordo y crónico, sobre todo lumbar y de rodillas, con debilidad; empeora con el cansancio y mejora con el reposo; orinar de noche, frío lumbar.',
    lengua: 'pálida y húmeda (yang) o roja con poca saburra (yin)',
    pulso: 'profundo y débil (fino y rápido en yin)',
    principio: 'Tonificar y nutrir el Riñón',
    variantes: ['KI3', 'BL23', 'ST36', 'SP6'],
    autocuidado: [
      'Abrigar la zona lumbar',
      'Evitar sobreesfuerzos y dormir lo suficiente',
      'Ejercicio suave y regular (por ejemplo Qi Gong o caminata)'
    ],
    dieta: [
      'Comidas cocidas y tibias, con proteínas de calidad',
      'Incluir semillas, nueces y legumbres',
      'Reducir el exceso de sal, cafeína y alcohol'
    ]
  },
  {
    id: 'def_qi_sangre',
    nombre: 'Deficiencia de Qi y Sangre',
    sintomas: 'Cansancio, palidez, mareos o mala concentración; dolor sordo que mejora con presión suave y reposo; recuperación lenta.',
    lengua: 'pálida, a veces con bordes marcados',
    pulso: 'débil o fino',
    principio: 'Tonificar el Qi y nutrir la Sangre',
    variantes: ['ST36', 'SP6', 'KI3'],
    autocuidado: [
      'Aumentar la carga de forma gradual y respetar los días de descanso',
      'Dormir a horarios regulares',
      'Terminar la pauta con energía: evitar agotarse'
    ],
    dieta: [
      'No saltarse comidas; incluir proteínas y verduras cocidas',
      'Comer tibio y a horarios regulares',
      'Evitar el exceso de azúcar y de alimentos fríos o crudos'
    ]
  },
  {
    id: 'yang_higado',
    nombre: 'Ascenso de Yang de Hígado',
    sintomas: 'Cefalea pulsátil o lateral, irritabilidad, mareo, ojos rojos o tensión en cuello y hombros; empeora con el enojo o la falta de sueño.',
    lengua: 'roja, sobre todo en los bordes',
    pulso: 'en cuerda y rápido',
    principio: 'Calmar el Hígado y descender el Yang',
    variantes: ['LR3', 'GB20', 'GB34', 'EX-HN5'],
    autocuidado: [
      'Pausas de descanso visual y de pantalla',
      'Respiración lenta y estiramiento suave de cuello y hombros',
      'Dormir lo suficiente y a horarios regulares'
    ],
    dieta: [
      'Reducir alcohol, cafeína y comidas muy picantes o fritas',
      'Preferir verduras, frutas y comidas ligeras',
      'Hidratarse bien durante el día'
    ]
  },
  {
    id: 'viento_frio',
    nombre: 'Invasión de viento-frío',
    sintomas: 'Inicio reciente tras exposición al frío o a una corriente de aire; rigidez de cuello u hombros, a veces escalofríos; mejora con calor.',
    lengua: 'saburra blanca fina',
    pulso: 'superficial y tenso',
    principio: 'Dispersar el viento-frío y liberar la superficie',
    variantes: ['GB20', 'GB21', 'LI4', 'BL10'],
    autocuidado: [
      'Abrigar cuello y hombros y evitar corrientes de aire',
      'Calor local suave 15 minutos, 2 veces al día',
      'Movilidad suave del cuello, sin forzar'
    ],
    dieta: [
      'Bebidas tibias',
      'Infusión de jengibre fresco (si no tiene contraindicación)',
      'Evitar bebidas heladas mientras dure el cuadro'
    ]
  },
  {
    id: 'shen_insomnio',
    nombre: 'Perturbación del Shen (insomnio, ansiedad)',
    sintomas: 'Sueño ligero o difícil de conciliar, ansiedad, palpitaciones e inquietud; a veces calor nocturno o boca seca.',
    lengua: 'roja, con la punta más roja',
    pulso: 'rápido y fino',
    principio: 'Calmar el Shen y armonizar Corazón y Riñón',
    variantes: ['HT7', 'KI3', 'EX-HN3', 'PC6'],
    autocuidado: [
      'Horario fijo para acostarse y levantarse',
      'Apagar pantallas 1 hora antes de dormir',
      'Presión suave en HT7 o EX-HN3 y respiración lenta antes de dormir'
    ],
    dieta: [
      'Cena liviana y temprana',
      'Evitar café, té y alcohol por la tarde y la noche',
      'Infusión tibia sin cafeína (manzanilla o tilo)'
    ]
  }
];

export const TCM_POR_GRUPO: Record<string, string[]> = {
  cervical: ['viento_frio', 'estanc_qi', 'estasis_sangre', 'frio_humedad'],
  hombro: ['viento_frio', 'estanc_qi', 'estasis_sangre', 'frio_humedad'],
  dorsal: ['estanc_qi', 'estasis_sangre', 'frio_humedad'],
  lumbar: ['frio_humedad', 'def_rinon', 'estasis_sangre', 'estanc_qi'],
  ciatica: ['frio_humedad', 'estasis_sangre', 'def_rinon'],
  cadera: ['frio_humedad', 'def_rinon', 'estasis_sangre'],
  rodilla: ['frio_humedad', 'def_rinon', 'estasis_sangre'],
  tobillo: ['estasis_sangre', 'frio_humedad', 'def_qi_sangre'],
  codo: ['estasis_sangre', 'frio_humedad', 'estanc_qi'],
  cefalea: ['yang_higado', 'estanc_qi', 'viento_frio'],
  estres: ['shen_insomnio', 'estanc_qi', 'def_qi_sangre'],
  fatiga: ['def_qi_sangre', 'def_rinon']
};

export const ALL_POINTS_MAP: Record<string, DigitoPoint> = (() => {
  const m: Record<string, DigitoPoint> = {};
  DIGITO_GROUPS.forEach(g => {
    g.puntos.forEach(p => {
      if (!m[p.cod]) m[p.cod] = p;
    });
  });
  return m;
})();
