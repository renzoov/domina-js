// Reto del motor de la sección 3: «Funciones».

export const retoFuncAuto = {
  id: 'reto-func-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>function f(a = 5) { return a; }</code><br><code>console.log(f(undefined), f(null));</code>',
      opciones: ['<code>5 5</code>', '<code>5 null</code>', '<code>undefined null</code>'],
      correcta: 1,
      explicacion: 'El valor por defecto solo se usa cuando el argumento es <code>undefined</code> (o falta). <code>null</code> es un valor que pasaste a propósito, así que se respeta.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>function f(a, ...resto) { return resto.length; }</code><br><code>console.log(f(1, 2, 3));</code>',
      opciones: ['<code>3</code>', '<code>2</code>', '<code>1</code>'],
      correcta: 1,
      explicacion: '<code>a</code> se queda con el <code>1</code> y el parámetro rest junta en un array los que sobran: <code>[2, 3]</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const persona = { nombre: "Ana", hola() { return this.nombre; } };</code><br><code>const otra = persona.hola.bind({ nombre: "Eva" });</code><br><code>console.log(otra());</code>',
      opciones: ['<code>Ana</code>', '<code>Eva</code>', '<code>undefined</code>'],
      correcta: 1,
      explicacion: '<code>bind</code> crea una función nueva con <code>this</code> fijo. No importa de dónde salió el método: <code>this</code> es el objeto que le pasaste a <code>bind</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log(doble(2));</code><br><code>const doble = (n) =&gt; n * 2;</code>',
      opciones: ['<code>4</code>', '<code>undefined</code>', '<code>ReferenceError</code>'],
      correcta: 2,
      explicacion: 'Una función flecha guardada en una <code>const</code> sigue las reglas de <code>const</code>: no se puede usar antes de su línea. Solo las <b>declaraciones</b> <code>function</code> se pueden llamar antes.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log([1, 2, 3].reduce((acc, n) =&gt; acc + n, 10));</code>',
      opciones: ['<code>6</code>', '<code>16</code>', '<code>10</code>'],
      correcta: 1,
      explicacion: 'El segundo argumento de <code>reduce</code> es el valor inicial del acumulador: <code>10 + 1 + 2 + 3 = 16</code>.',
    },
  ],
};

export const retoFuncOrden = {
  id: 'reto-func-orden',
  titulo: 'Funciones que fabrican funciones',
  codigo: `function crearSaludo(saludo) {
  return (nombre = "mundo") => \`\${saludo}, \${nombre}\`;
}

const acciones = [crearSaludo("Hola"), crearSaludo("Chau"), (texto) => texto.length];

console.log(acciones[0]());
console.log(acciones[1]("Ana"));
console.log(acciones[2]("tres"));
console.log(typeof acciones[0]);`,
  salida: ['Hola, mundo', 'Chau, Ana', '4', 'function'],
  inicio: [2, 3, 0, 1],
  explicacion:
    'Cada llamada a <code>crearSaludo</code> fabrica una función que recuerda su <code>saludo</code>. La primera se llama sin argumento y usa el valor por defecto. Las funciones son valores: se guardan en un array y se llaman desde ahí.',
};

export const retoFuncDetective = {
  id: 'reto-func-detective',
  titulo: 'Un método escrito con flecha',
  codigo: `const carrito = {
  items: ["pan", "leche"],
  total: () => this.items.length,
};

console.log(carrito.total());`,
  error: `app.js:3
  total: () => this.items.length,
                          ^

TypeError: Cannot read properties of undefined (reading 'length')`,
  culpable: 3,
  hallazgo:
    'Las funciones flecha no tienen <code>this</code> propio: usan el del lugar donde se escribieron, que aquí es el código de afuera del objeto, no <code>carrito</code>. Ahí <code>this.items</code> no existe.',
  pista: 'Dentro de <code>total</code>, ¿quién es <code>this</code>? ¿Las funciones flecha reciben el objeto delante del punto?',
  arreglos: [
    {
      texto: 'Escribirlo como método: <code>total() { return this.items.length; }</code>',
      correcta: true,
      porque: 'Un método normal recibe como <code>this</code> el objeto delante del punto: en <code>carrito.total()</code>, <code>this</code> es <code>carrito</code>.',
    },
    {
      texto: 'Llamarlo con <code>carrito.total.call(carrito)</code>',
      correcta: false,
      porque: '<code>call</code> no le cambia el <code>this</code> a una función flecha: lo ignora. Sigue fallando igual.',
    },
    {
      texto: 'Cambiar <code>const carrito</code> por <code>let carrito</code>',
      correcta: false,
      porque: 'La forma de declarar la variable no influye en el <code>this</code> de la función.',
    },
  ],
};

export const retoFuncLab = {
  id: 'reto-func-lab',
  titulo: 'Una tubería de funciones',
  inicial: `// Escribe tuberia(...pasos): recibe cualquier cantidad de funciones y devuelve
// UNA función que aplica cada paso al resultado del anterior, en orden.

const limpiar = tuberia(
  (texto) => texto.trim(),
  (texto) => texto.toLowerCase(),
  (texto) => texto.replaceAll(" ", "-"),
);

console.log(limpiar("  Hola Mundo  "));
`,
  verificaciones: [
    { texto: 'Imprime <code>hola-mundo</code>', prueba: 'return __salida.join("|") === "hola-mundo";' },
    { texto: 'Devuelve una función', prueba: 'return typeof tuberia((n) => n) === "function";' },
    { texto: 'Aplica los pasos en orden: <code>tuberia(n =&gt; n + 1, n =&gt; n * 2)(3)</code> da <code>8</code>', prueba: 'return tuberia((n) => n + 1, (n) => n * 2)(3) === 8;' },
    { texto: 'Sin pasos, devuelve el valor tal cual', prueba: 'return tuberia()(5) === 5;' },
  ],
  pistas: [
    'Junta los pasos con un parámetro rest: <code>function tuberia(...pasos) { … }</code>',
    'Devuelve otra función que reciba el valor inicial: <code>return (valor) =&gt; …;</code>',
    'Dentro, <code>reduce</code> pasa el resultado de un paso al siguiente: <code>pasos.reduce((acc, paso) =&gt; paso(acc), valor)</code>.',
  ] as [string, string, string],
  solucion: `function tuberia(...pasos) {
  return (valor) => pasos.reduce((acc, paso) => paso(acc), valor);
}

const limpiar = tuberia(
  (texto) => texto.trim(),
  (texto) => texto.toLowerCase(),
  (texto) => texto.replaceAll(" ", "-"),
);

console.log(limpiar("  Hola Mundo  "));`,
  explicacion:
    '<p>Aquí está toda la sección en una línea: un parámetro rest, una función que devuelve otra (y recuerda <code>pasos</code> gracias a un closure) y <code>reduce</code> como función de orden superior. Con el valor inicial de <code>reduce</code>, una tubería sin pasos devuelve el valor tal cual.</p>',
};
