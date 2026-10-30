#!/usr/bin/env python3
"""Fetch public referent HTML into tmp/referents/<id>/ (gitignored dumps).

Respect robots/ToS: syllabus/public pages only — no Coursera video/quiz scrape.
See references/referents/INDEX.md and GitHub issue #1.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tmp" / "referents"
UA = "UAI-course-referents/1.0 (+https://github.com/ljofreflor/prompt-engineer-course/issues/1)"

CATALOG = {
    "cs329z": "https://cs329z.github.io/",
    "anthropic-agents": "https://www.anthropic.com/engineering/building-effective-agents",
    "hf-agents": "https://huggingface.co/learn/agents-course/en/unit0/introduction",
    "dlai-genai-llm": "https://www.deeplearning.ai/courses/generative-ai-with-llms",
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("ids", nargs="*", help="Catalog ids (default: all)")
    args = ap.parse_args()
    ids = args.ids or list(CATALOG)
    meta = []
    for i in ids:
        url = CATALOG[i]
        raw = fetch(url)
        dest = OUT / i
        dest.mkdir(parents=True, exist_ok=True)
        (dest / "index.html").write_bytes(raw)
        h = hashlib.sha256(raw).hexdigest()[:16]
        meta.append({"id": i, "url": url, "bytes": len(raw), "sha256_16": h, "date": date.today().isoformat()})
        print(f"OK {i} {len(raw)} B sha256_16={h}")
    (OUT / "manifest.json").write_text(json.dumps(meta, indent=2) + "\n")


if __name__ == "__main__":
    main()
