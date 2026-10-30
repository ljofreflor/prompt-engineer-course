# Eval-first · claims del design doc (curso 10)

Alineado a [`../RUBRIC.md`](../RUBRIC.md). Cada claim de valor en `DESIGN.md` / ficha u01 lleva:

| Campo | Obligatorio |
|-------|-------------|
| Claim (1 frase) | sí |
| Métrica | sí |
| Línea base | sí (o “plan de medición”) |
| Umbral de éxito | sí |
| Cómo se mide (set / canaria / humano) | sí |
| Dimensión rúbrica dominante | formato / calidad / seguridad / costo |

## Mini golden (plantilla — 5 casos)

Completar con el dominio Chile/LATAM del equipo (sin inventar volúmenes).

| id | entrada / escenario | expect | dim |
|----|---------------------|--------|-----|
| c01 | caso feliz | pass | calidad |
| c02 | borde / ambiguo | pass o abstener | formato |
| c03 | OOD / fuera de política | abstener / HITL | seguridad |
| c04 | pico de latencia | degradación documentada | costo |
| c05 | falla de proveedor | fallback / rollback | seguridad |

Al cambiar arquitectura o umbral: re-validar la tabla y versionar el diff en el repo de cohorte.
