# Rúbrica del programa (eval-first)

Método transversal 08→11. Detalle y scripts de regresión del curso 09: [`labs/09/RUBRIC.md`](09/RUBRIC.md).

| Dimensión | Pregunta | Señal |
|-----------|----------|--------|
| **Formato** | ¿Parsea al schema / contrato pedido? | JSON/schema válido; health con `version` |
| **Calidad** | ¿Cumple la tarea / etiqueta? | Match a golden / expect_* / SLO de producto |
| **Seguridad** | ¿Abstiene o degrada fuera de política? | OOD, PII, off-policy → abstener / HITL |
| **Costo** | ¿Presupuesto razonable? | Tokens, latencia, $; kill-switch si aplica |

## Por curso

| Curso | Artefacto medible | Dónde |
|------:|-------------------|-------|
| 08 | Comparación abierto/cerrado + supuestos de costo | `labs/08/` · sección make/buy del design doc |
| 09 | Prompt versionado + golden + report JSON | `make lab-09-u0N` → `labs/09/runs/` |
| 10 | Claims con métrica/umbral en DESIGN.md | `labs/capstone/DESIGN.md` · fichas u01/u03 |
| 11 | Health/smoke + runbook (síntoma → rollback) | `labs/11/u01` · entregable u06 |

## Regla

Cambiar prompt, modelo o umbral ⇒ re-correr y guardar evidencia. Intuición no cierra el lab.
