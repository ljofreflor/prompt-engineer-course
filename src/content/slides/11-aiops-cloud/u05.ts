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
    kicker: "Teoría",
    title: "Plataforma = trade-off",
    items: [
      "Kreuzberger et al. (2023): roles y componentes — decidir qué externalizar.",
      "Make vs buy se decide por NFR (latencia, costo, compliance, equipo), no por moda.",
      "Portabilidad = contratos (API, artefactos), no fe en un vendor.",
    ],
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
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico make vs buy",
    items: [
      "Plataforma gestionada — el proveedor opera infra; vos operás el contrato y el riesgo de acoplamiento.",
      "Lock-in — costo de salida (tiempo, dinero, datos) si el vendor falla o cambia precio.",
      "Borde portable — API/artefactos que podés migrar sin reescribir el producto.",
      "Plan de salida — pasos y plazo (p. ej. 90 días) para operar sin ese vendor.",
    ],
  },
  {
    type: "viz",
    kicker: "Portabilidad",
    title: "Contrato en el borde, moda adentro",
    viz: "portability-edge",
    caption: "Lo que no está en el borde no cuenta como plan de salida.",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "bullets",
    kicker: "Taller",
    title: "Elegir y justificar",
    items: [
      "Caso Chile: chat interno con PII / ClaveÚnica — residencia y auditoría mandatorias.",
      "Tabla: managed vs local+CI vs híbrido.",
      "Plan de salida de 90 días si el vendor falla.",
    ],
  },

  {
    type: "viz",
    kicker: "Costo",
    title: "Idle y egress en la tabla",
    viz: "cost-crossover",
    caption: "Managed vs self-host: el cruce incluye idle, no solo $/token.",
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Kreuzberger et al. (2023) — kreuzberger2023mlops",
      "Documentación de programas académicos cloud (verificar al dictado)",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: operación de sistemas generativos (Unidad 6)",
  },
];
