/** Matriz de competencias Magíster IA (cursos 08–11). Market #6. */

export type CompetencyLevel = "literacidad" | "aplicado" | "certificado";

export type CompetencyRow = {
  course: "08" | "09" | "10" | "11";
  skill: string;
  literacidad: string;
  aplicado: string;
  certificado: string; // artefacto que demuestra
};

export const competencyLevels: { id: CompetencyLevel; label: string; meaning: string }[] = [
  {
    id: "literacidad",
    label: "Literacidad",
    meaning: "Explica el concepto y sus límites con citas del programa.",
  },
  {
    id: "aplicado",
    label: "Aplicado",
    meaning: "Ejecuta el lab / taller con evidencia (run, screenshot, diff).",
  },
  {
    id: "certificado",
    label: "Certificado",
    meaning: "Entrega un artefacto versionado usable por un tercero.",
  },
];

export const competencyMatrix: CompetencyRow[] = [
  {
    course: "08",
    skill: "Modelo como artefacto",
    literacidad: "Vías de adaptación, apertura, latencia/costo",
    aplicado: "Hoja de cruce / comparación abierto–cerrado",
    certificado: "Sección 08 del design doc (make/buy + supuestos)",
  },
  {
    course: "09",
    skill: "Instrucción y agentes",
    literacidad: "Prompt ⊂ contexto; ReAct; inyección",
    aplicado: "make lab-09-u0N + rúbrica (formato·calidad·seguridad·costo)",
    certificado: "Prompt versionado + golden set + report JSON",
  },
  {
    course: "10",
    skill: "Sistema y decisión",
    literacidad: "Arquitectura, HITL, claims con umbral",
    aplicado: "Ficha de decisión + diagrama de flujo",
    certificado: "DESIGN.md completo (labs/capstone/)",
  },
  {
    course: "11",
    skill: "Operación",
    literacidad: "CI, canary, obs, guardrails",
    aplicado: "Health check / pipeline mínimo",
    certificado: "Runbook + kill-switch en el design doc",
  },
];
