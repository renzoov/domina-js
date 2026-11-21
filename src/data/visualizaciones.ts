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

export const decimales: DatosVisualizador = {
  codigo: `const a = 0.1;
const b = 0.2;
const suma = a + b;
console.log(suma);
console.log(suma === 0.3);

const centimos = 10 + 20;
console.log(centimos / 100);`,
  pasos: [
    {
      lineas: [1],
      pila: [m('a', '0.1 (en binario: 0.1000000000000000055…)', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: 'Los números se guardan en <b>binario</b>. Así como 1/3 no tiene fin en decimal (0.333…), 0.1 no tiene fin en binario. El motor guarda <b>el número más cercano</b> que puede, que es apenas más que 0.1.',
    },
    {
      lineas: [2],
      pila: [m('a', '0.1 (en binario: 0.1000000000000000055…)'), m('b', '0.2 (en binario: 0.2000000000000000111…)', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: 'Con 0.2 pasa lo mismo: también se guarda una aproximación.',
    },
    {
      lineas: [3],
      pila: [m('a', '0.1 (en binario: 0.1000000000000000055…)'), m('b', '0.2 (en binario: 0.2000000000000000111…)'), m('suma', '0.30000000000000004', true)],
      consola: [],
      evento: 'entra',
      anotacion: '¡ojo!',
      texto: 'Al sumar las dos aproximaciones, los pequeños errores se juntan y el resultado se redondea a <code>0.30000000000000004</code>.',
      prediccion: {
        pregunta: '¿Cuánto vale 0.1 + 0.2 en JavaScript?',
        opciones: ['0.3', '0.30000000000000004', 'Da error'],
        correcta: 1,
        explicacion: 'No es un error de JavaScript: pasa en casi todos los lenguajes, porque usan el mismo formato de números.',
      },
    },
    {
      lineas: [4],
      pila: [m('a', '0.1 (en binario: 0.1000000000000000055…)'), m('b', '0.2 (en binario: 0.2000000000000000111…)'), m('suma', '0.30000000000000004')],
      consola: ['0.30000000000000004'],
      evento: 'imprime',
      texto: '<code>console.log</code> muestra el valor tal como quedó.',
    },
    {
      lineas: [5],
      pila: [m('a', '0.1 (en binario: 0.1000000000000000055…)'), m('b', '0.2 (en binario: 0.2000000000000000111…)'), m('suma', '0.30000000000000004')],
      consola: ['0.30000000000000004', 'false'],
      evento: 'imprime',
      texto: 'Por eso <b>nunca compares decimales con <code>===</code></b>: <code>suma === 0.3</code> da <code>false</code>.',
      prediccion: {
        pregunta: '¿Qué da suma === 0.3?',
        opciones: ['true', 'false'],
        correcta: 1,
        explicacion: '0.30000000000000004 y 0.3 son números distintos.',
      },
    },
    {
      lineas: [7],
      pila: [m('a', '0.1 (en binario: 0.1000000000000000055…)'), m('b', '0.2 (en binario: 0.2000000000000000111…)'), m('suma', '0.30000000000000004'), m('centimos', '30', true)],
      consola: ['0.30000000000000004', 'false'],
      evento: 'entra',
      anotacion: 'enteros',
      texto: 'La solución clásica para dinero: trabajar en <b>céntimos</b>, con números enteros. Los enteros se guardan exactos, así que <code>10 + 20</code> da <code>30</code> sin sorpresas.',
    },
    {
      lineas: [8],
      pila: [m('a', '0.1 (en binario: 0.1000000000000000055…)'), m('b', '0.2 (en binario: 0.2000000000000000111…)'), m('suma', '0.30000000000000004'), m('centimos', '30')],
      consola: ['0.30000000000000004', 'false', '0.3'],
      evento: 'fin',
      texto: 'Solo al final, para mostrarlo, se divide entre 100. Resultado: <code>0.3</code>.',
    },
  ],
};

export const plantillas: DatosVisualizador = {
  codigo: `const nombre = "Ana";
const edad = 30;
const saludo = "Hola, " + nombre + ".";
const plan = \`Hola, \${nombre}. Pronto tendrás \${edad + 1}.\`;
console.log(saludo);
console.log(plan);`,
  pasos: [
    {
      lineas: [1],
      pila: [m('nombre', 'string · "Ana"', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: 'Un texto entre comillas es un <b>string</b>.',
    },
    {
      lineas: [2],
      pila: [m('nombre', 'string · "Ana"'), m('edad', 'number · 30', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: '<code>edad</code> es un número, no un texto.',
    },
    {
      lineas: [3],
      pila: [m('nombre', 'string · "Ana"'), m('edad', 'number · 30'), m('saludo', 'string · "Hola, Ana."', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'pega',
      texto: 'Con <code>+</code> entre textos, el motor los <b>concatena</b>: los pega uno detrás de otro. Funciona, pero con muchas piezas se vuelve difícil de leer.',
    },
    {
      lineas: [4],
      pila: [m('nombre', 'string · "Ana"'), m('edad', 'number · 30'), m('saludo', 'string · "Hola, Ana."'), m('plan', 'string · "Hola, Ana. Pronto tendrás 31."', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'rellena',
      texto: 'Un <b>template literal</b>, entre comillas invertidas, deja huecos con <code>${ }</code>. El motor calcula lo que hay dentro de cada hueco y pone el resultado en su lugar: <code>${nombre}</code> pasa a <code>Ana</code> y <code>${edad + 1}</code> pasa a <code>31</code>.',
      prediccion: {
        pregunta: '¿Qué queda en el lugar de ${edad + 1}?',
        opciones: ['edad + 1', '31', '301'],
        correcta: 1,
        explicacion: 'Dentro de ${ } hay código: se suma el número 30 + 1 y después se convierte a texto.',
      },
    },
    {
      lineas: [5],
      pila: [m('nombre', 'string · "Ana"'), m('edad', 'number · 30'), m('saludo', 'string · "Hola, Ana."'), m('plan', 'string · "Hola, Ana. Pronto tendrás 31."')],
      consola: ['Hola, Ana.'],
      evento: 'imprime',
      texto: 'Se imprime el saludo armado con <code>+</code>.',
    },
    {
      lineas: [6],
      pila: [m('nombre', 'string · "Ana"'), m('edad', 'number · 30'), m('saludo', 'string · "Hola, Ana."'), m('plan', 'string · "Hola, Ana. Pronto tendrás 31."')],
      consola: ['Hola, Ana.', 'Hola, Ana. Pronto tendrás 31.'],
      evento: 'fin',
      texto: 'Y el armado con template literal. Mismo resultado, pero el código se lee como la frase final.',
    },
  ],
};

export const truthyFalsy: DatosVisualizador = {
  codigo: `if (0) console.log("0 cuenta como verdadero");
if ("0") console.log('"0" cuenta como verdadero');
if ("") console.log('"" cuenta como verdadero');
if ([]) console.log("[] cuenta como verdadero");
if (null) console.log("null cuenta como verdadero");
if ("hola") console.log('"hola" cuenta como verdadero');`,
  pasos: [
    {
      lineas: [1],
      pila: [],
      consola: [],
      evento: 'ejecuta',
      texto: '<code>if (valor)</code> ejecuta lo que sigue solo si el valor cuenta como <b>verdadero</b> (<em>truthy</em>). <code>0</code> es uno de los pocos valores <b>falsy</b>: no se imprime nada.',
    },
    {
      lineas: [2],
      pila: [],
      consola: ['"0" cuenta como verdadero'],
      evento: 'imprime',
      texto: '<code>"0"</code> no es el número cero: es un <b>texto con un carácter</b>. Todo texto que no esté vacío es truthy.',
      prediccion: {
        pregunta: '¿Se imprime la línea 2, con el texto "0"?',
        opciones: ['Sí', 'No'],
        correcta: 0,
        explicacion: '"0" es un string no vacío, y todos los strings no vacíos son truthy.',
      },
    },
    {
      lineas: [3],
      pila: [],
      consola: ['"0" cuenta como verdadero'],
      evento: 'ejecuta',
      texto: 'El texto vacío <code>""</code> sí es falsy: no se imprime.',
      prediccion: {
        pregunta: '¿Y con el texto vacío ""?',
        opciones: ['Sí', 'No'],
        correcta: 1,
        explicacion: 'El string vacío es uno de los 8 valores falsy.',
      },
    },
    {
      lineas: [4],
      pila: [],
      consola: ['"0" cuenta como verdadero', '[] cuenta como verdadero'],
      evento: 'imprime',
      texto: 'Un array vacío <code>[]</code> es un <b>objeto</b>, y todos los objetos son truthy, aunque estén vacíos.',
      prediccion: {
        pregunta: '¿Y con un array vacío []?',
        opciones: ['Sí', 'No'],
        correcta: 0,
        explicacion: 'Los objetos, incluidos los arrays vacíos, siempre son truthy.',
      },
    },
    {
      lineas: [5],
      pila: [],
      consola: ['"0" cuenta como verdadero', '[] cuenta como verdadero'],
      evento: 'ejecuta',
      texto: '<code>null</code> es falsy: no se imprime.',
    },
    {
      lineas: [6],
      pila: [],
      consola: ['"0" cuenta como verdadero', '[] cuenta como verdadero', '"hola" cuenta como verdadero'],
      evento: 'fin',
      texto: 'Un texto con contenido es truthy. La regla para recordar: hay <b>8 valores falsy</b>, y todo lo demás es truthy.',
    },
  ],
};

export const simbolos: DatosVisualizador = {
  codigo: `const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2);

const usuario = { nombre: "Ana", [id1]: 123 };
console.log(Object.keys(usuario));
console.log(usuario[id1]);`,
  pasos: [
    {
      lineas: [1],
      pila: [m('id1', 'symbol · Symbol(id), único #1', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nuevo',
      texto: '<code>Symbol("id")</code> crea un valor <b>único</b>. El texto <code>"id"</code> es solo una descripción para reconocerlo al depurar.',
    },
    {
      lineas: [2],
      pila: [m('id1', 'symbol · Symbol(id), único #1'), m('id2', 'symbol · Symbol(id), único #2', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'otro',
      texto: 'Otro <code>Symbol("id")</code> crea <b>otro</b> símbolo distinto, aunque tenga la misma descripción.',
    },
    {
      lineas: [3],
      pila: [m('id1', 'symbol · Symbol(id), único #1'), m('id2', 'symbol · Symbol(id), único #2')],
      consola: ['false'],
      evento: 'imprime',
      texto: 'Por eso <code>id1 === id2</code> es <code>false</code>: cada <code>Symbol()</code> es irrepetible.',
      prediccion: {
        pregunta: '¿Qué da id1 === id2, si los dos se crearon con Symbol("id")?',
        opciones: ['true', 'false'],
        correcta: 1,
        explicacion: 'La descripción no los hace iguales: cada Symbol() es único.',
      },
    },
    {
      lineas: [5],
      pila: [m('id1', 'symbol · Symbol(id), único #1'), m('id2', 'symbol · Symbol(id), único #2'), m('usuario', '→ objeto #1', true), obj('objeto #1', "{ nombre: 'Ana', [Symbol(id)]: 123 }")],
      consola: ['false'],
      evento: 'entra',
      anotacion: 'clave',
      texto: 'Un símbolo puede ser la <b>clave</b> de una propiedad. Se escribe entre corchetes: <code>[id1]: 123</code>.',
    },
    {
      lineas: [6],
      pila: [m('id1', 'symbol · Symbol(id), único #1'), m('id2', 'symbol · Symbol(id), único #2'), m('usuario', '→ objeto #1'), obj('objeto #1', "{ nombre: 'Ana', [Symbol(id)]: 123 }")],
      consola: ['false', "[ 'nombre' ]"],
      evento: 'imprime',
      texto: '<code>Object.keys</code> lista solo las claves de texto. Las claves símbolo quedan <b>ocultas</b> de los recorridos normales y de <code>JSON.stringify</code>.',
      prediccion: {
        pregunta: '¿Qué claves lista Object.keys(usuario)?',
        opciones: ["[ 'nombre' ]", "[ 'nombre', 'id' ]", "[ 'nombre', Symbol(id) ]"],
        correcta: 0,
        explicacion: 'Las claves símbolo no aparecen en Object.keys.',
      },
    },
    {
      lineas: [7],
      pila: [m('id1', 'symbol · Symbol(id), único #1'), m('id2', 'symbol · Symbol(id), único #2'), m('usuario', '→ objeto #1'), obj('objeto #1', "{ nombre: 'Ana', [Symbol(id)]: 123 }")],
      consola: ['false', "[ 'nombre' ]", '123'],
      evento: 'fin',
      texto: 'Pero la propiedad existe: con el símbolo exacto la lees sin problema. Solo quien tiene <code>id1</code> puede encontrarla.',
    },
  ],
};

export const coercion: DatosVisualizador = {
  codigo: `const a = "5";
const b = 2;
console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(Number(a) + b);`,
  pasos: [
    {
      lineas: [1, 2],
      pila: [m('a', 'string · "5"'), m('b', 'number · 2', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'ojo',
      texto: '<code>a</code> parece un número, pero está entre comillas: es un <b>texto</b>. Así llegan, por ejemplo, los datos de un formulario.',
    },
    {
      lineas: [3],
      pila: [m('a', 'string · "5"'), m('b', 'number · 2')],
      consola: ['52'],
      evento: 'imprime',
      texto: 'Si uno de los dos lados de <code>+</code> es texto, <code>+</code> <b>concatena</b>: convierte el 2 en <code>"2"</code> y pega. Resultado: <code>"52"</code>.',
      prediccion: {
        pregunta: '¿Qué imprime "5" + 2?',
        opciones: ['7', '52', 'Un error'],
        correcta: 1,
        explicacion: 'Con un texto de por medio, + pega en lugar de sumar.',
      },
    },
    {
      lineas: [4],
      pila: [m('a', 'string · "5"'), m('b', 'number · 2')],
      consola: ['52', '3'],
      evento: 'imprime',
      texto: '<code>-</code> solo sabe restar números, así que convierte <code>"5"</code> en <code>5</code>. Resultado: <code>3</code>. Es una <b>conversión implícita</b>: el motor la hace sin avisarte.',
      prediccion: {
        pregunta: '¿Y "5" - 2?',
        opciones: ['3', '"5-2"', 'NaN'],
        correcta: 0,
        explicacion: 'El resto de operadores aritméticos convierten el texto a número.',
      },
    },
    {
      lineas: [5],
      pila: [m('a', 'string · "5"'), m('b', 'number · 2')],
      consola: ['52', '3', '10'],
      evento: 'imprime',
      texto: 'Con <code>*</code> pasa lo mismo: <code>"5" * 2</code> da <code>10</code>. Solo <code>+</code> se comporta distinto con textos.',
    },
    {
      lineas: [6],
      pila: [m('a', 'string · "5"'), m('b', 'number · 2')],
      consola: ['52', '3', '10', '7'],
      evento: 'fin',
      texto: 'La forma segura: <b>convertir explícitamente</b> con <code>Number(a)</code> antes de operar. Así el código dice lo que hace, y <code>+</code> suma: <code>7</code>.',
    },
  ],
};

export const operadoresModernos: DatosVisualizador = {
  codigo: `const stock = 0;
const config = {};

console.log(stock || 10);
console.log(stock ?? 10);
console.log(config.tema?.color);

let intentos;
intentos ??= 3;
console.log(intentos);`,
  pasos: [
    {
      lineas: [1, 2],
      pila: [m('stock', 'number · 0'), m('config', '→ objeto #1', true), obj('objeto #1', '{}')],
      consola: [],
      evento: 'entra',
      anotacion: 'nuevas',
      texto: '<code>stock</code> vale <code>0</code>: un valor <b>válido</b> (no queda nada en el almacén). <code>config</code> es un objeto vacío.',
    },
    {
      lineas: [4],
      pila: [m('stock', 'number · 0'), m('config', '→ objeto #1'), obj('objeto #1', '{}')],
      consola: ['10'],
      evento: 'imprime',
      texto: '<code>||</code> devuelve el lado derecho si el izquierdo es <b>falsy</b>. Como <code>0</code> es falsy, el stock real se pierde y aparece <code>10</code>.',
      prediccion: {
        pregunta: '¿Qué imprime stock || 10, si stock vale 0?',
        opciones: ['0', '10'],
        correcta: 1,
        explicacion: '0 es falsy, así que || lo reemplaza.',
      },
    },
    {
      lineas: [5],
      pila: [m('stock', 'number · 0'), m('config', '→ objeto #1'), obj('objeto #1', '{}')],
      consola: ['10', '0'],
      evento: 'imprime',
      texto: '<code>??</code> (ES2020) solo reemplaza <code>null</code> y <code>undefined</code>. El <code>0</code> es un valor real, así que lo respeta.',
      prediccion: {
        pregunta: '¿Y stock ?? 10?',
        opciones: ['0', '10'],
        correcta: 0,
        explicacion: '?? solo reemplaza null y undefined.',
      },
    },
    {
      lineas: [6],
      pila: [m('stock', 'number · 0'), m('config', '→ objeto #1'), obj('objeto #1', '{}')],
      consola: ['10', '0', 'undefined'],
      evento: 'imprime',
      texto: '<code>config.tema</code> no existe. Con <code>?.</code>, en lugar de lanzar <code>TypeError</code> al pedir <code>.color</code>, la expresión se detiene y da <code>undefined</code>.',
      prediccion: {
        pregunta: '¿Qué pasa con config.tema?.color, si config no tiene tema?',
        opciones: ['TypeError', 'undefined', 'null'],
        correcta: 1,
        explicacion: '?. corta la cadena en cuanto encuentra null o undefined.',
      },
    },
    {
      lineas: [8],
      pila: [m('stock', 'number · 0'), m('config', '→ objeto #1'), obj('objeto #1', '{}'), m('intentos', 'undefined', true)],
      consola: ['10', '0', 'undefined'],
      evento: 'entra',
      anotacion: 'sin valor',
      texto: '<code>let intentos;</code> declara la variable sin valor: vale <code>undefined</code>.',
    },
    {
      lineas: [9],
      pila: [m('stock', 'number · 0'), m('config', '→ objeto #1'), obj('objeto #1', '{}'), m('intentos', 'number · 3', true)],
      consola: ['10', '0', 'undefined'],
      evento: 'ejecuta',
      anotacion: 'asigna',
      texto: '<code>intentos ??= 3</code> (ES2021) asigna <b>solo si</b> la variable vale <code>null</code> o <code>undefined</code>. Es un atajo de <code>intentos = intentos ?? 3</code>.',
    },
    {
      lineas: [10],
      pila: [m('stock', 'number · 0'), m('config', '→ objeto #1'), obj('objeto #1', '{}'), m('intentos', 'number · 3')],
      consola: ['10', '0', 'undefined', '3'],
      evento: 'fin',
      texto: 'Resultado: <code>3</code>. Si <code>intentos</code> ya hubiera tenido un valor, aunque fuera <code>0</code>, no se habría tocado.',
    },
  ],
};

export const condicional: DatosVisualizador = {
  codigo: `const nota = 72;

if (nota >= 90) {
  console.log("Sobresaliente");
} else if (nota >= 60) {
  console.log("Aprobado");
} else {
  console.log("Suspendido");
}

console.log("fin");`,
  pasos: [
    {
      lineas: [1],
      pila: [m('nota', 'number · 72', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'nueva',
      texto: '<code>nota</code> vale 72.',
    },
    {
      lineas: [3],
      pila: [m('nota', 'number · 72')],
      consola: [],
      evento: 'ejecuta',
      texto: 'El motor evalúa la primera condición: <code>72 >= 90</code> es <code>false</code>. Se salta ese bloque entero.',
      prediccion: {
        pregunta: '¿Entra en el primer bloque (nota >= 90)?',
        opciones: ['Sí', 'No'],
        correcta: 1,
        explicacion: '72 no es mayor o igual que 90.',
      },
    },
    {
      lineas: [5],
      pila: [m('nota', 'number · 72')],
      consola: [],
      evento: 'ejecuta',
      texto: 'Pasa al <code>else if</code>: <code>72 >= 60</code> es <code>true</code>. Entra en este bloque.',
    },
    {
      lineas: [6],
      pila: [m('nota', 'number · 72')],
      consola: ['Aprobado'],
      evento: 'imprime',
      texto: 'Se ejecuta el bloque del <code>else if</code>.',
    },
    {
      lineas: [7, 8, 9],
      pila: [m('nota', 'number · 72')],
      consola: ['Aprobado'],
      evento: 'ejecuta',
      texto: 'En una cadena <code>if / else if / else</code> se ejecuta <b>como máximo un bloque</b>: el primero cuya condición se cumple. El <code>else</code> se salta sin evaluar nada.',
      prediccion: {
        pregunta: 'Ya se imprimió "Aprobado". ¿Se ejecuta también el else?',
        opciones: ['Sí', 'No'],
        correcta: 1,
        explicacion: 'Solo se ejecuta un bloque de la cadena.',
      },
    },
    {
      lineas: [11],
      pila: [m('nota', 'number · 72')],
      consola: ['Aprobado', 'fin'],
      evento: 'fin',
      texto: 'El programa sigue después de la cadena, con la línea 11.',
    },
  ],
};

export const bucleFor: DatosVisualizador = {
  codigo: `let total = 0;

for (let i = 1; i <= 3; i++) {
  total += i;
}

console.log(total);`,
  pasos: [
    { lineas: [1], pila: [m('total', '0', true)], consola: [], evento: 'entra', anotacion: 'nueva', texto: '<code>total</code> empieza en 0.' },
    {
      lineas: [3],
      pila: [m('total', '0'), m('i', '1', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'inicio',
      texto: 'El <code>for</code> tiene tres partes separadas por <code>;</code>. La primera, <code>let i = 1</code>, se ejecuta <b>una sola vez</b>. Después comprueba la condición: <code>1 <= 3</code> es verdad, así que entra.',
    },
    { lineas: [4], pila: [m('total', '1', true), m('i', '1')], consola: [], evento: 'ejecuta', anotacion: 'vuelta 1', texto: 'Primera vuelta: <code>total += i</code> suma 1. <code>total</code> pasa a 1.' },
    {
      lineas: [3],
      pila: [m('total', '1'), m('i', '2', true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'i++',
      texto: 'Al terminar la vuelta se ejecuta la tercera parte, <code>i++</code>: <code>i</code> pasa a 2. Se vuelve a comprobar la condición: <code>2 <= 3</code>, entra otra vez.',
    },
    { lineas: [4], pila: [m('total', '3', true), m('i', '2')], consola: [], evento: 'ejecuta', anotacion: 'vuelta 2', texto: 'Segunda vuelta: <code>total</code> pasa a 1 + 2 = 3.' },
    { lineas: [3], pila: [m('total', '3'), m('i', '3', true)], consola: [], evento: 'ejecuta', anotacion: 'i++', texto: '<code>i</code> pasa a 3. <code>3 <= 3</code> todavía se cumple.' },
    {
      lineas: [4],
      pila: [m('total', '6', true), m('i', '3')],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'vuelta 3',
      texto: 'Tercera vuelta: <code>total</code> pasa a 3 + 3 = 6.',
    },
    {
      lineas: [3],
      pila: [m('total', '6'), m('i', '4', true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'fin',
      texto: '<code>i</code> pasa a 4 y la condición <code>4 <= 3</code> ya es falsa: el bucle <b>termina</b>. Como <code>i</code> se declaró con <code>let</code> dentro del <code>for</code>, deja de existir al salir.',
      prediccion: {
        pregunta: 'i acaba de llegar a 4. ¿El bucle da otra vuelta?',
        opciones: ['Sí', 'No, la condición ya no se cumple'],
        correcta: 1,
        explicacion: '4 <= 3 es falso, así que el bucle termina.',
      },
    },
    {
      lineas: [7],
      pila: [m('total', '6')],
      consola: ['6'],
      evento: 'fin',
      texto: 'Se imprime <code>6</code>: la suma de 1 + 2 + 3.',
      prediccion: {
        pregunta: '¿Qué imprime console.log(total)?',
        opciones: ['3', '6', '10'],
        correcta: 1,
        explicacion: 'Tres vueltas: 1 + 2 + 3 = 6.',
      },
    },
  ],
};

export const saltos: DatosVisualizador = {
  codigo: `const numeros = [4, -1, 7, 0, 9];

for (const n of numeros) {
  if (n < 0) continue;
  if (n === 0) break;
  console.log(n);
}

console.log("fin");`,
  pasos: [
    { lineas: [3], pila: [m('n', '4', true)], consola: [], evento: 'entra', anotacion: 'vuelta 1', texto: 'Primera vuelta: <code>n</code> vale 4.' },
    { lineas: [6], pila: [m('n', '4')], consola: ['4'], evento: 'imprime', texto: '4 no es negativo ni cero: pasa las dos comprobaciones y se imprime.' },
    {
      lineas: [4],
      pila: [m('n', '-1', true)],
      consola: ['4'],
      evento: 'ejecuta',
      anotacion: 'continue',
      texto: '<code>n</code> vale -1. <code>continue</code> <b>salta el resto de esta vuelta</b> y pasa directo a la siguiente. Las líneas 5 y 6 no se ejecutan.',
      prediccion: {
        pregunta: '¿Se imprime el -1?',
        opciones: ['Sí', 'No'],
        correcta: 1,
        explicacion: 'continue salta el resto de la vuelta, incluido el console.log.',
      },
    },
    { lineas: [3], pila: [m('n', '7', true)], consola: ['4'], evento: 'ejecuta', anotacion: 'vuelta 3', texto: 'El bucle sigue con la siguiente vuelta: <code>n</code> vale 7.' },
    { lineas: [6], pila: [m('n', '7')], consola: ['4', '7'], evento: 'imprime', texto: 'Se imprime 7.' },
    {
      lineas: [5],
      pila: [m('n', '0', true)],
      consola: ['4', '7'],
      evento: 'ejecuta',
      anotacion: 'break',
      texto: '<code>n</code> vale 0. <code>break</code> <b>termina el bucle entero</b>, aunque queden elementos.',
      prediccion: {
        pregunta: 'El bucle llegó a break. ¿Se procesa el 9?',
        opciones: ['Sí, es el siguiente', 'No, el bucle terminó'],
        correcta: 1,
        explicacion: 'break sale del bucle y el programa continúa después de él.',
      },
    },
    { lineas: [9], pila: [], consola: ['4', '7', 'fin'], evento: 'fin', texto: 'El programa sigue después del bucle. El 9 nunca se visitó.' },
  ],
};

export const tryCatch: DatosVisualizador = {
  codigo: `function dividir(a, b) {
  if (b === 0) throw new Error("No se puede dividir entre cero");
  return a / b;
}

try {
  console.log(dividir(10, 2));
  console.log(dividir(1, 0));
  console.log("esto no se imprime");
} catch (error) {
  console.log("Error:", error.message);
} finally {
  console.log("fin");
}`,
  pasos: [
    {
      lineas: [6, 7],
      pila: [],
      consola: ['5'],
      evento: 'imprime',
      texto: 'El bloque <code>try</code> ("intenta") se ejecuta normalmente. <code>dividir(10, 2)</code> devuelve 5.',
    },
    {
      lineas: [8, 2],
      espera: [8],
      pila: [],
      consola: ['5'],
      evento: 'error',
      texto: '<code>dividir(1, 0)</code> llega a la línea 2: como <code>b</code> es 0, <code>throw</code> <b>lanza</b> un error. La función se interrumpe en el acto: nunca llega al <code>return</code>.',
    },
    {
      lineas: [9],
      pila: [],
      consola: ['5'],
      evento: 'ejecuta',
      texto: 'Al lanzarse un error dentro del <code>try</code>, el resto del bloque <b>se salta</b>. La línea 9 no se ejecuta.',
      prediccion: {
        pregunta: '¿Se imprime "esto no se imprime"?',
        opciones: ['Sí, es la siguiente línea', 'No, el error salta al catch'],
        correcta: 1,
        explicacion: 'Un error interrumpe el try y salta directo al catch.',
      },
    },
    {
      lineas: [10, 11],
      pila: [],
      consola: ['5', 'Error: No se puede dividir entre cero'],
      evento: 'imprime',
      texto: 'El error llega al <code>catch</code> ("atrapa"), que lo recibe en la variable <code>error</code>. <code>error.message</code> es el texto que se pasó al crearlo. El programa <b>no se rompe</b>: el error está controlado.',
    },
    {
      lineas: [12, 13],
      pila: [],
      consola: ['5', 'Error: No se puede dividir entre cero', 'fin'],
      evento: 'fin',
      texto: '<code>finally</code> se ejecuta <b>siempre</b>, haya error o no. Es el lugar para limpiar: cerrar un archivo, ocultar un indicador de carga…',
      prediccion: {
        pregunta: 'Si no hubiera habido ningún error, ¿se ejecutaría finally?',
        opciones: ['Sí, siempre se ejecuta', 'No, solo después de un error'],
        correcta: 0,
        explicacion: 'finally corre tanto si todo salió bien como si hubo un error.',
      },
    },
  ],
};

export const hoisting: DatosVisualizador = {
  codigo: `console.log(saludo);
console.log(sumar(2, 3));

var saludo = "hola";
let nombre = "Ana";

function sumar(a, b) {
  return a + b;
}

console.log(nombre);`,
  pasos: [
    {
      lineas: [],
      pila: [m('saludo', 'var · undefined'), m('nombre', 'let · sin inicializar (zona muerta)'), m('sumar', 'function · lista para usar', true)],
      consola: [],
      evento: 'inicio',
      anotacion: 'creación',
      texto: 'Antes de ejecutar la línea 1, el motor crea el <b>contexto de ejecución global</b> y recorre el código buscando declaraciones. <code>var saludo</code> se registra con <code>undefined</code>, <code>let nombre</code> se registra <b>sin inicializar</b> y la función <code>sumar</code> queda <b>completa</b>. A esto se le llama <em>hoisting</em> ("elevación").',
    },
    {
      lineas: [1],
      pila: [m('saludo', 'var · undefined'), m('nombre', 'let · sin inicializar (zona muerta)'), m('sumar', 'function · lista para usar')],
      consola: ['undefined'],
      evento: 'imprime',
      texto: '<code>saludo</code> ya existe, pero todavía vale <code>undefined</code>: la asignación de la línea 4 no ocurrió. No hay error, y por eso este fallo pasa desapercibido.',
      prediccion: {
        pregunta: '¿Qué imprime console.log(saludo) en la línea 1?',
        opciones: ['hola', 'undefined', 'ReferenceError'],
        correcta: 1,
        explicacion: 'var se registra con undefined antes de ejecutar.',
      },
    },
    {
      lineas: [2],
      pila: [m('saludo', 'var · undefined'), m('nombre', 'let · sin inicializar (zona muerta)'), m('sumar', 'function · lista para usar')],
      consola: ['undefined', '5'],
      evento: 'imprime',
      texto: 'Las <b>declaraciones de función</b> se elevan completas: puedes llamar a <code>sumar</code> antes de la línea donde está escrita.',
      prediccion: {
        pregunta: '¿Y sumar(2, 3), que está definida más abajo?',
        opciones: ['5', 'undefined', 'TypeError'],
        correcta: 0,
        explicacion: 'Las declaraciones de función quedan listas en la fase de creación.',
      },
    },
    {
      lineas: [4],
      pila: [m('saludo', 'var · "hola"', true), m('nombre', 'let · sin inicializar (zona muerta)'), m('sumar', 'function · lista para usar')],
      consola: ['undefined', '5'],
      evento: 'ejecuta',
      anotacion: 'asigna',
      texto: 'Ahora sí se ejecuta la asignación: <code>saludo</code> pasa a valer <code>"hola"</code>.',
    },
    {
      lineas: [5],
      pila: [m('saludo', 'var · "hola"'), m('nombre', 'let · "Ana"', true), m('sumar', 'function · lista para usar')],
      consola: ['undefined', '5'],
      evento: 'ejecuta',
      anotacion: 'inicializa',
      texto: '<code>nombre</code> sale de la <b>zona muerta temporal</b> (TDZ): desde aquí se puede usar. Si la hubieras leído antes de esta línea, el motor habría lanzado <code>ReferenceError: Cannot access \'nombre\' before initialization</code>.',
    },
    {
      lineas: [11],
      pila: [m('saludo', 'var · "hola"'), m('nombre', 'let · "Ana"'), m('sumar', 'function · lista para usar')],
      consola: ['undefined', '5', 'Ana'],
      evento: 'fin',
      texto: 'Se imprime <code>Ana</code>. Cada vez que se llama a una función, el motor repite este proceso: crea un <b>contexto nuevo</b> para ella y lo apila en la pila de llamadas.',
    },
  ],
};

export const cadenaScopes: DatosVisualizador = {
  codigo: `const pais = "Perú";

function ciudad() {
  const nombre = "Lima";

  function barrio() {
    const zona = "Miraflores";
    console.log(zona, nombre, pais);
  }

  barrio();
}

ciudad();`,
  pasos: [
    { lineas: [1], pila: [m('pais', 'global · "Perú"', true)], consola: [], evento: 'entra', anotacion: 'global', texto: '<code>pais</code> se declara en el <b>scope global</b>: lo ve todo el programa.' },
    {
      lineas: [14, 4],
      pila: [m('pais', 'global · "Perú"'), m('nombre', 'scope de ciudad() · "Lima"', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'ciudad()',
      texto: 'Al llamar a <code>ciudad()</code> se crea su scope, con <code>nombre</code> adentro. Ese scope está <b>dentro</b> del global.',
    },
    {
      lineas: [11, 7],
      pila: [m('pais', 'global · "Perú"'), m('nombre', 'scope de ciudad() · "Lima"'), m('zona', 'scope de barrio() · "Miraflores"', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'barrio()',
      texto: '<code>barrio()</code> crea un scope más, con <code>zona</code>. Está escrita dentro de <code>ciudad</code>, así que su scope está dentro del de <code>ciudad</code>.',
    },
    {
      lineas: [8],
      pila: [m('pais', 'global · "Perú"'), m('nombre', 'scope de ciudad() · "Lima"'), m('zona', 'scope de barrio() · "Miraflores"', true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'busca zona',
      texto: 'Para imprimir, el motor busca cada nombre empezando por el scope <b>actual</b>. <code>zona</code> está en <code>barrio()</code>: la encuentra enseguida.',
    },
    {
      lineas: [8],
      pila: [m('pais', 'global · "Perú"'), m('nombre', 'scope de ciudad() · "Lima"', true), m('zona', 'scope de barrio() · "Miraflores"')],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'sube',
      texto: '<code>nombre</code> no está en <code>barrio()</code>. El motor <b>sube</b> un nivel, al scope que la rodea, y la encuentra en <code>ciudad()</code>.',
      prediccion: {
        pregunta: '¿Dónde encuentra el motor la variable nombre?',
        opciones: ['En barrio()', 'En ciudad(), un nivel más arriba', 'En el global'],
        correcta: 1,
        explicacion: 'Busca de adentro hacia afuera y se queda con la primera que encuentra.',
      },
    },
    {
      lineas: [8],
      pila: [m('pais', 'global · "Perú"', true), m('nombre', 'scope de ciudad() · "Lima"'), m('zona', 'scope de barrio() · "Miraflores"')],
      consola: ['Miraflores Lima Perú'],
      evento: 'imprime',
      anotacion: 'sube más',
      texto: '<code>pais</code> no está en <code>barrio()</code> ni en <code>ciudad()</code>: sube hasta el <b>global</b>. Ese camino hacia afuera es la <b>cadena de scopes</b>.',
    },
    {
      lineas: [14],
      pila: [m('pais', 'global · "Perú"')],
      consola: ['Miraflores Lima Perú'],
      evento: 'fin',
      texto: 'Al terminar, <code>barrio()</code> y <code>ciudad()</code> salen de la pila y sus scopes desaparecen. Desde el global, <code>nombre</code> y <code>zona</code> nunca se pudieron ver: la búsqueda solo va hacia afuera, nunca hacia adentro.',
    },
  ],
};

export const closureContador: DatosVisualizador = {
  codigo: `function crearContador() {
  let cuenta = 0;
  return function () {
    cuenta++;
    return cuenta;
  };
}

const contar = crearContador();
console.log(contar());
console.log(contar());

const otro = crearContador();
console.log(otro());`,
  pasos: [
    {
      lineas: [9, 2],
      pila: [obj('entorno #1', '{ cuenta: 0 }', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'entorno',
      texto: 'Llamar a <code>crearContador()</code> crea un <b>entorno</b> nuevo con su variable <code>cuenta = 0</code>.',
    },
    {
      lineas: [3, 9],
      pila: [m('contar', '→ función que recuerda el entorno #1', true), obj('entorno #1', '{ cuenta: 0 }')],
      consola: [],
      evento: 'sale',
      anotacion: 'sobrevive',
      texto: '<code>crearContador</code> devuelve una función y termina. Normalmente su entorno desaparecería, pero la función devuelta lo <b>sigue usando</b>, así que el entorno #1 sobrevive. Una función junto con el entorno que recuerda es un <b>closure</b>.',
    },
    {
      lineas: [10, 4],
      pila: [m('contar', '→ función que recuerda el entorno #1'), obj('entorno #1', '{ cuenta: 1 }', true)],
      consola: ['1'],
      evento: 'imprime',
      anotacion: 'cuenta++',
      texto: '<code>contar()</code> ejecuta la función interna, que encuentra <code>cuenta</code> en su entorno recordado, la sube a 1 y la devuelve.',
    },
    {
      lineas: [11, 4],
      pila: [m('contar', '→ función que recuerda el entorno #1'), obj('entorno #1', '{ cuenta: 2 }', true)],
      consola: ['1', '2'],
      evento: 'imprime',
      anotacion: 'cuenta++',
      texto: 'El entorno #1 conserva su valor entre llamadas: <code>cuenta</code> pasa a 2.',
      prediccion: {
        pregunta: '¿Qué imprime el segundo contar()?',
        opciones: ['1, empieza de cero otra vez', '2, recuerda la cuenta anterior'],
        correcta: 1,
        explicacion: 'El entorno #1 sigue vivo y guarda cuenta = 1.',
      },
    },
    {
      lineas: [13],
      pila: [m('contar', '→ función que recuerda el entorno #1'), obj('entorno #1', '{ cuenta: 2 }'), m('otro', '→ función que recuerda el entorno #2', true), obj('entorno #2', '{ cuenta: 0 }')],
      consola: ['1', '2'],
      evento: 'entra',
      anotacion: 'otro entorno',
      texto: 'Una nueva llamada a <code>crearContador()</code> crea un entorno <b>nuevo</b> (#2), con su propia <code>cuenta = 0</code>. Los dos contadores no se ven entre sí.',
    },
    {
      lineas: [14, 4],
      pila: [m('contar', '→ función que recuerda el entorno #1'), obj('entorno #1', '{ cuenta: 2 }'), m('otro', '→ función que recuerda el entorno #2'), obj('entorno #2', '{ cuenta: 1 }', true)],
      consola: ['1', '2', '1'],
      evento: 'fin',
      texto: '<code>otro()</code> usa el entorno #2: imprime 1. Cada closure tiene <b>su propia memoria privada</b>: nadie más puede tocar esas variables.',
      prediccion: {
        pregunta: '¿Qué imprime otro()?',
        opciones: ['3', '1'],
        correcta: 1,
        explicacion: 'otro tiene su propio entorno, que empezó en 0.',
      },
    },
  ],
};

export const recursionFactorial: DatosVisualizador = {
  codigo: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(3));`,
  pasos: [
    { lineas: [6, 1], pila: [m('factorial(3)', 'n = 3')], consola: [], evento: 'entra', anotacion: 'entra', texto: '<b>factorial(3)</b> entra a la pila. Como 3 no es ≤ 1, necesita calcular <code>3 * factorial(2)</code>.' },
    {
      lineas: [3],
      espera: [3],
      pila: [m('factorial(3)', 'espera factorial(2)'), m('factorial(2)', 'n = 2')],
      consola: [],
      evento: 'entra',
      anotacion: 'entra',
      texto: 'Para multiplicar, primero necesita el resultado de <b>factorial(2)</b>, que se apila encima. <code>factorial(3)</code> queda en pausa, con la multiplicación a medio hacer.',
    },
    {
      lineas: [3],
      espera: [3],
      pila: [m('factorial(3)', 'espera factorial(2)'), m('factorial(2)', 'espera factorial(1)'), m('factorial(1)', 'n = 1')],
      consola: [],
      evento: 'entra',
      anotacion: 'entra',
      texto: 'Lo mismo: <b>factorial(1)</b> se apila. La pila crece una llamada por nivel.',
    },
    {
      lineas: [2],
      pila: [m('factorial(3)', 'espera factorial(2)'), m('factorial(2)', 'espera factorial(1)'), m('factorial(1)', 'n = 1 → devuelve 1')],
      consola: [],
      evento: 'ejecuta',
      texto: '<code>1 <= 1</code> se cumple: es el <b>caso base</b>. <code>factorial(1)</code> devuelve 1 <b>sin volver a llamarse</b>. Es lo que detiene la recursión.',
      prediccion: {
        pregunta: '¿factorial(1) se llama a sí misma otra vez?',
        opciones: ['Sí, con factorial(0)', 'No, es el caso base y devuelve 1'],
        correcta: 1,
        explicacion: 'El caso base corta la cadena de llamadas.',
      },
    },
    {
      lineas: [3],
      pila: [m('factorial(3)', 'espera factorial(2)'), m('factorial(2)', 'recibe 1 → 2 * 1 = 2')],
      consola: [],
      evento: 'sale',
      anotacion: 'sale',
      texto: '<code>factorial(1)</code> sale de la pila y su resultado <b>vuelve</b> a quien la llamó. <code>factorial(2)</code> retoma la multiplicación pendiente: 2 * 1 = 2.',
    },
    {
      lineas: [3],
      pila: [m('factorial(3)', 'recibe 2 → 3 * 2 = 6')],
      consola: [],
      evento: 'sale',
      anotacion: 'sale',
      texto: '<code>factorial(2)</code> devuelve 2 y sale. <code>factorial(3)</code> completa: 3 * 2 = 6.',
      prediccion: {
        pregunta: '¿Qué devuelve factorial(3)?',
        opciones: ['3', '6', '9'],
        correcta: 1,
        explicacion: '3 * 2 * 1 = 6.',
      },
    },
    { lineas: [6], pila: [], consola: ['6'], evento: 'fin', anotacion: 'sale', texto: 'La pila queda vacía y se imprime 6. La recursión tiene dos fases: <b>bajar</b>, apilando llamadas hasta el caso base, y <b>subir</b>, resolviendo los resultados pendientes de arriba hacia abajo.' },
  ],
};

export const recolector: DatosVisualizador = {
  codigo: `let usuario = { nombre: "Ana" };
let admin = usuario;

usuario = null;
console.log(admin.nombre);

admin = null;`,
  pasos: [
    {
      lineas: [1],
      pila: [m('usuario', '→ objeto #1', true), obj('objeto #1', "{ nombre: 'Ana' } · 1 referencia")],
      consola: [],
      evento: 'entra',
      anotacion: 'nuevo',
      texto: 'El objeto se crea en el <b>heap</b>, la zona de memoria para objetos. <code>usuario</code> guarda una referencia a él.',
    },
    {
      lineas: [2],
      pila: [m('usuario', '→ objeto #1'), m('admin', '→ objeto #1', true), obj('objeto #1', "{ nombre: 'Ana' } · 2 referencias")],
      consola: [],
      evento: 'entra',
      anotacion: 'otra flecha',
      texto: 'Ahora dos variables apuntan al mismo objeto.',
    },
    {
      lineas: [4],
      pila: [m('usuario', 'null', true), m('admin', '→ objeto #1'), obj('objeto #1', "{ nombre: 'Ana' } · 1 referencia")],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'suelta',
      texto: '<code>usuario = null</code> suelta <b>una</b> de las flechas. El objeto sigue siendo <b>alcanzable</b> a través de <code>admin</code>, así que sigue vivo.',
      prediccion: {
        pregunta: 'Después de usuario = null, ¿se borra el objeto?',
        opciones: ['Sí, ya no hay usuario', 'No, admin todavía lo alcanza'],
        correcta: 1,
        explicacion: 'Un objeto vive mientras alguna referencia permita llegar a él.',
      },
    },
    { lineas: [5], pila: [m('usuario', 'null'), m('admin', '→ objeto #1'), obj('objeto #1', "{ nombre: 'Ana' } · 1 referencia")], consola: ['Ana'], evento: 'imprime', texto: 'Por eso <code>admin.nombre</code> sigue funcionando.' },
    {
      lineas: [7],
      pila: [m('usuario', 'null'), m('admin', 'null', true), obj('objeto #1', "{ nombre: 'Ana' } · inalcanzable")],
      consola: ['Ana'],
      evento: 'ejecuta',
      anotacion: 'sin flechas',
      texto: 'Con <code>admin = null</code> ya no queda <b>ningún camino</b> desde el programa hasta el objeto. Es basura: ocupa memoria y nadie puede volver a usarlo.',
    },
    {
      lineas: [],
      pila: [m('usuario', 'null'), m('admin', 'null')],
      consola: ['Ana'],
      evento: 'fin',
      texto: 'En algún momento, el <b>recolector de basura</b> recorre todo lo alcanzable desde el programa, encuentra el objeto huérfano y libera su memoria. No decides cuándo: lo decide el motor.',
    },
  ],
};

export const objetoLiteral: DatosVisualizador = {
  codigo: `const libro = {
  titulo: "Rayuela",
  paginas: 600,
};

libro.autor = "Cortázar";
libro["paginas"] = 736;
delete libro.paginas;

console.log(libro);`,
  pasos: [
    {
      lineas: [1, 2, 3, 4],
      pila: [m('libro', '→ objeto #1', true), obj('objeto #1', "{ titulo: 'Rayuela', paginas: 600 }")],
      consola: [],
      evento: 'entra',
      anotacion: 'literal',
      texto: 'Las llaves <code>{ }</code> crean un objeto nuevo con dos <b>propiedades</b>: pares de <em>clave: valor</em>. <code>libro</code> guarda una referencia a él.',
    },
    {
      lineas: [6],
      pila: [m('libro', '→ objeto #1'), obj('objeto #1', "{ titulo: 'Rayuela', paginas: 600, autor: 'Cortázar' }", true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'agrega',
      texto: 'Asignar a una propiedad que no existe la <b>crea</b>. Aunque <code>libro</code> es <code>const</code>, el objeto se puede modificar: lo que no puede cambiar es a qué objeto apunta la variable.',
      prediccion: {
        pregunta: 'libro es const. ¿Se puede agregarle una propiedad?',
        opciones: ['No, da TypeError', 'Sí, const solo impide reasignar la variable'],
        correcta: 1,
        explicacion: 'const protege la flecha, no el contenido del objeto.',
      },
    },
    {
      lineas: [7],
      pila: [m('libro', '→ objeto #1'), obj('objeto #1', "{ titulo: 'Rayuela', paginas: 736, autor: 'Cortázar' }", true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'corchetes',
      texto: 'Con <b>corchetes</b> la clave es un texto: <code>libro["paginas"]</code> es lo mismo que <code>libro.paginas</code>. Si la propiedad existe, se reemplaza su valor.',
    },
    {
      lineas: [8],
      pila: [m('libro', '→ objeto #1'), obj('objeto #1', "{ titulo: 'Rayuela', autor: 'Cortázar' }", true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'borra',
      texto: '<code>delete</code> quita la propiedad por completo: la clave deja de existir, no queda con <code>undefined</code>.',
    },
    {
      lineas: [10],
      pila: [m('libro', '→ objeto #1'), obj('objeto #1', "{ titulo: 'Rayuela', autor: 'Cortázar' }")],
      consola: ["{ titulo: 'Rayuela', autor: 'Cortázar' }"],
      evento: 'fin',
      texto: 'Las propiedades aparecen en el orden en que se crearon. El objeto empezó con dos propiedades, ganó una, cambió otra y perdió otra: los objetos son <b>mutables</b>.',
      prediccion: {
        pregunta: '¿Qué propiedades imprime?',
        opciones: ['titulo y paginas', 'titulo, paginas y autor', 'titulo y autor'],
        correcta: 2,
        explicacion: 'paginas se borró con delete.',
      },
    },
  ],
};

export const copias: DatosVisualizador = {
  codigo: `const original = { nombre: "Ana", gustos: ["cine"] };
const copia = { ...original };

copia.nombre = "Eva";
copia.gustos.push("mar");

const profunda = structuredClone(original);
profunda.gustos.push("rock");

console.log(original.gustos);`,
  pasos: [
    {
      lineas: [1],
      pila: [m('original', '→ objeto #1', true), obj('objeto #1', "{ nombre: 'Ana', gustos: → array #2 }"), obj('array #2', "[ 'cine' ]")],
      consola: [],
      evento: 'entra',
      anotacion: 'anidado',
      texto: 'El objeto tiene otro objeto adentro: un array. En realidad son <b>dos</b> objetos en memoria: el #1 guarda una <b>referencia</b> al array #2.',
    },
    {
      lineas: [2],
      pila: [m('original', '→ objeto #1'), m('copia', '→ objeto #3', true), obj('objeto #1', "{ nombre: 'Ana', gustos: → array #2 }"), obj('objeto #3', "{ nombre: 'Ana', gustos: → array #2 }", true), obj('array #2', "[ 'cine' ]")],
      consola: [],
      evento: 'entra',
      anotacion: 'superficial',
      texto: 'El spread crea un objeto <b>nuevo</b> (#3) y copia cada propiedad. Pero <code>gustos</code> es una referencia, y lo que se copia es la referencia: los dos objetos apuntan al <b>mismo</b> array #2. Es una copia <b>superficial</b>.',
    },
    {
      lineas: [4],
      pila: [m('original', '→ objeto #1'), m('copia', '→ objeto #3'), obj('objeto #1', "{ nombre: 'Ana', gustos: → array #2 }"), obj('objeto #3', "{ nombre: 'Eva', gustos: → array #2 }", true), obj('array #2', "[ 'cine' ]")],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'nivel 1',
      texto: 'Cambiar <code>nombre</code> en la copia no afecta al original: en el primer nivel, cada objeto tiene sus propias propiedades.',
    },
    {
      lineas: [5],
      pila: [m('original', '→ objeto #1'), m('copia', '→ objeto #3'), obj('objeto #1', "{ nombre: 'Ana', gustos: → array #2 }"), obj('objeto #3', "{ nombre: 'Eva', gustos: → array #2 }"), obj('array #2', "[ 'cine', 'mar' ]", true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'compartido',
      texto: 'Pero <code>copia.gustos.push</code> modifica el array <b>compartido</b>. El original también "ve" el cambio, porque es el mismo array.',
      prediccion: {
        pregunta: 'Después del push, ¿cuántos gustos tiene original.gustos?',
        opciones: ["Uno: [ 'cine' ]", "Dos: [ 'cine', 'mar' ]"],
        correcta: 1,
        explicacion: 'original y copia comparten el array #2.',
      },
    },
    {
      lineas: [7],
      pila: [m('original', '→ objeto #1'), m('profunda', '→ objeto #4', true), obj('objeto #1', "{ nombre: 'Ana', gustos: → array #2 }"), obj('array #2', "[ 'cine', 'mar' ]"), obj('objeto #4', "{ nombre: 'Ana', gustos: → array #5 }", true), obj('array #5', "[ 'cine', 'mar' ]", true)],
      consola: [],
      evento: 'entra',
      anotacion: 'profunda',
      texto: '<code>structuredClone</code> hace una copia <b>profunda</b>: duplica el objeto y también todo lo que tiene adentro, en todos los niveles. <code>profunda</code> tiene su propio array #5. (La tarjeta de <code>copia</code> se omite para despejar el pizarrón.)',
    },
    {
      lineas: [8],
      pila: [m('original', '→ objeto #1'), m('profunda', '→ objeto #4'), obj('objeto #1', "{ nombre: 'Ana', gustos: → array #2 }"), obj('array #2', "[ 'cine', 'mar' ]"), obj('objeto #4', "{ nombre: 'Ana', gustos: → array #5 }"), obj('array #5', "[ 'cine', 'mar', 'rock' ]", true)],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'independiente',
      texto: 'El push va al array #5. El original no se entera.',
    },
    {
      lineas: [10],
      pila: [m('original', '→ objeto #1'), m('profunda', '→ objeto #4'), obj('objeto #1', "{ nombre: 'Ana', gustos: → array #2 }"), obj('array #2', "[ 'cine', 'mar' ]", true), obj('objeto #4', "{ nombre: 'Ana', gustos: → array #5 }"), obj('array #5', "[ 'cine', 'mar', 'rock' ]")],
      consola: ["[ 'cine', 'mar' ]"],
      evento: 'fin',
      texto: 'El original tiene <code>mar</code>, que entró por la copia superficial, pero no <code>rock</code>, que fue a la profunda. Regla: el spread copia <b>un nivel</b>; <code>structuredClone</code>, <b>todos</b>.',
    },
  ],
};

export const cadenaPrototipos: DatosVisualizador = {
  codigo: `const animal = {
  respirar() { return "respira"; },
};

const perro = Object.create(animal);
perro.ladrar = function () { return "guau"; };

console.log(perro.ladrar());
console.log(perro.respirar());
console.log(perro.volar);`,
  pasos: [
    {
      lineas: [1, 2, 3],
      pila: [m('animal', '→ objeto #1', true), obj('objeto #1', '{ respirar } · prototipo: Object.prototype'), obj('Object.prototype', '{ toString, hasOwnProperty, … } · prototipo: null')],
      consola: [],
      evento: 'entra',
      anotacion: 'literal',
      texto: 'Todo objeto tiene un enlace oculto a otro objeto: su <b>prototipo</b>. Un literal enlaza con <code>Object.prototype</code>, de donde salen métodos como <code>toString</code>. El prototipo de <code>Object.prototype</code> es <code>null</code>: ahí termina la cadena.',
    },
    {
      lineas: [5],
      pila: [m('animal', '→ objeto #1'), m('perro', '→ objeto #2', true), obj('objeto #2', '{ } · prototipo: objeto #1', true), obj('objeto #1', '{ respirar } · prototipo: Object.prototype'), obj('Object.prototype', '{ toString, hasOwnProperty, … } · prototipo: null')],
      consola: [],
      evento: 'entra',
      anotacion: 'Object.create',
      texto: '<code>Object.create(animal)</code> crea un objeto <b>vacío</b> cuyo prototipo es <code>animal</code>. Así se forma una cadena: perro → animal → Object.prototype → null.',
    },
    {
      lineas: [6],
      pila: [m('animal', '→ objeto #1'), m('perro', '→ objeto #2'), obj('objeto #2', '{ ladrar } · prototipo: objeto #1', true), obj('objeto #1', '{ respirar } · prototipo: Object.prototype'), obj('Object.prototype', '{ toString, hasOwnProperty, … } · prototipo: null')],
      consola: [],
      evento: 'ejecuta',
      anotacion: 'propia',
      texto: '<code>ladrar</code> se agrega a <code>perro</code>: es una propiedad <b>propia</b>. <code>animal</code> no la tiene.',
    },
    {
      lineas: [8],
      pila: [m('animal', '→ objeto #1'), m('perro', '→ objeto #2'), obj('objeto #2', '{ ladrar } ✓ encontrada', true), obj('objeto #1', '{ respirar } · prototipo: Object.prototype'), obj('Object.prototype', '{ toString, hasOwnProperty, … } · prototipo: null')],
      consola: ['guau'],
      evento: 'imprime',
      anotacion: 'busca',
      texto: 'Para leer <code>perro.ladrar</code>, el motor busca primero en el propio objeto. Está ahí: la usa.',
    },
    {
      lineas: [9],
      pila: [m('animal', '→ objeto #1'), m('perro', '→ objeto #2'), obj('objeto #2', '{ ladrar } · no está, sube'), obj('objeto #1', '{ respirar } ✓ encontrada', true), obj('Object.prototype', '{ toString, hasOwnProperty, … } · prototipo: null')],
      consola: ['guau', 'respira'],
      evento: 'imprime',
      anotacion: 'sube',
      texto: '<code>respirar</code> no está en <code>perro</code>, así que el motor <b>sube</b> a su prototipo, <code>animal</code>, y la encuentra. <code>perro</code> no la copió: la <b>hereda</b> por la cadena.',
      prediccion: {
        pregunta: '¿Funciona perro.respirar(), si perro no tiene esa propiedad?',
        opciones: ['No, TypeError', 'Sí, la encuentra en su prototipo animal'],
        correcta: 1,
        explicacion: 'Si no la tiene, el motor la busca en el prototipo, y así hacia arriba.',
      },
    },
    {
      lineas: [10],
      pila: [m('animal', '→ objeto #1'), m('perro', '→ objeto #2'), obj('objeto #2', '{ ladrar } · no está, sube'), obj('objeto #1', '{ respirar } · no está, sube'), obj('Object.prototype', '{ toString, … } · no está · prototipo: null', true)],
      consola: ['guau', 'respira', 'undefined'],
      evento: 'fin',
      anotacion: 'null',
      texto: '<code>volar</code> no está en ningún eslabón. El motor recorre la cadena entera hasta <code>null</code> y devuelve <code>undefined</code>. Esta búsqueda es la base de las <b>clases</b> en JavaScript, que verás en la próxima sección.',
      prediccion: {
        pregunta: '¿Qué da perro.volar?',
        opciones: ['undefined', 'TypeError', 'false'],
        correcta: 0,
        explicacion: 'Leer una propiedad que no existe en ningún eslabón da undefined, sin error.',
      },
    },
  ],
};

export const thisLlamada: DatosVisualizador = {
  codigo: `const usuario = {
  nombre: "Ana",
  saludar() {
    return \`Hola, soy \${this.nombre}\`;
  },
};

console.log(usuario.saludar());

const suelta = usuario.saludar;
console.log(suelta());

const atada = usuario.saludar.bind({ nombre: "Luis" });
console.log(atada());`,
  pasos: [
    {
      lineas: [8, 4],
      pila: [m('saludar()', 'this = usuario', true)],
      consola: [],
      evento: 'entra',
      anotacion: 'con punto',
      texto: '<code>this</code> no se decide al escribir la función, sino <b>al llamarla</b>. Aquí se llama como <code>usuario.saludar()</code>: lo que está <b>antes del punto</b> es <code>this</code>.',
    },
    {
      lineas: [8],
      pila: [],
      consola: ['Hola, soy Ana'],
      evento: 'sale',
      anotacion: 'sale',
      texto: '<code>this.nombre</code> es <code>usuario.nombre</code>: imprime <code>Hola, soy Ana</code>.',
    },
    {
      lineas: [10],
      pila: [],
      consola: ['Hola, soy Ana'],
      evento: 'ejecuta',
      anotacion: 'copia',
      texto: '<code>suelta</code> guarda <b>la misma función</b>, pero sola: el objeto no viaja con ella. Una función no "pertenece" al objeto donde se escribió.',
    },
    {
      lineas: [11, 4],
      pila: [m('suelta()', 'this = undefined (sin punto)', true)],
      consola: ['Hola, soy Ana'],
      evento: 'entra',
      anotacion: 'sin punto',
      texto: 'Llamada <b>sin punto</b>: no hay objeto, así que <code>this</code> es <code>undefined</code>. En modo estricto (módulos y clases), <code>this.nombre</code> lanzaría <code>TypeError</code>. Fuera de él, el motor pone en su lugar el objeto global, que no tiene <code>nombre</code>.',
      prediccion: {
        pregunta: 'Fuera del modo estricto, ¿qué imprime suelta()?',
        opciones: ['Hola, soy Ana', 'Hola, soy undefined'],
        correcta: 1,
        explicacion: 'Sin punto no hay usuario: this ya no es usuario.',
      },
    },
    {
      lineas: [11],
      pila: [],
      consola: ['Hola, soy Ana', 'Hola, soy undefined'],
      evento: 'sale',
      anotacion: 'sale',
      texto: 'Es el error más común con <code>this</code>: pasar un método suelto, como callback o desestructurado, y perder su objeto.',
    },
    {
      lineas: [13],
      pila: [],
      consola: ['Hola, soy Ana', 'Hola, soy undefined'],
      evento: 'ejecuta',
      anotacion: 'bind',
      texto: '<code>bind</code> crea una función <b>nueva</b> con <code>this</code> fijado para siempre, sin importar cómo se la llame después.',
    },
    {
      lineas: [14, 4],
      pila: [m('atada()', 'this = { nombre: "Luis" } (fijado con bind)', true)],
      consola: ['Hola, soy Ana', 'Hola, soy undefined'],
      evento: 'entra',
      anotacion: 'fijado',
      texto: 'Aunque se llama sin punto, <code>atada</code> ya trae su <code>this</code>: el objeto que se pasó a <code>bind</code>.',
      prediccion: {
        pregunta: '¿Qué imprime atada()?',
        opciones: ['Hola, soy Ana', 'Hola, soy Luis', 'Hola, soy undefined'],
        correcta: 1,
        explicacion: 'bind fijó this en { nombre: "Luis" }.',
      },
    },
    {
      lineas: [14],
      pila: [],
      consola: ['Hola, soy Ana', 'Hola, soy undefined', 'Hola, soy Luis'],
      evento: 'fin',
      texto: 'La <b>misma</b> función imprimió tres cosas distintas. La pregunta para saber qué es <code>this</code> nunca es "¿dónde se escribió?", sino "<b>¿cómo se llamó?</b>".',
    },
  ],
};
