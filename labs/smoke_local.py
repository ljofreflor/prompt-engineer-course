#!/usr/bin/env python3
"""Smoke test contra API OpenAI-compatible (LM Studio / Ollama)."""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request

BASE = os.environ.get("OPENAI_BASE_URL", "http://localhost:1234/v1").rstrip("/")
KEY = os.environ.get("OPENAI_API_KEY", "lm-studio")
MODEL = os.environ.get("OPENAI_MODEL", "local-model")


def request(path: str, payload: dict | None = None) -> dict:
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=data,
        headers={
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
        },
        method="GET" if payload is None else "POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def main() -> int:
    print(f"Base URL: {BASE}")
    try:
        models = request("/models")
        ids = [m.get("id") for m in models.get("data", [])]
        print("Modelos:", ids or "(lista vacía — igual se intenta chat)")
        model = MODEL if MODEL != "local-model" or not ids else ids[0]
        chat = request(
            "/chat/completions",
            {
                "model": model,
                "messages": [
                    {"role": "user", "content": "Respondé solo: OK"},
                ],
                "temperature": 0,
                "max_tokens": 64,
            },
        )
        msg = chat["choices"][0]["message"]
        content = (msg.get("content") or "").strip()
        reasoning = (msg.get("reasoning_content") or "").strip()
        text = content or reasoning
        # Gemma-style reasoning may dump CoT without a clean final line.
        if content:
            display = content[:200]
        elif re.search(r"\bOK\b", text, flags=re.I):
            display = "OK"
        else:
            display = (text[:120] + "…") if len(text) > 120 else text
        print("Respuesta:", display or "(vacío)")
        if not text:
            print("Smoke WARN: content y reasoning_content vacíos", file=sys.stderr)
            return 1
        print("Smoke OK")
        return 0
    except urllib.error.URLError as exc:
        print("No se pudo conectar. ¿LM Studio / Ollama escuchando?", file=sys.stderr)
        print(exc, file=sys.stderr)
        return 1
    except Exception as exc:  # noqa: BLE001
        print("Error:", exc, file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
