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
    lab: {
      title: "Lab — CoT + verificación programática",
      body: "labs/09/u03/run_verify.py: el modelo propone FINAL=<n>; el script valida con eval. No alcanza con “la cadena se ve bien”.",
    },
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

const units08: UnitContent[] = [
  {
    courseSlug: "08-genai-llms",
    unitId: "u01",
    learningOutcomes: [
      "Explicar generación autorregresiva y atribuir comportamientos a ella.",
      "Determinar efectos de la tokenización en español y en costo.",
      "Configurar decodificación (temperatura, top-p) según la tarea.",
    ],
    blocks: [
      {
        title: "Del LM al transformer generativo",
        minutes: 60,
        body: "Modelado autorregresivo, atención y costo cuadrático, decoder-only vs encoder.",
      },
      {
        title: "Tokenización y ventana de contexto",
        minutes: 60,
        body: "Subpalabras, efectos en español/números, KV-cache y degradación por posición (lost in the middle).",
      },
      {
        title: "Generación y control de la salida",
        minutes: 60,
        body: "Temperatura, nucleus sampling, salida estructurada, límites del determinismo.",
      },
      {
        title: "Escalamiento",
        minutes: 60,
        body: "Leyes de escalamiento y asignación óptima de cómputo (Kaplan / Chinchilla).",
      },
    ],
    readings: [
      "Vaswani et al. (2017) — vaswani2017attention",
      "Liu et al. (2024) Lost in the Middle — liu2024lostmiddle",
    ],
    lab: {
      title: "Lab local — tokenización y decodificación",
      body: "Con LM Studio: medí tokens de un párrafo en español vs inglés; variá temperature/top_p y registrá diversidad en 10 corridas.",
    },
  },
  {
    courseSlug: "08-genai-llms",
    unitId: "u02",
    learningOutcomes: [
      "Describir etapas del pipeline de un modelo de instrucción.",
      "Atribuir comportamientos a pretrain / SFT / alineación.",
      "Reconocer impuesto de alineación y sesgo de longitud.",
    ],
    blocks: [
      {
        title: "Pre-entrenamiento",
        minutes: 60,
        body: "Objetivo auto-supervisado, filtrado de corpus, contaminación de benchmarks.",
      },
      {
        title: "Ajuste por instrucciones",
        minutes: 60,
        body: "De continuación a seguimiento de instrucciones; datos sintéticos y destilación.",
      },
      {
        title: "Alineación por preferencias",
        minutes: 60,
        body: "RLHF vs DPO; constitutional AI; costos de alineación.",
      },
      {
        title: "Razonamiento y taller de atribución",
        minutes: 60,
        body: "Modelos de razonamiento extendido; taller: atribuir comportamientos a etapas.",
      },
    ],
    readings: [
      "Ouyang et al. (2022) — ouyang2022instruct",
      "Brown et al. (2020) §§1–3 — brown2020fewshot",
      "Rafailov et al. (2023) DPO — rafailov2023dpo",
    ],
  },
  {
    courseSlug: "08-genai-llms",
    unitId: "u03",
    learningOutcomes: [
      "Elegir entre prompting, RAG y fine-tuning con criterios explícitos.",
      "Preparar datos LoRA y detectar olvido catastrófico.",
    ],
    blocks: [
      {
        title: "Qué modifica cada vía",
        minutes: 60,
        body: "Instrucción vs recuperación vs ajuste: error de fine-tune para hechos.",
      },
      {
        title: "Árbol de decisión",
        minutes: 60,
        body: "Naturaleza de lo que falta, datos, frescura, trazabilidad, presupuesto, control.",
      },
      {
        title: "Fine-tuning eficiente",
        minutes: 60,
        body: "LoRA/QLoRA, volumen mínimo, evaluación post-ajuste.",
      },
      {
        title: "Taller (Eval 1)",
        minutes: 60,
        body: "Ajustar modelo abierto moderado vs misma tarea por instrucción.",
      },
    ],
    readings: [
      "Hu et al. (2022) LoRA — hu2022lora",
      "Lewis et al. (2020) RAG — lewis2020rag",
      "Dettmers et al. (2023) QLoRA — dettmers2023qlora",
    ],
  },
  {
    courseSlug: "08-genai-llms",
    unitId: "u04",
    learningOutcomes: [
      "Distinguir grados de apertura y licencias.",
      "Calcular punto de cruce de costo abierto vs cerrado.",
    ],
    blocks: [
      {
        title: "Qué significa abierto",
        minutes: 60,
        body: "Pesos, licencias y restricciones comerciales en Chile.",
      },
      {
        title: "Dimensiones que deciden",
        minutes: 60,
        body: "Costo, latencia, especialización, soberanía, estabilidad de versiones.",
      },
      {
        title: "Ejercicio cuantitativo",
        minutes: 60,
        body: "Punto de cruce por volumen; sensibilidad a supuestos.",
      },
      {
        title: "Dependencia y mitigación",
        minutes: 60,
        body: "Abstracción de proveedor y alternativa evaluada.",
      },
    ],
    readings: ["Bommasani et al. (2021) — bommasani2021foundation"],
    lab: {
      title: "Lab — costo local vs API",
      body: "Estimá costo/hora de un 7B cuantizado en laptop vs precio por token de un API cerrado para 10k requests/día.",
    },
  },
  {
    courseSlug: "08-genai-llms",
    unitId: "u05",
    learningOutcomes: [
      "Descomponer latencia (TTFT vs TPOT) y estimar costo unitario.",
      "Medir efecto de cuantización sobre calidad.",
    ],
    blocks: [
      {
        title: "Anatomía de la latencia",
        minutes: 60,
        body: "Prefill vs decode; qué importa según la UI.",
      },
      {
        title: "Anatomía del costo",
        minutes: 60,
        body: "Tokens in/out, caché de prefijo, proyección mensual.",
      },
      {
        title: "Optimización",
        minutes: 60,
        body: "Cuantización, batching, tamaño de modelo como variable de diseño.",
      },
      {
        title: "Contexto extenso (Eval 2)",
        minutes: 60,
        body: "Contexto largo vs RAG; medición comparativa.",
      },
    ],
    readings: [
      "Liu et al. (2024) — liu2024lostmiddle",
      "Lewis et al. (2020) — lewis2020rag",
      "Dettmers et al. (2023) — dettmers2023qlora",
    ],
  },
  {
    courseSlug: "08-genai-llms",
    unitId: "u06",
    learningOutcomes: [
      "Construir un set de evaluación de dominio.",
      "Usar modelo juez con mitigación de sesgos.",
    ],
    blocks: [
      {
        title: "Evaluaciones públicas y límites",
        minutes: 60,
        body: "Contaminación, saturación, validez externa.",
      },
      {
        title: "Set propio",
        minutes: 60,
        body: "Tarea, muestreo (incl. difíciles), tamaño y potencia.",
      },
      {
        title: "Jueces y evaluación humana",
        minutes: 60,
        body: "Sesgos de longitud/posición/estilo; concordancia.",
      },
      {
        title: "Propiedades específicas (Eval 3)",
        minutes: 60,
        body: "Fidelidad a fuente, alucinación, sensibilidad al formato.",
      },
    ],
    readings: ["Zheng et al. (2023) — zheng2023judge"],
  },
  {
    courseSlug: "08-genai-llms",
    unitId: "u07",
    learningOutcomes: [
      "Evaluar aplicabilidad multimodal y riesgo de memorización.",
      "Distinguir riesgos del modelo vs del sistema.",
    ],
    blocks: [
      {
        title: "Modelos multimodales",
        minutes: 60,
        body: "Espacio común; extracción desde documentos.",
      },
      {
        title: "Generación de imagen",
        minutes: 60,
        body: "Difusión, control, costo y procedencia de datos.",
      },
      {
        title: "Riesgos del modelo",
        minutes: 60,
        body: "Extracción de datos de entrenamiento; límites de la instrucción como control.",
      },
      {
        title: "Proyectos y cierre",
        minutes: 60,
        body: "Presentaciones; articulación hacia Prompt Engineering y Diseño de Sistemas.",
      },
    ],
    readings: ["Bommasani et al. (2021); Carlini et al. (2021) — enlace editorial / OA si disponible"],
  },
];

const units10: UnitContent[] = [
  {
    courseSlug: "10-diseno-sistemas-ia",
    unitId: "u01",
    learningOutcomes: [
      "Identificar la decisión organizacional y su línea base medible.",
      "Distinguir predicción, decisión y acción en la cadena de valor.",
      "Establecer presupuestos de latencia, costo, disponibilidad y error.",
      "Redactar una especificación evaluable por un tercero.",
    ],
    blocks: [
      {
        title: "La decisión y su línea base",
        minutes: 60,
        body: "Identificación de la decisión objetivo, actor decisor y proceso actual. Costo del error. Cuándo no hace falta ML.",
      },
      {
        title: "Predicción, decisión y acción",
        minutes: 60,
        body: "Cadena predicción–decisión–acción–resultado. Capacidad de ejecución y ventana temporal. Criterios de aceptación.",
      },
      {
        title: "Requisitos no funcionales",
        minutes: 60,
        body: "Presupuestos de latencia, costo unitario, disponibilidad, volumen y trazabilidad como restricciones de arquitectura.",
      },
      {
        title: "Taller de especificación",
        minutes: 60,
        body: "Ficha de especificación del caso propio. Crítica cruzada. Producto: sección 1 del documento de diseño.",
      },
    ],
    readings: [
      "Huyen (2022), caps. 1–2",
      "Kleinberg et al. (2015), Prediction policy problems",
      "Paleyes, Urma y Lawrence (2022) — complementaria",
    ],
    lab: {
      title: "Taller — ficha de especificación",
      body: "Completá la ficha (decisión, línea base, presupuestos NFR). No requiere GPU: el entregable es texto versionado en el repo del design doc.",
    },
  },
  {
    courseSlug: "10-diseno-sistemas-ia",
    unitId: "u02",
    learningOutcomes: [
      "Seleccionar el régimen de inferencia a partir de los NFR.",
      "Diseñar topologías compuestas (cascada, ruteo, RAG como patrón).",
      "Especificar degradación elegante y circuit breakers.",
    ],
    blocks: [
      {
        title: "Regímenes de inferencia",
        minutes: 60,
        body: "Batch, online, streaming y precómputo. Derivación desde presupuestos no funcionales.",
      },
      {
        title: "Sistemas compuestos I",
        minutes: 60,
        body: "Cascadas por costo/confianza, ruteo, ensamblados y reglas duras.",
      },
      {
        title: "Recuperación y herramientas",
        minutes: 60,
        body: "RAG como patrón arquitectónico (indexación, chunking, rerank). Delimitación vs curso 09.",
      },
      {
        title: "Diseño para la falla",
        minutes: 60,
        body: "Caché, timeouts, reintentos, rate limits, circuit breakers y comportamiento por defecto.",
      },
    ],
    readings: [
      "Huyen (2022), caps. 7–8",
      "Zaharia et al. (2024), Compound AI systems",
      "Gao et al. (2024), RAG survey §§1–3",
    ],
  },
  {
    courseSlug: "10-diseno-sistemas-ia",
    unitId: "u03",
    learningOutcomes: [
      "Redactar un contrato de datos con esquema, semántica y SLAs.",
      "Prevenir desalineación entrenamiento–servicio.",
      "Diseñar captura de etiquetas y reserva no intervenida.",
    ],
    blocks: [
      {
        title: "Contratos de datos y linaje",
        minutes: 60,
        body: "Esquema, semántica, frecuencia, completitud, estabilidad, validación de entrada y versionado.",
      },
      {
        title: "Desalineación entrenamiento-servicio",
        minutes: 60,
        body: "Features duplicadas, fugas temporales y arquitecturas que unifican el cálculo.",
      },
      {
        title: "Etiquetas, retroalimentación y bucles",
        minutes: 60,
        body: "Etiquetas tardías/proxy, sesgo inducido por el sistema y reserva no intervenida.",
      },
      {
        title: "Taller de contratos",
        minutes: 60,
        body: "Sección de datos del design doc versionada en Git; diagramas Mermaid/draw.io.",
      },
    ],
    readings: [
      "Huyen (2022), caps. 3–4",
      "Sambasivan et al. (2021)",
      "Breck et al. (2017) — complementaria",
    ],
    lab: {
      title: "Taller — contrato de datos",
      body: "Plantilla de contrato en el repo del design doc (sin datos reales). Ver /herramientas/#curso-10.",
    },
  },
  {
    courseSlug: "10-diseno-sistemas-ia",
    unitId: "u04",
    learningOutcomes: [
      "Determinar el nivel de automatización según costo del error y supervisión real.",
      "Diseñar presentación de incertidumbre y abstención.",
      "Especificar reversión, apelación y registro.",
    ],
    blocks: [
      {
        title: "Niveles de automatización",
        minutes: 60,
        body: "Continuo de automatización; crítica del humano-en-el-loop nominal; umbrales.",
      },
      {
        title: "Comunicación de la incertidumbre",
        minutes: 60,
        body: "Calibración, intervalos, abstención y efectos sobre la decisión humana.",
      },
      {
        title: "Confianza y explicación",
        minutes: 60,
        body: "Sobreconfianza, aversión al algoritmo y fricción deliberada.",
      },
      {
        title: "Reversión y registro",
        minutes: 60,
        body: "Caminos de corrección/escalamiento y registro técnico-compliance (Actividad 2).",
      },
    ],
    readings: [
      "Amershi et al. (2019)",
      "Buçinca et al. (2021)",
      "Parasuraman et al. (2000) — complementaria",
    ],
  },
  {
    courseSlug: "10-diseno-sistemas-ia",
    unitId: "u05",
    learningOutcomes: [
      "Especificar evaluación en tres niveles (componente, sistema, organización).",
      "Diseñar puesta en producción con reversión automática.",
      "Identificar superficie de riesgo y controles proporcionales.",
    ],
    blocks: [
      {
        title: "Tres niveles de evaluación",
        minutes: 60,
        body: "Métricas de componente/sistema/resultado y métricas de vigilancia.",
      },
      {
        title: "Evaluación en línea",
        minutes: 60,
        body: "Sombra, canaria, experimentación controlada y criterios de rollback.",
      },
      {
        title: "Evaluación de sistemas generativos",
        minutes: 60,
        body: "Sets de dominio, jueces LLM y evaluación humana estructurada.",
      },
      {
        title: "Superficie de riesgo",
        minutes: 60,
        body: "OOD, deriva, inyección indirecta y fuga por salida; controles de diseño.",
      },
    ],
    readings: [
      "Huyen (2022), caps. 6 y 9",
      "Greshake et al. (2023)",
    ],
  },
  {
    courseSlug: "10-diseno-sistemas-ia",
    unitId: "u06",
    learningOutcomes: [
      "Redactar un design doc completo y revisable por un tercero.",
      "Exponer riesgos, mitigaciones y plan de evaluación.",
      "Defender decisiones de arquitectura ante revisión crítica.",
    ],
    blocks: [
      {
        title: "Estructura del design doc",
        minutes: 60,
        body: "Contexto, decisión, requisitos, arquitectura, datos, evaluación, operación y riesgos.",
      },
      {
        title: "Claims con evidencia",
        minutes: 60,
        body: "Línea base, delta esperado, experimentos y supuestos no validados.",
      },
      {
        title: "Revisión adversaria",
        minutes: 60,
        body: "Peer review: ambigüedad, Goodhart, rollback y superficie de riesgo.",
      },
      {
        title: "Defensa oral",
        minutes: 60,
        body: "Pitch de 10 minutos: problema → diseño → evidencia → riesgos (Eval final).",
      },
    ],
    readings: [
      "Huyen (2022) — capítulos de design / production",
      "Design docs internos del Magíster (plantilla del curso)",
    ],
  },
];

const units11: UnitContent[] = [
  {
    courseSlug: "11-aiops-cloud",
    unitId: "u01",
    learningOutcomes: [
      "Explicar la brecha entre experimento y servicio reproducible.",
      "Definir artefactos versionados (código, datos, modelo, config).",
      "Montar un entorno local reproducible para un servicio mínimo.",
    ],
    blocks: [
      {
        title: "De notebook a servicio",
        minutes: 60,
        body: "Qué se pierde al pasar de exploración a producción: seeds, dependencias, datos y configuración.",
      },
      {
        title: "Artefactos y linaje",
        minutes: 60,
        body: "Versionado de código, datos, pesos y config. Identificadores de corrida y reproducibilidad.",
      },
      {
        title: "Entorno local",
        minutes: 60,
        body: "Contenedor mínimo o entorno fijado. Variables de entorno. Separación de secretos.",
      },
      {
        title: "Taller operativo",
        minutes: 60,
        body: "Empaquetar un endpoint de inferencia local (puede apuntar a LM Studio) con healthcheck y versión declarada.",
      },
    ],
    readings: [
      "Kreuzberger et al. (2023), MLOps overview",
      "Breck et al. (2017), ML test score",
    ],
    lab: {
      title: "Lab — healthcheck local",
      body: "Levantá un wrapper HTTP mínimo que llame a LM Studio (/v1/models + /v1/chat/completions) y exponga /health con modelo y latencia.",
    },
  },
  {
    courseSlug: "11-aiops-cloud",
    unitId: "u02",
    learningOutcomes: [
      "Empaquetar un servicio de inferencia reproducible.",
      "Definir pipeline CI mínimo (build, test, smoke).",
      "Separar secretos de configuración por ambiente.",
    ],
    blocks: [
      {
        title: "Contenedores como artefacto",
        minutes: 60,
        body: "Imagen con deps fijadas, healthcheck y etiquetas (git sha + semver).",
      },
      {
        title: "CI y gates",
        minutes: 60,
        body: "Lint/unit, smoke /health, regresión de contrato OpenAI-compatible.",
      },
      {
        title: "Config por ambiente",
        minutes: 60,
        body: "BASE_URL por env, secretos fuera de git, rollback de imagen.",
      },
      {
        title: "Taller de smoke",
        minutes: 60,
        body: "Reusar labs/11/u01/health_wrapper.py como gate local o de CI.",
      },
    ],
    readings: [
      "Kreuzberger et al. (2023)",
      "Beyer et al. (2016), SRE — capítulos de release engineering (complementaria)",
    ],
    lab: {
      title: "Lab — smoke CI local",
      body: "Correr health_wrapper.py; fallar si status≠ok o chat>umbral (p.ej. 5s).",
    },
  },
  {
    courseSlug: "11-aiops-cloud",
    unitId: "u03",
    learningOutcomes: [
      "Seleccionar patrón de servicio según NFR.",
      "Configurar autoscaling y mitigar cold start.",
      "Implementar despliegue progresivo con rollback automático.",
    ],
    blocks: [
      {
        title: "Patrones de servicio",
        minutes: 60,
        body: "Batch, online, stream, edge; dimensionamiento, batching y cold start.",
      },
      {
        title: "Estrategias de despliegue",
        minutes: 60,
        body: "Sombra, canaria, azul-verde; criterios de promoción y reversión.",
      },
      {
        title: "Orquestación",
        minutes: 60,
        body: "Pipelines multi-paso, reintentos y conceptos de orquestación de contenedores.",
      },
      {
        title: "Laboratorio de serving",
        minutes: 60,
        body: "Despliegue con autoscaling + canaria; contingencia Docker + LM Studio (labs/11/u01).",
      },
    ],
    readings: [
      "Huyen (2022), caps. 7 y 9",
      "Burns et al. (2022) — complementaria",
    ],
    lab: {
      title: "Lab — contenedor del healthcheck",
      body: "docker build -t mia-health labs/11/u01 && docker run --rm mia-health (LM Studio en el host).",
    },
  },
  {
    courseSlug: "11-aiops-cloud",
    unitId: "u04",
    learningOutcomes: [
      "Instrumentar observabilidad de servicio y de modelo.",
      "Aplicar pruebas de deriva con control de falsas alarmas.",
      "Definir SLOs, alertas y procedimientos de respuesta.",
    ],
    blocks: [
      {
        title: "Dos capas de observabilidad",
        minutes: 60,
        body: "Servicio vs modelo; falla silenciosa; muestreo de predicciones.",
      },
      {
        title: "Deriva",
        minutes: 60,
        body: "Tipología, pruebas, ventana/frecuencia y falsas alarmas.",
      },
      {
        title: "Etiqueta tardía o ausente",
        minutes: 60,
        body: "Proxies, muestreo manual y monitoreo por subgrupo.",
      },
      {
        title: "SLOs y runbooks",
        minutes: 60,
        body: "Presupuestos de error, alertas accionables y manual de operación (Eval 2).",
      },
    ],
    readings: [
      "Gama et al. (2014)",
      "Beyer et al. (2016), caps. 4 y 6",
    ],
  },
  {
    courseSlug: "11-aiops-cloud",
    unitId: "u05",
    learningOutcomes: [
      "Comparar managed vs self-host con criterios NFR explícitos.",
      "Diseñar una capa de abstracción mínima sobre el proveedor.",
      "Estimar lock-in y un plan de salida.",
    ],
    blocks: [
      {
        title: "Mapa de plataformas",
        minutes: 60,
        body: "Notebooks, training, serving, observabilidad y secretos gestionados.",
      },
      {
        title: "Make vs buy",
        minutes: 60,
        body: "Costo total, residencia de datos, velocidad del equipo y control.",
      },
      {
        title: "Contratos portables",
        minutes: 60,
        body: "OpenAI-compatible / OpenAPI, imágenes versionadas y config por ambiente.",
      },
      {
        title: "Taller de justificación",
        minutes: 60,
        body: "Caso con PII: tabla managed vs local+CI vs híbrido y plan de salida 90 días.",
      },
    ],
    readings: [
      "Kreuzberger et al. (2023)",
      "Documentación de programas académicos cloud (verificar al dictado)",
    ],
  },
  {
    courseSlug: "11-aiops-cloud",
    unitId: "u06",
    learningOutcomes: [
      "Definir presupuesto de tokens/costo y alertas accionables.",
      "Montar evaluación continua de salidas generativas.",
      "Operar incidentes de calidad con degradación controlada.",
    ],
    blocks: [
      {
        title: "Economía del token",
        minutes: 60,
        body: "In/out, caché, reintentos, presupuesto diario y kill-switch.",
      },
      {
        title: "Calidad continua",
        minutes: 60,
        body: "Golden set, muestreo de tráfico, abstención y deriva de prompts.",
      },
      {
        title: "Guardrails",
        minutes: 60,
        body: "Validación de salida, límites de herramienta y human-in-the-loop.",
      },
      {
        title: "Runbook GenAI",
        minutes: 60,
        body: "Síntomas de costo/calidad, pin de prompt/modelo, canaria atrás y postmortem.",
      },
    ],
    readings: [
      "Huyen (2022), caps. de serving y monitoreo",
      "Material del curso 09 (evaluación agéntica) — puente",
    ],
  },
];

const byKey = new Map(
  [...units09, ...units08, ...units10, ...units11].map(
    (u) => [`${u.courseSlug}/${u.unitId}`, u] as const,
  ),
);

export function getUnitContent(courseSlug: string, unitId: string) {
  return byKey.get(`${courseSlug}/${unitId}`);
}
