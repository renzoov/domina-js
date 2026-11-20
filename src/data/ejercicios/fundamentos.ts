// Ejercicios de la sección 1: «Fundamentos del lenguaje».

/* ── 1.1 Sintaxis básica ───────────────────────────────────── */
export const sintaxisAuto = {
  id: 'sintaxis-auto',
  titulo: 'Las reglas de escritura',
  preguntas: [
    {
      pregunta: '¿Cuál de estos nombres de variable es <b>válido</b>?',
      opciones: ['<code>2doLugar</code>', '<code>mi-nombre</code>', '<code>_totalAño</code>', '<code>class</code>'],
      correcta: 2,
      explicacion: 'Un identificador puede empezar con letra, <code>_</code> o <code>$</code>, y admite letras con tilde. No puede empezar con un número, no lleva guiones y no puede ser una palabra reservada como <code>class</code>.',
    },
    {
      pregunta: 'Si escribes <code>const total = 10;</code>, ¿qué pasa con <code>console.log(Total)</code>?',
      opciones: ['Imprime 10', 'Lanza <code>ReferenceError: Total is not defined</code>', 'Imprime <code>undefined</code>'],
      correcta: 1,
      explicacion: 'JavaScript distingue mayúsculas de minúsculas: <code>total</code> y <code>Total</code> son dos nombres distintos, y <code>Total</code> no existe.',
    },
    {
      pregunta: '¿Qué diferencia hay entre una <em>expresión</em> y una <em>sentencia</em>?',
      opciones: [
        'Ninguna, son sinónimos',
        'La expresión produce un valor (<code>2 + 3</code>); la sentencia es una instrucción completa (<code>const x = 2 + 3;</code>)',
        'Las expresiones solo existen dentro de funciones',
      ],
      correcta: 1,
      explicacion: 'Una expresión siempre vale algo. Una sentencia hace algo, y suele estar formada por expresiones.',
    },
    {
      pregunta: 'Escribes <code>return</code> y en la línea siguiente un objeto. ¿Qué devuelve la función?',
      opciones: ['El objeto', '<code>undefined</code>', 'Un error de sintaxis'],
      correcta: 1,
      explicacion: 'Después de <code>return</code>, el salto de línea hace que el motor inserte un punto y coma. La función devuelve <code>undefined</code> y el objeto nunca se evalúa.',
    },
  ],
};

export const sintaxisOrden = {
  id: 'sintaxis-orden',
  titulo: 'Mayúsculas y comentarios',
  codigo: `const color = "rojo";
const Color = "azul";

console.log(color);
/* console.log("verde"); */
console.log(Color);
// console.log("amarillo");
console.log("fin");`,
  salida: ['rojo', 'azul', 'fin'],
  inicio: [2, 1, 0],
  explicacion:
    '<code>color</code> y <code>Color</code> son dos variables distintas, porque JavaScript distingue mayúsculas. Las líneas comentadas, con <code>/* … */</code> o con <code>//</code>, no se ejecutan.',
};

export const sintaxisDetective = {
  id: 'sintaxis-detective',
  titulo: 'Un nombre que no puede ser',
  codigo: `const nombre = "Ana";
const 2doLugar = "Luis";
console.log(nombre, 2doLugar);`,
  error: `const 2doLugar = "Luis";
      ^

SyntaxError: Invalid or unexpected token`,
  culpable: 2,
  hallazgo:
    'Un identificador no puede empezar con un número: el motor ve <code>2</code> y no sabe qué hacer con <code>doLugar</code> pegado detrás. Como es un error de sintaxis, no se ejecuta ninguna línea.',
  pista: 'El error copia la línea problemática y la señala con <code>^</code>. Mira cómo empieza el nombre.',
  arreglos: [
    {
      texto: 'Poner el nombre entre comillas: <code>const "2doLugar" = "Luis";</code>',
      correcta: false,
      porque: 'Entre comillas es un texto, no un nombre de variable. Sigue siendo un error de sintaxis.',
    },
    {
      texto: 'Cambiar el nombre a <code>segundoLugar</code> en las dos líneas',
      correcta: true,
      porque: 'Ahora es un identificador válido en camelCase, y el programa imprime <code>Ana Luis</code>.',
    },
    {
      texto: 'Cambiar <code>const</code> por <code>let</code>',
      correcta: false,
      porque: 'El problema no es la palabra que declara la variable, sino el nombre: tampoco vale con <code>let</code>.',
    },
  ],
};

export const sintaxisLab = {
  id: 'sintaxis-lab',
  titulo: 'Arregla los nombres',
  inicial: `const mi-nombre = "Ana";
const 1edad = 30;

console.log(mi-nombre, 1edad);
`,
  verificaciones: [
    { texto: 'El programa se ejecuta sin errores', prueba: 'return true;' },
    { texto: 'Imprime <code>Ana 30</code>', prueba: 'return __salida.some((l) => l === "Ana 30");' },
    { texto: 'El nombre usa camelCase: <code>miNombre</code>', prueba: 'return /\\bmiNombre\\b/.test(__codigo);' },
    { texto: 'Ningún nombre empieza con un número ni lleva guion', prueba: 'return !/\\bmi-nombre\\b/.test(__codigo) && !/\\b\\d+[A-Za-z_$]/.test(__codigo);' },
  ],
  pistas: [
    'Hay dos nombres inválidos: uno lleva guion y otro empieza con un número.',
    'En JavaScript, los nombres de varias palabras se escriben en camelCase: la primera palabra en minúscula y las siguientes con mayúscula inicial.',
    'Cambia <code>mi-nombre</code> por <code>miNombre</code> y <code>1edad</code> por <code>edad</code>, en la declaración y en el <code>console.log</code>.',
  ] as [string, string, string],
  solucion: `const miNombre = "Ana";
const edad = 30;

console.log(miNombre, edad);`,
  explicacion:
    '<p><code>mi-nombre</code> no sirve porque el motor lee el guion como una resta: <code>mi - nombre</code>. <code>1edad</code> empieza con un número. Con <code>miNombre</code> y <code>edad</code> los dos nombres son válidos y el programa imprime <code>Ana 30</code>.</p>',
};

/* ── 1.2 Variables ─────────────────────────────────────────── */
export const variablesAuto = {
  id: 'variables-auto',
  titulo: 'let, const y var',
  preguntas: [
    {
      pregunta: 'Vas a guardar la fecha de nacimiento de una persona, que no va a cambiar. ¿Con qué la declaras?',
      opciones: ['<code>let</code>', '<code>const</code>', '<code>var</code>'],
      correcta: 1,
      explicacion: 'Si el valor no se reasigna, <code>const</code>. Además le dice a quien lee el código que ese nombre no cambia.',
    },
    {
      pregunta: '¿Qué imprime este código?<br><code>if (true) { let x = 5; }</code><br><code>console.log(x);</code>',
      opciones: ['5', '<code>undefined</code>', '<code>ReferenceError: x is not defined</code>'],
      correcta: 2,
      explicacion: '<code>let</code> y <code>const</code> viven solo dentro del bloque <code>{ }</code> donde se declaran. Fuera, <code>x</code> no existe.',
    },
    {
      pregunta: '¿Funciona esto?<br><code>const lista = [1, 2];</code><br><code>lista.push(3);</code>',
      opciones: ['Sí: <code>const</code> impide reasignar el nombre, no modificar el array', 'No: lanza <code>TypeError</code>', 'Solo si se cambia <code>const</code> por <code>let</code>'],
      correcta: 0,
      explicacion: '<code>lista = [9]</code> sí fallaría, porque eso es reasignar. Agregar elementos modifica el mismo array, y eso está permitido.',
    },
    {
      pregunta: '¿Por qué hoy casi no se usa <code>var</code>?',
      opciones: [
        'Porque es más lenta',
        'Porque ignora los bloques <code>{ }</code>, permite declarar dos veces el mismo nombre y se puede usar antes de su línea sin error',
        'Porque ya no funciona en los navegadores modernos',
      ],
      correcta: 1,
      explicacion: '<code>var</code> sigue funcionando, pero esas tres cosas causan errores difíciles de ver. <code>let</code> y <code>const</code> (ES2015) los evitan.',
    },
  ],
};

export const variablesOrden = {
  id: 'variables-orden',
  titulo: 'Dos variables con el mismo nombre',
  codigo: `let nivel = 1;

{
  let nivel = 2;
  console.log(nivel);
}

console.log(nivel);
nivel = nivel + 10;
console.log(nivel);`,
  salida: ['2', '1', '11'],
  inicio: [2, 0, 1],
  explicacion:
    'Dentro del bloque, <code>let nivel = 2</code> crea <b>otra</b> variable que solo existe ahí y tapa a la de afuera. Al salir del bloque vuelve a verse la original, que vale <code>1</code>, y después pasa a <code>11</code>.',
};

export const variablesDetective = {
  id: 'variables-detective',
  titulo: 'Intentos que no bajan',
  codigo: `const intentos = 3;
console.log("Te quedan", intentos);
intentos = intentos - 1;
console.log("Te quedan", intentos);`,
  error: `Te quedan 3
juego.js:3
intentos = intentos - 1;
         ^

TypeError: Assignment to constant variable.`,
  culpable: 3,
  hallazgo:
    'La línea 3 intenta reasignar <code>intentos</code>, pero en la línea 1 se declaró con <code>const</code>. Es un error en ejecución: la primera línea sí se imprimió, y el programa se detuvo en la 3.',
  pista: 'La consola muestra <code>Te quedan 3</code> y después el error: busca la primera línea que no llegó a funcionar.',
  arreglos: [
    {
      texto: 'Cambiar la línea 3 por <code>const intentos = intentos - 1;</code>',
      correcta: false,
      porque: 'Eso declara <code>intentos</code> por segunda vez y da <code>SyntaxError: Identifier \'intentos\' has already been declared</code>.',
    },
    {
      texto: 'Declarar con <code>var</code> en la línea 1',
      correcta: false,
      porque: 'Funcionaría, pero <code>var</code> trae los problemas que viste en la lección. Hay una opción mejor.',
    },
    {
      texto: 'Declarar con <code>let</code> en la línea 1: <code>let intentos = 3;</code>',
      correcta: true,
      porque: 'Un valor que va a cambiar se declara con <code>let</code>. Ahora imprime <code>Te quedan 3</code> y <code>Te quedan 2</code>.',
    },
  ],
};

export const variablesLab = {
  id: 'variables-lab',
  titulo: 'Moderniza este código',
  inicial: `var nombre = "Ana";
var puntos = 0;
puntos = puntos + 10;
puntos = puntos + 5;
var MAX_PUNTOS = 100;

console.log(nombre, puntos, MAX_PUNTOS);
`,
  verificaciones: [
    { texto: 'Imprime <code>Ana 15 100</code>', prueba: 'return __salida.some((l) => l === "Ana 15 100");' },
    // String.raw: las barras invertidas de la expresión regular llegan intactas a la prueba
    { texto: 'No queda ningún <code>var</code>', prueba: String.raw`return !/\bvar\b/.test(__codigo);` },
    { texto: '<code>puntos</code>, que cambia, usa <code>let</code>', prueba: String.raw`return /\blet\s+puntos\b/.test(__codigo);` },
    { texto: '<code>nombre</code> y <code>MAX_PUNTOS</code>, que no cambian, usan <code>const</code>', prueba: String.raw`return /\bconst\s+nombre\b/.test(__codigo) && /\bconst\s+MAX_PUNTOS\b/.test(__codigo);` },
  ],
  pistas: [
    'Mira cada variable: ¿se le asigna un valor nuevo más abajo?',
    'Solo <code>puntos</code> se reasigna (líneas 3 y 4). Las otras dos nunca cambian.',
    'Cambia <code>var puntos</code> por <code>let puntos</code>, y los otros dos <code>var</code> por <code>const</code>.',
  ] as [string, string, string],
  solucion: `const nombre = "Ana";
let puntos = 0;
puntos = puntos + 10;
puntos = puntos + 5;
const MAX_PUNTOS = 100;

console.log(nombre, puntos, MAX_PUNTOS);`,
  explicacion:
    '<p>La regla práctica: empieza todo con <code>const</code> y cámbialo a <code>let</code> solo si de verdad necesitas reasignarlo. Aquí solo <code>puntos</code> cambia. Si te equivocas y pones <code>const puntos</code>, el motor te avisa con un <code>TypeError</code> en la primera reasignación.</p>',
};

/* ── 1.3 Valores primitivos y objetos ─────────────────────── */
export const primitivosAuto = {
  id: 'primitivos-auto',
  titulo: 'Valor o referencia',
  preguntas: [
    {
      pregunta: '¿Cuál de estos valores <b>no</b> es primitivo?',
      opciones: ['<code>"hola"</code>', '<code>42</code>', '<code>[1, 2, 3]</code>', '<code>null</code>'],
      correcta: 2,
      explicacion: 'Los arrays son objetos. Los primitivos son siete: string, number, bigint, boolean, undefined, null y symbol.',
    },
    {
      pregunta: '¿Qué devuelve <code>typeof null</code>?',
      opciones: ['<code>"null"</code>', '<code>"object"</code>', '<code>"undefined"</code>'],
      correcta: 1,
      explicacion: 'Es un error histórico de la primera versión de JavaScript, que nunca se corrigió para no romper la web. <code>null</code> es primitivo, aunque <code>typeof</code> diga otra cosa.',
    },
    {
      pregunta: '¿Qué da <code>{ a: 1 } === { a: 1 }</code>?',
      opciones: ['<code>true</code>, tienen lo mismo adentro', '<code>false</code>, son dos objetos distintos'],
      correcta: 1,
      explicacion: 'Con objetos, <code>===</code> compara referencias: pregunta "¿es el mismo objeto?", no "¿tienen el mismo contenido?". Cada <code>{ }</code> crea un objeto nuevo.',
    },
    {
      pregunta: '<code>const a = [1, 2]; const b = a; b.push(3);</code><br>¿Qué contiene <code>a</code>?',
      opciones: ['<code>[1, 2]</code>', '<code>[1, 2, 3]</code>', 'Da error porque <code>a</code> es <code>const</code>'],
      correcta: 1,
      explicacion: '<code>a</code> y <code>b</code> apuntan al mismo array, así que el <code>push</code> se ve desde los dos nombres.',
    },
  ],
};

export const primitivosOrden = {
  id: 'primitivos-orden',
  titulo: 'Números y objetos copiados',
  codigo: `let x = 5;
let y = x;
y = y + 1;

const p = { n: 5 };
const q = p;
q.n = q.n + 1;

console.log("x:", x);
console.log("y:", y);
console.log("p.n:", p.n);`,
  salida: ['x: 5', 'y: 6', 'p.n: 6'],
  inicio: [2, 0, 1],
  explicacion:
    '<code>y</code> recibió una copia del número, así que cambiarla no afecta a <code>x</code>. <code>q</code> recibió la referencia al mismo objeto que <code>p</code>: al cambiar <code>q.n</code> también cambia <code>p.n</code>.',
};

export const primitivosDetective = {
  id: 'primitivos-detective',
  titulo: 'El usuario que no estaba',
  codigo: `const usuario = null;
console.log("Buscando usuario...");
console.log(usuario.nombre);`,
  error: `Buscando usuario...
perfil.js:3
console.log(usuario.nombre);
                    ^

TypeError: Cannot read properties of null (reading 'nombre')`,
  culpable: 3,
  hallazgo:
    '<code>usuario</code> vale <code>null</code>, que es un primitivo que significa "ningún objeto". No tiene propiedades, así que <code>usuario.nombre</code> lanza <code>TypeError</code>.',
  pista: 'El mensaje dice <em>reading \'nombre\'</em>: busca la línea que intenta leer <code>.nombre</code>.',
  arreglos: [
    {
      texto: 'Comprobar antes: <code>if (typeof usuario === "object") { … }</code>',
      correcta: false,
      porque: '<code>typeof null</code> devuelve <code>"object"</code>, así que la comprobación pasa y sigue fallando. Es la trampa de la autoevaluación.',
    },
    {
      texto: 'Comprobar antes: <code>if (usuario !== null) { console.log(usuario.nombre); }</code>',
      correcta: true,
      porque: 'Solo lee <code>.nombre</code> cuando hay un objeto. En la sección de Operadores vas a ver un atajo para esto: <code>usuario?.nombre</code>.',
    },
    {
      texto: 'Cambiar <code>const</code> por <code>let</code>',
      correcta: false,
      porque: 'El problema no es cómo se declaró, sino que su valor es <code>null</code>.',
    },
  ],
};

export const primitivosLab = {
  id: 'primitivos-lab',
  titulo: 'Haz una copia de verdad',
  inicial: `const original = { nombre: "Ana", puntos: 10 };
const copia = original; // esto no copia el objeto

copia.puntos = 99;

console.log(original.puntos); // debería seguir en 10
console.log(copia.puntos);    // 99
`,
  verificaciones: [
    { texto: 'Imprime <code>10</code> y después <code>99</code>', prueba: 'return __salida[0] === "10" && __salida[1] === "99";' },
    { texto: '<code>original</code> y <code>copia</code> son objetos distintos', prueba: 'return original !== copia;' },
    { texto: 'La copia conserva el nombre: <code>copia.nombre</code> es <code>"Ana"</code>', prueba: 'return copia.nombre === "Ana";' },
  ],
  pistas: [
    'El problema está en la línea 2: <code>copia</code> recibe la misma referencia que <code>original</code>.',
    'Necesitas crear un objeto nuevo con el mismo contenido. La lección muestra dos formas de hacerlo.',
    'Cambia la línea 2 por <code>const copia = { ...original };</code> o por <code>const copia = structuredClone(original);</code>.',
  ] as [string, string, string],
  solucion: `const original = { nombre: "Ana", puntos: 10 };
const copia = { ...original };

copia.puntos = 99;

console.log(original.puntos); // 10
console.log(copia.puntos);    // 99`,
  explicacion:
    '<p><code>{ ...original }</code> crea un objeto nuevo y copia dentro las propiedades del original. Ahora hay dos objetos en memoria, y cambiar uno no afecta al otro. <code>structuredClone(original)</code> también funciona, y además copia los objetos que haya adentro.</p>',
};
