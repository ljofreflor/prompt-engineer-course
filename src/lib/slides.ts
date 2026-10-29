import type { Program, ProgramUnit } from "../data/programs";
import type { Course } from "../data/courses";

/** Claves registradas en public/scripts/reveal-viz.js */
export type VizId =
  | "react-loop"
  | "autoregressive"
  | "eval-levels"
  | "notebook-to-service"
  | "multiagent"
  | "claim-evidence"
  | "make-buy"
  | "guardrails"
  | "reliability-product"
  | "decision-chain"
  | "rag-pipeline"
  | "train-serve-skew"
  | "ci-pipeline"
  | "canary-deploy"
  | "obs-layers"
  | "posttrain-pipeline"
  | "adapt-routes"
  | "cost-crossover"
  | "latency-ttft-tpot"
  | "eval-domain"
  | "risk-layers"
  | "prompt-anatomy"
  | "prompt-sensitivity"
  | "cot-verify";

export type Slide =
  | { type: "title"; kicker: string; title: string; subtitle?: string }
  | { type: "bullets"; kicker?: string; title: string; items: string[] }
  | { type: "prose"; kicker?: string; title: string; paragraphs: string[] }
  | { type: "section"; title: string; subtitle?: string }
  | {
      type: "image";
      kicker?: string;
      title: string;
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "viz";
      kicker?: string;
      title: string;
      viz: VizId;
      caption?: string;
    };

/** Deck por defecto a partir del programa de la unidad (4 bloques × 60 min). */
export function slidesFromUnit(course: Course, program: Program, unit: ProgramUnit): Slide[] {
  const slides: Slide[] = [
    {
      type: "title",
      kicker: `Curso ${course.code} · Unidad ${unit.number}`,
      title: unit.title,
      subtitle: `${unit.hours} hrs · Magíster en Inteligencia Artificial — UAI`,
    },
    {
      type: "prose",
      kicker: "Contexto",
      title: "Qué trabajamos hoy",
      paragraphs: unit.narrative.length ? unit.narrative : [program.introduccion[0] || course.short],
    },
  ];

  if (unit.outcomes.length) {
    slides.push({
      type: "bullets",
      kicker: "Al finalizar",
      title: "Resultados de aprendizaje",
      items: unit.outcomes,
    });
  }

  unit.session.forEach((block, i) => {
    const match = block.match(/^Bloque\s+(\d+)\s*\((\d+)\s*min\)\s*—\s*(.+)$/i);
    const title = match ? match[3] : `Bloque ${i + 1}`;
    const mins = match ? match[2] : "60";
    const rest = match ? block.slice(block.indexOf("—") + 1).trim() : block;
    // Detail after em-dash often includes the title again; use full block text as bullets split by ". "
    const detail = rest.replace(/^[^.]+\.\s*/, ""); // drop first sentence if it's the title repeat
    const items = detail
      .split(/(?<=\.)\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 12)
      .slice(0, 6);
    slides.push({
      type: "section",
      title: `Bloque ${match?.[1] || i + 1}`,
      subtitle: `${mins} min`,
    });
    slides.push({
      type: "bullets",
      kicker: `${mins} min`,
      title,
      items: items.length ? items : [block],
    });
  });

  if (unit.readings.length) {
    slides.push({
      type: "bullets",
      kicker: "Antes / después",
      title: "Lecturas de la unidad",
      items: unit.readings,
    });
  }

  slides.push({
    type: "title",
    kicker: "Cierre",
    title: "Preguntas y próximo paso",
    subtitle: "Laboratorio local · LM Studio / Ollama · sin datos sensibles",
  });

  return slides;
}
