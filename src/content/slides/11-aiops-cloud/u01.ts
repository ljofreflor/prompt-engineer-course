import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 11 Unidad 1. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 11 · Unidad 1",
    title: "Del cuaderno a producción",
    subtitle: "4 hrs · AI.Ops y Sistemas Cloud — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Producción es un contrato de reproducibilidad",
    items: [
      "El notebook no es el artefacto desplegable.",
      "Código, datos, pesos y config deben versionarse juntos.",
      "Sin healthcheck y versión, no hay operación.",
      "Empezamos local (LM Studio) antes de la nube.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Explicar la brecha experimento → servicio.",
      "Definir artefactos versionados.",
      "Montar un entorno local reproducible con healthcheck.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Brecha",
  },
  {
    type: "bullets",
    kicker: "Pérdidas",
    title: "Qué se rompe al salir del notebook",
    items: [
      "Dependencias no fijadas.",
      "Datos implícitos en el path del autor.",
      "Seeds y orden no controlados.",
      "Config mezclada con secretos.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Del cuaderno al servicio",
    viz: "notebook-to-service",
    caption: "Cada flecha exige artefacto versionado; el notebook solo no es desplegable.",
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Artefactos",
  },
  {
    type: "bullets",
    kicker: "Linaje",
    title: "Qué versionar",
    items: [
      "Código + lockfile.",
      "Referencia a datos / features.",
      "Identificador de pesos o endpoint de modelo.",
      "Config declarativa (sin secretos en git).",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Local primero",
  },
  {
    type: "image",
    kicker: "Runtime local",
    title: "LM Studio como backend de inferencia",
    src: "labs/screenshots/lmstudio-server-status.png",
    alt: "Servidor LM Studio en puerto 1234",
    caption: "Mismo contrato OpenAI que usarán contenedores y CI más adelante",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "bullets",
    kicker: "Lab",
    title: "Wrapper /health",
    items: [
      "Endpoint que consulta /v1/models.",
      "Latencia de un chat mínimo.",
      "Versión del servicio en la respuesta.",
      "Sin exponer API keys reales.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: empaquetado y automatización del ciclo (Unidad 2)",
  },
];
