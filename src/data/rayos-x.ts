// Rayos X: pizarrones listos para modificar y desafíos de refuerzo.
// Los desafíos se comprueban con los pasos que genera src/lib/rayos-x.ts (pila, consola, errores),
// así que cada regla describe algo que se ve en el pizarrón, no un test oculto.

export interface Pizarron {
  id: string;
  titulo: string;
  /** Una línea: qué mirar en este pizarrón */
  idea: string;
  /** Lección donde se explica ('seccion/tema') */
  leccion: string;
  codigo: string;
}

export type Regla =
  | { consola: string[] } // la consola muestra exactamente estas líneas (sin contar el error final)
  | { consolaIncluye: string } // alguna línea de la consola contiene este texto
  | { profundidad: number } // en algún momento hay al menos tantas funciones en la pila
  | { error: string } // termina con un error cuyo texto coincide con esta expresión regular
  | { sinError: true } // termina sin errores
  | { recuerda: true } // alguna función usa una variable recordada por un closure
  | { zona: 'api' | 'tarea' | 'micro' } // en algún momento hay algo en el runtime, en la cola de tareas o en la de microtareas
  | { pausa: true } // alguna función async queda en pausa por un await
  | { codigo: string }; // el código coincide con esta expresión regular

export interface Desafio {
  id: string;
  titulo: string;
  /** Lo que hay que lograr (HTML simple) */
  enunciado: string;
  codigo: string;
  objetivos: { texto: string; regla: Regla }[];
  pista: string;
}

export const pizarrones: Pizarron[] = [
  {
    id: 'pila',
    titulo: 'La pila de llamadas',
    idea: 'Una función llama a otra: mira cómo se apilan y desapilan.',
    leccion: 'como-se-ejecuta-js/pila-de-llamadas',
    codigo: `function saludar(nombre) {
  return \`Hola, \${nombre}!\`;
}

function mostrar() {
  const msg = saludar("Mundo");
  console.log(msg);
}

mostrar();`,
  },
  {
    id: 'recursion',
    titulo: 'Recursión',
    idea: 'La pila baja hasta el caso base y vuelve a subir resolviendo.',
    leccion: 'como-se-ejecuta-js/recursion',
    codigo: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(4));`,
  },
  {
    id: 'closure',
    titulo: 'Closures',
    idea: 'La función que devuelve crearContador recuerda su cuenta.',
    leccion: 'como-se-ejecuta-js/closures',
    codigo: `function crearContador() {
  let cuenta = 0;
  return () => ++cuenta;
}

const contar = crearContador();
contar();
console.log(contar());`,
  },
  {
    id: 'bucle',
    titulo: 'var y let en un bucle',
    idea: 'Cambia var por let y mira qué recuerda cada función.',
    leccion: 'como-se-ejecuta-js/closures',
    codigo: `const funciones = [];
for (var i = 0; i < 3; i++) {
  funciones.push(() => i);
}
console.log(funciones[0](), funciones[1](), funciones[2]());`,
  },
  {
    id: 'tdz',
    titulo: 'Zona muerta temporal',
    idea: 'Una variable de adentro tapa a la de afuera antes de existir.',
    leccion: 'como-se-ejecuta-js/contextos-y-hoisting',
    codigo: `let total = 10;

function sumarIVA() {
  console.log(total);
  let total = total * 1.21;
  return total;
}

sumarIVA();`,
  },
  {
    id: 'scope',
    titulo: 'Scope y sombreado',
    idea: 'Dos variables con el mismo nombre, cada una en su scope.',
    leccion: 'como-se-ejecuta-js/scope',
    codigo: `let color = "azul";

function pintar() {
  let color = "rojo";
  console.log("adentro:", color);
}

pintar();
console.log("afuera:", color);`,
  },
  {
    id: 'callbacks',
    titulo: 'Funciones como valores',
    idea: 'map llama a tu función una vez por elemento.',
    leccion: 'funciones/funciones-como-valores',
    codigo: `function doble(n) {
  return n * 2;
}

const dobles = [1, 2, 3].map(doble);
console.log(dobles);`,
  },
  {
    id: 'errores',
    titulo: 'Un error atrapado',
    idea: 'El error sube por la pila hasta que un catch lo atrapa.',
    leccion: 'control-de-flujo/errores-y-excepciones',
    codigo: `function dividir(a, b) {
  if (b === 0) throw new Error("No se puede dividir por cero");
  return a / b;
}

try {
  console.log(dividir(10, 2));
  console.log(dividir(1, 0));
} catch (e) {
  console.log("Atrapado:", e.message);
}`,
  },
  // Etapa 2: asincronía. El pizarrón pasa al modo event loop: pila, runtime, cola de tareas y microtareas.
  {
    id: 'temporizador',
    titulo: 'setTimeout de 0 ms',
    idea: 'El callback espera en la cola aunque el tiempo sea 0.',
    leccion: 'asincronia/event-loop',
    codigo: `console.log("1. inicio");

setTimeout(() => {
  console.log("3. temporizador");
}, 0);

console.log("2. fin");`,
  },
  {
    id: 'microtareas',
    titulo: 'Microtareas primero',
    idea: 'Una promesa cumplida se adelanta a un temporizador.',
    leccion: 'asincronia/microtareas',
    codigo: `console.log("1. síncrono");

setTimeout(() => console.log("4. tarea"), 0);

Promise.resolve().then(() => console.log("3. microtarea"));

console.log("2. síncrono");`,
  },
  {
    id: 'promesa',
    titulo: 'Una promesa y su then',
    idea: 'El then queda anotado hasta que la promesa se cumple.',
    leccion: 'asincronia/promesas',
    codigo: `const pedido = new Promise((resolver) => {
  setTimeout(() => resolver("pizza"), 100);
});

console.log("pedido hecho");

pedido.then((comida) => {
  console.log("llegó:", comida);
});`,
  },
  {
    id: 'async-await',
    titulo: 'async y await',
    idea: 'await saca la función de la pila y la retoma después.',
    leccion: 'asincronia/async-await',
    codigo: `function esperar(ms) {
  return new Promise((listo) => setTimeout(listo, ms));
}

async function preparar() {
  console.log("empiezo");
  await esperar(100);
  console.log("terminé");
  return "café";
}

preparar().then((bebida) => console.log("listo:", bebida));
console.log("mientras tanto…");`,
  },
];

export const desafios: Desafio[] = [
  {
    id: 'rx-tres-pisos',
    titulo: 'Tres pisos',
    enunciado: 'Agrega una función que <code>saludar</code> llame, para que en algún momento haya <b>tres funciones</b> en la pila a la vez.',
    codigo: pizarrones[0].codigo,
    objetivos: [
      { texto: 'La pila llega a 3 funciones a la vez', regla: { profundidad: 3 } },
      { texto: 'El programa termina sin errores', regla: { sinError: true } },
    ],
    pista: 'Dentro de <code>saludar</code>, en lugar de usar <code>nombre</code> directamente, llama a otra función: <code>return `Hola, ${mayusculas(nombre)}!`;</code> y escribe <code>mayusculas</code>.',
  },
  {
    id: 'rx-cuenta-atras',
    titulo: 'Cuenta atrás con caso base',
    enunciado: 'Escribe <code>cuentaAtras(n)</code> de forma recursiva: imprime <code>3</code>, <code>2</code>, <code>1</code> y <code>0</code>, y se detiene sola.',
    codigo: `function cuentaAtras(n) {
  // Imprime n y vuelve a llamar a cuentaAtras con n - 1,
  // pero detente cuando n sea menor que 0.
}

cuentaAtras(3);`,
    objetivos: [
      { texto: 'La consola muestra 3, 2, 1 y 0', regla: { consola: ['3', '2', '1', '0'] } },
      { texto: 'Es recursiva: la pila llega a 4 llamadas', regla: { profundidad: 4 } },
      { texto: 'Termina sin errores', regla: { sinError: true } },
    ],
    pista: 'Primero el caso base: <code>if (n &lt; 0) return;</code>. Después, <code>console.log(n);</code> y <code>cuentaAtras(n - 1);</code>.',
  },
  {
    id: 'rx-desborda',
    titulo: 'Rómpelo: desborda la pila',
    enunciado: 'Este factorial funciona. Cambia <b>una línea</b> para que la pila se desborde y el motor lance <code>RangeError: Maximum call stack size exceeded</code>.',
    codigo: pizarrones[1].codigo,
    objetivos: [{ texto: 'Termina con un desbordamiento de pila', regla: { error: 'Maximum call stack size exceeded' } }],
    pista: '¿Qué detiene la recursión? Si ese caso nunca se cumple, la función se llama sin fin.',
  },
  {
    id: 'rx-una-palabra',
    titulo: 'Una sola palabra',
    enunciado: 'Este código imprime <code>3 3 3</code>. Cambia <b>una sola palabra</b> para que imprima <code>0 1 2</code>, sin tocar el resto.',
    codigo: pizarrones[3].codigo,
    objetivos: [
      { texto: 'La consola muestra 0 1 2', regla: { consola: ['0 1 2'] } },
      { texto: 'Sigue usando el mismo bucle for y las mismas flechas', regla: { codigo: 'for \\(\\w+ i = 0; i < 3; i\\+\\+\\)[\\s\\S]*\\(\\) => i' } },
    ],
    pista: 'Con <code>var</code> hay una sola <code>i</code> para todo el bucle. ¿Qué declaración crea una variable nueva en cada vuelta?',
  },
  {
    id: 'rx-zona-muerta',
    titulo: 'Provoca la zona muerta temporal',
    enunciado: 'Este código funciona. Modifícalo para que el motor lance <code>ReferenceError: Cannot access … before initialization</code>.',
    codigo: `const precio = 100;

function conDescuento() {
  const descuento = 0.1;
  return precio * (1 - descuento);
}

console.log(conDescuento());`,
    objetivos: [{ texto: 'Termina con un error de zona muerta temporal', regla: { error: 'before initialization' } }],
    pista: 'Usa <code>descuento</code> antes de la línea donde se declara, o declara dentro de la función otra <code>precio</code> que tape a la de afuera.',
  },
  {
    id: 'rx-recuerda',
    titulo: 'Un contador que recuerda',
    enunciado: 'Escribe <code>crearContador()</code>: devuelve una función que, cada vez que la llamas, suma 1 y devuelve la cuenta. La cuenta no puede ser una variable global.',
    codigo: `// Escribe crearContador aquí


const contar = crearContador();
console.log(contar());
console.log(contar());
console.log(contar());`,
    objetivos: [
      { texto: 'La consola muestra 1, 2 y 3', regla: { consola: ['1', '2', '3'] } },
      { texto: 'La función recuerda su cuenta por un closure (se ve «recordada» en la pila)', regla: { recuerda: true } },
    ],
    pista: '<code>function crearContador() { let cuenta = 0; return () =&gt; ++cuenta; }</code>. La flecha recuerda la <code>cuenta</code> de la llamada que la creó.',
  },
  {
    id: 'rx-atrapalo',
    titulo: 'Atrapa el error',
    enunciado: 'Este programa se cae en la línea 2 y nunca imprime «fin». Usa <code>try…catch</code> para que siga funcionando y llegue al final.',
    codigo: `function leerEdad(usuario) {
  return usuario.datos.edad;
}

console.log(leerEdad({ nombre: "Ana" }));
console.log("fin");`,
    objetivos: [
      { texto: 'La consola llega a imprimir «fin»', regla: { consolaIncluye: 'fin' } },
      { texto: 'Termina sin errores sin atrapar', regla: { sinError: true } },
      { texto: 'Usa try y catch', regla: { codigo: '\\btry\\b[\\s\\S]*\\bcatch\\b' } },
    ],
    pista: 'Envuelve la llamada: <code>try { console.log(leerEdad({ nombre: "Ana" })); } catch (e) { console.log("Sin edad"); }</code>.',
  },
  {
    id: 'rx-montana',
    titulo: 'Una montaña de cinco pisos',
    enunciado: 'Haz que la gráfica de profundidad llegue a <b>5 pisos</b>, sin que la pila se desborde.',
    codigo: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(2));`,
    objetivos: [
      { texto: 'La pila llega a 5 funciones a la vez', regla: { profundidad: 5 } },
      { texto: 'Termina sin errores', regla: { sinError: true } },
    ],
    pista: 'Cada número más en <code>factorial(n)</code> es un piso más en la pila.',
  },
  {
    id: 'rx-cuela-microtarea',
    titulo: 'Cuela una microtarea',
    enunciado: 'Sin tocar el <code>setTimeout</code>, agrega código para que la consola muestre <code>inicio</code>, <code>microtarea</code> y <code>timeout</code>, en ese orden.',
    codigo: `setTimeout(() => console.log("timeout"), 0);

console.log("inicio");`,
    objetivos: [
      { texto: 'La consola muestra inicio, microtarea y timeout', regla: { consola: ['inicio', 'microtarea', 'timeout'] } },
      { texto: 'Algo pasa por la cola de microtareas', regla: { zona: 'micro' } },
      { texto: 'El setTimeout sigue ahí', regla: { codigo: 'setTimeout\\(\\s*\\(\\)\\s*=>\\s*console\\.log\\("timeout"\\)' } },
    ],
    pista: 'Una promesa cumplida corre su <code>then</code> antes que cualquier temporizador: <code>Promise.resolve().then(() =&gt; console.log("microtarea"));</code>. También sirve <code>queueMicrotask</code>.',
  },
  {
    id: 'rx-primero-temporizador',
    titulo: 'Primero el temporizador',
    enunciado: 'Este código imprime <code>promesa</code> antes que <code>temporizador</code>. Reacomódalo para que salga <b>primero el temporizador</b>, sin dejar de usar <code>setTimeout</code> ni <code>.then</code>.',
    codigo: `setTimeout(() => console.log("temporizador"), 0);

Promise.resolve().then(() => console.log("promesa"));`,
    objetivos: [
      { texto: 'La consola muestra temporizador y después promesa', regla: { consola: ['temporizador', 'promesa'] } },
      { texto: 'Sigue usando setTimeout', regla: { codigo: 'setTimeout\\(' } },
      { texto: 'Sigue usando .then', regla: { codigo: '\\.then\\(' } },
    ],
    pista: 'Las microtareas que existen cuando la pila se vacía corren antes que cualquier tarea. ¿Y si la promesa recién se crea <b>dentro</b> del callback del temporizador?',
  },
  {
    id: 'rx-esperar',
    titulo: 'Escribe esperar(ms)',
    enunciado: 'Completa <code>esperar(ms)</code>: tiene que devolver una promesa que se cumpla cuando pasen <code>ms</code> milisegundos. Así <code>await esperar(500)</code> pausa a <code>main</code> de verdad.',
    codigo: `// Devuelve una promesa que se cumple
// cuando pasan ms milisegundos.
function esperar(ms) {

}

async function main() {
  console.log("antes");
  await esperar(500);
  console.log("después");
}

main();`,
    objetivos: [
      { texto: 'La consola muestra antes y después', regla: { consola: ['antes', 'después'] } },
      { texto: 'Usa un temporizador del runtime', regla: { zona: 'api' } },
      { texto: 'main queda en pausa por el await', regla: { pausa: true } },
      { texto: 'Termina sin errores', regla: { sinError: true } },
    ],
    pista: '<code>return new Promise((listo) =&gt; setTimeout(listo, ms));</code>. El temporizador llama a <code>listo</code> cuando pasa el tiempo, y eso cumple la promesa.',
  },
  {
    id: 'rx-atrapa-rechazo',
    titulo: 'Atrapa el rechazo',
    enunciado: '<code>cargarUsuario</code> falla y la promesa queda rechazada sin que nadie la atrape. Haz que <code>main</code> atrape el error e imprima su mensaje.',
    codigo: `async function cargarUsuario() {
  throw new Error("Sin conexión");
}

async function main() {
  const usuario = await cargarUsuario();
  console.log("Hola,", usuario);
}

main();
console.log("fin");`,
    objetivos: [
      { texto: 'La consola muestra el mensaje «Sin conexión»', regla: { consolaIncluye: 'Sin conexión' } },
      { texto: 'No queda ninguna promesa rechazada sin atrapar', regla: { sinError: true } },
      { texto: 'Usa try y catch alrededor del await', regla: { codigo: '\\btry\\b[\\s\\S]*\\bawait\\b[\\s\\S]*\\bcatch\\b' } },
    ],
    pista: 'Dentro de <code>main</code>: <code>try { const usuario = await cargarUsuario(); … } catch (e) { console.log(e.message); }</code>. Un <code>await</code> convierte el rechazo en un error que <code>catch</code> puede atrapar.',
  },
];
