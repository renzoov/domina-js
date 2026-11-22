// Reto del motor de la sección 5: «Objetos».

export const retoObjAuto = {
  id: 'reto-obj-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>const a = { datos: { n: 1 } };</code><br><code>const b = { ...a };</code><br><code>b.datos.n = 2;</code><br><code>console.log(a.datos.n);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>undefined</code>'],
      correcta: 1,
      explicacion: 'El spread hace una copia <b>superficial</b>: <code>b</code> es un objeto nuevo, pero <code>b.datos</code> es el mismo objeto que <code>a.datos</code>. Para separarlos del todo, <code>structuredClone(a)</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log(JSON.stringify({ a: undefined, b: () =&gt; 1, c: NaN }));</code>',
      opciones: ['<code>{"a":undefined,"b":"() =&gt; 1","c":NaN}</code>', '<code>{"c":null}</code>', '<code>{}</code>'],
      correcta: 1,
      explicacion: 'JSON no tiene <code>undefined</code> ni funciones: esas propiedades desaparecen. Tampoco tiene <code>NaN</code>, que se convierte en <code>null</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const o = Object.freeze({ lista: [1] });</code><br><code>o.lista.push(2);</code><br><code>console.log(o.lista.length);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>TypeError</code>'],
      correcta: 1,
      explicacion: '<code>Object.freeze</code> congela solo el primer nivel: no puedes cambiar a qué apunta <code>o.lista</code>, pero el array de adentro no está congelado.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const { a = 5, b = 5 } = { a: null };</code><br><code>console.log(a, b);</code>',
      opciones: ['<code>5 5</code>', '<code>null 5</code>', '<code>null undefined</code>'],
      correcta: 1,
      explicacion: 'Igual que en los parámetros: el valor por defecto se usa solo cuando la propiedad es <code>undefined</code>. <code>a</code> vale <code>null</code> a propósito, así que se respeta.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log(Object.keys({ b: 1, 2: "x", a: 2, 1: "y" }));</code>',
      opciones: ['<code>[ \'b\', \'2\', \'a\', \'1\' ]</code>', '<code>[ \'1\', \'2\', \'b\', \'a\' ]</code>', '<code>[ \'a\', \'b\', \'1\', \'2\' ]</code>'],
      correcta: 1,
      explicacion: 'Las claves que parecen índices enteros van primero, de menor a mayor. Las demás siguen el orden en que se crearon: <code>b</code> antes que <code>a</code>.',
    },
  ],
};

export const retoObjOrden = {
  id: 'reto-obj-orden',
  titulo: 'Tres maneras de copiar',
  codigo: `const base = { nombre: "Ana", gustos: ["té"] };
const profunda = structuredClone(base);
const superficial = { ...base, nombre: "Eva" };

superficial.gustos.push("café");
profunda.gustos.push("mate");

console.log(base.nombre, superficial.nombre);
console.log(base.gustos.join(","));
console.log(profunda.gustos.join(","));
console.log(JSON.stringify({ ...base, gustos: undefined }));`,
  salida: ['Ana Eva', 'té,café', 'té,mate', '{"nombre":"Ana"}'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Cambiar <code>nombre</code> en la copia superficial no toca a <code>base</code>, porque es un primitivo. Pero su <code>gustos</code> es el mismo array de <code>base</code>: el <code>push("café")</code> se ve en los dos. La copia profunda tiene su propio array. Y <code>JSON.stringify</code> omite <code>gustos</code> porque vale <code>undefined</code>.',
};

export const retoObjDetective = {
  id: 'reto-obj-detective',
  titulo: 'Una configuración guardada a mano',
  codigo: `const guardado = "{'tema': 'oscuro'}";
const config = JSON.parse(guardado);
console.log(config.tema);`,
  error: `<anonymous_script>:1
{'tema': 'oscuro'}
 ^

SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)`,
  culpable: 1,
  hallazgo:
    'El error salta en <code>JSON.parse</code>, pero el problema es el texto de la línea 1: JSON exige <b>comillas dobles</b> en las claves y en los textos. Lo de la línea 1 parece JSON, pero no lo es.',
  pista: 'El error dice «posición 1»: justo después de la llave. ¿Qué carácter hay ahí? ¿Qué comillas acepta JSON?',
  arreglos: [
    {
      texto: 'Generar el texto con <code>JSON.stringify({ tema: "oscuro" })</code> en lugar de escribirlo a mano',
      correcta: true,
      porque: '<code>JSON.stringify</code> siempre produce JSON válido: <code>{"tema":"oscuro"}</code>. Escribir JSON a mano es la forma más fácil de equivocarse.',
    },
    {
      texto: 'Usar <code>eval(guardado)</code> en lugar de <code>JSON.parse</code>',
      correcta: false,
      porque: '<code>eval</code> ejecuta cualquier código que haya en el texto: si ese texto viene de afuera, es una puerta abierta a ataques. Nunca para leer datos.',
    },
    {
      texto: 'Envolver <code>JSON.parse</code> en un <code>try…catch</code> que devuelva <code>{}</code>',
      correcta: false,
      porque: 'Leer JSON con <code>try…catch</code> está bien para datos de afuera, pero aquí escondería el error: la configuración se perdería siempre, sin aviso.',
    },
  ],
};

export const retoObjLab = {
  id: 'reto-obj-lab',
  titulo: 'Aplicar cambios sin mutar',
  inicial: `// Escribe aplicarCambios(usuario, cambios): devuelve un usuario NUEVO con los cambios.
// Las preferencias se combinan: las que no vienen en cambios se conservan.
// El usuario original no puede cambiar en nada.

const ana = { nombre: "Ana", preferencias: { tema: "claro", idioma: "es" } };
const nueva = aplicarCambios(ana, { nombre: "Ana P.", preferencias: { tema: "oscuro" } });

console.log(nueva.nombre, nueva.preferencias.tema, nueva.preferencias.idioma);
console.log(ana.nombre, ana.preferencias.tema);
`,
  verificaciones: [
    { texto: 'Imprime <code>Ana P. oscuro es</code> y después <code>Ana claro</code>', prueba: 'return __salida.join("|") === "Ana P. oscuro es|Ana claro";' },
    { texto: 'Devuelve un objeto nuevo, con preferencias nuevas', prueba: 'const u = { nombre: "x", preferencias: { a: 1 } }; const r = aplicarCambios(u, { nombre: "y" }); return r !== u && r.preferencias !== u.preferencias;' },
    { texto: 'No toca el original, ni siquiera sus preferencias', prueba: 'const u = { nombre: "x", preferencias: { a: 1 } }; aplicarCambios(u, { preferencias: { a: 2, b: 3 } }); return u.preferencias.a === 1 && !("b" in u.preferencias);' },
    { texto: 'Funciona sin cambios de preferencias', prueba: 'const r = aplicarCambios({ nombre: "x", preferencias: { a: 1 } }, { nombre: "y" }); return r.nombre === "y" && r.preferencias.a === 1;' },
  ],
  pistas: [
    'Con spread copias y pisas en un paso: <code>{ ...usuario, ...cambios }</code>.',
    'Pero así <code>cambios.preferencias</code> reemplaza las preferencias enteras. Hay que combinarlas aparte.',
    '<code>preferencias: { ...usuario.preferencias, ...cambios.preferencias }</code>, escrito después de los dos spreads. El spread de <code>undefined</code> no agrega nada.',
  ] as [string, string, string],
  solucion: `function aplicarCambios(usuario, cambios) {
  return {
    ...usuario,
    ...cambios,
    preferencias: { ...usuario.preferencias, ...cambios.preferencias },
  };
}

const ana = { nombre: "Ana", preferencias: { tema: "claro", idioma: "es" } };
const nueva = aplicarCambios(ana, { nombre: "Ana P.", preferencias: { tema: "oscuro" } });

console.log(nueva.nombre, nueva.preferencias.tema, nueva.preferencias.idioma);
console.log(ana.nombre, ana.preferencias.tema);`,
  explicacion:
    '<p>Los dos primeros spreads arman la copia con los cambios. El tercero arregla lo que una copia superficial no resuelve: el objeto anidado. Como no se modifica nada, quien tenga una referencia a <code>ana</code> la sigue viendo igual.</p>',
};
