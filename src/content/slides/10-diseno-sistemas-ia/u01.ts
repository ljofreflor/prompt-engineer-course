import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 1. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 1",
    title: "De la decisión al sistema",
    subtitle: "4 hrs · Especificación y requisitos — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Empezamos por la decisión, no por el modelo",
    items: [
      "Todo sistema de IA mejora (o debería mejorar) una decisión existente.",
      "Sin línea base medible no hay criterio de éxito.",
      "Latencia, costo y tolerancia al error son diseño, no detalle.",
      "A veces la respuesta correcta es no usar ML.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Identificar la decisión y su línea base.",
      "Distinguir predicción, decisión y acción.",
      "Establecer presupuestos no funcionales cuantitativos.",
      "Redactar una especificación evaluable por un tercero.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Decisión y línea base",
  },
  {
    type: "bullets",
    kicker: "Ficha",
    title: "Qué documentar primero",
    items: [
      "Decisión objetivo y actor decisor.",
      "Proceso actual y frecuencia.",
      "Costo del error por tipo (FP/FN o equivalentes).",
      "Alternativas: reglas, optimización, rediseño de proceso.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Predicción → acción",
  },
  {
    type: "viz",
    kicker: "Cadena",
    title: "Predicción · decisión · acción · resultado",
    viz: "decision-chain",
    caption: "Sin acción (y sin resultado medible) la predicción no crea valor.",
  },
  {
    type: "bullets",
    kicker: "Implicancias",
    title: "Qué acota la arquitectura",
    items: [
      "Una predicción correcta sin acción no crea valor.",
      "La ventana temporal de la decisión acota la arquitectura.",
      "Capacidad de ejecución de la organización = restricción.",
      "Definir éxito antes de construir.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Requisitos no funcionales",
  },
  {
    type: "bullets",
    kicker: "Presupuestos",
    title: "Variables que admiten o matan arquitecturas",
    items: [
      "Latencia extremo a extremo (y descomposición).",
      "Costo unitario vs valor de la decisión.",
      "Disponibilidad y degradación admisible.",
      "Volumen, concurrencia, trazabilidad y retención.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller de especificación",
  },
  {
    type: "bullets",
    kicker: "Producto",
    title: "Sección 1 del design doc",
    items: [
      "Ficha de especificación del caso propio.",
      "Presentación breve + crítica cruzada.",
      "Sin números inventados: declarar supuestos.",
      "Este curso produce especificación, no despliegue (→ curso 11).",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: patrones de arquitectura (Unidad 2)",
  },
];
