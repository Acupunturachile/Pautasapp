export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isFirebaseUser?: boolean;
}

export type ExerciseCategory = 'flexibilidad' | 'fortalecimiento' | 'aerobico';

export type ExerciseLevel = 'bajo' | 'moderado' | 'alto';

export interface Exercise {
  id: string;
  nombre: string;
  categoria: ExerciseCategory;
  area: string;
  descripcion: string;
  niveles: {
    bajo: string;
    moderado: string;
    alto: string;
  };
  progresion?: string;
  icon: string;
  createdAt?: number;
}

export interface PlanItem {
  itemId: string;
  exId: string;
  nombre: string;
  categoria: ExerciseCategory;
  area: string;
  descripcion: string;
  nivel: ExerciseLevel;
  detalle: string;
  notaItem: string;
  icon: string;
  progresion?: string;
}

export interface DigitoPoint {
  cod: string;
  nombre: string;
  emb: boolean;
  ubic: string;
  uso: string;
  variante?: boolean;
  patron?: string;
}

export interface DigitoPlan {
  grupoId: string;
  puntos: DigitoPoint[];
}

export interface TCMPlan {
  patron: string;
  lengua: string;
  pulso: string;
}

export interface ClinicalPlan {
  id: string;
  paciente: string;
  edad?: string;
  sexo?: string;
  condicion?: string;
  condicionMedica?: string;
  diagnostico: string;
  profesional: string;
  fecha: string;
  notas: string;
  items: PlanItem[];
  frecuencia: number;
  progModo: string;
  digito?: DigitoPlan;
  tcm?: TCMPlan;
  createdAt?: number;
}

export interface TrackingSession {
  id?: string;
  key: string;
  paciente: string;
  iso: string;
  eva: number | '';
  instr: string;
  puntaje: number | '';
  borg: number | '';
  notas: string;
  createdAt?: number;
}

export interface OutcomeMeasure {
  id: string;
  nombre: string;
  max: number;
  peorAlto: boolean;
  unidad: string;
}

export interface PresetTemplate {
  id: string;
  nombre: string;
  diag: string;
  digito: string;
  frec: number;
  ex: string[];
}

export interface CustomTemplate {
  id: string;
  propia: true;
  nombre: string;
  diag: string;
  digito: string;
  frec: number;
  notas: string;
  items: Array<{
    nombre: string;
    nivel: ExerciseLevel;
    detalle: string;
    notaItem: string;
  }>;
}

export type AnyTemplate = (PresetTemplate & { propia?: false }) | CustomTemplate;
