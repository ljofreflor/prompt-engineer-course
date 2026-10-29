import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 6. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 6",
    title: "Evaluación generativa",
    subtitle: "4 hrs · Sets de dominio · jueces — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "El leaderboard no es tu producto",
    items: [
      "Benchmarks públicos saturan y se contaminan.",
      "Un set de dominio con casos difíciles mide lo que importa.",
      "El juez LLM hereda sesgos; hay que mitigarlos y contrastar.",
      "Propiedades (fidelidad, alucinación) se definen operativamente.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Construir un set de evaluación de dominio.",
      "Usar modelo juez con mitigación de sesgos.",
      "Medir propiedades específicas (Eval 3).",
    ],
  },
  {
    type: "viz",
    kicker: "Mapa",
    title: "Público vs dominio",
    viz: "eval-domain",
    caption: "El ranking relativo no certifica tu tarea; el set propio sí puede.",
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Públicos",
  },
  {
    type: "bullets",
    kicker: "Límites",
    title: "Evaluaciones públicas",
    items: [
      "Contaminación de entrenamiento.",
      "Saturación y validez externa.",
      "Qué sí sirven: ranking relativo, no certificación.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Set propio",
  },
  {
    type: "bullets",
    kicker: "Diseño",
    title: "Tarea, muestreo y potencia",
    items: [
      "Incluir casos difíciles y OOD.",
      "Tamaño vs intervalo de confianza.",
      "Versionar el set como artefacto.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Jueces",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "LLM-as-a-judge",
    items: [
      "Zheng et al. (2023): MT-Bench / Arena — el juez LLM se acerca al humano, con sesgos.",
      "Sesgos documentados: posición, longitud, auto-preferencia de familia.",
      "Mitigar: swap de orden, rúbricas, y medir concordancia humano–juez.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Tres sesgos del juez",
    viz: "judge-bias",
    caption: "Sin swap / rúbrica / concordancia humano, el score del juez es frágil.",
  },
  {
    type: "bullets",
    kicker: "LLM-as-judge",
    title: "Sesgos y concordancia",
    items: [
      "Longitud, posición, estilo.",
      "Rúbricas explícitas y doble ciego cuando importe.",
      "Concordancia humano–juez como gate.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Propiedades",
  },
  {
    type: "bullets",
    kicker: "Eval 3",
    title: "Fidelidad, alucinación, formato",
    items: [
      "Definición operativa + umbral.",
      "Sensibilidad al prompt de evaluación.",
      "Puente a labs del curso 09 (salida estructurada).",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Zheng et al. (2023), Judging LLM-as-a-Judge — zheng2023judge",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: multimodalidad, riesgos e integración (Unidad 7)",
  },
];
