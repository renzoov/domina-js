// Rayos X: ejecuta código del lector con un intérprete propio y anota cada paso (pila, variables,
// consola y explicación) en el mismo formato que los pizarrones escritos a mano (DatosVisualizador).
//
// Etapa 1 (prototipo): un subconjunto de JavaScript. Funciones (declaraciones, expresiones y flechas),
// closures, let/const/var con hoisting y zona muerta temporal, if, switch, for, while, for…of,
// break/continue, try/catch/throw, arrays, objetos, plantillas y console.log. Lo que no está soportado
// se informa con su nombre y su línea, en lugar de fallar en silencio.
//
// No usa eval: recorre el árbol de Acorn. Corta a los MAX_PASOS pasos y a las MAX_OPERACIONES
// operaciones, así un bucle infinito no congela la página.
import { parse } from 'acorn';
import type { DatosVisualizador, Marco, Paso, Evento } from './visualizador';

const MAX_PASOS = 300;
const MAX_OPERACIONES = 200_000;
const MAX_PROFUNDIDAD = 12;
// Con más marcos que esto, los del medio se juntan en uno («… 4 llamadas más»)
const MAX_VISIBLES = 8;

export interface ResultadoRayosX {
  datos?: DatosVisualizador;
  /** El código no se pudo analizar o usa algo que todavía no está soportado */
  error?: string;
}

// ── Nodos de Acorn (lo justo para este intérprete) ───────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Nodo = any;

// ── Control de flujo ─────────────────────────────────────────────────────────
class Retorno { valor: unknown; constructor(valor: unknown) { this.valor = valor; } }
class Corte { etiqueta?: string; constructor(etiqueta?: string) { this.etiqueta = etiqueta; } }
class Sigue { etiqueta?: string; constructor(etiqueta?: string) { this.etiqueta = etiqueta; } }
class Lanzado { valor: unknown; linea: number; constructor(valor: unknown, linea: number) { this.valor = valor; this.linea = linea; } }
class NoSoportado extends Error {}
class Detenido extends Error {}

// ── Variables y scopes ───────────────────────────────────────────────────────
interface Variable { valor: unknown; tipo: 'let' | 'const' | 'var' | 'param' | 'function'; lista: boolean }
class Scope {
  vars = new Map<string, Variable>();
  padre: Scope | null;
  deFuncion: boolean;
  constructor(padre: Scope | null, deFuncion = false) { this.padre = padre; this.deFuncion = deFuncion; }
  buscar(nombre: string): Variable | undefined {
    return this.vars.get(nombre) ?? this.padre?.buscar(nombre);
  }
}

class Funcion {
  nombre: string;
  nodo: Nodo;
  scope: Scope;
  esFlecha: boolean;
  thisLexico: unknown;
  constructor(nombre: string, nodo: Nodo, scope: Scope, esFlecha: boolean, thisLexico: unknown) {
    this.nombre = nombre;
    this.nodo = nodo;
    this.scope = scope;
    this.esFlecha = esFlecha;
    this.thisLexico = thisLexico;
  }
}

interface Marco_ { etiqueta: string; scope: Scope; lineaLlamada: number }

// ── Mostrar valores como los mostraría la consola ─────────────────────────────
function mostrar(v: unknown, anidado = false, prof = 0): string {
  if (typeof v === 'string') return anidado ? `"${v}"` : v;
  if (v instanceof Funcion) return v.nombre ? `[Function: ${v.nombre}]` : '[Function (anónima)]';
  if (typeof v === 'function') return `[Function: ${v.name || 'nativa'}]`;
  if (typeof v === 'bigint') return `${v}n`;
  if (typeof v === 'symbol') return v.toString();
  if (v === null || typeof v !== 'object') return String(v);
  if (prof > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (v instanceof Map) return `Map(${v.size}) {${v.size ? ' ' + [...v].map(([k, x]) => `${mostrar(k, true, prof + 1)} => ${mostrar(x, true, prof + 1)}`).join(', ') + ' ' : ''}}`;
  if (v instanceof Set) return `Set(${v.size}) {${v.size ? ' ' + [...v].map((x) => mostrar(x, true, prof + 1)).join(', ') + ' ' : ''}}`;
  if (Array.isArray(v)) return v.length ? `[ ${v.map((x) => mostrar(x, true, prof + 1)).join(', ')} ]` : '[]';
  const items = Object.entries(v).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `"${k}"`}: ${mostrar(x, true, prof + 1)}`);
  return items.length ? `{ ${items.join(', ')} }` : '{}';
}
// Versión corta para las notas de la pila
function corto(v: unknown): string {
  if (v instanceof Funcion) return v.nombre ? `función ${v.nombre}` : 'una función';
  const t = mostrar(v, true);
  return t.length > 28 ? t.slice(0, 27) + '…' : t;
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cod = (s: string) => `<code>${esc(s.length > 48 ? s.slice(0, 47) + '…' : s)}</code>`;

// Nombres amables de lo que todavía no se soporta
const NOMBRES: Record<string, string> = {
  ClassDeclaration: 'las clases (<code>class</code>)', ClassExpression: 'las clases (<code>class</code>)',
  AwaitExpression: '<code>await</code>', YieldExpression: 'los generadores (<code>yield</code>)',
  ImportDeclaration: '<code>import</code>', ExportNamedDeclaration: '<code>export</code>', ExportDefaultDeclaration: '<code>export</code>',
  ObjectPattern: 'la desestructuración', ArrayPattern: 'la desestructuración', NewExpression: '<code>new</code>',
  ForInStatement: '<code>for…in</code>', DoWhileStatement: '<code>do…while</code>', LabeledStatement: 'las etiquetas',
  TaggedTemplateExpression: 'los template tags', ThisExpression: '<code>this</code> fuera de un método',
};

// Funciones y objetos del entorno que se pueden usar
const GLOBALES: Record<string, unknown> = {
  Math, JSON, Number, String, Boolean, Array, Object, parseInt, parseFloat, isNaN, isFinite,
  Infinity, NaN, undefined, Map, Set, Error, TypeError, RangeError, ReferenceError, Symbol,
};
const CONSTRUCTORES = new Set<unknown>([Map, Set, Error, TypeError, RangeError, ReferenceError, Array, Object]);

export function radiografiar(codigo: string): ResultadoRayosX {
  let programa: Nodo;
  try {
    programa = parse(codigo, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
  } catch (e) {
    const m = e as SyntaxError & { loc?: { line: number } };
    return { error: `El código tiene un error de sintaxis${m.loc ? ` en la línea ${m.loc.line}` : ''}: ${esc(m.message.replace(/\s*\(\d+:\d+\)$/, ''))}.` };
  }

  const pasos: Paso[] = [];
  const consola: string[] = [];
  const marcos: Marco_[] = [];
  let operaciones = 0;
  // Foto de la pila y la línea en el momento del error, antes de que se deshaga la pila
  let fotoError: { pila: Marco[]; linea: number } | null = null;
  let lineaActual = 0;
  const global = new Scope(null, true);
  for (const [k, v] of Object.entries(GLOBALES)) global.vars.set(k, { valor: v, tipo: 'const', lista: true });
  const fuente = (n: Nodo) => codigo.slice(n.start, n.end);
  const linea = (n: Nodo) => n.loc.start.line as number;

  // ── Pasos ──────────────────────────────────────────────────────────────────
  function variablesDe(m: Marco_, scopeActual: Scope): string {
    const partes: string[] = [];
    const vistos = new Set<string>();
    for (let s: Scope | null = scopeActual; s; s = s.padre) {
      for (const [nombre, v] of s.vars) {
        if (vistos.has(nombre) || !v.lista || v.tipo === 'function' || v.valor instanceof Funcion) continue;
        vistos.add(nombre);
        partes.push(`${nombre} = ${corto(v.valor)}`);
      }
      if (s === m.scope) break;
    }
    // Lo que recuerda por closure: variables de las funciones que la contienen (sin llegar al global)
    const recordadas: string[] = [];
    for (let s: Scope | null = m.scope.padre; s && s !== global; s = s.padre) {
      for (const [nombre, v] of s.vars) {
        if (vistos.has(nombre) || !v.lista || nombre === 'this' || v.tipo === 'function' || v.valor instanceof Funcion) continue;
        vistos.add(nombre);
        recordadas.push(`${nombre} = ${corto(v.valor)} (recordada)`);
      }
    }
    return [...partes.reverse(), ...recordadas].join(', ');
  }
  let scopeEnCurso: Scope = global;
  function pila(): Marco[] {
    const todos: Marco[] = marcos.map((m, i) => {
      const arriba = i === marcos.length - 1;
      const nota = arriba ? variablesDe(m, scopeEnCurso) : `esperando en la línea ${marcos[i + 1].lineaLlamada}`;
      return { nombre: m.etiqueta, ...(nota ? { nota } : {}) };
    });
    if (todos.length <= MAX_VISIBLES) return todos;
    const ocultos = todos.length - (MAX_VISIBLES - 1);
    return [todos[0], { nombre: `… ${ocultos} llamadas más`, nota: 'todas esperando' }, ...todos.slice(ocultos + 1)];
  }
  function paso(lineas: number[], evento: Evento, texto: string, anotacion?: string) {
    if (pasos.length >= MAX_PASOS) throw new Detenido();
    pasos.push({
      lineas,
      ...(marcos.length > 1 ? { espera: marcos.slice(1).map((m) => m.lineaLlamada) } : {}),
      pila: pila(),
      consola: [...consola],
      texto,
      evento,
      ...(anotacion ? { anotacion } : {}),
    });
  }
  function contar() {
    if (++operaciones > MAX_OPERACIONES) throw new Detenido();
  }

  // ── Declaraciones y hoisting ──────────────────────────────────────────────
  function elevar(cuerpo: Nodo[], scope: Scope, funcionScope: Scope) {
    for (const s of cuerpo) {
      if (s.type === 'FunctionDeclaration') scope.vars.set(s.id.name, { valor: new Funcion(s.id.name, s, scope, false, undefined), tipo: 'function', lista: true });
      else if (s.type === 'VariableDeclaration') {
        for (const d of s.declarations) {
          if (d.id.type !== 'Identifier') throw noSoportado(d.id);
          if (s.kind === 'var') { if (!funcionScope.vars.has(d.id.name)) funcionScope.vars.set(d.id.name, { valor: undefined, tipo: 'var', lista: true }); }
          else scope.vars.set(d.id.name, { valor: undefined, tipo: s.kind, lista: false });
        }
      }
    }
    // var dentro de bloques anidados también sube al scope de la función
    const buscarVar = (n: Nodo) => {
      if (!n || typeof n !== 'object') return;
      if (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression') return;
      if (n.type === 'VariableDeclaration' && n.kind === 'var') for (const d of n.declarations) if (d.id.type === 'Identifier' && !funcionScope.vars.has(d.id.name)) funcionScope.vars.set(d.id.name, { valor: undefined, tipo: 'var', lista: true });
      for (const k of Object.keys(n)) if (k !== 'loc') { const v = n[k]; if (Array.isArray(v)) v.forEach(buscarVar); else if (v && typeof v.type === 'string') buscarVar(v); }
    };
    if (scope === funcionScope) for (const s of cuerpo) if (s.type !== 'VariableDeclaration') buscarVar(s);
  }

  function noSoportado(n: Nodo) {
    const nombre = NOMBRES[n.type] ?? `<code>${n.type}</code>`;
    return new NoSoportado(`Rayos X todavía no sabe mostrar ${nombre} (línea ${linea(n)}). Por ahora entiende funciones, variables, condicionales, bucles, arrays, objetos y <code>console.log</code>.`);
  }

  // ── Sentencias ────────────────────────────────────────────────────────────
  function ejecutarBloque(cuerpo: Nodo[], scope: Scope) {
    const antes = scopeEnCurso;
    scopeEnCurso = scope;
    try {
      for (const s of cuerpo) sentencia(s, scope);
    } finally {
      scopeEnCurso = antes;
    }
  }

  function sentencia(s: Nodo, scope: Scope, etiqueta?: string): void {
    contar();
    scopeEnCurso = scope;
    lineaActual = linea(s);
    switch (s.type) {
      case 'FunctionDeclaration':
      case 'EmptyStatement':
        return;
      case 'VariableDeclaration': {
        for (const d of s.declarations) {
          const valor = d.init ? evaluar(d.init, scope) : undefined;
          const destino = s.kind === 'var' ? scope.buscar(d.id.name)! : scope.vars.get(d.id.name)!;
          destino.valor = nombrar(valor, d.id.name);
          destino.lista = true;
          paso([linea(d)], 'ejecuta', d.init
            ? `Se guarda ${cod(d.id.name)} = ${cod(corto(valor))}${s.kind === 'const' ? ' (constante)' : ''}.`
            : `Se declara ${cod(d.id.name)}, todavía sin valor: vale ${cod('undefined')}.`);
        }
        return;
      }
      case 'ExpressionStatement': {
        const e = s.expression;
        const esLog = e.type === 'CallExpression' && e.callee.type === 'MemberExpression' && e.callee.object.name === 'console';
        const antes = consola.length;
        const valor = evaluar(e, scope);
        if (esLog && consola.length > antes) paso([linea(s)], 'imprime', `${cod(fuente(e.callee))} imprime ${cod(consola.at(-1)!)} en la consola.`);
        else if (e.type === 'AssignmentExpression' || e.type === 'UpdateExpression') paso([linea(s)], 'ejecuta', `${cod(fuente(e))}: ahora ${cod(fuente(e.type === 'UpdateExpression' ? e.argument : e.left))} vale ${cod(corto(evaluarSinPasos(e.type === 'UpdateExpression' ? e.argument : e.left, scope)))}.`);
        else if (e.type !== 'CallExpression') paso([linea(s)], 'ejecuta', `Se evalúa ${cod(fuente(e))}: da ${cod(corto(valor))}.`);
        return;
      }
      case 'ReturnStatement': {
        const valor = s.argument ? evaluar(s.argument, scope) : undefined;
        paso([linea(s)], 'ejecuta', s.argument ? `${cod('return')} devuelve ${cod(corto(valor))}.` : `${cod('return')} sin valor: la función devuelve ${cod('undefined')}.`);
        throw new Retorno(valor);
      }
      case 'IfStatement': {
        const v = evaluar(s.test, scope);
        paso([linea(s)], 'ejecuta', `La condición ${cod(fuente(s.test))} da ${cod(corto(v))}: ${v ? 'entra al <code>if</code>.' : s.alternate ? 'va al <code>else</code>.' : 'se salta el bloque.'}`);
        if (v) sentencia(s.consequent, scope);
        else if (s.alternate) sentencia(s.alternate, scope);
        return;
      }
      case 'BlockStatement': {
        const bloque = new Scope(scope);
        elevar(s.body, bloque, funcionDe(scope));
        ejecutarBloque(s.body, bloque);
        return;
      }
      case 'ForStatement': {
        const sc = new Scope(scope);
        if (s.init) {
          if (s.init.type === 'VariableDeclaration') { elevar([s.init], sc, funcionDe(scope)); sentencia(s.init, sc); }
          else evaluar(s.init, sc);
        }
        // let en el for: cada vuelta tiene su propia copia de la variable (por eso los closures ven 0, 1, 2).
        // Como en la especificación: se copia antes de la primera vuelta y antes de cada actualización.
        const copiar = (de: Scope) => { const c = new Scope(de.padre); for (const [k, v] of de.vars) c.vars.set(k, { ...v }); return c; };
        let vuelta = copiar(sc);
        for (;;) {
          contar();
          if (s.test) {
            const v = evaluar(s.test, vuelta);
            paso([linea(s)], 'ejecuta', `Condición del <code>for</code>: ${cod(fuente(s.test))} da ${cod(corto(v))}${v ? '.' : ': el bucle termina.'}`);
            if (!v) break;
          }
          try { sentencia(s.body, vuelta); }
          catch (e) { if (e instanceof Corte && (!e.etiqueta || e.etiqueta === etiqueta)) break; if (!(e instanceof Sigue && (!e.etiqueta || e.etiqueta === etiqueta))) throw e; }
          vuelta = copiar(vuelta);
          if (s.update) evaluar(s.update, vuelta);
        }
        return;
      }
      case 'WhileStatement': {
        for (;;) {
          contar();
          const v = evaluar(s.test, scope);
          paso([linea(s)], 'ejecuta', `Condición del <code>while</code>: ${cod(fuente(s.test))} da ${cod(corto(v))}${v ? '.' : ': el bucle termina.'}`);
          if (!v) break;
          try { sentencia(s.body, scope); }
          catch (e) { if (e instanceof Corte && (!e.etiqueta || e.etiqueta === etiqueta)) break; if (!(e instanceof Sigue && (!e.etiqueta || e.etiqueta === etiqueta))) throw e; }
        }
        return;
      }
      case 'ForOfStatement': {
        const iterable = evaluar(s.right, scope) as Iterable<unknown>;
        if (iterable == null || typeof (iterable as { [Symbol.iterator]?: unknown })[Symbol.iterator] !== 'function') throw new TypeError(`${fuente(s.right)} is not iterable`);
        const decl = s.left;
        if (decl.type !== 'VariableDeclaration' || decl.declarations[0].id.type !== 'Identifier') throw noSoportado(decl.type === 'VariableDeclaration' ? decl.declarations[0].id : decl);
        const nombre = decl.declarations[0].id.name;
        for (const valor of iterable) {
          contar();
          const vuelta = new Scope(scope);
          vuelta.vars.set(nombre, { valor, tipo: decl.kind, lista: true });
          scopeEnCurso = vuelta;
          paso([linea(s)], 'ejecuta', `Vuelta del <code>for…of</code>: ${cod(nombre)} = ${cod(corto(valor))}.`);
          try { sentencia(s.body, vuelta); }
          catch (e) { if (e instanceof Corte && (!e.etiqueta || e.etiqueta === etiqueta)) break; if (!(e instanceof Sigue && (!e.etiqueta || e.etiqueta === etiqueta))) throw e; }
        }
        return;
      }
      case 'BreakStatement':
        paso([linea(s)], 'ejecuta', `${cod('break')}: sale del bucle.`);
        throw new Corte(s.label?.name);
      case 'ContinueStatement':
        paso([linea(s)], 'ejecuta', `${cod('continue')}: salta a la siguiente vuelta.`);
        throw new Sigue(s.label?.name);
      case 'SwitchStatement': {
        const v = evaluar(s.discriminant, scope);
        const bloque = new Scope(scope);
        let entro = false;
        const k = s.cases.findIndex((c: Nodo) => c.test && evaluar(c.test, scope) === v);
        const desde = k >= 0 ? k : s.cases.findIndex((c: Nodo) => !c.test);
        paso([linea(s)], 'ejecuta', desde >= 0 ? `${cod(`switch (${fuente(s.discriminant)})`)} vale ${cod(corto(v))}: salta a ${s.cases[desde].test ? cod(`case ${fuente(s.cases[desde].test)}`) : cod('default')}.` : `Ningún ${cod('case')} coincide con ${cod(corto(v))}.`);
        if (desde < 0) return;
        try {
          for (const c of s.cases.slice(desde)) { entro = true; elevar(c.consequent, bloque, funcionDe(scope)); ejecutarBloque(c.consequent, bloque); }
        } catch (e) { if (!(e instanceof Corte && !e.etiqueta)) throw e; }
        void entro;
        return;
      }
      case 'ThrowStatement': {
        const v = evaluar(s.argument, scope);
        paso([linea(s)], 'error', `${cod('throw')} lanza ${cod(corto(v))}. Busca un <code>catch</code> que lo atrape.`);
        throw new Lanzado(v, linea(s));
      }
      case 'TryStatement': {
        try {
          sentencia(s.block, scope);
        } catch (e) {
          if (!s.handler || e instanceof Retorno || e instanceof Corte || e instanceof Sigue || e instanceof Detenido || e instanceof NoSoportado) throw e;
          const valor = e instanceof Lanzado ? e.valor : e;
          fotoError = null;
          const sc = new Scope(scope);
          if (s.handler.param) {
            if (s.handler.param.type !== 'Identifier') throw noSoportado(s.handler.param);
            sc.vars.set(s.handler.param.name, { valor, tipo: 'let', lista: true });
          }
          scopeEnCurso = sc;
          paso([linea(s.handler)], 'ejecuta', `El <code>catch</code> atrapa el error: ${cod(corto(valor))}.`);
          sentencia(s.handler.body, sc);
        } finally {
          if (s.finalizer) { paso([linea(s.finalizer)], 'ejecuta', 'El <code>finally</code> se ejecuta siempre.'); sentencia(s.finalizer, scope); }
        }
        return;
      }
      case 'LabeledStatement':
        return sentencia(s.body, scope, s.label.name);
      default:
        throw noSoportado(s);
    }
  }

  const funcionDe = (s: Scope): Scope => (s.deFuncion || !s.padre ? s : funcionDe(s.padre));
  const nombrar = (v: unknown, nombre: string) => { if (v instanceof Funcion && !v.nombre) v.nombre = nombre; return v; };

  // ── Llamadas ──────────────────────────────────────────────────────────────
  function llamar(f: Funcion, args: unknown[], thisValor: unknown, lineaLlamada: number): unknown {
    if (marcos.length >= MAX_PROFUNDIDAD) throw new RangeError('Maximum call stack size exceeded');
    const nodo = f.nodo;
    const sc = new Scope(f.scope, true);
    sc.vars.set('this', { valor: f.esFlecha ? f.thisLexico : thisValor, tipo: 'const', lista: false });
    nodo.params.forEach((p: Nodo, i: number) => {
      if (p.type === 'Identifier') sc.vars.set(p.name, { valor: args[i], tipo: 'param', lista: true });
      else if (p.type === 'AssignmentPattern' && p.left.type === 'Identifier') sc.vars.set(p.left.name, { valor: args[i] === undefined ? evaluar(p.right, sc) : args[i], tipo: 'param', lista: true });
      else if (p.type === 'RestElement' && p.argument.type === 'Identifier') sc.vars.set(p.argument.name, { valor: args.slice(i), tipo: 'param', lista: true });
      else throw noSoportado(p);
    });
    const etiqueta = `${f.nombre || 'anónima'}(${args.map((a) => corto(a)).join(', ')})`;
    const marco: Marco_ = { etiqueta: etiqueta.length > 30 ? `${f.nombre || 'anónima'}(…)` : etiqueta, scope: sc, lineaLlamada };
    marcos.push(marco);
    const antes = scopeEnCurso;
    scopeEnCurso = sc;
    const params = variablesDe(marco, sc);
    paso([linea(nodo)], 'entra', `${cod(marco.etiqueta)} entra a la pila${params ? ` con ${cod(params)}` : ''}. El motor ejecuta su cuerpo.`, 'entra');
    let valor: unknown;
    try {
      if (nodo.expression) {
        valor = evaluar(nodo.body, sc);
        paso([linea(nodo.body)], 'ejecuta', `La flecha devuelve ${cod(corto(valor))}.`);
      } else {
        elevar(nodo.body.body, sc, sc);
        ejecutarBloque(nodo.body.body, sc);
      }
    } catch (e) {
      if (!(e instanceof Retorno)) {
        if (!fotoError && !(e instanceof Corte || e instanceof Sigue || e instanceof Detenido || e instanceof NoSoportado)) fotoError = { pila: pila(), linea: lineaActual };
        marcos.pop();
        scopeEnCurso = antes;
        throw e;
      }
      valor = e.valor;
    }
    marcos.pop();
    scopeEnCurso = antes;
    paso([lineaLlamada], 'sale', `${cod(marco.etiqueta)} sale de la pila y devuelve ${cod(corto(valor))}.`, 'sale');
    return valor;
  }

  // Una función del lector pasada a algo nativo (map, forEach, sort…) se llama igual, paso a paso
  function aNativa(v: unknown, lineaLlamada: number): unknown {
    return v instanceof Funcion ? (...a: unknown[]) => llamar(v, a, undefined, lineaLlamada) : v;
  }

  // ── Expresiones ───────────────────────────────────────────────────────────
  let silencio = 0;
  function evaluarSinPasos(n: Nodo, scope: Scope) {
    silencio++;
    try { return evaluar(n, scope); } finally { silencio--; }
  }

  function leer(nombre: string, scope: Scope): unknown {
    const v = scope.buscar(nombre);
    if (!v) throw new ReferenceError(`${nombre} is not defined`);
    if (!v.lista) throw new ReferenceError(`Cannot access '${nombre}' before initialization`);
    return v.valor;
  }
  function escribir(objetivo: Nodo, valor: unknown, scope: Scope) {
    if (objetivo.type === 'Identifier') {
      const v = scope.buscar(objetivo.name);
      if (!v) throw new ReferenceError(`${objetivo.name} is not defined`);
      if (!v.lista) throw new ReferenceError(`Cannot access '${objetivo.name}' before initialization`);
      if (v.tipo === 'const') throw new TypeError('Assignment to constant variable.');
      v.valor = valor;
    } else if (objetivo.type === 'MemberExpression') {
      const obj = evaluar(objetivo.object, scope) as Record<PropertyKey, unknown>;
      const clave = objetivo.computed ? (evaluar(objetivo.property, scope) as PropertyKey) : objetivo.property.name;
      if (obj == null) throw new TypeError(`Cannot set properties of ${obj} (setting '${String(clave)}')`);
      obj[clave] = valor;
    } else throw noSoportado(objetivo);
  }

  function evaluar(n: Nodo, scope: Scope): unknown {
    contar();
    switch (n.type) {
      case 'Literal': return n.regex ? new RegExp(n.regex.pattern, n.regex.flags) : n.value;
      case 'Identifier': return leer(n.name, scope);
      case 'TemplateLiteral': return n.quasis.map((q: Nodo, i: number) => q.value.cooked + (i < n.expressions.length ? String(mostrarPlano(evaluar(n.expressions[i], scope))) : '')).join('');
      case 'ArrayExpression': {
        const out: unknown[] = [];
        for (const e of n.elements) {
          if (e?.type === 'SpreadElement') out.push(...(evaluar(e.argument, scope) as Iterable<unknown>));
          else out.push(e ? evaluar(e, scope) : undefined);
        }
        return out;
      }
      case 'ObjectExpression': {
        const out: Record<PropertyKey, unknown> = {};
        for (const p of n.properties) {
          if (p.type === 'SpreadElement') { Object.assign(out, evaluar(p.argument, scope)); continue; }
          if (p.kind !== 'init') throw noSoportado(p);
          const clave = p.computed ? (evaluar(p.key, scope) as PropertyKey) : p.key.type === 'Identifier' ? p.key.name : p.key.value;
          out[clave] = nombrar(evaluar(p.value, scope), String(clave));
        }
        return out;
      }
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        if (n.async || n.generator) throw noSoportado({ ...n, type: n.async ? 'AwaitExpression' : 'YieldExpression' });
        return new Funcion(n.id?.name ?? '', n, scope, n.type === 'ArrowFunctionExpression', n.type === 'ArrowFunctionExpression' ? scope.buscar('this')?.valor : undefined);
      case 'ThisExpression': {
        const v = scope.buscar('this');
        return v ? v.valor : undefined;
      }
      case 'UnaryExpression': {
        if (n.operator === 'typeof') {
          if (n.argument.type === 'Identifier' && !scope.buscar(n.argument.name)) return 'undefined';
          const v = evaluar(n.argument, scope);
          return v instanceof Funcion ? 'function' : typeof v;
        }
        if (n.operator === 'delete') throw noSoportado(n);
        const v = evaluar(n.argument, scope) as number;
        switch (n.operator) {
          case '!': return !v;
          case '-': return -v;
          case '+': return +v;
          case '~': return ~v;
          case 'void': return undefined;
        }
        throw noSoportado(n);
      }
      case 'BinaryExpression': {
        const a = evaluar(n.left, scope) as never;
        const b = evaluar(n.right, scope) as never;
        switch (n.operator) {
          case '+': return (a as number) + (b as number);
          case '-': return a - b;
          case '*': return a * b;
          case '/': return a / b;
          case '%': return a % b;
          case '**': return (a as number) ** (b as number);
          case '==': return a == b;
          case '!=': return a != b;
          case '===': return a === b;
          case '!==': return a !== b;
          case '<': return a < b;
          case '<=': return a <= b;
          case '>': return a > b;
          case '>=': return a >= b;
          case 'in': return (a as PropertyKey) in (b as object);
          case 'instanceof': return (a as object) instanceof (b as never);
          case '&': return a & b;
          case '|': return a | b;
          case '^': return a ^ b;
          case '<<': return a << b;
          case '>>': return a >> b;
          case '>>>': return a >>> b;
        }
        throw noSoportado(n);
      }
      case 'LogicalExpression': {
        const a = evaluar(n.left, scope);
        if (n.operator === '&&') return a ? evaluar(n.right, scope) : a;
        if (n.operator === '||') return a ? a : evaluar(n.right, scope);
        return a ?? evaluar(n.right, scope);
      }
      case 'ConditionalExpression':
        return evaluar(n.test, scope) ? evaluar(n.consequent, scope) : evaluar(n.alternate, scope);
      case 'AssignmentExpression': {
        if (n.operator === '=') { const v = nombrar(evaluar(n.right, scope), n.left.name ?? ''); escribir(n.left, v, scope); return v; }
        const actual = evaluar(n.left, scope) as never;
        if (n.operator === '??=' && actual != null) return actual;
        if (n.operator === '||=' && actual) return actual;
        if (n.operator === '&&=' && !actual) return actual;
        const b = evaluar(n.right, scope) as never;
        const ops: Record<string, () => unknown> = {
          '+=': () => (actual as number) + (b as number), '-=': () => actual - b, '*=': () => actual * b, '/=': () => actual / b,
          '%=': () => actual % b, '**=': () => (actual as number) ** (b as number), '??=': () => b, '||=': () => b, '&&=': () => b,
        };
        if (!ops[n.operator]) throw noSoportado(n);
        const v = ops[n.operator]();
        escribir(n.left, v, scope);
        return v;
      }
      case 'UpdateExpression': {
        const antes = Number(evaluar(n.argument, scope));
        const despues = n.operator === '++' ? antes + 1 : antes - 1;
        escribir(n.argument, despues, scope);
        return n.prefix ? despues : antes;
      }
      case 'ChainExpression':
        return evaluar(n.expression, scope);
      case 'MemberExpression': {
        const obj = evaluar(n.object, scope) as Record<PropertyKey, unknown>;
        if (obj == null && n.optional) return undefined;
        const clave = n.computed ? (evaluar(n.property, scope) as PropertyKey) : n.property.name;
        if (obj == null) throw new TypeError(`Cannot read properties of ${obj} (reading '${String(clave)}')`);
        return obj[clave];
      }
      case 'SequenceExpression': {
        let v: unknown;
        for (const e of n.expressions) v = evaluar(e, scope);
        return v;
      }
      case 'CallExpression': return llamada(n, scope);
      case 'NewExpression': {
        const C = evaluar(n.callee, scope);
        if (!CONSTRUCTORES.has(C)) throw noSoportado(n);
        const args = n.arguments.map((a: Nodo) => aNativa(evaluar(a, scope), linea(n)));
        return new (C as new (...a: unknown[]) => unknown)(...args);
      }
      default:
        throw noSoportado(n);
    }
  }

  function llamada(n: Nodo, scope: Scope): unknown {
    let thisValor: unknown;
    let f: unknown;
    const c = n.callee;
    if (c.type === 'MemberExpression') {
      thisValor = evaluar(c.object, scope);
      if (thisValor == null && c.optional) return undefined;
      const clave = c.computed ? (evaluar(c.property, scope) as PropertyKey) : c.property.name;
      if (thisValor == null) throw new TypeError(`Cannot read properties of ${thisValor} (reading '${String(clave)}')`);
      f = (thisValor as Record<PropertyKey, unknown>)[clave];
      if (thisValor === consolaFalsa && (clave === 'log' || clave === 'info' || clave === 'warn' || clave === 'error')) {
        const args = evaluarArgumentos(n.arguments, scope);
        if (!silencio) consola.push(args.map((a) => mostrar(a)).join(' '));
        return undefined;
      }
    } else f = evaluar(c, scope);
    if (f == null && n.optional) return undefined;
    const args = evaluarArgumentos(n.arguments, scope);
    if (f instanceof Funcion) return llamar(f, args, thisValor, linea(n));
    if (typeof f !== 'function') throw new TypeError(`${fuente(c)} is not a function`);
    return (f as (...a: unknown[]) => unknown).apply(thisValor, args.map((a) => aNativa(a, linea(n))));
  }

  function evaluarArgumentos(lista: Nodo[], scope: Scope): unknown[] {
    const out: unknown[] = [];
    for (const a of lista) {
      if (a.type === 'SpreadElement') out.push(...(evaluar(a.argument, scope) as Iterable<unknown>));
      else out.push(evaluar(a, scope));
    }
    return out;
  }

  const consolaFalsa = {};
  global.vars.set('console', { valor: consolaFalsa, tipo: 'const', lista: true });
  const mostrarPlano = (v: unknown) => (typeof v === 'string' ? v : v instanceof Funcion ? `function ${v.nombre}` : Array.isArray(v) ? v.map((x) => mostrarPlano(x)).join(',') : String(v));

  // ── Ejecución ─────────────────────────────────────────────────────────────
  try {
    paso([], 'inicio', 'El programa empieza. Antes de ejecutar, el motor registra las funciones declaradas y las variables. La pila está vacía.');
    elevar(programa.body, global, global);
    ejecutarBloque(programa.body, global);
    paso([], 'fin', 'El programa terminó: la pila quedó vacía.');
  } catch (e) {
    if (e instanceof NoSoportado) return { error: e.message };
    if (e instanceof Detenido) {
      pasos.push({ lineas: [], pila: pila(), consola: [...consola], evento: 'error', texto: `Rayos X se detuvo después de ${pasos.length} pasos. ¿Hay un bucle que nunca termina? En el navegador, un bucle así congelaría la página.` });
    } else {
      const err = e instanceof Lanzado ? e.valor : e;
      const texto = err instanceof Error ? `${err.name}: ${err.message}` : `Uncaught ${mostrar(err, true)}`;
      const desborde = err instanceof RangeError && /call stack/.test(err.message);
      consola.push(err instanceof Error ? `Uncaught ${texto}` : texto);
      pasos.push({
        lineas: [fotoError?.linea ?? lineaActual],
        pila: fotoError?.pila ?? pila(),
        consola: [...consola],
        evento: 'error',
        texto: desborde
          ? `<b>Stack overflow</b>: la pila llegó a ${MAX_PROFUNDIDAD} marcos y el motor se detiene con ${cod(texto)}. En un navegador el límite es de miles de llamadas, pero sin caso base se llega igual.`
          : `<b>Error</b>: <code>${esc(texto)}</code>. Nadie lo atrapó con <code>try…catch</code>, así que el programa se detiene aquí.`,
      });
    }
  }
  return { datos: { codigo, pasos } };
}
