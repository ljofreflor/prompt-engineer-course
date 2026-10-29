#!/usr/bin/env python3
"""Taller U02: prompt versionado + suite de regresión (rúbrica eval-first)."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import chat  # noqa: E402

ROOT = Path(__file__).resolve().parent
RUNS = ROOT.parent / "runs"
RUBRIC_DIMS = ("formato", "calidad", "seguridad", "costo")


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


def score_case(c: dict, raw: str) -> dict:
    dims = {d: 0 for d in RUBRIC_DIMS}
    obj = None
    try:
        obj = json.loads(raw[raw.find("{") : raw.rfind("}") + 1])
        dims["formato"] = 1
    except Exception:
        return {"id": c["id"], "ok": False, "dims": dims, "raw": raw[:160], "obj": None}

    cat_ok = obj.get("categoria") == c.get("expect_categoria")
    abs_ok = bool(obj.get("abstener")) is c["expect_abstener"]
    dims["calidad"] = int(cat_ok)
    # Seguridad: abstención correcta en OOD/vacío; en casos in-scope, no inventar abstener=false incorrecto ya cubierto por calidad
    dims["seguridad"] = int(abs_ok)
    # Costo: presupuesto blando — respuesta no vacía y bajo techo de chars (proxy sin usage API)
    dims["costo"] = int(0 < len(raw) <= 800)

    ok = dims["formato"] == 1 and dims["calidad"] == 1 and dims["seguridad"] == 1
    return {"id": c["id"], "ok": ok, "dims": dims, "obj": obj, "raw": None}


def main() -> int:
    prompt = (ROOT / "prompts" / "v1.md").read_text().strip() + "\n"
    cases = load_cases()
    results = []
    passed = 0
    for c in cases:
        raw = chat([{"role": "user", "content": prompt + (c["input"] or "(vacío)")}], temperature=0)
        row = score_case(c, raw)
        passed += int(row["ok"])
        d = row["dims"]
        print(
            ("PASS" if row["ok"] else "FAIL"),
            c["id"],
            f"formato={d['formato']} calidad={d['calidad']} seguridad={d['seguridad']} costo={d['costo']}",
            row.get("obj") or row.get("raw"),
        )
        results.append({k: row[k] for k in ("id", "ok", "dims") if k in row})

    report = {
        "lab": "09/u02",
        "prompt": "prompts/v1.md",
        "rubric": list(RUBRIC_DIMS),
        "score": f"{passed}/{len(cases)}",
        "passed": passed == len(cases),
        "ts": datetime.now(timezone.utc).isoformat(),
        "cases": results,
    }
    RUNS.mkdir(parents=True, exist_ok=True)
    out = RUNS / "u02-regression-report.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"score {passed}/{len(cases)} prompt=v1 → {out.relative_to(ROOT.parent.parent.parent)}")
    return 0 if passed == len(cases) else 1


if __name__ == "__main__":
    raise SystemExit(main())
