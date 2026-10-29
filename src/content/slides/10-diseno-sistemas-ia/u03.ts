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
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "bullets",
    kicker: "Producto",
    title: "Sección de datos del design doc",
    items: [
      "Contratos del caso propio.",
      "Puntos de desalineación potencial.",
      "Versionar en Git; diagramar con Mermaid/draw.io.",
      "Stack local del curso: página Herramientas, sección curso 10.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: interacción humano-IA (Unidad 4)",
  },
];
