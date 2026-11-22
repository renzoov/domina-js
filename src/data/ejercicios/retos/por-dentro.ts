// Reto del motor de la sección 4: «Cómo se ejecuta JS por dentro».

export const retoDentroMotor = {
  id: 'reto-dentro-motor',
  titulo: 'Tres funciones, una pila',
  codigo: `function saludar(nombre) {
  return "Hola, " + formatear(nombre);
}

function formatear(texto) {
  return texto.trim().toUpperCase();
}

function iniciar() {
  const mensaje = saludar("  ana ");
  console.log(mensaje);
}

iniciar();`,
  funciones: ['formatear("  ana ")', 'iniciar()', 'saludar("  ana ")'],
  movimientos: [
    { accion: 'apilar' as const, funcion: 'iniciar()', linea: 10 },
    { accion: 'apilar' as const, funcion: 'saludar("  ana ")', linea: 2 },
    { accion: 'apilar' as const, funcion: 'formatear("  ana ")', linea: 6 },
    { accion: 'desapilar' as const, linea: 2 },
    { accion: 'desapilar' as const, linea: 10 },
    { accion: 'desapilar' as const, linea: 14 },
  ],
};

export const retoDentroAuto = {
  id: 'reto-dentro-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>function crear() { let n = 0; return () =&gt; ++n; }</code><br><code>const a = crear();</code><br><code>const b = crear();</code><br><code>a(); a();</code><br><code>console.log(a(), b());</code>',
      opciones: ['<code>3 1</code>', '<code>3 4</code>', '<code>1 1</code>'],
      correcta: 0,
      explicacion: 'Cada llamada a <code>crear</code> crea un entorno nuevo con su propia <code>n</code>. <code>a</code> ya la subió dos veces y llega a <code>3</code>; <code>b</code> tiene la suya, que empieza en <code>0</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log(typeof f, typeof g);</code><br><code>function f() {}</code><br><code>var g = function () {};</code>',
      opciones: ['<code>function function</code>', '<code>function undefined</code>', '<code>ReferenceError</code>'],
      correcta: 1,
      explicacion: 'En la fase de creación, la declaración <code>f</code> se registra completa. De <code>var g</code> solo se registra el nombre, con <code>undefined</code>: la función se le asigna recién en su línea.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>for (var i = 0; i &lt; 3; i++) {</code><br><code>&nbsp;&nbsp;setTimeout(() =&gt; console.log(i));</code><br><code>}</code>',
      opciones: ['<code>0 1 2</code>', '<code>3 3 3</code>', '<code>undefined</code> tres veces'],
      correcta: 1,
      explicacion: 'Con <code>var</code> hay <b>una sola</b> <code>i</code> para todo el bucle. Los callbacks se ejecutan después, cuando el bucle ya terminó y <code>i</code> vale <code>3</code>. Con <code>let</code>, cada vuelta tiene su propia <code>i</code> y se imprime <code>0 1 2</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>let x = 1;</code><br><code>{ let x = 2; }</code><br><code>console.log(x);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>SyntaxError</code>, porque <code>x</code> ya existe'],
      correcta: 0,
      explicacion: 'La <code>x</code> del bloque es otra variable, que tapa a la de afuera solo dentro de las llaves (sombreado). Al salir del bloque, deja de existir.',
    },
    {
      pregunta: '<code>let datos = { lista: new Array(1e6).fill(0) };</code><br><code>datos = null;</code><br>¿Qué pasa con el objeto con el array?',
      opciones: [
        'Queda en memoria hasta que cierres la pestaña',
        'Si nada más lo referencia, el recolector de basura puede liberarlo',
        'Se borra en ese mismo instante, en la línea <code>datos = null</code>',
      ],
      correcta: 1,
      explicacion: 'Al perder su única referencia, el objeto deja de ser alcanzable. El recolector lo libera cuando le toca pasar, no necesariamente en esa línea.',
    },
  ],
};

export const retoDentroDetective = {
  id: 'reto-dentro-detective',
  titulo: 'Una variable que se tapa a sí misma',
  codigo: `let total = 10;

function sumarIVA() {
  console.log(total);
  let total = total * 1.21;
  return total;
}

sumarIVA();`,
  error: `app.js:4
  console.log(total);
              ^

ReferenceError: Cannot access 'total' before initialization`,
  culpable: 5,
  hallazgo:
    'La línea 5 declara <b>otra</b> <code>total</code> con <code>let</code>, dentro de la función. Esa declaración se registra al crear el contexto de <code>sumarIVA</code> y tapa a la de afuera en toda la función, pero no se puede usar hasta su línea: la línea 4 cae en su zona muerta temporal.',
  pista: 'El error dice que <code>total</code> todavía no se inicializó. Pero la <code>total</code> de la línea 1 sí existe… ¿cuántas variables <code>total</code> hay?',
  arreglos: [
    {
      texto: 'Darle otro nombre a la de adentro: <code>const conIVA = total * 1.21;</code> y devolver <code>conIVA</code>',
      correcta: true,
      porque: 'Sin otra <code>total</code> en la función, la cadena de scopes encuentra la de afuera, que vale <code>10</code>. Y el resultado tiene un nombre que dice qué es.',
    },
    {
      texto: 'Cambiar <code>let total</code> por <code>var total</code> en la línea 5',
      correcta: false,
      porque: 'Ya no lanza el error, pero <code>var total</code> también tapa a la de afuera y vale <code>undefined</code> antes de su línea: imprime <code>undefined</code> y el cálculo da <code>NaN</code>.',
    },
    {
      texto: 'Mover el <code>console.log(total)</code> debajo de la línea 5',
      correcta: false,
      porque: 'La línea 5 sigue leyendo <code>total</code> mientras la declara: <code>let total = total * 1.21</code> también está en la zona muerta temporal.',
    },
  ],
};

export const retoDentroLab = {
  id: 'reto-dentro-lab',
  titulo: 'Fibonacci con memoria',
  inicial: `// Escribe crearFib(): devuelve una función fib(n) que calcula el n-ésimo
// número de Fibonacci (fib(0) = 0, fib(1) = 1, fib(n) = fib(n - 1) + fib(n - 2)).
// Debe ser recursiva y recordar lo que ya calculó, para que fib(70) sea instantáneo.

const fib = crearFib();
console.log(fib(10));
console.log(fib(70));
`,
  verificaciones: [
    { texto: 'Imprime <code>55</code> y después <code>190392490709135</code>', prueba: 'return __salida.join("|") === "55|190392490709135";' },
    { texto: '<code>crearFib()</code> devuelve una función', prueba: 'return typeof crearFib() === "function";' },
    { texto: 'Los casos base: <code>fib(0)</code> es <code>0</code> y <code>fib(1)</code> es <code>1</code>', prueba: 'const f = crearFib(); return f(0) === 0 && f(1) === 1;' },
    { texto: 'Recuerda lo calculado: <code>fib(90)</code> termina enseguida', prueba: 'const t = Date.now(); const r = crearFib()(90); return r === 2880067194370816000 && Date.now() - t < 200;' },
  ],
  pistas: [
    'Dentro de <code>crearFib</code>, crea un <code>Map</code> para la memoria. La función que devuelves lo recuerda gracias a un closure.',
    'En <code>fib(n)</code>: si <code>n &lt; 2</code>, devuelve <code>n</code>. Si la memoria ya tiene <code>n</code>, devuelve ese valor.',
    'Si no, calcula <code>fib(n - 1) + fib(n - 2)</code>, guárdalo con <code>memoria.set(n, valor)</code> y devuélvelo.',
  ] as [string, string, string],
  solucion: `function crearFib() {
  const memoria = new Map();
  function fib(n) {
    if (n < 2) return n;
    if (memoria.has(n)) return memoria.get(n);
    const valor = fib(n - 1) + fib(n - 2);
    memoria.set(n, valor);
    return valor;
  }
  return fib;
}

const fib = crearFib();
console.log(fib(10));
console.log(fib(70));`,
  explicacion:
    '<p>Sin memoria, <code>fib(70)</code> haría más de cien billones de llamadas que repiten las mismas cuentas. Con la memoria, cada <code>n</code> se calcula una sola vez, y la pila nunca pasa de unas 70 llamadas de profundidad. El <code>Map</code> vive en el closure: cada <code>crearFib()</code> tiene la suya.</p>',
};
