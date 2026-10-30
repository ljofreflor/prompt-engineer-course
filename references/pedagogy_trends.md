# Tendencias pedagógicas (GenAI / magíster) — fuente del agente editor

Documento vivo. Actualizar cuando el editor pedagógico valide una tendencia con fuente real.
**No inventar citas.** Libros/guías institucionales OK sin PDF local.

## Principios operativos (para compliance + decks)

1. **Alineación constructiva / backward design** — outcomes → actividades → evidencia de logro.
2. **Definir antes de aplicar** — léxico del curso explícito (compliance: `definitions_present`).
3. **Two-lane** — distinguir tareas donde el alumno debe demostrar competencia *sin* LLM vs tareas donde el outcome *es* usar el LLM con criterio (verificar, abstener, HITL).
4. **Readiness** — fundamentos (modelo, riesgo, evaluación) antes de agentes/RAG complejos; GenAI como andamiaje, no atajo.
5. **AI literacy** — capacidades, límites, inyección, costo; criticar salidas del modelo.
6. **Proceso + producto** — versionar prompts, golden sets, design docs, defensa; no solo demos.
7. **Carga cognitiva sobria** — 1 idea / viz; motion D3 que aclara, no ornamenta.
8. **Prelectura Reveal** — el deck enseña antes de la clase (tesis, definiciones, teoría, lecturas); la sesión viva demo/lab/feedback. Marco: `COMPLIANCE.md` §4.4. Métricas agregadas: §8.

## Fuentes (orientativas)

| Tema | Referencia |
|------|------------|
| Two-lane assessment | Liu & Bridgeman (2023); UvA TLC GenAI and assessment; Npuls (2025) |
| Constructive alignment + GenAI | Redesign teaching/learning/assessment (Educ. Sci. / HE reviews 2025–26); University of Luxembourg AI teaching guidelines (2026) |
| Learning outcomes + GenAI | Microsoft Research review: learning outcomes with GenAI (readiness, literacy, scaffold, engagement) |
| Digital education / AI literacy | OECD Digital Education Outlook insights (2025); EC–OECD AI literacy framing |
| Classic alignment | Biggs — constructive alignment (marco, no GenAI-specific) |

## Historial de actualizaciones

| Fecha | Cambio |
|-------|--------|
| 2026-10-30 | Bootstrap del archivo + cable del agente editor; checks `outcomes_slide` / `formative_activity` en compliance |
| 2026-10-30 | Prelectura Reveal durable (`COMPLIANCE.md` §4.4); soft checks `prelectura_thesis` / `title_no_path` |
| 2026-10-30 | Gobernanza anti-bloat `COMPLIANCE.md` §2 + métricas pedagógicas §8 (tasas en `compliance_check.py`) |
