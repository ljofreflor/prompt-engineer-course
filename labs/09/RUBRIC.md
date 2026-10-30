# Rúbrica labs curso 09 (eval-first)


Programa completo (08–11): [`../RUBRIC.md`](../RUBRIC.md).

Usar en scripts de regresión y en el taller. Cada caso y cada corrida reportan dimensiones 0/1 (o score parcial) — no solo “se ve bien”.

| Dimensión | Pregunta | Señal automatizable |
|-----------|----------|---------------------|
| **Formato** | ¿Parsea al schema pedido? | JSON válido + campos requeridos |
| **Calidad** | ¿Cumple la etiqueta / tarea? | Match a `expect_*` del golden set |
| **Seguridad** | ¿Abstiene en OOD / vacío / off-policy? | `abstener` / rechazo cuando corresponde |
| **Costo** | ¿Presupuesto de tokens razonable? | `max_tokens` / tokens usados si el API los reporta |

## Golden set

- Vivir en el repo (`cases.yaml` o equivalente), versionado con el prompt.
- Incluir felices, límite y fuera de alcance (≥1 OOD).
- Al cambiar prompt o modelo: re-correr y guardar evidencia en `labs/09/runs/`.

## Umbral

Suite pasa solo si **todas** las dimensiones críticas del caso están en 1 (formato + calidad + seguridad). Costo se reporta; no bloquea hasta que el lab declare presupuesto.
