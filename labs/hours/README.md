# Validación de horas lectivas (Manim)

Scaffold para **simular** la narrativa de una unidad (title cards por bloque / slide) y comparar la duración del video con las horas del programa. Criterio: [`COMPLIANCE.md`](../../COMPLIANCE.md) §4.10 · métrica `m_hours_fidelity`.

No es un estudio de filmación: pipeline mínimo para no inventar auditorías.

## Fuente de verdad

`src/data/programs/<curso>.json` → `unidades[].hours` + `session[]` (bloques ≈ 60 min).

## Método (borrador v0)

| Pieza | Valor |
|-------|--------|
| Escala demo | **1 s de video ≈ 1 min lectivo** (4 h → ~4 min de MP4) |
| Tolerancia | **±20%** primera pasada (ver COMPLIANCE §4.10) |
| Reporte | `tmp/hours-audit.md` |
| Media | `tmp/hours/` (MP4 gitignored) |

## Dependencias

```bash
# ffmpeg (sistema). En macOS: brew install ffmpeg
ffmpeg -version

# Manim Community (opcional para render; el dry-run no lo requiere)
python3 -m pip install "manim>=0.18"
# o: pipx install manim
manim --version
```

Si Manim no está instalado, `scripts/hours_audit.py` igual escribe el plan + informe dry-run.

## Uso

```bash
# Dry-run (sin Manim): plan + tmp/hours-audit.md
python3 scripts/hours_audit.py --course 08 --unit u01

# Demo Makefile (dry-run por defecto)
make hours-audit-demo

# Render Manim si está instalado
python3 scripts/hours_audit.py --course 08 --unit u01 --render
# o: make hours-audit-demo RENDER=1
```

Títulos de cards: por defecto los `session[]` del programa. Override:

```bash
python3 scripts/hours_audit.py --course 08 --unit u01 \
  --titles "Bloque 1 — Transformer" "Bloque 2 — Tokens" \
  --minutes 60 60
```

## Layout

```
labs/hours/
  README.md                 # este archivo
  scenes/hours_timeline.py  # escena Manim (stub)
scripts/hours_audit.py      # CLI + informe
```

## Qué no hacer

- No versionar MP4 ni `tmp/hours-audit.md`
- No inventar filas de fidelidad sin correr el script / ffprobe
- No gatear L2/L3 con este check (soft / métrica semi)
