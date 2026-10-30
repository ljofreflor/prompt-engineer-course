## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Site `base` is `/prompt-engineer-course/` (GitHub Pages). Always resolve public URLs with `asset()` from `src/lib/base.ts` — never hardcode root-relative paths that ignore the base.

Do not commit secrets, MCP dumps, one-shot probes, or loop scratch: keep them under `tmp/` (gitignored). Teacher gate credentials live only in env / local notes, not in the repo.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Brand UAI (sitio + clase)

Source of truth: `src/styles/uai-tokens.css` (from uai.cl Magíster IA).

- **UI never names Reveal.js** — alumno/profesor see “Clase” / “Abrir clase”. Reveal is an implementation detail (dev docs / `AGENTS.md` only).

- Negro navbar `#15171a`, primary `#00AFD8`, soft bg `#f3f5f7`, gray `#616365`
- Fonts: **UAI Corporativo** 300 (h1) / 800 (h2); body **Roboto**
- Labels like site `h4.label-uai`: primary, Roboto 800, no ALL CAPS
- Brand must read in the first viewport without depending on chrome alone (logo in black top bar, same as `Header.astro`)
- Avoid “tech dark” decks, purple glow, left accent rails, and floating badge clutter — they read as generic product UI, not UAI
- **Diseño sigue a la función:** las clases deben destacarse por atractivo visual **sin exagerar**. Tipografía, espacio, un diagrama claro y motion sobrio > ornamentación. Si un elemento no enseña o no jerarquiza, no va. Nada de partículas, glow, confetti ni “wow” vacío

Reveal theme: `public/styles/reveal-uai.css` (keep in sync with `src/styles/reveal-uai.css`). Class page: `src/pages/cursos/[slug]/[unit]/clase/index.astro`.

### Reveal lessons learned

- Astro strips/bundling can drop plain `<script src>` for Reveal UMD — load with `<script is:inline src=…>` and call `Reveal.initialize()` after `load`
- We ship `reveal.css` **without** a stock Reveal theme — set `.reveal { font-size: var(--r-main-font-size); }` **and** explicit `font-size` on `h1`/`h2`/`h3`. Variables alone do nothing; without `.reveal` font-size, `em` on headings collapses to the 16px root
- LM Studio / Gemma reasoning: prefer `message.content`, fall back to `reasoning_content` (see `labs/09/common.py` and `labs/smoke_local.py`). Smoke may need `max_tokens` ≥ 64 and should not print raw CoT when a terminal `OK` is present
- Do **not** put chrome inside scaled `.slides section` (`position:absolute; bottom:0` sits mid-slide). Use **fixed** viewport topbar/footer outside Reveal
- Footer unit line uses `.slide-chrome__meta--unit` with ellipsis (`min-width:0; text-overflow:ellipsis`); org label is `--org` + `flex-shrink:0` — long `unit.title` otherwise cuts mid-word
- Section slides: kicker = `Bloque N · tiempo`; hero h2 = topic name — never make “Bloque N” the visual hero
- Do **not** repeat the section subtitle as muted text under the hero (it duplicates kicker time + topic)
- Title/section slides: flex-center content in the safe area between fixed topbar and footer; avoid “stuck in the corner” emptiness
- Reveal sets `display:block` on `section` — use `display: flex !important` on `.slide-title` / `.slide-section` or centering will silently no-op
- Title slides: left-aligned composition (label → cyan rule → Corporativo 300 title → muted subtitle), not centered void
- After visual changes: screenshot title + section + bullets locally; then verify live Pages once deploy lands (CDP/`getComputedStyle` on `h1` ≈ 80px and `.slide-topbar` present)
- `devToolbar.enabled: false` in `astro.config.mjs` — keeps clase screenshots clean; re-enable temporarily if debugging Astro islands
- Prose paragraphs that start with `Lab:` render as `.uai-lab` (mono + soft strip); keep lab paths in that form in slide copy
- Never use a filesystem path as the slide `title` / h2 — human title in Corporativo; path only in a `Lab:` prose line
- Critique log (scratch): `tmp/reveal-uai-critique.md` — promote durable lessons into **this file**
- Keep Reveal overrides registered in `src/content/slides/index.ts` whenever adding `uNN.ts` decks; pair with `src/content/units` blocks when the unit page should show full syllabus copy
- Content `h2` needs a wider measure (~32ch) than section heroes (~16ch); long Spanish titles otherwise wrap mid-phrase and look broken
- Curso 08–11 Reveal overrides are complete (`08` through `u07`; `09`–`11` through `u06`) — rotate critique; prefer visual polish + labs over new skeleton decks
- Title slides: prefer ≤2 lines for h1; portada uses `2.1em` / `22ch` — if CDP still reports ~3 lines, shorten the slide `title` further (full name stays on the unit page / footer meta)
- Reveal arrow controls stay low-opacity until hover so they don’t fight the UAI chrome in projection
- **Clase = atractivo funcional, no tip deck ni showreel:** cada unidad debe tener **más** slides `type: "viz"` (objetivo: ≥1 diagrama conceptual fuerte por bloque de 60 min cuando el tema lo admite). Motion dirigido (beats, hold, revelación) solo para aclarar el concepto; si distrae, recortar. D3 = geometría/datos; GSAP = timing. Barra: legible en proyección de magíster, no slideware SaaS ni motion-design reel
- **D3 siempre en marcha:** ejemplificar conceptos con animaciones D3 (+ GSAP sobrio) es trabajo **continuo**, no un sprint puntual. Prioridad permanente del loop: unidad con 1 viz / 4 bloques → añadir el siguiente diagrama que enseña; no sustituir con más bullets. Si el bloque es teoría abstracta (pipeline, sesgo, tope, trade-off), **primero** dibujar; el texto acompaña
- D3 illustrations: `type: "viz"` + `viz` id from `VizId` in `src/lib/slides.ts`; registry in `public/scripts/reveal-viz.js` (vendor `public/vendor/d3/d3.min.js`). Colors from UAI tokens only. Remount on `slidechanged` so animations replay when revisiting. One idea per viz — sparse, large type, readable from the back row
- Viz contrast: avoid white fills on `#f3f5f7`; use soft fills / negro / primary on white `.uai-viz` canvas. No unicode-subscript-only labels (use `x_t`)
- Available viz ids: `react-loop`, `prompt-anatomy`, `prompt-sensitivity`, `cot-verify`, `injection-surface`, `automation-levels`, `abstain-escalate`, `lost-middle`, `sft-align`, `lora-adapters`, `openness-axes`, `quant-ladder`, `context-stack`, `judge-bias`, `self-consistency`, `agent-budget`, `multimodal-surface`, `regression-suite`, `prediction-policy`, `inference-regimes`, `data-cascades`, `design-doc-spine`, `repro-bundle`, `container-artifact`, `concept-drift`, `portability-edge`, `decode-controls`, `align-tax`, `autoregressive`, `eval-levels`, `notebook-to-service`, `multiagent`, `claim-evidence`, `make-buy`, `guardrails`, `reliability-product`, `decision-chain`, `rag-pipeline`, `train-serve-skew`, `ci-pipeline`, `canary-deploy`, `obs-layers`, `posttrain-pipeline`, `adapt-routes`, `cost-crossover`, `latency-ttft-tpot`, `eval-domain`, `risk-layers` — **expand the registry** when adding concepts; do not leave theory-only blocks without a visual
- Thesis slides: keep stack/tool paths out of the hero bullets — put Colab/HF/LM in `Lab:` prose or práctica; otherwise the portada reads like a tooling dump
- Slide bullets stay human prose — no bare repo paths or hash URLs as list items (put links in `Lab:` prose or unit pages)
- D3 / GSAP motion must respect `prefers-reduced-motion: reduce` (`tDelay`/`tDur` → 0; kill timelines)
- Clase page loads `reveal-uai.css` and `reveal-viz.js` with `?v=<sha1-8>` from file contents so Pages/CDN do not keep stale theme or D3 registry after deploy

### Motion stack — D3 + GSAP (sobrio)

Deck transition stays `fade` (institutional). **Motion lives inside viz**, not in Reveal transitions. Prefer fewer, clearer beats over longer timelines.

| Role | Library | Why |
|------|---------|-----|
| Geometry / data → SVG | **D3** (already) | Scales, joins, paths, force; source of truth for diagrams |
| Timeline / choreography | **GSAP** (add) | Cinematic beats, stagger, scrub-free timelines that D3 transitions alone do poorly; pairs with SVG nodes D3 creates |
| Path morph between states | **flubber** or GSAP MorphSVG | “Before → after” architecture morphs (RAG stages, train/serve) without redrawing from scratch |
| Authored hero moments (optional) | **lottie-web** / DotLottie | 1–2 signature loops designed in AE/Rive when code-drawn SVG is too costly — still UAI colors only |
| Avoid for clase projection | Three.js / particles / WebGL glow | Hard to read in bright rooms; fights UAI light institutional look unless a rare 3D-teaching exception |

Default path: **D3 draws → GSAP timelines the enter/exit**. Do not add libraries that pull purple/dark “AI product” aesthetics. Vendor under `public/vendor/` like D3; initialize after `load` with `is:inline`.

**Wired today:** `public/vendor/gsap/gsap.min.js` loaded on clase pages before `reveal-viz.js`. Every viz gets a GSAP staggered opacity enter via `enhanceCine()` after mount (interrupts D3 transitions). Bespoke timelines set `data-cine="manual"` on the host (see `react-loop` / `cineManual()`).

## Content model

- Course meta: `src/data/courses.ts` · programs/syllabi: `src/data/programs.ts` · stack: `src/data/stack.ts` · **mapa del sitio:** `src/data/sitemap.ts` → `/mapa/` (nav primary/secondary; no hardcodear rutas en Header)
- Unit copy: `src/content/units/` · Reveal overrides: `src/content/slides/<course>/<unit>.ts`
- Labs under `labs/`; LM Studio default `http://localhost:1234` (OpenAI-compatible). Prefer `content` then fall back to `reasoning_content` for models that only emit reasoning
- **Labs 1 comando:** `Makefile` en la raíz (`make smoke`, `make lab-09-u02`, `make labs-09`). Documentar nuevos labs ahí y en `/herramientas`
- **Eval-first (programa):** rúbrica transversal en `labs/RUBRIC.md` (08–11); detalle 09 en `labs/09/RUBRIC.md` (formato · calidad · seguridad · costo); golden sets en el repo; scripts de regresión escriben JSON en `labs/09/runs/`. Extender el mismo patrón a 08/10/11 cuando toque el lab
- **Casos Chile / LATAM:** preferir escenarios locales (SII, ClaveÚnica, minería, banca, sector público, PII) en golden sets y talleres — misma teoría OA; no inventar papers “locales”
- **Capstone:** scaffold en `labs/capstone/` (README + `DESIGN.md`); enlazar desde 10/u06 y cierres 08/11; cohorte versiona su copia, no el scaffold vacío
- **Changelog:** `/cambios/` ← `src/data/changelog.ts`; al cerrar un hito de market/compliance, añadir 1 ítem (fecha + tags); no inventar
- **Competencias:** `/competencias/` ← `src/data/competencies.ts` (literacidad → aplicado → artefacto); alinear labs/capstone con las celdas “certificado”
- **Señal externa:** `/senal/` ← `src/data/external-signal.ts` (cupos de invitado + defensa); solo publicar nombres/fechas confirmadas por el Magíster
- Screenshots/evidence: `public/labs/screenshots/` and `public/labs/runs/` when attaching to slides or `/herramientas`
- **Teoría en clase:** cada deck Reveal debe enseñar conceptos con base bibliográfica, no solo tips. Citar autores/año (y § si aplica) en bullets o slides `Lecturas`. Fuente de verdad: `references/bibliography.bib` + `units.readings`. Si falta un paper OA, descargarlo a `references/papers/<key>/` vía skill `papers-download-mathpix` (solo OA; no versionar PDFs). No inventar citas.
- **Definiciones (es un curso):** todo concepto que se introduce en clase lleva **definición explícita** (1–2 líneas) antes de tips, labs o viz. Formas válidas: kicker `Definición` / `Definiciones` / `Concepto` / `Glosario`, o bullets `Término — definición…` / `X es un/una…`. No asumir léxico previo; no dejar solo jerga + paper. Chequeo auto: `definitions_present` (L2).

## Program compliance (coverage × quality)

Fuente de verdad del **qué** debe existir: syllabi en `src/data/programs/<slug>.json` (`unidades[]`). El **cómo de calidad** se mide por niveles por unidad — no basta “hay deck”.

### Levels (per unit)

| Level | Name | Meaning |
|------:|------|---------|
| L0 | absent / partial | Missing deck override or file, or only placeholder |
| L1 | skeleton | Deck registered + unit page with ≥3 blocks and learning outcomes |
| L2 | theory | L1 + `Teoría`/`Lecturas` + **definiciones** + **outcomes en deck** + **actividad formativa** (Lab/Taller/Eval); claims cited; bib keys resolve |
| L3 | practice | L2 + valid `viz` ids (if any) + lab present when `lab:` is declared on the unit (or `Lab:` path in deck) |
| L4 | polish | Manual: UAI brand critique (portada ≤2 lines, chrome, tokens, viz contrast) — not auto-scored |

Target for shippable class material: **≥ L2 for every unit**; prefer **L3** where the syllabus expects taller/lab. L4 is the brand loop, not a bib check.

### Automated check

```bash
python3 scripts/compliance_check.py          # writes tmp/compliance.md
python3 scripts/compliance_check.py --strict # exit 1 if any unit < L2
```

Checks (auto): `deck_registered`, `deck_file`, `unit_page`, `outcomes`, `blocks`, `readings_listed`, `teoria_slide`, `lecturas_slide`, `definitions_present`, `outcomes_slide`, `formative_activity`, `citations_present`, `bib_keys_resolve`, `viz_valid`, `lab_ok`.

`definitions_present` (L2): kicker `Definición(es)` / `Concepto(s)` / `Glosario` / `Léxico`, **o** ≥3 bullets `Término — definición` / ≥2 `X es un/una…` en el deck.

`outcomes_slide` + `formative_activity` (L2, pedagogía): slide “Al finalizar” / Resultados **y** señal Lab:/Taller/Eval/Entregable (alineación constructiva).

**Peor caso primero (regla permanente):** cada tick mejora el peor eslabón, no el más fácil ni el más reciente. Orden: (1) menor L / más ✗ en compliance → (2) peor densidad viz (1 viz / muchos bloques) → (3) mayor severidad en crítica pedagógica/brand → (4) market backlog más atrasado. Dentro del mismo nivel, curso 08→11. No inventar readings para “pasar” L2 — solo OA / licensed; books (Huyen, etc.) pueden citarse sin PDF local. Al subir L2: **definiciones** y **señales pedagógicas** antes que más tips.

### Pedagogy editor agent

Rol: criticar curso y forma de presentar vs objetivos de aprendizaje; actualizar compliance cuando un criterio sea durable.

- Rule Cursor: `.cursor/rules/pedagogy-editor.mdc` (globs slides/units/labs)
- Tendencias vivas: `references/pedagogy_trends.md` (two-lane, constructive alignment, AI literacy/readiness, process+product) — **no inventar** fuentes
- Cada tick: además de L4 brand, **una** crítica de editor en la unidad **peor** (menor L / más gaps pedagógicos; empate → 08→11); aplicar el fix de mayor severidad; si durable → bullet aquí + check en `compliance_check.py` + nota en `pedagogy_trends.md`
- Log scratch: `tmp/pedagogy-critique.md` (gitignored)

### Manual L4 (brand) — still required in the loop

Screenshot title + section + content; verify Corporativo/Roboto, `.slide-topbar`, no purple/tech-dark. Log in `tmp/reveal-uai-critique.md`; promote durable rules here.

## Market differentiation (avance gradual)

Objetivo: magíster que forme gente que **lleva GenAI a producción con criterio** (no short-course de tips). Competencia: DL.AI (labs cortos), HF (open models), Stanford CS329Z / Anthropic (agentes + context engineering), bootcamps con capstone. Demanda LATAM: AI fluency × rediseño de procesos + gobernanza (McKinsey / avisos Chile).

Cada tick del loop, **además** de compliance/L4, avanzar **un** ítem pequeño de esta lista (rotar; no intentar todo de golpe). Marcar progreso en `tmp/market-backlog.md` (gitignored); promover a durable aquí solo cuando el patrón ya está en el repo.

| # | Tema | Qué hacer poco a poco | Dónde toca |
|--:|------|----------------------|------------|
| 1 | Capstone transversal 08→11 | Un deliverable de cohorte: problema real → design doc (10) + RAG/agente (09) + make/buy·costo (08) + deploy/obs (11); rúbrica + demo/portfolio. Scaffold: `labs/capstone/` (`README.md` + `DESIGN.md`) | `labs/capstone/`, 10/u06, cierres de curso |
| 2 | Context engineering | Prompt ⊂ contexto (tools, memoria, retrieval, historial, MCP). Renombrar/anclar hilo en 09 sin tirar u01–u02; ≥1 viz nuevo cuando el concepto lo pida | decks 09, `reveal-viz.js`, copy tesis |
| 3 | Eval-first | Cada lab: golden set chico + rúbrica (calidad / formato / seguridad / costo) + regresión al cambiar modelo/prompt. Método del programa, no solo 09/u02·u06 | `labs/**`, slides evaluación, `/herramientas` |
| 4 | Labs cero fricción | `make smoke` / `make lab-09-u0N` / `make labs-09` (Makefile raíz); evidencia en `/herramientas` y `labs/09/runs/` | `Makefile`, `labs/`, `/herramientas` |
| 5 | Casos Chile / LATAM | Misma teoría OA; escenarios minería, retail, banca, sector público, español/legal, datos sensibles — valor = rediseño de flujo, no la tool | decks `Teoría`/`Taller`, labs |
| 6 | Competency matrix | Literacidad → aplicado → certificado por artefacto. Página `/competencias/` ← `src/data/competencies.ts` | `src/data/competencies.ts`, `src/pages/competencias/` |
| 7 | Changelog trimestral | Página `/cambios/` (“Qué cambió”); editar `src/data/changelog.ts` cada trimestre (modelos, MCP, labs, papers). No inventar entradas | `src/data/changelog.ts`, `src/pages/cambios/` |
| 8 | Atractivo = claridad (D3 continuo) | Viz animado que enseña en ~30 s; 1 idea; motion sobrio. **Cada tick:** al menos un avance de densidad/registry D3 si hay bloque sin ilustrar (08→11, peor primero) | `reveal-viz.js`, decks, L4 |
| 9 | Abierto ↔ cerrado | Criterio soberanía / costo / riesgo con evidencia (08/u03–u04); no “solo GPT” | decks 08, labs dual-stack |
| 10 | Señal externa | Invitados (1/curso), defensa pública del design doc, papers OA. Página `/senal/` ← `src/data/external-signal.ts` (sin nombres inventados) | `src/data/external-signal.ts`, `src/pages/senal/` |

Prioridad 90 días si hay que elegir: **1 → 3 → 2 → 5 → 7**. No inventar citas ni papers para “rellenar” casos LATAM.

**Transfer de referentes (issue #1):** corpus público/OA = capas congeladas; UAI solo ajusta la **última capa** (presentación Reveal, español, casos Chile, rúbricas). No scrape de pago; índice en `references/referents/`.

**Referentes internacionales (corte 2026-10):** tres capas — (M) MOOC fluency (Google Prompting Essentials, DL.AI Prompt Eng, Claude 101); (B*) MOOC build (DL.AI GenAI+LLMs, IBM GenAI Eng, HF Agents, LangChain shorts); (E) elite (Stanford CS329Z compound/agents/eval/MCP, Anthropic Academy context+evals). Propuesta Chile: no otro Coursera — magíster = rigor E + design doc + AIOps + casos LATAM + dual-stack. Gaps a cerrar vs E: eval-first en todos los labs, context engineering explícito (prompt ⊂ contexto), agente from-scratch + harness, defensa pública del design doc. No competir en capa M; distinguir Certificate Prompt UAI del curso 09.

**Competencia Chile/LATAM (corte 2026-10):** tres capas — (A) fluency/prompt corto (UC, Certificate UAI, verticales), (B) diplomado/bootcamp build (UC GAI, Desafío Latam, EdEx, UNLu), (C) magíster IA/TI amplio (MIA UC, UDP). Casi nadie vende GenAI→eval→design doc→AIOps como hilo; no competir en capa A; vs B el peor gap es evidencia de producción + casos Chile, no más tips. Distinguir messaging del Certificate Prompt UAI del curso 09 del magíster.

## Continuous improvement (coursebuild loop)

**Tendencia = mejorar el peor de los casos.** No pulir lo que ya está bien si hay unidades en L0–L1, bloques sin viz, o gaps formativos. El tick elige el peor gap y lo sube un escalón.

Every loop tick should:

1. Run `python3 scripts/compliance_check.py` and note the worst units (lowest L / most ✗) — **work these first**
2. Screenshot + critique one Reveal clase vs UAI brand (L4); fix the highest-severity issue
3. **Pedagogy editor:** critique one unit vs learning outcomes + `references/pedagogy_trends.md` (rule `.cursor/rules/pedagogy-editor.mdc`); log `tmp/pedagogy-critique.md`; apply highest-severity fix; promote durable checks to compliance/`AGENTS.md`
4. **D3 exemplify (mandatory unless blocked):** add or upgrade ≥1 ilustración animada (`type: "viz"` + registry) en la unidad con peor densidad (1 viz / muchos bloques, orden 08→11). Concepto primero; no relleno ornamental
5. Advance the worst compliance gaps (raise units toward L2, then L3) **and** theory OA downloads when keys are missing
6. Advance **one** small slice of **Market differentiation** (table above); log in `tmp/market-backlog.md` — el slice #8 (D3) puede coincidir con el paso 4
7. **Update `AGENTS.md` when a learning is durable** (brand rule, Astro pitfall, LM quirk, compliance criterion, market pattern shipped) — short bullet under the right section; do not dump tick noise here
8. Build + push if there are repo changes; never version `tmp/` (incl. `tmp/compliance.md`, `tmp/market-backlog.md`, `tmp/pedagogy-critique.md`)
