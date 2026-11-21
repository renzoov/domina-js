// Ejercicios de la sección 8: «Iteradores y generadores».

/* ── 8.1 El protocolo iterable ────────────────────────────── */
export const iterableAuto = {
  id: 'iterable-auto',
  titulo: 'Iterables e iteradores',
  preguntas: [
    {
      pregunta: '¿Qué hace que un objeto sea <b>iterable</b>?',
      opciones: ['Tener <code>length</code>', 'Tener un método en <code>[Symbol.iterator]</code> que devuelve un iterador', 'Ser un array'],
      correcta: 1,
      explicacion: 'Arrays, textos, <code>Map</code>, <code>Set</code> y argumentos lo tienen. Los objetos literales, no.',
    },
    {
      pregunta: '¿Qué devuelve el <code>next()</code> de un iterador?',
      opciones: ['El siguiente valor', 'Un objeto <code>{ value, done }</code>', '<code>true</code> o <code>false</code>'],
      correcta: 1,
      explicacion: '<code>value</code> es el elemento y <code>done</code> indica si el recorrido terminó.',
    },
    {
      pregunta: '¿Cuál de estas herramientas <b>no</b> usa el protocolo iterable?',
      opciones: ['<code>for...of</code>', 'El spread <code>[...x]</code>', '<code>for...in</code>'],
      correcta: 2,
      explicacion: '<code>for...in</code> recorre claves de objetos. <code>for...of</code>, spread, desestructuración de arrays, <code>Array.from</code> y <code>new Map(x)</code> sí usan iteradores.',
    },
    {
      pregunta: '¿Se puede recorrer dos veces el mismo <b>iterador</b>?',
      opciones: ['Sí', 'No: cuando llega a <code>done: true</code> ya no da más valores'],
      correcta: 1,
      explicacion: 'Un <b>iterable</b>, como un array, fabrica un iterador nuevo cada vez que lo recorres. Un iterador es un recorrido de un solo uso.',
    },
  ],
};

export const iterableOrden = {
  id: 'iterable-orden',
  titulo: 'Un rango iterable',
  codigo: `const rango = {
  desde: 1,
  hasta: 3,
  [Symbol.iterator]() {
    let actual = this.desde;
    const hasta = this.hasta;
    return {
      next() {
        return actual <= hasta
          ? { value: actual++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

console.log([...rango].join(","));
const [primero] = rango;
console.log(primero);
console.log(Math.max(...rango));
console.log(Array.from(rango, (n) => n * 10).at(-1));`,
  salida: ['1,2,3', '1', '3', '30'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Con <code>[Symbol.iterator]</code>, el objeto funciona con spread, desestructuración y <code>Array.from</code>. Cada uso llama al método otra vez y obtiene un iterador nuevo, que empieza desde 1.',
};

export const iterableDetective = {
  id: 'iterable-detective',
  titulo: 'Un iterador que no avisa el final',
  codigo: `const cuenta = {
  [Symbol.iterator]() {
    let n = 0;
    return {
      next() {
        n++;
        if (n <= 3) return { value: n, done: false };
      },
    };
  },
};

for (const x of cuenta) console.log(x);`,
  error: `1
2
3
cuenta.js:13
for (const x of cuenta) console.log(x);
                ^

TypeError: Iterator result undefined is not an object`,
  culpable: 7,
  hallazgo:
    'Después del 3, <code>next()</code> no entra en el <code>if</code> y no devuelve nada: <code>undefined</code>. El protocolo exige que <b>siempre</b> devuelva un objeto, y el final se avisa con <code>done: true</code>.',
  pista: '¿Qué devuelve <code>next()</code> la cuarta vez, cuando <code>n</code> vale 4?',
  arreglos: [
    {
      texto: 'Después del <code>if</code>, devolver <code>{ value: undefined, done: true }</code>',
      correcta: true,
      porque: 'Así <code>for...of</code> sabe que terminó y sale del bucle sin error.',
    },
    {
      texto: 'Después del <code>if</code>, devolver <code>undefined</code> explícitamente',
      correcta: false,
      porque: 'Es exactamente lo que ya pasaba: el mismo error.',
    },
    {
      texto: 'Agregar un <code>break</code> dentro del <code>for...of</code>',
      correcta: false,
      porque: '¿Cuándo? El bucle no tiene forma de saber cuándo parar: esa información la tiene que dar el iterador.',
    },
  ],
};

export const iterableLab = {
  id: 'iterable-lab',
  titulo: 'Una cuenta regresiva iterable',
  inicial: `// Escribe cuentaRegresiva(desde): devuelve un objeto ITERABLE que produce
// desde, desde - 1, …, 1. Sin generadores: implementa [Symbol.iterator]()
// y un iterador con next().

console.log([...cuentaRegresiva(3)]);
`,
  verificaciones: [
    { texto: 'Imprime <code>[ 3, 2, 1 ]</code>', prueba: 'return __salida.at(-1) === "[ 3, 2, 1 ]";' },
    { texto: 'Se puede recorrer más de una vez', prueba: 'const c = cuentaRegresiva(2); return [...c].join() === "2,1" && [...c].join() === "2,1";' },
    { texto: 'Sin generadores: implementa <code>Symbol.iterator</code> y <code>next</code>', prueba: String.raw`return !/function\s*\*/.test(__codigo) && /Symbol\.iterator/.test(__codigo) && /next\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Devuelve un objeto con un método <code>[Symbol.iterator]() { … }</code>. Escribe <code>function cuentaRegresiva(desde)</code> arriba de todo.',
    'Dentro de ese método, crea una variable <code>let actual = desde;</code> y devuelve un objeto con <code>next()</code>. Así cada recorrido empieza de nuevo.',
    '<code>next()</code>: si <code>actual &gt;= 1</code>, devuelve <code>{ value: actual--, done: false }</code>; si no, <code>{ value: undefined, done: true }</code>.',
  ] as [string, string, string],
  solucion: `function cuentaRegresiva(desde) {
  return {
    [Symbol.iterator]() {
      let actual = desde;
      return {
        next() {
          if (actual >= 1) return { value: actual--, done: false };
          return { value: undefined, done: true };
        },
      };
    },
  };
}

console.log([...cuentaRegresiva(3)]);`,
  explicacion:
    '<p>La clave para que se pueda recorrer dos veces: la posición (<code>actual</code>) se crea <b>dentro</b> de <code>[Symbol.iterator]</code>, así que cada recorrido tiene la suya. Funciona, pero es mucho código para algo simple. En el próximo tema, un generador hace lo mismo en tres líneas.</p>',
};

/* ── 8.2 Generadores y yield ─────────────────────────────── */
export const generadoresAuto = {
  id: 'generadores-auto',
  titulo: 'Funciones que se pausan',
  preguntas: [
    {
      pregunta: '¿Qué pasa al llamar a una función generadora, <code>function* gen() {…}</code>?',
      opciones: ['Ejecuta todo su cuerpo', 'Devuelve un generador en pausa, sin ejecutar nada todavía', 'Da error'],
      correcta: 1,
      explicacion: 'El cuerpo empieza a ejecutarse con el primer <code>next()</code>.',
    },
    {
      pregunta: '¿Qué hace <code>yield valor</code>?',
      opciones: ['Termina la función', 'Entrega <code>valor</code> y pausa el generador hasta el siguiente <code>next()</code>', 'Imprime el valor'],
      correcta: 1,
      explicacion: 'Al retomar, el generador sigue justo después del <code>yield</code>, con todas sus variables intactas.',
    },
    {
      pregunta: '¿Puede un generador tener un <code>while (true)</code> sin colgar el programa?',
      opciones: ['No', 'Sí: solo avanza cuando le piden un valor, así que puede representar secuencias infinitas'],
      correcta: 1,
      explicacion: 'El peligro es consumirlo entero, con <code>[...gen]</code> por ejemplo. Hay que tomar solo lo necesario.',
    },
    {
      pregunta: '¿Qué hace <code>yield* otroIterable</code>?',
      opciones: ['Entrega el iterable entero como un solo valor', 'Entrega uno por uno los valores de <code>otroIterable</code>', 'Multiplica'],
      correcta: 1,
      explicacion: 'Sirve para delegar en otro generador o recorrer un iterable dentro del tuyo.',
    },
  ],
};

export const generadoresOrden = {
  id: 'generadores-orden',
  titulo: 'Consumir un generador',
  codigo: `function* letras() {
  yield "a";
  yield "b";
  return "fin";
}

const g = letras();
console.log(g.next().value);
console.log([...g].join(","));
console.log(g.next().done);
console.log([...letras()].length);`,
  salida: ['a', 'b', 'true', '2'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'El primer <code>next()</code> toma la <code>"a"</code>; el spread se lleva lo que queda: solo <code>"b"</code>, porque el valor del <code>return</code> no se incluye. <code>g</code> ya terminó. Un generador nuevo produce otra vez sus dos valores.',
};

export const generadoresDetective = {
  id: 'generadores-detective',
  titulo: 'Un generador ya consumido',
  codigo: `function* numeros() {
  yield 10;
  yield 20;
}

const nums = numeros();
console.log([...nums].length);
const [primero] = nums;
console.log(primero.toFixed(1));`,
  error: `2
numeros.js:9
console.log(primero.toFixed(1));
                    ^

TypeError: Cannot read properties of undefined (reading 'toFixed')`,
  culpable: 8,
  hallazgo:
    'El spread de la línea 7 recorrió <code>nums</code> hasta el final. Un generador es un recorrido de <b>un solo uso</b>: en la línea 8 ya no le quedan valores, así que <code>primero</code> es <code>undefined</code>.',
  pista: '¿Cuántos valores le quedan a <code>nums</code> después de la línea 7?',
  arreglos: [
    {
      texto: 'Crear un generador nuevo: <code>const [primero] = numeros();</code>',
      correcta: true,
      porque: 'Cada llamada a <code>numeros()</code> crea un recorrido nuevo, desde el principio. <code>primero</code> vale 10.',
    },
    {
      texto: 'Llamar antes a <code>nums.return()</code> para reiniciarlo',
      correcta: false,
      porque: '<code>return()</code> no reinicia: termina el generador. Sigue sin valores.',
    },
    {
      texto: 'Usar <code>primero?.toFixed(1)</code>',
      correcta: false,
      porque: 'Ya no falla, pero imprime <code>undefined</code>: el valor sigue sin estar.',
    },
  ],
};

export const generadoresLab = {
  id: 'generadores-lab',
  titulo: 'Identificadores sin fin',
  inicial: `// Escribe el generador idsUnicos(prefijo): produce "<prefijo>-1",
// "<prefijo>-2", "<prefijo>-3"… sin fin.

const ids = idsUnicos("pedido");
console.log(ids.next().value);
console.log(ids.next().value);
`,
  verificaciones: [
    { texto: 'Imprime <code>pedido-1</code> y <code>pedido-2</code>', prueba: 'return __salida.join("|") === "pedido-1|pedido-2";' },
    { texto: 'No se termina: el valor 100 es <code>x-100</code>', prueba: 'const g = idsUnicos("x"); let r; for (let i = 0; i < 100; i++) r = g.next(); return r.value === "x-100" && r.done === false;' },
    { texto: 'Es una función generadora con <code>yield</code>', prueba: String.raw`return /function\s*\*/.test(__codigo) && /\byield\b/.test(__codigo);` },
  ],
  pistas: [
    'Una función generadora se escribe con asterisco: <code>function* idsUnicos(prefijo) { … }</code>, arriba de todo.',
    'Lleva un contador: <code>let n = 1;</code>, y un bucle infinito: <code>while (true) { … }</code>.',
    'Dentro del bucle: <code>yield `${prefijo}-${n++}`;</code>',
  ] as [string, string, string],
  solucion: `function* idsUnicos(prefijo) {
  let n = 1;
  while (true) {
    yield \`\${prefijo}-\${n++}\`;
  }
}

const ids = idsUnicos("pedido");
console.log(ids.next().value);
console.log(ids.next().value);`,
  explicacion:
    '<p>El <code>while (true)</code> no cuelga nada: el generador solo avanza una vuelta por cada <code>next()</code>, y se pausa en el <code>yield</code>. El contador vive entre llamadas, como en un closure.</p>',
};

/* ── 8.3 Iterator helpers ────────────────────────────────── */
export const helpersAuto = {
  id: 'helpers-auto',
  titulo: 'Métodos para iteradores',
  preguntas: [
    {
      pregunta: '¿Qué son los <em>iterator helpers</em> (ES2025)?',
      opciones: [
        'Librerías externas',
        'Métodos como <code>map</code>, <code>filter</code>, <code>take</code> y <code>drop</code> directamente en los iteradores',
        'Otro nombre de los arrays',
      ],
      correcta: 1,
      explicacion: 'Antes había que convertir el iterador en array para usar esos métodos.',
    },
    {
      pregunta: '¿Qué significa que sean <b>perezosos</b>?',
      opciones: ['Que son lentos', 'Que no procesan nada hasta que alguien pide valores, y solo los que hacen falta', 'Que funcionan a veces'],
      correcta: 1,
      explicacion: 'Por eso funcionan con secuencias infinitas: <code>take(3)</code> pide solo tres valores.',
    },
    {
      pregunta: '<code>iterador.map(fn)</code>, ¿qué devuelve?',
      opciones: ['Un array', 'Otro iterador', 'Un número'],
      correcta: 1,
      explicacion: 'Para obtener un array al final, usa <code>.toArray()</code>.',
    },
    {
      pregunta: '¿Para qué sirve <code>Iterator.from(x)</code>?',
      opciones: ['Para convertir cualquier iterable (o un objeto con <code>next</code>) en un iterador con todos los helpers', 'Para crear un array', 'Para copiar'],
      correcta: 0,
      explicacion: 'Un array no tiene <code>take</code>, pero <code>Iterator.from(array)</code>, sí.',
    },
  ],
};

export const helpersOrden = {
  id: 'helpers-orden',
  titulo: 'Solo lo necesario',
  codigo: `function* naturales() {
  let n = 1;
  while (true) {
    console.log("genera", n);
    yield n++;
  }
}

const resultado = naturales().filter((n) => n % 2 === 0).take(1).toArray();
console.log(resultado);
console.log(Iterator.from([1, 2, 3]).map((x) => x * 2).toArray().join("-"));`,
  salida: ['genera 1', 'genera 2', '[ 2 ]', '2-4-6'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'La cadena es perezosa: <code>take(1)</code> pide un valor, <code>filter</code> pide números hasta encontrar un par, y el generador produce solo dos. Nunca se genera el 3, aunque la secuencia sea infinita.',
};

export const helpersDetective = {
  id: 'helpers-detective',
  titulo: 'Tratar un iterador como array',
  codigo: `const edades = new Map([["ana", 31], ["luis", 27]]);

const nombres = edades.keys().map((n) => n.toUpperCase());

console.log(nombres[0].length);`,
  error: `edades.js:5
console.log(nombres[0].length);
                       ^

TypeError: Cannot read properties of undefined (reading 'length')`,
  culpable: 3,
  hallazgo:
    '<code>edades.keys()</code> es un iterador, y su <code>map</code> devuelve <b>otro iterador</b>, no un array. Los iteradores no tienen índices: <code>nombres[0]</code> es <code>undefined</code>.',
  pista: '¿De qué tipo es <code>nombres</code>? ¿Un iterador se puede leer por índice?',
  arreglos: [
    {
      texto: 'Terminar la cadena con <code>.toArray()</code>',
      correcta: true,
      porque: '<code>toArray()</code> recorre el iterador y arma un array: <code>nombres[0]</code> es <code>"ANA"</code>.',
    },
    {
      texto: 'Usar <code>nombres.at(0).length</code>',
      correcta: false,
      porque: 'Los iteradores tampoco tienen <code>at</code>: <code>TypeError: nombres.at is not a function</code>.',
    },
    {
      texto: 'Usar <code>nombres.next().length</code>',
      correcta: false,
      porque: '<code>next()</code> devuelve <code>{ value, done }</code>, que no tiene <code>length</code>: imprime <code>undefined</code>.',
    },
  ],
};

export const helpersLab = {
  id: 'helpers-lab',
  titulo: 'Los primeros pares',
  inicial: `function* naturales() {
  let n = 1;
  while (true) yield n++;
}

// Escribe primerosPares(iterable, cantidad): devuelve un array con los
// primeros números pares del iterable, usando Iterator.from, filter,
// take y toArray. Tiene que funcionar con iterables infinitos.

console.log(primerosPares(naturales(), 3));
console.log(primerosPares([5, 8, 10, 3, 4], 2));
`,
  verificaciones: [
    { texto: 'Imprime <code>[ 2, 4, 6 ]</code> y <code>[ 8, 10 ]</code>', prueba: 'return __salida.join("|") === "[ 2, 4, 6 ]|[ 8, 10 ]";' },
    { texto: 'Si hay menos pares de los pedidos, devuelve los que haya', prueba: 'return JSON.stringify(primerosPares([1, 2, 3], 5)) === "[2]";' },
    { texto: 'Usa <code>Iterator.from</code> y <code>take</code>', prueba: String.raw`return /Iterator\.from\s*\(/.test(__codigo) && /\.take\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function primerosPares(iterable, cantidad) { return Iterator.from(iterable) … }</code> antes de los <code>console.log</code>.',
    'Encadena <code>.filter((n) => n % 2 === 0)</code> y después <code>.take(cantidad)</code>.',
    'Termina con <code>.toArray()</code> para devolver un array.',
  ] as [string, string, string],
  solucion: `function* naturales() {
  let n = 1;
  while (true) yield n++;
}

function primerosPares(iterable, cantidad) {
  return Iterator.from(iterable)
    .filter((n) => n % 2 === 0)
    .take(cantidad)
    .toArray();
}

console.log(primerosPares(naturales(), 3));
console.log(primerosPares([5, 8, 10, 3, 4], 2));`,
  explicacion:
    '<p>Con arrays, <code>filter</code> recorrería todo antes de que <code>slice</code> recortara, y con un iterable infinito nunca terminaría. Con iteradores, <code>take</code> corta la cadena en cuanto tiene lo que necesita.</p>',
};

/* ── 8.4 Iteración asíncrona ─────────────────────────────── */
export const asincAuto = {
  id: 'asinc-auto',
  titulo: 'Valores que llegan con el tiempo',
  preguntas: [
    {
      pregunta: '¿Para qué sirve <code>for await...of</code>?',
      opciones: ['Para hacer un bucle más rápido', 'Para recorrer valores que llegan de forma asíncrona, esperando cada uno', 'Para recorrer arrays'],
      correcta: 1,
      explicacion: 'Páginas de una API, líneas de un archivo grande, mensajes de un stream: cada valor llega cuando llega.',
    },
    {
      pregunta: '¿Qué es un generador asíncrono, <code>async function*</code>?',
      opciones: ['Un generador que puede usar <code>await</code> y cuyos valores se consumen con <code>for await</code>', 'Un generador más rápido', 'Un error de sintaxis'],
      correcta: 0,
      explicacion: 'Junta las dos ideas: pausar con <code>yield</code> y esperar con <code>await</code>.',
    },
    {
      pregunta: '¿Qué hace <code>Array.fromAsync(iterable)</code> (ES2026)?',
      opciones: ['Lo mismo que <code>Array.from</code>', 'Recorre un iterable asíncrono y devuelve una promesa con el array de todos sus valores', 'Crea una promesa vacía'],
      correcta: 1,
      explicacion: 'Es el equivalente asíncrono de <code>Array.from</code>: <code>await Array.fromAsync(gen())</code>.',
    },
    {
      pregunta: '¿Qué clave usa un objeto para ser iterable de forma asíncrona?',
      opciones: ['<code>Symbol.iterator</code>', '<code>Symbol.asyncIterator</code>', '<code>Symbol.async</code>'],
      correcta: 1,
      explicacion: 'Su <code>next()</code> devuelve una <b>promesa</b> de <code>{ value, done }</code>.',
    },
  ],
};

export const asincOrden = {
  id: 'asinc-orden',
  titulo: 'Esperar cada valor',
  codigo: `const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function* tictac() {
  for (let i = 1; i <= 2; i++) {
    await esperar(100);
    yield \`tic \${i}\`;
  }
}

async function main() {
  console.log("empieza");
  for await (const t of tictac()) {
    console.log(t);
  }
  const todos = await Array.fromAsync(tictac());
  console.log(todos.length);
}

main();
console.log("main ya se llamó");`,
  salida: ['empieza', 'main ya se llamó', 'tic 1', 'tic 2', '2'],
  inicio: [1, 3, 0, 4, 2],
  explicacion:
    '<code>main</code> imprime <code>empieza</code> y, en el primer <code>await</code>, cede el control: por eso el último <code>console.log</code> del archivo sale antes que los tics. Después, cada tic llega a los 100 ms, y <code>Array.fromAsync</code> junta los dos de una segunda pasada.',
};

export const asincDetective = {
  id: 'asinc-detective',
  titulo: 'Un for...of sobre valores asíncronos',
  codigo: `async function* paginas() {
  for (let n = 1; n <= 2; n++) {
    const respuesta = await fetch(\`/api/items?pagina=\${n}\`);
    yield await respuesta.json();
  }
}

for (const pagina of paginas()) {
  console.log(pagina);
}`,
  error: `items.js:8
for (const pagina of paginas()) {
                     ^

TypeError: paginas is not a function or its return value is not iterable`,
  culpable: 8,
  hallazgo:
    'Un generador asíncrono no es iterable "normal": no tiene <code>Symbol.iterator</code>, sino <code>Symbol.asyncIterator</code>. <code>for...of</code> no sabe esperar sus valores.',
  pista: 'El generador es <code>async</code>. ¿Qué versión de <code>for</code> sabe esperar cada valor?',
  arreglos: [
    {
      texto: 'Usar <code>for await (const pagina of paginas())</code>, dentro de una función <code>async</code> o un módulo',
      correcta: true,
      porque: '<code>for await</code> pide cada valor y espera la promesa antes de seguir. Imprime cada página cuando llega.',
    },
    {
      texto: 'Convertirlo primero con <code>Array.from(paginas())</code>',
      correcta: false,
      porque: '<code>Array.from</code> tampoco sabe esperar: daría un array vacío. Lo correcto sería <code>await Array.fromAsync(paginas())</code>.',
    },
    {
      texto: 'Quitar el <code>async</code> del generador',
      correcta: false,
      porque: 'Sin <code>async</code>, el <code>await</code> de adentro es un <code>SyntaxError</code>. El generador necesita esperar a la red.',
    },
  ],
};
