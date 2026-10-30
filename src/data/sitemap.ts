/**
 * Mapa del sitio — fuente de verdad de rutas públicas y profesor.
 * Base GitHub Pages: `/prompt-engineer-course/` (usar `asset()` al renderizar).
 */

export type Audience = "public" | "teacher" | "both";

export type SiteNode = {
  /** Id estable para `current` en Header / layouts */
  id: string;
  /** Path relativo a la base del sitio (sin leading slash); plantillas con `:slug` / `:unit` */
  path: string;
  /** Etiqueta corta (nav / mapa) */
  label: string;
  /** Una línea: para qué sirve esta ruta */
  purpose: string;
  audience: Audience;
  /** Aparece en la barra principal */
  nav?: "primary" | "secondary";
  children?: SiteNode[];
};

/** Árbol completo del sitio de material (no es uai.cl oficial). */
export const siteMap: SiteNode[] = [
  {
    id: "home",
    path: "",
    label: "Inicio",
    purpose: "Portada del Magíster IA — arco 08–11 y acceso a cursos.",
    audience: "public",
    nav: "primary",
  },
  {
    id: "cursos",
    path: "cursos/",
    label: "Cursos",
    purpose: "Índice de asignaturas GenAI, Prompt, Diseño y AI.Ops.",
    audience: "public",
    nav: "primary",
    children: [
      {
        id: "curso",
        path: "cursos/:slug/",
        label: "Programa del curso",
        purpose: "Syllabus, unidades y lecturas del curso.",
        audience: "public",
        children: [
          {
            id: "unidad",
            path: "cursos/:slug/:unit/",
            label: "Unidad",
            purpose: "Objetivos, bloques y material de la unidad.",
            audience: "public",
            children: [
              {
                id: "clase",
                path: "cursos/:slug/:unit/clase/",
                label: "Clase",
                purpose: "Proyección de clase (deck institucional).",
                audience: "both",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "clases",
    path: "clases/",
    label: "Clases",
    purpose: "Índice de todas las clases por curso y unidad.",
    audience: "public",
    nav: "primary",
  },
  {
    id: "herramientas",
    path: "herramientas/",
    label: "Stack",
    purpose: "Herramientas, labs, Makefile y evidencia de corridas.",
    audience: "public",
    nav: "primary",
  },
  {
    id: "bibliografia",
    path: "bibliografia/",
    label: "Bibliografía",
    purpose: "Referencias OA y lecturas del programa.",
    audience: "public",
    nav: "primary",
  },
  {
    id: "competencias",
    path: "competencias/",
    label: "Competencias",
    purpose: "Matriz literacidad → aplicado → certificado por artefacto.",
    audience: "public",
    nav: "secondary",
  },
  {
    id: "cumplimiento",
    path: "cumplimiento/",
    label: "Cumplimiento",
    purpose: "Dashboard L0–L4, gaps y métricas pedagógicas (snapshot del checker).",
    audience: "public",
    nav: "secondary",
  },
  {
    id: "cambios",
    path: "cambios/",
    label: "Cambios",
    purpose: "Changelog trimestral del material (modelos, labs, papers).",
    audience: "public",
    nav: "secondary",
  },
  {
    id: "senal",
    path: "senal/",
    label: "Señal",
    purpose: "Invitados y defensa pública (solo confirmados).",
    audience: "public",
    nav: "secondary",
  },
  {
    id: "mapa",
    path: "mapa/",
    label: "Mapa",
    purpose: "Este mapa del sitio: rutas, audiencia y propósito.",
    audience: "public",
    nav: "secondary",
  },
  {
    id: "profesor",
    path: "profesor/",
    label: "Profesor",
    purpose: "Zona con credenciales: guiones y vista docente.",
    audience: "teacher",
    nav: "primary",
    children: [
      {
        id: "profesor-curso",
        path: "profesor/cursos/:slug/",
        label: "Curso (profesor)",
        purpose: "Índice docente del curso.",
        audience: "teacher",
        children: [
          {
            id: "profesor-unidad",
            path: "profesor/cursos/:slug/:unit/",
            label: "Guion de unidad",
            purpose: "Guion y notas de dictado por unidad.",
            audience: "teacher",
          },
        ],
      },
    ],
  },
];

/** Enlaces de la barra principal (orden del mapa). */
export function primaryNav(): SiteNode[] {
  return siteMap.filter((n) => n.nav === "primary");
}

/** Enlaces secundarios (mapa / pie). */
export function secondaryNav(): SiteNode[] {
  return siteMap.filter((n) => n.nav === "secondary");
}

/** Slugs reales de curso (para expandir el mapa en /mapa/). */
export const courseSlugs = [
  "08-genai-llms",
  "09-prompt-engineering",
  "10-diseno-sistemas-ia",
  "11-aiops-cloud",
] as const;
