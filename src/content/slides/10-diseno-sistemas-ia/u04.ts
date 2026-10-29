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
      "Stack: Excalidraw / Mermaid para flujos de interacción.",
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
    kicker: "Continuo",
    title: "De información pasiva a pleno automático",
    items: [
      "Costo del error, reversibilidad, volumen, supervisión real.",
      "Crítica del “humano en el loop” nominal.",
      "Umbrales y zonas de derivación.",
    ],
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
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Confianza",
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
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: evaluación, monitoreo y riesgo (Unidad 5)",
  },
];
