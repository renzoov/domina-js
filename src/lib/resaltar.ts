// Resaltado mínimo de JavaScript para los ejemplos de las lecciones.
// Devuelve una línea de HTML por cada línea de código.

const PALABRAS = new Set([
  'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do', 'new',
  'class', 'extends', 'super', 'this', 'import', 'export', 'from', 'async', 'await', 'yield',
  'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'switch', 'case',
  'break', 'continue', 'default', 'null', 'undefined', 'true', 'false', 'using',
]);

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TOKEN =
  /(\/\/.*$)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

export function resaltarLinea(linea: string): string {
  let html = '';
  let ultimo = 0;
  for (const m of linea.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    html += escapar(linea.slice(ultimo, i));
    const [texto, comentario, cadena, numero, llamada, ident] = m;
    if (comentario) html += `<span class="t-com">${escapar(texto)}</span>`;
    else if (cadena) html += `<span class="t-str">${escapar(texto)}</span>`;
    else if (numero) html += `<span class="t-num">${escapar(texto)}</span>`;
    else if (llamada) html += PALABRAS.has(llamada) ? `<span class="t-kw">${llamada}</span>` : `<span class="t-fn">${llamada}</span>`;
    else if (ident) html += PALABRAS.has(ident) ? `<span class="t-kw">${ident}</span>` : escapar(ident);
    ultimo = i + texto.length;
  }
  return html + escapar(linea.slice(ultimo));
}

export function resaltar(codigo: string): string[] {
  return codigo.replace(/\n$/, '').split('\n').map(resaltarLinea);
}

// ── Código dentro de textos escritos en HTML (preguntas, opciones) ──────────────
// Los datos escriben el código como <code>…</code>, una línea por <code>, separadas con <br>.
const desescapar = (s: string) =>
  s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const SOLO_CODIGO = /^\s*<code>([^<]*)<\/code>\s*$/;
const CODIGO_EN_LINEA = /<code>([^<]*)<\/code>/g;

/** Colorea el código suelto dentro de un texto: <code>x</code> pasa a tener sus tokens resaltados */
export function resaltarEnLinea(html: string): string {
  return html.replace(CODIGO_EN_LINEA, (_, c: string) => `<code class="hl">${resaltarLinea(desescapar(c))}</code>`);
}

/**
 * Convierte las líneas seguidas que son solo <code> en un bloque de código resaltado, como en el editor,
 * y colorea el código que queda suelto en el texto. Una línea vacía entre dos líneas de código queda dentro del bloque.
 */
export function resaltarHtml(html: string): string {
  const partes = html.split(/<br\s*\/?>/);
  const salida: string[] = [];
  let bloque: string[] = [];
  let texto: string[] = [];
  const cerrarBloque = () => {
    if (!bloque.length) return;
    while (bloque.at(-1) === '') bloque.pop();
    const lineas = bloque.map((l) => `<span class="l">${resaltarLinea(l) || ' '}</span>`).join('');
    salida.push(`<span class="codigo-p" tabindex="0">${lineas}</span>`);
    bloque = [];
  };
  const cerrarTexto = () => {
    if (texto.length) salida.push(texto.map(resaltarEnLinea).join('<br>'));
    texto = [];
  };
  partes.forEach((parte, i) => {
    const m = parte.match(SOLO_CODIGO);
    const vaciaEntreCodigo = parte.trim() === '' && bloque.length > 0 && SOLO_CODIGO.test(partes[i + 1] ?? '');
    if (m) {
      cerrarTexto();
      bloque.push(desescapar(m[1]));
    } else if (vaciaEntreCodigo) {
      bloque.push('');
    } else {
      cerrarBloque();
      if (parte.trim() !== '') texto.push(parte);
    }
  });
  cerrarBloque();
  cerrarTexto();
  return salida.join('');
}
