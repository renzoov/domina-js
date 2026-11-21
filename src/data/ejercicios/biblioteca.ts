// Ejercicios de la sección 11: «Biblioteca estándar».

/* ── 11.1 Fechas: Date y Temporal ────────────────────────── */
export const fechasAuto = {
  id: 'fechas-auto',
  titulo: 'Fechas sin sorpresas',
  preguntas: [
    {
      pregunta: 'En <code>new Date(2026, 0, 15)</code>, ¿qué mes es el <code>0</code>?',
      opciones: ['Diciembre', 'Enero: en <code>Date</code>, los meses empiezan en 0', 'Es un error'],
      correcta: 1,
      explicacion: 'Uno de los problemas clásicos de <code>Date</code>. En Temporal, enero es el mes 1.',
    },
    {
      pregunta: '¿Qué tiene de peligroso que <code>Date</code> sea mutable?',
      opciones: ['Nada', 'Métodos como <code>setDate</code> cambian el objeto: si lo compartías, cambia para todos', 'Que es lento'],
      correcta: 1,
      explicacion: 'Todos los objetos de Temporal son inmutables: <code>add</code>, <code>with</code> y compañía devuelven uno nuevo.',
    },
    {
      pregunta: '¿Qué tipo de Temporal usarías para un cumpleaños?',
      opciones: ['<code>Temporal.Instant</code>', '<code>Temporal.PlainDate</code>: una fecha de calendario, sin hora ni zona horaria', '<code>Temporal.Duration</code>'],
      correcta: 1,
      explicacion: 'Un cumpleaños es el mismo día en cualquier lugar del mundo. Para un momento exacto (un vuelo, una reunión) está <code>ZonedDateTime</code>.',
    },
    {
      pregunta: '¿Qué devuelve <code>Temporal.PlainDate.from("2026-01-31").add({ months: 1 })</code>?',
      opciones: ['2026-03-03', '2026-02-28', 'Un error'],
      correcta: 1,
      explicacion: 'Temporal ajusta al último día válido del mes. <code>Date</code>, en cambio, se "pasa" al 3 de marzo.',
    },
  ],
};

export const fechasOrden = {
  id: 'fechas-orden',
  titulo: 'Un mes después del 31',
  codigo: `const d = new Date(2026, 0, 31);
d.setMonth(d.getMonth() + 1);
console.log(d.getMonth() + 1, d.getDate());

const p = Temporal.PlainDate.from("2026-01-31");
console.log(p.add({ months: 1 }).toString());
console.log(p.toString());

const dur = Temporal.PlainDate.from("2026-01-01").until("2026-03-15");
console.log(dur.days);`,
  salida: ['3 3', '2026-02-28', '2026-01-31', '73'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>Date</code> intenta el 31 de febrero, no existe, y "rebalsa" al 3 de marzo. Temporal se queda en el último día de febrero, y <code>p</code> no cambia, porque es inmutable. <code>until</code> mide la distancia entre dos fechas: 31 + 28 + 14 días.',
};

export const fechasDetective = {
  id: 'fechas-detective',
  titulo: 'Cambiar una fecha inmutable',
  codigo: `const navidad = Temporal.PlainDate.from("2026-12-25");
navidad.setDate(26);
console.log(navidad.toString());`,
  error: `fechas.js:2
navidad.setDate(26);
        ^

TypeError: navidad.setDate is not a function`,
  culpable: 2,
  hallazgo:
    'Las fechas de Temporal son <b>inmutables</b>: no tienen métodos <code>set…</code>. Para "cambiar" una fecha se crea una nueva, a partir de la original.',
  pista: '<code>setDate</code> es de <code>Date</code>. ¿Cómo se obtiene otra fecha en Temporal?',
  arreglos: [
    {
      texto: '<code>const sanEsteban = navidad.add({ days: 1 });</code>',
      correcta: true,
      porque: '<code>add</code> devuelve una fecha nueva, <code>2026-12-26</code>, y <code>navidad</code> sigue intacta. También existe <code>navidad.with({ day: 26 })</code>.',
    },
    {
      texto: '<code>navidad.day = 26;</code>',
      correcta: false,
      porque: '<code>day</code> es de solo lectura: la asignación se ignora (o lanza un <code>TypeError</code> en modo estricto). La fecha sigue siendo el 25.',
    },
    {
      texto: 'Convertirla: <code>new Date(navidad).setDate(26)</code>',
      correcta: false,
      porque: 'Vuelves a los problemas de <code>Date</code>, y además la conversión no es directa: un <code>PlainDate</code> no tiene hora ni zona.',
    },
  ],
};

export const fechasLab = {
  id: 'fechas-lab',
  titulo: 'Días que faltan',
  inicial: `// Escribe diasEntre(desde, hasta): recibe dos fechas en texto ("2026-12-01")
// y devuelve cuántos días hay entre ellas, usando Temporal.PlainDate.

console.log(diasEntre("2026-12-01", "2026-12-25"));
console.log(diasEntre("2026-02-01", "2026-03-01"));
`,
  verificaciones: [
    { texto: 'Imprime <code>24</code> y <code>28</code>', prueba: 'return __salida.join("|") === "24|28";' },
    { texto: 'Funciona entre años, incluido uno bisiesto: de 2028-01-01 a 2029-01-01 hay 366 días', prueba: 'return diasEntre("2028-01-01", "2029-01-01") === 366;' },
    { texto: 'Usa <code>Temporal.PlainDate</code>', prueba: String.raw`return /Temporal\.PlainDate/.test(__codigo) && !/new\s+Date\b/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function diasEntre(desde, hasta) { … }</code> arriba de todo.',
    'Convierte los textos: <code>Temporal.PlainDate.from(desde)</code>. Con el primero, llama a <code>until(hasta)</code>.',
    '<code>until</code> devuelve una duración: el número está en su propiedad <code>days</code>.',
  ] as [string, string, string],
  solucion: `function diasEntre(desde, hasta) {
  return Temporal.PlainDate.from(desde).until(hasta).days;
}

console.log(diasEntre("2026-12-01", "2026-12-25"));
console.log(diasEntre("2026-02-01", "2026-03-01"));`,
  explicacion:
    '<p>Con <code>Date</code> habría que restar milisegundos, dividir por 86 400 000 y pelear con los cambios de horario de verano. <code>PlainDate</code> trabaja con días de calendario, así que el resultado es exacto, bisiestos incluidos.</p>',
};

/* ── 11.2 Expresiones regulares ──────────────────────────── */
export const regexAuto = {
  id: 'regex-auto',
  titulo: 'Patrones de texto',
  preguntas: [
    {
      pregunta: '¿Qué hace la bandera <code>g</code> en <code>/a/g</code>?',
      opciones: ['Ignora mayúsculas', 'Busca <b>todas</b> las coincidencias, no solo la primera', 'Nada'],
      correcta: 1,
      explicacion: '<code>i</code> ignora mayúsculas, <code>m</code> hace que <code>^</code> y <code>$</code> funcionen por línea y <code>s</code> hace que <code>.</code> incluya saltos de línea.',
    },
    {
      pregunta: '¿Qué ventaja tienen los <b>grupos con nombre</b>, <code>(?&lt;anio&gt;\\d{4})</code>?',
      opciones: ['Son más rápidos', 'Lees el resultado por nombre (<code>groups.anio</code>) en lugar de por posición', 'Ninguna'],
      correcta: 1,
      explicacion: 'Si después agregas un grupo, los nombres siguen funcionando; las posiciones, no.',
    },
    {
      pregunta: '¿Para qué sirve <code>RegExp.escape(texto)</code> (ES2025)?',
      opciones: ['Para borrar el texto', 'Para usar un texto cualquiera dentro de una regex, escapando los caracteres especiales como <code>.</code> o <code>(</code>', 'Para cifrar'],
      correcta: 1,
      explicacion: 'Imprescindible si el texto viene del usuario: sin escapar, <code>"(USD"</code> rompe la regex.',
    },
    {
      pregunta: '¿Qué hace <code>(?i:hola)</code> (ES2025)?',
      opciones: ['Nada', 'Ignora mayúsculas solo dentro de ese grupo: es un <b>modificador</b> local', 'Lo hace opcional'],
      correcta: 1,
      explicacion: 'Antes, la bandera <code>i</code> afectaba a toda la expresión.',
    },
  ],
};

export const regexOrden = {
  id: 'regex-orden',
  titulo: 'Grupos, escapes y modificadores',
  codigo: `const fecha = "2026-11-20";
const { groups } = fecha.match(/(?<anio>\\d{4})-(?<mes>\\d{2})-(?<dia>\\d{2})/);
console.log(groups.dia + "/" + groups.mes);

console.log("a.b.c".replace(/./g, "-"));
console.log("a.b.c".replace(new RegExp(RegExp.escape("."), "g"), "-"));

console.log(/(?i:hola) Mundo/.test("HOLA Mundo"), /(?i:hola) Mundo/.test("hola MUNDO"));`,
  salida: ['20/11', '-----', 'a-b-c', 'true false'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'Los grupos con nombre se leen en <code>groups</code>. Sin escapar, el <code>.</code> significa "cualquier carácter" y reemplaza todo; con <code>RegExp.escape</code> es un punto literal. El modificador ignora mayúsculas solo en <code>hola</code>: <code>MUNDO</code> no coincide con <code>Mundo</code>.',
};

export const regexDetective = {
  id: 'regex-detective',
  titulo: 'Una búsqueda que rompe la regex',
  codigo: `const buscar = "precio (USD";
const texto = "El precio (USD) es 20";

const re = new RegExp(buscar);
console.log(re.test(texto));`,
  error: `busqueda.js:4
const re = new RegExp(buscar);
           ^

SyntaxError: Invalid regular expression: /precio (USD/: Unterminated group`,
  culpable: 4,
  hallazgo:
    'El paréntesis tiene un significado especial en las expresiones regulares: abre un grupo. El texto del usuario se usa tal cual como patrón, y el grupo nunca se cierra.',
  pista: 'El mensaje dice <em>Unterminated group</em>. ¿Qué carácter del texto buscado abre un grupo?',
  arreglos: [
    {
      texto: 'Escapar el texto: <code>new RegExp(RegExp.escape(buscar))</code>',
      correcta: true,
      porque: '<code>RegExp.escape</code> convierte los caracteres especiales en literales: el paréntesis se busca como paréntesis. Imprime <code>true</code>.',
    },
    {
      texto: 'Agregar la bandera <code>"g"</code>',
      correcta: false,
      porque: 'Las banderas no cambian cómo se lee el patrón: el grupo sigue sin cerrarse.',
    },
    {
      texto: 'Envolver la línea 4 en <code>try/catch</code> y devolver <code>false</code>',
      correcta: false,
      porque: 'Ya no se rompe, pero cualquier búsqueda con <code>(</code>, <code>.</code> o <code>*</code> fallaría o daría resultados equivocados.',
    },
  ],
};

export const regexLab = {
  id: 'regex-lab',
  titulo: 'Extraer precios',
  inicial: `// Escribe extraerPrecios(texto): devuelve un array con los números de todos los
// precios del texto, escritos como "$12.50" o "$3". Usa matchAll
// y un grupo con nombre para el número.

console.log(extraerPrecios("Té $3, café $4.50 y medialunas $12.25"));
`,
  verificaciones: [
    { texto: 'Imprime <code>[ 3, 4.5, 12.25 ]</code>', prueba: 'return __salida.at(-1) === "[ 3, 4.5, 12.25 ]";' },
    { texto: 'Sin precios, devuelve un array vacío', prueba: 'const r = extraerPrecios("gratis"); return Array.isArray(r) && r.length === 0;' },
    { texto: 'Usa <code>matchAll</code> y un grupo con nombre', prueba: String.raw`return /\.matchAll\s*\(/.test(__codigo) && /\(\?<\w+>/.test(__codigo);` },
  ],
  pistas: [
    'El patrón: un <code>$</code> literal (<code>\\$</code>), dígitos (<code>\\d+</code>) y, opcionalmente, un punto con más dígitos (<code>(?:\\.\\d+)?</code>). Con la bandera <code>g</code>.',
    'Con nombre: <code>/\\$(?&lt;valor&gt;\\d+(?:\\.\\d+)?)/g</code>',
    '<code>return [...texto.matchAll(re)].map((m) => Number(m.groups.valor));</code>',
  ] as [string, string, string],
  solucion: `function extraerPrecios(texto) {
  const re = /\\$(?<valor>\\d+(?:\\.\\d+)?)/g;
  return [...texto.matchAll(re)].map((m) => Number(m.groups.valor));
}

console.log(extraerPrecios("Té $3, café $4.50 y medialunas $12.25"));`,
  explicacion:
    '<p><code>matchAll</code> devuelve un iterador con cada coincidencia y sus grupos. El <code>$</code> se escapa porque en una regex significa "fin del texto", y el grupo <code>(?:…)</code> agrupa sin capturar.</p>',
};

/* ── 11.3 Internacionalización con Intl ──────────────────── */
export const intlAuto = {
  id: 'intl-auto',
  titulo: 'Cada idioma, sus reglas',
  preguntas: [
    {
      pregunta: '¿Por qué no basta con <code>n.toFixed(2)</code> para mostrar un precio?',
      opciones: [
        'Sí basta',
        'Cada idioma y país usa separadores, símbolos y posiciones distintos: <code>1.234,50 €</code>, <code>$1,234.50</code>…',
        'Porque es lento',
      ],
      correcta: 1,
      explicacion: '<code>Intl.NumberFormat</code> conoce las reglas de cada lugar.',
    },
    {
      pregunta: '¿Qué hace <code>Intl.RelativeTimeFormat</code>?',
      opciones: ['Formatea fechas absolutas', 'Escribe tiempos relativos como "hace 3 días" o "mañana"', 'Mide tiempos'],
      correcta: 1,
      explicacion: 'Con <code>numeric: "auto"</code> usa palabras como "ayer" y "mañana" cuando existen.',
    },
    {
      pregunta: '¿Para qué sirve <code>Intl.PluralRules</code>?',
      opciones: ['Para traducir', 'Para saber qué forma del plural corresponde a un número en cada idioma', 'Para contar'],
      correcta: 1,
      explicacion: 'En español hay dos formas (1 producto, 2 productos); en otros idiomas, hasta seis.',
    },
    {
      pregunta: '¿Por qué ordenar con <code>Intl.Collator</code> en lugar de <code>sort()</code> a secas?',
      opciones: ['Por nada', 'Porque <code>sort()</code> compara códigos Unicode: "Zoe" quedaría antes que "ana" y "ñ" al final', 'Porque es más corto'],
      correcta: 1,
      explicacion: 'El collator sigue las reglas del idioma: mayúsculas, acentos y letras propias como la ñ.',
    },
  ],
};

export const intlOrden = {
  id: 'intl-orden',
  titulo: 'El mismo número, otros idiomas',
  codigo: `const n = 1234567.891;

console.log(new Intl.NumberFormat("es-ES").format(n));
console.log(new Intl.NumberFormat("en-US").format(n));
console.log(new Intl.ListFormat("es", { type: "disjunction" }).format(["té", "café", "mate"]));
console.log(new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(-1, "day"));`,
  salida: ['1.234.567,891', '1,234,567.891', 'té, café o mate', 'ayer'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'En España, los miles se separan con punto y los decimales con coma; en Estados Unidos, al revés. <code>ListFormat</code> con <code>disjunction</code> une con "o", y <code>RelativeTimeFormat</code> convierte "-1 día" en "ayer".',
};

export const intlDetective = {
  id: 'intl-detective',
  titulo: 'Moneda sin moneda',
  codigo: `const precio = new Intl.NumberFormat("es-PE", { style: "currency" });

console.log(precio.format(49.9));`,
  error: `precios.js:1
const precio = new Intl.NumberFormat("es-PE", { style: "currency" });
               ^

TypeError: Currency code is required with currency style.`,
  culpable: 1,
  hallazgo:
    'El estilo <code>currency</code> necesita saber <b>qué</b> moneda: el idioma no alcanza. En un mismo país se puede pagar en soles o en dólares.',
  pista: 'El mensaje dice qué falta: <em>currency code</em>.',
  arreglos: [
    {
      texto: 'Agregar el código: <code>{ style: "currency", currency: "PEN" }</code>',
      correcta: true,
      porque: 'Con el código ISO de la moneda, <code>format(49.9)</code> da <code>S/ 49.90</code>.',
    },
    {
      texto: 'Quitar <code>style: "currency"</code> y concatenar <code>"S/ " + …</code>',
      correcta: false,
      porque: 'Funciona en este caso, pero pierdes las reglas de cada lugar: posición del símbolo, espacios, decimales de cada moneda.',
    },
    {
      texto: 'Cambiar el idioma a <code>"es"</code>',
      correcta: false,
      porque: 'Ningún idioma tiene una moneda "por defecto": el mismo error.',
    },
  ],
};

export const intlLab = {
  id: 'intl-lab',
  titulo: 'Describir un carrito',
  inicial: `// Escribe describirCarrito(productos): devuelve, por ejemplo,
// "3 productos: pan, leche y huevos" o "1 producto: pan".
// Usa Intl.ListFormat para la lista e Intl.PluralRules para elegir
// entre "producto" y "productos".

console.log(describirCarrito(["pan", "leche", "huevos"]));
console.log(describirCarrito(["pan"]));
`,
  verificaciones: [
    { texto: 'Imprime <code>3 productos: pan, leche y huevos</code> y <code>1 producto: pan</code>', prueba: 'return __salida.join("|") === "3 productos: pan, leche y huevos|1 producto: pan";' },
    { texto: 'Con dos: <code>2 productos: té y café</code>', prueba: 'return describirCarrito(["té", "café"]) === "2 productos: té y café";' },
    { texto: 'Usa <code>Intl.ListFormat</code> e <code>Intl.PluralRules</code>', prueba: String.raw`return /Intl\.ListFormat/.test(__codigo) && /Intl\.PluralRules/.test(__codigo);` },
  ],
  pistas: [
    'La lista: <code>new Intl.ListFormat("es").format(productos)</code> da <code>"pan, leche y huevos"</code>.',
    'El plural: <code>new Intl.PluralRules("es").select(n)</code> devuelve <code>"one"</code> o <code>"other"</code>.',
    'Con un objeto: <code>const palabra = { one: "producto", other: "productos" }[regla];</code>',
  ] as [string, string, string],
  solucion: `const lista = new Intl.ListFormat("es");
const plurales = new Intl.PluralRules("es");
const palabras = { one: "producto", other: "productos" };

function describirCarrito(productos) {
  const n = productos.length;
  return \`\${n} \${palabras[plurales.select(n)]}: \${lista.format(productos)}\`;
}

console.log(describirCarrito(["pan", "leche", "huevos"]));
console.log(describirCarrito(["pan"]));`,
  explicacion:
    '<p>Crear los formateadores una sola vez, fuera de la función, es más eficiente. Y el objeto <code>palabras</code> es fácil de traducir: en otro idioma, <code>PluralRules</code> podría devolver <code>"few"</code> o <code>"many"</code>, y solo habría que agregar esas claves.</p>',
};

/* ── 11.4 Unicode y emojis ───────────────────────────────── */
export const unicodeAuto = {
  id: 'unicode-auto',
  titulo: '¿Cuántos caracteres?',
  preguntas: [
    {
      pregunta: '¿Por qué <code>"👍".length</code> da 2?',
      opciones: ['Por un error', 'Porque <code>length</code> cuenta unidades de 16 bits (UTF-16), y ese emoji necesita dos', 'Porque tiene dos colores'],
      correcta: 1,
      explicacion: 'Los caracteres fuera del plano básico de Unicode, como casi todos los emojis, ocupan dos unidades: un par sustituto.',
    },
    {
      pregunta: '<code>"é"</code> escrito con un solo carácter y <code>"e\\u0301"</code> (e + acento combinante), ¿son iguales con <code>===</code>?',
      opciones: ['Sí', 'No: se ven igual, pero son secuencias distintas; con <code>normalize()</code> sí son iguales'],
      correcta: 1,
      explicacion: 'Normaliza los textos antes de compararlos o guardarlos, sobre todo si vienen de distintas fuentes.',
    },
    {
      pregunta: '¿Qué cuenta <code>Intl.Segmenter</code> con <code>granularity: "grapheme"</code>?',
      opciones: ['Bytes', 'Lo que una persona ve como un carácter: un emoji de familia es uno solo', 'Palabras'],
      correcta: 1,
      explicacion: 'Es la forma correcta de contar o cortar "caracteres" de verdad.',
    },
    {
      pregunta: '¿Qué hace <code>texto.isWellFormed()</code> (ES2024)?',
      opciones: ['Revisa la ortografía', 'Dice si el texto tiene pares sustitutos sueltos, que romperían funciones como <code>encodeURIComponent</code>', 'Cuenta caracteres'],
      correcta: 1,
      explicacion: '<code>toWellFormed()</code> reemplaza los sueltos por <code>�</code>.',
    },
  ],
};

export const unicodeOrden = {
  id: 'unicode-orden',
  titulo: 'Contar de tres formas',
  codigo: `const e1 = "é";            // un solo carácter
const e2 = "e\\u0301";      // e + acento combinante
console.log(e1 === e2, e1.normalize() === e2.normalize());

console.log("👍".length, [..."👍"].length);

const familia = "👨‍👩‍👧";
console.log([...familia].length);
console.log([...new Intl.Segmenter("es", { granularity: "grapheme" }).segment(familia)].length);`,
  salida: ['false true', '2 1', '5', '1'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Las dos <code>é</code> son distintas hasta que se normalizan. El pulgar ocupa 2 unidades de 16 bits, pero es 1 punto de código, que es lo que cuenta el spread. La familia son 5 puntos de código (tres personas unidas por dos caracteres invisibles), pero un solo grafema: lo que ves.',
};

export const unicodeDetective = {
  id: 'unicode-detective',
  titulo: 'Cortar un emoji por la mitad',
  codigo: `const reaccion = "👍 me gusta";
const inicial = reaccion.slice(0, 1);

console.log(encodeURIComponent(inicial));`,
  error: `reaccion.js:4
console.log(encodeURIComponent(inicial));
            ^

URIError: URI malformed`,
  culpable: 2,
  hallazgo:
    '<code>slice(0, 1)</code> corta por unidades de 16 bits: se queda con la <b>mitad</b> del emoji, un sustituto suelto que no es un carácter válido. <code>encodeURIComponent</code> no sabe qué hacer con él.',
  pista: '¿Cuántas unidades ocupa <code>👍</code>? ¿Con qué se queda <code>slice(0, 1)</code>?',
  arreglos: [
    {
      texto: 'Tomar el primer carácter de verdad: <code>const inicial = [...reaccion][0];</code>',
      correcta: true,
      porque: 'El spread recorre por puntos de código: el emoji queda entero. Para emojis compuestos, como las familias, usa <code>Intl.Segmenter</code>.',
    },
    {
      texto: 'Usar <code>reaccion[0]</code>',
      correcta: false,
      porque: 'Los corchetes también indexan por unidades de 16 bits: es la misma mitad del emoji.',
    },
    {
      texto: 'Arreglarlo con <code>inicial.toWellFormed()</code>',
      correcta: false,
      porque: 'Ya no falla, pero el emoji se convierte en <code>�</code>: pierdes el dato.',
    },
  ],
};

export const unicodeLab = {
  id: 'unicode-lab',
  titulo: 'Contar lo que se ve',
  inicial: `// Escribe contarCaracteres(texto): devuelve cuántos caracteres ve una persona,
// contando cada emoji compuesto como uno solo. Usa Intl.Segmenter.

console.log(contarCaracteres("hola 👋"));
console.log(contarCaracteres("👨‍👩‍👧"));
`,
  verificaciones: [
    { texto: 'Imprime <code>6</code> y <code>1</code>', prueba: 'return __salida.join("|") === "6|1";' },
    { texto: 'Cuenta bien los acentos combinantes: <code>"e\\u0301"</code> es 1', prueba: 'return contarCaracteres("e\\u0301") === 1 && contarCaracteres("") === 0;' },
    { texto: 'Usa <code>Intl.Segmenter</code>', prueba: String.raw`return /Intl\.Segmenter/.test(__codigo);` },
  ],
  pistas: [
    'Crea el segmentador: <code>new Intl.Segmenter("es", { granularity: "grapheme" })</code>.',
    '<code>segmentador.segment(texto)</code> devuelve un iterable con un elemento por grafema.',
    'Cuéntalos: <code>return [...segmentador.segment(texto)].length;</code>',
  ] as [string, string, string],
  solucion: `const segmentador = new Intl.Segmenter("es", { granularity: "grapheme" });

function contarCaracteres(texto) {
  return [...segmentador.segment(texto)].length;
}

console.log(contarCaracteres("hola 👋"));
console.log(contarCaracteres("👨‍👩‍👧"));`,
  explicacion:
    '<p>Es lo que necesitas para un contador de caracteres en un formulario, o para cortar un texto largo sin romper emojis. <code>length</code> y el spread cuentan otras cosas: unidades de 16 bits y puntos de código.</p>',
};

/* ── 11.5 URL y URLSearchParams ──────────────────────────── */
export const urlAuto = {
  id: 'url-auto',
  titulo: 'Direcciones por partes',
  preguntas: [
    {
      pregunta: 'En <code>https://tienda.com:8080/buscar?q=te#arriba</code>, ¿qué es <code>?q=te</code>?',
      opciones: ['El <code>hash</code>', 'El <code>search</code>: los parámetros de búsqueda', 'El <code>pathname</code>'],
      correcta: 1,
      explicacion: '<code>hostname</code> es <code>tienda.com</code>, <code>port</code> es <code>8080</code>, <code>pathname</code> es <code>/buscar</code> y <code>hash</code> es <code>#arriba</code>.',
    },
    {
      pregunta: '¿Por qué usar <code>searchParams.set</code> en lugar de armar <code>"?q=" + texto</code>?',
      opciones: ['Por estilo', 'Porque codifica los caracteres especiales (espacios, <code>&amp;</code>, acentos) y no rompe la URL', 'Porque es más corto'],
      correcta: 1,
      explicacion: 'Si <code>texto</code> es <code>"té &amp; café"</code>, concatenar crearía un parámetro de más.',
    },
    {
      pregunta: '¿Qué hace <code>new URL("../ayuda", "https://a.com/es/buscar")</code>?',
      opciones: ['Da error', 'Resuelve la ruta relativa contra la base, como un navegador: <code>https://a.com/ayuda</code>', 'Concatena los textos'],
      correcta: 1,
      explicacion: 'El segundo argumento es la base. Sin base, una ruta relativa lanza <code>TypeError: Invalid URL</code>.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>URL.parse(texto)</code> y <code>new URL(texto)</code>?',
      opciones: ['Ninguna', 'Si el texto no es una URL válida, <code>URL.parse</code> devuelve <code>null</code> en lugar de lanzar un error', '<code>URL.parse</code> es más lento'],
      correcta: 1,
      explicacion: 'Y <code>URL.canParse(texto)</code> solo responde si es válida, con un booleano.',
    },
  ],
};

export const urlOrden = {
  id: 'url-orden',
  titulo: 'Leer y cambiar una URL',
  codigo: `const url = new URL("https://tienda.com/buscar?q=te+verde&pagina=2#resultados");

console.log(url.hostname, url.pathname);
console.log(url.searchParams.get("q"));

url.searchParams.set("pagina", "3");
url.searchParams.append("orden", "precio");
console.log(url.search);

console.log(new URL("../ayuda", "https://tienda.com/es/buscar").href);`,
  salida: ['tienda.com /buscar', 'te verde', '?q=te+verde&pagina=3&orden=precio', 'https://tienda.com/ayuda'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>searchParams.get</code> decodifica: el <code>+</code> vuelve a ser un espacio. <code>set</code> reemplaza un parámetro y <code>append</code> agrega uno, y el <code>search</code> se actualiza solo. La ruta relativa sube un nivel desde <code>/es/</code>.',
};

export const urlDetective = {
  id: 'url-detective',
  titulo: 'Una ruta sin base',
  codigo: `function enlacePerfil(usuario) {
  const url = new URL(\`/perfil/\${usuario}\`);
  return url.href;
}

console.log(enlacePerfil("ana"));`,
  error: `node:internal/url:816
    href = bindingUrl.parse(input, base, true);
                      ^

TypeError: Invalid URL
    at new URL (node:internal/url:816:25)
    at enlacePerfil (perfil.js:2:15) {
  code: 'ERR_INVALID_URL',
  input: '/perfil/ana'
}`,
  culpable: 2,
  hallazgo:
    '<code>/perfil/ana</code> es una ruta, no una URL completa: no tiene protocolo ni dominio. <code>new URL</code> no sabe contra qué resolverla.',
  pista: 'El error dice cuál fue el <code>input</code>. ¿A qué sitio pertenece esa ruta?',
  arreglos: [
    {
      texto: 'Pasar una base: <code>new URL(`/perfil/${usuario}`, "https://mi-sitio.com")</code>',
      correcta: true,
      porque: 'Con la base, la ruta se resuelve como lo haría un navegador: <code>https://mi-sitio.com/perfil/ana</code>. En una página, la base suele ser <code>location.href</code>.',
    },
    {
      texto: 'Usar <code>URL.parse(…)</code>',
      correcta: false,
      porque: 'No lanza error, pero devuelve <code>null</code>, y <code>null.href</code> falla en la línea siguiente.',
    },
    {
      texto: 'Pasar el texto por <code>encodeURI</code> antes',
      correcta: false,
      porque: 'El problema no son los caracteres, sino que falta la parte del dominio: el mismo error.',
    },
  ],
};

export const urlLab = {
  id: 'url-lab',
  titulo: 'Agregar filtros a una URL',
  inicial: `// Escribe conFiltros(direccion, filtros): devuelve la dirección (texto) con
// cada filtro del objeto agregado o reemplazado como parámetro de búsqueda.
// Usa URL y searchParams: nada de concatenar textos.

console.log(conFiltros("https://tienda.com/buscar?q=te", { orden: "precio", pagina: 2 }));
console.log(conFiltros("https://tienda.com/buscar?pagina=1", { pagina: 3, marca: "té & café" }));
`,
  verificaciones: [
    { texto: 'Imprime las dos direcciones con sus filtros', prueba: 'return __salida.join("|") === "https://tienda.com/buscar?q=te&orden=precio&pagina=2|https://tienda.com/buscar?pagina=3&marca=t%C3%A9+%26+caf%C3%A9";' },
    { texto: 'Reemplaza en lugar de duplicar: no queda ningún <code>pagina=1</code>', prueba: 'return !conFiltros("https://a.com/?pagina=1", { pagina: 5 }).includes("pagina=1");' },
    { texto: 'Usa <code>new URL</code> y <code>searchParams.set</code>', prueba: String.raw`return /new\s+URL\s*\(/.test(__codigo) && /searchParams\.set\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function conFiltros(direccion, filtros) { const url = new URL(direccion); … }</code> arriba de todo.',
    'Recorre el objeto: <code>for (const [clave, valor] of Object.entries(filtros))</code>.',
    'Dentro: <code>url.searchParams.set(clave, valor);</code>. Al final, <code>return url.href;</code>',
  ] as [string, string, string],
  solucion: `function conFiltros(direccion, filtros) {
  const url = new URL(direccion);
  for (const [clave, valor] of Object.entries(filtros)) {
    url.searchParams.set(clave, valor);
  }
  return url.href;
}

console.log(conFiltros("https://tienda.com/buscar?q=te", { orden: "precio", pagina: 2 }));
console.log(conFiltros("https://tienda.com/buscar?pagina=1", { pagina: 3, marca: "té & café" }));`,
  explicacion:
    '<p>Fíjate en la segunda dirección: el <code>&amp;</code> de <code>"té &amp; café"</code> se codificó como <code>%26</code>. Concatenando, ese <code>&amp;</code> habría partido el parámetro en dos. <code>searchParams</code> codifica por ti.</p>',
};

/* ── 11.6 Timers y la consola a fondo ────────────────────── */
export const consolaAuto = {
  id: 'consola-auto',
  titulo: 'Temporizadores y depuración',
  preguntas: [
    {
      pregunta: '¿Qué devuelve <code>setTimeout</code>?',
      opciones: ['Nada', 'Un identificador, que sirve para cancelarlo con <code>clearTimeout</code>', 'Una promesa'],
      correcta: 1,
      explicacion: 'En el navegador es un número; en Node.js, un objeto <code>Timeout</code>. En los dos casos se pasa a <code>clearTimeout</code>.',
    },
    {
      pregunta: '¿Qué ventaja tiene un <code>setTimeout</code> que se vuelve a programar a sí mismo frente a un <code>setInterval</code>?',
      opciones: ['Ninguna', 'Espera a que termine cada vuelta antes de programar la siguiente: las vueltas nunca se encimen', 'Es más preciso'],
      correcta: 1,
      explicacion: 'Con <code>setInterval</code>, si una vuelta tarda más que el intervalo, las siguientes se acumulan.',
    },
    {
      pregunta: 'En una pestaña del navegador que está en segundo plano, ¿los temporizadores siguen al mismo ritmo?',
      opciones: ['Sí', 'No: el navegador los frena, a veces hasta una vez por segundo o menos, para ahorrar batería'],
      correcta: 1,
      explicacion: 'No uses temporizadores para medir el tiempo transcurrido: compara marcas de tiempo, con <code>performance.now()</code>.',
    },
    {
      pregunta: '¿Para qué sirve <code>console.table(datos)</code>?',
      opciones: ['Para dibujar gráficos', 'Para mostrar un array de objetos (o un objeto) como una tabla, una fila por elemento', 'Para crear tablas HTML'],
      correcta: 1,
      explicacion: 'Junto con <code>group</code>, <code>count</code>, <code>time</code> y <code>assert</code>, hace la depuración mucho más legible.',
    },
  ],
};

export const consolaOrden = {
  id: 'consola-orden',
  titulo: 'Contadores, aserciones y argumentos',
  codigo: `const id = setTimeout(() => console.log("nunca"), 50);
setTimeout((a, b) => console.log("args:", a, b), 10, "x", "y");
clearTimeout(id);

console.count();
console.count("pedidos");
console.count();
console.assert(2 + 2 === 5, "las cuentas no dan");`,
  salida: ['default: 1', 'pedidos: 1', 'default: 2', 'Assertion failed: las cuentas no dan', 'args: x y'],
  inicio: [4, 2, 0, 3, 1],
  explicacion:
    'El primer temporizador se cancela antes de vencer. El segundo recibe los argumentos que van después del tiempo. <code>count</code> lleva un contador por etiqueta, y <code>assert</code> solo imprime si la condición es falsa. Todo lo síncrono va antes del temporizador.',
};

export const consolaDetective = {
  id: 'consola-detective',
  titulo: 'Un intervalo imposible de detener',
  codigo: `function iniciarReloj() {
  let n = 0;
  const id = setInterval(() => {
    n++;
    console.log("tic", n);
  }, 100);
}

iniciarReloj();
setTimeout(() => clearInterval(id), 350);`,
  error: `tic 1
tic 2
tic 3
reloj.js:10
setTimeout(() => clearInterval(id), 350);
                               ^

ReferenceError: id is not defined`,
  culpable: 10,
  hallazgo:
    '<code>id</code> vive dentro de <code>iniciarReloj</code>: desde afuera no se ve. El intervalo queda sin forma de detenerse, y en Node.js el programa terminaría por el error; sin él, el reloj seguiría para siempre.',
  pista: '¿En qué scope se declaró <code>id</code>? ¿Desde dónde se intenta usar?',
  arreglos: [
    {
      texto: 'Devolver el identificador: <code>return id;</code> al final de <code>iniciarReloj</code>, y <code>const id = iniciarReloj();</code>',
      correcta: true,
      porque: 'Quien inicia algo que se repite debería poder detenerlo. Otra opción: que la función devuelva directamente una función <code>detener</code>.',
    },
    {
      texto: 'Llamar a <code>clearInterval()</code> sin argumentos',
      correcta: false,
      porque: 'No hace nada: sin identificador, no sabe qué intervalo cancelar. El reloj sigue para siempre.',
    },
    {
      texto: 'Cambiar <code>const id</code> por <code>var id</code> dentro de la función',
      correcta: false,
      porque: '<code>var</code> respeta el scope de las funciones: <code>id</code> sigue sin verse desde afuera.',
    },
  ],
};

export const consolaLab = {
  id: 'consola-lab',
  titulo: 'Repetir sin encimarse',
  inicial: `// Escribe repetir(fn, veces, ms): llama a fn(1), fn(2)… hasta fn(veces),
// con ms milisegundos entre una llamada y la siguiente, usando un setTimeout
// que se vuelve a programar (sin setInterval). Devuelve una promesa
// que se cumple cuando terminó la última vuelta.

await repetir((n) => console.log("vuelta", n), 3, 20);
console.log("listo");
`,
  verificaciones: [
    { texto: 'Imprime <code>vuelta 1</code>, <code>vuelta 2</code>, <code>vuelta 3</code> y <code>listo</code>', prueba: 'return __salida.join("|") === "vuelta 1|vuelta 2|vuelta 3|listo";' },
    { texto: 'Espera entre vueltas: 3 vueltas de 30 ms tardan al menos 55 ms', prueba: 'const t = performance.now(); await repetir(() => {}, 3, 30); return performance.now() - t >= 55;' },
    { texto: 'Usa <code>setTimeout</code> y no <code>setInterval</code>', prueba: String.raw`return /setTimeout\s*\(/.test(__codigo) && !/setInterval/.test(__codigo.replace(/\/\/.*$/gm, ""));` },
  ],
  pistas: [
    'Empieza con <code>function repetir(fn, veces, ms) { return new Promise((listo) => { … }); }</code> arriba de todo.',
    'Dentro, una función que hace una vuelta: <code>const vuelta = (n) => { fn(n); … };</code>, y arrancas con <code>vuelta(1)</code>.',
    'Al final de cada vuelta: <code>if (n &lt; veces) setTimeout(() => vuelta(n + 1), ms); else listo();</code>',
  ] as [string, string, string],
  solucion: `function repetir(fn, veces, ms) {
  return new Promise((listo) => {
    const vuelta = (n) => {
      fn(n);
      if (n < veces) setTimeout(() => vuelta(n + 1), ms);
      else listo();
    };
    vuelta(1);
  });
}

await repetir((n) => console.log("vuelta", n), 3, 20);
console.log("listo");`,
  explicacion:
    '<p>Cada vuelta programa la siguiente solo cuando terminó, así que nunca se encimen, aunque <code>fn</code> tarde. Y devolver una promesa permite esperar el final con <code>await</code>, algo que <code>setInterval</code> no ofrece.</p>',
};

/* ── 11.7 Gestión explícita de recursos: using ───────────── */
export const usingAuto = {
  id: 'using-auto',
  titulo: 'Liberar sin olvidarse',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>using recurso = abrir()</code>?',
      opciones: [
        'Lo mismo que <code>const</code>',
        'Declara una constante y garantiza que, al salir del bloque, se llame a su método <code>[Symbol.dispose]()</code>',
        'Lo usa una vez',
      ],
      correcta: 1,
      explicacion: 'Se llama siempre: al terminar el bloque, con un <code>return</code>, con un <code>break</code> o si se lanza un error.',
    },
    {
      pregunta: 'Con dos <code>using</code> en el mismo bloque, ¿en qué orden se liberan?',
      opciones: ['En el orden en que se declararon', 'En orden <b>inverso</b>: el último en abrirse es el primero en cerrarse', 'Al azar'],
      correcta: 1,
      explicacion: 'Como una pila: lo que se abrió después puede depender de lo anterior, así que se cierra antes.',
    },
    {
      pregunta: '¿Para qué sirve <code>await using</code>?',
      opciones: ['Para recursos cuyo cierre es asíncrono: espera a <code>[Symbol.asyncDispose]()</code>', 'Para que el bloque sea más rápido', 'No existe'],
      correcta: 0,
      explicacion: 'Cerrar una conexión de red o vaciar un archivo a disco suele ser asíncrono.',
    },
    {
      pregunta: '¿Qué es un <code>DisposableStack</code>?',
      opciones: ['Una pila de llamadas', 'Un objeto que junta varias limpiezas (con <code>defer</code>, <code>use</code>, <code>adopt</code>) y las ejecuta todas, en orden inverso, al liberarse', 'Un array'],
      correcta: 1,
      explicacion: 'Útil cuando no sabes de antemano cuántos recursos vas a abrir, o para recursos que no tienen <code>Symbol.dispose</code>.',
    },
  ],
};

export const usingOrden = {
  id: 'using-orden',
  titulo: 'Abrir y cerrar en orden',
  codigo: `function recurso(nombre) {
  console.log("abre", nombre);
  return {
    [Symbol.dispose]() {
      console.log("cierra", nombre);
    },
  };
}

{
  using a = recurso("A");
  using b = recurso("B");
  console.log("trabajo");
}
console.log("después del bloque");`,
  salida: ['abre A', 'abre B', 'trabajo', 'cierra B', 'cierra A', 'después del bloque'],
  inicio: [3, 0, 5, 2, 4, 1],
  explicacion:
    'Los recursos se abren en orden, el bloque trabaja y, al salir, se liberan en orden <b>inverso</b>: primero B, después A. Todo antes de la línea siguiente al bloque.',
};

export const usingDetective = {
  id: 'using-detective',
  titulo: 'Un recurso que no sabe liberarse',
  codigo: `function abrirArchivo(nombre) {
  return {
    nombre,
    cerrar() {
      console.log("cerrado", nombre);
    },
  };
}

{
  using archivo = abrirArchivo("datos.txt");
  console.log("leyendo", archivo.nombre);
}`,
  error: `archivo.js:11
  using archivo = abrirArchivo("datos.txt");
        ^

TypeError: Symbol(Symbol.dispose) is not a function`,
  culpable: 4,
  hallazgo:
    '<code>using</code> necesita saber cómo liberar el recurso, y para eso busca un método bajo la clave <code>Symbol.dispose</code>. Este objeto tiene un <code>cerrar</code>, pero <code>using</code> no puede adivinar que es eso.',
  pista: '¿Qué método llama <code>using</code> al salir del bloque? ¿Lo tiene este objeto?',
  arreglos: [
    {
      texto: 'Llamar <code>[Symbol.dispose]()</code> al método de cierre, en lugar de <code>cerrar()</code>',
      correcta: true,
      porque: 'Ahora el objeto cumple el protocolo: al salir del bloque se imprime <code>cerrado datos.txt</code>, aunque haya un error en medio.',
    },
    {
      texto: 'Cambiar <code>using</code> por <code>const</code>',
      correcta: false,
      porque: 'Ya no da error, pero nadie cierra el archivo: justo lo que <code>using</code> venía a evitar.',
    },
    {
      texto: 'Poner <code>archivo.cerrar()</code> antes del <code>console.log</code>',
      correcta: false,
      porque: 'El <code>using</code> sigue fallando al declarar la variable, antes de llegar a esa línea.',
    },
  ],
};

export const usingLab = {
  id: 'using-lab',
  titulo: 'Una conexión que siempre se cierra',
  inicial: `// Escribe conectar(nombre): imprime "conecta <nombre>" y devuelve un objeto
// con un método consultar(sql) que imprime "<nombre>: <sql>" y un método
// [Symbol.dispose]() que imprime "desconecta <nombre>".

function trabajar() {
  using db = conectar("principal");
  db.consultar("SELECT 1");
  throw new Error("algo salió mal");
}

try {
  trabajar();
} catch (e) {
  console.log("error:", e.message);
}
`,
  verificaciones: [
    { texto: 'Imprime la conexión, la consulta, la desconexión y después el error', prueba: 'return __salida.join("|") === "conecta principal|principal: SELECT 1|desconecta principal|error: algo salió mal";' },
    { texto: 'El objeto implementa <code>Symbol.dispose</code>', prueba: 'const c = conectar("x"); return typeof c[Symbol.dispose] === "function" && typeof c.consultar === "function";' },
    { texto: 'Se desconecta también sin errores, al salir del bloque', prueba: '__salida.length = 0; { using c = conectar("y"); } return __salida.at(-1) === "desconecta y";' },
  ],
  pistas: [
    'Empieza con <code>function conectar(nombre) { console.log(`conecta ${nombre}`); return { … }; }</code> arriba de todo.',
    'El método de consulta: <code>consultar(sql) { console.log(`${nombre}: ${sql}`); }</code>',
    'Y el de limpieza, con la clave especial entre corchetes: <code>[Symbol.dispose]() { console.log(`desconecta ${nombre}`); }</code>',
  ] as [string, string, string],
  solucion: `function conectar(nombre) {
  console.log(\`conecta \${nombre}\`);
  return {
    consultar(sql) {
      console.log(\`\${nombre}: \${sql}\`);
    },
    [Symbol.dispose]() {
      console.log(\`desconecta \${nombre}\`);
    },
  };
}

function trabajar() {
  using db = conectar("principal");
  db.consultar("SELECT 1");
  throw new Error("algo salió mal");
}

try {
  trabajar();
} catch (e) {
  console.log("error:", e.message);
}`,
  explicacion:
    '<p>Aunque <code>trabajar</code> se interrumpe con un error, la conexión se cierra <b>antes</b> de que el error llegue al <code>catch</code>. Sin <code>using</code>, harías lo mismo con <code>try/finally</code>, y es fácil olvidarlo.</p>',
};
