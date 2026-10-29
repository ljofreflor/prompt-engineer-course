/** Changelog trimestral del material (site + labs). Actualizar cada tick de market #7. */

export type ChangelogItem = {
  date: string; // ISO date
  title: string;
  detail: string;
  tags?: string[];
};

export type ChangelogQuarter = {
  id: string;
  label: string;
  summary: string;
  items: ChangelogItem[];
};

export const changelogQuarters: ChangelogQuarter[] = [
  {
    id: "2026-q4",
    label: "2026 · Q4",
    summary:
      "Compliance L3 en 08–11, ilustraciones D3/GSAP en clase, rúbrica eval-first, casos Chile y scaffold de capstone transversal.",
    items: [
      {
        date: "2026-10-29",
        title: "Señal externa",
        detail:
          "Página /senal/ — defensa de capstone + cupos de invitado por curso (sin nombres inventados).",
        tags: ["programa", "capstone"],
      },
      {
        date: "2026-10-29",
        title: "Matriz de competencias",
        detail:
          "Página /competencias/ — literacidad → aplicado → certificado por artefacto (08–11).",
        tags: ["programa", "capstone"],
      },
      {
        date: "2026-10-29",
        title: "Viz juez LLM",
        detail: "Ilustración judge-bias (posición · longitud · familia) en 08/u06.",
        tags: ["08", "viz", "eval"],
      },
      {
        date: "2026-10-29",
        title: "Labs con Makefile",
        detail:
          "make smoke / make lab-09-u0N / make labs-09 — un comando por lab contra LM Studio.",
        tags: ["labs", "09"],
      },
      {
        date: "2026-10-29",
        title: "Capstone transversal",
        detail:
          "Scaffold labs/capstone/ (README + DESIGN.md) enlazado desde la clase 10/u06.",
        tags: ["capstone", "10"],
      },
      {
        date: "2026-10-29",
        title: "Casos Chile en labs 09",
        detail:
          "Golden set con boleta SII, ClaveÚnica y abstención PII; regresión 7/7 contra LM Studio.",
        tags: ["09", "LATAM", "eval"],
      },
      {
        date: "2026-10-29",
        title: "Eval-first",
        detail:
          "labs/09/RUBRIC.md (formato · calidad · seguridad · costo) y reportes JSON de regresión.",
        tags: ["09", "eval"],
      },
      {
        date: "2026-10-29",
        title: "Context engineering",
        detail:
          "Marco prompt ⊂ contexto de inferencia (viz context-stack) en 09/u01.",
        tags: ["09", "viz"],
      },
      {
        date: "2026-10-29",
        title: "Ilustraciones 08",
        detail:
          "Nuevos viz: sft-align, lora-adapters, openness-axes, quant-ladder (además de adapt-routes, latency, etc.).",
        tags: ["08", "viz"],
      },
    ],
  },
];
