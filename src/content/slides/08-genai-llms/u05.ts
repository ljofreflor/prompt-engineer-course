import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 5. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 5",
    title: "Inferencia: costo y latencia",
    subtitle: "4 hrs · TTFT · TPOT · cuantización — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "La UX la define la cola de decode",
    items: [
      "TTFT y TPOT no son intercambiables según la interfaz.",
      "El costo unitario se diseña; no se “descubre” en prod.",
      "Cuantización es un trade-off de calidad medible.",
      "Contexto largo ≠ siempre mejor que RAG.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Descomponer latencia (TTFT vs TPOT) y estimar costo unitario.",
      "Medir efecto de cuantización sobre calidad.",
      "Comparar contexto extenso vs recuperación.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Latencia",
  },
  {
    type: "viz",
    kicker: "Anatomía",
    title: "TTFT y TPOT no son lo mismo",
    viz: "latency-ttft-tpot",
    caption: "Chat siente TTFT; batch y streaming largos viven en TPOT.",
  },

  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico de inferencia",
    items: [
      "TTFT — time to first token: latencia hasta el primer token (chat la siente primero).",
      "TPOT — time per output token: ritmo de decode tras el primero.",
      "Cuantización — bajar precisión de pesos/activaciones para memoria/throughput; calidad se mide.",
      "Kill-switch de presupuesto — corte automático cuando tokens/costo exceden el umbral.",
    ],
  },
  {
    type: "bullets",
    kicker: "Producto",
    title: "Prefill vs decode",
    items: [
      "Qué siente el usuario en chat vs batch.",
      "p95/p99 como presupuesto de producto.",
      "Medición local con LM Studio / OpenAI-compatible.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Costo",
  },
  {
    type: "bullets",
    kicker: "Unidad",
    title: "Tokens in/out y proyección",
    items: [
      "Caché de prefijo y reintentos.",
      "Proyección mensual con tráfico realista.",
      "Kill-switch de presupuesto.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Optimización",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Cuantización como trade-off",
    items: [
      "Dettmers et al. (2023) QLoRA: cuantizar pesos libera VRAM para adaptar.",
      "En inferencia: menor precisión ↔ más throughput / menos memoria.",
      "La calidad se mide en el set propio, no en el claim del blog.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Precisión ↔ memoria",
    viz: "quant-ladder",
    caption: "Bajar bits libera VRAM; la calidad se valida en el set propio.",
  },
  {
    type: "bullets",
    kicker: "Palancas",
    title: "Cuantización, batching, tamaño",
    items: [
      "Calidad post-cuantización en set propio.",
      "Batching vs latencia interactiva.",
      "Modelo chico + herramientas vs modelo grande solo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Contexto",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Contexto largo no sustituye retrieval",
    items: [
      "Liu et al. (2024): desempeño cae cuando la evidencia está “en el medio”.",
      "Lewis et al. (2020): RAG separa índice actualizable de generación.",
      "Costo: tokens de contexto vs retrieve + prompt corto — medir en la misma tarea.",
    ],
  },

  {
    type: "viz",
    kicker: "Contexto",
    title: "Largo ≠ mejor ubicado",
    viz: "lost-middle",
    caption: "Misma evidencia: el medio del contexto es el punto ciego típico.",
  },
  {
    type: "bullets",
    kicker: "Eval 2",
    title: "Contexto largo vs RAG",
    items: [
      "Caso Chile: FAQ normativa larga vs RAG sobre BOLETÍN/SII — misma pregunta.",
      "Medir TTFT/TPOT + tokens (labs/RUBRIC.md · costo).",
      "Declarar supuestos de tráfico; sin inventar precios.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Liu et al. (2024), Lost in the Middle — liu2024lostmiddle",
      "Lewis et al. (2020), RAG — lewis2020rag",
      "Dettmers et al. (2023), QLoRA — dettmers2023qlora",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: evaluación de modelos generativos (Unidad 6)",
  },
];
