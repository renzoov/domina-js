// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import { temaTiza } from './src/lib/tema-tiza.mjs';

// https://astro.build/config
export default defineConfig({
  // Dirección pública: la usan la URL canónica, las vistas previas al compartir y el sitemap
  site: 'https://domina-js.pages.dev',
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: temaTiza },
  },
  // Cada página se genera como archivo (fundamentos/texto.html), así Cloudflare Pages sirve
  // /fundamentos/texto sin redirigir antes a /fundamentos/texto/
  build: { format: 'file' },
  trailingSlash: 'never',
  // Al pasar el mouse (o el foco) sobre un enlace, el navegador ya descarga la página
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
