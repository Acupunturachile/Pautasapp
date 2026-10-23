export const SEMAFORO_EJERCICIO = [
  {
    color: '#16a34a',
    bg: '#f0fdf4',
    emoji: '🟢',
    titulo: 'Verde — Continuar',
    criterio: 'Sin dolor o molestia leve (EVA 0-2) que no aumenta durante el ejercicio.',
    accion: 'Puede continuar la pauta con normalidad y progresar según lo indicado.'
  },
  {
    color: '#d97706',
    bg: '#fffbeb',
    emoji: '🟡',
    titulo: 'Amarillo — Precaución, reducir o pausar',
    criterio: 'Dolor leve a moderado (EVA 3-5), fatiga inusual o molestia que cede al minuto de detenerse.',
    accion: 'Reducir repeticiones/carga o bajar de nivel. Si persiste en la próxima sesión, consultar con su profesional.'
  },
  {
    color: '#dc2626',
    bg: '#fef2f2',
    emoji: '🔴',
    titulo: 'Rojo — Detener de inmediato',
    criterio: 'Dolor agudo o intenso (EVA >5), dolor de pecho, disnea, mareo, hinchazón súbita, hormigueo o pérdida de fuerza.',
    accion: 'Detener el ejercicio de inmediato. Contactar al profesional tratante o acudir a urgencia si el síntoma es severo.'
  }
];

export function sugerirPerfilCarga(edad?: string, condicion?: string): string {
  const edadAlta = edad === '61-75' || edad === 'Mayor de 75';
  const sedentario = condicion === 'Sedentario';
  if (edadAlta && sedentario) {
    return 'Perfil de mayor precaución (edad avanzada + sedentarismo): se sugiere iniciar en carga baja en todos los ejercicios y progresar gradualmente.';
  }
  if (edadAlta || sedentario) {
    return 'Se sugiere iniciar en carga baja o moderada y progresar según tolerancia clínica.';
  }
  return '';
}
