// Herramientas para los proyectos (la carpeta proyectos/ es el submódulo domina-js-proyectos).
//
//   node herramientas/proyectos.mjs inicial [carpeta]    arma inicial/ a partir de final/
//   node herramientas/proyectos.mjs verificar [carpeta]  prueba el archivo de pasos (app.js o el de la librería) en cada paso
//   node herramientas/proyectos.mjs zips                 deja los zips de cada proyecto en dist/proyectos/<slug>/
//
// Sin carpeta, trabaja con todos los proyectos que tengan final/index.html y pruebas.mjs.
// «verificar» necesita Playwright: npm i -D playwright (o PLAYWRIGHT=<ruta al paquete>).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, rmSync, cpSync, mkdtempSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { deflateRawSync, crc32 } from 'node:zlib';
import { createServer } from 'node:http';
import { analizar, archivoEnPaso, archivoDePasos } from '../src/lib/pasos-proyecto.mjs';

const RAIZ = join(import.meta.dirname, '..');
const PROYECTOS = join(RAIZ, 'proyectos');

const slugDe = (carpeta) => carpeta.replace(/^\d+-/, '');

function carpetas(pedida) {
  if (pedida) return [pedida];
  return readdirSync(PROYECTOS)
    .filter((c) => existsSync(join(PROYECTOS, c, 'final', 'index.html')) && existsSync(join(PROYECTOS, c, 'pruebas.mjs')))
    .sort();
}

/** Todos los archivos de una carpeta, con su ruta relativa (con /) */
function archivos(dir) {
  const salida = [];
  const recorrer = (d) => {
    for (const nombre of readdirSync(d)) {
      const ruta = join(d, nombre);
      if (statSync(ruta).isDirectory()) recorrer(ruta);
      else salida.push(relative(dir, ruta).split(sep).join('/'));
    }
  };
  recorrer(dir);
  return salida.sort();
}

// ── inicial ─────────────────────────────────────────────────────
const ABRIR_MODULOS = `Este proyecto usa módulos (import y export), y el navegador no los carga si abres
\`index.html\` con doble clic. Ábrelo con un servidor local: en VS Code, instala la extensión
Live Server, haz clic derecho en \`index.html\` y elige «Open with Live Server».`;

const LEEME_INICIAL = (titulo, slug, carpeta, archivo, modulos) => `# ${titulo}: el punto de partida

El HTML y el CSS ya están hechos. Tú escribes el JavaScript en \`${archivo}\`, paso a paso,
siguiendo la guía: https://domina-js.pages.dev/proyectos/${slug}

Así queda cuando lo terminas: https://domina-js-proyectos.pages.dev/${carpeta}/final/

Cada paso tiene su lugar en \`${archivo}\`, entre \`// PASO n\` y \`// FIN PASO n\`.

${modulos ? ABRIR_MODULOS : 'Para verlo, abre `index.html` con doble clic en tu navegador.'}
`;

/** ¿La página carga sus scripts como módulos? Entonces necesita servirse por http */
const usaModulos = (dirFinal) => /type="module"/.test(readFileSync(join(dirFinal, 'index.html'), 'utf8'));

async function inicial(carpeta) {
  const base = join(PROYECTOS, carpeta);
  const final = join(base, 'final');
  const destino = join(base, 'inicial');
  const archivo = await archivoDePasos(final);
  rmSync(destino, { recursive: true, force: true });
  cpSync(final, destino, { recursive: true, filter: (origen) => !origen.endsWith(sep + archivo) && !origen.endsWith(sep + 'LEEME.md') });
  const an = analizar(readFileSync(join(final, archivo), 'utf8'));
  writeFileSync(join(destino, archivo), archivoEnPaso(an, 0));
  const titulo = readFileSync(join(base, 'README.md'), 'utf8').match(/^# \d+\. (.+)$/m)?.[1] ?? carpeta;
  writeFileSync(join(destino, 'LEEME.md'), LEEME_INICIAL(titulo, slugDe(carpeta), carpeta, archivo, usaModulos(final)));
  console.log(`${carpeta}: inicial/ armado (${an.bloques.length} pasos)`);
}

// ── verificar ───────────────────────────────────────────────────
async function cargarPlaywright() {
  try {
    return await import(process.env.PLAYWRIGHT ? pathToFileURL(join(process.env.PLAYWRIGHT, 'index.mjs')).href : 'playwright');
  } catch {
    console.error('Falta Playwright: npm i -D playwright, o PLAYWRIGHT=<ruta a node_modules/playwright>');
    process.exit(1);
  }
}

async function verificar(carpeta, pw) {
  const base = join(PROYECTOS, carpeta);
  const archivo = await archivoDePasos(join(base, 'final'));
  const an = analizar(readFileSync(join(base, 'final', archivo), 'utf8'));
  const modulos = usaModulos(join(base, 'final'));
  const { pruebas } = await import(pathToFileURL(join(base, 'pruebas.mjs')).href);
  const total = an.bloques.length;
  const fallas = [];

  // Cada paso en la guía tiene su prueba, y cada prueba es de un paso que existe
  for (let n = 1; n <= total; n++) if (!pruebas.some((p) => p.paso === n)) fallas.push(`el PASO ${n} no tiene prueba`);

  const navegador = await pw.chromium.launch();
  const tmp = mkdtempSync(join(tmpdir(), 'proyecto-'));
  for (let k = 0; k <= total; k++) {
    const dir = join(tmp, `paso-${k}`);
    cpSync(join(base, 'final'), dir, { recursive: true });
    writeFileSync(join(dir, archivo), archivoEnPaso(an, k));
    // Un contexto nuevo por paso: así lo que guarda un paso (localStorage) no le llega al siguiente
    const contexto = await navegador.newContext();
    const pagina = await contexto.newPage();
    const errores = [];
    pagina.on('pageerror', (e) => errores.push(e.message));
    // Con módulos, la página se sirve por http: con file:// el navegador no carga import ni export
    const servidor = modulos ? await servir(dir) : null;
    await pagina.goto(servidor ? `http://127.0.0.1:${servidor.address().port}/index.html` : pathToFileURL(join(dir, 'index.html')).href);
    await pagina.waitForTimeout(modulos ? 400 : 150);
    if (errores.length) fallas.push(`después del PASO ${k}, la página da errores: ${errores.join(' | ')}`);
    // Las pruebas de los pasos hechos pasan; la del paso siguiente todavía no
    for (const prueba of pruebas.filter((p) => p.paso <= k + 1)) {
      let ok = false;
      try {
        ok = (await pagina.evaluate(prueba.codigo)) === true;
      } catch {}
      if (prueba.paso <= k && !ok) fallas.push(`después del PASO ${k} falla la prueba del PASO ${prueba.paso}: ${prueba.que}`);
      if (prueba.paso === k + 1 && ok) fallas.push(`la prueba del PASO ${prueba.paso} ya pasa antes de escribirlo: ${prueba.que}`);
    }
    await contexto.close();
    servidor?.close();
  }
  await navegador.close();
  rmSync(tmp, { recursive: true, force: true });

  // inicial/ debe ser exactamente el esqueleto que sale de final/
  const ini = join(base, 'inicial', archivo);
  if (!existsSync(ini)) fallas.push('falta inicial/ (node herramientas/proyectos.mjs inicial)');
  else if (readFileSync(ini, 'utf8') !== archivoEnPaso(an, 0)) fallas.push(`inicial/${archivo} no coincide con final/: vuelve a armarlo`);

  console.log(fallas.length ? `${carpeta}: ${fallas.length} fallas\n  - ${fallas.join('\n  - ')}` : `${carpeta}: los ${total} pasos funcionan`);
  return fallas.length === 0;
}

/** Un servidor de archivos mínimo en un puerto libre, para las páginas con módulos */
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
function servir(dir) {
  const servidor = createServer((pedido, respuesta) => {
    const ruta = join(dir, decodeURIComponent(new URL(pedido.url, 'http://x').pathname));
    if (!ruta.startsWith(dir) || !existsSync(ruta) || statSync(ruta).isDirectory()) return respuesta.writeHead(404).end();
    const punto = ruta.lastIndexOf('.');
    respuesta.writeHead(200, { 'Content-Type': TIPOS[ruta.slice(punto)] ?? 'application/octet-stream' });
    respuesta.end(readFileSync(ruta));
  });
  return new Promise((listo) => servidor.listen(0, '127.0.0.1', () => listo(servidor)));
}

// ── zips ────────────────────────────────────────────────────────
// Un zip mínimo: cada archivo comprimido con deflate, más el directorio central
function zip(entradas) {
  const partes = [];
  const central = [];
  let desplazamiento = 0;
  for (const { nombre, datos } of entradas) {
    const nombreB = Buffer.from(nombre, 'utf8');
    const comprimido = deflateRawSync(datos, { level: 9 });
    const crc = crc32(datos);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // nombres en UTF-8
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt32LE(0, 10); // fecha y hora: no importan
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comprimido.length, 18);
    local.writeUInt32LE(datos.length, 22);
    local.writeUInt16LE(nombreB.length, 26);
    partes.push(local, nombreB, comprimido);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0);
    c.writeUInt16LE(20, 4);
    c.writeUInt16LE(20, 6);
    c.writeUInt16LE(0x0800, 8);
    c.writeUInt16LE(8, 10);
    c.writeUInt32LE(crc, 16);
    c.writeUInt32LE(comprimido.length, 20);
    c.writeUInt32LE(datos.length, 24);
    c.writeUInt16LE(nombreB.length, 28);
    c.writeUInt32LE(desplazamiento, 42);
    central.push(c, nombreB);
    desplazamiento += 30 + nombreB.length + comprimido.length;
  }
  const centralB = Buffer.concat(central);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entradas.length, 8);
  fin.writeUInt16LE(entradas.length, 10);
  fin.writeUInt32LE(centralB.length, 12);
  fin.writeUInt32LE(desplazamiento, 16);
  return Buffer.concat([...partes, centralB, fin]);
}

function zips() {
  for (const carpeta of carpetas()) {
    const slug = slugDe(carpeta);
    const destino = join(RAIZ, 'dist', 'proyectos', slug);
    mkdirSync(destino, { recursive: true });
    for (const tipo of ['inicial', 'final']) {
      const dir = join(PROYECTOS, carpeta, tipo);
      if (!existsSync(dir)) continue;
      const entradas = archivos(dir).map((r) => ({ nombre: `${slug}/${r}`, datos: readFileSync(join(dir, r)) }));
      writeFileSync(join(destino, `proyecto-${tipo}.zip`), zip(entradas));
    }
    console.log(`${carpeta}: zips en dist/proyectos/${slug}/`);
  }
}

// ── main ────────────────────────────────────────────────────────
const [comando, carpeta] = process.argv.slice(2);
if (comando === 'inicial') for (const c of carpetas(carpeta)) await inicial(c);
else if (comando === 'zips') zips();
else if (comando === 'verificar') {
  const pw = await cargarPlaywright();
  let ok = true;
  for (const c of carpetas(carpeta)) ok = (await verificar(c, pw)) && ok;
  process.exit(ok ? 0 : 1);
} else {
  console.log('Uso: node herramientas/proyectos.mjs <inicial|verificar|zips> [carpeta]');
  process.exit(1);
}
