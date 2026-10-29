/** Stack concreto derivado de «Requisitos técnicos y plataforma» de cada syllabus. */

export type StackTool = {
  name: string;
  role: string;
  href?: string;
  setup?: string;
};

export type StackGroup = {
  id: string;
  title: string;
  syllabusRef: string;
  tools: StackTool[];
};

export type CourseStack = {
  courseSlug: string;
  courseCode: string;
  summary: string;
  groups: StackGroup[];
};

export const courseStacks: CourseStack[] = [
  {
    courseSlug: "08-genai-llms",
    courseCode: "08",
    summary:
      "Cuadernos con cómputo acelerado + APIs de modelos cerrados + pesos abiertos locales (contingencia en CPU).",
    groups: [
      {
        id: "notebooks",
        title: "Cuadernos gestionados (GPU)",
        syllabusRef: "Entorno de ejecución — cómputo acelerado",
        tools: [
          {
            name: "Google Colab",
            role: "Cuadernos con GPU/TPU para experimentos con pesos abiertos.",
            href: "https://colab.research.google.com/",
            setup: "Runtime → GPU. Preferir programas académicos / límites de cuota.",
          },
          {
            name: "Kaggle Notebooks",
            role: "Alternativa con cuotas de GPU semanales y datasets públicos.",
            href: "https://www.kaggle.com/code",
          },
          {
            name: "Jupyter Lab (local)",
            role: "Misma disciplina de cuaderno cuando la GPU es la del estudiante.",
            href: "https://jupyter.org/",
          },
        ],
      },
      {
        id: "open-weights",
        title: "Pesos abiertos (local / hub)",
        syllabusRef: "Modelos abiertos · contingencia CPU",
        tools: [
          {
            name: "LM Studio",
            role: "Servidor local OpenAI-compatible; demos y contingencia sin cloud.",
            href: "https://lmstudio.ai/",
            setup: "lms server start · http://localhost:1234/v1",
          },
          {
            name: "Ollama",
            role: "Pull/run de instruct locales; API /v1.",
            href: "https://ollama.com/",
            setup: "ollama pull gemma3 · http://localhost:11434/v1",
          },
          {
            name: "Hugging Face Hub + transformers",
            role: "Descarga de pesos, tokenizers y notebooks de referencia.",
            href: "https://huggingface.co/",
          },
          {
            name: "llama.cpp",
            role: "Inferencia cuantizada liviana en CPU cuando cae la GPU gestionada.",
            href: "https://github.com/ggerganov/llama.cpp",
          },
        ],
      },
      {
        id: "closed-apis",
        title: "Modelos de acceso cerrado (API)",
        syllabusRef: "Interfaces de programación de proveedores · Unidad 4",
        tools: [
          {
            name: "OpenAI API",
            role: "Comparación cerrado vs abierto (calidad, costo, latencia).",
            href: "https://platform.openai.com/",
            setup: "Clave por equipo, crédito prepagado, sin facturación del estudiante.",
          },
          {
            name: "Anthropic API",
            role: "Segundo proveedor cerrado para migración / contingencia.",
            href: "https://www.anthropic.com/",
          },
          {
            name: "Google AI Studio / Gemini API",
            role: "Tercer proveedor; programas académicos cuando existan.",
            href: "https://aistudio.google.com/",
          },
        ],
      },
    ],
  },
  {
    courseSlug: "09-prompt-engineering",
    courseCode: "09",
    summary:
      "Cuadernos + APIs por token (sin entrenamiento). Contingencia: modelo local. Agentes solo con tools en sandbox.",
    groups: [
      {
        id: "runtime",
        title: "Runtime de prompts y agentes",
        syllabusRef: "Entorno de ejecución · consumo por token",
        tools: [
          {
            name: "LM Studio / Ollama",
            role: "Labs del repo (`labs/09/*`) contra API OpenAI-compatible.",
            href: "https://lmstudio.ai/",
            setup: "OPENAI_BASE_URL=http://localhost:1234/v1",
          },
          {
            name: "Python 3 + scripts del repo",
            role: "Suites de regresión, CoT+verify y agente ReAct sin framework obligatorio.",
            setup: "python labs/09/u01/run_structured.py",
          },
          {
            name: "Proveedor cloud (clave de equipo)",
            role: "Talleres cuando la UAI provee cuota; medir costo por tarea (U6).",
          },
        ],
      },
      {
        id: "agent-tools",
        title: "Herramientas del agente (sandbox)",
        syllabusRef: "Herramientas del agente · privilegio mínimo",
        tools: [
          {
            name: "calculator / file_read (labs/09/u04)",
            role: "Tools de ejemplo aisladas; sin escritura a sistemas reales.",
          },
          {
            name: "Datos sintéticos / públicos",
            role: "Nunca PII ni datos de la organización del estudiante en terceros.",
          },
        ],
      },
      {
        id: "optional-fw",
        title: "Marcos opcionales (verificar al dictado)",
        syllabusRef: "Nota de vigencia de marcos agénticos",
        tools: [
          {
            name: "LangGraph / LlamaIndex (opcional)",
            role: "Ilustración de topologías; el curso exige el método, no un vendor.",
            href: "https://www.langchain.com/langgraph",
          },
          {
            name: "Open WebUI",
            role: "Chat UI sobre Ollama/LM Studio para demos en clase.",
            href: "https://openwebui.com/",
          },
        ],
      },
    ],
  },
  {
    courseSlug: "10-diseno-sistemas-ia",
    courseCode: "10",
    summary:
      "Sin cómputo especializado ni cuentas cloud: diagramación + repo del design doc. Costos desde listas oficiales.",
    groups: [
      {
        id: "docs",
        title: "Documento de diseño",
        syllabusRef: "Entorno de ejecución — repositorio + diagramación",
        tools: [
          {
            name: "Git + GitHub",
            role: "Versionar el design doc e iteraciones por unidad.",
            href: "https://github.com/",
          },
          {
            name: "Markdown / Notion / Google Docs",
            role: "Redacción del entregable; exportable a PDF para defensa.",
          },
          {
            name: "Mermaid",
            role: "Diagramas de arquitectura en el mismo repo (CI-friendly).",
            href: "https://mermaid.js.org/",
            setup: "Bloques ```mermaid en el design doc.",
          },
          {
            name: "draw.io / diagrams.net",
            role: "Diagramas de despliegue y topologías cuando Mermaid no alcanza.",
            href: "https://app.diagrams.net/",
          },
          {
            name: "Excalidraw",
            role: "Bocetos de interacción humano-IA en taller.",
            href: "https://excalidraw.com/",
          },
        ],
      },
      {
        id: "cost-refs",
        title: "Referencias de costo (sin aprovisionar)",
        syllabusRef: "Referencias de costo — calculadoras oficiales",
        tools: [
          {
            name: "Calculadoras AWS / Azure / GCP",
            role: "Presupuestos unitarios de la Unidad 1 sin crear cuentas de pago.",
          },
          {
            name: "Listas de precios de APIs generativas",
            role: "Costo por token / request para justificar NFR.",
          },
        ],
      },
    ],
  },
  {
    courseSlug: "11-aiops-cloud",
    courseCode: "11",
    summary:
      "Tres nubes + CI + contenedores locales. Cada lab declara alternativa local (p.ej. LM Studio).",
    groups: [
      {
        id: "clouds",
        title: "Proveedores de nube (programas académicos)",
        syllabusRef: "Cuentas en los tres proveedores principales",
        tools: [
          {
            name: "AWS (Academy / Educate)",
            role: "Entrenamiento, registry, serving e IAM con crédito fijo.",
            href: "https://aws.amazon.com/training/awsacademy/",
          },
          {
            name: "Microsoft Azure (for Students / Azure ML)",
            role: "Workspace, endpoints y Key Vault para secretos.",
            href: "https://azure.microsoft.com/free/students/",
          },
          {
            name: "Google Cloud (Education / Vertex AI)",
            role: "Pipelines, Model Registry y monitoring.",
            href: "https://cloud.google.com/edu",
          },
        ],
      },
      {
        id: "local-ci",
        title: "Local + integración continua",
        syllabusRef: "Entorno local con contenedores · repositorio con CI",
        tools: [
          {
            name: "Docker",
            role: "Empaquetar el servicio de inferencia / healthcheck.",
            href: "https://www.docker.com/",
            setup: "Imagen con healthcheck; sin secretos en capas.",
          },
          {
            name: "GitHub Actions",
            role: "Build, test y smoke del wrapper (labs/11/u01).",
            href: "https://docs.github.com/actions",
          },
          {
            name: "LM Studio (contingencia)",
            role: "Backend OpenAI-compatible cuando la nube no está disponible.",
            href: "https://lmstudio.ai/",
            setup: "python labs/11/u01/health_wrapper.py",
          },
        ],
      },
      {
        id: "ops",
        title: "Observabilidad y secretos",
        syllabusRef: "Gestión de credenciales · monitoreo (U2/U4)",
        tools: [
          {
            name: "Secret managers (AWS SM / Azure Key Vault / GCP SM)",
            role: "Sin credenciales de larga duración en el repo.",
          },
          {
            name: "Dashboards nativos + alertas de presupuesto",
            role: "Contenido y control de gasto desde la Unidad 1.",
          },
        ],
      },
    ],
  },
];

export function getCourseStack(slug: string) {
  return courseStacks.find((s) => s.courseSlug === slug);
}

/** Catálogo plano para la página /herramientas. */
export const sharedLocalTools: StackTool[] = [
  {
    name: "LM Studio",
    role: "Servidor local recomendado para labs (puerto 1234).",
    href: "https://lmstudio.ai/",
    setup: "lms server start --port 1234",
  },
  {
    name: "Ollama",
    role: "Alternativa local; misma familia de scripts vía OPENAI_BASE_URL.",
    href: "https://ollama.com/",
  },
  {
    name: "Python 3.11+",
    role: "Runtime de labs/smoke sin dependencias pesadas obligatorias.",
  },
  {
    name: "Git",
    role: "Versionar prompts, design docs y canalizaciones.",
  },
];
