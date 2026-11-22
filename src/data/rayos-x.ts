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
];
