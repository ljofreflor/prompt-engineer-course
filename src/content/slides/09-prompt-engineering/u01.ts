import type { Slide } from "../../../lib/slides";

/** Clase Reveal — Curso 09 Unidad 1 (enriquecida). */
export const slides: Slide[] = [
  {
    type: "title",
    kicker: "Curso 09 · Unidad 1",
    title: "Instrucción como especificación",
    subtitle: "4 hrs · Prompt Engineering y Sistemas Multiagentes — UAI",
  },
  {
    type: "bullets",
    kicker: "Tesis de la sesión",
    title: "Escribir un prompt es especificar",
    items: [
      "El lenguaje natural no tiene semántica precisa.",
      "El destinatario no es determinista.",
      "No hay compilador que rechace una especificación mal formada.",
      "La disciplina viene del método, no de la herramienta.",
    ],
  },
  {
    type: "bullets",
    kicker: "Al finalizar",
    title: "Resultados de aprendizaje",
    items: [
      "Estructurar rol, contexto, tarea, restricciones y formato.",
      "Seleccionar y ordenar ejemplos few-shot con criterio.",
      "Especificar salida estructurada validable.",
      "Diseñar vía de abstención explícita.",
      "Detectar errores característicos de especificación.",
    ],
  },
  {
    type: "section",
    title: "Bloque 1",
    subtitle: "60 min — Componentes",
  },
  {
    type: "bullets",
    kicker: "Componentes",
    title: "Anatomía de un prompt",
    items: [
      "Rol — quién es el modelo para esta tarea.",
      "Contexto — qué necesita saber (mínimo útil).",
      "Tarea — qué debe producir.",
      "Restricciones — qué no debe hacer / límites.",
      "Formato — cómo se entrega la respuesta.",
      "Ejemplos — few-shot cuando aportan señal.",
    ],
  },
  {
    type: "viz",
    kicker: "Ilustración",
    title: "Seis capas de la especificación",
    viz: "prompt-anatomy",
    caption: "La tarea es el núcleo; el resto acota semántica, riesgo y parseo.",
  },
  {
    type: "bullets",
    kicker: "Errores frecuentes",
    title: "Qué suele romper la especificación",
    items: [
      "Instrucciones contradictorias.",
      "Solo restricciones negativas (“no hagas X”).",
      "Sobrecarga de contexto irrelevante.",
      "Formato pedido pero sin vía de fallo.",
    ],
  },
  {
    type: "section",
    title: "Bloque 2",
    subtitle: "60 min — Few-shot",
  },
  {
    type: "bullets",
    kicker: "Teoría",
    title: "Few-shot como aprendizaje en contexto",
    items: [
      "Brown et al. (2020): el LM grande puede “aprender” la tarea desde ejemplos en el prompt (§§1–3).",
      "Schulhoff et al. (2024), Prompt Report §§1–2.2: taxonomía de componentes y evidencia de qué ayuda (y qué no).",
      "Orden, formato y cobertura de casos límite suelen pesar más que “más ejemplos”.",
    ],
  },
  {
    type: "bullets",
    kicker: "Evidencia",
    title: "Aprendizaje en contexto",
    items: [
      "Cero / uno / pocos ejemplos: no siempre “más es mejor”.",
      "Distribución y formato de los ejemplos suelen importar más que la corrección puntual.",
      "El orden de los ejemplos puede sesgar la salida.",
      "Elegir ejemplos que cubran casos límite, no solo el caso feliz.",
    ],
  },
  {
    type: "section",
    title: "Bloque 3",
    subtitle: "60 min — Salida estructurada",
  },
  {
    type: "bullets",
    kicker: "Producción",
    title: "Formato validable",
    items: [
      "JSON / schema explícito.",
      "Validación + reintento acotado.",
      "Comportamiento ante entradas fuera de alcance.",
      "Abstención como salida legítima → menos invención.",
    ],
  },
  {
    type: "prose",
    kicker: "Demo viva",
    title: "Misma tarea, dos especificaciones",
    paragraphs: [
      "Mostrar un prompt vago vs uno con schema + abstención. Medir tasa de parseo OK en 10 entradas (incluidas OOD).",
      "Lab: labs/09/u01/run_structured.py contra LM Studio (google/gemma-4-e4b · localhost:1234).",
    ],
  },
  {
    type: "image",
    kicker: "Evidencia local",
    title: "Corrida real · score 4/4",
    src: "labs/screenshots/lab-u01-lmstudio-result.png",
    alt: "Salida del lab u01 contra LM Studio: cuatro casos PASS",
    caption: "Incluye abstención OOD y mensaje vacío · labs/09/runs/",
  },
  {
    type: "section",
    title: "Bloque 4",
    subtitle: "60 min — Taller",
  },
  {
    type: "bullets",
    kicker: "Taller",
    title: "Construir y probar",
    items: [
      "Prompt con formato estricto para una tarea acordada.",
      "≥ 8 casos de prueba, incluidos fuera de alcance.",
      "Registrar modelo, temperatura y tasa de éxito.",
      "No alcanza con “se ve bien” en dos corridas.",
    ],
  },
  {
    type: "bullets",
    kicker: "Lecturas",
    title: "Para profundizar",
    items: [
      "Schulhoff et al. (2024), The Prompt Report — schulhoff2024prompt (§§1 y 2.2)",
      "Brown et al. (2020), Language models are few-shot learners — brown2020fewshot (§§1–3)",
    ],
  },
  {
    type: "title",
    kicker: "Cierre",
    title: "Preguntas",
    subtitle: "Siguiente: el prompt como artefacto versionado (Unidad 2)",
  },
];
