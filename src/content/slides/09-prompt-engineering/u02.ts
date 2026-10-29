import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 09 Unidad 2. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 09 · Unidad 2",
    title: "El prompt como artefacto de ingeniería",
    subtitle: "4 hrs · Versionado, sensibilidad y regresión — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis",
    title: "Si no está en el repo, no es ingeniería",
    items: [
      "El prompt es un artefacto versionado junto al código.",
      "Cambios “semánticamente neutros” pueden mover el score.",
      "Sin suite de regresión, cada modelo nuevo es un salto al vacío.",
      "Medimos pass rate + varianza, no “se ve bien”.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Medir sensibilidad a variaciones de formato.",
      "Versionar prompts y correr pruebas de regresión.",
      "Detectar degradación por cambio de modelo o de prompt.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Sensibilidad al formato",
  },
  {
    type: "bullets",
    kicker: "Evidencia",
    title: "Sclar et al.: features espurias",
    items: [
      "Separadores, mayúsculas y orden pueden valer tanto como cambiar de modelo.",
      "No asumir que “mismo significado ⇒ misma salida”.",
      "Documentar el formato canónico en el repo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Suites de prueba",
  },
  {
    type: "bullets",
    kicker: "Diseño",
    title: "Qué meter en la batería",
    items: [
      "Casos felices + casos límite + fuera de alcance.",
      "Criterios automatizables (JSON schema, campos esperados).",
      "Repeticiones cuando la temperatura no es cero.",
      "Tamaño suficiente para detectar caídas relevantes.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Versionado y regresión",
  },
  {
    type: "prose",
    kicker: "Lab vivo",
    title: "prompts/v1.md + cases.yaml",
    paragraphs: [
      "Script: labs/09/u02/run_regression.py contra LM Studio (gemma-4-e4b).",
      "Resultado local: score 4/4 con prompt=v1. Cualquier cambio de prompt o modelo debe re-correr la suite.",
    ],
  },
  {
    type: "image",
    kicker: "Evidencia local",
    title: "Misma stack, lab estructurado",
    src: "labs/screenshots/lab-u01-lmstudio-result.png",
    alt: "Resultado 4/4 del lab de clasificación contra LM Studio gemma-4-e4b",
    caption: "Base reutilizada por u01/u02: salida JSON + abstención · localhost:1234",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller 1 / Eval 1",
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "Optimización sistemática",
    items: [
      "Prompt versionado (v1 → v2) con diff legible.",
      "Batería YAML + script de regresión.",
      "Tabla: modelo × temperatura × pass rate.",
      "Análisis breve de sensibilidad (1–2 variantes de formato).",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para la próxima",
    items: [
      "Sclar et al. (2024) — sensibilidad a features espurias",
      "Schulhoff et al. (2024) — ingeniería de prompts",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: razonamiento, descomposición y verificación (Unidad 3)",
  },
];
