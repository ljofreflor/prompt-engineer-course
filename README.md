# Magíster en IA (UAI) — material de cursos

Sitio estático del **Magíster en Inteligencia Artificial** de la [Universidad Adolfo Ibáñez](https://www.uai.cl/postgrados/magisteres/magister-en-inteligencia-artificial): desarrollo de los cursos 08–11 (GenAI/LLMs, Prompt Engineering, Diseño de Sistemas, AI.Ops), con vista **alumno** pública y vista **profesor** con usuario/contraseña.

Identidad visual alineada a `uai.cl` (azul `#009FE3`, tipografías Roboto / Open Sans / Young Serif). No es el sitio oficial de la universidad.

## Desarrollo local

```bash
cp .env.example .env   # ajustar TEACHER_PASSWORD
npm install
npm run dev
```

Credenciales profesor por defecto (local): usuario `profesor` / contraseña la de tu `.env`.

## Labs locales

1. Arrancá [LM Studio](https://lmstudio.ai/) (server en `http://localhost:1234/v1`) u [Ollama](https://ollama.com/).
2. `python labs/smoke_local.py`

## GitHub Pages

Tras el push a `main`, el workflow publica en:

`https://ljofreflor.github.io/prompt-engineer-course/`

Configurá el secret `TEACHER_PASSWORD` (y opcional `TEACHER_USER`) en el repositorio. En GitHub: **Settings → Pages → Source: GitHub Actions**.

## Estructura

- `programs/` — syllabi fuente (DOCX + TXT)
- `src/pages/` — sitio alumno/profesor
- `src/content/units/` — desarrollo de unidades (09 completo en v1)
- `labs/` — scripts OpenAI-compatible
- `public/brand/` — logos UAI
- `references/` — bibliografía / papers OA
