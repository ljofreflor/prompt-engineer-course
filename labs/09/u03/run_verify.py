#!/usr/bin/env python3
"""Taller U03: CoT breve + verificación programática del resultado numérico."""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import chat  # noqa: E402

CASES = [
    {"id": "a", "expr": "17 + 25", "expect": 42},
    {"id": "b", "expr": "9 * 8 - 3", "expect": 69},
    {"id": "c", "expr": "(100 - 40) / 5", "expect": 12},
]

PROMPT = """Tarea: calcular {expr}.
Escribí 2-3 pasos cortos y terminá con una línea exactamente así:
FINAL=<número>
No agregues texto después de FINAL.
"""


def extract_final(text: str) -> float | None:
    if not text:
        return None
    m = re.search(r"FINAL\s*=\s*(-?\d+(?:\.\d+)?)", text, re.I)
    if m:
        return float(m.group(1))
    # fallback: última línea con solo un número
    for line in reversed(text.strip().splitlines()):
        m2 = re.fullmatch(r"\s*(-?\d+(?:\.\d+)?)\s*", line)
        if m2:
            return float(m2.group(1))
    return None


def main() -> int:
    passed = 0
    for c in CASES:
        raw = chat(
            [{"role": "user", "content": PROMPT.format(expr=c["expr"])}],
            temperature=0,
            max_tokens=1024,
        )
        got = extract_final(raw or "")
        # Verificación fuera del modelo (fuente de verdad)
        prog = eval(c["expr"], {"__builtins__": {}}, {})  # noqa: S307
        model_ok = got is not None and abs(got - float(c["expect"])) < 1e-6
        verify_ok = abs(float(prog) - float(c["expect"])) < 1e-6
        ok = model_ok and verify_ok
        passed += int(ok)
        print(
            ("PASS" if ok else "FAIL"),
            c["id"],
            "model=",
            got,
            "prog=",
            prog,
            "raw=",
            (raw or "")[-120:].replace("\n", " "),
        )
    print(f"score {passed}/{len(CASES)} verify=programmatic")
    return 0 if passed == len(CASES) else 1


if __name__ == "__main__":
    raise SystemExit(main())
