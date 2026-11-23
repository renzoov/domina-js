// Reto del motor de la sección 14: «JavaScript en el servidor». La sección no tiene laboratorios
// (necesitan archivos, red y procesos), así que el reto cierra con una segunda autoevaluación.

export const retoServAuto = {
  id: 'reto-serv-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>import path from "node:path";</code><br><code>console.log(path.join("/datos", "../config", "app.json"));</code>',
      opciones: ['<code>/datos/../config/app.json</code>', '<code>/config/app.json</code>', '<code>/datos/config/app.json</code>'],
      correcta: 1,
      explicacion: '<code>path.join</code> une las partes y además normaliza: <code>..</code> sube un nivel desde <code>/datos</code>. Por eso nunca se arma una ruta con datos del usuario sin validarla: un <code>../</code> puede sacarte de la carpeta.',
    },
    {
      pregunta: 'Un servidor HTTP hace un cálculo de 3 segundos, síncrono, al atender <code>/informe</code>. Mientras tanto, otra persona pide <code>/salud</code>. ¿Qué pasa?',
      opciones: [
        'Responde <code>/salud</code> enseguida, en paralelo',
        'Espera: mientras el cálculo ocupa el hilo, el event loop no puede atender nada más',
        'Node abre otro hilo automáticamente',
      ],
      correcta: 1,
      explicacion: 'Todas las peticiones comparten un solo hilo. Un trabajo largo y síncrono bloquea el event loop: hay que partirlo, hacerlo asíncrono o mandarlo a un <code>worker_threads</code>.',
    },
    {
      pregunta: 'En Deno, ¿qué pasa si tu programa intenta leer un archivo y lo ejecutaste con <code>deno run app.ts</code>, sin permisos?',
      opciones: [
        'Lo lee normalmente',
        'Se lo impide (o te pregunta en la terminal): los permisos hay que darlos de forma explícita',
        'Deno no puede leer archivos',
      ],
      correcta: 1,
      explicacion: 'Deno arranca sin permisos: red, archivos y variables de entorno se habilitan con opciones como <code>--allow-read</code>. Node tiene un modelo parecido, pero hay que activarlo con <code>--permission</code>.',
    },
    {
      pregunta: '¿Dónde va la clave de la API de pagos de tu servidor?',
      opciones: [
        'En una constante del código, para tenerla a mano',
        'En una variable de entorno, leída con <code>process.env</code>, fuera del repositorio',
        'En el <code>package.json</code>',
      ],
      correcta: 1,
      explicacion: 'Todo lo que está en el código termina en el repositorio y en las copias. Los secretos van en el entorno (o en un archivo <code>.env</code> que no se sube) y se leen al arrancar.',
    },
  ],
};

export const retoServOrden = {
  id: 'reto-serv-orden',
  titulo: 'Las fases del event loop de Node',
  codigo: `import { readFile } from "node:fs";

readFile(import.meta.filename, () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
  process.nextTick(() => console.log("nextTick"));
  Promise.resolve().then(() => console.log("promesa"));
  console.log("callback de lectura");
});

console.log("programa principal");`,
  salida: ['programa principal', 'callback de lectura', 'nextTick', 'promesa', 'immediate', 'timeout'],
  inicio: [4, 2, 5, 0, 3, 1],
  explicacion:
    'Primero el código síncrono. La lectura del archivo termina después, en la fase de E/S. Al salir de cada callback, Node vacía la cola de <code>nextTick</code> y después las microtareas de las promesas. La fase siguiente a la de E/S es la de <code>setImmediate</code>; los temporizadores esperan a la próxima vuelta. Dentro de un callback de E/S, este orden es siempre el mismo.',
};

export const retoServDetective = {
  id: 'reto-serv-detective',
  titulo: 'Un registro que no se puede escribir',
  codigo: `// Se ejecuta con: node --permission --allow-fs-read=./datos servidor.mjs
import { readFile, appendFile } from "node:fs/promises";

const datos = await readFile("./datos/precios.json", "utf8");
await appendFile("./registro.log", \`Cargados \${datos.length} bytes\\n\`);`,
  error: `node:internal/fs/promises:698
    binding.openFileHandle(path, flagsNumber, mode, kUsePromises),
            ^

Error: Access to this API has been restricted. Use --allow-fs-write to manage permissions.
    at open (node:internal/fs/promises:698:13)
    at writeFile (node:internal/fs/promises:1317:20)
    at appendFile (node:internal/fs/promises:1335:10)
    at file:///proyecto/servidor.mjs:5:7 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemWrite',
  resource: '/proyecto/registro.log'
}`,
  culpable: 1,
  hallazgo:
    'El código está bien: lo que falta es un permiso. Con <code>--permission</code>, Node solo deja hacer lo que el comando autoriza, y este solo autoriza <b>leer</b> la carpeta <code>datos</code>. Escribir <code>registro.log</code> queda bloqueado.',
  pista: 'Lee la línea del error: ¿qué permiso dice que falta? ¿Dónde se dan los permisos?',
  arreglos: [
    {
      texto: 'Agregar al comando <code>--allow-fs-write=./registro.log</code>',
      correcta: true,
      porque: 'Se autoriza justo lo que el programa necesita: escribir ese archivo. Todo lo demás sigue bloqueado, que es la idea del modelo de permisos.',
    },
    {
      texto: 'Quitar <code>--permission</code> del comando',
      correcta: false,
      porque: 'El programa funciona, pero sin ninguna protección: si una dependencia intenta leer tus claves o borrar archivos, ya nada se lo impide.',
    },
    {
      texto: 'Envolver el <code>appendFile</code> en un <code>try…catch</code>',
      correcta: false,
      porque: 'El programa ya no se cae, pero el registro nunca se escribe, y nadie se entera.',
    },
  ],
};

export const retoServAuto2 = {
  id: 'reto-serv-auto-2',
  titulo: 'Archivos, procesos, datos y comandos',
  preguntas: [
    {
      pregunta: 'Tienes que procesar un archivo de registro de 4 GB. ¿Qué conviene?',
      opciones: [
        '<code>await readFile(ruta, "utf8")</code> y después <code>split("\\n")</code>',
        'Leerlo con un stream, por partes, a medida que llega',
        'Pedirle al sistema más memoria',
      ],
      correcta: 1,
      explicacion: 'Con <code>readFile</code>, el archivo entero tiene que entrar en memoria (y un texto de 4 GB ni siquiera cabe en un string). Un stream procesa trozo por trozo con memoria constante.',
    },
    {
      pregunta: '¿Para qué sirve <code>worker_threads</code>?',
      opciones: [
        'Para ejecutar JavaScript en otro hilo, en paralelo, sin bloquear el event loop',
        'Para ejecutar otros programas, como <code>git</code> o <code>ffmpeg</code>',
        'Para atender más peticiones HTTP',
      ],
      correcta: 0,
      explicacion: 'Los workers corren JavaScript en paralelo y se comunican por mensajes: son para cálculos pesados. Para ejecutar <b>otros programas</b> está <code>child_process</code>.',
    },
    {
      pregunta: 'Tu servidor recibe <code>{"edad": "veinte"}</code> donde esperaba un número. ¿Qué haces?',
      opciones: [
        'Nada: <code>JSON.parse</code> ya validó los datos',
        'Validar forma y tipos antes de usarlos, y responder 400 si no cumplen',
        'Convertir con <code>Number</code> y seguir',
      ],
      correcta: 1,
      explicacion: '<code>JSON.parse</code> solo comprueba que sea JSON válido, no que tenga sentido. Todo lo que llega de afuera se valida, y un dato mal formado es un error del cliente: 400.',
    },
    {
      pregunta: '¿Qué hace <code>node --watch servidor.mjs</code>?',
      opciones: [
        'Ejecuta el servidor y lo reinicia cada vez que cambia uno de sus archivos',
        'Muestra cada petición que llega',
        'Vigila el uso de memoria',
      ],
      correcta: 0,
      explicacion: 'Desde Node 22 viene incluido: ya no hace falta instalar <code>nodemon</code> para reiniciar al guardar.',
    },
    {
      pregunta: 'Alguien escribe <code>x\' OR \'1\'=\'1</code> en el buscador. ¿Cuál de estas consultas es segura?<br><code>A: db.prepare(`SELECT * FROM usuarios WHERE nombre = \'${nombre}\'`).all()</code><br><code>B: db.prepare("SELECT * FROM usuarios WHERE nombre = ?").all(nombre)</code>',
      opciones: ['Las dos', 'Solo B: el valor viaja como parámetro y nunca se mezcla con el SQL', 'Solo A, porque usa comillas'],
      correcta: 1,
      explicacion: 'En A, el texto cambia la consulta (queda <code>… OR \'1\'=\'1\'</code>) y devuelve todos los usuarios: inyección de SQL. Con <code>?</code>, se busca literalmente ese texto.',
    },
    {
      pregunta: 'Con <code>parseArgs</code> y la opción <code>{ n: { type: "string", short: "n" } }</code>, ejecutas <code>node contar.js -n 5</code>. ¿Qué es <code>values.n</code>?',
      opciones: ['El número <code>5</code>', 'El texto <code>"5"</code>', '<code>true</code>'],
      correcta: 1,
      explicacion: 'Los argumentos de la terminal siempre llegan como texto: para hacer cuentas hay que convertirlo con <code>Number(values.n)</code> y comprobar que no sea <code>NaN</code>.',
    },
  ],
};
