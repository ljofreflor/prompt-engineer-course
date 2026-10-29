"""Cliente mínimo OpenAI-compatible (LM Studio / Ollama)."""

from __future__ import annotations

import json
import os
import urllib.request

BASE = os.environ.get("OPENAI_BASE_URL", "http://localhost:1234/v1").rstrip("/")
KEY = os.environ.get("OPENAI_API_KEY", "lm-studio")
MODEL = os.environ.get("OPENAI_MODEL", "local-model")


def chat(messages: list[dict], *, temperature: float = 0, max_tokens: int = 512) -> str:
    model = MODEL
    if model == "local-model":
        try:
            req = urllib.request.Request(
                f"{BASE}/models",
                headers={"Authorization": f"Bearer {KEY}"},
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode())
                ids = [m.get("id") for m in data.get("data", []) if m.get("id")]
                if ids:
                    model = ids[0]
        except Exception:
            pass

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    req = urllib.request.Request(
        f"{BASE}/chat/completions",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read().decode())
    return body["choices"][0]["message"]["content"]
