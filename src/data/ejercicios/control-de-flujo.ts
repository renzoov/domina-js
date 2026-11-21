// Ejercicios de la sección 2: «Control de flujo y errores».

/* ── 2.1 Condicionales ─────────────────────────────────────── */
export const condicionalesAuto = {
  id: 'condicionales-auto',
  titulo: 'Decidir con if y switch',
  preguntas: [
    {
      pregunta: '<code>const n = 95;</code> ¿Qué imprime?<br><code>if (n >= 60) console.log("A"); else if (n >= 90) console.log("B");</code>',
      opciones: ['<code>A</code>', '<code>B</code>', '<code>A</code> y <code>B</code>'],
      correcta: 0,
      explicacion: 'Se ejecuta la primera condición que se cumple: <code>95 >= 60</code> ya es verdad, así que nunca llega a la segunda. En un <code>else if</code>, <b>el orden importa</b>: pon las condiciones más exigentes primero.',
    },
    {
      pregunta: 'En un <code>switch</code>, ¿qué pasa si olvidas el <code>break</code> al final de un <code>case</code>?',
      opciones: ['Da un error de sintaxis', 'Sigue ejecutando el código de los <code>case</code> siguientes', 'Sale del <code>switch</code> igual'],
      correcta: 1,
      explicacion: 'Sin <code>break</code>, la ejecución "cae" al siguiente <code>case</code> (<em>fallthrough</em>). A veces se usa a propósito para agrupar casos, pero casi siempre es un error.',
    },
    {
      pregunta: '¿Entra en el bloque <code>if ("0") { … }</code>?',
      opciones: ['Sí', 'No'],
      correcta: 0,
      explicacion: '<code>"0"</code> es un texto no vacío, así que es truthy. La condición de un <code>if</code> sigue las reglas de truthy y falsy.',
    },
    {
      pregunta: '¿Qué compara <code>switch</code> para elegir un <code>case</code>?',
      opciones: ['Con <code>==</code> (convierte tipos)', 'Con <code>===</code> (sin convertir)', 'Solo números'],
      correcta: 1,
      explicacion: '<code>switch</code> usa igualdad estricta: <code>switch ("1")</code> no entra en <code>case 1:</code>.',
    },
  ],
};

export const condicionalesOrden = {
  id: 'condicionales-orden',
  titulo: 'Un switch, un ternario y un if',
  codigo: `const dia = "sábado";
switch (dia) {
  case "sábado":
  case "domingo":
    console.log("fin de semana");
    break;
  default:
    console.log("laborable");
}

const hora = 14;
console.log(hora < 12 ? "mañana" : "tarde");
if (hora > 20) console.log("noche");
console.log("listo");`,
  salida: ['fin de semana', 'tarde', 'listo'],
  inicio: [2, 0, 1],
  explicacion:
    '<code>"sábado"</code> entra en su <code>case</code>, que está vacío y cae al de <code>"domingo"</code>: así se agrupan dos casos. El <code>break</code> evita llegar al <code>default</code>. El ternario elige <code>"tarde"</code>, y el <code>if</code> no se cumple, así que no imprime nada.',
};

export const condicionalesDetective = {
  id: 'condicionales-detective',
  titulo: 'Un else if de otro lenguaje',
  codigo: `const nota = 72;
if (nota >= 90) {
  console.log("Sobresaliente");
} elif (nota >= 60) {
  console.log("Aprobado");
}`,
  error: `} elif (nota >= 60) {
                    ^

SyntaxError: Unexpected token '{'`,
  culpable: 4,
  hallazgo:
    '<code>elif</code> es la forma de Python. En JavaScript se escribe <code>else if</code>, en dos palabras. Para el motor, <code>elif(…)</code> parece una llamada a una función, y después no sabe qué hacer con la llave.',
  pista: 'El error de sintaxis copia la línea problemática. ¿Esa palabra existe en JavaScript?',
  arreglos: [
    {
      texto: 'Escribir <code>} elseif (nota >= 60) {</code>',
      correcta: false,
      porque: '<code>elseif</code>, todo junto, tampoco existe: sigue siendo un error de sintaxis.',
    },
    {
      texto: 'Escribir <code>} else if (nota >= 60) {</code>',
      correcta: true,
      porque: 'Esa es la sintaxis de JavaScript. Ahora imprime <code>Aprobado</code>.',
    },
    {
      texto: 'Quitar las llaves del segundo bloque',
      correcta: false,
      porque: 'El problema es la palabra <code>elif</code>, no las llaves.',
    },
  ],
};

export const condicionalesLab = {
  id: 'condicionales-lab',
  titulo: 'Clasifica la temperatura',
  inicial: `const temp = 31;

// Imprime "Hace calor" si temp es 30 o más,
// "Templado" si es 15 o más, y "Hace frío" en otro caso.
`,
  verificaciones: [
    { texto: 'Con 31 grados imprime <code>Hace calor</code>', prueba: 'return __salida.some((l) => l === "Hace calor");' },
    {
      texto: 'Con 20 grados imprimiría <code>Templado</code>',
      prueba: 'const src = __codigo.replace(/const temp = -?[\\d.]+/, "const temp = 20"); const out = []; new Function("console", src)({ log: (...a) => out.push(a.join(" ")) }); return out.includes("Templado") && !out.includes("Hace calor");',
    },
    {
      texto: 'Con 5 grados imprimiría <code>Hace frío</code>',
      prueba: 'const src = __codigo.replace(/const temp = -?[\\d.]+/, "const temp = 5"); const out = []; new Function("console", src)({ log: (...a) => out.push(a.join(" ")) }); return out.includes("Hace frío") && out.length === 1;',
    },
    {
      texto: 'Con 15 grados justos imprimiría <code>Templado</code>',
      prueba: 'const src = __codigo.replace(/const temp = -?[\\d.]+/, "const temp = 15"); const out = []; new Function("console", src)({ log: (...a) => out.push(a.join(" ")) }); return out.length === 1 && out[0] === "Templado";',
    },
  ],
  pistas: [
    'Necesitas tres caminos: usa <code>if</code>, <code>else if</code> y <code>else</code>.',
    'El orden importa: comprueba primero <code>temp >= 30</code> y después <code>temp >= 15</code>.',
    '<code>if (temp >= 30) { console.log("Hace calor"); } else if (temp >= 15) { console.log("Templado"); } else { console.log("Hace frío"); }</code>',
  ] as [string, string, string],
  solucion: `const temp = 31;

if (temp >= 30) {
  console.log("Hace calor");
} else if (temp >= 15) {
  console.log("Templado");
} else {
  console.log("Hace frío");
}`,
  explicacion:
    '<p>Las verificaciones probaron tu código con 31, 20, 15 y 5 grados. Por eso importan los bordes: con <code>>=</code>, el 15 entra en "Templado" y el 30 en "Hace calor". Si hubieras puesto <code>temp >= 15</code> primero, 31 grados también habría salido "Templado".</p>',
};

/* ── 2.2 Bucles ────────────────────────────────────────────── */
export const buclesAuto = {
  id: 'bucles-auto',
  titulo: 'Elegir el bucle adecuado',
  preguntas: [
    {
      pregunta: '<code>const colores = ["rojo", "azul"];</code> ¿Qué recorre <code>for (const c of colores)</code>?',
      opciones: ['Los índices: 0 y 1', 'Los valores: <code>"rojo"</code> y <code>"azul"</code>', 'Las propiedades del array'],
      correcta: 1,
      explicacion: '<code>for…of</code> recorre los <b>valores</b> de cualquier cosa recorrible: arrays, strings, Map, Set…',
    },
    {
      pregunta: '¿Para qué sirve <code>for…in</code>?',
      opciones: ['Para recorrer los valores de un array', 'Para recorrer las claves de un objeto', 'Para repetir un número fijo de veces'],
      correcta: 1,
      explicacion: '<code>for…in</code> recorre las <b>claves</b> (como textos). Con arrays funciona, pero da los índices como texto e incluye propiedades heredadas: usa <code>for…of</code>.',
    },
    {
      pregunta: '¿Cuántas veces se ejecuta el cuerpo de <code>do { … } while (false);</code>?',
      opciones: ['Ninguna', 'Una', 'Infinitas'],
      correcta: 1,
      explicacion: '<code>do…while</code> ejecuta el cuerpo primero y comprueba la condición después, así que siempre da al menos una vuelta.',
    },
    {
      pregunta: '¿Por qué este bucle nunca termina? <code>let i = 0; while (i < 5) { console.log(i); }</code>',
      opciones: ['Porque falta <code>break</code>', 'Porque <code>i</code> nunca cambia, así que <code>i < 5</code> siempre es verdad', 'Porque <code>while</code> no acepta números'],
      correcta: 1,
      explicacion: 'Un bucle tiene que acercarse a su fin en cada vuelta. Falta <code>i++</code> dentro del cuerpo.',
    },
  ],
};

export const buclesOrden = {
  id: 'bucles-orden',
  titulo: 'Tres bucles seguidos',
  codigo: `for (let i = 3; i > 0; i--) {
  console.log(i);
}

for (const letra of "ab") {
  console.log(letra.toUpperCase());
}

const persona = { nombre: "Ana" };
for (const clave in persona) {
  console.log(clave);
}`,
  salida: ['3', '2', '1', 'A', 'B', 'nombre'],
  inicio: [4, 1, 5, 0, 3, 2],
  explicacion:
    'El primer <code>for</code> cuenta hacia atrás mientras <code>i > 0</code>. <code>for…of</code> sobre un texto recorre sus letras. <code>for…in</code> sobre un objeto recorre sus claves, no sus valores.',
};

export const buclesDetective = {
  id: 'bucles-detective',
  titulo: 'Una vuelta de más',
  codigo: `const frutas = ["pera", "uva", "kiwi"];
for (let i = 0; i <= frutas.length; i++) {
  console.log(frutas[i].toUpperCase());
}`,
  error: `PERA
UVA
KIWI
frutas.js:3
  console.log(frutas[i].toUpperCase());
                        ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')`,
  culpable: 2,
  hallazgo:
    'El array tiene 3 elementos, con índices 0, 1 y 2. Con <code>i <= frutas.length</code>, el bucle también da la vuelta con <code>i = 3</code>, y <code>frutas[3]</code> es <code>undefined</code>. Es el famoso error de "uno de más" (<em>off-by-one</em>).',
  pista: 'El error salta en la línea 3, pero la causa está antes: las tres frutas se imprimieron bien. ¿Cuántas vueltas da el bucle?',
  arreglos: [
    {
      texto: 'Usar <code>frutas[i]?.toUpperCase()</code>',
      correcta: false,
      porque: 'Ya no se rompe, pero imprime un <code>undefined</code> de más: esconde el error en lugar de arreglarlo.',
    },
    {
      texto: 'Cambiar la condición a <code>i < frutas.length</code>',
      correcta: true,
      porque: 'Con <code>&lt;</code> el último índice es 2, el último que existe. Y mejor aún: <code>for (const fruta of frutas)</code> evita los índices.',
    },
    {
      texto: 'Cambiar la condición a <code>i <= frutas.length - 2</code>',
      correcta: false,
      porque: 'Ahora da una vuelta de menos: el kiwi no se imprime.',
    },
  ],
};

export const buclesLab = {
  id: 'bucles-lab',
  titulo: 'FizzBuzz',
  inicial: `// Imprime los números del 1 al 15, uno por línea, pero:
// - si es múltiplo de 3, imprime "Fizz" en lugar del número
// - si es múltiplo de 5, imprime "Buzz"
// - si es múltiplo de 3 y de 5, imprime "FizzBuzz"
`,
  verificaciones: [
    { texto: 'Imprime 15 líneas', prueba: 'return __salida.length === 15;' },
    { texto: 'Los números normales salen tal cual: 1, 2, 4, 7…', prueba: 'return __salida[0] === "1" && __salida[1] === "2" && __salida[3] === "4" && __salida[6] === "7";' },
    { texto: '3 y 6 son <code>Fizz</code>; 5 y 10 son <code>Buzz</code>', prueba: 'return __salida[2] === "Fizz" && __salida[5] === "Fizz" && __salida[4] === "Buzz" && __salida[9] === "Buzz";' },
    { texto: '15 es <code>FizzBuzz</code>', prueba: 'return __salida[14] === "FizzBuzz";' },
    { texto: 'Usa un bucle (no 15 <code>console.log</code> escritos a mano)', prueba: String.raw`return /\b(for|while)\s*\(/.test(__codigo) && (__codigo.match(/console\.log/g) || []).length <= 4;` },
  ],
  pistas: [
    'Empieza con un bucle que imprima del 1 al 15: <code>for (let n = 1; n <= 15; n++)</code>.',
    '"Ser múltiplo de 3" es <code>n % 3 === 0</code>. Comprueba primero el caso de los dos a la vez.',
    'Dentro del bucle: <code>if (n % 15 === 0) … else if (n % 3 === 0) … else if (n % 5 === 0) … else console.log(n);</code>',
  ] as [string, string, string],
  solucion: `for (let n = 1; n <= 15; n++) {
  if (n % 3 === 0 && n % 5 === 0) {
    console.log("FizzBuzz");
  } else if (n % 3 === 0) {
    console.log("Fizz");
  } else if (n % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(n);
  }
}`,
  explicacion:
    '<p>FizzBuzz es un ejercicio clásico de entrevistas porque junta un bucle, el operador <code>%</code> y el orden de las condiciones. La trampa: si compruebas primero <code>n % 3</code>, el 15 sale <code>Fizz</code> y nunca llega a <code>FizzBuzz</code>. El caso más específico va primero.</p>',
};

/* ── 2.3 break, continue y etiquetas ──────────────────────── */
export const saltosAuto = {
  id: 'saltos-auto',
  titulo: 'Saltar y salir',
  preguntas: [
    {
      pregunta: '¿Qué diferencia hay entre <code>break</code> y <code>continue</code>?',
      opciones: [
        'Ninguna',
        '<code>break</code> termina el bucle; <code>continue</code> salta a la siguiente vuelta',
        '<code>continue</code> termina el bucle; <code>break</code> salta a la siguiente vuelta',
      ],
      correcta: 1,
      explicacion: '<code>break</code> sale del bucle. <code>continue</code> abandona solo la vuelta actual y sigue con la próxima.',
    },
    {
      pregunta: 'Con un bucle dentro de otro, un <code>break</code> en el de adentro…',
      opciones: ['Termina los dos bucles', 'Termina solo el bucle de adentro', 'Da error'],
      correcta: 1,
      explicacion: '<code>break</code> sale del bucle más cercano. Para salir también del de afuera necesitas una <b>etiqueta</b>.',
    },
    {
      pregunta: '¿Para qué sirve una etiqueta como <code>afuera:</code> delante de un bucle?',
      opciones: ['Para ponerle nombre y poder hacer <code>break afuera</code> o <code>continue afuera</code> desde un bucle interior', 'Para comentar el código', 'Para que el bucle vaya más rápido'],
      correcta: 0,
      explicacion: 'Las etiquetas existen casi solo para eso. Úsalas con moderación: muchas veces es más claro sacar el bucle a una función y usar <code>return</code>.',
    },
    {
      pregunta: '¿Dónde más se usa <code>break</code>, aparte de en los bucles?',
      opciones: ['En los <code>if</code>', 'En el <code>switch</code>', 'En las funciones'],
      correcta: 1,
      explicacion: 'En un <code>switch</code>, <code>break</code> evita que la ejecución caiga al siguiente <code>case</code>. En un <code>if</code> no se puede usar.',
    },
  ],
};

export const saltosOrden = {
  id: 'saltos-orden',
  titulo: 'Bucles anidados con etiqueta',
  codigo: `afuera: for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (j === 2) continue;
    if (i === 2) break afuera;
    console.log(\`\${i}-\${j}\`);
  }
}
console.log("listo");`,
  salida: ['1-1', '1-3', 'listo'],
  inicio: [2, 1, 0],
  explicacion:
    'Con <code>i = 1</code>: se imprime <code>1-1</code>, el <code>j = 2</code> se salta con <code>continue</code> y se imprime <code>1-3</code>. Con <code>i = 2</code>, <code>break afuera</code> termina <b>los dos</b> bucles, así que nunca se llega a <code>i = 3</code>.',
};

export const saltosDetective = {
  id: 'saltos-detective',
  titulo: 'Un break fuera de lugar',
  codigo: `const nota = 40;
if (nota < 50) {
  console.log("Suspendido");
  break;
}
console.log("Siguiente alumno");`,
  error: `  break;
  ^^^^^

SyntaxError: Illegal break statement`,
  culpable: 4,
  hallazgo:
    '<code>break</code> solo sirve dentro de un bucle o de un <code>switch</code>. Un <code>if</code> no necesita nada para terminar: su bloque acaba en la llave de cierre.',
  pista: 'El mensaje dice <em>Illegal break statement</em>: ese <code>break</code> no tiene de qué salir.',
  arreglos: [
    {
      texto: 'Cambiarlo por <code>continue;</code>',
      correcta: false,
      porque: '<code>continue</code> también necesita un bucle: el error pasa a ser <em>Illegal continue statement</em>.',
    },
    {
      texto: 'Borrar el <code>break;</code>',
      correcta: true,
      porque: 'El bloque del <code>if</code> termina solo. Ahora imprime <code>Suspendido</code> y <code>Siguiente alumno</code>. Si quisieras dejar de ejecutar una función, usarías <code>return</code>.',
    },
    {
      texto: 'Moverlo después de la llave de cierre del <code>if</code>',
      correcta: false,
      porque: 'Sigue sin estar dentro de un bucle ni de un <code>switch</code>: mismo error.',
    },
  ],
};

export const saltosLab = {
  id: 'saltos-lab',
  titulo: 'El primer múltiplo de 7',
  inicial: `const numeros = [3, -14, 10, 21, 35, 49];

// Imprime el primer número POSITIVO que sea múltiplo de 7,
// y deja de buscar en cuanto lo encuentres.
`,
  verificaciones: [
    { texto: 'Imprime solo <code>21</code>', prueba: 'return __salida.length === 1 && __salida[0] === "21";' },
    { texto: 'Usa <code>break</code> para dejar de buscar', prueba: String.raw`return /\bbreak\b/.test(__codigo);` },
    {
      texto: 'Funciona con otra lista: con <code>[-7, 5, 14, 28]</code> imprimiría <code>14</code>',
      prueba: 'const src = __codigo.replace(/const numeros = \\[[^\\]]*\\]/, "const numeros = [-7, 5, 14, 28]"); const out = []; new Function("console", src)({ log: (...a) => out.push(a.join(" ")) }); return out.length === 1 && out[0] === "14";',
    },
  ],
  pistas: [
    'Recorre la lista con <code>for (const n of numeros)</code>. Tienes que saltar los negativos y detenerte en el primero que sirva.',
    'Para saltar los negativos: <code>if (n < 0) continue;</code>. Para comprobar si es múltiplo de 7: <code>n % 7 === 0</code>.',
    'Cuando encuentres uno, imprímelo y usa <code>break</code>: <code>if (n % 7 === 0) { console.log(n); break; }</code>',
  ] as [string, string, string],
  solucion: `const numeros = [3, -14, 10, 21, 35, 49];

for (const n of numeros) {
  if (n < 0) continue;
  if (n % 7 === 0) {
    console.log(n);
    break;
  }
}`,
  explicacion:
    '<p><code>continue</code> descarta el -14 (que es múltiplo de 7, pero negativo). En el 21 se cumple la condición: se imprime y <code>break</code> termina la búsqueda, así que 35 y 49 no se revisan. En la sección de Colecciones verás un método que hace esto en una línea: <code>numeros.find(…)</code>.</p>',
};

/* ── 2.4 Errores y excepciones ────────────────────────────── */
export const erroresAuto = {
  id: 'errores-auto',
  titulo: 'Lanzar y atrapar',
  preguntas: [
    {
      pregunta: '¿Cuándo se ejecuta el bloque <code>finally</code>?',
      opciones: ['Solo si hubo un error', 'Solo si no hubo errores', 'Siempre'],
      correcta: 2,
      explicacion: '<code>finally</code> se ejecuta siempre al salir del <code>try/catch</code>, incluso si dentro hubo un <code>return</code>.',
    },
    {
      pregunta: '¿Por qué conviene <code>throw new Error("…")</code> en lugar de <code>throw "…"</code>?',
      opciones: [
        'Da igual',
        'Un objeto <code>Error</code> trae <code>message</code>, <code>name</code> y <code>stack</code> (dónde ocurrió); un texto suelto no',
        'Porque <code>throw</code> solo acepta objetos',
      ],
      correcta: 1,
      explicacion: '<code>throw</code> acepta cualquier valor, pero solo un <code>Error</code> guarda el <em>stack trace</em>, que es lo que necesitas para depurar.',
    },
    {
      pregunta: '¿Para qué sirve <code>new Error("…", { cause: error })</code> (ES2022)?',
      opciones: [
        'Para lanzar dos errores a la vez',
        'Para crear un error nuevo, más claro, sin perder el error original que lo causó',
        'Para silenciar el error',
      ],
      correcta: 1,
      explicacion: 'Con <code>cause</code> encadenas errores: el mensaje explica qué falló en tu programa y <code>error.cause</code> conserva el detalle técnico original.',
    },
    {
      pregunta: '¿Qué tiene de malo un <code>catch (error) { }</code> vacío?',
      opciones: ['Nada, es la forma correcta', 'Esconde el error: el problema sigue ahí, pero ya no te enteras', 'Da error de sintaxis'],
      correcta: 1,
      explicacion: 'Atrapa solo los errores que puedes resolver. Si no puedes, al menos regístralos con <code>console.error</code> o vuelve a lanzarlos.',
    },
  ],
};

export const erroresOrden = {
  id: 'errores-orden',
  titulo: 'El recorrido de un error',
  codigo: `try {
  console.log("A");
  null.x;
  console.log("B");
} catch (e) {
  console.log(e.name);
} finally {
  console.log("C");
}
console.log("D");`,
  salida: ['A', 'TypeError', 'C', 'D'],
  inicio: [2, 3, 0, 1],
  explicacion:
    'Se imprime <code>A</code>. Leer una propiedad de <code>null</code> lanza un <code>TypeError</code>, así que <code>B</code> se salta. El <code>catch</code> imprime el nombre del error, <code>finally</code> imprime <code>C</code>, y como el error se atrapó, el programa sigue con <code>D</code>.',
};

export const erroresDetective = {
  id: 'errores-detective',
  titulo: 'Un JSON que no es JSON',
  codigo: `const texto = "{nombre: 'Ana'}";
console.log("Leyendo datos...");
const datos = JSON.parse(texto);
console.log(datos.nombre);`,
  error: `Leyendo datos...
datos.js:3
const datos = JSON.parse(texto);
                   ^

SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)`,
  culpable: 3,
  hallazgo:
    '<code>JSON.parse</code> lanza un <code>SyntaxError</code> porque el texto no es JSON válido: en JSON las claves y los textos van <b>siempre con comillas dobles</b>. El error está en los datos, pero salta en la línea que los lee.',
  pista: 'El mensaje habla de <em>JSON</em> y de la posición 1. ¿Qué línea trabaja con JSON?',
  arreglos: [
    {
      texto: 'Rodear la línea 3 con <code>try { … } catch {}</code> vacío',
      correcta: false,
      porque: 'El error desaparece, pero <code>datos</code> no existe y el problema sigue escondido. Un <code>catch</code> vacío no arregla nada.',
    },
    {
      texto: 'Escribir JSON válido: <code>\'{"nombre": "Ana"}\'</code>',
      correcta: true,
      porque: 'Con comillas dobles en la clave y en el valor, <code>JSON.parse</code> funciona e imprime <code>Ana</code>. Si los datos llegan de afuera, además conviene un <code>try/catch</code> que avise del problema.',
    },
    {
      texto: 'Usar <code>eval(texto)</code> en lugar de <code>JSON.parse</code>',
      correcta: false,
      porque: '<code>eval</code> ejecuta texto como código: es un riesgo de seguridad enorme con datos externos. Nunca lo uses para leer datos.',
    },
  ],
};

export const erroresLab = {
  id: 'errores-lab',
  titulo: 'Saldo insuficiente',
  inicial: `function retirar(saldo, monto) {
  // Si monto es mayor que saldo, lanza un Error
  // con el mensaje "Saldo insuficiente"
  return saldo - monto;
}

// Llama a retirar(100, 250) dentro de un try/catch
// y muestra con console.log el mensaje del error
`,
  verificaciones: [
    { texto: 'Imprime <code>Saldo insuficiente</code>', prueba: 'return __salida.some((l) => l === "Saldo insuficiente");' },
    { texto: '<code>retirar(100, 30)</code> sigue devolviendo <code>70</code>', prueba: 'return retirar(100, 30) === 70;' },
    {
      texto: '<code>retirar(10, 50)</code> lanza un <code>Error</code> (no un texto suelto)',
      prueba: 'try { retirar(10, 50); return false; } catch (e) { return e instanceof Error && e.message === "Saldo insuficiente"; }',
    },
    { texto: 'Usa <code>try</code> y <code>catch</code>', prueba: String.raw`return /\btry\s*\{/.test(__codigo) && /\bcatch\b/.test(__codigo);` },
  ],
  pistas: [
    'Dentro de la función, antes del <code>return</code>, comprueba si <code>monto > saldo</code>.',
    'Si se cumple: <code>throw new Error("Saldo insuficiente");</code>',
    'Afuera: <code>try { retirar(100, 250); } catch (error) { console.log(error.message); }</code>',
  ] as [string, string, string],
  solucion: `function retirar(saldo, monto) {
  if (monto > saldo) {
    throw new Error("Saldo insuficiente");
  }
  return saldo - monto;
}

try {
  retirar(100, 250);
} catch (error) {
  console.log(error.message);
}`,
  explicacion:
    '<p>La función no decide qué hacer con el problema: solo lo <b>señala</b> lanzando un error. Quien la llama decide cómo manejarlo. Así la misma función sirve en una web (mostrando un aviso) o en un servidor (respondiendo con un error), sin cambiar nada.</p>',
};
