#!/usr/bin/env python3
"""Lab 08/u01: sondear temperatura vs diversidad (API OpenAI-compatible)."""

from __future__ import annotations

import json
import os
import statistics
import sys
import urllib.request
from collections import Counter

BASE = os.environ.get("OPENAI_BASE_URL", "http://localhost:1234/v1").rstrip("/")
KEY = os.environ.get("OPENAI_API_KEY", "lm-studio")
MODEL = os.environ.get("OPENAI_MODEL", "google/gemma-4-e4b")
PROMPT = "Completá en una sola palabra (español): El color del cielo despejado de día es"


def complete(temperature: float) -> str:
    payload = {
        "model": MODEL,
        "temperature": temperature,
        "max_tokens": 16,
        "messages": [{"role": "user", "content": PROMPT}],
    }
    req = urllib.request.Request(
        f"{BASE}/chat/completions",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read().decode())
    msg = body["choices"][0]["message"]
    text = (msg.get("content") or msg.get("reasoning_content") or "").strip()
    # primera "palabra" alfanumérica
    for token in text.replace("\n", " ").split():
        clean = "".join(ch for ch in token.lower() if ch.isalpha())
        if clean:
            return clean
    return text[:40]


def main() -> int:
    temps = [0.0, 0.7, 1.2]
    n = 5
    report: dict[str, object] = {"model": MODEL, "base": BASE, "runs": {}}
    for t in temps:
        outs = [complete(t) for _ in range(n)]
        uniq = len(set(outs))
        report["runs"][str(t)] = {"outputs": outs, "unique": uniq, "top": Counter(outs).most_common(3)}
        print(f"T={t} unique={uniq}/{n} sample={outs}")
    print(json.dumps({"model": MODEL, "temps": list(report["runs"].keys())}, ensure_ascii=False))
    path = os.environ.get("OUT")
    if path:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print("wrote", path)
    # sanity: T=0 debería ser más estable que T=1.2 en promedio de unique
    u0 = report["runs"]["0.0"]["unique"]  # type: ignore[index]
    u12 = report["runs"]["1.2"]["unique"]  # type: ignore[index]
    print(f"stability_ok={u0 <= u12} (unique@0={u0} unique@1.2={u12})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
