#!/usr/bin/env python3
"""Taller U04: agente ReAct mínimo con tools sandbox y topes duros."""

from __future__ import annotations

import json
import math
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import chat  # noqa: E402

MAX_STEPS = 8
MAX_SECONDS = 60
SANDBOX = Path(__file__).resolve().parent / "sandbox"
SANDBOX.mkdir(exist_ok=True)
(SANDBOX / "readme.txt").write_text("archivo de prueba del lab U04\n", encoding="utf-8")


def tool_calculator(expr: str) -> str:
    allowed = set("0123456789+-*/().% ")
    if not expr or any(c not in allowed for c in expr):
        return "error: expresión no permitida"
    try:
        return str(eval(expr, {"__builtins__": {}}, {"math": math}))  # noqa: S307
    except Exception as exc:  # noqa: BLE001
        return f"error: {exc}"


def tool_file_read(name: str) -> str:
    path = (SANDBOX / Path(name).name).resolve()
    if not str(path).startswith(str(SANDBOX.resolve())):
        return "error: path fuera de sandbox"
    if not path.exists():
        return "error: no existe"
    return path.read_text(encoding="utf-8")[:2000]


TOOLS = {
    "calculator": tool_calculator,
    "file_read": tool_file_read,
}

SYSTEM = """Sos un agente con herramientas. Formato estricto por turno:
Thought: ...
Action: <calculator|file_read|finish>
Action Input: <texto>

Tools:
- calculator: expresión aritmética simple
- file_read: nombre de archivo en sandbox
- finish: respuesta final al usuario

No inventes resultados de tools. Si fallan, reportalo.
"""


def parse(text: str) -> tuple[str, str]:
    action = re.search(r"Action:\s*(\w+)", text)
    inp = re.search(r"Action Input:\s*(.*)", text, re.S)
    return (action.group(1).strip() if action else ""), (inp.group(1).strip() if inp else "")


def main() -> int:
    goal = sys.argv[1] if len(sys.argv) > 1 else "Leé readme.txt y sumá 17+25. Respondé en una frase."
    messages = [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": goal},
    ]
    t0 = time.time()
    for step in range(1, MAX_STEPS + 1):
        if time.time() - t0 > MAX_SECONDS:
            print("STOP: timeout")
            return 2
        out = chat(messages, temperature=0, max_tokens=400)
        print(f"\n--- step {step} ---\n{out}")
        action, arg = parse(out)
        messages.append({"role": "assistant", "content": out})
        if action == "finish":
            print("\nFINAL:", arg)
            return 0
        if action not in TOOLS:
            obs = f"error: acción desconocida '{action}'"
        else:
            obs = TOOLS[action](arg)
        print("Observation:", obs)
        messages.append({"role": "user", "content": f"Observation: {obs}"})
    print("STOP: max steps")
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
