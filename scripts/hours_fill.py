#!/usr/bin/env python3
"""Content→minutes heuristic for lective-hours fill (COMPLIANCE §4.10).

Conservative projection estimate from Reveal deck structure. Short decks cannot
claim a full session (often 240 min). Manim timed sim remains the gold standard;
this heuristic is the interim evidence for every unit 08–11.

Does not invent Manim rows. Does not gate L2/L3.
"""

from __future__ import annotations

import re
from pathlib import Path

# Band: estimate must reach this fraction of planned minutes or unit is hours debt.
FILL_MIN = 0.75
# Severe underfill (devil: max hours debt band).
FILL_SEVERE = 0.50

# Conservative minutes per slide type (projection / teaching pace, not silent skim).
# Title/section = chrome (low weight). Devil: prefer under-estimate over optimism.
MIN_BY_TYPE: dict[str, float] = {
    "title": 1.0,
    "section": 1.5,
    "bullets": 4.0,
    "prose": 5.0,
    "viz": 6.0,
    "image": 3.0,
}
MIN_UNKNOWN = 3.0
# One workshop bump if deck signals Lab / Taller / Eval / Entregable (not per occurrence).
LAB_WORKSHOP_BONUS = 18.0

TYPE_RE = re.compile(r'type:\s*"(\w+)"')
LAB_SIGNAL_RE = re.compile(
    r'(?:Lab:|kicker:\s*"(?:Taller|Eval|Entregable|Lab)")',
    re.I,
)

ASSUMPTIONS_MD = """\
### Heuristic assumptions (strict)

| Slide type | Minutes | Rationale |
|------------|--------:|-----------|
| `title` | 1.0 | Chrome / portada |
| `section` | 1.5 | Block divider (not a full teaching beat) |
| `bullets` | 4.0 | One idea + brief discussion |
| `prose` | 5.0 | Longer read-aloud / framing |
| `viz` | 6.0 | Diagram teach-through |
| `image` | 3.0 | Brief visual |
| Lab/Taller/Eval signal | +18 once | Workshop floor if formative signal present |

- Planned = `unidades[].hours × 60` (fallback: session block minutes).
- **Underfill** if `estimate / planned < 75%`; **severe** if `< 50%`.
- Missing deck ⇒ estimate 0 ⇒ max hours debt.
- Heuristic is interim; Manim MP4 within ±20% is gold (`scripts/hours_audit.py`).
"""


def count_slide_types(deck_text: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for m in TYPE_RE.finditer(deck_text):
        t = m.group(1)
        counts[t] = counts.get(t, 0) + 1
    return counts


def estimate_from_counts(
    counts: dict[str, int],
    *,
    lab_signal: bool,
) -> dict:
    """Return estimated minutes + breakdown from type counts."""
    parts: dict[str, float] = {}
    total = 0.0
    for t, n in sorted(counts.items()):
        m = MIN_BY_TYPE.get(t, MIN_UNKNOWN) * n
        parts[t] = round(m, 1)
        total += m
    if lab_signal:
        parts["lab_workshop_bonus"] = LAB_WORKSHOP_BONUS
        total += LAB_WORKSHOP_BONUS
    content_n = sum(n for t, n in counts.items() if t not in ("title", "section"))
    chrome_n = counts.get("title", 0) + counts.get("section", 0)
    return {
        "estimate_min": round(total, 1),
        "breakdown": parts,
        "n_slides": sum(counts.values()),
        "n_content": content_n,
        "n_chrome": chrome_n,
        "lab_signal": lab_signal,
        "counts": counts,
    }


def estimate_deck_minutes(deck_path: Path | None) -> dict:
    """Estimate lective minutes from a deck `.ts` file (or missing → 0)."""
    if deck_path is None or not deck_path.is_file():
        return {
            "estimate_min": 0.0,
            "breakdown": {},
            "n_slides": 0,
            "n_content": 0,
            "n_chrome": 0,
            "lab_signal": False,
            "counts": {},
            "deck_missing": True,
        }
    text = deck_path.read_text(encoding="utf-8")
    out = estimate_from_counts(count_slide_types(text), lab_signal=bool(LAB_SIGNAL_RE.search(text)))
    out["deck_missing"] = False
    return out


def planned_minutes(unit: dict) -> float:
    """Planned lective minutes from program unit JSON."""
    hours = unit.get("hours")
    if hours is not None:
        try:
            return float(hours) * 60.0
        except (TypeError, ValueError):
            pass
    session = unit.get("session") or []
    block_re = re.compile(r"\((\d+)\s*min\)", re.I)
    mins = 0.0
    for line in session:
        m = block_re.search(str(line))
        mins += float(m.group(1)) if m else 60.0
    return mins if mins > 0 else 240.0


def fill_report(deck_path: Path | None, unit: dict) -> dict:
    """Full fill report: planned vs estimate, underfill flags."""
    planned = planned_minutes(unit)
    est = estimate_deck_minutes(deck_path)
    estimate = float(est["estimate_min"])
    ratio = (estimate / planned) if planned > 0 else 0.0
    underfill = ratio < FILL_MIN
    severe = ratio < FILL_SEVERE
    return {
        "planned_min": round(planned, 1),
        "estimate_min": estimate,
        "fill_ratio": round(ratio, 4),
        "fill_pct": round(100.0 * ratio, 1),
        "underfill": underfill,
        "underfill_severe": severe,
        "fill_ok": not underfill,
        "fill_min_band": FILL_MIN,
        "n_slides": est["n_slides"],
        "n_content": est["n_content"],
        "n_chrome": est["n_chrome"],
        "lab_signal": est["lab_signal"],
        "deck_missing": est.get("deck_missing", False),
        "breakdown": est["breakdown"],
        "counts": est["counts"],
        "method": "content_minutes_heuristic_v1",
    }


def format_fill_line(rep: dict) -> str:
    flag = (
        "SEVERE underfill"
        if rep["underfill_severe"]
        else ("underfill" if rep["underfill"] else "ok")
    )
    return (
        f"{rep['estimate_min']:.0f}/{rep['planned_min']:.0f} min "
        f"({rep['fill_pct']:.0f}% · {flag}; band ≥{int(FILL_MIN * 100)}%)"
    )
