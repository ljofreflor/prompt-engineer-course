import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 11 Unidad 5. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 11 · Unidad 5",
    title: "Plataformas gestionadas",
    subtitle: "4 hrs · Make vs buy · portabilidad — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "La plataforma es un trade-off, no un destino",
    items: [
      "Gestionado acelera; también acopla y oculta costos.",
      "Decidir por NFR: latencia, costo, compliance, equipo.",
      "Portabilidad = contratos (API, artefactos), no fe en un vendor.",
      "Local (LM Studio) sigue siendo el laboratorio de verdad.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Comparar opciones managed vs self-host con criterios explícitos.",
      "Diseñar una capa de abstracción mínima sobre el proveedor.",
      "Estimar lock-in y plan de salida.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Mapa",
  },
  {
    type: "bullets",
    kicker: "Oferta",
    title: "Qué suele estar gestionado",
    items: [
      "Notebooks GPU, training jobs, feature stores.",
      "Endpoints de inferencia y colas.",
      "Observabilidad y secretos “de plataforma”.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Criterios",
  },
  {
    type: "viz",
    kicker: "Decisión",
    title: "Make vs buy bajo un contrato",
    viz: "make-buy",
    caption: "Local, híbrido o managed: el borde portable es lo que se puede migrar.",
  },
  {
    type: "bullets",
    kicker: "Criterios",
    title: "Qué pesar en la tabla",
    items: [
      "Costo total: idle, egress, soporte, personal.",
      "Datos y residencia; auditoría.",
      "Velocidad del equipo vs profundidad de control.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Contratos",
  },
  {
    type: "bullets",
    kicker: "Abstracción",
    title: "Fronteras portables",
    items: [
      "OpenAI-compatible / OpenAPI como borde.",
      "Imágenes y pesos versionados fuera del vendor UI.",
      "Config por ambiente; secretos fuera del repo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "bullets",
    kicker: "Ejercicio",
    title: "Elegir y justificar",
    items: [
      "Caso: servicio de chat interno con PII.",
      "Tabla: managed vs local+CI vs híbrido.",
      "Plan de salida de 90 días si el vendor falla.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: operación de sistemas generativos (Unidad 6)",
  },
];
