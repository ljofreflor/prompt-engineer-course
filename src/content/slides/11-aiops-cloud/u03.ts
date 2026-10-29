import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 11 Unidad 3. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 11 · Unidad 3",
    title: "Inferencia y despliegue",
    subtitle: "4 hrs · Serving · canary · orquestación — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Implementar lo que el curso 10 especificó",
    items: [
      "El patrón de servicio se deriva de los NFR.",
      "Promoción/reversión deben ser automáticas.",
      "Cold start incumple presupuestos de latencia.",
      "Contingencia local: LM Studio + Docker + Actions.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Seleccionar patrón de servicio (batch/online/stream/edge).",
      "Configurar autoscaling y mitigar cold start.",
      "Implementar despliegue progresivo con criterios de rollback.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Patrones",
  },
  {
    type: "bullets",
    kicker: "Serving",
    title: "Dimensionamiento",
    items: [
      "Batch, online, streaming, edge.",
      "Instancia, autoscaling, batching vs latencia individual.",
      "Cold start y mitigaciones.",
      "Cuándo justifica acelerador especializado.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Despliegue",
  },
  {
    type: "bullets",
    kicker: "Estrategias",
    title: "Sombra · canaria · azul-verde",
    items: [
      "Criterios automáticos de promoción.",
      "Criterios automáticos de reversión.",
      "Registro de versiones y capacidad de retorno.",
      "No decidir rollback “a mano” bajo presión.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Orquestación",
  },
  {
    type: "bullets",
    kicker: "Pipelines",
    title: "Dependencias y fallos parciales",
    items: [
      "Canalizaciones multi-paso.",
      "Reintentos y compensación.",
      "Conceptos de orquestación de contenedores (diálogo con plataforma).",
      "No es un curso de admin de Kubernetes.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Lab",
  },
  {
    type: "bullets",
    kicker: "Stack 11",
    title: "Nube académica + contingencia",
    items: [
      "AWS / Azure / GCP (crédito fijo).",
      "Dockerizar el health wrapper (labs/11/u01).",
      "Smoke en GitHub Actions.",
      "Si cae el proveedor: LM Studio local — /herramientas/#curso-11",
    ],
  },
  {
    type: "image",
    kicker: "Contingencia",
    title: "Backend local medible",
    src: "labs/screenshots/lmstudio-server-status.png",
    alt: "LM Studio server status",
    caption: "Misma API OpenAI-compatible que el serving en nube",
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: observabilidad y deriva (Unidad 4)",
  },
];
