import { Exercise } from '../types/clinical';

export const AREAS = [
  'Cervical',
  'Hombro',
  'Columna / core',
  'Cadera',
  'Rodilla',
  'Tobillo / pie',
  'Codo / muñeca / mano',
  'General / cuerpo completo'
] as const;

export const CATEGORIES = {
  flexibilidad: { label: 'Flexibilidad', badgeClass: 'text-sky-700 bg-sky-50 border-sky-200', sheetBorder: '#0284c7' },
  fortalecimiento: { label: 'Fortalecimiento', badgeClass: 'text-amber-800 bg-amber-50 border-amber-200', sheetBorder: '#c2410c' },
  aerobico: { label: 'Aeróbico', badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200', sheetBorder: '#16a34a' }
} as const;

export const LEVEL_LABEL = {
  bajo: 'Carga baja',
  moderado: 'Carga moderada',
  alto: 'Carga alta'
} as const;

export const SEED_EXERCISES: Omit<Exercise, 'id'>[] = [
  // --- Flexibilidad ---
  {
    nombre: 'Flexión-extensión cervical suave',
    categoria: 'flexibilidad',
    area: 'Cervical',
    icon: 'cervical_flexext',
    descripcion: 'Movimiento controlado de mentón hacia el pecho y luego hacia atrás, sin dolor.',
    niveles: {
      bajo: '2 series x 8 rep, mantener 5 seg',
      moderado: '3 series x 10 rep, mantener 10 seg',
      alto: '3 series x 12 rep, mantener 15 seg con leve autoresistencia'
    },
    progresion: 'Progresar cada 1-2 semanas: aumentar el tiempo de mantención antes de subir de nivel de carga. Avanzar solo si no hay dolor ni mareo.'
  },
  {
    nombre: 'Estiramiento de trapecio superior',
    categoria: 'flexibilidad',
    area: 'Cervical',
    icon: 'trapecio_lateral',
    descripcion: 'Inclinar cabeza hacia un hombro llevando la oreja hacia el hombro contrario, mano ayuda suavemente.',
    niveles: {
      bajo: '2 series x 20 seg por lado',
      moderado: '3 series x 30 seg por lado',
      alto: '3 series x 45 seg por lado con overpressure manual'
    },
    progresion: 'Aumentar el tiempo de estiramiento en 5-10 seg cada semana antes de agregar overpressure manual.'
  },
  {
    nombre: 'Círculos de hombro (péndulo de Codman)',
    categoria: 'flexibilidad',
    area: 'Hombro',
    icon: 'pendulo_hombro',
    descripcion: 'Inclinado hacia adelante, dejar el brazo colgar y hacer círculos suaves.',
    niveles: {
      bajo: '2 series x 10 círculos c/dirección, sin peso',
      moderado: '3 series x 15 círculos, peso liviano en mano (0.5-1kg)',
      alto: '3 series x 20 círculos, peso 1-2kg'
    },
    progresion: 'Progresar aumentando primero el número de repeticiones, luego el peso en la mano, en ese orden.'
  },
  {
    nombre: 'Estiramiento capsular posterior de hombro',
    categoria: 'flexibilidad',
    area: 'Hombro',
    icon: 'capsular_hombro',
    descripcion: 'Cruzar el brazo por delante del cuerpo, ayudando con el otro brazo a llevarlo hacia el pecho.',
    niveles: {
      bajo: '2 series x 20 seg por lado',
      moderado: '3 series x 30 seg por lado',
      alto: '3 series x 45 seg por lado con tracción suave'
    },
    progresion: 'Cada semana, si el rango mejora, aumentar 5-10 seg de mantención antes de subir de nivel.'
  },
  {
    nombre: 'Rotación de tronco en sedente',
    categoria: 'flexibilidad',
    area: 'Columna / core',
    icon: 'rotacion_tronco',
    descripcion: 'Sentado, girar el tronco hacia un lado sosteniendo el respaldo, volver al centro.',
    niveles: {
      bajo: '2 series x 8 rep por lado, rango pequeño',
      moderado: '3 series x 10 rep por lado, rango completo sin dolor',
      alto: '3 series x 12 rep por lado, mantener 5 seg en el máximo'
    },
    progresion: 'Avanzar primero el rango de movimiento, luego las repeticiones, y por último agregar la mantención de 5 seg.'
  },
  {
    nombre: 'Estiramiento de flexores de cadera (zancada)',
    categoria: 'flexibilidad',
    area: 'Cadera',
    icon: 'zancada_cadera',
    descripcion: 'Posición de zancada, rodilla trasera apoyada, llevar la pelvis hacia adelante.',
    niveles: {
      bajo: '2 series x 20 seg por lado',
      moderado: '3 series x 30 seg por lado',
      alto: '3 series x 45 seg por lado, brazo del lado a estirar elevado'
    },
    progresion: 'Aumentar el tiempo de mantención gradualmente antes de agregar el brazo elevado.'
  },
  {
    nombre: 'Estiramiento de isquiotibiales supino',
    categoria: 'flexibilidad',
    area: 'Cadera',
    icon: 'isquios_supino',
    descripcion: 'Acostado, elevar una pierna extendida sosteniendo con banda o manos detrás del muslo.',
    niveles: {
      bajo: '2 series x 20 seg por lado, rodilla algo flectada',
      moderado: '3 series x 30 seg por lado, rodilla más extendida',
      alto: '3 series x 45 seg por lado, rodilla extendida, dorsiflexión de tobillo activa'
    },
    progresion: 'Progresar extendiendo gradualmente la rodilla antes de agregar la dorsiflexión activa de tobillo.'
  },
  {
    nombre: 'Flexo-extensión activa de rodilla',
    categoria: 'flexibilidad',
    area: 'Rodilla',
    icon: 'rodilla_flexext',
    descripcion: 'Sentado al borde de la camilla o silla, flectar y extender la rodilla de forma lenta y controlada.',
    niveles: {
      bajo: '2 series x 10 rep, rango parcial sin dolor',
      moderado: '3 series x 15 rep, rango completo disponible',
      alto: '3 series x 20 rep, agregar pausa de 3 seg en extensión'
    },
    progresion: 'Aumentar primero el rango disponible, luego las repeticiones, y por último la pausa isométrica final.'
  },
  {
    nombre: 'Movilidad de tobillo en dorsiflexión (pared)',
    categoria: 'flexibilidad',
    area: 'Tobillo / pie',
    icon: 'tobillo_pared',
    descripcion: 'De pie frente a la pared, llevar la rodilla hacia adelante manteniendo el talón en el suelo.',
    niveles: {
      bajo: '2 series x 8 rep por lado',
      moderado: '3 series x 12 rep por lado',
      alto: '3 series x 15 rep por lado, mayor distancia del pie a la pared'
    },
    progresion: 'Progresar aumentando la distancia del pie a la pared cada 1-2 semanas si no hay dolor.'
  },
  {
    nombre: 'Estiramiento de pectoral en marco de puerta',
    categoria: 'flexibilidad',
    area: 'Hombro',
    icon: 'pectoral_marco',
    descripcion: 'Antebrazo apoyado en el marco de la puerta con el codo a la altura del hombro; avanzar el cuerpo hasta sentir estiramiento en el pecho.',
    niveles: {
      bajo: '2 series x 20 seg por lado',
      moderado: '3 series x 30 seg por lado',
      alto: '3 series x 40 seg por lado'
    },
    progresion: 'Aumentar el tiempo de mantención y variar la altura del codo gradualmente.'
  },
  {
    nombre: 'Movilidad de columna en cuatro apoyos (gato-camello)',
    categoria: 'flexibilidad',
    area: 'Columna / core',
    icon: 'gato_camello',
    descripcion: 'En cuatro apoyos, redondear la espalda llevando el mentón al pecho y luego extenderla mirando al frente, lento y sin dolor.',
    niveles: {
      bajo: '2 series x 8 rep lentas',
      moderado: '3 series x 10 rep',
      alto: '3 series x 12 rep con pausa de 3 seg en cada extremo'
    },
    progresion: 'Aumentar repeticiones y pausas manteniendo el movimiento controlado.'
  },
  {
    nombre: 'Estiramiento de gemelo en pared',
    categoria: 'flexibilidad',
    area: 'Tobillo / pie',
    icon: 'gemelo_pared',
    descripcion: 'Manos en la pared, una pierna atrás con la rodilla estirada y el talón apoyado; inclinar el cuerpo hacia la pared.',
    niveles: {
      bajo: '2 series x 20 seg por lado',
      moderado: '3 series x 30 seg por lado',
      alto: '3 series x 45 seg por lado'
    },
    progresion: 'Aumentar el tiempo de estiramiento; luego repetir con la rodilla levemente flectada.'
  },
  {
    nombre: 'Estiramiento de flexores y extensores de muñeca',
    categoria: 'flexibilidad',
    area: 'Codo / muñeca / mano',
    icon: 'muneca_estiramiento',
    descripcion: 'Brazo estirado con la palma hacia arriba o hacia abajo; con la otra mano llevar suavemente la muñeca hasta sentir estiramiento en el antebrazo.',
    niveles: {
      bajo: '2 series x 15 seg por lado y posición',
      moderado: '3 series x 25 seg por lado y posición',
      alto: '3 series x 30 seg por lado y posición'
    },
    progresion: 'Aumentar el tiempo de mantención sin provocar dolor ni hormigueo.'
  },
  {
    nombre: 'Respiración diafragmática',
    categoria: 'flexibilidad',
    area: 'Columna / core',
    icon: 'respiracion',
    descripcion: 'Acostado con las rodillas flectadas y una mano en el abdomen; inspirar por la nariz inflando el abdomen y soltar el aire lento por la boca.',
    niveles: {
      bajo: '5 respiraciones lentas, 2 veces al día',
      moderado: '10 respiraciones lentas, 2 veces al día',
      alto: '3 min continuos, 2 veces al día'
    },
    progresion: 'Aumentar la duración y luego practicarla sentado y de pie.'
  },
  {
    nombre: 'Estiramiento de piriforme (figura 4)',
    categoria: 'flexibilidad',
    area: 'Cadera',
    icon: 'piriforme_4',
    descripcion: 'Acostado, cruzar un tobillo sobre la rodilla contraria y acercar la pierna de apoyo hacia el pecho.',
    niveles: {
      bajo: '2 series x 20 seg por lado',
      moderado: '3 series x 30 seg por lado',
      alto: '3 series x 45 seg por lado'
    },
    progresion: 'Aumentar el tiempo; si hay dolor irradiado a la pierna, reducir la intensidad.'
  },
  {
    nombre: 'Rodilla al pecho (lumbar)',
    categoria: 'flexibilidad',
    area: 'Columna / core',
    icon: 'rodilla_pecho',
    descripcion: 'Acostado boca arriba, llevar una rodilla hacia el pecho abrazándola con las manos, sin forzar.',
    niveles: {
      bajo: '2 series x 15 seg por lado',
      moderado: '3 series x 20 seg por lado',
      alto: '3 series x 30 seg por lado o ambas rodillas'
    },
    progresion: 'Aumentar el tiempo y pasar a llevar ambas rodillas si no hay dolor.'
  },
  {
    nombre: 'Estiramiento de cuádriceps de pie',
    categoria: 'flexibilidad',
    area: 'Rodilla',
    icon: 'cuadriceps_pie',
    descripcion: 'De pie con apoyo, llevar el talón hacia el glúteo sujetando el pie, con las rodillas juntas y la pelvis neutra.',
    niveles: {
      bajo: '2 series x 15 seg por lado',
      moderado: '3 series x 25 seg por lado',
      alto: '3 series x 35 seg por lado'
    },
    progresion: 'Aumentar el tiempo de mantención y retirar el apoyo.'
  },
  {
    nombre: 'Rodar pelota bajo el pie (fascia plantar)',
    categoria: 'flexibilidad',
    area: 'Tobillo / pie',
    icon: 'pelota_pie',
    descripcion: 'Sentado, rodar una pelota pequeña bajo la planta del pie con presión suave a moderada, de talón a dedos.',
    niveles: {
      bajo: '1 min por pie, presión suave',
      moderado: '2 min por pie, presión moderada',
      alto: '3 min por pie, pelota firme'
    },
    progresion: 'Aumentar tiempo y firmeza de la pelota según tolerancia.'
  },

  // --- Fortalecimiento ---
  {
    nombre: 'Isométricos de cuádriceps',
    categoria: 'fortalecimiento',
    area: 'Rodilla',
    icon: 'isometrico_cuad',
    descripcion: 'Sentado o acostado, contraer el cuádriceps empujando la rodilla contra la camilla.',
    niveles: {
      bajo: '3 series x 10 rep, contracción 5 seg',
      moderado: '3 series x 12 rep, contracción 8 seg',
      alto: '4 series x 15 rep, contracción 10 seg con cojín bajo la rodilla'
    },
    progresion: 'Aumentar el tiempo de contracción antes de subir series/repeticiones. Progresar a ejercicios dinámicos cuando tolere bien el nivel alto.'
  },
  {
    nombre: 'Sentadilla parcial asistida',
    categoria: 'fortalecimiento',
    area: 'Rodilla',
    icon: 'sentadilla_asistida',
    descripcion: 'Apoyado en silla o baranda, descender en sentadilla hasta el rango tolerado y volver a subir.',
    niveles: {
      bajo: '2 series x 8 rep, rango 1/4, con apoyo de manos',
      moderado: '3 series x 12 rep, rango 1/2, apoyo leve',
      alto: '3 series x 15 rep, rango completo tolerado, sin apoyo de manos'
    },
    progresion: 'Progresar reduciendo el apoyo de manos antes de aumentar el rango de descenso.'
  },
  {
    nombre: 'Puente de glúteos',
    categoria: 'fortalecimiento',
    area: 'Cadera',
    icon: 'puente',
    descripcion: 'Acostado boca arriba, rodillas flectadas, elevar la cadera contrayendo glúteos.',
    niveles: {
      bajo: '2 series x 8 rep, mantener 3 seg',
      moderado: '3 series x 12 rep, mantener 5 seg',
      alto: '3 series x 15 rep, mantener 5 seg con banda elástica sobre las rodillas'
    },
    progresion: 'Progresar repeticiones y tiempo de mantención antes de agregar resistencia con banda.'
  },
  {
    nombre: 'Abducción de cadera en decúbito lateral',
    categoria: 'fortalecimiento',
    area: 'Cadera',
    icon: 'abduccion_lateral',
    descripcion: 'Acostado de lado, elevar la pierna superior extendida manteniendo la cadera estable.',
    niveles: {
      bajo: '2 series x 10 rep por lado, sin peso',
      moderado: '3 series x 12 rep por lado, banda liviana en tobillos',
      alto: '3 series x 15 rep por lado, banda media/pesada'
    },
    progresion: 'Aumentar repeticiones sin banda primero; luego progresar la resistencia de la banda gradualmente.'
  },
  {
    nombre: 'Elevación de talones (gastrocnemio)',
    categoria: 'fortalecimiento',
    area: 'Tobillo / pie',
    icon: 'elevacion_talones',
    descripcion: 'De pie, con apoyo si es necesario, elevar los talones y descender controladamente.',
    niveles: {
      bajo: '2 series x 10 rep, bipodal con apoyo de manos',
      moderado: '3 series x 15 rep, bipodal sin apoyo',
      alto: '3 series x 15 rep, unipodal o con peso adicional'
    },
    progresion: 'Progresar retirando el apoyo de manos, luego pasar de bipodal a unipodal antes de agregar peso.'
  },
  {
    nombre: 'Remo con banda elástica',
    categoria: 'fortalecimiento',
    area: 'Hombro',
    icon: 'remo_banda',
    descripcion: 'Banda anclada frente al paciente, tirar llevando los codos hacia atrás juntando escápulas.',
    niveles: {
      bajo: '2 series x 10 rep, banda liviana',
      moderado: '3 series x 12 rep, banda media',
      alto: '3 series x 15 rep, banda fuerte'
    },
    progresion: 'Aumentar repeticiones con la misma banda antes de subir a una banda de mayor resistencia.'
  },
  {
    nombre: 'Rotación externa de hombro con banda',
    categoria: 'fortalecimiento',
    area: 'Hombro',
    icon: 'rot_externa_banda',
    descripcion: 'Codo pegado al cuerpo en 90°, rotar el antebrazo hacia afuera contra la banda.',
    niveles: {
      bajo: '2 series x 10 rep, banda liviana',
      moderado: '3 series x 12 rep, banda media',
      alto: '3 series x 15 rep, banda fuerte, mantener 2 seg al final'
    },
    progresion: 'Progresar la resistencia de la banda gradualmente; agregar la mantención final solo en nivel alto.'
  },
  {
    nombre: 'Plancha abdominal (core)',
    categoria: 'fortalecimiento',
    area: 'Columna / core',
    icon: 'plancha',
    descripcion: 'Apoyo en antebrazos y pies (o rodillas), mantener columna neutra.',
    niveles: {
      bajo: '3 series x 10-15 seg, apoyo en rodillas',
      moderado: '3 series x 20-30 seg, apoyo en pies',
      alto: '3 series x 40-60 seg, apoyo en pies con elevación alterna de pierna'
    },
    progresion: 'Aumentar el tiempo de mantención en tramos de 5-10 seg antes de pasar de rodillas a pies, y luego agregar movimiento.'
  },
  {
    nombre: 'Extensión lumbar en prono (McKenzie)',
    categoria: 'fortalecimiento',
    area: 'Columna / core',
    icon: 'mckenzie',
    descripcion: 'Boca abajo, apoyar antebrazos y luego manos elevando el tronco progresivamente.',
    niveles: {
      bajo: '2 series x 8 rep, sobre antebrazos',
      moderado: '3 series x 10 rep, extensión parcial de brazos',
      alto: '3 series x 12 rep, extensión completa de brazos, mantener 3 seg'
    },
    progresion: 'Progresar el rango de extensión gradualmente; avanzar solo si no aumenta el dolor irradiado.'
  },
  {
    nombre: 'Retracción escapular (apretar omóplatos)',
    categoria: 'fortalecimiento',
    area: 'Hombro',
    icon: 'retraccion_escapular',
    descripcion: 'Sentado o de pie con la espalda recta, juntar los omóplatos hacia atrás y abajo sin encoger los hombros.',
    niveles: {
      bajo: '2 series x 8 rep, mantener 5 seg',
      moderado: '3 series x 10 rep, mantener 8 seg',
      alto: '3 series x 12 rep, mantener 10 seg con banda elástica liviana'
    },
    progresion: 'Aumentar primero el tiempo de mantención y luego agregar banda elástica.'
  },
  {
    nombre: 'Bird-dog (brazo y pierna opuestos)',
    categoria: 'fortalecimiento',
    area: 'Columna / core',
    icon: 'bird_dog',
    descripcion: 'En cuatro apoyos, estirar un brazo y la pierna contraria manteniendo la espalda neutra y sin rotar la pelvis.',
    niveles: {
      bajo: '2 series x 6 rep por lado, mantener 3 seg',
      moderado: '3 series x 8 rep por lado, mantener 5 seg',
      alto: '3 series x 10 rep por lado, mantener 8 seg'
    },
    progresion: 'Aumentar el tiempo de mantención y luego agregar peso liviano en tobillo o muñeca.'
  },
  {
    nombre: 'Equilibrio en un pie',
    categoria: 'fortalecimiento',
    area: 'Tobillo / pie',
    icon: 'equilibrio_monopodal',
    descripcion: 'De pie cerca de un apoyo, levantar un pie y mantener el equilibrio con la pelvis nivelada.',
    niveles: {
      bajo: '3 x 15 seg por pie con apoyo de una mano',
      moderado: '3 x 30 seg por pie sin apoyo',
      alto: '3 x 30 seg por pie sobre superficie blanda o con ojos cerrados'
    },
    progresion: 'Retirar el apoyo, luego aumentar el tiempo y por último agregar superficie inestable.'
  },
  {
    nombre: 'Fortalecimiento de muñeca con peso liviano',
    categoria: 'fortalecimiento',
    area: 'Codo / muñeca / mano',
    icon: 'muneca_excentrico',
    descripcion: 'Antebrazo apoyado en una mesa con la mano libre; subir la muñeca con ayuda y bajarla lento (3 seg) con peso liviano.',
    niveles: {
      bajo: '2 series x 10 rep, sin peso o 0.5 kg',
      moderado: '3 series x 12 rep, 1 kg',
      alto: '3 series x 15 rep, 1.5-2 kg'
    },
    progresion: 'Aumentar repeticiones y luego el peso en pasos pequeños, solo si no hay dolor al día siguiente.'
  },
  {
    nombre: 'Sentarse y pararse de una silla',
    categoria: 'fortalecimiento',
    area: 'Rodilla',
    icon: 'sentarse_pararse',
    descripcion: 'Sentado en una silla firme, ponerse de pie sin ayuda de las manos y volver a sentarse lento.',
    niveles: {
      bajo: '2 series x 6 rep, con apoyo de manos si es necesario',
      moderado: '3 series x 8 rep sin manos',
      alto: '3 series x 12 rep, bajando en 3 seg'
    },
    progresion: 'Retirar el apoyo de las manos, luego usar una silla más baja.'
  },
  {
    nombre: 'Elevación de pierna recta',
    categoria: 'fortalecimiento',
    area: 'Rodilla',
    icon: 'elevacion_pierna',
    descripcion: 'Acostado con una rodilla flectada y la otra pierna estirada; levantarla hasta la altura de la otra rodilla, con el cuádriceps contraído.',
    niveles: {
      bajo: '2 series x 8 rep, mantener 2 seg',
      moderado: '3 series x 10 rep, mantener 3 seg',
      alto: '3 series x 12 rep con tobillera 1 kg'
    },
    progresion: 'Aumentar repeticiones y mantención antes de agregar peso.'
  },

  // --- Aeróbico ---
  {
    nombre: 'Caminata en superficie plana',
    categoria: 'aerobico',
    area: 'General / cuerpo completo',
    icon: 'caminata',
    descripcion: 'Caminata continua a ritmo cómodo, en terreno plano y estable.',
    niveles: {
      bajo: '10-15 min, ritmo suave, puede fraccionarse',
      moderado: '20-25 min, ritmo moderado continuo',
      alto: '30-40 min, ritmo sostenido o con tramos de mayor velocidad'
    },
    progresion: 'Aumentar 5 min por semana según tolerancia antes de subir el ritmo o incorporar tramos más intensos.'
  },
  {
    nombre: 'Bicicleta estática',
    categoria: 'aerobico',
    area: 'General / cuerpo completo',
    icon: 'cardio_cycle',
    descripcion: 'Pedaleo en bicicleta estática con resistencia baja a moderada según tolerancia.',
    niveles: {
      bajo: '10 min, resistencia mínima',
      moderado: '15-20 min, resistencia media',
      alto: '25-30 min, resistencia media-alta con intervalos'
    },
    progresion: 'Aumentar primero la duración, luego la resistencia, y por último incorporar intervalos.'
  },
  {
    nombre: 'Step-ups en escalón bajo',
    categoria: 'aerobico',
    area: 'General / cuerpo completo',
    icon: 'cardio_step',
    descripcion: 'Subir y bajar un escalón bajo de forma alternada, ritmo constante.',
    niveles: {
      bajo: '2 series x 1 min, ritmo lento, con apoyo',
      moderado: '3 series x 2 min, ritmo moderado',
      alto: '3 series x 3 min, ritmo más rápido o escalón más alto'
    },
    progresion: 'Progresar el tiempo por serie antes de aumentar la altura del escalón o el ritmo.'
  },
  {
    nombre: 'Ejercicio en piscina / hidroterapia',
    categoria: 'aerobico',
    area: 'General / cuerpo completo',
    icon: 'cardio_pool',
    descripcion: 'Caminata o movimientos activos en agua a la altura de la cintura/pecho.',
    niveles: {
      bajo: '10 min, agua tranquila, ritmo suave',
      moderado: '15-20 min, incluyendo desplazamientos laterales',
      alto: '20-25 min, con mayor velocidad de desplazamiento'
    },
    progresion: 'Aumentar la duración antes de incorporar desplazamientos laterales y mayor velocidad.'
  }
];
