# Compliance del programa (Magíster IA UAI)

Fuente de verdad del **cómo de calidad** del material 08–11.  
El **qué** debe existir: `src/data/programs/<slug>.json` (`unidades[]`).

Marca Reveal/UAI, Astro y motion → [`AGENTS.md`](./AGENTS.md) (no duplicar aquí).  
Auto: `python3 scripts/compliance_check.py` → `tmp/compliance.md`; dashboard `/cumplimiento/` ← `make compliance-snapshot` (**adversario**: L0–L3 = ship; `devil_score` = deuda / floor-pass — no gatea `--strict`).  
Auditores: [compliance](.cursor/skills/course-compliance-auditor/SKILL.md) → `tmp/compliance-audit.md` (programa↔deck / L0–L4); [práctica](.cursor/skills/course-practice-auditor/SKILL.md) → `tmp/practice-audit.md` (**no** L0–L4).  
Editor: [`.cursor/rules/pedagogy-editor.mdc`](.cursor/rules/pedagogy-editor.mdc) · [`references/pedagogy_trends.md`](./references/pedagogy_trends.md).

---

## 1. Propósito

Barra: **curso explicativo y operable** — no short-course de tips.

| Dimensión | Cumplir |
|-----------|---------|
| Explicativo | Definición + teoría citada (OA/licensed) + lecturas + modelo mental antes de tool |
| Operable | Lab/Taller/Eval con artefacto; lab en disco si el syllabus lo declara; evidencia |
| Prelectura | Deck = preparación (tesis, defs, teoría); la clase viva demo/feedback — no tip sheet en vivo |
| Producción | Capstone / eval-first / dual-stack sin inventar citas |

**Target:** toda unidad ≥ **L2**; preferir **L3** con taller/lab. **L4** = loop manual (brand + editor), no umbral de `--strict`.

---

## 2. Gobernanza / límites del documento

Anti-bloat: criterios nuevos deben caber sin inflar el marco para siempre.

| Límite | Valor práctico |
|--------|----------------|
| Tamaño | Preferir **≤320 líneas** en este archivo (soft; si crece, comprimir en el mismo PR) |
| Por dimensión §3 | **≤8** bullets/criterios durables (checklist o filas de tabla) |
| Soft auto | **≤8** ids en `SOFT_CHECK_IDS` / tabla §3; demote o fusiona si hay ruido |
| Gate L1–L3 | Solo ids estabilizados en cohorte (baja FP); no promover “por completar” |
| Narrativa larga | Detalle de tendencia → `pedagogy_trends.md`; procedimiento de barrido → skill `SKILL.md` |

**Add ⇒ merge o retire:** todo criterio durable nuevo debe (a) **reemplazar** uno más débil, (b) **plegarse** en un bullet existente, o (c) venir con **una** simplificación de otra sección (borrar/fusionar ≥1 párrafo o fila).

**Soft vs hard:** lista auto corta (§3). Soft = reporta gap, no gatea nivel. Promover a gate solo cuando estable; demote soft ruidosos a manual / trends / skill.

Al actualizar este archivo desde el loop (`AGENTS.md` Continuous improvement): aplicar este presupuesto **en el mismo cambio**.

---

## 3. Modelo de niveles (L0–L4)

Compatible con `scripts/compliance_check.py`. No inventar otro escalafón.

| Nivel | Nombre | Significado | Auto |
|------:|--------|-------------|------|
| **L0** | ausente / parcial | Falta override, `.ts`, o placeholder | sí |
| **L1** | esqueleto | Deck + unit page ≥3 bloques + outcomes | sí |
| **L2** | teoría + pedagogía | L1 + Teoría/Lecturas + defs + outcomes deck + formativa + citas + bib + readings | sí |
| **L3** | práctica | L2 + viz ids válidos + lab en disco si declarado | sí |
| **L4** | pulido | Brand UAI + editor P1–P8 + prelectura cualitativa + §4.9 LaTeX | **manual** |

### Checks (`compliance_check.py`)

| Check | Nivel | Grupo |
|-------|------:|-------|
| `deck_registered` · `deck_file` · `unit_page` · `outcomes` · `blocks` | L1 | Estructura |
| `readings_listed` · `teoria_slide` · `lecturas_slide` · `definitions_present` · `citations_present` · `bib_keys_resolve` | L2 | Teoría |
| `outcomes_slide` · `formative_activity` | L2 | Pedagogía |
| `viz_valid` · `lab_ok` | L3 | Práctica |
| `prelectura_thesis` · `title_no_path` | soft† | Prelectura |
| `lab_declared_in_deck` · `outcomes_keyword_hit` | soft† | Programa↔deck |
| `viz_density_hint` | soft† | Densidad |

† Soft: gap en `tmp/compliance.md` / métricas §8; **no** gatean L2/L3. Promoción → §7.

**L4 / editor (manual):** brand (AGENTS); P1–P8; prelectura cualitativa §4.4; LaTeX §4.9.

---

## 4. Dimensiones del barrido

Orden global: **peor caso primero** (menor L / más ✗ → densidad viz → severidad pedagógica/brand → market).

### 4.1 Estructura

- [ ] Override + archivo deck (`deck_registered`, `deck_file`)
- [ ] Unit page: outcomes + ≥3 bloques (`unit_page`, `outcomes`, `blocks`)
- [ ] Unidad en `programs/<slug>.json`

### 4.2 Teoría / definiciones / lecturas / citas

- [ ] Kickers `Teoría` / `Lecturas`; `readings` no vacío
- [ ] Definiciones explícitas (`definitions_present`)
- [ ] Citas + bib keys resolubles; OA → `references/papers/<key>/`; no inventar papers

### 4.3 Pedagogía (alineación constructiva)

- [ ] Slide Al finalizar / Resultados (`outcomes_slide`)
- [ ] Lab / Taller / Eval / `Lab:` (`formative_activity`)
- [ ] Outcomes ↔ actividades (manual P1); two-lane si aplica (P5); evidencia rúbrica/golden/run (P7)

### 4.4 Prelectura (Reveal = preparación)

El alumno puede **estudiar solo** el deck (defs + tesis + lecturas + qué practicará).

| Criterio | Expectativa | Auto |
|----------|-------------|------|
| Tesis | Kicker `Tesis` / `Tesis de la sesión` pronto tras portada | soft `prelectura_thesis` |
| Defs primero | Léxico antes de tips/lab/viz | L2 `definitions_present` |
| Lecturas | Deck + unit; keys OK | L2 |
| Portada limpia | Título humano ≤2 líneas; sin path/URL stack en hero | soft `title_no_path` |
| Paths | Solo en `Lab:` / unit page | soft + AGENTS |
| Densidad / vivo vs solo / anti tip-deck | Teoría anclada; vivo = demo/lab/Q&A | manual / editor |

| En el deck | En unit / `/herramientas` |
|------------|---------------------------|
| Tesis, outcomes, defs, teoría, viz, lecturas clave, señal Lab | Syllabus, tiempos, lab meta, evidencias, rúbricas |

### 4.5 Práctica / labs / viz (L3)

- [ ] `viz` ids en registry (`viz_valid`); densidad ≥1 viz / ~60 min cuando el tema lo admite (soft `viz_density_hint`)
- [ ] Lab en disco si `lab:` o `Lab:` (`lab_ok`); eval-first golden+rúbrica (market #3; manual)

### 4.6 Brand L4

Pointer: **AGENTS.md** Brand + Reveal. Screenshot portada/section/bullets; log `tmp/reveal-uai-critique.md`.

### 4.7 Transfer / referents

Pointer: [`references/referents/`](./references/referents/). Última capa UAI (ES, Reveal, Chile, rúbricas). Market: AGENTS / `tmp/market-backlog.md`.

### 4.8 Programa ↔ presentación

**Promise** = `programs/*.json` + `units/index.ts`. **Delivery** = `slides/<course>/<uXX>.ts`.

| Mapeo | Señal | Auto / manual |
|-------|-------|---------------|
| Outcomes → clase | Al finalizar + overlap léxico | soft `outcomes_keyword_hit` / auditor P1 |
| Taller/lab | `Lab:` + path; disco | soft `lab_declared_in_deck` + L3 `lab_ok` |
| Lecturas | unit + Lecturas + bib | L2 / ¿syllabus real? (auditor) |
| Bloques ~60 min | sections + contenido; **fidelidad de horas** → §4.10 | manual + Manim sim |
| Prelectura usable | tesis + defs + teoría + formativa | soft + L2 / §4.4 |
| Viz proceso | `type:"viz"` | soft densidad + L3 `viz_valid` |

Invocar: skill compliance-auditor → `tmp/compliance-audit.md` (peor unidad + un fix). No sustituye editor P1–P8 ni practice-auditor.

### 4.9 Notación / ecuaciones (LaTeX)

Fórmulas canónicas en **LaTeX** (`\(...\)` / `$...$`). No unicode-only, ASCII `x^2`, ni PNG de ecuación. Prosa (`≠`/`≥`) OK. Labels D3: `x_t` ASCII.  
**Auto:** pendiente soft `equations_latex` (§7; alto FP). **Renderer:** sin KaTeX en clase aún — escribir LaTeX ya; vendor = follow-up.

### 4.10 Validación de horas lectivas (Manim)

**Promise** = `programs/<slug>.json` → `unidades[].hours` + `session[]` (bloques ≈60 min). No inventar auditorías: solo medir simulación vs plan.

| Pieza | Valor (borrador v0) |
|-------|---------------------|
| Método | Video-simulación de la narrativa del deck (Manim title cards / Manim+stills); duración medida vs horas planificadas |
| Escala demo | 1 s video ≈ 1 min lectivo (pipeline); fidelidad 1:1 = follow-up local, no CI |
| Tolerancia | **±20%** primera pasada (draft; endurecer a ±15% cuando haya ≥3 unidades auditadas) |
| Auto | Scaffold `scripts/hours_audit.py` + escena `labs/hours/` → reporta plan vs duración; **no** gatea L |
| Manual | Revisar pacing real en clase / stills; editor si el sim pasa pero la sesión se desvía |
| Reporte | `tmp/hours-audit.md` (gitignored); MP4 bajo `tmp/hours/` — **no** versionar |
| Métrica | `m_hours_fidelity` (§8) |

Scaffold: `labs/hours/README.md`. Demo: `make hours-audit-demo`.

---

## 5. Loop y promoción de checks

```bash
python3 scripts/compliance_check.py           # → tmp/compliance.md (+ § métricas)
python3 scripts/compliance_check.py --strict  # exit 1 si alguna < L2
```

**Orden:** (1) menor L / más ✗ (08→11) → (2) peor densidad viz → (3) severidad pedagógica/brand → (4) market. Dentro de L2: defs + señales pedagógicas antes que tips.

**Por tick:** compliance → L4 brand → editor → D3/viz → subir L → market slice → si durable: aquí **con presupuesto §2** + check cuando estabilice + nota en trends.

| Estado | Dónde |
|--------|-------|
| Hipótesis | `tmp/pedagogy-critique.md` |
| Durable manual | §4 + TODO §7 |
| Soft auto | script + fila §3 |
| Gate L1–L3 | cómputo de nivel + fila §3 |

---

## 6. Matriz corta

| Pregunta | Señal de sí |
|----------|-------------|
| ¿Prelee el concepto? | Tesis + defs + Teoría + Lecturas |
| ¿Sabe el “al finalizar”? | Outcomes unit + slide |
| ¿Practica con artefacto? | Lab/Taller/Eval + path |
| ¿Modelo mental? | ≥1 viz si proceso/relación |
| ¿Fórmulas editables? | LaTeX §4.9 |
| ¿Portada = tema, no stack? | Título humano; tools en `Lab:` |
| ¿Marca UAI? | L4 brand |
| ¿Horas lectivas fieles? | Manim sim vs `hours` / bloques (§4.10); `m_hours_fidelity` |

| Curso | Énfasis |
|-------|---------|
| 08 | Fundamentos + abierto/cerrado + costo |
| 09 | Prompt ⊂ contexto; eval-first; defs antes de agentes |
| 10 | Design doc / trade-offs; menos tip-deck |
| 11 | Deploy/obs; lab + evidencia |

Umbral: **0 unidades &lt; L2** con `--strict`. Meta clase: L3 con lab + L4 en rotación.

---

## 7. TODOs — hooks futuros

Promover solo con baja FP. Soft ya vivos: `prelectura_thesis`, `title_no_path`, `lab_declared_in_deck`, `outcomes_keyword_hit`, `viz_density_hint`.

| ID | Idea | FP | Notas |
|----|------|-----|-------|
| `lab_paths_in_prose` | `labs/…` en items ⇒ contexto `Lab:` | Medio | |
| `hero_no_tool_dump` | Tesis/portada sin dump Colab/HF/LM | Medio | Excepciones en 11 |
| `def_before_lab_order` | Primera Def antes del primer Lab | Alto | Orden no lineal |
| `program_block_coverage` | Cada bloque session tiene eco | Alto | Manual |
| `two_lane_signal` | abstener/HITL cuando outcome = usar LLM | Alto | Semántico |
| `equations_latex` | unicode/ASCII math sin `$`/`\(` | **Alto** | Manual §4.9 hasta heurística conservadora |
| `hours_sim_duration` | Parse `tmp/hours-audit.md` / ffprobe vs `hours` del programa | Medio | Soft futuro; método §4.10; no inventar audits |

**Solo manual:** alineación outcome↔actividad plena; tip-deck; vivo vs solo; lecturas inventadas; “viz enseña outcome”; LaTeX §4.9; pacing vivo vs Manim.

Al implementar: actualizar §3, docstring del script, bullet corto en AGENTS (pointer).

---

## 8. Métricas pedagógicas

Señales medibles de pedagogía (alineación, prelectura, two-lane, process+product) — **además** del nivel L0–L4. Grounded en `pedagogy_trends.md` (Biggs; Liu & Bridgeman / TLC; process+product). **No gatean** L2 salvo que ya sean checks L2. Reporte: bloque final de `tmp/compliance.md`; auditor puede citarlas.

| ID | Definición | Target | Auto / manual | Dónde |
|----|------------|--------|---------------|-------|
| `m_outcomes_formative` | % unidades con `outcomes_slide` **y** `formative_activity` | **100%** | Auto (agrega L2) | `tmp/compliance.md` § métricas |
| `m_definitions` | % con `definitions_present` | **100%** | Auto (L2) | idem |
| `m_viz_density` | Media `n_viz / max(n_blocks,1)`; y % que pasan `viz_density_hint` | media **≥0.25**; hint pass **≥80%** | Auto (soft) | idem |
| `m_prelectura_thesis` | % con `prelectura_thesis` | **≥90%** | Auto soft | idem |
| `m_lab_deck_align` | De unidades con `lab:` en unit, % con `lab_declared_in_deck` | **100%** | Auto soft | idem |
| `m_blocks_structure` | % con `blocks` OK (≥3) | **100%** | Auto | `tmp/compliance.md` § métricas |
| `m_hours_fidelity` | De unidades con informe Manim en `tmp/hours-audit.md`: % con \|sim − plan\| / plan ≤ tolerancia (§4.10, draft ±20%) | **≥80%** de unidades auditadas en rotación; roadmap 100% | Semi: script + revisión manual del MP4/pacing | `tmp/hours-audit.md`; no inventar filas |
| `m_process_product` | De cursos/labs con `lab:` o golden, % con evidencia process+product (rúbrica + ≥1 JSON en `labs/<NN>/runs/` o path declarado) | **≥1 run/curso con labs**; roadmap 100% labs declarados | Semi: cuenta `labs/*/runs/*.json` + pointer `labs/RUBRIC.md` | reporte (conteo runs) + audit |
| `m_two_lane` | Donde el outcome exige uso de LLM: señal explícita lane 1 (sin AI / competencia propia) vs lane 2 (verificar, abstener, HITL) | **todas** las unidades “uso crítico de GenAI” en rotación editor | Manual P5 | `tmp/pedagogy-critique.md` / audit |

El checker emite el bloque **Pedagogy metrics** (tasas 08–11, ~25 unidades) al final de `tmp/compliance.md` y un resumen en stdout. Fallos vs target = gap blando para priorizar el tick; no nuevos gates L.

---

## 9. Referencias operativas

| Artefacto | Rol |
|-----------|-----|
| `src/data/programs/*.json` | Promise (unidades) |
| `src/content/units/index.ts` | Outcomes / blocks / lab |
| `src/content/slides/**` | Delivery Reveal |
| `scripts/compliance_check.py` | Auto → `tmp/compliance.md` + métricas §8; `--snapshot` → `/cumplimiento/` (+ capa `devil_score`, objeciones) |
| skills compliance / practice | Audit programa↔deck · relevancia externa |
| `AGENTS.md` | Brand, loop, market; presupuesto §2 al tocar este archivo |
| pedagogy-editor + `pedagogy_trends.md` | P1–P8 + tendencias citadas |
| `references/referents/` | Transfer |
| `labs/RUBRIC.md` | Rúbrica transversal |
| `labs/hours/` · `scripts/hours_audit.py` | Simulación Manim de horas (§4.10) |
| `tmp/*` | Scratch; no versionar (`tmp/hours-audit.md`, `tmp/hours/`) |
