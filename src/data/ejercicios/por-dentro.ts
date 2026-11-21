// Ejercicios de la sección 4: «Cómo se ejecuta JS por dentro» (salvo la pila de llamadas, en su propio archivo).

/* ── 4.1 Motor y runtime ───────────────────────────────────── */
export const motorAuto = {
  id: 'motor-auto',
  titulo: 'Motor, runtime y un solo hilo',
  preguntas: [
    {
      pregunta: '¿Qué hace el <b>motor</b> de JavaScript?',
      opciones: ['Dibuja la página', 'Lee tu código, lo traduce y lo ejecuta', 'Guarda los archivos en el disco'],
      correcta: 1,
      explicacion: 'El motor (V8, SpiderMonkey, JavaScriptCore) entiende el lenguaje: analiza el código, lo convierte en algo ejecutable y lo ejecuta.',
    },
    {
      pregunta: '<code>setTimeout</code>, <code>fetch</code> y <code>document</code>, ¿son parte del lenguaje?',
      opciones: ['Sí, los define ECMAScript', 'No: los pone el runtime (el navegador o Node.js)', 'Solo <code>setTimeout</code>'],
      correcta: 1,
      explicacion: 'ECMAScript define el lenguaje: variables, funciones, objetos, <code>Math</code>, <code>JSON</code>… Las herramientas para hablar con el mundo exterior las aporta cada runtime.',
    },
    {
      pregunta: '¿Qué es <em>JIT</em> (<em>just-in-time</em>)?',
      opciones: [
        'Un framework de JavaScript',
        'Compilar a código máquina, mientras el programa corre, las partes que más se usan',
        'Un tipo de error',
      ],
      correcta: 1,
      explicacion: 'El motor empieza interpretando y, cuando detecta código "caliente" que se repite mucho, lo compila a código máquina optimizado. Por eso JavaScript moderno es rápido.',
    },
    {
      pregunta: 'Si tu JavaScript corre en un solo hilo, ¿cómo puede el navegador descargar un archivo mientras tu código sigue?',
      opciones: [
        'No puede: todo se congela',
        'La descarga la hace el runtime por su cuenta; tu código solo recibe el resultado cuando está listo',
        'JavaScript abre un hilo nuevo automáticamente',
      ],
      correcta: 1,
      explicacion: 'El runtime trabaja en paralelo (red, temporizadores, disco) y avisa a tu código a través del <b>event loop</b>, que verás en la sección de Asincronía.',
    },
  ],
};

export const motorOrden = {
  id: 'motor-orden',
  titulo: '¿Qué hay en este runtime?',
  codigo: `console.log("globalThis:", typeof globalThis);
console.log("Math:", typeof Math.max);
console.log("JSON:", typeof JSON.parse);
console.log("document:", typeof document);`,
  salida: ['globalThis: object', 'Math: function', 'JSON: function', 'document: undefined'],
  inicio: [3, 1, 0, 2],
  explicacion:
    '<code>globalThis</code>, <code>Math</code> y <code>JSON</code> son del lenguaje y existen en cualquier runtime. <code>document</code> es del navegador: este código corre en un <em>worker</em>, un hilo aparte que no tiene página, así que no existe.',
};

export const motorDetective = {
  id: 'motor-detective',
  titulo: 'Código del navegador en Node',
  codigo: `console.log("Iniciando...");
const titulo = document.querySelector("h1");
console.log(titulo.textContent);`,
  error: `Iniciando...
app.js:2
const titulo = document.querySelector("h1");
               ^

ReferenceError: document is not defined`,
  culpable: 2,
  hallazgo:
    '<code>document</code> no es parte de JavaScript: lo aporta el <b>navegador</b>. Este archivo se ejecutó con <code>node app.js</code>, y Node.js no tiene página ni DOM.',
  pista: '<em>document is not defined</em>: ¿quién debería haber definido <code>document</code>?',
  arreglos: [
    {
      texto: 'Declarar <code>const document = {};</code> al principio',
      correcta: false,
      porque: 'Quita el <code>ReferenceError</code>, pero <code>querySelector</code> no existe en un objeto vacío: aparece un <code>TypeError</code>. El problema es el runtime.',
    },
    {
      texto: 'Ejecutar este código en el navegador, desde un <code>&lt;script&gt;</code> en una página',
      correcta: true,
      porque: 'En el navegador existen <code>document</code> y el <code>&lt;h1&gt;</code>. Cada runtime tiene sus herramientas: el código que usa el DOM es código de navegador.',
    },
    {
      texto: 'Cambiar <code>const</code> por <code>var</code>',
      correcta: false,
      porque: 'La forma de declarar <code>titulo</code> no tiene nada que ver: lo que falta es <code>document</code>.',
    },
  ],
};

/* ── 4.3 Contextos de ejecución y hoisting ────────────────── */
export const hoistingAuto = {
  id: 'hoisting-auto',
  titulo: 'Qué se eleva y cómo',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>console.log(x);</code><br><code>var x = 5;</code>',
      opciones: ['5', '<code>undefined</code>', '<code>ReferenceError</code>'],
      correcta: 1,
      explicacion: '<code>var x</code> se registra en la fase de creación con <code>undefined</code>; la asignación ocurre después.',
    },
    {
      pregunta: '¿Y con <code>let</code>?<br><code>console.log(y);</code><br><code>let y = 5;</code>',
      opciones: ['5', '<code>undefined</code>', '<code>ReferenceError: Cannot access \'y\' before initialization</code>'],
      correcta: 2,
      explicacion: '<code>let</code> y <code>const</code> también se registran, pero sin inicializar. Usarlas antes de su línea es un error: es la <b>zona muerta temporal</b>.',
    },
    {
      pregunta: '¿Se puede llamar a una función antes de la línea donde está declarada con <code>function nombre() { … }</code>?',
      opciones: ['Sí, las declaraciones de función se elevan completas', 'No, da <code>ReferenceError</code>', 'Solo si no tiene parámetros'],
      correcta: 0,
      explicacion: 'Las <b>declaraciones</b> de función se elevan con su cuerpo. Ojo: una función guardada en una constante (<code>const f = function () {}</code>) sigue las reglas de <code>const</code>.',
    },
    {
      pregunta: '¿Cuándo crea el motor un nuevo contexto de ejecución?',
      opciones: ['Una sola vez, al empezar', 'Al empezar el programa (global) y cada vez que se llama a una función', 'En cada línea'],
      correcta: 1,
      explicacion: 'Hay un contexto global y uno nuevo por cada llamada a función. Esos contextos son los que se apilan en la pila de llamadas.',
    },
  ],
};

export const hoistingOrden = {
  id: 'hoisting-orden',
  titulo: 'Antes y después de declarar',
  codigo: `console.log(tipo);
console.log(doble(4));

var tipo = "var";

function doble(n) {
  return n * 2;
}

console.log(tipo);`,
  salida: ['undefined', '8', 'var'],
  inicio: [2, 0, 1],
  explicacion:
    'En la línea 1, <code>tipo</code> ya existe pero vale <code>undefined</code>. <code>doble</code> funciona antes de su línea porque las declaraciones de función se elevan completas. Al final, <code>tipo</code> ya fue asignada.',
};

export const hoistingDetective = {
  id: 'hoisting-detective',
  titulo: 'Una constante usada antes de tiempo',
  codigo: `console.log("Precio final:", calcularTotal());

const IVA = 0.21;

function calcularTotal() {
  return 100 * (1 + IVA);
}`,
  error: `tienda.js:6
  return 100 * (1 + IVA);
                    ^

ReferenceError: Cannot access 'IVA' before initialization`,
  culpable: 1,
  hallazgo:
    'La función se puede llamar en la línea 1 gracias al hoisting, pero dentro usa <code>IVA</code>, que todavía está en la <b>zona muerta temporal</b>: su línea, la 3, aún no se ejecutó. El error salta en la línea 6, pero la causa es llamar demasiado pronto, en la línea 1.',
  pista: 'El error salta dentro de la función, pero ¿desde dónde y cuándo se llamó? ¿Ya se había ejecutado la línea 3?',
  arreglos: [
    {
      texto: 'Cambiar <code>const IVA</code> por <code>var IVA</code>',
      correcta: false,
      porque: 'Ya no lanza error, pero <code>IVA</code> vale <code>undefined</code> y el total sale <code>NaN</code>. Peor: el error queda escondido.',
    },
    {
      texto: 'Mover el <code>console.log</code> de la línea 1 al final del archivo',
      correcta: true,
      porque: 'Así <code>IVA</code> ya está inicializada cuando se llama a la función. Regla práctica: declara arriba, usa abajo.',
    },
    {
      texto: 'Mover <code>IVA</code> dentro de la función, después del <code>return</code>',
      correcta: false,
      porque: 'Dentro de la función sigue en la zona muerta en el momento del <code>return</code>: mismo error.',
    },
  ],
};

export const hoistingLab = {
  id: 'hoisting-lab',
  titulo: 'Declara antes de usar',
  inicial: `console.log(\`\${saludo}, \${usuario}\`);

const saludo = "Hola";
let usuario = "Ana";
`,
  verificaciones: [
    { texto: 'Imprime <code>Hola, Ana</code>', prueba: 'return __salida.some((l) => l === "Hola, Ana");' },
    { texto: 'Sigue usando <code>const</code> y <code>let</code> (sin <code>var</code>)', prueba: String.raw`return /\bconst\s+saludo\b/.test(__codigo) && /\blet\s+usuario\b/.test(__codigo) && !/\bvar\b/.test(__codigo);` },
    { texto: 'Las declaraciones van antes del <code>console.log</code>', prueba: 'return __codigo.indexOf("console.log") > __codigo.indexOf("usuario =");' },
  ],
  pistas: [
    'Ejecuta el código: el error dice que <code>saludo</code> se usa antes de inicializarse.',
    'No cambies <code>const</code> por <code>var</code>: eso escondería el problema. Cambia el <b>orden</b>.',
    'Pon las dos declaraciones arriba y el <code>console.log</code> al final.',
  ] as [string, string, string],
  solucion: `const saludo = "Hola";
let usuario = "Ana";

console.log(\`\${saludo}, \${usuario}\`);`,
  explicacion:
    '<p>El hoisting de <code>let</code> y <code>const</code> no te deja usar una variable antes de su línea, y eso es bueno: el error te avisa en lugar de darte un <code>undefined</code> silencioso. La costumbre que evita todo esto: declara primero, usa después.</p>',
};

/* ── 4.4 Scope y cadena de scopes ─────────────────────────── */
export const scopeAuto = {
  id: 'scope-auto',
  titulo: 'Quién ve a quién',
  preguntas: [
    {
      pregunta: 'Una función escrita dentro de otra, ¿puede usar las variables de la de afuera?',
      opciones: ['Sí: la búsqueda sube hacia los scopes exteriores', 'No, cada función solo ve lo suyo', 'Solo si son <code>var</code>'],
      correcta: 0,
      explicacion: 'Desde adentro se ve hacia afuera. Al revés no: la función de afuera no puede ver las variables de la de adentro.',
    },
    {
      pregunta: 'Si un scope interior declara una variable con el mismo nombre que una exterior, dentro de ese scope…',
      opciones: ['Da error', 'Se usa la interior, que <b>tapa</b> a la exterior', 'Se usa la exterior'],
      correcta: 1,
      explicacion: 'Se llama <em>shadowing</em> (sombreado): la búsqueda se detiene en la primera que encuentra, que es la más cercana.',
    },
    {
      pregunta: 'El scope de una función, ¿depende de <b>dónde se escribió</b> o de <b>desde dónde se la llama</b>?',
      opciones: ['De dónde se escribió', 'De desde dónde se la llama'],
      correcta: 0,
      explicacion: 'JavaScript usa <b>scope léxico</b>: lo que una función puede ver se decide por su posición en el código, no por quién la llama.',
    },
    {
      pregunta: '¿Qué scopes crean <code>let</code> y <code>const</code> además del de las funciones?',
      opciones: ['Ninguno', 'Uno por cada bloque <code>{ }</code>: <code>if</code>, <code>for</code>…', 'Uno por cada línea'],
      correcta: 1,
      explicacion: '<code>let</code> y <code>const</code> tienen <b>alcance de bloque</b>. <code>var</code> solo respeta el scope de las funciones.',
    },
  ],
};

export const scopeOrden = {
  id: 'scope-orden',
  titulo: 'Scope léxico',
  codigo: `const x = "global";

function a() {
  const x = "de a";
  b();
  console.log("a ve:", x);
}

function b() {
  console.log("b ve:", x);
}

a();
console.log("afuera:", x);`,
  salida: ['b ve: global', 'a ve: de a', 'afuera: global'],
  inicio: [1, 2, 0],
  explicacion:
    '<code>b</code> se llama desde dentro de <code>a</code>, pero está <b>escrita</b> en el nivel global: cuando busca <code>x</code>, sube hacia el global y encuentra <code>"global"</code>. La <code>x</code> de <code>a</code> solo la ve <code>a</code>. Eso es el scope léxico.',
};

export const scopeDetective = {
  id: 'scope-detective',
  titulo: 'Un resultado que no sale de la función',
  codigo: `function calcular() {
  const resultado = 6 * 7;
}

calcular();
console.log(resultado);`,
  error: `calculo.js:6
console.log(resultado);
            ^

ReferenceError: resultado is not defined`,
  culpable: 6,
  hallazgo:
    '<code>resultado</code> vive en el scope de <code>calcular</code>. Al terminar la función, ese scope desaparece, y desde el global nunca se pudo ver: la búsqueda solo va de adentro hacia afuera.',
  pista: '<em>resultado is not defined</em>: ¿en qué scope se declaró, y desde cuál se intenta leer?',
  arreglos: [
    {
      texto: 'Quitar el <code>const</code> de la línea 2: <code>resultado = 6 * 7;</code>',
      correcta: false,
      porque: 'Fuera del modo estricto eso crea una variable global por accidente; en los módulos modernos es un <code>ReferenceError</code>. Es una mala práctica: cualquier parte del programa podría pisarla.',
    },
    {
      texto: 'Devolver el valor: <code>return 6 * 7;</code> y usarlo: <code>console.log(calcular());</code>',
      correcta: true,
      porque: 'La forma correcta de sacar un valor de una función es <code>return</code>. Imprime 42, y la función no depende de variables externas.',
    },
    {
      texto: 'Cambiar <code>const</code> por <code>var</code> en la línea 2',
      correcta: false,
      porque: '<code>var</code> respeta el scope de las funciones: <code>resultado</code> sigue siendo local a <code>calcular</code>. Mismo error.',
    },
  ],
};

export const scopeLab = {
  id: 'scope-lab',
  titulo: 'Sin tocar variables de afuera',
  inicial: `let total = 0;

function sumarPrecios(a, b) {
  total = a + b;
}

sumarPrecios(10, 5);
console.log(total);
`,
  verificaciones: [
    { texto: 'Imprime <code>15</code>', prueba: 'return __salida.some((l) => l === "15");' },
    { texto: '<code>sumarPrecios(2, 3)</code> devuelve <code>5</code>', prueba: 'return sumarPrecios(2, 3) === 5;' },
    { texto: 'La función no modifica ninguna variable de afuera', prueba: String.raw`return !/^\s*let\s+total\b/m.test(__codigo) && !/^\s*total\s*=/m.test(__codigo);` },
  ],
  pistas: [
    'La función escribe en <code>total</code>, una variable global. Haz que <b>devuelva</b> el resultado en su lugar.',
    'Cambia <code>total = a + b;</code> por <code>return a + b;</code> y borra el <code>let total = 0;</code> de arriba.',
    'Para imprimir: <code>console.log(sumarPrecios(10, 5));</code>',
  ] as [string, string, string],
  solucion: `function sumarPrecios(a, b) {
  return a + b;
}

console.log(sumarPrecios(10, 5));`,
  explicacion:
    '<p>Una función que solo usa sus parámetros y devuelve un resultado es más fácil de entender y de probar: no depende de lo que haya afuera ni lo cambia. Las variables globales que cualquiera puede modificar son una fuente clásica de errores difíciles de rastrear.</p>',
};

/* ── 4.5 Closures ──────────────────────────────────────────── */
export const closuresAuto = {
  id: 'closures-auto',
  titulo: 'Funciones con memoria',
  preguntas: [
    {
      pregunta: '¿Qué es un <b>closure</b>?',
      opciones: [
        'Una función que se cierra sola',
        'Una función junto con el entorno donde fue creada, que puede seguir usando aunque ese entorno ya haya terminado',
        'Un error de memoria',
      ],
      correcta: 1,
      explicacion: 'Toda función en JavaScript recuerda las variables del scope donde se escribió. Cuando sale de ahí, como al ser devuelta, se lleva ese entorno consigo.',
    },
    {
      pregunta: 'Llamas dos veces a <code>crearContador()</code>. ¿Los dos contadores comparten la cuenta?',
      opciones: ['Sí', 'No: cada llamada crea un entorno nuevo con su propia <code>cuenta</code>'],
      correcta: 1,
      explicacion: 'Cada ejecución de la función externa crea variables nuevas, y cada función devuelta recuerda las suyas.',
    },
    {
      pregunta: '<code>const fs = []; for (let i = 0; i < 3; i++) fs.push(() => i);</code> ¿Qué da <code>fs[0]()</code>?',
      opciones: ['0', '3', 'undefined'],
      correcta: 0,
      explicacion: 'Con <code>let</code>, cada vuelta tiene su propia <code>i</code>, y cada función recuerda la suya. Con <code>var</code> habría una sola <code>i</code> compartida y daría 3.',
    },
    {
      pregunta: '¿Para qué sirven los closures en la práctica?',
      opciones: [
        'Para nada, son una curiosidad',
        'Para datos privados, funciones configurables (fábricas) y recordar estado en callbacks y eventos',
        'Solo para contadores',
      ],
      correcta: 1,
      explicacion: 'Están en todas partes: cada vez que pasas una función que usa variables de afuera, como en un <code>addEventListener</code> o un <code>setTimeout</code>, estás usando un closure.',
    },
  ],
};

export const closuresOrden = {
  id: 'closures-orden',
  titulo: 'Una fábrica de saludos',
  codigo: `function crearSaludo(saludo) {
  return function (nombre) {
    return \`\${saludo}, \${nombre}\`;
  };
}

const hola = crearSaludo("Hola");
const buenas = crearSaludo("Buenas");

console.log(hola("Ana"));
console.log(buenas("Luis"));
console.log(hola("Eva"));`,
  salida: ['Hola, Ana', 'Buenas, Luis', 'Hola, Eva'],
  inicio: [2, 0, 1],
  explicacion:
    'Cada llamada a <code>crearSaludo</code> crea un entorno con su propio <code>saludo</code>. <code>hola</code> recuerda <code>"Hola"</code> y <code>buenas</code> recuerda <code>"Buenas"</code>, aunque <code>crearSaludo</code> ya terminó hace rato.',
};

export const closuresDetective = {
  id: 'closures-detective',
  titulo: 'Un contador que no es función',
  codigo: `function crearContador() {
  let cuenta = 0;
  function sumar() {
    cuenta++;
    return cuenta;
  }
}

const contar = crearContador();
console.log(contar());`,
  error: `contador.js:10
console.log(contar());
            ^

TypeError: contar is not a function`,
  culpable: 10,
  hallazgo:
    'El error salta en la línea 10 porque <code>contar</code> vale <code>undefined</code>. ¿Por qué? <code>crearContador</code> define <code>sumar</code> pero <b>nunca la devuelve</b>, y una función sin <code>return</code> devuelve <code>undefined</code>.',
  pista: '<em>contar is not a function</em>: ¿qué valor recibió <code>contar</code> en la línea 9? ¿Qué devuelve <code>crearContador</code>?',
  arreglos: [
    {
      texto: 'Agregar <code>return sumar();</code> al final de <code>crearContador</code>',
      correcta: false,
      porque: 'Con los paréntesis, <code>sumar</code> se <b>ejecuta</b> y devuelve el número 1. <code>contar</code> valdría 1, que tampoco es una función.',
    },
    {
      texto: 'Agregar <code>return sumar;</code> al final de <code>crearContador</code>',
      correcta: true,
      porque: 'Sin paréntesis se devuelve <b>la función</b>, que recuerda su <code>cuenta</code>. Ahora <code>contar()</code> imprime 1.',
    },
    {
      texto: 'Cambiar la línea 10 por <code>console.log(crearContador()());</code>',
      correcta: false,
      porque: '<code>crearContador()</code> sigue devolviendo <code>undefined</code>, y llamarlo con <code>()</code> da el mismo <code>TypeError</code>.',
    },
  ],
};

export const closuresLab = {
  id: 'closures-lab',
  titulo: 'Una fábrica de multiplicadores',
  inicial: `// Escribe crearMultiplicador(factor): debe devolver una función
// que reciba un número y lo multiplique por factor.

const doble = crearMultiplicador(2);
const triple = crearMultiplicador(3);

console.log(doble(5));
console.log(triple(5));
`,
  verificaciones: [
    { texto: 'Imprime <code>10</code> y después <code>15</code>', prueba: 'return __salida.join("|") === "10|15";' },
    { texto: '<code>crearMultiplicador</code> devuelve una función', prueba: 'return typeof crearMultiplicador(2) === "function";' },
    { texto: 'Funciona con cualquier factor: <code>crearMultiplicador(4)(3)</code> da <code>12</code>', prueba: 'return crearMultiplicador(4)(3) === 12;' },
  ],
  pistas: [
    'Empieza con <code>function crearMultiplicador(factor) { … }</code> arriba de todo.',
    'Dentro, devuelve otra función: <code>return function (n) { … };</code>',
    'La función interna usa el <code>factor</code> que recuerda: <code>return n * factor;</code>',
  ] as [string, string, string],
  solucion: `function crearMultiplicador(factor) {
  return function (n) {
    return n * factor;
  };
}

const doble = crearMultiplicador(2);
const triple = crearMultiplicador(3);

console.log(doble(5));
console.log(triple(5));`,
  explicacion:
    '<p>Cada llamada a <code>crearMultiplicador</code> fabrica una función nueva que recuerda su propio <code>factor</code>. Es el patrón <b>fábrica</b>: en lugar de escribir <code>doble</code>, <code>triple</code> y <code>cuadruple</code> a mano, generas las que necesites.</p>',
};

/* ── 4.6 Recursión y stack overflow ───────────────────────── */
export const recursionMotor = {
  id: 'recursion-motor',
  titulo: 'Apila las llamadas de factorial(3)',
  codigo: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(3));`,
  funciones: ['factorial(1)', 'factorial(3)', 'factorial(2)'],
  movimientos: [
    { accion: 'apilar' as const, funcion: 'factorial(3)', linea: 3 },
    { accion: 'apilar' as const, funcion: 'factorial(2)', linea: 3 },
    { accion: 'apilar' as const, funcion: 'factorial(1)', linea: 2 },
    { accion: 'desapilar' as const, linea: 3 },
    { accion: 'desapilar' as const, linea: 3 },
    { accion: 'desapilar' as const, linea: 6 },
  ],
};

export const recursionAuto = {
  id: 'recursion-auto',
  titulo: 'Funciones que se llaman a sí mismas',
  preguntas: [
    {
      pregunta: '¿Qué es el <b>caso base</b> de una función recursiva?',
      opciones: ['La primera llamada', 'La condición en la que la función devuelve un resultado sin volver a llamarse', 'El valor por defecto de los parámetros'],
      correcta: 1,
      explicacion: 'Sin un caso base alcanzable, la función se llama sin fin hasta llenar la pila.',
    },
    {
      pregunta: 'Cada llamada recursiva, ¿qué ocupa?',
      opciones: ['Nada', 'Un marco nuevo en la pila de llamadas, con sus propias variables', 'Un archivo nuevo'],
      correcta: 1,
      explicacion: 'Por eso la profundidad tiene un límite: con muchas miles de llamadas anidadas, la pila se desborda.',
    },
    {
      pregunta: '¿Qué error aparece cuando una recursión no termina?',
      opciones: ['<code>SyntaxError</code>', '<code>RangeError: Maximum call stack size exceeded</code>', '<code>ReferenceError</code>'],
      correcta: 1,
      explicacion: 'Es el <em>stack overflow</em>: la pila de llamadas superó su tamaño máximo.',
    },
    {
      pregunta: '¿Cuándo conviene la recursión en lugar de un bucle?',
      opciones: [
        'Siempre, es más rápida',
        'Con estructuras anidadas (árboles, carpetas dentro de carpetas, JSON con niveles), donde el problema se repite dentro de sí mismo',
        'Nunca',
      ],
      correcta: 1,
      explicacion: 'Para repetir algo N veces, un bucle es más simple. La recursión brilla cuando los datos tienen forma de árbol.',
    },
  ],
};

export const recursionOrden = {
  id: 'recursion-orden',
  titulo: 'Bajar y subir',
  codigo: `function contar(n) {
  if (n === 0) return;
  console.log("baja", n);
  contar(n - 1);
  console.log("sube", n);
}

contar(2);`,
  salida: ['baja 2', 'baja 1', 'sube 1', 'sube 2'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Lo que está <b>antes</b> de la llamada recursiva se ejecuta al bajar: 2, después 1. Lo que está <b>después</b> se ejecuta al subir, cuando cada llamada retoma su trabajo pendiente, en orden inverso: primero termina la más profunda.',
};

export const recursionDetective = {
  id: 'recursion-detective',
  titulo: 'Un caso base que no alcanza',
  codigo: `function sumaHasta(n) {
  if (n === 0) return 0;
  return n + sumaHasta(n - 1);
}

console.log(sumaHasta(3));
console.log(sumaHasta(-1));`,
  error: `6
suma.js:3
  return n + sumaHasta(n - 1);
             ^

RangeError: Maximum call stack size exceeded`,
  culpable: 2,
  hallazgo:
    'Con <code>-1</code>, la función va a -2, -3, -4… y nunca llega a 0. El caso base existe, pero <b>no es alcanzable</b> para los negativos. El error salta en la línea 3, pero el fallo está en la condición de la línea 2.',
  pista: '<code>sumaHasta(3)</code> funciona y <code>sumaHasta(-1)</code> no. ¿Qué número tiene que alcanzar <code>n</code> para detenerse, y lo alcanza empezando en -1?',
  arreglos: [
    {
      texto: 'Rodear la línea 7 con un <code>try/catch</code>',
      correcta: false,
      porque: 'El programa ya no se rompe, pero la función sigue sin funcionar con negativos: solo escondes el problema.',
    },
    {
      texto: 'Cambiar el caso base a <code>if (n <= 0) return 0;</code>',
      correcta: true,
      porque: 'Ahora cualquier número ≤ 0 detiene la recursión: <code>sumaHasta(-1)</code> devuelve 0.',
    },
    {
      texto: 'Cambiar la línea 3 a <code>n + sumaHasta(n + 1)</code>',
      correcta: false,
      porque: 'Arreglaría el -1, pero rompe los positivos: <code>sumaHasta(3)</code> iría a 4, 5, 6… y desbordaría la pila.',
    },
  ],
};

export const recursionLab = {
  id: 'recursion-lab',
  titulo: 'Potencias recursivas',
  inicial: `// Escribe potencia(base, exponente) SIN bucles, usando recursión.
// Pista: base^exponente = base * base^(exponente - 1), y base^0 = 1

console.log(potencia(2, 3));
`,
  verificaciones: [
    { texto: 'Imprime <code>8</code>', prueba: 'return __salida.some((l) => l === "8");' },
    { texto: '<code>potencia(2, 10)</code> da <code>1024</code> y <code>potencia(5, 0)</code> da <code>1</code>', prueba: 'return potencia(2, 10) === 1024 && potencia(5, 0) === 1;' },
    { texto: 'Es recursiva, sin <code>for</code> ni <code>while</code> ni <code>**</code>', prueba: String.raw`const cuerpo = String(potencia); return /potencia\s*\(/.test(cuerpo.slice(cuerpo.indexOf("{"))) && !/\b(for|while)\b|\*\*|Math\.pow/.test(cuerpo);` },
  ],
  pistas: [
    'Empieza por el caso base: si <code>exponente</code> es 0, el resultado es 1.',
    'Si no, el resultado es <code>base</code> multiplicado por la potencia con un exponente menos.',
    '<code>function potencia(base, exponente) { if (exponente === 0) return 1; return base * potencia(base, exponente - 1); }</code>',
  ] as [string, string, string],
  solucion: `function potencia(base, exponente) {
  if (exponente === 0) return 1;
  return base * potencia(base, exponente - 1);
}

console.log(potencia(2, 3));`,
  explicacion:
    '<p><code>potencia(2, 3)</code> apila <code>potencia(2, 2)</code>, <code>potencia(2, 1)</code> y <code>potencia(2, 0)</code>, que es el caso base y devuelve 1. Al subir: 2 * 1 = 2, 2 * 2 = 4, 2 * 4 = 8. En la práctica usarías <code>2 ** 3</code>, pero la forma recursiva es la base para recorrer estructuras anidadas.</p>',
};

/* ── 4.7 Memoria y recolector de basura ──────────────────── */
export const memoriaAuto = {
  id: 'memoria-auto',
  titulo: 'Qué se libera y cuándo',
  preguntas: [
    {
      pregunta: '¿Cuándo puede el recolector liberar un objeto?',
      opciones: ['Cuando pasan 5 minutos', 'Cuando ya no se puede llegar a él desde ninguna variable o referencia del programa', 'Cuando lo pones en <code>null</code> una vez'],
      correcta: 1,
      explicacion: 'La regla es la <b>alcanzabilidad</b>: si queda algún camino hasta el objeto, sigue vivo.',
    },
    {
      pregunta: '¿Qué diferencia a una <code>WeakMap</code> de un <code>Map</code>?',
      opciones: [
        'Es más lenta',
        'Sus claves no mantienen vivo al objeto: si nadie más lo referencia, el recolector lo libera y la entrada desaparece',
        'Solo acepta números',
      ],
      correcta: 1,
      explicacion: 'Un <code>Map</code> retiene sus claves para siempre. Una <code>WeakMap</code> es ideal para guardar datos extra sobre objetos sin impedir que se liberen.',
    },
    {
      pregunta: '¿Cuál de estos es una fuga de memoria típica?',
      opciones: ['Usar <code>const</code>', 'Un <code>Map</code> que guarda objetos y nunca se limpia', 'Una función con muchos parámetros'],
      correcta: 1,
      explicacion: 'Las fugas clásicas son las cachés que solo crecen, los <code>setInterval</code> y los listeners que nunca se quitan, y las variables globales que retienen datos.',
    },
    {
      pregunta: '¿Puedes forzar al recolector a ejecutarse desde tu código?',
      opciones: ['Sí, con <code>gc()</code>', 'No: el motor decide cuándo', 'Sí, poniendo todo en <code>null</code>'],
      correcta: 1,
      explicacion: 'El recolector es automático. Tu trabajo es no retener referencias que ya no necesitas; liberar es cosa del motor.',
    },
  ],
};

export const memoriaOrden = {
  id: 'memoria-orden',
  titulo: 'Una WeakMap por dentro',
  codigo: `const extra = new WeakMap();
const usuario = { id: 1 };

extra.set(usuario, "visto hoy");

console.log(extra.has(usuario));
console.log(extra.get(usuario));
console.log("size" in extra);
console.log(extra.get({ id: 1 }));`,
  salida: ['true', 'visto hoy', 'false', 'undefined'],
  inicio: [3, 1, 2, 0],
  explicacion:
    'La WeakMap guarda el dato asociado al objeto <code>usuario</code>. No tiene <code>size</code> ni se puede recorrer, porque sus entradas pueden desaparecer en cualquier momento. Y <code>{ id: 1 }</code> es <b>otro</b> objeto, aunque se parezca: no encuentra nada.',
};

export const memoriaDetective = {
  id: 'memoria-detective',
  titulo: 'Una clave que no puede ser débil',
  codigo: `const visitas = new WeakMap();
console.log("Registrando...");
visitas.set("ana", 3);
console.log(visitas.get("ana"));`,
  error: `Registrando...
visitas.js:3
visitas.set("ana", 3);
        ^

TypeError: Invalid value used as weak map key`,
  culpable: 3,
  hallazgo:
    'Las claves de una <code>WeakMap</code> tienen que ser <b>objetos</b> (o símbolos no registrados, desde ES2023). Un texto como <code>"ana"</code> es un primitivo que nunca "se libera", así que no tiene sentido como clave débil.',
  pista: 'El mensaje habla de un valor inválido como clave. ¿Qué tipo de valor es <code>"ana"</code>?',
  arreglos: [
    {
      texto: 'Usar un <code>Map</code> normal: <code>new Map()</code>',
      correcta: true,
      porque: 'Para claves de texto, lo correcto es un <code>Map</code> (o un objeto). <code>WeakMap</code> solo tiene sentido para asociar datos a objetos.',
    },
    {
      texto: 'Usar <code>new String("ana")</code> como clave',
      correcta: false,
      porque: 'Técnicamente es un objeto y no da error, pero cada <code>new String</code> crea uno distinto: nunca volverías a encontrar el dato.',
    },
    {
      texto: 'Cambiarlo por una <code>WeakSet</code>',
      correcta: false,
      porque: '<code>WeakSet</code> tiene la misma regla (solo objetos) y además no guarda valores asociados.',
    },
  ],
};

export const memoriaLab = {
  id: 'memoria-lab',
  titulo: 'Una caché que no retiene',
  inicial: `let calculos = 0;

function calcularPesado(obj) {
  calculos++;
  return Object.keys(obj).length * 100;
}

// Escribe medir(obj): debe devolver calcularPesado(obj),
// pero usando una WeakMap para no recalcular el mismo objeto.

const a = { x: 1, y: 2 };
console.log(medir(a));
console.log(medir(a));
console.log(calculos);
`,
  verificaciones: [
    { texto: 'Imprime <code>200</code>, <code>200</code> y <code>1</code>: el segundo <code>medir</code> no recalcula', prueba: 'return __salida.join("|") === "200|200|1";' },
    { texto: 'Usa una <code>WeakMap</code> como caché', prueba: String.raw`return /new\s+WeakMap\s*\(/.test(__codigo);` },
    { texto: 'Funciona con otros objetos: <code>medir({ k: 1 })</code> da <code>100</code>', prueba: 'return medir({ k: 1 }) === 100;' },
  ],
  pistas: [
    'Crea la caché antes de usarla: <code>const cache = new WeakMap();</code>',
    'En <code>medir</code>: si la caché no tiene el objeto (<code>cache.has(obj)</code>), calcula y guarda con <code>cache.set</code>.',
    'Al final, devuelve <code>cache.get(obj)</code>. Pon <code>medir</code> y la caché antes de las llamadas.',
  ] as [string, string, string],
  solucion: `let calculos = 0;

function calcularPesado(obj) {
  calculos++;
  return Object.keys(obj).length * 100;
}

const cache = new WeakMap();

function medir(obj) {
  if (!cache.has(obj)) {
    cache.set(obj, calcularPesado(obj));
  }
  return cache.get(obj);
}

const a = { x: 1, y: 2 };
console.log(medir(a));
console.log(medir(a));
console.log(calculos);`,
  explicacion:
    '<p>La caché evita repetir el cálculo pesado para el mismo objeto. Con un <code>Map</code> funcionaría igual, pero retendría todos los objetos medidos para siempre: una fuga. Con una <code>WeakMap</code>, cuando el objeto deja de usarse en el resto del programa, su entrada de la caché se libera sola.</p>',
};
