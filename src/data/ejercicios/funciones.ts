// Ejercicios de la sección 3: «Funciones».

/* ── 3.1 Declaraciones, expresiones y funciones flecha ─────── */
export const formasAuto = {
  id: 'formas-auto',
  titulo: 'Tres formas de escribir una función',
  preguntas: [
    {
      pregunta: '¿Cuál de estas se puede llamar <b>antes</b> de la línea donde está escrita?',
      opciones: ['<code>function f() {}</code>', '<code>const f = function () {};</code>', '<code>const f = () => {};</code>'],
      correcta: 0,
      explicacion: 'Solo las <b>declaraciones</b> se elevan completas. Las otras dos son valores guardados en una <code>const</code> y siguen sus reglas: zona muerta temporal hasta su línea.',
    },
    {
      pregunta: '¿Qué devuelve <code>(n) => n * 2</code> al llamarla con 5?',
      opciones: ['<code>undefined</code>', '<code>10</code>', 'Una función'],
      correcta: 1,
      explicacion: 'Sin llaves, la flecha tiene <b>retorno implícito</b>: devuelve el resultado de la expresión.',
    },
    {
      pregunta: '¿Y <code>(n) => { n * 2 }</code>?',
      opciones: ['<code>10</code>', '<code>undefined</code>: con llaves hace falta <code>return</code>', 'Error de sintaxis'],
      correcta: 1,
      explicacion: 'Con llaves, el cuerpo es un bloque normal, y una función sin <code>return</code> devuelve <code>undefined</code>.',
    },
    {
      pregunta: '¿Cómo devuelve una flecha un objeto con retorno implícito?',
      opciones: ['<code>() => { ok: true }</code>', '<code>() => ({ ok: true })</code>', 'No se puede'],
      correcta: 1,
      explicacion: 'Sin paréntesis, las llaves se leen como un bloque y <code>ok:</code> como una etiqueta. Los paréntesis le dicen al motor que es una expresión.',
    },
  ],
};

export const formasOrden = {
  id: 'formas-orden',
  titulo: 'Llaves, paréntesis y retornos',
  codigo: `function declarada() {}
const flecha = (n) => n * n;
const conLlaves = (n) => { n * n; };
const objeto = () => ({ ok: true });

console.log(typeof declarada, typeof flecha);
console.log(flecha(3));
console.log(conLlaves(3));
console.log(objeto().ok);`,
  salida: ['function function', '9', 'undefined', 'true'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Las tres formas crean el mismo tipo de valor: <code>function</code>. <code>flecha</code> tiene retorno implícito; <code>conLlaves</code> no tiene <code>return</code>, así que devuelve <code>undefined</code>. <code>objeto</code> devuelve el objeto gracias a los paréntesis.',
};

export const formasDetective = {
  id: 'formas-detective',
  titulo: 'Una flecha que no devuelve nada',
  codigo: `const doble = (n) => {
  n * 2;
};

console.log(doble(4).toFixed(1));`,
  error: `calculo.js:5
console.log(doble(4).toFixed(1));
                     ^

TypeError: Cannot read properties of undefined (reading 'toFixed')`,
  culpable: 2,
  hallazgo:
    'El error salta en la línea 5, pero la causa está en la 2: la flecha tiene llaves y no tiene <code>return</code>. Calcula <code>n * 2</code> y tira el resultado, así que <code>doble(4)</code> devuelve <code>undefined</code>.',
  pista: '¿Qué valor devuelve <code>doble(4)</code>? Mira bien el cuerpo de la función: ¿tiene llaves? ¿tiene <code>return</code>?',
  arreglos: [
    {
      texto: 'Usar retorno implícito: <code>const doble = (n) => n * 2;</code>',
      correcta: true,
      porque: 'Sin llaves, la flecha devuelve la expresión. <code>doble(4)</code> da 8 e imprime <code>8.0</code>.',
    },
    {
      texto: 'Usar encadenamiento opcional: <code>doble(4)?.toFixed(1)</code>',
      correcta: false,
      porque: 'Ya no da error, pero imprime <code>undefined</code>: escondes el síntoma y la función sigue rota.',
    },
    {
      texto: 'Cambiar <code>const</code> por <code>let</code>',
      correcta: false,
      porque: 'La forma de declarar la variable no cambia lo que devuelve la función.',
    },
  ],
};

export const formasLab = {
  id: 'formas-lab',
  titulo: 'A flecha de una línea',
  inicial: `function doble(n) {
  return n * 2;
}

const esPar = function (n) {
  return n % 2 === 0;
};

// Reescribe doble y esPar como funciones flecha de una línea,
// con retorno implícito.

console.log(doble(21), esPar(4));
`,
  verificaciones: [
    { texto: 'Imprime <code>42 true</code>', prueba: 'return __salida.some((l) => l === "42 true");' },
    { texto: 'Las dos son flechas guardadas en <code>const</code>', prueba: String.raw`return /const\s+doble\s*=\s*\(?\s*\w+\s*\)?\s*=>/.test(__codigo) && /const\s+esPar\s*=\s*\(?\s*\w+\s*\)?\s*=>/.test(__codigo);` },
    { texto: 'Sin <code>function</code> ni <code>return</code>: retorno implícito', prueba: String.raw`return !/\bfunction\b/.test(__codigo) && !/\breturn\b/.test(__codigo);` },
  ],
  pistas: [
    'Una flecha de una línea tiene esta forma: <code>const nombre = (parametro) => expresión;</code>',
    'Para <code>doble</code>: <code>const doble = (n) => n * 2;</code>',
    'Para <code>esPar</code>: <code>const esPar = (n) => n % 2 === 0;</code>. Deja el <code>console.log</code> al final.',
  ] as [string, string, string],
  solucion: `const doble = (n) => n * 2;
const esPar = (n) => n % 2 === 0;

console.log(doble(21), esPar(4));`,
  explicacion:
    '<p>Las flechas de una línea son ideales para funciones cortas que solo calculan algo. Si necesitas varias instrucciones, usa llaves y <code>return</code>. Y fíjate en que, como ahora son <code>const</code>, tienen que estar escritas antes de usarse.</p>',
};

/* ── 3.2 Parámetros ───────────────────────────────────────── */
export const paramsAuto = {
  id: 'params-auto',
  titulo: 'Lo que recibe una función',
  preguntas: [
    {
      pregunta: 'Si una función tiene dos parámetros y la llamas con uno, ¿qué vale el segundo?',
      opciones: ['Da error', '<code>undefined</code>', '<code>null</code>'],
      correcta: 1,
      explicacion: 'JavaScript no comprueba la cantidad de argumentos: los que faltan valen <code>undefined</code> y los que sobran se ignoran.',
    },
    {
      pregunta: 'En <code>function f(x = 10)</code>, ¿cuándo vale 10 <code>x</code>?',
      opciones: ['Cuando el argumento es <code>undefined</code> o no se pasa', 'Cuando el argumento es falsy', 'Siempre'],
      correcta: 0,
      explicacion: 'Igual que en la desestructuración: <code>f(null)</code> o <code>f(0)</code> usan el valor pasado, no el predeterminado.',
    },
    {
      pregunta: '¿Qué es <code>numeros</code> en <code>function sumar(...numeros)</code>?',
      opciones: ['El primer argumento', 'Un array con todos los argumentos', 'Un objeto'],
      correcta: 1,
      explicacion: 'El <b>parámetro rest</b> junta los argumentos en un array de verdad. Tiene que ser el último parámetro.',
    },
    {
      pregunta: 'Si pasas un objeto a una función y ella le cambia una propiedad, ¿cambia afuera?',
      opciones: ['No, la función recibe una copia', 'Sí: la función recibe una referencia al mismo objeto'],
      correcta: 1,
      explicacion: 'Los argumentos se pasan como en una asignación: los primitivos se copian, los objetos comparten la referencia. Por eso conviene no modificar lo que recibes.',
    },
  ],
};

export const paramsOrden = {
  id: 'params-orden',
  titulo: 'Valores por defecto y rest',
  codigo: `function crear(nombre = "anónimo", rol = "lector") {
  return \`\${nombre}:\${rol}\`;
}

function contar(...valores) {
  return valores.length;
}

console.log(crear());
console.log(crear(undefined, "admin"));
console.log(crear(null));
console.log(contar(1, [2, 3], 4));`,
  salida: ['anónimo:lector', 'anónimo:admin', 'null:lector', '3'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Pasar <code>undefined</code> es lo mismo que no pasar nada: se usa el valor por defecto. <code>null</code> sí es un valor, así que se respeta. El rest cuenta <b>argumentos</b>: el array <code>[2, 3]</code> es uno solo.',
};

export const paramsDetective = {
  id: 'params-detective',
  titulo: 'Un rest fuera de lugar',
  codigo: `function registrar(...mensajes, nivel) {
  for (const m of mensajes) {
    console.log(\`[\${nivel}] \${m}\`);
  }
}

registrar("inicio", "listo", "info");`,
  error: `log.js:1
function registrar(...mensajes, nivel) {
                   ^^^^^^^^^^^

SyntaxError: Rest parameter must be last formal parameter`,
  culpable: 1,
  hallazgo:
    'El parámetro rest junta "todo lo que queda", así que no puede haber nada después de él: el motor no sabría dónde termina. Es un <code>SyntaxError</code>: el programa ni siquiera empieza.',
  pista: 'El mensaje lo dice casi todo: <em>must be last</em>. ¿Qué parámetro va después del rest?',
  arreglos: [
    {
      texto: 'Cambiar <code>...mensajes</code> por <code>mensajes = []</code>',
      correcta: false,
      porque: 'Ya no es un error de sintaxis, pero <code>mensajes</code> recibe solo <code>"inicio"</code>, y el <code>for...of</code> recorre sus letras una por una.',
    },
    {
      texto: 'Poner el rest al final, <code>registrar(nivel, ...mensajes)</code>, y llamar con <code>registrar("info", "inicio", "listo")</code>',
      correcta: true,
      porque: 'Primero los parámetros fijos, después el rest. Imprime <code>[info] inicio</code> y <code>[info] listo</code>.',
    },
    {
      texto: 'Usar <code>arguments</code> dentro de la función',
      correcta: false,
      porque: 'Mientras la línea 1 tenga el rest antes de <code>nivel</code>, sigue siendo un <code>SyntaxError</code>. Además, <code>arguments</code> es una herramienta antigua que el rest reemplaza.',
    },
  ],
};

export const paramsLab = {
  id: 'params-lab',
  titulo: 'Un promedio flexible',
  inicial: `// Escribe promedio(...numeros): acepta cualquier cantidad de números
// y devuelve su promedio. Sin argumentos, debe devolver 0.

console.log(promedio(4, 8, 6));
console.log(promedio());
`,
  verificaciones: [
    { texto: 'Imprime <code>6</code> y después <code>0</code>', prueba: 'return __salida.join("|") === "6|0";' },
    { texto: 'Funciona con otras cantidades: <code>promedio(1, 2)</code> da <code>1.5</code>', prueba: 'return promedio(1, 2) === 1.5 && promedio(10) === 10;' },
    { texto: 'Usa un parámetro rest, sin <code>arguments</code>', prueba: String.raw`return /\(\s*\.\.\.\s*\w+\s*\)/.test(__codigo) && !/\barguments\b/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function promedio(...numeros) { … }</code> arriba de todo. <code>numeros</code> es un array.',
    'Si <code>numeros.length === 0</code>, devuelve 0 antes de dividir: si no, darías <code>0 / 0</code>, que es <code>NaN</code>.',
    'Suma con un <code>for...of</code> o con <code>numeros.reduce((a, b) => a + b, 0)</code>, y divide por <code>numeros.length</code>.',
  ] as [string, string, string],
  solucion: `function promedio(...numeros) {
  if (numeros.length === 0) return 0;
  let suma = 0;
  for (const n of numeros) suma += n;
  return suma / numeros.length;
}

console.log(promedio(4, 8, 6));
console.log(promedio());`,
  explicacion:
    '<p>El parámetro rest convierte "cualquier cantidad de argumentos" en un array normal, con <code>length</code>, <code>for...of</code> y todos los métodos de array. Y el caso vacío se resuelve con una salida temprana.</p>',
};

/* ── 3.3 Funciones como valores ───────────────────────────── */
export const valoresAuto = {
  id: 'valores-auto',
  titulo: 'Funciones de primera clase',
  preguntas: [
    {
      pregunta: '¿Qué diferencia hay entre <code>saludar</code> y <code>saludar()</code>?',
      opciones: ['Ninguna', '<code>saludar</code> es la función; <code>saludar()</code> la ejecuta y da su resultado', '<code>saludar()</code> es la función'],
      correcta: 1,
      explicacion: 'Los paréntesis <b>ejecutan</b>. Para pasar una función a otra, se pasa sin paréntesis.',
    },
    {
      pregunta: '¿Qué es un <b>callback</b>?',
      opciones: ['Un error', 'Una función que le pasas a otra para que la llame ella', 'Una función que se llama a sí misma'],
      correcta: 1,
      explicacion: '<code>map</code>, <code>filter</code>, <code>setTimeout</code> y <code>addEventListener</code> reciben callbacks.',
    },
    {
      pregunta: '¿Qué es una función de <b>orden superior</b>?',
      opciones: ['Una función muy importante', 'Una función que recibe funciones o devuelve funciones', 'Una función dentro de una clase'],
      correcta: 1,
      explicacion: '<code>map</code> recibe una función; <code>crearMultiplicador</code> devuelve una. Las dos son de orden superior.',
    },
    {
      pregunta: '¿Se puede guardar una función en un objeto o en un array?',
      opciones: ['No', 'Sí, como cualquier otro valor'],
      correcta: 1,
      explicacion: 'Las funciones son valores: se guardan, se pasan, se devuelven y se comparan como cualquier otro.',
    },
  ],
};

export const valoresOrden = {
  id: 'valores-orden',
  titulo: 'Funciones guardadas y devueltas',
  codigo: `const operaciones = {
  sumar: (a, b) => a + b,
  restar: (a, b) => a - b,
};

function calcular(op, a, b) {
  return operaciones[op](a, b);
}

const crearSaludo = (s) => (n) => \`\${s} \${n}\`;

console.log(calcular("sumar", 2, 3));
console.log(calcular("restar", 2, 3));
console.log(typeof crearSaludo("Hola"));
console.log(crearSaludo("Hola")("Ana"));`,
  salida: ['5', '-1', 'function', 'Hola Ana'],
  inicio: [3, 1, 0, 2],
  explicacion:
    '<code>operaciones[op]</code> saca una función del objeto y los paréntesis la ejecutan. <code>crearSaludo("Hola")</code> <b>devuelve una función</b>, que se puede llamar enseguida con un segundo par de paréntesis.',
};

export const valoresDetective = {
  id: 'valores-detective',
  titulo: 'Un callback ejecutado antes de tiempo',
  codigo: `function doble(n) {
  return n * 2;
}

const numeros = [1, 2, 3];
const dobles = numeros.map(doble());
console.log(dobles);`,
  error: `lista.js:6
const dobles = numeros.map(doble());
                       ^

TypeError: NaN is not a function`,
  culpable: 6,
  hallazgo:
    'Con <code>doble()</code>, la función se <b>ejecuta</b> en el momento, sin argumento: <code>undefined * 2</code> da <code>NaN</code>. Lo que recibe <code>map</code> es <code>NaN</code>, no una función.',
  pista: 'El mensaje dice que <code>NaN</code> no es una función. ¿De dónde sale ese <code>NaN</code>? ¿Qué hacen los paréntesis después de <code>doble</code>?',
  arreglos: [
    {
      texto: 'Pasar la función sin paréntesis: <code>numeros.map(doble)</code>',
      correcta: true,
      porque: '<code>map</code> recibe la función y la llama con cada número. Imprime <code>[ 2, 4, 6 ]</code>.',
    },
    {
      texto: '<code>numeros.map(doble(n))</code>',
      correcta: false,
      porque: '<code>n</code> no existe fuera de la función: <code>ReferenceError</code>. Y aunque existiera, seguirías pasando un número, no una función.',
    },
    {
      texto: '<code>numeros.map(() => doble)</code>',
      correcta: false,
      porque: 'No da error, pero cada elemento se reemplaza por <b>la función</b> <code>doble</code>: un array de tres funciones.',
    },
  ],
};

export const valoresLab = {
  id: 'valores-lab',
  titulo: 'Aplicar dos veces',
  inicial: `// Escribe aplicarDosVeces(fn, valor): aplica fn a valor
// y después aplica fn otra vez al resultado.

const sumarTres = (n) => n + 3;

console.log(aplicarDosVeces(sumarTres, 10));
console.log(aplicarDosVeces((t) => t + "!", "hola"));
`,
  verificaciones: [
    { texto: 'Imprime <code>16</code> y <code>hola!!</code>', prueba: 'return __salida.join("|") === "16|hola!!";' },
    { texto: 'Funciona con cualquier función: con <code>(n) => n * 2</code> y 5 da 20', prueba: 'return aplicarDosVeces((n) => n * 2, 5) === 20;' },
    { texto: 'Llama a <code>fn</code> exactamente dos veces', prueba: 'let veces = 0; aplicarDosVeces((x) => { veces++; return x; }, 1); return veces === 2;' },
  ],
  pistas: [
    'Empieza con <code>function aplicarDosVeces(fn, valor) { … }</code> arriba de todo.',
    '<code>fn</code> es una función: llámala como cualquier otra, <code>fn(valor)</code>.',
    'Usa el resultado de la primera llamada como argumento de la segunda: <code>return fn(fn(valor));</code>',
  ] as [string, string, string],
  solucion: `function aplicarDosVeces(fn, valor) {
  return fn(fn(valor));
}

const sumarTres = (n) => n + 3;

console.log(aplicarDosVeces(sumarTres, 10));
console.log(aplicarDosVeces((t) => t + "!", "hola"));`,
  explicacion:
    '<p><code>aplicarDosVeces</code> no sabe qué hace <code>fn</code>, y no le importa: recibe el <b>comportamiento</b> como argumento. Esa es la idea de las funciones de orden superior: separar el "qué" del "cómo".</p>',
};

/* ── 3.4 this ──────────────────────────────────────────────── */
export const thisAuto = {
  id: 'this-auto',
  titulo: '¿Quién es this?',
  preguntas: [
    {
      pregunta: 'En <code>tienda.abrir()</code>, ¿qué es <code>this</code> dentro de <code>abrir</code>?',
      opciones: ['<code>tienda</code>', 'El objeto global', '<code>abrir</code>'],
      correcta: 0,
      explicacion: 'Regla principal: en una llamada con punto, <code>this</code> es lo que está antes del punto.',
    },
    {
      pregunta: '<code>const f = tienda.abrir; f();</code> En modo estricto, ¿qué es <code>this</code>?',
      opciones: ['<code>tienda</code>', '<code>undefined</code>', '<code>f</code>'],
      correcta: 1,
      explicacion: 'Sin punto no hay objeto. En modo estricto, <code>this</code> es <code>undefined</code>; fuera de él, el objeto global.',
    },
    {
      pregunta: '¿Qué <code>this</code> tiene una función flecha?',
      opciones: [
        'El objeto que la llama',
        'No tiene propio: usa el <code>this</code> del lugar donde fue escrita',
        'Siempre <code>undefined</code>',
      ],
      correcta: 1,
      explicacion: 'Las flechas toman <code>this</code> de su entorno, como cualquier otra variable. Por eso son ideales para callbacks dentro de métodos, y malas como métodos.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>call</code> y <code>bind</code>?',
      opciones: [
        'Ninguna',
        '<code>call</code> ejecuta ya con ese <code>this</code>; <code>bind</code> devuelve una función nueva con <code>this</code> fijado',
        '<code>bind</code> ejecuta y <code>call</code> no',
      ],
      correcta: 1,
      explicacion: '<code>apply</code> es como <code>call</code>, pero recibe los argumentos en un array.',
    },
  ],
};

export const thisOrden = {
  id: 'this-orden',
  titulo: 'call, apply y bind',
  codigo: `function presentar(saludo) {
  return \`\${saludo}, soy \${this.nombre}\`;
}

const ana = { nombre: "Ana" };
const luis = { nombre: "Luis" };

console.log(presentar.call(ana, "Hola"));
console.log(presentar.apply(luis, ["Buenas"]));

const deEva = presentar.bind({ nombre: "Eva" });
console.log(deEva("Hey"));
console.log(deEva.call(ana, "Hola"));`,
  salida: ['Hola, soy Ana', 'Buenas, soy Luis', 'Hey, soy Eva', 'Hola, soy Eva'],
  inicio: [3, 1, 0, 2],
  explicacion:
    '<code>call</code> y <code>apply</code> eligen <code>this</code> para una sola llamada. <code>bind</code> lo fija <b>para siempre</b>: ni siquiera un <code>call</code> posterior puede cambiarlo.',
};

export const thisDetective = {
  id: 'this-detective',
  titulo: 'Un método desestructurado',
  codigo: `"use strict";
const tienda = {
  nombre: "La Esquina",
  bienvenida() {
    return \`Bienvenido a \${this.nombre}\`;
  },
};

const { bienvenida } = tienda;
console.log(bienvenida());`,
  error: `tienda.js:5
    return \`Bienvenido a \${this.nombre}\`;
                                 ^

TypeError: Cannot read properties of undefined (reading 'nombre')`,
  culpable: 10,
  hallazgo:
    'Desestructurar saca la función del objeto. En la línea 10 se llama <b>sin punto</b>, así que, en modo estricto, <code>this</code> es <code>undefined</code>. El error salta en la línea 5, pero el problema es cómo se llama.',
  pista: 'El error dice que <code>this</code> es <code>undefined</code>. ¿Cómo se llama a <code>bienvenida</code> en la línea 10? ¿Hay algo antes de un punto?',
  arreglos: [
    {
      texto: 'Convertir el método en flecha: <code>bienvenida: () => `Bienvenido a ${this.nombre}`</code>',
      correcta: false,
      porque: 'Una flecha toma el <code>this</code> de afuera del objeto, que aquí es <code>undefined</code>: mismo error. Las flechas no sirven como métodos que usan <code>this</code>.',
    },
    {
      texto: 'Llamarlo desde el objeto: <code>console.log(tienda.bienvenida());</code>',
      correcta: true,
      porque: 'Con el punto, <code>this</code> es <code>tienda</code>. Si de verdad necesitas la función suelta, usa <code>tienda.bienvenida.bind(tienda)</code>.',
    },
    {
      texto: 'Quitar el <code>"use strict"</code>',
      correcta: false,
      porque: 'El error desaparece, pero <code>this</code> pasa a ser el objeto global e imprime <code>Bienvenido a undefined</code>. El fallo sigue ahí, escondido.',
    },
  ],
};

export const thisLab = {
  id: 'this-lab',
  titulo: 'Un callback que pierde this',
  inicial: `const contador = {
  valor: 0,
  sumarVarios(lista) {
    lista.forEach(function (n) {
      this.valor += n;
    });
  },
};

contador.sumarVarios([1, 2, 3]);
console.log(contador.valor);
`,
  verificaciones: [
    { texto: 'Imprime <code>6</code>', prueba: 'return __salida.at(-1) === "6";' },
    { texto: 'Sigue sumando bien: <code>sumarVarios([4])</code> deja el valor en 10', prueba: 'contador.sumarVarios([4]); return contador.valor === 10;' },
    { texto: 'El callback de <code>forEach</code> es una flecha', prueba: String.raw`return /forEach\s*\(\s*\(?\s*\w+\s*\)?\s*=>/.test(__codigo);` },
  ],
  pistas: [
    'Ejecuta el código: imprime 0. El callback de <code>forEach</code> es una función normal, que se llama sin punto, y su <code>this</code> no es <code>contador</code>.',
    'Una flecha no tiene <code>this</code> propio: usa el del método <code>sumarVarios</code>, que sí es <code>contador</code>.',
    'Cambia <code>function (n) {</code> por <code>(n) => {</code>.',
  ] as [string, string, string],
  solucion: `const contador = {
  valor: 0,
  sumarVarios(lista) {
    lista.forEach((n) => {
      this.valor += n;
    });
  },
};

contador.sumarVarios([1, 2, 3]);
console.log(contador.valor);`,
  explicacion:
    '<p>Es el caso clásico: el método usa <code>this</code> bien, pero el callback que crea adentro tiene su propio <code>this</code>. La flecha lo resuelve porque toma el <code>this</code> del método. Regla práctica: métodos con la sintaxis normal y callbacks dentro de ellos con flechas.</p>',
};

/* ── 3.5 Estilo funcional ──────────────────────────────────── */
export const funcionalAuto = {
  id: 'funcional-auto',
  titulo: 'Funciones puras y datos que no cambian',
  preguntas: [
    {
      pregunta: '¿Qué es una función <b>pura</b>?',
      opciones: [
        'Una función sin parámetros',
        'Con los mismos argumentos devuelve siempre lo mismo y no cambia nada fuera de ella',
        'Una función flecha',
      ],
      correcta: 1,
      explicacion: 'Sin efectos secundarios ni dependencia de datos externos que cambian. Son las más fáciles de probar y de entender.',
    },
    {
      pregunta: '¿Cuál de estas es un efecto secundario?',
      opciones: ['Calcular <code>a + b</code>', 'Modificar un array que llegó como argumento', 'Devolver un objeto nuevo'],
      correcta: 1,
      explicacion: 'También lo son escribir en variables globales, imprimir, guardar en disco o hacer peticiones. No son malos: conviene concentrarlos en pocos lugares.',
    },
    {
      pregunta: '¿Qué hace <code>reduce</code>?',
      opciones: ['Borra elementos', 'Recorre un array acumulando un único resultado', 'Ordena'],
      correcta: 1,
      explicacion: '<code>reduce((acum, x) => …, inicial)</code> combina todos los elementos en un valor: una suma, un objeto, otro array…',
    },
    {
      pregunta: '¿Qué es <b>componer</b> funciones?',
      opciones: ['Escribirlas en el mismo archivo', 'Encadenarlas: la salida de una es la entrada de la siguiente', 'Copiarlas'],
      correcta: 1,
      explicacion: 'Con funciones pequeñas y puras, construyes transformaciones complejas uniendo piezas simples.',
    },
  ],
};

export const funcionalOrden = {
  id: 'funcional-orden',
  titulo: 'filter, map, reduce y componer',
  codigo: `const numeros = [1, 2, 3, 4];

const resultado = numeros.filter((n) => n % 2 === 0).map((n) => n * 10);
const suma = numeros.reduce((acum, n) => acum + n, 0);
const componer = (f, g) => (x) => f(g(x));

console.log(resultado.join(","));
console.log(suma);
console.log(numeros.join(","));
console.log(componer((x) => x + 1, (x) => x * 2)(5));`,
  salida: ['20,40', '10', '1,2,3,4', '11'],
  inicio: [2, 3, 0, 1],
  explicacion:
    '<code>filter</code> deja los pares y <code>map</code> los multiplica. <code>reduce</code> los suma partiendo de 0. Ninguno modificó <code>numeros</code>. <code>componer</code> aplica primero <code>g</code> (5 * 2 = 10) y después <code>f</code> (10 + 1).',
};

export const funcionalDetective = {
  id: 'funcional-detective',
  titulo: 'Reducir una lista vacía',
  codigo: `function totalCarrito(precios) {
  return precios.reduce((acum, p) => acum + p);
}

console.log(totalCarrito([10, 5]));
console.log(totalCarrito([]));`,
  error: `15
carrito.js:2
  return precios.reduce((acum, p) => acum + p);
                 ^

TypeError: Reduce of empty array with no initial value`,
  culpable: 2,
  hallazgo:
    'Sin valor inicial, <code>reduce</code> usa el primer elemento como acumulador. Con un carrito vacío no hay primer elemento, y lanza un error.',
  pista: 'Funciona con <code>[10, 5]</code> pero no con <code>[]</code>. ¿Con qué valor empieza a acumular <code>reduce</code> si no le das ninguno?',
  arreglos: [
    {
      texto: 'Agregar el valor inicial: <code>precios.reduce((acum, p) => acum + p, 0)</code>',
      correcta: true,
      porque: 'Con 0 como punto de partida, un carrito vacío suma 0. Regla: dale siempre un valor inicial a <code>reduce</code>.',
    },
    {
      texto: 'Rodear la línea 6 con <code>try/catch</code>',
      correcta: false,
      porque: 'Evita que el programa se rompa, pero el total de un carrito vacío sigue sin calcularse.',
    },
    {
      texto: 'Cambiar <code>reduce</code> por <code>map</code>',
      correcta: false,
      porque: '<code>map</code> devuelve un array del mismo largo, no un total.',
    },
  ],
};

export const funcionalLab = {
  id: 'funcional-lab',
  titulo: 'Total cobrado, sin bucles',
  inicial: `const pedidos = [
  { cliente: "Ana", total: 30, pagado: true },
  { cliente: "Luis", total: 50, pagado: false },
  { cliente: "Eva", total: 20, pagado: true },
];

// Escribe totalCobrado(lista): suma el total de los pedidos pagados
// encadenando filter, map y reduce. Sin bucles y sin modificar la lista.

console.log(totalCobrado(pedidos));
`,
  verificaciones: [
    { texto: 'Imprime <code>50</code>', prueba: 'return __salida.at(-1) === "50";' },
    { texto: 'Con una lista vacía devuelve <code>0</code>', prueba: 'return totalCobrado([]) === 0;' },
    { texto: 'Usa <code>filter</code> y <code>reduce</code>, sin <code>for</code> ni <code>while</code>', prueba: String.raw`return /\.filter\s*\(/.test(__codigo) && /\.reduce\s*\(/.test(__codigo) && !/\b(for|while)\b/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function totalCobrado(lista) { return lista … }</code> antes del <code>console.log</code>.',
    'Primero <code>.filter((p) => p.pagado)</code>, después <code>.map((p) => p.total)</code>.',
    'Termina con <code>.reduce((suma, t) => suma + t, 0)</code>: el 0 cubre la lista vacía.',
  ] as [string, string, string],
  solucion: `const pedidos = [
  { cliente: "Ana", total: 30, pagado: true },
  { cliente: "Luis", total: 50, pagado: false },
  { cliente: "Eva", total: 20, pagado: true },
];

function totalCobrado(lista) {
  return lista
    .filter((p) => p.pagado)
    .map((p) => p.total)
    .reduce((suma, t) => suma + t, 0);
}

console.log(totalCobrado(pedidos));`,
  explicacion:
    '<p>Cada paso de la cadena hace una sola cosa y devuelve un array nuevo: quedarse con los pagados, sacar los totales, sumarlos. Se lee casi como una frase, y la función es pura: no toca <code>pedidos</code> ni nada de afuera.</p>',
};
