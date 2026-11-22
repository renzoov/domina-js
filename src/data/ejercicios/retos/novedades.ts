// Reto del motor de la sección 16: «Novedades del lenguaje».

export const retoNovAuto = {
  id: 'reto-nov-auto',
  titulo: '¿De qué edición es?',
  preguntas: [
    {
      pregunta: 'La asignación lógica <code>config.tema ??= "claro"</code>, ¿de qué edición es?',
      opciones: ['ES2015', 'ES2021', 'ES2025'],
      correcta: 1,
      explicacion: 'ES2021 trajo <code>??=</code>, <code>||=</code> y <code>&amp;&amp;=</code>, además de <code>replaceAll</code>, <code>Promise.any</code> y los separadores numéricos (<code>1_000_000</code>).',
    },
    {
      pregunta: '<code>array.toSorted()</code>, <code>toReversed()</code> y <code>with()</code>, ¿de qué edición son?',
      opciones: ['ES2022', 'ES2023', 'ES2024'],
      correcta: 1,
      explicacion: 'ES2023 sumó los métodos que cambian <b>sin mutar</b>: devuelven un array nuevo y dejan el original como estaba.',
    },
    {
      pregunta: '<code>Object.groupBy</code> y <code>Promise.withResolvers</code>, ¿de qué edición son?',
      opciones: ['ES2023', 'ES2024', 'ES2026'],
      correcta: 1,
      explicacion: 'Los dos son de ES2024, junto con los buffers que crecen y <code>Atomics.waitAsync</code>.',
    },
    {
      pregunta: 'Las operaciones de conjuntos (<code>a.union(b)</code>, <code>a.intersection(b)</code>) y los <em>iterator helpers</em>, ¿de qué edición son?',
      opciones: ['ES2024', 'ES2025', 'ES2027'],
      correcta: 1,
      explicacion: 'ES2025 trajo los dos, además de <code>RegExp.escape</code>, <code>Promise.try</code> y los módulos JSON.',
    },
    {
      pregunta: '<code>Temporal</code>, la API nueva de fechas, ¿en qué edición entra?',
      opciones: ['ES2025', 'ES2026', 'ES2027'],
      correcta: 2,
      explicacion: 'Temporal llegó a la etapa 4 para ES2027, junto con <code>using</code> para liberar recursos. Ya funciona en los navegadores modernos.',
    },
  ],
};

export const retoNovOrden = {
  id: 'reto-nov-orden',
  titulo: 'Cinco años de novedades',
  codigo: `const notas = [7, 3, 9];
const ordenadas = notas.toSorted((a, b) => a - b);
console.log(notas.at(-1), ordenadas.at(-1));

const config = { tema: null };
config.tema ??= "claro";
console.log(config.tema);

const a = new Set([1, 2, 3]);
console.log([...a.intersection(new Set([2, 3, 4]))].join(","));
console.log(Object.hasOwn(config, "tema"));
console.log(1_000_000 + 1);`,
  salida: ['9 9', 'claro', '2,3', 'true', '1000001'],
  inicio: [2, 4, 0, 3, 1],
  explicacion:
    '<code>at(-1)</code> (ES2022) lee el último: en <code>notas</code> sigue siendo el <code>9</code> porque <code>toSorted</code> (ES2023) no la modificó, y en <code>ordenadas</code> el mayor también es <code>9</code>. <code>??=</code> (ES2021) asigna porque había <code>null</code>. <code>intersection</code> (ES2025) se queda con los comunes, <code>Object.hasOwn</code> (ES2022) confirma la propiedad y los guiones bajos (ES2021) solo ayudan a leer el número.',
};

export const retoNovDetective = {
  id: 'reto-nov-detective',
  titulo: 'Agregar con un método que reemplaza',
  codigo: `const notas = [7, 3, 9];
const conNueva = notas.with(notas.length, 10);
console.log(conNueva);`,
  error: `app.js:2
const conNueva = notas.with(notas.length, 10);
                           ^

RangeError: Invalid index : 3`,
  culpable: 2,
  hallazgo:
    '<code>with(i, valor)</code> (ES2023) <b>reemplaza</b> el elemento de la posición <code>i</code> en una copia. No agrega: la posición tiene que existir, y en un array de 3 elementos la última es la 2.',
  pista: 'El índice 3, ¿existe en un array de tres elementos? ¿Qué hace <code>with</code> con una posición?',
  arreglos: [
    {
      texto: 'Cambiar la línea 2 por <code>const conNueva = [...notas, 10];</code>',
      correcta: true,
      porque: 'El spread arma un array nuevo con los elementos de <code>notas</code> y el <code>10</code> al final, sin mutar el original: lo que se quería desde el principio.',
    },
    {
      texto: 'Cambiar la línea 2 por <code>const conNueva = notas.with(-1, 10);</code>',
      correcta: false,
      porque: 'Ya no falla, pero <code>-1</code> es el último elemento: reemplaza el <code>9</code> por <code>10</code> en vez de agregar.',
    },
    {
      texto: 'Cambiar la línea 2 por <code>const conNueva = notas.push(10);</code>',
      correcta: false,
      porque: '<code>push</code> modifica <code>notas</code> y devuelve la nueva <b>longitud</b>: <code>conNueva</code> valdría <code>4</code>.',
    },
  ],
};

export const retoNovLab = {
  id: 'reto-nov-lab',
  titulo: 'Un resumen con lo más nuevo',
  inicial: `// Escribe resumenPorCategoria(productos): devuelve un array de objetos
// { categoria, total } con la suma de precios de cada categoría, ordenado
// de mayor a menor total. No modifiques el array original.

const productos = [
  { nombre: "pan", categoria: "panadería", precio: 3 },
  { nombre: "leche", categoria: "lácteos", precio: 5 },
  { nombre: "queso", categoria: "lácteos", precio: 12 },
  { nombre: "torta", categoria: "panadería", precio: 20 },
  { nombre: "agua", categoria: "bebidas", precio: 2 },
];

for (const { categoria, total } of resumenPorCategoria(productos)) {
  console.log(categoria, total);
}
`,
  verificaciones: [
    { texto: 'Imprime <code>panadería 23</code>, <code>lácteos 17</code> y <code>bebidas 2</code>, en ese orden', prueba: 'return __salida.join("|") === "panadería 23|lácteos 17|bebidas 2";' },
    { texto: 'Devuelve objetos con <code>categoria</code> y <code>total</code>', prueba: 'const r = resumenPorCategoria([{ categoria: "x", precio: 4 }]); return r.length === 1 && r[0].categoria === "x" && r[0].total === 4;' },
    { texto: 'No modifica el array original', prueba: 'const p = [{ categoria: "a", precio: 1 }, { categoria: "b", precio: 5 }]; const copia = JSON.stringify(p); resumenPorCategoria(p); return JSON.stringify(p) === copia;' },
    { texto: 'Con una lista vacía devuelve un array vacío', prueba: 'const r = resumenPorCategoria([]); return Array.isArray(r) && r.length === 0;' },
  ],
  pistas: [
    'Agrupa con <code>Object.groupBy(productos, (p) =&gt; p.categoria)</code> (ES2024): te da un objeto con un array por categoría.',
    'Recorre los grupos con <code>Object.entries(grupos).map(([categoria, lista]) =&gt; ({ categoria, total: … }))</code>, sumando con <code>reduce</code>.',
    'Ordena sin mutar con <code>toSorted((a, b) =&gt; b.total - a.total)</code> (ES2023).',
  ] as [string, string, string],
  solucion: `function resumenPorCategoria(productos) {
  const grupos = Object.groupBy(productos, (p) => p.categoria);
  return Object.entries(grupos)
    .map(([categoria, lista]) => ({
      categoria,
      total: lista.reduce((suma, p) => suma + p.precio, 0),
    }))
    .toSorted((a, b) => b.total - a.total);
}

const productos = [
  { nombre: "pan", categoria: "panadería", precio: 3 },
  { nombre: "leche", categoria: "lácteos", precio: 5 },
  { nombre: "queso", categoria: "lácteos", precio: 12 },
  { nombre: "torta", categoria: "panadería", precio: 20 },
  { nombre: "agua", categoria: "bebidas", precio: 2 },
];

for (const { categoria, total } of resumenPorCategoria(productos)) {
  console.log(categoria, total);
}`,
  explicacion:
    '<p>Hace unos años esto llevaba un objeto acumulador, un bucle y una copia antes de ordenar. Con <code>Object.groupBy</code> y <code>toSorted</code> cada paso dice lo que hace. (Aquí <code>sort</code> también sería seguro, porque <code>map</code> ya creó un array nuevo; <code>toSorted</code> deja clara la intención.)</p>',
};
