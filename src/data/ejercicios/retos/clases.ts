// Reto del motor de la sección 6: «Clases».

export const retoClasesAuto = {
  id: 'reto-clases-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>class Punto {}</code><br><code>console.log(typeof Punto);</code>',
      opciones: ['<code>"class"</code>', '<code>"object"</code>', '<code>"function"</code>'],
      correcta: 2,
      explicacion: 'Una clase es, por debajo, una función constructora con su prototipo. La sintaxis <code>class</code> la hace más clara y agrega reglas (por ejemplo, no se puede llamar sin <code>new</code>).',
    },
    {
      pregunta: '¿Qué pasa?<br><code>class Perro extends Animal {</code><br><code>&nbsp;&nbsp;constructor() { this.patas = 4; super(); }</code><br><code>}</code><br><code>new Perro();</code>',
      opciones: ['Funciona', '<code>ReferenceError</code>: hay que llamar a <code>super()</code> antes de usar <code>this</code>', '<code>patas</code> queda en <code>undefined</code>'],
      correcta: 1,
      explicacion: 'En una clase hija, el objeto lo crea el constructor de la clase padre. Hasta que <code>super()</code> no termina, <code>this</code> no existe.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>class Caja { get doble() { return 2 * 3; } }</code><br><code>console.log(new Caja().doble);</code>',
      opciones: ['<code>6</code>', '<code>[Function: doble]</code>', '<code>undefined</code>'],
      correcta: 0,
      explicacion: 'Un getter se lee como una propiedad, sin paréntesis, pero ejecuta su función cada vez.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>class Animal {}</code><br><code>class Perro extends Animal {}</code><br><code>console.log(new Perro() instanceof Animal);</code>',
      opciones: ['<code>true</code>', '<code>false</code>', '<code>TypeError</code>'],
      correcta: 0,
      explicacion: '<code>instanceof</code> recorre la cadena de prototipos: <code>Animal.prototype</code> está en la cadena de cualquier <code>Perro</code>.',
    },
    {
      pregunta: '<code>class Cuenta { #saldo = 0; }</code><br>¿Qué pasa con <code>new Cuenta().#saldo</code> escrito <b>fuera</b> de la clase?',
      opciones: ['Devuelve <code>0</code>', 'Devuelve <code>undefined</code>', 'Es un <code>SyntaxError</code>: el programa ni siquiera arranca'],
      correcta: 2,
      explicacion: 'Los campos privados se comprueban al leer el código, no al ejecutarlo: nombrar <code>#saldo</code> fuera de su clase es un error de sintaxis.',
    },
  ],
};

export const retoClasesOrden = {
  id: 'reto-clases-orden',
  titulo: 'Constructores en cadena',
  codigo: `class Animal {
  constructor(nombre) {
    this.nombre = nombre;
    console.log("Animal:", nombre);
  }
  hablar() {
    return "...";
  }
}

class Perro extends Animal {
  constructor(nombre) {
    super(nombre);
    console.log("Perro:", this.nombre);
  }
  hablar() {
    return super.hablar() + " ¡guau!";
  }
}

const toby = new Perro("Toby");
console.log(toby.hablar());
console.log(Object.getPrototypeOf(Perro) === Animal);`,
  salida: ['Animal: Toby', 'Perro: Toby', '... ¡guau!', 'true'],
  inicio: [1, 3, 2, 0],
  explicacion:
    '<code>super(nombre)</code> ejecuta primero el constructor de <code>Animal</code>, y recién después sigue el de <code>Perro</code>, que ya puede usar <code>this</code>. <code>super.hablar()</code> llama al método de la clase padre. Y las clases también se enlazan entre sí: el prototipo de <code>Perro</code> es <code>Animal</code>, así heredan hasta los métodos estáticos.',
};

export const retoClasesDetective = {
  id: 'reto-clases-detective',
  titulo: 'Un secreto que ni la hija conoce',
  codigo: `class Cuenta {
  #saldo = 0;
  depositar(monto) {
    this.#saldo += monto;
  }
}

class CuentaAhorro extends Cuenta {
  intereses() {
    return this.#saldo * 0.05;
  }
}`,
  error: `app.js:10
    return this.#saldo * 0.05;
               ^

SyntaxError: Private field '#saldo' must be declared in an enclosing class`,
  culpable: 10,
  hallazgo:
    'Un campo privado es privado <b>de su clase</b>, no de su familia: <code>CuentaAhorro</code> hereda de <code>Cuenta</code>, pero no puede nombrar <code>#saldo</code>. Y como es un error de sintaxis, el programa no llega a ejecutarse.',
  pista: 'El mensaje dice que <code>#saldo</code> tiene que estar declarado en una clase que encierre esa línea. ¿En qué clase está la línea 10?',
  arreglos: [
    {
      texto: 'Agregar en <code>Cuenta</code> un getter <code>get saldo() { return this.#saldo; }</code> y usar <code>this.saldo</code> en la línea 10',
      correcta: true,
      porque: '<code>Cuenta</code> decide qué muestra hacia afuera: el getter deja leer el saldo, también desde las clases hijas, sin que nadie pueda cambiarlo directamente.',
    },
    {
      texto: 'Declarar <code>#saldo = 0;</code> también en <code>CuentaAhorro</code>',
      correcta: false,
      porque: 'Arranca, pero es <b>otro</b> campo privado con el mismo nombre: <code>depositar</code> suma en el de <code>Cuenta</code>, y <code>intereses</code> lee el de <code>CuentaAhorro</code>, que siempre vale <code>0</code>.',
    },
    {
      texto: 'Cambiar la línea 10 por <code>return this.saldo * 0.05;</code>, sin tocar nada más',
      correcta: false,
      porque: '<code>this.saldo</code> es una propiedad pública que no existe: vale <code>undefined</code>, y el resultado es <code>NaN</code>.',
    },
  ],
};

export const retoClasesLab = {
  id: 'reto-clases-lab',
  titulo: 'Una pila con límite',
  inicial: `// Escribe la clase PilaLimitada:
//   new PilaLimitada(limite)  → una pila vacía que admite hasta "limite" elementos
//   apilar(valor)             → lo agrega arriba; si está llena, lanza un RangeError
//   desapilar()               → quita y devuelve el de arriba (undefined si está vacía)
//   tamaño                    → cuántos elementos tiene (un getter, sin paréntesis)
// Los elementos deben ser privados.

const pila = new PilaLimitada(2);
pila.apilar("a");
pila.apilar("b");
console.log(pila.tamaño);
console.log(pila.desapilar());
`,
  verificaciones: [
    { texto: 'Imprime <code>2</code> y después <code>b</code>', prueba: 'return __salida.join("|") === "2|b";' },
    { texto: 'Lanza un <code>RangeError</code> al apilar en una pila llena', prueba: 'const p = new PilaLimitada(1); p.apilar(1); try { p.apilar(2); return false; } catch (e) { return e instanceof RangeError && p.tamaño === 1; }' },
    { texto: '<code>desapilar()</code> en una pila vacía devuelve <code>undefined</code>', prueba: 'return new PilaLimitada(3).desapilar() === undefined;' },
    { texto: 'Los elementos no se ven desde afuera', prueba: 'const p = new PilaLimitada(3); p.apilar(1); return Object.keys(p).length === 0 && JSON.stringify(p) === "{}";' },
  ],
  pistas: [
    'Guarda los elementos en un campo privado: <code>#items = [];</code>, y el límite en otro: <code>#limite;</code>.',
    'En <code>apilar</code>, antes de agregar: <code>if (this.#items.length &gt;= this.#limite) throw new RangeError("La pila está llena");</code>',
    'El tamaño es un getter: <code>get tamaño() { return this.#items.length; }</code>.',
  ] as [string, string, string],
  solucion: `class PilaLimitada {
  #items = [];
  #limite;

  constructor(limite) {
    this.#limite = limite;
  }

  apilar(valor) {
    if (this.#items.length >= this.#limite) throw new RangeError("La pila está llena");
    this.#items.push(valor);
  }

  desapilar() {
    return this.#items.pop();
  }

  get tamaño() {
    return this.#items.length;
  }
}

const pila = new PilaLimitada(2);
pila.apilar("a");
pila.apilar("b");
console.log(pila.tamaño);
console.log(pila.desapilar());`,
  explicacion:
    '<p>Con los campos privados, nadie puede saltarse el límite haciendo <code>pila.items.push(…)</code>: la única forma de agregar es <code>apilar</code>, que valida. El getter deja leer el tamaño sin dejar cambiarlo. Es la pila de llamadas en pequeño: cuando se llena, un <code>RangeError</code>.</p>',
};
