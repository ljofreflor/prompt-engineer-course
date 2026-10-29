import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 7. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 7",
    title: "Multimodalidad y riesgos",
    subtitle: "4 hrs · Visión · imagen · riesgos · cierre — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "El riesgo del modelo ≠ el del sistema",
    items: [
      "Multimodal abre interfaces y superficies de falla nuevas.",
      "Memorización y extracción son riesgos del modelo; la política es del sistema.",
      "La instrucción sola no es control de seguridad.",
      "Este cierre articula hacia Prompt Engineering y Diseño de Sistemas.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Evaluar aplicabilidad multimodal y riesgo de memorización.",
      "Distinguir riesgos del modelo vs del sistema.",
      "Presentar un criterio de integración al resto de la malla.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Multimodal",
  },
  {
    type: "bullets",
    kicker: "Modelos",
    title: "Espacio común y documentos",
    items: [
      "Extracción desde PDF/imagen con límites medibles.",
      "Error de OCR vs error de razonamiento.",
      "Costo y latencia típicamente peores que texto.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Imagen",
  },
  {
    type: "bullets",
    kicker: "Generación",
    title: "Difusión, control, procedencia",
    items: [
      "Control (prompts, adapters) vs calidad.",
      "Procedencia de datos de entrenamiento.",
      "Uso responsable en contexto académico/profesional.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Riesgos",
  },
  {
    type: "viz",
    kicker: "Modelo",
    title: "Riesgo del modelo ≠ del sistema",
    viz: "risk-layers",
    caption: "El prompt no es el control; filtros, logging y revisión sí lo son.",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Extracción y superficie de ataque",
    items: [
      "Carlini et al. (2021): se pueden extraer ejemplos de entrenamiento de LMs.",
      "Greshake et al. (2023) / Perez & Ribeiro (2022): inyección e “ignore previous” — el prompt no es perímetro.",
      "Bommasani et al. (2021): riesgos sistémicos del modelo base ≠ controles del producto.",
    ],
  },
  {
    type: "bullets",
    kicker: "Detalle",
    title: "Extracción y límites del prompt",
    items: [
      "Extracción de datos de entrenamiento.",
      "Jailbreaks como síntoma de frontera, no de “magia”.",
      "Controles de sistema: filtros, logging, human review.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Cierre",
  },
  {
    type: "bullets",
    kicker: "Malla",
    title: "Hacia 09 y 10",
    items: [
      "09: la instrucción como especificación y agentes.",
      "10: del modelo al sistema y design doc.",
      "11: operar lo que aquí solo se prototipa.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Carlini et al. (2021), Extracting Training Data — carlini2021extracting",
      "Bommasani et al. (2021), Foundation Models — bommasani2021foundation",
      "Greshake et al. (2023) — greshake2023injection; Perez & Ribeiro (2022) — perez2022ignore",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Fin curso 08 · siguiente arco: Prompt Engineering (09)",
  },
];
