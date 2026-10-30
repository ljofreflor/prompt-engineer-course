import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 5. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 5",
    title: "Evaluación y superficie de riesgo",
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
    kicker: "Teoría",
    title: "Evaluar en tres niveles",
    items: [
      "Huyen (2022), caps. 6 y 9: métricas de componente ≠ sistema ≠ organización.",
      "Breck et al. (2017): checklist de tests/monitoreo antes de llamar “producción”.",
      "Goodhart: cuando la métrica deja de ser buena — declarar vigilancia.",
    ],
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
    type: "viz",
    kicker: "Ilustración",
    title: "Tres niveles que no coinciden solos",
    viz: "eval-levels",
    caption: "Una métrica de componente buena puede fallar a nivel sistema u organización.",
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
    type: "viz",
    kicker: "Despliegue",
    title: "Canaria con rollback explícito",
    viz: "canary-deploy",
    caption: "Sin criterio de reversión no hay experimentación online, hay ruleta.",
  },
  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico de evaluación en producción",
    items: [
      "Nivel de evaluación — componente, sistema u organización; cada uno con métricas propias (Huyen, 2022).",
      "Canaria — exponer una fracción del tráfico a la nueva versión con promoción o rollback automático.",
      "Shadow — correr el nuevo sistema en paralelo sin afectar la decisión del usuario.",
      "Superficie de riesgo — vías por las que el sistema puede fallar o ser abusado (OOD, inyección, fuga).",
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
    kicker: "Teoría",
    title: "Superficie de riesgo en GenAI",
    items: [
      "Greshake et al. (2023): inyección indirecta cuando el sistema lee contenido externo.",
      "Controles proporcionales al riesgo de la decisión — no “seguridad ofensiva” en clase.",
      "OOD, deriva y fuga por la salida son requisitos de diseño.",
    ],
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
    type: "bullets",
    kicker: "Taller",
    title: "Estrategia de eval del design doc",
    items: [
      "Caso banca Chile: score de riesgo de crédito — qué mide componente vs organización.",
      "Definir canaria (% tráfico) y umbral de rollback (error / latencia / costo).",
      "Listar 3 controles proporcionales al riesgo de la decisión.",
      "Sin números inventados: declarar supuestos.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Huyen (2022), caps. 6 y 9 — huyen2022designing",
      "Greshake et al. (2023) — greshake2023injection",
      "Breck et al. (2017) — breck2017mltest",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: design doc, revisión y defensa (Unidad 6)",
  },
];
