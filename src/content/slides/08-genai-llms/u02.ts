import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 2. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 2",
    title: "Post-entrenamiento",
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
      "Atribuir el síntoma a la etapa evita “más prompt” como única respuesta.",
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
    type: "viz",
    kicker: "Mapa",
    title: "Tres etapas, tres responsabilidades",
    viz: "posttrain-pipeline",
    caption: "Atribuir el síntoma a la etapa evita “más prompt” como única respuesta.",
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
      "Brown et al. (2020): el LM aprende a continuar; el few-shot emerge del pretrain.",
      "Corpus, filtrado y contaminación de benchmarks son riesgos de validez.",
      "Límite: el pretrain no garantiza obediencia a tu schema ni a políticas.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — SFT",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "InstructGPT en una diapositiva",
    items: [
      "Ouyang et al. (2022): SFT + RLHF mejora seguimiento de instrucciones vs GPT-3.",
      "La etiqueta humana define el objetivo; sesgos del labeler entran al modelo.",
      "Qué se gana: formato, tareas, estilo. Qué no: hechos frescos ni abstención garantizada.",
    ],
  },
  {
    type: "bullets",
    kicker: "Instrucción",
    title: "De continuación a seguimiento",
    items: [
      "Datos de instrucción: humanos, sintéticos o destilación.",
      "Evaluar con set de dominio, no solo con demos de chat.",
      "Si el fallo es de conocimiento fresco → no es (solo) un problema de SFT.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Alineación",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "RLHF vs DPO",
    items: [
      "RLHF: modelo de recompensa + política (pipeline largo, inestable).",
      "Rafailov et al. (2023) DPO: optimiza preferencias sin entrenar reward explícito.",
      "Trade-offs comunes: impuesto de alineación, complacencia, sesgo de longitud.",
    ],
  },
  {
    type: "bullets",
    kicker: "Preferencias",
    title: "Qué diagnosticar en clase",
    items: [
      "¿El modelo “no sabe” o “no quiere” (preferencia / rechazo)?",
      "Constitutional / principios: otra vía, mismos trade-offs de especificación.",
      "Atribuir el síntoma a pretrain / SFT / alineación antes de “más prompt”.",
    ],
  },

  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico del pipeline",
    items: [
      "Pre-entrenamiento — objetivo auto-supervisado de continuación; base de conocimiento y few-shot.",
      "SFT — fine-tune con instrucciones etiquetadas; enseña formato y tareas, no hechos frescos garantizados.",
      "Alineación (RLHF/DPO) — optimiza preferencias humanas; puede imponer impuesto de alineación.",
      "Impuesto de alineación — pérdida de capacidad o diversidad al ganar preferencia / rechazo.",
    ],
  },
  {
    type: "viz",
    kicker: "Trade-off",
    title: "Preferencia ↑ no es gratis",
    viz: "align-tax",
    caption: "Antes de “más prompt”, atribuí el síntoma a la etapa.",
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Instrucción ≠ preferencia",
    viz: "sft-align",
    caption: "SFT enseña a seguir el formato; la alineación mueve qué se prefiere decir.",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller de atribución",
  },
  {
    type: "bullets",
    kicker: "Taller",
    title: "Atribuir el síntoma",
    items: [
      "3 fallos (schema, hecho fresco, rechazo de tono): ¿pretrain, SFT o alineación?",
      "Caso Chile: asistente SII que “no quiere” dar montos — ¿política o conocimiento?",
      "Lab: comparar abierto (HF/LM) vs cerrado en la misma consigna.",
      "Eval-first: anotar etapa atribuida + evidencia (labs/RUBRIC.md).",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Ouyang et al. (2022), InstructGPT — ouyang2022instruct",
      "Rafailov et al. (2023), DPO — rafailov2023dpo",
      "Brown et al. (2020) §§1–3 — brown2020fewshot",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: vías de adaptación (Unidad 3)",
  },
];
