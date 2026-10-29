# Design doc — Capstone Magíster IA UAI

> Plantilla. Completar y versionar. Cada claim de valor: métrica, línea base, umbral.

## 1. Contexto y decisión

- Organización / dominio (preferir Chile–LATAM):
- Problema de negocio / proceso a rediseñar:
- Decisión que este sistema habilita:
- Fuera de alcance:

## 2. Requisitos

### Funcionales

-

### NFR (medibles)

| NFR | Métrica | Línea base | Umbral | Cómo se mide |
|-----|---------|------------|--------|--------------|
| Latencia | p95 TTFT / TPOT | | | |
| Costo | $/tarea o tokens | | | |
| Calidad | pass rate set propio | | | |
| Seguridad | abstención PII / inyección | | | |

## 3. Arquitectura

- Diagrama (Mermaid u otro) prompt / RAG / agente / humano:
- Fronteras de confianza (qué decide el modelo vs la persona):
- Vía de adaptación (08): prompting · RAG · fine-tune — justificación:

## 4. Datos

- Fuentes, frescura, linaje:
- PII / retención / consentimiento:
- Train/serve skew (si aplica):

## 5. Evaluación (09 + 08)

- Golden set (ubicación en repo):
- Rúbrica (formato · calidad · seguridad · costo):
- Regresión al cambiar prompt/modelo:
- Juez LLM (si hay): mitigación de sesgos:

## 6. Aprovisionamiento (08)

- Abierto vs cerrado (ejes: pesos, código, datos, licencia):
- Punto de cruce de costo (volumen + idle):
- Plan de cambio de proveedor:

## 7. Operación (11)

- Empaquetado / endpoint:
- Observabilidad (logs, traces, evals en prod):
- Canary / kill-switch:
- Runbook (1 página):

## 8. Riesgos y mitigaciones

| Riesgo | Severidad | Mitigación | Dueño |
|--------|-----------|------------|-------|
| | | | |

## 9. Plan de defensa

- Pregunta abierta que querés que haga el tribunal:
- Lo que **no** mediste (riesgo explícito):
