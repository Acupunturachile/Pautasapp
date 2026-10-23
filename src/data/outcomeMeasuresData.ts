import { OutcomeMeasure } from '../types/clinical';

export const INSTRUMENTOS: OutcomeMeasure[] = [
  { id: 'odi', nombre: 'Oswestry (ODI) · lumbar', max: 100, peorAlto: true, unidad: '%' },
  { id: 'ndi', nombre: 'Índice de discapacidad cervical (NDI)', max: 100, peorAlto: true, unidad: '%' },
  { id: 'dash', nombre: 'DASH · miembro superior', max: 100, peorAlto: true, unidad: 'puntos' },
  { id: 'womac', nombre: 'WOMAC · rodilla / cadera', max: 100, peorAlto: true, unidad: '%' },
  { id: 'lefs', nombre: 'LEFS · miembro inferior', max: 80, peorAlto: false, unidad: 'puntos' },
  { id: 'psfs', nombre: 'PSFS · función específica del paciente', max: 10, peorAlto: false, unidad: 'puntos' }
];

export function getInstrumento(id: string): OutcomeMeasure | undefined {
  return INSTRUMENTOS.find(x => x.id === id);
}
