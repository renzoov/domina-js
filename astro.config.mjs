// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import { temaTiza } from './src/lib/tema-tiza.mjs';
import { existsSync, createReadStream } from 'node:fs';
import { join, normalize, extname } from 'node:path';

// En desarrollo no existe el índice del buscador (Pagefind lo arma al compilar, en dist/pagefind).
// Este pequeño servidor entrega el de la última compilación, así el buscador también funciona con npm run dev.
const tipos = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm' };
const indiceEnDesarrollo = {
  name: 'indice-pagefind-en-desarrollo',
  hooks: {
    'astro:server:setup': ({ server }) => {
      const base = join(process.cwd(), 'dist', 'pagefind');
      server.middlewares.use('/pagefind', (req, res, next) => {
        const ruta = normalize(join(base, decodeURIComponent((req.url || '/').split('?')[0])));
        if (!ruta.startsWith(base) || !existsSync(ruta)) return next();
        res.setHeader('Content-Type', tipos[extname(ruta)] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store');
        createReadStream(ruta).pipe(res);
      });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // Dirección pública: la usan la URL canónica, las vistas previas al compartir y el sitemap
  site: 'https://domina-js.pages.dev',
  integrations: [mdx(), indiceEnDesarrollo],
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
