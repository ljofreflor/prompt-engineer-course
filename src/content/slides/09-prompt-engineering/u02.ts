import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 09 Unidad 2. */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 09 · Unidad 2",
    title: "El prompt como artefacto",
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
    kicker: "Teoría",
    title: "Sensibilidad a features espurias",
    items: [
      "Sclar et al. (2024): separadores, mayúsculas y orden pueden mover el score tanto como cambiar de modelo.",
      "Schulhoff et al. (2024): la “ingeniería de prompts” exige medir, no solo reescribir.",
      "Implicación: el formato canónico vive en el repo; “mismo significado” no implica misma salida.",
    ],
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
    type: "viz",
    kicker: "Ilustración",
    title: "Misma tarea, tres formatos",
    viz: "prompt-sensitivity",
    caption: "Ilustrativo: el formato canónico se versiona; no se improvisa en producción.",
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
    title: "prompts/v1.md + cases.yaml + rúbrica",
    paragraphs: [
      "Lab: labs/09/u02/run_regression.py contra LM Studio — reporta formato · calidad · seguridad · costo (labs/09/RUBRIC.md) y escribe labs/09/runs/u02-regression-report.json.",
      "Cualquier cambio de prompt o modelo debe re-correr la suite; el pass no es “se ve bien”.",
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
    kicker: "Dominio",
    title: "Caso Chile en la batería",
    items: [
      "Soporte en español: boleta SII, ClaveÚnica, VPN.",
      "PII de terceros → abstención (RUT, sueldo): el flujo importa más que el modelo.",
      "Lab: labs/09/u02/cases.yaml (golden set local).",
    ],
  },
  {
    type: "bullets",
    kicker: "Entregable",
    title: "Optimización sistemática",
    items: [
      "Prompt versionado (v1 → v2) con diff legible.",
      "Batería YAML + script de regresión (rúbrica 09).",
      "Tabla: modelo × temperatura × pass rate.",
      "Análisis breve de sensibilidad (1–2 variantes de formato).",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Sclar et al. (2024) — sclar2024sensitivity",
      "Schulhoff et al. (2024) — schulhoff2024prompt",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: razonamiento, descomposición y verificación (Unidad 3)",
  },
];
