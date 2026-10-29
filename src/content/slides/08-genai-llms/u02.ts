import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 2. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 2",
    title: "El pipeline de post-entrenamiento",
    subtitle: "4 hrs · Pretrain · SFT · alineación — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Atribuí el comportamiento a la etapa correcta",
    items: [
      "Pretrain ≠ seguir instrucciones.",
      "SFT enseña formato y tareas; no “conoce” todo.",
      "Alineación (RLHF/DPO) mueve preferencias — con costos.",
      "El stack del curso: Colab/HF + API cerrada + local (contingencia).",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Describir etapas del pipeline de un modelo de instrucción.",
      "Atribuir comportamientos a pretrain / SFT / alineación.",
      "Reconocer impuesto de alineación y sesgo de longitud.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Pre-entrenamiento",
  },
  {
    type: "bullets",
    kicker: "Base",
    title: "Objetivo auto-supervisado",
    items: [
      "Corpus, filtrado, contaminación de benchmarks.",
      "Capacidades emergentes vs mitos de marketing.",
      "Límite: el pretrain no garantiza obediencia a tu schema.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — SFT",
  },
  {
    type: "bullets",
    kicker: "Instrucción",
    title: "De continuación a seguimiento",
    items: [
      "Datos de instrucción (humanos / sintéticos / destilación).",
      "Qué se gana: formato, tareas, estilo.",
      "Qué no se gana: hechos frescos ni garantías de abstención.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Alineación",
  },
  {
    type: "bullets",
    kicker: "Preferencias",
    title: "RLHF, DPO y trade-offs",
    items: [
      "Modelo de recompensa vs optimización directa.",
      "Impuesto de alineación, complacencia, sesgo de longitud.",
      "Constitutional / principios: otra vía, mismos trade-offs.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller de atribución",
  },
  {
    type: "bullets",
    kicker: "Práctica",
    title: "Stack del dictado",
    items: [
      "Colab/Kaggle para demos con pesos abiertos (HF).",
      "API cerrada para comparación (clave de equipo).",
      "LM Studio si cae la cuota GPU — contenido de U5.",
      "Ver /herramientas/#curso-08",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: vías de adaptación (Unidad 3)",
  },
];
