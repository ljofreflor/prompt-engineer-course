import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 4. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 4",
    title: "Modelos abiertos y cerrados",
    subtitle: "4 hrs · Licencias · costo · soberanía — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Abierto no es un booleano",
    items: [
      "Pesos, código, datos y licencia son ejes distintos.",
      "El punto de cruce de costo depende del volumen y del idle.",
      "Soberanía y estabilidad de versión son requisitos de diseño.",
      "Abstracción de proveedor sin alternativa evaluada es teatro.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Distinguir grados de apertura y licencias relevantes.",
      "Calcular punto de cruce abierto vs cerrado.",
      "Proponer mitigación de dependencia de proveedor.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Apertura",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Foundation models como infraestructura",
    items: [
      "Bommasani et al. (2021): el modelo base es un recurso compartido con riesgos sistémicos.",
      "Apertura no es un booleano: pesos, código, datos y licencia son ejes distintos.",
      "Homogeneización: muchos productos dependen del mismo upstream.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Cuatro ejes, no un switch",
    viz: "openness-axes",
    caption: "Pesos descargables ≠ licencia permisiva; cada eje se decide por separado.",
  },
  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico abierto / cerrado",
    items: [
      "Apertura — ejes separados: pesos, código, datos, licencia (no un booleano).",
      "Soberanía — capacidad de operar y auditar sin depender de un único proveedor externo.",
      "Punto de cruce — volumen donde el costo total abierto (incl. idle) iguala al cerrado.",
      "Plan de salida — alternativa evaluada + contrato portable (p. ej. OpenAI-compatible).",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Dimensiones",
  },
  {
    type: "bullets",
    kicker: "Decisión",
    title: "Qué mueve la aguja",
    items: [
      "Costo unitario y de operación (idle incluido).",
      "Latencia y localidad de datos.",
      "Especialización, soberanía, pin de versión (Bommasani: dependencia de API).",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Cruce",
  },
  {
    type: "viz",
    kicker: "Ejercicio",
    title: "Punto de cruce por volumen",
    viz: "cost-crossover",
    caption: "Sin idle ni precio/token explícitos, el “más barato” es un eslogan.",
  },
  {
    type: "bullets",
    kicker: "Cálculo",
    title: "Qué incluir en la hoja",
    items: [
      "10k requests/día: local cuantizado vs API.",
      "Sensibilidad a precio/token y a GPU idle.",
      "Estimaciones y stack: página Herramientas (curso 08).",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Dependencia",
  },
  {
    type: "bullets",
    kicker: "Mitigación",
    title: "Salida creíble",
    items: [
      "Contrato OpenAI-compatible o propio.",
      "Alternativa abierta evaluada (no solo nombrada).",
      "Plan de cambio de proveedor en el design doc.",
    ],
  },

  {
    type: "viz",
    kicker: "Dependencia",
    title: "Salida = borde portable",
    viz: "portability-edge",
    caption: "Nombrar un vendor open sin evaluarlo no es mitigación.",
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "Hoja de cruce abierto vs cerrado",
    items: [
      "Caso Chile: datos sensibles / sector público — residencia + licencia comercial.",
      "Declarar supuestos; sin números inventados.",
      "Artefacto versionado → sección 08 del capstone (labs/capstone/).",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Bommasani et al. (2021), On the Opportunities and Risks of Foundation Models — bommasani2021foundation",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: inferencia — costo, latencia y contexto (Unidad 5)",
  },
];
