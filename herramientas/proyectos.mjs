// Herramientas para los proyectos (la carpeta proyectos/ es el submódulo domina-js-proyectos).
//
//   node herramientas/proyectos.mjs inicial [carpeta]    arma inicial/ a partir de final/
//   node herramientas/proyectos.mjs verificar [carpeta]  prueba el app.js de cada paso en el navegador
//   node herramientas/proyectos.mjs zips                 deja los zips de cada proyecto en dist/proyectos/<slug>/
//
// Sin carpeta, trabaja con todos los proyectos que tengan final/app.js.
// «verificar» necesita Playwright: npm i -D playwright (o PLAYWRIGHT=<ruta al paquete>).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, rmSync, cpSync, mkdtempSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { deflateRawSync, crc32 } from 'node:zlib';
import { analizar, archivoEnPaso } from '../src/lib/pasos-proyecto.mjs';

const RAIZ = join(import.meta.dirname, '..');
const PROYECTOS = join(RAIZ, 'proyectos');

const slugDe = (carpeta) => carpeta.replace(/^\d+-/, '');

function carpetas(pedida) {
  if (pedida) return [pedida];
  return readdirSync(PROYECTOS)
    .filter((c) => existsSync(join(PROYECTOS, c, 'final', 'app.js')))
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
const LEEME_INICIAL = (titulo, slug, carpeta) => `# ${titulo}: el punto de partida

El HTML y el CSS ya están hechos. Tú escribes el JavaScript en \`app.js\`, paso a paso,
siguiendo la guía: https://domina-js.pages.dev/proyectos/${slug}

Así queda cuando lo terminas: https://domina-js-proyectos.pages.dev/${carpeta}/final/

Cada paso tiene su lugar en \`app.js\`, entre \`// PASO n\` y \`// FIN PASO n\`.

Para verlo, abre \`index.html\` con doble clic en tu navegador.
`;

function inicial(carpeta) {
  const base = join(PROYECTOS, carpeta);
  const final = join(base, 'final');
  const destino = join(base, 'inicial');
  rmSync(destino, { recursive: true, force: true });
  cpSync(final, destino, { recursive: true, filter: (origen) => !/[\\/](app\.js|LEEME\.md)$/.test(origen) });
  const an = analizar(readFileSync(join(final, 'app.js'), 'utf8'));
  writeFileSync(join(destino, 'app.js'), archivoEnPaso(an, 0));
  const titulo = readFileSync(join(base, 'README.md'), 'utf8').match(/^# \d+\. (.+)$/m)?.[1] ?? carpeta;
  writeFileSync(join(destino, 'LEEME.md'), LEEME_INICIAL(titulo, slugDe(carpeta), carpeta));
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
  const an = analizar(readFileSync(join(base, 'final', 'app.js'), 'utf8'));
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
    writeFileSync(join(dir, 'app.js'), archivoEnPaso(an, k));
    const pagina = await navegador.newPage();
    const errores = [];
    pagina.on('pageerror', (e) => errores.push(e.message));
    await pagina.goto(pathToFileURL(join(dir, 'index.html')).href);
    await pagina.waitForTimeout(150);
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
    await pagina.close();
  }
  await navegador.close();
  rmSync(tmp, { recursive: true, force: true });

  // inicial/ debe ser exactamente el esqueleto que sale de final/
  const ini = join(base, 'inicial', 'app.js');
  if (!existsSync(ini)) fallas.push('falta inicial/ (node herramientas/proyectos.mjs inicial)');
  else if (readFileSync(ini, 'utf8') !== archivoEnPaso(an, 0)) fallas.push('inicial/app.js no coincide con final/: vuelve a armarlo');

  console.log(fallas.length ? `${carpeta}: ${fallas.length} fallas\n  - ${fallas.join('\n  - ')}` : `${carpeta}: los ${total} pasos funcionan`);
  return fallas.length === 0;
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
if (comando === 'inicial') carpetas(carpeta).forEach(inicial);
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
