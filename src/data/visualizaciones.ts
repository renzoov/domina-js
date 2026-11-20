import type { DatosVisualizador } from '../lib/visualizador';

const m = (nombre: string, nota?: string, destacar?: boolean) => ({ nombre, nota, ...(destacar ? { destacar } : {}) });

export const pilaSaludar: DatosVisualizador = {
  codigo: `function saludar(nombre) {
  return \`Hola, \${nombre}!\`;
}

function mostrar() {
  const msg = saludar("Mundo");
  console.log(msg);
}

mostrar();`,
  pasos: [
    {
      lineas: [10, 5],
      pila: [m('mostrar()')],
      consola: [],
      evento: 'entra',
      anotacion: 'entra',
      texto: '<b>mostrar()</b> entra a la pila. El motor empieza a ejecutar su cuerpo desde la línea 5.',
    },
    {
      lineas: [6],
      pila: [m('mostrar()')],
      consola: [],
      evento: 'ejecuta',
      texto: 'Dentro de <code>mostrar()</code>, el motor llega a la línea 6 y encuentra una llamada: <code>saludar("Mundo")</code>.',
    },
    {
      lineas: [1],
      espera: [6],
      pila: [m('mostrar()', 'esperando en la línea 6'), m('saludar()', 'nombre = "Mundo"')],
      consola: [],
      evento: 'entra',
      anotacion: 'entra',
      texto: '<b>saludar()</b> se apila encima de <code>mostrar()</code>. El motor suspende mostrar() y ejecuta saludar().',
      prediccion: {
        pregunta: '¿Qué le pasa a la pila cuando mostrar() llama a saludar()?',
        opciones: ['saludar() se apila encima', 'mostrar() sale y entra saludar()', 'Nada: saludar() corre fuera de la pila'],
        correcta: 0,
        explicacion: 'mostrar() no terminó: queda esperando abajo.',
      },
    },
    {
      lineas: [2],
      espera: [6],
      pila: [m('mostrar()', 'esperando en la línea 6'), m('saludar()', 'nombre = "Mundo"')],
      consola: [],
      evento: 'ejecuta',
      texto: 'saludar() arma el texto <code>"Hola, Mundo!"</code> y lo devuelve con <code>return</code>.',
    },
    {
      lineas: [6],
      pila: [m('mostrar()', 'msg = "Hola, Mundo!"')],
      consola: [],
      evento: 'sale',
      anotacion: 'sale',
      texto: '<b>saludar()</b> terminó y sale de la pila. El motor vuelve a la línea 6 de mostrar() y guarda el resultado en <code>msg</code>.',
      prediccion: {
        pregunta: 'saludar() acaba de hacer return. ¿Qué función queda en la cima de la pila?',
        opciones: ['saludar()', 'mostrar()', 'Ninguna, la pila queda vacía'],
        correcta: 1,
        explicacion: 'La función que hace return sale; la que esperaba abajo vuelve a la cima.',
      },
    },
    {
      lineas: [7],
      pila: [m('mostrar()', 'esperando en la línea 7'), m('console.log()', 'msg = "Hola, Mundo!"')],
      consola: [],
      evento: 'entra',
      anotacion: 'entra',
      texto: '<b>console.log(msg)</b> también es una función, así que entra a la pila encima de mostrar().',
    },
    {
      lineas: [7],
      pila: [m('mostrar()')],
      consola: ['Hola, Mundo!'],
      evento: 'imprime',
      anotacion: 'imprime',
      texto: 'console.log() escribe <code>Hola, Mundo!</code> en la consola y sale de la pila.',
    },
    {
      lineas: [8],
      pila: [],
      consola: ['Hola, Mundo!'],
      evento: 'fin',
      anotacion: 'sale',
      texto: '<b>mostrar()</b> llega a su llave de cierre y sale. La pila queda vacía: el programa terminó.',
      prediccion: {
        pregunta: 'mostrar() llega a su última línea. ¿Cómo queda la pila?',
        opciones: ['Vacía', 'Con mostrar() adentro', 'Con console.log() adentro'],
        correcta: 0,
        explicacion: 'Era la primera en entrar y es la última en salir.',
      },
    },
  ],
};

export const pilaDesborde: DatosVisualizador = {
  codigo: `function cuenta(n) {
  console.log(n);
  cuenta(n + 1);
}

cuenta(1);`,
  pasos: [
    {
      lineas: [6, 1],
      pila: [m('cuenta(1)', 'n = 1')],
      consola: [],
      evento: 'entra',
      anotacion: 'entra',
      texto: '<b>cuenta(1)</b> entra a la pila.',
    },
    {
      lineas: [2],
      pila: [m('cuenta(1)', 'n = 1')],
      consola: ['1'],
      evento: 'imprime',
      texto: 'Imprime <code>1</code>.',
    },
    {
      lineas: [3],
      espera: [3],
      pila: [m('cuenta(1)', 'esperando en la línea 3'), m('cuenta(2)', 'n = 2')],
      consola: ['1'],
      evento: 'entra',
      anotacion: 'entra',
      texto: 'En la línea 3 se llama a sí misma: <b>cuenta(2)</b> se apila encima. cuenta(1) no terminó, queda esperando.',
      prediccion: {
        pregunta: '¿Qué hace cuenta(1) al llegar a la línea 3?',
        opciones: ['Termina y sale de la pila', 'Llama a cuenta(2), que se apila encima', 'Vuelve a la línea 1 sin apilar nada'],
        correcta: 1,
        explicacion: 'Cada llamada, aunque sea a la misma función, es un marco nuevo en la pila.',
      },
    },
    {
      lineas: [2],
      pila: [m('cuenta(1)', 'esperando en la línea 3'), m('cuenta(2)', 'n = 2')],
      consola: ['1', '2'],
      evento: 'imprime',
      texto: 'cuenta(2) imprime <code>2</code>…',
    },
    {
      lineas: [3],
      espera: [3],
      pila: [m('cuenta(1)', 'esperando'), m('cuenta(2)', 'esperando'), m('cuenta(3)', 'n = 3')],
      consola: ['1', '2', '3'],
      evento: 'entra',
      anotacion: 'entra',
      texto: '…y llama a <b>cuenta(3)</b>, que imprime <code>3</code>. Ninguna función termina: la pila solo crece.',
    },
    {
      lineas: [3],
      espera: [3],
      pila: [m('cuenta(1)'), m('cuenta(2)'), m('cuenta(3)'), m('⋮', 'miles de marcos'), m('cuenta(10 000)', 'aprox.')],
      consola: ['1', '2', '3', '…', '10000'],
      evento: 'entra',
      anotacion: '¡no para!',
      texto: 'Así miles de veces. La pila tiene un tamaño máximo; el número exacto depende del motor y del navegador.',
    },
    {
      lineas: [3],
      pila: [],
      consola: ['1', '2', '3', '…', '10000', 'RangeError: Maximum call stack size exceeded'],
      evento: 'error',
      anotacion: '¡desborde!',
      texto: 'La pila se llenó: el motor lanza <b>RangeError: Maximum call stack size exceeded</b> y descarta todos los marcos. Eso es un <em>stack overflow</em>.',
      prediccion: {
        pregunta: 'cuenta() nunca deja de llamarse. ¿Qué termina pasando?',
        opciones: ['Se ejecuta para siempre', 'La pila se llena y el motor lanza un error', 'El navegador la detiene a los 5 segundos'],
        correcta: 1,
        explicacion: 'Cada llamada ocupa memoria en la pila, y la pila tiene un límite.',
      },
    },
  ],
};

export const primerPrograma: DatosVisualizador = {
  codigo: `// Mi primer programa
console.log("¡Hola, mundo!");
console.log("Estoy aprendiendo JavaScript");

console.log(2 + 3);
console.log("2 + 3");`,
  pasos: [
    {
      lineas: [1],
      pila: [],
      consola: [],
      evento: 'inicio',
      texto: 'El motor empieza por la línea 1. Es un <b>comentario</b>: todo lo que va después de <code>//</code> es una nota para personas, y el motor la ignora.',
    },
    {
      lineas: [2],
      pila: [],
      consola: ['¡Hola, mundo!'],
      evento: 'imprime',
      texto: '<b>console.log()</b> muestra en la consola lo que le pases entre paréntesis. El texto va entre comillas.',
    },
    {
      lineas: [3],
      pila: [],
      consola: ['¡Hola, mundo!', 'Estoy aprendiendo JavaScript'],
      evento: 'imprime',
      texto: 'La siguiente línea hace lo mismo con otro texto. Cada <code>console.log</code> escribe en una línea nueva de la consola.',
    },
    {
      lineas: [5],
      pila: [],
      consola: ['¡Hola, mundo!', 'Estoy aprendiendo JavaScript', '5'],
      evento: 'imprime',
      texto: 'La línea 4 está vacía y el motor la salta. En la 5, <code>2 + 3</code> no lleva comillas: es una operación. El motor la calcula primero y muestra el resultado.',
      prediccion: {
        pregunta: '¿Qué muestra console.log(2 + 3)?',
        opciones: ['2 + 3', '5', 'Un error'],
        correcta: 1,
        explicacion: 'Sin comillas, JavaScript calcula la suma.',
      },
    },
    {
      lineas: [6],
      pila: [],
      consola: ['¡Hola, mundo!', 'Estoy aprendiendo JavaScript', '5', '2 + 3'],
      evento: 'imprime',
      texto: 'Con comillas, <code>"2 + 3"</code> es solo texto. El motor no lo calcula: lo muestra tal cual.',
      prediccion: {
        pregunta: '¿Y console.log("2 + 3"), con comillas?',
        opciones: ['5', '2 + 3', 'Un error'],
        correcta: 1,
        explicacion: 'Entre comillas, todo es texto.',
      },
    },
    {
      lineas: [],
      pila: [],
      consola: ['¡Hola, mundo!', 'Estoy aprendiendo JavaScript', '5', '2 + 3'],
      evento: 'fin',
      texto: 'No quedan líneas: el programa terminó. Se ejecutó <b>de arriba hacia abajo</b>, una línea a la vez y en orden.',
    },
  ],
};

export const asiReturn: DatosVisualizador = {
  codigo: `function crearUsuario() {
  return
  {
    nombre: "Ana"
  };
}

console.log(crearUsuario());`,
  pasos: [
    {
      lineas: [8],
      pila: [],
      consola: [],
      evento: 'inicio',
      texto: 'El motor salta la definición de la función y llega a la línea 8: llama a <code>crearUsuario()</code> para mostrar lo que devuelva.',
    },
    {
      lineas: [2],
      pila: [],
      consola: [],
      evento: 'ejecuta',
      texto: 'Dentro de la función, la línea 2 dice solo <code>return</code> y termina. Después de <code>return</code>, un salto de línea <b>siempre</b> corta la sentencia: el motor agrega un punto y coma invisible y lee <code>return;</code>.',
      prediccion: {
        pregunta: 'Con ese punto y coma invisible, ¿qué devuelve crearUsuario()?',
        opciones: ['{ nombre: "Ana" }', 'undefined', 'Un error de sintaxis'],
        correcta: 1,
        explicacion: '<code>return;</code> sin nada después devuelve <code>undefined</code>.',
      },
    },
    {
      lineas: [3, 4, 5],
      pila: [],
      consola: [],
      evento: 'ejecuta',
      texto: 'Las líneas 3 a 5 nunca se ejecutan: quedaron después del <code>return</code>. Para el motor no son un objeto, sino un bloque suelto con una etiqueta llamada <code>nombre</code>.',
    },
    {
      lineas: [8],
      pila: [],
      consola: ['undefined'],
      evento: 'imprime',
      texto: 'De vuelta en la línea 8, <code>console.log</code> recibe <code>undefined</code> y lo imprime. No hubo ningún error: el programa hizo algo distinto de lo que parece.',
    },
    {
      lineas: [2],
      pila: [],
      consola: ['undefined'],
      evento: 'fin',
      texto: 'El arreglo: abre la llave <b>en la misma línea</b> del <code>return</code>, así: <code>return {</code>. Así el motor sabe que la sentencia continúa.',
    },
  ],
};

export const variablesLetConst: DatosVisualizador = {
  codigo: `let puntos = 10;
puntos = puntos + 5;

const VIDAS = 3;
console.log(puntos, VIDAS);

VIDAS = 2;
console.log("fin");`,
  pasos: [
    {
      lineas: [1],
      pila: [m('puntos', 'let · 10', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: '<b>let puntos = 10</b> crea una variable llamada <code>puntos</code> y le da el valor <code>10</code>.',
    },
    {
      lineas: [2],
      pila: [m('puntos', 'let · 15', true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'cambia',
      texto: 'El motor calcula primero la parte de la derecha, <code>puntos + 5</code>, que vale <code>15</code>, y después guarda ese resultado en <code>puntos</code>. Con <code>let</code> se puede reasignar.',
      prediccion: {
        pregunta: '¿Cuánto vale puntos después de la línea 2?',
        opciones: ['10', '15', 'Da error: puntos ya existe'],
        correcta: 1,
        explicacion: 'Primero se calcula 10 + 5 y después se guarda.',
      },
    },
    {
      lineas: [4],
      pila: [m('puntos', 'let · 15'), m('VIDAS', 'const · 3', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: '<b>const VIDAS = 3</b> crea una constante: un nombre cuyo valor no se puede reasignar.',
    },
    {
      lineas: [5],
      pila: [m('puntos', 'let · 15'), m('VIDAS', 'const · 3')],
      consola: ['15 3'],
      evento: 'imprime',
      texto: '<code>console.log</code> muestra los valores actuales de las dos variables.',
    },
    {
      lineas: [7],
      pila: [m('puntos', 'let · 15'), m('VIDAS', 'const · 3', true)],
      consola: ['15 3', 'TypeError: Assignment to constant variable.'],
      evento: 'error',
      anotacion: '¡no!',
      texto: 'Reasignar una <code>const</code> es un <b>error en ejecución</b>: el motor lanza <code>TypeError</code> y el programa se detiene aquí. <code>VIDAS</code> sigue valiendo 3.',
      prediccion: {
        pregunta: '¿Qué pasa en la línea 7, VIDAS = 2?',
        opciones: ['VIDAS pasa a valer 2', 'El motor lanza un TypeError', 'Se ignora en silencio'],
        correcta: 1,
        explicacion: 'Una const no se puede reasignar.',
      },
    },
    {
      lineas: [8],
      pila: [m('puntos', 'let · 15'), m('VIDAS', 'const · 3')],
      consola: ['15 3', 'TypeError: Assignment to constant variable.'],
      evento: 'fin',
      texto: 'La línea 8 nunca se ejecuta: el error detuvo el programa. Si <code>VIDAS</code> tenía que cambiar, debió declararse con <code>let</code>.',
    },
  ],
};

const obj = (nombre: string, nota: string, destacar?: boolean) => ({ nombre, nota, tipo: 'objeto' as const, ...(destacar ? { destacar } : {}) });

export const valorReferencia: DatosVisualizador = {
  codigo: `let a = 10;
let b = a;
b = 20;
console.log(a, b);

const persona = { nombre: "Ana" };
const copia = persona;
copia.nombre = "Luis";
console.log(persona.nombre);`,
  pasos: [
    {
      lineas: [1],
      pila: [m('a', '10', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: '<code>let a = 10</code> guarda el número <code>10</code> en <code>a</code>. Un número es un valor <b>primitivo</b>: cabe entero dentro de la variable.',
    },
    {
      lineas: [2],
      pila: [m('a', '10'), m('b', '10', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'copia',
      texto: '<code>let b = a</code> <b>copia el valor</b>: <code>b</code> recibe su propio 10. Ahora hay dos 10 independientes, uno en cada variable.',
    },
    {
      lineas: [3],
      pila: [m('a', '10'), m('b', '20', true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'cambia',
      texto: 'Cambiar <code>b</code> no toca a <code>a</code>: cada una tiene su copia.',
      prediccion: {
        pregunta: 'Después de b = 20, ¿cuánto vale a?',
        opciones: ['20, cambió junto con b', '10, no se enteró'],
        correcta: 1,
        explicacion: 'Con primitivos, copiar es copiar el valor.',
      },
    },
    {
      lineas: [4],
      pila: [m('a', '10'), m('b', '20')],
      consola: ['10 20'],
      evento: 'imprime',
      texto: 'Se imprime <code>10 20</code>.',
    },
    {
      lineas: [6],
      pila: [m('a', '10'), m('b', '20'), m('persona', '→ objeto #1', true), obj('objeto #1', "{ nombre: 'Ana' }")],
      consola: ['10 20'],
      evento: 'entra',
      anotacion: 'nueva',
      texto: 'Un objeto no cabe dentro de la variable: vive <b>aparte, en memoria</b> (el recuadro punteado). La variable <code>persona</code> guarda una <b>referencia</b>, como una flecha que apunta a él. Lo llamamos objeto #1.',
    },
    {
      lineas: [7],
      pila: [m('a', '10'), m('b', '20'), m('persona', '→ objeto #1'), m('copia', '→ objeto #1', true), obj('objeto #1', "{ nombre: 'Ana' }")],
      consola: ['10 20'],
      evento: 'entra',
      anotacion: 'misma flecha',
      texto: '<code>const copia = persona</code> copia <b>la referencia</b>, no el objeto. Ahora dos nombres apuntan al mismo objeto #1.',
      prediccion: {
        pregunta: 'Después de const copia = persona, ¿cuántos objetos hay en memoria?',
        opciones: ['Dos, uno para cada variable', 'Uno solo, con dos nombres'],
        correcta: 1,
        explicacion: 'Se copió la flecha, no el objeto.',
      },
    },
    {
      lineas: [8],
      pila: [m('a', '10'), m('b', '20'), m('persona', '→ objeto #1'), m('copia', '→ objeto #1'), obj('objeto #1', "{ nombre: 'Luis' }", true)],
      consola: ['10 20'],
      evento: 'ejecuta',
      anotacion: 'cambia',
      texto: '<code>copia.nombre = "Luis"</code> sigue la flecha y cambia el objeto #1. Es el mismo objeto al que apunta <code>persona</code>.',
    },
    {
      lineas: [9],
      pila: [m('a', '10'), m('b', '20'), m('persona', '→ objeto #1'), m('copia', '→ objeto #1'), obj('objeto #1', "{ nombre: 'Luis' }")],
      consola: ['10 20', 'Luis'],
      evento: 'imprime',
      texto: '<code>persona.nombre</code> sigue su flecha hasta el objeto #1 y encuentra <code>"Luis"</code>.',
      prediccion: {
        pregunta: '¿Qué imprime console.log(persona.nombre)?',
        opciones: ['Ana', 'Luis'],
        correcta: 1,
        explicacion: 'persona y copia son dos nombres para el mismo objeto.',
      },
    },
    {
      lineas: [],
      pila: [m('a', '10'), m('b', '20'), m('persona', '→ objeto #1'), m('copia', '→ objeto #1'), obj('objeto #1', "{ nombre: 'Luis' }")],
      consola: ['10 20', 'Luis'],
      evento: 'fin',
      texto: 'La regla: los <b>primitivos se copian por valor</b> y los <b>objetos, por referencia</b>. Para tener un objeto nuevo de verdad hay que copiarlo explícitamente, como verás más abajo.',
    },
  ],
};
