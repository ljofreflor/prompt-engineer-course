# Contingencia / smoke local del health wrapper (curso 11).
FROM python:3.12-slim
WORKDIR /app
COPY health_wrapper.py .
ENV OPENAI_BASE_URL=http://host.docker.internal:1234/v1 \
    OPENAI_API_KEY=lm-studio \
    OPENAI_MODEL=google/gemma-4-e4b
CMD ["python", "health_wrapper.py"]
