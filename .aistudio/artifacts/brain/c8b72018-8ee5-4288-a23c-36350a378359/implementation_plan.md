# Pautas de Ejercicios & Rehabilitación · AcupunturaChile

Transformación y modernización de la aplicación clínica de prescripción de ejercicios terapéuticos y digitopuntura, migrando desde un archivo HTML monolítico a una aplicación modular de alta calidad en React 19 + TypeScript con Tailwind CSS, preservando intactas todas las funcionalidades clínicas y mejorando la ergonomía de trabajo para el profesional de la salud.

## Decisiones del Usuario y Criterios Confirmados

> [!IMPORTANT]
> **Decisiones confirmadas en la fase de clarificación:**
> - **Estilo Visual**: Minimalista neutro con pizarra (`slate-900`/`slate-700`) y acento azul médico (`sky-600`/`blue-700`), superficies limpias y legibilidad clínica de alto contraste.
> - **Arquitectura de Código**: Modularización limpia en componentes dedicados por función, modelos de datos y tipos TypeScript separados (`types/`, `data/`, `components/`, `hooks/`, `utils/`).
> - **Mejora Prioritaria**: Vista previa interactiva en tiempo real y panel de exportación refinado para hoja impresa/PDF clínica y mensaje formateado para WhatsApp.

---

## 1. Visión General y Concepto

La aplicación permite a kinesiólogos, acupuntores y profesionales de la rehabilitación prescribir pautas personalizadas de ejercicio físico y digitopuntura en pocos clics, asegurando el cumplimiento de criterios clínicos:
- **Catálogo Integral de Ejercicios**: Más de 30 ejercicios categorizados por flexibilidad, fortalecimiento y aeróbico, cubriendo 8 regiones corporales, con cargas escalonadas (baja, moderada, alta), progresiones guiadas, enlaces a demostraciones en video e ilustraciones anatómicas SVG claras.
- **Tamizaje de Seguridad & Semáforo Clínico**: Detección de banderas rojas (requerimiento de derivación médica), banderas amarillas de precaución (HTA, cardiopatías, osteoporosis, embarazo, anticoagulantes, etc.) y semáforo visual de síntomas durante la sesión.
- **Plan de Progresión de 4 Semanas**: Asignación de frecuencia semanal, esfuerzo percibido en escala de Borg (6-20), reglas de avance y planilla de registro de adherencia.
- **Módulo de Digitopuntura Anatómica & Medicina China**: Guía por 12 agrupaciones diagnósticas con coordenadas exactas, esquemas vectoriales SVG interactivos, subida de fotografía clínica propia del punto, variantes por patrones de Medicina Tradicional China (lengua, pulso, autocuidado y alimentación).
- **Seguimiento Clínico de Dolor y Función**: Registro longitudinal con escala EVA (0-10) e instrumentos validados (Oswestry/ODI, NDI, DASH, WOMAC, LEFS, PSFS), alertas de evolución y gráficos de línea interactivos con tooltip y vista tabular accesible.
- **Pautas Rápidas & Plantillas Personalizadas**: 12 plantillas prediseñadas por diagnóstico frecuente más gestión de plantillas propias del profesional.
- **Multicanal de Entrega al Paciente**: Impresión/PDF limpio sin elementos de navegación, copia optimizada para mensajería instantánea (WhatsApp), y archivo HTML autónomo para visualización interactiva y registro de adherencia en el teléfono del paciente.

---

## 2. Experiencia de Usuario y Diseño Visual

### Identidad Visual y Paleta de Colores (Minimalista Neutro & Azul Médico)
- **Fondo Neutral Dominante (60%)**: `bg-slate-50` / `bg-white` para luz diurna de consultorio, con tipografía nítida en `text-slate-900` y secundarios en `text-slate-600`.
- **Superficies Estructurales (30%)**: Tarjetas y barras de herramientas con bordes sutiles `border-slate-200`, fondos `bg-white` y `bg-slate-100/70` para paneles de control, respetando la regla de elevación única (sin cajas dentro de cajas).
- **Acento Clínico (10%)**: Azul médico profesional (`bg-blue-600` / `text-blue-700` y detalles `sky-600` para controles primarios, pestañas activas y enlaces funcionales).
- **Semáforo y Estados Clínicos**:
  - Verde recuperación: `#16a34a` (continuar / evolución favorable)
  - Amarillo precaución: `#d97706` (precaución / carga a ajustar)
  - Rojo alerta: `#dc2626` (banderas rojas / dolor agudo / detener)
  - Púrpura digitopuntura: `#7c3aed` (puntos y medicina tradicional)

### Tipografía y Espaciado
- **Tipografía de Display e Interfaz**: Interfaz estructurada en `Plus Jakarta Sans` / fuente del sistema, con títulos balanceados (`text-wrap: balance`), peso `font-semibold` o `font-bold` sin mayúsculas artificiales.
- **Cifras Tabulares**: `font-mono tabular-nums` para valores de escalas (EVA, Borg, puntajes de discapacidad) garantizando alineación vertical en tablas y gráficos.
- **Cero Pastillas Estáticas (Anti-Slop)**: Metadatos y etiquetas categorizadas como texto limpio con separadores discretos (`·` o `/`), reservando los botones y segmented controls exclusivamente a filtros e interacciones que ejecutan acciones reales.

### Navegación y Flujo de Trabajo
1. **Barra Superior**: Logotipo de AcupunturaChile, título descriptivo de la herramienta y barra de pestañas funcionales:
   - **Crear Pauta**: Selector de plantillas rápidas, ficha del paciente, tamizaje, biblioteca de ejercicios agregados, digitopuntura, progresión e indicaciones.
   - **Biblioteca**: Directorio y buscador de ejercicios, visualización de cargas, enlaces de video, edición y creación de nuevos ejercicios.
   - **Digitopuntura**: Guía diagnóstica detallada, esquemas SVG por región, soporte para fotos propias y correlación con patrones de medicina china.
   - **Seguimiento**: Ficha longitudinal por paciente, alertas automatizadas, gráficos de evolución de dolor y función, y registro de nueva sesión.
   - **Guardadas**: Historial de pautas guardadas con opciones de duplicar, ver/imprimir, editar y acceder a seguimiento directo.
2. **Vista Previa en Tiempo Real**: Visualizador de la hoja de pauta con alternancia instantánea entre diseño imprimible/PDF y texto para WhatsApp.

---

## 3. Decisiones Técnicas y Arquitectura Modular

```
┌────────────────────────────────────────────────────────────────────────┐
│                          App.tsx (Root & Navigation)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌──────────────────┐    ┌───────────────────────────┐    ┌──────────────────┐
│  useExercisePlan │    │    useClinicalTracking    │    │  useLocalStorage │
│  (Draft & Store) │    │   (Sessions, EVA, Alerts) │    │  (Offline State) │
└─────────┬────────┘    └─────────────┬─────────────┘    └────────┬─────────┘
          │                           │                           │
          ├───────────────────────────┴───────────────────────────┤
          ▼                                                       ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────┐
│              Vistas / Pestañas        │   │          Módulos de Datos         │
├───────────────────────────────────────┤   ├───────────────────────────────────┤
│ • PlanEditorTab (Crear Pauta)         │   │ • exercises.ts (30+ ejercicios)   │
│ • ExerciseLibraryTab (Biblioteca)     │   │ • digitopuncture.ts (12 regiones) │
│ • DigitopunctureTab (Puntos & Esquemas)│  │ • tcmPatterns.ts (Patrones MTC)   │
│ • TrackingTab (Seguimiento & Gráficos)│   │ • clinicalSafety.ts (Tamizaje)    │
│ • SavedPlansTab (Pautas Guardadas)    │   │ • templates.ts (Pautas Rápidas)   │
│ • PlanPreviewModal / SheetView        │   │ • outcomeMeasures.ts (ODI, DASH…) │
└───────────────────────────────────────┘   └───────────────────────────────────┘
```

### Organización de Archivos Planificada
- `src/types/clinical.ts`: Interfaces de datos fuertemente tipadas (`Exercise`, `PlanItem`, `ClinicalPlan`, `Screening`, `DigitoPoint`, `DigitoGroup`, `TCMPattern`, `TrackingSession`, `OutcomeMeasure`).
- `src/data/`:
  - `seedExercises.ts`: Base de ejercicios completa (semillas iniciales + v3).
  - `digitopunctureData.ts`: Coordenadas, esquemas SVG anatómicos precisos (nuca, espalda, cadera lateral, pierna anterior/posterior, brazo, antebrazo, cabeza), indicaciones de uso y banderas de embarazo.
  - `clinicalSafetyData.ts`: Banderas rojas, precauciones patológicas y mensajes clínicos guiados.
  - `tcmPatternsData.ts`: Patrones de MTC, correlaciones diagnósticas, lengua, pulso y variantes de puntos.
  - `templatesData.ts`: 12 pautas rápidas por patología más utilidades para plantillas personalizadas.
  - `outcomeMeasuresData.ts`: Batería de cuestionarios validados (ODI, NDI, DASH, WOMAC, LEFS, PSFS).
- `src/components/`:
  - `Navbar.tsx`: Encabezado y barra de navegación accesible.
  - `PlanEditor/`: Formulario del paciente, lista de ejercicios seleccionados con reordenamiento, selector de cargas, alertas automáticas, selector de plantilla y notas.
  - `ExerciseLibrary/`: Filtros por categoría/área, buscador en vivo, renderizado de iconos anatómicos SVG y modal de alta/edición.
  - `Digitopuncture/`: Renderizador interactivo de puntos, subida y compresión cliente de fotos propias en canvas, y semáforo de acupresión.
  - `Tracking/`: Tablero de paciente, semáforo de evolución, gráfico SVG reactivo con tooltip e historial editable.
  - `PlanSheet/`: Hoja clínica lista para impresión (A4/Carta), exportador a archivo móvil interactivo descargable y generador de texto estructurado para WhatsApp.
  - `Icons/`: Iconografía anatómica y funcional vectorizada sin dependencias externas pesadas.
- `src/hooks/usePersistentState.ts`: Gestión de persistencia local y sincronización segura.

---

## 4. Plan de Ejecución por Fases (Una vez aprobado)

1. **Estructuración de Tipos & Datos Clínicos**:
   - Extraer y organizar todas las constantes clínicas, listas de ejercicios, puntos de digitopuntura, esquemas SVG anatómicos y patrones de medicina china en archivos TypeScript modulares y limpios.
2. **Componentes Nucleares & Utilidades**:
   - Desarrollar utilidades de compresión de imágenes, exportación de texto para WhatsApp, renderizado de esquemas vectoriales anatómicos y generación del archivo descargable para el paciente.
3. **Módulos de la Interfaz de Usuario**:
   - Construir las 5 pestañas principales (`Crear Pauta`, `Biblioteca`, `Digitopuntura`, `Seguimiento`, `Guardadas`) asegurando que ningún botón quede sin acción y que el formulario valide el mínimo de 4 ejercicios.
4. **Vista de Hoja Clínica & Estilos de Impresión (@media print)**:
   - Garantizar que al presionar "Imprimir / Guardar PDF", la hoja quede perfectamente diagramada, limpia, con el logotipo de AcupunturaChile, sin menús ni botones, lista para entregar al paciente.
5. **Verificación y Compilación**:
   - Ejecutar `compile_applet` y validar cero errores de compilación ni advertencias de tipo.

---
*Fin del plan de implementación. Listo para revisión del usuario.*
