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
    kicker: "Teoría",
    title: "MLOps: del experimento al producto",
    items: [
      "Kreuzberger et al. (2023): MLOps = principios + componentes + roles para operar ML.",
      "Breck et al. (2017): readiness exige tests de datos/modelo/serving — no solo “corre en mi laptop”.",
      "Producción = contrato de reproducibilidad (código, datos, pesos, config).",
    ],
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
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico de salida a producción",
    items: [
      "Artefacto desplegable — paquete reproducible (código, datos, pesos, config), no el notebook.",
      "Contrato de reproducibilidad — mismos inputs producen el mismo servicio operable.",
      "Healthcheck — señal de que el servicio responde con versión y dependencia de modelo.",
      "Secretos fuera de git — credenciales solo en entorno; config declarativa sí se versiona.",
    ],
  },
  {
    type: "viz",
    kicker: "Contrato",
    title: "Los cuatro viajan juntos",
    viz: "repro-bundle",
    caption: "Falta uno y la “producción” no es reproducible.",
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
      "Endpoint que consulta /v1/models (LM Studio local).",
      "Latencia de un chat mínimo + versión en la respuesta.",
      "Caso Chile: wrapper de consulta a normativa interna (sin PII en logs).",
      "Sin exponer API keys reales; config en env.",
    ],
  },

  {
    type: "viz",
    kicker: "Siguiente",
    title: "Del health al pipeline",
    viz: "ci-pipeline",
    caption: "El /health del lab alimenta el smoke de CI (Unidad 2).",
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Kreuzberger et al. (2023) — kreuzberger2023mlops",
      "Breck et al. (2017) — breck2017mltest",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: empaquetado y automatización del ciclo (Unidad 2)",
  },
];
