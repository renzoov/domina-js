// Reto del motor de la sección 13: «JavaScript en el navegador».

export const retoNavAuto = {
  id: 'reto-nav-auto',
  titulo: 'Predice antes de ejecutar',
  preguntas: [
    {
      pregunta: '<code>const r = await fetch("/no-existe");</code><br><code>console.log(r.ok, r.status);</code><br>Si el servidor responde 404, ¿qué pasa?',
      opciones: ['La promesa se rechaza con un error', 'Imprime <code>false 404</code>', 'Imprime <code>true 404</code>'],
      correcta: 1,
      explicacion: 'Para <code>fetch</code>, un 404 es una respuesta como cualquier otra: la promesa se cumple. Solo se rechaza si no hubo respuesta (sin red, CORS, cancelación). Por eso hay que mirar <code>r.ok</code>.',
    },
    {
      pregunta: '¿Qué imprime?<br><code>localStorage.setItem("visitas", 5);</code><br><code>console.log(typeof localStorage.getItem("visitas"));</code>',
      opciones: ['<code>number</code>', '<code>string</code>', '<code>object</code>'],
      correcta: 1,
      explicacion: '<code>localStorage</code> solo guarda texto: el <code>5</code> se convierte en <code>"5"</code>. Para números u objetos, <code>JSON.stringify</code> al guardar y <code>JSON.parse</code> al leer.',
    },
    {
      pregunta: 'Con un listener en una lista <code>&lt;ul&gt;</code>, haces clic en un <code>&lt;li&gt;</code> de adentro. ¿Qué son <code>e.target</code> y <code>e.currentTarget</code>?',
      opciones: [
        'Los dos son el <code>&lt;li&gt;</code>',
        '<code>target</code> es el <code>&lt;li&gt;</code> (donde ocurrió) y <code>currentTarget</code> es el <code>&lt;ul&gt;</code> (quien escucha)',
        '<code>target</code> es el <code>&lt;ul&gt;</code> y <code>currentTarget</code> es el <code>&lt;li&gt;</code>',
      ],
      correcta: 1,
      explicacion: 'El evento ocurre en el elemento más profundo y burbujea hacia arriba. <code>target</code> no cambia en todo el viaje; <code>currentTarget</code> es el elemento cuyo listener se está ejecutando.',
    },
    {
      pregunta: 'Un comentario de un usuario dice <code>&lt;img src=x onerror="robar()"&gt;</code>. ¿Qué forma de mostrarlo es segura?',
      opciones: ['<code>div.innerHTML = comentario</code>', '<code>div.textContent = comentario</code>', 'Las dos son igual de seguras'],
      correcta: 1,
      explicacion: '<code>innerHTML</code> interpreta el texto como HTML: la imagen falla al cargar y su <code>onerror</code> ejecuta código ajeno (XSS). <code>textContent</code> lo muestra como texto, tal cual.',
    },
    {
      pregunta: 'Un <code>&lt;script type="module" src="app.js"&gt;</code> en el <code>&lt;head&gt;</code>, ¿cuándo se ejecuta?',
      opciones: [
        'En cuanto el navegador lo encuentra, frenando el análisis del HTML',
        'Después de analizar todo el HTML, como un script con <code>defer</code>',
        'Recién en el evento <code>load</code>, cuando cargaron las imágenes',
      ],
      correcta: 1,
      explicacion: 'Los módulos se difieren siempre: se descargan en paralelo y se ejecutan con el DOM ya armado, antes de <code>DOMContentLoaded</code>. Por eso pueden buscar elementos del <code>&lt;body&gt;</code> aunque estén en el <code>&lt;head&gt;</code>.',
    },
  ],
};

export const retoNavOrden = {
  id: 'reto-nav-orden',
  titulo: 'Un clic que viaja',
  codigo: `// <div id="caja"><button id="boton">OK</button></div>
const caja = document.querySelector("#caja");
const boton = document.querySelector("#boton");

caja.addEventListener("click", () => console.log("caja (burbujeo)"));
caja.addEventListener("click", () => console.log("caja (captura)"), { capture: true });
boton.addEventListener("click", () => console.log("botón"));
document.addEventListener("click", () => console.log("documento"));

boton.click();`,
  salida: ['caja (captura)', 'botón', 'caja (burbujeo)', 'documento'],
  inicio: [2, 3, 1, 0],
  explicacion:
    'Un evento hace un viaje de ida y vuelta: baja desde el documento hasta el botón (<b>captura</b>) y vuelve a subir (<b>burbujeo</b>). Los listeners con <code>capture: true</code> se ejecutan en la bajada; los demás, en la subida. Por eso el de captura de la caja va primero aunque se haya agregado después.',
};

export const retoNavDetective = {
  id: 'reto-nav-detective',
  titulo: 'Un carrito que falla en la segunda visita',
  codigo: `const guardado = localStorage.getItem("carrito");
const carrito = guardado ?? [];
carrito.push({ producto: "pan", cantidad: 2 });
localStorage.setItem("carrito", JSON.stringify(carrito));`,
  error: `Uncaught TypeError: carrito.push is not a function
    at app.js:3:9`,
  culpable: 2,
  hallazgo:
    'En la primera visita no hay nada guardado: <code>guardado</code> es <code>null</code> y el <code>??</code> pone un array vacío. Pero desde la segunda, <code>guardado</code> es un <b>texto</b> con JSON, y un texto no tiene <code>push</code>. Falta convertirlo de vuelta.',
  pista: 'Funciona la primera vez y falla después. ¿Qué devuelve <code>getItem</code> cuando el carrito ya está guardado? ¿De qué tipo es?',
  arreglos: [
    {
      texto: 'Cambiar la línea 2 por <code>const carrito = guardado ? JSON.parse(guardado) : [];</code>',
      correcta: true,
      porque: 'Lo que se guardó con <code>JSON.stringify</code> se lee con <code>JSON.parse</code>: vuelve a ser un array, con su <code>push</code>. Y si no había nada, se empieza con uno vacío.',
    },
    {
      texto: 'Cambiar la línea 2 por <code>const carrito = [guardado];</code>',
      correcta: false,
      porque: 'Mete el texto entero como un elemento del array: en cada visita el carrito guarda una versión anidada y cada vez más larga de sí mismo.',
    },
    {
      texto: 'Usar <code>sessionStorage</code> en lugar de <code>localStorage</code>',
      correcta: false,
      porque: '<code>sessionStorage</code> también guarda solo texto: falla igual en la segunda carga de la pestaña.',
    },
  ],
};

export const retoNavLab = {
  id: 'reto-nav-lab',
  titulo: 'Un contador de caracteres',
  pagina: `<label for="mensaje">Tu mensaje</label>
<textarea id="mensaje" rows="3"></textarea>
<p id="cuenta">0 / 140</p>
<button id="enviar">Enviar</button>
<style>.excedido { color: #f08a7e; font-weight: bold; }</style>`,
  inicial: `const mensaje = document.querySelector("#mensaje");
const cuenta = document.querySelector("#cuenta");
const enviar = document.querySelector("#enviar");

// Mientras se escribe, muestra en #cuenta cuántos caracteres hay: "12 / 140".
// Si pasan de 140, agrega la clase "excedido" a #cuenta y desactiva el botón.
// Si vuelven a bajar, quita la clase y reactiva el botón.
`,
  verificaciones: [
    { texto: 'Al escribir «hola», la cuenta dice <code>4 / 140</code>', prueba: 'const t = document.querySelector("#mensaje"); t.value = "hola"; t.dispatchEvent(new Event("input", { bubbles: true })); return document.querySelector("#cuenta").textContent.trim() === "4 / 140";' },
    { texto: 'Con 141 caracteres, la cuenta se marca y el botón se desactiva', prueba: 'const t = document.querySelector("#mensaje"); t.value = "x".repeat(141); t.dispatchEvent(new Event("input", { bubbles: true })); return document.querySelector("#cuenta").classList.contains("excedido") && document.querySelector("#enviar").disabled;' },
    { texto: 'Al volver a bajar, todo vuelve a la normalidad', prueba: 'const t = document.querySelector("#mensaje"); t.value = "x".repeat(141); t.dispatchEvent(new Event("input", { bubbles: true })); t.value = "corto"; t.dispatchEvent(new Event("input", { bubbles: true })); return !document.querySelector("#cuenta").classList.contains("excedido") && !document.querySelector("#enviar").disabled;' },
    { texto: 'Reacciona al evento <code>input</code>', prueba: String.raw`return /addEventListener\s*\(\s*["']input["']/.test(__codigo);` },
  ],
  pistas: [
    'Escucha cada cambio del texto: <code>mensaje.addEventListener("input", () =&gt; { … });</code>',
    'Dentro: <code>const n = mensaje.value.length;</code> y <code>cuenta.textContent = `${n} / 140`;</code>',
    'Para la clase, <code>cuenta.classList.toggle("excedido", n &gt; 140)</code> la pone o la quita según la condición. Y <code>enviar.disabled = n &gt; 140;</code>',
  ] as [string, string, string],
  solucion: `const mensaje = document.querySelector("#mensaje");
const cuenta = document.querySelector("#cuenta");
const enviar = document.querySelector("#enviar");
const LIMITE = 140;

mensaje.addEventListener("input", () => {
  const n = mensaje.value.length;
  const excedido = n > LIMITE;
  cuenta.textContent = \`\${n} / \${LIMITE}\`;
  cuenta.classList.toggle("excedido", excedido);
  enviar.disabled = excedido;
});`,
  explicacion:
    '<p>El evento <code>input</code> llega con cada cambio: teclas, pegar, borrar o el dictado por voz. <code>keydown</code> se perdería el pegado con el mouse. <code>classList.toggle</code> con su segundo argumento evita un <code>if…else</code>, y el estilo vive en el CSS: el código solo dice qué estado tiene la cuenta.</p>',
};
