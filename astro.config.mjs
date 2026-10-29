// @ts-check
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://ljofreflor.github.io';
// Trailing slash required so `${BASE_URL}brand/...` resolves correctly.
const base = (process.env.BASE_PATH || '/prompt-engineer-course').replace(/\/?$/, '/');

// https://astro.build/config
export default defineConfig({
  site,
  base,
  // Clases Reveal se proyectan en local; la toolbar ensucia capturas y la marca UAI.
  devToolbar: { enabled: false },
});
