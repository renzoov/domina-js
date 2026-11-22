// Reto del motor de la sección 11: «La biblioteca estándar».

export const retoBibAuto = {
  id: 'reto-bib-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>console.log("😀".length);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>4</code>'],
      correcta: 1,
      explicacion: '<code>length</code> cuenta unidades de UTF-16, y este emoji necesita dos (un par sustituto). Para contar caracteres como los ve una persona, <code>Intl.Segmenter</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const re = /a/g;</code><br><code>console.log(re.test("a"), re.test("a"));</code>',
      opciones: ['<code>true true</code>', '<code>true false</code>', '<code>false false</code>'],
      correcta: 1,
      explicacion: 'Con la bandera <code>g</code>, la expresión recuerda dónde se quedó (<code>lastIndex</code>). La segunda búsqueda empieza después de la <code>a</code> y no encuentra nada. Para solo preguntar, no uses <code>g</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log(new URL("../img.png", "https://sitio.com/blog/post/").href);</code>',
      opciones: ['<code>https://sitio.com/img.png</code>', '<code>https://sitio.com/blog/img.png</code>', '<code>https://sitio.com/blog/post/img.png</code>'],
      correcta: 1,
      explicacion: 'La ruta relativa se resuelve como en un enlace: <code>../</code> sube un nivel desde la carpeta <code>/blog/post/</code>, y queda <code>/blog/img.png</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const d = Temporal.PlainDate.from("2026-01-31");</code><br><code>console.log(d.add({ months: 1 }).toString());</code>',
      opciones: ['<code>2026-03-03</code>', '<code>2026-02-28</code>', '<code>RangeError</code>'],
      correcta: 1,
      explicacion: 'Febrero de 2026 no tiene 31 días, y Temporal no se pasa al mes siguiente: ajusta al último día válido. <code>Date</code>, en cambio, habría dado el 3 de marzo.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const reglas = new Intl.PluralRules("es");</code><br><code>console.log(reglas.select(1), reglas.select(5));</code>',
      opciones: ['<code>one other</code>', '<code>1 5</code>', '<code>singular plural</code>'],
      correcta: 0,
      explicacion: '<code>PluralRules</code> devuelve la <b>categoría</b> gramatical según el idioma: en español, <code>one</code> para 1 y <code>other</code> para el resto. Con eso eliges «1 tema» o «5 temas».',
    },
  ],
};

export const retoBibOrden = {
  id: 'reto-bib-orden',
  titulo: 'URL, expresiones y Unicode',
  codigo: `const url = new URL("https://tienda.com/buscar?q=café&página=2");
console.log(url.searchParams.get("q"));
console.log(url.searchParams.get("página"));

const texto = "Pedido #123 y pedido #45";
console.log(texto.match(/#\\d+/g).join(" "));
console.log(texto.replace(/pedido/gi, "orden"));

console.log([..."añ😀"].length);`,
  salida: ['café', '2', '#123 #45', 'orden #123 y orden #45', '3'],
  inicio: [4, 2, 0, 3, 1],
  explicacion:
    '<code>URL</code> codifica la tilde y la eñe al armar la dirección, y <code>searchParams</code> las decodifica al leer: recibes <code>café</code> tal cual. Con la bandera <code>g</code>, <code>match</code> devuelve todas las coincidencias, y con <code>i</code> el reemplazo no distingue mayúsculas. El spread recorre por puntos de código: el emoji cuenta como uno.',
};

export const retoBibDetective = {
  id: 'reto-bib-detective',
  titulo: 'Un formato de moneda sin moneda',
  codigo: `const formato = new Intl.NumberFormat("es-PE", { style: "currency" });

function mostrarPrecio(monto) {
  return formato.format(monto);
}

console.log(mostrarPrecio(25));`,
  error: `app.js:1
const formato = new Intl.NumberFormat("es-PE", { style: "currency" });
                ^

TypeError: Currency code is required with currency style.`,
  culpable: 1,
  hallazgo:
    'El idioma y la región (<code>es-PE</code>) deciden cómo se escribe un número, pero no en qué moneda está: un precio en Perú podría estar en soles o en dólares. Con <code>style: "currency"</code>, la moneda es obligatoria.',
  pista: 'El mensaje dice exactamente qué falta. ¿Qué opción del formato indica la moneda?',
  arreglos: [
    {
      texto: 'Agregar la moneda: <code>{ style: "currency", currency: "PEN" }</code>',
      correcta: true,
      porque: 'Con el código ISO de la moneda, <code>Intl</code> pone el símbolo (<code>S/</code>), los decimales y los separadores que corresponden a <code>es-PE</code>.',
    },
    {
      texto: 'Cambiar el idioma a <code>"es-PE-PEN"</code>',
      correcta: false,
      porque: 'Eso no es una etiqueta de idioma válida: la moneda no va en el idioma, va en las opciones. Además da otro error.',
    },
    {
      texto: 'Agregar <code>maximumFractionDigits: 2</code>',
      correcta: false,
      porque: 'Controla los decimales, pero no dice cuál es la moneda: el error sigue igual.',
    },
  ],
};

export const retoBibLab = {
  id: 'reto-bib-lab',
  titulo: 'Direcciones amigables',
  inicial: `// Escribe crearSlug(titulo): convierte un título en un fragmento de URL.
//   · todo en minúsculas y sin tildes (la ñ pasa a n)
//   · cualquier cosa que no sea letra o número se convierte en un guion
//   · nunca dos guiones seguidos, ni guiones al principio o al final

console.log(crearSlug("¡Hola, Mundo!"));
console.log(crearSlug("Programación en JavaScript"));
`,
  verificaciones: [
    { texto: 'Imprime <code>hola-mundo</code> y después <code>programacion-en-javascript</code>', prueba: 'return __salida.join("|") === "hola-mundo|programacion-en-javascript";' },
    { texto: 'Quita tildes y eñes: <code>"Año Ñandú"</code> da <code>"ano-nandu"</code>', prueba: 'return crearSlug("Año Ñandú") === "ano-nandu";' },
    { texto: 'Sin guiones repetidos ni en los bordes: <code>"  --¿Qué  tal?--  "</code> da <code>"que-tal"</code>', prueba: 'return crearSlug("  --¿Qué  tal?--  ") === "que-tal";' },
    { texto: 'Conserva los números: <code>"ES2025 y más"</code> da <code>"es2025-y-mas"</code>', prueba: 'return crearSlug("ES2025 y más") === "es2025-y-mas";' },
  ],
  pistas: [
    '<code>normalize("NFD")</code> separa cada letra de su tilde: <code>"á"</code> pasa a ser <code>"a"</code> más una tilde suelta.',
    'Las tildes sueltas son marcas combinantes: <code>.replace(/\\p{Mn}/gu, "")</code> las borra. Después, <code>toLowerCase()</code>.',
    'Reemplaza cada grupo de caracteres que no sean <code>a-z</code> ni <code>0-9</code> por un guion: <code>.replace(/[^a-z0-9]+/g, "-")</code>, y quita los de los bordes con <code>.replace(/^-|-$/g, "")</code>.',
  ] as [string, string, string],
  solucion: `function crearSlug(titulo) {
  return titulo
    .normalize("NFD")
    .replace(/\\p{Mn}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

console.log(crearSlug("¡Hola, Mundo!"));
console.log(crearSlug("Programación en JavaScript"));`,
  explicacion:
    '<p>Unicode y expresiones regulares trabajando juntos. <code>normalize("NFD")</code> descompone las letras con tilde, y <code>\\p{Mn}</code> (con la bandera <code>u</code>) atrapa justo esas marcas. El <code>+</code> en <code>[^a-z0-9]+</code> convierte un grupo entero de símbolos y espacios en un solo guion. Es lo que hace este sitio con los títulos de sus apartados.</p>',
};
