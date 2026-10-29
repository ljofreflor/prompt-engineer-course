import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 11 Unidad 2. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 11 · Unidad 2",
    title: "Empaquetado y automatización del ciclo",
    subtitle: "4 hrs · Contenedores y CI — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Si no está automatizado, no está listo",
    items: [
      "La imagen (o el entorno fijado) es el artefacto de despliegue.",
      "CI valida contrato: tests + health + versión.",
      "Secretos fuera del repo; config por ambiente.",
      "El modelo local (LM Studio) puede ser el backend de CI smoke.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Empaquetar un servicio de inferencia reproducible.",
      "Definir pipeline CI mínimo (build, test, smoke).",
      "Separar secretos de configuración.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Contenedores",
  },
  {
    type: "bullets",
    kicker: "Imagen",
    title: "Qué entra en el artefacto",
    items: [
      "Runtime + deps fijadas.",
      "Código y config no secreta.",
      "Usuario no-root; healthcheck en la imagen.",
      "Etiquetas: git sha + versión semántica.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — CI",
  },
  {
    type: "bullets",
    kicker: "Gates",
    title: "Qué debe fallar el pipeline",
    items: [
      "Lint / unit tests del wrapper.",
      "Smoke contra /health (modelo alcanzable).",
      "Regresión de contrato OpenAI-compatible.",
      "No subir secretos ni pesos gigantes al git.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Config",
  },
  {
    type: "bullets",
    kicker: "Ambientes",
    title: "Dev · staging · prod",
    items: [
      "OPENAI_BASE_URL por ambiente.",
      "API keys solo en el secret store.",
      "Feature flags / modelos distintos sin rebuild si es posible.",
      "Documentar rollback de imagen.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "prose",
    kicker: "Lab",
    title: "Smoke del health wrapper",
    paragraphs: [
      "Reusar labs/11/u01/health_wrapper.py en un job CI o script local.",
      "Gate: status=ok y latencia de chat bajo umbral acordado.",
    ],
  },
  {
    type: "image",
    kicker: "Backend local",
    title: "LM Studio en el ciclo",
    src: "labs/screenshots/lmstudio-server-status.png",
    alt: "Servidor LM Studio",
    caption: "Smoke sin proveedor cloud · localhost:1234",
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: servicio de inferencia y despliegue (Unidad 3)",
  },
];
