#!/usr/bin/env python3
"""Taller U02: prompt versionado + suite de regresión."""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import chat  # noqa: E402

ROOT = Path(__file__).resolve().parent


def load_cases():
    # YAML mínimo sin dependencia PyYAML
    text = (ROOT / "cases.yaml").read_text()
    cases = []
    cur = None
    for line in text.splitlines():
        if line.strip().startswith("- id:"):
            if cur:
                cases.append(cur)
            cur = {"id": line.split(":", 1)[1].strip()}
        elif cur and ":" in line:
            k, v = line.strip().split(":", 1)
            cur[k] = v.strip().strip('"')
    if cur:
        cases.append(cur)
    for c in cases:
        c["expect_abstener"] = c.get("expect_abstener") == "true"
        c["input"] = "" if c.get("input") == '""' or c.get("input") == "" else c.get("input", "")
    return cases


def main() -> int:
    prompt = (ROOT / "prompts" / "v1.md").read_text().strip() + "\n"
    cases = load_cases()
    passed = 0
    for c in cases:
        raw = chat([{"role": "user", "content": prompt + (c["input"] or "(vacío)")}], temperature=0)
        try:
            obj = json.loads(raw[raw.find("{") : raw.rfind("}") + 1])
        except Exception:
            print("FAIL", c["id"], "parse", raw[:100])
            continue
        ok = (
            obj.get("categoria") == c.get("expect_categoria")
            and bool(obj.get("abstener")) is c["expect_abstener"]
        )
        passed += int(ok)
        print(("PASS" if ok else "FAIL"), c["id"], obj)
    print(f"score {passed}/{len(cases)} prompt=v1")
    return 0 if passed == len(cases) else 1


if __name__ == "__main__":
    raise SystemExit(main())
