---
name: course-practice-auditor
description: >-
  Audits Magíster IA GenAI material for practice/production relevance (eval-first,
  context eng, agents/harness, RAG ops, cost, Chile/LATAM, dual-stack, design docs,
  AIOps) via live web search of elite courses and industry — not program↔deck L0–L4
  compliance. Use when checking tip-theater vs practitioner needs, market gaps,
  “is this course actually practical?”, or refining market backlog ticks.
disable-model-invocation: true
---

# Course practice auditor (relevance ↔ production)

Verifies that the course **actually teaches practical, production-relevant things** — what practitioners need now (eval-first, context eng, agents/harness, RAG ops, cost, Chile/LATAM realities, dual-stack, design docs, AIOps), not syllabus checkbox fulfillment or tip-theater.

**Not this skill:** program ↔ Reveal coverage, L0–L4 levels, `compliance_check.py`. That is [course-compliance-auditor](../course-compliance-auditor/SKILL.md). If the user needs both, run them separately; do **not** re-run or replace compliance here — point them to the compliance auditor.

## When to run

- “Is the course practical / production-ready teaching?”
- Market differentiation / tip-theater smell / competitor gap review
- After a cohorte, before pitching vs DL.AI / HF / CS329Z / Anthropic
- Choosing the next market backlog slice with external evidence

Do **not** invent papers, guest names, or “local” citations. Do **not** commit `tmp/`. Do **not** push unless asked. Do **not** touch hero images/CSS or unrelated brand polish.

## Sources of truth (internal)

| Role | Path |
|------|------|
| Market backlog themes | `AGENTS.md` § Market differentiation (capstone → eval-first → context eng → Chile → …) |
| Referents corpus (frozen outlines) | `references/referents/` (`INDEX.md`, CS329Z, Anthropic, HF, DL.AI) |
| Decks / labs / capstone | `src/content/slides/`, `labs/`, `labs/capstone/`, `labs/RUBRIC.md` |
| Competencies / changelog / signal | `src/data/competencies.ts`, `changelog.ts`, `external-signal.ts` |
| Scratch report | `tmp/practice-audit.md` (gitignored) |

Courses: `08-genai-llms`, `09-prompt-engineering`, `10-diseno-sistemas-ia`, `11-aiops-cloud`.

## Workflow

Copy and track:

```
Practice Audit Progress:
- [ ] 1. Web search current GenAI engineering practice (cite sources)
- [ ] 2. Sample UAI decks/labs for practical signal
- [ ] 3. Gap report worst-first (market backlog axes)
- [ ] 4. Explicitly exclude compliance / L levels
- [ ] 5. Write tmp/practice-audit.md
- [ ] 6. Optionally suggest 1–3 next ticks (no invented papers)
```

### 1. Web search (mandatory)

Use **WebSearch** / **WebFetch** / **XSearch** (as available) for **2025–2026** GenAI engineering practice. Prefer primary pages over blogs that invent curricula.

Search themes (batch queries; cite URLs in the report):

| Theme | Look for |
|-------|----------|
| Elite courses | Stanford CS329Z, Anthropic Academy (agents / context / evals), HF Agents course, DL.AI GenAI+LLMs |
| Production RAG | eval harnesses, chunking/ops, citation/faithfulness, train-serve skew |
| Agents | tool use, harness, budgets, MCP, from-scratch vs framework |
| Context engineering | prompt ⊂ context (tools, memory, retrieval, history) |
| Eval-first | golden sets, rubrics, regression on model/prompt change |
| Cost / latency | TTFT/TPOT, dual-stack open↔closed, make/buy |
| Ops / AIOps | observability, canary, CI for prompts/models |
| LATAM / Chile | governance, PII, sector público / banca / minería realities (no fake papers) |

Also skim `references/referents/` for frozen outlines — **web results update the “now” bar**; referents are transfer corpus, not a substitute for search.

**Cite sources; don’t invent.** If a claim has no URL/page, drop it or mark as unverified hypothesis.

### 2. Sample practical signal in the repo

Scan (sample if full sweep is heavy; prefer worst market themes first):

| Signal | Strong | Weak / tip-theater |
|--------|--------|---------------------|
| Labs | Runnable path, `make lab-…`, golden set, rubric dimensions | “Discuss in pairs” only; Lab: path missing on disk |
| Eval-first | `labs/**/RUBRIC.md`, `runs/`, regression script | Quality = “sounds good” |
| Capstone / design doc | `labs/capstone/DESIGN.md` thread 08→11 | Isolated tip units |
| Context eng / agents | Explicit prompt⊂context; harness/budget | Prompt tips without tools/memory/MCP |
| Chile / LATAM | SII, ClaveÚnica, minería, banca, PII scenarios | Generic US SaaS only |
| Dual-stack | Open + closed criterion (cost/risk/sovereignty) | “Just use GPT” |
| AIOps | Deploy/obs/canary in 11 + ops language earlier | Build never ships |

Grep/read as needed: `Lab:`, `golden`, `rúbrica`/`rubric`, `DESIGN.md`, Chile tokens, `make lab`, MCP, eval harness.

### 3. Gap report (worst-first)

Align gaps to **AGENTS.md market backlog** priority (90 days: **1 → 3 → 2 → 5 → 7**, then rest):

1. Capstone transversal  
2. Eval-first  
3. Context engineering  
4. Labs cero fricción  
5. Casos Chile / LATAM  
6. Competency matrix  
7. Changelog  
8. D3 clarity (only if it blocks practice understanding — not brand polish)  
9. Abierto ↔ cerrado (dual-stack)  
10. Señal externa / AIOps evidence  

Severities: **blocker** (graduates cannot ship/eval) · **major** (weak vs elite practice) · **nit** (nice evidence).

### 4. Do not conflate with compliance

- Do **not** score L0–L4 or re-run `compliance_check.py` as the deliverable of this skill.
- Do **not** treat “deck has Teoría + Lecturas” as practical success.
- One line in the report: *Program↔deck coverage → `course-compliance-auditor`.*

### 5. Write `tmp/practice-audit.md`

```markdown
# Practice audit — YYYY-MM-DD

Scope: [all | course | theme]
Bar: web sources (list 3–8 URLs) + referents outlines

## External practice bar (cited)
- Theme — claim — source URL

## Practical signal in repo
| Area | Evidence | Strength |
|------|----------|----------|
| Eval-first | … | strong/weak/absent |

## Gaps — qué falta para ser realmente práctico
| Rank | Axis (market #) | Gap | Severity | Evidence (repo + external) |
|-----:|-----------------|-----|----------|----------------------------|
| 1 | 3 Eval-first | … | blocker | … |

## Not in scope
- L0–L4 / program↔deck → course-compliance-auditor

## Next ticks (optional, 1–3)
1. Concrete lab/viz/deck slice — path — no new invented papers
```

### 6. Optional next ticks

Suggest **1–3** concrete edits (lab golden set, deck thesis, capstone wire, Chile scenario). Prefer existing OA/bib keys and `references/referents/`. No invented papers.

## Anti-patterns

- Replacing or re-running the compliance auditor
- Scoring tip density or brand L4 as “practical”
- Inventing Chile papers or guest names for `/senal/`
- Versioning `tmp/practice-audit.md`
- Hero/CSS/image work unrelated to practice gaps

## Related

- `AGENTS.md` — Market differentiation + Continuous improvement (two auditors)
- `COMPLIANCE.md` — L levels only; this skill does **not** measure them
- `course-compliance-auditor` — program ↔ deck
- `references/referents/` — frozen elite outlines
