import type { Course } from "./courses";
import p08 from "./programs/08-genai-llms.json";
import p09 from "./programs/09-prompt-engineering.json";
import p10 from "./programs/10-diseno-sistemas-ia.json";
import p11 from "./programs/11-aiops-cloud.json";

export type ProgramUnit = {
  number: number;
  id: string;
  title: string;
  hours: number;
  narrative: string[];
  session: string[];
  outcomes: string[];
  readings: string[];
};

export type Program = {
  slug: string;
  asignatura: string;
  ubicacion: string;
  introduccion: string[];
  objetivoGeneral: string;
  objetivosEspecificos: string[];
  metodologia: string[];
  metodologiaBullets: string[];
  evaluacion: { items: string[]; notes: string[] };
  bibliografiaObligatoria: string[];
  bibliografiaComplementaria: string[];
  unidades: ProgramUnit[];
};

const bySlug: Record<string, Program> = {
  "08-genai-llms": p08 as Program,
  "09-prompt-engineering": p09 as Program,
  "10-diseno-sistemas-ia": p10 as Program,
  "11-aiops-cloud": p11 as Program,
};

export function getProgram(slug: string): Program | undefined {
  return bySlug[slug];
}

export function programForCourse(course: Course): Program | undefined {
  return getProgram(course.slug);
}
