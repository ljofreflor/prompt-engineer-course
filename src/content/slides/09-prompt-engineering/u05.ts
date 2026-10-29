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
    type: "bullets",
    kicker: "Matemática cruda",
    title: "Fiabilidad compuesta ≈ producto",
    items: [
      "Tres pasos a 0.9 ⇒ ~0.73 si son independientes.",
      "Checkpoints: validar salidas intermedias.",
      "Reintentos acotados; no loops infinitos entre agentes.",
      "Degradación: fallback a regla o a humano.",
    ],
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
      "Diagrama de agentes y contratos de mensaje.",
      "Cálculo de fiabilidad esperada (supuestos explícitos).",
      "Dónde cortás el sistema si un agente falla.",
      "Comparar vs diseño de un solo agente.",
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
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: evaluación agéntica y límites del control (Unidad 6)",
  },
];
