import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 09 Unidad 6. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 09 · Unidad 6",
    title: "Evaluación agéntica y control",
    subtitle: "4 hrs · Trayectorias e inyección — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "El resultado no es la trayectoria",
    items: [
      "Success rate sin costo engaña.",
      "El modelo no distingue instrucción de contenido recuperado.",
      "Defensas solo por prompt no bastan.",
      "Los controles efectivos son de arquitectura (→ curso 10).",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Evaluar trayectorias: completitud, costo, pasos, tool errors.",
      "Explicar inyección directa vs indirecta.",
      "Proponer controles fuera del prompt.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Trayectorias",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Medir agentes sin autoengaño",
    items: [
      "Kapoor et al. (2024): success rate sin costo engaña; reportar pasos/tokens por éxito.",
      "Zheng et al. (2023): LLM-as-judge tiene sesgos (longitud, posición) — no es oráculo.",
      "Registrar trayectoria completa, no solo el output final.",
    ],
  },
  {
    type: "bullets",
    kicker: "Métricas",
    title: "Qué registrar",
    items: [
      "Completitud de la tarea.",
      "Costo / tokens / pasos por éxito.",
      "Tasa de invocación errónea de tools.",
      "Análisis cualitativo de fallas.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Evaluación práctica",
  },
  {
    type: "bullets",
    kicker: "Diseño",
    title: "Sets y jueces",
    items: [
      "Tareas con repeticiones (varianza).",
      "Jueces LLM: sesgos de longitud/posición.",
      "Validez externa de benchmarks públicos.",
      "Reusar labs u01–u04 como núcleo medible.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Inyección",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Inyección indirecta",
    items: [
      "Greshake et al. (2023): contenido recuperado puede contener instrucciones al agente.",
      "El modelo no distingue de forma fiable instrucción vs dato — el prompt no es perímetro.",
      "Controles efectivos: privilegio mínimo, validación de acciones, confirmación humana.",
    ],
  },
  {
    type: "bullets",
    kicker: "Ataque",
    title: "Directa e indirecta",
    items: [
      "Directa: el usuario intenta override.",
      "Indirecta: web/correo/doc con instrucciones al agente.",
      "Superficie crece con cada tool que lee contenido externo.",
      "Greshake et al. (2023) — evidencia, no anécdota.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Controles",
  },
  {
    type: "bullets",
    kicker: "Arquitectura",
    title: "Fuera del prompt",
    items: [
      "Privilegio mínimo de tools (sandbox del lab).",
      "Validación programática de acciones.",
      "Separación de canales instrucción / contenido.",
      "Confirmación humana para lo irreversible.",
    ],
  },
  {
    type: "image",
    kicker: "Stack del curso",
    title: "Labs locales medibles",
    src: "labs/screenshots/lab-u01-lmstudio-result.png",
    alt: "Evidencia lab local",
    caption: "Sin datos productivos · stack en Herramientas (curso 09)",
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Greshake et al. (2023) — greshake2023injection",
      "Kapoor et al. (2024) — kapoor2024agents",
      "Zheng et al. (2023) — zheng2023judge",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Puente a Diseño de Sistemas (curso 10) y AI.Ops (curso 11)",
  },
];
