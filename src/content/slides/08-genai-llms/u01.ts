import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 1. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 1",
    title: "Arquitectura del transformer",
    subtitle: "4 hrs · Generative AI y LLMs — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "El modelo es un artefacto con física",
    items: [
      "Generación autorregresiva explica muchos “errores”.",
      "La tokenización condiciona español, números y costo.",
      "Temperatura y top-p son controles de muestreo, no magia.",
      "Escalar no sustituye evaluación de dominio.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Explicar generación autorregresiva y atribuir comportamientos.",
      "Determinar efectos de la tokenización en español y en costo.",
      "Configurar decodificación (temperatura, top-p) según la tarea.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Del LM al transformer",
  },
  {
    type: "bullets",
    kicker: "Arquitectura",
    title: "Piezas que importan en clase",
    items: [
      "Modelado autorregresivo: P(x_t | x_<t) (Brown et al., 2020).",
      "Atención y costo O(n²) con la longitud (Vaswani et al., 2017).",
      "Decoder-only vs encoder: implicancias de uso.",
      "KV-cache: por qué el prefijo se reutiliza en decode.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Generación token a token",
    viz: "autoregressive",
    caption: "Cada token condiciona al siguiente; un error temprano se propaga.",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Qué fijó el transformer",
    items: [
      "Vaswani et al. (2017): atención como mecanismo central, sin recurrencia.",
      "El paralelismo en entrenamiento no elimina el costo cuadrático en contexto.",
      "En clase usamos decoder-only: generación condicionada al prefijo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Tokenización y contexto",
  },
  {
    type: "bullets",
    kicker: "Evidencia",
    title: "Lost in the middle",
    items: [
      "Liu et al. (2024): el desempeño cae cuando la evidencia está en el medio del contexto.",
      "Implicancia: más tokens ≠ mejor retrieval si el orden es malo.",
      "Diseño: poner lo crítico al inicio/fin o recuperar menos y mejor.",
    ],
  },
  {
    type: "bullets",
    kicker: "Práctica",
    title: "Lo que se mide en el lab",
    items: [
      "Mismo párrafo en español vs inglés: conteo de tokens.",
      "Números y nombres propios: fragmentación.",
      "Ventana de contexto y degradación por posición.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Decodificación",
  },
  {
    type: "bullets",
    kicker: "Control",
    title: "Temperatura, nucleus, formato",
    items: [
      "Temperatura baja: más estable, menos diversidad.",
      "Top-p: recorta la cola de la distribución.",
      "Salida estructurada: schema + validación.",
      "Determinismo completo no está garantizado entre runtimes.",
    ],
  },
  {
    type: "image",
    kicker: "Lab local",
    title: "Inferencia en LM Studio",
    src: "labs/screenshots/lmstudio-server-status.png",
    alt: "Servidor LM Studio con modelo gemma-4-e4b cargado",
    caption: "Misma API OpenAI-compatible que usarán los labs del curso 09",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Escalamiento",
  },
  {
    type: "bullets",
    kicker: "Leyes",
    title: "Cómputo, datos y parámetros",
    items: [
      "Kaplan / Chinchilla: asignación de cómputo entre tamaño y tokens.",
      "Más parámetros ≠ mejor para tu tarea sin evaluación de dominio.",
      "Cuantización local: trade-off calidad/latencia/VRAM.",
      "Taller: registrar temperature/top_p × diversidad en 10 corridas.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Vaswani et al. (2017), Attention Is All You Need — vaswani2017attention",
      "Liu et al. (2024), Lost in the Middle — liu2024lostmiddle",
      "Brown et al. (2020) §§1–3 — brown2020fewshot (marco autorregresivo)",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: pipeline de post-entrenamiento (Unidad 2)",
  },
];
