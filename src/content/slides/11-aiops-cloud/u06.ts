import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 11 Unidad 6. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 11 · Unidad 6",
    title: "Operación de GenAI",
    subtitle: "4 hrs · Costo · calidad · guardrails — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Operar GenAI es operar incertidumbre acotada",
    items: [
      "Costo y latencia son variables de producto, no de infra sola.",
      "Calidad deriva: prompts, datos, modelo y tráfico cambian juntos.",
      "Guardrails = política + medición + rollback, no un filtro mágico.",
      "El runbook debe incluir “qué hacer cuando el modelo inventa”.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Definir presupuesto de tokens/costo y alertas accionables.",
      "Montar evaluación continua de salidas (sample + jueces + humano).",
      "Operar incidentes de calidad con criterios de degradación.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Economía",
  },
  {
    type: "bullets",
    kicker: "Costo",
    title: "Tokens como unidad operativa",
    items: [
      "In/out, caché de prefijo, reintentos.",
      "Presupuesto diario y kill-switch.",
      "Trade-off modelo chico local vs API cerrado.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Calidad",
  },
  {
    type: "bullets",
    kicker: "Eval continua",
    title: "No solo uptime",
    items: [
      "Golden set + tráfico muestreado.",
      "Abstención y schema inválido como señales.",
      "Deriva de prompts versionados (curso 09).",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Guardrails",
  },
  {
    type: "bullets",
    kicker: "Control",
    title: "Capas proporcionales",
    items: [
      "Validación de salida y límites de herramienta.",
      "Human-in-the-loop donde el riesgo lo exige.",
      "Degradación: plantillas, modelo menor, cola.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Cierre",
  },
  {
    type: "bullets",
    kicker: "Operación",
    title: "Runbook GenAI",
    items: [
      "Síntomas: alza de costo, caída de parseo, quejas de tono.",
      "Acciones: pin de prompt/modelo, canaria atrás, postmortem.",
      "Puente al design doc del curso 10.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Cierre del arco 08–11 · Magíster en IA UAI",
  },
];
