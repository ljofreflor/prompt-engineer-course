#!/usr/bin/env python3
"""Parse programs/*.txt → src/data/programs/<slug>.json for course pages."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP = {
    "08_GenAI_y_LLMs.txt": "08-genai-llms",
    "09_Prompt_Engineering_y_Sistemas_Multiagentes.txt": "09-prompt-engineering",
    "10_Diseno_de_Sistemas_y_Aplicaciones_de_IA.txt": "10-diseno-sistemas-ia",
    "11_AIOps_y_Sistemas_Cloud.txt": "11-aiops-cloud",
}
SECTION_RE = re.compile(r"^(?P<num>\d+)\.\s+(?P<title>.+)$")
UNIT_RE = re.compile(r"^Unidad\s+(\d+):\s*(.+?)(?:\s*\((\d+)\s*hrs?\))?$", re.I)


def clean(s: str) -> str:
    return re.sub(r"[ \t]+", " ", s.replace("\u00a0", " ")).strip()


def bullets(lines: list[str]) -> list[str]:
    return [clean(ln.lstrip("•-").strip()) for ln in lines if clean(ln).startswith(("•", "-"))]


def line_paras(ls: list[str]) -> list[str]:
    return [clean(ln) for ln in ls if clean(ln) and not clean(ln).startswith(("•", "-"))]


def parse(text: str) -> dict:
    lines = [ln.rstrip() for ln in text.splitlines()]
    asignatura = next((clean(l.split(":", 1)[1]) for l in lines if l.lower().startswith("asignatura")), "")
    ubicacion = next((clean(l.split(":", 1)[1]) for l in lines if "ubicaci" in l.lower()), "")
    idxs = []
    for i, ln in enumerate(lines):
        m = SECTION_RE.match(clean(ln))
        if m and int(m.group("num")) <= 8:
            idxs.append((i, int(m.group("num")), m.group("title")))
    idxs.append((len(lines), 99, "END"))
    sections = {
        num: {"title": title, "lines": lines[i + 1 : j]}
        for (i, num, title), (j, _, _) in zip(idxs, idxs[1:])
    }

    intro = line_paras(sections.get(1, {}).get("lines", []))

    obj_lines = sections.get(2, {}).get("lines", [])
    obj_general, obj_specific, mode, buf = "", [], None, []
    for ln in obj_lines:
        c = clean(ln)
        if c.lower().startswith("objetivo general"):
            mode = "gen"
            buf = []
            continue
        if "objetivos espec" in c.lower():
            if mode == "gen" and buf:
                obj_general = clean(" ".join(buf))
            mode = "esp"
            buf = []
            continue
        if c.startswith(("•", "-")):
            if mode == "gen" and buf:
                obj_general = clean(" ".join(buf))
                buf = []
            obj_specific.append(clean(c.lstrip("•-").strip()))
            continue
        if mode == "gen":
            buf.append(c)
    if mode == "gen" and buf and not obj_general:
        obj_general = clean(" ".join(buf))

    meth_lines = sections.get(3, {}).get("lines", [])
    methodology: list[str] = []
    for ln in meth_lines:
        c = clean(ln)
        if not c or c.startswith(("•", "-")):
            continue
        if c.lower().startswith(("asistencia", "reprobación", "reprobacion")):
            break
        methodology.append(c)
        if len(methodology) >= 8:
            break

    eval_lines = sections.get(4, {}).get("lines", [])
    evaluation = {
        "items": bullets(eval_lines),
        "notes": [
            clean(ln)
            for ln in eval_lines
            if clean(ln)
            and not clean(ln).startswith(("•", "-"))
            and not clean(ln)
            .lower()
            .startswith(("asistencia", "reprob", "inasistencia", "si el alumno", "en caso"))
        ][:4],
    }

    bib_lines = sections.get(5, {}).get("lines", [])
    bib_oblig, bib_comp, mode = [], [], None
    for ln in bib_lines:
        c = clean(ln)
        low = c.lower()
        if low.startswith("bibliograf") and "obligat" in low:
            mode = "o"
            continue
        if low.startswith("bibliograf") and "complement" in low:
            mode = "c"
            continue
        if low.startswith("nota sobre"):
            break
        if c and mode == "o":
            bib_oblig.append(c)
        elif c and mode == "c":
            bib_comp.append(c)

    prog_lines = sections.get(7, {}).get("lines", [])
    units: list[dict] = []
    i = 0
    while i < len(prog_lines):
        c = clean(prog_lines[i])
        m = UNIT_RE.match(c)
        if not m:
            i += 1
            continue
        num, title, hours = m.group(1), m.group(2).strip(), int(m.group(3) or 4)
        i += 1
        block: list[str] = []
        while i < len(prog_lines):
            n = clean(prog_lines[i])
            if UNIT_RE.match(n) or n.startswith("8. "):
                break
            block.append(prog_lines[i])
            i += 1
        narrative, session, outcomes, readings = [], [], [], []
        mode = "narr"
        for ln in block:
            c = clean(ln)
            if c.lower().startswith("estructura de la sesi"):
                mode = "sess"
                continue
            if c.lower().startswith("resultados de aprendizaje"):
                mode = "out"
                continue
            if c.lower().startswith("lecturas"):
                mode = "read"
                continue
            if not c:
                continue
            if mode == "narr":
                narrative.append(c)
            elif mode == "sess" and (c.startswith(("•", "-")) or c.lower().startswith("bloque")):
                session.append(clean(c.lstrip("•-").strip()))
            elif mode == "out" and c.startswith(("•", "-")):
                outcomes.append(clean(c.lstrip("•-").strip()))
            elif mode == "read":
                readings.append(c)
        units.append(
            {
                "number": int(num),
                "id": f"u{int(num):02d}",
                "title": title,
                "hours": hours,
                "narrative": narrative,
                "session": session,
                "outcomes": outcomes,
                "readings": readings,
            }
        )

    return {
        "asignatura": asignatura,
        "ubicacion": ubicacion,
        "introduccion": intro,
        "objetivoGeneral": obj_general,
        "objetivosEspecificos": obj_specific,
        "metodologia": methodology,
        "metodologiaBullets": bullets(meth_lines)[:15],
        "evaluacion": evaluation,
        "bibliografiaObligatoria": bib_oblig,
        "bibliografiaComplementaria": bib_comp,
        "unidades": units,
    }


def main() -> None:
    out = ROOT / "src" / "data" / "programs"
    out.mkdir(parents=True, exist_ok=True)
    for fname, slug in MAP.items():
        data = parse((ROOT / "programs" / fname).read_text(encoding="utf-8", errors="replace"))
        data["slug"] = slug
        (out / f"{slug}.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(slug, len(data["unidades"]), "units")


if __name__ == "__main__":
    main()
