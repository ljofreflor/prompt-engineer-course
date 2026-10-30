import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 3. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 3",
    title: "Datos como infraestructura",
    subtitle: "4 hrs · Contratos, train/serve skew, bucles — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "El dato en producción no es el dataset del notebook",
    items: [
      "Sin contrato de datos heredás la volatilidad aguas arriba.",
      "Train/serve skew es falla silenciosa clásica.",
      "Etiquetas tardías y bucles de feedback son diseño.",
      "Stack: Git + Mermaid/draw.io — sin cloud de pago.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Redactar un contrato de datos (esquema, semántica, SLAs).",
      "Prevenir desalineación entrenamiento–servicio.",
      "Diseñar captura de etiquetas y reserva no intervenida.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Contratos",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Datos como primer ciudadano",
    items: [
      "Sambasivan et al. (2021): “data cascades” — fallas de datos se componen y llegan tarde.",
      "Huyen (2022), caps. 3–4: contratos, linaje y train/serve skew como diseño.",
      "Breck et al. (2017): el ML Test Score exige tests de datos, no solo de código.",
    ],
  },
  {
    type: "bullets",
    kicker: "Especificación",
    title: "Qué acordar productor ↔ consumidor",
    items: [
      "Esquema, semántica, frecuencia, completitud.",
      "Compromisos de estabilidad y versionado.",
      "Validación en el punto de entrada.",
      "Linaje y trazabilidad.",
    ],
  },

  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico de datos en producción",
    items: [
      "Contrato de datos — acuerdo productor↔consumidor sobre esquema, semántica, frecuencia y SLAs.",
      "Train/serve skew — la feature en entrenamiento no es la misma (código o dato) que en servicio.",
      "Data cascade — falla temprana de datos que se compone aguas abajo y se detecta tarde (Sambasivan et al., 2021).",
      "Reserva no intervenida — decisiones dejadas fuera del bucle para medir efecto real.",
    ],
  },
  {
    type: "viz",
    kicker: "Concepto",
    title: "La cascada llega tarde",
    viz: "data-cascades",
    caption: "Sin contrato en la fuente, el producto hereda la volatilidad.",
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Train/serve",
  },
  {
    type: "viz",
    kicker: "Skew",
    title: "Misma feature, dos mundos",
    viz: "train-serve-skew",
    caption: "Código o datos distintos entre entrenamiento y servicio = falla silenciosa.",
  },
  {
    type: "bullets",
    kicker: "Formas",
    title: "Cómo aparece el desalineamiento",
    items: [
      "Dos bases de código para features.",
      "Features no disponibles en inferencia.",
      "Joins con fugas temporales.",
      "Arquitecturas que unifican el cálculo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Feedback",
  },
  {
    type: "bullets",
    kicker: "Temporalidad",
    title: "Etiquetas y bucles",
    items: [
      "Etiquetas tardías, parciales, proxy.",
      "El sistema cambia la distribución que observa.",
      "Reserva de decisiones no intervenidas.",
      "Medir el efecto del bucle es decisión de diseño.",
    ],
  },

  {
    type: "viz",
    kicker: "Feedback",
    title: "El bucle mueve la distribución",
    viz: "concept-drift",
    caption: "Etiqueta tardía + intervención: diseñá reserva no intervenida.",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "Sección de datos del design doc",
    items: [
      "Contratos del caso propio (p. ej. feeds de precios o tickets en retail Chile).",
      "Puntos de desalineación potencial train/serve.",
      "Versionar en Git; diagramar con Mermaid/draw.io.",
      "Declarar supuestos: sin inventar volúmenes ni SLAs.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Sambasivan et al. (2021) — sambasivan2021datacascades",
      "Breck et al. (2017) — breck2017mltest",
      "Huyen (2022), caps. 3–4 — huyen2022designing",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: interacción humano-IA (Unidad 4)",
  },
];
