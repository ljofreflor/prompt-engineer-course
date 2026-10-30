import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 08 Unidad 3. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 08 · Unidad 3",
    title: "Vías de adaptación",
    subtitle: "4 hrs · Prompting · RAG · fine-tuning — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Elegí la vía por lo que falta, no por moda",
    items: [
      "Instrucción vs recuperación vs ajuste: errores distintos.",
      "Fine-tune no arregla hechos que cambian cada semana.",
      "LoRA/QLoRA: eficiencia, no magia.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Elegir prompting, RAG o fine-tuning con criterios explícitos.",
      "Preparar datos LoRA y detectar olvido catastrófico.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Qué modifica cada vía",
  },
  {
    type: "viz",
    kicker: "Mapa",
    title: "Instrucción · recuperación · ajuste",
    viz: "adapt-routes",
    caption: "Elegí la vía por el hueco: formato, hechos externos o dominio estable.",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "RAG cuando el conocimiento es externo",
    items: [
      "Lewis et al. (2020): recuperar + generar para tareas knowledge-intensive.",
      "La evidencia entra en el contexto; el índice se puede actualizar sin reentrenar.",
      "Falla típica: fine-tune para hechos que cambian — el peso no es un índice.",
    ],
  },

  {
    type: "viz",
    kicker: "RAG",
    title: "Hechos fuera del peso",
    viz: "rag-pipeline",
    caption: "Actualizás el índice; no el checkpoint — vía típica cuando los hechos cambian.",
  },
  {
    type: "bullets",
    kicker: "Regla",
    title: "Qué falla si elegís mal",
    items: [
      "Comportamiento / formato → prompting o SFT liviano.",
      "Conocimiento externo / trazabilidad → RAG.",
      "Estilo o dominio estable con datos → fine-tune.",
    ],
  },

  {
    type: "bullets",
    kicker: "Definiciones",
    title: "Léxico de vías de adaptación",
    items: [
      "Prompting — adaptar el comportamiento vía instrucción en contexto, sin cambiar pesos.",
      "RAG — recuperar evidencia externa y condicionar la generación; el índice se actualiza sin reentrenar.",
      "Fine-tuning (LoRA/QLoRA) — adaptar pesos (o adaptadores de bajo rango) a un dominio/estilo estable.",
      "Olvido catastrófico — degradación en tareas de control tras el ajuste; se mide, no se asume.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Árbol de decisión",
  },
  {
    type: "bullets",
    kicker: "Criterios",
    title: "Preguntas que cierran la vía",
    items: [
      "¿Qué falta: conocimiento, comportamiento o formato?",
      "¿Datos, frescura, trazabilidad, presupuesto, control?",
      "Combinaciones son el caso habitual en producción.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — LoRA/QLoRA",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Adaptación de bajo rango",
    items: [
      "Hu et al. (2022) LoRA: matrices de bajo rango sobre pesos congelados.",
      "Dettmers et al. (2023) QLoRA: fine-tune sobre pesos cuantizados (VRAM ↓).",
      "Eficiencia ≠ garantía de calidad: medir olvido en tareas de control.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Pesos congelados + adaptadores",
    viz: "lora-adapters",
    caption: "W queda fijo; entrenás B·A de rango r ≪ d (Hu et al. 2022).",
  },
  {
    type: "bullets",
    kicker: "Práctica",
    title: "Ajuste eficiente",
    items: [
      "Volumen mínimo y calidad de datos.",
      "Evaluación post-ajuste vs baseline por instrucción.",
      "Olvido catastrófico: medir tareas de control.",
      "Colab/Kaggle + HF (página Herramientas, curso 08).",
    ],
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Eval 1",
  },
  {
    type: "bullets",
    kicker: "Taller",
    title: "Ajuste vs instrucción",
    items: [
      "Caso Chile: normativa SII que cambia — ¿RAG, FT o prompt? Justificar.",
      "Mismo golden set de dominio; reportar formato · calidad · costo (labs/RUBRIC.md).",
      "Contingencia: LM Studio / CPU si cae la GPU gestionada.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Lewis et al. (2020), RAG — lewis2020rag",
      "Hu et al. (2022), LoRA — hu2022lora",
      "Dettmers et al. (2023), QLoRA — dettmers2023qlora",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: modelos abiertos y cerrados (Unidad 4)",
  },
];
