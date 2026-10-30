# Capstone transversal (cursos 08 → 11)

Entregable único de cohorte: un problema real (empresa / sector público / dominio Chile–LATAM) llevado de modelo a producción con criterio. No es un demos sueltos por unidad: es **un sistema** documentado y defendible.

## Artefactos (mínimo)

| Curso | Aporte al capstone | Evidencia en el repo |
|------:|--------------------|----------------------|
| **08** | Make/buy, costo, soberanía, vía de adaptación (prompt / RAG / FT) | Sección en `DESIGN.md` + hoja de cruce o supuestos |
| **09** | Prompt/agente versionado + golden set + rúbrica ([`labs/RUBRIC.md`](../RUBRIC.md) / 09) | `prompts/`, `cases.yaml`, report JSON de regresión |
| **10** | Design doc completo + claims con métrica/umbral | Este `DESIGN.md` + [`labs/10/claims_eval.md`](../10/claims_eval.md) |
| **11** | Despliegue mínimo, obs, runbook / kill-switch | Sección operación + captura o run |

Copiá `DESIGN.md` a tu repo de proyecto (o carpeta de cohorte) y versioná cada iteración.

Eval-first del programa: [`labs/RUBRIC.md`](../RUBRIC.md) (formato · calidad · seguridad · costo).

Matriz del programa: sitio `/competencias/` (fuente `src/data/competencies.ts`).

## Rúbrica de defensa (oral ~10 min)

1. **Problema y decisión** — ¿qué cambia en el flujo de trabajo?
2. **Diseño** — fronteras, datos, humano-en-el-loop.
3. **Evidencia** — set propio / pass rate / costo; no leaderboard genérico.
4. **Riesgos** — PII, inyección, dependencia de proveedor, mitigaciones.
5. **Listo para construir** — siguiente paso operativo concreto.

## Dominio preferido

Casos Chile / LATAM (SII, ClaveÚnica, minería, banca, retail, sector público). Misma teoría OA del programa; no inventar papers “locales”.

## Señal externa

Defensa pública e invitados: sitio `/senal/` (`src/data/external-signal.ts`).
