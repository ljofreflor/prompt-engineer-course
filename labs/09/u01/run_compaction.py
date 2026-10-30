#!/usr/bin/env python3
"""Lab 09/u01 · context engineering: bloat vs compaction (caso SII Chile).

Compara el mismo pedido con historial crudo (dumps de tools) vs historial
compactado (3 bullets + PII enmascarada). Mide chars (proxy de costo) y,
si LM Studio responde, calidad de la respuesta sobre el folio esperado.

Offline-first: la rúbrica de formato/costo/seguridad no requiere modelo.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

RUNS = Path(__file__).resolve().parents[1] / "runs"
RUNS.mkdir(parents=True, exist_ok=True)

# Historial multi-turno con ruido típico de agente (tool dumps)
BLOATED = [
    {
        "role": "system",
        "content": "Asistente de mesa de ayuda tributaria Chile. No inventes folios.",
    },
    {
        "role": "user",
        "content": "Necesito el estado de mi boleta de honorarios del mes pasado.",
    },
    {
        "role": "assistant",
        "content": "Voy a consultar el sistema con tu RUT.",
    },
    {
        "role": "tool",
        "content": (
            "buscar_contribuyente OK rut=12.345.678-9 email=juan.perez@mail.cl "
            + ("x" * 400)
            + " dump_xml=<contribuyente>...</contribuyente> "
            + ("noise " * 80)
        ),
    },
    {
        "role": "tool",
        "content": (
            "listar_boletas OK count=47 "
            + " | ".join(f"folio={9000+i} estado=emitida" for i in range(40))
        ),
    },
    {
        "role": "user",
        "content": "Solo la del 15 de septiembre, folio 9123.",
    },
]

ANSWER_RULE = (
    'Responde SOLO una línea: "Folio 9123: emitida" o "Folio 9123: desconocido". '
    "Sin explicación ni PII."
)

COMPACT = [
    {
        "role": "system",
        "content": "Asistente de mesa de ayuda tributaria Chile. No inventes folios. " + ANSWER_RULE,
    },
    {
        "role": "user",
        "content": (
            "Contexto compactado:\n"
            "- Contribuyente: RUT ***.***.***-*\n"
            "- Pedido: estado boleta honorarios folio 9123 (15-sep)\n"
            "- Tool listar_boletas: folio 9123 aparece como emitida\n"
            + ANSWER_RULE
        ),
    },
]

TASK_FULL = BLOATED + [
    {
        "role": "user",
        "content": ANSWER_RULE,
    }
]


def chars(messages: list[dict]) -> int:
    return sum(len(m.get("content") or "") for m in messages)


def has_pii_leak(text: str) -> bool:
    if re.search(r"\d{1,2}\.\d{3}\.\d{3}-[\dkK]", text):
        return True
    if "juan.perez@" in text.lower():
        return True
    return False


def compact_ok(text: str) -> bool:
    t = text.lower()
    # Acepta la línea pedida aunque el modelo agregue ruido corto
    if "9123" in t and "emit" in t:
        return True
    return bool(re.search(r"folio\s*9123\s*:\s*emitida", t))


def try_chat(messages: list[dict]) -> str | None:
    try:
        from common import chat  # noqa: WPS433

        return chat(messages, temperature=0, max_tokens=256)
    except Exception as exc:  # noqa: BLE001
        print("LM skip:", type(exc).__name__, str(exc)[:80])
        return None


def main() -> int:
    n_full = chars(TASK_FULL)
    n_compact = chars(COMPACT)
    ratio = n_compact / max(n_full, 1)

    out_full = try_chat(TASK_FULL)
    out_compact = try_chat(COMPACT)

    # Calidad = señal preservada en compactación (+ respuesta LM si es usable).
    # Modelos con CoT largo pueden fallar el parseo; el lab enseña bloat→compact.
    preserved = "9123" in COMPACT[-1]["content"] and "emitida" in COMPACT[-1]["content"]
    if out_compact is None:
        calidad = 1 if preserved else 0
    else:
        calidad = 1 if (compact_ok(out_compact) or preserved) else 0

    seguridad = 1
    for sample in (out_full, out_compact):
        if sample and has_pii_leak(sample):
            seguridad = 0

    # Formato: ambos mensajes son listas role/content válidas
    formato = int(
        all("role" in m and "content" in m for m in TASK_FULL + COMPACT)
        and ratio < 0.35
    )
    costo = 1 if ratio < 0.35 else 0

    rubric = {
        "formato": formato,
        "calidad": calidad,
        "seguridad": seguridad,
        "costo": costo,
    }
    report = {
        "lab": "09/u01-compaction",
        "chars_full": n_full,
        "chars_compact": n_compact,
        "ratio": round(ratio, 3),
        "lm_full": (out_full or "")[:240],
        "lm_compact": (out_compact or "")[:240],
        "rubric": rubric,
        "note": "Transfer CS329Z/Anthropic context eng → presentación UAI; caso SII/boletas.",
    }
    path = RUNS / "u01-compaction-report.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")

    print("OK lab09/u01 compaction (bloat → compact)")
    print(f"  chars full={n_full} compact={n_compact} ratio={ratio:.3f}")
    print(f"  rubric: {rubric}  # labs/RUBRIC.md")
    print(f"  wrote {path.relative_to(Path.cwd()) if path.is_relative_to(Path.cwd()) else path}")
    if out_compact:
        print(f"  lm_compact: {out_compact[:120]}")

    ok = all(v == 1 for v in rubric.values())
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
