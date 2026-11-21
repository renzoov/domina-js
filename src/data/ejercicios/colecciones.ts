// Ejercicios de la sección 7: «Colecciones y datos».

/* ── 7.1 Arrays ───────────────────────────────────────────── */
export const arraysAuto = {
  id: 'arrays-auto',
  titulo: 'Listas ordenadas',
  preguntas: [
    {
      pregunta: '¿Qué índice tiene el primer elemento de un array?',
      opciones: ['1', '0', '-1'],
      correcta: 1,
      explicacion: 'Los índices empiezan en 0, así que el último es <code>length - 1</code>.',
    },
    {
      pregunta: '¿Qué devuelve <code>["a", "b", "c"].at(-1)</code>?',
      opciones: ['<code>undefined</code>', '<code>"c"</code>', '<code>"a"</code>'],
      correcta: 1,
      explicacion: '<code>at</code> (ES2022) acepta índices negativos, que cuentan desde el final. Con corchetes, <code>lista[-1]</code> da <code>undefined</code>.',
    },
    {
      pregunta: '¿Qué hacen <code>push</code> y <code>pop</code>?',
      opciones: ['Agregan y quitan al <b>final</b>', 'Agregan y quitan al <b>principio</b>', 'Ordenan'],
      correcta: 0,
      explicacion: '<code>unshift</code> y <code>shift</code> hacen lo mismo al principio, y son más lentos porque mueven todos los elementos.',
    },
    {
      pregunta: '¿Qué da <code>typeof [1, 2]</code>?',
      opciones: ['<code>"array"</code>', '<code>"object"</code>', '<code>"list"</code>'],
      correcta: 1,
      explicacion: 'Un array es un objeto especial. Para saber si algo es un array, usa <code>Array.isArray(x)</code>.',
    },
  ],
};

export const arraysOrden = {
  id: 'arrays-orden',
  titulo: 'Huecos y largo',
  codigo: `const letras = ["a", "b", "c"];
letras[5] = "f";

console.log(letras.length);
console.log(letras.at(-1));
console.log(letras.includes(undefined), letras.indexOf(undefined));
console.log(typeof letras, Array.isArray(letras));`,
  salida: ['6', 'f', 'true -1', 'object true'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Asignar en el índice 5 estira el array y deja <b>huecos</b> en los índices 3 y 4: <code>length</code> pasa a 6. <code>includes</code> trata los huecos como <code>undefined</code>, pero <code>indexOf</code> los salta. Los huecos son confusos: evítalos.',
};

export const arraysDetective = {
  id: 'arrays-detective',
  titulo: 'Una vuelta de más',
  codigo: `const nombres = ["ana", "luis", "eva"];

for (let i = 0; i <= nombres.length; i++) {
  console.log(nombres[i].toUpperCase());
}`,
  error: `ANA
LUIS
EVA
nombres.js:4
  console.log(nombres[i].toUpperCase());
                         ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')`,
  culpable: 3,
  hallazgo:
    'Con <code>&lt;=</code>, el bucle llega hasta <code>i = 3</code>, pero el último índice es 2. <code>nombres[3]</code> es <code>undefined</code>. Es el clásico error "por uno" (<em>off-by-one</em>).',
  pista: 'Se imprimen los tres nombres y después falla. ¿Cuánto vale <code>i</code> en la vuelta que falla? ¿Existe ese índice?',
  arreglos: [
    {
      texto: 'Usar <code>nombres[i]?.toUpperCase()</code>',
      correcta: false,
      porque: 'Ya no falla, pero imprime un <code>undefined</code> de más: el bucle sigue dando una vuelta extra.',
    },
    {
      texto: 'Cambiar la condición a <code>i &lt; nombres.length</code>',
      correcta: true,
      porque: 'Los índices van de 0 a <code>length - 1</code>. Mejor todavía: <code>for (const nombre of nombres)</code> no tiene índices que equivocar.',
    },
    {
      texto: 'Empezar en <code>let i = 1</code>',
      correcta: false,
      porque: 'Se salta a <code>ana</code> y sigue llegando a <code>i = 3</code>: el mismo error.',
    },
  ],
};

export const arraysLab = {
  id: 'arrays-lab',
  titulo: 'Rotar turnos',
  inicial: `const turnos = ["Ana", "Luis", "Eva"];

// Escribe rotar(lista): devuelve un array NUEVO donde el primer
// elemento pasa al final. No modifiques la lista original.

console.log(rotar(turnos));
console.log(turnos);
`,
  verificaciones: [
    { texto: 'Imprime <code>[ \'Luis\', \'Eva\', \'Ana\' ]</code> y la lista original intacta', prueba: 'return __salida.join("|") === "[ \'Luis\', \'Eva\', \'Ana\' ]|[ \'Ana\', \'Luis\', \'Eva\' ]";' },
    { texto: 'Funciona con otras listas: <code>rotar([1, 2, 3])</code> da <code>[ 2, 3, 1 ]</code>', prueba: 'return JSON.stringify(rotar([1, 2, 3])) === "[2,3,1]";' },
    { texto: 'Con una lista vacía devuelve <code>[]</code>', prueba: 'const r = rotar([]); return Array.isArray(r) && r.length === 0;' },
  ],
  pistas: [
    'Empieza con <code>function rotar(lista) { … }</code> arriba de todo.',
    'La desestructuración separa el primero del resto: <code>const [primero, ...resto] = lista;</code>',
    'Devuelve <code>[...resto, primero]</code>, pero solo si la lista tiene elementos: si no, devuelve <code>[]</code>.',
  ] as [string, string, string],
  solucion: `function rotar(lista) {
  if (lista.length === 0) return [];
  const [primero, ...resto] = lista;
  return [...resto, primero];
}

const turnos = ["Ana", "Luis", "Eva"];

console.log(rotar(turnos));
console.log(turnos);`,
  explicacion:
    '<p>Con <code>shift</code> y <code>push</code> también rotarías, pero modificando la lista de quien te la pasó. Desestructurar y armar un array nuevo con spread deja el original como estaba.</p>',
};

/* ── 7.2 Métodos de array ─────────────────────────────────── */
export const metodosAuto = {
  id: 'metodos-auto',
  titulo: 'El método justo',
  preguntas: [
    {
      pregunta: 'Quieres el <b>primer</b> usuario mayor de edad. ¿Qué método usas?',
      opciones: ['<code>filter</code>', '<code>find</code>', '<code>map</code>'],
      correcta: 1,
      explicacion: '<code>find</code> devuelve el primer elemento que cumple, o <code>undefined</code>. <code>filter</code> devolvería un array con todos.',
    },
    {
      pregunta: '¿Qué devuelve <code>forEach</code>?',
      opciones: ['Un array nuevo', '<code>undefined</code>: solo sirve para hacer algo con cada elemento', 'El último elemento'],
      correcta: 1,
      explicacion: 'Si quieres un resultado, usa <code>map</code>, <code>filter</code> o <code>reduce</code>.',
    },
    {
      pregunta: '¿Qué da <code>[10, 1, 5].sort()</code>?',
      opciones: ['<code>[1, 5, 10]</code>', '<code>[1, 10, 5]</code>', '<code>[10, 5, 1]</code>'],
      correcta: 1,
      explicacion: 'Sin comparador, <code>sort</code> compara como <b>textos</b>: "10" va antes que "5". Para números: <code>sort((a, b) => a - b)</code>.',
    },
    {
      pregunta: '¿Para qué sirve <code>some</code>?',
      opciones: ['Para sumar', 'Para saber si <b>al menos un</b> elemento cumple una condición', 'Para quedarse con algunos'],
      correcta: 1,
      explicacion: '<code>every</code> es su pareja: si <b>todos</b> cumplen. Los dos se detienen en cuanto conocen la respuesta.',
    },
  ],
};

export const metodosOrden = {
  id: 'metodos-orden',
  titulo: 'Ordenar, buscar y aplanar',
  codigo: `const nums = [10, 1, 5, 100];

console.log([...nums].sort().join(","));
console.log([...nums].sort((a, b) => a - b).join(","));
console.log(nums.find((n) => n > 4), nums.findLast((n) => n > 4));
console.log(nums.some((n) => n > 50), nums.every((n) => n > 0));
console.log([[1, 2], [3]].flat().length);`,
  salida: ['1,10,100,5', '1,5,10,100', '10 100', 'true true', '3'],
  inicio: [3, 1, 4, 0, 2],
  explicacion:
    'Sin comparador, <code>sort</code> ordena como texto. <code>find</code> busca desde el principio y <code>findLast</code> (ES2023), desde el final. <code>flat</code> aplana un nivel: dos arrays se convierten en uno de tres elementos.',
};

export const metodosDetective = {
  id: 'metodos-detective',
  titulo: 'Esperar un array de forEach',
  codigo: `const nums = [1, 2, 3];

const dobles = nums.forEach((n) => n * 2);

console.log(dobles.length);`,
  error: `dobles.js:5
console.log(dobles.length);
                   ^

TypeError: Cannot read properties of undefined (reading 'length')`,
  culpable: 3,
  hallazgo:
    '<code>forEach</code> recorre el array pero <b>siempre devuelve <code>undefined</code></b>: no arma ningún resultado. El valor de la flecha se descarta.',
  pista: '¿Qué valor guarda <code>dobles</code>? ¿Qué devuelve <code>forEach</code>?',
  arreglos: [
    {
      texto: 'Usar <code>nums.map((n) => n * 2)</code>',
      correcta: true,
      porque: '<code>map</code> arma un array nuevo con lo que devuelve la función para cada elemento: <code>[2, 4, 6]</code>.',
    },
    {
      texto: 'Agregar <code>return</code>: <code>nums.forEach((n) => { return n * 2; })</code>',
      correcta: false,
      porque: 'Es lo mismo que antes: <code>forEach</code> ignora lo que devuelve la función. <code>dobles</code> sigue siendo <code>undefined</code>.',
    },
    {
      texto: 'Usar <code>dobles?.length</code>',
      correcta: false,
      porque: 'Ya no da error, pero imprime <code>undefined</code>: el array nunca se creó.',
    },
  ],
};

export const metodosLab = {
  id: 'metodos-lab',
  titulo: 'Los baratos, en mayúsculas',
  inicial: `const productos = [
  { nombre: "té", precio: 3 },
  { nombre: "café", precio: 5 },
  { nombre: "mate", precio: 2 },
];

// Escribe nombresBaratos(lista, maximo): devuelve los nombres en mayúsculas
// de los productos que cuestan hasta maximo, sin bucles.

console.log(nombresBaratos(productos, 3));
`,
  verificaciones: [
    { texto: 'Imprime <code>[ \'TÉ\', \'MATE\' ]</code>', prueba: 'return __salida.at(-1) === "[ \'TÉ\', \'MATE\' ]";' },
    { texto: 'Respeta el máximo: con 10 devuelve los tres', prueba: 'return nombresBaratos(productos, 10).length === 3 && nombresBaratos(productos, 1).length === 0;' },
    { texto: 'Usa <code>filter</code> y <code>map</code>, sin <code>for</code> ni <code>while</code>', prueba: String.raw`return /\.filter\s*\(/.test(__codigo) && /\.map\s*\(/.test(__codigo) && !/\b(for|while)\b/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function nombresBaratos(lista, maximo) { return lista … }</code> antes del <code>console.log</code>.',
    'Primero quédate con los baratos: <code>.filter((p) => p.precio &lt;= maximo)</code>',
    'Después transforma cada producto en su nombre: <code>.map((p) => p.nombre.toUpperCase())</code>',
  ] as [string, string, string],
  solucion: `const productos = [
  { nombre: "té", precio: 3 },
  { nombre: "café", precio: 5 },
  { nombre: "mate", precio: 2 },
];

function nombresBaratos(lista, maximo) {
  return lista
    .filter((p) => p.precio <= maximo)
    .map((p) => p.nombre.toUpperCase());
}

console.log(nombresBaratos(productos, 3));`,
  explicacion:
    '<p>Primero <code>filter</code>, para trabajar con menos elementos, y después <code>map</code>, para darles la forma que necesitas. Es el orden más habitual en las cadenas de métodos.</p>',
};

/* ── 7.3 Cambiar sin mutar ────────────────────────────────── */
export const sinMutarAuto = {
  id: 'sin-mutar-auto',
  titulo: 'Copias en lugar de cambios',
  preguntas: [
    {
      pregunta: '¿Qué devuelve <code>lista.sort()</code>?',
      opciones: ['Un array nuevo ordenado', 'El <b>mismo</b> array, ya ordenado: lo modifica', '<code>undefined</code>'],
      correcta: 1,
      explicacion: 'Por eso es fácil olvidar que modifica el original: parece que devuelve uno nuevo, pero es el mismo.',
    },
    {
      pregunta: '¿Qué hace <code>lista.with(0, "x")</code> (ES2023)?',
      opciones: ['Cambia el primer elemento de <code>lista</code>', 'Devuelve una copia con el primer elemento cambiado', 'Agrega "x" al principio'],
      correcta: 1,
      explicacion: 'Es la versión que no muta de <code>lista[0] = "x"</code>.',
    },
    {
      pregunta: '¿Cuál de estos métodos <b>no</b> modifica el array?',
      opciones: ['<code>reverse</code>', '<code>splice</code>', '<code>toSpliced</code>'],
      correcta: 2,
      explicacion: '<code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> y <code>with</code> son las versiones de ES2023 que devuelven una copia.',
    },
    {
      pregunta: '¿Por qué importa no mutar un array que recibiste?',
      opciones: ['Por velocidad', 'Porque otras partes del programa pueden estar usando ese mismo array', 'No importa'],
      correcta: 1,
      explicacion: 'Muchas librerías, como React, detectan los cambios comparando referencias: si mutas, no se enteran.',
    },
  ],
};

export const sinMutarOrden = {
  id: 'sin-mutar-orden',
  titulo: 'sort contra toSorted',
  codigo: `const original = ["c", "a", "b"];
const ordenado = original.sort();

console.log(original.join(""));
console.log(ordenado === original);

const lista = ["c", "a", "b"];
console.log(lista.toSorted().join(""), lista.join(""));
console.log(lista.with(1, "z").join(""), lista.toReversed().join(""));`,
  salida: ['abc', 'true', 'abc cab', 'czb bac'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>sort</code> ordenó el original y devolvió <b>ese mismo</b> array. <code>toSorted</code>, <code>with</code> y <code>toReversed</code> devuelven copias: <code>lista</code> sigue siendo <code>cab</code> en todas las líneas.',
};

export const sinMutarDetective = {
  id: 'sin-mutar-detective',
  titulo: 'Ordenar una lista congelada',
  codigo: `const PUNTAJES = Object.freeze([70, 95, 80]);

function mejores(lista) {
  return lista.sort((a, b) => b - a).slice(0, 2);
}

console.log(mejores(PUNTAJES));`,
  error: `ranking.js:4
  return lista.sort((a, b) => b - a).slice(0, 2);
               ^

TypeError: Cannot assign to read only property '0' of object '[object Array]'`,
  culpable: 4,
  hallazgo:
    '<code>sort</code> ordena <b>moviendo</b> los elementos del array que recibe, y este está congelado. El freeze cumplió su función: avisó de que <code>mejores</code> modificaba datos compartidos.',
  pista: 'El error dice que no se puede asignar en el índice 0. ¿Qué método intenta cambiar el array?',
  arreglos: [
    {
      texto: 'Usar <code>lista.toSorted((a, b) => b - a).slice(0, 2)</code>',
      correcta: true,
      porque: '<code>toSorted</code> ordena una copia: funciona con arrays congelados y no toca los datos de nadie. Imprime <code>[ 95, 80 ]</code>.',
    },
    {
      texto: 'Quitar el <code>Object.freeze</code>',
      correcta: false,
      porque: 'Funciona, pero <code>PUNTAJES</code> queda reordenado para todo el programa. Quien lo use después verá otro orden sin saber por qué.',
    },
    {
      texto: 'Usar <code>lista.sort()</code> sin comparador',
      correcta: false,
      porque: 'Sigue intentando modificar el array congelado: el mismo error. Y además ordenaría como texto.',
    },
  ],
};

export const sinMutarLab = {
  id: 'sin-mutar-lab',
  titulo: 'Marcar una tarea sin mutar',
  inicial: `const tareas = [
  { titulo: "Leer", hecha: false },
  { titulo: "Practicar", hecha: false },
];

// Escribe marcarHecha(lista, indice): devuelve un array NUEVO donde la tarea
// de ese índice es un objeto nuevo con hecha: true. Usa lista.with(…).
// No modifiques ni el array ni los objetos originales.

const nuevas = marcarHecha(tareas, 1);
console.log(nuevas[1].hecha, tareas[1].hecha);
`,
  verificaciones: [
    { texto: 'Imprime <code>true false</code>', prueba: 'return __salida.at(-1) === "true false";' },
    { texto: 'El array y el objeto devueltos son nuevos; el resto se comparte', prueba: 'const r = marcarHecha(tareas, 0); return r !== tareas && r[0] !== tareas[0] && r[1] === tareas[1] && r[0].titulo === "Leer";' },
    { texto: 'Usa <code>with</code>', prueba: String.raw`return /\.with\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function marcarHecha(lista, indice) { … }</code> arriba de todo.',
    'El objeto nuevo es una copia con el cambio: <code>{ ...lista[indice], hecha: true }</code>',
    'Ponlo en su lugar con una copia del array: <code>return lista.with(indice, { ...lista[indice], hecha: true });</code>',
  ] as [string, string, string],
  solucion: `function marcarHecha(lista, indice) {
  return lista.with(indice, { ...lista[indice], hecha: true });
}

const tareas = [
  { titulo: "Leer", hecha: false },
  { titulo: "Practicar", hecha: false },
];

const nuevas = marcarHecha(tareas, 1);
console.log(nuevas[1].hecha, tareas[1].hecha);`,
  explicacion:
    '<p>Solo se crean dos cosas nuevas: el array y el objeto que cambió. Las demás tareas se <b>comparten</b> entre las dos versiones, lo que es seguro mientras nadie las mute. Es la forma en que React y otras librerías esperan que actualices el estado.</p>',
};

/* ── 7.4 Agrupar datos ────────────────────────────────────── */
export const agruparAuto = {
  id: 'agrupar-auto',
  titulo: 'Grupos con una línea',
  preguntas: [
    {
      pregunta: '¿Qué devuelve <code>Object.groupBy(lista, fn)</code>?',
      opciones: [
        'Un array ordenado',
        'Un objeto cuyas claves son lo que devuelve <code>fn</code> y cuyos valores son arrays con los elementos de cada grupo',
        'Un número',
      ],
      correcta: 1,
      explicacion: 'Agregado en ES2024. Antes había que escribirlo a mano con <code>reduce</code>.',
    },
    {
      pregunta: '¿Por qué es <code>Object.groupBy(lista, …)</code> y no <code>lista.groupBy(…)</code>?',
      opciones: [
        'Por error',
        'Porque como método de array chocaba con librerías antiguas que ya agregaban un <code>groupBy</code> a los arrays',
        'Porque es más rápido',
      ],
      correcta: 1,
      explicacion: 'Es un ejemplo real de por qué no hay que modificar los prototipos nativos.',
    },
    {
      pregunta: '¿Cuándo conviene <code>Map.groupBy</code>?',
      opciones: ['Nunca', 'Cuando las claves de los grupos no son textos, por ejemplo objetos', 'Cuando hay pocos elementos'],
      correcta: 1,
      explicacion: 'Las claves de un objeto se convierten en texto; las de un <code>Map</code> pueden ser cualquier valor.',
    },
    {
      pregunta: '¿Qué pasa si ningún elemento cae en el grupo <code>"postre"</code>?',
      opciones: ['Aparece con un array vacío', 'No aparece: <code>grupos.postre</code> es <code>undefined</code>', 'Da error'],
      correcta: 1,
      explicacion: 'Solo existen los grupos que tienen al menos un elemento. Usa <code>?? []</code> al leerlos.',
    },
  ],
};

export const agruparOrden = {
  id: 'agrupar-orden',
  titulo: 'Agrupar ventas',
  codigo: `const ventas = [
  { producto: "té", tipo: "bebida", monto: 3 },
  { producto: "pan", tipo: "comida", monto: 2 },
  { producto: "café", tipo: "bebida", monto: 4 },
];

const porTipo = Object.groupBy(ventas, (v) => v.tipo);
console.log(Object.keys(porTipo).join(","));
console.log(porTipo.bebida.length);
console.log(porTipo.postre);

const porMonto = Map.groupBy(ventas, (v) => (v.monto >= 3 ? "alto" : "bajo"));
console.log(porMonto.get("alto").map((v) => v.producto).join(","));`,
  salida: ['bebida,comida', '2', 'undefined', 'té,café'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Las claves aparecen en el orden en que se encontró cada grupo. Hay dos bebidas y ningún postre, así que ese grupo no existe. <code>Map.groupBy</code> agrupa igual, pero devuelve un <code>Map</code>.',
};

export const agruparDetective = {
  id: 'agrupar-detective',
  titulo: 'Un groupBy que no existe',
  codigo: `const notas = [8, 4, 9, 6];

const grupos = notas.groupBy((n) => (n >= 6 ? "aprobado" : "desaprobado"));

console.log(grupos.aprobado);`,
  error: `notas.js:3
const grupos = notas.groupBy((n) => (n >= 6 ? "aprobado" : "desaprobado"));
                     ^

TypeError: notas.groupBy is not a function`,
  culpable: 3,
  hallazgo:
    'Los arrays no tienen un método <code>groupBy</code>. La función es estática: se llama desde <code>Object</code> (o <code>Map</code>) y recibe el array como primer argumento.',
  pista: '<em>is not a function</em>: ¿en qué objeto vive <code>groupBy</code>?',
  arreglos: [
    {
      texto: 'Usar <code>Object.groupBy(notas, (n) => …)</code>',
      correcta: true,
      porque: 'Imprime <code>[ 8, 9, 6 ]</code>, las notas aprobadas.',
    },
    {
      texto: 'Usar <code>notas.group(…)</code>',
      correcta: false,
      porque: 'Era el nombre de una versión antigua de la propuesta, que nunca llegó al estándar: tampoco existe.',
    },
    {
      texto: 'Agregarlo a los arrays: <code>Array.prototype.groupBy = …</code>',
      correcta: false,
      porque: 'Modificar los prototipos nativos es justo lo que obligó a que <code>groupBy</code> no fuera un método de array.',
    },
  ],
};

export const agruparLab = {
  id: 'agrupar-lab',
  titulo: 'Contar por inicial',
  inicial: `const palabras = ["arroz", "banana", "avena", "cacao", "batata"];

// Escribe contarPorInicial(lista): devuelve un objeto con cuántas palabras
// empiezan con cada letra, por ejemplo { a: 2, b: 2, c: 1 }.
// Usa Object.groupBy.

console.log(contarPorInicial(palabras));
`,
  verificaciones: [
    { texto: 'Imprime <code>{ a: 2, b: 2, c: 1 }</code>', prueba: 'return JSON.stringify(contarPorInicial(palabras)) === \'{"a":2,"b":2,"c":1}\';' },
    { texto: 'Funciona con otras palabras', prueba: 'return JSON.stringify(contarPorInicial(["sol", "sal", "mar"])) === \'{"s":2,"m":1}\';' },
    { texto: 'Usa <code>Object.groupBy</code>', prueba: String.raw`return /Object\.groupBy\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Primero agrupa por la primera letra: <code>const grupos = Object.groupBy(lista, (p) => p[0]);</code>',
    'Cada grupo es un array: lo que necesitas es su <code>length</code>.',
    'Transforma el objeto como en <em>Recorrer objetos</em>: <code>Object.fromEntries(Object.entries(grupos).map(([letra, g]) => [letra, g.length]))</code>',
  ] as [string, string, string],
  solucion: `function contarPorInicial(lista) {
  const grupos = Object.groupBy(lista, (p) => p[0]);
  return Object.fromEntries(
    Object.entries(grupos).map(([letra, grupo]) => [letra, grupo.length])
  );
}

const palabras = ["arroz", "banana", "avena", "cacao", "batata"];

console.log(contarPorInicial(palabras));`,
  explicacion:
    '<p>Agrupar y después resumir cada grupo (contar, sumar, quedarse con el mayor) es uno de los patrones más comunes al trabajar con datos. <code>groupBy</code> hace la parte difícil.</p>',
};

/* ── 7.5 Map y Set ────────────────────────────────────────── */
export const mapSetAuto = {
  id: 'map-set-auto',
  titulo: 'Diccionarios y conjuntos',
  preguntas: [
    {
      pregunta: '¿Qué ventaja tiene un <code>Map</code> sobre un objeto para guardar pares clave-valor?',
      opciones: [
        'Ninguna',
        'Acepta cualquier tipo de clave, tiene <code>size</code>, respeta el orden de inserción y no hereda claves',
        'Es más corto de escribir',
      ],
      correcta: 1,
      explicacion: 'Para datos que cambian mucho (agregar, borrar, contar), <code>Map</code> es la estructura pensada para eso.',
    },
    {
      pregunta: '¿Qué da <code>new Set([1, 1, 2, 2, 3]).size</code>?',
      opciones: ['5', '3', '2'],
      correcta: 1,
      explicacion: 'Un <code>Set</code> guarda cada valor <b>una sola vez</b>. <code>[...new Set(lista)]</code> es la forma corta de quitar duplicados.',
    },
    {
      pregunta: '¿Qué devuelve <code>a.intersection(b)</code> (ES2025)?',
      opciones: ['Los valores que están en <code>a</code> o en <code>b</code>', 'Los que están en los dos', 'Los que están solo en <code>a</code>'],
      correcta: 1,
      explicacion: '<code>union</code>: en cualquiera. <code>difference</code>: solo en <code>a</code>. <code>symmetricDifference</code>: en uno solo de los dos.',
    },
    {
      pregunta: '¿Qué hace <code>mapa.getOrInsert("k", 0)</code> (ES2026)?',
      opciones: ['Siempre guarda 0', 'Si la clave existe devuelve su valor; si no, guarda 0 y lo devuelve', 'Borra la clave'],
      correcta: 1,
      explicacion: 'Reemplaza el patrón <code>if (!mapa.has(k)) mapa.set(k, 0)</code>. <code>getOrInsertComputed</code> calcula el valor con una función solo si hace falta.',
    },
  ],
};

export const mapSetOrden = {
  id: 'map-set-orden',
  titulo: 'Operaciones de conjuntos y upsert',
  codigo: `const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

console.log([...a.union(b)].join(","));
console.log([...a.intersection(b)].join(","));
console.log([...a.difference(b)].join(","), a.isSubsetOf(new Set([1, 2, 3, 4])));

const visitas = new Map();
visitas.set("ana", visitas.getOrInsert("ana", 0) + 1);
visitas.set("ana", visitas.getOrInsert("ana", 0) + 1);
console.log(visitas.get("ana"), visitas.size);`,
  salida: ['1,2,3,4', '2,3', '1 true', '2 1'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'La unión junta todo sin repetir; la intersección deja lo común; la diferencia, lo que solo está en <code>a</code>. La primera vez, <code>getOrInsert</code> guarda 0; la segunda, devuelve el 1 que ya estaba. Hay una sola clave.',
};

export const mapSetDetective = {
  id: 'map-set-detective',
  titulo: 'Un Map usado como objeto',
  codigo: `const precios = new Map();

precios["café"] = 2.5;

console.log(precios.size);
console.log(precios.get("café").toFixed(2));`,
  error: `0
precios.js:6
console.log(precios.get("café").toFixed(2));
                                ^

TypeError: Cannot read properties of undefined (reading 'toFixed')`,
  culpable: 3,
  hallazgo:
    'Con corchetes se crea una propiedad común del objeto <code>Map</code>, no una <b>entrada</b> del mapa. Por eso <code>size</code> es 0 y <code>get</code> no encuentra nada.',
  pista: '<code>size</code> dice 0, aunque "guardaste" un precio. ¿Cómo se agregan entradas a un <code>Map</code>?',
  arreglos: [
    {
      texto: 'Usar <code>precios.set("café", 2.5)</code>',
      correcta: true,
      porque: 'Las entradas de un <code>Map</code> se manejan con <code>set</code>, <code>get</code>, <code>has</code> y <code>delete</code>. Ahora <code>size</code> es 1 e imprime <code>2.50</code>.',
    },
    {
      texto: 'Leer con corchetes también: <code>precios["café"].toFixed(2)</code>',
      correcta: false,
      porque: 'Imprime 2.50, pero no estás usando el mapa: <code>size</code> sigue en 0 y <code>for...of</code> no vería el precio.',
    },
    {
      texto: 'Usar <code>precios.get(["café"])</code>',
      correcta: false,
      porque: 'Busca la clave <code>["café"]</code>, un array nuevo: no existe. Sigue dando <code>undefined</code>.',
    },
  ],
};

export const mapSetLab = {
  id: 'map-set-lab',
  titulo: 'Etiquetas en común',
  inicial: `const articuloA = ["js", "css", "html", "js"];
const articuloB = ["css", "node", "js"];

// Escribe enComun(a, b): devuelve un array, ordenado alfabéticamente,
// con las etiquetas que están en las dos listas, sin repetir.
// Usa Set e intersection.

console.log(enComun(articuloA, articuloB));
`,
  verificaciones: [
    { texto: 'Imprime <code>[ \'css\', \'js\' ]</code>', prueba: 'return __salida.at(-1) === "[ \'css\', \'js\' ]";' },
    { texto: 'Funciona con otras listas', prueba: 'return JSON.stringify(enComun(["b", "a", "c"], ["c", "b"])) === \'["b","c"]\' && enComun(["x"], ["y"]).length === 0;' },
    { texto: 'Usa <code>new Set</code> e <code>intersection</code>', prueba: String.raw`return /new\s+Set\s*\(/.test(__codigo) && /\.intersection\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Convierte cada lista en un conjunto: <code>new Set(a)</code>. Así los repetidos desaparecen.',
    '<code>new Set(a).intersection(new Set(b))</code> deja solo las comunes.',
    'Vuelve a array con <code>[...conjunto]</code> y ordénalo con <code>.toSorted()</code>.',
  ] as [string, string, string],
  solucion: `function enComun(a, b) {
  return [...new Set(a).intersection(new Set(b))].toSorted();
}

const articuloA = ["js", "css", "html", "js"];
const articuloB = ["css", "node", "js"];

console.log(enComun(articuloA, articuloB));`,
  explicacion:
    '<p>Antes de ES2025, la intersección se escribía con <code>filter</code> y <code>has</code>. Los métodos de conjuntos dicen exactamente lo que quieres hacer, y quitan los duplicados por el camino.</p>',
};

/* ── 7.6 WeakMap y WeakSet ────────────────────────────────── */
export const debilesAuto = {
  id: 'debiles-auto',
  titulo: 'Colecciones que no retienen',
  preguntas: [
    {
      pregunta: '¿Qué tienen de "débil" una <code>WeakMap</code> y una <code>WeakSet</code>?',
      opciones: ['Son lentas', 'No impiden que el recolector libere sus claves cuando nadie más las usa', 'Se borran solas cada minuto'],
      correcta: 1,
      explicacion: 'Una <code>Map</code> mantiene vivas sus claves para siempre; una <code>WeakMap</code>, no.',
    },
    {
      pregunta: '¿Qué valores pueden ser claves de una <code>WeakMap</code>?',
      opciones: ['Cualquiera', 'Objetos (y símbolos no registrados)', 'Solo textos'],
      correcta: 1,
      explicacion: 'Un primitivo como <code>"ana"</code> nunca "se libera", así que no tiene sentido como clave débil.',
    },
    {
      pregunta: '¿Se puede recorrer una <code>WeakSet</code> con <code>for...of</code>?',
      opciones: ['Sí', 'No: no es iterable ni tiene <code>size</code>'],
      correcta: 1,
      explicacion: 'Sus elementos pueden desaparecer en cualquier momento, así que no hay una lista estable que recorrer.',
    },
    {
      pregunta: '¿Para qué sirve una <code>WeakSet</code>?',
      opciones: ['Para quitar duplicados', 'Para <b>marcar</b> objetos (ya visto, ya procesado) sin retenerlos', 'Para ordenar'],
      correcta: 1,
      explicacion: 'Solo responde "¿está o no está?", y eso alcanza para muchos casos.',
    },
  ],
};

export const debilesOrden = {
  id: 'debiles-orden',
  titulo: 'Marcas y datos asociados',
  codigo: `const vistos = new WeakSet();
const a = { id: 1 };
const b = { id: 2 };
vistos.add(a);

console.log(vistos.has(a), vistos.has(b));
console.log(vistos.has({ id: 1 }));

const privado = new WeakMap();
privado.set(a, { secreto: 42 });
console.log(privado.get(a).secreto);
console.log(typeof privado.size, typeof privado.forEach);`,
  salida: ['true false', 'false', '42', 'undefined undefined'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'La <code>WeakSet</code> recuerda objetos concretos, no su contenido: <code>{ id: 1 }</code> es otro objeto. La <code>WeakMap</code> asocia datos a <code>a</code>. Ninguna de las dos tiene <code>size</code> ni <code>forEach</code>.',
};

export const debilesDetective = {
  id: 'debiles-detective',
  titulo: 'Recorrer una caché débil',
  codigo: `const cache = new WeakMap();
const usuario = { nombre: "Ana" };
cache.set(usuario, "perfil cargado");

for (const [clave, valor] of cache) {
  console.log(clave.nombre, valor);
}`,
  error: `cache.js:5
for (const [clave, valor] of cache) {
                             ^

TypeError: cache is not iterable`,
  culpable: 5,
  hallazgo:
    'Una <code>WeakMap</code> no se puede recorrer: sus entradas pueden desaparecer en cualquier momento, cuando el recolector libera las claves. Solo admite <code>get</code>, <code>set</code>, <code>has</code> y <code>delete</code> con una clave concreta.',
  pista: '<em>is not iterable</em>: ¿qué colecciones se pueden recorrer y cuáles no?',
  arreglos: [
    {
      texto: 'Si necesitas recorrerla, usar un <code>Map</code> normal',
      correcta: true,
      porque: 'Un <code>Map</code> es iterable. A cambio, retiene sus claves: tendrás que borrar las entradas que ya no sirvan.',
    },
    {
      texto: 'Recorrer <code>Object.entries(cache)</code>',
      correcta: false,
      porque: 'Las entradas de la <code>WeakMap</code> no son propiedades del objeto: da un array vacío y el bucle no imprime nada.',
    },
    {
      texto: 'Usar <code>cache.forEach(…)</code>',
      correcta: false,
      porque: '<code>WeakMap</code> no tiene <code>forEach</code>: <code>TypeError: cache.forEach is not a function</code>.',
    },
  ],
};

export const debilesLab = {
  id: 'debiles-lab',
  titulo: 'Procesar una sola vez',
  inicial: `// Escribe procesarUnaVez(obj): la primera vez que recibe un objeto
// devuelve true; las siguientes, con ese mismo objeto, devuelve false.
// Usa una WeakSet para recordar los objetos ya procesados.

const pedido = { id: 7 };
console.log(procesarUnaVez(pedido));
console.log(procesarUnaVez(pedido));
console.log(procesarUnaVez({ id: 7 }));
`,
  verificaciones: [
    { texto: 'Imprime <code>true</code>, <code>false</code> y <code>true</code>', prueba: 'return __salida.join("|") === "true|false|true";' },
    { texto: 'Cada objeto nuevo se procesa una vez', prueba: 'const o = {}; return procesarUnaVez(o) === true && procesarUnaVez(o) === false;' },
    { texto: 'Usa una <code>WeakSet</code>', prueba: String.raw`return /new\s+WeakSet\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Crea la colección arriba de todo: <code>const procesados = new WeakSet();</code>',
    'En la función: si <code>procesados.has(obj)</code>, devuelve <code>false</code>.',
    'Si no, márcalo con <code>procesados.add(obj)</code> y devuelve <code>true</code>.',
  ] as [string, string, string],
  solucion: `const procesados = new WeakSet();

function procesarUnaVez(obj) {
  if (procesados.has(obj)) return false;
  procesados.add(obj);
  return true;
}

const pedido = { id: 7 };
console.log(procesarUnaVez(pedido));
console.log(procesarUnaVez(pedido));
console.log(procesarUnaVez({ id: 7 }));`,
  explicacion:
    '<p>Con un <code>Set</code> normal funcionaría igual, pero cada pedido procesado quedaría retenido para siempre. Con la <code>WeakSet</code>, cuando un pedido deja de usarse en el resto del programa, su marca desaparece con él.</p>',
};

/* ── 7.7 Datos binarios ───────────────────────────────────── */
export const binariosAuto = {
  id: 'binarios-auto',
  titulo: 'Bytes, buffers y vistas',
  preguntas: [
    {
      pregunta: '¿Qué es un <code>ArrayBuffer</code>?',
      opciones: ['Un array normal', 'Un bloque de bytes en memoria, que se lee y escribe a través de vistas', 'Un archivo'],
      correcta: 1,
      explicacion: 'El buffer solo guarda bytes. Para usarlos, creas una <b>vista</b>: <code>Uint8Array</code>, <code>Float32Array</code>, <code>DataView</code>…',
    },
    {
      pregunta: '¿Qué pasa al guardar 300 en un <code>Uint8Array</code>?',
      opciones: ['Se guarda 300', 'Se guarda 44: los valores dan la vuelta al pasar de 255', 'Da error'],
      correcta: 1,
      explicacion: 'Un byte va de 0 a 255; 300 - 256 = 44. <code>Uint8ClampedArray</code> lo dejaría en 255.',
    },
    {
      pregunta: '¿Qué agregó ES2026 a <code>Uint8Array</code>?',
      opciones: ['Nada', 'Conversión a y desde base64 y hexadecimal: <code>toBase64</code>, <code>fromBase64</code>, <code>toHex</code>, <code>fromHex</code>', 'Un método <code>push</code>'],
      correcta: 1,
      explicacion: 'Antes había que usar <code>btoa</code>/<code>atob</code>, que solo funcionan con texto, o escribir la conversión a mano.',
    },
    {
      pregunta: '¿Qué permite un <code>ArrayBuffer</code> redimensionable (ES2024)?',
      opciones: ['Cambiar su tamaño con <code>resize</code>, hasta un máximo fijado al crearlo', 'Guardar textos', 'Nada nuevo'],
      correcta: 0,
      explicacion: 'Se crea con <code>new ArrayBuffer(tam, { maxByteLength })</code>. Las vistas sin largo fijo crecen con él.',
    },
  ],
};

export const binariosOrden = {
  id: 'binarios-orden',
  titulo: 'Desbordes, vistas y base64',
  codigo: `const bytes = new Uint8Array([250, 5]);
bytes[0] += 20;
console.log(bytes[0]);

const buffer = new ArrayBuffer(4);
const vista8 = new Uint8Array(buffer);
const vista32 = new Uint32Array(buffer);
console.log(vista8.byteLength, vista32.length);

console.log(new Uint8Array([72, 105]).toHex());
console.log(Uint8Array.fromBase64("SG9sYQ==").length);`,
  salida: ['14', '4 1', '4869', '4'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '250 + 20 = 270, que no cabe en un byte: da la vuelta a 14. Las dos vistas miran los <b>mismos</b> 4 bytes: son 4 de 8 bits o 1 de 32. 72 y 105 en hexadecimal son 48 y 69. <code>"SG9sYQ=="</code> es <code>"Hola"</code>: 4 bytes.',
};

export const binariosDetective = {
  id: 'binarios-detective',
  titulo: 'Agregar a un array tipado',
  codigo: `const muestras = new Float32Array(3);

muestras.push(0.5);

console.log(muestras);`,
  error: `audio.js:3
muestras.push(0.5);
         ^

TypeError: muestras.push is not a function`,
  culpable: 3,
  hallazgo:
    'Los arrays tipados tienen un <b>largo fijo</b>, el que se pidió al crearlos: no tienen <code>push</code>, <code>pop</code> ni <code>splice</code>. <code>muestras</code> ya tiene 3 lugares, todos en 0.',
  pista: 'Un <code>Float32Array(3)</code> nace con 3 elementos. ¿Puede crecer?',
  arreglos: [
    {
      texto: 'Escribir en un índice: <code>muestras[0] = 0.5;</code>',
      correcta: true,
      porque: 'Los lugares ya existen: se llenan por índice. Imprime <code>Float32Array(3) [ 0.5, 0, 0 ]</code>.',
    },
    {
      texto: '<code>Array.from(muestras).push(0.5);</code>',
      correcta: false,
      porque: 'Agrega el valor a una <b>copia</b> que se pierde enseguida: <code>muestras</code> no cambia.',
    },
    {
      texto: 'Crearlo vacío, <code>new Float32Array()</code>, y después hacer <code>push</code>',
      correcta: false,
      porque: 'Tendría largo 0 y seguiría sin <code>push</code>: el mismo error.',
    },
  ],
};

export const binariosLab = {
  id: 'binarios-lab',
  titulo: 'Decodificar base64',
  inicial: `// Escribe decodificar(texto64): convierte el texto en base64 en sus bytes
// con Uint8Array.fromBase64, y esos bytes en texto con
// new TextDecoder().decode(bytes).

console.log(decodificar("SG9sYSwgbXVuZG8="));
`,
  verificaciones: [
    { texto: 'Imprime <code>Hola, mundo</code>', prueba: 'return __salida.at(-1) === "Hola, mundo";' },
    { texto: 'Funciona con otros textos, incluidos los acentos', prueba: 'return decodificar("SlM=") === "JS" && decodificar("wqFPbMOpIQ==") === "¡Olé!";' },
    { texto: 'Usa <code>Uint8Array.fromBase64</code>', prueba: String.raw`return /Uint8Array\.fromBase64\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function decodificar(texto64) { … }</code> arriba de todo.',
    'Primero los bytes: <code>const bytes = Uint8Array.fromBase64(texto64);</code>',
    'Después el texto: <code>return new TextDecoder().decode(bytes);</code>',
  ] as [string, string, string],
  solucion: `function decodificar(texto64) {
  const bytes = Uint8Array.fromBase64(texto64);
  return new TextDecoder().decode(bytes);
}

console.log(decodificar("SG9sYSwgbXVuZG8="));`,
  explicacion:
    '<p>Base64 representa bytes con letras, para poder enviarlos donde solo se admite texto. <code>TextDecoder</code> interpreta esos bytes como UTF-8, por eso los acentos funcionan. <code>atob</code>, la forma antigua, los habría roto.</p>',
};
