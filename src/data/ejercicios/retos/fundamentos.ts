// Reto del motor de la sección 1: «Fundamentos del lenguaje». Mezcla todos los temas de la sección.

export const retoFundAuto = {
  id: 'reto-fund-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Qué imprime?<br><code>console.log(typeof null);</code>',
      opciones: ['<code>"null"</code>', '<code>"object"</code>', '<code>"undefined"</code>'],
      correcta: 1,
      explicacion: 'Es un error histórico del lenguaje que nunca se corrigió para no romper la web: <code>typeof null</code> da <code>"object"</code>, aunque <code>null</code> es un primitivo. Para preguntar por él, compara directamente: <code>valor === null</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log("3" + 4 * 2);</code>',
      opciones: ['<code>14</code>', '<code>"38"</code>', '<code>"342"</code>'],
      correcta: 1,
      explicacion: 'Primero la multiplicación, por precedencia: <code>4 * 2</code> da <code>8</code>. Después <code>"3" + 8</code>: con un texto de por medio, <code>+</code> concatena, y el resultado es <code>"38"</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const a = { n: 1 };</code><br><code>const b = a;</code><br><code>b.n = 2;</code><br><code>console.log(a.n);</code>',
      opciones: ['<code>1</code>', '<code>2</code>', '<code>TypeError</code>, porque <code>b</code> es <code>const</code>'],
      correcta: 1,
      explicacion: '<code>b = a</code> no copia el objeto: copia la referencia. Las dos variables apuntan al mismo objeto, así que el cambio se ve desde las dos. Y <code>const</code> impide reasignar <code>b</code>, no cambiar lo que hay adentro.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>const stock = 0;</code><br><code>console.log(stock || "agotado", stock ?? "agotado");</code>',
      opciones: ['<code>agotado agotado</code>', '<code>0 0</code>', '<code>agotado 0</code>'],
      correcta: 2,
      explicacion: '<code>||</code> descarta cualquier valor falsy, y <code>0</code> lo es. <code>??</code> solo descarta <code>null</code> y <code>undefined</code>, así que respeta el <code>0</code>. Para valores por defecto, casi siempre quieres <code>??</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>console.log(0.1 + 0.2 === 0.3);</code>',
      opciones: ['<code>true</code>', '<code>false</code>', '<code>NaN</code>'],
      correcta: 1,
      explicacion: 'Los números se guardan en binario y ni <code>0.1</code> ni <code>0.2</code> tienen representación exacta: la suma da <code>0.30000000000000004</code>. Para dinero, trabaja en centavos enteros o redondea al mostrar.',
    },
  ],
};

export const retoFundOrden = {
  id: 'reto-fund-orden',
  titulo: 'Un precio que llega como texto',
  codigo: `const precio = "10";

console.log(precio + 5);
console.log(precio * 2);
console.log(typeof (precio - 0));
console.log(Number("10 soles"));
console.log(\`\${precio} €\`.length);`,
  salida: ['105', '20', 'number', 'NaN', '4'],
  inicio: [3, 1, 4, 0, 2],
  explicacion:
    '<code>+</code> con un texto concatena: <code>"105"</code>. <code>*</code> y <code>-</code> solo existen para números, así que convierten el texto: <code>20</code> y un <code>number</code>. <code>Number</code> no adivina: si el texto no es un número completo, da <code>NaN</code>. El template literal arma <code>"10 €"</code>, que tiene 4 caracteres.',
};

export const retoFundDetective = {
  id: 'reto-fund-detective',
  titulo: 'Un dato que no siempre está',
  codigo: `const usuario = { nombre: "Ana" };
const ciudad = usuario.direccion.ciudad;
console.log(ciudad ?? "Sin ciudad");`,
  error: `app.js:2
const ciudad = usuario.direccion.ciudad;
                                 ^

TypeError: Cannot read properties of undefined (reading 'ciudad')`,
  culpable: 2,
  hallazgo:
    '<code>usuario</code> no tiene <code>direccion</code>, así que <code>usuario.direccion</code> vale <code>undefined</code>. Leer <code>.ciudad</code> de <code>undefined</code> es un <code>TypeError</code>: el <code>??</code> de la línea 3 nunca llega a ejecutarse.',
  pista: 'El mensaje dice qué se intentó leer (<code>ciudad</code>) y de qué (<code>undefined</code>). ¿En qué línea se lee <code>.ciudad</code>?',
  arreglos: [
    {
      texto: 'Cambiar la línea 2 por <code>const ciudad = usuario.direccion?.ciudad;</code>',
      correcta: true,
      porque: 'Con <code>?.</code>, si <code>direccion</code> es <code>null</code> o <code>undefined</code> la expresión da <code>undefined</code> en lugar de lanzar un error. Después, el <code>??</code> de la línea 3 pone «Sin ciudad».',
    },
    {
      texto: 'Cambiar <code>const</code> por <code>let</code> en la línea 2',
      correcta: false,
      porque: 'El problema no es reasignar <code>ciudad</code>: el error ocurre al leer una propiedad de <code>undefined</code>, antes de guardar nada.',
    },
    {
      texto: 'Cambiar la línea 3 por <code>console.log(ciudad || "Sin ciudad");</code>',
      correcta: false,
      porque: 'El programa nunca llega a la línea 3: falla en la 2. Cambiar <code>??</code> por <code>||</code> no evita el error.',
    },
  ],
};

export const retoFundLab = {
  id: 'reto-fund-lab',
  titulo: 'Formatear un precio',
  inicial: `// Escribe formatearPrecio(valor). Recibe un número o un texto con un número
// y devuelve el precio con dos decimales: formatearPrecio(12.5) → "$12.50".
// Si el valor no es un número, devuelve "precio inválido".

console.log(formatearPrecio(12.5));
console.log(formatearPrecio("3"));
console.log(formatearPrecio("tres"));
`,
  verificaciones: [
    { texto: 'Imprime <code>$12.50</code>, <code>$3.00</code> y <code>precio inválido</code>', prueba: 'return __salida.join("|") === "$12.50|$3.00|precio inválido";' },
    { texto: 'Acepta textos con un número: <code>formatearPrecio("0.5")</code> da <code>"$0.50"</code>', prueba: 'return formatearPrecio("0.5") === "$0.50";' },
    { texto: 'Rechaza lo que no es un número, incluido el texto vacío', prueba: 'return formatearPrecio("abc") === "precio inválido" && formatearPrecio("") === "precio inválido" && formatearPrecio("  ") === "precio inválido" && formatearPrecio(undefined) === "precio inválido";' },
    { texto: 'Siempre devuelve texto', prueba: 'return typeof formatearPrecio(7) === "string";' },
  ],
  pistas: [
    'Convierte primero con <code>Number(valor)</code> y guarda el resultado en una constante.',
    'Un número que no es número se detecta con <code>Number.isNaN(n)</code>. Ojo: <code>Number("")</code> da <code>0</code>, así que el texto vacío necesita su propia comprobación.',
    'Para los dos decimales, <code>n.toFixed(2)</code>; para armar el texto, un template literal: <code>`$${n.toFixed(2)}`</code>.',
  ] as [string, string, string],
  solucion: `function formatearPrecio(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === "") return "precio inválido";
  const n = Number(valor);
  if (Number.isNaN(n)) return "precio inválido";
  return \`$\${n.toFixed(2)}\`;
}

console.log(formatearPrecio(12.5));
console.log(formatearPrecio("3"));
console.log(formatearPrecio("tres"));`,
  explicacion:
    '<p>Se convierte una sola vez con <code>Number</code>, de forma explícita, en lugar de dejar que <code>+</code> o <code>*</code> conviertan por su cuenta. <code>Number.isNaN</code> detecta lo que no se pudo convertir, pero <code>Number("")</code>, <code>Number(" ")</code> y <code>Number(null)</code> dan <code>0</code>: por eso los valores vacíos se rechazan antes de convertir.</p>',
};
