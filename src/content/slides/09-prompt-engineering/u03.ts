import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 09 Unidad 3. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 09 · Unidad 3",
    title: "Razonamiento y verificación",
    subtitle: "4 hrs · CoT con criterio — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Razonar cuesta; verificar obliga",
    items: [
      "CoT no es gratis: latencia, tokens y a veces ruido.",
      "La cadena generada no es un log auditable del proceso.",
      "Descomponer y ensamblar cuando la tarea lo justifica.",
      "La verificación programática o en segundo paso cierra el loop.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Aplicar CoT / ensamblado / descomposición con costo-beneficio.",
      "Distinguir técnica de razonamiento vs explicación al usuario.",
      "Diseñar verificación programática o en segundo paso.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — CoT",
  },
  {
    type: "bullets",
    kicker: "Cuándo",
    title: "Chain-of-thought con criterio",
    items: [
      "Tareas multi-paso, aritmética, lógica — a menudo ayuda.",
      "Clasificación corta con schema: a veces sobra.",
      "Medir: pass rate × tokens × latencia.",
      "Temperatura baja si vas a parsear un resultado final.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Ensamblado",
  },
  {
    type: "bullets",
    kicker: "Técnicas",
    title: "Self-consistency y subtareas",
    items: [
      "Varias muestras + voto (self-consistency).",
      "Pipeline: plan → resolver → consolidar.",
      "Tree of Thoughts: exploración cara; justificar presupuesto.",
      "No confundir diversidad de paths con mayor verdad.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Fidelidad",
  },
  {
    type: "bullets",
    kicker: "Riesgo",
    title: "La explicación no es el proceso",
    items: [
      "El modelo puede rationalizar a posteriori.",
      "No mostrar la cadena cruda como fundamento legal/clínico.",
      "Separar: scratchpad interno vs mensaje al usuario.",
      "Preferir checks externos a “confiá en el thought”.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Verificación",
  },
  {
    type: "prose",
    kicker: "Lab vivo",
    title: "labs/09/u03/run_verify.py",
    paragraphs: [
      "Paso 1: modelo resuelve con pasos breves + respuesta final numérica.",
      "Paso 2: verificación programática (eval de expresión) — no confiar solo en el texto.",
      "Correr contra LM Studio en localhost:1234.",
    ],
  },
  {
    type: "image",
    kicker: "Stack",
    title: "Misma API local",
    src: "labs/screenshots/lmstudio-server-status.png",
    alt: "Servidor LM Studio",
    caption: "Verificación fuera del modelo · gemma-4-e4b",
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: del prompt al agente (Unidad 4)",
  },
];
