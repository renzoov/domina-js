// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import { temaTiza } from './src/lib/tema-tiza.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: temaTiza },
  },
});
