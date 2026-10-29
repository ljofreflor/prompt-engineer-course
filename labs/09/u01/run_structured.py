#!/usr/bin/env python3
"""Taller U01: salida estructurada + validación + abstención."""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import chat  # noqa: E402

PROMPT = """Sos un clasificador de tickets de soporte.
Respondé SOLO con JSON válido de este esquema:
{"categoria":"facturacion|tecnico|otro","confianza":0.0-1.0,"abstener":true|false,"motivo":"string"}
Si el mensaje no es un ticket de soporte, poné abstener=true y categoria="otro".
No inventes datos.
Ticket:
"""

CASES = [
    ("No me llegó la factura de marzo", False),
    ("El VPN corta a los 5 minutos", False),
    ("¿Cuál es la capital de Francia?", True),
    ("", True),
]


def valid(obj: dict) -> bool:
    return (
        isinstance(obj, dict)
        and obj.get("categoria") in {"facturacion", "tecnico", "otro"}
        and isinstance(obj.get("confianza"), (int, float))
        and isinstance(obj.get("abstener"), bool)
        and isinstance(obj.get("motivo"), str)
    )


def main() -> int:
    ok = 0
    for text, expect_abs in CASES:
        raw = chat([{"role": "user", "content": PROMPT + (text or "(vacío)")}], temperature=0)
        try:
            start, end = raw.find("{"), raw.rfind("}")
            obj = json.loads(raw[start : end + 1])
        except Exception:
            print("PARSE FAIL", text[:40], "→", raw[:120])
            continue
        good = valid(obj) and (obj["abstener"] is expect_abs)
        ok += int(good)
        print(("PASS" if good else "FAIL"), text[:40], obj)
    print(f"score {ok}/{len(CASES)}")
    return 0 if ok == len(CASES) else 1


if __name__ == "__main__":
    raise SystemExit(main())
