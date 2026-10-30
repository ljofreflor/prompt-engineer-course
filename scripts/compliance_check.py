#!/usr/bin/env python3
"""Program compliance check for Magíster IA course materials.

Scores each syllabus unit (src/data/programs/*.json) against delivered
artifacts: unit pages, Reveal decks, theory/citations, labs, viz.

Writes: tmp/compliance.md (gitignored scratch)
Prints: summary table to stdout

Levels (per unit):
  L0 absent     — no slide override
  L1 skeleton   — deck + unit page with blocks/outcomes
  L2 theory     — Teoría + Lecturas + definitions + pedagogy signals (outcomes + formative)
  L3 practice   — lab present when declared / Lab: in deck; viz ids valid
  L4 polish     — manual (brand + pedagogy-editor critique) — not fully auto-scored here

Exit 0 always unless --strict and any unit < L2.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path

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

COURSES = [
    "08-genai-llms",
    "09-prompt-engineering",
    "10-diseno-sistemas-ia",
    "11-aiops-cloud",
]

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
        if not ok:
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
        outcomes = 0
        if "learningOutcomes:" in part:
            chunk = part.split("learningOutcomes:")[1].split("blocks:")[0]
            outcomes = len(re.findall(r'"([^"]+)"', chunk))
        out[(slug, uid)] = {
            "readings": reading_lines,
            "has_lab": has_lab,
            "n_blocks": blocks,
            "n_outcomes": outcomes,
        }
    return out


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
    return {
        "teoria": teoria,
        "lecturas": lecturas,
        "labs": lab_mentions,
        "viz": viz_ids,
        "cited": cited,
        "definitions": defs_ok,
        "definitions_detail": defs_detail,
        **ped,
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
        s.add("viz_valid", True, detail="n/a")

    # bib keys from unit readings + Lecturas slide strings
    reading_lines = list(page["readings"]) if page else []
    if deck_path.exists():
        text = deck_path.read_text(encoding="utf-8")
        reading_lines += re.findall(r'kicker:\s*"Lecturas"[\s\S]*?items:\s*\[([\s\S]*?)\]', text)
        # flatten items from that blob
        flat = []
        for blob in reading_lines[-1:]:
            if isinstance(blob, str) and "\n" in blob:
                flat.extend(re.findall(r'"([^"]+)"', blob))
        reading_lines = [x for x in reading_lines if isinstance(x, str) and "—" in x or BIB_KEY_RE.search(x or "")]
        reading_lines = (page["readings"] if page else []) + flat

    keys = extract_bib_keys_from_strings(page["readings"] if page else [])
    if deck_path.exists():
        text = deck_path.read_text(encoding="utf-8")
        # Lecturas items only
        m = re.search(r'kicker:\s*"Lecturas"[\s\S]*?items:\s*\[([\s\S]*?)\]', text)
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
    has_lab_field = bool(page and page["has_lab"])
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


def render_md(scores: list[UnitScore]) -> str:
    by_course: dict[str, list[UnitScore]] = defaultdict(list)
    for s in scores:
        by_course[s.course].append(s)

    lines = [
        "# Program compliance",
        "",
        "Auto-generated by `scripts/compliance_check.py`. Levels: L0 absent/partial · L1 skeleton · L2 theory · L3 practice (+ L4 polish = manual brand critique).",
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
                extra = f" — {c.detail}" if c.detail else ""
                lines.append(f"- {mark} `{c.id}`{extra}")
            lines.append("")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--strict", action="store_true", help="exit 1 if any unit < L2")
    ap.add_argument("--min-level", type=int, default=2, help="with --strict, minimum level")
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

    if args.strict and below:
        print(f"STRICT: {len(below)} unit(s) below L{args.min_level}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
