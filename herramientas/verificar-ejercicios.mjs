// Comprueba los ejercicios de src/data/ejercicios/ ejecutándolos en Node.js:
//   · Ordena la salida: el código imprime exactamente `salida`, en ese orden, e `inicio` es una permutación.
//   · Laboratorio (sin página): la solución pasa todas las verificaciones, como en src/scripts/lab-worker.ts.
//   · Detective: el código lanza el error que dice el enunciado (se compara la última línea de `error`).
//   · Autoevaluación: `correcta` apunta a una opción que existe.
// Los ejercicios que dependen del navegador (DOM, página) o de Node con archivos se saltan y se informan.
//
// Uso:  node herramientas/verificar-ejercicios.mjs [filtro]      (filtro: parte del nombre del archivo o del id)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Console } from 'node:console';
import { Writable } from 'node:stream';

const RAIZ = path.resolve(import.meta.dirname, '../src/data/ejercicios');
const filtro = process.argv[2] ?? '';
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function archivos(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? archivos(path.join(dir, d.name)) : d.name.endsWith('.ts') ? [path.join(dir, d.name)] : [],
  );
}

// Ejecuta como el worker: una función async, con la consola capturada (formato de Node.js) y esperando a los
// temporizadores pendientes, como cuando Node.js termina un programa porque no le queda nada por hacer
async function correr(codigo, prueba) {
  const salida = [];
  let buffer = '';
  const flujo = new Writable({
    write(trozo, _codificacion, listo) {
      buffer += trozo;
      const partes = buffer.split('\n');
      buffer = partes.pop();
      salida.push(...partes);
      listo();
    },
  });
  const consola = new Console({ stdout: flujo, stderr: flujo });
  const pendientes = new Set();
  let error = null;
  // Un error dentro de un temporizador termina el programa: se anota y ya no corre nada más
  const envolver = (fn) => (...a) => { if (error) return; try { fn(...a); } catch (e) { error ??= e; } };
  const temporizadores = {
    setTimeout: (fn, ms, ...a) => { if (typeof fn !== 'function') setTimeout(fn, ms); const t = setTimeout(envolver((...x) => { pendientes.delete(t); fn(...x); }), ms, ...a); pendientes.add(t); return t; },
    clearTimeout: (t) => { pendientes.delete(t); clearTimeout(t); },
    setInterval: (fn, ms, ...a) => { const t = setInterval(envolver(fn), ms, ...a); pendientes.add(t); return t; },
    clearInterval: (t) => { pendientes.delete(t); clearInterval(t); },
  };
  const esperar = async () => {
    for (let i = 0; i < 300 && pendientes.size && !error; i++) await new Promise((r) => setTimeout(r, 10));
    await new Promise((r) => setTimeout(r, 30));
  };
  const cuerpo = prueba ? `${codigo}\n;await __esperar();\nreturn await (async () => {\n${prueba}\n})();` : codigo;
  const nombres = ['console', ...Object.keys(temporizadores), '__salida', '__codigo', '__esperar'];
  let valor;
  const capturar = (e) => { error ??= e; };
  process.on('unhandledRejection', capturar);
  try {
    const f = new AsyncFunction(...nombres, cuerpo);
    valor = await f(consola, ...Object.values(temporizadores), salida, codigo, esperar);
  } catch (e) {
    error ??= e;
  }
  await esperar();
  for (const t of pendientes) { clearTimeout(t); clearInterval(t); }
  process.off('unhandledRejection', capturar);
  if (buffer) salida.push(buffer);
  return { salida, error, valor };
}

const usaNavegador = (codigo) => /\b(document|window|localStorage|sessionStorage|navigator|customElements|IntersectionObserver|requestAnimationFrame|fetch\(|indexedDB|history\.|location\.)/.test(codigo);
const usaNodeArchivos = (codigo) => /\b(require\(|from ["']node:|process\.|import\s)/.test(codigo);

// Código que este Node no puede ejecutar: no es JavaScript (TypeScript, configuración, HTML) o usa una API
// más nueva que el Node instalado (Temporal, getOrInsert, base64 de Uint8Array…). Se informa, no es un fallo.
const noEjecutable = (e) =>
  e && ((e.name === 'SyntaxError' && !/JSON/.test(e.message)) || /(Temporal|Deno|Bun|Worker) is not defined|(getOrInsert\w*|fromBase64|toBase64|fromHex|toHex|sumPrecise|isError|fromAsync|concat|zip\w*|chunks|windows) is not a function/.test(e.message));
// La línea del error en un texto con stack: la primera que empieza con «AlgoError:» (o DOMException)
const lineaError = (texto) => texto.split('\n').map((l) => l.trim()).find((l) => /^(\w*Error|DOMException)\b.*:/.test(l));
// Node y Chromium escriben algunos mensajes distinto («number NaN is not a function», «DOMException [DataCloneError]»)
const normalizar = (t) => t.replace(/^DOMException \[(\w+)\]:/, '$1:').replace(/^(\w+) \[[A-Z_]+\]:/, '$1:').replace(/\b(number|string|object|boolean) (?=\S+ is not)/, '');
const parecido = (a, b) => { const x = normalizar(a); const y = normalizar(b); return x === y || x.startsWith(y) || y.startsWith(x); };

let ok = 0;
const fallos = [];
const saltados = [];

for (const archivo of archivos(RAIZ)) {
  const modulo = await import(pathToFileURL(archivo).href);
  for (const [nombre, ej] of Object.entries(modulo)) {
    if (!ej || typeof ej !== 'object' || !ej.id) continue;
    if (filtro && !archivo.includes(filtro) && !ej.id.includes(filtro)) continue;
    const donde = `${path.relative(RAIZ, archivo)} › ${ej.id}`;
    const fallar = (msg) => fallos.push(`${donde}: ${msg}`);

    if (ej.preguntas) {
      ej.preguntas.forEach((p, i) => {
        if (!(p.correcta >= 0 && p.correcta < p.opciones.length)) fallar(`pregunta ${i + 1}: correcta fuera de rango`);
      });
      ok++;
    } else if (ej.salida && ej.codigo) {
      const ordenado = [...ej.inicio].sort((a, b) => a - b).join();
      if (ordenado !== ej.salida.map((_, i) => i).join()) fallar('inicio no es una permutación de la salida');
      if (ej.inicio.every((x, i) => x === i)) fallar('inicio ya está en el orden correcto');
      if (usaNavegador(ej.codigo) || usaNodeArchivos(ej.codigo) || ej.sinEjecutar) { saltados.push(donde); continue; }
      const r = await correr(ej.codigo);
      if (noEjecutable(r.error)) { saltados.push(`${donde} (${r.error.message})`); continue; }
      const real = [...r.salida, ...(r.error ? [`${r.error.name}: ${r.error.message}`] : [])];
      if (real.join('\n') !== ej.salida.join('\n')) fallar(`la salida no coincide\n    esperada: ${JSON.stringify(ej.salida)}\n    real:     ${JSON.stringify(real)}`);
      else ok++;
    } else if (ej.verificaciones && ej.solucion) {
      if (ej.pagina !== undefined || usaNavegador(ej.solucion)) { saltados.push(donde); continue; }
      const principal = await correr(ej.solucion);
      if (noEjecutable(principal.error)) { saltados.push(`${donde} (${principal.error.message})`); continue; }
      if (principal.error) { fallar(`la solución lanza ${principal.error}`); continue; }
      for (const v of ej.verificaciones) {
        const r = await correr(ej.solucion, v.prueba);
        if (r.valor !== true || r.error) fallar(`la solución no pasa: ${v.texto.replace(/<[^>]+>/g, '')}${r.error ? ` (${r.error})` : ''}`);
      }
      // Y el código inicial no debería pasar todo de entrada
      const inicial = await Promise.all(ej.verificaciones.map((v) => correr(ej.inicial, v.prueba)));
      if (inicial.every((r) => r.valor === true && !r.error)) fallar('el código inicial ya pasa todas las verificaciones');
      ok++;
    } else if (ej.arreglos && ej.error) {
      if (!(ej.culpable >= 1 && ej.culpable <= ej.codigo.split('\n').length)) fallar('culpable fuera del código');
      if (ej.arreglos.filter((a) => a.correcta).length !== 1) fallar('debe haber exactamente un arreglo correcto');
      if (usaNavegador(ej.codigo) || usaNodeArchivos(ej.codigo) || ej.sinEjecutar) { saltados.push(donde); continue; }
      const esperado = lineaError(ej.error);
      if (!esperado) { saltados.push(`${donde} (el error no es una excepción de JS)`); continue; }
      const r = await correr(ej.codigo);
      if (noEjecutable(r.error)) { saltados.push(`${donde} (${r.error.message})`); continue; }
      if (r.error?.name === 'RangeError' && /call stack/.test(r.error.message) && /call stack/.test(esperado)) { ok++; continue; }
      const real = r.error ? `${r.error.name}: ${r.error.message}` : '(no lanzó ningún error)';
      if (!parecido(esperado, real)) fallar(`el error no coincide\n    esperado: ${esperado}\n    real:     ${real}`);
      else ok++;
    } else if (ej.movimientos) {
      ok++;
    }
  }
}

console.log(`${ok} ejercicios comprobados`);
if (saltados.length) console.log(`${saltados.length} saltados (necesitan navegador o archivos):\n  ${saltados.join('\n  ')}`);
if (fallos.length) {
  console.log(`\n${fallos.length} problemas:\n  ${fallos.join('\n  ')}`);
  process.exit(1);
}
