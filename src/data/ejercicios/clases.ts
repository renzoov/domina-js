// Ejercicios de la sección 6: «Clases».

/* ── 6.1 La sintaxis class ─────────────────────────────────── */
export const claseAuto = {
  id: 'clase-auto',
  titulo: 'Moldes para objetos',
  preguntas: [
    {
      pregunta: '¿Para qué sirve el <code>constructor</code> de una clase?',
      opciones: ['Para destruir el objeto', 'Para preparar cada objeto nuevo cuando se crea con <code>new</code>', 'Para heredar'],
      correcta: 1,
      explicacion: 'Se ejecuta una vez por cada <code>new</code>, con los argumentos que le pases, y normalmente guarda los datos en <code>this</code>.',
    },
    {
      pregunta: 'Los métodos escritos dentro de la clase, ¿dónde quedan?',
      opciones: ['Copiados en cada objeto', 'Una sola vez, en el prototipo de la clase', 'En una variable global'],
      correcta: 1,
      explicacion: 'Es exactamente lo que viste en <em>Prototipos</em>: los métodos van a <code>Clase.prototype</code> y todas las instancias los heredan.',
    },
    {
      pregunta: '¿Qué es un método <code>static</code>?',
      opciones: ['Un método que no cambia', 'Un método de la clase misma, no de sus instancias: <code>Clase.metodo()</code>', 'Un método privado'],
      correcta: 1,
      explicacion: 'Se usan para utilidades y fábricas relacionadas con la clase, como <code>Punto.origen()</code> o <code>Array.from()</code>.',
    },
    {
      pregunta: '¿Se puede usar una clase antes de la línea donde se declara?',
      opciones: ['Sí, como las funciones', 'No: las clases están en la zona muerta temporal hasta su línea, como <code>let</code>'],
      correcta: 1,
      explicacion: 'A diferencia de las declaraciones de función, las clases no se elevan completas.',
    },
  ],
};

export const claseOrden = {
  id: 'clase-orden',
  titulo: 'Instancias, prototipo y static',
  codigo: `class Punto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distancia() {
    return Math.hypot(this.x, this.y);
  }
  static origen() {
    return new Punto(0, 0);
  }
}

const p = new Punto(3, 4);
console.log(p.distancia());
console.log(typeof Punto);
console.log(Object.hasOwn(p, "distancia"));
console.log(Punto.origen().x);`,
  salida: ['5', 'function', 'false', '0'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Una clase es, por debajo, una función. <code>distancia</code> no es propia de <code>p</code>: vive en el prototipo. <code>origen</code> es estático: se llama desde la clase y fabrica un punto nuevo.',
};

export const claseDetective = {
  id: 'clase-detective',
  titulo: 'Una clase llamada como función',
  codigo: `class Cuenta {
  constructor(titular) {
    this.titular = titular;
    this.saldo = 0;
  }
}

const c = Cuenta("Ana");
console.log(c.titular);`,
  error: `banco.js:8
const c = Cuenta("Ana");
          ^

TypeError: Class constructor Cuenta cannot be invoked without 'new'`,
  culpable: 8,
  hallazgo:
    'Una clase no se puede llamar como una función normal: hace falta <code>new</code>, que crea el objeto vacío, se lo pasa al constructor como <code>this</code> y lo devuelve.',
  pista: 'El mensaje dice qué falta: <em>without \'new\'</em>.',
  arreglos: [
    {
      texto: 'Crear la instancia con <code>new Cuenta("Ana")</code>',
      correcta: true,
      porque: '<code>new</code> crea el objeto y ejecuta el constructor sobre él. <code>c.titular</code> imprime <code>Ana</code>.',
    },
    {
      texto: 'Cambiar la clase por <code>function Cuenta(titular) { … }</code> y dejar la llamada igual',
      correcta: false,
      porque: 'Ya no da ese error, pero sin <code>new</code> la función no crea ningún objeto: <code>this</code> no es una cuenta nueva y <code>c</code> queda en <code>undefined</code>.',
    },
    {
      texto: '<code>const c = Cuenta.call({}, "Ana");</code>',
      correcta: false,
      porque: 'Las clases tampoco aceptan <code>call</code>: es el mismo <code>TypeError</code>.',
    },
  ],
};

export const claseLab = {
  id: 'clase-lab',
  titulo: 'Un rectángulo con getter',
  inicial: `// Crea la clase Rectangulo:
// - constructor(ancho, alto) que guarde los dos datos
// - un método area() que devuelva ancho * alto
// - un getter perimetro que devuelva 2 * (ancho + alto)

const r = new Rectangulo(3, 4);
console.log(r.area(), r.perimetro);
`,
  verificaciones: [
    { texto: 'Imprime <code>12 14</code>', prueba: 'return __salida.some((l) => l === "12 14");' },
    { texto: 'Funciona con otros tamaños: <code>new Rectangulo(2, 5).area()</code> da <code>10</code>', prueba: 'return new Rectangulo(2, 5).area() === 10;' },
    { texto: '<code>perimetro</code> es un getter, no un método', prueba: 'const d = Object.getOwnPropertyDescriptor(Rectangulo.prototype, "perimetro"); return !!d && typeof d.get === "function" && new Rectangulo(2, 5).perimetro === 14;' },
  ],
  pistas: [
    'Empieza con <code>class Rectangulo { … }</code> arriba de todo: las clases no se pueden usar antes de su línea.',
    'En el constructor: <code>this.ancho = ancho; this.alto = alto;</code>. El método: <code>area() { return this.ancho * this.alto; }</code>',
    'Un getter se escribe con <code>get</code> delante y se usa sin paréntesis: <code>get perimetro() { return 2 * (this.ancho + this.alto); }</code>',
  ] as [string, string, string],
  solucion: `class Rectangulo {
  constructor(ancho, alto) {
    this.ancho = ancho;
    this.alto = alto;
  }

  area() {
    return this.ancho * this.alto;
  }

  get perimetro() {
    return 2 * (this.ancho + this.alto);
  }
}

const r = new Rectangulo(3, 4);
console.log(r.area(), r.perimetro);`,
  explicacion:
    '<p>Un getter se lee como una propiedad pero se calcula en cada lectura: si cambias <code>r.ancho</code>, <code>r.perimetro</code> se actualiza solo. Úsalos para datos derivados de otros.</p>',
};

/* ── 6.2 Campos públicos y privados ───────────────────────── */
export const camposAuto = {
  id: 'campos-auto',
  titulo: 'Lo que se ve y lo que no',
  preguntas: [
    {
      pregunta: '¿Qué hace el <code>#</code> en <code>#saldo = 0</code>?',
      opciones: ['Es un comentario', 'Declara un campo <b>privado</b>: solo se puede usar dentro de la clase', 'Lo convierte en número'],
      correcta: 1,
      explicacion: 'Desde ES2022, los campos con <code>#</code> son privados de verdad: ningún código de afuera puede leerlos ni escribirlos.',
    },
    {
      pregunta: '¿Qué pasa si escribes <code>cuenta.#saldo</code> fuera de la clase?',
      opciones: ['Da <code>undefined</code>', '<code>SyntaxError</code>: el programa ni siquiera arranca', 'Funciona'],
      correcta: 1,
      explicacion: 'La privacidad se comprueba al analizar el código, antes de ejecutarlo.',
    },
    {
      pregunta: '¿Para qué sirve <code>#campo in obj</code>?',
      opciones: ['Para leer el campo', 'Para comprobar, dentro de la clase, si <code>obj</code> es una instancia que tiene ese campo privado', 'Para borrarlo'],
      correcta: 1,
      explicacion: 'Es una forma segura de saber si un objeto fue creado por tu clase, sin <code>try/catch</code>.',
    },
    {
      pregunta: '¿Qué es un bloque <code>static { … }</code>?',
      opciones: ['Un bloque que se ejecuta una vez, cuando se define la clase', 'Un bloque que se ejecuta en cada <code>new</code>', 'Un método'],
      correcta: 0,
      explicacion: 'Sirve para inicializar campos estáticos con lógica más compleja que una expresión.',
    },
  ],
};

export const camposOrden = {
  id: 'campos-orden',
  titulo: 'Privados y estáticos',
  codigo: `class Contador {
  static creados = 0;
  #cuenta = 0;

  constructor() {
    Contador.creados++;
  }
  sumar() {
    return ++this.#cuenta;
  }
  static esContador(obj) {
    return #cuenta in obj;
  }
}

const a = new Contador();
a.sumar();
a.sumar();
new Contador();

console.log(a.sumar());
console.log(Contador.creados);
console.log(Contador.esContador(a), Contador.esContador({}));
console.log(Object.keys(a).length);`,
  salida: ['3', '2', 'true false', '0'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'Cada instancia tiene su propio <code>#cuenta</code>, y <code>a</code> ya había sumado dos veces. <code>creados</code> es de la clase, compartido: se crearon dos. Los campos privados no aparecen en <code>Object.keys</code>.',
};

export const camposDetective = {
  id: 'campos-detective',
  titulo: 'Espiar un campo privado',
  codigo: `class Billetera {
  #saldo = 100;
  gastar(monto) {
    this.#saldo -= monto;
  }
}

const mia = new Billetera();
mia.gastar(30);
console.log(mia.#saldo);`,
  error: `billetera.js:10
console.log(mia.#saldo);
               ^

SyntaxError: Private field '#saldo' must be declared in an enclosing class`,
  culpable: 10,
  hallazgo:
    '<code>#saldo</code> es privado: solo existe para el código escrito <b>dentro</b> de <code>Billetera</code>. Es un <code>SyntaxError</code>, así que ninguna línea llegó a ejecutarse, ni siquiera el <code>gastar</code>.',
  pista: 'El mensaje dice dónde debe estar el código que use <code>#saldo</code>: <em>in an enclosing class</em>.',
  arreglos: [
    {
      texto: 'Leerlo con corchetes: <code>mia["#saldo"]</code>',
      correcta: false,
      porque: 'No da error, pero busca una propiedad pública llamada <code>"#saldo"</code>, que no existe: imprime <code>undefined</code>.',
    },
    {
      texto: 'Agregar un getter en la clase, <code>get saldo() { return this.#saldo; }</code>, y leer <code>mia.saldo</code>',
      correcta: true,
      porque: 'Expones el valor para leerlo, pero nadie puede cambiarlo desde afuera. Imprime 70.',
    },
    {
      texto: 'Quitar el <code>#</code> y dejar <code>saldo = 100</code>',
      correcta: false,
      porque: 'Funciona, pero cualquier parte del programa podría escribir <code>mia.saldo = 1000000</code>. Pierdes justo la protección que buscabas.',
    },
  ],
};

export const camposLab = {
  id: 'campos-lab',
  titulo: 'Un saldo que nadie puede tocar',
  inicial: `class CuentaBancaria {
  saldo = 0;

  depositar(monto) {
    this.saldo += monto;
  }
}

const cuenta = new CuentaBancaria();
cuenta.depositar(50);
cuenta.saldo = 1000000; // ¡cualquiera puede hacer esto!
console.log(cuenta.saldo);
`,
  verificaciones: [
    { texto: 'Imprime <code>50</code>: la asignación de afuera no tiene efecto', prueba: 'return __salida.at(-1) === "50";' },
    { texto: 'El saldo es un campo privado <code>#saldo</code>', prueba: String.raw`return /#saldo\b/.test(__codigo) && Object.keys(new CuentaBancaria()).length === 0;` },
    { texto: 'Se puede leer y depositar: tras <code>depositar(10)</code>, <code>saldo</code> sube 10', prueba: 'const c = new CuentaBancaria(); c.depositar(10); return c.saldo === 10;' },
  ],
  pistas: [
    'Cambia el campo por <code>#saldo = 0;</code> y usa <code>this.#saldo</code> dentro de <code>depositar</code>.',
    'Para poder leerlo desde afuera, agrega un getter: <code>get saldo() { return this.#saldo; }</code>',
    'Sin setter, <code>cuenta.saldo = 1000000</code> no puede cambiar nada. Deja esa línea: sirve para comprobarlo.',
  ] as [string, string, string],
  solucion: `class CuentaBancaria {
  #saldo = 0;

  get saldo() {
    return this.#saldo;
  }

  depositar(monto) {
    this.#saldo += monto;
  }
}

const cuenta = new CuentaBancaria();
cuenta.depositar(50);
cuenta.saldo = 1000000; // ¡cualquiera puede hacer esto!
console.log(cuenta.saldo);`,
  explicacion:
    '<p>Campo privado + getter es el patrón para datos de <b>solo lectura</b> hacia afuera. La única forma de cambiar el saldo es <code>depositar</code>, que es donde pondrías las validaciones. (En modo estricto, como en un módulo, la asignación de afuera lanzaría un <code>TypeError</code> en lugar de ignorarse.)</p>',
};

/* ── 6.3 Herencia ─────────────────────────────────────────── */
export const herenciaAuto = {
  id: 'herencia-auto',
  titulo: 'extends y super',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>class Perro extends Animal</code>?',
      opciones: ['Copia todo <code>Animal</code> en <code>Perro</code>', 'Enlaza el prototipo de <code>Perro</code> con el de <code>Animal</code>: los perros heredan sus métodos', 'Crea un perro'],
      correcta: 1,
      explicacion: 'Es la cadena de prototipos con mejor sintaxis: <code>Perro.prototype</code> → <code>Animal.prototype</code> → <code>Object.prototype</code>.',
    },
    {
      pregunta: 'En el constructor de una clase hija, ¿cuándo hay que llamar a <code>super()</code>?',
      opciones: ['Al final', 'Antes de usar <code>this</code>', 'Nunca'],
      correcta: 1,
      explicacion: 'El objeto lo crea el constructor de la clase padre: hasta que no se llama a <code>super()</code>, <code>this</code> no existe.',
    },
    {
      pregunta: '¿Qué hace <code>super.hablar()</code> dentro de un método?',
      opciones: ['Llama a la versión de <code>hablar</code> de la clase padre', 'Llama al <code>hablar</code> de la propia clase', 'Da error'],
      correcta: 0,
      explicacion: 'Permite <b>extender</b> un método en lugar de reemplazarlo por completo.',
    },
    {
      pregunta: '<code>rex instanceof Animal</code>, si <code>rex</code> es un <code>Perro</code>, ¿qué da?',
      opciones: ['<code>false</code>', '<code>true</code>: <code>Animal.prototype</code> está en su cadena'],
      correcta: 1,
      explicacion: '<code>instanceof</code> recorre la cadena de prototipos buscando el <code>prototype</code> de la clase.',
    },
  ],
};

export const herenciaOrden = {
  id: 'herencia-orden',
  titulo: 'Extender un método',
  codigo: `class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }
  hablar() {
    return \`\${this.nombre} hace un sonido\`;
  }
}

class Perro extends Animal {
  hablar() {
    return \`\${super.hablar()}: ¡guau!\`;
  }
}

const rex = new Perro("Rex");
console.log(rex.hablar());
console.log(rex instanceof Animal);
console.log(Object.getPrototypeOf(Perro.prototype) === Animal.prototype);
console.log(new Animal("Gato").hablar());`,
  salida: ['Rex hace un sonido: ¡guau!', 'true', 'true', 'Gato hace un sonido'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>Perro</code> no tiene constructor propio, así que usa el de <code>Animal</code>. Su <code>hablar</code> llama al del padre con <code>super</code> y le agrega algo. El animal genérico sigue usando su versión.',
};

export const herenciaDetective = {
  id: 'herencia-detective',
  titulo: 'this antes de super',
  codigo: `class Vehiculo {
  constructor(ruedas) {
    this.ruedas = ruedas;
  }
}

class Moto extends Vehiculo {
  constructor(marca) {
    this.marca = marca;
    super(2);
  }
}

const m = new Moto("Honda");`,
  error: `vehiculos.js:9
    this.marca = marca;
    ^

ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor`,
  culpable: 9,
  hallazgo:
    'En una clase hija, el objeto lo crea el constructor del padre. Hasta que se llama a <code>super()</code>, <code>this</code> no existe, y la línea 9 intenta usarlo antes.',
  pista: 'El mensaje pide llamar a <code>super</code> <em>before accessing \'this\'</em>. ¿Qué línea usa <code>this</code> antes de <code>super</code>?',
  arreglos: [
    {
      texto: 'Mover <code>super(2);</code> a la primera línea del constructor',
      correcta: true,
      porque: 'Primero el padre crea el objeto y le pone <code>ruedas</code>; después la moto le agrega su <code>marca</code>.',
    },
    {
      texto: 'Borrar la línea <code>super(2);</code>',
      correcta: false,
      porque: 'Sigue siendo obligatorio llamar a <code>super</code> en una clase hija con constructor: mismo error.',
    },
    {
      texto: 'Borrar todo el constructor de <code>Moto</code>',
      correcta: false,
      porque: 'Ya no da error, pero el constructor del padre recibe <code>"Honda"</code> como <code>ruedas</code> y la moto no tiene <code>marca</code>.',
    },
  ],
};

export const herenciaLab = {
  id: 'herencia-lab',
  titulo: 'Un error propio',
  inicial: `// Crea la clase ErrorDeValidacion, que extienda Error.
// Su constructor recibe (campo, mensaje): llama a super(mensaje),
// guarda this.campo y pone this.name = "ErrorDeValidacion".

try {
  throw new ErrorDeValidacion("email", "El email no es válido");
} catch (error) {
  console.log(error.name, error.campo, error.message);
}
`,
  verificaciones: [
    { texto: 'Imprime <code>ErrorDeValidacion email El email no es válido</code>', prueba: 'return __salida.some((l) => l === "ErrorDeValidacion email El email no es válido");' },
    { texto: 'Es un <code>Error</code> de verdad: <code>instanceof Error</code> da <code>true</code>', prueba: 'return new ErrorDeValidacion("a", "b") instanceof Error;' },
    { texto: 'Usa <code>extends Error</code> y <code>super(mensaje)</code>', prueba: String.raw`return /extends\s+Error\b/.test(__codigo) && /super\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Empieza con <code>class ErrorDeValidacion extends Error { … }</code> arriba de todo.',
    'En el constructor, lo primero: <code>super(mensaje);</code>. Así <code>message</code> queda guardado como en cualquier error.',
    'Después: <code>this.campo = campo;</code> y <code>this.name = "ErrorDeValidacion";</code>',
  ] as [string, string, string],
  solucion: `class ErrorDeValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.campo = campo;
    this.name = "ErrorDeValidacion";
  }
}

try {
  throw new ErrorDeValidacion("email", "El email no es válido");
} catch (error) {
  console.log(error.name, error.campo, error.message);
}`,
  explicacion:
    '<p>Extender <code>Error</code> es uno de los mejores usos de la herencia: tu error se comporta como cualquier otro (tiene <code>message</code> y <code>stack</code>, y funciona con <code>instanceof</code>), y además lleva datos propios, como el <code>campo</code> que falló.</p>',
};

/* ── 6.4 Composición frente a herencia ────────────────────── */
export const composicionAuto = {
  id: 'composicion-auto',
  titulo: '«Es un» o «tiene un»',
  preguntas: [
    {
      pregunta: '¿Cuándo tiene sentido la herencia?',
      opciones: ['Siempre que dos clases compartan código', 'Cuando la hija <b>es un</b> tipo de la padre en todo, sin excepciones', 'Nunca'],
      correcta: 1,
      explicacion: 'Si tienes que anular métodos del padre para que "no hagan nada" o lancen errores, la relación no es "es un".',
    },
    {
      pregunta: '¿Qué es la <b>composición</b>?',
      opciones: ['Escribir clases muy largas', 'Construir un objeto juntando piezas o capacidades independientes', 'Heredar de varias clases a la vez'],
      correcta: 1,
      explicacion: 'Un auto <b>tiene un</b> motor, no <b>es un</b> motor. Combinas capacidades en lugar de encadenar herencias.',
    },
    {
      pregunta: '¿Qué problema tienen las jerarquías de herencia profundas?',
      opciones: ['Son lentas', 'Son rígidas: un cambio en una clase de arriba afecta a todas las de abajo', 'No tienen ninguno'],
      correcta: 1,
      explicacion: 'Se conoce como el problema de la clase base frágil. Además, obligan a clasificar todo en un solo árbol.',
    },
    {
      pregunta: '¿Puede una clase de JavaScript extender dos clases a la vez?',
      opciones: ['Sí', 'No: <code>extends</code> acepta una sola; para combinar capacidades se usa composición'],
      correcta: 1,
      explicacion: 'Las funciones que agregan capacidades (a veces llamadas <em>mixins</em>) son la alternativa habitual.',
    },
  ],
};

export const composicionOrden = {
  id: 'composicion-orden',
  titulo: 'Sumar capacidades',
  codigo: `const puedeNadar = (obj) => ({ ...obj, nadar: () => \`\${obj.nombre} nada\` });
const puedeVolar = (obj) => ({ ...obj, volar: () => \`\${obj.nombre} vuela\` });

const pato = puedeVolar(puedeNadar({ nombre: "Pato" }));
const pez = puedeNadar({ nombre: "Pez" });

console.log(pato.nadar());
console.log(pato.volar());
console.log("volar" in pez);
console.log(Object.keys(pato).join(","));`,
  salida: ['Pato nada', 'Pato vuela', 'false', 'nombre,nadar,volar'],
  inicio: [1, 3, 0, 2],
  explicacion:
    'Cada función agrega una capacidad a un objeto nuevo. El pato recibe las dos; el pez, solo nadar. No hizo falta decidir si un pato es "más ave" o "más animal acuático".',
};

export const composicionDetective = {
  id: 'composicion-detective',
  titulo: 'Un pingüino que no vuela',
  codigo: `class Ave {
  volar() { return "vuela alto"; }
}
class Pinguino extends Ave {
  volar() { throw new Error("Los pingüinos no vuelan"); }
}

const aves = [new Ave(), new Pinguino()];
for (const ave of aves) {
  console.log(ave.volar());
}`,
  error: `vuela alto
aves.js:5
  volar() { throw new Error("Los pingüinos no vuelan"); }
            ^

Error: Los pingüinos no vuelan`,
  culpable: 4,
  hallazgo:
    'El error se lanza en la línea 5, pero el problema es de diseño, en la 4: <code>Pinguino extends Ave</code> promete que un pingüino puede hacer todo lo que hace un ave, incluido volar. No es cierto, y el código que confía en esa promesa se rompe.',
  pista: 'El bucle trata a todas las aves por igual, como debería poder hacerlo. ¿Qué relación hace la promesa que el pingüino no cumple?',
  arreglos: [
    {
      texto: 'Rodear el <code>console.log</code> con <code>try/catch</code>',
      correcta: false,
      porque: 'Esconde el síntoma. Cada lugar del programa que use aves tendría que acordarse de protegerse.',
    },
    {
      texto: 'Hacer que el <code>volar</code> del pingüino devuelva <code>""</code>',
      correcta: false,
      porque: 'Ahora el pingüino "vuela" en silencio: el programa miente sobre lo que puede hacer.',
    },
    {
      texto: 'Dar la capacidad de volar solo a quien la tiene: <code>const golondrina = puedeVolar({ nombre: "Golondrina" })</code>, y no heredarla',
      correcta: true,
      porque: 'Con composición, cada objeto tiene exactamente las capacidades que le corresponden, y el código pregunta por ellas en lugar de suponerlas.',
    },
  ],
};

export const composicionLab = {
  id: 'composicion-lab',
  titulo: 'Un personaje por piezas',
  inicial: `const conEnergia = (obj) => ({ ...obj, energia: 100 });

// Escribe conAtaque(obj): devuelve un objeto NUEVO con todo lo de obj
// y un método atacar() que devuelva "<nombre> ataca".

const guerrero = conAtaque(conEnergia({ nombre: "Lía" }));
console.log(guerrero.atacar(), guerrero.energia);
`,
  verificaciones: [
    { texto: 'Imprime <code>Lía ataca 100</code>', prueba: 'return __salida.some((l) => l === "Lía ataca 100");' },
    { texto: 'Devuelve un objeto nuevo y no modifica el original', prueba: 'const o = { nombre: "X" }; const r = conAtaque(o); return r !== o && !("atacar" in o) && r.atacar() === "X ataca";' },
    { texto: 'Sin clases ni <code>extends</code>', prueba: String.raw`return !/\b(class|extends)\b/.test(__codigo);` },
  ],
  pistas: [
    'Copia el estilo de <code>conEnergia</code>: una flecha que recibe <code>obj</code> y devuelve un objeto con <code>...obj</code>.',
    'Agrégale el método: <code>atacar: () => `${obj.nombre} ataca`</code>',
    '<code>const conAtaque = (obj) => ({ ...obj, atacar: () => `${obj.nombre} ataca` });</code>, antes de crear al guerrero.',
  ] as [string, string, string],
  solucion: `const conEnergia = (obj) => ({ ...obj, energia: 100 });
const conAtaque = (obj) => ({ ...obj, atacar: () => \`\${obj.nombre} ataca\` });

const guerrero = conAtaque(conEnergia({ nombre: "Lía" }));
console.log(guerrero.atacar(), guerrero.energia);`,
  explicacion:
    '<p>Cada función agrega una capacidad, y las combinas como quieras: <code>conAtaque(conEnergia(x))</code>, solo <code>conEnergia(x)</code>… Agregar un mago con <code>conMagia</code> no obliga a reorganizar ninguna jerarquía.</p>',
};

/* ── 6.5 Decorators ───────────────────────────────────────── */
export const decoratorsAuto = {
  id: 'decorators-auto',
  titulo: 'Funciones que envuelven clases',
  preguntas: [
    {
      pregunta: '¿Qué es un <b>decorator</b>?',
      opciones: [
        'Una forma de dar estilo a la página',
        'Una función que recibe una clase o un método y devuelve una versión modificada, aplicada con <code>@nombre</code>',
        'Un tipo de comentario',
      ],
      correcta: 1,
      explicacion: 'Es una función de orden superior con una sintaxis especial: <code>@registrar</code> encima de un método lo pasa por <code>registrar</code>.',
    },
    {
      pregunta: '¿En qué estado están los decorators en JavaScript?',
      opciones: ['Son parte del estándar desde ES2015', 'Son una propuesta de TC39 que todavía no terminó: los navegadores no los ejecutan sin herramientas', 'Fueron descartados'],
      correcta: 1,
      explicacion: 'Están en Stage 2.7. Hoy se usan a través de TypeScript o Babel, que los transforman en código normal.',
    },
    {
      pregunta: 'Los decorators de <code>experimentalDecorators</code> de TypeScript, ¿son iguales a los de la propuesta?',
      opciones: ['Sí', 'No: son una versión antigua, con otra firma; TypeScript 5 también soporta la nueva'],
      correcta: 1,
      explicacion: 'Frameworks como Angular nacieron con la versión antigua. Si empiezas hoy, usa la de la propuesta.',
    },
    {
      pregunta: 'Sin decorators, ¿cómo consigues lo mismo hoy?',
      opciones: ['No se puede', 'Envolviendo la función a mano con una función de orden superior: <code>metodo = registrar(metodo)</code>'],
      correcta: 1,
      explicacion: 'Un decorator es solo una forma más cómoda y declarativa de escribir ese envoltorio.',
    },
  ],
};

export const decoratorsOrden = {
  id: 'decorators-orden',
  titulo: 'Un método envuelto',
  codigo: `function registrar(metodo, contexto) {
  return function (...args) {
    console.log(\`→ \${contexto.name}(\${args.join(", ")})\`);
    const resultado = metodo.apply(this, args);
    console.log(\`← \${resultado}\`);
    return resultado;
  };
}

class Calculadora {
  @registrar
  sumar(a, b) {
    return a + b;
  }
}

console.log("total:", new Calculadora().sumar(2, 3));`,
  salida: ['→ sumar(2, 3)', '← 5', 'total: 5'],
  inicio: [2, 0, 1],
  explicacion:
    '<code>@registrar</code> reemplaza <code>sumar</code> por la función que devuelve <code>registrar</code>. Al llamarla, imprime la entrada, ejecuta el método original, imprime la salida y devuelve el resultado, que recién entonces llega al <code>console.log</code> de afuera. (Este código necesita TypeScript o Babel para ejecutarse.)',
};

export const decoratorsDetective = {
  id: 'decorators-detective',
  titulo: 'Un decorator en el navegador',
  codigo: `function registrar(metodo) {
  return metodo;
}

class Servicio {
  @registrar
  cargar() {}
}`,
  error: `servicio.js:6
  @registrar
  ^

SyntaxError: Invalid or unexpected token`,
  culpable: 6,
  hallazgo:
    'Los decorators todavía son una propuesta: los motores de JavaScript no reconocen la <code>@</code>. Este código funciona en un proyecto con TypeScript o Babel, pero no directamente en el navegador ni en Node.js.',
  pista: 'El motor no entiende un carácter de la línea 6. ¿Esa sintaxis es parte del estándar actual?',
  arreglos: [
    {
      texto: 'Escribir <code>@registrar()</code> con paréntesis',
      correcta: false,
      porque: 'Sigue siendo sintaxis de decorators: el mismo <code>SyntaxError</code>.',
    },
    {
      texto: 'Quitar la línea 6 y envolver el método a mano después de la clase: <code>Servicio.prototype.cargar = registrar(Servicio.prototype.cargar);</code>',
      correcta: true,
      porque: 'Es exactamente lo que haría el decorator, con JavaScript de hoy. La otra opción es compilar el proyecto con TypeScript o Babel.',
    },
    {
      texto: 'Agregar <code>"use strict"</code> al principio del archivo',
      correcta: false,
      porque: 'El modo estricto no agrega sintaxis nueva: la <code>@</code> sigue sin existir para el motor.',
    },
  ],
};

export const decoratorsLab = {
  id: 'decorators-lab',
  titulo: 'Un decorator sin @',
  inicial: `// Escribe registrar(fn): devuelve una función NUEVA que, al llamarla,
// imprime "llamada con: " y los argumentos separados por ", ",
// y devuelve lo mismo que fn.

const sumar = (a, b) => a + b;
const sumarConRegistro = registrar(sumar);

console.log(sumarConRegistro(2, 3));
`,
  verificaciones: [
    { texto: 'Imprime <code>llamada con: 2, 3</code> y después <code>5</code>', prueba: 'return __salida.join("|") === "llamada con: 2, 3|5";' },
    { texto: 'Devuelve el resultado de cualquier función envuelta', prueba: 'return registrar((x) => x * 2)(4) === 8;' },
    { texto: 'No ejecuta <code>fn</code> hasta que se llama a la función envuelta', prueba: 'let n = 0; registrar(() => n++); return n === 0;' },
  ],
  pistas: [
    'Empieza con <code>function registrar(fn) { return function (...args) { … }; }</code> arriba de todo.',
    'Dentro: <code>console.log("llamada con: " + args.join(", "));</code>',
    'Termina devolviendo <code>fn(...args)</code>.',
  ] as [string, string, string],
  solucion: `function registrar(fn) {
  return function (...args) {
    console.log("llamada con: " + args.join(", "));
    return fn(...args);
  };
}

const sumar = (a, b) => a + b;
const sumarConRegistro = registrar(sumar);

console.log(sumarConRegistro(2, 3));`,
  explicacion:
    '<p>Acabas de escribir un decorator: una función que envuelve a otra y le agrega comportamiento sin cambiar su código. Cuando la propuesta termine, podrás aplicarlo a un método con <code>@registrar</code>; hoy se aplica a mano, como en esta línea: <code>registrar(sumar)</code>.</p>',
};
