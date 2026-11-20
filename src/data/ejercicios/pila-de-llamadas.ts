// Ejercicios de la lección «La pila de llamadas».

export const motor = {
  id: 'pila-motor',
  titulo: 'Apila y desapila como lo haría el motor',
  codigo: `function c() {
  console.log("¡Hola desde c!");
}

function b() {
  c();
}

function a() {
  b();
}

a();`,
  funciones: ['c()', 'a()', 'b()'],
  movimientos: [
    { accion: 'apilar' as const, funcion: 'a()', linea: 10 },
    { accion: 'apilar' as const, funcion: 'b()', linea: 6 },
    { accion: 'apilar' as const, funcion: 'c()', linea: 2 },
    { accion: 'desapilar' as const, linea: 7 },
    { accion: 'desapilar' as const, linea: 11 },
    { accion: 'desapilar' as const, linea: 13 },
  ],
};

export const orden = {
  id: 'pila-orden',
  titulo: '¿En qué orden aparece cada letra?',
  codigo: `function primero() {
  console.log("A");
  segundo();
  console.log("D");
}

function segundo() {
  console.log("B");
  console.log("C");
}

primero();
console.log("E");`,
  salida: ['A', 'B', 'C', 'D', 'E'],
  inicio: [3, 0, 4, 2, 1],
  explicacion:
    'primero() imprime <code>A</code> y llama a segundo(), que se apila encima e imprime <code>B</code> y <code>C</code>. Cuando segundo() sale, primero() sigue donde se quedó e imprime <code>D</code>. Al final, con la pila vacía, se imprime <code>E</code>.',
};

export const detective = {
  id: 'pila-detective',
  titulo: 'El factorial que nunca termina',
  codigo: `function factorial(n) {
  return n * factorial(n - 1);
}

console.log(factorial(5));`,
  error: `Uncaught RangeError: Maximum call stack size exceeded
    at factorial (factorial.js:2:14)
    at factorial (factorial.js:2:14)
    at factorial (factorial.js:2:14)
    at factorial (factorial.js:2:14)
    …`,
  culpable: 2,
  hallazgo:
    'La línea 2 llama a <code>factorial(n - 1)</code> siempre, incluso cuando <code>n</code> ya llegó a 1, a 0 o a números negativos. Nada la detiene.',
  pista: 'Mira el stack trace: repite <code>factorial.js:2</code> una y otra vez. Ese número es la línea.',
  arreglos: [
    {
      texto: 'Cambiar <code>factorial(5)</code> por <code>factorial(3)</code>',
      correcta: false,
      porque: 'Con un número más chico la pila igual se llena: factorial(3) llama a factorial(2), factorial(1), factorial(0), factorial(-1)… sin fin.',
    },
    {
      texto: 'Agregar un caso base antes del return: <code>if (n &lt;= 1) return 1;</code>',
      correcta: true,
      porque: 'Cuando n llega a 1, la función devuelve sin volver a llamarse y la pila empieza a vaciarse. factorial(5) da 120.',
    },
    {
      texto: 'Envolver la llamada en <code>try/catch</code>',
      correcta: false,
      porque: 'Así solo escondes el error. La función sigue sin poder terminar y nunca calcula el factorial.',
    },
  ],
};

export const laboratorio = {
  id: 'pila-lab',
  titulo: 'Escribe una cuenta atrás recursiva',
  inicial: `function cuentaAtras(n) {
  // Tu código aquí
}

cuentaAtras(3);
`,
  verificaciones: [
    {
      texto: '<code>cuentaAtras(3)</code> imprime 3, 2, 1 y después <code>¡Despegue!</code>',
      prueba: '__salida.length = 0; cuentaAtras(3); return __salida.join("|") === "3|2|1|¡Despegue!";',
    },
    {
      texto: 'Funciona con otro número: <code>cuentaAtras(5)</code>',
      prueba: '__salida.length = 0; cuentaAtras(5); return __salida.join("|") === "5|4|3|2|1|¡Despegue!";',
    },
    {
      texto: '<code>cuentaAtras(0)</code> solo imprime <code>¡Despegue!</code>: ese es el caso base',
      prueba: '__salida.length = 0; cuentaAtras(0); return __salida.join("|") === "¡Despegue!";',
    },
    {
      texto: 'Se llama a sí misma, sin <code>for</code> ni <code>while</code>',
      prueba:
        'const src = String(cuentaAtras); const cuerpo = src.slice(src.indexOf("{")); return /cuentaAtras\\s*\\(/.test(cuerpo) && !/\\b(for|while)\\b/.test(cuerpo);',
    },
  ],
  pistas: [
    '¿Con qué número tiene que parar la cuenta? Esa condición es tu <em>caso base</em>.',
    'Si <code>n</code> es 0, imprime <code>"¡Despegue!"</code> y haz <code>return</code>. Si no, imprime <code>n</code>…',
    '…y después llama a <code>cuentaAtras(n - 1)</code>. Cada llamada se apila con un número más chico, hasta llegar a 0.',
  ] as [string, string, string],
  solucion: `function cuentaAtras(n) {
  if (n === 0) {
    console.log("¡Despegue!");
    return;
  }
  console.log(n);
  cuentaAtras(n - 1);
}

cuentaAtras(3);`,
  explicacion:
    '<p>Con <code>cuentaAtras(3)</code> la pila crece hasta tener cuatro marcos: cuentaAtras(3), (2), (1) y (0). El caso base <code>n === 0</code> es el que corta: imprime y hace <code>return</code> sin volver a llamarse. Desde ahí la pila se vacía de arriba hacia abajo.</p>',
};
