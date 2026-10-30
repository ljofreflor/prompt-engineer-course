---
name: course-compliance-auditor
description: >-
  Audits Magíster IA Reveal decks against program/syllabus promises (outcomes,
  blocks, readings, labs) and compliance L0–L4. Use for giant sweeps, program vs
  presentation gaps, prelectura bar, worst-unit-first ticks, or when refining
  scripts/compliance_check.py / COMPLIANCE.md.
disable-model-invocation: true
---

# Course compliance auditor (program ↔ Reveal)

Verifies that **delivery** (Reveal clase decks) covers what the **program** promises. Presentations are **prelectura** (prep material), not tip decks.

Brand/Reveal chrome stays in `AGENTS.md`. Quality bar: `COMPLIANCE.md`. Pedagogy critique: `.cursor/rules/pedagogy-editor.mdc`.

## When to run

- Giant sweep (all 08–11 units) or one course/unit
- Coursebuild loop needs worst gaps before a tick
- Suspected drift: syllabus changed, deck polished without outcomes/lab
- Proposing a durable auto-check for `scripts/compliance_check.py`

Do **not** invent citations, papers, or syllabus outcomes. Do **not** commit `tmp/`. Do **not** push unless asked.

## Sources of truth

| Role | Path |
|------|------|
| **Promise** — syllabus units | `src/data/programs/<slug>.json` → `unidades[]` (`outcomes`, `session`, `readings`, `narrative`) |
| **Promise** — unit page | `src/content/units/index.ts` (`learningOutcomes`, `blocks`, `readings`, optional `lab`) |
| **Delivery** — deck | `src/content/slides/<course>/<uXX>.ts` registered in `src/content/slides/index.ts` |
| **Delivery** — clase route | `src/pages/cursos/[slug]/[unit]/clase/index.astro` |
| **Bar** | `COMPLIANCE.md` · auto: `scripts/compliance_check.py` |
| **Viz registry** | `public/scripts/reveal-viz.js` · lab disk: `labs/<NN>/<uXX>/` |

Courses: `08-genai-llms`, `09-prompt-engineering`, `10-diseno-sistemas-ia`, `11-aiops-cloud`.

## Workflow

Copy and track:

```
Audit Progress:
- [ ] 1. Load promise (program + unit page)
- [ ] 2. Load delivery (deck + registry)
- [ ] 3. Run compliance_check.py
- [ ] 4. Cross-check program↔deck (manual + soft)
- [ ] 5. Rank worst units; pick next-tick fix
- [ ] 6. Write tmp/compliance-audit.md
- [ ] 7. Optionally propose durable checker hooks
```

### 1. Load promise

For each target unit:

1. Read `src/data/programs/<slug>.json` unit: `title`, `outcomes`, `session` blocks, `readings`.
2. Read matching `units/index.ts` entry: `learningOutcomes`, `blocks`, `readings`, `lab?`.
3. Note conflicts (program outcome vs unit page wording) as **nit** unless a learning outcome is missing entirely → **major**.

### 2. Load delivery

1. Confirm override in `slides/index.ts` and file `slides/<course>/<uXX>.ts`.
2. Scan kickers/titles: `Tesis`, `Al finalizar`/`Resultados`, `Definición`/`Concepto`/`Glosario`, `Teoría`, `Lecturas`, Lab/Taller/Eval, `Lab:` prose, `viz:` ids.
3. Count viz vs ~60 min blocks (density). Validate viz ids against registry if touching L3.

### 3. Run automated check

```bash
python3 scripts/compliance_check.py           # → tmp/compliance.md
python3 scripts/compliance_check.py --strict  # exit 1 if any < L2
```

Interpret: **lowest L / most ✗ first**; tie → course 08→11. Soft checks (`prelectura_thesis`, `title_no_path`, `lab_declared_in_deck`, `outcomes_keyword_hit`, `viz_density_hint`) report gaps but do **not** gate L2/L3 yet — still list them in the audit. Cite **Pedagogy metrics** at end of `tmp/compliance.md` (`COMPLIANCE.md` §8) when ranking formative/prelectura/viz density.

### 4. Cross-check coverage (auditor judgment)

Map promise → deck. Severities: **blocker** (breaks L2 / missing promise) · **major** (weak learning) · **nit** (polish).

| Promise | Delivery signal | Notes |
|---------|-----------------|-------|
| Learning outcomes | Slide `Al finalizar` / Resultados; keywords overlap unit/program | Soft auto: `outcomes_keyword_hit`; deep alignment = manual |
| Theory | `Teoría` + citations | L2 auto |
| Definitions | Definición/Concepto/Glosario or def-bullets | L2; before tips/lab |
| Formative | Lab:/Taller/Eval/Entregable | L2; if `lab:` on unit → also `Lab:` / path (`lab_declared_in_deck`) |
| Readings | Unit `readings` + Lecturas slide; bib keys | L2 |
| Lab artifact | `labs/…` on disk when declared | L3 `lab_ok` |
| Viz density | ≥1 strong viz / ~60 min block when relational | Soft `viz_density_hint` + manual |
| Prelectura bar | Tesis early; human title; no path/tool dump on portada | Soft + `COMPLIANCE.md` §4.4 · rates §8 |

**Prelectura bar:** student can study the deck alone and leave with definitions + thesis + readings + what they will practice. Live session = demo, discussion, supervised lab — not the only theory channel. Anti tip-deck: no “10 magic prompts” instead of Teoría+Definiciones.

Skip brand L4 screenshots unless the user asked for a full sweep including polish; point to AGENTS Brand UAI.

### 5. Rank and next tick

1. Sort units by level ascending, then gap count, then course 08→11.
2. Recommend **one** next-tick fix (highest severity on the worst unit). Prefer: definitions / pedagogy signals → L2 gaps → lab/viz L3 → soft prelectura → brand.
3. Do not invent readings to “pass” L2.

### 6. Write the audit report

Prefer **`tmp/compliance-audit.md`** (gitignored). May extend narrative in `tmp/compliance.md` but keep machine table from the script intact if regenerating.

Use this template:

```markdown
# Compliance audit — YYYY-MM-DD

Scope: [all | course | unit]
Checker: scripts/compliance_check.py (avg L…; soft gaps…)

## Worst first
| Rank | Unit | L | Blockers / soft | Severity |
|-----:|------|--:|-----------------|----------|
| 1 | 08/u0N | 2 | definitions_present | blocker |

## Program ↔ presentation gaps
### 08/u0N — <title>
- Promise: <1–2 outcome bullets from program/unit>
- Delivery: <what deck has / lacks>
- Gaps: [blocker|major|nit] …
- Suggested next-tick fix: <one concrete edit path>

## Prelectura
- Units missing Tesis / path-on-title / tip-deck smell: …

## Checker proposals (optional)
- Stable pattern → propose id for COMPLIANCE.md §7 + soft/gate in compliance_check.py (respect §2 add⇒merge)
- Risky / semantic → document as manual only in COMPLIANCE.md
```

### 7. Durable checks (optional)

If the same gap appears on ≥3 units and regex/heuristic FP risk is low:

1. Add row to `COMPLIANCE.md` §7 (or promote soft→gate) **with §2 budget** (merge/retire elsewhere).
2. Implement conservatively in `scripts/compliance_check.py` (soft first).
3. Short pointer in AGENTS only if loop ops change.

If FP risk is high (semantic outcomes, two-lane, tip-deck smell): **manual in COMPLIANCE.md only**.

## Anti-patterns

- Treating “deck exists” as compliant without outcomes/definitions/formative
- Scoring tip density as quality
- Inventing bib keys or LATAM papers
- Versioning `tmp/compliance-audit.md` / `tmp/compliance.md`
- Reopening referents transfer (issue #1) unless audit needs a pointer to `references/referents/`
- Growing `COMPLIANCE.md` without merge/retire (§2)

## Related

- `COMPLIANCE.md` — levels, §2 governance, §4 dimensions, §8 pedagogy metrics
- `AGENTS.md` — loop; invoke this skill for giant sweep
- Pedagogy editor — deeper P1–P8 on the single worst unit after the audit ranks it
