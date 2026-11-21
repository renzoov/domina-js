// Ejercicios de la sección 5: «Objetos».

/* ── 5.1 Objetos literales ─────────────────────────────────── */
export const literalesAuto = {
  id: 'literales-auto',
  titulo: 'Claves, valores y accesos',
  preguntas: [
    {
      pregunta: 'Con <code>const nombre = "Ana";</code>, ¿qué objeto crea <code>{ nombre }</code>?',
      opciones: ['<code>{ nombre: "Ana" }</code>', '<code>{ "Ana": "Ana" }</code>', 'Da error'],
      correcta: 0,
      explicacion: 'Es la forma <b>abreviada</b>: si la clave y la variable se llaman igual, basta con escribirla una vez.',
    },
    {
      pregunta: 'Si la clave está guardada en una variable <code>campo</code>, ¿cómo lees la propiedad?',
      opciones: ['<code>obj.campo</code>', '<code>obj[campo]</code>', '<code>obj.{campo}</code>'],
      correcta: 1,
      explicacion: '<code>obj.campo</code> busca una propiedad llamada literalmente "campo". Con corchetes se usa el <b>valor</b> de la variable.',
    },
    {
      pregunta: '¿Qué devuelve leer una propiedad que no existe, como <code>{}.edad</code>?',
      opciones: ['<code>null</code>', '<code>undefined</code>', '<code>ReferenceError</code>'],
      correcta: 1,
      explicacion: 'No es un error: da <code>undefined</code>. El error llega si intentas leer una propiedad <b>de</b> ese <code>undefined</code>.',
    },
    {
      pregunta: '<code>const obj = { a: 1 }; obj.a = 2;</code> ¿Funciona?',
      opciones: ['No: es <code>const</code>', 'Sí: <code>const</code> impide reasignar la variable, no cambiar el objeto'],
      correcta: 1,
      explicacion: 'La variable sigue apuntando al mismo objeto; lo que cambia es su contenido. Para congelar el contenido hay herramientas que verás en <em>Inmutabilidad</em>.',
    },
  ],
};

export const literalesOrden = {
  id: 'literales-orden',
  titulo: 'Claves calculadas',
  codigo: `const clave = "color";
const auto = { marca: "Fiat", [clave]: "rojo", "año": 2020 };

console.log(auto.color);
console.log(auto["año"]);
console.log("marca" in auto);
console.log(auto.modelo);`,
  salida: ['rojo', '2020', 'true', 'undefined'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>[clave]</code> es una <b>clave calculada</b>: usa el valor de la variable, así que crea la propiedad <code>color</code>. <code>"año"</code> se lee con corchetes porque lleva tilde y ñ (aunque <code>auto.año</code> también funcionaría). <code>in</code> pregunta si la clave existe, y <code>modelo</code> no existe: <code>undefined</code>.',
};

export const literalesDetective = {
  id: 'literales-detective',
  titulo: 'Una propiedad de algo que no existe',
  codigo: `const usuario = {
  nombre: "Ana",
  contacto: { email: "ana@mail.com" },
};

console.log(usuario.nombre);
console.log(usuario.direccion.ciudad);`,
  error: `Ana
perfil.js:7
console.log(usuario.direccion.ciudad);
                              ^

TypeError: Cannot read properties of undefined (reading 'ciudad')`,
  culpable: 7,
  hallazgo:
    '<code>usuario</code> no tiene <code>direccion</code>, así que <code>usuario.direccion</code> vale <code>undefined</code>. Leer <code>.ciudad</code> de <code>undefined</code> es el error. El mensaje te dice qué propiedad intentabas leer: <code>ciudad</code>.',
  pista: 'El mensaje dice <em>reading \'ciudad\'</em>: ¿qué valía lo que está justo a la izquierda de <code>.ciudad</code>?',
  arreglos: [
    {
      texto: 'Usar encadenamiento opcional: <code>usuario.direccion?.ciudad</code>',
      correcta: true,
      porque: 'Si <code>direccion</code> no existe, <code>?.</code> corta y devuelve <code>undefined</code> sin error. Puedes sumar un valor por defecto: <code>?? "sin ciudad"</code>.',
    },
    {
      texto: 'Escribirlo con corchetes: <code>usuario["direccion.ciudad"]</code>',
      correcta: false,
      porque: 'No da error, pero busca una propiedad llamada literalmente <code>"direccion.ciudad"</code>, con el punto incluido. Siempre devuelve <code>undefined</code>.',
    },
    {
      texto: 'Declarar <code>usuario</code> con <code>let</code>',
      correcta: false,
      porque: 'La forma de declarar la variable no cambia lo que tiene el objeto: <code>direccion</code> sigue sin existir.',
    },
  ],
};

export const literalesLab = {
  id: 'literales-lab',
  titulo: 'Un producto con método',
  inicial: `const nombre = "Mate";
const precio = 120;

// Crea el objeto producto con la forma abreviada { nombre, precio }
// y un método describir() que devuelva "Mate cuesta 120",
// usando this.nombre y this.precio.

console.log(producto.describir());
`,
  verificaciones: [
    { texto: 'Imprime <code>Mate cuesta 120</code>', prueba: 'return __salida.some((l) => l === "Mate cuesta 120");' },
    { texto: 'Usa la forma abreviada para <code>nombre</code> y <code>precio</code>', prueba: String.raw`return /\{\s*nombre\s*,\s*precio\s*,/.test(__codigo) || /\{\s*precio\s*,\s*nombre\s*,/.test(__codigo);` },
    { texto: '<code>describir</code> usa <code>this</code>: si cambia el precio, cambia el texto', prueba: 'producto.precio = 200; return producto.describir() === "Mate cuesta 200";' },
  ],
  pistas: [
    'Empieza así: <code>const producto = { nombre, precio, … };</code>, antes del <code>console.log</code>.',
    'Un método se escribe dentro del objeto como <code>describir() { … }</code>.',
    'Dentro del método: <code>return `${this.nombre} cuesta ${this.precio}`;</code>',
  ] as [string, string, string],
  solucion: `const nombre = "Mate";
const precio = 120;

const producto = {
  nombre,
  precio,
  describir() {
    return \`\${this.nombre} cuesta \${this.precio}\`;
  },
};

console.log(producto.describir());`,
  explicacion:
    '<p>La forma abreviada ahorra repetir <code>nombre: nombre</code>. Y <code>this</code>, dentro de un método, es el objeto desde el que se llamó: por eso <code>describir</code> siempre usa los datos actuales. Vas a ver <code>this</code> a fondo en la sección de Funciones.</p>',
};

/* ── 5.2 Recorrer objetos ──────────────────────────────────── */
export const recorrerAuto = {
  id: 'recorrer-auto',
  titulo: 'Claves, valores y entradas',
  preguntas: [
    {
      pregunta: '¿Qué devuelve <code>Object.entries({ a: 1, b: 2 })</code>?',
      opciones: ['<code>["a", "b"]</code>', '<code>[1, 2]</code>', '<code>[["a", 1], ["b", 2]]</code>'],
      correcta: 2,
      explicacion: '<code>keys</code> da las claves, <code>values</code> los valores y <code>entries</code> los pares <code>[clave, valor]</code>.',
    },
    {
      pregunta: '¿Se puede usar <code>for...of</code> directamente con un objeto literal?',
      opciones: ['Sí', 'No: un objeto no es iterable; recorre <code>Object.keys</code>, <code>values</code> o <code>entries</code>'],
      correcta: 1,
      explicacion: '<code>for (const x of obj)</code> lanza <code>TypeError: obj is not iterable</code>. Los arrays, textos, Map y Set sí son iterables.',
    },
    {
      pregunta: '¿Qué ventaja tiene <code>Object.hasOwn(obj, "clave")</code> sobre <code>"clave" in obj</code>?',
      opciones: [
        'Ninguna',
        'Solo mira las propiedades <b>propias</b> del objeto, no las heredadas de su prototipo',
        'Es más corta',
      ],
      correcta: 1,
      explicacion: '<code>"toString" in {}</code> da <code>true</code> porque <code>toString</code> se hereda. <code>Object.hasOwn</code> (ES2022) da <code>false</code>.',
    },
    {
      pregunta: '¿Qué hace <code>Object.fromEntries</code>?',
      opciones: ['Lo contrario de <code>entries</code>: arma un objeto a partir de pares <code>[clave, valor]</code>', 'Borra las entradas', 'Copia un objeto en profundidad'],
      correcta: 0,
      explicacion: 'Con <code>entries</code> → <code>map</code> → <code>fromEntries</code> transformas un objeto entero en otro nuevo.',
    },
  ],
};

export const recorrerOrden = {
  id: 'recorrer-orden',
  titulo: 'El orden de las claves',
  codigo: `const obj = { b: 1, 2: "dos", a: 3, 1: "uno" };

console.log(Object.keys(obj).join(","));
console.log(Object.hasOwn(obj, "a"));
console.log(Object.hasOwn(obj, "toString"));
console.log("toString" in obj);`,
  salida: ['1,2,b,a', 'true', 'false', 'true'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'Las claves que parecen números enteros van <b>primero</b> y en orden ascendente; el resto, en el orden en que se crearon. <code>toString</code> no es propia del objeto, pero se hereda: <code>Object.hasOwn</code> dice que no y <code>in</code> dice que sí.',
};

export const recorrerDetective = {
  id: 'recorrer-detective',
  titulo: 'Un objeto que no se deja recorrer',
  codigo: `const notas = { ana: 8, luis: 6, eva: 9 };

for (const nota of notas) {
  console.log(nota);
}`,
  error: `notas.js:3
for (const nota of notas) {
                   ^

TypeError: notas is not iterable`,
  culpable: 3,
  hallazgo:
    '<code>for...of</code> solo funciona con <b>iterables</b> (arrays, textos, Map, Set…). Un objeto literal no lo es: hay que pedirle primero sus valores, sus claves o sus entradas.',
  pista: '<em>is not iterable</em>: ¿qué tipos de valores se pueden recorrer con <code>for...of</code>? ¿Es <code>notas</code> uno de ellos?',
  arreglos: [
    {
      texto: '<code>for (const nota of Object.values(notas))</code>',
      correcta: true,
      porque: '<code>Object.values</code> devuelve un array con los valores: imprime 8, 6 y 9.',
    },
    {
      texto: '<code>for (const nota in notas)</code>',
      correcta: false,
      porque: 'Ya no da error, pero <code>for...in</code> recorre las <b>claves</b>: imprimiría ana, luis y eva, no las notas.',
    },
    {
      texto: '<code>for (const nota of Array.from(notas))</code>',
      correcta: false,
      porque: '<code>Array.from</code> de un objeto sin <code>length</code> da un array vacío: el bucle no imprime nada y el fallo queda escondido.',
    },
  ],
};

export const recorrerLab = {
  id: 'recorrer-lab',
  titulo: 'Rebajar todos los precios',
  inicial: `const precios = { pan: 1.5, leche: 2, huevos: 3 };

// Escribe aplicarDescuento(obj, porcentaje): debe devolver un objeto NUEVO
// con cada precio rebajado, sin modificar el original.
// Usa Object.entries y Object.fromEntries.

console.log(aplicarDescuento(precios, 50));
console.log(precios.pan);
`,
  verificaciones: [
    { texto: '<code>aplicarDescuento(precios, 50)</code> da <code>{ pan: 0.75, leche: 1, huevos: 1.5 }</code>', prueba: 'return JSON.stringify(aplicarDescuento({ pan: 1.5, leche: 2, huevos: 3 }, 50)) === \'{"pan":0.75,"leche":1,"huevos":1.5}\';' },
    { texto: 'No modifica el original: <code>precios.pan</code> sigue en <code>1.5</code>', prueba: 'return precios.pan === 1.5 && __salida.at(-1) === "1.5";' },
    { texto: 'Usa <code>Object.entries</code> y <code>Object.fromEntries</code>', prueba: String.raw`return /Object\.entries\s*\(/.test(__codigo) && /Object\.fromEntries\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function aplicarDescuento(obj, porcentaje) { … }</code> antes de los <code>console.log</code>.',
    '<code>Object.entries(obj)</code> te da pares <code>[clave, valor]</code>: transfórmalos con <code>.map(([clave, valor]) => [clave, …])</code>.',
    'El precio rebajado es <code>valor * (1 - porcentaje / 100)</code>. Envuelve todo en <code>Object.fromEntries(…)</code> y devuélvelo.',
  ] as [string, string, string],
  solucion: `const precios = { pan: 1.5, leche: 2, huevos: 3 };

function aplicarDescuento(obj, porcentaje) {
  return Object.fromEntries(
    Object.entries(obj).map(([clave, valor]) => [clave, valor * (1 - porcentaje / 100)])
  );
}

console.log(aplicarDescuento(precios, 50));
console.log(precios.pan);`,
  explicacion:
    '<p><code>entries</code> → <code>map</code> → <code>fromEntries</code> es el patrón para transformar un objeto sin tocar el original: lo conviertes en una lista de pares, la transformas como un array cualquiera y la vuelves a armar.</p>',
};

/* ── 5.3 Desestructuración y spread ────────────────────────── */
export const desestAuto = {
  id: 'desest-auto',
  titulo: 'Sacar y juntar propiedades',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>const { edad: años } = persona;</code>?',
      opciones: ['Crea una variable <code>edad</code>', 'Crea una variable <code>años</code> con el valor de <code>persona.edad</code>', 'Cambia el nombre de la propiedad en el objeto'],
      correcta: 1,
      explicacion: 'Con <code>clave: nombreNuevo</code> lees la propiedad y la guardas con otro nombre. El objeto no cambia.',
    },
    {
      pregunta: 'En <code>const { pais = "Perú" } = datos;</code>, ¿cuándo se usa <code>"Perú"</code>?',
      opciones: ['Siempre', 'Cuando <code>datos.pais</code> es <code>undefined</code>', 'Cuando <code>datos.pais</code> es falsy'],
      correcta: 1,
      explicacion: 'Los valores por defecto solo se aplican con <code>undefined</code>. Si vale <code>null</code> o <code>""</code>, se queda con ese valor.',
    },
    {
      pregunta: '<code>{ ...a, ...b }</code>: si los dos tienen la clave <code>color</code>, ¿cuál gana?',
      opciones: ['La de <code>a</code>', 'La de <code>b</code>: la que aparece más tarde pisa a la anterior', 'Da error'],
      correcta: 1,
      explicacion: 'El spread copia en orden, así que lo que va a la derecha tiene la última palabra. Por eso se pone primero lo predeterminado y después lo del usuario.',
    },
    {
      pregunta: '¿Qué guarda <code>resto</code> en <code>const { id, ...resto } = { id: 1, a: 2, b: 3 };</code>?',
      opciones: ['<code>[2, 3]</code>', '<code>{ a: 2, b: 3 }</code>', '<code>3</code>'],
      correcta: 1,
      explicacion: 'El <b>rest</b> junta en un objeto nuevo todas las propiedades que no se nombraron. Es útil para quitar una propiedad sin modificar el original.',
    },
  ],
};

export const desestOrden = {
  id: 'desest-orden',
  titulo: 'Defectos, renombres y quién gana',
  codigo: `const { nombre, edad = 18, ciudad: lugar = "?" } = { nombre: "Luis", ciudad: "Quito" };

const base = { tema: "claro", letra: 14 };
const prefs = { ...base, tema: "oscuro" };

console.log(nombre, edad);
console.log(lugar);
console.log(prefs.tema);
console.log({ tema: "oscuro", ...base }.tema);`,
  salida: ['Luis 18', 'Quito', 'oscuro', 'claro'],
  inicio: [2, 3, 0, 1],
  explicacion:
    '<code>edad</code> no existe en el objeto, así que toma su valor por defecto. <code>ciudad</code> sí existe y se guarda como <code>lugar</code>. Con el spread, gana lo que está más a la derecha: en el último caso, <code>...base</code> pisa el <code>"oscuro"</code>.',
};

export const desestDetective = {
  id: 'desest-detective',
  titulo: 'Desestructurar lo que no llegó',
  codigo: `function saludar({ nombre, idioma }) {
  return idioma === "en" ? \`Hi, \${nombre}\` : \`Hola, \${nombre}\`;
}

console.log(saludar({ nombre: "Ana" }));
console.log(saludar());`,
  error: `Hola, Ana
saludo.js:1
function saludar({ nombre, idioma }) {
                 ^

TypeError: Cannot destructure property 'nombre' of 'undefined' as it is undefined.`,
  culpable: 1,
  hallazgo:
    'La segunda llamada no pasa ningún argumento, así que el parámetro vale <code>undefined</code>, y desestructurar <code>undefined</code> es un error. Como la función se llama sin argumentos a propósito, el arreglo va en la definición, en la línea 1.',
  pista: 'El error apunta a la línea 1. ¿Qué recibe el parámetro cuando se llama a <code>saludar()</code> sin nada?',
  arreglos: [
    {
      texto: 'Dar un objeto vacío por defecto: <code>function saludar({ nombre = "visitante", idioma } = {})</code>',
      correcta: true,
      porque: 'Si no llega nada, el parámetro vale <code>{}</code>, y <code>nombre</code> toma su propio valor por defecto. <code>saludar()</code> devuelve <code>Hola, visitante</code>.',
    },
    {
      texto: 'Rodear la línea 6 con <code>try/catch</code>',
      correcta: false,
      porque: 'Evita que el programa se rompa, pero la función sigue sin poder llamarse sin argumentos.',
    },
    {
      texto: 'Cambiar los parámetros a <code>function saludar(nombre, idioma)</code>',
      correcta: false,
      porque: 'Ya no daría error, pero <code>saludar({ nombre: "Ana" })</code> recibiría el objeto entero como <code>nombre</code> e imprimiría <code>Hola, [object Object]</code>.',
    },
  ],
};

export const desestLab = {
  id: 'desest-lab',
  titulo: 'Opciones con valores predeterminados',
  inicial: `const predeterminadas = { tema: "claro", idioma: "es", avisos: true };

// Escribe configurar(opciones): devuelve un objeto NUEVO con las
// predeterminadas y, encima, las opciones que pase el usuario.
// No debe modificar predeterminadas.

console.log(configurar({ tema: "oscuro" }));
`,
  verificaciones: [
    { texto: '<code>configurar({ tema: "oscuro" })</code> da <code>{ tema: \'oscuro\', idioma: \'es\', avisos: true }</code>', prueba: 'return JSON.stringify(configurar({ tema: "oscuro" })) === \'{"tema":"oscuro","idioma":"es","avisos":true}\';' },
    { texto: 'No modifica <code>predeterminadas</code>', prueba: 'configurar({ idioma: "en" }); return predeterminadas.idioma === "es" && predeterminadas.tema === "claro";' },
    { texto: '<code>configurar()</code> sin argumentos devuelve las predeterminadas', prueba: 'return JSON.stringify(configurar()) === JSON.stringify(predeterminadas);' },
  ],
  pistas: [
    'Empieza con <code>function configurar(opciones) { … }</code> antes del <code>console.log</code>.',
    'Un objeto nuevo con todo lo de <code>predeterminadas</code>: <code>{ ...predeterminadas }</code>.',
    'Agrega las opciones después, para que ganen: <code>return { ...predeterminadas, ...opciones };</code>',
  ] as [string, string, string],
  solucion: `const predeterminadas = { tema: "claro", idioma: "es", avisos: true };

function configurar(opciones) {
  return { ...predeterminadas, ...opciones };
}

console.log(configurar({ tema: "oscuro" }));`,
  explicacion:
    '<p>Es uno de los usos más comunes del spread: primero lo predeterminado y después lo del usuario, que gana porque va a la derecha. Además, <code>...undefined</code> no copia nada, así que <code>configurar()</code> funciona sin argumentos.</p>',
};

/* ── 5.4 Copias superficiales y profundas ──────────────────── */
export const copiasAuto = {
  id: 'copias-auto',
  titulo: 'Un nivel o todos',
  preguntas: [
    {
      pregunta: '<code>const b = a;</code> con un objeto <code>a</code>, ¿crea una copia?',
      opciones: ['Sí, superficial', 'Sí, profunda', 'No: <code>b</code> apunta al <b>mismo</b> objeto'],
      correcta: 2,
      explicacion: 'Asignar un objeto copia la <b>referencia</b>. Para tener otro objeto necesitas <code>{ ...a }</code> o <code>structuredClone(a)</code>.',
    },
    {
      pregunta: '¿Qué copia el spread <code>{ ...a }</code>?',
      opciones: ['Todos los niveles', 'Solo el primer nivel: los objetos de adentro siguen compartidos', 'Nada'],
      correcta: 1,
      explicacion: 'Es una copia <b>superficial</b>: si una propiedad es un objeto o un array, se copia la referencia.',
    },
    {
      pregunta: '¿Qué problema tiene <code>JSON.parse(JSON.stringify(obj))</code> como copia profunda?',
      opciones: [
        'Ninguno',
        'Pierde funciones y <code>undefined</code>, convierte fechas en texto y falla con referencias circulares',
        'Es superficial',
      ],
      correcta: 1,
      explicacion: 'Era el truco antes de 2022. <code>structuredClone</code> conserva fechas, Map, Set y referencias circulares.',
    },
    {
      pregunta: '¿Qué <b>no</b> puede copiar <code>structuredClone</code>?',
      opciones: ['Arrays dentro de objetos', 'Fechas', 'Funciones: lanza <code>DataCloneError</code>'],
      correcta: 2,
      explicacion: 'Copia datos, no comportamiento. Tampoco conserva el prototipo de las instancias de clases: devuelve objetos simples.',
    },
  ],
};

export const copiasOrden = {
  id: 'copias-orden',
  titulo: 'Quién comparte qué',
  codigo: `const a = { n: 1, sub: { n: 1 } };
const b = { ...a };
const c = structuredClone(a);

b.n = 2;
b.sub.n = 2;
c.sub.n = 3;

console.log(a.n);
console.log(a.sub.n);
console.log(c.sub.n);
console.log(a.sub === b.sub);`,
  salida: ['1', '2', '3', 'true'],
  inicio: [3, 1, 0, 2],
  explicacion:
    '<code>b.n</code> es del primer nivel: el original no cambia. Pero <code>b.sub</code> es el <b>mismo</b> objeto que <code>a.sub</code>, así que <code>a.sub.n</code> pasa a 2. <code>c</code> es una copia profunda: su <code>sub</code> es independiente.',
};

export const copiasDetective = {
  id: 'copias-detective',
  titulo: 'Clonar algo con un método',
  codigo: `const pedido = {
  items: [{ nombre: "pan", cantidad: 2 }],
  total() { return this.items.length; },
};

const copia = structuredClone(pedido);
copia.items[0].cantidad = 5;`,
  error: `pedido.js:6
const copia = structuredClone(pedido);
              ^

DOMException [DataCloneError]: total() { return this.items.length; } could not be cloned.`,
  culpable: 6,
  hallazgo:
    '<code>structuredClone</code> copia <b>datos</b>. <code>total</code> es una función, y las funciones no se pueden clonar. Lo que necesita copia profunda son los <code>items</code>, no el método.',
  pista: 'El mensaje dice qué no se pudo clonar. ¿Qué tipo de valor es <code>total</code>?',
  arreglos: [
    {
      texto: '<code>const copia = JSON.parse(JSON.stringify(pedido));</code>',
      correcta: false,
      porque: 'No lanza error, pero <code>JSON</code> descarta las funciones en silencio: <code>copia.total</code> no existe. El error queda escondido para más tarde.',
    },
    {
      texto: '<code>const copia = { ...pedido };</code>',
      correcta: false,
      porque: 'Conserva el método, pero la copia es superficial: <code>copia.items</code> es el mismo array, y cambiar la cantidad modifica el pedido original.',
    },
    {
      texto: '<code>const copia = { ...pedido, items: structuredClone(pedido.items) };</code>',
      correcta: true,
      porque: 'El spread conserva el método y <code>structuredClone</code> duplica solo los datos anidados. La copia es independiente donde hace falta.',
    },
  ],
};

export const copiasLab = {
  id: 'copias-lab',
  titulo: 'Una copia que no se filtra',
  inicial: `const carrito = {
  cliente: "Ana",
  creado: new Date(2026, 0, 15),
  items: [{ producto: "té", cantidad: 1 }],
};

function duplicar(c) {
  return { ...c };
}

const copia = duplicar(carrito);
copia.items[0].cantidad = 5;

console.log(carrito.items[0].cantidad);
`,
  verificaciones: [
    { texto: 'Imprime <code>1</code>: el carrito original no cambia', prueba: 'return __salida.at(-1) === "1";' },
    { texto: '<code>duplicar</code> copia todos los niveles', prueba: 'const o = { a: { b: { c: 1 } } }; const c = duplicar(o); c.a.b.c = 2; return o.a.b.c === 1;' },
    { texto: 'Las fechas siguen siendo fechas en la copia', prueba: 'return duplicar({ d: new Date(0) }).d instanceof Date;' },
  ],
  pistas: [
    'Ejecuta el código: imprime 5 porque el spread solo copia el primer nivel y <code>items</code> queda compartido.',
    'Necesitas una copia profunda que además conserve la fecha <code>creado</code>. <code>JSON</code> la convertiría en texto.',
    'Cambia el cuerpo de <code>duplicar</code> por <code>return structuredClone(c);</code>',
  ] as [string, string, string],
  solucion: `const carrito = {
  cliente: "Ana",
  creado: new Date(2026, 0, 15),
  items: [{ producto: "té", cantidad: 1 }],
};

function duplicar(c) {
  return structuredClone(c);
}

const copia = duplicar(carrito);
copia.items[0].cantidad = 5;

console.log(carrito.items[0].cantidad);`,
  explicacion:
    '<p>Con <code>structuredClone</code>, cada nivel de la copia es un objeto nuevo, y la fecha sigue siendo una <code>Date</code>. Úsalo cuando los datos tengan objetos o arrays adentro y vayas a modificar la copia.</p>',
};

/* ── 5.5 JSON ─────────────────────────────────────────────── */
export const jsonAuto = {
  id: 'json-auto',
  titulo: 'Texto con forma de objeto',
  preguntas: [
    {
      pregunta: '¿Qué devuelve <code>JSON.stringify({ a: 1 })</code>?',
      opciones: ['Un objeto', 'El texto <code>\'{"a":1}\'</code>', 'Un array'],
      correcta: 1,
      explicacion: '<code>stringify</code> convierte un valor en <b>texto</b> JSON, listo para guardar o enviar. <code>parse</code> hace el camino inverso.',
    },
    {
      pregunta: '¿Cuál de estos textos es JSON válido?',
      opciones: ["<code>{'nombre': 'Ana'}</code>", '<code>{nombre: "Ana"}</code>', '<code>{"nombre": "Ana"}</code>'],
      correcta: 2,
      explicacion: 'JSON exige comillas <b>dobles</b> en las claves y en los textos. Tampoco admite comas finales ni comentarios.',
    },
    {
      pregunta: '¿Qué pasa con una fecha al hacer <code>JSON.parse(JSON.stringify({ d: new Date() }))</code>?',
      opciones: ['Sigue siendo una fecha', 'Se convierte en un texto ISO como <code>"2026-11-20T…Z"</code>', 'Desaparece'],
      correcta: 1,
      explicacion: 'JSON no tiene tipo fecha. Para recuperarla, usa una función <em>reviver</em> en <code>JSON.parse</code> o haz <code>new Date(texto)</code>.',
    },
    {
      pregunta: '¿Qué hace <code>import config from "./config.json" with { type: "json" }</code>?',
      opciones: [
        'Da error: no se puede importar JSON',
        'Importa el archivo JSON ya convertido en objeto (JSON modules, ES2025)',
        'Importa el texto sin convertir',
      ],
      correcta: 1,
      explicacion: 'Los <em>import attributes</em> le dicen al runtime que el archivo es JSON. Funciona en navegadores modernos, Node.js, Deno y Bun.',
    },
  ],
};

export const jsonOrden = {
  id: 'json-orden',
  titulo: 'Lo que JSON no guarda',
  codigo: `const datos = { a: 1, b: undefined, c: () => 1, d: NaN, e: [undefined] };

console.log(JSON.stringify(datos));
console.log(JSON.stringify("hola"));
console.log(JSON.parse("[1, 2]").length);
console.log(typeof JSON.parse("true"));`,
  salida: ['{"a":1,"d":null,"e":[null]}', '"hola"', '2', 'boolean'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'En un objeto, las propiedades con <code>undefined</code> o funciones <b>desaparecen</b>; <code>NaN</code> se convierte en <code>null</code>, y dentro de un array, <code>undefined</code> también. Un texto se guarda con sus comillas. <code>parse</code> acepta cualquier valor JSON, no solo objetos.',
};

export const jsonDetective = {
  id: 'json-detective',
  titulo: 'Un JSON con comillas simples',
  codigo: `const texto = "{'nombre': 'Ana', 'edad': 31}";
const usuario = JSON.parse(texto);
console.log(usuario.nombre);`,
  error: `usuario.js:2
const usuario = JSON.parse(texto);
                     ^

SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)`,
  culpable: 1,
  hallazgo:
    '<code>JSON.parse</code> falla en la línea 2, pero el problema está en el texto de la línea 1: usa comillas <b>simples</b>, y JSON solo admite comillas dobles. La posición 1 es justo la primera <code>\'</code>.',
  pista: 'El error dice <em>at position 1</em>: ¿qué carácter hay en la posición 1 del texto? (La primera es la posición 0.)',
  arreglos: [
    {
      texto: 'Usar comillas dobles dentro del texto: <code>\'{"nombre": "Ana", "edad": 31}\'</code>',
      correcta: true,
      porque: 'Ahora el texto es JSON válido y <code>usuario.nombre</code> imprime <code>Ana</code>. Envolver el texto con comillas simples permite usar dobles adentro sin escaparlas.',
    },
    {
      texto: 'Cambiar <code>JSON.parse</code> por <code>eval</code>',
      correcta: false,
      porque: 'Funcionaría, pero <code>eval</code> ejecuta cualquier código que venga en el texto: si los datos vienen de afuera, es un agujero de seguridad grave.',
    },
    {
      texto: 'Hacer <code>JSON.parse(JSON.stringify(texto))</code>',
      correcta: false,
      porque: 'No da error, pero devuelve el mismo texto, no un objeto: <code>usuario.nombre</code> es <code>undefined</code>.',
    },
  ],
};

export const jsonLab = {
  id: 'json-lab',
  titulo: 'Leer sin romperse',
  inicial: `// Escribe leerConfig(texto): devuelve el objeto que describe el texto JSON,
// o un objeto vacío {} si el texto no es JSON válido. Nunca debe lanzar un error.

console.log(leerConfig('{"tema": "oscuro"}').tema);
console.log(leerConfig("{tema: oscuro}"));
`,
  verificaciones: [
    { texto: 'Imprime <code>oscuro</code> y después <code>{}</code>', prueba: 'return __salida.join("|") === "oscuro|{}";' },
    { texto: 'Con un texto vacío devuelve <code>{}</code> sin lanzar error', prueba: 'return JSON.stringify(leerConfig("")) === "{}";' },
    { texto: 'Usa <code>JSON.parse</code> dentro de un <code>try</code>', prueba: String.raw`return /\btry\s*\{[\s\S]*JSON\.parse\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function leerConfig(texto) { … }</code> arriba de todo.',
    '<code>JSON.parse</code> lanza un <code>SyntaxError</code> si el texto no es válido: atrápalo con <code>try/catch</code>.',
    '<code>try { return JSON.parse(texto); } catch { return {}; }</code>',
  ] as [string, string, string],
  solucion: `function leerConfig(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return {};
  }
}

console.log(leerConfig('{"tema": "oscuro"}').tema);
console.log(leerConfig("{tema: oscuro}"));`,
  explicacion:
    '<p>Todo JSON que viene de afuera (un archivo, <code>localStorage</code>, una respuesta de red) puede llegar roto. Envolver el <code>JSON.parse</code> en un <code>try/catch</code> con un valor de respaldo evita que un dato malo tumbe todo el programa.</p>',
};

/* ── 5.6 Prototipos y la cadena de prototipos ──────────────── */
export const protoAuto = {
  id: 'proto-auto',
  titulo: 'Herencia por enlace',
  preguntas: [
    {
      pregunta: 'Si lees <code>obj.x</code> y <code>obj</code> no tiene <code>x</code>, ¿qué hace el motor?',
      opciones: ['Devuelve <code>undefined</code> enseguida', 'Busca <code>x</code> en el prototipo de <code>obj</code>, y así hacia arriba', 'Lanza <code>ReferenceError</code>'],
      correcta: 1,
      explicacion: 'Sube por la cadena de prototipos hasta encontrarla o llegar a <code>null</code>; solo entonces da <code>undefined</code>.',
    },
    {
      pregunta: '¿Qué hace <code>Object.create(base)</code>?',
      opciones: ['Copia <code>base</code>', 'Crea un objeto vacío cuyo prototipo es <code>base</code>', 'Crea una clase'],
      correcta: 1,
      explicacion: 'No copia nada: enlaza. Si después agregas algo a <code>base</code>, el objeto nuevo también lo "ve".',
    },
    {
      pregunta: '¿Dónde está el método <code>map</code> que usas en <code>[1, 2].map(…)</code>?',
      opciones: ['En cada array', 'En <code>Array.prototype</code>, compartido por todos los arrays', 'En <code>Object.prototype</code>'],
      correcta: 1,
      explicacion: 'Los métodos viven una sola vez en el prototipo y todos los arrays los heredan. Por eso no ocupan memoria en cada array.',
    },
    {
      pregunta: '¿Cuál es la forma recomendada de leer el prototipo de un objeto?',
      opciones: ['<code>obj.__proto__</code>', '<code>Object.getPrototypeOf(obj)</code>', '<code>obj.prototype</code>'],
      correcta: 1,
      explicacion: '<code>__proto__</code> existe por compatibilidad, pero se desaconseja. <code>obj.prototype</code> es otra cosa: la propiedad de las <b>funciones</b> constructoras.',
    },
  ],
};

export const protoOrden = {
  id: 'proto-orden',
  titulo: 'Propia o heredada',
  codigo: `const base = { saludo: "hola", tipo: "base" };
const hijo = Object.create(base);
hijo.tipo = "hijo";

console.log(hijo.saludo);
console.log(hijo.tipo);
console.log(Object.hasOwn(hijo, "saludo"));
console.log(Object.getPrototypeOf(hijo) === base);`,
  salida: ['hola', 'hijo', 'false', 'true'],
  inicio: [1, 3, 0, 2],
  explicacion:
    '<code>saludo</code> se hereda de <code>base</code>. <code>tipo</code> existe en los dos, pero la búsqueda se detiene en la primera que encuentra: la propia de <code>hijo</code> <b>tapa</b> a la de <code>base</code>. <code>saludo</code> no es propia, y el prototipo de <code>hijo</code> es exactamente <code>base</code>.',
};

export const protoDetective = {
  id: 'proto-detective',
  titulo: 'Parece un array, pero no lo es',
  codigo: `const respuesta = { 0: "ana", 1: "luis", length: 2 };

console.log(respuesta.length);
const nombres = respuesta.map((n) => n.toUpperCase());
console.log(nombres);`,
  error: `2
lista.js:4
const nombres = respuesta.map((n) => n.toUpperCase());
                          ^

TypeError: respuesta.map is not a function`,
  culpable: 4,
  hallazgo:
    '<code>respuesta</code> tiene índices y <code>length</code>, pero es un objeto literal: su prototipo es <code>Object.prototype</code>, no <code>Array.prototype</code>. <code>map</code> no está en ningún eslabón de su cadena, así que vale <code>undefined</code>.',
  pista: '¿Dónde vive <code>map</code>? ¿Está ese objeto en la cadena de prototipos de <code>respuesta</code>?',
  arreglos: [
    {
      texto: 'Convertirlo en array primero: <code>Array.from(respuesta).map(…)</code>',
      correcta: true,
      porque: '<code>Array.from</code> crea un array de verdad a partir de un objeto "parecido a un array" (con índices y <code>length</code>), y los arrays heredan <code>map</code>.',
    },
    {
      texto: 'Agregar <code>map</code> a <code>Object.prototype</code>',
      correcta: false,
      porque: 'Modificar los prototipos nativos afecta a <b>todos</b> los objetos del programa y puede romper librerías. Es una práctica prohibida en código real.',
    },
    {
      texto: 'Usar <code>for...of</code> sobre <code>respuesta</code>',
      correcta: false,
      porque: 'Tampoco funciona: un objeto literal no es iterable, aunque tenga <code>length</code>. Daría <code>TypeError: respuesta is not iterable</code>.',
    },
  ],
};

export const protoLab = {
  id: 'proto-lab',
  titulo: 'Un método compartido',
  inicial: `const animal = {
  presentarse() {
    return \`\${this.nombre} dice \${this.sonido}\`;
  },
};

// Crea michi con Object.create(animal), con nombre "Michi" y sonido "miau".
// No copies presentarse: tiene que heredarlo.

console.log(michi.presentarse());
`,
  verificaciones: [
    { texto: 'Imprime <code>Michi dice miau</code>', prueba: 'return __salida.some((l) => l === "Michi dice miau");' },
    { texto: 'El prototipo de <code>michi</code> es <code>animal</code>', prueba: 'return Object.getPrototypeOf(michi) === animal;' },
    { texto: '<code>presentarse</code> no es propia de <code>michi</code>: la hereda', prueba: 'return !Object.hasOwn(michi, "presentarse") && Object.hasOwn(michi, "nombre");' },
  ],
  pistas: [
    'Crea el objeto enlazado: <code>const michi = Object.create(animal);</code>, antes del <code>console.log</code>.',
    'Agrégale sus propiedades propias: <code>michi.nombre = "Michi";</code> y lo mismo con <code>sonido</code>.',
    'Cuando llames a <code>michi.presentarse()</code>, <code>this</code> es <code>michi</code>, aunque el método viva en <code>animal</code>.',
  ] as [string, string, string],
  solucion: `const animal = {
  presentarse() {
    return \`\${this.nombre} dice \${this.sonido}\`;
  },
};

const michi = Object.create(animal);
michi.nombre = "Michi";
michi.sonido = "miau";

console.log(michi.presentarse());`,
  explicacion:
    '<p>El método vive una sola vez en <code>animal</code>, y cada objeto que lo tenga como prototipo lo usa con sus propios datos, porque <code>this</code> es el objeto que lo llama. Es exactamente lo que hacen las <b>clases</b> por debajo: los métodos van al prototipo y los datos, a cada instancia.</p>',
};

/* ── 5.7 Inmutabilidad ────────────────────────────────────── */
export const inmutAuto = {
  id: 'inmut-auto',
  titulo: 'Congelar, sellar, no mutar',
  preguntas: [
    {
      pregunta: '¿Qué diferencia hay entre <code>const</code> y <code>Object.freeze</code>?',
      opciones: [
        'Ninguna',
        '<code>const</code> impide reasignar la variable; <code>freeze</code> impide cambiar las propiedades del objeto',
        '<code>freeze</code> impide reasignar la variable',
      ],
      correcta: 1,
      explicacion: 'Son complementarios: <code>const</code> protege la flecha y <code>freeze</code> protege el objeto.',
    },
    {
      pregunta: '<code>Object.freeze</code> sobre un objeto con otro objeto adentro, ¿congela los dos?',
      opciones: ['Sí', 'No: solo el primer nivel; el de adentro sigue modificable'],
      correcta: 1,
      explicacion: 'Como la copia con spread, <code>freeze</code> es <b>superficial</b>. Para congelar todo, hay que recorrer el objeto.',
    },
    {
      pregunta: 'Fuera del modo estricto, ¿qué pasa al asignar a una propiedad congelada?',
      opciones: ['Lanza <code>TypeError</code>', 'No hace nada, en silencio', 'Cambia igual'],
      correcta: 1,
      explicacion: 'En modo estricto (módulos, clases, <code>"use strict"</code>) lanza <code>TypeError</code>; fuera de él, la asignación se ignora sin avisar.',
    },
    {
      pregunta: '¿Qué hace <code>lista.toSorted()</code> (ES2023) a diferencia de <code>lista.sort()</code>?',
      opciones: ['Ordena al revés', 'Devuelve un array nuevo ordenado y deja <code>lista</code> igual', 'Es más rápido'],
      correcta: 1,
      explicacion: '<code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> y <code>with</code> son las versiones que no mutan el original.',
    },
  ],
};

export const inmutOrden = {
  id: 'inmut-orden',
  titulo: 'Congelado a medias',
  codigo: `const config = Object.freeze({ modo: "prod", limites: { max: 10 } });
config.modo = "dev";
config.limites.max = 99;

const lista = [3, 1, 2];
const ordenada = lista.toSorted();

console.log(config.modo);
console.log(config.limites.max);
console.log(ordenada.join(","), lista.join(","));
console.log(Object.isFrozen(config.limites));`,
  salida: ['prod', '99', '1,2,3 3,1,2', 'false'],
  inicio: [1, 3, 2, 0],
  explicacion:
    'La asignación a <code>modo</code> se ignora en silencio: el objeto está congelado y este código no está en modo estricto. Pero <code>limites</code> es otro objeto, que no se congeló, y cambia a 99. <code>toSorted</code> devuelve un array nuevo y deja <code>lista</code> como estaba.',
};

export const inmutDetective = {
  id: 'inmut-detective',
  titulo: 'Modificar una configuración compartida',
  codigo: `"use strict";
const MONEDA = Object.freeze({ simbolo: "S/", decimales: 2 });

function formatearEntero(monto) {
  MONEDA.decimales = 0;
  return MONEDA.simbolo + " " + monto.toFixed(MONEDA.decimales);
}

console.log(formatearEntero(10));`,
  error: `precios.js:5
  MONEDA.decimales = 0;
                   ^

TypeError: Cannot assign to read only property 'decimales' of object '#<Object>'`,
  culpable: 5,
  hallazgo:
    '<code>MONEDA</code> está congelada a propósito: es una configuración que usa todo el programa. La función intenta cambiarla para su caso particular, y en modo estricto eso lanza un error.',
  pista: 'El error dice <em>read only property</em>. ¿Por qué es de solo lectura, y debería esta función estar cambiándola?',
  arreglos: [
    {
      texto: 'Quitar el <code>"use strict"</code> de la línea 1',
      correcta: false,
      porque: 'El error desaparece, pero la asignación se ignora en silencio: imprimiría <code>S/ 10.00</code>, con decimales. El fallo queda escondido.',
    },
    {
      texto: 'Quitar el <code>Object.freeze</code> de la línea 2',
      correcta: false,
      porque: 'Funcionaría para esta función, pero cambiaría la configuración de todo el programa: los demás precios también perderían los decimales.',
    },
    {
      texto: 'Usar un valor local: <code>return MONEDA.simbolo + " " + monto.toFixed(0);</code>, sin tocar <code>MONEDA</code>',
      correcta: true,
      porque: 'La función resuelve su caso sin modificar datos compartidos. Imprime <code>S/ 10</code>, y <code>MONEDA</code> sigue igual para todos.',
    },
  ],
};

export const inmutLab = {
  id: 'inmut-lab',
  titulo: 'Congelar en profundidad',
  inicial: `// Object.freeze solo congela el primer nivel.
// Escribe congelarProfundo(obj): congela obj y, recursivamente,
// cada objeto que tenga adentro. Debe devolver obj.

const ajustes = congelarProfundo({ tema: "oscuro", editor: { fuente: { tamaño: 14 } } });
ajustes.editor.fuente.tamaño = 30;

console.log(ajustes.editor.fuente.tamaño);
`,
  verificaciones: [
    { texto: 'Imprime <code>14</code>: el cambio no tuvo efecto', prueba: 'return __salida.at(-1) === "14";' },
    { texto: 'Todos los niveles quedan congelados', prueba: 'return Object.isFrozen(ajustes) && Object.isFrozen(ajustes.editor) && Object.isFrozen(ajustes.editor.fuente);' },
    { texto: 'Devuelve el mismo objeto que recibe', prueba: 'const o = { a: {} }; return congelarProfundo(o) === o;' },
  ],
  pistas: [
    'Es un problema recursivo, como los del tema <em>Recursión</em>: congela el objeto y aplica la misma función a cada valor que sea un objeto.',
    'Recorre los valores con <code>for (const valor of Object.values(obj))</code> y comprueba <code>typeof valor === "object" && valor !== null</code>.',
    'Dentro del <code>if</code>: <code>congelarProfundo(valor);</code>. Al final: <code>return Object.freeze(obj);</code>',
  ] as [string, string, string],
  solucion: `function congelarProfundo(obj) {
  for (const valor of Object.values(obj)) {
    if (typeof valor === "object" && valor !== null) {
      congelarProfundo(valor);
    }
  }
  return Object.freeze(obj);
}

const ajustes = congelarProfundo({ tema: "oscuro", editor: { fuente: { tamaño: 14 } } });
ajustes.editor.fuente.tamaño = 30;

console.log(ajustes.editor.fuente.tamaño);`,
  explicacion:
    '<p>La recursión recorre el objeto como un árbol: cada objeto de adentro se congela antes que el de afuera. <code>Object.freeze</code> devuelve el mismo objeto que recibe, así que puedes encadenarlo. Ojo: con estructuras muy grandes, congelar todo tiene un costo.</p>',
};
