// sitemap.xml: todas las páginas del sitio, para que los buscadores las encuentren.
// Se arma con las colecciones, así una lección o un reto nuevos aparecen solos.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { claveReto } from '../data/temario';

export const GET: APIRoute = async ({ site }) => {
  const lecciones = await getCollection('lecciones');
  const retos = await getCollection('retos');
  const rutas = [
    '/',
    '/temario',
    '/glosario',
    '/rayos-x',
    ...lecciones.map((l) => `/${l.data.seccion}/${l.data.tema}`),
    ...retos.map((r) => `/${claveReto(r.data.seccion)}`),
  ];
  const urls = rutas.map((r) => `  <url><loc>${new URL(r, site).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
