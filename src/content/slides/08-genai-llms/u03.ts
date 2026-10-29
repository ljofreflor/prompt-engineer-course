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
      "Stack: Colab/HF para ajuste; APIs/local para prompting.",
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
    type: "bullets",
    kicker: "Mapa",
    title: "Instrucción · recuperación · ajuste",
    items: [
      "Comportamiento / formato → prompting o SFT liviano.",
      "Conocimiento externo / trazabilidad → RAG.",
      "Estilo o dominio estable con datos → fine-tune.",
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
      "Mismo set de evaluación de dominio.",
      "Reportar costo, latencia y calidad.",
      "Contingencia CPU/local si cae la GPU gestionada.",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: modelos abiertos y cerrados (Unidad 4)",
  },
];
