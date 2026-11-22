// Reto del motor de la sección 12: «Metaprogramación».

export const retoMetaAuto = {
  id: 'reto-meta-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>const o = {};</code><br><code>Object.defineProperty(o, "x", { value: 1 });</code><br><code>console.log(o.x, Object.keys(o).length, JSON.stringify(o));</code>',
      opciones: ['<code>1 1 {"x":1}</code>', '<code>1 0 {}</code>', '<code>undefined 0 {}</code>'],
      correcta: 1,
      explicacion: 'Con <code>defineProperty</code>, los atributos que no indicas valen <code>false</code>. La propiedad existe y se lee, pero no es <code>enumerable</code>: no aparece en <code>Object.keys</code> ni en <code>JSON.stringify</code>. Tampoco es <code>writable</code>: asignarle otro valor falla (en silencio, o con un <code>TypeError</code> en modo estricto).',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const p = new Proxy({}, {</code><br><code>&nbsp;&nbsp;get: (obj, clave) =&gt; (clave in obj ? obj[clave] : "no hay"),</code><br><code>});</code><br><code>p.a = 1;</code><br><code>console.log(p.a, p.b);</code>',
      opciones: ['<code>1 undefined</code>', '<code>1 no hay</code>', '<code>no hay no hay</code>'],
      correcta: 1,
      explicacion: 'El handler solo intercepta <code>get</code>: la asignación <code>p.a = 1</code> llega al objeto de forma normal. Al leer, la trampa devuelve el valor si existe, o «no hay».',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const precio = {</code><br><code>&nbsp;&nbsp;[Symbol.toPrimitive](tipo) { return tipo === "number" ? 10 : "diez"; },</code><br><code>};</code><br><code>console.log(+precio, `${precio}`);</code>',
      opciones: ['<code>10 10</code>', '<code>10 diez</code>', '<code>NaN [object Object]</code>'],
      correcta: 1,
      explicacion: 'El motor llama a <code>Symbol.toPrimitive</code> cada vez que necesita convertir el objeto, y le avisa qué prefiere: <code>"number"</code> para el <code>+</code> unario y <code>"string"</code> para el template literal.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>function tag(partes, ...valores) { return partes.length; }</code><br><code>console.log(tag`a${1}b${2}c`);</code>',
      opciones: ['<code>2</code>', '<code>3</code>', '<code>5</code>'],
      correcta: 1,
      explicacion: 'El tag recibe los trozos de texto por un lado (<code>["a", "b", "c"]</code>) y los valores por otro (<code>[1, 2]</code>). Siempre hay un trozo más que valores, aunque alguno sea un texto vacío.',
    },
  ],
};

export const retoMetaOrden = {
  id: 'reto-meta-orden',
  titulo: 'Un proxy que lo anota todo',
  codigo: `const usuario = new Proxy({ nombre: "Ana" }, {
  get(obj, clave) {
    console.log("lee", String(clave));
    return Reflect.get(obj, clave);
  },
  set(obj, clave, valor) {
    console.log("escribe", clave);
    return Reflect.set(obj, clave, valor);
  },
});

usuario.edad = 30;
console.log(usuario.nombre);
console.log("edad" in usuario);`,
  salida: ['escribe edad', 'lee nombre', 'Ana', 'true'],
  inicio: [2, 3, 0, 1],
  explicacion:
    'La asignación pasa por la trampa <code>set</code> y la lectura por <code>get</code>, que imprime antes de devolver el valor. El operador <code>in</code> usa otra trampa, <code>has</code>, que este handler no define: la operación llega al objeto sin pasar por ningún <code>console.log</code>.',
};

export const retoMetaDetective = {
  id: 'reto-meta-detective',
  titulo: 'Una trampa que no avisa que salió bien',
  codigo: `"use strict";
const producto = new Proxy({}, {
  set(obj, clave, valor) {
    if (clave === "precio" && valor < 0) throw new RangeError("Precio negativo");
    obj[clave] = valor;
  },
});

producto.precio = 10;`,
  error: `app.js:9
producto.precio = 10;
                ^

TypeError: 'set' on proxy: trap returned falsish for property 'precio'`,
  culpable: 5,
  hallazgo:
    'La trampa <code>set</code> tiene que devolver <code>true</code> para decir que la asignación salió bien. Esta guarda el valor, pero no devuelve nada: <code>undefined</code> es «falsish», y en modo estricto eso es un <code>TypeError</code>.',
  pista: 'El mensaje dice que la trampa «devolvió algo falso». ¿Qué devuelve la función <code>set</code>?',
  arreglos: [
    {
      texto: 'Cambiar la línea 5 por <code>return Reflect.set(obj, clave, valor);</code>',
      correcta: true,
      porque: '<code>Reflect.set</code> hace la asignación normal y devuelve <code>true</code> o <code>false</code> según cómo salió: justo lo que espera el proxy.',
    },
    {
      texto: 'Quitar el <code>"use strict"</code> de la línea 1',
      correcta: false,
      porque: 'Fuera del modo estricto el error desaparece, pero el problema sigue ahí: en un módulo o dentro de una clase, que siempre son estrictos, vuelve a fallar.',
    },
    {
      texto: 'Quitar la validación de la línea 4',
      correcta: false,
      porque: 'La validación no es el problema: el precio <code>10</code> ni siquiera la activa. Lo que falta es el valor de retorno.',
    },
  ],
};

export const retoMetaLab = {
  id: 'reto-meta-lab',
  titulo: 'Valores por defecto con un proxy',
  inicial: `// Escribe conDefecto(objeto, valor): devuelve un proxy que lee las propiedades
// del objeto, pero si una propiedad NO existe, devuelve "valor" en su lugar.
// Ojo: una propiedad que existe y vale 0, "" o false se respeta.

const stock = conDefecto({ pan: 4, leche: 0 }, "sin datos");
console.log(stock.pan, stock.leche, stock.huevos);
`,
  verificaciones: [
    { texto: 'Imprime <code>4 0 sin datos</code>', prueba: 'return __salida.join("|") === "4 0 sin datos";' },
    { texto: 'Respeta los valores falsy que existen', prueba: 'const p = conDefecto({ a: "", b: false, c: null }, 1); return p.a === "" && p.b === false && p.c === null;' },
    { texto: 'No agrega nada al objeto original', prueba: 'const o = { a: 1 }; const p = conDefecto(o, 0); p.z; return Object.keys(o).join() === "a";' },
    { texto: 'Se puede seguir escribiendo en él', prueba: 'const o = {}; const p = conDefecto(o, 0); p.x = 5; return o.x === 5 && p.x === 5;' },
  ],
  pistas: [
    'Devuelve <code>new Proxy(objeto, { get(obj, clave) { … } })</code>. Sin trampa <code>set</code>, la escritura funciona normal.',
    'Para saber si la propiedad existe, no mires su valor: usa <code>clave in obj</code>.',
    '<code>return clave in obj ? Reflect.get(obj, clave) : valor;</code>',
  ] as [string, string, string],
  solucion: `function conDefecto(objeto, valor) {
  return new Proxy(objeto, {
    get(obj, clave) {
      return clave in obj ? Reflect.get(obj, clave) : valor;
    },
  });
}

const stock = conDefecto({ pan: 4, leche: 0 }, "sin datos");
console.log(stock.pan, stock.leche, stock.huevos);`,
  explicacion:
    '<p>Preguntar con <code>in</code> en vez de mirar el valor es lo que distingue «no está» de «está y vale 0». Es la misma diferencia que hay entre <code>??</code> y <code>||</code>. Y como el proxy solo intercepta las lecturas, todo lo demás llega al objeto original sin cambios.</p>',
};
