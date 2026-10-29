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

## Brand UAI (sitio + Reveal)

Source of truth: `src/styles/uai-tokens.css` (from uai.cl Magíster IA).

- Negro navbar `#15171a`, primary `#00AFD8`, soft bg `#f3f5f7`, gray `#616365`
- Fonts: **UAI Corporativo** 300 (h1) / 800 (h2); body **Roboto**
- Labels like site `h4.label-uai`: primary, Roboto 800, no ALL CAPS
- Brand must read in the first viewport without depending on chrome alone (logo in black top bar, same as `Header.astro`)
- Avoid “tech dark” decks, purple glow, left accent rails, and floating badge clutter — they read as generic product UI, not UAI

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
- D3 illustrations: `type: "viz"` + `viz` id from `VizId` in `src/lib/slides.ts`; registry in `public/scripts/reveal-viz.js` (vendor `public/vendor/d3/d3.min.js`). Prefer a few concept diagrams with enter transitions over decorating every slide. Colors from UAI tokens only. Remount on `slidechanged` so animations replay when revisiting
- Viz contrast: avoid white fills on `#f3f5f7`; use soft fills / negro / primary on white `.uai-viz` canvas. No unicode-subscript-only labels (use `x_t`). Keep diagrams sparse — one idea per viz
- Available viz ids: `react-loop`, `autoregressive`, `eval-levels`, `notebook-to-service`, `multiagent`, `claim-evidence`, `make-buy`, `guardrails`, `reliability-product`, `decision-chain`, `rag-pipeline`, `train-serve-skew`, `ci-pipeline`, `canary-deploy`, `obs-layers`, `posttrain-pipeline`, `adapt-routes`
- Slide bullets stay human prose — no bare repo paths or hash URLs as list items (put links in `Lab:` prose or unit pages)
- D3 enter animations respect `prefers-reduced-motion: reduce` (`tDelay`/`tDur` → 0)
- Clase page loads `reveal-uai.css` and `reveal-viz.js` with `?v=<sha1-8>` from file contents so Pages/CDN do not keep stale theme or D3 registry after deploy

## Reveal transitions

- Deck transition stays `fade` (institutional, not flashy)
- Motion lives inside D3 viz (staggered enter) — that is the intentional motion budget for classes

## Content model

- Course meta: `src/data/courses.ts` · programs/syllabi: `src/data/programs.ts` · stack: `src/data/stack.ts`
- Unit copy: `src/content/units/` · Reveal overrides: `src/content/slides/<course>/<unit>.ts`
- Labs under `labs/`; LM Studio default `http://localhost:1234` (OpenAI-compatible). Prefer `content` then fall back to `reasoning_content` for models that only emit reasoning
- Screenshots/evidence: `public/labs/screenshots/` and `public/labs/runs/` when attaching to slides or `/herramientas`

## Continuous improvement (coursebuild loop)

Every loop tick should:

1. Screenshot + critique one Reveal clase vs UAI brand; fix the highest-severity issue
2. Advance e2e gaps (units / decks / labs)
3. **Update `AGENTS.md` when a learning is durable** (brand rule, Astro pitfall, LM quirk, deploy check) — short bullet under the right section; do not dump tick noise here
4. Build + push if there are repo changes; never version `tmp/`
