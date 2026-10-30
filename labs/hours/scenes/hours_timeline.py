"""Manim stub: title cards timed to planned lecture minutes.

Scale (demo): 1 second of video ≈ 1 planned lecture minute
(see labs/hours/README.md and COMPLIANCE.md §4.10).

Env (set by scripts/hours_audit.py):
  HOURS_AUDIT_TITLES   — JSON list of strings
  HOURS_AUDIT_MINUTES  — JSON list of numbers (planned minutes per card)
  HOURS_AUDIT_LABEL    — unit label for the header
"""

from __future__ import annotations

import json
import os

from manim import BLUE, ORIGIN, UP, WHITE, FadeIn, FadeOut, Scene, Text, VGroup


def _load_plan() -> tuple[str, list[str], list[float]]:
    label = os.environ.get("HOURS_AUDIT_LABEL", "unit")
    titles = json.loads(os.environ.get("HOURS_AUDIT_TITLES", '["Bloque 1"]'))
    minutes = json.loads(os.environ.get("HOURS_AUDIT_MINUTES", "[60]"))
    if len(titles) != len(minutes):
        raise ValueError("titles and minutes length mismatch")
    return label, titles, [float(m) for m in minutes]


class HoursTimeline(Scene):
    """Placeholder timeline: one card per block, held for planned minutes (scaled)."""

    def construct(self) -> None:
        label, titles, minutes = _load_plan()
        header = Text(f"Horas lectivas · {label}", font_size=28, color=BLUE)
        header.to_edge(UP)
        self.play(FadeIn(header), run_time=0.4)

        for title, mins in zip(titles, minutes):
            hold = max(0.5, mins)  # 1 s ≈ 1 planned minute
            card = VGroup(
                Text(title, font_size=36, color=WHITE),
                Text(f"plan: {mins:.0f} min lectivos", font_size=22, color=BLUE),
            ).arrange(DOWN, buff=0.35)
            card.move_to(ORIGIN)
            self.play(FadeIn(card), run_time=0.35)
            self.wait(hold)
            self.play(FadeOut(card), run_time=0.25)

        self.play(FadeOut(header), run_time=0.3)
