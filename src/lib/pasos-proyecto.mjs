// Arma el código de cada paso de un proyecto a partir de su app.js final.
//
// El app.js final está dividido en bloques:
//   // PASO n: título          ← empieza el bloque n (las líneas de comentario que siguen lo explican)
//   …código…
//   // FIN PASO n
// y termina con el arranque:
//   // ARRANQUE (desde el PASO n): …
// Una línea que termina en «// PASO m» se agrega recién en el paso m, aunque esté dentro de otro bloque.
//
// Con eso se puede armar el archivo tal como queda después de cualquier paso (para el esqueleto
// inicial y para verificar), y lo que hay que escribir en cada paso (para la guía).
// Lo usan la página de la guía (Astro) y herramientas/proyectos.mjs (Node).

const INICIO = /^\/\/ PASO (\d+): (.*)$/;
const FIN = /^\/\/ FIN PASO (\d+)\s*$/;
const ARRANQUE = /^\/\/ ARRANQUE \(desde el PASO (\d+)\)/;
const ETIQUETA = /\s*\/\/ PASO (\d+)\s*$/;
const FUNCION = /^(?:async\s+)?function\s+([\w$]+)\s*\(/;

/** Separa una línea en su texto y el paso en que se agrega (si lo dice su etiqueta) */
function linea(texto, pasoDelBloque) {
  const m = texto.match(ETIQUETA);
  return m ? { texto: texto.slice(0, m.index), paso: Number(m[1]) } : { texto, paso: pasoDelBloque };
}

export function analizar(fuente) {
  const lineas = fuente.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
  const cabecera = [];
  const bloques = [];
  let arranque = null;
  let actual = null;
  for (const texto of lineas) {
    const inicio = texto.match(INICIO);
    const fin = texto.match(FIN);
    const arr = texto.match(ARRANQUE);
    if (inicio) {
      actual = { n: Number(inicio[1]), titulo: inicio[2].trim(), encabezado: texto, explicacion: [], lineas: [] };
      bloques.push(actual);
    } else if (fin) {
      if (!actual || Number(fin[1]) !== actual.n) throw new Error(`«${texto}» no cierra el PASO abierto`);
      actual = null;
    } else if (arr) {
      arranque = { desde: Number(arr[1]), encabezado: texto, lineas: [] };
      actual = null;
    } else if (actual) {
      // Los comentarios del principio del bloque son su explicación
      if (!actual.lineas.length && /^\/\/( |$)/.test(texto)) actual.explicacion.push(texto);
      else actual.lineas.push(linea(texto, actual.n));
    } else if (arranque) {
      arranque.lineas.push(linea(texto, arranque.desde));
    } else if (!bloques.length) {
      cabecera.push(texto);
    } else if (texto.trim()) {
      throw new Error(`Hay código fuera de un PASO: «${texto}»`);
    }
  }
  if (actual) throw new Error(`Falta «// FIN PASO ${actual.n}»`);
  bloques.forEach((b, i) => {
    if (b.n !== i + 1) throw new Error(`Los pasos deben ir en orden: se esperaba el PASO ${i + 1} y vino el ${b.n}`);
    // Las líneas vacías del principio y del final del bloque no son parte del código
    while (b.lineas.length && !b.lineas[0].texto.trim()) b.lineas.shift();
    while (b.lineas.length && !b.lineas.at(-1).texto.trim()) b.lineas.pop();
  });
  return { cabecera, bloques, arranque };
}

/** Quita la sangría común (las líneas de un if que todavía no existe quedan sin sangrar) */
function desangrar(textos) {
  const sangrias = textos.filter((t) => t.trim()).map((t) => t.match(/^\s*/)[0].length);
  const comun = sangrias.length ? Math.min(...sangrias) : 0;
  return textos.map((t) => t.slice(comun));
}

function lineasArranque(an, k) {
  if (!an.arranque || k < an.arranque.desde) return [];
  return desangrar(an.arranque.lineas.filter((l) => l.paso <= k).map((l) => l.texto));
}

/**
 * El app.js tal como queda después del paso k. Con k = 0 es el esqueleto inicial:
 * cada bloque conserva solo su título y su explicación.
 */
export function archivoEnPaso(an, k) {
  const salida = [...an.cabecera];
  for (const b of an.bloques) {
    salida.push(b.encabezado, ...b.explicacion);
    if (b.n <= k) salida.push(...b.lineas.filter((l) => l.paso <= k).map((l) => l.texto));
    else salida.push('', '// Tu código va aquí', '');
    salida.push(`// FIN PASO ${b.n}`, '', '');
  }
  if (an.arranque && k >= an.arranque.desde) {
    salida.push(an.arranque.encabezado, ...lineasArranque(an, k));
  }
  return salida.join('\n').replace(/\n{3,}$/, '\n').replace(/\n*$/, '\n');
}

/**
 * Una función larga se muestra recortada: su primera línea, las líneas nuevas con dos de contexto
 * a cada lado y su cierre. Lo que se salta queda como «// …» con la sangría del código.
 */
const LARGA = 16;
const CONTEXTO = 2;
function recortar(lineas) {
  if (lineas.length <= LARGA) return lineas;
  const ver = new Set([0, lineas.length - 1]);
  lineas.forEach((l, i) => {
    if (!l.nueva) return;
    for (let j = i - CONTEXTO; j <= i + CONTEXTO; j++) if (j >= 0 && j < lineas.length) ver.add(j);
  });
  const salida = [];
  let saltando = false;
  lineas.forEach((l, i) => {
    if (ver.has(i)) {
      salida.push(l);
      saltando = false;
    } else if (!saltando) {
      const siguiente = lineas.slice(i).find((x) => x.texto.trim()) ?? l;
      salida.push({ texto: `${siguiente.texto.match(/^\s*/)[0]}// …`, nueva: false, omitido: true });
      saltando = true;
    }
  });
  return salida;
}

/**
 * Lo que hay que escribir en el paso n:
 * - codigo: el bloque n, sin su explicación (ya está en la guía);
 * - cambios: código que ya existía y crece en este paso. Cada cambio muestra la función
 *   (o el arranque) entera, tal como queda, con las líneas nuevas marcadas.
 */
export function paso(an, n) {
  const b = an.bloques.find((x) => x.n === n);
  if (!b) throw new Error(`No existe el PASO ${n}`);
  const codigo = b.lineas.filter((l) => l.paso <= n).map((l) => l.texto).join('\n');
  const cambios = [];

  for (const otro of an.bloques) {
    if (otro.n === n || otro.n > n) continue;
    const visibles = otro.lineas.filter((l) => l.paso <= n);
    const vistos = new Set();
    visibles.forEach((l, i) => {
      if (l.paso !== n) return;
      // La función de nivel superior que contiene la línea: desde «function x(» hasta su «}»
      let desde = i;
      while (desde >= 0 && !FUNCION.test(visibles[desde].texto)) desde--;
      if (desde < 0) {
        cambios.push({ donde: `el PASO ${otro.n}`, lineas: [{ texto: l.texto, nueva: true }] });
        return;
      }
      if (vistos.has(desde)) return;
      vistos.add(desde);
      let hasta = desde;
      while (hasta < visibles.length && visibles[hasta].texto !== '}') hasta++;
      const nombre = visibles[desde].texto.match(FUNCION)[1];
      cambios.push({
        donde: `${nombre}()`,
        paso: otro.n,
        lineas: recortar(visibles.slice(desde, hasta + 1).map((x) => ({ texto: x.texto, nueva: x.paso === n }))),
      });
    });
  }

  if (an.arranque && n >= an.arranque.desde) {
    const ahora = an.arranque.lineas.filter((l) => l.paso <= n);
    if (ahora.some((l) => l.paso === n)) {
      const textos = desangrar(ahora.map((l) => l.texto));
      cambios.push({
        donde: 'el arranque',
        lineas: ahora.map((l, i) => ({ texto: textos[i], nueva: l.paso === n })),
      });
    }
  }

  return {
    n,
    titulo: b.titulo,
    explicacion: b.explicacion.map((t) => t.replace(/^\/\/ ?/, '')),
    codigo,
    cambios,
  };
}
