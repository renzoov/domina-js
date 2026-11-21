// Ejercicios de la sección 9: «Asincronía».

/* ── 9.1 Si JS tiene un solo hilo, ¿cómo espera? ──────────── */
export const esperaAuto = {
  id: 'espera-auto',
  titulo: 'Esperar sin bloquear',
  preguntas: [
    {
      pregunta: 'Si tu código hace un bucle de 5 segundos, ¿qué le pasa a la página mientras tanto?',
      opciones: ['Nada, sigue respondiendo', 'Se congela: el único hilo está ocupado y no puede atender clics ni dibujar', 'Se recarga'],
      correcta: 1,
      explicacion: 'Mientras la pila de llamadas no se vacía, no se ejecuta nada más: ni eventos, ni temporizadores, ni el dibujo de la página.',
    },
    {
      pregunta: '¿Quién cuenta el tiempo de un <code>setTimeout</code>?',
      opciones: ['Tu código, en un bucle', 'El runtime (navegador o Node.js), fuera de tu hilo', 'El sistema operativo, borrando la pila'],
      correcta: 1,
      explicacion: 'Tu código solo le deja el encargo y sigue. Cuando el tiempo pasa, el runtime pone tu función en una cola.',
    },
    {
      pregunta: '¿Qué significa que JavaScript sea <em>run to completion</em>?',
      opciones: ['Que nunca termina', 'Que una función, una vez empezada, corre hasta el final sin que nada la interrumpa', 'Que todo es asíncrono'],
      correcta: 1,
      explicacion: 'Un callback nunca se ejecuta en medio de otra función: espera a que la pila quede libre.',
    },
    {
      pregunta: '<code>setTimeout(f, 0)</code>, ¿ejecuta <code>f</code> inmediatamente?',
      opciones: ['Sí', 'No: la deja en la cola y se ejecuta cuando termine el código que está corriendo'],
      correcta: 1,
      explicacion: '0 ms significa "lo antes posible", que siempre es después de lo que está en la pila.',
    },
  ],
};

export const esperaOrden = {
  id: 'espera-orden',
  titulo: 'El encargo y el resto',
  codigo: `console.log("pido un café");

setTimeout(() => {
  console.log("café listo");
}, 0);

for (let i = 1; i <= 2; i++) {
  console.log("leo la página", i);
}`,
  salida: ['pido un café', 'leo la página 1', 'leo la página 2', 'café listo'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'Aunque el temporizador es de 0 ms, su callback espera en la cola hasta que el programa principal termina, bucle incluido. Solo entonces la pila queda libre para ejecutarlo.',
};

export const esperaDetective = {
  id: 'espera-detective',
  titulo: 'Usar un dato antes de que llegue',
  codigo: `let datos;

setTimeout(() => {
  datos = { nombre: "Ana" };
}, 100);

console.log(datos.nombre);`,
  error: `perfil.js:7
console.log(datos.nombre);
                  ^

TypeError: Cannot read properties of undefined (reading 'nombre')`,
  culpable: 7,
  hallazgo:
    'La línea 7 se ejecuta enseguida, sin esperar: el callback que llena <code>datos</code> corre 100 ms después. En ese momento, <code>datos</code> sigue en <code>undefined</code>.',
  pista: '¿En qué orden se ejecutan la línea 4 y la línea 7?',
  arreglos: [
    {
      texto: 'Mover el <code>console.log</code> dentro del callback, después de asignar <code>datos</code>',
      correcta: true,
      porque: 'Lo que depende del dato tiene que ocurrir cuando el dato llega. Con promesas y <code>await</code> lo escribirás de forma más cómoda.',
    },
    {
      texto: 'Bajar el tiempo a <code>0</code>',
      correcta: false,
      porque: 'Con 0 ms el callback sigue esperando en la cola hasta que termine el programa: el mismo error.',
    },
    {
      texto: 'Esperar con un bucle: <code>while (!datos) {}</code> antes del <code>console.log</code>',
      correcta: false,
      porque: 'El bucle ocupa el único hilo para siempre: el callback nunca puede ejecutarse y el programa se cuelga.',
    },
  ],
};

export const esperaLab = {
  id: 'espera-lab',
  titulo: 'Avisar sin bloquear',
  inicial: `// Escribe avisarDespues(texto, ms): imprime texto después de ms milisegundos,
// sin bloquear: el resto del programa tiene que seguir mientras tanto.

avisarDespues("¡listo!", 100);
console.log("esperando…");
`,
  verificaciones: [
    { texto: 'Imprime <code>esperando…</code> y después <code>¡listo!</code>', prueba: 'return __salida.join("|") === "esperando…|¡listo!";' },
    { texto: 'Espera de verdad el tiempo pedido', prueba: 'const t = performance.now(); avisarDespues("x", 80); await __esperar(); return performance.now() - t >= 75;' },
    { texto: 'Usa <code>setTimeout</code>, sin bucles de espera', prueba: String.raw`return /setTimeout\s*\(/.test(__codigo) && !/\bwhile\b|Date\.now/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function avisarDespues(texto, ms) { … }</code> arriba de todo.',
    'Deja el encargo al runtime con <code>setTimeout(funcion, ms)</code>.',
    '<code>setTimeout(() => console.log(texto), ms);</code>',
  ] as [string, string, string],
  solucion: `function avisarDespues(texto, ms) {
  setTimeout(() => console.log(texto), ms);
}

avisarDespues("¡listo!", 100);
console.log("esperando…");`,
  explicacion:
    '<p><code>avisarDespues</code> termina enseguida: solo deja el encargo. Por eso <code>esperando…</code> sale primero. El texto aparece cuando el runtime avisa que pasó el tiempo y la pila está libre.</p>',
};

/* ── 9.2 El event loop ───────────────────────────────────── */
export const loopAuto = {
  id: 'loop-auto',
  titulo: 'Pila, APIs y cola',
  preguntas: [
    {
      pregunta: '¿Qué hace el <b>event loop</b>?',
      opciones: [
        'Ejecuta los bucles del programa',
        'Cuando la pila de llamadas está vacía, toma la siguiente tarea de la cola y la pone en la pila',
        'Cuenta el tiempo de los temporizadores',
      ],
      correcta: 1,
      explicacion: 'Es un bucle muy simple que se repite mientras el programa vive: "¿la pila está vacía? Entonces, siguiente tarea".',
    },
    {
      pregunta: '¿Qué hay en la <b>cola de tareas</b>?',
      opciones: ['Funciones listas para ejecutarse: callbacks de temporizadores, eventos, respuestas…', 'Variables', 'Errores'],
      correcta: 0,
      explicacion: 'Cada callback entra a la cola cuando su evento ocurrió: pasó el tiempo, llegó un clic, terminó una descarga.',
    },
    {
      pregunta: 'Un <code>setTimeout(f, 100)</code>, ¿garantiza que <code>f</code> corra exactamente a los 100 ms?',
      opciones: ['Sí', 'No: garantiza <b>al menos</b> 100 ms; si la pila está ocupada, espera más'],
      correcta: 1,
      explicacion: 'El tiempo es el mínimo. El callback tiene que esperar su turno en la cola y que la pila quede libre.',
    },
    {
      pregunta: 'Si dos temporizadores vencen a la vez, ¿cuál corre primero?',
      opciones: ['El más corto', 'El que entró antes a la cola: es una fila, primero en llegar, primero en salir', 'Al azar'],
      correcta: 1,
      explicacion: 'La cola de tareas es FIFO (<em>first in, first out</em>).',
    },
  ],
};

export const loopOrden = {
  id: 'loop-orden',
  titulo: 'Tres temporizadores',
  codigo: `setTimeout(() => console.log("C: 200 ms"), 200);
setTimeout(() => console.log("A: 0 ms"), 0);
setTimeout(() => {
  console.log("B: 100 ms");
  setTimeout(() => console.log("D: 100 + 0 ms"), 0);
}, 100);
console.log("primero, el programa");`,
  salida: ['primero, el programa', 'A: 0 ms', 'B: 100 ms', 'D: 100 + 0 ms', 'C: 200 ms'],
  inicio: [4, 2, 0, 3, 1],
  explicacion:
    'El programa principal termina antes que cualquier callback. Después, cada callback entra a la cola cuando vence su tiempo: A enseguida, B a los 100 ms, y D poco después de B, porque B lo programó al ejecutarse. C llega a los 200.',
};

export const loopDetective = {
  id: 'loop-detective',
  titulo: 'Un temporizador sin función',
  codigo: `function saludar() {
  console.log("¡Hola!");
}

setTimeout(saludar(), 1000);`,
  error: `¡Hola!
node:internal/validators:440
    throw new ERR_INVALID_ARG_TYPE(name, 'Function', value);
    ^

TypeError [ERR_INVALID_ARG_TYPE]: The "callback" argument must be of type function. Received undefined`,
  culpable: 5,
  hallazgo:
    'Con los paréntesis, <code>saludar()</code> se ejecuta <b>ya</b> (por eso el saludo aparece antes del error), y lo que recibe <code>setTimeout</code> es lo que devolvió: <code>undefined</code>. Node.js lo rechaza; un navegador lo ignoraría en silencio.',
  pista: 'El saludo aparece enseguida, no al segundo. ¿Qué le llega a <code>setTimeout</code> como primer argumento?',
  arreglos: [
    {
      texto: 'Pasar la función sin paréntesis: <code>setTimeout(saludar, 1000)</code>',
      correcta: true,
      porque: 'Le das la función al runtime para que <b>él</b> la llame dentro de un segundo.',
    },
    {
      texto: 'Pasarla como texto: <code>setTimeout("saludar()", 1000)</code>',
      correcta: false,
      porque: 'Los navegadores aceptan texto y lo evalúan como código, una práctica insegura y desaconsejada. Node.js lo rechaza con el mismo error.',
    },
    {
      texto: 'Envolverla: <code>setTimeout(() => saludar, 1000)</code>',
      correcta: false,
      porque: 'Al segundo se ejecuta la flecha, que <b>devuelve</b> la función sin llamarla: nunca se saluda.',
    },
  ],
};

export const loopLab = {
  id: 'loop-lab',
  titulo: 'Cuenta regresiva sin bloquear',
  inicial: `// Escribe cuentaRegresiva(desde): imprime desde, desde - 1, …, 1, uno cada 50 ms,
// y al final "¡despegue!". Sin bucles que esperen: usa setTimeout o setInterval.

cuentaRegresiva(3);
console.log("cuenta iniciada");
`,
  verificaciones: [
    { texto: 'Imprime <code>cuenta iniciada</code>, <code>3</code>, <code>2</code>, <code>1</code> y <code>¡despegue!</code>', prueba: 'return __salida.join("|") === "cuenta iniciada|3|2|1|¡despegue!";' },
    { texto: 'Cada número llega con una pausa: la cuenta de 3 tarda al menos 140 ms', prueba: 'const t = performance.now(); cuentaRegresiva(3); await __esperar(); return performance.now() - t >= 140;' },
    { texto: 'Usa <code>setTimeout</code> o <code>setInterval</code>, sin esperar con bucles', prueba: String.raw`return /set(Timeout|Interval)\s*\(/.test(__codigo) && !/\bwhile\b|Date\.now/.test(__codigo);` },
  ],
  pistas: [
    'Con <code>setInterval</code>: guarda el número actual en una variable y, en cada vuelta, imprímelo y réstale 1.',
    'Cuando llegue a 0, imprime <code>¡despegue!</code> y detén el intervalo con <code>clearInterval(id)</code>.',
    '<code>let n = desde; const id = setInterval(() => { if (n === 0) { console.log("¡despegue!"); clearInterval(id); } else console.log(n--); }, 50);</code>',
  ] as [string, string, string],
  solucion: `function cuentaRegresiva(desde) {
  let n = desde;
  const id = setInterval(() => {
    if (n === 0) {
      console.log("¡despegue!");
      clearInterval(id);
    } else {
      console.log(n--);
    }
  }, 50);
}

cuentaRegresiva(3);
console.log("cuenta iniciada");`,
  explicacion:
    '<p>Entre un número y otro, la pila queda libre: el programa (y la página) puede hacer cualquier otra cosa. Olvidar el <code>clearInterval</code> es un error clásico: el intervalo seguiría para siempre.</p>',
};

/* ── 9.3 Callbacks ───────────────────────────────────────── */
export const callbacksAuto = {
  id: 'callbacks-auto',
  titulo: 'Avísame cuando termines',
  preguntas: [
    {
      pregunta: 'En la convención <em>error-first</em> de Node.js, ¿qué recibe primero el callback?',
      opciones: ['El resultado', 'El error, o <code>null</code> si todo salió bien', 'El tiempo que tardó'],
      correcta: 1,
      explicacion: '<code>(error, resultado) => { … }</code>: siempre hay que mirar primero el error.',
    },
    {
      pregunta: '¿Qué es el <em>callback hell</em>?',
      opciones: ['Un error de sintaxis', 'Callbacks anidados unos dentro de otros, con el código cada vez más a la derecha y difícil de seguir', 'Un callback que no se llama'],
      correcta: 1,
      explicacion: 'Cada paso que depende del anterior agrega un nivel de anidamiento, y el manejo de errores se repite en cada uno.',
    },
    {
      pregunta: '¿Un <code>try/catch</code> alrededor de una función asíncrona atrapa un error lanzado dentro de su callback?',
      opciones: ['Sí', 'No: cuando el callback corre, el <code>try</code> ya terminó hace rato'],
      correcta: 1,
      explicacion: 'El callback se ejecuta más tarde, en otra vuelta del event loop, con la pila vacía. Por eso los errores se pasan como argumento.',
    },
    {
      pregunta: '<code>[1, 2].map((n) => n * 2)</code>, ¿usa un callback asíncrono?',
      opciones: ['Sí', 'No: es un callback <b>síncrono</b>, se llama ahí mismo, antes de que <code>map</code> termine'],
      correcta: 1,
      explicacion: 'Callback solo significa "función que pasas para que te llamen". Puede ser ahora (map) o después (setTimeout).',
    },
  ],
};

export const callbacksOrden = {
  id: 'callbacks-orden',
  titulo: 'Error primero',
  codigo: `function dividir(a, b, cb) {
  setTimeout(() => {
    if (b === 0) cb(new Error("división por cero"));
    else cb(null, a / b);
  }, 10);
}

function mostrar(error, resultado) {
  if (error) console.log("Error:", error.message);
  else console.log("Resultado:", resultado);
}

dividir(10, 2, mostrar);
dividir(1, 0, mostrar);
console.log("pedidos enviados");`,
  salida: ['pedidos enviados', 'Resultado: 5', 'Error: división por cero'],
  inicio: [2, 0, 1],
  explicacion:
    'Los dos cálculos se piden y el programa sigue: <code>pedidos enviados</code> sale primero. Diez milisegundos después llega cada respuesta, en el orden en que se pidieron, y el mismo callback distingue el éxito del error mirando el primer argumento.',
};

export const callbacksDetective = {
  id: 'callbacks-detective',
  titulo: 'Un try que llega tarde',
  codigo: `function leerConfig(cb) {
  setTimeout(() => cb(new Error("archivo no encontrado")), 50);
}

try {
  leerConfig((error, datos) => {
    if (error) throw error;
    console.log(datos);
  });
} catch (e) {
  console.log("Atrapado:", e.message);
}`,
  error: `config.js:7
    if (error) throw error;
               ^

Error: archivo no encontrado`,
  culpable: 7,
  hallazgo:
    'El <code>try</code> terminó en cuanto <code>leerConfig</code> dejó el encargo. 50 ms después, el callback lanza el error con la pila vacía: no hay ningún <code>catch</code> esperando, y el programa termina.',
  pista: 'Cuando se ejecuta la línea 7, ¿sigue activo el <code>try</code> de la línea 5?',
  arreglos: [
    {
      texto: 'Manejar el error dentro del callback: <code>if (error) return console.log("Atrapado:", error.message);</code>',
      correcta: true,
      porque: 'Con callbacks, los errores se reciben como argumento y se manejan ahí mismo. Lanzarlos no sirve, porque no queda nadie para atraparlos.',
    },
    {
      texto: 'Poner otro <code>try/catch</code> alrededor de todo el archivo',
      correcta: false,
      porque: 'Cualquier <code>try</code> termina antes de que corra el callback. El problema es el momento, no el lugar.',
    },
    {
      texto: 'Bajar el tiempo a <code>0</code>',
      correcta: false,
      porque: 'Con 0 ms el callback sigue corriendo después de que el <code>try</code> terminó: el mismo error.',
    },
  ],
};

export const callbacksLab = {
  id: 'callbacks-lab',
  titulo: 'Una suma con callback',
  inicial: `// Escribe sumarLuego(a, b, cb) al estilo error-first:
// - si a o b no son números, llama a cb(new TypeError("se esperaban números"))
// - si no, a los 30 ms llama a cb(null, a + b)
// Ojo: el callback nunca debe llamarse antes de que sumarLuego termine.

sumarLuego(2, 3, (error, total) => console.log(error ? error.message : total));
sumarLuego(2, "x", (error, total) => console.log(error ? error.message : total));
console.log("sumas pedidas");
`,
  verificaciones: [
    { texto: 'Imprime <code>sumas pedidas</code>, el error y después <code>5</code>', prueba: 'return __salida.join("|") === "sumas pedidas|se esperaban números|5";' },
    { texto: 'El error es un <code>TypeError</code> y el éxito pasa <code>null</code> como error', prueba: 'let r = []; sumarLuego(1, "a", (e) => r.push(e instanceof TypeError)); sumarLuego(1, 1, (e, t) => r.push(e === null && t === 2)); await __esperar(); return r.length === 2 && r.every(Boolean);' },
    { texto: 'El callback nunca se llama antes de que la función termine', prueba: 'let llamado = false; sumarLuego(1, "a", () => { llamado = true; }); const antes = llamado; await __esperar(); return !antes && llamado;' },
  ],
  pistas: [
    'Empieza con <code>function sumarLuego(a, b, cb) { … }</code> arriba de todo. Comprueba con <code>typeof a !== "number"</code>.',
    'El error también tiene que llegar <b>después</b>: envuélvelo en un <code>setTimeout(…, 0)</code>, como el resultado.',
    '<code>if (typeof a !== "number" || typeof b !== "number") { setTimeout(() => cb(new TypeError("se esperaban números")), 0); return; }</code>',
  ] as [string, string, string],
  solucion: `function sumarLuego(a, b, cb) {
  if (typeof a !== "number" || typeof b !== "number") {
    setTimeout(() => cb(new TypeError("se esperaban números")), 0);
    return;
  }
  setTimeout(() => cb(null, a + b), 30);
}

sumarLuego(2, 3, (error, total) => console.log(error ? error.message : total));
sumarLuego(2, "x", (error, total) => console.log(error ? error.message : total));
console.log("sumas pedidas");`,
  explicacion:
    '<p>Una función asíncrona tiene que serlo <b>siempre</b>. Si a veces llama al callback en el momento (con el error) y a veces después, quien la usa no puede predecir el orden. Esa inconsistencia tiene nombre: "liberar a Zalgo".</p>',
};

/* ── 9.4 Promesas ─────────────────────────────────────────── */
export const promesasAuto = {
  id: 'promesas-auto',
  titulo: 'Un valor que llegará',
  preguntas: [
    {
      pregunta: '¿Cuáles son los estados de una promesa?',
      opciones: ['Pendiente, cumplida o rechazada', 'Abierta o cerrada', 'Verdadera o falsa'],
      correcta: 0,
      explicacion: 'Empieza <b>pendiente</b> y pasa, una sola vez y para siempre, a <b>cumplida</b> (con un valor) o <b>rechazada</b> (con un motivo).',
    },
    {
      pregunta: '¿Qué devuelve <code>promesa.then(fn)</code>?',
      opciones: ['El valor de la promesa', 'Una promesa <b>nueva</b>, que se cumple con lo que devuelva <code>fn</code>', '<code>undefined</code>'],
      correcta: 1,
      explicacion: 'Por eso se pueden encadenar: cada <code>then</code> recibe lo que devolvió el anterior.',
    },
    {
      pregunta: 'En una cadena, si un <code>then</code> lanza un error, ¿qué pasa con los siguientes <code>then</code>?',
      opciones: ['Se ejecutan igual', 'Se saltan hasta el primer <code>catch</code>', 'Se repiten'],
      correcta: 1,
      explicacion: 'Un rechazo baja por la cadena como una excepción, hasta que algún <code>catch</code> lo maneja.',
    },
    {
      pregunta: '¿Cuándo se ejecuta el callback de <code>finally</code>?',
      opciones: ['Solo si se cumplió', 'Solo si se rechazó', 'En los dos casos'],
      correcta: 2,
      explicacion: 'Sirve para limpiar: ocultar un "cargando…", cerrar algo. No recibe el valor y no lo cambia.',
    },
  ],
};

export const promesasOrden = {
  id: 'promesas-orden',
  titulo: 'Una cadena con un tropiezo',
  codigo: `Promise.resolve(2)
  .then((n) => n * 10)
  .then((n) => {
    console.log("valor:", n);
    throw new Error("se rompió");
  })
  .then(() => console.log("esto no se ve"))
  .catch((e) => {
    console.log("catch:", e.message);
    return "recuperado";
  })
  .then((v) => console.log("después:", v))
  .finally(() => console.log("fin"));`,
  salida: ['valor: 20', 'catch: se rompió', 'después: recuperado', 'fin'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'El error salta el <code>then</code> siguiente y cae en el <code>catch</code>. Como el <code>catch</code> devuelve un valor, la cadena se <b>recupera</b>: el siguiente <code>then</code> recibe <code>"recuperado"</code>. <code>finally</code> corre al final.',
};

export const promesasDetective = {
  id: 'promesas-detective',
  titulo: 'Un then que no devuelve',
  codigo: `const buscarUsuario = () => Promise.resolve({ id: 7, nombre: "Ana" });
const buscarPedidos = (id) => Promise.resolve(["té", "pan"]);

buscarUsuario()
  .then((usuario) => {
    buscarPedidos(usuario.id);
  })
  .then((pedidos) => console.log(pedidos.length));`,
  error: `pedidos.js:8
  .then((pedidos) => console.log(pedidos.length));
                                         ^

TypeError: Cannot read properties of undefined (reading 'length')`,
  culpable: 6,
  hallazgo:
    'El primer <code>then</code> tiene llaves y no tiene <code>return</code>: llama a <code>buscarPedidos</code>, pero su promesa se pierde. El siguiente <code>then</code> recibe <code>undefined</code>.',
  pista: '¿Qué valor le pasa el primer <code>then</code> al segundo?',
  arreglos: [
    {
      texto: 'Devolver la promesa: <code>return buscarPedidos(usuario.id);</code>',
      correcta: true,
      porque: 'Si un <code>then</code> devuelve una promesa, la cadena espera a que se cumpla y le pasa su valor al siguiente: el array de pedidos.',
    },
    {
      texto: 'Agregar un <code>.catch()</code> al final',
      correcta: false,
      porque: 'Atraparía el error, pero el número de pedidos seguiría sin llegar.',
    },
    {
      texto: 'Usar <code>pedidos?.length</code>',
      correcta: false,
      porque: 'Imprime <code>undefined</code> en lugar de fallar: el dato sigue perdido.',
    },
  ],
};

export const promesasLab = {
  id: 'promesas-lab',
  titulo: 'Esperar con una promesa',
  inicial: `// Escribe esperar(ms): devuelve una promesa que se cumple después de ms milisegundos.

esperar(50).then(() => console.log("pasaron 50 ms"));
console.log("esperando…");
`,
  verificaciones: [
    { texto: 'Imprime <code>esperando…</code> y después <code>pasaron 50 ms</code>', prueba: 'return __salida.join("|") === "esperando…|pasaron 50 ms";' },
    { texto: 'Devuelve una promesa que tarda lo pedido', prueba: 'const p = esperar(60); if (!(p instanceof Promise)) return false; const t = performance.now(); await p; return performance.now() - t >= 55;' },
    { texto: 'Usa <code>new Promise</code> y <code>setTimeout</code>', prueba: String.raw`return /new\s+Promise\s*\(/.test(__codigo) && /setTimeout\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function esperar(ms) { return new Promise(…); }</code> arriba de todo.',
    '<code>new Promise</code> recibe una función con un parámetro <code>resolver</code>: llamarlo cumple la promesa.',
    '<code>return new Promise((resolver) => setTimeout(resolver, ms));</code>',
  ] as [string, string, string],
  solucion: `function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

esperar(50).then(() => console.log("pasaron 50 ms"));
console.log("esperando…");`,
  explicacion:
    '<p>Es la forma de convertir cualquier API con callbacks en una promesa: creas la promesa y llamas a <code>resolver</code> (o a <code>rechazar</code>) desde el callback. Esta <code>esperar</code> te va a acompañar en todos los temas que siguen.</p>',
};

/* ── 9.5 Combinadores de promesas ─────────────────────────── */
export const combAuto = {
  id: 'comb-auto',
  titulo: 'Varias promesas a la vez',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>Promise.all</code> si una de las promesas se rechaza?',
      opciones: ['Ignora esa y sigue', 'Se rechaza enseguida con ese error, aunque las demás se cumplan', 'Espera a todas'],
      correcta: 1,
      explicacion: 'Es "todo o nada". Si necesitas el resultado de cada una, aunque alguna falle, usa <code>allSettled</code>.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>race</code> y <code>any</code> (ES2021)?',
      opciones: [
        'Ninguna',
        '<code>race</code> se queda con la primera que termine, bien o mal; <code>any</code>, con la primera que se cumpla',
        '<code>any</code> es más rápido',
      ],
      correcta: 1,
      explicacion: 'Si todas fallan, <code>any</code> se rechaza con un <code>AggregateError</code> que reúne todos los errores.',
    },
    {
      pregunta: '¿Para qué sirve <code>Promise.withResolvers()</code> (ES2024)?',
      opciones: ['Para crear una promesa y obtener, por separado, sus funciones <code>resolve</code> y <code>reject</code>', 'Para resolver todas', 'Para cancelar'],
      correcta: 0,
      explicacion: 'Útil cuando quien cumple la promesa está lejos de donde se crea, por ejemplo en un evento.',
    },
    {
      pregunta: '¿Qué ventaja tiene <code>Promise.try(fn)</code> (ES2025)?',
      opciones: ['Ninguna', 'Envuelve <code>fn</code> en una promesa aunque sea síncrona o lance un error al momento', 'Reintenta'],
      correcta: 1,
      explicacion: 'Así, un error síncrono también llega al <code>catch</code> de la cadena, en lugar de escaparse.',
    },
  ],
};

export const combOrden = {
  id: 'comb-orden',
  titulo: 'Quién gana',
  codigo: `const tras = (ms, valor, falla = false) =>
  new Promise((ok, mal) => setTimeout(() => (falla ? mal(new Error(valor)) : ok(valor)), ms));

const r1 = await Promise.all([tras(30, "a"), tras(10, "b")]);
console.log("all:", r1.join(","));

const r2 = await Promise.race([tras(30, "lento"), tras(10, "rápido")]);
console.log("race:", r2);

const r3 = await Promise.any([tras(10, "x", true), tras(20, "y")]);
console.log("any:", r3);

const r4 = await Promise.allSettled([tras(10, "ok"), tras(10, "no", true)]);
console.log("allSettled:", r4.map((r) => r.status).join(","));`,
  salida: ['all: a,b', 'race: rápido', 'any: y', 'allSettled: fulfilled,rejected'],
  inicio: [3, 1, 0, 2],
  explicacion:
    '<code>all</code> respeta el orden del array, no el de llegada. <code>race</code> se queda con la primera que termina. <code>any</code> ignora la que falló y espera a la primera que se cumple. <code>allSettled</code> informa el estado de cada una.',
};

export const combDetective = {
  id: 'comb-detective',
  titulo: 'Todo o nada',
  codigo: `const cargar = (nombre) =>
  nombre === "fotos"
    ? Promise.reject(new Error("servicio de fotos caído"))
    : Promise.resolve(\`datos de \${nombre}\`);

const secciones = ["perfil", "fotos", "amigos"];
const resultados = await Promise.all(secciones.map(cargar));

console.log("cargadas:", resultados.length);`,
  error: `panel.js:3
    ? Promise.reject(new Error("servicio de fotos caído"))
                     ^

Error: servicio de fotos caído`,
  culpable: 7,
  hallazgo:
    'Con <code>Promise.all</code>, basta una falla para que todo se rechace, y el error no tiene <code>catch</code>. El panel no muestra nada, aunque el perfil y los amigos cargaron bien.',
  pista: 'Dos de las tres secciones cargaron. ¿Qué combinador te da el resultado de cada una por separado?',
  arreglos: [
    {
      texto: 'Usar <code>Promise.allSettled</code> y mostrar las secciones cuyo <code>status</code> es <code>"fulfilled"</code>',
      correcta: true,
      porque: '<code>allSettled</code> nunca se rechaza: espera a todas e informa cuáles se cumplieron y cuáles fallaron. El panel puede mostrar lo que sí cargó.',
    },
    {
      texto: 'Usar <code>Promise.race</code>',
      correcta: false,
      porque: 'Se quedaría con la primera que termine: una sola sección, o el error de fotos si es la primera.',
    },
    {
      texto: 'Usar <code>Promise.any</code>',
      correcta: false,
      porque: 'Devuelve solo la primera que se cumple, no las tres.',
    },
  ],
};

export const combLab = {
  id: 'comb-lab',
  titulo: 'Un límite de tiempo',
  inicial: `const esperar = (ms, valor) => new Promise((r) => setTimeout(() => r(valor), ms));

// Escribe conLimite(promesa, ms): devuelve una promesa que se cumple con el valor
// de promesa si llega antes de ms milisegundos, o se rechaza con
// new Error("tiempo agotado") si tarda más. Usa Promise.race.

console.log(await conLimite(esperar(20, "a tiempo"), 100));
try {
  await conLimite(esperar(200, "tarde"), 50);
} catch (e) {
  console.log(e.message);
}
`,
  verificaciones: [
    { texto: 'Imprime <code>a tiempo</code> y <code>tiempo agotado</code>', prueba: 'return __salida.join("|") === "a tiempo|tiempo agotado";' },
    { texto: 'Se rechaza a tiempo, sin esperar a la promesa lenta', prueba: 'const t = performance.now(); try { await conLimite(esperar(300, 1), 40); } catch {} return performance.now() - t < 200;' },
    { texto: 'Usa <code>Promise.race</code>', prueba: String.raw`return /Promise\.race\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'La idea: hacer competir la promesa original contra otra que se <b>rechaza</b> a los <code>ms</code> milisegundos.',
    'La promesa del reloj: <code>new Promise((_, rechazar) => setTimeout(() => rechazar(new Error("tiempo agotado")), ms))</code>',
    '<code>return Promise.race([promesa, reloj]);</code>. Escribe la función antes de usarla.',
  ] as [string, string, string],
  solucion: `const esperar = (ms, valor) => new Promise((r) => setTimeout(() => r(valor), ms));

function conLimite(promesa, ms) {
  const reloj = new Promise((_, rechazar) =>
    setTimeout(() => rechazar(new Error("tiempo agotado")), ms)
  );
  return Promise.race([promesa, reloj]);
}

console.log(await conLimite(esperar(20, "a tiempo"), 100));
try {
  await conLimite(esperar(200, "tarde"), 50);
} catch (e) {
  console.log(e.message);
}`,
  explicacion:
    '<p><code>race</code> se queda con la primera que termina, se cumpla o se rechace. Ojo: la promesa lenta no se cancela, sigue su curso aunque nadie espere su resultado. Para cancelar de verdad está <code>AbortController</code>, dos temas más adelante.</p>',
};

/* ── 9.6 async/await ─────────────────────────────────────── */
export const asyncAuto = {
  id: 'async-auto',
  titulo: 'Promesas que se leen de arriba abajo',
  preguntas: [
    {
      pregunta: '¿Qué devuelve siempre una función <code>async</code>?',
      opciones: ['Lo que tenga en su <code>return</code>', 'Una promesa, que se cumple con lo que tenga en su <code>return</code>', '<code>undefined</code>'],
      correcta: 1,
      explicacion: 'Aunque devuelvas un número, quien la llama recibe una promesa de ese número.',
    },
    {
      pregunta: '¿Qué hace <code>await</code>?',
      opciones: ['Bloquea todo el programa', 'Pausa la función <code>async</code> hasta que la promesa se cumple, sin bloquear el resto del programa', 'Repite'],
      correcta: 1,
      explicacion: 'La función sale de la pila mientras espera, como un generador en un <code>yield</code>, y el event loop sigue atendiendo otras cosas.',
    },
    {
      pregunta: '¿Cómo se manejan los errores con <code>await</code>?',
      opciones: ['No se pueden manejar', 'Con <code>try/catch</code>, como el código síncrono', 'Solo con <code>.catch</code>'],
      correcta: 1,
      explicacion: 'Una promesa rechazada hace que el <code>await</code> lance el error, que el <code>catch</code> atrapa.',
    },
    {
      pregunta: 'Dos <code>await</code> seguidos sobre tareas independientes de 1 segundo cada una, ¿cuánto tardan?',
      opciones: ['1 segundo', '2 segundos: la segunda empieza cuando termina la primera', '0 segundos'],
      correcta: 1,
      explicacion: 'Si no dependen una de otra, lánzalas juntas y espera las dos con <code>await Promise.all([…])</code>: 1 segundo.',
    },
  ],
};

export const asyncOrden = {
  id: 'async-orden',
  titulo: 'Dónde se pausa',
  codigo: `async function preparar() {
  console.log("2. empieza preparar");
  await null;
  console.log("4. sigue después del await");
  return "listo";
}

console.log("1. antes");
preparar().then((v) => console.log("5.", v));
console.log("3. después de llamar");`,
  salida: ['1. antes', '2. empieza preparar', '3. después de llamar', '4. sigue después del await', '5. listo'],
  inicio: [2, 4, 0, 3, 1],
  explicacion:
    'Una función <code>async</code> se ejecuta en el momento <b>hasta el primer <code>await</code></b>. Ahí se pausa y devuelve su promesa: el programa sigue con la línea 10. Cuando la pila queda libre, la función retoma, termina y cumple su promesa.',
};

export const asyncDetective = {
  id: 'async-detective',
  titulo: 'Un await que falta',
  codigo: `async function obtenerUsuario() {
  return { nombre: "Ana" };
}

async function saludar() {
  const usuario = obtenerUsuario();
  console.log(\`Hola, \${usuario.nombre.toUpperCase()}\`);
}

saludar();`,
  error: `saludo.js:7
  console.log(\`Hola, \${usuario.nombre.toUpperCase()}\`);
                                     ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')`,
  culpable: 6,
  hallazgo:
    'Sin <code>await</code>, <code>usuario</code> no es el objeto, sino la <b>promesa</b> que devuelve la función <code>async</code>. Una promesa no tiene <code>nombre</code>: <code>usuario.nombre</code> es <code>undefined</code>.',
  pista: '¿Qué devuelve siempre una función <code>async</code>? ¿Qué guarda <code>usuario</code>?',
  arreglos: [
    {
      texto: 'Esperar la promesa: <code>const usuario = await obtenerUsuario();</code>',
      correcta: true,
      porque: 'Con <code>await</code>, <code>usuario</code> es el objeto con el que se cumplió la promesa. Imprime <code>Hola, ANA</code>.',
    },
    {
      texto: 'Quitar el <code>async</code> de <code>saludar</code>',
      correcta: false,
      porque: '<code>obtenerUsuario</code> sigue devolviendo una promesa: el mismo error.',
    },
    {
      texto: 'Usar <code>usuario.nombre?.toUpperCase()</code>',
      correcta: false,
      porque: 'Imprime <code>Hola, undefined</code>: escondes que nunca esperaste el dato.',
    },
  ],
};

export const asyncLab = {
  id: 'async-lab',
  titulo: 'De then a await',
  inicial: `const usuarios = { 1: "Ana", 2: "Luis" };
const buscarUsuario = (id) =>
  new Promise((ok, mal) =>
    setTimeout(() => (usuarios[id] ? ok(usuarios[id]) : mal(new Error("no existe"))), 20)
  );

// Reescribe cargarPerfil con async/await y try/catch, sin .then ni .catch.
function cargarPerfil(id) {
  return buscarUsuario(id)
    .then((nombre) => \`Perfil de \${nombre}\`)
    .catch(() => "sin perfil");
}

console.log(await cargarPerfil(1));
console.log(await cargarPerfil(9));
`,
  verificaciones: [
    { texto: 'Imprime <code>Perfil de Ana</code> y <code>sin perfil</code>', prueba: 'return __salida.join("|") === "Perfil de Ana|sin perfil";' },
    { texto: 'Sigue devolviendo una promesa con el resultado', prueba: 'const p = cargarPerfil(2); return p instanceof Promise && (await p) === "Perfil de Luis";' },
    { texto: 'Usa <code>async</code>, <code>await</code> y <code>try/catch</code>, sin <code>.then</code> ni <code>.catch</code>', prueba: String.raw`return /async\s+function\s+cargarPerfil/.test(__codigo) && /\bawait\s+buscarUsuario/.test(__codigo) && /\btry\s*\{/.test(__codigo) && !/\.then\s*\(|\.catch\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Cambia la firma a <code>async function cargarPerfil(id)</code>.',
    'Dentro de un <code>try</code>: <code>const nombre = await buscarUsuario(id);</code> y <code>return `Perfil de ${nombre}`;</code>',
    'En el <code>catch</code>: <code>return "sin perfil";</code>',
  ] as [string, string, string],
  solucion: `const usuarios = { 1: "Ana", 2: "Luis" };
const buscarUsuario = (id) =>
  new Promise((ok, mal) =>
    setTimeout(() => (usuarios[id] ? ok(usuarios[id]) : mal(new Error("no existe"))), 20)
  );

async function cargarPerfil(id) {
  try {
    const nombre = await buscarUsuario(id);
    return \`Perfil de \${nombre}\`;
  } catch {
    return "sin perfil";
  }
}

console.log(await cargarPerfil(1));
console.log(await cargarPerfil(9));`,
  explicacion:
    '<p>Hacen exactamente lo mismo, pero la versión con <code>await</code> se lee como código síncrono: un paso, el siguiente, y el error en su <code>catch</code>. Por debajo siguen siendo promesas.</p>',
};

/* ── 9.7 Microtareas y macrotareas ───────────────────────── */
export const microAuto = {
  id: 'micro-auto',
  titulo: 'Dos colas',
  preguntas: [
    {
      pregunta: '¿Qué va a la cola de <b>microtareas</b>?',
      opciones: ['Los callbacks de <code>setTimeout</code>', 'Las reacciones de las promesas (<code>then</code>, <code>await</code>) y <code>queueMicrotask</code>', 'Los clics'],
      correcta: 1,
      explicacion: 'Los temporizadores, eventos y mensajes van a la cola de tareas (macrotareas).',
    },
    {
      pregunta: 'Cuando la pila queda vacía, ¿qué corre primero?',
      opciones: ['Una tarea de la cola de tareas', '<b>Todas</b> las microtareas pendientes, y después una tarea', 'Lo que haya llegado primero'],
      correcta: 1,
      explicacion: 'Después de cada tarea, el event loop vacía la cola de microtareas por completo antes de tomar la siguiente tarea.',
    },
    {
      pregunta: '¿Qué pasa si una microtarea programa otra microtarea, una y otra vez, sin fin?',
      opciones: ['Nada', 'Los temporizadores, los eventos y el dibujo de la página nunca llegan a ejecutarse: la página se congela', 'Da error'],
      correcta: 1,
      explicacion: 'Como la cola de microtareas se vacía entera, nunca se llega a la siguiente tarea.',
    },
    {
      pregunta: 'En el navegador, ¿cuándo corre <code>requestAnimationFrame</code>?',
      opciones: ['Antes que las microtareas', 'Justo antes de que se dibuje el siguiente cuadro, unas 60 veces por segundo', 'Al cargar la página'],
      correcta: 1,
      explicacion: 'Es el momento ideal para animar: tu cambio se ve en el cuadro siguiente.',
    },
  ],
};

export const microOrden = {
  id: 'micro-orden',
  titulo: 'El acertijo clásico',
  codigo: `console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));

queueMicrotask(() => console.log("E"));

console.log("F");`,
  salida: ['A', 'F', 'C', 'E', 'D', 'B'],
  inicio: [5, 2, 0, 4, 1, 3],
  explicacion:
    'Primero lo síncrono: A y F. Después, todas las microtareas: C y E estaban en la cola; al correr C se agrega D, que también corre antes de pasar a la cola de tareas. Al final, la macrotarea B.',
};

export const microDetective = {
  id: 'micro-detective',
  titulo: 'Una configuración que llega tarde',
  codigo: `let config = null;

setTimeout(() => {
  config = { tema: "oscuro" };
}, 0);

Promise.resolve().then(() => {
  console.log("tema:", config.tema);
});`,
  error: `tema.js:8
  console.log("tema:", config.tema);
                              ^

TypeError: Cannot read properties of null (reading 'tema')`,
  culpable: 3,
  hallazgo:
    'Alguien supuso que <code>setTimeout(…, 0)</code> corre antes que la promesa. Al revés: el <code>then</code> es una microtarea y corre antes que cualquier temporizador. <code>config</code> sigue en <code>null</code>.',
  pista: 'Las dos cosas se programan "para ahora mismo". ¿Cuál de las dos colas se vacía primero?',
  arreglos: [
    {
      texto: 'Asignar <code>config</code> directamente, sin <code>setTimeout</code>',
      correcta: true,
      porque: 'Si el dato está disponible, no hay por qué demorarlo. Si de verdad llegara más tarde, quien lo usa tendría que esperar su promesa.',
    },
    {
      texto: 'Usar <code>queueMicrotask</code> para el <code>console.log</code>',
      correcta: false,
      porque: 'Sigue siendo una microtarea: también corre antes que el temporizador. El mismo error.',
    },
    {
      texto: 'Cambiar el <code>0</code> por <code>-1</code>',
      correcta: false,
      porque: 'Un tiempo negativo vale como 0: el temporizador sigue en la cola de tareas, detrás de las microtareas.',
    },
  ],
};

export const microLab = {
  id: 'micro-lab',
  titulo: 'Programar en cada cola',
  inicial: `// Escribe programar(registro): agrega "síncrono" al array registro ahora mismo,
// "micro" en una microtarea y "macro" en una macrotarea.
// Escribe las tres instrucciones en este orden: macro, micro, síncrono.

const registro = [];
programar(registro);
setTimeout(() => console.log(registro.join(" → ")), 10);
`,
  verificaciones: [
    { texto: 'Imprime <code>síncrono → micro → macro</code>', prueba: 'return __salida.at(-1) === "síncrono → micro → macro";' },
    { texto: 'Usa <code>queueMicrotask</code> (o una promesa) y <code>setTimeout</code>', prueba: String.raw`return /queueMicrotask\s*\(|\.then\s*\(/.test(__codigo) && /setTimeout\s*\(\s*\(\s*\)\s*=>\s*registro\.push/.test(__codigo);` },
    { texto: 'Las instrucciones están en el orden macro, micro, síncrono', prueba: String.raw`const c = __codigo; const a = c.indexOf('push("macro")'), b = c.indexOf('push("micro")'), s = c.indexOf('push("síncrono")'); return a > -1 && a < b && b < s;` },
  ],
  pistas: [
    'Empieza con <code>function programar(registro) { … }</code> arriba de todo.',
    'Macro: <code>setTimeout(() => registro.push("macro"), 0);</code> Micro: <code>queueMicrotask(() => registro.push("micro"));</code>',
    'Y al final, directamente: <code>registro.push("síncrono");</code>',
  ] as [string, string, string],
  solucion: `function programar(registro) {
  setTimeout(() => registro.push("macro"), 0);
  queueMicrotask(() => registro.push("micro"));
  registro.push("síncrono");
}

const registro = [];
programar(registro);
setTimeout(() => console.log(registro.join(" → ")), 10);`,
  explicacion:
    '<p>El orden en que <b>escribes</b> las instrucciones no es el orden en que se <b>ejecutan</b>: lo decide la cola a la que va cada una. Lo síncrono corre ya; las microtareas, en cuanto se vacía la pila; las macrotareas, en la siguiente vuelta del event loop.</p>',
};

/* ── 9.8 Cancelar con AbortController ─────────────────────── */
export const abortAuto = {
  id: 'abort-auto',
  titulo: 'Detener lo que ya empezó',
  preguntas: [
    {
      pregunta: '¿Cómo se usa un <code>AbortController</code>?',
      opciones: [
        'Se llama a <code>abort()</code> antes de empezar',
        'Se le pasa su <code>signal</code> a la operación, y para cancelarla se llama a <code>controller.abort()</code>',
        'Se borra la variable',
      ],
      correcta: 1,
      explicacion: 'El controlador es el botón de "cancelar"; la señal es lo que escucha la operación.',
    },
    {
      pregunta: '¿Qué hace <code>AbortSignal.timeout(3000)</code>?',
      opciones: ['Espera 3 segundos', 'Crea una señal que se cancela sola a los 3 segundos', 'Cancela todo'],
      correcta: 1,
      explicacion: '<code>fetch(url, { signal: AbortSignal.timeout(3000) })</code> es un límite de tiempo en una línea.',
    },
    {
      pregunta: '¿Para qué sirve <code>AbortSignal.any([s1, s2])</code>?',
      opciones: ['Para crear una señal que se cancela cuando se cancele <b>cualquiera</b> de las dos', 'Para cancelar las dos', 'Para elegir una al azar'],
      correcta: 0,
      explicacion: 'Combina, por ejemplo, el botón "cancelar" del usuario con un límite de tiempo.',
    },
    {
      pregunta: '¿Se puede reutilizar un controlador después de llamar a <code>abort()</code>?',
      opciones: ['Sí', 'No: su señal queda cancelada para siempre; crea uno nuevo por operación'],
      correcta: 1,
      explicacion: 'Cualquier operación que reciba esa señal se cancelará enseguida.',
    },
  ],
};

export const abortOrden = {
  id: 'abort-orden',
  titulo: 'Señales y motivos',
  codigo: `const control = new AbortController();
const { signal } = control;

signal.addEventListener("abort", () => console.log("aviso:", signal.reason));

console.log("¿cancelada?", signal.aborted);
control.abort("el usuario cerró la ventana");
console.log("¿cancelada?", signal.aborted);
control.abort("otra vez");
console.log("motivo:", signal.reason);`,
  salida: ['¿cancelada? false', 'aviso: el usuario cerró la ventana', '¿cancelada? true', 'motivo: el usuario cerró la ventana'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'El evento <code>abort</code> se dispara en el momento de llamar a <code>abort()</code>, antes de la línea siguiente. Cancelar dos veces no hace nada: la señal ya estaba cancelada y conserva el primer motivo.',
};

export const abortDetective = {
  id: 'abort-detective',
  titulo: 'Un controlador reutilizado',
  codigo: `const esperar = (ms, signal) =>
  new Promise((ok, mal) => {
    if (signal.aborted) return mal(signal.reason);
    setTimeout(ok, ms);
  });

const control = new AbortController();
control.abort();

console.log("nueva búsqueda…");
await esperar(100, control.signal);
console.log("resultados");`,
  error: `nueva búsqueda…
busqueda.js:3
    if (signal.aborted) return mal(signal.reason);
                               ^

AbortError: This operation was aborted`,
  culpable: 11,
  hallazgo:
    'El controlador ya se canceló en la línea 8, por la búsqueda anterior. Su señal queda cancelada para siempre: toda operación nueva que la reciba se cancela al empezar.',
  pista: '¿En qué estado está <code>control.signal</code> cuando empieza la nueva búsqueda?',
  arreglos: [
    {
      texto: 'Crear un controlador nuevo para cada búsqueda: <code>const nuevo = new AbortController();</code> y pasar <code>nuevo.signal</code>',
      correcta: true,
      porque: 'Un controlador por operación: cancelar la búsqueda anterior no afecta a la nueva.',
    },
    {
      texto: 'Llamar otra vez a <code>control.abort()</code> antes de buscar',
      correcta: false,
      porque: 'Una señal no se puede "descancelar": sigue cancelada.',
    },
    {
      texto: 'Quitar la comprobación <code>signal.aborted</code> de <code>esperar</code>',
      correcta: false,
      porque: 'Esconde el problema: la función dejaría de respetar las cancelaciones, también las legítimas.',
    },
  ],
};

export const abortLab = {
  id: 'abort-lab',
  titulo: 'Una espera cancelable',
  inicial: `// Escribe esperar(ms, signal): devuelve una promesa que se cumple a los ms milisegundos.
// Si signal se cancela antes, rechaza con signal.reason y detiene el temporizador.
// Si signal ya estaba cancelada, rechaza enseguida.

const control = new AbortController();
setTimeout(() => control.abort(new Error("cancelado")), 30);

try {
  await esperar(500, control.signal);
  console.log("terminó");
} catch (e) {
  console.log(e.message);
}
`,
  verificaciones: [
    { texto: 'Imprime <code>cancelado</code>, a los 30 ms y no a los 500', prueba: 'return __salida.join("|") === "cancelado";' },
    { texto: 'Sin cancelación, se cumple a tiempo', prueba: 'const t = performance.now(); await esperar(40, new AbortController().signal); return performance.now() - t >= 35;' },
    { texto: 'Con una señal ya cancelada, rechaza enseguida', prueba: 'const t = performance.now(); try { await esperar(300, AbortSignal.abort(new Error("ya"))); return false; } catch (e) { return e.message === "ya" && performance.now() - t < 100; }' },
  ],
  pistas: [
    'Empieza con <code>function esperar(ms, signal) { return new Promise((ok, mal) => { … }); }</code> arriba de todo.',
    'Primero: <code>if (signal.aborted) return mal(signal.reason);</code>. Después guarda el temporizador: <code>const id = setTimeout(ok, ms);</code>',
    'Escucha la cancelación: <code>signal.addEventListener("abort", () => { clearTimeout(id); mal(signal.reason); }, { once: true });</code>',
  ] as [string, string, string],
  solucion: `function esperar(ms, signal) {
  return new Promise((ok, mal) => {
    if (signal.aborted) return mal(signal.reason);
    const id = setTimeout(ok, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(id);
      mal(signal.reason);
    }, { once: true });
  });
}

const control = new AbortController();
setTimeout(() => control.abort(new Error("cancelado")), 30);

try {
  await esperar(500, control.signal);
  console.log("terminó");
} catch (e) {
  console.log(e.message);
}`,
  explicacion:
    '<p>Es el contrato de toda función cancelable, el mismo que cumple <code>fetch</code>: comprobar si ya está cancelada, escuchar el evento <code>abort</code>, liberar lo que estaba usando (aquí, el temporizador) y rechazar con el motivo.</p>',
};

/* ── 9.9 Patrones asíncronos ─────────────────────────────── */
export const patronesAuto = {
  id: 'patrones-auto',
  titulo: 'Recetas para esperar bien',
  preguntas: [
    {
      pregunta: '¿Qué hace un <b>debounce</b>?',
      opciones: ['Ejecuta la función en cada llamada', 'Espera a que dejen de llamarla durante un tiempo, y entonces la ejecuta una sola vez', 'La ejecuta como máximo una vez por segundo'],
      correcta: 1,
      explicacion: 'Ideal para buscar mientras se escribe: solo cuando el usuario hace una pausa.',
    },
    {
      pregunta: '¿Y un <b>throttle</b>?',
      opciones: ['Lo mismo que debounce', 'Deja pasar como máximo una ejecución cada cierto tiempo, aunque la llamen sin parar', 'Cancela la función'],
      correcta: 1,
      explicacion: 'Ideal para eventos muy frecuentes, como el scroll: reaccionas regularmente sin saturar.',
    },
    {
      pregunta: '¿Por qué no funciona <code>lista.forEach(async (x) => await guardar(x))</code> para esperar a que todo se guarde?',
      opciones: ['Sí funciona', 'Porque <code>forEach</code> ignora las promesas que devuelve el callback: no espera a ninguna', 'Porque es lento'],
      correcta: 1,
      explicacion: 'Usa <code>for...of</code> con <code>await</code> (en serie) o <code>await Promise.all(lista.map(guardar))</code> (en paralelo).',
    },
    {
      pregunta: 'Al reintentar una operación que falló, ¿por qué conviene esperar cada vez más entre intentos?',
      opciones: ['Por estética', 'Para no saturar un servicio que ya tiene problemas y darle tiempo a recuperarse', 'No conviene'],
      correcta: 1,
      explicacion: 'Se llama <em>backoff exponencial</em>: 100 ms, 200, 400, 800…',
    },
  ],
};

export const patronesOrden = {
  id: 'patrones-orden',
  titulo: 'Un buscador con debounce',
  codigo: `function debounce(fn, ms) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

const buscar = debounce((texto) => console.log("busco:", texto), 50);

buscar("j");
buscar("ja");
buscar("jav");
setTimeout(() => buscar("javascript"), 100);
console.log("escribiendo…");`,
  salida: ['escribiendo…', 'busco: jav', 'busco: javascript'],
  inicio: [2, 0, 1],
  explicacion:
    'Las tres primeras llamadas llegan juntas: cada una cancela el temporizador de la anterior, así que solo sobrevive la última, <code>"jav"</code>. La de los 100 ms llega después de la pausa y busca otra vez.',
};

export const patronesDetective = {
  id: 'patrones-detective',
  titulo: 'Un forEach que no espera',
  codigo: `const cargar = (id) => new Promise((r) => setTimeout(() => r({ id, nombre: \`item \${id}\` }), 20));

const resultados = [];
[1, 2, 3].forEach(async (id) => {
  resultados.push(await cargar(id));
});

console.log(resultados[0].nombre);`,
  error: `items.js:8
console.log(resultados[0].nombre);
                          ^

TypeError: Cannot read properties of undefined (reading 'nombre')`,
  culpable: 4,
  hallazgo:
    '<code>forEach</code> llama al callback tres veces y termina enseguida: no sabe que el callback devuelve una promesa, ni espera a que se cumpla. Cuando corre la línea 8, ninguna carga terminó y <code>resultados</code> está vacío.',
  pista: '¿Qué hace <code>forEach</code> con la promesa que devuelve cada callback <code>async</code>?',
  arreglos: [
    {
      texto: '<code>const resultados = await Promise.all([1, 2, 3].map((id) => cargar(id)));</code>',
      correcta: true,
      porque: '<code>map</code> devuelve las tres promesas, que corren en paralelo, y <code>Promise.all</code> espera a todas, en orden.',
    },
    {
      texto: 'Poner <code>await</code> delante del <code>forEach</code>',
      correcta: false,
      porque: '<code>forEach</code> devuelve <code>undefined</code>, no una promesa: el <code>await</code> no espera nada.',
    },
    {
      texto: 'Mover el <code>console.log</code> a un <code>setTimeout(…, 100)</code>',
      correcta: false,
      porque: 'Funcionaría por casualidad: si alguna carga tarda más de 100 ms, vuelve a fallar. Nunca adivines tiempos.',
    },
  ],
};

export const patronesLab = {
  id: 'patrones-lab',
  titulo: 'Reintentar con espera',
  inicial: `const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Escribe reintentar(tarea, intentos): llama a tarea() (que devuelve una promesa).
// Si falla, espera 10 ms, después 20, después 40… y vuelve a intentar.
// Si falla todas las veces, rechaza con el último error.

let veces = 0;
const inestable = async () => {
  veces++;
  if (veces < 3) throw new Error(\`falló el intento \${veces}\`);
  return "¡conectado!";
};

console.log(await reintentar(inestable, 5));
console.log("intentos:", veces);
`,
  verificaciones: [
    { texto: 'Imprime <code>¡conectado!</code> y <code>intentos: 3</code>', prueba: 'return __salida.join("|") === "¡conectado!|intentos: 3";' },
    { texto: 'Si nunca funciona, rechaza con el último error tras los intentos pedidos', prueba: 'let n = 0; try { await reintentar(async () => { n++; throw new Error("e" + n); }, 3); return false; } catch (e) { return n === 3 && e.message === "e3"; }' },
    { texto: 'Espera entre intentos: tres intentos fallidos esperan 10 + 20 ms', prueba: 'const t = performance.now(); let n = 0; try { await reintentar(async () => { n++; throw new Error("x"); }, 3); } catch {} return performance.now() - t >= 25;' },
  ],
  pistas: [
    'Empieza con <code>async function reintentar(tarea, intentos) { … }</code> arriba de todo, con un <code>for</code> de 1 a <code>intentos</code>.',
    'Dentro: <code>try { return await tarea(); } catch (e) { ultimo = e; … }</code>. El <code>return</code> sale en cuanto funciona.',
    'En el <code>catch</code>, si quedan intentos: <code>await esperar(10 * 2 ** (i - 1));</code>. Después del bucle: <code>throw ultimo;</code>',
  ] as [string, string, string],
  solucion: `const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function reintentar(tarea, intentos) {
  let ultimo;
  for (let i = 1; i <= intentos; i++) {
    try {
      return await tarea();
    } catch (e) {
      ultimo = e;
      if (i < intentos) await esperar(10 * 2 ** (i - 1));
    }
  }
  throw ultimo;
}

let veces = 0;
const inestable = async () => {
  veces++;
  if (veces < 3) throw new Error(\`falló el intento \${veces}\`);
  return "¡conectado!";
};

console.log(await reintentar(inestable, 5));
console.log("intentos:", veces);`,
  explicacion:
    '<p><code>return await</code> dentro del <code>try</code> es importante: sin el <code>await</code>, el rechazo de la tarea se escaparía del <code>catch</code>. Y la espera creciente (10, 20, 40…) es el <em>backoff exponencial</em>: le da al servicio tiempo de recuperarse.</p>',
};
