// Reto del motor de la sección 2: «Control de flujo y errores».

export const retoFlujoAuto = {
  id: 'reto-flujo-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>for (let i = 0; i &lt; 3; i++) {</code><br><code>&nbsp;&nbsp;if (i === 1) continue;</code><br><code>&nbsp;&nbsp;console.log(i);</code><br><code>}</code>',
      opciones: ['<code>0</code>', '<code>0</code> y <code>2</code>', '<code>0</code>, <code>1</code> y <code>2</code>'],
      correcta: 1,
      explicacion: '<code>continue</code> salta el resto de esa vuelta, pero el bucle sigue: se saltea solo el <code>1</code>. Con <code>break</code> habría impreso solo el <code>0</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>switch (2) {</code><br><code>&nbsp;&nbsp;case 1: console.log("uno");</code><br><code>&nbsp;&nbsp;case 2: console.log("dos");</code><br><code>&nbsp;&nbsp;case 3: console.log("tres");</code><br><code>}</code>',
      opciones: ['<code>dos</code>', '<code>dos</code> y <code>tres</code>', '<code>uno</code>, <code>dos</code> y <code>tres</code>'],
      correcta: 1,
      explicacion: 'Sin <code>break</code>, un <code>case</code> «cae» en el siguiente: empieza en el que coincide y sigue hasta el final o hasta un <code>break</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>function f() {</code><br><code>&nbsp;&nbsp;try { return "try"; }</code><br><code>&nbsp;&nbsp;finally { console.log("finally"); }</code><br><code>}</code><br><code>console.log(f());</code>',
      opciones: ['<code>try</code>', '<code>finally</code> y después <code>try</code>', '<code>try</code> y después <code>finally</code>'],
      correcta: 1,
      explicacion: 'El <code>return</code> calcula el valor, pero antes de salir de la función se ejecuta el <code>finally</code>. Recién después la llamada termina y <code>console.log</code> imprime lo devuelto.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>for (const k in ["a", "b"]) console.log(typeof k);</code>',
      opciones: ['<code>number</code> dos veces', '<code>string</code> dos veces', '<code>a</code> y <code>b</code>'],
      correcta: 1,
      explicacion: '<code>for…in</code> recorre las <b>claves</b>, y las claves de un objeto, incluso las de un array, son textos: <code>"0"</code> y <code>"1"</code>. Para los valores de un array, <code>for…of</code>.',
    },
  ],
};

export const retoFlujoOrden = {
  id: 'reto-flujo-orden',
  titulo: 'Un bucle con try, catch y finally',
  codigo: `for (const n of [1, 2, 3, 4]) {
  try {
    if (n === 2) continue;
    if (n === 3) throw new Error("tres");
    console.log("ok", n);
  } catch (e) {
    console.log("error:", e.message);
    break;
  } finally {
    console.log("fin", n);
  }
}
console.log("después");`,
  salida: ['ok 1', 'fin 1', 'fin 2', 'error: tres', 'fin 3', 'después'],
  inicio: [3, 0, 5, 2, 4, 1],
  explicacion:
    'El <code>finally</code> se ejecuta siempre al salir del <code>try</code>, también con <code>continue</code> (la vuelta del <code>2</code>) y con <code>break</code> (la del <code>3</code>). El <code>break</code> corta el bucle, así que el <code>4</code> nunca llega.',
};

export const retoFlujoDetective = {
  id: 'reto-flujo-detective',
  titulo: 'Una vuelta de más',
  codigo: `const nombres = ["Ana", "Luis", "Eva"];
for (let i = 0; i <= nombres.length; i++) {
  console.log(nombres[i].toUpperCase());
}`,
  error: `ANA
LUIS
EVA
app.js:3
  console.log(nombres[i].toUpperCase());
                         ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')`,
  culpable: 2,
  hallazgo:
    'El error aparece en la línea 3, pero nace en la 2: con <code>&lt;=</code>, el bucle da una vuelta de más. Los índices van de <code>0</code> a <code>2</code>, y en la cuarta vuelta <code>nombres[3]</code> es <code>undefined</code>.',
  pista: 'Imprimió los tres nombres antes de fallar. ¿Cuántas vueltas da el bucle? ¿Qué vale <code>i</code> en la última?',
  arreglos: [
    {
      texto: 'Cambiar la condición a <code>i &lt; nombres.length</code>',
      correcta: true,
      porque: 'Un array de 3 elementos tiene los índices 0, 1 y 2: el bucle tiene que parar antes de llegar a <code>length</code>. O mejor todavía, <code>for (const nombre of nombres)</code>, que no puede pasarse.',
    },
    {
      texto: 'Usar <code>nombres[i]?.toUpperCase()</code> en la línea 3',
      correcta: false,
      porque: 'Ya no se cae, pero imprime un <code>undefined</code> de más al final. Esconde el síntoma y deja el bucle mal.',
    },
    {
      texto: 'Envolver el <code>console.log</code> en un <code>try…catch</code> vacío',
      correcta: false,
      porque: 'Tragarse el error lo esconde: el bucle sigue dando una vuelta de más, y la próxima vez el problema aparece en otro lado.',
    },
  ],
};

export const retoFlujoLab = {
  id: 'reto-flujo-lab',
  titulo: 'El primer número negativo',
  inicial: `// Escribe buscarNegativo(lista): devuelve la posición del primer número
// negativo, o -1 si no hay ninguno. Si lista no es un array, lanza un TypeError.
// Hazlo con un bucle: sin findIndex ni indexOf.

console.log(buscarNegativo([4, 7, -2, -9]));
console.log(buscarNegativo([1, 2, 3]));
`,
  verificaciones: [
    { texto: 'Imprime <code>2</code> y después <code>-1</code>', prueba: 'return __salida.join("|") === "2|-1";' },
    { texto: 'Con una lista vacía devuelve <code>-1</code>', prueba: 'return buscarNegativo([]) === -1;' },
    { texto: 'Se detiene en el primero: <code>[-5, -1]</code> da <code>0</code>', prueba: 'return buscarNegativo([-5, -1]) === 0;' },
    { texto: 'Lanza un <code>TypeError</code> si no recibe un array', prueba: 'try { buscarNegativo("hola"); return false; } catch (e) { return e instanceof TypeError; }' },
    { texto: 'Usa un bucle, sin <code>findIndex</code> ni <code>indexOf</code>', prueba: String.raw`return /\b(for|while)\b/.test(__codigo) && !/findIndex|indexOf/.test(__codigo);` },
  ],
  pistas: [
    'Empieza validando: <code>if (!Array.isArray(lista)) throw new TypeError("Se esperaba un array");</code>',
    'Recorre con <code>for (let i = 0; i &lt; lista.length; i++)</code> y compara <code>lista[i] &lt; 0</code>.',
    'En cuanto lo encuentres, <code>return i;</code> corta el bucle y la función. Si el bucle termina sin encontrarlo, <code>return -1;</code>.',
  ] as [string, string, string],
  solucion: `function buscarNegativo(lista) {
  if (!Array.isArray(lista)) throw new TypeError("Se esperaba un array");
  for (let i = 0; i < lista.length; i++) {
    if (lista[i] < 0) return i;
  }
  return -1;
}

console.log(buscarNegativo([4, 7, -2, -9]));
console.log(buscarNegativo([1, 2, 3]));`,
  explicacion:
    '<p>El <code>return</code> dentro del bucle hace de <code>break</code> y de resultado a la vez. Validar al principio y lanzar un <code>TypeError</code> hace que un mal uso falle enseguida, con un mensaje claro, en lugar de devolver algo raro más adelante.</p>',
};
