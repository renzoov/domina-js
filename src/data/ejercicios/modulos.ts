// Ejercicios de la sección 10: «Módulos». El sandbox no tiene archivos: no hay laboratorios.

/* ── 10.1 ES Modules ─────────────────────────────────────── */
export const esmAuto = {
  id: 'esm-auto',
  titulo: 'import y export',
  preguntas: [
    {
      pregunta: '¿Qué diferencia hay entre <code>export const x</code> y <code>export default x</code>?',
      opciones: [
        'Ninguna',
        'La primera es una exportación <b>con nombre</b>, que se importa con llaves y ese mismo nombre; la segunda es <b>la</b> exportación principal, que se importa con el nombre que quieras',
        'La segunda es más rápida',
      ],
      correcta: 1,
      explicacion: '<code>import { x } from "./a.js"</code> frente a <code>import loQueSea from "./a.js"</code>. Un módulo puede tener muchas con nombre y una sola por defecto.',
    },
    {
      pregunta: 'Si dos archivos importan el mismo módulo, ¿cuántas veces se ejecuta su código?',
      opciones: ['Una vez por cada import', 'Una sola vez: después, todos comparten el mismo módulo ya evaluado', 'Nunca'],
      correcta: 1,
      explicacion: 'Por eso un módulo puede guardar estado compartido, como una configuración o una conexión.',
    },
    {
      pregunta: '¿Qué devuelve <code>import("./grafico.js")</code>?',
      opciones: ['El módulo, al momento', 'Una promesa del módulo: se carga solo cuando hace falta', 'Un error'],
      correcta: 1,
      explicacion: 'El <code>import()</code> dinámico permite cargar código pesado solo cuando el usuario lo necesita.',
    },
    {
      pregunta: 'El código de un módulo, ¿corre en modo estricto?',
      opciones: ['Solo si escribes <code>"use strict"</code>', 'Siempre', 'Nunca'],
      correcta: 1,
      explicacion: 'Además, cada módulo tiene su propio scope: sus variables no son globales, y <code>this</code> en el nivel superior es <code>undefined</code>.',
    },
  ],
};

export const esmOrden = {
  id: 'esm-orden',
  titulo: 'Quién se evalúa primero',
  codigo: `// main.js
import { saludo } from "./a.js";
console.log("main:", saludo);

// a.js
import "./b.js";
console.log("evaluando a");
export const saludo = "hola";

// b.js
console.log("evaluando b");`,
  salida: ['evaluando b', 'evaluando a', 'main: hola'],
  inicio: [2, 0, 1],
  explicacion:
    'Antes de ejecutar un módulo, se ejecutan sus dependencias, en profundidad. <code>main</code> necesita a <code>a</code>, y <code>a</code> necesita a <code>b</code>: el orden es <code>b</code>, <code>a</code>, <code>main</code>. Todos los <code>import</code> se resuelven antes de la primera línea de código.',
};

export const esmDetective = {
  id: 'esm-detective',
  titulo: 'Un import en un script clásico',
  codigo: `<!-- index.html -->
<script src="app.js"></script>

// app.js
import { formatear } from "./util.js";
console.log(formatear(42));`,
  error: `Uncaught SyntaxError: Cannot use import statement outside a module (at app.js:1:1)`,
  culpable: 2,
  hallazgo:
    'El navegador cargó <code>app.js</code> como un <b>script clásico</b>, donde <code>import</code> no existe. Para que un archivo sea un módulo, hay que decírselo al navegador en la etiqueta.',
  pista: 'El mensaje dice <em>outside a module</em>. ¿Dónde se decide si un archivo es un módulo?',
  arreglos: [
    {
      texto: 'Cargarlo como módulo: <code>&lt;script type="module" src="app.js"&gt;&lt;/script&gt;</code>',
      correcta: true,
      porque: 'Con <code>type="module"</code>, el archivo puede usar <code>import</code> y <code>export</code>, corre en modo estricto y se ejecuta cuando el HTML terminó de leerse, como con <code>defer</code>.',
    },
    {
      texto: 'Cambiar el <code>import</code> por <code>require("./util.js")</code>',
      correcta: false,
      porque: '<code>require</code> es de CommonJS, el sistema de Node.js: el navegador no lo tiene. Daría <code>ReferenceError: require is not defined</code>.',
    },
    {
      texto: 'Mover el <code>import</code> dentro de una función',
      correcta: false,
      porque: 'La declaración <code>import</code> solo puede ir en el nivel superior de un módulo: sería otro <code>SyntaxError</code>.',
    },
  ],
};

/* ── 10.2 CommonJS frente a ESM ──────────────────────────── */
export const cjsAuto = {
  id: 'cjs-auto',
  titulo: 'Dos sistemas de módulos',
  preguntas: [
    {
      pregunta: '¿Cómo decide Node.js si un archivo <code>.js</code> es ESM o CommonJS?',
      opciones: [
        'Al azar',
        'Por el campo <code>"type"</code> del <code>package.json</code> más cercano: <code>"module"</code> es ESM; si no está o es <code>"commonjs"</code>, CommonJS',
        'Siempre es ESM',
      ],
      correcta: 1,
      explicacion: 'Las extensiones <code>.mjs</code> y <code>.cjs</code> fuerzan uno u otro, sin importar el <code>package.json</code>.',
    },
    {
      pregunta: '¿Qué diferencia clave hay entre lo que exporta CommonJS y lo que exporta ESM?',
      opciones: [
        'Ninguna',
        'CommonJS entrega un objeto con <b>copias</b> de los valores del momento; ESM entrega <b>enlaces vivos</b> a las variables del módulo',
        'ESM no exporta funciones',
      ],
      correcta: 1,
      explicacion: 'Si un módulo ESM cambia una variable exportada, quien la importó ve el valor nuevo.',
    },
    {
      pregunta: 'En un módulo ESM de Node.js, ¿qué reemplaza a <code>__dirname</code>?',
      opciones: ['Nada', '<code>import.meta.dirname</code>', '<code>process.dirname</code>'],
      correcta: 1,
      explicacion: 'También están <code>import.meta.filename</code> e <code>import.meta.url</code>. <code>__dirname</code>, <code>require</code> y <code>module</code> no existen en ESM.',
    },
    {
      pregunta: '¿Puede un archivo CommonJS cargar un módulo ESM con <code>require()</code> en Node.js moderno?',
      opciones: [
        'Nunca',
        'Sí, desde Node 22 (y 20.19), siempre que el módulo ESM no use <code>await</code> de nivel superior',
        'Solo con una librería',
      ],
      correcta: 1,
      explicacion: 'Es <code>require(esm)</code>. Antes, la única opción era el <code>import()</code> dinámico, que es asíncrono.',
    },
  ],
};

export const cjsOrden = {
  id: 'cjs-orden',
  titulo: 'Copias y enlaces vivos',
  codigo: `// contador.cjs
let cuenta = 0;
module.exports = { cuenta, sumar: () => ++cuenta };

// main.cjs  (se ejecuta primero)
const c = require("./contador.cjs");
c.sumar();
c.sumar();
console.log("cjs:", c.cuenta);
console.log("mismo objeto:", require("./contador.cjs") === c);

// contador.mjs
export let cuenta = 0;
export const sumar = () => ++cuenta;

// main.mjs  (se ejecuta después)
import { cuenta, sumar } from "./contador.mjs";
sumar();
sumar();
console.log("esm:", cuenta);`,
  salida: ['cjs: 0', 'mismo objeto: true', 'esm: 2'],
  inicio: [2, 0, 1],
  explicacion:
    'En CommonJS, <code>module.exports</code> guardó una <b>copia</b> del valor de <code>cuenta</code> en ese momento (0); la variable interna sí sube a 2. En ESM, <code>cuenta</code> es un <b>enlace vivo</b>: ves el valor actual. En los dos sistemas, un módulo se carga una sola vez.',
};

export const cjsDetective = {
  id: 'cjs-detective',
  titulo: 'require en un módulo ESM',
  codigo: `// package.json: { "type": "module" }

// servidor.js
const fs = require("node:fs");
console.log(fs.existsSync("datos.json"));`,
  error: `file:///proyecto/servidor.js:1
const fs = require("node:fs");
           ^

ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and '/proyecto/package.json' contains "type": "module".`,
  culpable: 4,
  hallazgo:
    'Con <code>"type": "module"</code>, todos los <code>.js</code> del proyecto son ESM, y en ESM no existe <code>require</code>. El propio mensaje de Node.js lo explica y sugiere la solución.',
  pista: 'Lee la segunda línea del error: ¿por qué Node.js trata este archivo como ESM?',
  arreglos: [
    {
      texto: 'Usar <code>import</code>: <code>import { existsSync } from "node:fs";</code>',
      correcta: true,
      porque: 'En un proyecto ESM, todo se importa con <code>import</code>. Los módulos de Node.js se pueden importar con nombre.',
    },
    {
      texto: 'Quitar <code>"type": "module"</code> del <code>package.json</code>',
      correcta: false,
      porque: 'Arregla este archivo pero rompe todos los demás que usan <code>import</code> y <code>export</code>.',
    },
    {
      texto: 'Usar <code>globalThis.require("node:fs")</code>',
      correcta: false,
      porque: '<code>require</code> tampoco existe en el objeto global: sería un <code>TypeError</code>. Si de verdad lo necesitas, existe <code>createRequire</code> de <code>node:module</code>.',
    },
  ],
};

/* ── 10.3 Import maps y atributos de importación ──────────── */
export const mapsAuto = {
  id: 'maps-auto',
  titulo: 'Nombres para los módulos',
  preguntas: [
    {
      pregunta: '¿Qué es un <em>especificador desnudo</em> (<em>bare specifier</em>)?',
      opciones: ['Un import sin llaves', 'Un nombre como <code>"lodash"</code>, que no es una ruta (no empieza con <code>/</code>, <code>./</code> o <code>../</code>) ni una URL', 'Un import vacío'],
      correcta: 1,
      explicacion: 'Node.js los busca en <code>node_modules</code>. El navegador, por sí solo, no sabe qué hacer con ellos.',
    },
    {
      pregunta: '¿Para qué sirve un <em>import map</em>?',
      opciones: ['Para dibujar un mapa', 'Para decirle al navegador a qué URL corresponde cada nombre de módulo', 'Para minificar'],
      correcta: 1,
      explicacion: 'Con un <code>&lt;script type="importmap"&gt;</code> puedes usar <code>import x from "fecha"</code> en el navegador, sin herramientas de compilación.',
    },
    {
      pregunta: '¿Qué hace <code>with { type: "json" }</code> en un import?',
      opciones: ['Nada', 'Le indica al runtime que el archivo es JSON: se importa ya convertido en objeto', 'Lo convierte en texto'],
      correcta: 1,
      explicacion: 'Son los <em>import attributes</em> (ES2025). El runtime comprueba el tipo, así un archivo no puede hacerse pasar por JSON y ejecutar código.',
    },
    {
      pregunta: '¿Qué devuelve <code>import.meta.resolve("fecha")</code>?',
      opciones: ['El módulo', 'La URL completa a la que se resolvería ese import, sin cargarlo', 'Una promesa'],
      correcta: 1,
      explicacion: 'Útil para depurar un import map o para obtener la URL de un recurso junto al módulo.',
    },
  ],
};

export const mapsOrden = {
  id: 'maps-orden',
  titulo: 'Resolver con un import map',
  codigo: `<!-- https://ejemplo.com/app/index.html -->
<script type="importmap">
  {
    "imports": {
      "fecha": "/libs/fecha@2.1/index.js",
      "utils/": "/src/utils/"
    }
  }
</script>

<script type="module">
  console.log(import.meta.resolve("fecha"));
  console.log(import.meta.resolve("utils/texto.js"));
  console.log(import.meta.resolve("./local.js"));
</script>`,
  salida: ['https://ejemplo.com/libs/fecha@2.1/index.js', 'https://ejemplo.com/src/utils/texto.js', 'https://ejemplo.com/app/local.js'],
  inicio: [1, 2, 0],
  explicacion:
    '<code>"fecha"</code> está en el mapa tal cual. <code>"utils/"</code> termina en barra: es un <b>prefijo</b>, y todo lo que empiece así se resuelve dentro de <code>/src/utils/</code>. <code>./local.js</code> es una ruta relativa: el mapa no la toca y se resuelve desde la página.',
};

export const mapsDetective = {
  id: 'maps-detective',
  titulo: 'Un nombre que el navegador no conoce',
  codigo: `<!-- index.html -->
<script type="module">
  import { format } from "date-fns";
  console.log(format(new Date(), "dd/MM/yyyy"));
</script>`,
  error: `Uncaught TypeError: Failed to resolve module specifier "date-fns". Relative references must start with either "/", "./", or "../".`,
  culpable: 3,
  hallazgo:
    'En Node.js, <code>"date-fns"</code> se busca en <code>node_modules</code>. El navegador no tiene <code>node_modules</code>: solo entiende rutas y URLs, salvo que un import map le diga qué significa ese nombre.',
  pista: 'El mensaje explica qué formas de import entiende el navegador. ¿Es <code>"date-fns"</code> una de ellas?',
  arreglos: [
    {
      texto: 'Agregar un import map antes: <code>{ "imports": { "date-fns": "https://esm.sh/date-fns@4" } }</code>',
      correcta: true,
      porque: 'El mapa traduce el nombre a una URL. Así el código queda igual que en un proyecto con herramientas, y cambiar de versión es tocar una sola línea.',
    },
    {
      texto: 'Agregar la extensión: <code>"date-fns.js"</code>',
      correcta: false,
      porque: 'Sigue sin ser una ruta ni una URL: el mismo error.',
    },
    {
      texto: 'Cambiarlo por <code>require("date-fns")</code>',
      correcta: false,
      porque: 'El navegador no tiene <code>require</code>, y un módulo tampoco.',
    },
  ],
};

/* ── 10.4 Organizar un proyecto ──────────────────────────── */
export const organizarAuto = {
  id: 'organizar-auto',
  titulo: 'Piezas que encajan',
  preguntas: [
    {
      pregunta: 'En un proyecto mediano, ¿cuál suele escalar mejor?',
      opciones: [
        'Carpetas por tipo de archivo: <code>componentes/</code>, <code>servicios/</code>, <code>utils/</code>',
        'Carpetas por funcionalidad: <code>carrito/</code>, <code>usuarios/</code>, <code>pagos/</code>, cada una con lo que necesita',
        'Todo en un archivo',
      ],
      correcta: 1,
      explicacion: 'Lo que cambia junto, vive junto. Para tocar el carrito no hace falta saltar entre cinco carpetas.',
    },
    {
      pregunta: '¿Qué problema puede traer un <em>barrel file</em> (un <code>index.js</code> que reexporta todo)?',
      opciones: ['Ninguno', 'Importar una sola cosa puede cargar y evaluar todos los módulos que reexporta', 'Es más lento de escribir'],
      correcta: 1,
      explicacion: 'Son cómodos, pero en proyectos grandes hacen más lentas las cargas y las pruebas, y dificultan el <em>tree shaking</em>.',
    },
    {
      pregunta: '¿Qué es una dependencia circular?',
      opciones: ['Un módulo sin exportaciones', 'Dos o más módulos que se importan entre sí, directa o indirectamente', 'Un import dinámico'],
      correcta: 1,
      explicacion: 'Funcionan a veces, pero el orden de evaluación puede dejar variables en la zona muerta temporal. Mejor evitarlas.',
    },
    {
      pregunta: '¿Para qué sirve el campo <code>"exports"</code> del <code>package.json</code>?',
      opciones: ['Para listar dependencias', 'Para definir qué archivos de un paquete se pueden importar desde afuera, y cómo', 'Para publicar'],
      correcta: 1,
      explicacion: 'Lo que no aparece en <code>"exports"</code> es privado: nadie puede importarlo por accidente.',
    },
  ],
};

export const organizarOrden = {
  id: 'organizar-orden',
  titulo: 'Un barrel que carga de más',
  codigo: `// componentes/index.js
export { Boton } from "./boton.js";
export { Tabla } from "./tabla.js";

// componentes/boton.js
console.log("cargo boton");
export const Boton = "botón";

// componentes/tabla.js
console.log("cargo tabla (pesada)");
export const Tabla = "tabla";

// main.js
import { Boton } from "./componentes/index.js";
console.log("uso", Boton);`,
  salida: ['cargo boton', 'cargo tabla (pesada)', 'uso botón'],
  inicio: [1, 2, 0],
  explicacion:
    '<code>main.js</code> solo quiere el botón, pero importa el <em>barrel</em>, que depende de los dos archivos: los dos se cargan y se evalúan, en el orden en que aparecen. Importando directamente <code>./componentes/boton.js</code>, la tabla no se cargaría.',
};

export const organizarDetective = {
  id: 'organizar-detective',
  titulo: 'Una dependencia circular',
  codigo: `// precios.js  (lo importa main.js)
import { conIva } from "./impuestos.js";
export const PRECIO_BASE = 100;
export const total = () => conIva(PRECIO_BASE);

// impuestos.js
import { PRECIO_BASE } from "./precios.js";
export const IVA = 0.21;
export const minimo = PRECIO_BASE * IVA;
export const conIva = (n) => n * (1 + IVA);`,
  error: `file:///proyecto/impuestos.js:3
export const minimo = PRECIO_BASE * IVA;
                      ^

ReferenceError: Cannot access 'PRECIO_BASE' before initialization`,
  culpable: 9,
  hallazgo:
    '<code>precios.js</code> necesita a <code>impuestos.js</code>, así que este se evalúa <b>primero</b>. Pero <code>impuestos.js</code> usa <code>PRECIO_BASE</code> al cargarse, y <code>precios.js</code> todavía no llegó a su línea 2: la constante está en la zona muerta temporal.',
  pista: 'Los dos módulos se importan entre sí. ¿Cuál se termina de evaluar primero? ¿Ya existe <code>PRECIO_BASE</code> en ese momento?',
  arreglos: [
    {
      texto: 'Mover <code>PRECIO_BASE</code> a un tercer módulo, <code>config.js</code>, que importen los dos',
      correcta: true,
      porque: 'Se rompe el círculo: <code>config.js</code> no depende de nadie y se evalúa antes que los dos.',
    },
    {
      texto: 'Cambiar <code>export const PRECIO_BASE</code> por <code>export var PRECIO_BASE</code>',
      correcta: false,
      porque: 'Ya no lanza error, pero <code>PRECIO_BASE</code> vale <code>undefined</code> en ese momento y <code>minimo</code> queda en <code>NaN</code>, en silencio.',
    },
    {
      texto: 'En <code>main.js</code>, importar <code>impuestos.js</code> antes que <code>precios.js</code>',
      correcta: false,
      porque: 'Ahora <code>precios.js</code> se evaluaría primero y usaría <code>conIva</code> antes de tiempo. Mientras haya círculo, alguien queda esperando.',
    },
  ],
};
