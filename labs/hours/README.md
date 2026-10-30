# Validación de horas lectivas

Dos capas ([`COMPLIANCE.md`](../../COMPLIANCE.md) §4.10 · `m_hours_fidelity`):

1. **Heurística** (siempre): `scripts/hours_fill.py` — minutos conservadores por tipo de slide vs `hours` del programa. Underfill si estimate &lt; **75%** del plan. Decks cortos no pueden reclamar 240 min.
2. **Manim** (gold): video-sim de title cards; duración MP4 vs plan ±20%.

L3 compliance ≠ horas lectivas cubiertas.

## Fuente de verdad

`src/data/programs/<curso>.json` → `unidades[].hours` + `session[]` (bloques ≈ 60 min).

## Método

| Pieza | Valor |
|-------|--------|
| Heurística | title 1 · section 1.5 · bullets 4 · prose 5 · viz 6 · image 3 · +18 Lab/Taller |
| Underfill | estimate/planned &lt; 75% (severa &lt; 50%) |
| Escala Manim | **1 s video ≈ 1 min lectivo** (demo) |
| Tolerancia Manim | **±20%** (draft) |
| Reporte | `tmp/hours-audit.md` (heurística + Manim) |
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

Sin Manim: el script igual escribe **heurística + plan** (dry-run Manim).

## Uso

```bash
# Heurística + dry-run Manim → tmp/hours-audit.md
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
scripts/hours_fill.py       # heurística content→min
scripts/hours_audit.py      # CLI + informe (heurística + Manim)
```

## Qué no hacer

- No versionar MP4 ni `tmp/hours-audit.md`
- No inventar filas Manim sin script / ffprobe
- No tratar L3 como prueba de que se llenan las horas
- No gatear L2/L3 con este check (devil / métrica §8)
