import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 10 Unidad 6. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 10 · Unidad 6",
    title: "Documento de diseño y defensa",
    subtitle: "4 hrs · Design doc · revisión · decisión — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "El design doc es el contrato del sistema",
    items: [
      "Escribe para un tercero que debe poder construir y auditar.",
      "Cada claim de valor lleva métrica, línea base y umbral.",
      "La defensa oral no inventa: solo aclara trade-offs ya escritos.",
      "Si no cabe en el doc, no está diseñado.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Redactar un design doc completo y revisable.",
      "Exponer riesgos, mitigaciones y plan de evaluación.",
      "Defender decisiones de arquitectura ante revisión crítica.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Estructura",
  },
  {
    type: "bullets",
    kicker: "Plantilla",
    title: "Secciones no negociables",
    items: [
      "Contexto y decisión organizacional.",
      "Requisitos (funcionales + NFR medibles).",
      "Arquitectura y fronteras de confianza.",
      "Datos, evaluación, operación y riesgos.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Evidencia",
  },
  {
    type: "viz",
    kicker: "Claims",
    title: "Afirmar con prueba",
    viz: "claim-evidence",
    caption: "Sin métrica / umbral, el claim es riesgo — no diseño.",
  },
  {
    type: "bullets",
    kicker: "Evidencia",
    title: "Qué contar en el doc",
    items: [
      "Línea base vs propuesta: delta esperado.",
      "Experimentos / canarias / sets de dominio.",
      "Lo que no se midió queda como riesgo explícito.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Revisión",
  },
  {
    type: "bullets",
    kicker: "Peer review",
    title: "Leer como adversario",
    items: [
      "Buscar ambigüedad, métricas Goodhart y rollback ausente.",
      "Marcar supuestos no validados.",
      "Checklist de superficie de riesgo (Unidad 5).",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Defensa",
  },
  {
    type: "bullets",
    kicker: "Oral",
    title: "Defensa en 10 minutos",
    items: [
      "Problema → diseño → evidencia → riesgos → pregunta abierta.",
      "No demos: decisiones y trade-offs.",
      "Criterio de “listo para construir”.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Cierre del curso 10 · puente a AI.Ops (curso 11)",
  },
];
