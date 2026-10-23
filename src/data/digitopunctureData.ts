import { DigitoPoint } from '../types/clinical';

export const DIGITO_TECNICA =
  'Presión firme y sostenida con la yema del pulgar o del dedo medio, 1 a 2 minutos por punto y por lado, 2 a 3 veces al día, respirando lento y profundo. Debe sentirse una molestia tolerable ("dolor bueno"), nunca dolor agudo.';

export const DIGITO_GENERAL =
  'No aplicar sobre heridas, várices, infecciones, zonas inflamadas, hematomas, fracturas o cirugías recientes. En embarazo, con anticoagulantes o ante dolor sin causa conocida, consulte antes con su profesional. Si aparece dolor agudo, mareo, náuseas, palpitaciones u hormigueo intenso, suspenda y revise el semáforo de seguridad.';

export interface DigitoGroupDef {
  id: string;
  nombre: string;
  kw: string[];
  precaucion: string;
  puntos: DigitoPoint[];
}

export const DIGITO_GROUPS: DigitoGroupDef[] = [
  {
    id: 'cervical',
    nombre: 'Dolor cervical / tensión de cuello',
    kw: ['cervic', 'cuello', 'nuca', 'torticolis', 'latigazo'],
    precaucion: 'Evitar presión intensa en la parte delantera del cuello. Suspender si hay mareo, hormigueo o dolor que baja al brazo.',
    puntos: [
      {
        cod: 'GB20',
        nombre: 'Fengchi',
        emb: false,
        ubic: 'En la base del cráneo, en el hueco entre los dos músculos de la nuca, a cada lado de la columna.',
        uso: 'Con ambos pulgares, presione hacia arriba y hacia los ojos con la cabeza levemente inclinada hacia atrás. 1-2 min, presión firme y sostenida.'
      },
      {
        cod: 'GB21',
        nombre: 'Jianjing',
        emb: true,
        ubic: 'Sobre el músculo trapecio, a mitad de camino entre la base del cuello y la punta del hombro.',
        uso: 'Presione hacia abajo con el dedo medio de la mano contraria, 1 min por lado; suelte lento al exhalar.'
      },
      {
        cod: 'SI3',
        nombre: 'Houxi',
        emb: false,
        ubic: 'Con el puño cerrado, en el extremo del pliegue que se forma bajo el dedo meñique, en el borde externo de la mano.',
        uso: 'Presión con el pulgar de la otra mano, 1 min por lado, mientras gira suavemente el cuello sin dolor.'
      },
      {
        cod: 'BL10',
        nombre: 'Tianzhu',
        emb: false,
        ubic: 'En la nuca, a un dedo y medio de la línea media, en el borde externo del músculo que sube hacia la cabeza, justo bajo el hueso del cráneo.',
        uso: 'Presión firme hacia arriba con los pulgares, 1 min por lado, con el mentón levemente hacia el pecho.'
      }
    ]
  },
  {
    id: 'hombro',
    nombre: 'Dolor de hombro (manguito, capsulitis, bursitis)',
    kw: ['hombro', 'manguito', 'capsulitis', 'bursitis', 'supraespin', 'pinzamiento'],
    precaucion: 'No presionar si hay inflamación aguda, hematoma o luxación reciente. Mantener el brazo relajado durante la presión.',
    puntos: [
      {
        cod: 'LI15',
        nombre: 'Jianyu',
        emb: false,
        ubic: 'Al elevar el brazo a la altura del hombro, en el hueco que aparece bajo la punta del hombro, por delante.',
        uso: 'Presión firme con el dedo medio, 1 min, con el brazo apoyado y relajado.'
      },
      {
        cod: 'TE14',
        nombre: 'Jianliao',
        emb: false,
        ubic: 'En el hueco que aparece justo detrás del anterior, bajo la punta del hombro, al elevar el brazo.',
        uso: 'Presión firme y sostenida 1 min; luego mueva el brazo en círculos pequeños sin dolor.'
      },
      {
        cod: 'LI11',
        nombre: 'Quchi',
        emb: false,
        ubic: 'Con el codo doblado, en el extremo externo del pliegue del codo.',
        uso: 'Presión firme con el pulgar, 1 min por lado.'
      },
      {
        cod: 'ST38',
        nombre: 'Tiaokou',
        emb: false,
        ubic: 'En la pierna, a mitad de camino entre la rodilla y el tobillo, a un dedo hacia afuera del borde de la espinilla.',
        uso: 'Presione 1-2 min mientras eleva y baja suavemente el brazo afectado, sin dolor.'
      }
    ]
  },
  {
    id: 'dorsal',
    nombre: 'Dolor dorsal / tensión escapular',
    kw: ['dorsal', 'escapul', 'omoplato', 'espalda alta', 'cifosis'],
    precaucion: 'No empujar directamente sobre la columna. Si usa pelota contra la pared, apoyarse con suavidad.',
    puntos: [
      {
        cod: 'SI11',
        nombre: 'Tianzong',
        emb: false,
        ubic: 'En el centro de la zona plana del omóplato que queda bajo el hueso horizontal (espina) de la escápula.',
        uso: 'Presione con los nudillos o con una pelota de tenis contra la pared, 1-2 min por lado.'
      },
      {
        cod: 'BL11',
        nombre: 'Dazhu',
        emb: false,
        ubic: 'En la espalda alta, a dos dedos de la columna, a la altura de la primera vértebra dorsal.',
        uso: 'Con los pulgares o una pelota contra la pared, 1 min por lado, sin empujar sobre la columna.'
      },
      {
        cod: 'BL43',
        nombre: 'Gaohuangshu',
        emb: false,
        ubic: 'Entre la columna y el borde interno del omóplato, unas cuatro vértebras bajo la más saliente del cuello.',
        uso: 'Presión sostenida 1-2 min por lado con pelota contra la pared o con ayuda, respirando profundo.'
      },
      {
        cod: 'GB21',
        nombre: 'Jianjing',
        emb: true,
        ubic: 'Sobre el músculo trapecio, a mitad de camino entre la base del cuello y la punta del hombro.',
        uso: 'Presione hacia abajo con el dedo medio de la mano contraria, 1 min por lado.'
      }
    ]
  },
  {
    id: 'lumbar',
    nombre: 'Dolor lumbar (lumbalgia, contractura, hernia de disco)',
    kw: ['lumb', 'espalda baja', 'hernia', 'disco', 'contractura lumbar'],
    precaucion: 'No aplicar presión fuerte sobre la columna ni con dolor que baje por la pierna con hormigueo o pérdida de fuerza.',
    puntos: [
      {
        cod: 'BL23',
        nombre: 'Shenshu',
        emb: false,
        ubic: 'En la zona lumbar, a la altura del ombligo, a dos dedos de cada lado de la columna.',
        uso: 'Presión con los nudillos o los pulgares, 1-2 min por lado, o masaje circular apoyado en una pelota.'
      },
      {
        cod: 'BL25',
        nombre: 'Dachangshu',
        emb: false,
        ubic: 'A la altura de la cintura del pantalón (línea de las crestas de la cadera), a dos dedos de cada lado de la columna.',
        uso: 'Presión firme y sostenida 1-2 min por lado, respirando lento.'
      },
      {
        cod: 'BL40',
        nombre: 'Weizhong',
        emb: false,
        ubic: 'En el centro del pliegue detrás de la rodilla.',
        uso: 'Presión suave con el pulgar, 1 min por lado (zona delicada, evitar si hay várices).'
      },
      {
        cod: 'GV3',
        nombre: 'Yaoyangguan',
        emb: false,
        ubic: 'En la línea media de la columna lumbar, en el hueco justo bajo la vértebra que queda a la altura de la cintura del pantalón.',
        uso: 'Presión suave con el pulgar, 1 min, sin empujar con fuerza sobre la columna.'
      }
    ]
  },
  {
    id: 'ciatica',
    nombre: 'Ciática / dolor irradiado a la pierna',
    kw: ['ciatic', 'radicul', 'irradiad', 'piriform'],
    precaucion: 'Suspender si aumenta el dolor, hay hormigueo intenso, pérdida de fuerza o alteración al orinar.',
    puntos: [
      {
        cod: 'GB30',
        nombre: 'Huantiao',
        emb: false,
        ubic: 'En el glúteo, hacia el lado externo, en el hueco profundo detrás del hueso saliente lateral de la cadera.',
        uso: 'Acostado de lado, presione con el pulgar o apóyese sobre una pelota de tenis, 1-2 min por lado.'
      },
      {
        cod: 'BL40',
        nombre: 'Weizhong',
        emb: false,
        ubic: 'En el centro del pliegue detrás de la rodilla.',
        uso: 'Presión suave con el pulgar, 1 min por lado (evitar si hay várices).'
      },
      {
        cod: 'BL57',
        nombre: 'Chengshan',
        emb: false,
        ubic: 'En medio de la pantorrilla, donde se forma una "V" entre los dos gemelos al ponerse de puntillas.',
        uso: 'Presión firme y sostenida 1-2 min por lado, sentado con la pierna estirada.'
      },
      {
        cod: 'GB34',
        nombre: 'Yanglingquan',
        emb: false,
        ubic: 'En la parte externa de la pierna, en el hueco justo bajo y delante de la cabeza del peroné.',
        uso: 'Presión firme con el pulgar, 1-2 min por lado.'
      }
    ]
  },
  {
    id: 'cadera',
    nombre: 'Dolor de cadera / glúteo',
    kw: ['cadera', 'coxa', 'trocant'],
    precaucion: 'No presionar sobre prótesis recientes, hematomas ni zonas con dolor agudo. Evitar movimientos bruscos de la cadera.',
    puntos: [
      {
        cod: 'GB30',
        nombre: 'Huantiao',
        emb: false,
        ubic: 'En el glúteo, hacia el lado externo, en el hueco profundo detrás del hueso saliente lateral de la cadera.',
        uso: 'Acostado de lado, presione con el pulgar o apóyese sobre una pelota de tenis, 1-2 min por lado.'
      },
      {
        cod: 'GB29',
        nombre: 'Juliao',
        emb: false,
        ubic: 'En el costado de la cadera, a mitad de camino entre el hueso delantero de la cadera y el trocánter mayor.',
        uso: 'Presión firme y sostenida con el pulgar, 1 min por lado.'
      },
      {
        cod: 'BL36',
        nombre: 'Chengfu',
        emb: false,
        ubic: 'En el centro del pliegue entre el glúteo y la parte posterior del muslo.',
        uso: 'Presión firme con el pulgar o los nudillos, 1 min por lado.'
      },
      {
        cod: 'GB34',
        nombre: 'Yanglingquan',
        emb: false,
        ubic: 'En la parte externa de la pierna, en el hueco justo bajo y delante de la cabeza del peroné.',
        uso: 'Presión firme con el pulgar, 1-2 min por lado.'
      }
    ]
  },
  {
    id: 'rodilla',
    nombre: 'Dolor de rodilla (gonalgia, menisco, condromalacia)',
    kw: ['rodilla', 'gonalg', 'menisc', 'rotula', 'patelo', 'condromalac', 'ligamento cruzado'],
    precaucion: 'No presionar directamente sobre la rótula ni sobre una rodilla hinchada, caliente o con derrame reciente.',
    puntos: [
      {
        cod: 'ST35',
        nombre: 'Dubi',
        emb: false,
        ubic: 'Con la rodilla doblada, en el hueco externo bajo la rótula ("ojo externo" de la rodilla).',
        uso: 'Presión suave con el pulgar, 1 min por lado.'
      },
      {
        cod: 'EX-LE4',
        nombre: 'Neixiyan',
        emb: false,
        ubic: 'Con la rodilla doblada, en el hueco interno bajo la rótula ("ojo interno" de la rodilla).',
        uso: 'Presión suave con el pulgar, 1 min por lado.'
      },
      {
        cod: 'ST36',
        nombre: 'Zusanli',
        emb: false,
        ubic: 'Cuatro dedos bajo el hueco externo de la rodilla, a un dedo hacia afuera del borde de la espinilla.',
        uso: 'Presión firme o masaje circular, 1-2 min por lado, sentado con la rodilla doblada.'
      },
      {
        cod: 'GB34',
        nombre: 'Yanglingquan',
        emb: false,
        ubic: 'En la parte externa de la pierna, en el hueco justo bajo y delante de la cabeza del peroné.',
        uso: 'Presión firme con el pulgar, 1-2 min por lado.'
      }
    ]
  },
  {
    id: 'tobillo',
    nombre: 'Tobillo / pie (esguince, fascitis plantar, tendón de Aquiles)',
    kw: ['tobillo', 'esguince', 'plantar', 'aquiles', 'metatars'],
    precaucion: 'No presionar sobre un esguince agudo con hinchazón o hematoma; aplicar solo en la fase de recuperación.',
    puntos: [
      {
        cod: 'ST41',
        nombre: 'Jiexi',
        emb: false,
        ubic: 'En el centro del pliegue del tobillo por delante (empeine), entre los dos tendones.',
        uso: 'Presión suave con el pulgar, 1 min por lado, moviendo el pie lentamente arriba y abajo.'
      },
      {
        cod: 'GB40',
        nombre: 'Qiuxu',
        emb: false,
        ubic: 'En el hueco delante y debajo del hueso externo del tobillo.',
        uso: 'Presión firme y sostenida con el pulgar, 1 min por lado.'
      },
      {
        cod: 'KI3',
        nombre: 'Taixi',
        emb: false,
        ubic: 'En el hueco entre el hueso interno del tobillo y el tendón de Aquiles.',
        uso: 'Presión firme y sostenida 1-2 min por lado, respirando lento.'
      },
      {
        cod: 'BL60',
        nombre: 'Kunlun',
        emb: true,
        ubic: 'En el hueco entre el hueso externo del tobillo y el tendón de Aquiles.',
        uso: 'Presión firme y sostenida 1 min por lado.'
      }
    ]
  },
  {
    id: 'codo',
    nombre: 'Codo / muñeca / mano (epicondilitis, túnel carpiano)',
    kw: ['codo', 'epicond', 'epitroc', 'muneca', 'tunel carpiano', 'carpiano'],
    precaucion: 'Evitar presión sobre la zona más dolorosa del tendón en fase aguda; aplicar en puntos vecinos y suspender si aumenta el hormigueo.',
    puntos: [
      {
        cod: 'LI11',
        nombre: 'Quchi',
        emb: false,
        ubic: 'Con el codo doblado, en el extremo externo del pliegue del codo.',
        uso: 'Presión firme con el pulgar, 1 min por lado.'
      },
      {
        cod: 'LI10',
        nombre: 'Shousanli',
        emb: false,
        ubic: 'Tres dedos bajo el pliegue externo del codo, sobre el músculo de la cara externa del antebrazo.',
        uso: 'Presión firme y sostenida con el pulgar, 1-2 min por lado.'
      },
      {
        cod: 'TE5',
        nombre: 'Waiguan',
        emb: false,
        ubic: 'A tres dedos sobre el pliegue de la muñeca por el dorso, entre los dos huesos del antebrazo.',
        uso: 'Presión firme con el pulgar, 1 min por lado.'
      },
      {
        cod: 'PC6',
        nombre: 'Neiguan',
        emb: false,
        ubic: 'A tres dedos sobre el pliegue de la muñeca (cara de la palma), entre los dos tendones centrales.',
        uso: 'Presión firme y sostenida 1-2 min por lado, respirando lento.'
      }
    ]
  },
  {
    id: 'cefalea',
    nombre: 'Cefalea tensional / dolor de cabeza',
    kw: ['cefalea', 'dolor de cabeza', 'migrana', 'jaqueca'],
    precaucion: 'Si el dolor de cabeza es súbito e intenso, con alteración visual, confusión o fiebre, acudir a urgencia.',
    puntos: [
      {
        cod: 'GB20',
        nombre: 'Fengchi',
        emb: false,
        ubic: 'En la base del cráneo, en el hueco entre los dos músculos de la nuca, a cada lado de la columna.',
        uso: 'Con ambos pulgares, presione hacia arriba y hacia los ojos, 1-2 min.'
      },
      {
        cod: 'EX-HN5',
        nombre: 'Taiyang',
        emb: false,
        ubic: 'En la sien, en el hueco a un dedo detrás del extremo externo de la ceja y del ojo.',
        uso: 'Masaje circular suave con la yema de los dedos, 1 min por lado.'
      },
      {
        cod: 'LI4',
        nombre: 'Hegu',
        emb: true,
        ubic: 'En el dorso de la mano, en el punto más alto del músculo al juntar el pulgar con el índice.',
        uso: 'Presión firme con el pulgar de la otra mano, 1 min por lado.'
      },
      {
        cod: 'LR3',
        nombre: 'Taichong',
        emb: false,
        ubic: 'En el empeine, en el hueco entre el dedo gordo y el segundo dedo, donde se unen los dos huesos.',
        uso: 'Presión firme y sostenida 1 min por lado, respirando lento.'
      }
    ]
  },
  {
    id: 'estres',
    nombre: 'Estrés / ansiedad / insomnio',
    kw: ['estres', 'ansiedad', 'insomnio', 'sueno', 'nerviosismo', 'angustia'],
    precaucion: 'La digitopuntura complementa, no reemplaza, la atención de salud mental. Consultar si los síntomas son intensos.',
    puntos: [
      {
        cod: 'HT7',
        nombre: 'Shenmen',
        emb: false,
        ubic: 'En el pliegue de la muñeca, por el lado del meñique, en el hueco junto al tendón.',
        uso: 'Presión suave y sostenida con el pulgar, 1-2 min por lado, respirando lento.'
      },
      {
        cod: 'PC6',
        nombre: 'Neiguan',
        emb: false,
        ubic: 'A tres dedos sobre el pliegue de la muñeca (cara de la palma), entre los dos tendones centrales.',
        uso: 'Presión firme y sostenida 1-2 min por lado, respirando lento.'
      },
      {
        cod: 'EX-HN3',
        nombre: 'Yintang',
        emb: false,
        ubic: 'En el entrecejo, justo entre las dos cejas.',
        uso: 'Masaje circular muy suave con la yema del dedo medio, 1-2 min.'
      },
      {
        cod: 'GV20',
        nombre: 'Baihui',
        emb: false,
        ubic: 'En la coronilla, en el centro de la cabeza (punto medio entre la parte alta de ambas orejas).',
        uso: 'Toque suave o masaje circular leve, 1 min, antes de dormir.'
      }
    ]
  },
  {
    id: 'fatiga',
    nombre: 'Fatiga / sedentarismo / bajo tono general',
    kw: ['fatiga', 'sedentar', 'cansancio', 'debilidad', 'astenia'],
    precaucion: 'Si la fatiga es persistente o inexplicable, con falta de aire o pérdida de peso, consultar con un médico.',
    puntos: [
      {
        cod: 'ST36',
        nombre: 'Zusanli',
        emb: false,
        ubic: 'Cuatro dedos bajo el hueco externo de la rodilla, a un dedo hacia afuera del borde de la espinilla.',
        uso: 'Presión firme o masaje circular, 2 min por lado, sentado con la rodilla doblada.'
      },
      {
        cod: 'SP6',
        nombre: 'Sanyinjiao',
        emb: true,
        ubic: 'Cuatro dedos sobre el hueso interno del tobillo, justo detrás del borde de la tibia.',
        uso: 'Presión firme y sostenida 1-2 min por lado.'
      },
      {
        cod: 'KI3',
        nombre: 'Taixi',
        emb: false,
        ubic: 'En el hueco entre el hueso interno del tobillo y el tendón de Aquiles.',
        uso: 'Presión firme y sostenida 1-2 min por lado.'
      },
      {
        cod: 'LI4',
        nombre: 'Hegu',
        emb: true,
        ubic: 'En el dorso de la mano, en el punto más alto del músculo al juntar el pulgar con el índice.',
        uso: 'Presión firme con el pulgar de la otra mano, 1 min por lado.'
      }
    ]
  }
];

export const DIGITO_REGIONES: [string, string[]][] = [
  ['Cuello y columna', ['cervical', 'dorsal', 'lumbar']],
  ['Extremidad superior', ['hombro', 'codo']],
  ['Cadera y extremidad inferior', ['cadera', 'ciatica', 'rodilla', 'tobillo']],
  ['Cabeza y bienestar general', ['cefalea', 'estres', 'fatiga']]
];

export const DIGITO_SEMAFORO = [
  {
    color: '#16a34a',
    bg: '#f0fdf4',
    emoji: '🟢',
    titulo: 'Verde — Continuar',
    criterio: 'Sensación de presión profunda o "dolor que alivia", tolerable, calor local leve o relajación.',
    accion: 'Mantenga la presión suave 30-60 segundos y repita según lo indicado.'
  },
  {
    color: '#d97706',
    bg: '#fffbeb',
    emoji: '🟡',
    titulo: 'Amarillo — Reducir presión o pausar',
    criterio: 'Dolor agudo al presionar (EVA 4-5), enrojecimiento intenso, hormigueo o leve mareo que ceden al soltar.',
    accion: 'Suelte y baje la presión o cambie de punto. Si se repite en la próxima sesión, consulte a su profesional antes de continuar.'
  },
  {
    color: '#dc2626',
    bg: '#fef2f2',
    emoji: '🔴',
    titulo: 'Rojo — Detener de inmediato',
    criterio: 'Dolor intenso (EVA >5), mareo o desmayo, sudor frío, náuseas, falta de aire, dolor de pecho, adormecimiento persistente o hematoma.',
    accion: 'Suspenda la digitopuntura, siéntese o acuéstese y contacte a su profesional o acuda a urgencia si el síntoma es severo.'
  }
];

// SVG Anatomical background templates
const FG = 'fill="#f1f5f9" stroke="#64748b" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
const FL = 'fill="none" stroke="#94a3b8" stroke-width="1.1" stroke-opacity=".8" stroke-linecap="round"';
const TX = 'font-family="sans-serif" font-size="9" fill="#64748b"';
const TXS = 'font-family="sans-serif" font-size="6.5" fill="#64748b"';

export const DIGITO_VIEWS: Record<string, { vb: [number, number]; crop: [number, number]; svg: string; sides?: [string, string] }> = {
  nuca: {
    vb: [200, 160],
    crop: [200, 160],
    svg: `<g ${FG}><path d="M84 96 L82 124 C60 128 36 136 18 156 L182 156 C164 136 140 128 118 124 L116 96 Z"/>
     <path d="M66 50 C66 20 134 20 134 50 C134 76 126 92 112 98 L88 98 C74 92 66 76 66 50 Z"/>
     <ellipse cx="64" cy="58" rx="5" ry="10"/><ellipse cx="136" cy="58" rx="5" ry="10"/></g>
     <path d="M100 100 L100 156" ${FL} stroke-dasharray="3 3"/>
     <circle cx="100" cy="124" r="3" fill="#64748b"/><text x="106" y="123" ${TX}>C7</text>
     <text x="8" y="12" ${TX}>vista posterior</text>`
  },
  espalda: {
    vb: [200, 250],
    crop: [200, 120],
    svg: `<g ${FG}><path d="M82 4 C62 8 40 14 30 32 C26 60 32 96 38 124 C40 156 34 196 42 232 L158 232 C166 196 160 156 162 124 C168 96 174 60 170 32 C160 14 138 8 118 4 Z"/></g>
     <g ${FL}><path d="M100 6 L100 232" stroke-dasharray="3 3"/>
     <path d="M70 34 L70 78 C58 88 46 80 44 64 L46 46 Z"/><path d="M70 46 L38 32"/>
     <path d="M130 34 L130 78 C142 88 154 80 156 64 L154 46 Z"/><path d="M130 46 L162 32"/>
     <path d="M44 180 C52 164 70 158 94 164"/><path d="M156 180 C148 164 130 158 106 164"/></g>
     <text x="106" y="20" ${TX}>C7</text><text x="108" y="192" ${TX}>L4</text>
     <text x="48" y="192" ${TX}>cresta ilíaca</text>`
  },
  cadera_lat: {
    vb: [200, 230],
    crop: [170, 170],
    svg: `<g ${FG}><path d="M60 0 C60 30 62 50 66 70 C68 90 70 105 72 120 L72 230 L140 230 L146 150 C158 140 170 124 166 104 C160 84 148 66 146 46 C144 30 142 14 140 0 Z"/></g>
     <path d="M66 70 C90 56 120 46 144 44" ${FL} stroke-dasharray="3 3"/>
     <circle cx="66" cy="70" r="3" fill="#64748b"/><text x="74" y="64" ${TX}>EIAS</text>
     <circle cx="108" cy="110" r="3.5" fill="#64748b"/><text x="102" y="126" text-anchor="end" ${TX}>trocánter</text>
     <text x="64" y="12" ${TX}>adelante</text><text x="116" y="12" ${TX}>atrás</text>`
  },
  pierna_post: {
    vb: [140, 330],
    crop: [110, 110],
    svg: `<g ${FG}><path d="M36 10 C40 50 50 110 54 148 C48 170 42 190 46 215 C50 245 56 270 58 296 L58 316 C60 326 82 326 82 316 L82 296 C86 270 92 245 96 215 C100 190 94 170 88 148 C92 110 100 50 104 10 Z"/>
     <ellipse cx="54" cy="305" rx="5" ry="6"/><ellipse cx="87" cy="311" rx="5" ry="6"/></g>
     <g ${FL}><path d="M36 14 Q70 24 104 14"/><path d="M54 148 Q70 156 88 148"/>
     <path d="M52 195 C58 210 66 220 70 228 M90 195 C82 210 74 220 70 228"/><path d="M64 262 L64 314 M78 262 L78 314"/></g>`,
    sides: ['interno', 'externo']
  },
  pierna_ant: {
    vb: [160, 400],
    crop: [110, 110],
    svg: `<g ${FG}><path d="M36 0 C38 36 42 60 46 92 C46 120 44 150 46 176 C48 212 54 270 60 302 L60 332 C50 350 46 372 50 392 L108 396 C112 376 102 352 92 332 L92 302 C96 270 104 212 108 176 C112 150 104 120 102 92 C106 60 112 36 116 0 Z"/>
     <ellipse cx="76" cy="64" rx="17" ry="19"/>
     <ellipse cx="58" cy="327" rx="5" ry="6"/><ellipse cx="94" cy="322" rx="5" ry="6"/>
     <ellipse cx="99" cy="388" rx="9" ry="10"/><ellipse cx="86" cy="392" rx="7" ry="8"/><ellipse cx="75" cy="393" rx="6" ry="7"/><ellipse cx="65" cy="393" rx="5.5" ry="6.5"/><ellipse cx="56" cy="392" rx="5" ry="6"/></g>
     <g ${FL}><path d="M76 83 L76 112"/><path d="M76 114 C78 180 80 260 82 318" stroke-dasharray="3 3"/>
     <ellipse cx="50" cy="106" rx="6" ry="8"/><path d="M60 322 Q76 328 92 322"/>
     <path d="M82 338 L98 386 M76 338 L84 388" stroke-dasharray="3 3"/></g>
     <circle cx="76" cy="114" r="2.5" fill="#64748b"/>`,
    sides: ['externo', 'interno']
  },
  brazo_dorso: {
    vb: [150, 430],
    crop: [110, 110],
    svg: `<g ${FG}><path d="M24 56 C20 20 52 2 78 6 C108 10 124 34 120 60 C118 100 114 140 108 172 C112 200 108 250 98 326 L48 326 C38 250 34 200 34 172 C30 140 26 100 24 56 Z"/>
     <path d="M48 326 L98 326 C102 346 104 368 98 392 L36 392 C34 366 40 344 48 326 Z"/>
     <rect x="36" y="392" width="14" height="24" rx="7"/><rect x="50" y="392" width="14" height="32" rx="7"/><rect x="64" y="392" width="14" height="36" rx="7"/><rect x="78" y="392" width="14" height="32" rx="7"/>
     <path d="M98 340 C112 346 126 362 128 382 C128 392 118 394 114 386 C108 372 100 366 96 360 Z"/></g>
     <g ${FL}><path d="M34 172 L108 172" stroke-dasharray="3 3"/><path d="M48 326 L98 326" stroke-dasharray="3 3"/></g>
     <circle cx="76" cy="14" r="3" fill="#64748b"/><text x="76" y="24" text-anchor="middle" ${TXS}>acromion</text>
     <text x="46" y="184" ${TXS}>codo</text><text x="62" y="320" ${TXS}>muñeca</text>`,
    sides: ['meñique', 'pulgar']
  },
  antebrazo_palma: {
    vb: [140, 300],
    crop: [110, 110],
    svg: `<g ${FG}><path d="M34 0 C36 70 42 140 46 190 L94 190 C98 140 104 70 106 0 Z"/>
     <path d="M46 190 L94 190 C98 210 104 238 100 262 L38 262 C34 236 40 208 46 190 Z"/>
     <rect x="38" y="262" width="15" height="32" rx="7"/><rect x="53" y="262" width="15" height="38" rx="7"/><rect x="68" y="262" width="15" height="34" rx="7"/><rect x="83" y="262" width="15" height="26" rx="7"/>
     <path d="M46 192 C30 200 14 216 10 240 C8 252 20 256 26 246 C32 232 40 224 46 224 Z"/></g>
     <g ${FL}><path d="M46 190 Q70 196 94 190"/><path d="M56 100 L56 188 M70 100 L70 188"/><path d="M92 120 L92 188"/></g>`,
    sides: ['pulgar', 'meñique']
  },
  cabeza: {
    vb: [200, 200],
    crop: [170, 170],
    svg: `<g ${FG}><path d="M100 18 C142 18 158 54 156 94 C154 140 136 176 100 178 C64 176 46 140 44 94 C42 54 58 18 100 18 Z"/>
     <ellipse cx="42" cy="98" rx="7" ry="15"/><ellipse cx="158" cy="98" rx="7" ry="15"/></g>
     <g ${FL}><path d="M52 70 C60 38 140 38 148 70" stroke-dasharray="3 3"/><path d="M70 82 Q80 76 92 80"/><path d="M108 80 Q120 76 130 82"/>
     <path d="M100 96 L97 120 Q100 124 103 120"/><path d="M86 144 Q100 152 114 144"/><path d="M80 176 L78 198 M120 176 L122 198"/></g>
     <ellipse cx="81" cy="92" rx="9" ry="4.5" fill="#fff" stroke="#64748b" stroke-width="1.1"/><ellipse cx="119" cy="92" rx="9" ry="4.5" fill="#fff" stroke="#64748b" stroke-width="1.1"/>`
  }
};

export const DIGITO_POS: Record<string, { v: string; pts: [number, number][]; bil: boolean; lab?: string }> = {
  GB20: { v: 'nuca', pts: [[82, 92], [118, 92]], bil: true },
  BL10: { v: 'nuca', pts: [[90, 101], [110, 101]], bil: true },
  GB21: { v: 'nuca', pts: [[63, 135], [137, 135]], bil: true },
  SI11: { v: 'espalda', pts: [[58, 62], [142, 62]], bil: true },
  BL11: { v: 'espalda', pts: [[86, 30], [114, 30]], bil: true },
  BL43: { v: 'espalda', pts: [[74, 56], [126, 56]], bil: true },
  BL23: { v: 'espalda', pts: [[86, 140], [114, 140]], bil: true },
  BL25: { v: 'espalda', pts: [[86, 166], [114, 166]], bil: true },
  GV3: { v: 'espalda', pts: [[100, 167]], bil: false },
  GB29: { v: 'cadera_lat', pts: [[87, 90]], bil: true, lab: 'l' },
  GB30: { v: 'cadera_lat', pts: [[126, 114]], bil: true, lab: 'r' },
  BL36: { v: 'pierna_post', pts: [[70, 19]], bil: true },
  BL40: { v: 'pierna_post', pts: [[71, 152]], bil: true },
  BL57: { v: 'pierna_post', pts: [[70, 232]], bil: true },
  BL60: { v: 'pierna_post', pts: [[79, 310]], bil: true, lab: 'r' },
  KI3: { v: 'pierna_post', pts: [[62, 304]], bil: true, lab: 'l' },
  SP6: { v: 'pierna_post', pts: [[58, 275]], bil: true, lab: 'l' },
  ST35: { v: 'pierna_ant', pts: [[62, 92]], bil: true, lab: 'l' },
  'EX-LE4': { v: 'pierna_ant', pts: [[90, 92]], bil: true, lab: 'r' },
  ST36: { v: 'pierna_ant', pts: [[68, 136]], bil: true, lab: 'l' },
  ST38: { v: 'pierna_ant', pts: [[70, 210]], bil: true, lab: 'l' },
  GB34: { v: 'pierna_ant', pts: [[56, 120]], bil: true, lab: 'l' },
  ST41: { v: 'pierna_ant', pts: [[76, 322]], bil: true, lab: 'r' },
  GB40: { v: 'pierna_ant', pts: [[65, 337]], bil: true, lab: 'l' },
  LR3: { v: 'pierna_ant', pts: [[86, 366]], bil: true, lab: 'l' },
  LI15: { v: 'brazo_dorso', pts: [[98, 44]], bil: true, lab: 'r' },
  TE14: { v: 'brazo_dorso', pts: [[42, 44]], bil: true, lab: 'l' },
  LI11: { v: 'brazo_dorso', pts: [[102, 174]], bil: true, lab: 'l' },
  LI10: { v: 'brazo_dorso', pts: [[94, 200]], bil: true, lab: 'l' },
  TE5: { v: 'brazo_dorso', pts: [[72, 300]], bil: true, lab: 'r' },
  LI4: { v: 'brazo_dorso', pts: [[90, 358]], bil: true, lab: 'l' },
  SI3: { v: 'brazo_dorso', pts: [[40, 380]], bil: true, lab: 'r' },
  PC6: { v: 'antebrazo_palma', pts: [[63, 146]], bil: true, lab: 'l' },
  HT7: { v: 'antebrazo_palma', pts: [[84, 190]], bil: true, lab: 'r' },
  'EX-HN3': { v: 'cabeza', pts: [[100, 80]], bil: false, lab: 'r' },
  'EX-HN5': { v: 'cabeza', pts: [[59, 88], [141, 88]], bil: true, lab: 't' },
  GV20: { v: 'cabeza', pts: [[100, 24]], bil: false, lab: 'r' }
};

export function renderPointSvg(cod: string, width = 150): string {
  const pos = DIGITO_POS[cod];
  if (!pos) return '';
  const v = DIGITO_VIEWS[pos.v];
  if (!v) return '';
  const vw = v.vb[0], vh = v.vb[1], cw = v.crop[0], ch = v.crop[1];
  const n = pos.pts.length;
  const cx = pos.pts.reduce((s, p) => s + p[0], 0) / n;
  const cy = pos.pts.reduce((s, p) => s + p[1], 0) / n;
  const x0 = Math.max(0, Math.min(vw - cw, cx - cw / 2));
  const y0 = Math.max(0, Math.min(vh - ch, cy - ch / 2));
  const k = cw / 150;
  const W = width;
  const H = Math.round(width * ch / cw);
  let m = '';

  pos.pts.forEach((p, i) => {
    const left = n > 1 ? true : (pos.lab ? pos.lab === 'l' : p[0] > x0 + cw * 0.6);
    const top = pos.lab === 't';
    const showLabel = n === 1 || i === 0;

    m += `<circle cx="${p[0]}" cy="${p[1]}" r="${(10 * k).toFixed(1)}" fill="#0284c7" fill-opacity=".2"/>` +
      `<circle cx="${p[0]}" cy="${p[1]}" r="${(4.6 * k).toFixed(1)}" fill="#0284c7" stroke="#fff" stroke-width="${(1.4 * k).toFixed(1)}"/>`;

    if (showLabel) {
      const lx = top ? p[0] : (left ? p[0] - 12 * k : p[0] + 12 * k);
      const ly = top ? p[1] - 14 * k : p[1] - 6 * k;
      m += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${top ? 'middle' : (left ? 'end' : 'start')}" font-family="sans-serif" font-size="${(11 * k).toFixed(1)}" font-weight="700" fill="#0369a1" stroke="#fff" stroke-width="${(3 * k).toFixed(1)}" paint-order="stroke">${cod}</text>`;
    }
  });

  if (v.sides) {
    const fs = (8.5 * k).toFixed(1);
    const yy = (y0 + ch - 5 * k).toFixed(1);
    m += `<text x="${(x0 + 4 * k).toFixed(1)}" y="${yy}" font-family="sans-serif" font-size="${fs}" fill="#64748b" stroke="#f8fafc" stroke-width="${(2.5 * k).toFixed(1)}" paint-order="stroke" font-weight="600">◂ ${v.sides[0]}</text>` +
      `<text x="${(x0 + cw - 4 * k).toFixed(1)}" y="${yy}" text-anchor="end" font-family="sans-serif" font-size="${fs}" fill="#64748b" stroke="#f8fafc" stroke-width="${(2.5 * k).toFixed(1)}" paint-order="stroke" font-weight="600">${v.sides[1]} ▸</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${cw} ${ch}" width="${W}" height="${H}" role="img" aria-label="Ubicación referencial del punto ${cod}" style="display:block;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">${v.svg}${m}</svg>`;
}

export function ytPointUrl(p: DigitoPoint): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent('digitopuntura punto ' + p.cod + ' ' + p.nombre + ' acupresion')}`;
}

export function findSuggestedDigitoGroup(diagnostico: string): DigitoGroupDef | null {
  const t = (diagnostico || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!t.trim()) return null;
  let best: DigitoGroupDef | null = null;
  let bestScore = 0;
  DIGITO_GROUPS.forEach(g => {
    const score = g.kw.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
    if (score > bestScore) {
      best = g;
      bestScore = score;
    }
  });
  return best;
}
