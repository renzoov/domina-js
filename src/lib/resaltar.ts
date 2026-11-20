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
