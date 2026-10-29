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
      "Sandbox: paths, calculadora, stubs — sin secretos.",
      "Nunca inventar Observation: el runtime la inyecta.",
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
    type: "prose",
    kicker: "Lab vivo",
    title: "Agente ReAct mínimo",
    paragraphs: [
      "Contra LM Studio gemma-4-e4b: lee readme.txt del sandbox, calcula 17+25 y cierra con finish.",
      "Traza observada: file_read → calculator → finish. FINAL OK en ≤4 pasos.",
      "Lab: labs/09/u04/run_agent.py",
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
      "≥ 3 tools (incl. una que pueda fallar).",
      "Manejo de Observation de error.",
      "Topes de pasos y tiempo en el runtime.",
      "Registro de trayectoria para evaluación (Unidad 6).",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: sistemas multiagentes (Unidad 5)",
  },
];
