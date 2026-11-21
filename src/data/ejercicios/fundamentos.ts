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

/* ── 1.4 Números ───────────────────────────────────────────── */
export const numerosAuto = {
  id: 'numeros-auto',
  titulo: 'Las rarezas de los números',
  preguntas: [
    {
      pregunta: '¿Qué da <code>10 / 0</code> en JavaScript?',
      opciones: ['Un error', '<code>Infinity</code>', '<code>0</code>'],
      correcta: 1,
      explicacion: 'Dividir entre cero no lanza error: da <code>Infinity</code> (o <code>-Infinity</code> si el número es negativo). Solo <code>0 / 0</code> da <code>NaN</code>.',
    },
    {
      pregunta: '¿Cómo compruebas si un resultado es <code>NaN</code>?',
      opciones: ['<code>resultado === NaN</code>', '<code>Number.isNaN(resultado)</code>', '<code>resultado == "NaN"</code>'],
      correcta: 1,
      explicacion: '<code>NaN</code> es el único valor que no es igual ni a sí mismo: <code>NaN === NaN</code> da <code>false</code>. Por eso existe <code>Number.isNaN()</code>.',
    },
    {
      pregunta: '¿Qué significa <code>1_000_000</code>?',
      opciones: ['Un error de sintaxis', 'El número un millón; los guiones bajos solo ayudan a leerlo', 'El texto "1_000_000"'],
      correcta: 1,
      explicacion: 'Son los <b>separadores numéricos</b> (ES2021). El motor los ignora; sirven para que las personas lean cifras largas.',
    },
    {
      pregunta: 'Necesitas sumar enteros más grandes que <code>9007199254740991</code> sin perder precisión. ¿Qué usas?',
      opciones: ['<code>number</code> normal', '<code>BigInt</code>, escribiendo una <code>n</code> al final: <code>9007199254740993n</code>', '<code>Math.round</code>'],
      correcta: 1,
      explicacion: 'Más allá de <code>Number.MAX_SAFE_INTEGER</code>, un <code>number</code> ya no representa todos los enteros. <code>BigInt</code> no tiene ese límite.',
    },
  ],
};

export const numerosOrden = {
  id: 'numeros-orden',
  titulo: 'Operaciones y redondeos',
  codigo: `console.log(7 % 3);
console.log(2 ** 3);
console.log(Math.round(2.5));
console.log(Math.floor(-2.5));
console.log((0.1 + 0.2).toFixed(2));`,
  salida: ['1', '8', '3', '-3', '0.30'],
  inicio: [3, 1, 4, 0, 2],
  explicacion:
    '<code>%</code> da el resto de la división (7 entre 3 sobra 1). <code>**</code> es potencia. <code>Math.round(2.5)</code> redondea hacia arriba. <code>Math.floor</code> siempre baja, así que -2.5 pasa a -3. <code>toFixed(2)</code> devuelve un <b>texto</b> con dos decimales.',
};

export const numerosDetective = {
  id: 'numeros-detective',
  titulo: 'El número demasiado grande',
  codigo: `const grande = 9007199254740993n;
const extra = 1;
console.log(grande + extra);`,
  error: `contador.js:3
console.log(grande + extra);
                   ^

TypeError: Cannot mix BigInt and other types, use explicit conversions`,
  culpable: 3,
  hallazgo:
    '<code>grande</code> es un <code>BigInt</code> y <code>extra</code> es un <code>number</code>. JavaScript no los mezcla solo, para que no pierdas precisión sin darte cuenta.',
  pista: 'El error dice <em>Cannot mix BigInt and other types</em>: busca la línea que opera con los dos.',
  arreglos: [
    {
      texto: 'Convertir a <code>number</code>: <code>Number(grande) + extra</code>',
      correcta: false,
      porque: 'Funciona, pero da <code>9007199254740992</code>: al pasar a <code>number</code> se pierde precisión y la suma sale mal. Justo lo que el error quería evitar.',
    },
    {
      texto: 'Sumar un <code>BigInt</code>: <code>grande + BigInt(extra)</code>',
      correcta: true,
      porque: 'Los dos son <code>BigInt</code> y el resultado es exacto: <code>9007199254740994n</code>.',
    },
    {
      texto: 'Usar <code>parseInt(grande) + extra</code>',
      correcta: false,
      porque: '<code>parseInt</code> también devuelve un <code>number</code> y tiene el mismo problema de precisión.',
    },
  ],
};

export const numerosLab = {
  id: 'numeros-lab',
  titulo: 'La cuenta del súper',
  inicial: `const pan = 1.1;
const leche = 2.2;

const total = pan + leche;
console.log(total);
`,
  verificaciones: [
    { texto: 'Imprime exactamente <code>3.3</code>', prueba: 'return __salida.some((l) => l === "3.3");' },
    { texto: 'Pasa los precios a céntimos multiplicando por <code>100</code>', prueba: String.raw`return /\*\s*100\b/.test(__codigo);` },
    { texto: 'Redondea los céntimos con <code>Math.round</code>', prueba: String.raw`return /Math\.round\s*\(/.test(__codigo);` },
    { texto: 'No escribe <code>3.3</code> a mano', prueba: String.raw`return !/\b3\.3\b/.test(__codigo);` },
  ],
  pistas: [
    'Ejecuta el código tal cual: <code>1.1 + 2.2</code> da <code>3.3000000000000003</code>. Hay que sumar en céntimos.',
    'Para pasar un precio a céntimos: <code>Math.round(pan * 100)</code> da <code>110</code>. El <code>Math.round</code> elimina el decimal que pudo quedar al multiplicar.',
    'Suma los dos precios en céntimos y divide el resultado entre 100: <code>(Math.round(pan * 100) + Math.round(leche * 100)) / 100</code>.',
  ] as [string, string, string],
  solucion: `const pan = 1.1;
const leche = 2.2;

const centimos = Math.round(pan * 100) + Math.round(leche * 100);
const total = centimos / 100;
console.log(total);`,
  explicacion:
    '<p>En céntimos todo son enteros (110 + 220 = 330), y los enteros se suman sin error. Al dividir entre 100 se obtiene 3.3. El <code>Math.round</code> importa porque <code>1.1 * 100</code> da <code>110.00000000000001</code>: redondear deja el entero limpio.</p>',
};

/* ── 1.5 Texto y template literals ────────────────────────── */
export const textoAuto = {
  id: 'texto-auto',
  titulo: 'Trabajar con texto',
  preguntas: [
    {
      pregunta: '<code>const n = 3;</code> ¿Qué imprime <code>console.log(\'Tengo ${n} gatos\')</code>, con comillas simples?',
      opciones: ['<code>Tengo 3 gatos</code>', '<code>Tengo ${n} gatos</code>', 'Un error'],
      correcta: 1,
      explicacion: 'Los huecos <code>${ }</code> solo funcionan con comillas invertidas <code>`…`</code>. Con comillas simples o dobles, se imprimen tal cual.',
    },
    {
      pregunta: '¿Qué da <code>"hola".at(-1)</code>?',
      opciones: ['<code>"h"</code>', '<code>"a"</code>', '<code>undefined</code>'],
      correcta: 1,
      explicacion: '<code>at()</code> (ES2022) acepta índices negativos: <code>-1</code> es el último carácter.',
    },
    {
      pregunta: '<code>"a-b-c".replace("-", "+")</code> da…',
      opciones: ['<code>"a+b+c"</code>', '<code>"a+b-c"</code>'],
      correcta: 1,
      explicacion: '<code>replace</code> con un texto cambia solo la primera aparición. Para cambiarlas todas, <code>replaceAll</code> (ES2021).',
    },
    {
      pregunta: '¿Por qué <code>"👍".length</code> da <code>2</code>?',
      opciones: [
        'Por un error del navegador',
        'Porque <code>length</code> cuenta unidades de código UTF-16, y ese emoji ocupa dos',
        'Porque los emojis llevan un espacio invisible',
      ],
      correcta: 1,
      explicacion: 'Muchos emojis ocupan dos unidades. Para contar caracteres "de verdad" se usa <code>[...texto].length</code> o, mejor aún, <code>Intl.Segmenter</code>.',
    },
  ],
};

export const textoOrden = {
  id: 'texto-orden',
  titulo: 'Métodos de texto',
  codigo: `const s = "  JavaScript  ";
console.log(s.trim().length);
console.log(s.trim().toUpperCase());
console.log("abc".at(-1));
console.log("a-b-c".replaceAll("-", "+"));
console.log(\`2 + 3 = \${2 + 3}\`);`,
  salida: ['10', 'JAVASCRIPT', 'c', 'a+b+c', '2 + 3 = 5'],
  inicio: [4, 2, 0, 3, 1],
  explicacion:
    '<code>trim()</code> quita los espacios de los extremos, y quedan 10 letras. <code>at(-1)</code> es el último carácter. <code>replaceAll</code> cambia todas las apariciones. En el template literal se calcula <code>2 + 3</code> dentro del hueco.',
};

export const textoDetective = {
  id: 'texto-detective',
  titulo: 'El grito que no sale',
  codigo: `const nombre = "ana";
const grito = nombre.toUppercase();
console.log(grito);`,
  error: `grito.js:2
const grito = nombre.toUppercase();
                     ^

TypeError: nombre.toUppercase is not a function`,
  culpable: 2,
  hallazgo:
    'El método se llama <code>toUpperCase</code>, con <b>C</b> mayúscula. <code>toUppercase</code> no existe, así que vale <code>undefined</code>, y llamar a <code>undefined</code> como si fuera una función es un <code>TypeError</code>.',
  pista: 'El error dice <em>is not a function</em>: el nombre del método no es el que crees. Recuerda que JavaScript distingue mayúsculas.',
  arreglos: [
    {
      texto: 'Quitar los paréntesis: <code>nombre.toUppercase</code>',
      correcta: false,
      porque: 'Ya no da error, pero <code>grito</code> vale <code>undefined</code> y eso es lo que se imprime. El método sigue mal escrito.',
    },
    {
      texto: 'Escribir el método bien: <code>nombre.toUpperCase()</code>',
      correcta: true,
      porque: 'Con la C mayúscula el método existe, y se imprime <code>ANA</code>.',
    },
    {
      texto: 'Convertir antes: <code>String(nombre).toUppercase()</code>',
      correcta: false,
      porque: '<code>nombre</code> ya es un string. El problema es el nombre del método, que sigue sin existir.',
    },
  ],
};

export const textoLab = {
  id: 'texto-lab',
  titulo: 'Limpia y arma la frase',
  inicial: `const nombre = "  ana garcía  ";
const ciudad = "lima";

// Imprime exactamente: ANA GARCÍA vive en Lima
`,
  verificaciones: [
    { texto: 'Imprime exactamente <code>ANA GARCÍA vive en Lima</code>', prueba: 'return __salida.some((l) => l === "ANA GARCÍA vive en Lima");' },
    { texto: 'Quita los espacios de sobra con <code>trim()</code>', prueba: String.raw`return /\.trim\s*\(\s*\)/.test(__codigo);` },
    { texto: 'Arma la frase con un template literal <code>`…${…}…`</code>', prueba: 'return /`[^`]*\\$\\{/.test(__codigo);' },
    { texto: 'No escribe a mano <code>ANA GARCÍA</code> ni <code>Lima</code>', prueba: 'return !/ANA GARC|Lima/.test(__codigo.replace(/\\/\\/.*$/gm, ""));' },
  ],
  pistas: [
    'Hay tres transformaciones: quitar espacios al nombre, pasarlo a mayúsculas y poner en mayúscula solo la primera letra de la ciudad.',
    'Para la ciudad: <code>ciudad[0].toUpperCase()</code> te da <code>"L"</code> y <code>ciudad.slice(1)</code> te da <code>"ima"</code>.',
    'Guarda las dos piezas en constantes y usa <code>console.log(`${nombreLimpio} vive en ${ciudadBonita}`)</code>.',
  ] as [string, string, string],
  solucion: `const nombre = "  ana garcía  ";
const ciudad = "lima";

const nombreLimpio = nombre.trim().toUpperCase();
const ciudadBonita = ciudad[0].toUpperCase() + ciudad.slice(1);

console.log(\`\${nombreLimpio} vive en \${ciudadBonita}\`);`,
  explicacion:
    '<p>Los métodos se pueden <b>encadenar</b>: <code>nombre.trim().toUpperCase()</code> primero quita los espacios y, sobre ese resultado, pasa todo a mayúsculas. Ninguno modifica el texto original, porque los strings son inmutables: cada método devuelve uno nuevo.</p>',
};

/* ── 1.6 Booleanos, truthy/falsy, null y undefined ────────── */
export const booleanosAuto = {
  id: 'booleanos-auto',
  titulo: 'Verdadero, falso y vacío',
  preguntas: [
    {
      pregunta: '¿Cuál de estos valores es <b>truthy</b>?',
      opciones: ['<code>0</code>', '<code>""</code>', '<code>"false"</code>', '<code>NaN</code>'],
      correcta: 2,
      explicacion: '<code>"false"</code> es un texto con cinco letras, y todo texto no vacío es truthy. Los otros tres están en la lista de los 8 falsy.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>undefined</code> y <code>null</code>?',
      opciones: [
        'Ninguna, son el mismo valor',
        '<code>undefined</code>: todavía no tiene valor. <code>null</code>: vacío a propósito, lo pusiste tú.',
        '<code>null</code> es un error y <code>undefined</code> no',
      ],
      correcta: 1,
      explicacion: 'JavaScript usa <code>undefined</code> cuando algo no tiene valor (una variable sin asignar, una propiedad que no existe). <code>null</code> lo escribes tú para decir "aquí no hay nada".',
    },
    {
      pregunta: '¿Qué imprime <code>console.log("" || "Anónimo")</code>?',
      opciones: ['<code>""</code>', '<code>"Anónimo"</code>', '<code>true</code>'],
      correcta: 1,
      explicacion: '<code>||</code> devuelve el primer valor truthy que encuentra. <code>""</code> es falsy, así que devuelve <code>"Anónimo"</code>. Es el truco clásico para poner un valor por defecto.',
    },
    {
      pregunta: '¿Qué devuelve una función que no tiene <code>return</code>?',
      opciones: ['<code>null</code>', '<code>undefined</code>', '<code>0</code>'],
      correcta: 1,
      explicacion: 'Sin <code>return</code>, una función devuelve <code>undefined</code>. Por eso la consola muestra <code>undefined</code> después de un <code>console.log</code>.',
    },
  ],
};

export const booleanosOrden = {
  id: 'booleanos-orden',
  titulo: '¿Qué valor sale?',
  codigo: `let sinValor;
console.log("sinValor:", sinValor);
console.log('Boolean(""):', Boolean(""));
console.log('Boolean("false"):', Boolean("false"));
console.log("!!0:", !!0);
console.log("null || 'vacío':", null || "vacío");`,
  salida: ['sinValor: undefined', 'Boolean(""): false', 'Boolean("false"): true', '!!0: false', "null || 'vacío': vacío"],
  inicio: [3, 0, 4, 2, 1],
  explicacion:
    'Una variable sin asignar vale <code>undefined</code>. <code>Boolean(x)</code> y <code>!!x</code> convierten a booleano: <code>""</code> y <code>0</code> son falsy, <code>"false"</code> es truthy. Y <code>null || "vacío"</code> devuelve el primer valor truthy.',
};

export const booleanosDetective = {
  id: 'booleanos-detective',
  titulo: 'La calle que no estaba',
  codigo: `const usuario = { nombre: "Ana" };
console.log(usuario.nombre);
console.log(usuario.direccion.calle);`,
  error: `Ana
perfil.js:3
console.log(usuario.direccion.calle);
                              ^

TypeError: Cannot read properties of undefined (reading 'calle')`,
  culpable: 3,
  hallazgo:
    '<code>usuario</code> no tiene la propiedad <code>direccion</code>, así que <code>usuario.direccion</code> vale <code>undefined</code>. Pedirle <code>.calle</code> a <code>undefined</code> lanza <code>TypeError</code>.',
  pista: 'El mensaje dice <em>reading \'calle\'</em> de algo que es <code>undefined</code>. ¿Qué parte de esa línea no existe?',
  arreglos: [
    {
      texto: 'Comprobar que <code>usuario</code> sea un objeto',
      correcta: false,
      porque: '<code>usuario</code> está bien: es un objeto. Lo que no existe es <code>usuario.direccion</code>.',
    },
    {
      texto: 'Comprobar antes: <code>if (usuario.direccion) { console.log(usuario.direccion.calle); }</code>',
      correcta: true,
      porque: 'Como <code>undefined</code> es falsy, el <code>if</code> no entra y no se rompe. En Operadores vas a ver el atajo: <code>usuario.direccion?.calle</code>.',
    },
    {
      texto: 'Agregar <code>usuario.direccion = null;</code> antes',
      correcta: false,
      porque: 'Pedirle una propiedad a <code>null</code> también lanza <code>TypeError</code>: el error es el mismo.',
    },
  ],
};

export const booleanosLab = {
  id: 'booleanos-lab',
  titulo: 'Un nombre por defecto',
  inicial: `const entrada = "   "; // lo que escribió la persona

// Si no escribió nada (o solo espacios), usa "Anónimo"
const nombre = entrada;

console.log(\`Hola, \${nombre}\`);
`,
  verificaciones: [
    { texto: 'Imprime <code>Hola, Anónimo</code>', prueba: 'return __salida.some((l) => l === "Hola, Anónimo");' },
    { texto: 'Quita los espacios con <code>trim()</code>', prueba: String.raw`return /\.trim\s*\(\s*\)/.test(__codigo);` },
    { texto: 'Usa <code>||</code> para el valor por defecto', prueba: String.raw`return /\|\|/.test(__codigo);` },
    { texto: 'No escribe <code>Hola, Anónimo</code> a mano', prueba: 'return !/Hola, Anónimo/.test(__codigo);' },
  ],
  pistas: [
    '<code>"   "</code> tiene tres espacios, así que no es un texto vacío: es truthy. Primero hay que quitarle los espacios.',
    '<code>entrada.trim()</code> da <code>""</code>, que sí es falsy.',
    'Combínalo con <code>||</code>: <code>const nombre = entrada.trim() || "Anónimo";</code>',
  ] as [string, string, string],
  solucion: `const entrada = "   "; // lo que escribió la persona

const nombre = entrada.trim() || "Anónimo";

console.log(\`Hola, \${nombre}\`);`,
  explicacion:
    '<p><code>||</code> devuelve el primer valor truthy de la izquierda o, si no hay, el de la derecha. Si la persona escribe "Luis", <code>"Luis".trim()</code> es truthy y se usa su nombre. Si deja el campo en blanco o con espacios, queda <code>""</code>, que es falsy, y se usa <code>"Anónimo"</code>.</p>',
};

/* ── 1.7 Symbols ───────────────────────────────────────────── */
export const symbolsAuto = {
  id: 'symbols-auto',
  titulo: 'Valores únicos',
  preguntas: [
    {
      pregunta: '¿Qué da <code>Symbol("a") === Symbol("a")</code>?',
      opciones: ['<code>true</code>', '<code>false</code>'],
      correcta: 1,
      explicacion: 'Cada llamada a <code>Symbol()</code> crea un valor único. La descripción no influye en la igualdad.',
    },
    {
      pregunta: '¿Y <code>Symbol.for("a") === Symbol.for("a")</code>?',
      opciones: ['<code>true</code>', '<code>false</code>'],
      correcta: 0,
      explicacion: '<code>Symbol.for</code> usa un <b>registro global</b>: la primera vez crea el símbolo y las siguientes devuelve el mismo.',
    },
    {
      pregunta: '¿Qué imprime <code>JSON.stringify({ a: 1, [Symbol("b")]: 2 })</code>?',
      opciones: ['<code>{"a":1,"b":2}</code>', '<code>{"a":1}</code>', 'Un error'],
      correcta: 1,
      explicacion: 'JSON ignora las claves símbolo, igual que <code>Object.keys</code> y los bucles normales.',
    },
    {
      pregunta: '¿Para qué sirve un símbolo?',
      opciones: [
        'Para guardar textos largos',
        'Para crear claves de propiedad que no chocan con otras y quedan fuera de los recorridos normales',
        'Para encriptar datos',
      ],
      correcta: 1,
      explicacion: 'Los símbolos no esconden nada de forma segura: cualquiera con el símbolo, o con <code>Object.getOwnPropertySymbols</code>, puede leer la propiedad. Sirven para evitar choques de nombres.',
    },
  ],
};

export const symbolsOrden = {
  id: 'symbols-orden',
  titulo: 'Una propiedad con clave símbolo',
  codigo: `const s = Symbol("color");
const obj = { forma: "círculo", [s]: "rojo" };

console.log(typeof s);
console.log(s.description);
console.log(obj[s]);
console.log(JSON.stringify(obj));
console.log(Object.keys(obj).length);`,
  salida: ['symbol', 'color', 'rojo', '{"forma":"círculo"}', '1'],
  inicio: [2, 4, 0, 3, 1],
  explicacion:
    '<code>typeof</code> de un símbolo es <code>"symbol"</code>, y <code>description</code> devuelve su descripción. Con el símbolo lees la propiedad, pero <code>JSON.stringify</code> y <code>Object.keys</code> no la ven: solo cuentan <code>forma</code>.',
};

export const symbolsDetective = {
  id: 'symbols-detective',
  titulo: 'Un símbolo con new',
  codigo: `const nombre = "Ana";
const id = new Symbol("id");
console.log(nombre, id);`,
  error: `usuario.js:2
const id = new Symbol("id");
           ^

TypeError: Symbol is not a constructor`,
  culpable: 2,
  hallazgo:
    '<code>Symbol</code> se llama como una función normal, <b>sin <code>new</code></b>. JavaScript lo prohíbe a propósito, para que nadie cree por error un objeto envoltorio en lugar de un símbolo.',
  pista: 'El mensaje dice <em>Symbol is not a constructor</em>. ¿Qué línea usa <code>new</code>?',
  arreglos: [
    {
      texto: 'Quitar la descripción: <code>new Symbol()</code>',
      correcta: false,
      porque: 'El problema no es la descripción sino el <code>new</code>: sin argumento da el mismo error.',
    },
    {
      texto: 'Usar <code>Symbol.new("id")</code>',
      correcta: false,
      porque: 'Ese método no existe. Daría <code>TypeError: Symbol.new is not a function</code>.',
    },
    {
      texto: 'Quitar el <code>new</code>: <code>const id = Symbol("id");</code>',
      correcta: true,
      porque: 'Así se crea un símbolo. Se imprime <code>Ana Symbol(id)</code>.',
    },
  ],
};

export const symbolsLab = {
  id: 'symbols-lab',
  titulo: 'Una marca que no pisa nada',
  inicial: `const usuario = { id: 7, nombre: "Ana" };

// Agrega tu propia marca "interno-42" SIN pisar la propiedad id
usuario.id = "interno-42";

console.log(usuario.id);
console.log(Object.keys(usuario).length);
`,
  verificaciones: [
    { texto: 'Imprime <code>7</code>, después <code>interno-42</code> y después <code>2</code>', prueba: 'return __salida.join("|") === "7|interno-42|2";' },
    { texto: '<code>usuario.id</code> sigue valiendo <code>7</code>', prueba: 'return usuario.id === 7;' },
    { texto: 'La marca usa un <code>Symbol</code> como clave', prueba: String.raw`return /Symbol\s*\(/.test(__codigo) && Object.getOwnPropertySymbols(usuario).length === 1;` },
  ],
  pistas: [
    'El problema es la línea 4: escribe en la misma clave <code>id</code> y pisa el 7.',
    'Crea un símbolo propio, por ejemplo <code>const marca = Symbol("marca");</code>, y úsalo como clave: <code>usuario[marca] = "interno-42";</code>',
    'Imprime <code>usuario.id</code>, después <code>usuario[marca]</code> y por último <code>Object.keys(usuario).length</code>.',
  ] as [string, string, string],
  solucion: `const usuario = { id: 7, nombre: "Ana" };

const marca = Symbol("marca");
usuario[marca] = "interno-42";

console.log(usuario.id);
console.log(usuario[marca]);
console.log(Object.keys(usuario).length);`,
  explicacion:
    '<p>Con un símbolo como clave, tu marca convive con la propiedad <code>id</code> sin pisarla, y no aparece en <code>Object.keys</code>: el objeto sigue teniendo 2 claves de texto. Es justo lo que hacen las librerías para guardar datos propios en objetos que no son suyos.</p>',
};

/* ── 1.8 Conversión de tipos ──────────────────────────────── */
export const conversionAuto = {
  id: 'conversion-auto',
  titulo: 'Cuando el motor convierte solo',
  preguntas: [
    {
      pregunta: '¿Qué da <code>"3" * "4"</code>?',
      opciones: ['<code>"34"</code>', '<code>12</code>', '<code>NaN</code>'],
      correcta: 1,
      explicacion: '<code>*</code> solo trabaja con números, así que convierte los dos textos y multiplica. Solo <code>+</code> concatena textos.',
    },
    {
      pregunta: '¿Qué da <code>"0" == 0</code>? ¿Y <code>"0" === 0</code>?',
      opciones: ['<code>true</code> y <code>true</code>', '<code>true</code> y <code>false</code>', '<code>false</code> y <code>false</code>'],
      correcta: 1,
      explicacion: '<code>==</code> convierte antes de comparar, y <code>===</code> no: si los tipos son distintos, da <code>false</code>. Por eso se recomienda usar siempre <code>===</code>.',
    },
    {
      pregunta: '¿Qué da <code>Number("12px")</code>? ¿Y <code>parseInt("12px")</code>?',
      opciones: ['<code>12</code> y <code>12</code>', '<code>NaN</code> y <code>12</code>', '<code>NaN</code> y <code>NaN</code>'],
      correcta: 1,
      explicacion: '<code>Number</code> exige que todo el texto sea un número. <code>parseInt</code> lee desde el principio y se detiene en el primer carácter que no es un dígito.',
    },
    {
      pregunta: '¿Qué da <code>Number("")</code>?',
      opciones: ['<code>NaN</code>', '<code>0</code>', '<code>undefined</code>'],
      correcta: 1,
      explicacion: 'Un texto vacío (o solo con espacios) se convierte en <code>0</code>, no en <code>NaN</code>. Valida que un campo no esté vacío antes de convertirlo.',
    },
  ],
};

export const conversionOrden = {
  id: 'conversion-orden',
  titulo: 'Conversiones implícitas y explícitas',
  codigo: `console.log("1" + 1);
console.log("3" - 1);
console.log(+"42");
console.log(parseInt("15px"));
console.log(String(true) + "!");`,
  salida: ['11', '2', '42', '15', 'true!'],
  inicio: [4, 2, 0, 3, 1],
  explicacion:
    '<code>"1" + 1</code> concatena y da <code>"11"</code>. <code>"3" - 1</code> convierte y resta. El <code>+</code> delante de un texto (<em>+ unario</em>) lo convierte a número. <code>parseInt</code> lee hasta donde hay dígitos, y <code>String(true)</code> da el texto <code>"true"</code>.',
};

export const conversionDetective = {
  id: 'conversion-detective',
  titulo: 'Un precio que llegó como texto',
  codigo: `const precioTexto = "19.5"; // llegó de un formulario
const precio = precioTexto.toFixed(2);
console.log(\`Precio: \${precio} €\`);`,
  error: `tienda.js:2
const precio = precioTexto.toFixed(2);
                           ^

TypeError: precioTexto.toFixed is not a function`,
  culpable: 2,
  hallazgo:
    '<code>toFixed</code> es un método de los <b>números</b>, y <code>precioTexto</code> es un <b>texto</b>. Los strings no tienen ese método, así que vale <code>undefined</code> y no se puede llamar.',
  pista: 'El error dice que <code>toFixed</code> <em>is not a function</em> sobre <code>precioTexto</code>. ¿De qué tipo es ese valor?',
  arreglos: [
    {
      texto: 'Usar <code>parseInt(precioTexto).toFixed(2)</code>',
      correcta: false,
      porque: 'Ya no da error, pero <code>parseInt</code> corta los decimales: imprime <code>Precio: 19.00 €</code>.',
    },
    {
      texto: 'Convertir con <code>Number(precioTexto).toFixed(2)</code>',
      correcta: true,
      porque: 'Ahora es un número con sus decimales, y se imprime <code>Precio: 19.50 €</code>.',
    },
    {
      texto: 'Usar <code>String(precioTexto).toFixed(2)</code>',
      correcta: false,
      porque: 'Ya era un texto: convertirlo a texto no cambia nada y el error sigue igual.',
    },
  ],
};

export const conversionLab = {
  id: 'conversion-lab',
  titulo: 'Suma lo que llega del formulario',
  inicial: `const a = "10"; // vienen de dos campos de un formulario
const b = "5";

console.log(a + b); // debería sumar
`,
  verificaciones: [
    { texto: 'Imprime la suma: <code>15</code>', prueba: 'return __salida.some((l) => l === "15");' },
    { texto: 'Convierte los textos explícitamente (con <code>Number</code>, <code>parseFloat</code> o <code>+</code> unario)', prueba: String.raw`return /Number\s*\(|parseFloat\s*\(|parseInt\s*\(|[(,]\s*\+\s*[ab]\b/.test(__codigo);` },
    { texto: 'No escribe el resultado a mano', prueba: String.raw`return !/\b15\b/.test(__codigo.replace(/\/\/.*$/gm, ""));` },
  ],
  pistas: [
    'Ejecuta el código tal cual: imprime <code>105</code>, porque los dos valores son textos y <code>+</code> los pega.',
    'Convierte cada valor a número antes de sumar.',
    'Por ejemplo: <code>console.log(Number(a) + Number(b));</code>',
  ] as [string, string, string],
  solucion: `const a = "10"; // vienen de dos campos de un formulario
const b = "5";

console.log(Number(a) + Number(b));`,
  explicacion:
    '<p>Todo lo que llega de un formulario, de la URL o de un archivo de texto es un <b>string</b>, aunque parezca un número. Conviértelo con <code>Number()</code> en cuanto lo recibas, y comprueba con <code>Number.isNaN</code> que la conversión haya funcionado.</p>',
};

/* ── 1.9 Operadores ────────────────────────────────────────── */
export const operadoresAuto = {
  id: 'operadores-auto',
  titulo: 'Operadores modernos',
  preguntas: [
    {
      pregunta: '¿Qué da <code>0 ?? 5</code>?',
      opciones: ['<code>0</code>', '<code>5</code>'],
      correcta: 0,
      explicacion: '<code>??</code> solo reemplaza <code>null</code> y <code>undefined</code>. El <code>0</code> se queda. Con <code>||</code> habría dado <code>5</code>.',
    },
    {
      pregunta: 'Si <code>usuario</code> vale <code>undefined</code>, ¿qué da <code>usuario?.direccion?.calle</code>?',
      opciones: ['<code>TypeError</code>', '<code>undefined</code>', '<code>""</code>'],
      correcta: 1,
      explicacion: 'El encadenamiento opcional se detiene en el primer <code>null</code> o <code>undefined</code> y devuelve <code>undefined</code>, sin lanzar errores.',
    },
    {
      pregunta: '¿Qué hace <code>nombre ||= "Anónimo"</code>?',
      opciones: [
        'Siempre asigna <code>"Anónimo"</code>',
        'Asigna <code>"Anónimo"</code> solo si <code>nombre</code> es falsy',
        'Compara <code>nombre</code> con <code>"Anónimo"</code>',
      ],
      correcta: 1,
      explicacion: 'Es un atajo de <code>nombre = nombre || "Anónimo"</code> (ES2021). <code>&&=</code> y <code>??=</code> funcionan igual con sus operadores.',
    },
    {
      pregunta: '<code>const edad = 16;</code> ¿Qué da <code>edad >= 18 ? "adulto" : "menor"</code>?',
      opciones: ['<code>"adulto"</code>', '<code>"menor"</code>', '<code>false</code>'],
      correcta: 1,
      explicacion: 'El operador ternario <code>condición ? siVerdadero : siFalso</code> elige uno de los dos valores. La condición es falsa, así que da <code>"menor"</code>.',
    },
  ],
};

export const operadoresOrden = {
  id: 'operadores-orden',
  titulo: 'Lógicos, ternario y ??',
  codigo: `const a = 5;
console.log(a > 3 && "grande");
console.log(a > 9 || "no tan grande");
console.log(a % 2 === 0 ? "par" : "impar");
console.log(null ?? "por defecto");
console.log(typeof (a + ""));`,
  salida: ['grande', 'no tan grande', 'impar', 'por defecto', 'string'],
  inicio: [2, 4, 0, 3, 1],
  explicacion:
    '<code>&&</code> devuelve el último valor si todos son truthy. <code>||</code> devuelve el primer truthy. El ternario elige <code>"impar"</code> porque 5 % 2 es 1. <code>??</code> reemplaza el <code>null</code>. Y <code>a + ""</code> convierte el número a texto.',
};

export const operadoresDetective = {
  id: 'operadores-detective',
  titulo: 'Un método que no siempre está',
  codigo: `const usuario = { nombre: "Ana" };
console.log(usuario.nombre);
usuario.saludar();
console.log("fin");`,
  error: `Ana
app.js:3
usuario.saludar();
        ^

TypeError: usuario.saludar is not a function`,
  culpable: 3,
  hallazgo:
    '<code>usuario</code> no tiene un método <code>saludar</code>, así que vale <code>undefined</code>, y llamarlo con <code>()</code> lanza <code>TypeError</code>.',
  pista: 'El error indica la línea 3: <em>saludar is not a function</em>.',
  arreglos: [
    {
      texto: 'Usar <code>usuario?.saludar();</code>',
      correcta: false,
      porque: 'El <code>?.</code> está en el lugar equivocado: comprueba si <code>usuario</code> existe, y sí existe. Lo que falta es <code>saludar</code>, así que el error sigue.',
    },
    {
      texto: 'Usar <code>usuario.saludar?.();</code>',
      correcta: true,
      porque: '<code>?.()</code> llama al método solo si existe. Como no existe, la línea no hace nada y el programa sigue hasta imprimir <code>fin</code>.',
    },
    {
      texto: 'Usar <code>usuario.saludar ?? ();</code>',
      correcta: false,
      porque: 'Eso no es JavaScript válido: es un error de sintaxis.',
    },
  ],
};

export const operadoresLab = {
  id: 'operadores-lab',
  titulo: 'Valores por defecto bien hechos',
  inicial: `const ajustes = { volumen: 0, tema: null };

// El volumen 0 es válido: no debe cambiarse
const volumen = ajustes.volumen || 50;
const tema = ajustes.tema || "oscuro";
const idioma = ajustes.preferencias.idioma || "es";

console.log(volumen, tema, idioma);
`,
  verificaciones: [
    { texto: 'Imprime <code>0 oscuro es</code>', prueba: 'return __salida.some((l) => l === "0 oscuro es");' },
    { texto: 'Usa <code>??</code> para los valores por defecto', prueba: String.raw`return /\?\?/.test(__codigo);` },
    { texto: 'Usa <code>?.</code> para leer <code>preferencias</code>, que no existe', prueba: String.raw`return /preferencias\s*\?\./.test(__codigo);` },
    { texto: 'Ya no usa <code>||</code>', prueba: String.raw`return !/\|\|/.test(__codigo);` },
  ],
  pistas: [
    'Hay dos problemas: <code>||</code> cambia el volumen 0 por 50, y <code>ajustes.preferencias</code> no existe, así que leer <code>.idioma</code> lanza un error.',
    'Cambia cada <code>||</code> por <code>??</code>, que solo reemplaza <code>null</code> y <code>undefined</code>.',
    'Para el idioma: <code>ajustes.preferencias?.idioma ?? "es"</code>.',
  ] as [string, string, string],
  solucion: `const ajustes = { volumen: 0, tema: null };

const volumen = ajustes.volumen ?? 50;
const tema = ajustes.tema ?? "oscuro";
const idioma = ajustes.preferencias?.idioma ?? "es";

console.log(volumen, tema, idioma);`,
  explicacion:
    '<p><code>??</code> respeta el <code>0</code> pero reemplaza el <code>null</code> del tema. <code>?.</code> evita el error al leer dentro de algo que no existe: <code>ajustes.preferencias?.idioma</code> da <code>undefined</code>, y el <code>?? "es"</code> pone el valor por defecto. Juntos, son la forma moderna de leer datos que pueden faltar.</p>',
};
