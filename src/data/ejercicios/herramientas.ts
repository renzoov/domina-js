// Ejercicios de la sección 15: «Herramientas y ecosistema».

/* ── 15.1 npm, pnpm y dependencias ───────────────────────── */
export const npmAuto = {
  id: 'npm-auto',
  titulo: 'Paquetes y versiones',
  preguntas: [
    {
      pregunta: '¿Qué permite el rango <code>"^1.4.2"</code> en un <code>package.json</code>?',
      opciones: ['Solo la 1.4.2', 'Cualquier 1.x.y igual o mayor a 1.4.2, pero no la 2.0.0', 'Cualquier versión'],
      correcta: 1,
      explicacion: 'Según el versionado semántico, un cambio en el primer número (mayor) puede romper cosas. <code>~1.4.2</code> es más estricto: solo 1.4.x.',
    },
    {
      pregunta: '¿Para qué sirve el <em>lockfile</em> (<code>package-lock.json</code>, <code>pnpm-lock.yaml</code>)?',
      opciones: ['Para nada', 'Fija las versiones exactas de todo el árbol de dependencias, para que todos instalen lo mismo', 'Para bloquear el proyecto'],
      correcta: 1,
      explicacion: 'Súbelo al repositorio. En integración continua, instala con <code>npm ci</code>, que respeta el lockfile al pie de la letra.',
    },
    {
      pregunta: '¿Qué va en <code>devDependencies</code>?',
      opciones: ['Las dependencias que usa el programa en producción', 'Las que solo se usan para desarrollar: pruebas, linter, empaquetador, TypeScript', 'Ninguna'],
      correcta: 1,
      explicacion: '<code>npm install -D vitest</code> la agrega ahí.',
    },
    {
      pregunta: '¿Qué ventaja principal tiene pnpm sobre npm?',
      opciones: ['Ninguna', 'Guarda cada versión de cada paquete una sola vez en el disco y es más estricto con las dependencias que no declaraste', 'Es de Microsoft'],
      correcta: 1,
      explicacion: 'Instala más rápido, ocupa mucho menos espacio y evita usar por accidente paquetes que no están en tu <code>package.json</code>.',
    },
  ],
};

export const npmOrden = {
  id: 'npm-orden',
  titulo: 'Qué versiones cumplen',
  codigo: `// Un verificador de rangos simplificado (el real es el paquete "semver")
function cumple(version, rango) {
  const [ma, mi, pa] = version.split(".").map(Number);
  const [rma, rmi, rpa] = rango.slice(1).split(".").map(Number);
  if (rango[0] === "^") return ma === rma && (mi > rmi || (mi === rmi && pa >= rpa));
  if (rango[0] === "~") return ma === rma && mi === rmi && pa >= rpa;
  return version === rango;
}

console.log(cumple("1.9.0", "^1.4.2"));
console.log(cumple("2.0.0", "^1.4.2"));
console.log(cumple("1.4.9", "~1.4.2"), cumple("1.5.0", "~1.4.2"));
console.log(["1.4.2", "1.10.0", "1.9.3"].filter((v) => cumple(v, "^1.4.2")).length);`,
  salida: ['true', 'false', 'true false', '3'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Con <code>^</code>, todo lo de la misma versión mayor sirve. Con <code>~</code>, solo los parches de la misma menor. Y las versiones se comparan como números: <code>1.10.0</code> es mayor que <code>1.9.3</code>. (El paquete real trata aparte las versiones <code>0.x</code>, donde <code>^</code> es más estricto.)',
};

export const npmDetective = {
  id: 'npm-detective',
  titulo: 'Un árbol de dependencias imposible',
  codigo: `{
  "dependencies": {
    "react": "^19.1.0",
    "mi-calendario": "^2.3.1"
  }
}`,
  error: `npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
npm error
npm error While resolving: tienda@1.0.0
npm error Found: react@19.1.0
npm error node_modules/react
npm error   react@"^19.1.0" from the root project
npm error
npm error Could not resolve dependency:
npm error peer react@"^18.0.0" from mi-calendario@2.3.1
npm error node_modules/mi-calendario
npm error   mi-calendario@"^2.3.1" from the root project`,
  culpable: 4,
  hallazgo:
    '<code>mi-calendario</code> declara que necesita React 18 (es una <em>peer dependency</em>: usa la copia de React del proyecto). El proyecto usa React 19, y npm no puede satisfacer a los dos.',
  pista: 'Lee las líneas <em>Found</em> y <em>Could not resolve</em>: ¿qué versión de React tiene el proyecto y cuál pide el paquete?',
  arreglos: [
    {
      texto: 'Buscar una versión de <code>mi-calendario</code> que admita React 19 (o una alternativa que la tenga)',
      correcta: true,
      porque: 'Es la única solución que no esconde el problema. Si no existe, se puede preguntar a quien lo mantiene, o quedarse en React 18 por ahora.',
    },
    {
      texto: 'Instalar con <code>npm install --force</code> o <code>--legacy-peer-deps</code>',
      correcta: false,
      porque: 'Instala, pero ignora el aviso: el calendario puede fallar en tiempo de ejecución con una versión de React que nunca probó.',
    },
    {
      texto: 'Borrar el lockfile y <code>node_modules</code> y volver a instalar',
      correcta: false,
      porque: 'El conflicto está en los rangos declarados, no en el lockfile: va a fallar igual.',
    },
  ],
};

/* ── 15.2 Vite y el bundling moderno ─────────────────────── */
export const viteAuto = {
  id: 'vite-auto',
  titulo: 'Del código al sitio publicado',
  preguntas: [
    {
      pregunta: '¿Por qué el servidor de desarrollo de Vite arranca tan rápido?',
      opciones: ['Porque no hace nada', 'Porque no empaqueta tu código: lo sirve como módulos ES, y el navegador pide solo los archivos que usa', 'Porque usa caché en la nube'],
      correcta: 1,
      explicacion: 'Solo transforma lo necesario (TypeScript, JSX, CSS) a medida que el navegador lo pide.',
    },
    {
      pregunta: '¿Qué es el HMR (<em>Hot Module Replacement</em>)?',
      opciones: ['Un error', 'Reemplazar en el navegador solo el módulo que cambió, sin recargar la página ni perder el estado', 'Un formato de imagen'],
      correcta: 1,
      explicacion: 'Cambias un estilo o un componente y lo ves al instante.',
    },
    {
      pregunta: '¿Qué hace <code>vite build</code>?',
      opciones: ['Lo mismo que el modo desarrollo', 'Empaqueta y optimiza para producción: une módulos, quita código sin usar, minifica y pone un hash en el nombre de los archivos', 'Sube el sitio'],
      correcta: 1,
      explicacion: 'El hash en el nombre (<code>app.3f9a1c.js</code>) permite que los navegadores guarden los archivos en caché para siempre.',
    },
    {
      pregunta: '¿Qué variables de entorno puede ver el código del navegador en Vite?',
      opciones: ['Todas', 'Solo las que empiezan con <code>VITE_</code>, a través de <code>import.meta.env</code>', 'Ninguna'],
      correcta: 1,
      explicacion: 'Es una protección: el resto (claves, contraseñas) nunca llega al navegador por accidente.',
    },
  ],
};

export const viteOrden = {
  id: 'vite-orden',
  titulo: 'Variables de entorno',
  codigo: `// .env
//   VITE_API=https://api.tienda.com
//   CLAVE_SECRETA=abc123

// src/main.js, con el servidor de desarrollo (npm run dev)
console.log(import.meta.env.VITE_API);
console.log(import.meta.env.CLAVE_SECRETA);
console.log(import.meta.env.MODE);
console.log(import.meta.env.DEV);`,
  salida: ['https://api.tienda.com', 'undefined', 'development', 'true'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Solo las variables con el prefijo <code>VITE_</code> llegan al código del navegador; la clave secreta queda afuera. <code>MODE</code> y <code>DEV</code> los pone Vite: en <code>vite build</code> serían <code>"production"</code> y <code>false</code>.',
};

export const viteDetective = {
  id: 'vite-detective',
  titulo: 'Una variable que no llega',
  codigo: `# .env
API_URL=https://api.tienda.com

// src/api.js
const url = new URL("/productos", import.meta.env.API_URL);`,
  error: `Uncaught TypeError: Failed to construct 'URL': Invalid base URL
    at api.js:2:13`,
  culpable: 2,
  hallazgo:
    'Vite solo expone al navegador las variables que empiezan con <code>VITE_</code>. <code>API_URL</code> no llega: <code>import.meta.env.API_URL</code> es <code>undefined</code>, y <code>new URL</code> no acepta eso como base.',
  pista: '¿Qué vale <code>import.meta.env.API_URL</code> en el navegador?',
  arreglos: [
    {
      texto: 'Renombrarla a <code>VITE_API_URL</code> en el <code>.env</code> y en el código',
      correcta: true,
      porque: 'Con el prefijo, Vite la reemplaza en el código del navegador. Recuerda: todo lo que tiene <code>VITE_</code> es público.',
    },
    {
      texto: 'Usar <code>process.env.API_URL</code>',
      correcta: false,
      porque: '<code>process</code> es de Node.js: en el navegador no existe.',
    },
    {
      texto: 'Escribir la URL directamente en el código',
      correcta: false,
      porque: 'Funciona, pero pierdes poder cambiarla según el entorno (desarrollo, pruebas, producción) sin tocar el código.',
    },
  ],
};

/* ── 15.3 Lint y formato ─────────────────────────────────── */
export const lintAuto = {
  id: 'lint-auto',
  titulo: 'Errores que se ven antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué diferencia hay entre un linter y un formateador?',
      opciones: [
        'Ninguna',
        'El linter busca errores y malas prácticas (una variable sin usar, un <code>=</code> en lugar de <code>===</code>); el formateador solo acomoda el estilo (espacios, comillas, saltos)',
        'El formateador es más rápido',
      ],
      correcta: 1,
      explicacion: 'ESLint es el linter más usado; Prettier, el formateador. Biome hace las dos cosas.',
    },
    {
      pregunta: '¿Cómo se llama el formato de configuración actual de ESLint?',
      opciones: ['<code>.eslintrc</code>', '<em>Flat config</em>: un archivo <code>eslint.config.js</code> que exporta un array de objetos', 'YAML'],
      correcta: 1,
      explicacion: 'Desde ESLint 9 es el formato por defecto; el de <code>.eslintrc</code> fue retirado.',
    },
    {
      pregunta: '¿Por qué conviene un formateador automático en un equipo?',
      opciones: ['Por nada', 'Porque elimina las discusiones de estilo y los cambios de formato en las revisiones: todos guardan el código igual', 'Porque corrige errores'],
      correcta: 1,
      explicacion: 'Lo ideal: que se ejecute al guardar en el editor y se compruebe en la integración continua.',
    },
    {
      pregunta: '¿Qué es Biome?',
      opciones: ['Un framework', 'Un linter y formateador en un solo programa, escrito en Rust y muy rápido', 'Un navegador'],
      correcta: 1,
      explicacion: 'Una alternativa a la pareja ESLint + Prettier, con menos configuración.',
    },
  ],
};

export const lintOrden = {
  id: 'lint-orden',
  // La salida es la de ESLint, no la del código: herramientas/verificar-ejercicios.mjs no la ejecuta
  sinEjecutar: true,
  titulo: 'Lo que encuentra el linter',
  codigo: `// eslint.config.js usa js.configs.recommended
function sumar(a, b) {
  const total = a + b;
  if (a = 0) return b;
  return a + b;
  console.log("fin");
}

// Ejecutar: npx eslint sumar.js`,
  salida: [
    "3:9  error  'total' is assigned a value but never used  no-unused-vars",
    '4:7  error  Expected a conditional expression and instead saw an assignment  no-cond-assign',
    '6:3  error  Unreachable code  no-unreachable',
  ],
  inicio: [2, 0, 1],
  explicacion:
    'ESLint informa cada problema con su línea y columna, ordenados. <code>total</code> se calcula y nunca se usa; <code>a = 0</code> asigna en lugar de comparar (y siempre da falso); y nada se ejecuta después de un <code>return</code>. Ninguno de los tres es un error de sintaxis: el código corre, pero mal.',
};

export const lintDetective = {
  id: 'lint-detective',
  titulo: 'Una configuración del formato viejo',
  codigo: `// eslint.config.js
export default {
  extends: ["eslint:recommended"],
  rules: {
    "no-console": "warn",
  },
};`,
  error: `Oops! Something went wrong! :(

ESLint: 9.28.0

A config object is using the "extends" key, which is not supported in flat config system.

Instead of "extends", you can include config objects that you'd like to extend from directly in the flat config array.`,
  culpable: 3,
  hallazgo:
    '<code>extends: ["eslint:recommended"]</code> es la forma del viejo <code>.eslintrc</code>, con nombres en texto. En la <em>flat config</em>, las configuraciones compartidas son objetos que se importan y se ponen en el array.',
  pista: 'El mensaje dice qué hacer en lugar de <code>extends</code>.',
  arreglos: [
    {
      texto: 'Importar la configuración y usarla en un array: <code>import js from "@eslint/js"; export default [js.configs.recommended, { rules: { "no-console": "warn" } }];</code>',
      correcta: true,
      porque: 'Cada objeto del array se aplica en orden: primero las reglas recomendadas, después las tuyas, que pueden sobrescribirlas. (Con <code>defineConfig</code> también puedes usar <code>extends</code>, pero con objetos, no con textos.)',
    },
    {
      texto: 'Renombrar el archivo a <code>.eslintrc.js</code>',
      correcta: false,
      porque: 'Ese formato fue retirado en las versiones recientes de ESLint.',
    },
    {
      texto: 'Borrar la línea de <code>extends</code>',
      correcta: false,
      porque: 'El error desaparece, pero te quedas sin las reglas recomendadas: solo se aplicaría <code>no-console</code>.',
    },
  ],
};

/* ── 15.4 Testing ────────────────────────────────────────── */
export const testingAuto = {
  id: 'testing-auto',
  titulo: 'Código que comprueba código',
  preguntas: [
    {
      pregunta: '¿Qué es una prueba unitaria?',
      opciones: ['Una prueba manual', 'Código que ejecuta una pieza pequeña (una función, un módulo) y comprueba que el resultado sea el esperado', 'Una prueba de velocidad'],
      correcta: 1,
      explicacion: 'Las pruebas de integración combinan varias piezas; las de extremo a extremo (como las de Playwright) usan la aplicación entera, como un usuario.',
    },
    {
      pregunta: '¿Necesitas instalar algo para escribir pruebas en Node.js?',
      opciones: ['Sí, Jest', 'No: <code>node:test</code> y <code>node:assert</code> vienen incluidos, y <code>node --test</code> las ejecuta', 'Sí, siempre'],
      correcta: 1,
      explicacion: 'Vitest es la alternativa más popular cuando el proyecto usa Vite, con una API parecida a Jest.',
    },
    {
      pregunta: '¿Qué es un <em>mock</em>?',
      opciones: ['Un error', 'Una versión falsa de una dependencia (la red, la hora, una base de datos) para probar sin ella y controlar lo que devuelve', 'Una prueba que falla'],
      correcta: 1,
      explicacion: 'Úsalos con moderación: una prueba con demasiados mocks prueba los mocks, no tu código.',
    },
    {
      pregunta: 'Si una prueba falla, ¿dónde está el error?',
      opciones: ['Siempre en el código', 'En el código o en la prueba: a veces lo que está mal es lo que la prueba espera', 'En el ejecutor'],
      correcta: 1,
      explicacion: 'Antes de cambiar el código para que la prueba pase, comprueba que la prueba tenga razón.',
    },
  ],
};

export const testingOrden = {
  id: 'testing-orden',
  titulo: 'Los ganchos de una suite',
  codigo: `import { describe, it, before, beforeEach, after } from "node:test";

describe("carrito", () => {
  let n = 0;
  before(() => console.log("before"));
  beforeEach(() => console.log("beforeEach", ++n));
  after(() => console.log("after"));

  it("agrega", () => console.log("prueba: agrega"));
  it("quita", () => console.log("prueba: quita"));
});`,
  salida: ['before', 'beforeEach 1', 'prueba: agrega', 'beforeEach 2', 'prueba: quita', 'after'],
  inicio: [3, 5, 0, 2, 4, 1],
  explicacion:
    '<code>before</code> corre una vez, antes de todas las pruebas; <code>beforeEach</code>, antes de cada una (ideal para preparar datos limpios); <code>after</code>, al final. Así cada prueba empieza desde el mismo estado.',
};

export const testingDetective = {
  id: 'testing-detective',
  titulo: 'Una prueba que falla',
  codigo: `import { test } from "node:test";
import assert from "node:assert/strict";
import { sumar } from "./sumar.js";

test("suma dos números", () => {
  assert.equal(sumar(1, 1), 3);
});

// sumar.js: export const sumar = (a, b) => a + b;`,
  error: `✖ suma dos números (0.8ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  2 !== 3

      at TestContext.<anonymous> (file:///proyecto/sumar.test.js:6:10)

ℹ tests 1
ℹ pass 0
ℹ fail 1`,
  culpable: 6,
  hallazgo:
    '<code>sumar</code> está bien: 1 + 1 es 2. Lo que está mal es la <b>prueba</b>, que espera 3. El mensaje lo muestra: lo que llegó (2) frente a lo que se esperaba (3).',
  pista: 'Lee la línea <code>2 !== 3</code>: ¿cuál es el valor correcto, el que llegó o el que se esperaba?',
  arreglos: [
    {
      texto: 'Corregir la prueba: <code>assert.equal(sumar(1, 1), 2);</code>',
      correcta: true,
      porque: 'Antes de tocar el código para que una prueba pase, comprueba que la prueba espere lo correcto.',
    },
    {
      texto: 'Cambiar <code>sumar</code> para que devuelva <code>a + b + 1</code>',
      correcta: false,
      porque: 'La prueba pasaría, pero la función quedaría rota para todos los que la usan.',
    },
    {
      texto: 'Saltar la prueba con <code>test.skip</code>',
      correcta: false,
      porque: 'El informe deja de marcar el fallo, pero la prueba equivocada sigue ahí, esperando a confundir a alguien.',
    },
  ],
};

export const testingLab = {
  id: 'testing-lab',
  titulo: 'Probar y arreglar',
  inicial: `// Un mini ejecutor de pruebas, parecido a node:test o Vitest
const resultados = [];
function prueba(nombre, fn) {
  try {
    fn();
    resultados.push(\`✔ \${nombre}\`);
  } catch (e) {
    resultados.push(\`✘ \${nombre}: \${e.message}\`);
  }
}
function esperar(real) {
  return {
    toBe(esperado) {
      if (real !== esperado) throw new Error(\`esperaba \${esperado}, llegó \${real}\`);
    },
  };
}

// La función a probar: tiene un error
function precioFinal(precio, descuento) {
  return precio - descuento / 100;
}

// 1. Escribe tres pruebas para precioFinal: sin descuento, con 50 % y con 100 %.
// 2. Mira cuáles fallan y arregla la función.

console.log(resultados.join("\\n"));
`,
  verificaciones: [
    { texto: 'Hay al menos tres pruebas', prueba: 'return resultados.length >= 3;' },
    { texto: 'Todas las pruebas pasan', prueba: 'return resultados.length >= 3 && resultados.every((r) => r.startsWith("✔"));' },
    { texto: 'La función está arreglada: <code>precioFinal(80, 25)</code> da <code>60</code>', prueba: 'return precioFinal(80, 25) === 60 && precioFinal(10, 0) === 10;' },
  ],
  pistas: [
    'Una prueba: <code>prueba("sin descuento", () => esperar(precioFinal(100, 0)).toBe(100));</code>. Escríbelas antes del <code>console.log</code>.',
    'Con 50 % sobre 80, esperas 40; con 100 %, esperas 0. Ejecuta y mira qué dicen las pruebas.',
    'El descuento es un porcentaje del precio: <code>return precio * (1 - descuento / 100);</code>',
  ] as [string, string, string],
  solucion: `const resultados = [];
function prueba(nombre, fn) {
  try {
    fn();
    resultados.push(\`✔ \${nombre}\`);
  } catch (e) {
    resultados.push(\`✘ \${nombre}: \${e.message}\`);
  }
}
function esperar(real) {
  return {
    toBe(esperado) {
      if (real !== esperado) throw new Error(\`esperaba \${esperado}, llegó \${real}\`);
    },
  };
}

function precioFinal(precio, descuento) {
  return precio * (1 - descuento / 100);
}

prueba("sin descuento", () => esperar(precioFinal(100, 0)).toBe(100));
prueba("con 50 %", () => esperar(precioFinal(80, 50)).toBe(40));
prueba("con 100 %", () => esperar(precioFinal(30, 100)).toBe(0));

console.log(resultados.join("\\n"));`,
  explicacion:
    '<p>Con la función original, la prueba sin descuento pasa (100 − 0 = 100), pero las otras dos fallan: restaba 0,5 en lugar del 50 %. Escribir primero las pruebas y después arreglar el código hasta que pasen es la idea de <b>TDD</b> (desarrollo guiado por pruebas).</p>',
};

/* ── 15.5 TypeScript para quien ya sabe JS ───────────────── */
export const tsAuto = {
  id: 'ts-auto',
  titulo: 'Tipos sobre JavaScript',
  preguntas: [
    {
      pregunta: '¿Qué pasa con los tipos de TypeScript al ejecutar el programa?',
      opciones: ['Se comprueban en cada llamada', 'Desaparecen: se borran antes de ejecutar, y el resultado es JavaScript normal', 'Lo hacen más lento'],
      correcta: 1,
      explicacion: 'TypeScript comprueba antes de ejecutar. En tiempo de ejecución, un dato que viene de afuera puede ser cualquier cosa: hay que validarlo.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>any</code> y <code>unknown</code>?',
      opciones: ['Ninguna', '<code>any</code> apaga la comprobación; <code>unknown</code> obliga a comprobar qué es antes de usarlo', '<code>unknown</code> es más rápido'],
      correcta: 1,
      explicacion: 'Para datos que vienen de afuera (un JSON, un <code>catch</code>), <code>unknown</code> es la opción segura.',
    },
    {
      pregunta: 'En TypeScript, ¿dos tipos con distinto nombre y las mismas propiedades son compatibles?',
      opciones: ['No', 'Sí: el sistema de tipos es <b>estructural</b>, importa la forma, no el nombre', 'Solo si heredan'],
      correcta: 1,
      explicacion: 'Si tiene las propiedades que se piden, sirve, como en el <em>duck typing</em> de JavaScript.',
    },
    {
      pregunta: '¿Se pueden tener tipos sin escribir archivos <code>.ts</code>?',
      opciones: ['No', 'Sí: con comentarios JSDoc (<code>/** @param {number} x */</code>) y <code>checkJs</code>, TypeScript revisa archivos <code>.js</code>', 'Solo en Deno'],
      correcta: 1,
      explicacion: 'Muchas librerías lo usan para no necesitar un paso de compilación.',
    },
  ],
};

export const tsOrden = {
  id: 'ts-orden',
  titulo: 'Tipos que desaparecen',
  codigo: `// precio.ts, ejecutado con: node precio.ts
function conIva(precio: number, tasa = 0.5): number {
  return precio * (1 + tasa);
}

const p = conIva(100) satisfies number;
console.log(p);
console.log(typeof conIva);
console.log(conIva("50" as any));

type Moneda = "PEN" | "USD";
const m: Moneda = "PEN";
console.log(m.length);`,
  salida: ['150', 'function', '75', '3'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Node.js borra los tipos y ejecuta el JavaScript que queda. Con <code>as any</code> se le miente al compilador: llega un texto, y la multiplicación lo convierte en número. Los tipos no protegen en tiempo de ejecución. <code>type</code> no genera ningún código: <code>m</code> es un texto normal.',
};

export const tsDetective = {
  id: 'ts-detective',
  titulo: 'Un texto donde va un número',
  codigo: `function total(precios: number[]): number {
  return precios.reduce((a, b) => a + b, 0);
}

const entrada = document.querySelector("input")!.value;   // "12.5"
console.log(total([entrada, 3]));`,
  error: `src/total.ts:6:20 - error TS2322: Type 'string' is not assignable to type 'number'.

6 console.log(total([entrada, 3]));
                     ~~~~~~~

Found 1 error in src/total.ts:6`,
  culpable: 5,
  hallazgo:
    'El <code>value</code> de un campo de formulario es siempre un texto. TypeScript lo detecta antes de ejecutar: sin el aviso, la suma habría dado <code>"012.53"</code>, un texto pegado, en lugar de 15,5.',
  pista: '¿Qué tipo tiene <code>entrada</code>? ¿Qué espera <code>total</code>?',
  arreglos: [
    {
      texto: 'Convertir el valor: <code>const entrada = Number(document.querySelector("input")!.value);</code> (o <code>valueAsNumber</code>)',
      correcta: true,
      porque: 'Ahora es un número de verdad, y el error de tipos desaparece porque el problema se resolvió, no porque se escondió.',
    },
    {
      texto: 'Forzar el tipo: <code>total([entrada as any, 3])</code>',
      correcta: false,
      porque: 'El compilador se calla, pero en ejecución llega un texto y la suma lo concatena.',
    },
    {
      texto: 'Cambiar la firma a <code>total(precios: (number | string)[])</code>',
      correcta: false,
      porque: 'Compila, pero la función sumaría textos y números mezclados: el mismo error, ahora permitido.',
    },
  ],
};

/* ── 15.6 Depurar con DevTools ───────────────────────────── */
export const devtoolsAuto = {
  id: 'devtools-auto',
  titulo: 'Encontrar el error',
  preguntas: [
    {
      pregunta: '¿Qué ventaja tiene un <em>breakpoint</em> sobre llenar el código de <code>console.log</code>?',
      opciones: ['Ninguna', 'Detiene el programa en esa línea y te deja ver todas las variables, la pila de llamadas y avanzar paso a paso', 'Es más rápido de escribir'],
      correcta: 1,
      explicacion: 'Y no hay que borrar nada después. Los <em>logpoints</em> imprimen un mensaje sin tocar el código.',
    },
    {
      pregunta: '¿Qué hace la instrucción <code>debugger;</code> en el código?',
      opciones: ['Arregla errores', 'Si las DevTools están abiertas, detiene la ejecución en esa línea, como un breakpoint', 'Nada'],
      correcta: 1,
      explicacion: 'Útil cuando no encuentras el archivo en el panel de fuentes. No la dejes en el código publicado.',
    },
    {
      pregunta: 'Para encontrar una fuga de memoria, ¿qué se usa?',
      opciones: ['El panel de red', 'El panel Memory: tomar dos <em>heap snapshots</em> y comparar qué objetos crecieron', 'La consola'],
      correcta: 1,
      explicacion: 'Lo viste en <em>Memoria y recolector de basura</em>: busca objetos que deberían haberse liberado.',
    },
    {
      pregunta: '¿Para qué sirve el panel Performance?',
      opciones: ['Para medir la conexión', 'Para grabar lo que hace la página y ver qué funciones bloquean el hilo, cuánto tarda en dibujarse y dónde se pierde el tiempo', 'Para cambiar estilos'],
      correcta: 1,
      explicacion: 'Las tareas largas (más de 50 ms) aparecen marcadas: son las que hacen que la página se trabe.',
    },
  ],
};

export const devtoolsOrden = {
  id: 'devtools-orden',
  titulo: 'Medir con marcas',
  codigo: `performance.mark("inicio");
let suma = 0;
for (let i = 0; i < 1e5; i++) suma += i;
performance.mark("fin");

const medida = performance.measure("bucle", "inicio", "fin");
console.log(medida.name);
console.log(medida.duration >= 0);
console.log(performance.getEntriesByType("mark").map((m) => m.name).join(","));
console.log(suma);`,
  salida: ['bucle', 'true', 'inicio,fin', '4999950000'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Las marcas y medidas de <code>performance</code> aparecen también en el panel Performance de las DevTools, en su propia pista. Así ves cuánto tarda tu código dentro de la grabación de todo lo demás.',
};

export const devtoolsDetective = {
  id: 'devtools-detective',
  titulo: 'Leer la pila del error',
  codigo: `function formatear(producto) {
  return producto.nombre.toUpperCase();
}

function renderizarLista(productos) {
  return productos.map(formatear).join(", ");
}

renderizarLista([{ nombre: "té" }, { titulo: "café" }]);`,
  error: `Uncaught TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at formatear (lista.js:2:26)
    at Array.map (<anonymous>)
    at renderizarLista (lista.js:6:20)
    at lista.js:9:1`,
  culpable: 9,
  hallazgo:
    'La pila de llamadas se lee de arriba abajo: el error salta en <code>formatear</code> (línea 2), que llamó <code>map</code>, desde <code>renderizarLista</code>, desde la línea 9. Ahí está la causa: el segundo producto tiene <code>titulo</code> en lugar de <code>nombre</code>.',
  pista: 'La primera línea de la pila dice dónde falló; la última, de dónde vino todo. ¿Qué datos se le pasaron a la función?',
  arreglos: [
    {
      texto: 'Corregir los datos: <code>{ nombre: "café" }</code> (y averiguar de dónde vienen así)',
      correcta: true,
      porque: 'El error aparece en <code>formatear</code>, pero el problema está en los datos. Con un breakpoint en la línea 2, el panel de variables muestra el producto que llegó mal.',
    },
    {
      texto: 'Usar <code>producto.nombre?.toUpperCase()</code>',
      correcta: false,
      porque: 'Ya no falla, pero la lista muestra "TÉ, undefined": el dato equivocado llega igual a la pantalla.',
    },
    {
      texto: 'Envolver <code>formatear</code> en un <code>try/catch</code>',
      correcta: false,
      porque: 'Esconde el síntoma y deja el dato mal, para que falle en otro lado.',
    },
  ],
};
