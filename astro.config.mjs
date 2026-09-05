import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  site: process.env.ASTRO_SITE ?? 'https://tanxianzhu.github.io',
  base: process.env.ASTRO_BASE ?? '/alans-realm',
});
