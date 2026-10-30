import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 4. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 4",
    title: "Interacción humano-IA",
    subtitle: "4 hrs · Automatización, incertidumbre, reversión — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Persona + sistema puede ser peor que cualquiera solo",
    items: [
      "El nivel de automatización se deriva del costo del error.",
      "Confianza del modelo ≠ probabilidad calibrada.",
      "Abstención y caminos de salida son requisitos de diseño.",
      "Diagramar el flujo de decisión antes de elegir widgets.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Elegir nivel de automatización justificable.",
      "Diseñar presentación de incertidumbre y abstención.",
      "Especificar reversión, apelación y registro.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Automatización",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Niveles de automatización",
    items: [
      "Parasuraman et al. (2000): tipos (adquisición → acción) × niveles de automatización.",
      "Amershi et al. (2019): el workflow de ML en producto no es el notebook — datos y acoplamiento.",
      "El nivel se deriva del costo del error y de la reversibilidad, no del marketing “HITL”.",
    ],
  },
  {
    type: "bullets",
    kicker: "Continuo",
    title: "De información pasiva a pleno automático",
    items: [
      "Costo del error, reversibilidad, volumen, supervisión real.",
      "Crítica del “humano en el loop” nominal.",
      "Umbrales y zonas de derivación.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Elegir el nivel, no el eslogan",
    viz: "automation-levels",
    caption: "Informar → sugerir → consentir → actuar; el salto se justifica con el costo del error.",
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Incertidumbre",
  },
  {
    type: "bullets",
    kicker: "UI",
    title: "Cómo mostrar lo que no se sabe",
    items: [
      "Scores, intervalos, conjuntos de predicción.",
      "Abstención como salida legítima.",
      "Efectos documentados sobre la decisión humana.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Decidir, abstenerse o escalar",
    viz: "abstain-escalate",
    caption: "La incertidumbre no es un badge: es una rama de diseño con dueño.",
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Confianza",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Sobreconfianza y fricción cognitiva",
    items: [
      "Buçinca et al. (2021): explicaciones simples no bastan; forcing functions reducen overreliance.",
      "Trade-off: menos overreliance a menudo empeora ratings subjetivos.",
      "Diseñar abstención y fricción deliberada como requisitos, no como UX “nice to have”.",
    ],
  },
  {
    type: "bullets",
    kicker: "Riesgos",
    title: "Sobreconfianza y aversión",
    items: [
      "Modelos mentales del usuario.",
      "Explicaciones que calibran vs que inflan.",
      "Fricción deliberada como mecanismo.",
    ],
  },

  {
    type: "viz",
    kicker: "Guardrails",
    title: "HITL es arquitectura",
    viz: "guardrails",
    caption: "Confirmación y registro: controles fuera del modelo.",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Actividad 2",
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "Reversión y registro",
    items: [
      "Caminos de corrección y escalamiento.",
      "Registro técnico + de cumplimiento.",
      "Diagramar el flujo en el design doc.",
      "Stack local del curso: página Herramientas, sección curso 10.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Parasuraman et al. (2000) — parasuraman2000automation",
      "Buçinca et al. (2021) — bucinca2021trust",
      "Amershi et al. (2019) — amershi2019se4ml",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: evaluación, monitoreo y riesgo (Unidad 5)",
  },
];
