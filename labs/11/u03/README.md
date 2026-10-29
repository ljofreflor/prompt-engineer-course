# Lab 11/u03 — Contenedor del healthcheck

Reusa el wrapper de la unidad 1:

```bash
docker build -t mia-health labs/11/u01
# LM Studio en el host (macOS Docker Desktop):
docker run --rm -e OPENAI_BASE_URL=http://host.docker.internal:1234/v1 mia-health
```

Smoke local sin Docker: `python3 labs/11/u01/health_wrapper.py`.
