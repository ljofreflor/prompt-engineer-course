export type UnitContent = {
  courseSlug: string;
  unitId: string;
  learningOutcomes: string[];
  blocks: { title: string; minutes: number; body: string }[];
  readings: string[];
  lab?: { title: string; body: string };
};

const units09: UnitContent[] = [
  {
    courseSlug: "09-prompt-engineering",
    unitId: "u01",
    learningOutcomes: [
      "Estructurar un prompt con rol, contexto, tarea, restricciones y formato.",
      "Seleccionar y ordenar ejemplos few-shot según evidencia.",
      "Especificar salida estructurada validable y vía de abstención.",
    ],
    blocks: [
      {
        title: "Componentes de un prompt",
        minutes: 60,
        body: "Rol, contexto, tarea, restricciones, formato y ejemplos. Errores: instrucciones contradictorias, restricciones solo negativas, sobrecarga de contexto.",
      },
      {
        title: "Aprendizaje en contexto",
        minutes: 60,
        body: "Zero/one/few-shot. Distribución y formato de ejemplos suelen importar más que la corrección puntual de las respuestas demostrativas.",
      },
      {
        title: "Salida estructurada",
        minutes: 60,
        body: "Esquemas, validación y reintentos. Abstención explícita para reducir invención cuando la entrada está fuera de alcance.",
      },
      {
        title: "Taller de especificación",
        minutes: 60,
        body: "Construir un prompt con formato estricto y casos de prueba que incluyan entradas fuera de alcance.",
      },
    ],
    readings: [
      "Schulhoff et al. (2024), The Prompt Report — §§1 y 2.2 (arXiv:2406.06608)",
      "Brown et al. (2020), Language models are few-shot learners — §§1–3",
    ],
    lab: {
      title: "Lab local — especificación + validación",
      body: "Usá LM Studio (puerto 1234) u Ollama. Pedí JSON con schema fijo; validá con un script; medí tasa de parseo OK en 20 casos sintéticos.",
    },
  },
  {
    courseSlug: "09-prompt-engineering",
    unitId: "u02",
    learningOutcomes: [
      "Medir sensibilidad a variaciones semánticamente neutras del formato.",
      "Versionar prompts y correr pruebas de regresión.",
      "Detectar degradación por cambio de versión del modelo.",
    ],
    blocks: [
      {
        title: "Sensibilidad al formato",
        minutes: 60,
        body: "Evidencia de Sclar et al.: separadores, mayúsculas y orden pueden mover el desempeño tanto como cambiar de modelo.",
      },
      {
        title: "Conjuntos de prueba y variabilidad",
        minutes: 60,
        body: "Casos difíciles, criterios automatizables, repeticiones y tamaño para detectar diferencias relevantes.",
      },
      {
        title: "Versionamiento y regresión",
        minutes: 60,
        body: "Prompt en el repo junto al código. Suites que corren al cambiar prompt o modelo.",
      },
      {
        title: "Optimización sistemática (Taller 1)",
        minutes: 60,
        body: "Evaluación 1: prompt versionado + batería de pruebas + análisis de sensibilidad.",
      },
    ],
    readings: [
      "Sclar et al. (2024), Quantifying sensitivity to spurious prompt features",
      "Schulhoff et al. (2024), sección de ingeniería de prompts",
      "Zhou et al. (2023), Large language models are human-level prompt engineers (complementaria)",
    ],
    lab: {
      title: "Lab — prompt como artefacto",
      body: "Guardá el prompt en labs/09/u02/prompts/v1.md. Suite YAML de casos. Script que llama al endpoint local y reporta pass rate + varianza.",
    },
  },
  {
    courseSlug: "09-prompt-engineering",
    unitId: "u03",
    learningOutcomes: [
      "Aplicar CoT, ensamblado y descomposición con criterio de costo/beneficio.",
      "Distinguir razonamiento como técnica vs explicación auditable.",
      "Diseñar verificación programática o en segundo paso.",
    ],
    blocks: [
      {
        title: "Razonamiento explícito",
        minutes: 60,
        body: "Chain-of-thought: cuándo aporta (modelo y tarea) y compromiso de latencia/costo.",
      },
      {
        title: "Ensamblado y descomposición",
        minutes: 60,
        body: "Self-consistency, subtareas encadenadas y exploración de alternativas.",
      },
      {
        title: "Fidelidad del razonamiento",
        minutes: 60,
        body: "La cadena generada no es registro fiel del proceso. No usarla sola como fundamento mostrado al usuario.",
      },
      {
        title: "Verificación",
        minutes: 60,
        body: "Segundo paso, checks programáticos y límites de la autocrítica.",
      },
    ],
    readings: [
      "Wei et al. (2022), Chain-of-thought prompting",
      "Wang et al. (2023), Self-consistency",
      "Yao et al. (2023), Tree of Thoughts (complementaria)",
    ],
  },
  {
    courseSlug: "09-prompt-engineering",
    unitId: "u04",
    learningOutcomes: [
      "Describir el ciclo razón–acción–observación.",
      "Especificar tools con esquemas y manejo de errores.",
      "Definir límites de iteraciones, costo y tiempo.",
    ],
    blocks: [
      {
        title: "Anatomía de un agente",
        minutes: 60,
        body: "ReAct: planificación, memoria de trabajo y criterios de terminación.",
      },
      {
        title: "Diseño de herramientas",
        minutes: 60,
        body: "La descripción es una especificación para el modelo. Granularidad, schemas y resultados vacíos.",
      },
      {
        title: "Terminación y control",
        minutes: 60,
        body: "Límites duros. Acciones irreversibles requieren confirmación humana o control programático.",
      },
      {
        title: "Taller 2",
        minutes: 60,
        body: "Agente con ≥3 tools, manejo de errores y tope de iteraciones/costo/tiempo.",
      },
    ],
    readings: [
      "Yao, Zhao et al. (2023), ReAct",
      "Schick et al. (2023), Toolformer (complementaria)",
    ],
    lab: {
      title: "Lab — agente local",
      body: "Implementá un loop ReAct contra LM Studio. Tools: calculator, file_read (sandbox), web_stub. Hard caps: 8 pasos, timeout 60s.",
    },
  },
  {
    courseSlug: "09-prompt-engineering",
    unitId: "u05",
    learningOutcomes: [
      "Justificar multiagente vs agente único.",
      "Elegir topología y estimar fiabilidad compuesta.",
      "Ubicar checkpoints y degradación.",
    ],
    blocks: [
      {
        title: "Cuándo múltiples agentes",
        minutes: 60,
        body: "Costo, latencia y sobre-ingeniería. A menudo un agente bien diseñado gana.",
      },
      {
        title: "Topologías",
        minutes: 60,
        body: "Supervisor, cadena, pares, revisión cruzada: modo de falla de cada una.",
      },
      {
        title: "Propagación de errores",
        minutes: 60,
        body: "Fiabilidad compuesta ≈ producto de fiabilidades. Checkpoints y reintentos acotados.",
      },
      {
        title: "Taller de topología",
        minutes: 60,
        body: "Diseño de topología del proyecto final con cálculo de fiabilidad esperada.",
      },
    ],
    readings: [
      "Kapoor et al. (2024), AI agents that matter",
      "Wu et al. (2023), AutoGen (complementaria)",
    ],
  },
  {
    courseSlug: "09-prompt-engineering",
    unitId: "u06",
    learningOutcomes: [
      "Evaluar trayectorias (completitud, costo, pasos, tool errors).",
      "Explicar por qué el modelo no distingue instrucción de contenido.",
      "Proponer controles arquitectónicos fuera del prompt.",
    ],
    blocks: [
      {
        title: "Evaluación de trayectorias",
        minutes: 60,
        body: "Resultado ≠ trayectoria. Criticar success rate sin costo.",
      },
      {
        title: "Evaluación práctica",
        minutes: 60,
        body: "Set de tareas, repeticiones, jueces LLM y validez externa de AgentBench et al.",
      },
      {
        title: "Manipulación de instrucciones",
        minutes: 60,
        body: "Inyección directa e indirecta. Superficies en agentes que leen web/correo/docs.",
      },
      {
        title: "Límites del control y cierre",
        minutes: 60,
        body: "Defensas por prompt no bastan. Privilegio mínimo, validación programática, confirmación humana.",
      },
    ],
    readings: [
      "Greshake et al. (2023), Indirect prompt injection",
      "Kapoor et al. (2024); Zheng et al. (2023), LLM-as-judge",
    ],
  },
];

const byKey = new Map(units09.map((u) => [`${u.courseSlug}/${u.unitId}`, u]));

export function getUnitContent(courseSlug: string, unitId: string) {
  return byKey.get(`${courseSlug}/${unitId}`);
}
