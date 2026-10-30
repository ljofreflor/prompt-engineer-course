import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 11 Unidad 4. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 11 · Unidad 4",
    title: "Observabilidad y deriva",
    subtitle: "4 hrs · Falla silenciosa · SLOs — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Un sistema de IA puede fallar sin errores",
    items: [
      "Observabilidad de servicio ≠ observabilidad del modelo.",
      "Deriva: covariables, objetivo, concepto.",
      "Etiqueta tardía → indicadores sustitutos.",
      "SLOs, presupuestos de error y runbooks.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Instrumentar ambas capas de observabilidad.",
      "Aplicar pruebas de deriva con control de falsas alarmas.",
      "Definir SLOs, alertas accionables y respuesta.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Dos capas",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Falla silenciosa y dos capas",
    items: [
      "Beyer et al. (2016), SRE caps. 4 y 6: SLOs y error budgets — alertas accionables.",
      "Observabilidad de servicio ≠ del modelo: uptime verde con preds sesgadas = falla silenciosa.",
      "Gama et al. (2014): concept drift — cambia P(y|x); hay que detectar y adaptar.",
    ],
  },
  {
    type: "viz",
    kicker: "Instrumentación",
    title: "Dos capas que no se sustituyen",
    viz: "obs-layers",
    caption: "Uptime verde con predicciones sesgadas = falla silenciosa.",
  },
  {
    type: "bullets",
    kicker: "Detalle",
    title: "Qué medir en cada capa",
    items: [
      "Disponibilidad, latencia p95/p99, errores, saturación, costo.",
      "Distribución de inputs/preds, desempeño con etiqueta, por subgrupo.",
      "Muestreo y retención de predicciones.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Deriva",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Concept drift",
    items: [
      "Gama et al. (2014): tipología y estrategias de adaptación ante deriva.",
      "Covariables / objetivo / concepto — no confundir con estacionalidad.",
      "Etiqueta tardía → indicadores sustitutos y muestreo para etiquetado.",
    ],
  },
  {
    type: "bullets",
    kicker: "Detección",
    title: "Tipología y pruebas",
    items: [
      "Covariables / objetivo / concepto.",
      "Ventana, frecuencia, comparaciones múltiples.",
      "Deriva ≠ estacionalidad.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Etiqueta tardía",
  },
  {
    type: "bullets",
    kicker: "Proxies",
    title: "Cuando la verdad llega tarde o nunca",
    items: [
      "Indicadores sustitutos.",
      "Muestreo para etiquetado manual.",
      "Monitoreo desagregado y equidad.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Eval 2",
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "SLOs y runbooks",
    items: [
      "Presupuestos de error.",
      "Alertas sin fatiga.",
      "Manual de operación e incidentes.",
      "Dashboards nativos de AWS/Azure/GCP (página Herramientas, curso 11).",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Gama et al. (2014) — gama2014conceptdrift",
      "Beyer et al. (2016), SRE caps. 4 y 6 — beyer2016sre (OA en sre.google)",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: plataformas gestionadas (Unidad 5)",
  },
];
