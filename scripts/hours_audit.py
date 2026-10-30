#!/usr/bin/env python3
"""Validate planned lecture hours via a timed Manim simulation (scaffold).

Source of truth: src/data/programs/<course>.json → unidades[].hours + session[].
Report: tmp/hours-audit.md  · media: tmp/hours/  (gitignored)

Does not invent audits: dry-run always writes the plan; --render only if Manim works.
See COMPLIANCE.md §4.10 and labs/hours/README.md.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROGRAMS = ROOT / "src" / "data" / "programs"
SCENE_FILE = ROOT / "labs" / "hours" / "scenes" / "hours_timeline.py"
REPORT = ROOT / "tmp" / "hours-audit.md"
MEDIA_DIR = ROOT / "tmp" / "hours"

# Draft tolerance (COMPLIANCE §4.10)
TOLERANCE = 0.20
# Demo scale: 1 s video ≈ 1 planned lecture minute
SEC_PER_PLANNED_MIN = 1.0
# Approximate Manim fade overhead per card (enter+exit) + header
OVERHEAD_SEC_PER_CARD = 0.6
OVERHEAD_SEC_HEADER = 0.7

COURSE_FILES = {
    "08": "08-genai-llms.json",
    "09": "09-prompt-engineering.json",
    "10": "10-diseno-sistemas-ia.json",
    "11": "11-aiops-cloud.json",
}

BLOCK_MIN_RE = re.compile(r"\((\d+)\s*min\)", re.I)


def load_unit(course: str, unit_id: str) -> dict:
    fname = COURSE_FILES.get(course)
    if not fname:
        raise SystemExit(f"Unknown course {course!r}; expected one of {sorted(COURSE_FILES)}")
    path = PROGRAMS / fname
    data = json.loads(path.read_text(encoding="utf-8"))
    for u in data.get("unidades", []):
        if str(u.get("id", "")).lower() == unit_id.lower():
            return {"program": path.name, "asignatura": data.get("asignatura", ""), "unit": u}
    raise SystemExit(f"Unit {unit_id!r} not found in {path}")


def parse_session_blocks(session: list[str]) -> list[tuple[str, float]]:
    blocks: list[tuple[str, float]] = []
    for line in session:
        m = BLOCK_MIN_RE.search(line)
        mins = float(m.group(1)) if m else 60.0
        title = line.strip()
        if len(title) > 72:
            title = title[:69] + "…"
        blocks.append((title, mins))
    return blocks


def expected_video_seconds(minutes: list[float]) -> float:
    holds = sum(max(0.5, m) * SEC_PER_PLANNED_MIN for m in minutes)
    return holds + OVERHEAD_SEC_HEADER + OVERHEAD_SEC_PER_CARD * len(minutes)


def manim_available() -> bool:
    return shutil.which("manim") is not None


def ffprobe_duration(path: Path) -> float | None:
    if not path.is_file() or not shutil.which("ffprobe"):
        return None
    try:
        out = subprocess.check_output(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(path),
            ],
            text=True,
        ).strip()
        return float(out)
    except (subprocess.CalledProcessError, ValueError):
        return None


def write_report(
    *,
    course: str,
    unit_id: str,
    program_name: str,
    unit_title: str,
    planned_hours: float,
    blocks: list[tuple[str, float]],
    rendered: bool,
    mp4: Path | None,
    measured_sec: float | None,
    expected_sec: float,
) -> None:
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    block_sum_min = sum(m for _, m in blocks)
    planned_min = planned_hours * 60.0
    # Fidelity compares sim video duration (scaled) to expected scaled plan
    sim_sec = measured_sec if measured_sec is not None else expected_sec
    drift = abs(sim_sec - expected_sec) / expected_sec if expected_sec else 0.0
    within = drift <= TOLERANCE
    status = "PASS" if within else "FAIL"
    if measured_sec is None and not rendered:
        status = "DRY-RUN (expected duration only; no MP4)"

    lines = [
        "# Hours audit (Manim simulation)",
        "",
        f"- Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}",
        f"- Course/unit: **{course}/{unit_id}** — {unit_title}",
        f"- Program file: `{program_name}`",
        f"- Planned lective hours (JSON `hours`): **{planned_hours}** ({planned_min:.0f} min)",
        f"- Session blocks sum: **{block_sum_min:.0f} min** ({len(blocks)} blocks)",
        f"- Scale: 1 s video ≈ 1 planned min (demo)",
        f"- Tolerance (draft): ±{int(TOLERANCE * 100)}%",
        f"- Metric: `m_hours_fidelity` (COMPLIANCE §4.10 / §8)",
        "",
        "## Blocks",
        "",
    ]
    for i, (title, mins) in enumerate(blocks, 1):
        lines.append(f"{i}. **{mins:.0f} min** — {title}")
    lines += [
        "",
        "## Duration",
        "",
        f"| Quantity | Value |",
        f"|----------|------:|",
        f"| Expected sim (s) | {expected_sec:.1f} |",
        f"| Measured MP4 (s) | {measured_sec if measured_sec is not None else '—'} |",
        f"| Drift vs expected | {drift:.1%} |",
        f"| Within ±{int(TOLERANCE * 100)}% | {within} |",
        f"| Status | {status} |",
        "",
        f"Media: `{mp4.relative_to(ROOT)}`" if mp4 and mp4.is_file() else "Media: _(none — dry-run or render skipped)_",
        "",
        "## Notes",
        "",
        "- This report is evidence only when produced by this script; do not invent rows.",
        "- Block-sum vs `hours` mismatch is a separate syllabus sanity check (manual).",
        "- Full 1:1 wall-clock fidelity is out of scope for CI; use local long renders later.",
        "",
    ]
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {REPORT.relative_to(ROOT)}")
    print(f"Status: {status}")


def run_manim(label: str, titles: list[str], minutes: list[float]) -> Path | None:
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    env = os.environ.copy()
    env["HOURS_AUDIT_LABEL"] = label
    env["HOURS_AUDIT_TITLES"] = json.dumps(titles, ensure_ascii=False)
    env["HOURS_AUDIT_MINUTES"] = json.dumps(minutes)
    # manim writes under media/; we point -o and then copy
    cmd = [
        "manim",
        "-ql",  # low quality, fast
        "--media_dir",
        str(MEDIA_DIR / "manim_media"),
        str(SCENE_FILE),
        "HoursTimeline",
    ]
    print("Running:", " ".join(cmd))
    try:
        subprocess.check_call(cmd, cwd=str(ROOT), env=env)
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"Manim render failed: {e}", file=sys.stderr)
        return None

    # Find newest mp4 under media dir
    mp4s = sorted(MEDIA_DIR.rglob("*.mp4"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not mp4s:
        return None
    dest = MEDIA_DIR / f"{label.replace('/', '-')}.mp4"
    shutil.copy2(mp4s[0], dest)
    return dest


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--course", default="08", help="Course id: 08|09|10|11")
    ap.add_argument("--unit", default="u01", help="Unit id, e.g. u01")
    ap.add_argument("--render", action="store_true", help="Invoke Manim if installed")
    ap.add_argument("--titles", nargs="*", help="Override card titles")
    ap.add_argument("--minutes", nargs="*", type=float, help="Override planned minutes per card")
    args = ap.parse_args()

    loaded = load_unit(args.course, args.unit)
    unit = loaded["unit"]
    session = unit.get("session") or []
    blocks = parse_session_blocks(session)
    if args.titles and args.minutes:
        if len(args.titles) != len(args.minutes):
            raise SystemExit("--titles and --minutes must have the same length")
        blocks = list(zip(args.titles, args.minutes))
    elif args.titles or args.minutes:
        raise SystemExit("Provide both --titles and --minutes, or neither")

    if not blocks:
        # Fallback: one card per planned hour
        hours = float(unit.get("hours") or 4)
        blocks = [(f"Bloque {i} (placeholder)", 60.0) for i in range(1, int(hours) + 1)]

    titles = [t for t, _ in blocks]
    minutes = [m for _, m in blocks]
    planned_hours = float(unit.get("hours") or (sum(minutes) / 60.0))
    expected_sec = expected_video_seconds(minutes)
    label = f"{args.course}/{args.unit}"

    mp4: Path | None = None
    measured: float | None = None
    rendered = False

    if args.render:
        if not manim_available():
            print(
                "Manim not found on PATH. Install: python3 -m pip install 'manim>=0.18'\n"
                "Writing dry-run report only.",
                file=sys.stderr,
            )
        else:
            mp4 = run_manim(label, titles, minutes)
            rendered = mp4 is not None
            if mp4:
                measured = ffprobe_duration(mp4)

    write_report(
        course=args.course,
        unit_id=args.unit,
        program_name=loaded["program"],
        unit_title=unit.get("title", ""),
        planned_hours=planned_hours,
        blocks=blocks,
        rendered=rendered,
        mp4=mp4,
        measured_sec=measured,
        expected_sec=expected_sec,
    )


if __name__ == "__main__":
    main()
