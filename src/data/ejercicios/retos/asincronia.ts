// Reto del motor de la sección 9: «Asincronía».

export const retoAsincAuto = {
  id: 'reto-asinc-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿En qué orden imprime?<br><code>console.log(1);</code><br><code>setTimeout(() =&gt; console.log(2), 0);</code><br><code>Promise.resolve().then(() =&gt; console.log(3));</code><br><code>console.log(4);</code>',
      opciones: ['<code>1 2 3 4</code>', '<code>1 4 2 3</code>', '<code>1 4 3 2</code>'],
      correcta: 2,
      explicacion: 'Primero todo lo síncrono: <code>1</code> y <code>4</code>. Con la pila vacía, el event loop vacía las microtareas (el <code>then</code>: <code>3</code>) y recién después toma la siguiente tarea (el <code>setTimeout</code>: <code>2</code>), aunque su espera sea de 0 ms.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>async function f() { return 5; }</code><br><code>console.log(f());</code>',
      opciones: ['<code>5</code>', '<code>Promise { 5 }</code>', '<code>undefined</code>'],
      correcta: 1,
      explicacion: 'Una función <code>async</code> siempre devuelve una promesa. Para obtener el <code>5</code> hay que esperarla: <code>await f()</code> o <code>f().then(…)</code>.',
    },
    {
      pregunta: '<code>Promise.all([pedirA(), pedirB(), pedirC()])</code>: si <code>pedirB</code> falla y las otras dos salen bien, ¿qué pasa?',
      opciones: [
        'Se cumple con los dos resultados buenos',
        'Se rechaza con el error de <code>pedirB</code>, apenas ocurre',
        'Espera a las tres y después se rechaza con un array de errores',
      ],
      correcta: 1,
      explicacion: '<code>Promise.all</code> es «todo o nada»: se rechaza con el primer error. Si quieres el resultado de cada una, salga bien o mal, usa <code>Promise.allSettled</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const ids = [1, 2, 3];</code><br><code>ids.forEach(async (id) =&gt; { await pausa(10); console.log(id); });</code><br><code>console.log("listo");</code>',
      opciones: ['<code>1 2 3 listo</code>', '<code>listo 1 2 3</code>', '<code>listo</code> y nada más'],
      correcta: 1,
      explicacion: '<code>forEach</code> no espera a las funciones <code>async</code>: las lanza a las tres y sigue. «listo» se imprime primero. Para esperar, <code>for…of</code> con <code>await</code> (en serie) o <code>Promise.all</code> con <code>map</code> (en paralelo).',
    },
    {
      pregunta: '¿Qué hace <code>controlador.abort()</code> con un <code>fetch(url, { signal: controlador.signal })</code> en curso?',
      opciones: [
        'Nada: <code>fetch</code> no se puede cancelar',
        'Rechaza la promesa del <code>fetch</code> con un <code>AbortError</code>',
        'Cumple la promesa con <code>undefined</code>',
      ],
      correcta: 1,
      explicacion: 'La señal avisa al <code>fetch</code>, que corta la petición y rechaza su promesa con un error de nombre <code>AbortError</code>. Así se distingue una cancelación de un fallo de red.',
    },
  ],
};

export const retoAsincOrden = {
  id: 'reto-asinc-orden',
  titulo: 'Dos tareas en paralelo',
  codigo: `async function tarea(nombre, ms) {
  console.log("empieza", nombre);
  await new Promise((resolver) => setTimeout(resolver, ms));
  console.log("termina", nombre);
  return nombre;
}

console.log("A");
const todas = Promise.all([tarea("lenta", 50), tarea("rápida", 10)]);
queueMicrotask(() => console.log("micro"));
todas.then((r) => console.log(r.join(",")));
console.log("B");`,
  salida: ['A', 'empieza lenta', 'empieza rápida', 'B', 'micro', 'termina rápida', 'termina lenta', 'lenta,rápida'],
  inicio: [4, 7, 1, 5, 0, 3, 6, 2],
  explicacion:
    'Una función <code>async</code> corre de forma síncrona hasta su primer <code>await</code>: por eso las dos tareas empiezan antes de «B». Después, la microtarea va antes que cualquier temporizador. La rápida termina primero, pero <code>Promise.all</code> devuelve los resultados en el orden del array, no en el de llegada.',
};

export const retoAsincDetective = {
  id: 'reto-asinc-detective',
  titulo: 'Un usuario que nunca llega',
  codigo: `async function cargarUsuario() {
  return { nombre: "Ana" };
}

async function saludar() {
  const usuario = cargarUsuario();
  console.log(usuario.nombre.toUpperCase());
}

saludar();`,
  error: `app.js:7
  console.log(usuario.nombre.toUpperCase());
                             ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')`,
  culpable: 6,
  hallazgo:
    'Falta <code>await</code>: <code>cargarUsuario()</code> devuelve una <b>promesa</b>, no el usuario. Una promesa no tiene propiedad <code>nombre</code>, así que <code>usuario.nombre</code> es <code>undefined</code>.',
  pista: '<code>cargarUsuario</code> es <code>async</code>. ¿Qué devuelve siempre una función <code>async</code>?',
  arreglos: [
    {
      texto: 'Cambiar la línea 6 por <code>const usuario = await cargarUsuario();</code>',
      correcta: true,
      porque: '<code>await</code> espera a que la promesa se cumpla y entrega su valor, el objeto con <code>nombre</code>. Se puede usar porque <code>saludar</code> también es <code>async</code>.',
    },
    {
      texto: 'Quitar <code>async</code> de <code>saludar</code>',
      correcta: false,
      porque: '<code>cargarUsuario()</code> seguiría devolviendo una promesa: el problema es no esperarla, no la función que la llama.',
    },
    {
      texto: 'Cambiar la línea 7 por <code>console.log(usuario.nombre?.toUpperCase());</code>',
      correcta: false,
      porque: 'Ya no se cae, pero imprime <code>undefined</code>: el usuario sigue sin llegar.',
    },
  ],
};

export const retoAsincLab = {
  id: 'reto-asinc-lab',
  titulo: 'Reintentar hasta que salga',
  inicial: `// Escribe reintentar(fn, intentos): llama a fn() (que devuelve una promesa).
// Si se cumple, devuelve su valor. Si se rechaza, vuelve a intentar,
// hasta "intentos" veces en total. Si todas fallan, lanza el último error.

let llamadas = 0;
function inestable() {
  llamadas++;
  return llamadas < 3 ? Promise.reject(new Error(\`falló el intento \${llamadas}\`)) : Promise.resolve("datos");
}

console.log(await reintentar(inestable, 5));
console.log(llamadas);
`,
  verificaciones: [
    { texto: 'Imprime <code>datos</code> y después <code>3</code>', prueba: 'return __salida.join("|") === "datos|3";' },
    { texto: 'Si todas fallan, se rechaza con el <b>último</b> error', prueba: 'let n = 0; try { await reintentar(() => Promise.reject(new Error("e" + ++n)), 3); return false; } catch (e) { return e.message === "e3"; }' },
    { texto: 'Llama a <code>fn</code> exactamente <code>intentos</code> veces, ni una más', prueba: 'let n = 0; try { await reintentar(() => { n++; return Promise.reject(new Error("x")); }, 4); } catch {} return n === 4;' },
    { texto: 'Si sale bien a la primera, no reintenta', prueba: 'let n = 0; const v = await reintentar(() => { n++; return Promise.resolve(7); }, 5); return v === 7 && n === 1;' },
  ],
  pistas: [
    'Hazla <code>async</code> y recorre los intentos con un bucle: <code>for (let i = 1; i &lt;= intentos; i++)</code>.',
    'Dentro, <code>try { return await fn(); } catch (e) { ultimo = e; }</code>: si sale bien, el <code>return</code> corta todo.',
    'Si el bucle termina sin haber devuelto nada, todos fallaron: <code>throw ultimo;</code>.',
  ] as [string, string, string],
  solucion: `async function reintentar(fn, intentos) {
  let ultimo;
  for (let i = 1; i <= intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      ultimo = e;
    }
  }
  throw ultimo;
}

let llamadas = 0;
function inestable() {
  llamadas++;
  return llamadas < 3 ? Promise.reject(new Error(\`falló el intento \${llamadas}\`)) : Promise.resolve("datos");
}

console.log(await reintentar(inestable, 5));
console.log(llamadas);`,
  explicacion:
    '<p>El <code>return await</code> es clave: sin <code>await</code>, el <code>try</code> devolvería la promesa sin esperarla y el <code>catch</code> nunca vería el rechazo. En un caso real se agrega una espera creciente entre intentos (<em>backoff</em>), como en la lección de patrones asíncronos.</p>',
};
