/** Señal externa del programa (market #10). Actualizar por cohorte. */

export type GuestSlot = {
  course: "08" | "09" | "10" | "11";
  theme: string;
  status: "planned" | "confirmed" | "done";
  note?: string;
};

export type DefenseCohort = {
  id: string;
  label: string;
  window: string;
  format: string;
  artifacts: string[];
};

/** Un invitado temático por curso — rellenar nombres solo cuando estén confirmados. */
export const guestSlots: GuestSlot[] = [
  {
    course: "08",
    theme: "Aprovisionamiento abierto/cerrado o inferencia en producción",
    status: "planned",
    note: "Practicante industria / plataforma — no vendor pitch",
  },
  {
    course: "09",
    theme: "Agentes, evals o seguridad de prompts en producto",
    status: "planned",
  },
  {
    course: "10",
    theme: "Design review de un sistema GenAI en operación",
    status: "planned",
  },
  {
    course: "11",
    theme: "AI.Ops: obs, canary o incidentes con LLM",
    status: "planned",
  },
];

export const defenseCohort: DefenseCohort = {
  id: "2026-defensa-capstone",
  label: "Defensa pública del capstone",
  window: "Cierre de cohorte (calendario del Magíster)",
  format: "10 min oral + preguntas · design doc versionado · demo opcional ≤2 min",
  artifacts: [
    "DESIGN.md (labs/capstone plantilla)",
    "Evidencia 09 (regresión / rúbrica)",
    "Runbook 11 o health check",
    "Enlace a bibliografía OA usada (no inventar citas)",
  ],
};
