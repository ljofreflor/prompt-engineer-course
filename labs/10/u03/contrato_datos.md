# Taller 10/u03 — Contrato de datos (plantilla)

Sin datos reales / PII. Versionar junto al design doc.

## Productor ↔ consumidor
- Productor:
- Consumidor (modelo / feature / servicio):
- Owner:

## Esquema
| Campo | Tipo | Semántica | Nullable | Ejemplo sintético |
|-------|------|-----------|----------|-------------------|
|  |  |  |  |  |

## SLAs
- Frecuencia / frescura:
- Completitud mínima:
- Estabilidad de esquema (política de breaking changes):

## Train / serve
- ¿Misma base de código de features? sí / no
- Features no disponibles en inferencia:
- Joins con riesgo de fuga temporal:

## Etiquetas y feedback
- Fuente de etiqueta / latencia:
- Proxy si la etiqueta tarda:
- Reserva no intervenida: sí / no — tamaño:

## Validación en entrada
- Checks automáticos:
- Qué hacer si falla (reject / quarantine / default):
