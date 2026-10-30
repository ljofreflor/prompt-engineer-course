import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 09 Unidad 4. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 09 · Unidad 4",
    title: "Del prompt al agente",
    subtitle: "4 hrs · ReAct, tools y terminación — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Un agente es un loop con presupuesto",
    items: [
      "Razón → acción → observación, con tope duro.",
      "La descripción de cada tool es una especificación.",
      "Sin límites de pasos/tiempo/costo, el sistema no es operable.",
      "Acciones irreversibles requieren control fuera del prompt.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Describir el ciclo razón–acción–observación.",
      "Especificar tools con esquemas y manejo de errores.",
      "Definir límites de iteraciones, costo y tiempo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Anatomía",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "ReAct: razón y acción",
    items: [
      "Yao et al. (2023): intercalan Thought / Action / Observation para grounding en el entorno.",
      "Sin tope de pasos/tiempo/costo el loop no es un sistema operable.",
      "La Observation la inyecta el runtime — el modelo no la inventa.",
    ],
  },
  {
    type: "bullets",
    kicker: "ReAct",
    title: "Piezas del agente",
    items: [
      "Planificación local (Thought).",
      "Selección de tool (Action / Action Input).",
      "Memoria de trabajo = historial del loop.",
      "Criterio de terminación explícito (finish).",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "El loop con presupuesto",
    viz: "react-loop",
    caption: "Thought → Action → Observation; Finish sale del ciclo con tope de pasos/tiempo/costo.",
  },

  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico de agentes",
    items: [
      "Agente — loop razón→acción→observación con tools y criterio de terminación.",
      "ReAct — patrón Thought / Action / Observation anclado al entorno (Yao et al., 2023).",
      "Tool — API tipada para el modelo; la Observation la inyecta el runtime, no el LM.",
      "Presupuesto del loop — topes duros de pasos, tiempo, tokens/costo y HITL en irreversibles.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Tools",
  },
  {
    type: "bullets",
    kicker: "Diseño",
    title: "La tool es una API para el modelo",
    items: [
      "Granularidad: ni demasiado ancha ni demasiado frágil.",
      "Schemas claros; resultados vacíos y errores tipados.",
      "MCP / OpenAPI: el borde portable de tools (mismo contrato, otro runtime).",
      "Nunca inventar Observation: el runtime la inyecta; sandbox sin secretos.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Control",
  },
  {
    type: "bullets",
    kicker: "Hard caps",
    title: "Terminación y seguridad",
    items: [
      "Máximo de pasos (p.ej. 8).",
      "Timeout de pared (p.ej. 60 s).",
      "Presupuesto de tokens / costo.",
      "Confirmación humana para efectos irreversibles.",
    ],
  },

  {
    type: "viz",
    kicker: "Control",
    title: "Cuánto automatizar",
    viz: "automation-levels",
    caption: "Acciones irreversibles: confirmación fuera del prompt (HITL).",
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Cuatro topes del loop",
    viz: "agent-budget",
    caption: "Sin pasos / tiempo / costo / HITL, el agente no es un sistema operable.",
  },
  {
    type: "prose",
    kicker: "Lab vivo",
    title: "Agente ReAct mínimo",
    paragraphs: [
      "Contra LM Studio gemma-4-e4b: lee readme.txt del sandbox, calcula 17+25 y cierra con finish.",
      "Traza observada: file_read → calculator → finish. FINAL OK en ≤4 pasos.",
      "Lab: labs/09/u04/run_agent.py",
      "Lab: labs/09/u04/run_from_scratch_vs_harness.py — decidir from-scratch vs framework (caso ClaveÚnica); make lab-09-u04-harness.",
    ],
  },
  {
    type: "image",
    kicker: "Stack local",
    title: "Servidor OpenAI-compatible",
    src: "labs/screenshots/lmstudio-server-status.png",
    alt: "Estado del servidor LM Studio en puerto 1234 con gemma-4-e4b cargado",
    caption: "lms ps · localhost:1234/v1 · modelo google/gemma-4-e4b",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller 2",
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "Agente mínimo operable",
    items: [
      "Caso Chile: consulta saldo/cupo (stub) — tool que puede fallar + HITL si “transferir”.",
      "≥ 3 tools; Observation de error tipada; topes en el runtime (no solo en el prompt).",
      "From-scratch mínimo (lab u04) antes de envolver en un framework.",
      "Trayectoria logueada → eval Unidad 6 / labs/RUBRIC.md.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Yao et al. (2023), ReAct — yao2023react",
      "Schick et al. (2023), Toolformer — schick2023toolformer (complementaria)",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: sistemas multiagentes (Unidad 5)",
  },
];
