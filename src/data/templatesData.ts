import { PresetTemplate } from '../types/clinical';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'lumbalgia',
    nombre: 'Lumbalgia mecánica',
    diag: 'Lumbalgia mecánica',
    digito: 'lumbar',
    frec: 3,
    ex: [
      'Rodilla al pecho (lumbar)',
      'Movilidad de columna en cuatro apoyos (gato-camello)',
      'Puente de glúteos',
      'Bird-dog (brazo y pierna opuestos)',
      'Extensión lumbar en prono (McKenzie)',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'ciatica',
    nombre: 'Ciática / dolor irradiado',
    diag: 'Ciática',
    digito: 'ciatica',
    frec: 3,
    ex: [
      'Estiramiento de piriforme (figura 4)',
      'Estiramiento de isquiotibiales supino',
      'Estiramiento de flexores de cadera (zancada)',
      'Puente de glúteos',
      'Abducción de cadera en decúbito lateral',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'cervicalgia',
    nombre: 'Cervicalgia / tensión de cuello',
    diag: 'Cervicalgia',
    digito: 'cervical',
    frec: 4,
    ex: [
      'Flexión-extensión cervical suave',
      'Estiramiento de trapecio superior',
      'Retracción escapular (apretar omóplatos)',
      'Remo con banda elástica',
      'Estiramiento de pectoral en marco de puerta',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'hombro',
    nombre: 'Hombro doloroso',
    diag: 'Dolor de hombro',
    digito: 'hombro',
    frec: 4,
    ex: [
      'Círculos de hombro (péndulo de Codman)',
      'Estiramiento capsular posterior de hombro',
      'Estiramiento de pectoral en marco de puerta',
      'Retracción escapular (apretar omóplatos)',
      'Rotación externa de hombro con banda',
      'Remo con banda elástica'
    ]
  },
  {
    id: 'dorsal',
    nombre: 'Dolor dorsal / postura',
    diag: 'Dolor dorsal / postural',
    digito: 'dorsal',
    frec: 3,
    ex: [
      'Movilidad de columna en cuatro apoyos (gato-camello)',
      'Rotación de tronco en sedente',
      'Estiramiento de pectoral en marco de puerta',
      'Retracción escapular (apretar omóplatos)',
      'Remo con banda elástica',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'cadera',
    nombre: 'Cadera / glúteo',
    diag: 'Dolor de cadera / glúteo',
    digito: 'cadera',
    frec: 3,
    ex: [
      'Estiramiento de flexores de cadera (zancada)',
      'Estiramiento de piriforme (figura 4)',
      'Puente de glúteos',
      'Abducción de cadera en decúbito lateral',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'rodilla',
    nombre: 'Rodilla',
    diag: 'Dolor de rodilla',
    digito: 'rodilla',
    frec: 3,
    ex: [
      'Flexo-extensión activa de rodilla',
      'Elevación de pierna recta',
      'Isométricos de cuádriceps',
      'Sentarse y pararse de una silla',
      'Estiramiento de cuádriceps de pie',
      'Bicicleta estática'
    ]
  },
  {
    id: 'tobillo',
    nombre: 'Tobillo / pie',
    diag: 'Dolor de tobillo / pie',
    digito: 'tobillo',
    frec: 3,
    ex: [
      'Movilidad de tobillo en dorsiflexión (pared)',
      'Estiramiento de gemelo en pared',
      'Rodar pelota bajo el pie (fascia plantar)',
      'Elevación de talones (gastrocnemio)',
      'Equilibrio en un pie',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'codo',
    nombre: 'Codo / muñeca / mano',
    diag: 'Dolor de codo / muñeca',
    digito: 'codo',
    frec: 4,
    ex: [
      'Estiramiento de flexores y extensores de muñeca',
      'Fortalecimiento de muñeca con peso liviano',
      'Círculos de hombro (péndulo de Codman)',
      'Retracción escapular (apretar omóplatos)',
      'Estiramiento de trapecio superior',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'cefalea',
    nombre: 'Cefalea tensional',
    diag: 'Cefalea tensional',
    digito: 'cefalea',
    frec: 4,
    ex: [
      'Flexión-extensión cervical suave',
      'Estiramiento de trapecio superior',
      'Retracción escapular (apretar omóplatos)',
      'Rotación de tronco en sedente',
      'Caminata en superficie plana'
    ]
  },
  {
    id: 'estres',
    nombre: 'Estrés / tensión general',
    diag: 'Estrés / tensión muscular',
    digito: 'estres',
    frec: 4,
    ex: [
      'Respiración diafragmática',
      'Caminata en superficie plana',
      'Rotación de tronco en sedente',
      'Flexión-extensión cervical suave',
      'Estiramiento de trapecio superior'
    ]
  },
  {
    id: 'general',
    nombre: 'Acondicionamiento general',
    diag: 'Sedentarismo / acondicionamiento general',
    digito: 'fatiga',
    frec: 3,
    ex: [
      'Caminata en superficie plana',
      'Bicicleta estática',
      'Puente de glúteos',
      'Sentarse y pararse de una silla',
      'Rotación de tronco en sedente',
      'Elevación de talones (gastrocnemio)'
    ]
  }
];
