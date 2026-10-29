import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 2. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 2",
    title: "Patrones de arquitectura para sistemas de IA",
    subtitle: "4 hrs · Inferencia, composición y falla — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "El patrón se deriva de los NFR",
    items: [
      "Batch / online / streaming / precómputo no son gusto: son presupuesto.",
      "Los sistemas son compuestos: modelos + reglas + recuperación + humano.",
      "Diseñá asumiendo que el modelo y el proveedor fallan.",
      "RAG aquí es arquitectura; el prompting fino vive en el curso 09.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Seleccionar régimen de inferencia desde los NFR.",
      "Diseñar topologías compuestas defendibles.",
      "Especificar RAG como patrón (indexación → contexto).",
      "Incorporar resiliencia y degradación elegante.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Regímenes",
  },
  {
    type: "bullets",
    kicker: "Inferencia",
    title: "Elegir el ritmo de la predicción",
    items: [
      "Batch: costo bajo, frescura limitada.",
      "Online: latencia estricta, costo por request.",
      "Streaming: UX de tokens; otra curva de falla.",
      "Precómputo / feature store: frescura vs carga.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Composición I",
  },
  {
    type: "bullets",
    kicker: "Patrones",
    title: "Cascada, ruteo, ensamblado",
    items: [
      "Cascada por costo o por confianza.",
      "Ruteo por tipo de entrada / tenant.",
      "Ensamblado y votación: cuándo vale el gasto.",
      "Reglas duras antes o después del modelo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — RAG y tools",
  },
  {
    type: "bullets",
    kicker: "Arquitectura",
    title: "Recuperación aumentada como patrón",
    items: [
      "Indexación, segmentación, retrieval, rerank, ensamblaje.",
      "Verificación posterior y jueces: sesgos conocidos.",
      "Tools: misma disciplina de esquemas que en agentes.",
      "Delimitar vs Prompt Engineering (curso 09).",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Falla",
  },
  {
    type: "bullets",
    kicker: "Resiliencia",
    title: "Comportamiento cuando algo cae",
    items: [
      "Caché, timeouts, reintentos, rate limits, breakers.",
      "Degradación elegante y default seguro.",
      "Estrategia de reversión.",
      "Ejercicio: rediseñar bajo un NFR más duro.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: datos como infraestructura (Unidad 3)",
  },
];
