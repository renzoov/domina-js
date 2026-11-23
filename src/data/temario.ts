// Temario de domina-js. Fuente: docs/PLAN.md, sección 1.
// Cada tema: [título, marcas]. Marcas separadas por espacio:
//   v        → lleva visualizador paso a paso
//   es2022   → incluye novedades de esa edición de ECMAScript
//   nuevo    → incluye APIs o prácticas posteriores al libro de referencia (sin edición concreta)
//   propuesta→ todavía es una propuesta de TC39

export interface Tema {
  titulo: string;
  slug: string;
  visualizador: boolean;
  ediciones: string[];
  nuevo: boolean;
  propuesta: boolean;
}

export interface Seccion {
  numero: number;
  titulo: string;
  slug: string;
  descripcion: string;
  temas: Tema[];
}

type TemaCrudo = [string, string?] | [string, string, string];

const crudo: { titulo: string; slug: string; descripcion: string; temas: TemaCrudo[] }[] = [
  {
    titulo: 'Antes de empezar',
    slug: 'antes-de-empezar',
    descripcion: 'Qué es JavaScript hoy, dónde se ejecuta y cómo preparar tu entorno.',
    temas: [
      ['Qué es JavaScript hoy', 'nuevo', 'que-es-javascript-hoy'],
      ['Tu entorno', '', 'tu-entorno'],
      ['Tu primer programa', '', 'tu-primer-programa'],
      ['Cómo leer documentación', 'nuevo', 'como-leer-documentacion'],
    ],
  },
  {
    titulo: 'Fundamentos del lenguaje',
    slug: 'fundamentos',
    descripcion: 'Valores, tipos, variables y operadores: la gramática básica de JS.',
    temas: [
      ['Sintaxis básica'],
      ['Variables: let, const y por qué ya no var', '', 'variables'],
      ['Valores primitivos y objetos', 'v', 'primitivos-y-objetos'],
      ['Números', 'es2021 es2026', 'numeros'],
      ['Texto y template literals', 'es2021 es2022 es2024', 'texto'],
      ['Booleanos, truthy/falsy, null y undefined', '', 'booleanos-null-undefined'],
      ['Symbols'],
      ['Conversión de tipos', '', 'conversion-de-tipos'],
      ['Operadores', 'es2021', 'operadores'],
    ],
  },
  {
    titulo: 'Control de flujo y errores',
    slug: 'control-de-flujo',
    descripcion: 'Decidir, repetir y manejar lo que sale mal.',
    temas: [
      ['Condicionales'],
      ['Bucles'],
      ['break, continue y etiquetas', '', 'break-continue-etiquetas'],
      ['Errores y excepciones', 'es2021 es2022 es2026', 'errores-y-excepciones'],
    ],
  },
  {
    titulo: 'Funciones',
    slug: 'funciones',
    descripcion: 'Declararlas, pasarlas como valores y entender this.',
    temas: [
      ['Declaraciones, expresiones y funciones flecha', '', 'declaraciones-expresiones-flecha'],
      ['Parámetros'],
      ['Funciones como valores', '', 'funciones-como-valores'],
      ['this: cómo se decide su valor', 'v', 'this'],
      ['Estilo funcional', '', 'estilo-funcional'],
    ],
  },
  {
    titulo: 'Cómo se ejecuta JS por dentro',
    slug: 'como-se-ejecuta-js',
    descripcion: 'El motor, la pila, los scopes y la memoria: lo que pasa mientras tu código corre.',
    temas: [
      ['Motor y runtime', '', 'motor-y-runtime'],
      ['La pila de llamadas', 'v', 'pila-de-llamadas'],
      ['Contextos de ejecución y hoisting', 'v', 'contextos-y-hoisting'],
      ['Scope y cadena de scopes', 'v', 'scope'],
      ['Closures', 'v'],
      ['Recursión y stack overflow', 'v', 'recursion'],
      ['Memoria y recolector de basura', 'v es2021', 'memoria'],
    ],
  },
  {
    titulo: 'Objetos',
    slug: 'objetos',
    descripcion: 'Propiedades, copias, JSON y la cadena de prototipos.',
    temas: [
      ['Objetos literales', '', 'objetos-literales'],
      ['Recorrer objetos', 'es2022', 'recorrer-objetos'],
      ['Desestructuración y spread', '', 'desestructuracion-y-spread'],
      ['Copias superficiales y profundas', 'v nuevo', 'copias'],
      ['JSON', 'es2025'],
      ['Prototipos y la cadena de prototipos', 'v', 'prototipos'],
      ['Inmutabilidad', 'es2023'],
    ],
  },
  {
    titulo: 'Clases',
    slug: 'clases',
    descripcion: 'La sintaxis class, sus campos privados y la herencia.',
    temas: [
      ['La sintaxis class', '', 'sintaxis-class'],
      ['Campos públicos y privados', 'es2022', 'campos-privados'],
      ['Herencia: extends y super', '', 'herencia'],
      ['Composición frente a herencia', '', 'composicion'],
      ['Decorators', 'propuesta', 'decorators'],
    ],
  },
  {
    titulo: 'Colecciones y datos',
    slug: 'colecciones',
    descripcion: 'Arrays, Map, Set y datos binarios, con lo nuevo hasta ES2026.',
    temas: [
      ['Arrays', 'es2022'],
      ['Métodos de array', 'v es2023', 'metodos-de-array'],
      ['Cambiar sin mutar', 'es2023', 'cambiar-sin-mutar'],
      ['Agrupar datos', 'es2024', 'agrupar'],
      ['Map y Set', 'es2025 es2026', 'map-y-set'],
      ['WeakMap y WeakSet', 'es2023', 'weakmap-y-weakset'],
      ['Datos binarios', 'es2024 es2025 es2026', 'datos-binarios'],
    ],
  },
  {
    titulo: 'Iteradores y generadores',
    slug: 'iteradores',
    descripcion: 'El protocolo iterable y los nuevos helpers de iteradores.',
    temas: [
      ['El protocolo iterable', 'v', 'protocolo-iterable'],
      ['Generadores y yield', 'v', 'generadores'],
      ['Iterator helpers', 'es2025 es2027', 'iterator-helpers'],
      ['Iteración asíncrona', 'es2026', 'iteracion-asincrona'],
    ],
  },
  {
    titulo: 'Asincronía',
    slug: 'asincronia',
    descripcion: 'Event loop, promesas y async/await: cómo espera un lenguaje de un solo hilo.',
    temas: [
      ['Si JS tiene un solo hilo, ¿cómo espera?', '', 'como-espera'],
      ['El event loop', 'v', 'event-loop'],
      ['Callbacks'],
      ['Promesas', 'v'],
      ['Combinadores de promesas', 'es2021 es2024 es2025', 'combinadores'],
      ['async/await', 'es2022', 'async-await'],
      ['Microtareas y macrotareas', 'v', 'microtareas'],
      ['Cancelar con AbortController', 'nuevo', 'abortcontroller'],
      ['Patrones asíncronos', '', 'patrones'],
    ],
  },
  {
    titulo: 'Módulos',
    slug: 'modulos',
    descripcion: 'import/export, CommonJS y los atributos de importación.',
    temas: [
      ['ES Modules', '', 'es-modules'],
      ['CommonJS frente a ESM', 'nuevo', 'commonjs-y-esm'],
      ['Import maps y atributos de importación', 'es2025', 'import-maps'],
      ['Organizar un proyecto', '', 'organizar-un-proyecto'],
    ],
  },
  {
    titulo: 'Biblioteca estándar',
    slug: 'biblioteca-estandar',
    descripcion: 'Fechas con Temporal, expresiones regulares, Intl y más.',
    temas: [
      ['Fechas: Date y Temporal', 'es2027', 'fechas'],
      ['Expresiones regulares', 'es2022 es2024 es2025', 'expresiones-regulares'],
      ['Internacionalización con Intl', 'nuevo', 'intl'],
      ['Unicode y emojis', 'es2024', 'unicode'],
      ['URL y URLSearchParams', '', 'url'],
      ['Timers y la consola a fondo', '', 'timers-y-consola'],
      ['Gestión explícita de recursos: using', 'es2027', 'using'],
    ],
  },
  {
    titulo: 'Metaprogramación',
    slug: 'metaprogramacion',
    descripcion: 'Descriptores, Symbols conocidos, Proxy y Reflect.',
    temas: [
      ['Descriptores de propiedades', '', 'descriptores'],
      ['Symbols conocidos', '', 'symbols-conocidos'],
      ['Proxy y Reflect', 'v', 'proxy-y-reflect'],
      ['Template tags', '', 'template-tags'],
    ],
  },
  {
    titulo: 'JavaScript en el navegador',
    slug: 'navegador',
    descripcion: 'DOM, eventos, archivos, accesibilidad, fetch y tiempo real, almacenamiento, APIs del dispositivo, workers y rendimiento.',
    temas: [
      ['Cómo carga una página', 'v', 'como-carga-una-pagina'],
      ['El DOM', '', 'dom'],
      ['Eventos', 'v'],
      ['Eventos propios', '', 'eventos-propios'],
      ['Formularios y validación', '', 'formularios'],
      ['Archivos', '', 'archivos'],
      ['Arrastrar y soltar', '', 'arrastrar-y-soltar'],
      ['Texto editable y selección', '', 'texto-editable'],
      ['Diálogos y popovers', 'nuevo', 'dialogos-y-popovers'],
      ['Accesibilidad con JavaScript', 'nuevo', 'accesibilidad'],
      ['Estilos y animación', 'nuevo', 'estilos-y-animacion'],
      ['Observers', 'nuevo'],
      ['fetch y HTTP', '', 'fetch'],
      ['Tiempo real: SSE, WebSocket y WebRTC', '', 'tiempo-real'],
      ['Guardar datos', '', 'guardar-datos'],
      ['Navegación e historial', 'nuevo', 'navegacion'],
      ['APIs del dispositivo', 'nuevo', 'apis-del-dispositivo'],
      ['Audio, video y cámara', '', 'audio-video-y-camara'],
      ['Web Workers y mensajería', 'es2024', 'web-workers'],
      ['Service Workers y PWA', 'nuevo', 'service-workers'],
      ['Web Components', '', 'web-components'],
      ['Gráficos: Canvas y SVG', '', 'canvas-y-svg'],
      ['Rendimiento de la página', 'nuevo', 'rendimiento'],
      ['Seguridad en el navegador', 'nuevo', 'seguridad'],
    ],
  },
  {
    titulo: 'JavaScript en el servidor',
    slug: 'servidor',
    descripcion: 'Node.js hoy, su event loop, archivos, HTTP, SQLite, la línea de comandos, Deno y Bun.',
    temas: [
      ['Node.js hoy', 'nuevo es2023', 'node-hoy'],
      ['El event loop de Node', 'v', 'event-loop-node'],
      ['Archivos y streams', '', 'archivos-y-streams'],
      ['Un servidor HTTP desde cero', '', 'servidor-http'],
      ['Bases de datos con node:sqlite', 'nuevo', 'sqlite'],
      ['Procesos e hilos', '', 'procesos-e-hilos'],
      ['Programas de línea de comandos', 'nuevo', 'linea-de-comandos'],
      ['Deno y Bun', 'nuevo', 'deno-y-bun'],
      ['Seguridad en Node', 'nuevo', 'seguridad-node'],
    ],
  },
  {
    titulo: 'Herramientas y ecosistema',
    slug: 'herramientas',
    descripcion: 'npm, Vite, lint, tests, TypeScript y depuración.',
    temas: [
      ['npm, pnpm y dependencias', 'nuevo', 'npm'],
      ['Vite y el bundling moderno', 'nuevo', 'vite'],
      ['Lint y formato', 'nuevo', 'lint-y-formato'],
      ['Testing', 'nuevo'],
      ['TypeScript para quien ya sabe JS', 'nuevo', 'typescript'],
      ['Depurar con DevTools', '', 'devtools'],
    ],
  },
  {
    titulo: 'Novedades por edición',
    slug: 'novedades',
    descripcion: 'Qué trajo cada edición de ECMAScript, de ES2021 a lo que viene.',
    temas: [
      ['ES2021'], ['ES2022'], ['ES2023'], ['ES2024'], ['ES2025'], ['ES2026'],
      ['ES2027 (ya terminada)', '', 'es2027'],
      ['Lo que viene', 'propuesta', 'lo-que-viene'],
    ],
  },
  {
    titulo: '¿Y ahora qué?',
    slug: 'y-ahora-que',
    descripcion: 'Qué aprender después, a alto nivel: TypeScript, los frameworks de interfaz, Astro, el backend y más allá del navegador.',
    temas: [
      ['Después de JavaScript', '', 'despues-de-javascript'],
      ['TypeScript', '', 'typescript'],
      ['React (y Next.js)', '', 'react'],
      ['Vue (y Nuxt)', '', 'vue'],
      ['Angular (y su SSR)', '', 'angular'],
      ['Svelte (y SvelteKit)', '', 'svelte'],
      ['Astro', '', 'astro'],
      ['Otras librerías conocidas', '', 'otras-librerias'],
      ['JavaScript en el backend', '', 'backend'],
      ['Más allá del navegador clásico', '', 'mas-alla-del-navegador'],
    ],
  },
];

export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const temario: Seccion[] = crudo.map((s, i) => ({
  numero: i,
  titulo: s.titulo,
  slug: s.slug,
  descripcion: s.descripcion,
  temas: s.temas.map(([titulo, marcas = '', slug]) => {
    const m = marcas.split(/\s+/).filter(Boolean);
    return {
      titulo,
      slug: slug ?? slugify(titulo),
      visualizador: m.includes('v'),
      ediciones: m.filter((x) => /^es\d{4}$/.test(x)).map((x) => x.toUpperCase().replace('ES', 'ES')),
      nuevo: m.includes('nuevo') || m.some((x) => /^es\d{4}$/.test(x)),
      propuesta: m.includes('propuesta'),
    };
  }),
}));

export const totalTemas = temario.reduce((n, s) => n + s.temas.length, 0);

export function buscarTema(seccionSlug: string, temaSlug: string) {
  const seccion = temario.find((s) => s.slug === seccionSlug);
  const indice = seccion?.temas.findIndex((t) => t.slug === temaSlug) ?? -1;
  if (!seccion || indice < 0) return undefined;
  return { seccion, tema: seccion.temas[indice], indice };
}

// ── Reto del motor ──────────────────────────────────────────
// Cada sección puede cerrar con un reto, en /<sección>/reto-del-motor. No es un tema del temario:
// va después del último tema y solo aparece si existe su archivo en src/content/retos/.
export const SLUG_RETO = 'reto-del-motor';
export const TITULO_RETO = 'Reto del motor';
export const claveReto = (seccionSlug: string) => `${seccionSlug}/${SLUG_RETO}`;

export interface Parada {
  clave: string;
  titulo: string;
  seccion: Seccion;
  reto: boolean;
}

/** Todo el curso en orden, con el reto de cada sección (si existe) después de su último tema */
export function recorrido(retos: Set<string>): Parada[] {
  return temario.flatMap((s) => [
    ...s.temas.map((t) => ({ clave: `${s.slug}/${t.slug}`, titulo: t.titulo, seccion: s, reto: false })),
    ...(retos.has(s.slug) ? [{ clave: claveReto(s.slug), titulo: TITULO_RETO, seccion: s, reto: true }] : []),
  ]);
}
