import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 5. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 5",
    title: "Evaluación, monitoreo y superficie de riesgo",
    subtitle: "4 hrs · Tres niveles · online · GenAI · controles — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Componente ≠ sistema ≠ resultado organizacional",
    items: [
      "Declarar los tres niveles y sus relaciones.",
      "Shadow / canary / experimentación con criterios de rollback.",
      "GenAI: sets propios + jueces con sesgos conocidos.",
      "Controles proporcionales al riesgo (no seguridad ofensiva).",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Especificar estrategia de evaluación en tres niveles.",
      "Diseñar puesta en producción con reversión explícita.",
      "Identificar superficie de riesgo y controles.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Tres niveles",
  },
  {
    type: "bullets",
    kicker: "Métricas",
    title: "Componente · sistema · organización",
    items: [
      "Divergencias habituales entre niveles.",
      "Goodhart: cuando la métrica deja de ser buena.",
      "Métricas de vigilancia.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Online",
  },
  {
    type: "bullets",
    kicker: "Despliegue",
    title: "Sombra, canaria, experimentación",
    items: [
      "Unidad de aleatorización, potencia, horizonte.",
      "Métricas sustitutas y su validación.",
      "Criterios de reversión automática.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Generativos",
  },
  {
    type: "bullets",
    kicker: "Eval GenAI",
    title: "Instrumentos y límites",
    items: [
      "Sets de dominio (no solo leaderboards).",
      "Jueces LLM: sesgos de longitud/estilo.",
      "Evaluación humana estructurada.",
      "Puente a labs del curso 09 (trayectorias).",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Riesgo",
  },
  {
    type: "bullets",
    kicker: "Controles",
    title: "Superficie de ataque / falla",
    items: [
      "OOD, deriva, envenenamiento.",
      "Inyección indirecta en sistemas que leen contenido.",
      "Fuga por la salida.",
      "Diseño proporcional al riesgo de la decisión.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: design doc, revisión y defensa (Unidad 6)",
  },
];
