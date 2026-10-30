import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 2. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 2",
    title: "Patrones de arquitectura",
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
    kicker: "Teoría",
    title: "De modelos a sistemas compuestos",
    items: [
      "Zaharia et al. (2024): el estado del arte se mueve a compound AI systems (varios componentes + control).",
      "Huyen (2022), caps. 7–8: batch/online/streaming se eligen desde NFR, no desde moda.",
      "Diseñar asumiendo falla del modelo y del proveedor.",
    ],
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
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico de patrones",
    items: [
      "Régimen de inferencia — cuándo y con qué frescura se calcula la predicción (batch, online, streaming, precómputo).",
      "Sistema compuesto — varios componentes (modelo, reglas, retrieval, humano) bajo control explícito (Zaharia et al., 2024).",
      "Degradación elegante — comportamiento seguro y útil cuando el modelo o el proveedor fallan.",
      "RAG (patrón) — retrieval + generación como arquitectura con NFR por etapa, no como “mejor prompt”.",
    ],
  },
  {
    type: "viz",
    kicker: "Concepto",
    title: "El régimen sale del NFR",
    viz: "inference-regimes",
    caption: "Batch · online · streaming · precómputo — cada uno cambia costo, latencia y frescura.",
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
    kicker: "Teoría",
    title: "RAG como patrón de sistema",
    items: [
      "Lewis et al. (2020): retrieval + generación para conocimiento externo al peso del modelo.",
      "Gao et al. (2024) survey §§1–3: indexación → retrieval → generación — cada etapa con NFR propios.",
      "Aquí es arquitectura; el prompting fino vive en el curso 09.",
    ],
  },
  {
    type: "viz",
    kicker: "Arquitectura",
    title: "RAG como patrón, no como prompt",
    viz: "rag-pipeline",
    caption: "Cada etapa tiene NFR propios: frescura del índice, recall, latencia, costo.",
  },
  {
    type: "bullets",
    kicker: "Detalle",
    title: "Qué diseñar en cada etapa",
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
    kicker: "Taller",
    title: "Comportamiento cuando algo cae",
    items: [
      "Caché, timeouts, reintentos, rate limits, breakers.",
      "Degradación elegante y default seguro.",
      "Caso Chile: asistente de consultas a normativa SII — ¿batch nocturno del índice o online con timeout?",
      "Ejercicio: rediseñar bajo un NFR más duro (latencia o costo) y declarar supuestos.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Zaharia et al. (2024) — zaharia2024compound (BAIR blog, OA)",
      "Lewis et al. (2020) — lewis2020rag",
      "Gao et al. (2024) survey — gao2024ragsurvey; Huyen (2022) caps. 7–8",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: datos como infraestructura (Unidad 3)",
  },
];
