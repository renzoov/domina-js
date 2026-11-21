// Ejercicios de la sección 16: «Novedades por edición».

/* ── ES2021 ──────────────────────────────────────────────── */
export const es2021Auto = {
  id: 'es2021-auto',
  titulo: 'Lo que trajo ES2021',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>config.tema ??= "oscuro"</code>?',
      opciones: ['Siempre asigna "oscuro"', 'Asigna "oscuro" solo si <code>config.tema</code> es <code>null</code> o <code>undefined</code>', 'Compara'],
      correcta: 1,
      explicacion: 'Las asignaciones lógicas (<code>??=</code>, <code>||=</code>, <code>&&=</code>) solo asignan cuando hace falta.',
    },
    {
      pregunta: '¿Qué ventaja tiene <code>replaceAll</code> sobre <code>replace</code> con un texto?',
      opciones: ['Ninguna', 'Reemplaza todas las apariciones sin necesidad de una expresión regular con la bandera <code>g</code>', 'Es más rápido'],
      correcta: 1,
      explicacion: '<code>"a-b-c".replace("-", "+")</code> solo cambia el primer guion.',
    },
    {
      pregunta: '¿Qué es <code>1_000_000</code>?',
      opciones: ['Un error', 'El número un millón: los guiones bajos son separadores visuales, solo para leer mejor', 'Un texto'],
      correcta: 1,
      explicacion: 'Los separadores numéricos no cambian el valor.',
    },
  ],
};

export const es2021Orden = {
  id: 'es2021-orden',
  titulo: 'ES2021 en acción',
  codigo: `let config = { tema: null, idioma: "es" };
config.tema ??= "oscuro";
config.idioma ||= "en";

console.log(config.tema, config.idioma);
console.log(1_000_000 + 1);
console.log("a-b-c".replaceAll("-", "+"));
console.log(await Promise.any([Promise.reject(1), Promise.resolve("primera")]));`,
  salida: ['oscuro es', '1000001', 'a+b+c', 'primera'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>??=</code> asignó porque <code>tema</code> era <code>null</code>; <code>||=</code> no, porque <code>"es"</code> ya es truthy. <code>Promise.any</code> ignora el rechazo y se queda con la primera que se cumple.',
};

/* ── ES2022 ──────────────────────────────────────────────── */
export const es2022Auto = {
  id: 'es2022-auto',
  titulo: 'Lo que trajo ES2022',
  preguntas: [
    {
      pregunta: '¿Qué agregó ES2022 a las clases?',
      opciones: ['Nada', 'Campos públicos y privados (<code>#</code>), métodos privados, bloques <code>static</code> y <code>#campo in obj</code>', 'La palabra <code>class</code>'],
      correcta: 1,
      explicacion: 'Es la edición que completó las clases: antes, la privacidad se simulaba con convenciones o closures.',
    },
    {
      pregunta: '¿Dónde se puede usar el <code>await</code> de nivel superior?',
      opciones: ['En cualquier script', 'En los módulos (y en las consolas que los emulan)', 'Solo dentro de funciones'],
      correcta: 1,
      explicacion: 'Los módulos que lo importan esperan a que termine antes de ejecutarse.',
    },
    {
      pregunta: '¿Para qué sirve la opción <code>cause</code> de <code>new Error(mensaje, { cause })</code>?',
      opciones: ['Para nada', 'Para encadenar el error original que provocó este, sin perderlo', 'Para cambiar el tipo'],
      correcta: 1,
      explicacion: 'Envuelves un error de bajo nivel en uno con más contexto y conservas el original para depurar.',
    },
  ],
};

export const es2022Orden = {
  id: 'es2022-orden',
  titulo: 'ES2022 en acción',
  codigo: `class Cuenta {
  #saldo = 10;
  static esCuenta(x) {
    return #saldo in x;
  }
}

console.log(Cuenta.esCuenta(new Cuenta()), Cuenta.esCuenta({}));
console.log([1, 2, 3].at(-1));
console.log(Object.hasOwn({ a: 1 }, "a"));
const e = new Error("falló el pago", { cause: new Error("sin conexión") });
console.log(e.cause.message);`,
  salida: ['true false', '3', 'true', 'sin conexión'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>#saldo in x</code> dice si el objeto es de la clase. <code>at(-1)</code> lee desde el final. <code>Object.hasOwn</code> mira las propiedades propias. Y el error guarda su causa original.',
};

/* ── ES2023 ──────────────────────────────────────────────── */
export const es2023Auto = {
  id: 'es2023-auto',
  titulo: 'Lo que trajo ES2023',
  preguntas: [
    {
      pregunta: '¿Qué tienen en común <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> y <code>with</code>?',
      opciones: ['Nada', 'Son las versiones que devuelven una copia, sin modificar el array original', 'Son más rápidas'],
      correcta: 1,
      explicacion: 'La propuesta se llamaba <em>Change Array by Copy</em>.',
    },
    {
      pregunta: '¿Qué hace <code>findLast</code>?',
      opciones: ['Lo mismo que <code>find</code>', 'Busca desde el final: devuelve el último elemento que cumple la condición', 'Devuelve el último elemento'],
      correcta: 1,
      explicacion: '<code>findLastIndex</code> devuelve su posición.',
    },
    {
      pregunta: 'Desde ES2023, ¿qué más puede ser clave de una <code>WeakMap</code>?',
      opciones: ['Textos', 'Symbols no registrados (los de <code>Symbol()</code>, no los de <code>Symbol.for()</code>)', 'Números'],
      correcta: 1,
      explicacion: 'Un symbol único, como un objeto, puede dejar de usarse y liberarse.',
    },
  ],
};

export const es2023Orden = {
  id: 'es2023-orden',
  titulo: 'ES2023 en acción',
  codigo: `const nums = [3, 1, 2];
console.log(nums.toSorted().join(), nums.join());
console.log(nums.with(0, 9).join());
console.log(nums.findLast((n) => n > 1));

const clave = Symbol("sesion");
const datos = new WeakMap([[clave, "activa"]]);
console.log(datos.get(clave));`,
  salida: ['1,2,3 3,1,2', '9,1,2', '2', 'activa'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>toSorted</code> y <code>with</code> devuelven copias: <code>nums</code> sigue igual. <code>findLast</code> encuentra el 2, el último mayor que 1. Y un symbol sirve como clave débil.',
};

/* ── ES2024 ──────────────────────────────────────────────── */
export const es2024Auto = {
  id: 'es2024-auto',
  titulo: 'Lo que trajo ES2024',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>Object.groupBy(lista, fn)</code>?',
      opciones: ['Ordena', 'Agrupa los elementos en un objeto, según lo que devuelve <code>fn</code> para cada uno', 'Cuenta'],
      correcta: 1,
      explicacion: '<code>Map.groupBy</code> hace lo mismo con un <code>Map</code>.',
    },
    {
      pregunta: '¿Qué permite la bandera <code>v</code> de las expresiones regulares?',
      opciones: ['Nada nuevo', 'Operaciones de conjuntos dentro de <code>[…]</code> (resta, intersección) y propiedades de Unicode mejoradas', 'Ignorar mayúsculas'],
      correcta: 1,
      explicacion: '<code>/[\\p{L}--[a-z]]/v</code>: letras de cualquier idioma, menos las de la a a la z.',
    },
    {
      pregunta: '¿Para qué sirve <code>Promise.withResolvers()</code>?',
      opciones: ['Para resolver todas', 'Para crear una promesa y obtener por separado su <code>resolve</code> y su <code>reject</code>', 'Para cancelar'],
      correcta: 1,
      explicacion: 'Útil cuando quien cumple la promesa está en otro lado del código.',
    },
  ],
};

export const es2024Orden = {
  id: 'es2024-orden',
  titulo: 'ES2024 en acción',
  codigo: `const porTipo = Object.groupBy(["té", "pan", "café"], (x) => (x === "pan" ? "comida" : "bebida"));
console.log(porTipo.bebida.join());

const { promise, resolve } = Promise.withResolvers();
setTimeout(() => resolve("listo"), 10);
console.log(await promise);

console.log(/[\\p{L}--[a-z]]/v.test("ñ"));
console.log("👍".slice(0, 1).isWellFormed());`,
  salida: ['té,café', 'listo', 'true', 'false'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'El grupo de bebidas tiene dos elementos. La promesa se cumple desde el temporizador. La <code>ñ</code> es una letra que no está entre la a y la z. Y medio emoji es texto mal formado.',
};

/* ── ES2025 ──────────────────────────────────────────────── */
export const es2025Auto = {
  id: 'es2025-auto',
  titulo: 'Lo que trajo ES2025',
  preguntas: [
    {
      pregunta: '¿Qué son los <em>iterator helpers</em>?',
      opciones: ['Librerías', 'Métodos como <code>map</code>, <code>filter</code>, <code>take</code> y <code>toArray</code> en todos los iteradores, perezosos', 'Un tipo de bucle'],
      correcta: 1,
      explicacion: 'Funcionan incluso con generadores infinitos, porque procesan solo lo que se pide.',
    },
    {
      pregunta: '¿Qué hace <code>import datos from "./datos.json" with { type: "json" }</code>?',
      opciones: ['Un error', 'Importa el JSON ya convertido en objeto, comprobando que de verdad sea JSON', 'Importa el texto'],
      correcta: 1,
      explicacion: 'Son los módulos JSON con atributos de importación.',
    },
    {
      pregunta: '¿Qué agregó ES2025 a <code>Set</code>?',
      opciones: ['Nada', 'Operaciones de conjuntos: <code>union</code>, <code>intersection</code>, <code>difference</code>, <code>symmetricDifference</code>, <code>isSubsetOf</code>…', 'Índices'],
      correcta: 1,
      explicacion: 'Antes había que escribirlas con <code>filter</code> y <code>has</code>.',
    },
  ],
};

export const es2025Orden = {
  id: 'es2025-orden',
  titulo: 'ES2025 en acción',
  codigo: `const a = new Set([1, 2, 3]);
console.log([...a.intersection(new Set([2, 3, 4]))].join());

console.log(Iterator.from([1, 2, 3, 4]).filter((n) => n % 2 === 0).map((n) => n * 10).toArray().join());

console.log(new RegExp(RegExp.escape("1.5")).test("1x5"));
console.log(await Promise.try(() => 42));`,
  salida: ['2,3', '20,40', 'false', '42'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'La intersección deja lo común. Los helpers encadenan sobre un iterador. Con <code>RegExp.escape</code>, el punto es un punto literal y no "cualquier carácter". <code>Promise.try</code> envuelve el resultado en una promesa.',
};

/* ── ES2026 ──────────────────────────────────────────────── */
export const es2026Auto = {
  id: 'es2026-auto',
  titulo: 'Lo que trajo ES2026',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>mapa.getOrInsert(clave, valor)</code>?',
      opciones: ['Siempre inserta', 'Devuelve el valor de la clave si existe; si no, guarda el valor dado y lo devuelve', 'Borra la clave'],
      correcta: 1,
      explicacion: 'Es el <em>upsert</em>; <code>getOrInsertComputed</code> calcula el valor con una función solo si hace falta.',
    },
    {
      pregunta: '¿Qué resuelve <code>Math.sumPrecise</code>?',
      opciones: ['Nada', 'Suma una lista de números sin acumular errores de redondeo en cada paso', 'Redondea'],
      correcta: 1,
      explicacion: 'El resultado es el número decimal más cercano a la suma exacta.',
    },
    {
      pregunta: '¿Para qué sirve <code>Error.isError(valor)</code>?',
      opciones: ['Para lanzar errores', 'Para saber si algo es un error de verdad, incluso si viene de otro iframe o realm, donde <code>instanceof</code> falla', 'Para atraparlos'],
      correcta: 1,
      explicacion: 'Un objeto con <code>message</code> no es un error: <code>Error.isError</code> no se deja engañar.',
    },
  ],
};

export const es2026Orden = {
  id: 'es2026-orden',
  titulo: 'ES2026 en acción',
  codigo: `const cuenta = new Map();
cuenta.set("ana", cuenta.getOrInsert("ana", 0) + 1);
console.log(cuenta.get("ana"));

console.log(new Uint8Array([72, 111, 108, 97]).toBase64());
console.log(Math.sumPrecise([0.1, 0.2, 0.3]), 0.1 + 0.2 + 0.3);
console.log(Error.isError(new TypeError("x")), Error.isError({ message: "x" }));`,
  salida: ['1', 'SG9sYQ==', '0.6 0.6000000000000001', 'true false'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>getOrInsert</code> crea la entrada en 0 y se le suma 1. Los bytes de "Hola" en base64 son <code>SG9sYQ==</code>. <code>sumPrecise</code> evita el error que acumula la suma de a dos. Y un objeto parecido a un error no lo es.',
};

/* ── ES2027 ──────────────────────────────────────────────── */
export const es2027Auto = {
  id: 'es2027-auto',
  titulo: 'Lo que trae ES2027',
  preguntas: [
    {
      pregunta: '¿Qué reemplaza Temporal?',
      opciones: ['A <code>Math</code>', 'A <code>Date</code>, con tipos separados para fechas, horas, zonas e instantes, inmutables', 'A <code>Intl</code>'],
      correcta: 1,
      explicacion: 'Es el cambio más grande de la biblioteca estándar en años.',
    },
    {
      pregunta: '¿Qué garantiza <code>using recurso = abrir()</code>?',
      opciones: ['Nada', 'Que al salir del bloque se llame a <code>recurso[Symbol.dispose]()</code>, haya error o no', 'Que no haya errores'],
      correcta: 1,
      explicacion: 'Reemplaza a los <code>try/finally</code> de limpieza.',
    },
    {
      pregunta: '¿Por qué ES2027 "ya está terminada" si estamos en 2026?',
      opciones: ['Es un error', 'Porque las propuestas que llegan a la etapa 4 durante el año entran en la edición que se publica a mediados del año siguiente', 'Porque se adelantó'],
      correcta: 1,
      explicacion: 'Los navegadores muchas veces implementan una propuesta antes de que se publique la edición que la incluye.',
    },
  ],
};

export const es2027Orden = {
  id: 'es2027-orden',
  titulo: 'ES2027 en acción',
  codigo: `const hoy = Temporal.PlainDate.from("2026-11-21");
console.log(hoy.add({ days: 10 }).toString());

{
  using r = { [Symbol.dispose]() { console.log("liberado"); } };
  console.log("usando");
}

console.log(Iterator.zip([["a", "b"], [1, 2]]).toArray().map((x) => x.join("")).join());`,
  salida: ['2026-12-01', 'usando', 'liberado', 'a1,b2'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Temporal cruza el fin de mes sin problemas. El recurso se libera al salir del bloque, después de usarlo. Y <code>Iterator.zip</code> recorre los dos iteradores a la vez, emparejando sus valores.',
};

/* ── Lo que viene ────────────────────────────────────────── */
export const vieneAuto = {
  id: 'viene-auto',
  titulo: 'Cómo nace una novedad',
  preguntas: [
    {
      pregunta: '¿Quién decide qué entra en JavaScript?',
      opciones: ['Una sola empresa', 'El comité TC39 de Ecma International, con representantes de navegadores, empresas y la comunidad, por consenso', 'Los usuarios con votos'],
      correcta: 1,
      explicacion: 'Las reuniones, las propuestas y sus discusiones son públicas, en GitHub.',
    },
    {
      pregunta: '¿Qué significa que una propuesta esté en la etapa 3?',
      opciones: ['Que es una idea', 'Que el diseño está terminado y se espera que los navegadores la implementen para probarla', 'Que fue rechazada'],
      correcta: 1,
      explicacion: 'Etapa 4 significa terminada: entra en la próxima edición del estándar.',
    },
    {
      pregunta: '¿Conviene usar en producción una propuesta en etapa 1 o 2?',
      opciones: ['Sí', 'No: puede cambiar por completo o abandonarse; solo con un compilador y aceptando ese riesgo', 'Siempre que funcione'],
      correcta: 1,
      explicacion: 'Varias propuestas populares cambiaron mucho, o se retiraron, antes de terminar.',
    },
  ],
};
