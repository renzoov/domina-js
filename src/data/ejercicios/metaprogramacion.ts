// Ejercicios de la sección 12: «Metaprogramación».

/* ── 12.1 Descriptores de propiedades ────────────────────── */
export const descAuto = {
  id: 'desc-auto',
  titulo: 'Lo que hay detrás de cada propiedad',
  preguntas: [
    {
      pregunta: '¿Qué tres atributos tiene una propiedad de datos, además de su valor?',
      opciones: ['<code>writable</code>, <code>enumerable</code> y <code>configurable</code>', '<code>public</code>, <code>private</code> y <code>static</code>', '<code>get</code>, <code>set</code> y <code>delete</code>'],
      correcta: 0,
      explicacion: 'Si se puede cambiar el valor, si aparece al recorrer el objeto y si se puede borrar o redefinir.',
    },
    {
      pregunta: 'Con <code>Object.defineProperty(obj, "x", { value: 1 })</code>, ¿cómo quedan los atributos que no indicaste?',
      opciones: ['En <code>true</code>', 'En <code>false</code>: la propiedad es de solo lectura, oculta y fija', 'Sin definir'],
      correcta: 1,
      explicacion: 'Al revés que con una asignación normal (<code>obj.x = 1</code>), donde todos quedan en <code>true</code>.',
    },
    {
      pregunta: '¿Qué significa <code>enumerable: false</code>?',
      opciones: ['Que no se puede leer', 'Que no aparece en <code>Object.keys</code>, <code>for...in</code>, el spread ni <code>JSON.stringify</code>, aunque se puede leer', 'Que no es un número'],
      correcta: 1,
      explicacion: 'Por eso los métodos de los prototipos nativos no aparecen al recorrer un array: no son enumerables.',
    },
    {
      pregunta: '¿Qué hace <code>Object.freeze</code> en términos de descriptores?',
      opciones: ['Nada', 'Pone <code>writable</code> y <code>configurable</code> en <code>false</code> en todas las propiedades y bloquea agregar nuevas', 'Borra los descriptores'],
      correcta: 1,
      explicacion: 'Los tres niveles de <em>Inmutabilidad</em> son atajos sobre estos atributos.',
    },
  ],
};

export const descOrden = {
  id: 'desc-orden',
  titulo: 'Una propiedad discreta',
  codigo: `const o = {};
Object.defineProperty(o, "id", { value: 7 });
o.id = 99;

console.log(o.id);
console.log(Object.keys(o).length, JSON.stringify(o));
const d = Object.getOwnPropertyDescriptor(o, "id");
console.log(d.writable, d.enumerable, d.configurable);
console.log(Object.getOwnPropertyDescriptor({ x: 1 }, "x").writable);`,
  salida: ['7', '0 {}', 'false false false', 'true'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>defineProperty</code> deja en <code>false</code> todo lo que no indicaste: la asignación se ignora (fuera del modo estricto) y la propiedad no aparece al recorrer ni al convertir a JSON. Una propiedad creada con un literal, en cambio, tiene todo en <code>true</code>.',
};

export const descDetective = {
  id: 'desc-detective',
  titulo: 'Redefinir lo que no se puede',
  codigo: `const config = {};
Object.defineProperty(config, "version", { value: "1.0" });

// más adelante, una actualización:
Object.defineProperty(config, "version", { value: "2.0" });
console.log(config.version);`,
  error: `config.js:5
Object.defineProperty(config, "version", { value: "2.0" });
       ^

TypeError: Cannot redefine property: version`,
  culpable: 2,
  hallazgo:
    'La primera definición no indicó <code>writable</code> ni <code>configurable</code>, así que quedaron en <code>false</code>: la propiedad es fija para siempre. El error salta en la línea 5, pero la decisión se tomó en la 2.',
  pista: '¿Qué valores tienen <code>writable</code> y <code>configurable</code> después de la línea 2?',
  arreglos: [
    {
      texto: 'Borrarla antes de redefinirla: <code>delete config.version;</code>',
      correcta: false,
      porque: 'Una propiedad no configurable tampoco se puede borrar: el <code>delete</code> se ignora (o lanza un error en modo estricto) y sigue el mismo problema.',
    },
    {
      texto: 'En la primera definición, permitir el cambio: <code>{ value: "1.0", writable: true }</code> (o <code>configurable: true</code>)',
      correcta: true,
      porque: 'Si la propiedad va a cambiar, hay que decirlo al definirla. Con <code>writable: true</code> se puede cambiar el valor; con <code>configurable: true</code>, la propiedad entera.',
    },
    {
      texto: 'Cambiarla con una asignación: <code>config.version = "2.0";</code>',
      correcta: false,
      porque: 'No es <code>writable</code>: la asignación se ignora en silencio y sigue valiendo <code>"1.0"</code>.',
    },
  ],
};

export const descLab = {
  id: 'desc-lab',
  titulo: 'Una propiedad oculta',
  inicial: `// Escribe agregarOculta(obj, clave, valor): agrega una propiedad que se puede
// leer y cambiar, pero que NO aparece en Object.keys ni en JSON.stringify.

const usuario = { nombre: "Ana" };
agregarOculta(usuario, "token", "abc123");

console.log(usuario.token);
console.log(JSON.stringify(usuario));
`,
  verificaciones: [
    { texto: 'Imprime <code>abc123</code> y <code>{"nombre":"Ana"}</code>', prueba: 'return __salida.join("|") === \'abc123|{"nombre":"Ana"}\';' },
    { texto: 'La propiedad se puede cambiar', prueba: 'const o = {}; agregarOculta(o, "x", 1); o.x = 2; return o.x === 2 && !Object.keys(o).includes("x");' },
    { texto: 'Usa <code>Object.defineProperty</code> con <code>enumerable: false</code>', prueba: String.raw`return /Object\.defineProperty\s*\(/.test(__codigo) && /enumerable\s*:\s*false/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function agregarOculta(obj, clave, valor) { … }</code> arriba de todo.',
    'Dentro: <code>Object.defineProperty(obj, clave, { … });</code> con el <code>value</code>.',
    'Los atributos: <code>{ value: valor, writable: true, configurable: true, enumerable: false }</code>',
  ] as [string, string, string],
  solucion: `function agregarOculta(obj, clave, valor) {
  Object.defineProperty(obj, clave, {
    value: valor,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

const usuario = { nombre: "Ana" };
agregarOculta(usuario, "token", "abc123");

console.log(usuario.token);
console.log(JSON.stringify(usuario));`,
  explicacion:
    '<p>Útil para datos internos que no deberían viajar al guardar o enviar el objeto. Ojo: "oculta" no es "privada". Cualquiera puede leerla si conoce su nombre, o verla con <code>Object.getOwnPropertyNames</code>. Para privacidad de verdad están los campos <code>#</code> de las clases.</p>',
};

/* ── 12.2 Symbols conocidos ──────────────────────────────── */
export const conocidosAuto = {
  id: 'conocidos-auto',
  titulo: 'Ganchos del lenguaje',
  preguntas: [
    {
      pregunta: '¿Qué es un <em>symbol conocido</em>, como <code>Symbol.iterator</code>?',
      opciones: ['Un symbol creado por el usuario', 'Una clave que el propio lenguaje busca en tus objetos para cambiar cómo se comportan', 'Un error'],
      correcta: 1,
      explicacion: 'Si tu objeto la tiene, el lenguaje la usa: <code>for...of</code> busca <code>Symbol.iterator</code>, <code>using</code> busca <code>Symbol.dispose</code>…',
    },
    {
      pregunta: '¿Cuándo se llama a <code>[Symbol.toPrimitive](hint)</code>?',
      opciones: ['Nunca', 'Cuando el objeto se convierte en un primitivo: en una suma, un template literal, una comparación…', 'Al crearlo'],
      correcta: 1,
      explicacion: '<code>hint</code> dice qué se espera: <code>"number"</code>, <code>"string"</code> o <code>"default"</code>.',
    },
    {
      pregunta: '¿Qué cambia <code>Symbol.toStringTag</code>?',
      opciones: ['El texto de <code>Object.prototype.toString</code>: <code>[object TuEtiqueta]</code>', 'El nombre de la variable', 'Nada'],
      correcta: 0,
      explicacion: 'Es lo que usan <code>Map</code>, <code>Promise</code> y otros nativos para identificarse.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>Symbol("x")</code> y <code>Symbol.for("x")</code>?',
      opciones: ['Ninguna', '<code>Symbol("x")</code> crea uno nuevo y único cada vez; <code>Symbol.for("x")</code> devuelve siempre el mismo, de un registro global', '<code>Symbol.for</code> es más lento'],
      correcta: 1,
      explicacion: '<code>Symbol.for</code> sirve para compartir un symbol entre partes del programa que no se importan entre sí.',
    },
  ],
};

export const conocidosOrden = {
  id: 'conocidos-orden',
  titulo: 'Convertir a primitivo',
  codigo: `const temperatura = {
  grados: 25,
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.grados;
    if (hint === "string") return \`\${this.grados} °C\`;
    return "temperatura";
  },
  get [Symbol.toStringTag]() {
    return "Temperatura";
  },
};

console.log(+temperatura);
console.log(\`\${temperatura}\`);
console.log(temperatura + "!");
console.log(Object.prototype.toString.call(temperatura));`,
  salida: ['25', '25 °C', 'temperatura!', '[object Temperatura]'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'El <code>+</code> unario pide un número; un template literal, un texto. El <code>+</code> binario no sabe si va a sumar o concatenar, así que pide <code>"default"</code>. <code>toStringTag</code> cambia la etiqueta de <code>Object.prototype.toString</code>.',
};

export const conocidosDetective = {
  id: 'conocidos-detective',
  titulo: 'Dos symbols con el mismo nombre',
  codigo: `const CLAVE = Symbol("tema");
const ajustes = { [CLAVE]: "oscuro" };

const otraClave = Symbol("tema");   // en otro archivo, sin importar CLAVE
console.log(ajustes[otraClave].toUpperCase());`,
  error: `ajustes.js:5
console.log(ajustes[otraClave].toUpperCase());
                               ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')`,
  culpable: 4,
  hallazgo:
    'Cada <code>Symbol("tema")</code> crea un symbol <b>nuevo y distinto</b>: la descripción es solo una etiqueta. <code>otraClave</code> no es la misma clave que <code>CLAVE</code>, así que <code>ajustes[otraClave]</code> es <code>undefined</code>.',
  pista: '¿Es <code>Symbol("tema") === Symbol("tema")</code>?',
  arreglos: [
    {
      texto: 'Usar el registro global en los dos lugares: <code>Symbol.for("app.tema")</code>',
      correcta: true,
      porque: '<code>Symbol.for</code> devuelve siempre el mismo symbol para la misma clave. La otra opción, si se puede, es exportar <code>CLAVE</code> e importarla.',
    },
    {
      texto: 'Leer con el texto: <code>ajustes["tema"]</code>',
      correcta: false,
      porque: 'La propiedad tiene como clave un symbol, no el texto <code>"tema"</code>: sigue siendo <code>undefined</code>.',
    },
    {
      texto: 'Comparar descripciones: <code>Symbol("tema").description</code>',
      correcta: false,
      porque: 'Da el texto <code>"tema"</code>, no la clave. Las descripciones solo sirven para depurar.',
    },
  ],
};

export const conocidosLab = {
  id: 'conocidos-lab',
  titulo: 'Dinero que sabe convertirse',
  inicial: `// Escribe la clase Dinero: new Dinero(monto, moneda).
// Con [Symbol.toPrimitive](hint):
// - si hint es "string", devuelve por ejemplo "10.50 PEN"
// - en cualquier otro caso, devuelve el monto (un número)

const precio = new Dinero(10.5, "PEN");
console.log(\`Total: \${precio}\`);
console.log(precio * 2);
`,
  verificaciones: [
    { texto: 'Imprime <code>Total: 10.50 PEN</code> y <code>21</code>', prueba: 'return __salida.join("|") === "Total: 10.50 PEN|21";' },
    { texto: 'Se puede comparar y sumar como un número', prueba: 'return new Dinero(5, "USD") > 3 && new Dinero(2, "USD") + 1 === 3;' },
    { texto: 'Implementa <code>Symbol.toPrimitive</code>', prueba: String.raw`return /Symbol\.toPrimitive/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>class Dinero { constructor(monto, moneda) { … } }</code> arriba de todo.',
    'El método se escribe con la clave entre corchetes: <code>[Symbol.toPrimitive](hint) { … }</code>',
    'Dentro: <code>if (hint === "string") return `${this.monto.toFixed(2)} ${this.moneda}`; return this.monto;</code>',
  ] as [string, string, string],
  solucion: `class Dinero {
  constructor(monto, moneda) {
    this.monto = monto;
    this.moneda = moneda;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "string") return \`\${this.monto.toFixed(2)} \${this.moneda}\`;
    return this.monto;
  }
}

const precio = new Dinero(10.5, "PEN");
console.log(\`Total: \${precio}\`);
console.log(precio * 2);`,
  explicacion:
    '<p>Con <code>Symbol.toPrimitive</code>, tu objeto decide cómo convertirse según el contexto. Úsalo con cuidado: que un objeto se comporte como un número puede sorprender a quien lea el código. Un método explícito, como <code>precio.formatear()</code>, suele ser más claro.</p>',
};

/* ── 12.3 Proxy y Reflect ────────────────────────────────── */
export const proxyAuto = {
  id: 'proxy-auto',
  titulo: 'Interceptar operaciones',
  preguntas: [
    {
      pregunta: '¿Qué es un <code>Proxy</code>?',
      opciones: ['Una copia de un objeto', 'Un objeto que envuelve a otro e intercepta las operaciones sobre él (leer, escribir, borrar…)', 'Un servidor intermedio'],
      correcta: 1,
      explicacion: 'Las funciones que interceptan se llaman <b>trampas</b> (<em>traps</em>) y van en el objeto <em>handler</em>.',
    },
    {
      pregunta: '¿Qué trampa se ejecuta en <code>proxy.nombre</code>?',
      opciones: ['<code>set</code>', '<code>get</code>', '<code>has</code>'],
      correcta: 1,
      explicacion: '<code>set</code> intercepta asignaciones, <code>has</code> el operador <code>in</code>, <code>deleteProperty</code> el <code>delete</code>, <code>apply</code> las llamadas…',
    },
    {
      pregunta: '¿Para qué sirve <code>Reflect</code>?',
      opciones: ['Para reflejar imágenes', 'Tiene un método por cada trampa que hace la operación normal: ideal para que la trampa haga lo de siempre además de lo suyo', 'Para clonar'],
      correcta: 1,
      explicacion: '<code>Reflect.get(obj, prop)</code> lee como lo haría el lenguaje, respetando getters y prototipos.',
    },
    {
      pregunta: '¿Qué debe devolver la trampa <code>set</code>?',
      opciones: ['El valor', '<code>true</code> si la asignación funcionó; si devuelve algo falso, en modo estricto se lanza un <code>TypeError</code>', 'Nada'],
      correcta: 1,
      explicacion: '<code>return Reflect.set(obj, prop, valor)</code> devuelve justamente ese booleano.',
    },
  ],
};

export const proxyOrden = {
  id: 'proxy-orden',
  titulo: 'Índices negativos',
  codigo: `const lista = new Proxy(["a", "b", "c"], {
  get(arr, prop, receptor) {
    const i = Number(prop);
    if (Number.isInteger(i) && i < 0) return arr[arr.length + i];
    return Reflect.get(arr, prop, receptor);
  },
});

console.log(lista[-1]);
console.log(lista[0], lista.length);
console.log(Array.isArray(lista));
console.log("b" in lista, 5 in lista);`,
  salida: ['c', 'a 3', 'true', 'false false'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'La trampa <code>get</code> recibe la propiedad como texto (<code>"-1"</code>), la convierte y calcula desde el final. Lo demás lo hace <code>Reflect.get</code> como siempre. <code>Array.isArray</code> ve a través del proxy. <code>in</code> usa otra trampa, <code>has</code>, que no definimos: pregunta por índices y <code>"b"</code> es un valor, no un índice.',
};

export const proxyDetective = {
  id: 'proxy-detective',
  titulo: 'Una trampa set que no avisa',
  codigo: `"use strict";
const persona = new Proxy({}, {
  set(obj, prop, valor) {
    if (prop === "edad" && valor < 0) return false;
    obj[prop] = valor;
  },
});

persona.nombre = "Ana";
console.log(persona.nombre);`,
  error: `persona.js:9
persona.nombre = "Ana";
               ^

TypeError: 'set' on proxy: trap returned falsish for property 'nombre'`,
  culpable: 5,
  hallazgo:
    'La trampa guarda el valor, pero termina sin <code>return</code>: devuelve <code>undefined</code>, que cuenta como "falló". En modo estricto, eso lanza un error aunque la asignación se haya hecho.',
  pista: '¿Qué devuelve la trampa <code>set</code> cuando la propiedad es <code>nombre</code>?',
  arreglos: [
    {
      texto: 'Terminar con <code>return Reflect.set(obj, prop, valor);</code>',
      correcta: true,
      porque: '<code>Reflect.set</code> asigna y devuelve <code>true</code> si funcionó. Así la trampa cumple su contrato.',
    },
    {
      texto: 'Quitar el <code>"use strict"</code>',
      correcta: false,
      porque: 'El error desaparece, pero la trampa sigue rompiendo el contrato: la edad negativa también se rechazaría en silencio, sin avisar a nadie.',
    },
    {
      texto: 'Usar una trampa <code>get</code> en lugar de <code>set</code>',
      correcta: false,
      porque: '<code>get</code> intercepta lecturas: la validación de la edad dejaría de funcionar.',
    },
  ],
};

export const proxyLab = {
  id: 'proxy-lab',
  titulo: 'Valores por defecto',
  inicial: `// Escribe conDefecto(obj, defecto): devuelve un Proxy de obj que, al leer
// una propiedad que no existe, devuelve defecto en lugar de undefined.
// Usa la trampa get y Reflect.

const traducciones = conDefecto({ hola: "hello", adios: "bye" }, "¿?");
console.log(traducciones.hola);
console.log(traducciones.gracias);
`,
  verificaciones: [
    { texto: 'Imprime <code>hello</code> y <code>¿?</code>', prueba: 'return __salida.join("|") === "hello|¿?";' },
    { texto: 'Respeta los valores que existen aunque sean falsy', prueba: 'const p = conDefecto({ cero: 0, vacio: "" }, "x"); return p.cero === 0 && p.vacio === "" && p.otra === "x";' },
    { texto: 'Usa <code>new Proxy</code> y <code>Reflect</code>', prueba: String.raw`return /new\s+Proxy\s*\(/.test(__codigo) && /Reflect\.(get|has)\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function conDefecto(obj, defecto) { return new Proxy(obj, { get(o, prop) { … } }); }</code> arriba de todo.',
    'Para saber si la propiedad existe, sin confundir con valores falsy: <code>Reflect.has(o, prop)</code>.',
    '<code>return Reflect.has(o, prop) ? Reflect.get(o, prop) : defecto;</code>',
  ] as [string, string, string],
  solucion: `function conDefecto(obj, defecto) {
  return new Proxy(obj, {
    get(o, prop) {
      return Reflect.has(o, prop) ? Reflect.get(o, prop) : defecto;
    },
  });
}

const traducciones = conDefecto({ hola: "hello", adios: "bye" }, "¿?");
console.log(traducciones.hola);
console.log(traducciones.gracias);`,
  explicacion:
    '<p>Con <code>?? defecto</code> también funcionaría para <code>undefined</code>, pero <code>Reflect.has</code> pregunta si la propiedad <b>existe</b>, que es lo que querías. Un detalle: como <code>has</code> mira también el prototipo, <code>traducciones.toString</code> devuelve la función heredada, no el valor por defecto.</p>',
};

/* ── 12.4 Template tags ──────────────────────────────────── */
export const tagsAuto = {
  id: 'tags-auto',
  titulo: 'Funciones pegadas a un template',
  preguntas: [
    {
      pregunta: '¿Qué recibe una función usada como tag: <code>tag`Hola, ${nombre}!`</code>?',
      opciones: [
        'El texto final, ya armado',
        'Un array con los trozos de texto fijos y, después, cada valor interpolado como un argumento aparte',
        'Solo los valores',
      ],
      correcta: 1,
      explicacion: 'Aquí: <code>(["Hola, ", "!"], nombre)</code>. Siempre hay un trozo de texto más que valores.',
    },
    {
      pregunta: '¿Tiene que devolver un texto una función tag?',
      opciones: ['Sí', 'No: puede devolver cualquier cosa, por ejemplo un objeto con una consulta SQL y sus parámetros'],
      correcta: 1,
      explicacion: 'Librerías de SQL, de estilos o de HTML devuelven objetos especiales.',
    },
    {
      pregunta: '¿Qué hace <code>String.raw`C:\\nuevo`</code>?',
      opciones: ['Un salto de línea', 'Devuelve el texto sin interpretar las secuencias de escape: <code>C:\\nuevo</code> literal', 'Un error'],
      correcta: 1,
      explicacion: 'Útil para rutas de Windows y expresiones regulares. Los tags pueden leer esa versión cruda en <code>textos.raw</code>.',
    },
    {
      pregunta: '¿Por qué un tag es más seguro que un template normal para armar HTML?',
      opciones: ['No lo es', 'Porque recibe los valores por separado y puede escaparlos, sin tocar el texto fijo que escribió el programador', 'Porque es más rápido'],
      correcta: 1,
      explicacion: 'Un template normal mezcla todo en un texto, y un valor con <code>&lt;script&gt;</code> entraría tal cual.',
    },
  ],
};

export const tagsOrden = {
  id: 'tags-orden',
  titulo: 'Lo que recibe el tag',
  codigo: `function ver(textos, ...valores) {
  console.log(textos.length, valores.length);
  return textos.raw.join("|");
}

console.log(ver\`a\${1}b\${2}c\`);
console.log(ver\`\${"x"}\`);
console.log(String.raw\`C:\\nuevo\\tabla\`);`,
  salida: ['3 2', 'a|b|c', '2 1', '|', 'C:\\nuevo\\tabla'],
  inicio: [3, 1, 4, 0, 2],
  explicacion:
    'Con dos valores hay tres trozos de texto: <code>"a"</code>, <code>"b"</code> y <code>"c"</code>. Un template que empieza y termina con un valor tiene dos trozos vacíos. <code>String.raw</code> deja las barras invertidas tal cual: no hay salto de línea ni tabulador.',
};

export const tagsDetective = {
  id: 'tags-detective',
  titulo: 'Un tag llamado con paréntesis',
  codigo: `function resaltar(textos, ...valores) {
  return textos.reduce((acc, t, i) => acc + t + (i < valores.length ? \`*\${valores[i]}*\` : ""), "");
}

console.log(resaltar(\`Hola, \${"Ana"}\`));`,
  error: `resaltar.js:2
  return textos.reduce((acc, t, i) => acc + t + (i < valores.length ? \`*\${valores[i]}*\` : ""), "");
                ^

TypeError: textos.reduce is not a function`,
  culpable: 5,
  hallazgo:
    'Con paréntesis, el template se arma <b>primero</b> como un texto normal, <code>"Hola, Ana"</code>, y ese texto es lo que recibe la función. Un texto no tiene <code>reduce</code>.',
  pista: '¿Qué recibe <code>resaltar</code> como primer argumento cuando se la llama con paréntesis?',
  arreglos: [
    {
      texto: 'Pegar la función al template, sin paréntesis: <code>resaltar`Hola, ${"Ana"}`</code>',
      correcta: true,
      porque: 'Así es una llamada etiquetada: recibe los trozos y los valores por separado. Imprime <code>Hola, *Ana*</code>.',
    },
    {
      texto: 'Convertir el argumento: <code>resaltar([`Hola, ${"Ana"}`])</code>',
      correcta: false,
      porque: 'Ya no falla, pero el valor llega mezclado con el texto: no hay nada que resaltar.',
    },
    {
      texto: 'Cambiar <code>textos.reduce</code> por <code>textos.split("").reduce</code>',
      correcta: false,
      porque: 'Recorrería letra por letra un texto ya armado: se pierde la separación entre texto y valores.',
    },
  ],
};

export const tagsLab = {
  id: 'tags-lab',
  titulo: 'HTML sin sorpresas',
  inicial: `// Escribe el tag html: arma el texto, pero escapa cada VALOR interpolado
// (& → &amp;  < → &lt;  > → &gt;  " → &quot;). El texto fijo no se toca.

const nombre = '<img src=x onerror="alert(1)">';
console.log(html\`<p class="saludo">Hola, \${nombre}</p>\`);
`,
  verificaciones: [
    { texto: 'Escapa el valor y deja intacto el HTML fijo', prueba: 'return __salida.at(-1) === \'<p class="saludo">Hola, &lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>\';' },
    { texto: 'Funciona con varios valores y con números', prueba: 'return html`<b>${"a&b"}</b>${2}` === "<b>a&amp;b</b>2";' },
    { texto: 'Es una función tag: recibe los textos y los valores por separado', prueba: String.raw`return /function\s+html\s*\(\s*\w+\s*,\s*\.\.\.\w+\s*\)|const\s+html\s*=\s*\(\s*\w+\s*,\s*\.\.\.\w+\s*\)/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>function html(textos, ...valores) { … }</code> arriba de todo, y una función que escape un valor.',
    'Escapar: <code>String(v).replaceAll("&amp;", "&amp;amp;").replaceAll("&lt;", "&amp;lt;")</code>… (el <code>&amp;</code> primero).',
    'Armar: <code>textos.reduce((acc, t, i) => acc + escapar(valores[i - 1]) + t)</code>, o un bucle que alterne texto y valor.',
  ] as [string, string, string],
  solucion: `function escapar(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function html(textos, ...valores) {
  let resultado = textos[0];
  valores.forEach((v, i) => {
    resultado += escapar(v) + textos[i + 1];
  });
  return resultado;
}

const nombre = '<img src=x onerror="alert(1)">';
console.log(html\`<p class="saludo">Hola, \${nombre}</p>\`);`,
  explicacion:
    '<p>El texto fijo lo escribió el programador y es de confianza; los valores pueden venir de cualquier lado. Un tag puede tratarlos distinto porque los recibe por separado. Es la idea detrás de las librerías que protegen contra la inyección de HTML y de SQL.</p>',
};
