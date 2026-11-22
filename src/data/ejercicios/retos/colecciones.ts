// Reto del motor de la sección 7: «Colecciones y datos».

export const retoColAuto = {
  id: 'reto-col-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>console.log([10, 1, 5].sort());</code>',
      opciones: ['<code>[ 1, 5, 10 ]</code>', '<code>[ 1, 10, 5 ]</code>', '<code>[ 10, 5, 1 ]</code>'],
      correcta: 1,
      explicacion: 'Sin función de comparación, <code>sort</code> ordena como texto: <code>"10"</code> va antes que <code>"5"</code> porque <code>"1"</code> va antes que <code>"5"</code>. Para números: <code>sort((a, b) =&gt; a - b)</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const a = [3, 1, 2];</code><br><code>const b = a.toSorted();</code><br><code>console.log(a[0], b[0]);</code>',
      opciones: ['<code>1 1</code>', '<code>3 1</code>', '<code>3 3</code>'],
      correcta: 1,
      explicacion: '<code>toSorted</code> (ES2023) devuelve un array nuevo ordenado y deja el original como estaba. <code>sort</code>, en cambio, ordena el mismo array.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log(new Set([1, "1", 1]).size);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>3</code>'],
      correcta: 1,
      explicacion: 'Un <code>Set</code> no repite valores, pero compara sin convertir tipos: el número <code>1</code> y el texto <code>"1"</code> son distintos.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const m = new Map();</code><br><code>m.set({}, "a");</code><br><code>m.set({}, "b");</code><br><code>console.log(m.size);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>0</code>'],
      correcta: 1,
      explicacion: 'Las claves objeto se comparan por referencia: cada <code>{}</code> es un objeto distinto, así que son dos claves.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const n = [1, 2, 3].map((x) =&gt; x * 2).filter((x) =&gt; x &gt; 2);</code><br><code>console.log(n.length);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>3</code>'],
      correcta: 1,
      explicacion: '<code>map</code> da <code>[2, 4, 6]</code> y <code>filter</code> se queda con los mayores que 2: <code>[4, 6]</code>.',
    },
  ],
};

export const retoColOrden = {
  id: 'reto-col-orden',
  titulo: 'Resumir unas ventas',
  codigo: `const ventas = [
  { producto: "pan", total: 3 },
  { producto: "leche", total: 5 },
  { producto: "pan", total: 2 },
];

const porProducto = Object.groupBy(ventas, (v) => v.producto);
console.log(Object.keys(porProducto).join(","));
console.log(porProducto.pan.length);

const unicos = new Set(ventas.map((v) => v.producto));
console.log(unicos.size);
console.log(ventas.reduce((suma, v) => suma + v.total, 0));
console.log(ventas.findLast((v) => v.producto === "pan").total);`,
  salida: ['pan,leche', '2', '2', '10', '2'],
  inicio: [3, 0, 4, 2, 1],
  explicacion:
    '<code>Object.groupBy</code> (ES2024) arma un grupo por clave, en el orden en que aparecen: primero <code>pan</code>, que tiene 2 ventas. El <code>Set</code> deja dos productos distintos, <code>reduce</code> suma los totales y <code>findLast</code> busca desde el final: la última venta de pan es de 2.',
};

export const retoColDetective = {
  id: 'reto-col-detective',
  titulo: 'Un Map leído como objeto',
  codigo: `const precios = new Map([["pan", 3], ["leche", 5]]);
const pan = precios["pan"];
console.log(pan.toFixed(2));`,
  error: `app.js:3
console.log(pan.toFixed(2));
                ^

TypeError: Cannot read properties of undefined (reading 'toFixed')`,
  culpable: 2,
  hallazgo:
    'Las entradas de un <code>Map</code> no son propiedades del objeto: <code>precios["pan"]</code> busca una propiedad llamada <code>pan</code>, que no existe, y da <code>undefined</code>. Las entradas se leen con <code>get</code>.',
  pista: '<code>pan</code> vale <code>undefined</code>. ¿Cómo se lee una entrada de un <code>Map</code>?',
  arreglos: [
    {
      texto: 'Cambiar la línea 2 por <code>const pan = precios.get("pan");</code>',
      correcta: true,
      porque: '<code>get</code> busca entre las entradas del <code>Map</code> y devuelve <code>3</code>. Para guardar, <code>set</code>; para preguntar, <code>has</code>.',
    },
    {
      texto: 'Cambiar la línea 2 por <code>const pan = precios.pan;</code>',
      correcta: false,
      porque: 'Es lo mismo que con corchetes: busca una propiedad del objeto, no una entrada. Sigue dando <code>undefined</code>.',
    },
    {
      texto: 'Crear los precios con <code>new Set([["pan", 3], ["leche", 5]])</code>',
      correcta: false,
      porque: 'Un <code>Set</code> guarda valores sueltos, sin claves: no hay forma de pedirle el precio del pan.',
    },
  ],
};

export const retoColLab = {
  id: 'reto-col-lab',
  titulo: 'Contar palabras',
  inicial: `// Escribe contarPalabras(texto): devuelve un Map con cada palabra (en minúsculas)
// y cuántas veces aparece, en el orden en que aparece por primera vez.
// Las palabras están separadas por uno o más espacios.

const conteo = contarPalabras("el gato y El perro y el loro");
console.log(conteo.get("el"));
console.log([...conteo.keys()].join(","));
`,
  verificaciones: [
    { texto: 'Imprime <code>3</code> y después <code>el,gato,y,perro,loro</code>', prueba: 'return __salida.join("|") === "3|el,gato,y,perro,loro";' },
    { texto: 'Devuelve un <code>Map</code>', prueba: 'return contarPalabras("a b") instanceof Map;' },
    { texto: 'No cuenta palabras vacías aunque haya espacios de más', prueba: 'const m = contarPalabras("  hola   hola "); return m.size === 1 && m.get("hola") === 2;' },
    { texto: 'Con un texto vacío devuelve un <code>Map</code> vacío', prueba: 'return contarPalabras("").size === 0;' },
  ],
  pistas: [
    'Separa las palabras y descarta las vacías: <code>texto.toLowerCase().split(" ").filter(Boolean)</code>.',
    'Recorre con <code>for (const palabra of palabras)</code> y lleva la cuenta en un <code>new Map()</code>.',
    'En cada palabra: <code>conteo.set(palabra, (conteo.get(palabra) ?? 0) + 1);</code>',
  ] as [string, string, string],
  solucion: `function contarPalabras(texto) {
  const conteo = new Map();
  const palabras = texto.toLowerCase().split(" ").filter(Boolean);
  for (const palabra of palabras) {
    conteo.set(palabra, (conteo.get(palabra) ?? 0) + 1);
  }
  return conteo;
}

const conteo = contarPalabras("el gato y El perro y el loro");
console.log(conteo.get("el"));
console.log([...conteo.keys()].join(","));`,
  explicacion:
    '<p>Un <code>Map</code> recuerda el orden de inserción, así que las claves salen en el orden en que cada palabra apareció por primera vez. <code>filter(Boolean)</code> descarta los textos vacíos que deja <code>split</code> cuando hay espacios seguidos, y <code>?? 0</code> arranca la cuenta de una palabra nueva.</p>',
};
