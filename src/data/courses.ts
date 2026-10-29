export type Unit = {
  id: string;
  title: string;
  hours: number;
  summary: string;
  status: "ready" | "skeleton";
};

export type Course = {
  slug: string;
  code: string;
  title: string;
  short: string;
  hours: number;
  autonomousHours: number;
  credits: number;
  units: Unit[];
  status: "ready" | "skeleton";
};

export const courses: Course[] = [
  {
    slug: "08-genai-llms",
    code: "08",
    title: "Generative AI y Large Language Models",
    short:
      "El modelo como artefacto: arquitectura, adaptación, inferencia y evaluación de dominio.",
    hours: 28,
    autonomousHours: 92,
    credits: 4,
    status: "ready",
    units: [
      {
        id: "u01",
        title: "Arquitectura y comportamiento del transformer generativo",
        hours: 4,
        summary: "Atención, tokenización, decodificación y leyes de escalamiento.",
        status: "ready",
      },
      {
        id: "u02",
        title: "El pipeline de post-entrenamiento",
        hours: 4,
        summary: "Pre-entrenamiento, instrucción, alineación y destilación.",
        status: "ready",
      },
      {
        id: "u03",
        title: "Vías de adaptación y criterio de decisión",
        hours: 4,
        summary: "Prompting, RAG y ajuste fino: cuándo corresponde cada vía.",
        status: "ready",
      },
      {
        id: "u04",
        title: "Modelos abiertos y cerrados",
        hours: 4,
        summary: "Aprovisionamiento, costo, soberanía y mitigación de dependencia.",
        status: "ready",
      },
      {
        id: "u05",
        title: "Inferencia — costo, latencia y contexto",
        hours: 4,
        summary: "TTFT, cuantización, caché de prefijo y contexto extenso.",
        status: "ready",
      },
      {
        id: "u06",
        title: "Evaluación de modelos generativos",
        hours: 4,
        summary: "Sets propios, modelos jueces y validez externa.",
        status: "ready",
      },
      {
        id: "u07",
        title: "Multimodalidad, riesgos e integración",
        hours: 4,
        summary: "Multimodalidad, memorización, alucinación y cierre de proyectos.",
        status: "ready",
      },
    ],
  },
  {
    slug: "09-prompt-engineering",
    code: "09",
    title: "Prompt Engineering y Sistemas Multiagentes",
    short:
      "La instrucción como especificación; agentes con herramientas, coordinación y evaluación de trayectorias.",
    hours: 24,
    autonomousHours: 96,
    credits: 4,
    status: "ready",
    units: [
      {
        id: "u01",
        title: "La instrucción como especificación",
        hours: 4,
        summary: "Componentes del prompt, few-shot y salida estructurada.",
        status: "ready",
      },
      {
        id: "u02",
        title: "El prompt como artefacto de ingeniería",
        hours: 4,
        summary: "Sensibilidad al formato, pruebas, versionado y regresión.",
        status: "ready",
      },
      {
        id: "u03",
        title: "Razonamiento, descomposición y verificación",
        hours: 4,
        summary: "CoT, ensamblado, fidelidad del razonamiento y verificación.",
        status: "ready",
      },
      {
        id: "u04",
        title: "Del prompt al agente",
        hours: 4,
        summary: "ReAct, diseño de tools y control de terminación.",
        status: "ready",
      },
      {
        id: "u05",
        title: "Sistemas multiagentes",
        hours: 4,
        summary: "Topologías, propagación de errores y degradación.",
        status: "ready",
      },
      {
        id: "u06",
        title: "Evaluación agéntica, robustez y límites del control",
        hours: 4,
        summary: "Trayectorias, costo por tarea e inyección de instrucciones.",
        status: "ready",
      },
    ],
  },
  {
    slug: "10-diseno-sistemas-ia",
    code: "10",
    title: "Diseño de Sistemas y Aplicaciones de IA",
    short:
      "Del modelo al sistema: arquitectura, datos, interacción humana y design doc.",
    hours: 24,
    autonomousHours: 96,
    credits: 4,
    status: "ready",
    units: [
      {
        id: "u01",
        title: "De la decisión al sistema",
        hours: 4,
        summary: "Especificación y requisitos del sistema de IA.",
        status: "ready",
      },
      {
        id: "u02",
        title: "Patrones de arquitectura",
        hours: 4,
        summary: "Cascadas, ruteo, RAG como patrón y degradación elegante.",
        status: "ready",
      },
      {
        id: "u03",
        title: "Datos como infraestructura",
        hours: 4,
        summary: "Calidad, linaje y contratos de datos del sistema.",
        status: "ready",
      },
      {
        id: "u04",
        title: "Interacción humano-IA",
        hours: 4,
        summary: "Confianza calibrada, confirmación y diseño de interfaces.",
        status: "skeleton",
      },
      {
        id: "u05",
        title: "Evaluación, monitoreo y superficie de riesgo",
        hours: 4,
        summary: "Métricas de sistema, deriva y controles arquitectónicos.",
        status: "skeleton",
      },
      {
        id: "u06",
        title: "Documento de diseño y defensa",
        hours: 4,
        summary: "Design doc, revisión por pares y defensa oral.",
        status: "skeleton",
      },
    ],
  },
  {
    slug: "11-aiops-cloud",
    code: "11",
    title: "AI.Ops y Sistemas Cloud",
    short:
      "De cuaderno a producción: contenedores, inferencia, observabilidad y plataformas.",
    hours: 24,
    autonomousHours: 96,
    credits: 4,
    status: "ready",
    units: [
      {
        id: "u01",
        title: "Del cuaderno a producción",
        hours: 4,
        summary: "Reproducibilidad y fundamentos operativos.",
        status: "ready",
      },
      {
        id: "u02",
        title: "Empaquetado y automatización del ciclo",
        hours: 4,
        summary: "Contenedores, CI y automatización del ciclo de vida.",
        status: "ready",
      },
      {
        id: "u03",
        title: "Servicio de inferencia y despliegue",
        hours: 4,
        summary: "Estrategias de serving y despliegue.",
        status: "ready",
      },
      {
        id: "u04",
        title: "Observabilidad, deriva e incidentes",
        hours: 4,
        summary: "Métricas, alertas y respuesta ante fallas.",
        status: "skeleton",
      },
      {
        id: "u05",
        title: "Plataformas gestionadas",
        hours: 4,
        summary: "Criterio de selección entre AWS, Azure y GCP.",
        status: "skeleton",
      },
      {
        id: "u06",
        title: "Operación de sistemas generativos",
        hours: 4,
        summary: "Cuotas, secretos, costo y operación de GenAI.",
        status: "skeleton",
      },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
