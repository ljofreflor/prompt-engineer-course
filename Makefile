# Labs Magíster IA — cero fricción (LM Studio / OpenAI-compatible)
# Uso: make smoke | make lab-09-u02 | make labs-09

export OPENAI_BASE_URL ?= http://localhost:1234/v1
export OPENAI_API_KEY ?= lm-studio
export OPENAI_MODEL ?= local-model

.PHONY: help smoke lab-09-u01 lab-09-u02 lab-09-u03 lab-09-u04 labs-09 lab-11-u01 referents-fetch

help:
	@echo "Targets:"
	@echo "  make smoke            — ping LM Studio / API local"
	@echo "  make lab-09-u01       — salida estructurada"
	@echo "  make lab-09-u02       — regresión + rúbrica (JSON en labs/09/runs/)"
	@echo "  make lab-09-u03       — verificación"
	@echo "  make lab-09-u04       — agente ReAct"
	@echo "  make labs-09          — u01→u04 en serie"
	@echo "  make lab-11-u01       — health + rúbrica (formato·calidad·seguridad·costo)"
	@echo "  make referents-fetch  — HTML público → tmp/referents/ (issue #1)"

smoke:
	python3 labs/smoke_local.py

lab-09-u01:
	python3 labs/09/u01/run_structured.py

lab-09-u02:
	python3 labs/09/u02/run_regression.py

lab-09-u03:
	python3 labs/09/u03/run_verify.py

lab-09-u04:
	python3 labs/09/u04/run_agent.py

labs-09: lab-09-u01 lab-09-u02 lab-09-u03 lab-09-u04

lab-11-u01:
	python3 labs/11/u01/health_wrapper.py

referents-fetch:
	python3 scripts/referents_fetch.py
