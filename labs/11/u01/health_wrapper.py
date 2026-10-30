#!/usr/bin/env python3
"""Lab 11/u01: healthcheck mínimo contra LM Studio / Ollama (OpenAI-compatible)."""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request

BASE = os.environ.get("OPENAI_BASE_URL", "http://localhost:1234/v1").rstrip("/")
KEY = os.environ.get("OPENAI_API_KEY", "lm-studio")
MODEL = os.environ.get("OPENAI_MODEL", "google/gemma-4-e4b")
VERSION = "0.1.0-lab11-u01"


def get(path: str) -> tuple[int, dict | list | str, float]:
    req = urllib.request.Request(
        f"{BASE}{path}",
        headers={"Authorization": f"Bearer {KEY}"},
    )
    t0 = time.perf_counter()
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode()
        ms = (time.perf_counter() - t0) * 1000
        try:
            return resp.status, json.loads(body), ms
        except json.JSONDecodeError:
            return resp.status, body, ms


def chat_probe() -> float:
    payload = json.dumps(
        {
            "model": MODEL,
            "temperature": 0,
            "max_tokens": 8,
            "messages": [{"role": "user", "content": "Respondé: ok"}],
        }
    ).encode()
    req = urllib.request.Request(
        f"{BASE}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    t0 = time.perf_counter()
    with urllib.request.urlopen(req, timeout=60) as resp:
        resp.read()
        return (time.perf_counter() - t0) * 1000


def main() -> int:
    try:
        status, models, list_ms = get("/models")
        ids = [m.get("id") for m in (models.get("data") or [])] if isinstance(models, dict) else []
        chat_ms = chat_probe()
        # Eval-first (labs/RUBRIC.md): formato · calidad · seguridad · costo
        chat_budget_ms = float(os.environ.get("HEALTH_CHAT_BUDGET_MS", "5000"))
        rubric = {
            "formato": 1 if status == 200 and isinstance(models, dict) else 0,
            "calidad": 1,  # chat_probe succeeded (reachable completion)
            "seguridad": 1,  # no secrets in payload; keys only via env
            "costo": 1 if chat_ms <= chat_budget_ms else 0,
        }
        health = {
            "status": "ok",
            "version": VERSION,
            "base_url": BASE,
            "model": MODEL,
            "models": ids,
            "latency_ms": {"models": round(list_ms, 1), "chat": round(chat_ms, 1)},
            "upstream_status": status,
            "rubric": rubric,
            "chat_budget_ms": chat_budget_ms,
        }
        print(json.dumps(health, ensure_ascii=False, indent=2))
        # Gate: formato + calidad critical; costo reported (soft fail via exit 2)
        if rubric["formato"] != 1 or rubric["calidad"] != 1:
            return 1
        if rubric["costo"] != 1:
            return 2
        return 0
    except urllib.error.URLError as exc:
        print(
            json.dumps(
                {
                    "status": "error",
                    "version": VERSION,
                    "error": str(exc),
                    "rubric": {
                        "formato": 0,
                        "calidad": 0,
                        "seguridad": 1,
                        "costo": 0,
                    },
                },
                indent=2,
            )
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
