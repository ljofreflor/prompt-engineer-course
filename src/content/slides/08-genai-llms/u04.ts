import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 4. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 4",
    title: "Modelos abiertos y cerrados",
    subtitle: "4 hrs · Licencias · costo · soberanía — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Abierto no es un booleano",
    items: [
      "Pesos, código, datos y licencia son ejes distintos.",
      "El punto de cruce de costo depende del volumen y del idle.",
      "Soberanía y estabilidad de versión son requisitos de diseño.",
      "Abstracción de proveedor sin alternativa evaluada es teatro.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Distinguir grados de apertura y licencias relevantes.",
      "Calcular punto de cruce abierto vs cerrado.",
      "Proponer mitigación de dependencia de proveedor.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Apertura",
  },
  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Qué significa abierto",
    items: [
      "Pesos descargables ≠ licencia permisiva.",
      "Restricciones comerciales y de uso en Chile.",
      "Documentación y reproducibilidad como parte del paquete.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Dimensiones",
  },
  {
    type: "bullets",
    kicker: "Decisión",
    title: "Qué mueve la aguja",
    items: [
      "Costo unitario y de operación.",
      "Latencia y localidad de datos.",
      "Especialización, soberanía, pin de versión.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Cruce",
  },
  {
    type: "bullets",
    kicker: "Ejercicio",
    title: "Punto de cruce por volumen",
    items: [
      "10k requests/día: local cuantizado vs API.",
      "Sensibilidad a precio/token y a GPU idle.",
      "Lab: labs del curso / estimaciones en herramientas.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Dependencia",
  },
  {
    type: "bullets",
    kicker: "Mitigación",
    title: "Salida creíble",
    items: [
      "Contrato OpenAI-compatible o propio.",
      "Alternativa abierta evaluada (no solo nombrada).",
      "Plan de cambio de proveedor en el design doc.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: inferencia — costo, latencia y contexto (Unidad 5)",
  },
];
