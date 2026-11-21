// Ejecuta el código del lector fuera de la página principal.
// Recibe { codigo, pruebas } y devuelve la salida de consola y el resultado de cada prueba.

// Muestra los valores como lo hace console.log en Node.js: [ 'pan', 'leche' ], { nombre: 'Ana' }
function inspeccionar(v: unknown, profundidad = 0, vistos = new WeakSet<object>()): string {
  if (typeof v === 'string') return profundidad === 0 ? v : `'${v}'`;
  if (typeof v === 'bigint') return `${v}n`;
  if (typeof v === 'symbol') return v.toString();
  if (typeof v === 'function') {
    if (/^class[\s{]/.test(Function.prototype.toString.call(v))) return v.name ? `[class ${v.name}]` : '[class (anonymous)]';
    return v.name ? `[Function: ${v.name}]` : '[Function (anonymous)]';
  }
  if (v === null || typeof v !== 'object') return String(v);
  if (vistos.has(v)) return '[Circular]';
  if (profundidad > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
  vistos.add(v);
  try {
    if (v instanceof Error) return `${v.name}: ${v.message}`;
    if (v instanceof Date) return v.toISOString();
    if (v instanceof Map) {
      const items = [...v].map(([k, x]) => `${inspeccionar(k, profundidad + 1, vistos)} => ${inspeccionar(x, profundidad + 1, vistos)}`);
      return `Map(${v.size}) {${items.length ? ` ${items.join(', ')} ` : ''}}`;
    }
    if (v instanceof Set) {
      const items = [...v].map((x) => inspeccionar(x, profundidad + 1, vistos));
      return `Set(${v.size}) {${items.length ? ` ${items.join(', ')} ` : ''}}`;
    }
    if (ArrayBuffer.isView(v) && !(v instanceof DataView)) {
      const t = v as unknown as ArrayLike<number | bigint>;
      const items = Array.from(t, (x) => inspeccionar(x, profundidad + 1, vistos));
      return `${v.constructor.name}(${t.length}) [${items.length ? ` ${items.join(', ')} ` : ''}]`;
    }
    if (Array.isArray(v)) {
      const items = v.map((x) => inspeccionar(x, profundidad + 1, vistos));
      return items.length ? `[ ${items.join(', ')} ]` : '[]';
    }
    const clave = (k: string) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`);
    const items = Object.entries(v).map(([k, x]) => `${clave(k)}: ${inspeccionar(x, profundidad + 1, vistos)}`);
    const nombre = v.constructor && v.constructor !== Object ? `${v.constructor.name} ` : '';
    return items.length ? `${nombre}{ ${items.join(', ')} }` : `${nombre}{}`;
  } finally {
    vistos.delete(v);
  }
}

function formatear(v: unknown): string {
  try {
    return inspeccionar(v);
  } catch {
    return String(v);
  }
}

function mensajeError(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`;
  return String(e);
}

function ejecutar(codigo: string, prueba?: string, salida: string[] = []) {
  const consola = {
    log: (...a: unknown[]) => {
      if (salida.length < 500) salida.push(a.map(formatear).join(' '));
    },
  };
  const cuerpo = prueba ? `${codigo}\n;return (() => {\n${prueba}\n})();` : codigo;
  // eslint-disable-next-line no-new-func
  // __codigo: el texto que escribió el lector, para verificar cómo resolvió (no solo qué imprimió)
  const f = new Function('console', '__salida', '__codigo', cuerpo);
  const resultado = f(consola, salida, codigo);
  return { salida, resultado };
}

self.onmessage = (e: MessageEvent<{ codigo: string; pruebas: string[] }>) => {
  const { codigo, pruebas } = e.data;
  // La salida se guarda aunque el código falle a mitad: lo impreso antes del error también cuenta
  const salida: string[] = [];
  let error: string | null = null;
  try {
    ejecutar(codigo, undefined, salida);
  } catch (err) {
    error = mensajeError(err);
  }
  const resultados = pruebas.map((p) => {
    if (error) return false;
    try {
      return ejecutar(codigo, p).resultado === true;
    } catch {
      return false;
    }
  });
  (self as unknown as Worker).postMessage({ salida, error, resultados });
};
