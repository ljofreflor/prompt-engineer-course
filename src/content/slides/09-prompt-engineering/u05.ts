import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 09 Unidad 5. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 09 · Unidad 5",
    title: "Sistemas multiagentes",
    subtitle: "4 hrs · Topologías y fiabilidad compuesta — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Más agentes ≠ más calidad",
    items: [
      "Primero preguntar si un agente bien diseñado alcanza.",
      "Cada hop multiplica latencia, costo y chance de falla.",
      "La topología define el modo de falla.",
      "Checkpoints y degradación son diseño, no afterthought.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Justificar multiagente vs agente único.",
      "Elegir topología y estimar fiabilidad compuesta.",
      "Ubicar checkpoints y degradación.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Cuándo",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Agentes que importan (y cuándo no)",
    items: [
      "Kapoor et al. (2024): evaluar agentes por costo, no solo success rate.",
      "Más agentes ≠ más calidad: cada hop multiplica latencia y modos de falla.",
      "Wu et al. (2023), AutoGen: multiagente como framework — la topología es diseño.",
    ],
  },
  {
    type: "bullets",
    kicker: "Criterio",
    title: "Disparar multiagente solo si…",
    items: [
      "Roles verdaderamente distintos (especialización).",
      "Necesitás revisión cruzada con evidencia de ganancia.",
      "El cuello de botella no es el prompt único sino el flujo.",
      "Podés pagar el producto de las fiabilidades.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Supervisor y especialistas",
    viz: "multiagent",
    caption: "Más hops = más costo y más modos de falla; justificar cada agente.",
  },

  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico multiagente",
    items: [
      "Sistema multiagente — varios roles con mensajes/contratos; la topología define el modo de falla.",
      "Supervisor — orquestador central que rutea; SPOF si no hay degradación.",
      "Fiabilidad compuesta — con hops independientes ≈ producto de fiabilidades por hop.",
      "Checkpoint — validación de salida intermedia antes de seguir el grafo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Topologías",
  },
  {
    type: "bullets",
    kicker: "Patrones",
    title: "Supervisor · cadena · pares · crítica",
    items: [
      "Supervisor: ruteo central; SPOF en el orquestador.",
      "Cadena: simple; error se propaga aguas abajo.",
      "Pares / debate: costo alto; útil en desacuerdo medible.",
      "Revisión cruzada: segundo agente como filtro, no oráculo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Fiabilidad",
  },
  {
    type: "viz",
    kicker: "Matemática cruda",
    title: "Fiabilidad compuesta ≈ producto",
    viz: "reliability-product",
    caption: "Independientes: el sistema solo es tan fiable como el producto de los hops.",
  },
  {
    type: "bullets",
    kicker: "Diseño",
    title: "Mitigar el producto",
    items: [
      "Checkpoints: validar salidas intermedias.",
      "Reintentos acotados; no loops infinitos entre agentes.",
      "Degradación: fallback a regla o a humano.",
    ],
  },

  {
    type: "viz",
    kicker: "Degradación",
    title: "Cortar antes de inventar",
    viz: "abstain-escalate",
    caption: "Si un agente falla: abstener, reintentar acotado o escalar a humano.",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "Topología del proyecto final",
    items: [
      "Caso Chile: mesa de ayuda (triage → especialista → cierre) — ¿multiagente o uno solo?",
      "Diagrama + contratos; fiabilidad esperada con supuestos explícitos.",
      "Dónde cortás si falla un hop (checkpoint / HITL).",
      "Comparar costo vs agente único (Kapoor: medir costo, no solo success).",
    ],
  },
  {
    type: "image",
    kicker: "Labs previos",
    title: "Base: un agente operable primero",
    src: "labs/screenshots/lab-u01-lmstudio-result.png",
    alt: "Lab local 4/4",
    caption: "Multiagente se apoya en prompts/tools ya medidos (u01–u04)",
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Kapoor et al. (2024), AI Agents That Matter — kapoor2024agents",
      "Wu et al. (2023), AutoGen — wu2023autogen (complementaria)",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: evaluación agéntica y límites del control (Unidad 6)",
  },
];
