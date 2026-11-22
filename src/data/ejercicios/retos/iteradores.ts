// Reto del motor de la sección 8: «Iteradores y generadores».

export const retoIterAuto = {
  id: 'reto-iter-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>function* g() { yield 1; yield 2; }</code><br><code>const it = g();</code><br><code>it.next();</code><br><code>console.log(it.next());</code>',
      opciones: ['<code>{ value: 1, done: false }</code>', '<code>{ value: 2, done: false }</code>', '<code>{ value: 2, done: true }</code>'],
      correcta: 1,
      explicacion: 'El primer <code>next()</code> llega hasta el <code>yield 1</code>; el segundo, hasta el <code>yield 2</code>. <code>done</code> recién es <code>true</code> cuando la función termina, en el tercer <code>next()</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>function* h() { yield 1; return 2; }</code><br><code>for (const x of h()) console.log(x);</code>',
      opciones: ['<code>1</code>', '<code>1</code> y <code>2</code>', 'Nada'],
      correcta: 0,
      explicacion: 'El valor de <code>return</code> viaja con <code>done: true</code>, y <code>for…of</code> se detiene justo ahí, sin usarlo.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const it = [1, 2, 3].values().map((n) =&gt; {</code><br><code>&nbsp;&nbsp;console.log("calculo", n);</code><br><code>&nbsp;&nbsp;return n * 2;</code><br><code>});</code>',
      opciones: ['<code>calculo 1</code>, <code>calculo 2</code> y <code>calculo 3</code>', 'Nada todavía', '<code>calculo 1</code>'],
      correcta: 1,
      explicacion: 'Los iterator helpers son perezosos: <code>map</code> no calcula nada hasta que alguien pide valores, con <code>next()</code>, <code>for…of</code> o <code>toArray()</code>.',
    },
    {
      pregunta: '¿Qué pasa?<br><code>for (const x of { a: 1, b: 2 }) console.log(x);</code>',
      opciones: ['Imprime <code>a</code> y <code>b</code>', 'Imprime <code>1</code> y <code>2</code>', '<code>TypeError</code>: el objeto no es iterable'],
      correcta: 2,
      explicacion: 'Un objeto común no tiene <code>[Symbol.iterator]</code>. Para recorrerlo con <code>for…of</code>, pide sus partes: <code>Object.keys</code>, <code>Object.values</code> u <code>Object.entries</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>function* g() { yield 1; yield 2; }</code><br><code>console.log([...g(), ...g()].length);</code>',
      opciones: ['<code>2</code>', '<code>4</code>', '<code>TypeError</code>'],
      correcta: 1,
      explicacion: 'Cada llamada a <code>g()</code> crea un generador nuevo, con su propio recorrido. El spread consume cada uno hasta el final.',
    },
  ],
};

export const retoIterOrden = {
  id: 'reto-iter-orden',
  titulo: 'Un generador que se pausa',
  codigo: `function* pasos() {
  console.log("inicio");
  yield "uno";
  console.log("medio");
  yield "dos";
  console.log("fin");
}

const it = pasos();
console.log("creado");
console.log(it.next().value);
console.log(it.next().value);
console.log(it.next().done);`,
  salida: ['creado', 'inicio', 'uno', 'medio', 'dos', 'fin', 'true'],
  inicio: [2, 5, 0, 6, 3, 1, 4],
  explicacion:
    'Llamar a <code>pasos()</code> no ejecuta nada: solo crea el generador. Cada <code>next()</code> corre el cuerpo hasta el siguiente <code>yield</code> y se pausa ahí. El tercer <code>next()</code> imprime «fin», llega al final de la función y devuelve <code>done: true</code>.',
};

export const retoIterDetective = {
  id: 'reto-iter-detective',
  titulo: 'Los helpers no son del array',
  codigo: `const numeros = [5, 8, 13, 21];
const primeros = numeros.take(2);
console.log([...primeros]);`,
  error: `app.js:2
const primeros = numeros.take(2);
                         ^

TypeError: numeros.take is not a function`,
  culpable: 2,
  hallazgo:
    '<code>take</code> es un <b>iterator helper</b> (ES2025): es un método de los iteradores, no de los arrays. Un array no tiene <code>take</code>, pero te puede dar un iterador.',
  pista: '¿De quién es el método <code>take</code>? ¿Cómo se obtiene un iterador a partir de un array?',
  arreglos: [
    {
      texto: 'Cambiar la línea 2 por <code>const primeros = numeros.values().take(2);</code>',
      correcta: true,
      porque: '<code>values()</code> devuelve un iterador del array, y ese iterador sí tiene <code>take</code>, <code>map</code>, <code>filter</code> y los demás helpers. El spread de la línea 3 consume los dos primeros.',
    },
    {
      texto: 'Cambiar la línea 2 por <code>const primeros = Array.from(numeros).take(2);</code>',
      correcta: false,
      porque: '<code>Array.from</code> devuelve otro array, que tampoco tiene <code>take</code>.',
    },
    {
      texto: 'Cambiar la línea 3 por <code>console.log(primeros);</code>',
      correcta: false,
      porque: 'El error ocurre en la línea 2, antes de llegar a imprimir nada.',
    },
  ],
};

export const retoIterLab = {
  id: 'reto-iter-lab',
  titulo: 'Un rango que nunca se acaba',
  inicial: `// Escribe el generador rango(desde, hasta, paso = 1): produce los números
// desde "desde" (incluido) hasta "hasta" (sin incluir), de "paso" en "paso".
// Tiene que funcionar también con hasta = Infinity, sin colgarse.

console.log([...rango(1, 4)].join(","));
console.log([...rango(0, 10, 3)].join(","));
console.log(rango(0, Infinity).take(3).toArray().join(","));
`,
  verificaciones: [
    { texto: 'Imprime <code>1,2,3</code>, <code>0,3,6,9</code> y <code>0,1,2</code>', prueba: 'return __salida.join("|") === "1,2,3|0,3,6,9|0,1,2";' },
    { texto: 'Es un generador: devuelve un iterador con <code>next()</code>', prueba: 'const it = rango(0, 2); return typeof it.next === "function" && it.next().value === 0;' },
    { texto: 'Si <code>desde</code> no es menor que <code>hasta</code>, no produce nada', prueba: 'return [...rango(5, 5)].length === 0 && [...rango(6, 2)].length === 0;' },
    { texto: 'Es perezoso: con <code>Infinity</code> solo calcula lo que se pide', prueba: 'const it = rango(10, Infinity); it.next(); return it.next().value === 11;' },
  ],
  pistas: [
    'Un generador se declara con asterisco: <code>function* rango(desde, hasta, paso = 1) { … }</code>',
    'Dentro, un bucle común: <code>for (let n = desde; n &lt; hasta; n += paso)</code>.',
    'En cada vuelta, <code>yield n;</code>. El generador se pausa ahí hasta que le pidan el siguiente.',
  ] as [string, string, string],
  solucion: `function* rango(desde, hasta, paso = 1) {
  for (let n = desde; n < hasta; n += paso) {
    yield n;
  }
}

console.log([...rango(1, 4)].join(","));
console.log([...rango(0, 10, 3)].join(","));
console.log(rango(0, Infinity).take(3).toArray().join(","));`,
  explicacion:
    '<p>Un bucle hasta <code>Infinity</code> colgaría cualquier función común. En un generador no: cada <code>yield</code> pausa el bucle, y <code>take(3)</code> deja de pedir después del tercero. Y como los generadores son iteradores, traen los helpers de ES2025 sin hacer nada.</p>',
};
