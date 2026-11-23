// Ejercicios de la sección 14: «JavaScript en el servidor».
// El código de Node.js no corre en el navegador: estas lecciones no tienen laboratorio.

/* ── 14.1 Node.js hoy ─────────────────────────────────────── */
export const nodeAuto = {
  id: 'node-auto',
  titulo: 'Lo que trae Node.js',
  preguntas: [
    {
      pregunta: '¿Para qué sirve el prefijo <code>node:</code> en <code>import fs from "node:fs"</code>?',
      opciones: ['Para nada', 'Deja claro que es un módulo propio de Node.js y no un paquete de npm con el mismo nombre', 'Lo hace más rápido'],
      correcta: 1,
      explicacion: 'Algunos módulos nuevos, como <code>node:test</code> y <code>node:sqlite</code>, solo existen con el prefijo.',
    },
    {
      pregunta: '¿Qué hace <code>node --watch servidor.js</code>?',
      opciones: ['Abre el navegador', 'Reinicia el programa cada vez que cambia uno de sus archivos', 'Muestra el uso de memoria'],
      correcta: 1,
      explicacion: 'Reemplaza a herramientas como nodemon. Y <code>--env-file=.env</code> carga variables de entorno sin librerías.',
    },
    {
      pregunta: '¿Necesitas instalar una librería para hacer peticiones HTTP en Node.js moderno?',
      opciones: ['Sí, siempre', 'No: <code>fetch</code>, <code>Request</code>, <code>Response</code>, <code>WebSocket</code> y otras APIs de la web ya vienen incluidas', 'Solo en Windows'],
      correcta: 1,
      explicacion: 'Cada vez más APIs son las mismas en el navegador y en el servidor.',
    },
    {
      pregunta: '¿Qué versiones de Node.js conviene usar en producción?',
      opciones: ['La más nueva siempre', 'Las LTS (las pares, como 22 o 24), que tienen soporte durante unos tres años', 'Cualquiera'],
      correcta: 1,
      explicacion: 'Las versiones impares duran unos meses y sirven para probar lo que viene.',
    },
  ],
};

export const nodeOrden = {
  id: 'node-orden',
  titulo: 'Argumentos de la línea de comandos',
  codigo: `import { parseArgs } from "node:util";

// Lo mismo que: node saludo.js --nombre Ana -v extra
const { values, positionals } = parseArgs({
  args: ["--nombre", "Ana", "-v", "extra"],
  options: {
    nombre: { type: "string" },
    verboso: { type: "boolean", short: "v" },
  },
  allowPositionals: true,
});

console.log(values.nombre);
console.log(values.verboso);
console.log(positionals.join());
console.log(typeof process.argv[0]);`,
  salida: ['Ana', 'true', 'extra', 'string'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>parseArgs</code> (de <code>node:util</code>) interpreta los argumentos: <code>--nombre</code> lleva un valor, <code>-v</code> es el atajo de <code>verboso</code>, y lo que sobra queda en <code>positionals</code>. Sin <code>args</code>, lee <code>process.argv</code>, cuyo primer elemento es la ruta del ejecutable de Node.',
};

export const nodeDetective = {
  id: 'node-detective',
  titulo: 'Una variable que ya no existe',
  codigo: `// servidor.mjs
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const datos = await readFile(join(__dirname, "datos.json"), "utf8");`,
  error: `file:///proyecto/servidor.mjs:5
const datos = await readFile(join(__dirname, "datos.json"), "utf8");
                                  ^

ReferenceError: __dirname is not defined in ES module scope`,
  culpable: 5,
  hallazgo:
    '<code>__dirname</code> y <code>__filename</code> son de CommonJS. En un módulo ESM no existen: su lugar lo ocupa <code>import.meta</code>.',
  pista: 'El mensaje dice <em>in ES module scope</em>. ¿Cómo se obtiene la carpeta del archivo actual en ESM?',
  arreglos: [
    {
      texto: 'Usar <code>import.meta.dirname</code>',
      correcta: true,
      porque: 'Desde Node 20.11, <code>import.meta.dirname</code> y <code>import.meta.filename</code> reemplazan a las variables de CommonJS.',
    },
    {
      texto: 'Usar <code>process.cwd()</code>',
      correcta: false,
      porque: 'Da la carpeta desde donde se <b>ejecutó</b> el comando, no la del archivo: falla si arrancas el programa desde otra carpeta.',
    },
    {
      texto: 'Declarar <code>const __dirname = ".";</code>',
      correcta: false,
      porque: 'Es una ruta relativa al directorio de trabajo: el mismo problema que <code>process.cwd()</code>.',
    },
  ],
};

/* ── 14.2 El event loop de Node ──────────────────────────── */
export const loopNodeAuto = {
  id: 'loop-node-auto',
  titulo: 'Fases y colas',
  preguntas: [
    {
      pregunta: '¿Quién hace el trabajo de entrada y salida (archivos, red) en Node.js?',
      opciones: ['El hilo de JavaScript', 'libuv: la red con el sistema operativo y los archivos con un grupo de hilos auxiliares', 'El navegador'],
      correcta: 1,
      explicacion: 'Tu código sigue en un solo hilo; libuv avisa cuando cada operación termina.',
    },
    {
      pregunta: '¿Qué corre antes: un callback de <code>process.nextTick</code> o el <code>then</code> de una promesa?',
      opciones: ['La promesa', '<code>process.nextTick</code>: su cola se vacía antes que la de microtareas', 'Depende'],
      correcta: 1,
      explicacion: 'Las dos corren apenas termina el código actual, pero <code>nextTick</code> tiene prioridad.',
    },
    {
      pregunta: 'Dentro del callback de una lectura de archivo, ¿qué corre primero, <code>setImmediate</code> o <code>setTimeout(…, 0)</code>?',
      opciones: ['<code>setTimeout</code>', '<code>setImmediate</code>: la fase check viene justo después de la fase poll', 'Al azar'],
      correcta: 1,
      explicacion: 'Desde el programa principal, en cambio, el orden entre los dos no está garantizado.',
    },
    {
      pregunta: '¿Por qué un servidor no debe usar <code>fs.readFileSync</code> al atender cada petición?',
      opciones: ['Porque no existe', 'Porque bloquea el único hilo: mientras lee, no atiende a nadie más', 'Porque es más lento de escribir'],
      correcta: 1,
      explicacion: 'Las versiones síncronas están bien al arrancar el programa, no en el camino de cada petición.',
    },
  ],
};

export const loopNodeOrden = {
  id: 'loop-node-orden',
  titulo: 'nextTick, promesas e immediate',
  codigo: `// orden.cjs: un archivo CommonJS
setImmediate(() => console.log("immediate"));

Promise.resolve().then(() => console.log("promesa"));
process.nextTick(() => console.log("nextTick"));

queueMicrotask(() => {
  console.log("microtarea");
  process.nextTick(() => console.log("nextTick desde una microtarea"));
});

console.log("síncrono");`,
  salida: ['síncrono', 'nextTick', 'promesa', 'microtarea', 'nextTick desde una microtarea', 'immediate'],
  inicio: [4, 2, 0, 5, 3, 1],
  explicacion:
    'Primero lo síncrono. Después la cola de <code>nextTick</code>, y después las microtareas, en orden. Un <code>nextTick</code> agregado desde una microtarea corre cuando esta termina, antes de pasar a las fases del event loop. <code>setImmediate</code> espera a la fase check. (Ojo: en un módulo ESM, todo el archivo se evalúa dentro de una microtarea, y ahí la promesa sale antes que el <code>nextTick</code>.)',
};

export const loopNodeDetective = {
  id: 'loop-node-detective',
  titulo: 'Un rechazo que tumba el servidor',
  codigo: `async function consultarStock() {
  const res = await fetch("http://inventario.interno/stock");
  if (!res.ok) throw new Error("falló la consulta de stock");
  return res.json();
}

setInterval(() => {
  consultarStock();
}, 60_000);`,
  error: `node:internal/process/promises:394
    triggerUncaughtException(err, true /* fromPromise */);
    ^

Error: falló la consulta de stock
    at consultarStock (file:///proyecto/stock.mjs:3:22)

Node.js v24.11.0`,
  culpable: 8,
  hallazgo:
    'Nadie espera ni atrapa la promesa de <code>consultarStock()</code>. Cuando se rechaza, es un rechazo no manejado, y Node.js termina el proceso entero, con todo lo que estuviera atendiendo.',
  pista: 'El error salta dentro de <code>consultarStock</code>, pero ¿quién maneja su promesa cuando se llama?',
  arreglos: [
    {
      texto: 'Manejar el rechazo: <code>consultarStock().catch((e) => console.error("stock:", e.message));</code>',
      correcta: true,
      porque: 'Un fallo pasajero del inventario queda registrado, y el servidor sigue funcionando para el próximo intento.',
    },
    {
      texto: 'Poner un <code>try/catch</code> alrededor de <code>setInterval</code>',
      correcta: false,
      porque: 'El <code>try</code> termina al programar el intervalo; el rechazo llega un minuto después, en otra vuelta del event loop.',
    },
    {
      texto: 'Escuchar <code>process.on("unhandledRejection", () => {})</code> y no hacer nada',
      correcta: false,
      porque: 'Evita que el proceso termine, pero esconde todos los errores sin manejar, de este y de cualquier otro lugar.',
    },
  ],
};

/* ── 14.3 Archivos y streams ─────────────────────────────── */
export const archivosAuto = {
  id: 'archivos-auto',
  titulo: 'Leer y escribir sin bloquear',
  preguntas: [
    {
      pregunta: '¿Qué módulo conviene para trabajar con archivos en código moderno?',
      opciones: ['<code>node:fs</code> con callbacks', '<code>node:fs/promises</code>, que devuelve promesas y se usa con <code>await</code>', 'Ninguno'],
      correcta: 1,
      explicacion: 'Las versiones <code>…Sync</code> existen, pero bloquean el hilo: úsalas solo en scripts simples o al arrancar.',
    },
    {
      pregunta: '¿Por qué usar <code>path.join</code> en lugar de concatenar rutas con <code>"/"</code>?',
      opciones: ['Por estilo', 'Porque usa el separador de cada sistema operativo y normaliza <code>..</code> y barras repetidas', 'Porque es más corto'],
      correcta: 1,
      explicacion: 'Windows usa <code>\\</code>; <code>path</code> lo resuelve por ti.',
    },
    {
      pregunta: '¿Cuándo conviene un <b>stream</b> en lugar de <code>readFile</code>?',
      opciones: ['Nunca', 'Con archivos grandes: se procesan por partes, sin cargarlos enteros en memoria', 'Con archivos pequeños'],
      correcta: 1,
      explicacion: 'Un archivo de 10 GB no cabe en memoria, pero se puede recorrer por partes.',
    },
    {
      pregunta: '¿Qué ventaja tiene <code>pipeline</code> sobre <code>origen.pipe(destino)</code>?',
      opciones: ['Ninguna', 'Propaga los errores y cierra todos los streams si alguno falla, y devuelve una promesa', 'Es más rápido'],
      correcta: 1,
      explicacion: 'Con <code>pipe</code>, un error en el medio puede dejar archivos abiertos y fugas de memoria.',
    },
  ],
};

export const archivosOrden = {
  id: 'archivos-orden',
  titulo: 'Rutas',
  codigo: `import path from "node:path";

console.log(path.join("/datos", "../config", "app.json"));
console.log(path.basename("/fotos/viaje.jpg", ".jpg"));
console.log(path.extname("informe.final.pdf"));
console.log(path.resolve("/proyecto", "src", "./index.js"));`,
  salida: ['/config/app.json', 'viaje', '.pdf', '/proyecto/src/index.js'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>join</code> une y normaliza: el <code>..</code> sale de <code>/datos</code>. <code>basename</code> da el nombre del archivo, sin la extensión si se la pasas. <code>extname</code> da solo la última extensión. <code>resolve</code> arma una ruta absoluta. (Ejemplo con rutas de Linux y macOS.)',
};

export const archivosDetective = {
  id: 'archivos-detective',
  titulo: 'Un archivo que está ahí',
  codigo: `// /proyecto/scripts/importar.mjs
import { readFile } from "node:fs/promises";

const datos = JSON.parse(await readFile("datos.json", "utf8"));
console.log(datos.length);

// La terminal está en /proyecto y se ejecuta: node scripts/importar.mjs
// datos.json está en /proyecto/scripts/, junto al script`,
  error: `node:internal/fs/promises:639
  return new FileHandle(await binding.openFileHandle(path, flags, mode, kUsePromises));
                                      ^

Error: ENOENT: no such file or directory, open 'datos.json'
    at async open (node:internal/fs/promises:639:25)
    at async readFile (node:internal/fs/promises:1242:14)
    at async file:///proyecto/scripts/importar.mjs:4:25 {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: 'datos.json'
}`,
  culpable: 4,
  hallazgo:
    'Una ruta relativa se resuelve desde el <b>directorio de trabajo</b> (donde está la terminal, <code>/proyecto</code>), no desde el archivo del script. Node.js busca <code>/proyecto/datos.json</code>, que no existe.',
  pista: 'El archivo existe junto al script. ¿Desde qué carpeta se resuelve <code>"datos.json"</code>?',
  arreglos: [
    {
      texto: 'Armar la ruta desde el script: <code>path.join(import.meta.dirname, "datos.json")</code>',
      correcta: true,
      porque: 'Así funciona sin importar desde dónde se ejecute el programa. También vale <code>new URL("./datos.json", import.meta.url)</code>.',
    },
    {
      texto: 'Pedir que siempre se ejecute desde <code>scripts/</code>',
      correcta: false,
      porque: 'Funciona hasta que alguien lo ejecute desde otra carpeta, o lo llame otro script.',
    },
    {
      texto: 'Usar <code>readFileSync</code>',
      correcta: false,
      porque: 'Resuelve la ruta igual: el mismo error, y además bloquea.',
    },
  ],
};

/* ── 14.4 Un servidor HTTP desde cero ────────────────────── */
export const httpAuto = {
  id: 'http-auto',
  titulo: 'Peticiones y respuestas',
  preguntas: [
    {
      pregunta: '¿Qué recibe la función de <code>http.createServer((req, res) => …)</code>?',
      opciones: ['Solo la URL', 'La petición (método, URL, encabezados, cuerpo) y un objeto para escribir la respuesta', 'Una promesa'],
      correcta: 1,
      explicacion: 'Se llama una vez por cada petición que llega.',
    },
    {
      pregunta: '¿Cómo se lee el cuerpo de una petición POST con <code>node:http</code>?',
      opciones: ['<code>req.body</code>', 'Recorriendo <code>req</code>, que es un stream: <code>for await (const parte of req)</code>', 'No se puede'],
      correcta: 1,
      explicacion: '<code>req.body</code> lo agregan los frameworks; con <code>node:http</code> lo armas tú.',
    },
    {
      pregunta: '¿Qué código de estado corresponde a "creado"?',
      opciones: ['200', '201', '404'],
      correcta: 1,
      explicacion: '2xx: éxito. 3xx: redirección. 4xx: error del cliente (400, 401, 403, 404). 5xx: error del servidor.',
    },
    {
      pregunta: '¿Por qué existen frameworks como Hono, Fastify o Express?',
      opciones: ['Porque Node.js no puede hacer servidores', 'Para resolver lo repetitivo: rutas con parámetros, leer JSON, middlewares, validación, errores', 'Por velocidad solamente'],
      correcta: 1,
      explicacion: 'Entender <code>node:http</code> te ayuda a saber qué hacen por debajo.',
    },
  ],
};

export const httpOrden = {
  id: 'http-orden',
  titulo: 'La vida de una petición',
  codigo: `import http from "node:http";

const servidor = http.createServer(async (req, res) => {
  console.log("llegó", req.method, req.url);
  let cuerpo = "";
  for await (const parte of req) cuerpo += parte;
  console.log("cuerpo:", cuerpo);
  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ creado: true }));
  console.log("respondido");
});

servidor.listen(3000, () => console.log("escuchando en 3000"));

// Desde otra terminal: curl -X POST -d "té" http://localhost:3000/pedidos`,
  salida: ['escuchando en 3000', 'llegó POST /pedidos', 'cuerpo: té', 'respondido'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'El servidor avisa cuando empieza a escuchar. Cada petición llama a la función: primero se conocen el método y la URL, después se termina de recibir el cuerpo (un stream), y al final se escribe la respuesta.',
};

export const httpDetective = {
  id: 'http-detective',
  titulo: 'Dos respuestas para una petición',
  codigo: `import http from "node:http";

http.createServer((req, res) => {
  if (req.url === "/salud") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  }
  res.writeHead(404);
  res.end("no encontrado");
}).listen(3000);`,
  error: `node:_http_outgoing:699
    throw new ERR_HTTP_HEADERS_SENT('set');
    ^

Error [ERR_HTTP_HEADERS_SENT]: Cannot write headers after they are sent to the client
    at ServerResponse.writeHead (node:_http_server:345:11)
    at Server.<anonymous> (file:///proyecto/servidor.mjs:8:7) {
  code: 'ERR_HTTP_HEADERS_SENT'
}`,
  culpable: 6,
  hallazgo:
    'Para <code>/salud</code>, el servidor responde... y sigue: no hay <code>return</code>, así que después intenta escribir otra respuesta, un 404. Una petición tiene una sola respuesta.',
  pista: 'Cuando la URL es <code>/salud</code>, ¿qué líneas se ejecutan después de <code>res.end("ok")</code>?',
  arreglos: [
    {
      texto: 'Agregar <code>return;</code> después de <code>res.end("ok")</code>',
      correcta: true,
      porque: 'Cada rama que responde termina ahí. Los frameworks hacen esto más difícil de olvidar: el manejador <b>devuelve</b> la respuesta.',
    },
    {
      texto: 'Quitar el <code>res.writeHead(404)</code>',
      correcta: false,
      porque: '<code>res.end</code> también falla después de haber terminado: el mismo problema con otro mensaje.',
    },
    {
      texto: 'Envolver todo en <code>try/catch</code>',
      correcta: false,
      porque: 'Esconde el error, pero cada petición a <code>/salud</code> sigue intentando responder dos veces.',
    },
  ],
};

/* ── 14.5 Procesos e hilos ───────────────────────────────── */
export const procesosAuto = {
  id: 'procesos-auto',
  titulo: 'Más de un proceso, más de un hilo',
  preguntas: [
    {
      pregunta: '¿Para qué sirve <code>node:child_process</code>?',
      opciones: ['Para crear hilos', 'Para ejecutar otros programas (git, ffmpeg, un script de Python) y comunicarte con ellos', 'Para nada'],
      correcta: 1,
      explicacion: '<code>execFile</code> para comandos cortos, <code>spawn</code> para procesos largos o con mucha salida.',
    },
    {
      pregunta: '¿Por qué <code>exec("convert " + nombreDeArchivo)</code> es peligroso?',
      opciones: ['Es lento', 'Pasa por una terminal: un nombre como <code>"a.jpg; rm -rf ~"</code> ejecutaría otro comando (inyección)', 'No es peligroso'],
      correcta: 1,
      explicacion: '<code>execFile</code> y <code>spawn</code> reciben los argumentos en un array, sin terminal de por medio.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>worker_threads</code> y <code>child_process</code>?',
      opciones: ['Ninguna', 'Los workers son hilos dentro del mismo proceso de Node.js, para cálculos pesados en JavaScript; los procesos hijos son programas aparte', 'Los workers son más lentos'],
      correcta: 1,
      explicacion: 'Como los Web Workers del navegador: se comunican por mensajes.',
    },
    {
      pregunta: '¿Qué es <code>process.env</code>?',
      opciones: ['Un archivo', 'Las variables de entorno del proceso: configuración y secretos que no van en el código', 'La versión de Node.js'],
      correcta: 1,
      explicacion: 'Con <code>node --env-file=.env</code> se cargan desde un archivo, que nunca se sube al repositorio.',
    },
  ],
};

export const procesosOrden = {
  id: 'procesos-orden',
  titulo: 'Un hilo que trabaja aparte',
  codigo: `// principal.mjs
import { Worker } from "node:worker_threads";

console.log("principal: lanzo el worker");
const w = new Worker(new URL("./calculo.mjs", import.meta.url), { workerData: 10 });
w.on("message", (r) => console.log("principal: recibí", r));
w.on("exit", () => console.log("principal: el worker terminó"));
console.log("principal: sigo libre");

// calculo.mjs
import { parentPort, workerData } from "node:worker_threads";
parentPort.postMessage(workerData * 2);`,
  salida: ['principal: lanzo el worker', 'principal: sigo libre', 'principal: recibí 20', 'principal: el worker terminó'],
  inicio: [1, 3, 0, 2],
  explicacion:
    'Crear el worker no detiene al hilo principal, que sigue con la línea siguiente. El worker arranca en paralelo, envía su resultado y, como no le queda nada por hacer, termina.',
};

export const procesosDetective = {
  id: 'procesos-detective',
  titulo: 'Un programa que no se encuentra',
  codigo: `import { spawn } from "node:child_process";

const proceso = spawn("ffmpeg", ["-i", "video.mp4", "audio.mp3"]);

proceso.on("close", (codigo) => console.log("terminó con código", codigo));`,
  error: `node:events:502
      throw er; // Unhandled 'error' event
      ^

Error: spawn ffmpeg ENOENT
    at ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'spawn ffmpeg',
  path: 'ffmpeg',
  spawnargs: [ '-i', 'video.mp4', 'audio.mp3' ]
}`,
  culpable: 3,
  hallazgo:
    '<code>ENOENT</code> en un <code>spawn</code> significa que no se encontró el <b>programa</b>: <code>ffmpeg</code> no está instalado o no está en el <code>PATH</code>. Y como nadie escuchó el evento <code>error</code>, el proceso de Node.js terminó.',
  pista: 'El error es de <code>spawn ffmpeg</code>, no de <code>video.mp4</code>. ¿Qué es lo que no existe?',
  arreglos: [
    {
      texto: 'Instalar ffmpeg (o pasar su ruta completa) y escuchar <code>proceso.on("error", …)</code> para avisar si falta',
      correcta: true,
      porque: 'El evento <code>error</code> de un proceso hijo tiene que manejarse siempre: así el programa puede explicar qué falta en lugar de caerse.',
    },
    {
      texto: 'Agregar <code>{ shell: true }</code>',
      correcta: false,
      porque: 'Con una terminal de por medio, el comando sigue sin existir, y además abres la puerta a la inyección de comandos.',
    },
    {
      texto: 'Cambiar <code>video.mp4</code> por su ruta completa',
      correcta: false,
      porque: 'El que no se encuentra es el programa, no el video.',
    },
  ],
};

/* ── 14.6 Deno y Bun ─────────────────────────────────────── */
export const runtimesAuto = {
  id: 'runtimes-auto',
  titulo: 'Otros runtimes',
  preguntas: [
    {
      pregunta: '¿Qué distingue a Deno en seguridad?',
      opciones: ['Nada', 'Por defecto un programa no puede leer archivos, usar la red ni ver variables de entorno: hay que darle permisos', 'Que no tiene red'],
      correcta: 1,
      explicacion: 'Con <code>--allow-read</code>, <code>--allow-net</code> y compañía, con el mínimo necesario.',
    },
    {
      pregunta: '¿Qué ofrece Bun, además de ejecutar JavaScript?',
      opciones: ['Nada más', 'Gestor de paquetes, empaquetador y ejecutor de pruebas en un solo programa, muy rápidos', 'Un navegador'],
      correcta: 1,
      explicacion: 'Está escrito en Zig, usa el motor JavaScriptCore y apunta a ser compatible con Node.js.',
    },
    {
      pregunta: '¿Pueden Deno y Bun usar paquetes de npm?',
      opciones: ['No', 'Sí: los dos son compatibles con la mayoría de los paquetes de npm y de los módulos de Node.js', 'Solo Bun'],
      correcta: 1,
      explicacion: 'Deno los importa con el prefijo <code>npm:</code> o desde un <code>package.json</code>.',
    },
    {
      pregunta: '¿Qué tienen en común Deno, Bun, Node.js y las plataformas como Cloudflare Workers?',
      opciones: ['Nada', 'Cada vez más APIs de la web: <code>fetch</code>, <code>Request</code>, <code>Response</code>, <code>URL</code>, streams…, que el grupo WinterTC estandariza', 'El mismo motor'],
      correcta: 1,
      explicacion: 'Un manejador que recibe un <code>Request</code> y devuelve un <code>Response</code> funciona en casi todos.',
    },
  ],
};

export const runtimesOrden = {
  id: 'runtimes-orden',
  titulo: 'Un manejador para todos',
  codigo: `// El mismo manejador sirve para Deno.serve, Bun.serve, Cloudflare Workers y Hono
async function manejar(req) {
  const url = new URL(req.url);
  if (url.pathname === "/hola") {
    return new Response(\`Hola, \${url.searchParams.get("nombre") ?? "mundo"}\`);
  }
  return new Response("no encontrado", { status: 404 });
}

const r1 = await manejar(new Request("http://localhost/hola?nombre=Ana"));
console.log(r1.status, await r1.text());
console.log(r1.headers.get("content-type"));

const r2 = await manejar(new Request("http://localhost/otra"));
console.log(r2.status, await r2.text());`,
  salida: ['200 Hola, Ana', 'text/plain;charset=UTF-8', '404 no encontrado'],
  inicio: [2, 0, 1],
  explicacion:
    'El manejador solo usa APIs de la web, así que se puede probar llamándolo directamente, sin servidor. Una respuesta creada con un texto lleva su tipo por defecto.',
};

export const runtimesDetective = {
  id: 'runtimes-detective',
  titulo: 'Sin permiso para leer',
  codigo: `// informe.ts
const datos = JSON.parse(await Deno.readTextFile("./datos.json"));
console.log(\`\${datos.length} registros\`);

// Se ejecuta con: deno run informe.ts`,
  error: `error: Uncaught (in promise) NotCapable: Requires read access to "./datos.json", run again with the --allow-read flag
const datos = JSON.parse(await Deno.readTextFile("./datos.json"));
                                    ^
    at Object.readTextFile (ext:deno_fs/30_fs.js:779:24)
    at file:///proyecto/informe.ts:2:37`,
  culpable: 5,
  hallazgo:
    'El código está bien: lo que falta es el <b>permiso</b>. Deno no deja leer archivos si no se lo pides al ejecutar el programa.',
  pista: 'El propio mensaje dice qué agregar. ¿Dónde se da ese permiso?',
  arreglos: [
    {
      texto: 'Ejecutar con el permiso justo: <code>deno run --allow-read=./datos.json informe.ts</code>',
      correcta: true,
      porque: 'Solo puede leer ese archivo. Si alguna dependencia intentara leer otra cosa, o conectarse a la red, Deno lo impediría.',
    },
    {
      texto: 'Ejecutar con <code>deno run -A informe.ts</code>',
      correcta: false,
      porque: 'Funciona, pero <code>-A</code> da todos los permisos: pierdes justo la protección que distingue a Deno.',
    },
    {
      texto: 'Cambiarlo por <code>fetch("./datos.json")</code>',
      correcta: false,
      porque: 'Leer un archivo local con <code>fetch</code> también necesita permiso de lectura.',
    },
  ],
};

/* ── 14.7 Seguridad en Node ──────────────────────────────── */
export const segNodeAuto = {
  id: 'seg-node-auto',
  titulo: 'Proteger el servidor',
  preguntas: [
    {
      pregunta: '¿Qué hace el modelo de permisos de Node.js (<code>node --permission</code>)?',
      opciones: ['Cifra el código', 'Restringe lo que el programa puede hacer: leer o escribir archivos, crear procesos, usar workers…, salvo lo que permitas', 'Pide contraseña'],
      correcta: 1,
      explicacion: 'Por ejemplo, <code>--allow-fs-read=./datos</code>. Limita el daño si una dependencia es maliciosa.',
    },
    {
      pregunta: '¿Dónde van las claves de una API o la contraseña de la base de datos?',
      opciones: ['En el código', 'En variables de entorno, fuera del repositorio (por ejemplo, un <code>.env</code> en el <code>.gitignore</code>)', 'En un comentario'],
      correcta: 1,
      explicacion: 'Un secreto que llegó al historial de Git hay que darlo por filtrado y cambiarlo.',
    },
    {
      pregunta: '¿Qué es un ataque de <em>path traversal</em>?',
      opciones: ['Un ataque de red', 'Usar <code>../</code> en una ruta pedida por el usuario para leer archivos fuera de la carpeta permitida', 'Un error de sintaxis'],
      correcta: 1,
      explicacion: 'Pedir <code>/archivos/../../.env</code>, por ejemplo. Hay que resolver la ruta y comprobar que siga dentro de la carpeta.',
    },
    {
      pregunta: '¿Qué ayuda a protegerse de dependencias maliciosas?',
      opciones: ['Nada', 'Lockfiles, revisar lo que se instala, <code>npm audit</code>, pocas dependencias y no ejecutar scripts de instalación sin necesidad', 'Instalar más paquetes'],
      correcta: 1,
      explicacion: 'Los ataques a la cadena de suministro (paquetes comprometidos) son de los más comunes hoy.',
    },
  ],
};

export const segNodeOrden = {
  id: 'seg-node-orden',
  titulo: 'Rutas que intentan escapar',
  codigo: `function rutaSegura(pedido) {
  const url = new URL(pedido, "http://x/publico/");
  return url.pathname.startsWith("/publico/") ? url.pathname : \`bloqueado (\${url.pathname})\`;
}

console.log(rutaSegura("logo.png"));
console.log(rutaSegura("../secreto.env"));
console.log(rutaSegura("img/../../etc/passwd"));
console.log(rutaSegura("%2e%2e/%2e%2e/clave.pem"));`,
  salida: ['/publico/logo.png', 'bloqueado (/secreto.env)', 'bloqueado (/etc/passwd)', 'bloqueado (/clave.pem)'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'La regla: primero <b>resolver</b> la ruta (los <code>..</code>, incluso escritos como <code>%2e%2e</code>) y después comprobar que siga dentro de la carpeta permitida. Comprobar el texto antes de resolverlo, buscando <code>".."</code>, es fácil de burlar.',
};

export const segNodeDetective = {
  id: 'seg-node-detective',
  titulo: 'Un permiso que falta',
  codigo: `// Se ejecuta con: node --permission --allow-fs-read=./publico app.mjs
import { readFile } from "node:fs/promises";

const config = JSON.parse(await readFile("./config.json", "utf8"));`,
  error: `node:internal/fs/promises:639
  return new FileHandle(await binding.openFileHandle(path, flags, mode, kUsePromises));
                                      ^

Error: Access to this API has been restricted. Use --allow-fs-read to manage permissions.
    at async readFile (node:internal/fs/promises:1242:14) {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/proyecto/config.json'
}`,
  culpable: 1,
  hallazgo:
    'El modelo de permisos está activo y solo permite leer <code>./publico</code>. <code>config.json</code> está fuera de esa carpeta, así que la lectura se bloquea. Es justo lo que tiene que pasar: el comando no lo permitió.',
  pista: 'El error dice qué recurso y qué permiso. ¿Cuáles se dieron al ejecutar?',
  arreglos: [
    {
      texto: 'Permitir también ese archivo: <code>--allow-fs-read=./publico --allow-fs-read=./config.json</code>',
      correcta: true,
      porque: 'Cada permiso se da por separado y con el alcance mínimo. Si mañana una dependencia intenta leer <code>.env</code>, seguirá bloqueada.',
    },
    {
      texto: 'Quitar <code>--permission</code>',
      correcta: false,
      porque: 'Funciona, pero desactiva todas las restricciones: el programa podría leer cualquier archivo del sistema.',
    },
    {
      texto: 'Usar <code>readFileSync</code>',
      correcta: false,
      porque: 'Los permisos aplican a todas las formas de leer archivos: el mismo error.',
    },
  ],
};

/* ── 14.5 Bases de datos con node:sqlite ─────────────────── */
export const sqliteAuto = {
  id: 'sqlite-auto',
  titulo: 'Datos que se guardan de verdad',
  preguntas: [
    {
      pregunta: 'Una persona escribe su nombre en un buscador. ¿Cómo lo usas en la consulta?',
      opciones: ['Pegándolo en el SQL con un template literal', 'Como parámetro: <code>db.prepare("… WHERE nombre = ?").all(nombre)</code>', 'Quitándole las comillas antes de pegarlo'],
      correcta: 1,
      explicacion: 'Con parámetros, el valor nunca se mezcla con el SQL. Pegarlo abre la puerta a la inyección de SQL, y "limpiarlo" a mano siempre deja algún hueco.',
    },
    {
      pregunta: '¿Qué devuelve <code>consulta.get(…)</code> si ninguna fila cumple la condición?',
      opciones: ['Un error', '<code>undefined</code>', 'Un array vacío'],
      correcta: 1,
      explicacion: '<code>get</code> devuelve la primera fila o <code>undefined</code>. <code>all</code>, en cambio, devuelve siempre un array, que puede estar vacío.',
    },
    {
      pregunta: 'Después de un <code>INSERT</code>, ¿cómo sabes qué id recibió la fila nueva?',
      opciones: ['Con otra consulta <code>SELECT MAX(id)</code>', 'Con el <code>lastInsertRowid</code> que devuelve <code>run()</code>', 'No se puede saber'],
      correcta: 1,
      explicacion: '<code>run()</code> devuelve <code>{ changes, lastInsertRowid }</code>: cuántas filas cambiaron y el id de la última insertada.',
    },
    {
      pregunta: 'Tienes que descontar de una cuenta y sumar en otra. ¿Por qué usar una transacción?',
      opciones: ['Para que sea más legible', 'Para que se guarden los dos cambios o ninguno: si el segundo falla, <code>ROLLBACK</code> deshace el primero', 'Porque SQLite lo exige'],
      correcta: 1,
      explicacion: '<code>BEGIN</code>, los cambios, y <code>COMMIT</code> si todo salió bien o <code>ROLLBACK</code> si algo falló.',
    },
  ],
};

export const sqliteOrden = {
  id: 'sqlite-orden',
  titulo: 'Una tabla de notas',
  codigo: `import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(":memory:");
db.exec("CREATE TABLE notas (id INTEGER PRIMARY KEY, texto TEXT NOT NULL)");

const insertar = db.prepare("INSERT INTO notas (texto) VALUES (?)");
console.log(insertar.run("uno").lastInsertRowid);
insertar.run("dos");
insertar.run("tres");

console.log(db.prepare("SELECT COUNT(*) AS total FROM notas").get().total);
console.log(db.prepare("SELECT texto FROM notas WHERE id = ?").get(5));
console.log(db.prepare("SELECT texto FROM notas ORDER BY id DESC").get().texto);
console.log(db.prepare("DELETE FROM notas WHERE id > ?").run(1).changes);`,
  salida: ['1', '3', 'undefined', 'tres', '2'],
  inicio: [3, 0, 4, 1, 2],
  explicacion:
    'La primera fila recibe el id 1. Después hay tres notas, ninguna con id 5 (<code>get</code> devuelve <code>undefined</code>), y ordenadas de mayor a menor la primera es "tres". El <code>DELETE</code> borra las de id mayor que 1: <code>changes</code> dice que fueron 2.',
};

export const sqliteDetective = {
  id: 'sqlite-detective',
  titulo: 'Una tabla que no existe',
  codigo: `import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("tienda.db");
db.exec("CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY, nombre TEXT, precio REAL)");

const baratos = db.prepare("SELECT * FROM producto WHERE precio < ?");
console.log(baratos.all(100));`,
  error: `Error: no such table: producto
    at file:///tienda.js:6:19 {
  code: 'ERR_SQLITE_ERROR',
  errcode: 1,
  errstr: 'SQL logic error'
}`,
  culpable: 6,
  hallazgo:
    'La tabla se llama <code>productos</code>, en plural, y la consulta busca <code>producto</code>. SQLite revisa la consulta al prepararla, por eso el error salta en <code>prepare</code>, antes de ejecutarla.',
  pista: 'Compara el nombre de la tabla en el <code>CREATE TABLE</code> con el de la consulta.',
  arreglos: [
    {
      texto: 'Usar el nombre real: <code>SELECT * FROM productos WHERE precio &lt; ?</code>',
      correcta: true,
      porque: 'Con el nombre correcto, la consulta se prepara y devuelve los productos de menos de 100.',
    },
    {
      texto: 'Agregar <code>CREATE TABLE IF NOT EXISTS producto (…)</code>',
      correcta: false,
      porque: 'El error desaparece, pero ahora hay dos tablas: la consulta lee una vacía y devuelve <code>[]</code>, mientras los productos siguen en la otra.',
    },
    {
      texto: 'Envolver la consulta en un <code>try/catch</code> que devuelva <code>[]</code>',
      correcta: false,
      porque: 'Esconde el error: la búsqueda nunca va a encontrar nada y no sabrás por qué.',
    },
  ],
};

/* ── 14.7 Programas de línea de comandos ─────────────────── */
export const cliAuto = {
  id: 'cli-auto',
  titulo: 'Un buen comando',
  preguntas: [
    {
      pregunta: 'Tu comando imprime un resultado y también mensajes de progreso. ¿Dónde va cada cosa?',
      opciones: ['Todo con <code>console.log</code>', 'El resultado a stdout (<code>console.log</code>) y los mensajes a stderr (<code>console.error</code>)', 'Todo con <code>console.error</code>'],
      correcta: 1,
      explicacion: 'Así, con <code>&gt; archivo.txt</code>, el resultado va al archivo y los mensajes siguen en la pantalla.',
    },
    {
      pregunta: 'Con <code>parseArgs</code>, ¿qué tipo tiene el valor de una opción <code>{ type: "string" }</code> que recibió <code>-n 5</code>?',
      opciones: ['<code>number</code>', '<code>string</code>: los argumentos siempre llegan como texto', 'Depende del valor'],
      correcta: 1,
      explicacion: 'Si esperas un número, conviértelo con <code>Number(…)</code> y comprueba que no sea <code>NaN</code>.',
    },
    {
      pregunta: '¿Cómo lee tu programa lo que le llega con <code>cat notas.txt | node contar.js</code>?',
      opciones: ['Con <code>process.argv</code>', 'Recorriendo <code>process.stdin</code> con <code>for await</code>', 'Con <code>readFile("notas.txt")</code>'],
      correcta: 1,
      explicacion: 'La salida de <code>cat</code> se convierte en la entrada de tu programa, que es un stream.',
    },
    {
      pregunta: 'Tu comando encontró un error al final. ¿Cómo se lo dices a quien lo ejecutó (o a otro programa)?',
      opciones: ['Con un mensaje en mayúsculas', 'Con un mensaje en stderr y un código de salida distinto de 0: <code>process.exitCode = 1</code>', 'No hace falta'],
      correcta: 1,
      explicacion: 'Los scripts y la integración continua miran el código de salida para saber si el paso salió bien.',
    },
  ],
};

export const cliOrden = {
  id: 'cli-orden',
  titulo: 'Argumentos de prueba',
  codigo: `import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  args: ["notas.txt", "-n", "5", "--ordenar", "otro.txt"],
  options: {
    n: { type: "string", short: "n", default: "10" },
    ordenar: { type: "boolean" },
    invertir: { type: "boolean", default: false },
  },
  allowPositionals: true,
});

console.log(positionals.join(" + "));
console.log(values.n, typeof values.n);
console.log(values.ordenar, values.invertir);
console.log(Number(values.n) * 2);`,
  salida: ['notas.txt + otro.txt', '5 string', 'true false', '10'],
  inicio: [2, 3, 0, 1],
  explicacion:
    'Los argumentos sin guion son posicionales, estén donde estén. <code>-n 5</code> reemplaza el valor por defecto, pero llega como el texto <code>"5"</code>: hay que convertirlo para hacer cuentas. <code>invertir</code> no se pasó, así que toma su <code>default</code>.',
};

export const cliDetective = {
  id: 'cli-detective',
  titulo: 'Una opción de más',
  codigo: `import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    salida: { type: "string", short: "o" },
  },
});

console.log("guardando en", values.salida ?? "resultado.txt");`,
  error: `TypeError [ERR_PARSE_ARGS_UNKNOWN_OPTION]: Unknown option '--verbose'
    at checkOptionUsage (node:internal/util/parse_args/parse_args:102:13)
    at file:///exportar.js:3:20`,
  culpable: 4,
  hallazgo:
    'Se ejecutó con <code>--verbose</code>, pero esa opción no está declarada en <code>options</code>. <code>parseArgs</code> es estricto por defecto: ante una opción desconocida, lanza un error en lugar de ignorarla.',
  pista: '¿Qué opciones acepta el programa, y cuáles se le pasaron?',
  arreglos: [
    {
      texto: 'Declararla: <code>verbose: { type: "boolean", short: "v" }</code> dentro de <code>options</code>',
      correcta: true,
      porque: 'Así <code>--verbose</code> (o <code>-v</code>) se acepta y queda en <code>values.verbose</code>. Lo estricto es bueno: un error de tipeo como <code>--salda</code> no pasa en silencio.',
    },
    {
      texto: 'Pasar <code>strict: false</code> a <code>parseArgs</code>',
      correcta: false,
      porque: 'Deja de fallar, pero acepta cualquier cosa: <code>--salda datos.csv</code> (mal escrito) se ignoraría y el archivo se guardaría en otro lado sin aviso.',
    },
    {
      texto: 'Leer las opciones directamente de <code>process.argv</code>',
      correcta: false,
      porque: 'Vuelves a interpretar todo a mano, que es justo lo que <code>parseArgs</code> resuelve.',
    },
  ],
};
