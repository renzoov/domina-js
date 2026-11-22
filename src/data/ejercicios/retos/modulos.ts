// Reto del motor de la sección 10: «Módulos». La sección no tiene laboratorios (los módulos necesitan
// varios archivos), así que el reto cierra con una segunda autoevaluación.

export const retoModAuto = {
  id: 'reto-mod-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '<code>// contador.js</code><br><code>export let n = 0;</code><br><code>export function sumar() { n++; }</code><br><br><code>// app.js</code><br><code>import { n, sumar } from "./contador.js";</code><br><code>sumar();</code><br><code>console.log(n);</code><br>¿Qué imprime?',
      opciones: ['<code>0</code>', '<code>1</code>', '<code>TypeError</code>'],
      correcta: 1,
      explicacion: 'Lo que importas es un <b>enlace vivo</b> a la variable del módulo, no una copia: cuando <code>sumar</code> la cambia, <code>app.js</code> ve el valor nuevo. Lo que no puedes es asignarle desde afuera: <code>n = 5</code> en <code>app.js</code> es un error.',
    },
    {
      pregunta: 'Dos archivos distintos hacen <code>import "./config.js"</code>, y <code>config.js</code> tiene un <code>console.log("cargando")</code>. ¿Cuántas veces se imprime?',
      opciones: ['Una', 'Dos', 'Ninguna, porque no importa nada con nombre'],
      correcta: 0,
      explicacion: 'Cada módulo se evalúa una sola vez por programa. Las demás importaciones reciben el mismo módulo, ya evaluado.',
    },
    {
      pregunta: '<code>// utilidades.js</code><br><code>export function sumar(a, b) { return a + b; }</code><br><br>¿Qué pasa con <code>import sumar from "./utilidades.js";</code>?',
      opciones: ['Funciona: importa <code>sumar</code>', '<code>SyntaxError</code>: el módulo no tiene un export por defecto', 'Importa <code>undefined</code>'],
      correcta: 1,
      explicacion: 'Sin llaves pides el export <b>por defecto</b>, y este módulo no tiene. Para un export con nombre: <code>import { sumar } from "./utilidades.js";</code>. El error salta al cargar, antes de ejecutar nada.',
    },
    {
      pregunta: 'En un archivo ES module (<code>"type": "module"</code>), ¿qué pasa con <code>const fs = require("node:fs");</code>?',
      opciones: ['Funciona igual que en CommonJS', '<code>ReferenceError: require is not defined in ES module scope</code>', 'Importa el módulo de forma asíncrona'],
      correcta: 1,
      explicacion: 'En un ES module no existe <code>require</code>: se usa <code>import</code>. Si de verdad lo necesitas, <code>createRequire(import.meta.url)</code> de <code>node:module</code> crea uno.',
    },
  ],
};

export const retoModOrden = {
  id: 'reto-mod-orden',
  titulo: '¿Quién se evalúa primero?',
  codigo: `// main.js
import "./c.js";
import "./a.js";
import "./b.js";
console.log("main");

// a.js
import { saludo } from "./b.js";
console.log("a:", saludo);

// b.js
console.log("b se evalúa");
export const saludo = "hola";

// c.js
console.log("c");`,
  salida: ['c', 'b se evalúa', 'a: hola', 'main'],
  inicio: [3, 2, 0, 1],
  explicacion:
    'Los <code>import</code> se resuelven antes de ejecutar el cuerpo de un módulo, y en orden: primero <code>c.js</code>; después <code>a.js</code>, que necesita a <code>b.js</code>, así que <code>b.js</code> se evalúa antes que <code>a.js</code>. Cuando <code>main.js</code> llega a su <code>import "./b.js"</code>, ese módulo ya fue evaluado y no se repite. Recién al final corre el cuerpo de <code>main.js</code>.',
};

export const retoModDetective = {
  id: 'reto-mod-detective',
  titulo: 'Un import sin extensión',
  codigo: `// app.js  (package.json: "type": "module")
import { sumar } from "./utilidades";

console.log(sumar(2, 3));`,
  error: `node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/proyecto/utilidades' imported from /proyecto/app.js
Did you mean to import "./utilidades.js"?`,
  culpable: 2,
  hallazgo:
    'En los ES modules, las rutas relativas son <b>URLs</b>: hay que escribir el archivo completo, con su extensión. Node no prueba <code>.js</code> por su cuenta como hacía <code>require</code> en CommonJS (y lo sugiere en el mismo mensaje).',
  pista: 'Lee la última línea del error: Node ya te dice qué quisiste importar.',
  arreglos: [
    {
      texto: 'Escribir la extensión: <code>import { sumar } from "./utilidades.js";</code>',
      correcta: true,
      porque: 'Con la ruta completa, Node encuentra el archivo. Es la misma regla que en el navegador, donde un import es una petición a una URL.',
    },
    {
      texto: 'Cambiarlo por <code>const { sumar } = require("./utilidades");</code>',
      correcta: false,
      porque: 'En un ES module no existe <code>require</code>: cambias un error por otro (<code>ReferenceError</code>).',
    },
    {
      texto: 'Quitar <code>"type": "module"</code> del <code>package.json</code>',
      correcta: false,
      porque: 'El archivo pasaría a interpretarse como CommonJS, donde el <code>import</code> de la línea 2 no está permitido. Además, no es el problema: lo que falta es la extensión.',
    },
  ],
};

export const retoModAuto2 = {
  id: 'reto-mod-auto-2',
  titulo: 'Organizar y cargar',
  preguntas: [
    {
      pregunta: '¿Qué devuelve <code>import("./graficos.js")</code>?',
      opciones: ['El módulo, al instante', 'Una promesa que se cumple con el módulo cuando termina de cargar', '<code>undefined</code>'],
      correcta: 1,
      explicacion: 'El <code>import()</code> dinámico carga el módulo cuando hace falta y devuelve una promesa. Sirve para no cargar al inicio lo que quizás nunca se use.',
    },
    {
      pregunta: 'En un import map, <code>{ "imports": { "fecha": "/libs/fecha@2.1/index.js" } }</code>, ¿qué consigue?',
      opciones: [
        'Que <code>import "fecha"</code> funcione en el navegador sin bundler',
        'Instalar la biblioteca con npm',
        'Que la biblioteca se cargue más rápido',
      ],
      correcta: 0,
      explicacion: 'El navegador no sabe qué es <code>"fecha"</code>: solo entiende URLs. El import map le dice a qué URL corresponde cada nombre.',
    },
    {
      pregunta: '<code>a.js</code> importa de <code>b.js</code>, y <code>b.js</code> importa de <code>a.js</code>. ¿Qué suele pasar?',
      opciones: [
        'Un error al cargar: los ciclos están prohibidos',
        'Funciona, pero uno de los dos puede encontrar el otro sin terminar de evaluar, y usar algo antes de tiempo da <code>ReferenceError</code>',
        'Se cuelga el programa',
      ],
      correcta: 1,
      explicacion: 'Las dependencias circulares están permitidas, pero son frágiles: el orden de evaluación decide si un valor ya existe. Suele ser señal de que hay que separar lo que comparten en un tercer módulo.',
    },
    {
      pregunta: '¿Qué controla el campo <code>"exports"</code> del <code>package.json</code> de una biblioteca?',
      opciones: [
        'Qué archivos pueden importar los que la usan, y con qué rutas',
        'Qué funciones son públicas dentro de cada archivo',
        'La versión de Node necesaria',
      ],
      correcta: 0,
      explicacion: 'Con <code>"exports"</code>, una biblioteca decide sus puntos de entrada: lo que no aparece ahí no se puede importar desde afuera, aunque el archivo exista.',
    },
  ],
};
