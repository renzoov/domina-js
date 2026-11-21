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
    const etiqueta = (v as { [Symbol.toStringTag]?: unknown })[Symbol.toStringTag];
    if (typeof etiqueta === 'string' && etiqueta.startsWith('Temporal.')) return `${etiqueta} <${String(v)}>`;
    if (v instanceof URL) return `URL { href: '${v.href}' }`;
    if (v instanceof URLSearchParams) {
      const items = [...v].map(([k, x]) => `'${k}' => '${x}'`);
      return `URLSearchParams {${items.length ? ` ${items.join(', ')} ` : ''}}`;
    }
    if (v instanceof Promise) return 'Promise { … }';
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

// ── Entorno de ejecución ─────────────────────────────────────
// El código corre dentro de una función async (así funciona `await` en el nivel superior).
// Los temporizadores se cuentan para saber cuándo terminó todo lo asíncrono, como cuando
// Node.js termina un programa porque no le queda nada pendiente.

const ESPERA_MAX_MS = 2000;
// Atadas al global: las funciones del runtime fallan con «Illegal invocation» si `this` es otro objeto
const nativo = {
  setTimeout: setTimeout.bind(self),
  clearTimeout: clearTimeout.bind(self),
  setInterval: setInterval.bind(self),
  clearInterval: clearInterval.bind(self),
};
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as FunctionConstructor;

interface Entorno {
  salida: string[];
  error: string | null;
  global: Record<string, unknown>;
  esperar: () => Promise<void>;
  limpiar: () => void;
  fallar: (e: unknown) => void;
}

class TextoPromesa {
  constructor(public texto: string) {}
}
const PENDIENTE = Symbol('pendiente');

// Como Node.js: Promise { <pending> }, Promise { 'valor' } o Promise { <rejected> Error: … }.
// Si la promesa ya está resuelta, su reacción gana la carrera contra una marca que tarda tres microtareas.
function estadoDePromesa(p: Promise<unknown>): Promise<TextoPromesa> {
  const marca = Promise.resolve()
    .then(() => {})
    .then(() => PENDIENTE);
  const resultado = p.then(
    (valor) => ({ valor }),
    (motivo) => ({ motivo }),
  );
  return Promise.race([resultado, marca]).then((r) => {
    if (r === PENDIENTE) return new TextoPromesa('Promise { <pending> }');
    if ('valor' in r) return new TextoPromesa(`Promise { ${inspeccionar(r.valor, 1)} }`);
    return new TextoPromesa(`Promise { <rejected> ${formatear(r.motivo)} }`);
  });
}

function crearEntorno(salida: string[]): Entorno {
  const activos = new Map<number, 'una' | 'repite'>();
  let detenido = false;

  const ent: Entorno = {
    salida,
    error: null,
    global: {},
    fallar(e) {
      if (ent.error) return;
      ent.error = mensajeError(e);
      detenido = true;
      ent.limpiar();
    },
    async esperar() {
      const fin = Date.now() + ESPERA_MAX_MS;
      while (Date.now() < fin && !detenido) {
        // Cada vuelta deja correr las microtareas pendientes (promesas) antes de mirar
        await new Promise((r) => nativo.setTimeout(r, activos.size ? 4 : 0));
        if (activos.size === 0) {
          await new Promise((r) => nativo.setTimeout(r, 0));
          if (activos.size === 0) return;
        }
      }
    },
    limpiar() {
      for (const [id, tipo] of activos) (tipo === 'una' ? nativo.clearTimeout : nativo.clearInterval)(id);
      activos.clear();
    },
  };

  const proteger = (fn: unknown, args: unknown[]) => {
    if (detenido || typeof fn !== 'function') return;
    try {
      fn(...args);
    } catch (e) {
      ent.fallar(e);
    }
  };

  let nivel = 0;
  const log = (...a: unknown[]) => {
    if (salida.length >= 500) return;
    const sangria = '  '.repeat(nivel);
    if (!a.some((x) => x instanceof Promise)) {
      salida.push(sangria + a.map(formatear).join(' '));
      return;
    }
    // El estado de una promesa solo se conoce de forma asíncrona: se reserva la línea y se completa enseguida
    const i = salida.push('') - 1;
    Promise.all(a.map((x) => (x instanceof Promise ? estadoDePromesa(x) : x))).then((valores) => {
      salida[i] = sangria + valores.map((v) => (v instanceof TextoPromesa ? v.texto : formatear(v))).join(' ');
    });
  };
  const contadores = new Map<string, number>();
  const tiempos = new Map<string, number>();

  const consola: Record<string, (...a: any[]) => unknown> = {
    log,
    info: log,
    debug: log,
    warn: log,
    error: log,
    dir: log,
    trace: log,
    group: (...a: unknown[]) => {
      if (a.length) log(...a);
      nivel++;
    },
    groupCollapsed: (...a: unknown[]) => consola.group(...a),
    groupEnd: () => {
      nivel = Math.max(0, nivel - 1);
    },
    count: (etiqueta = 'default') => {
      const n = (contadores.get(etiqueta) ?? 0) + 1;
      contadores.set(etiqueta, n);
      log(`${etiqueta}: ${n}`);
    },
    countReset: (etiqueta = 'default') => contadores.delete(etiqueta),
    time: (etiqueta = 'default') => tiempos.set(etiqueta, performance.now()),
    timeLog: (etiqueta = 'default', ...a: unknown[]) => {
      const t = tiempos.get(etiqueta);
      if (t !== undefined) log(`${etiqueta}: ${(performance.now() - t).toFixed(3)}ms`, ...a);
    },
    timeEnd: (etiqueta = 'default') => {
      consola.timeLog(etiqueta);
      tiempos.delete(etiqueta);
    },
    assert: (condicion: unknown, ...a: unknown[]) => {
      if (!condicion) log('Assertion failed' + (a.length ? ':' : ''), ...a);
    },
    table: (datos: unknown) => {
      if (!datos || typeof datos !== 'object') return log(datos);
      const filas = Object.entries(datos as object);
      const esObjeto = (v: unknown) => !!v && typeof v === 'object';
      const columnas = [...new Set(filas.flatMap(([, v]) => (esObjeto(v) ? Object.keys(v) : ['Values'])))];
      const celda = (v: unknown) => (v === undefined ? '' : typeof v === 'string' ? `'${v}'` : formatear(v));
      const tabla = [
        ['(index)', ...columnas],
        ...filas.map(([k, v]) => [
          k,
          ...columnas.map((c) => (esObjeto(v) ? celda((v as Record<string, unknown>)[c]) : c === 'Values' ? celda(v) : '')),
        ]),
      ];
      const anchos = tabla[0].map((_, i) => Math.max(...tabla.map((f) => f[i].length)) + 2);
      const linea = (izq: string, med: string, der: string) => izq + anchos.map((w) => '─'.repeat(w)).join(med) + der;
      const fila = (f: string[]) =>
        '│' + f.map((c, i) => c.padStart(Math.ceil((anchos[i] + c.length) / 2)).padEnd(anchos[i])).join('│') + '│';
      log(linea('┌', '┬', '┐'));
      log(fila(tabla[0]));
      log(linea('├', '┼', '┤'));
      tabla.slice(1).forEach((f) => log(fila(f)));
      log(linea('└', '┴', '┘'));
    },
  };

  const setTimeout = (fn: unknown, ms = 0, ...args: unknown[]) => {
    const id = nativo.setTimeout(() => {
      activos.delete(id);
      proteger(fn, args);
    }, ms) as unknown as number;
    activos.set(id, 'una');
    return id;
  };
  const clearTimeout = (id: number) => {
    if (activos.delete(id)) nativo.clearTimeout(id);
  };
  const setInterval = (fn: unknown, ms = 0, ...args: unknown[]) => {
    const id = nativo.setInterval(() => proteger(fn, args), ms) as unknown as number;
    activos.set(id, 'repite');
    return id;
  };
  const clearInterval = (id: number) => {
    if (activos.delete(id)) nativo.clearInterval(id);
  };
  // El worker no dibuja: requestAnimationFrame se simula a unos 60 cuadros por segundo
  const requestAnimationFrame = (fn: unknown) => setTimeout(() => proteger(fn, [performance.now()]), 16);
  const cancelAnimationFrame = clearTimeout;
  // AbortSignal.timeout usa un reloj interno: se rehace con un temporizador que sí se cuenta
  const AbortSignalVigilado = new Proxy(AbortSignal, {
    get(objetivo, prop, receptor) {
      if (prop === 'timeout') {
        return (ms: number) => {
          const c = new AbortController();
          setTimeout(() => c.abort(new DOMException('signal timed out', 'TimeoutError')), ms);
          return c.signal;
        };
      }
      return Reflect.get(objetivo, prop, receptor);
    },
  });

  ent.global = {
    console: consola,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame,
    cancelAnimationFrame,
    AbortSignal: AbortSignalVigilado,
  };
  return ent;
}

async function ejecutar(codigo: string, ent: Entorno, prueba?: string): Promise<unknown> {
  // __codigo: el texto que escribió el lector, para verificar cómo resolvió (no solo qué imprimió).
  // Las verificaciones corren al final, cuando ya terminó todo lo asíncrono.
  const cuerpo = prueba ? `${codigo}\n;await __esperar();\nreturn await (async () => {\n${prueba}\n})();` : codigo;
  const nombres = [...Object.keys(ent.global), '__salida', '__codigo', '__esperar'];
  const valores = [...Object.values(ent.global), ent.salida, codigo, ent.esperar];
  // eslint-disable-next-line no-new-func
  const f = new AsyncFunction(...nombres, cuerpo);
  return f(...valores);
}

// Una promesa rechazada que nadie atrapó termina el programa, como en Node.js
let enCurso: Entorno | null = null;
self.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();
  enCurso?.fallar(e.reason);
});

self.onmessage = async (e: MessageEvent<{ codigo: string; pruebas: string[] }>) => {
  const { codigo, pruebas } = e.data;
  // La salida se guarda aunque el código falle a mitad: lo impreso antes del error también cuenta
  const salida: string[] = [];
  const principal = crearEntorno(salida);
  enCurso = principal;
  try {
    await ejecutar(codigo, principal);
  } catch (err) {
    principal.fallar(err);
  }
  await principal.esperar();
  principal.limpiar();
  enCurso = null;
  const error = principal.error;

  const resultados = await Promise.all(
    pruebas.map(async (p) => {
      if (error) return false;
      const ent = crearEntorno([]);
      try {
        return (await ejecutar(codigo, ent, p)) === true && !ent.error;
      } catch {
        return false;
      } finally {
        ent.limpiar();
      }
    }),
  );
  (self as unknown as Worker).postMessage({ salida, error, resultados });
};
