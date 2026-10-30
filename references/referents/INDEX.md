# Referentes públicos (transfer → presentación UAI)

Issue: https://github.com/ljofreflor/prompt-engineer-course/issues/1

Metáfora: capas de conocimiento congeladas; **última capa** = decks UAI / casos Chile / rúbricas.

| id | capa | fuente | licencia | mapeo UAI | estado |
|----|------|--------|----------|-----------|--------|
| cs329z | E | https://cs329z.github.io/ | syllabus/slides públicos | 09–10 | mirror + [outline transfer](cs329z-outline.md) |
| anthropic-agents | E | https://www.anthropic.com/engineering/building-effective-agents | público web | 09 | mirror + [outline transfer](anthropic-agents-outline.md) |
| hf-agents | B* | https://huggingface.co/learn/agents-course | HF Learn | 09 | mirror 2026-10-30 → tmp/referents/hf-agents/ |
| dlai-genai-llm | B* | https://www.deeplearning.ai/courses/generative-ai-with-llms | página curso | 08 | mirror 2026-10-30 → tmp/referents/dlai-genai-llm/ |

Dumps binarios / HTML crudo → `tmp/referents/` (gitignored). No versionar scrape de pago.

Fetch: `python3 scripts/referents_fetch.py` (opcional: ids del catálogo).

## Matriz de transferencia (última capa = presentación UAI)

| Tema referente (congelado) | Ya en UAI | Gap / solo presentación |
|----------------------------|-----------|-------------------------|
| Compound AI / agents (CS329Z) | 09 u04–u06, viz ReAct/multiagent | Lab from-scratch vs harness; MCP en más de una slide |
| Context engineering (Anthropic/CS329Z) | 09/u01 defs + context-stack | Ejercicio compaction/masking en lab |
| Eval 4-tuple / judges (CS329Z) | labs/RUBRIC.md, judge-bias, 08/u06 | Extender golden sets a 10/11 |
| RAG + tools (CS329Z/HF) | 08/u03, 10/u02, 09 tools | Dual-stack abierto/cerrado en un lab |
| GenAI lifecycle (DL.AI) | 08 pipeline posttrain + adapt | No copiar notebooks Coursera |
| Design doc / ops | 10 + 11 + capstone | Defensa pública (`/senal/`) con fecha real |
