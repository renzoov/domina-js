// Ejercicios de la sección 0: «Antes de empezar».

/* ── Qué es JavaScript hoy ─────────────────────────────────── */
export const queEsAuto = {
  id: 'js-hoy-auto',
  titulo: 'Repasa las ideas clave',
  preguntas: [
    {
      pregunta: '¿JavaScript y Java son el mismo lenguaje?',
      opciones: ['Sí, JavaScript es la versión web de Java', 'No: son lenguajes distintos y el parecido es solo de nombre', 'JavaScript es una parte de Java'],
      correcta: 1,
      explicacion: 'El nombre fue una decisión de marketing de 1995, cuando Java estaba de moda. Son lenguajes con diseños e historias distintas.',
    },
    {
      pregunta: '¿Qué es ECMAScript?',
      opciones: ['Un framework para hacer páginas web', 'El estándar que define cómo funciona el lenguaje; JavaScript lo implementa', 'Un navegador antiguo'],
      correcta: 1,
      explicacion: 'ECMAScript (la especificación ECMA-262) dice qué hace cada parte del lenguaje. Los motores lo implementan y eso es lo que llamamos JavaScript.',
    },
    {
      pregunta: '¿Cada cuánto se publica una edición nueva de ECMAScript?',
      opciones: ['Una vez al año, desde ES2015', 'Cada diez años', 'No cambia desde 1995'],
      correcta: 0,
      explicacion: 'Desde ES2015 hay una edición por año: ES2016, ES2017… hasta ES2026, aprobada en junio de 2026.',
    },
    {
      pregunta: '¿Qué diferencia hay entre un <em>motor</em> y un <em>runtime</em>?',
      opciones: [
        'Ninguna, son sinónimos',
        'El motor ejecuta el lenguaje (por ejemplo V8); el runtime le suma todo lo demás: consola, red, archivos, la página (por ejemplo el navegador o Node.js)',
        'El runtime es una versión más rápida del motor',
      ],
      correcta: 1,
      explicacion: 'El motor entiende JavaScript. El runtime es el entorno que lo rodea y le da herramientas: en el navegador, la página y <code>fetch</code>; en Node.js, los archivos.',
    },
  ],
};

/* ── Tu entorno ────────────────────────────────────────────── */
export const entornoAuto = {
  id: 'entorno-auto',
  titulo: 'Dónde y cómo ejecutar tu código',
  preguntas: [
    {
      pregunta: 'En Chrome para Windows, ¿qué atajo abre directamente la consola?',
      opciones: ['<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd>', '<kbd>Ctrl</kbd> + <kbd>S</kbd>', '<kbd>Alt</kbd> + <kbd>F4</kbd>'],
      correcta: 0,
      explicacion: 'En Mac es <kbd>Cmd</kbd> + <kbd>Option</kbd> + <kbd>J</kbd>. <kbd>F12</kbd> abre las DevTools completas y desde ahí eliges la pestaña Console.',
    },
    {
      pregunta: 'Tienes Node.js instalado y un archivo <code>hola.js</code>. ¿Cómo lo ejecutas?',
      opciones: ['Con doble clic en el archivo', 'Escribiendo <code>node hola.js</code> en la terminal, dentro de su carpeta', 'Escribiendo <code>javascript hola.js</code>'],
      correcta: 1,
      explicacion: 'El comando <code>node</code> recibe el nombre del archivo y lo ejecuta. Lo que imprimas con <code>console.log</code> aparece en la terminal.',
    },
    {
      pregunta: '¿Qué hace <code>node --watch hola.js</code>?',
      opciones: ['Ejecuta el archivo y lo vuelve a ejecutar cada vez que lo guardas', 'Lo ejecuta más rápido', 'Lo convierte a TypeScript'],
      correcta: 0,
      explicacion: 'Es muy cómodo para practicar: guardas en el editor y ves el resultado al instante en la terminal.',
    },
  ],
};

export const entornoDetective = {
  id: 'entorno-detective',
  titulo: 'El programa que no saluda',
  codigo: `const nombre = "Ana";
consol.log("¡Hola!");
console.log(nombre);`,
  error: `hola.js:2
consol.log("¡Hola!");
^

ReferenceError: consol is not defined
    at Object.<anonymous> (hola.js:2:1)`,
  culpable: 2,
  hallazgo:
    'Dice <code>consol</code> en vez de <code>console</code>. Para el motor es otro nombre, uno que no existe, y por eso lanza <code>ReferenceError: consol is not defined</code>.',
  pista: 'El error indica <code>hola.js:2</code>: archivo y número de línea. Mira esa línea letra por letra.',
  arreglos: [
    {
      texto: 'Escribir <code>console</code> completo: <code>console.log("¡Hola!");</code>',
      correcta: true,
      porque: 'Con el nombre bien escrito, el programa imprime <code>¡Hola!</code> y después <code>Ana</code>.',
    },
    {
      texto: 'Borrar la línea 1',
      correcta: false,
      porque: 'La línea 1 está bien. El error sigue en la línea 2, porque <code>consol</code> sigue sin existir.',
    },
    {
      texto: 'Cambiar las comillas dobles por simples',
      correcta: false,
      porque: 'En JavaScript las comillas dobles y simples funcionan igual. El problema es el nombre <code>consol</code>.',
    },
  ],
};

/* ── Tu primer programa ────────────────────────────────────── */
export const primerOrden = {
  id: 'primer-orden',
  titulo: '¿Qué aparece en la consola?',
  codigo: `console.log("uno");
// console.log("dos");
console.log("tres");
console.log(1 + 1);
console.log("cuatro");`,
  salida: ['uno', 'tres', '2', 'cuatro'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Las líneas se ejecutan en orden, de arriba hacia abajo. La línea 2 es un comentario y no imprime nada. <code>1 + 1</code> va sin comillas, así que se muestra el resultado: <code>2</code>.',
};

export const primerDetective = {
  id: 'primer-detective',
  titulo: 'Un error antes de empezar',
  codigo: `console.log("Empieza el programa");
console.log(Hola mundo);
console.log("Fin");`,
  error: `console.log(Hola mundo);
            ^^^^

SyntaxError: missing ) after argument list`,
  culpable: 2,
  hallazgo:
    'Al texto <code>Hola mundo</code> le faltan las comillas, así que el motor lo lee como código que no tiene sentido. Es un <b>error de sintaxis</b>: el programa no llega a ejecutarse, por eso ni siquiera aparece <code>Empieza el programa</code>.',
  pista: 'El error copia la línea problemática y la señala con <code>^^^^</code>. ¿Qué línea es?',
  arreglos: [
    {
      texto: 'Agregar un punto y coma al final de la línea 1',
      correcta: false,
      porque: 'La línea 1 ya está bien. El error es de la línea 2.',
    },
    {
      texto: 'Escribir <code>console.log(Hola + mundo);</code>',
      correcta: false,
      porque: 'Así deja de ser un error de sintaxis, pero el motor buscaría algo llamado <code>Hola</code> y lanzaría <code>ReferenceError</code>.',
    },
    {
      texto: 'Poner el texto entre comillas: <code>console.log("Hola mundo");</code>',
      correcta: true,
      porque: 'Entre comillas es texto. Ahora el programa imprime las tres líneas.',
    },
  ],
};

export const primerLab = {
  id: 'primer-lab',
  titulo: 'Preséntate en la consola',
  inicial: `// Escribe tu programa aquí
console.log("Hola, soy ...");
`,
  verificaciones: [
    { texto: 'Imprime al menos tres líneas', prueba: 'return __salida.length >= 3;' },
    { texto: 'La primera línea saluda: empieza con <code>Hola</code>', prueba: 'return /^hola/i.test(String(__salida[0] ?? ""));' },
    { texto: 'Muestra cuántas horas tiene un año: <code>8760</code>', prueba: 'return __salida.some((l) => l.includes("8760"));' },
    {
      texto: 'Lo calcula con <code>365 * 24</code>, sin escribir 8760 a mano',
      prueba: 'return /365\\s*\\*\\s*24|24\\s*\\*\\s*365/.test(__codigo) && !/8760/.test(__codigo);',
    },
  ],
  pistas: [
    'Cada <code>console.log</code> escribe una línea. Necesitas tres.',
    'Para el cálculo, escribe la operación sin comillas: <code>console.log(365 * 24)</code>.',
    'La tercera línea puede ser cualquier texto entre comillas, por ejemplo <code>console.log("¡Mi primer programa funciona!")</code>.',
  ] as [string, string, string],
  solucion: `console.log("Hola, soy Ana");
console.log(365 * 24);
console.log("¡Mi primer programa funciona!");`,
  explicacion:
    '<p>Tres <code>console.log</code>, tres líneas. En la segunda, <code>365 * 24</code> va sin comillas: el motor hace la multiplicación y muestra <code>8760</code>. Si lo pusieras entre comillas verías el texto <code>365 * 24</code>.</p>',
};

/* ── Cómo leer documentación ───────────────────────────────── */
export const docsAuto = {
  id: 'docs-auto',
  titulo: 'Leer una página de referencia',
  preguntas: [
    {
      pregunta: 'En MDN, ¿qué significa la etiqueta <b>Baseline · ampliamente disponible</b> (<em>Widely available</em>)?',
      opciones: [
        'Que funciona en todos los navegadores principales desde hace al menos 30 meses',
        'Que es una propuesta y todavía puede cambiar',
        'Que solo funciona en Node.js',
      ],
      correcta: 0,
      explicacion: '<em>Newly available</em> significa que ya está en todos los navegadores principales, pero desde hace poco. Pasados 30 meses pasa a <em>Widely available</em>: la puedes usar sin miedo.',
    },
    {
      pregunta: 'En la página de MDN de un método, ¿en qué sección buscas lo que te devuelve?',
      opciones: ['Sintaxis', 'Valor devuelto', 'Compatibilidad con navegadores'],
      correcta: 1,
      explicacion: '«Valor devuelto» (<em>Return value</em>) explica qué obtienes al llamarlo. «Parámetros» explica qué le pasas.',
    },
    {
      pregunta: '¿Cuál es la especificación oficial del lenguaje?',
      opciones: ['MDN', 'ECMA-262 (ECMAScript), que mantiene el comité TC39', 'La documentación de Node.js'],
      correcta: 1,
      explicacion: 'MDN explica el lenguaje con ejemplos y es lo que vas a usar a diario. ECMA-262 es la fuente oficial: muy precisa, pero escrita para quien construye motores.',
    },
    {
      pregunta: 'Quieres entender <code>map</code> de los arrays. ¿Qué búsqueda te lleva más rápido a la referencia?',
      opciones: ['javascript map', 'mdn array map', 'map tutorial fácil'],
      correcta: 1,
      explicacion: 'Agregar <code>mdn</code> y el tipo (<code>array</code>) te lleva directo a la página de referencia, sin pasar por resultados genéricos.',
    },
  ],
};

export const docsLab = {
  id: 'docs-lab',
  titulo: 'Usa un método leyendo su documentación',
  inicial: `const lenguajes = ["HTML", "CSS", "JavaScript", "TypeScript"];

// Muestra el último elemento usando el método at()
`,
  verificaciones: [
    { texto: 'Imprime el último elemento: <code>TypeScript</code>', prueba: 'return __salida.some((l) => l === "TypeScript");' },
    { texto: 'Usa el método <code>at()</code>', prueba: 'return /\\.at\\s*\\(/.test(__codigo);' },
    { texto: 'Usa un índice negativo, como dice la documentación', prueba: 'return /\\.at\\s*\\(\\s*-\\s*\\d+\\s*\\)/.test(__codigo);' },
  ],
  pistas: [
    'Busca «mdn array at» y lee la sección <em>Parámetros</em>: ¿qué pasa si el índice es negativo?',
    'Un índice negativo cuenta desde el final: <code>-1</code> es el último elemento.',
    'Llama al método sobre el array y muestra el resultado: <code>console.log(lenguajes.at(-1));</code>',
  ] as [string, string, string],
  solucion: `const lenguajes = ["HTML", "CSS", "JavaScript", "TypeScript"];

console.log(lenguajes.at(-1));`,
  explicacion:
    '<p>La documentación de <code>at()</code> dice que acepta un número entero y que, si es negativo, cuenta desde el final del array. Por eso <code>at(-1)</code> es el último elemento, sin importar cuántos haya. Antes de ES2022 había que escribir <code>lenguajes[lenguajes.length - 1]</code>.</p>',
};
