// Sandbox con página: ejecuta el código del lector dentro de un <iframe sandbox="allow-scripts">,
// con un DOM de verdad. Lo usan los laboratorios y ejemplos de la sección «JavaScript en el navegador».
// El iframe no comparte origen con el sitio: no puede tocar la página, las cookies ni el almacenamiento.

export interface ResultadoPagina {
  salida: string[];
  error: string | null;
  resultados: boolean[];
}

// Esta función se convierte en texto y corre DENTRO del iframe: no puede usar nada de afuera.
function entornoPagina() {
  const ESPERA_MAX_MS = 2000;
  const nativo = {
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
  };
  const salida: string[] = [];
  let error: string | null = null;
  const activos = new Map<number, 'una' | 'repite' | 'cuadro'>();

  const mensaje = (e: unknown) => (e instanceof Error ? `${e.name}: ${e.message}` : `Uncaught ${String(e)}`);
  const fallar = (e: unknown) => {
    if (!error) error = mensaje(e);
  };

  function formatear(v: unknown, prof = 0): string {
    if (typeof v === 'string') return prof === 0 ? v : `'${v}'`;
    if (typeof v === 'function') return v.name ? `[Function: ${v.name}]` : '[Function (anonymous)]';
    if (typeof v === 'symbol' || typeof v === 'bigint') return String(v) + (typeof v === 'bigint' ? 'n' : '');
    if (v === null || typeof v !== 'object') return String(v);
    if (v instanceof Error) return `${v.name}: ${v.message}`;
    if (v instanceof Element) {
      const atributos = [...v.attributes].map((a) => ` ${a.name}="${a.value}"`).join('');
      return `<${v.tagName.toLowerCase()}${atributos}>`;
    }
    if (v instanceof Text) return `#text "${v.data}"`;
    if (v instanceof NodeList || v instanceof HTMLCollection) {
      const items = [...v].map((x) => formatear(x, prof + 1));
      return `${v.constructor.name}(${v.length}) [${items.length ? ` ${items.join(', ')} ` : ''}]`;
    }
    if (prof > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
    if (Array.isArray(v)) return v.length ? `[ ${v.map((x) => formatear(x, prof + 1)).join(', ')} ]` : '[]';
    if (v instanceof Map) return `Map(${v.size}) {${v.size ? ` ${[...v].map(([k, x]) => `${formatear(k, prof + 1)} => ${formatear(x, prof + 1)}`).join(', ')} ` : ''}}`;
    if (v instanceof Set) return `Set(${v.size}) {${v.size ? ` ${[...v].map((x) => formatear(x, prof + 1)).join(', ')} ` : ''}}`;
    if (v instanceof Event) return `${v.constructor.name} { type: '${v.type}' }`;
    const entradas = Object.entries(v);
    const nombre = v.constructor && v.constructor !== Object ? `${v.constructor.name} ` : '';
    return entradas.length ? `${nombre}{ ${entradas.map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${formatear(x, prof + 1)}`).join(', ')} }` : `${nombre}{}`;
  }

  const log = (...a: unknown[]) => {
    if (salida.length < 500) salida.push(a.map((x) => formatear(x)).join(' '));
  };
  for (const m of ['log', 'info', 'warn', 'error', 'debug', 'dir', 'table', 'trace'] as const) {
    (console as unknown as Record<string, unknown>)[m] = log;
  }

  const proteger = (fn: unknown, args: unknown[]) => {
    if (typeof fn !== 'function') return;
    try {
      fn(...args);
    } catch (e) {
      fallar(e);
    }
  };
  const w = window as unknown as Record<string, unknown>;
  w.setTimeout = (fn: unknown, ms = 0, ...args: unknown[]) => {
    const id = nativo.setTimeout(() => {
      activos.delete(id);
      proteger(fn, args);
    }, ms);
    activos.set(id, 'una');
    return id;
  };
  w.clearTimeout = (id: number) => {
    if (activos.delete(id)) nativo.clearTimeout(id);
  };
  w.setInterval = (fn: unknown, ms = 0, ...args: unknown[]) => {
    const id = nativo.setInterval(() => proteger(fn, args), ms);
    activos.set(id, 'repite');
    return id;
  };
  w.clearInterval = (id: number) => {
    if (activos.delete(id)) nativo.clearInterval(id);
  };
  w.requestAnimationFrame = (fn: unknown) => {
    const id = nativo.requestAnimationFrame((t) => {
      activos.delete(-id);
      proteger(fn, [t]);
    });
    activos.set(-id, 'cuadro');
    return id;
  };

  // Errores en eventos y promesas sin catch, como en la consola del navegador
  window.addEventListener('error', (e) => {
    e.preventDefault();
    fallar(e.error ?? e.message);
  });
  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();
    fallar(e.reason);
  });

  async function esperar() {
    const fin = Date.now() + ESPERA_MAX_MS;
    while (Date.now() < fin) {
      await new Promise((r) => nativo.setTimeout(r, activos.size ? 8 : 0));
      if (activos.size === 0) {
        await new Promise((r) => nativo.setTimeout(r, 0));
        if (activos.size === 0) return;
      }
    }
  }

  async function verificar(pruebas: (() => unknown)[]) {
    const r: boolean[] = [];
    for (const p of pruebas) {
      try {
        r.push((await p()) === true && !error);
      } catch {
        r.push(false);
      }
    }
    return r;
  }

  // Guarda contra bucles infinitos: mide cuánto lleva corriendo el tramo síncrono actual
  let inicioTramo = 0;
  const guardia = () => {
    const ahora = performance.now();
    if (!inicioTramo) {
      inicioTramo = ahora;
      queueMicrotask(() => nativo.setTimeout(() => (inicioTramo = 0), 0));
    }
    if (ahora - inicioTramo > 1500) throw new RangeError('Se detuvo un bucle que no terminaba (más de 1,5 s)');
  };

  window.addEventListener('message', async (e) => {
    const { codigo, original, pruebas } = e.data as { codigo: string; original: string; pruebas: string[] };
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const lista = `[${pruebas.map((p) => `async () => {\n${p}\n}`).join(',\n')}]`;
    const params = ['__salida', '__codigo', '__esperar', '__verificar', '__guardia'];
    let resultados: boolean[] = pruebas.map(() => false);
    try {
      let f;
      try {
        f = new AsyncFunction(...params, `${codigo}\n;await __esperar();\nreturn await __verificar(${lista});`);
      } catch {
        // Si el error de sintaxis está en el código del lector, se informa tal cual
        f = new AsyncFunction(...params, codigo);
      }
      const r = await f(salida, original, esperar, verificar, guardia);
      if (Array.isArray(r)) resultados = r;
    } catch (err) {
      fallar(err);
    }
    await esperar();
    parent.postMessage({ tipo: 'domina-pagina', salida, error, resultados: error ? resultados.map(() => false) : resultados }, '*');
  });
  parent.postMessage({ tipo: 'domina-pagina-lista' }, '*');
}

// Estilos de la página de prueba: pizarrón oscuro, sin depender de las fuentes del sitio
const ESTILOS = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 14px; background: #14201a; color: #eceae2; font: 15px/1.5 system-ui, sans-serif; }
  h1, h2, h3 { margin: 0 0 8px; color: #f7df1e; font-size: 1.15rem; }
  p { margin: 0 0 8px; }
  button { font: inherit; color: #14201a; background: #f7df1e; border: 0; border-radius: 6px; padding: 5px 12px; cursor: pointer; }
  button:disabled { opacity: .5; }
  input, select, textarea { font: inherit; color: #eceae2; background: rgba(0,0,0,.25); border: 2px solid rgba(236,234,226,.35); border-radius: 6px; padding: 4px 8px; }
  input:invalid { border-color: #f08a7e; }
  ul, ol { margin: 0 0 8px; padding-left: 22px; }
  a { color: #8fd0f7; }
  .oculto { display: none; }
  .hecha, .activo, .seleccionado { color: #c4ec8c; }
  .error { color: #f08a7e; }
`;

/**
 * En algunos navegadores el iframe comparte hilo con la página: un bucle infinito a medio escribir
 * la congelaría. Se agrega una guarda al principio de cada bucle con llaves, que lo corta a los 1,5 s.
 */
export function protegerBucles(codigo: string): string {
  let resultado = '';
  let i = 0;
  const re = /\b(for|while)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(codigo))) {
    // Busca el paréntesis que cierra la condición, contando niveles
    let nivel = 0;
    let j = m.index + m[0].length - 1;
    for (; j < codigo.length; j++) {
      if (codigo[j] === '(') nivel++;
      else if (codigo[j] === ')' && --nivel === 0) break;
    }
    const resto = codigo.slice(j + 1);
    const llave = resto.match(/^\s*\{/);
    if (!llave) continue;
    const fin = j + 1 + llave[0].length;
    resultado += codigo.slice(i, fin) + ' __guardia();';
    i = fin;
    re.lastIndex = fin;
  }
  return resultado + codigo.slice(i);
}

export function documentoPagina(html: string): string {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${ESTILOS}</style></head><body>${html}<script>(${entornoPagina.toString()})();<\/script></body></html>`;
}

const enCurso = new WeakMap<HTMLIFrameElement, () => void>();

/**
 * Ejecuta `codigo` en una página con `html` y devuelve la salida de consola y el resultado de las pruebas.
 * Si se pasa un iframe visible, el lector ve la página; si no, se crea uno fuera de la vista.
 */
export function ejecutarEnPagina(html: string, codigo: string, pruebas: string[], iframe?: HTMLIFrameElement, limiteMs = 4500): Promise<ResultadoPagina & { tiempo: boolean }> {
  const propio = !iframe;
  const marco = iframe ?? document.createElement('iframe');
  if (propio) {
    marco.setAttribute('aria-hidden', 'true');
    marco.tabIndex = -1;
    Object.assign(marco.style, { position: 'fixed', left: '-10000px', top: '0', width: '480px', height: '320px', border: '0' });
    document.body.append(marco);
  }
  marco.setAttribute('sandbox', 'allow-scripts allow-forms');

  // Una ejecución nueva en el mismo iframe cancela la anterior, que ya no importa
  enCurso.get(marco)?.();

  return new Promise((resolver) => {
    let terminado = false;
    const terminar = (r: ResultadoPagina & { tiempo: boolean }) => {
      if (terminado) return;
      terminado = true;
      enCurso.delete(marco);
      window.removeEventListener('message', escuchar);
      clearTimeout(reloj);
      if (propio) marco.remove();
      resolver(r);
    };
    enCurso.set(marco, () => terminar({ salida: [], error: null, resultados: [], tiempo: false }));
    const escuchar = (e: MessageEvent) => {
      if (e.source !== marco.contentWindow || !e.data) return;
      if (e.data.tipo === 'domina-pagina-lista') marco.contentWindow!.postMessage({ codigo: protegerBucles(codigo), original: codigo, pruebas }, '*');
      else if (e.data.tipo === 'domina-pagina') terminar({ ...(e.data as ResultadoPagina), tiempo: false });
    };
    const reloj = window.setTimeout(() => {
      // Un bucle infinito congela el iframe: se reemplaza su documento para detenerlo
      marco.srcdoc = '<!doctype html><body style="background:#14201a"></body>';
      terminar({ salida: [], error: null, resultados: pruebas.map(() => false), tiempo: true });
    }, limiteMs);
    window.addEventListener('message', escuchar);
    marco.srcdoc = documentoPagina(html);
  });
}
