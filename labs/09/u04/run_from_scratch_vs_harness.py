#!/usr/bin/env python3
"""Lab 09/u04 · from-scratch vs harness (transfer CS329Z).

No llama al modelo: compara dos superficies de agente sobre la misma tarea
(consulta ClaveÚnica / estado de trámite) y exige que el alumno declare
cuándo conviene harness (LangGraph/smolagents) vs bucle ReAct propio.

Rúbrica: formato (JSON de decisión), calidad (criterios presentes),
seguridad (sandbox/HITL nombrados), costo (presupuesto de pasos).
"""

from __future__ import annotations

import json
from pathlib import Path

RUNS = Path(__file__).resolve().parents[1] / "runs"
RUNS.mkdir(parents=True, exist_ok=True)

TASK = {
    "caso": "Ciudadano pregunta estado de trámite ClaveÚnica; hay tool `consultar_estado(id)`.",
    "from_scratch": {
        "loop": "Thought → Action → Observation (máx 4 pasos)",
        "tools": ["consultar_estado"],
        "pros": ["control total", "fácil de auditar", "sin vendor lock"],
        "cons": ["reimplementar retries/timeouts", "sin graph viz"],
    },
    "harness": {
        "loop": "grafo tipado (nodos plan / act / end) vía framework",
        "tools": ["consultar_estado", "escalar_humano"],
        "pros": ["retries/observabilidad de fábrica", "multi-nodo claro"],
        "cons": ["acoplamiento al framework", "opacidad si no se lee el grafo"],
    },
}

# Decisión de referencia del programa (última capa UAI): start from-scratch,
# adoptar harness cuando el grafo supera ~3 nodos o hay multiagente.
DECISION = {
    "elegir": "from_scratch",
    "hasta_que": "el flujo necesite >3 nodos, branching o multiagente",
    "entonces": "harness (después de demostrar ReAct a mano)",
    "seguridad": ["sandbox de tools", "HITL si id inválido o PII"],
    "presupuesto_pasos": 4,
}


def main() -> int:
    rubric = {
        "formato": 1,  # JSON reproducible
        "calidad": 1 if DECISION["elegir"] in {"from_scratch", "harness"} else 0,
        "seguridad": 1 if DECISION["seguridad"] else 0,
        "costo": 1 if DECISION["presupuesto_pasos"] <= 6 else 0,
    }
    report = {
        "lab": "09/u04-from-scratch-vs-harness",
        "task": TASK,
        "decision": DECISION,
        "rubric": rubric,
        "note": "Transfer CS329Z: frameworks after from-scratch. Caso ClaveÚnica.",
    }
    path = RUNS / "u04-from-scratch-vs-harness.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print("OK lab09/u04 from-scratch vs harness")
    print(f"  choose={DECISION['elegir']} until={DECISION['hasta_que']}")
    print(f"  rubric: {rubric}  # labs/RUBRIC.md")
    print(f"  wrote {path}")
    return 0 if all(v == 1 for v in rubric.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
