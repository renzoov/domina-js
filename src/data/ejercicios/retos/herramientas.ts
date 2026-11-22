// Reto del motor de la sección 15: «Herramientas del ecosistema».

export const retoHerrAuto = {
  id: 'reto-herr-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: 'Tu <code>package.json</code> pide <code>"fecha": "^1.4.2"</code>. ¿Cuál de estas versiones puede instalar npm?',
      opciones: ['<code>2.0.0</code>', '<code>1.9.0</code>', '<code>1.4.1</code>'],
      correcta: 1,
      explicacion: 'El <code>^</code> acepta cualquier versión compatible: la misma versión mayor (1) y desde la <code>1.4.2</code> en adelante. La <code>2.0.0</code> puede romper cosas; la <code>1.4.1</code> es anterior.',
    },
    {
      pregunta: '¿Qué pasa con los tipos de TypeScript cuando el código se ejecuta?',
      opciones: [
        'El motor los comprueba en cada llamada',
        'Se borran: lo que corre es JavaScript, sin tipos',
        'Se convierten en validaciones automáticas',
      ],
      correcta: 1,
      explicacion: 'TypeScript revisa los tipos antes de ejecutar y después los quita. Si llega un dato de afuera con otra forma, nada lo detiene en tiempo de ejecución: eso se valida aparte.',
    },
    {
      pregunta: '¿Para qué sirve el <code>package-lock.json</code>?',
      opciones: [
        'Para que nadie pueda instalar dependencias nuevas',
        'Para que todos instalen exactamente las mismas versiones de todas las dependencias',
        'Para guardar las contraseñas del registro',
      ],
      correcta: 1,
      explicacion: 'El <code>package.json</code> dice qué rangos aceptas; el lockfile anota la versión exacta que se instaló de cada paquete, incluidas las dependencias de tus dependencias. Se sube al repositorio.',
    },
    {
      pregunta: '¿En qué se diferencian un linter (ESLint, Biome) y un formateador (Prettier)?',
      opciones: [
        'Son lo mismo con otro nombre',
        'El linter busca errores probables y malas prácticas; el formateador solo decide cómo se ve el código',
        'El formateador encuentra errores y el linter acomoda los espacios',
      ],
      correcta: 1,
      explicacion: 'Una variable sin usar o un <code>=</code> donde iba <code>===</code> son trabajo del linter. Comillas, sangría y saltos de línea, del formateador. Biome hace las dos cosas.',
    },
    {
      pregunta: 'Pones un <em>breakpoint</em> en una línea y recargas. ¿Qué pasa al llegar a ella?',
      opciones: [
        'El programa se detiene antes de ejecutarla, y puedes ver las variables y avanzar paso a paso',
        'Se imprime la línea en la consola',
        'El programa se cierra',
      ],
      correcta: 0,
      explicacion: 'La ejecución se pausa justo antes de esa línea. Desde ahí ves el scope, la pila de llamadas (la misma de la sección 4) y avanzas de a una instrucción.',
    },
  ],
};

export const retoHerrOrden = {
  id: 'reto-herr-orden',
  titulo: 'El orden de los ganchos de prueba',
  // Necesita Vitest: herramientas/verificar-ejercicios.mjs no lo ejecuta
  sinEjecutar: true,
  codigo: `import { describe, test, beforeAll, beforeEach, afterEach } from "vitest";

describe("carrito", () => {
  beforeAll(() => console.log("beforeAll"));
  beforeEach(() => console.log("beforeEach"));
  afterEach(() => console.log("afterEach"));

  test("suma", () => console.log("test suma"));
  test("vacía", () => console.log("test vacía"));
});`,
  salida: ['beforeAll', 'beforeEach', 'test suma', 'afterEach', 'beforeEach', 'test vacía', 'afterEach'],
  inicio: [4, 0, 6, 2, 1, 5, 3],
  explicacion:
    '<code>beforeAll</code> corre una sola vez, antes de todas las pruebas del bloque. <code>beforeEach</code> y <code>afterEach</code> envuelven a <b>cada</b> prueba: así cada una empieza con un estado limpio y no depende de lo que dejó la anterior.',
};

export const retoHerrDetective = {
  id: 'reto-herr-detective',
  titulo: 'Una prueba que falla por centésimas',
  codigo: `import { test, expect } from "vitest";
import { sumarPrecios } from "./carrito.js";

test("suma los precios", () => {
  const total = sumarPrecios([0.1, 0.2]);
  expect(total).toBe(0.3);
});`,
  error: ` FAIL  carrito.test.js > suma los precios
AssertionError: expected 0.30000000000000004 to be 0.3 // Object.is equality

- Expected
+ Received

- 0.3
+ 0.30000000000000004

 ❯ carrito.test.js:6:17`,
  culpable: 6,
  hallazgo:
    '<code>sumarPrecios</code> funciona: <code>0.1 + 0.2</code> da <code>0.30000000000000004</code> en cualquier programa de JavaScript, por cómo se guardan los decimales en binario. La prueba es la que compara de forma exacta un número con decimales.',
  pista: 'Mira el número que llegó. ¿Te suena de la lección de números?',
  arreglos: [
    {
      texto: 'Comparar con tolerancia: <code>expect(total).toBeCloseTo(0.3);</code>',
      correcta: true,
      porque: '<code>toBeCloseTo</code> acepta una diferencia mínima (por defecto, menos de 0.005). Es la forma correcta de comparar decimales.',
    },
    {
      texto: 'Cambiar la línea 6 por <code>expect(total).toEqual(0.3);</code>',
      correcta: false,
      porque: 'Para números, <code>toEqual</code> también compara de forma exacta: sigue fallando.',
    },
    {
      texto: 'Cambiar la línea 6 por <code>expect(total).toBe(0.30000000000000004);</code>',
      correcta: false,
      porque: 'Pasa, pero la prueba queda atada a un detalle del redondeo binario y a que la suma se haga en ese orden. Nadie que la lea entiende qué verifica.',
    },
  ],
};

export const retoHerrLab = {
  id: 'reto-herr-lab',
  titulo: 'Comparar versiones',
  inicial: `// Escribe compararVersiones(a, b) para versiones "MAYOR.MENOR.PARCHE".
// Devuelve -1 si a es anterior a b, 1 si es posterior y 0 si son iguales.
// Ojo: se comparan como números, no como texto ("1.10.0" es posterior a "1.9.0").

console.log(compararVersiones("1.10.0", "1.9.0"));
console.log(compararVersiones("2.0.0", "2.0.0"));
console.log(["1.2.3", "1.0.10", "1.0.2"].sort(compararVersiones).join(" "));
`,
  verificaciones: [
    { texto: 'Imprime <code>1</code>, <code>0</code> y <code>1.0.2 1.0.10 1.2.3</code>', prueba: 'return __salida.join("|") === "1|0|1.0.2 1.0.10 1.2.3";' },
    { texto: 'La versión mayor manda: <code>"2.0.0"</code> es posterior a <code>"1.99.99"</code>', prueba: 'return compararVersiones("2.0.0", "1.99.99") === 1 && compararVersiones("1.99.99", "2.0.0") === -1;' },
    { texto: 'Compara el parche cuando lo demás es igual', prueba: 'return compararVersiones("3.1.4", "3.1.10") === -1;' },
    { texto: 'Solo devuelve <code>-1</code>, <code>0</code> o <code>1</code>', prueba: 'return [compararVersiones("1.0.0", "5.0.0"), compararVersiones("9.0.0", "1.0.0")].join() === "-1,1";' },
  ],
  pistas: [
    'Convierte cada versión en tres números: <code>a.split(".").map(Number)</code>.',
    'Recorre las tres posiciones en orden: mayor, menor, parche. En cuanto una sea distinta, ya tienes la respuesta.',
    'Si <code>x[i] !== y[i]</code>, devuelve <code>x[i] &gt; y[i] ? 1 : -1</code>. Si las tres coinciden, <code>0</code>.',
  ] as [string, string, string],
  solucion: `function compararVersiones(a, b) {
  const x = a.split(".").map(Number);
  const y = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  }
  return 0;
}

console.log(compararVersiones("1.10.0", "1.9.0"));
console.log(compararVersiones("2.0.0", "2.0.0"));
console.log(["1.2.3", "1.0.10", "1.0.2"].sort(compararVersiones).join(" "));`,
  explicacion:
    '<p>Como texto, <code>"1.10.0" &lt; "1.9.0"</code>, porque compara carácter a carácter. Al convertir cada parte a número, la comparación respeta el versionado semántico. Y como devuelve <code>-1</code>, <code>0</code> o <code>1</code>, sirve tal cual como función de comparación para <code>sort</code>.</p>',
};
