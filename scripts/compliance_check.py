#!/usr/bin/env python3
"""Program compliance check for Magíster IA course materials.

Scores each syllabus unit (src/data/programs/*.json) against delivered
artifacts: unit pages, Reveal decks, theory/citations, labs, viz.

Writes: tmp/compliance.md (gitignored scratch)
Optional: src/data/compliance-snapshot.json (--snapshot / make compliance-snapshot)
  → UI at /cumplimiento/
Prints: summary table to stdout

Levels (per unit):
  L0 absent     — no slide override
  L1 skeleton   — deck + unit page with blocks/outcomes
  L2 theory     — Teoría + Lecturas + definitions + pedagogy signals (outcomes + formative)
  L3 practice   — lab present when declared / Lab: in deck; viz ids valid
  L4 polish     — manual (brand + pedagogy-editor critique) — not fully auto-scored here

Soft (reported, do not gate L2/L3 yet):
  prelectura_thesis      — kicker Tesis / Tesis de la sesión
  title_no_path          — title slide title/subtitle has no labs/ or filesystem-ish path
  lab_declared_in_deck   — unit lab: ⇒ Lab: prose or labs/ path in deck
  outcomes_keyword_hit   — ≥1 significant token from learningOutcomes in Al finalizar
  viz_density_hint       — soft-fail if 0 viz and unit has ≥4 blocks

Also emits a soft Pedagogy metrics block (COMPLIANCE.md §8) — rates across units;
does not add new L gates.

Dashboard exigence (devil layer in --snapshot only; never gates --strict):
  Per-unit devil_score 0–100 (higher = more debt) + flags (viz below block quota,
  lab without run JSON, course process hole, hours underfill / Manim unproven,
  soft/floor passes, L4 unpaid). Objections list for /cumplimiento/ — abogado
  del diablo, not victory lap. Hours: content→min heuristic (hours_fill.py);
  L3 ≠ “4h cubiertas”.

Framework: COMPLIANCE.md (repo root). Exit 0 always unless --strict and any unit < L2.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

# Shared hours fill heuristic (COMPLIANCE §4.10 interim)
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hours_fill import (  # noqa: E402
    FILL_MIN,
    FILL_SEVERE,
    fill_report,
    format_fill_line,
)

ROOT = Path(__file__).resolve().parents[1]
PROGRAMS = ROOT / "src" / "data" / "programs"
SLIDES_DIR = ROOT / "src" / "content" / "slides"
UNITS_TS = ROOT / "src" / "content" / "units" / "index.ts"
SLIDES_INDEX = ROOT / "src" / "content" / "slides" / "index.ts"
BIB = ROOT / "references" / "bibliography.bib"
PAPERS_CFG = ROOT / "references" / "papers_config.json"
LABS = ROOT / "labs"
VIZ_JS = ROOT / "public" / "scripts" / "reveal-viz.js"
OUT = ROOT / "tmp" / "compliance.md"
SNAPSHOT = ROOT / "src" / "data" / "compliance-snapshot.json"
HOURS_AUDIT = ROOT / "tmp" / "hours-audit.md"
PRACTICE_AUDIT = ROOT / "tmp" / "practice-audit.md"

# Aspirational viz quota for devil layer (AGENTS: ≥1 fuerte / bloque ~60 min).
# Soft check viz_density_hint stays lenient (0 viz + ≥4 blocks); devil flags dens < 1.0.
DEVIL_VIZ_PER_BLOCK = 1.0
DEVIL_TITLE_CHARS = 72  # portada risk: long Corporativo titles wrap / look tip-dump

COURSES = [
    "08-genai-llms",
    "09-prompt-engineering",
    "10-diseno-sistemas-ia",
    "11-aiops-cloud",
]

SOFT_CHECK_IDS = frozenset(
    {
        "prelectura_thesis",
        "title_no_path",
        "lab_declared_in_deck",
        "outcomes_keyword_hit",
        "viz_density_hint",
    }
)

STOPWORDS_ES = frozenset(
    """
    a al algo alguna alguno algunas algunos ante antes aquel aquella aquellas aquellos
    aqui asi aunque bajo bien cada casi como con contra cual cuales cuando cuanto de del
    desde donde dos el ella ellas ellos en entre era eran es esa esas ese eso esos esta
    estaba estaban estan estar este esto estos fin fue fueron ha haber hace hacia han
    hasta hay la las le les lo los mas me mi mis muy nada ni no nos nosotros o otra otras
    otro otros para pero poco por porque que quien quienes se ser si sin sobre son su sus
    te tener ti tiene tienen todo todos tu tus un una unas uno unos usted ustedes y ya
    the and for with from that this into onto than then also can may must should will
    explicar describir determinar configurar medir estructurar seleccionar especificar
    aplicar evaluar usar utilizar construir diseñar implementar
    """.split()
)

TOKEN_RE = re.compile(r"[a-záéíóúñü]{5,}", re.I)

BIB_KEY_RE = re.compile(r"(?:^|[\s—\-])([a-z][a-z0-9]+(?:20\d{2}|19\d{2})[a-z0-9]*)\b")
DEF_KICKER_RE = re.compile(
    r'kicker:\s*"(Definici[oó]n(?:es)?|Concepto(?:s)?|Glosario|L[eé]xico)"',
    re.I,
)
# "Término — definición…" or "X es un/una …"
DEF_DASH_RE = re.compile(r'"[^"]{1,48}\s+[—–]\s+[^"]{8,}"')
DEF_ES_RE = re.compile(r'"[^"]{2,60}\s+es\s+(?:un|una|el|la)\s+[^"]{5,}"', re.I)
OUTCOMES_KICKER_RE = re.compile(
    r'kicker:\s*"(Al finalizar|Resultados|Objetivos|Aprendizaje)"',
    re.I,
)
OUTCOMES_TITLE_RE = re.compile(
    r'title:\s*"(Resultados de aprendizaje|Al finalizar[^"]*|Objetivos de aprendizaje)"',
    re.I,
)
FORMATIVE_KICKER_RE = re.compile(
    r'kicker:\s*"(Lab(?:\s+vivo)?|Taller|Eval\b[^"]*|Entregable|Práctica|Demo viva|Capstone)"',
    re.I,
)
LAB_PROSE_RE = re.compile(r"[Ll]ab:\s*")
THESIS_KICKER_RE = re.compile(
    r'kicker:\s*"(Tesis(?:\s+de\s+la\s+sesi[oó]n)?|Tesis\s+central)"',
    re.I,
)
# Filesystem / lab path dump on portada (title slide fields only)
TITLE_PATH_RE = re.compile(
    r"(?:labs/[^\s\"']+|/[^\s\"']+\.(?:py|ts|ipynb|md)|https?://localhost)",
    re.I,
)
SLIDE_OVERRIDE_RE = re.compile(
    r'"(08-genai-llms|09-prompt-engineering|10-diseno-sistemas-ia|11-aiops-cloud)/(u\d{2})"'
)
UNIT_BLOCK_RE = re.compile(
    r'courseSlug:\s*"(?P<slug>[^"]+)"[\s\S]*?unitId:\s*"(?P<uid>u\d{2})"'
    r'[\s\S]*?(?=courseSlug:|export const units|$)',
    re.M,
)


@dataclass
class Check:
    id: str
    ok: bool
    detail: str = ""


@dataclass
class UnitScore:
    course: str
    unit: str
    title: str
    checks: list[Check] = field(default_factory=list)
    level: int = 0
    blockers: list[str] = field(default_factory=list)

    def add(self, cid: str, ok: bool, detail: str = "", *, fail: str = "") -> None:
        msg = detail if ok else (fail or detail)
        self.checks.append(Check(cid, ok, msg))
        # Soft gaps are visible but not "blockers" for level narrative
        if not ok and cid not in SOFT_CHECK_IDS:
            self.blockers.append(f"{cid}: {msg}" if msg else cid)


def load_bib_keys() -> set[str]:
    keys = set()
    if BIB.exists():
        keys |= set(re.findall(r"@\w+\{([^,\s]+)", BIB.read_text(encoding="utf-8")))
    if PAPERS_CFG.exists():
        keys |= set(json.loads(PAPERS_CFG.read_text(encoding="utf-8")).keys())
    return keys


def load_viz_ids() -> set[str]:
    text = VIZ_JS.read_text(encoding="utf-8") if VIZ_JS.exists() else ""
    # registry block: autoregressive: vizAutoregressive, or "react-loop": …
    m = re.search(r"var registry = \{([\s\S]*?)\n  \};", text)
    block = m.group(1) if m else text
    found = re.findall(r'(?:["\']([a-z0-9-]+)["\']|([a-z0-9-]+))\s*:', block)
    return {a or b for a, b in found if (a or b)}


def load_slide_overrides() -> set[tuple[str, str]]:
    text = SLIDES_INDEX.read_text(encoding="utf-8")
    return {(m.group(1), m.group(2)) for m in SLIDE_OVERRIDE_RE.finditer(text)}


def parse_unit_pages() -> dict[tuple[str, str], dict]:
    """Best-effort parse of units/index.ts objects."""
    text = UNITS_TS.read_text(encoding="utf-8")
    out: dict[tuple[str, str], dict] = {}
    # Split on courseSlug occurrences
    parts = re.split(r"(?=courseSlug:\s*\")", text)
    for part in parts:
        sm = re.search(r'courseSlug:\s*"([^"]+)"', part)
        um = re.search(r'unitId:\s*"(u\d{2})"', part)
        if not sm or not um:
            continue
        slug, uid = sm.group(1), um.group(1)
        readings = re.findall(r'readings:\s*\[([\s\S]*?)\]', part)
        reading_lines = []
        if readings:
            reading_lines = re.findall(r'"([^"]+)"', readings[0])
        has_lab = bool(re.search(r"\blab:\s*\{", part))
        blocks = len(re.findall(r"title:\s*\"", part.split("blocks:")[-1].split("readings:")[0])) if "blocks:" in part else 0
        outcome_texts: list[str] = []
        if "learningOutcomes:" in part:
            chunk = part.split("learningOutcomes:")[1].split("blocks:")[0]
            outcome_texts = re.findall(r'"([^"]+)"', chunk)
        out[(slug, uid)] = {
            "readings": reading_lines,
            "has_lab": has_lab,
            "n_blocks": blocks,
            "n_outcomes": len(outcome_texts),
            "outcome_texts": outcome_texts,
        }
    return out


def significant_tokens(texts: list[str]) -> set[str]:
    toks: set[str] = set()
    for t in texts:
        for m in TOKEN_RE.findall(t.lower()):
            if m not in STOPWORDS_ES:
                toks.add(m)
    return toks


def extract_outcomes_slide_items(text: str) -> list[str]:
    """Items under Al finalizar / Resultados kickers (best-effort)."""
    items: list[str] = []
    for m in re.finditer(
        r'kicker:\s*"(?:Al finalizar|Resultados|Objetivos|Aprendizaje)"[\s\S]*?items:\s*\[([\s\S]*?)\]',
        text,
        re.I,
    ):
        items.extend(re.findall(r'"([^"]+)"', m.group(1)))
    if items:
        return items
    for m in re.finditer(
        r'title:\s*"(?:Resultados de aprendizaje|Al finalizar[^"]*|Objetivos de aprendizaje)"[\s\S]*?items:\s*\[([\s\S]*?)\]',
        text,
        re.I,
    ):
        items.extend(re.findall(r'"([^"]+)"', m.group(1)))
    return items


def outcomes_keyword_hit(outcome_texts: list[str], deck_text: str) -> tuple[bool, str]:
    """Conservative lexical overlap: unit outcomes ↔ Al finalizar items."""
    if not outcome_texts:
        return True, "n/a (no unit outcomes)"
    slide_items = extract_outcomes_slide_items(deck_text)
    if not slide_items:
        return False, "no Al finalizar items to compare"
    need = significant_tokens(outcome_texts)
    have = significant_tokens(slide_items)
    if not need:
        return True, "n/a (no significant tokens)"
    hits = sorted(need & have)
    # Pass if ≥1 content token overlaps (soft; full alignment is manual)
    if hits:
        return True, f"hits={hits[:5]}{'…' if len(hits) > 5 else ''}"
    return False, "no significant token overlap unit outcomes ↔ Al finalizar"


def lab_declared_in_deck(has_lab: bool, deck_text: str | None) -> tuple[bool, str]:
    if not has_lab:
        return True, "n/a (no lab: on unit)"
    if not deck_text:
        return False, "lab: on unit but no deck"
    # Lab: prose, or any labs/ path (incl. labs/capstone/)
    if LAB_PROSE_RE.search(deck_text) or re.search(r"\blabs/", deck_text):
        return True, "Lab: / labs/ path in deck"
    return False, "lab: on unit but no Lab: prose or labs/ path in deck"


def viz_density_hint(n_viz: int, n_blocks: int) -> tuple[bool, str]:
    detail = f"viz={n_viz} blocks≈{n_blocks}"
    if n_blocks >= 4 and n_viz == 0:
        return False, f"{detail}; prefer ≥1 viz when ≥4 blocks"
    return True, detail


def analyze_definitions(text: str) -> tuple[bool, str]:
    """Course decks must define concepts (not only tip / cite)."""
    if DEF_KICKER_RE.search(text):
        return True, "kicker Definición/Concepto/Glosario"
    dash_n = len(DEF_DASH_RE.findall(text))
    es_n = len(DEF_ES_RE.findall(text))
    if dash_n >= 3 or es_n >= 2 or (dash_n >= 2 and es_n >= 1):
        return True, f"def-bullets dash={dash_n} es={es_n}"
    return False, f"need Definición slide or ≥3 'Término — def' / ≥2 'X es un…' (dash={dash_n} es={es_n})"


def analyze_pedagogy(text: str) -> dict:
    """Signals of constructive alignment (outcomes + formative activity)."""
    outcomes = bool(OUTCOMES_KICKER_RE.search(text) or OUTCOMES_TITLE_RE.search(text))
    formative = bool(FORMATIVE_KICKER_RE.search(text) or LAB_PROSE_RE.search(text))
    return {
        "outcomes_slide": outcomes,
        "outcomes_detail": "Al finalizar / Resultados" if outcomes else "missing outcomes slide in deck",
        "formative_activity": formative,
        "formative_detail": "Lab/Taller/Eval/Entregable" if formative else "no Lab:/Taller/Eval/Entregable signal",
    }


def analyze_prelectura(text: str) -> dict:
    """Soft prelectura signals (Reveal as prep material). See COMPLIANCE.md §4.4."""
    thesis = bool(THESIS_KICKER_RE.search(text))
    # First title slide block only — avoid false positives from Lab: prose later
    title_ok = True
    title_detail = "title slide clean"
    m = re.search(
        r'type:\s*"title"\s*,\s*([\s\S]*?)(?=type:\s*"|$)',
        text,
    )
    if m:
        block = m.group(1)
        # Only scan title / subtitle string values in this block
        fields = re.findall(r'(?:title|subtitle):\s*"([^"]*)"', block)
        bad = [f for f in fields if TITLE_PATH_RE.search(f) or f.strip().startswith("labs/")]
        if bad:
            title_ok = False
            title_detail = f"path-like on portada: {bad[0][:48]}"
    else:
        title_ok = False
        title_detail = "no title slide"
    return {
        "prelectura_thesis": thesis,
        "thesis_detail": "kicker Tesis" if thesis else "missing kicker Tesis / Tesis de la sesión",
        "title_no_path": title_ok,
        "title_detail": title_detail,
    }


def analyze_deck(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    teoria = bool(re.search(r'kicker:\s*"Teoría"', text))
    lecturas = bool(re.search(r'kicker:\s*"Lecturas"', text))
    lab_mentions = re.findall(r"[Ll]ab:\s*(labs/[^\s\"']+)", text) + re.findall(
        r"(labs/\d+/u\d{2}/[^\s\"']+)", text
    )
    viz_ids = re.findall(r'viz:\s*"([a-z0-9-]+)"', text)
    # citation-ish: Author (20xx) or bib keys
    cited = bool(re.search(r"\([12]\d{3}\)", text)) or bool(BIB_KEY_RE.search(text))
    defs_ok, defs_detail = analyze_definitions(text)
    ped = analyze_pedagogy(text)
    pre = analyze_prelectura(text)
    return {
        "teoria": teoria,
        "lecturas": lecturas,
        "labs": lab_mentions,
        "viz": viz_ids,
        "cited": cited,
        "definitions": defs_ok,
        "definitions_detail": defs_detail,
        **ped,
        **pre,
        "n_slides": len(re.findall(r"type:\s*\"", text)),
    }


def extract_bib_keys_from_strings(lines: list[str]) -> list[str]:
    keys = []
    for line in lines:
        # prefer explicit trailing key after em dash
        m = re.search(r"—\s*([a-z][a-z0-9]+(?:20\d{2}|19\d{2})[a-z0-9]*)", line)
        if m:
            keys.append(m.group(1))
            continue
        keys.extend(BIB_KEY_RE.findall(line))
    return keys


def lab_exists(course_num: str, unit: str, mentions: list[str], has_lab_field: bool) -> tuple[bool, str]:
    course_labs = LABS / course_num
    unit_dir = course_labs / unit
    if unit_dir.is_dir() and any(unit_dir.iterdir()):
        return True, str(unit_dir.relative_to(ROOT))
    for m in mentions:
        p = ROOT / m.rstrip(".,)")
        if p.exists():
            return True, m
        # strip filename → dir
        if p.parent.exists() and p.parent != ROOT:
            return True, str(p.parent.relative_to(ROOT))
    if has_lab_field:
        return False, f"lab declared but missing under labs/{course_num}/{unit}/"
    # no lab expected
    return True, "n/a (no lab declared)"


def score_unit(
    course: str,
    unit_meta: dict,
    overrides: set[tuple[str, str]],
    pages: dict[tuple[str, str], dict],
    bib: set[str],
    viz_ids: set[str],
) -> UnitScore:
    uid = unit_meta["id"]
    title = unit_meta.get("title", "")
    s = UnitScore(course=course, unit=uid, title=title)
    course_num = course.split("-")[0]

    # L0: override registered + file
    has_override = (course, uid) in overrides
    deck_path = SLIDES_DIR / course / f"{uid}.ts"
    s.add("deck_registered", has_override, fail="missing in slides/index.ts")
    s.add(
        "deck_file",
        deck_path.exists(),
        detail=str(deck_path.relative_to(ROOT)) if deck_path.exists() else "",
        fail="missing .ts deck file",
    )

    page = pages.get((course, uid))
    s.add("unit_page", page is not None, fail="missing in units/index.ts")
    if page:
        s.add("outcomes", page["n_outcomes"] >= 1, detail=f"n={page['n_outcomes']}", fail="no learningOutcomes")
        s.add("blocks", page["n_blocks"] >= 3, detail=f"n≈{page['n_blocks']}", fail="need ≥3 blocks")
        s.add(
            "readings_listed",
            len(page["readings"]) >= 1,
            detail=f"n={len(page['readings'])}",
            fail="empty readings",
        )
    else:
        s.add("outcomes", False, fail="no page")
        s.add("blocks", False, fail="no page")
        s.add("readings_listed", False, fail="no page")

    deck = analyze_deck(deck_path) if deck_path.exists() else None
    if deck:
        s.add("teoria_slide", deck["teoria"], fail="no kicker Teoría")
        s.add("lecturas_slide", deck["lecturas"], fail="no kicker Lecturas")
        s.add(
            "definitions_present",
            deck["definitions"],
            detail=deck["definitions_detail"],
            fail=deck["definitions_detail"],
        )
        s.add(
            "outcomes_slide",
            deck["outcomes_slide"],
            detail=deck["outcomes_detail"],
            fail=deck["outcomes_detail"],
        )
        s.add(
            "formative_activity",
            deck["formative_activity"],
            detail=deck["formative_detail"],
            fail=deck["formative_detail"],
        )
        s.add("citations_present", deck["cited"], fail="no (Author, year) / bib keys in deck")
        # Soft prelectura — reported; not in L2/L3 gate (COMPLIANCE.md §2)
        s.add(
            "prelectura_thesis",
            deck["prelectura_thesis"],
            detail=deck["thesis_detail"],
            fail=deck["thesis_detail"],
        )
        s.add(
            "title_no_path",
            deck["title_no_path"],
            detail=deck["title_detail"],
            fail=deck["title_detail"],
        )
        bad_viz = [v for v in deck["viz"] if v not in viz_ids]
        s.add(
            "viz_valid",
            len(bad_viz) == 0,
            detail=f"n={len(deck['viz'])}",
            fail=f"unknown viz ids: {bad_viz}",
        )
    else:
        s.add("teoria_slide", False, fail="no deck")
        s.add("lecturas_slide", False, fail="no deck")
        s.add("definitions_present", False, fail="no deck")
        s.add("outcomes_slide", False, fail="no deck")
        s.add("formative_activity", False, fail="no deck")
        s.add("citations_present", False, fail="no deck")
        s.add("prelectura_thesis", False, fail="no deck")
        s.add("title_no_path", False, fail="no deck")
        s.add("viz_valid", True, detail="n/a")

    deck_text = deck_path.read_text(encoding="utf-8") if deck_path.exists() else None

    # Soft: program/unit promise → deck (COMPLIANCE.md §4.8)
    has_lab_field = bool(page and page["has_lab"])
    lab_deck_ok, lab_deck_detail = lab_declared_in_deck(has_lab_field, deck_text)
    s.add("lab_declared_in_deck", lab_deck_ok, lab_deck_detail, fail=lab_deck_detail)

    outcome_texts = list(page["outcome_texts"]) if page else []
    if deck_text is not None:
        ok_hit, hit_detail = outcomes_keyword_hit(outcome_texts, deck_text)
    else:
        ok_hit, hit_detail = (True, "n/a (no deck)") if not outcome_texts else (False, "no deck")
    s.add("outcomes_keyword_hit", ok_hit, hit_detail, fail=hit_detail)

    n_viz = len(deck["viz"]) if deck else 0
    n_blocks = page["n_blocks"] if page else 0
    dens_ok, dens_detail = viz_density_hint(n_viz, n_blocks)
    s.add("viz_density_hint", dens_ok, dens_detail, fail=dens_detail)

    # bib keys from unit readings + Lecturas slide strings
    keys = extract_bib_keys_from_strings(page["readings"] if page else [])
    if deck_text is not None:
        # Lecturas items only
        m = re.search(r'kicker:\s*"Lecturas"[\s\S]*?items:\s*\[([\s\S]*?)\]', deck_text)
        if m:
            keys += extract_bib_keys_from_strings(re.findall(r'"([^"]+)"', m.group(1)))
    keys = list(dict.fromkeys(keys))
    missing = [k for k in keys if k not in bib]
    s.add(
        "bib_keys_resolve",
        len(keys) == 0 or len(missing) == 0,
        f"keys={keys or '∅'}; missing={missing}" if missing else f"keys={keys or '∅'}",
    )

    mentions = deck["labs"] if deck else []
    lab_ok, lab_detail = lab_exists(course_num, uid, mentions, has_lab_field)
    # If syllabus session mentions taller/lab strongly we still only require when declared
    s.add("lab_ok", lab_ok, lab_detail)

    # Compute level
    l1 = all(
        c.ok
        for c in s.checks
        if c.id in {"deck_registered", "deck_file", "unit_page", "outcomes", "blocks"}
    )
    l2 = l1 and all(
        c.ok
        for c in s.checks
        if c.id
        in {
            "teoria_slide",
            "lecturas_slide",
            "definitions_present",
            "outcomes_slide",
            "formative_activity",
            "citations_present",
            "readings_listed",
            "bib_keys_resolve",
        }
    )
    l3 = l2 and all(c.ok for c in s.checks if c.id in {"lab_ok", "viz_valid"})
    if l3:
        s.level = 3
    elif l2:
        s.level = 2
    elif l1:
        s.level = 1
    elif has_override or deck_path.exists():
        s.level = 0
    else:
        s.level = 0
    return s


def load_programs() -> dict[str, list[dict]]:
    out = {}
    for slug in COURSES:
        path = PROGRAMS / f"{slug}.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        out[slug] = data["unidades"]
    return out


def _check_ok(s: UnitScore, cid: str) -> bool | None:
    for c in s.checks:
        if c.id == cid:
            return c.ok
    return None


def _check_detail(s: UnitScore, cid: str) -> str:
    for c in s.checks:
        if c.id == cid:
            return c.detail
    return ""


def count_lab_runs() -> dict[str, int]:
    """JSON run artifacts under labs/<NN>/runs/ (process+product evidence)."""
    out: dict[str, int] = {}
    if not LABS.is_dir():
        return out
    for course_dir in sorted(LABS.iterdir()):
        if not course_dir.is_dir() or not course_dir.name.isdigit():
            continue
        runs = course_dir / "runs"
        n = len(list(runs.glob("*.json"))) if runs.is_dir() else 0
        out[course_dir.name] = n
    return out


def list_lab_run_files() -> dict[str, list[str]]:
    """Basenames of JSON runs per course number."""
    out: dict[str, list[str]] = {}
    if not LABS.is_dir():
        return out
    for course_dir in sorted(LABS.iterdir()):
        if not course_dir.is_dir() or not course_dir.name.isdigit():
            continue
        runs = course_dir / "runs"
        out[course_dir.name] = (
            sorted(p.name for p in runs.glob("*.json")) if runs.is_dir() else []
        )
    return out


def parse_hours_audit_units() -> dict[str, dict]:
    """Units mentioned in tmp/hours-audit.md (Manim evidence only; do not invent)."""
    found: dict[str, dict] = {}
    if not HOURS_AUDIT.is_file():
        return found
    text = HOURS_AUDIT.read_text(encoding="utf-8")
    m = re.search(
        r"Course/unit:\s*\*\*(\d{2})/(u\d{2})\*\*[^\n]*",
        text,
    )
    if not m:
        return found
    key = f"{m.group(1)}/{m.group(2)}"
    dry = bool(re.search(r"DRY-RUN|Measured MP4 \(s\)\s*\|\s*—", text, re.I))
    within = bool(re.search(r"Within ±20%\s*\|\s*True", text, re.I))
    found[key] = {"dry_run": dry, "within_tol": within and not dry, "measured": not dry}
    return found


def hours_fill_for_unit(s: UnitScore, unit_meta: dict | None = None) -> dict:
    """Content→minutes fill vs planned hours (all units; interim for m_hours_fidelity)."""
    deck_path = SLIDES_DIR / s.course / f"{s.unit}.ts"
    meta = unit_meta or {"hours": 4}
    return fill_report(deck_path if deck_path.is_file() else None, meta)


def load_program_unit_hours() -> dict[tuple[str, str], dict]:
    """Map (course_slug, unit_id) → program unit dict (for planned hours)."""
    out: dict[tuple[str, str], dict] = {}
    for course in COURSES:
        path = PROGRAMS / f"{course}.json"
        if not path.is_file():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for u in data.get("unidades", []):
            uid = str(u.get("id", ""))
            out[(course, uid)] = u
    return out


def _viz_blocks_from_score(s: UnitScore) -> tuple[int, int]:
    detail = _check_detail(s, "viz_density_hint")
    m = re.search(r"viz=(\d+)\s+blocks≈(\d+)", detail)
    if m:
        return int(m.group(1)), int(m.group(2))
    return 0, 0


def _unit_has_lab(s: UnitScore) -> bool:
    return _check_detail(s, "lab_declared_in_deck") != "n/a (no lab: on unit)"


def _defs_barely(s: UnitScore) -> bool:
    """True when definitions_present passes on minimum bullet count (thin defs)."""
    if not _check_ok(s, "definitions_present"):
        return False
    d = _check_detail(s, "definitions_present")
    if "kicker" in d.lower():
        return False
    m = re.search(r"dash=(\d+)\s+es=(\d+)", d)
    if not m:
        return False
    dash, es = int(m.group(1)), int(m.group(2))
    # Minimum gate: dash≥3 or es≥2 or (dash≥2 and es≥1)
    return (dash == 3 and es == 0) or (dash < 3 and es == 2) or (dash == 2 and es == 1)


def devil_grade(score: int) -> str:
    if score <= 12:
        return "A"
    if score <= 24:
        return "B"
    if score <= 40:
        return "C"
    if score <= 58:
        return "D"
    return "F"


def score_unit_devil(
    s: UnitScore,
    *,
    course_runs: dict[str, int],
    run_files: dict[str, list[str]],
    hours_units: dict[str, dict],
    hours_fill: dict,
) -> dict:
    """Harsh exigence score for dashboard — does not change s.level / --strict."""
    code = s.course.split("-", 1)[0]
    n_viz, n_blocks = _viz_blocks_from_score(s)
    dens = n_viz / max(n_blocks, 1)
    has_lab = _unit_has_lab(s)
    flags: list[dict] = []
    debt = 0

    hard_n = sum(1 for c in s.checks if not c.ok and c.id not in SOFT_CHECK_IDS)
    soft_n = sum(1 for c in s.checks if not c.ok and c.id in SOFT_CHECK_IDS)

    if s.level < 3:
        pts = (3 - s.level) * 18
        debt += pts
        flags.append(
            {
                "id": "below_l3",
                "severity": "high",
                "pts": pts,
                "detail": f"nivel auto L{s.level} (ship gate pide ≥L2; práctica pide L3)",
            }
        )

    for c in s.checks:
        if c.ok:
            continue
        if c.id in SOFT_CHECK_IDS:
            pts = 10
            debt += pts
            flags.append(
                {
                    "id": f"soft_{c.id}",
                    "severity": "med",
                    "pts": pts,
                    "detail": c.detail or c.id,
                }
            )
        else:
            pts = 16
            debt += pts
            flags.append(
                {
                    "id": f"hard_{c.id}",
                    "severity": "high",
                    "pts": pts,
                    "detail": c.detail or c.id,
                }
            )

    # Soft floor pass: hint OK but aspirational quota missed (1 viz / bloque)
    if _check_ok(s, "viz_density_hint") and dens < DEVIL_VIZ_PER_BLOCK:
        pts = 14 if dens < 0.5 else 10
        debt += pts
        flags.append(
            {
                "id": "viz_below_block_quota",
                "severity": "med",
                "pts": pts,
                "detail": (
                    f"dens={dens:.2f} (viz={n_viz} blocks≈{n_blocks}); "
                    f"soft hint pasa, cuota aspiracional ≥{DEVIL_VIZ_PER_BLOCK:.0f}/bloque no"
                ),
            }
        )
    elif dens == 0 and n_blocks >= 4:
        # already soft-failed; reinforce
        pass

    if _defs_barely(s):
        pts = 6
        debt += pts
        flags.append(
            {
                "id": "defs_bare_minimum",
                "severity": "low",
                "pts": pts,
                "detail": _check_detail(s, "definitions_present"),
            }
        )

    if len(s.title) > DEVIL_TITLE_CHARS:
        pts = 5
        debt += pts
        flags.append(
            {
                "id": "title_portada_risk",
                "severity": "low",
                "pts": pts,
                "detail": f"título {len(s.title)} chars (> {DEVIL_TITLE_CHARS}); riesgo wrap portada",
            }
        )

    runs_n = course_runs.get(code, 0)
    files = run_files.get(code, [])
    unit_run = any(
        re.search(rf"(?:^|[-_]){re.escape(s.unit)}(?:[-_.]|$)", name, re.I)
        for name in files
    )
    if has_lab and not unit_run:
        pts = 12
        debt += pts
        flags.append(
            {
                "id": "lab_no_run_json",
                "severity": "high",
                "pts": pts,
                "detail": f"lab: en unit sin JSON en labs/{code}/runs/ que mencione {s.unit}",
            }
        )
    if has_lab and runs_n == 0:
        pts = 8
        debt += pts
        flags.append(
            {
                "id": "course_no_process_json",
                "severity": "high",
                "pts": pts,
                "detail": f"curso {code} con labs y 0 JSON en labs/{code}/runs/",
            }
        )

    # Hours fill (heuristic, all units) — big weight; L3 ≠ 4h covered
    ratio = float(hours_fill.get("fill_ratio") or 0.0)
    fill_line = format_fill_line(hours_fill)
    if hours_fill.get("deck_missing") or ratio < FILL_SEVERE:
        pts = 30  # max hours debt band (unaudited deck or << plan)
        debt += pts
        flags.append(
            {
                "id": "hours_underfill_severe",
                "severity": "high",
                "pts": pts,
                "detail": fill_line,
            }
        )
    elif ratio < FILL_MIN:
        pts = 22
        debt += pts
        flags.append(
            {
                "id": "hours_underfill",
                "severity": "high",
                "pts": pts,
                "detail": fill_line,
            }
        )

    # Manim gold still unpaid unless measured MP4 within tol
    hkey = f"{code}/{s.unit}"
    hau = hours_units.get(hkey)
    if hau is None or hau.get("dry_run") or not hau.get("measured"):
        pts = 8
        debt += pts
        flags.append(
            {
                "id": "hours_manim_unproven",
                "severity": "med",
                "pts": pts,
                "detail": (
                    "sin MP4 Manim medido (heurística interim OK; gold = hours-audit --render)"
                ),
            }
        )
    elif not hau.get("within_tol"):
        pts = 14
        debt += pts
        flags.append(
            {
                "id": "hours_manim_fail",
                "severity": "high",
                "pts": pts,
                "detail": "Manim fuera de ±20% vs plan (m_hours_fidelity)",
            }
        )

    # L4 unpaid — brand + editor never auto-green
    pts = 4
    debt += pts
    flags.append(
        {
            "id": "l4_unpaid",
            "severity": "low",
            "pts": pts,
            "detail": "L4 brand + editor pedagógico no auto-scored",
        }
    )

    debt = min(100, debt)
    flags.sort(key=lambda f: (-f["pts"], f["id"]))
    return {
        "devil_score": debt,
        "devil_grade": devil_grade(debt),
        "n_viz": n_viz,
        "n_blocks": n_blocks,
        "viz_density": round(dens, 3),
        "has_lab": has_lab,
        "lab_run_evidence": unit_run,
        "hours_planned_min": hours_fill.get("planned_min"),
        "hours_estimate_min": hours_fill.get("estimate_min"),
        "hours_fill_ratio": hours_fill.get("fill_ratio"),
        "hours_fill_pct": hours_fill.get("fill_pct"),
        "hours_underfill": bool(hours_fill.get("underfill")),
        "hours_underfill_severe": bool(hours_fill.get("underfill_severe")),
        "hours_n_content": hours_fill.get("n_content"),
        "flags": flags,
        "flag_ids": [f["id"] for f in flags],
    }


def build_objections(
    units_devil: list[dict],
    pedagogy: list[dict],
    *,
    course_runs: dict[str, int],
    hours_units: dict[str, dict],
    scores: list[UnitScore],
) -> list[dict]:
    """Top program-level objections for the adversarial dashboard."""
    objections: list[dict] = []
    n = len(units_devil) or 1

    # Hours underfill first when widespread — L3 ≠ lective hours filled
    under_n = sum(1 for u in units_devil if u.get("hours_underfill"))
    severe_n = sum(1 for u in units_devil if u.get("hours_underfill_severe"))
    ratios = [float(u.get("hours_fill_ratio") or 0) for u in units_devil]
    mean_fill = (sum(ratios) / len(ratios) * 100.0) if ratios else 0.0
    if under_n:
        worst = min(
            units_devil,
            key=lambda u: float(u.get("hours_fill_ratio") or 0),
        )
        objections.append(
            {
                "id": "hours_underfill",
                "severity": "high",
                "priority": 0,
                "title": (
                    f"Riesgo de no llenar horas: {under_n}/{n} bajo ≥{int(FILL_MIN * 100)}% "
                    f"del plan ({severe_n} severas <{int(FILL_SEVERE * 100)}%)"
                ),
                "detail": (
                    f"Heurística content→min (media fill ≈{mean_fill:.0f}%). "
                    f"Peor: {worst.get('code')}/{worst.get('unit')} "
                    f"{worst.get('hours_estimate_min')}/{worst.get('hours_planned_min')} min. "
                    "L3 shippable ≠ 4 h de clase cubiertas. Manim = gold; engrosar deck/taller."
                ),
            }
        )

    below_quota = sum(
        1 for u in units_devil if "viz_below_block_quota" in u.get("flag_ids", [])
    )
    if below_quota:
        objections.append(
            {
                "id": "viz_quota",
                "severity": "high",
                "priority": 2,
                "title": f"{below_quota}/{n} unidades bajo cuota aspiracional de viz",
                "detail": (
                    "Soft `viz_density_hint` solo falla con 0 viz y ≥4 bloques; "
                    f"el diablo exige dens ≥{DEVIL_VIZ_PER_BLOCK:.0f} viz/bloque "
                    "(AGENTS: ≥1 diagrama fuerte / ~60 min)."
                ),
            }
        )

    lab_no_run = sum(1 for u in units_devil if "lab_no_run_json" in u.get("flag_ids", []))
    if lab_no_run:
        objections.append(
            {
                "id": "lab_runs",
                "severity": "high",
                "priority": 2,
                "title": f"{lab_no_run} labs sin JSON de corrida por unidad",
                "detail": (
                    "Hay `lab:` en la unit page pero no hay artefacto en "
                    "`labs/<NN>/runs/` que evidencie process+product para esa unidad."
                ),
            }
        )

    hole_courses = [
        c
        for c, nrun in course_runs.items()
        if nrun == 0
        and any(u["code"] == c and u.get("has_lab") for u in units_devil)
    ]
    if hole_courses:
        objections.append(
            {
                "id": "course_process_hole",
                "severity": "high",
                "priority": 2,
                "title": f"Cursos con labs y 0 runs JSON: {', '.join(sorted(hole_courses))}",
                "detail": (
                    "Target §8 `m_process_product`: ≥1 JSON run/curso con labs. "
                    "Un curso en verde global no absuelve el agujero."
                ),
            }
        )

    manim_unproven = sum(
        1 for u in units_devil if "hours_manim_unproven" in u.get("flag_ids", [])
    )
    if manim_unproven:
        objections.append(
            {
                "id": "hours_manim",
                "severity": "med",
                "priority": 1,
                "title": f"Manim gold unpaid: {manim_unproven}/{n} sin MP4 medido",
                "detail": (
                    "Heurística ya marca underfill; Manim (`make hours-audit-demo RENDER=1`) "
                    "sigue siendo el estándar de fidelidad §4.10."
                ),
            }
        )

    soft_total = sum(u.get("soft_gaps", 0) for u in units_devil)
    if soft_total == 0 and below_quota >= n * 0.5:
        objections.append(
            {
                "id": "soft_too_lenient",
                "severity": "med",
                "priority": 3,
                "title": "Soft checks en 0 gaps: falso verde",
                "detail": (
                    "Cero soft ✗ no implica calidad: la barra soft es piso. "
                    "El dashboard marca deuda de piso (floor pass) aparte de L3."
                ),
            }
        )

    for m in pedagogy:
        if m.get("manual"):
            objections.append(
                {
                    "id": f"metric_{m['id']}",
                    "severity": "low",
                    "priority": 4,
                    "title": f"Métrica manual pendiente: {m['label']}",
                    "detail": m.get("note") or m.get("target") or m["id"],
                }
            )
        elif m.get("ok") is False and m["id"] != "m_hours_fidelity":
            # hours underfill already has a dedicated lead objection
            objections.append(
                {
                    "id": f"metric_{m['id']}",
                    "severity": "high",
                    "priority": 3,
                    "title": f"Meta §8 incumplida: {m['label']}",
                    "detail": f"{m.get('value')} · target {m.get('target')}",
                }
            )

    l3 = sum(1 for s in scores if s.level >= 3)
    if l3 == n:
        objections.append(
            {
                "id": "l3_not_l4",
                "severity": "med",
                "priority": 3,
                "title": f"{l3}× L3 auto ≠ listo: L4 + horas siguen sin absuelve",
                "detail": (
                    "Brand UAI + editor P1–P8 + prelectura + LaTeX §4.9 son manuales. "
                    "L3 shippable no prueba que el material llene las horas lectivas."
                ),
            }
        )

    objections.append(
        {
            "id": "equations_latex",
            "severity": "low",
            "priority": 5,
            "title": "LaTeX / ecuaciones: TODO §4.9 (sin KaTeX en clase)",
            "detail": (
                "Fórmulas deben escribirse en LaTeX ya; renderer y check "
                "`equations_latex` siguen pendientes (no gatean L2)."
            ),
        }
    )

    if not PRACTICE_AUDIT.is_file():
        objections.append(
            {
                "id": "practice_audit_missing",
                "severity": "med",
                "priority": 4,
                "title": "Sin `tmp/practice-audit.md` reciente",
                "detail": (
                    "El auditor de práctica (tip-theater vs producción) no ha "
                    "corrido o no dejó scratch; riesgo de L3 tip-like sin señal externa."
                ),
            }
        )

    sev = {"high": 0, "med": 1, "low": 2}
    objections.sort(
        key=lambda o: (sev.get(o["severity"], 9), o.get("priority", 9), o["id"])
    )
    return objections[:12]


def pedagogy_metrics_data(
    scores: list[UnitScore],
    *,
    hours_fills: list[dict] | None = None,
) -> list[dict]:
    """Soft pedagogy rates as structured rows — COMPLIANCE.md §8. No new L gates."""
    n = len(scores) or 1
    both = sum(
        1
        for s in scores
        if _check_ok(s, "outcomes_slide") and _check_ok(s, "formative_activity")
    )
    defs = sum(1 for s in scores if _check_ok(s, "definitions_present"))
    thesis = sum(1 for s in scores if _check_ok(s, "prelectura_thesis"))
    blocks_ok = sum(1 for s in scores if _check_ok(s, "blocks"))

    dens_pass = sum(1 for s in scores if _check_ok(s, "viz_density_hint"))
    dens_ratios: list[float] = []
    for s in scores:
        detail = _check_detail(s, "viz_density_hint")
        m = re.search(r"viz=(\d+)\s+blocks≈(\d+)", detail)
        if m:
            nv, nb = int(m.group(1)), int(m.group(2))
            dens_ratios.append(nv / max(nb, 1))
    dens_mean = sum(dens_ratios) / len(dens_ratios) if dens_ratios else 0.0

    lab_units = [
        s
        for s in scores
        if _check_detail(s, "lab_declared_in_deck") != "n/a (no lab: on unit)"
    ]
    lab_align = sum(1 for s in lab_units if _check_ok(s, "lab_declared_in_deck"))
    lab_n = len(lab_units)

    runs = count_lab_runs()
    runs_total = sum(runs.values())
    # Courses that promise labs (any unit with lab:) must each have ≥1 JSON run.
    lab_course_codes = sorted(
        {
            s.course.split("-", 1)[0]
            for s in scores
            if _check_detail(s, "lab_declared_in_deck") != "n/a (no lab: on unit)"
        }
    )
    lab_courses_ok = sum(1 for c in lab_course_codes if runs.get(c, 0) > 0)
    lab_courses_n = len(lab_course_codes) or 1
    courses_with_runs = sum(1 for v in runs.values() if v > 0)

    # Hours fidelity via content→min heuristic (interim); Manim gold separate
    fills = hours_fills
    if fills is None:
        unit_hours = load_program_unit_hours()
        fills = [
            hours_fill_for_unit(s, unit_hours.get((s.course, s.unit)))
            for s in scores
        ]
    fill_ok_n = sum(1 for f in fills if f.get("fill_ok"))
    mean_fill_pct = (
        sum(float(f.get("fill_pct") or 0) for f in fills) / len(fills) if fills else 0.0
    )

    def rate(k: int, d: int = n) -> float:
        return round(100.0 * k / d, 1) if d else 0.0

    def value_pct(k: int, d: int = n) -> str:
        return f"{rate(k, d):.0f}% ({k}/{d})"

    return [
        {
            "id": "m_outcomes_formative",
            "label": "Outcomes + formativa",
            "value": value_pct(both),
            "pct": rate(both),
            "target": "100%",
            "ok": both == len(scores),
            "manual": False,
        },
        {
            "id": "m_definitions",
            "label": "Definiciones",
            "value": value_pct(defs),
            "pct": rate(defs),
            "target": "100%",
            "ok": defs == len(scores),
            "manual": False,
        },
        {
            "id": "m_viz_density",
            "label": "Densidad viz",
            "value": f"mean={dens_mean:.2f}; hint {value_pct(dens_pass)}",
            "pct": round(min(100.0, dens_mean / 0.25 * 100.0), 1) if dens_mean else rate(dens_pass),
            "target": "mean ≥0.25; hint ≥80%",
            "ok": dens_mean >= 0.25 and dens_pass / n >= 0.8,
            "manual": False,
        },
        {
            "id": "m_prelectura_thesis",
            "label": "Tesis de prelectura",
            "value": value_pct(thesis),
            "pct": rate(thesis),
            "target": "≥90%",
            "ok": thesis / n >= 0.9,
            "manual": False,
        },
        {
            "id": "m_lab_deck_align",
            "label": "Lab en deck",
            "value": value_pct(lab_align, lab_n) if lab_n else "n/a (0 lab: units)",
            "pct": rate(lab_align, lab_n) if lab_n else 100.0,
            "target": "100% of lab: units",
            "ok": lab_n == 0 or lab_align == lab_n,
            "manual": False,
        },
        {
            "id": "m_blocks_structure",
            "label": "Estructura (≥3 bloques)",
            "value": value_pct(blocks_ok),
            "pct": rate(blocks_ok),
            "target": "100% (≥3 blocks)",
            "ok": blocks_ok == len(scores),
            "manual": False,
            "note": "time honesty = manual",
        },
        {
            "id": "m_process_product",
            "label": "Evidencia process+product",
            "value": (
                f"{runs_total} JSON; lab-courses ok={lab_courses_ok}/{len(lab_course_codes)}"
                f" ({', '.join(f'{k}:{v}' for k, v in sorted(runs.items())) or '∅'})"
            ),
            "pct": rate(lab_courses_ok, lab_courses_n),
            "target": "≥1 JSON run/course with labs",
            "ok": lab_courses_ok == len(lab_course_codes) and len(lab_course_codes) > 0,
            "manual": False,
            "note": (
                f"courses_with_any_run={courses_with_runs}; "
                "ok exige todos los cursos con lab: (no basta 1 curso verde)"
            ),
        },
        {
            "id": "m_hours_fidelity",
            "label": "Fidelidad de horas",
            "value": (
                f"fill≥{int(FILL_MIN * 100)}%: {value_pct(fill_ok_n)}; "
                f"media fill={mean_fill_pct:.0f}%"
            ),
            "pct": rate(fill_ok_n),
            "target": f"≥80% unidades con estimate≥{int(FILL_MIN * 100)}% del plan",
            "ok": fill_ok_n / n >= 0.8,
            "manual": False,
            "note": (
                "heurística content→min (interim); underfill/unaudited = fail hasta evidencia; "
                "Manim MP4 = gold §4.10"
            ),
        },
        {
            "id": "m_two_lane",
            "label": "Two-lane (editor P5)",
            "value": "—",
            "pct": 0.0,
            "target": "units GenAI-critical on editor rotation",
            "ok": False,
            "manual": True,
            "note": "sin evidencia de rotación editor → deuda adversaria",
        },
    ]


def pedagogy_metrics(scores: list[UnitScore]) -> list[str]:
    """Markdown block for tmp/compliance.md."""
    rows = pedagogy_metrics_data(scores)

    def mark(ok: bool | None) -> str:
        if ok is None:
            return "manual"
        return "✓" if ok else "✗ vs target"

    lines = [
        "## Pedagogy metrics",
        "",
        "Soft rates across all syllabus units (`COMPLIANCE.md` §8). Do **not** gate L2/L3.",
        "Hours: `m_hours_fidelity` = content→min heuristic (underfill = fail); Manim = gold.",
        "Manual: `m_two_lane` (editor P5) · full process+product audit.",
        "Dashboard: `/cumplimiento/` ← `src/data/compliance-snapshot.json` (`make compliance-snapshot`).",
        "",
        "| Metric | Value | Target | Status |",
        "|--------|------:|--------|--------|",
    ]
    for r in rows:
        note = f" · {r['note']}" if r.get("note") and not r.get("manual") else ""
        lines.append(
            f"| `{r['id']}` | {r['value']} | {r['target']} | {mark(r['ok'])}{note} |"
        )
    lines.append("")
    return lines


def build_snapshot(scores: list[UnitScore]) -> dict:
    """JSON for /cumplimiento/ (committed after make compliance-snapshot)."""
    by_course: dict[str, list[UnitScore]] = defaultdict(list)
    for s in scores:
        by_course[s.course].append(s)

    level_hist = {f"L{k}": 0 for k in range(4)}
    for s in scores:
        level_hist[f"L{min(s.level, 3)}"] += 1
    avg = sum(s.level for s in scores) / len(scores) if scores else 0.0

    soft_gap_counts: dict[str, int] = {cid: 0 for cid in sorted(SOFT_CHECK_IDS)}
    hard_gap_counts: dict[str, int] = defaultdict(int)
    for s in scores:
        for c in s.checks:
            if c.ok:
                continue
            if c.id in SOFT_CHECK_IDS:
                soft_gap_counts[c.id] = soft_gap_counts.get(c.id, 0) + 1
            else:
                hard_gap_counts[c.id] += 1

    course_runs = count_lab_runs()
    run_files = list_lab_run_files()
    hours_units = parse_hours_audit_units()
    unit_hours = load_program_unit_hours()
    hours_fills = [
        hours_fill_for_unit(s, unit_hours.get((s.course, s.unit))) for s in scores
    ]
    pedagogy = pedagogy_metrics_data(scores, hours_fills=hours_fills)

    units_out = []
    for s, hfill in zip(scores, hours_fills):
        failed = [
            {"id": c.id, "soft": c.id in SOFT_CHECK_IDS, "detail": c.detail}
            for c in s.checks
            if not c.ok
        ]
        hard_n = sum(1 for f in failed if not f["soft"])
        soft_n = sum(1 for f in failed if f["soft"])
        devil = score_unit_devil(
            s,
            course_runs=course_runs,
            run_files=run_files,
            hours_units=hours_units,
            hours_fill=hfill,
        )
        units_out.append(
            {
                "course": s.course,
                "code": s.course.split("-", 1)[0],
                "unit": s.unit,
                "title": s.title,
                "level": s.level,
                "failed": failed,
                "hard_gaps": hard_n,
                "soft_gaps": soft_n,
                "blockers": list(s.blockers),
                **devil,
            }
        )

    courses_summary = []
    for course in COURSES:
        ss = by_course[course]
        hist = [0, 0, 0, 0]
        for s in ss:
            hist[min(s.level, 3)] += 1
        cavg = sum(s.level for s in ss) / len(ss) if ss else 0.0
        code = course.split("-", 1)[0]
        course_units = [u for u in units_out if u["course"] == course]
        devil_avg = (
            sum(u["devil_score"] for u in course_units) / len(course_units)
            if course_units
            else 0.0
        )
        worst_u = max(course_units, key=lambda u: u["devil_score"]) if course_units else None
        courses_summary.append(
            {
                "course": course,
                "code": code,
                "units": len(ss),
                "L0": hist[0],
                "L1": hist[1],
                "L2": hist[2],
                "L3": hist[3],
                "avg": round(cavg, 2),
                "devil_avg": round(devil_avg, 1),
                "devil_max": worst_u["devil_score"] if worst_u else 0,
                "worst_unit": f"{worst_u['unit']}" if worst_u else None,
                "runs_json": course_runs.get(code, 0),
            }
        )

    # Ship-level worst (L gaps) — keep for compatibility
    worst = sorted(
        units_out,
        key=lambda u: (u["level"], -u["hard_gaps"], -u["soft_gaps"], u["course"], u["unit"]),
    )
    worst_gaps = [u for u in worst if u["hard_gaps"] or u["soft_gaps"] or u["level"] < 3][:12]

    # Adversarial ranking: highest devil debt first
    by_debt = sorted(
        units_out,
        key=lambda u: (-u["devil_score"], u["code"], u["unit"]),
    )
    top_debt = by_debt[:12]

    objections = build_objections(
        units_out,
        pedagogy,
        course_runs=course_runs,
        hours_units=hours_units,
        scores=scores,
    )

    devil_scores = [u["devil_score"] for u in units_out]
    devil_mean = sum(devil_scores) / len(devil_scores) if devil_scores else 0.0
    grade_hist = {g: 0 for g in ("A", "B", "C", "D", "F")}
    for u in units_out:
        grade_hist[u["devil_grade"]] = grade_hist.get(u["devil_grade"], 0) + 1

    flag_counts: dict[str, int] = defaultdict(int)
    for u in units_out:
        for fid in u.get("flag_ids", []):
            flag_counts[fid] += 1

    under_n = sum(1 for u in units_out if u.get("hours_underfill"))
    severe_n = sum(1 for u in units_out if u.get("hours_underfill_severe"))
    mean_fill = (
        sum(float(u.get("hours_fill_pct") or 0) for u in units_out) / len(units_out)
        if units_out
        else 0.0
    )
    n_u = len(units_out) or 1
    if under_n >= n_u * 0.5:
        verdict = (
            f"Riesgo de no llenar horas: {under_n}/{n_u} bajo ≥{int(FILL_MIN * 100)}% "
            f"del plan (media fill ≈{mean_fill:.0f}%; {severe_n} severas). "
            "L3 shippable no absuelve horas lectivas."
        )
    elif level_hist["L3"] == len(scores) and devil_mean >= 18:
        verdict = "L3 shippable con deuda estructural"
    elif level_hist["L3"] < len(scores):
        verdict = "Mezcla de niveles y deuda"
    elif level_hist["L3"] == len(scores):
        verdict = "L3 con poca deuda adversaria — sospechar soft floor"
    else:
        verdict = "Exigencia moderada"

    return {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "framework": "COMPLIANCE.md",
        "regenerate": "make compliance-snapshot",
        "dashboard": "/cumplimiento/",
        "stance": "devil",
        "stance_note": (
            "L0–L3 = shippable auto; devil_score = deuda adversaria. "
            "Horas: heurística content→min (underfill = deuda alta); Manim = gold. "
            "L3 ≠ 4 h cubiertas."
        ),
        "unit_count": len(scores),
        "levels": level_hist,
        "avg_level": round(avg, 2),
        "l3_count": level_hist["L3"],
        "soft_gap_total": sum(soft_gap_counts.values()),
        "hard_gap_total": sum(hard_gap_counts.values()),
        "soft_gap_counts": soft_gap_counts,
        "hard_gap_counts": dict(sorted(hard_gap_counts.items(), key=lambda kv: -kv[1])),
        "hours_fill": {
            "method": "content_minutes_heuristic_v1",
            "fill_min_band": FILL_MIN,
            "fill_severe_band": FILL_SEVERE,
            "underfill_n": under_n,
            "underfill_severe_n": severe_n,
            "mean_fill_pct": round(mean_fill, 1),
            "fill_ok_n": n_u - under_n,
        },
        "devil": {
            "mean_score": round(devil_mean, 1),
            "max_score": max(devil_scores) if devil_scores else 0,
            "min_score": min(devil_scores) if devil_scores else 0,
            "grade_hist": grade_hist,
            "flag_counts": dict(sorted(flag_counts.items(), key=lambda kv: -kv[1])),
            "verdict": verdict,
        },
        "objections": objections,
        "courses": courses_summary,
        "courses_by_debt": sorted(
            courses_summary, key=lambda c: (-c["devil_avg"], c["code"])
        ),
        "pedagogy": pedagogy,
        "units": units_out,
        "worst": worst_gaps,
        "top_debt": top_debt,
    }


def render_md(scores: list[UnitScore]) -> str:
    by_course: dict[str, list[UnitScore]] = defaultdict(list)
    for s in scores:
        by_course[s.course].append(s)

    lines = [
        "# Program compliance",
        "",
        "Auto-generated by `scripts/compliance_check.py`. Framework: `COMPLIANCE.md`.",
        "Levels: L0 absent/partial · L1 skeleton · L2 theory · L3 practice (+ L4 polish = manual).",
        "Soft (no level gate): `prelectura_thesis`, `title_no_path`, "
        "`lab_declared_in_deck`, `outcomes_keyword_hit`, `viz_density_hint`.",
        "",
    ]
    # summary table
    lines += ["## Summary", "", "| Course | Units | L0 | L1 | L2 | L3 | Avg |", "|---|---:|---:|---:|---:|---:|---:|"]
    for course in COURSES:
        ss = by_course[course]
        hist = [0, 0, 0, 0]
        for s in ss:
            hist[min(s.level, 3)] += 1
        avg = sum(s.level for s in ss) / len(ss) if ss else 0
        lines.append(
            f"| {course} | {len(ss)} | {hist[0]} | {hist[1]} | {hist[2]} | {hist[3]} | {avg:.2f} |"
        )
    lines.append("")

    for course in COURSES:
        lines += [f"## {course}", ""]
        for s in by_course[course]:
            fail = [c for c in s.checks if not c.ok]
            status = "OK" if not fail else f"{len(fail)} gap(s)"
            lines.append(f"### {s.unit} — {s.title} · **L{s.level}** ({status})")
            for c in s.checks:
                mark = "✓" if c.ok else "✗"
                soft = " _(soft)_" if c.id in SOFT_CHECK_IDS else ""
                extra = f" — {c.detail}" if c.detail else ""
                lines.append(f"- {mark} `{c.id}`{soft}{extra}")
            lines.append("")

    lines += pedagogy_metrics(scores)
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--strict", action="store_true", help="exit 1 if any unit < L2")
    ap.add_argument("--min-level", type=int, default=2, help="with --strict, minimum level")
    ap.add_argument(
        "--snapshot",
        action="store_true",
        help=f"also write {SNAPSHOT.relative_to(ROOT)} for /cumplimiento/",
    )
    args = ap.parse_args()

    programs = load_programs()
    overrides = load_slide_overrides()
    pages = parse_unit_pages()
    bib = load_bib_keys()
    viz_ids = load_viz_ids()

    scores: list[UnitScore] = []
    for course, units in programs.items():
        for u in units:
            scores.append(score_unit(course, u, overrides, pages, bib, viz_ids))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(render_md(scores), encoding="utf-8")

    # stdout summary
    print(f"Wrote {OUT.relative_to(ROOT)}")
    if args.snapshot:
        SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
        SNAPSHOT.write_text(
            json.dumps(build_snapshot(scores), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {SNAPSHOT.relative_to(ROOT)}")
    print(f"{'course':<28} {'unit':<5} {'L':>2}  gaps")
    print("-" * 72)
    below = []
    for s in scores:
        gaps = [c.id for c in s.checks if not c.ok]
        gap_s = ",".join(gaps[:4]) + ("…" if len(gaps) > 4 else "")
        print(f"{s.course:<28} {s.unit:<5} {s.level:>2}  {gap_s or '—'}")
        if s.level < args.min_level:
            below.append(s)

    hist = defaultdict(int)
    for s in scores:
        hist[s.level] += 1
    print("-" * 72)
    print(
        "levels:",
        " ".join(f"L{k}={hist[k]}" for k in range(4)),
        f"avg={sum(s.level for s in scores)/len(scores):.2f}",
    )

    # Soft pedagogy metrics one-liner (full table in tmp/compliance.md § Pedagogy metrics)
    n = len(scores) or 1
    both = sum(
        1
        for s in scores
        if _check_ok(s, "outcomes_slide") and _check_ok(s, "formative_activity")
    )
    defs = sum(1 for s in scores if _check_ok(s, "definitions_present"))
    thesis = sum(1 for s in scores if _check_ok(s, "prelectura_thesis"))
    dens_pass = sum(1 for s in scores if _check_ok(s, "viz_density_hint"))
    print(
        "pedagogy metrics:",
        f"outcomes+formative={both}/{n}",
        f"definitions={defs}/{n}",
        f"thesis={thesis}/{n}",
        f"viz_hint_pass={dens_pass}/{n}",
        f"runs_json={sum(count_lab_runs().values())}",
        "(see tmp/compliance.md)",
    )

    if args.strict and below:
        print(f"STRICT: {len(below)} unit(s) below L{args.min_level}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
