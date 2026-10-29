// @ts-check
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://ljofreflor.github.io';
const base = process.env.BASE_PATH || '/prompt-engineer-course';

// https://astro.build/config
export default defineConfig({
  site,
  base,
});
