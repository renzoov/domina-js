// Ejercicios de la sección 13: «JavaScript en el navegador».
// Los laboratorios con `pagina` corren en un iframe con DOM: las verificaciones
// se ejecutan en orden, en la misma página, después del código del lector.

/* ── 13.1 Cómo carga una página ──────────────────────────── */
export const cargaAuto = {
  id: 'carga-auto',
  titulo: 'Del HTML a la página',
  preguntas: [
    {
      pregunta: '¿Qué hace el navegador al encontrar <code>&lt;script src="app.js"&gt;</code>, sin atributos, en medio del HTML?',
      opciones: ['Lo ignora hasta el final', 'Detiene la lectura del HTML, descarga el script, lo ejecuta y recién entonces sigue', 'Lo descarga en paralelo'],
      correcta: 1,
      explicacion: 'Un script clásico bloquea al analizador del HTML: por eso tradicionalmente se ponían al final del <code>&lt;body&gt;</code>.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>defer</code> y <code>async</code>?',
      opciones: [
        'Ninguna',
        'Los dos descargan en paralelo; <code>defer</code> ejecuta al terminar el HTML y en orden, <code>async</code> ejecuta en cuanto llega, en cualquier orden',
        '<code>async</code> nunca se ejecuta',
      ],
      correcta: 1,
      explicacion: '<code>defer</code> para el código de la página; <code>async</code> para scripts independientes, como la analítica.',
    },
    {
      pregunta: '¿Cómo se comporta <code>&lt;script type="module"&gt;</code>?',
      opciones: ['Como un script clásico', 'Como <code>defer</code>: descarga en paralelo y se ejecuta al terminar el HTML', 'Como <code>async</code>'],
      correcta: 1,
      explicacion: 'Los módulos son diferidos por defecto. Con <code>async</code> se ejecutan en cuanto están listos.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>DOMContentLoaded</code> y <code>load</code>?',
      opciones: [
        'Ninguna',
        '<code>DOMContentLoaded</code>: el HTML se leyó y los scripts diferidos corrieron. <code>load</code>: además terminaron de cargar imágenes, estilos e iframes',
        '<code>load</code> ocurre primero',
      ],
      correcta: 1,
      explicacion: 'Para manipular el DOM basta con <code>DOMContentLoaded</code> (o con <code>defer</code>, que ya lo garantiza).',
    },
  ],
};

export const cargaOrden = {
  id: 'carga-orden',
  titulo: 'Quién corre primero',
  codigo: `<script>
  console.log("clásico A");
  document.addEventListener("DOMContentLoaded", () => console.log("DOMContentLoaded"));
  window.addEventListener("load", () => console.log("load"));
</script>

<script defer src="diferido.js"></script>   <!-- imprime "defer" -->

<script>
  console.log("clásico B");
</script>`,
  salida: ['clásico A', 'clásico B', 'defer', 'DOMContentLoaded', 'load'],
  inicio: [2, 4, 0, 3, 1],
  explicacion:
    'Los scripts clásicos corren al aparecer en el HTML, en orden. El diferido espera a que termine el HTML, y corre justo antes de <code>DOMContentLoaded</code>. <code>load</code> llega al final, cuando cargó todo lo demás.',
};

export const cargaDetective = {
  id: 'carga-detective',
  titulo: 'Un elemento que todavía no existe',
  codigo: `<!-- index.html -->
<head>
  <script src="app.js"></script>
</head>
<body>
  <h1 id="titulo"></h1>
</body>

// app.js
document.querySelector("#titulo").textContent = "Bienvenida";`,
  error: `Uncaught TypeError: Cannot set properties of null (setting 'textContent')
    at app.js:1:43`,
  culpable: 3,
  hallazgo:
    'El script está en el <code>&lt;head&gt;</code> y es clásico: se ejecuta en cuanto el navegador lo encuentra, antes de leer el <code>&lt;body&gt;</code>. En ese momento el <code>&lt;h1&gt;</code> no existe, y <code>querySelector</code> devuelve <code>null</code>.',
  pista: 'Cuando corre <code>app.js</code>, ¿hasta qué línea del HTML leyó el navegador?',
  arreglos: [
    {
      texto: 'Agregar <code>defer</code>: <code>&lt;script src="app.js" defer&gt;&lt;/script&gt;</code>',
      correcta: true,
      porque: 'Con <code>defer</code>, el script se descarga en paralelo y se ejecuta cuando el HTML terminó de leerse: el <code>&lt;h1&gt;</code> ya existe. <code>type="module"</code> tendría el mismo efecto.',
    },
    {
      texto: 'Usar encadenamiento opcional: <code>document.querySelector("#titulo")?.textContent = …</code>',
      correcta: false,
      porque: 'No se puede asignar a través de <code>?.</code>: es un <code>SyntaxError</code>. Y aunque se pudiera, el título quedaría vacío.',
    },
    {
      texto: 'Buscar por etiqueta: <code>document.querySelector("h1")</code>',
      correcta: false,
      porque: 'El problema no es el selector, sino el momento: ningún <code>&lt;h1&gt;</code> existe todavía.',
    },
  ],
};

/* ── 13.2 El DOM ─────────────────────────────────────────── */
export const domAuto = {
  id: 'dom-auto',
  titulo: 'El árbol de la página',
  preguntas: [
    {
      pregunta: '¿Qué devuelve <code>document.querySelector(".x")</code> si no hay ningún elemento con esa clase?',
      opciones: ['Un array vacío', '<code>null</code>', 'Un error'],
      correcta: 1,
      explicacion: '<code>querySelectorAll</code>, en cambio, devuelve una lista vacía. Por eso conviene comprobar el resultado de <code>querySelector</code>.',
    },
    {
      pregunta: '¿Por qué preferir <code>textContent</code> a <code>innerHTML</code> para mostrar un texto?',
      opciones: ['Por velocidad', 'Porque <code>innerHTML</code> interpreta el texto como HTML: un dato con <code>&lt;img onerror=…&gt;</code> ejecutaría código', 'No hay diferencia'],
      correcta: 1,
      explicacion: 'Es la vía más común de ataques XSS. Con <code>textContent</code>, cualquier <code>&lt;</code> se muestra como texto.',
    },
    {
      pregunta: '¿Qué tiene de especial la lista que devuelve <code>querySelectorAll</code>?',
      opciones: ['Nada', 'Es una <code>NodeList</code> estática: no es un array (no tiene <code>map</code>) y no cambia si el DOM cambia', 'Se actualiza sola'],
      correcta: 1,
      explicacion: 'Tiene <code>forEach</code> y se puede recorrer con <code>for...of</code>; para <code>map</code> o <code>filter</code>, conviértela con <code>[...lista]</code>.',
    },
    {
      pregunta: '¿Para qué sirve <code>elemento.dataset</code>?',
      opciones: ['Para guardar datos en el servidor', 'Para leer y escribir los atributos <code>data-*</code>: <code>data-id="7"</code> es <code>dataset.id</code>', 'Para estilos'],
      correcta: 1,
      explicacion: 'Los nombres con guiones pasan a camelCase: <code>data-precio-final</code> es <code>dataset.precioFinal</code>. Los valores siempre son textos.',
    },
  ],
};

export const domOrden = {
  id: 'dom-orden',
  titulo: 'Listas estáticas y vivas',
  codigo: `document.body.innerHTML = \`<ul><li>uno</li><li class="x">dos</li></ul>\`;

const items = document.querySelectorAll("li");
console.log(items.length);
console.log(document.querySelector(".x").textContent);

items[0].remove();
console.log(document.querySelectorAll("li").length, items.length);
console.log(document.querySelector("ul").children[0].className);`,
  salida: ['2', 'dos', '1 2', 'x'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Después de borrar el primer <code>li</code>, una búsqueda nueva encuentra uno solo, pero <code>items</code> sigue teniendo 2: la <code>NodeList</code> de <code>querySelectorAll</code> es una foto del momento. El primer hijo del <code>ul</code> ahora es el de la clase <code>x</code>.',
};

export const domDetective = {
  id: 'dom-detective',
  titulo: 'Una lista que no es un array',
  codigo: `const precios = document.querySelectorAll(".precio")
  .map((el) => Number(el.textContent));

console.log(precios);`,
  error: `Uncaught TypeError: document.querySelectorAll(...).map is not a function
    at precios.js:2:4`,
  culpable: 1,
  hallazgo:
    '<code>querySelectorAll</code> devuelve una <code>NodeList</code>, no un array. Tiene <code>forEach</code>, <code>length</code> y se puede recorrer, pero no tiene <code>map</code>, <code>filter</code> ni <code>reduce</code>.',
  pista: '¿Qué tipo de valor devuelve <code>querySelectorAll</code>? ¿Tiene <code>map</code>?',
  arreglos: [
    {
      texto: 'Convertirla en array: <code>[...document.querySelectorAll(".precio")].map(…)</code>',
      correcta: true,
      porque: 'El spread (o <code>Array.from</code>) crea un array con los elementos, y los arrays tienen todos los métodos.',
    },
    {
      texto: 'Usar <code>.forEach</code> en lugar de <code>.map</code>',
      correcta: false,
      porque: 'Ya no falla, pero <code>forEach</code> devuelve <code>undefined</code>: <code>precios</code> no tendría los números.',
    },
    {
      texto: 'Usar <code>querySelector</code>',
      correcta: false,
      porque: 'Devuelve un solo elemento, y un elemento tampoco tiene <code>map</code>.',
    },
  ],
};

export const domLab = {
  id: 'dom-lab',
  titulo: 'Una lista de tareas',
  pagina: `<h2>Tareas</h2>
<ul id="lista"></ul>`,
  inicial: `const tareas = [
  { texto: "Leer", hecha: true },
  { texto: "Practicar", hecha: false },
  { texto: "Descansar", hecha: true },
];
const lista = document.querySelector("#lista");

// Por cada tarea, crea un <li> con su texto y agrégalo a la lista.
// Si está hecha, ponle la clase "hecha". Sin innerHTML.
`,
  verificaciones: [
    { texto: 'La lista tiene tres <code>&lt;li&gt;</code> con los textos, en orden', prueba: 'return [...document.querySelectorAll("#lista li")].map((li) => li.textContent).join() === "Leer,Practicar,Descansar";' },
    { texto: 'Las tareas hechas tienen la clase <code>hecha</code>', prueba: 'return [...document.querySelectorAll("#lista li")].map((li) => li.classList.contains("hecha")).join() === "true,false,true";' },
    { texto: 'Usa <code>createElement</code> y no <code>innerHTML</code>', prueba: String.raw`return /createElement\s*\(/.test(__codigo) && !/innerHTML/.test(__codigo);` },
  ],
  pistas: [
    'Recorre las tareas: <code>for (const tarea of tareas) { … }</code>',
    'Dentro: <code>const li = document.createElement("li"); li.textContent = tarea.texto;</code>',
    'La clase: <code>li.classList.toggle("hecha", tarea.hecha);</code>. Y al final: <code>lista.append(li);</code>',
  ] as [string, string, string],
  solucion: `const tareas = [
  { texto: "Leer", hecha: true },
  { texto: "Practicar", hecha: false },
  { texto: "Descansar", hecha: true },
];
const lista = document.querySelector("#lista");

for (const tarea of tareas) {
  const li = document.createElement("li");
  li.textContent = tarea.texto;
  li.classList.toggle("hecha", tarea.hecha);
  lista.append(li);
}`,
  explicacion:
    '<p><code>classList.toggle(clase, condicion)</code> pone o quita la clase según la condición, en una línea. Y con <code>textContent</code>, si una tarea viniera de un usuario con <code>&lt;script&gt;</code> en el texto, se mostraría como texto, sin ejecutarse.</p>',
};

/* ── 13.3 Eventos ────────────────────────────────────────── */
export const eventosAuto = {
  id: 'eventos-auto',
  titulo: 'Reaccionar a lo que pasa',
  preguntas: [
    {
      pregunta: 'Un clic en un botón dentro de un <code>&lt;li&gt;</code>, ¿qué listeners de <code>click</code> se ejecutan?',
      opciones: ['Solo los del botón', 'Los del botón y, después, los de cada ancestro: el <code>li</code>, la lista, el <code>body</code>…', 'Solo los del <code>li</code>'],
      correcta: 1,
      explicacion: 'Es el <b>burbujeo</b>: el evento sube desde el elemento donde ocurrió hasta <code>window</code>.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>e.target</code> y <code>e.currentTarget</code>?',
      opciones: [
        'Ninguna',
        '<code>target</code> es donde ocurrió el evento (quizá un hijo); <code>currentTarget</code> es el elemento cuyo listener se está ejecutando',
        'Son de distintos eventos',
      ],
      correcta: 1,
      explicacion: 'Si el botón tiene un ícono adentro y haces clic en el ícono, <code>target</code> es el ícono.',
    },
    {
      pregunta: '¿Qué es la <b>delegación de eventos</b>?',
      opciones: [
        'Pasar un evento a otra página',
        'Poner un solo listener en un contenedor y usar <code>e.target</code> para saber en qué hijo ocurrió',
        'Cancelar eventos',
      ],
      correcta: 1,
      explicacion: 'Funciona gracias al burbujeo, y sirve también para los elementos que se agreguen después.',
    },
    {
      pregunta: '¿Qué hace <code>e.preventDefault()</code>?',
      opciones: ['Detiene el burbujeo', 'Cancela la acción por defecto del navegador: seguir un enlace, enviar un formulario, marcar un checkbox…', 'Borra el listener'],
      correcta: 1,
      explicacion: 'Para detener el burbujeo está <code>e.stopPropagation()</code>, que se usa mucho menos.',
    },
  ],
};

export const eventosOrden = {
  id: 'eventos-orden',
  titulo: 'Captura y burbujeo',
  codigo: `document.body.innerHTML = \`<div id="tarjeta"><button id="me-gusta">❤</button></div>\`;
const tarjeta = document.querySelector("#tarjeta");
const boton = document.querySelector("#me-gusta");

document.addEventListener("click", () => console.log("document"));
tarjeta.addEventListener("click", () => console.log("tarjeta"));
tarjeta.addEventListener("click", () => console.log("tarjeta, en captura"), { capture: true });
boton.addEventListener("click", () => console.log("botón"));

boton.click();`,
  salida: ['tarjeta, en captura', 'botón', 'tarjeta', 'document'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Un evento viaja en tres fases: <b>captura</b>, bajando desde <code>window</code> hasta el elemento; el propio elemento; y <b>burbujeo</b>, subiendo de vuelta. Los listeners con <code>capture: true</code> corren al bajar; los normales, al subir.',
};

export const eventosDetective = {
  id: 'eventos-detective',
  titulo: 'Un clic en el ícono',
  codigo: `<button class="borrar" data-id="a1">
  <span>🗑</span> Borrar
</button>

<script>
  document.querySelector(".borrar").addEventListener("click", (e) => {
    console.log("borrando", e.target.dataset.id.toUpperCase());
  });
</script>`,
  error: `Uncaught TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at HTMLButtonElement.<anonymous> (index.html:7:52)`,
  culpable: 7,
  hallazgo:
    'Funciona si haces clic en la palabra "Borrar", pero no en el ícono: entonces <code>e.target</code> es el <code>&lt;span&gt;</code>, que no tiene <code>data-id</code>. El evento burbujeó desde el ícono hasta el botón.',
  pista: 'Cuando el clic cae en el <code>&lt;span&gt;</code>, ¿qué elemento es <code>e.target</code>? ¿Tiene <code>data-id</code>?',
  arreglos: [
    {
      texto: 'Usar <code>e.currentTarget.dataset.id</code>',
      correcta: true,
      porque: '<code>currentTarget</code> es siempre el elemento del listener, el botón, sin importar en qué hijo cayó el clic. Con delegación, la alternativa es <code>e.target.closest(".borrar")</code>.',
    },
    {
      texto: 'Usar <code>e.target.parentElement.dataset.id</code>',
      correcta: false,
      porque: 'Funciona para el ícono, pero se rompe al hacer clic en el texto: el padre del botón no tiene <code>data-id</code>.',
    },
    {
      texto: 'Agregar <code>e.stopPropagation()</code> al principio',
      correcta: false,
      porque: 'No cambia qué elemento es <code>e.target</code>: solo impide que el evento siga subiendo después del botón.',
    },
  ],
};

export const eventosLab = {
  id: 'eventos-lab',
  titulo: 'Borrar con un solo listener',
  pagina: `<ul id="compras">
  <li>Pan <button class="borrar">Borrar</button></li>
  <li>Leche <button class="borrar">Borrar</button></li>
  <li>Huevos <button class="borrar">Borrar</button></li>
</ul>
<button id="agregar">Agregar café</button>`,
  inicial: `const lista = document.querySelector("#compras");

document.querySelector("#agregar").addEventListener("click", () => {
  const li = document.createElement("li");
  const boton = document.createElement("button");
  boton.className = "borrar";
  boton.textContent = "Borrar";
  li.append("Café ", boton);
  lista.append(li);
});

// Con UN solo listener en la lista (delegación), haz que cada botón
// "Borrar" elimine su <li>, también los que se agreguen después.
`,
  verificaciones: [
    { texto: 'Al hacer clic en el segundo "Borrar", desaparece la leche', prueba: 'document.querySelectorAll("#compras .borrar")[1].click(); return [...document.querySelectorAll("#compras li")].map((li) => li.firstChild.textContent.trim()).join() === "Pan,Huevos";' },
    { texto: 'Funciona con los elementos agregados después', prueba: 'document.querySelector("#agregar").click(); const botones = document.querySelectorAll("#compras .borrar"); botones[botones.length - 1].click(); return document.querySelectorAll("#compras li").length === 2 && !document.querySelector("#compras").textContent.includes("Café");' },
    { texto: 'Usa un solo listener en la lista', prueba: String.raw`return /lista\.addEventListener\s*\(\s*["']click/.test(__codigo) && !/\.forEach\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Agrega el listener al contenedor: <code>lista.addEventListener("click", (e) => { … });</code>',
    'Averigua si el clic fue en un botón de borrar: <code>const boton = e.target.closest(".borrar");</code>',
    'Si lo fue, borra su <code>li</code>: <code>if (boton) boton.closest("li").remove();</code>',
  ] as [string, string, string],
  solucion: `const lista = document.querySelector("#compras");

document.querySelector("#agregar").addEventListener("click", () => {
  const li = document.createElement("li");
  const boton = document.createElement("button");
  boton.className = "borrar";
  boton.textContent = "Borrar";
  li.append("Café ", boton);
  lista.append(li);
});

lista.addEventListener("click", (e) => {
  const boton = e.target.closest(".borrar");
  if (boton) boton.closest("li").remove();
});`,
  explicacion:
    '<p>Un solo listener atiende a todos los botones, incluso a los que todavía no existen, porque el clic de cualquiera burbujea hasta la lista. <code>closest</code> sube desde el elemento clicado hasta encontrar el que buscas, así que también funciona si el botón tuviera un ícono adentro.</p>',
};

/* ── 13.4 Formularios y validación ───────────────────────── */
export const formAuto = {
  id: 'form-auto',
  titulo: 'Datos que llegan del usuario',
  preguntas: [
    {
      pregunta: '¿Qué evento conviene escuchar para enviar un formulario?',
      opciones: ['<code>click</code> en el botón', '<code>submit</code> en el formulario: también se dispara al pulsar Enter', '<code>change</code>'],
      correcta: 1,
      explicacion: 'Con <code>click</code> te perderías los envíos con el teclado.',
    },
    {
      pregunta: '¿Qué hace <code>new FormData(form)</code>?',
      opciones: ['Valida el formulario', 'Junta todos los campos con <code>name</code> y sus valores, listos para leer o enviar', 'Borra el formulario'],
      correcta: 1,
      explicacion: '<code>Object.fromEntries(new FormData(form))</code> lo convierte en un objeto. Con campos repetidos, usa <code>getAll</code>.',
    },
    {
      pregunta: 'Un <code>&lt;input type="number"&gt;</code>, ¿qué devuelve su <code>value</code>?',
      opciones: ['Un número', 'Siempre un texto', 'Depende'],
      correcta: 1,
      explicacion: 'Todos los <code>value</code> son textos. Para un número, usa <code>input.valueAsNumber</code> o <code>Number(input.value)</code>.',
    },
    {
      pregunta: '¿Qué hace <code>input.setCustomValidity("mensaje")</code>?',
      opciones: ['Nada', 'Marca el campo como inválido con ese mensaje; con <code>""</code> vuelve a ser válido', 'Cambia el valor'],
      correcta: 1,
      explicacion: 'Así sumas reglas propias (como "las contraseñas no coinciden") a la validación del navegador.',
    },
  ],
};

export const formOrden = {
  id: 'form-orden',
  titulo: 'Leer un formulario',
  codigo: `document.body.innerHTML = \`
  <form id="f">
    <input name="nombre" value="Ana">
    <input name="interes" type="checkbox" value="js" checked>
    <input name="interes" type="checkbox" value="css" checked>
    <input name="interes" type="checkbox" value="sql">
    <input name="edad" type="number" value="31">
  </form>\`;

const datos = new FormData(document.querySelector("#f"));
console.log(datos.get("nombre"));
console.log(datos.getAll("interes").join(","));
console.log(typeof datos.get("edad"));
console.log(Object.fromEntries(datos).interes);`,
  salida: ['Ana', 'js,css', 'string', 'css'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Las casillas sin marcar no aparecen; las marcadas con el mismo <code>name</code> se leen con <code>getAll</code>. Todos los valores son textos, aunque el campo sea numérico. <code>Object.fromEntries</code> se queda con el <b>último</b> valor de cada nombre.',
};

export const formDetective = {
  id: 'form-detective',
  titulo: 'Un campo con otro nombre',
  codigo: `<form id="contacto">
  <input name="correo" type="email">
  <button>Enviar</button>
</form>

<script>
  const form = document.querySelector("#contacto");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Enviando a", form.email.value);
  });
</script>`,
  error: `Uncaught TypeError: Cannot read properties of undefined (reading 'value')
    at HTMLFormElement.<anonymous> (index.html:10:41)`,
  culpable: 10,
  hallazgo:
    'Un formulario expone sus campos por su <code>name</code>: <code>form.correo</code>. <code>email</code> es el <b>tipo</b> del campo, no su nombre, así que <code>form.email</code> es <code>undefined</code>.',
  pista: '¿Cómo se llama el campo, según su atributo <code>name</code>?',
  arreglos: [
    {
      texto: 'Usar el nombre real: <code>form.correo.value</code> (o <code>new FormData(form).get("correo")</code>)',
      correcta: true,
      porque: 'Los campos se buscan por <code>name</code>. Con <code>FormData</code> además lees todos los campos de una vez.',
    },
    {
      texto: 'Buscar por tipo: <code>form.querySelector("email")</code>',
      correcta: false,
      porque: 'Ese selector busca una etiqueta <code>&lt;email&gt;</code>, que no existe: devuelve <code>null</code>. Sería <code>[type=email]</code>.',
    },
    {
      texto: 'Usar <code>e.target.value</code>',
      correcta: false,
      porque: 'En el evento <code>submit</code>, <code>e.target</code> es el formulario, que no tiene <code>value</code>: imprimiría <code>undefined</code>.',
    },
  ],
};

export const formLab = {
  id: 'form-lab',
  titulo: 'Un registro validado',
  pagina: `<form id="registro" novalidate>
  <p><label>Nombre <input name="nombre" required></label></p>
  <p><label>Email <input name="email" type="email" required></label></p>
  <button>Registrarme</button>
</form>
<p id="mensaje"></p>`,
  inicial: `const form = document.querySelector("#registro");
const mensaje = document.querySelector("#mensaje");

// Al enviar el formulario:
// - evita que la página se recargue
// - si no es válido (form.checkValidity()), muestra "Revisa los campos" en #mensaje
// - si es válido, lee los datos con FormData y muestra "Hola, <nombre> (<email>)"

form.nombre.value = "Ana";
form.email.value = "ana@mail.com";
form.requestSubmit();
`,
  verificaciones: [
    { texto: 'Con datos válidos, muestra <code>Hola, Ana (ana@mail.com)</code>', prueba: 'return document.querySelector("#mensaje").textContent === "Hola, Ana (ana@mail.com)";' },
    { texto: 'Con un email inválido, muestra <code>Revisa los campos</code>', prueba: 'form.email.value = "no-es-un-email"; form.requestSubmit(); return mensaje.textContent === "Revisa los campos";' },
    { texto: 'Usa <code>preventDefault</code> y <code>FormData</code>', prueba: String.raw`return /preventDefault\s*\(/.test(__codigo) && /new\s+FormData\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Antes de las líneas de prueba: <code>form.addEventListener("submit", (e) => { e.preventDefault(); … });</code>',
    'Dentro: <code>if (!form.checkValidity()) { mensaje.textContent = "Revisa los campos"; return; }</code>',
    'Después: <code>const datos = new FormData(form);</code> y <code>mensaje.textContent = `Hola, ${datos.get("nombre")} (${datos.get("email")})`;</code>',
  ] as [string, string, string],
  solucion: `const form = document.querySelector("#registro");
const mensaje = document.querySelector("#mensaje");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    mensaje.textContent = "Revisa los campos";
    return;
  }
  const datos = new FormData(form);
  mensaje.textContent = \`Hola, \${datos.get("nombre")} (\${datos.get("email")})\`;
});

form.nombre.value = "Ana";
form.email.value = "ana@mail.com";
form.requestSubmit();`,
  explicacion:
    '<p>El formulario tiene <code>novalidate</code> para que el navegador no muestre sus propios globos de error y la validación la controle tu código, pero las reglas de HTML (<code>required</code>, <code>type="email"</code>) siguen funcionando a través de <code>checkValidity()</code>. <code>requestSubmit()</code> envía el formulario como si el usuario pulsara el botón.</p>',
};

/* ── 13.5 Estilos y animación ────────────────────────────── */
export const estilosAuto = {
  id: 'estilos-auto',
  titulo: 'Cambiar cómo se ve',
  preguntas: [
    {
      pregunta: 'Para cambiar el aspecto de un elemento, ¿qué conviene más?',
      opciones: ['Escribir cada propiedad en <code>elemento.style</code>', 'Poner o quitar clases con <code>classList</code> y dejar los estilos en el CSS', 'Reescribir el HTML'],
      correcta: 1,
      explicacion: 'El CSS queda en un solo lugar, se puede animar con transiciones y es más fácil de mantener. <code>style</code> sirve para valores calculados, como una posición.',
    },
    {
      pregunta: '¿Qué devuelve <code>elemento.style.color</code> si el color viene de una hoja de estilos?',
      opciones: ['El color', 'Un texto vacío: <code>style</code> solo ve los estilos en línea', 'Un error'],
      correcta: 1,
      explicacion: 'Para el valor que de verdad se aplica, usa <code>getComputedStyle(elemento).color</code>.',
    },
    {
      pregunta: '¿Qué devuelve <code>elemento.animate(fotogramas, opciones)</code>?',
      opciones: ['Nada', 'Un objeto <code>Animation</code> que se puede pausar, invertir o esperar con <code>await animacion.finished</code>', 'Una promesa'],
      correcta: 1,
      explicacion: 'Es la Web Animations API: las animaciones de CSS, controladas desde JavaScript.',
    },
    {
      pregunta: '¿Qué hace <code>document.startViewTransition(actualizar)</code>?',
      opciones: ['Recarga la página', 'Toma una foto de la página, ejecuta <code>actualizar</code> y anima el paso del estado viejo al nuevo', 'Cambia de pestaña'],
      correcta: 1,
      explicacion: 'Es la View Transitions API. Este mismo sitio la usa para pasar de una lección a otra.',
    },
  ],
};

export const estilosOrden = {
  id: 'estilos-orden',
  titulo: 'Estilos en línea y calculados',
  codigo: `document.body.innerHTML = \`<div id="caja" style="width: 100px"></div>\`;
const caja = document.querySelector("#caja");

caja.style.setProperty("--color", "tomato");
caja.style.marginTop = "8px";

console.log(caja.style.width, caja.style.height === "");
console.log(caja.style.getPropertyValue("--color"));
console.log(getComputedStyle(caja).marginTop);
console.log(caja.getAttribute("style"));`,
  salida: ['100px true', 'tomato', '8px', 'width: 100px; --color: tomato; margin-top: 8px;'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>style</code> refleja el atributo <code>style</code> del HTML: lo que no está escrito ahí es un texto vacío. Las propiedades personalizadas (<code>--color</code>) se escriben con <code>setProperty</code>. En JavaScript, <code>margin-top</code> se escribe <code>marginTop</code>.',
};

export const estilosDetective = {
  id: 'estilos-detective',
  titulo: 'Una propiedad con guion',
  codigo: `const aviso = document.querySelector(".aviso");

aviso.style.background-color = "tomato";`,
  error: `Uncaught SyntaxError: Invalid left-hand side in assignment`,
  culpable: 3,
  hallazgo:
    'En JavaScript, <code>-</code> es una resta: la línea se lee como <code>aviso.style.background - color = "tomato"</code>, y no se puede asignar a una resta. Es un error de sintaxis: el script entero no llega a ejecutarse.',
  pista: '¿Cómo lee JavaScript el guion en <code>background-color</code>?',
  arreglos: [
    {
      texto: 'Usar camelCase: <code>aviso.style.backgroundColor = "tomato";</code>',
      correcta: true,
      porque: 'Las propiedades de CSS con guiones se escriben en camelCase en <code>style</code>. También vale <code>aviso.style.setProperty("background-color", "tomato")</code>.',
    },
    {
      texto: 'Envolverlo en comillas: <code>aviso.style."background-color" = …</code>',
      correcta: false,
      porque: 'Tampoco es sintaxis válida. Con corchetes sí: <code>aviso.style["background-color"]</code>.',
    },
    {
      texto: 'Cambiarlo por <code>aviso.background = "tomato";</code>',
      correcta: false,
      porque: 'No da error, pero crea una propiedad <code>background</code> en el objeto del elemento, sin ningún efecto visual.',
    },
  ],
};

export const estilosLab = {
  id: 'estilos-lab',
  titulo: 'Modo claro y oscuro',
  pagina: `<style>
  html.claro body { background: #eceae2; color: #14201a; }
</style>
<button id="tema">Modo claro</button>
<p>Este texto cambia de color con el tema.</p>`,
  inicial: `const boton = document.querySelector("#tema");

// Al hacer clic en el botón:
// - alterna la clase "claro" en <html> (document.documentElement)
// - cambia el texto del botón: "Modo oscuro" si quedó en claro, "Modo claro" si no
// - anima la opacidad de <body> de 0.4 a 1 en 300 ms con element.animate
`,
  verificaciones: [
    { texto: 'El primer clic activa el modo claro y cambia el texto del botón', prueba: 'boton.click(); return document.documentElement.classList.contains("claro") && boton.textContent === "Modo oscuro";' },
    { texto: 'El segundo clic vuelve al modo oscuro', prueba: 'const antes = document.documentElement.classList.contains("claro"); boton.click(); return antes && !document.documentElement.classList.contains("claro") && boton.textContent === "Modo claro";' },
    { texto: 'Cada clic anima el <code>body</code> con <code>animate</code>', prueba: 'boton.click(); return document.body.getAnimations().length > 0 && /classList\\.toggle/.test(__codigo);' },
  ],
  pistas: [
    'Empieza con <code>boton.addEventListener("click", () => { … });</code>',
    '<code>toggle</code> devuelve si la clase quedó puesta: <code>const claro = document.documentElement.classList.toggle("claro");</code>',
    'La animación: <code>document.body.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 300 });</code>',
  ] as [string, string, string],
  solucion: `const boton = document.querySelector("#tema");

boton.addEventListener("click", () => {
  const claro = document.documentElement.classList.toggle("claro");
  boton.textContent = claro ? "Modo oscuro" : "Modo claro";
  document.body.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 300 });
});`,
  explicacion:
    '<p>El color de cada modo vive en el CSS: el código solo cambia una clase. Y <code>animate</code> no deja rastro: al terminar, el elemento vuelve a su estilo normal. En un sitio real, respeta también <code>prefers-reduced-motion</code> y guarda la preferencia del usuario.</p>',
};

/* ── 13.6 Observers ──────────────────────────────────────── */
export const observersAuto = {
  id: 'observers-auto',
  titulo: 'Que el navegador te avise',
  preguntas: [
    {
      pregunta: '¿Para qué sirve <code>IntersectionObserver</code>?',
      opciones: ['Para detectar choques entre elementos', 'Para saber cuándo un elemento entra o sale de la parte visible de la página', 'Para medir tiempos'],
      correcta: 1,
      explicacion: 'Carga diferida de imágenes, scroll infinito, animaciones al aparecer, contar qué se vio. Sin escuchar <code>scroll</code>.',
    },
    {
      pregunta: '¿Y <code>ResizeObserver</code>?',
      opciones: ['Avisa cuando cambia el tamaño de un elemento, no solo de la ventana', 'Cambia el tamaño', 'Avisa al redimensionar la ventana, nada más'],
      correcta: 0,
      explicacion: 'Útil para componentes que se adaptan a su propio espacio, como un gráfico dentro de una columna.',
    },
    {
      pregunta: '¿Y <code>MutationObserver</code>?',
      opciones: ['Avisa cuando cambia el DOM: hijos agregados o quitados, atributos, texto', 'Cambia el DOM', 'Detecta errores'],
      correcta: 0,
      explicacion: 'Útil cuando el DOM lo cambia código que no controlas, como una librería.',
    },
    {
      pregunta: '¿Cuándo se llama al callback de un <code>MutationObserver</code>?',
      opciones: ['En cada cambio, en el momento', 'Una vez, en una microtarea, con todos los cambios juntos en un array', 'Cada segundo'],
      correcta: 1,
      explicacion: 'Agregar cien elementos seguidos produce una sola llamada con cien registros, no cien llamadas.',
    },
  ],
};

export const observersOrden = {
  id: 'observers-orden',
  titulo: 'Cambios agrupados',
  codigo: `document.body.innerHTML = \`<ul id="lista"></ul>\`;
const lista = document.querySelector("#lista");

const obs = new MutationObserver((cambios) => console.log("cambios:", cambios.length));
obs.observe(lista, { childList: true });

lista.append(document.createElement("li"));
lista.append(document.createElement("li"));
console.log("agregados");

await null;
lista.firstChild.remove();`,
  salida: ['agregados', 'cambios: 2', 'cambios: 1'],
  inicio: [2, 0, 1],
  explicacion:
    'El observador no interrumpe al código: junta los dos cambios y avisa una sola vez, en una microtarea, cuando el código cede el control. El <code>await</code> lo cede, y la reacción a lo que pase después llega en otra tanda.',
};

export const observersDetective = {
  id: 'observers-detective',
  titulo: 'Observar una lista entera',
  codigo: `const imagenes = document.querySelectorAll("img[data-src]");

const obs = new IntersectionObserver((entradas) => {
  for (const e of entradas) if (e.isIntersecting) e.target.src = e.target.dataset.src;
});

obs.observe(imagenes);`,
  error: `Uncaught TypeError: Failed to execute 'observe' on 'IntersectionObserver': parameter 1 is not of type 'Element'.
    at galeria.js:7:5`,
  culpable: 7,
  hallazgo:
    '<code>observe</code> recibe <b>un</b> elemento por llamada, y <code>imagenes</code> es una <code>NodeList</code>. Un mismo observador puede vigilar muchos elementos, pero hay que dárselos de a uno.',
  pista: 'El mensaje dice que el parámetro no es un <code>Element</code>. ¿Qué es <code>imagenes</code>?',
  arreglos: [
    {
      texto: 'Observar cada una: <code>imagenes.forEach((img) => obs.observe(img));</code>',
      correcta: true,
      porque: 'Un observador para todas las imágenes, que recibe sus cambios agrupados en <code>entradas</code>. Así funciona la carga diferida.',
    },
    {
      texto: 'Observar la primera: <code>obs.observe(imagenes[0]);</code>',
      correcta: false,
      porque: 'Ya no falla, pero solo se cargaría la primera imagen.',
    },
    {
      texto: 'Crear un observador nuevo por cada imagen',
      correcta: false,
      porque: 'Funcionaría, pero es un desperdicio: un solo observador puede vigilar todos los elementos.',
    },
  ],
};

export const observersLab = {
  id: 'observers-lab',
  titulo: 'Un contador que se actualiza solo',
  pagina: `<ul id="carrito"></ul>
<p id="total">0 productos</p>`,
  inicial: `const carrito = document.querySelector("#carrito");
const total = document.querySelector("#total");

function agregar(nombre) {
  const li = document.createElement("li");
  li.textContent = nombre;
  carrito.append(li);
}

// Con un MutationObserver sobre #carrito, haz que #total diga siempre
// cuántos productos hay: "1 producto", "3 productos"…
// (No toques la función agregar: el contador tiene que enterarse solo.)

agregar("Té");
agregar("Pan");
agregar("Miel");
carrito.firstChild.remove();
`,
  verificaciones: [
    { texto: 'Después de las líneas de prueba, dice <code>2 productos</code>', prueba: 'return total.textContent === "2 productos";' },
    { texto: 'Se actualiza al agregar o quitar, con singular para uno', prueba: 'carrito.lastChild.remove(); await new Promise((r) => setTimeout(r)); const uno = total.textContent; agregar("Sal"); await new Promise((r) => setTimeout(r)); return uno === "1 producto" && total.textContent === "2 productos";' },
    { texto: 'Usa un <code>MutationObserver</code> sin modificar <code>agregar</code>', prueba: String.raw`return /new\s+MutationObserver\s*\(/.test(__codigo) && /childList\s*:\s*true/.test(__codigo) && !/carrito\.append\(li\);\s*\n\s*total/.test(__codigo);` },
  ],
  pistas: [
    'Antes de las líneas de prueba: <code>const obs = new MutationObserver(() => { … });</code>',
    'Dentro: <code>const n = carrito.children.length;</code> y <code>total.textContent = `${n} ${n === 1 ? "producto" : "productos"}`;</code>',
    'Y empieza a observar: <code>obs.observe(carrito, { childList: true });</code>',
  ] as [string, string, string],
  solucion: `const carrito = document.querySelector("#carrito");
const total = document.querySelector("#total");

function agregar(nombre) {
  const li = document.createElement("li");
  li.textContent = nombre;
  carrito.append(li);
}

const obs = new MutationObserver(() => {
  const n = carrito.children.length;
  total.textContent = \`\${n} \${n === 1 ? "producto" : "productos"}\`;
});
obs.observe(carrito, { childList: true });

agregar("Té");
agregar("Pan");
agregar("Miel");
carrito.firstChild.remove();`,
  explicacion:
    '<p>El contador no sabe quién cambia el carrito ni cómo: solo reacciona a los cambios. Y como el observador junta los cambios, las cuatro operaciones del final producen una sola actualización. Para el plural correcto en cualquier idioma, recuerda <code>Intl.PluralRules</code>.</p>',
};

/* ── 13.7 fetch y HTTP ───────────────────────────────────── */
export const fetchAuto = {
  id: 'fetch-auto',
  titulo: 'Pedir y recibir',
  preguntas: [
    {
      pregunta: 'Si el servidor responde con un error 404, ¿qué hace la promesa de <code>fetch</code>?',
      opciones: ['Se rechaza', 'Se cumple igual: hay que mirar <code>res.ok</code> o <code>res.status</code>', 'Queda pendiente'],
      correcta: 1,
      explicacion: '<code>fetch</code> solo se rechaza si no hay respuesta: sin conexión, CORS bloqueado, cancelado. Un 404 o un 500 son respuestas.',
    },
    {
      pregunta: '¿Por qué <code>res.json()</code> devuelve una promesa?',
      opciones: ['Por error', 'Porque el cuerpo de la respuesta llega por partes y hay que esperar a que termine', 'Porque es lento'],
      correcta: 1,
      explicacion: 'Primero llegan el estado y los encabezados (eso cumple <code>fetch</code>); el cuerpo puede tardar más.',
    },
    {
      pregunta: '¿Cómo se envían datos JSON con <code>fetch</code>?',
      opciones: [
        '<code>fetch(url, { datos })</code>',
        '<code>fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) })</code>',
        'No se puede',
      ],
      correcta: 1,
      explicacion: 'Para formularios, también puedes pasar un <code>FormData</code> como <code>body</code>, sin encabezados.',
    },
    {
      pregunta: '¿Qué es CORS?',
      opciones: ['Un formato de datos', 'Las reglas con las que un servidor permite, o no, que páginas de otros orígenes lean sus respuestas', 'Un tipo de error de JavaScript'],
      correcta: 1,
      explicacion: 'Lo decide el servidor con encabezados como <code>Access-Control-Allow-Origin</code>. Desde el navegador no se puede saltar.',
    },
  ],
};

export const fetchOrden = {
  id: 'fetch-orden',
  titulo: 'Una respuesta por dentro',
  codigo: `const r = new Response('{"ok":true}', {
  status: 201,
  headers: { "Content-Type": "application/json" },
});

console.log(r.status, r.ok);
console.log(r.headers.get("content-type"));
console.log((await r.json()).ok);
console.log(r.bodyUsed ? "cuerpo ya leído" : "sin leer");`,
  salida: ['201 true', 'application/json', 'true', 'cuerpo ya leído'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>ok</code> es <code>true</code> para cualquier estado entre 200 y 299. Los encabezados no distinguen mayúsculas. Y el cuerpo se puede leer <b>una sola vez</b>: después de <code>json()</code>, <code>bodyUsed</code> es <code>true</code>.',
};

export const fetchDetective = {
  id: 'fetch-detective',
  titulo: 'Un 404 que pasa desapercibido',
  codigo: `const res = await fetch("/api/productos/999");
const producto = await res.json();

console.log(producto.nombre.toUpperCase());`,
  error: `Uncaught TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at producto.js:4:29`,
  culpable: 2,
  hallazgo:
    'El producto no existe y el servidor respondió 404 con <code>{ "error": "no existe" }</code>. Pero <code>fetch</code> no se rechaza con un 404, y el código leyó ese JSON de error como si fuera un producto, sin mirar el estado.',
  pista: '¿Qué hace <code>fetch</code> cuando el servidor responde 404? ¿Alguien revisó <code>res.ok</code>?',
  arreglos: [
    {
      texto: 'Comprobar antes de leer: <code>if (!res.ok) throw new Error(`HTTP ${res.status}`);</code>',
      correcta: true,
      porque: 'Así un 404 o un 500 se convierten en un error que puedes atrapar con <code>try/catch</code>, en lugar de un dato equivocado.',
    },
    {
      texto: 'Rodear el <code>fetch</code> con <code>try/catch</code>',
      correcta: false,
      porque: 'El <code>fetch</code> no falla: se cumple con la respuesta 404. El <code>catch</code> nunca se ejecutaría.',
    },
    {
      texto: 'Leer el cuerpo con <code>res.text()</code>',
      correcta: false,
      porque: 'Daría el texto del error en lugar del objeto, y <code>producto.nombre</code> seguiría siendo <code>undefined</code>.',
    },
  ],
};

export const fetchLab = {
  id: 'fetch-lab',
  titulo: 'Cargar un usuario',
  pagina: `<p id="estado">Cargando…</p>
<script>
  // Un servidor de mentira: /api/usuarios/1 y /api/usuarios/2 existen; el resto da 404
  const usuarios = { 1: { id: 1, nombre: "Ana" }, 2: { id: 2, nombre: "Luis" } };
  window.fetch = async (url) => {
    await new Promise((r) => setTimeout(r, 30));
    const id = Number(String(url).split("/").pop());
    const cuerpo = usuarios[id] ?? { error: "no existe" };
    return new Response(JSON.stringify(cuerpo), {
      status: usuarios[id] ? 200 : 404,
      headers: { "Content-Type": "application/json" },
    });
  };
</script>`,
  inicial: `// Escribe cargarUsuario(id): pide /api/usuarios/<id> con fetch.
// Si la respuesta no es ok, lanza new Error("HTTP <estado>").
// Si es ok, devuelve el JSON.

const usuario = await cargarUsuario(1);
document.querySelector("#estado").textContent = \`Hola, \${usuario.nombre}\`;
`,
  verificaciones: [
    { texto: 'La página muestra <code>Hola, Ana</code>', prueba: 'return document.querySelector("#estado").textContent === "Hola, Ana";' },
    { texto: 'Devuelve el usuario pedido', prueba: 'return (await cargarUsuario(2)).nombre === "Luis";' },
    { texto: 'Con un usuario que no existe, lanza <code>HTTP 404</code>', prueba: 'try { await cargarUsuario(9); return false; } catch (e) { return e.message === "HTTP 404"; }' },
  ],
  pistas: [
    'Empieza con <code>async function cargarUsuario(id) { const res = await fetch(`/api/usuarios/${id}`); … }</code> arriba de todo.',
    'Comprueba el estado: <code>if (!res.ok) throw new Error(`HTTP ${res.status}`);</code>',
    'Y devuelve el cuerpo: <code>return res.json();</code>',
  ] as [string, string, string],
  solucion: `async function cargarUsuario(id) {
  const res = await fetch(\`/api/usuarios/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

const usuario = await cargarUsuario(1);
document.querySelector("#estado").textContent = \`Hola, \${usuario.nombre}\`;`,
  explicacion:
    '<p>Es el envoltorio que casi todo proyecto termina escribiendo alrededor de <code>fetch</code>: comprobar <code>res.ok</code> y convertir los errores HTTP en excepciones. Así, quien llama solo necesita un <code>try/catch</code>, igual para un 404 que para una red caída.</p>',
};

/* ── 13.8 Guardar datos ──────────────────────────────────── */
export const guardarAuto = {
  id: 'guardar-auto',
  titulo: 'Recordar entre visitas',
  preguntas: [
    {
      pregunta: '¿Qué tipo de valor guarda <code>localStorage</code>?',
      opciones: ['Cualquiera', 'Solo textos: lo demás se convierte en texto al guardar', 'Solo números'],
      correcta: 1,
      explicacion: 'Para objetos y arrays, <code>JSON.stringify</code> al guardar y <code>JSON.parse</code> al leer.',
    },
    {
      pregunta: '¿Qué diferencia hay entre <code>localStorage</code> y <code>sessionStorage</code>?',
      opciones: ['Ninguna', '<code>localStorage</code> dura hasta que se borre; <code>sessionStorage</code>, mientras dure la pestaña', '<code>sessionStorage</code> es más grande'],
      correcta: 1,
      explicacion: 'Los dos son por origen (dominio) y síncronos, con unos pocos megabytes de espacio.',
    },
    {
      pregunta: '¿Cuándo conviene IndexedDB en lugar de <code>localStorage</code>?',
      opciones: ['Nunca', 'Para muchos datos, objetos estructurados, archivos o búsquedas por índice, sin bloquear la página', 'Para un solo ajuste'],
      correcta: 1,
      explicacion: 'Es una base de datos en el navegador, asíncrona. Su API es incómoda: en la práctica se usa con una librería pequeña.',
    },
    {
      pregunta: '¿Es seguro guardar un token de sesión en <code>localStorage</code>?',
      opciones: ['Sí', 'No es lo ideal: cualquier script de la página (incluido uno inyectado) puede leerlo; una cookie <code>HttpOnly</code> no se puede leer desde JavaScript', 'Solo si está cifrado'],
      correcta: 1,
      explicacion: 'Lo vas a ver en <em>Seguridad en el navegador</em>.',
    },
  ],
};

export const guardarOrden = {
  id: 'guardar-orden',
  titulo: 'Todo se vuelve texto',
  codigo: `localStorage.clear();
localStorage.setItem("visitas", 3);
localStorage.setItem("usuario", { nombre: "Ana" });

console.log(typeof localStorage.getItem("visitas"));
console.log(localStorage.getItem("usuario"));
console.log(localStorage.getItem("no-existe"));
console.log(localStorage.length);`,
  salida: ['string', '[object Object]', 'null', '2'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'El número se guardó como el texto <code>"3"</code>, y el objeto, con su conversión por defecto: <code>"[object Object]"</code>, que ya no sirve para nada. Leer una clave que no existe da <code>null</code>.',
};

export const guardarDetective = {
  id: 'guardar-detective',
  titulo: 'Un carrito que todavía no existe',
  codigo: `const carrito = JSON.parse(localStorage.getItem("carrito"));

console.log(\`Tienes \${carrito.length} productos\`);`,
  error: `Uncaught TypeError: Cannot read properties of null (reading 'length')
    at carrito.js:3:30`,
  culpable: 1,
  hallazgo:
    'En la primera visita no hay ningún carrito guardado: <code>getItem</code> devuelve <code>null</code>, y <code>JSON.parse(null)</code> también da <code>null</code>.',
  pista: '¿Qué devuelve <code>getItem</code> si la clave no existe? ¿Y <code>JSON.parse</code> de eso?',
  arreglos: [
    {
      texto: 'Dar un valor por defecto: <code>JSON.parse(localStorage.getItem("carrito") ?? "[]")</code>',
      correcta: true,
      porque: 'Sin carrito guardado, empiezas con uno vacío. Para estar más seguro, envuelve el <code>JSON.parse</code> en un <code>try/catch</code>: el dato guardado también puede estar dañado.',
    },
    {
      texto: 'Usar <code>carrito?.length</code>',
      correcta: false,
      porque: 'Ya no falla, pero muestra "Tienes undefined productos", y el resto del código seguirá esperando un array.',
    },
    {
      texto: 'Usar <code>sessionStorage</code>',
      correcta: false,
      porque: 'Tiene el mismo comportamiento con las claves que no existen, y además se borraría al cerrar la pestaña.',
    },
  ],
};

export const guardarLab = {
  id: 'guardar-lab',
  titulo: 'Preferencias que sobreviven',
  pagina: `<p id="info"></p>
<script>
  // La página de prueba está aislada y no tiene almacenamiento: este es uno de mentira, igual al real
  const datos = new Map();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (k) => (datos.has(String(k)) ? datos.get(String(k)) : null),
      setItem: (k, v) => void datos.set(String(k), String(v)),
      removeItem: (k) => void datos.delete(String(k)),
      clear: () => datos.clear(),
      get length() { return datos.size; },
    },
  });
  localStorage.setItem("dañado", "{no es json");
</script>`,
  inicial: `// Escribe guardar(clave, valor): guarda cualquier valor (objetos incluidos) en localStorage.
// Escribe leer(clave, defecto): devuelve el valor guardado, o defecto si no existe
// o si lo guardado no es JSON válido.

guardar("prefs", { tema: "oscuro", tamaño: 18 });
const prefs = leer("prefs", {});
document.querySelector("#info").textContent = \`Tema \${prefs.tema}, letra \${prefs.tamaño}\`;
`,
  verificaciones: [
    { texto: 'La página muestra <code>Tema oscuro, letra 18</code>', prueba: 'return document.querySelector("#info").textContent === "Tema oscuro, letra 18";' },
    { texto: 'Guarda y recupera arrays, números y booleanos', prueba: 'guardar("a", [1, 2]); guardar("n", 0); guardar("b", false); return JSON.stringify(leer("a")) === "[1,2]" && leer("n", 9) === 0 && leer("b", true) === false;' },
    { texto: 'Devuelve el valor por defecto si no existe o está dañado', prueba: 'return leer("no-existe", "x") === "x" && leer("dañado", "y") === "y";' },
  ],
  pistas: [
    'Guardar: <code>localStorage.setItem(clave, JSON.stringify(valor));</code>',
    'Leer: <code>const texto = localStorage.getItem(clave); if (texto === null) return defecto;</code>',
    'Y el JSON dañado: <code>try { return JSON.parse(texto); } catch { return defecto; }</code>',
  ] as [string, string, string],
  solucion: `function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function leer(clave, defecto) {
  const texto = localStorage.getItem(clave);
  if (texto === null) return defecto;
  try {
    return JSON.parse(texto);
  } catch {
    return defecto;
  }
}

guardar("prefs", { tema: "oscuro", tamaño: 18 });
const prefs = leer("prefs", {});
document.querySelector("#info").textContent = \`Tema \${prefs.tema}, letra \${prefs.tamaño}\`;`,
  explicacion:
    '<p>Fíjate en el caso del <code>0</code> y el <code>false</code>: si hubieras escrito <code>JSON.parse(texto) || defecto</code>, se perderían. Comparar con <code>null</code> distingue "no existe" de "existe y es falsy".</p>',
};

/* ── 13.9 Navegación e historial ─────────────────────────── */
export const navAuto = {
  id: 'nav-auto',
  titulo: 'Cambiar de página sin recargar',
  preguntas: [
    {
      pregunta: '¿Qué hace <code>history.pushState(estado, "", "/productos/7")</code>?',
      opciones: ['Navega a esa página y la recarga', 'Cambia la URL y agrega una entrada al historial, sin recargar ni pedir nada al servidor', 'Borra el historial'],
      correcta: 1,
      explicacion: 'Tu código es el que tiene que actualizar el contenido de la página para que coincida con la nueva URL.',
    },
    {
      pregunta: '¿Cuándo se dispara <code>popstate</code>?',
      opciones: ['Con cada <code>pushState</code>', 'Cuando el usuario se mueve por el historial (atrás, adelante) entre entradas creadas por la página', 'Al cargar la página'],
      correcta: 1,
      explicacion: '<code>pushState</code> no lo dispara: el evento avisa que la URL cambió por una acción del usuario.',
    },
    {
      pregunta: '¿Qué ventaja tiene la Navigation API (<code>navigation.addEventListener("navigate", …)</code>)?',
      opciones: ['Ninguna', 'Un solo evento intercepta todas las navegaciones (enlaces, formularios, atrás/adelante) y con <code>e.intercept()</code> las maneja tu código', 'Es más antigua'],
      correcta: 1,
      explicacion: 'Con la History API hay que interceptar clics en enlaces a mano y combinarlo con <code>popstate</code>.',
    },
    {
      pregunta: 'En una aplicación que cambia la URL con JavaScript, ¿qué pasa si el usuario recarga en <code>/productos/7</code>?',
      opciones: ['Nada', 'El navegador le pide esa URL al servidor, que tiene que saber responderla', 'Vuelve al inicio'],
      correcta: 1,
      explicacion: 'Por eso las SPA configuran el servidor para responder su página principal en todas las rutas, o generan cada página por adelantado.',
    },
  ],
};

export const navOrden = {
  id: 'nav-orden',
  titulo: 'Un enrutador mínimo',
  codigo: `function ruta(url) {
  const { pathname, searchParams, hash } = new URL(url, "https://tienda.com");
  if (pathname === "/") return "inicio";
  const m = pathname.match(/^\\/productos\\/(\\d+)$/);
  if (m) return \`producto \${m[1]}\` + (searchParams.has("color") ? \` (\${searchParams.get("color")})\` : "");
  return hash ? \`ancla \${hash}\` : "404";
}

console.log(ruta("/"));
console.log(ruta("/productos/7?color=rojo"));
console.log(ruta("/ayuda#envios"));
console.log(ruta("/productos/abc"));`,
  salida: ['inicio', 'producto 7 (rojo)', 'ancla #envios', '404'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Un enrutador traduce una URL en qué mostrar. <code>URL</code> separa la ruta, la búsqueda y el ancla, y la expresión regular reconoce <code>/productos/</code> seguido de dígitos. <code>/productos/abc</code> no coincide y no tiene ancla: 404.',
};

export const navDetective = {
  id: 'nav-detective',
  titulo: 'Una URL de otro sitio',
  codigo: `// En https://mi-tienda.com
function irAlBlog() {
  history.pushState({}, "", "https://blog.mi-tienda.com/");
  mostrarBlog();
}

irAlBlog();`,
  error: `Uncaught SecurityError: Failed to execute 'pushState' on 'History': A history state object with URL 'https://blog.mi-tienda.com/' cannot be created in a document with origin 'https://mi-tienda.com' and URL 'https://mi-tienda.com/'.`,
  culpable: 3,
  hallazgo:
    '<code>pushState</code> solo puede cambiar la URL dentro del <b>mismo origen</b> (protocolo, dominio y puerto). Un subdominio es otro origen. Si no fuera así, cualquier página podría hacerse pasar por otra en la barra de direcciones.',
  pista: '¿Tienen el mismo origen <code>mi-tienda.com</code> y <code>blog.mi-tienda.com</code>?',
  arreglos: [
    {
      texto: 'Navegar de verdad a otro origen: <code>location.href = "https://blog.mi-tienda.com/";</code>',
      correcta: true,
      porque: 'Ir a otro sitio es una navegación completa. <code>pushState</code> es para rutas dentro de tu propia aplicación, como <code>"/blog"</code>.',
    },
    {
      texto: 'Usar <code>replaceState</code> en lugar de <code>pushState</code>',
      correcta: false,
      porque: 'Tiene la misma restricción de origen: el mismo error.',
    },
    {
      texto: 'Rodear la llamada con <code>try/catch</code>',
      correcta: false,
      porque: 'Evita el error, pero la URL no cambia y el usuario ve el blog con la dirección de la tienda.',
    },
  ],
};

/* ── 13.10 Web Workers y mensajería ──────────────────────── */
export const workersAuto = {
  id: 'workers-auto',
  titulo: 'Otro hilo para el trabajo pesado',
  preguntas: [
    {
      pregunta: '¿Para qué sirve un Web Worker?',
      opciones: ['Para hacer peticiones', 'Para ejecutar JavaScript en otro hilo, sin congelar la página mientras calcula', 'Para guardar datos'],
      correcta: 1,
      explicacion: 'Procesar imágenes, analizar archivos grandes, cálculos largos: todo lo que bloquearía el hilo principal.',
    },
    {
      pregunta: '¿Puede un worker tocar el DOM?',
      opciones: ['Sí', 'No: no tiene <code>document</code>; se comunica con la página por mensajes', 'Solo para leer'],
      correcta: 1,
      explicacion: 'El worker calcula y envía el resultado; la página lo recibe y actualiza el DOM. Este sitio ejecuta tu código de los laboratorios en un worker, por eso ahí no hay <code>document</code>.',
    },
    {
      pregunta: '¿Qué pasa con un objeto que envías con <code>postMessage</code>?',
      opciones: ['Se comparte', 'Se copia con el algoritmo de clonación estructurada: el worker recibe una copia', 'Se convierte a JSON'],
      correcta: 1,
      explicacion: 'Como <code>structuredClone</code>: copia fechas, Map, Set y arrays tipados, pero no funciones. Un <code>ArrayBuffer</code> se puede <b>transferir</b> sin copiarlo.',
    },
    {
      pregunta: '¿Para qué sirve <code>BroadcastChannel</code>?',
      opciones: ['Para transmitir video', 'Para enviar mensajes entre pestañas, ventanas y workers del mismo origen', 'Para notificaciones'],
      correcta: 1,
      explicacion: 'Por ejemplo, cerrar la sesión en todas las pestañas abiertas a la vez.',
    },
  ],
};

export const workersOrden = {
  id: 'workers-orden',
  titulo: 'Lo que viaja en un mensaje',
  codigo: `const original = { fecha: new Date(0), lista: new Set([1, 2]), saludar() {} };

try {
  structuredClone(original);   // lo mismo que hace postMessage
} catch (e) {
  console.log(e.name);
}

delete original.saludar;
const copia = structuredClone(original);
console.log(copia.fecha instanceof Date, copia.lista.size);

const buffer = new ArrayBuffer(8);
const movido = structuredClone(buffer, { transfer: [buffer] });
console.log(buffer.byteLength, movido.byteLength);`,
  salida: ['DataCloneError', 'true 2', '0 8'],
  inicio: [1, 2, 0],
  explicacion:
    'Un mensaje con una función no se puede clonar. Sin ella, las fechas y los conjuntos llegan intactos. Al <b>transferir</b> un buffer, la memoria pasa al destino y el original queda vacío: no hay copia.',
};

export const workersDetective = {
  id: 'workers-detective',
  titulo: 'Enviar una función a un worker',
  codigo: `const worker = new Worker("calculos.js");

worker.postMessage({
  numeros: [1, 2, 3],
  operacion: (n) => n * 2,
});`,
  error: `Uncaught DataCloneError: Failed to execute 'postMessage' on 'Worker': (n) => n * 2 could not be cloned.
    at app.js:3:8`,
  culpable: 5,
  hallazgo:
    'Los mensajes se copian con la clonación estructurada, y las funciones no se pueden copiar: una función depende del scope donde nació, que no existe en el otro hilo.',
  pista: 'El mensaje dice qué no se pudo clonar. ¿Qué tipo de valor es?',
  arreglos: [
    {
      texto: 'Enviar datos, no código: <code>{ numeros: [1, 2, 3], operacion: "doble" }</code>, y que el worker elija la función según el nombre',
      correcta: true,
      porque: 'El código vive en el worker; el mensaje solo dice qué hacer. Es el mismo principio que una API: se envían datos.',
    },
    {
      texto: 'Convertir la función con <code>JSON.stringify</code>',
      correcta: false,
      porque: '<code>JSON.stringify</code> descarta las funciones: el worker recibiría <code>{ numeros: [1, 2, 3] }</code>, sin operación.',
    },
    {
      texto: 'Enviarla como texto y ejecutarla en el worker con <code>eval</code>',
      correcta: false,
      porque: 'Funcionaría, pero ejecutar texto recibido es un riesgo de seguridad, y la función pierde todo lo que usaba de su scope.',
    },
  ],
};

export const workersLab = {
  id: 'workers-lab',
  titulo: 'Respuestas que llegan desordenadas',
  pagina: `<p>El trabajador responde por mensajes: mira la consola.</p>
<script>
  // Un "worker" simulado: responde por un MessageChannel, con demoras distintas
  const canal = new MessageChannel();
  window.trabajador = canal.port1;
  canal.port2.onmessage = (e) => {
    const { id, numero } = e.data;
    setTimeout(() => canal.port2.postMessage({ id, resultado: numero * numero }), 50 - numero * 5);
  };
</script>`,
  inicial: `// "trabajador" es un puerto de mensajes, como un Worker. Le envías { id, numero }
// y responde { id, resultado } cuando puede: las respuestas pueden llegar en otro orden.
// Escribe calcular(numero): devuelve una promesa con el resultado de ESE número.

const [a, b, c] = await Promise.all([calcular(2), calcular(5), calcular(9)]);
console.log(a, b, c);
`,
  verificaciones: [
    { texto: 'Imprime <code>4 25 81</code>, cada resultado con su número', prueba: 'return __salida.at(-1) === "4 25 81";' },
    { texto: 'Funciona en llamadas sueltas', prueba: 'return (await calcular(3)) === 9 && (await calcular(1)) === 1;' },
    { texto: 'Identifica cada pedido con un <code>id</code> y escucha las respuestas', prueba: String.raw`return /postMessage\s*\(\s*\{[^}]*\bid\b/.test(__codigo) && /onmessage|addEventListener\s*\(\s*["']message/.test(__codigo);` },
  ],
  pistas: [
    'Guarda, para cada pedido, la función que cumple su promesa: <code>const pendientes = new Map();</code> y un contador <code>let siguiente = 0;</code>',
    'En <code>calcular</code>: <code>return new Promise((resolver) => { const id = siguiente++; pendientes.set(id, resolver); trabajador.postMessage({ id, numero }); });</code>',
    'Escucha las respuestas una sola vez: <code>trabajador.onmessage = (e) => { pendientes.get(e.data.id)(e.data.resultado); pendientes.delete(e.data.id); };</code>',
  ] as [string, string, string],
  solucion: `const pendientes = new Map();
let siguiente = 0;

trabajador.onmessage = (e) => {
  const { id, resultado } = e.data;
  pendientes.get(id)?.(resultado);
  pendientes.delete(id);
};

function calcular(numero) {
  return new Promise((resolver) => {
    const id = siguiente++;
    pendientes.set(id, resolver);
    trabajador.postMessage({ id, numero });
  });
}

const [a, b, c] = await Promise.all([calcular(2), calcular(5), calcular(9)]);
console.log(a, b, c);`,
  explicacion:
    '<p>Los mensajes no tienen "respuesta" incorporada: es un canal en las dos direcciones. Para saber qué respuesta corresponde a qué pedido, se numera cada uno y se guarda su <code>resolver</code>. Librerías como Comlink hacen exactamente esto por ti.</p>',
};

/* ── 13.11 Service Workers y PWA ─────────────────────────── */
export const swAuto = {
  id: 'sw-auto',
  titulo: 'Un intermediario entre la página y la red',
  preguntas: [
    {
      pregunta: '¿Qué es un Service Worker?',
      opciones: ['Un servidor', 'Un worker que se pone entre tu página y la red, y puede responder las peticiones él mismo, incluso sin conexión', 'Un plugin'],
      correcta: 1,
      explicacion: 'Intercepta el evento <code>fetch</code> de las páginas que controla.',
    },
    {
      pregunta: 'En la primera visita, ¿controla el Service Worker la página que lo registró?',
      opciones: ['Sí, enseguida', 'No: empieza a controlar las páginas que se carguen después (salvo que llame a <code>clients.claim()</code>)', 'Nunca'],
      correcta: 1,
      explicacion: 'Su ciclo es: registro, <code>install</code>, <code>activate</code> y, recién entonces, controlar las navegaciones siguientes.',
    },
    {
      pregunta: '¿Qué es la estrategia <em>stale-while-revalidate</em>?',
      opciones: ['Responder siempre desde la red', 'Responder enseguida desde la caché y, en paralelo, pedir la versión nueva para la próxima vez', 'No usar caché'],
      correcta: 1,
      explicacion: 'Rápida como la caché y casi siempre actualizada. Otras estrategias: <em>cache first</em> y <em>network first</em>.',
    },
    {
      pregunta: '¿Qué se necesita para que una web se pueda instalar como app (PWA)?',
      opciones: ['Una tienda de apps', 'HTTPS y un manifiesto (<code>manifest.webmanifest</code>) con nombre e íconos; un Service Worker la hace funcionar sin conexión', 'Escribirla en otro lenguaje'],
      correcta: 1,
      explicacion: 'Con eso, el navegador ofrece instalarla y se abre en su propia ventana.',
    },
  ],
};

export const swOrden = {
  id: 'sw-orden',
  titulo: 'El ciclo de vida',
  codigo: `// sw.js
self.addEventListener("install", () => console.log("install"));
self.addEventListener("activate", () => console.log("activate"));
self.addEventListener("fetch", (e) => console.log("fetch", new URL(e.request.url).pathname));

// main.js, en la página /index.html (que carga /app.js)
navigator.serviceWorker.register("/sw.js");

// Primera visita: se registra. Después, el usuario recarga la página.`,
  salida: ['install', 'activate', 'fetch /index.html', 'fetch /app.js'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'En la primera visita, el Service Worker se instala y se activa, pero esa página ya estaba cargada y no la controla. Al recargar, ya controla la navegación: intercepta la petición del HTML y, después, la de cada recurso que el HTML pide.',
};

export const swDetective = {
  id: 'sw-detective',
  titulo: 'Un Service Worker en una carpeta',
  codigo: `// main.js, en https://mi-sitio.com/
navigator.serviceWorker.register("/js/sw.js", { scope: "/" });`,
  error: `Uncaught (in promise) SecurityError: Failed to register a ServiceWorker for scope ('https://mi-sitio.com/') with script ('https://mi-sitio.com/js/sw.js'): The path of the provided scope ('/') is not under the max scope allowed ('/js/'). Adjust the scope, move the Service Worker script, or use the Service-Worker-Allowed HTTP header to allow the scope.`,
  culpable: 2,
  hallazgo:
    'Un Service Worker solo puede controlar su propia carpeta y las de adentro. Un archivo en <code>/js/</code> no puede controlar todo el sitio: si no, cualquier script subido a una carpeta podría interceptar todas las páginas.',
  pista: 'El mensaje dice cuál es el alcance máximo permitido. ¿Dónde está el archivo?',
  arreglos: [
    {
      texto: 'Servir el archivo desde la raíz: <code>register("/sw.js")</code>',
      correcta: true,
      porque: 'Desde la raíz, su alcance máximo es todo el sitio. La otra opción es el encabezado <code>Service-Worker-Allowed: /</code>, que el propio mensaje sugiere.',
    },
    {
      texto: 'Quitar la opción <code>scope</code>',
      correcta: false,
      porque: 'Se registra sin error, pero solo controla las páginas dentro de <code>/js/</code>: ninguna.',
    },
    {
      texto: 'Usar una ruta relativa: <code>register("./js/sw.js")</code>',
      correcta: false,
      porque: 'Es el mismo archivo, en la misma carpeta: el alcance máximo sigue siendo <code>/js/</code>.',
    },
  ],
};

/* ── 13.12 Web Components ────────────────────────────────── */
export const wcAuto = {
  id: 'wc-auto',
  titulo: 'Etiquetas propias',
  preguntas: [
    {
      pregunta: '¿Qué condición debe cumplir el nombre de un elemento personalizado?',
      opciones: ['Empezar con mayúscula', 'Tener al menos un guion: <code>mi-boton</code>', 'Ninguna'],
      correcta: 1,
      explicacion: 'El guion garantiza que nunca choque con una etiqueta que HTML agregue en el futuro.',
    },
    {
      pregunta: '¿Cuándo se llama a <code>connectedCallback</code>?',
      opciones: ['Al definir la clase', 'Cada vez que el elemento se agrega a la página', 'Al hacer clic'],
      correcta: 1,
      explicacion: 'Es el lugar habitual para preparar el contenido y los listeners. <code>disconnectedCallback</code> es su opuesto.',
    },
    {
      pregunta: '¿Qué aporta el <b>Shadow DOM</b>?',
      opciones: ['Sombras', 'Un DOM interno y encapsulado: los estilos de adentro no afectan la página, y los de la página no lo afectan', 'Velocidad'],
      correcta: 1,
      explicacion: 'Se crea con <code>this.attachShadow({ mode: "open" })</code>. Con <code>&lt;slot&gt;</code>, el contenido que pone quien usa el componente aparece dentro.',
    },
    {
      pregunta: '¿Qué hace falta para enterarse de que cambió un atributo?',
      opciones: ['Nada', 'Declararlo en <code>static observedAttributes</code> e implementar <code>attributeChangedCallback</code>', 'Un MutationObserver obligatoriamente'],
      correcta: 1,
      explicacion: 'Solo se avisa de los atributos declarados, para no llamarte con cada cambio.',
    },
  ],
};

export const wcOrden = {
  id: 'wc-orden',
  titulo: 'El ciclo de vida de un elemento',
  codigo: `class MiCaja extends HTMLElement {
  static observedAttributes = ["color"];
  constructor() {
    super();
    console.log("constructor");
  }
  connectedCallback() {
    console.log("conectado");
  }
  attributeChangedCallback(nombre, antes, ahora) {
    console.log(\`\${nombre}: \${antes} → \${ahora}\`);
  }
  disconnectedCallback() {
    console.log("desconectado");
  }
}
customElements.define("mi-caja", MiCaja);

const caja = document.createElement("mi-caja");
caja.setAttribute("color", "rojo");
document.body.append(caja);
caja.remove();`,
  salida: ['constructor', 'color: null → rojo', 'conectado', 'desconectado'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>createElement</code> construye el elemento. El atributo cambia antes de que esté en la página, y su valor anterior era <code>null</code>. Recién al agregarlo con <code>append</code> se llama a <code>connectedCallback</code>, y al quitarlo, a <code>disconnectedCallback</code>.',
};

export const wcDetective = {
  id: 'wc-detective',
  titulo: 'Un nombre sin guion',
  codigo: `class Tarjeta extends HTMLElement {
  connectedCallback() {
    this.textContent = "Soy una tarjeta";
  }
}

customElements.define("tarjeta", Tarjeta);`,
  error: `Uncaught SyntaxError: Failed to execute 'define' on 'CustomElementRegistry': "tarjeta" is not a valid custom element name
    at tarjeta.js:7:16`,
  culpable: 7,
  hallazgo:
    'Los nombres de los elementos personalizados tienen que llevar al menos un guion. Así nunca chocan con las etiquetas propias de HTML, presentes o futuras.',
  pista: 'El mensaje dice que el nombre no es válido. ¿Qué le falta a <code>"tarjeta"</code>?',
  arreglos: [
    {
      texto: 'Usar un nombre con guion: <code>customElements.define("mi-tarjeta", Tarjeta)</code>',
      correcta: true,
      porque: 'Y en el HTML: <code>&lt;mi-tarjeta&gt;&lt;/mi-tarjeta&gt;</code>. Muchos equipos usan un prefijo común para sus componentes.',
    },
    {
      texto: 'Escribirlo con mayúscula: <code>"Tarjeta"</code>',
      correcta: false,
      porque: 'Las mayúsculas tampoco están permitidas, y sigue sin guion.',
    },
    {
      texto: 'Usar <code>"tarjeta_web"</code>',
      correcta: false,
      porque: 'El guion bajo no cuenta: tiene que ser un guion medio.',
    },
  ],
};

export const wcLab = {
  id: 'wc-lab',
  titulo: 'Un contador reutilizable',
  pagina: `<contador-clics></contador-clics>
<contador-clics inicio="5"></contador-clics>`,
  inicial: `// Define el elemento <contador-clics>:
// - con Shadow DOM, muestra un <button> que dice "Clics: N"
// - N empieza en el valor del atributo "inicio" (o en 0 si no lo tiene)
// - cada clic en el botón suma 1
`,
  verificaciones: [
    { texto: 'Los dos contadores muestran <code>Clics: 0</code> y <code>Clics: 5</code>', prueba: 'const [a, b] = document.querySelectorAll("contador-clics"); return a.shadowRoot?.querySelector("button")?.textContent === "Clics: 0" && b.shadowRoot?.querySelector("button")?.textContent === "Clics: 5";' },
    { texto: 'Cada clic suma uno, en su propio contador', prueba: 'const [a, b] = document.querySelectorAll("contador-clics"); const boton = a.shadowRoot.querySelector("button"); boton.click(); boton.click(); return boton.textContent === "Clics: 2" && b.shadowRoot.querySelector("button").textContent === "Clics: 5";' },
    { texto: 'Funciona con contadores creados desde el código', prueba: 'const nuevo = document.createElement("contador-clics"); nuevo.setAttribute("inicio", "10"); document.body.append(nuevo); return nuevo.shadowRoot?.querySelector("button")?.textContent === "Clics: 10";' },
  ],
  pistas: [
    'Empieza con <code>class ContadorClics extends HTMLElement { connectedCallback() { … } }</code> y <code>customElements.define("contador-clics", ContadorClics);</code>',
    'En <code>connectedCallback</code>: <code>let n = Number(this.getAttribute("inicio") ?? 0);</code> y <code>const raiz = this.attachShadow({ mode: "open" });</code>',
    'Crea el botón, ponle el texto, escucha su <code>click</code> para sumar y actualizar, y agrégalo con <code>raiz.append(boton);</code>',
  ] as [string, string, string],
  solucion: `class ContadorClics extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;   // por si se vuelve a conectar
    let n = Number(this.getAttribute("inicio") ?? 0);
    const raiz = this.attachShadow({ mode: "open" });
    const boton = document.createElement("button");
    boton.textContent = \`Clics: \${n}\`;
    boton.addEventListener("click", () => {
      n++;
      boton.textContent = \`Clics: \${n}\`;
    });
    raiz.append(boton);
  }
}

customElements.define("contador-clics", ContadorClics);`,
  explicacion:
    '<p>Los elementos que ya estaban en la página se "actualizan" en cuanto se define la clase, y los que se crean después funcionan igual. Cada uno tiene su propio estado. Y como es una etiqueta de HTML, funciona en cualquier página o framework.</p>',
};

/* ── 13.13 Gráficos: Canvas y SVG ────────────────────────── */
export const graficosAuto = {
  id: 'graficos-auto',
  titulo: 'Píxeles o formas',
  preguntas: [
    {
      pregunta: '¿Qué diferencia de fondo hay entre Canvas y SVG?',
      opciones: [
        'Ninguna',
        'Canvas pinta píxeles en un lienzo y se olvida de lo que pintó; SVG crea elementos que siguen existiendo en el DOM',
        'SVG es más nuevo',
      ],
      correcta: 1,
      explicacion: 'En SVG, cada forma se puede seleccionar, estilizar con CSS y escuchar con eventos. En Canvas, para cambiar algo hay que repintar.',
    },
    {
      pregunta: '¿Cuándo conviene Canvas?',
      opciones: ['Para íconos', 'Para muchísimos elementos o efectos que cambian cada cuadro: juegos, partículas, edición de imágenes', 'Para texto'],
      correcta: 1,
      explicacion: 'Miles de elementos SVG harían pesado el DOM; en Canvas, solo son píxeles.',
    },
    {
      pregunta: '¿Por qué los elementos SVG se crean con <code>createElementNS</code>?',
      opciones: ['Por estilo', 'Porque pertenecen a otro espacio de nombres (el de SVG); con <code>createElement</code> serían elementos HTML desconocidos que no se dibujan', 'Es lo mismo'],
      correcta: 1,
      explicacion: 'El espacio de nombres es <code>"http://www.w3.org/2000/svg"</code>.',
    },
    {
      pregunta: '¿Por qué un canvas puede verse borroso en una pantalla de alta densidad?',
      opciones: ['Por la tarjeta gráfica', 'Porque tiene tantos píxeles como su tamaño en CSS; hay que multiplicar su tamaño interno por <code>devicePixelRatio</code>', 'Por los colores'],
      correcta: 1,
      explicacion: 'SVG, en cambio, es vectorial: se ve nítido a cualquier tamaño.',
    },
  ],
};

export const graficosOrden = {
  id: 'graficos-orden',
  titulo: 'Píxeles y espacios de nombres',
  codigo: `const canvas = document.createElement("canvas");
canvas.width = 10;
canvas.height = 10;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(255, 0, 0)";
ctx.fillRect(0, 0, 5, 10);

console.log([...ctx.getImageData(2, 2, 1, 1).data].join(","));
console.log([...ctx.getImageData(7, 2, 1, 1).data].join(","));
console.log(canvas.toDataURL().startsWith("data:image/png"));

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
console.log(svg.namespaceURI === document.createElement("svg").namespaceURI);`,
  salida: ['255,0,0,255', '0,0,0,0', 'true', 'false'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Un píxel del canvas son cuatro números: rojo, verde, azul y opacidad. El de la izquierda quedó rojo y opaco; el de la derecha, transparente. Un canvas se puede exportar como imagen. Y un <code>svg</code> creado con <code>createElement</code> es otro tipo de elemento: uno HTML desconocido.',
};

export const graficosDetective = {
  id: 'graficos-detective',
  titulo: 'Un contexto que no llega',
  codigo: `const canvas = document.querySelector("#lienzo");
const ctx = canvas.getContext("2D");

ctx.fillStyle = "#f7df1e";
ctx.fillRect(10, 10, 100, 50);`,
  error: `Uncaught TypeError: Cannot set properties of null (setting 'fillStyle')
    at dibujo.js:4:15`,
  culpable: 2,
  hallazgo:
    '<code>getContext</code> distingue mayúsculas: los tipos válidos son <code>"2d"</code>, <code>"webgl"</code>, <code>"webgl2"</code>, <code>"webgpu"</code> y <code>"bitmaprenderer"</code>. Con un nombre que no conoce, devuelve <code>null</code> en lugar de lanzar un error.',
  pista: '¿Qué devolvió <code>getContext</code>? Fíjate en cómo está escrito su argumento.',
  arreglos: [
    {
      texto: 'Escribirlo en minúsculas: <code>canvas.getContext("2d")</code>',
      correcta: true,
      porque: 'Con el nombre correcto, devuelve el contexto de dibujo 2D y el rectángulo amarillo aparece.',
    },
    {
      texto: 'Usar <code>ctx?.fillRect(…)</code>',
      correcta: false,
      porque: 'Asignar a <code>ctx?.fillStyle</code> es un error de sintaxis, y aunque no lo fuera, no se dibujaría nada.',
    },
    {
      texto: 'Comprobar que el canvas exista',
      correcta: false,
      porque: 'El canvas existe: lo que es <code>null</code> es el contexto, por el nombre mal escrito.',
    },
  ],
};

export const graficosLab = {
  id: 'graficos-lab',
  titulo: 'Un gráfico de barras en SVG',
  pagina: `<div id="grafico"></div>`,
  inicial: `const datos = [3, 7, 5];
const SVG = "http://www.w3.org/2000/svg";

// Crea un <svg> de 150 × 100 dentro de #grafico, con un <rect> por dato:
// - ancho 30, alto = dato × 10
// - x = índice × 40; y = 100 − alto (las barras se apoyan abajo)
// - fill "#f7df1e"
// Recuerda: los elementos SVG se crean con document.createElementNS(SVG, …)
`,
  verificaciones: [
    { texto: 'Hay un <code>&lt;svg&gt;</code> con tres <code>&lt;rect&gt;</code> de SVG', prueba: 'const rects = document.querySelectorAll("#grafico svg rect"); return rects.length === 3 && [...rects].every((r) => r instanceof SVGRectElement);' },
    { texto: 'Las alturas y posiciones corresponden a los datos', prueba: 'const r = [...document.querySelectorAll("#grafico rect")].map((x) => [x.getAttribute("x"), x.getAttribute("y"), x.getAttribute("height")].join("/")); return r.join(" ") === "0/70/30 40/30/70 80/50/50";' },
    { texto: 'Las barras se ven: tienen ancho y color', prueba: 'const r = document.querySelector("#grafico rect"); return r.getAttribute("width") === "30" && r.getAttribute("fill") === "#f7df1e" && r.getBBox().height === 30;' },
  ],
  pistas: [
    'El lienzo: <code>const svg = document.createElementNS(SVG, "svg"); svg.setAttribute("width", 150); svg.setAttribute("height", 100);</code>',
    'Recorre los datos con su índice: <code>datos.forEach((dato, i) => { const rect = document.createElementNS(SVG, "rect"); … });</code>',
    'Atributos: <code>x</code> = <code>i * 40</code>, <code>y</code> = <code>100 - dato * 10</code>, <code>width</code>, <code>height</code> y <code>fill</code>. Agrega cada <code>rect</code> al <code>svg</code>, y el <code>svg</code> a <code>#grafico</code>.',
  ] as [string, string, string],
  solucion: `const datos = [3, 7, 5];
const SVG = "http://www.w3.org/2000/svg";

const svg = document.createElementNS(SVG, "svg");
svg.setAttribute("width", 150);
svg.setAttribute("height", 100);

datos.forEach((dato, i) => {
  const alto = dato * 10;
  const rect = document.createElementNS(SVG, "rect");
  rect.setAttribute("x", i * 40);
  rect.setAttribute("y", 100 - alto);
  rect.setAttribute("width", 30);
  rect.setAttribute("height", alto);
  rect.setAttribute("fill", "#f7df1e");
  svg.append(rect);
});

document.querySelector("#grafico").append(svg);`,
  explicacion:
    '<p>En SVG, el eje y crece hacia abajo, por eso <code>y = 100 − alto</code> apoya las barras en la base. Y como cada barra es un elemento, podrías agregarle un <code>&lt;title&gt;</code> con el valor (que el navegador muestra al pasar el ratón y los lectores de pantalla anuncian) o escuchar sus clics.</p>',
};

/* ── 13.14 Seguridad en el navegador ─────────────────────── */
export const seguridadAuto = {
  id: 'seguridad-auto',
  titulo: 'Defender la página',
  preguntas: [
    {
      pregunta: '¿Qué es un ataque XSS (<em>cross-site scripting</em>)?',
      opciones: ['Robar la contraseña del Wi-Fi', 'Que un atacante consiga ejecutar su JavaScript en tu página, normalmente a través de datos que se insertan como HTML', 'Un virus'],
      correcta: 1,
      explicacion: 'Con ese código puede leer lo que ve el usuario, actuar en su nombre o robar datos guardados en el navegador.',
    },
    {
      pregunta: '¿Cuál es la defensa básica contra XSS al mostrar datos?',
      opciones: ['Usar <code>innerHTML</code> con cuidado', 'Insertar los datos como texto (<code>textContent</code>, <code>createElement</code>), nunca como HTML', 'Validar en el navegador'],
      correcta: 1,
      explicacion: 'Y los frameworks modernos escapan por defecto; el peligro vuelve cuando usas su "escape" para insertar HTML crudo.',
    },
    {
      pregunta: '¿Qué hace una <em>Content Security Policy</em> (CSP)?',
      opciones: ['Cifra la página', 'Le dice al navegador de dónde puede cargar y ejecutar scripts, estilos e imágenes; lo demás se bloquea', 'Oculta el código'],
      correcta: 1,
      explicacion: 'Si un XSS logra inyectar un <code>&lt;script&gt;</code>, la CSP impide que se ejecute. Es una segunda línea de defensa.',
    },
    {
      pregunta: '¿Para qué sirve el atributo <code>SameSite</code> de una cookie?',
      opciones: ['Para compartirla entre sitios', 'Para que no se envíe en peticiones iniciadas desde otros sitios: protege contra CSRF', 'Para que dure más'],
      correcta: 1,
      explicacion: 'CSRF es hacer que el navegador del usuario envíe, desde otro sitio, una petición a tu servidor con su sesión.',
    },
  ],
};

export const seguridadOrden = {
  id: 'seguridad-orden',
  titulo: 'Texto, HTML y URLs',
  codigo: `const p = document.createElement("p");
p.textContent = "<b>hola</b> & chau";
console.log(p.innerHTML);
console.log(p.children.length);

p.innerHTML = "<b>hola</b> & chau";
console.log(p.children.length, p.textContent);

const a = document.createElement("a");
a.href = "javascript:alert(1)";
console.log(a.protocol);`,
  salida: ['&lt;b&gt;hola&lt;/b&gt; &amp; chau', '0', '1 hola & chau', 'javascript:'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Con <code>textContent</code>, los caracteres especiales quedan como texto: al leer el HTML se ven escapados, y no se creó ningún elemento. Con <code>innerHTML</code>, la etiqueta se interpreta. Y una URL <code>javascript:</code> es válida para el navegador: si un enlace usa una URL que viene del usuario, hay que comprobar su protocolo.',
};

export const seguridadDetective = {
  id: 'seguridad-detective',
  titulo: 'Un botón bloqueado por la CSP',
  codigo: `<!-- El servidor envía: Content-Security-Policy: script-src 'self' -->

<button onclick="comprar()">Comprar</button>

<script src="/tienda.js"></script>`,
  error: `Refused to execute inline event handler because it violates the following Content Security Policy directive: "script-src 'self'". Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution.`,
  culpable: 3,
  hallazgo:
    'La política solo permite scripts que vengan de archivos del propio sitio (<code>\'self\'</code>). Un <code>onclick</code> escrito en el HTML es código en línea, como el que inyectaría un ataque XSS, así que se bloquea.',
  pista: 'La política dice de dónde puede venir el código. ¿De dónde viene el del <code>onclick</code>?',
  arreglos: [
    {
      texto: 'Quitar el <code>onclick</code> y, en <code>tienda.js</code>, escuchar el clic con <code>addEventListener</code>',
      correcta: true,
      porque: 'Todo el código queda en archivos del sitio, que la política permite. Es además más ordenado: el HTML describe y el JavaScript actúa.',
    },
    {
      texto: 'Agregar <code>\'unsafe-inline\'</code> a la política',
      correcta: false,
      porque: 'Funciona, pero desactiva justo la protección contra XSS que la política estaba dando.',
    },
    {
      texto: 'Cambiarlo por <code>&lt;a href="javascript:comprar()"&gt;</code>',
      correcta: false,
      porque: 'Una URL <code>javascript:</code> también es código en línea: se bloquea igual.',
    },
  ],
};

export const seguridadLab = {
  id: 'seguridad-lab',
  titulo: 'Comentarios a prueba de XSS',
  pagina: `<h2>Comentarios</h2>
<ul id="comentarios"></ul>`,
  inicial: `const comentarios = [
  { autor: "Ana", texto: "¡Muy útil!" },
  { autor: "Luis", texto: '<img src="data:," onerror="document.body.dataset.hackeado = 1">' },
  { autor: "<b>Eva</b>", texto: "Gracias" },
];
const lista = document.querySelector("#comentarios");

// Esta versión es vulnerable: el comentario de Luis ejecuta código.
// Reescríbela para que cada comentario sea un <li> con el autor en un <strong>,
// seguido de ": " y el texto, todo insertado como TEXTO.
for (const c of comentarios) {
  lista.innerHTML += \`<li><strong>\${c.autor}</strong>: \${c.texto}</li>\`;
}
`,
  verificaciones: [
    { texto: 'Ningún comentario crea elementos: no hay <code>&lt;img&gt;</code> ni <code>&lt;b&gt;</code> en la lista', prueba: 'return document.querySelectorAll("#comentarios li").length === 3 && !lista.querySelector("img, b");' },
    { texto: 'Se ve el texto tal cual, con el autor en <code>&lt;strong&gt;</code>', prueba: 'const li = lista.querySelectorAll("li"); return li[1].textContent === \'Luis: <img src="data:," onerror="document.body.dataset.hackeado = 1">\'&& li[2].querySelector("strong")?.textContent === "<b>Eva</b>";' },
    { texto: 'Sin <code>innerHTML</code>', prueba: String.raw`return !/innerHTML|insertAdjacentHTML|outerHTML/.test(__codigo);` },
  ],
  pistas: [
    'Por cada comentario, crea los elementos: <code>const li = document.createElement("li"); const autor = document.createElement("strong");</code>',
    'Rellénalos como texto: <code>autor.textContent = c.autor;</code>',
    '<code>append</code> acepta elementos y textos: <code>li.append(autor, ": ", c.texto); lista.append(li);</code>',
  ] as [string, string, string],
  solucion: `const comentarios = [
  { autor: "Ana", texto: "¡Muy útil!" },
  { autor: "Luis", texto: '<img src="data:," onerror="document.body.dataset.hackeado = 1">' },
  { autor: "<b>Eva</b>", texto: "Gracias" },
];
const lista = document.querySelector("#comentarios");

for (const c of comentarios) {
  const li = document.createElement("li");
  const autor = document.createElement("strong");
  autor.textContent = c.autor;
  li.append(autor, ": ", c.texto);
  lista.append(li);
}`,
  explicacion:
    '<p>Los textos que pasan por <code>textContent</code> o por <code>append</code> nunca se interpretan como HTML, sin importar lo que contengan. Así, el ataque de Luis se muestra como un comentario raro, inofensivo. Además, <code>+=</code> sobre <code>innerHTML</code> reconstruye toda la lista en cada vuelta: también es lento.</p>',
};

/* ── 13.4 Eventos propios ────────────────────────────────── */
export const propiosAuto = {
  id: 'eventos-propios-auto',
  titulo: 'Avisar que algo pasó',
  preguntas: [
    {
      pregunta: '¿Cuándo corren los listeners de un evento que disparas con <code>dispatchEvent</code>?',
      opciones: ['En la próxima tarea del event loop', 'En ese mismo momento: <code>dispatchEvent</code> no termina hasta que corrieron todos', 'Cuando el navegador tenga tiempo libre'],
      correcta: 1,
      explicacion: '<code>dispatchEvent</code> es síncrono. Los eventos del navegador, como un clic, sí llegan como tareas.',
    },
    {
      pregunta: '¿Dónde van los datos que quieres mandar con un evento propio?',
      opciones: ['En <code>e.target</code>', 'En la opción <code>detail</code> de un <code>CustomEvent</code>, que se lee como <code>e.detail</code>', 'En <code>e.data</code> de cualquier <code>Event</code>'],
      correcta: 1,
      explicacion: 'Solo <code>CustomEvent</code> guarda <code>detail</code>; un <code>Event</code> común ignora esa opción.',
    },
    {
      pregunta: 'Disparas <code>new CustomEvent("guardado")</code> sobre un botón y lo escuchas en la lista que lo contiene. ¿Qué pasa?',
      opciones: ['La lista lo recibe', 'La lista no se entera: los eventos propios no burbujean salvo con <code>bubbles: true</code>', 'Da un error'],
      correcta: 1,
      explicacion: 'Con <code>{ bubbles: true }</code> el evento sube por los ancestros, como un clic.',
    },
    {
      pregunta: '¿Qué devuelve <code>dispatchEvent(evento)</code>?',
      opciones: ['El evento', '<code>false</code> si el evento era <code>cancelable</code> y algún listener llamó a <code>preventDefault()</code>; si no, <code>true</code>', 'Una promesa'],
      correcta: 1,
      explicacion: 'Así quien dispara el evento puede preguntar "¿alguien se opone?" antes de seguir.',
    },
  ],
};

export const propiosOrden = {
  id: 'eventos-propios-orden',
  titulo: 'Una venta cancelada',
  codigo: `const tienda = new EventTarget();
tienda.addEventListener("venta", (e) => console.log("A", e.detail));

console.log("inicio");
tienda.dispatchEvent(new CustomEvent("venta", { detail: "té" }));

tienda.addEventListener("venta", (e) => {
  console.log("B", e.detail);
  e.preventDefault();
});
const seguir = tienda.dispatchEvent(new CustomEvent("venta", { detail: "pan", cancelable: true }));
console.log("seguir:", seguir);`,
  salida: ['inicio', 'A té', 'A pan', 'B pan', 'seguir: false'],
  inicio: [3, 0, 4, 1, 2],
  explicacion:
    '<code>dispatchEvent</code> es síncrono: cada listener imprime antes de la línea siguiente. El listener B se agregó después de la primera venta, así que solo la segunda lo despierta. Como esa venta es <code>cancelable</code> y B llama a <code>preventDefault()</code>, <code>dispatchEvent</code> devuelve <code>false</code>.',
};

export const propiosDetective = {
  id: 'eventos-propios-detective',
  titulo: 'El carrito sin datos',
  codigo: `<button id="agregar">Agregar al carrito</button>
<span id="contador">0</span>

<script>
  const boton = document.querySelector("#agregar");
  const contador = document.querySelector("#contador");

  document.addEventListener("carrito:agregado", (e) => {
    contador.textContent = e.detail.total;
  });

  let total = 0;
  boton.addEventListener("click", () => {
    total++;
    boton.dispatchEvent(new Event("carrito:agregado", { bubbles: true, detail: { total } }));
  });
</script>`,
  error: `Uncaught TypeError: Cannot read properties of undefined (reading 'total')
    at HTMLDocument.<anonymous> (index.html:9:38)`,
  culpable: 15,
  hallazgo:
    'El error aparece en la línea 9, pero la causa está en la 15: un <code>Event</code> común no guarda la opción <code>detail</code>, así que <code>e.detail</code> es <code>undefined</code>. Para mandar datos hace falta un <code>CustomEvent</code>.',
  pista: 'El listener lee <code>e.detail</code>. ¿Qué tipo de evento se está creando, y ese tipo guarda <code>detail</code>?',
  arreglos: [
    {
      texto: 'Crear el evento con <code>new CustomEvent("carrito:agregado", { bubbles: true, detail: { total } })</code>',
      correcta: true,
      porque: '<code>CustomEvent</code> es el que lleva <code>detail</code>. El resto queda igual: el evento sube hasta <code>document</code> gracias a <code>bubbles</code>.',
    },
    {
      texto: 'Quitar <code>bubbles: true</code>',
      correcta: false,
      porque: 'Sin <code>bubbles</code> el evento no llega a <code>document</code>: el error desaparece, pero solo porque el listener nunca corre. El contador sigue en 0.',
    },
    {
      texto: 'Leer <code>e.target.detail.total</code>',
      correcta: false,
      porque: '<code>e.target</code> es el botón, que no tiene <code>detail</code>: el error sería el mismo.',
    },
  ],
};

export const propiosLab = {
  id: 'eventos-propios-lab',
  titulo: 'Una lista que avisa',
  pagina: `<p>Tareas pendientes: <b id="pendientes">0</b></p>
<p id="aviso"></p>`,
  inicial: `class Tareas extends EventTarget {
  #lista = [];

  agregar(texto) {
    this.#lista.push(texto);
    // 1. Dispara un CustomEvent "cambio" con detail { total } (cuántas tareas hay)
    // 2. Si acaba de llegar a 3 tareas, dispara también un evento "llena"
  }
}

// La página ya escucha: no hace falta tocar esto
const tareas = new Tareas();
const pendientes = document.querySelector("#pendientes");
const aviso = document.querySelector("#aviso");
tareas.addEventListener("cambio", (e) => (pendientes.textContent = e.detail.total));
tareas.addEventListener("llena", () => (aviso.textContent = "Ya tienes 3 tareas: termina alguna antes de sumar más"));

tareas.agregar("Comprar pan");
`,
  verificaciones: [
    { texto: 'Con una tarea, la página muestra <code>1</code>', prueba: 'return pendientes.textContent === "1";' },
    { texto: 'El aviso aparece justo al llegar a 3 tareas', prueba: 'tareas.agregar("Llamar a Ana"); const antes = aviso.textContent; tareas.agregar("Estudiar"); return antes === "" && pendientes.textContent === "3" && aviso.textContent.startsWith("Ya tienes 3");' },
    { texto: 'Usa <code>CustomEvent</code> y <code>dispatchEvent</code>', prueba: String.raw`return /new\s+CustomEvent\s*\(/.test(__codigo) && /dispatchEvent\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'Dentro de la clase, el objeto mismo es el <code>EventTarget</code>: <code>this.dispatchEvent(…)</code>.',
    'El aviso de cambio: <code>this.dispatchEvent(new CustomEvent("cambio", { detail: { total: this.#lista.length } }));</code>',
    'Y después: <code>if (this.#lista.length === 3) this.dispatchEvent(new Event("llena"));</code>',
  ] as [string, string, string],
  solucion: `class Tareas extends EventTarget {
  #lista = [];

  agregar(texto) {
    this.#lista.push(texto);
    this.dispatchEvent(new CustomEvent("cambio", { detail: { total: this.#lista.length } }));
    if (this.#lista.length === 3) this.dispatchEvent(new Event("llena"));
  }
}

const tareas = new Tareas();
const pendientes = document.querySelector("#pendientes");
const aviso = document.querySelector("#aviso");
tareas.addEventListener("cambio", (e) => (pendientes.textContent = e.detail.total));
tareas.addEventListener("llena", () => (aviso.textContent = "Ya tienes 3 tareas: termina alguna antes de sumar más"));

tareas.agregar("Comprar pan");`,
  explicacion:
    '<p>La clase no sabe nada de la página: solo anuncia lo que le pasa. Quien escucha decide qué hacer con el aviso. El evento <code>llena</code> no necesita datos, así que basta un <code>Event</code> común; <code>cambio</code> sí los lleva, en <code>detail</code>.</p>',
};

/* ── 13.6 Archivos ───────────────────────────────────────── */
export const archivosWebAuto = {
  id: 'archivos-web-auto',
  titulo: 'Archivos que entran y salen',
  preguntas: [
    {
      pregunta: '¿Qué guarda <code>input.files</code> después de que la persona elige archivos?',
      opciones: ['Las rutas de los archivos en el disco', 'Una lista de objetos <code>File</code>, con nombre, tipo y tamaño, pero sin la ruta', 'El contenido ya leído'],
      correcta: 1,
      explicacion: 'La ruta nunca se expone. El contenido se lee después, con <code>text()</code>, <code>arrayBuffer()</code> o <code>stream()</code>.',
    },
    {
      pregunta: '¿Para qué sirve <code>URL.createObjectURL(archivo)</code>?',
      opciones: ['Para subir el archivo a un servidor', 'Para crear una dirección temporal (<code>blob:…</code>) que apunta al archivo en memoria, y usarla en un <code>&lt;img&gt;</code> o un enlace', 'Para convertirlo en texto'],
      correcta: 1,
      explicacion: 'Es la forma más rápida de mostrar una imagen antes de subirla. Cuando ya no la necesites, libérala con <code>URL.revokeObjectURL</code>.',
    },
    {
      pregunta: '¿Cómo se descarga un archivo creado en el navegador?',
      opciones: ['Con <code>fetch</code>', 'Se arma un <code>Blob</code>, se le crea una dirección y se hace clic en un <code>&lt;a&gt;</code> con el atributo <code>download</code>', 'No se puede'],
      correcta: 1,
      explicacion: 'El valor de <code>download</code> es el nombre con que se guarda el archivo.',
    },
    {
      pregunta: 'Quieres mostrar una barra con cuánto se lleva subido. ¿Qué usas?',
      opciones: ['<code>fetch</code> con la opción <code>progress</code>', '<code>XMLHttpRequest</code> y el evento <code>progress</code> de <code>xhr.upload</code>', '<code>FileReader</code>'],
      correcta: 1,
      explicacion: '<code>fetch</code> todavía no informa el progreso de subida. <code>FileReader</code> lee archivos, no los envía.',
    },
  ],
};

export const archivosWebOrden = {
  id: 'archivos-web-orden',
  titulo: 'Bytes y letras',
  codigo: `const archivo = new File(["¡Hola!"], "saludo.txt", { type: "text/plain" });

console.log(archivo.name);
console.log(archivo.size);
console.log(archivo instanceof Blob);

const texto = await archivo.text();
console.log(texto.length);`,
  salida: ['saludo.txt', '7', 'true', '6'],
  inicio: [2, 0, 3, 1],
  explicacion:
    '<code>size</code> cuenta <b>bytes</b>, no letras: el texto se guarda en UTF-8, donde <code>¡</code> ocupa 2 bytes. Por eso el archivo pesa 7 bytes y el texto leído tiene 6 caracteres. Todo <code>File</code> es también un <code>Blob</code>, con un nombre y una fecha.',
};

export const archivosWebDetective = {
  id: 'archivos-web-detective',
  titulo: 'La vista previa que no llega',
  codigo: `<input type="file" id="foto" accept="image/*">
<img id="vista" alt="Vista previa de la foto">

<script>
  const campo = document.querySelector("#foto");
  const vista = document.querySelector("#vista");

  campo.addEventListener("change", () => {
    const archivo = campo.files;
    vista.src = URL.createObjectURL(archivo);
  });
</script>`,
  error: `Uncaught TypeError: Failed to execute 'createObjectURL' on 'URL': Overload resolution failed.
    at HTMLInputElement.<anonymous> (index.html:10:21)`,
  culpable: 9,
  hallazgo:
    '<code>campo.files</code> es una <b>lista</b> (<code>FileList</code>), aunque se haya elegido un solo archivo. <code>createObjectURL</code> espera un <code>File</code> o un <code>Blob</code>, y no sabe qué hacer con una lista: por eso "Overload resolution failed".',
  pista: '¿Qué hay en <code>campo.files</code>: un archivo o una lista de archivos?',
  arreglos: [
    {
      texto: 'Tomar el primero: <code>const archivo = campo.files[0];</code>',
      correcta: true,
      porque: 'La lista se indexa como un array. Conviene además comprobar que exista (<code>if (!archivo) return;</code>), porque la persona puede cancelar el diálogo.',
    },
    {
      texto: 'Usar <code>campo.value</code>',
      correcta: false,
      porque: '<code>value</code> es un texto como <code>C:\\fakepath\\foto.png</code>: no es el archivo, y la ruta es falsa a propósito.',
    },
    {
      texto: 'Leerlo primero con <code>await campo.files.text()</code>',
      correcta: false,
      porque: 'Una <code>FileList</code> no tiene <code>text()</code>, y para mostrar una imagen no hace falta leerla: alcanza con la dirección temporal.',
    },
  ],
};

export const archivosWebLab = {
  id: 'archivos-web-lab',
  titulo: 'Antes de subir',
  pagina: `<input type="file" id="archivos" multiple>
<ul id="lista"></ul>
<p id="resumen"></p>`,
  inicial: `const campo = document.querySelector("#archivos");
const lista = document.querySelector("#lista");
const resumen = document.querySelector("#resumen");
const LIMITE = 1024 * 1024; // 1 MB

// Cuando cambie la selección:
// - vacía la lista y agrega un <li> por archivo:
//     "nombre (N KB)", con N redondeado hacia arriba (Math.ceil)
//     si pesa más que LIMITE: "nombre: pesa demasiado", con la clase "error"
// - en #resumen escribe "Listos para subir: X" (los que pesan demasiado no cuentan)

// Prueba: simula que se eligieron dos archivos
const prueba = new DataTransfer();
prueba.items.add(new File(["a".repeat(3000)], "notas.txt"));
prueba.items.add(new File([new Uint8Array(2 * LIMITE)], "video.mp4"));
campo.files = prueba.files;
campo.dispatchEvent(new Event("change"));
`,
  verificaciones: [
    { texto: 'Muestra <code>notas.txt (3 KB)</code>', prueba: 'return lista.children[0]?.textContent === "notas.txt (3 KB)";' },
    { texto: 'Marca <code>video.mp4: pesa demasiado</code> con la clase <code>error</code>', prueba: 'const li = lista.children[1]; return li?.textContent === "video.mp4: pesa demasiado" && li.classList.contains("error");' },
    { texto: 'Cuenta los que se pueden subir y empieza de cero en cada selección', prueba: 'const antes = resumen.textContent; const otra = new DataTransfer(); otra.items.add(new File(["x"], "a.txt")); campo.files = otra.files; campo.dispatchEvent(new Event("change")); return antes === "Listos para subir: 1" && lista.children.length === 1 && lista.children[0].textContent === "a.txt (1 KB)" && resumen.textContent === "Listos para subir: 1";' },
  ],
  pistas: [
    'Escucha <code>change</code> en el campo y empieza con <code>lista.replaceChildren();</code> para vaciarla.',
    'Recorre <code>for (const archivo of campo.files)</code>; el tamaño en KB es <code>Math.ceil(archivo.size / 1024)</code>.',
    'Lleva un contador de los que pasan el límite y al final: <code>resumen.textContent = `Listos para subir: ${listos}`;</code>',
  ] as [string, string, string],
  solucion: `const campo = document.querySelector("#archivos");
const lista = document.querySelector("#lista");
const resumen = document.querySelector("#resumen");
const LIMITE = 1024 * 1024; // 1 MB

campo.addEventListener("change", () => {
  lista.replaceChildren();
  let listos = 0;
  for (const archivo of campo.files) {
    const li = document.createElement("li");
    if (archivo.size > LIMITE) {
      li.textContent = \`\${archivo.name}: pesa demasiado\`;
      li.classList.add("error");
    } else {
      li.textContent = \`\${archivo.name} (\${Math.ceil(archivo.size / 1024)} KB)\`;
      listos++;
    }
    lista.append(li);
  }
  resumen.textContent = \`Listos para subir: \${listos}\`;
});

const prueba = new DataTransfer();
prueba.items.add(new File(["a".repeat(3000)], "notas.txt"));
prueba.items.add(new File([new Uint8Array(2 * LIMITE)], "video.mp4"));
campo.files = prueba.files;
campo.dispatchEvent(new Event("change"));`,
  explicacion:
    '<p>El navegador ya te dice cuánto pesa cada archivo sin leerlo, así que puedes avisar antes de gastar tiempo y datos en subirlo. Es solo una ayuda para la persona: el servidor tiene que volver a comprobar el tamaño, porque cualquiera puede saltarse tu código.</p>',
};

/* ── 13.7 Arrastrar y soltar ─────────────────────────────── */
export const arrastrarAuto = {
  id: 'arrastrar-auto',
  titulo: 'De una punta a la otra',
  preguntas: [
    {
      pregunta: 'Arrastras una tarjeta sobre una columna y el cursor muestra el ícono de prohibido. ¿Qué falta?',
      opciones: ['El atributo <code>draggable</code> en la columna', 'Llamar a <code>e.preventDefault()</code> en el evento <code>dragover</code> de la columna', 'Escuchar <code>dragend</code>'],
      correcta: 1,
      explicacion: 'Por defecto ningún elemento acepta que le suelten algo. Cancelar <code>dragover</code> es la forma de decir "aquí sí se puede".',
    },
    {
      pregunta: '¿Para qué sirve <code>e.dataTransfer.setData("text/plain", id)</code> en <code>dragstart</code>?',
      opciones: ['Para mover el elemento', 'Para guardar qué se está arrastrando y leerlo en <code>drop</code> con <code>getData</code>, usando el mismo tipo', 'Para cambiar el cursor'],
      correcta: 1,
      explicacion: 'El <code>dataTransfer</code> es lo único que viaja entre las dos puntas del arrastre.',
    },
    {
      pregunta: 'La persona suelta archivos desde su escritorio. ¿Dónde están?',
      opciones: ['En <code>e.target.files</code>', 'En <code>e.dataTransfer.files</code>, durante el evento <code>drop</code>', 'En <code>getData("files")</code>'],
      correcta: 1,
      explicacion: 'Es una lista de <code>File</code>, igual que la de un <code>&lt;input type="file"&gt;</code>. Cancela el <code>drop</code> para que el navegador no abra el archivo.',
    },
    {
      pregunta: '¿Por qué un tablero con arrastrar y soltar necesita además botones para mover las tarjetas?',
      opciones: ['No los necesita', 'Porque la API de arrastrar no funciona con el teclado ni con lectores de pantalla, y en pantallas táctiles funciona a medias', 'Porque es más rápido'],
      correcta: 1,
      explicacion: 'Arrastrar es un atajo para el mouse; la acción tiene que poder hacerse también de otra forma.',
    },
  ],
};

export const arrastrarOrden = {
  id: 'arrastrar-orden',
  titulo: 'Lo que viaja en el arrastre',
  codigo: `const tarjeta = document.createElement("p");
tarjeta.id = "tarea-7";

const datos = new DataTransfer();
datos.setData("text/plain", tarjeta.id);
datos.setData("application/x-tarea", JSON.stringify({ id: 7, columna: "hoy" }));

console.log(datos.types.length);
console.log(datos.getData("text/plain"));
console.log(datos.getData("text/html") === "");
console.log(JSON.parse(datos.getData("application/x-tarea")).columna);`,
  salida: ['2', 'tarea-7', 'true', 'hoy'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'Un <code>DataTransfer</code> guarda un texto por cada tipo. Pedir un tipo que no se guardó no da error: devuelve un texto vacío. Para mandar un objeto, conviértelo en JSON.',
};

export const arrastrarDetective = {
  id: 'arrastrar-detective',
  titulo: 'La tarea que no llega',
  codigo: `<p id="tarea-1" draggable="true">Comprar pan</p>
<ul id="hecho"></ul>

<script>
  const tarea = document.querySelector("#tarea-1");
  const hecho = document.querySelector("#hecho");

  tarea.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("id", tarea.id);
  });
  hecho.addEventListener("dragover", (e) => e.preventDefault());
  hecho.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    hecho.appendChild(document.getElementById(id));
  });
</script>`,
  error: `Uncaught TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.
    at HTMLUListElement.<anonymous> (index.html:15:11)`,
  culpable: 14,
  hallazgo:
    'El id se guardó con el tipo <code>"id"</code>, pero se lee con <code>"text/plain"</code>. Como no hay nada guardado con ese tipo, <code>getData</code> devuelve <code>""</code>, <code>getElementById("")</code> devuelve <code>null</code> y <code>appendChild(null)</code> falla.',
  pista: '¿Con qué tipo se guarda el dato en <code>dragstart</code>, y con cuál se lee en <code>drop</code>?',
  arreglos: [
    {
      texto: 'Leer con el mismo tipo con que se guardó: <code>e.dataTransfer.getData("id")</code>',
      correcta: true,
      porque: 'Los dos lados tienen que usar el mismo tipo. También funcionaría guardar con <code>"text/plain"</code> en la línea 9.',
    },
    {
      texto: 'Usar <code>hecho.append(…)</code> en lugar de <code>appendChild</code>',
      correcta: false,
      porque: 'El error desaparece, pero <code>append(null)</code> agrega el <b>texto</b> "null" a la lista. El problema es que no se encontró la tarea.',
    },
    {
      texto: 'Leer el id con <code>e.target.id</code>',
      correcta: false,
      porque: 'En <code>drop</code>, <code>e.target</code> es donde se soltó (la lista), no lo que se arrastró.',
    },
  ],
};

export const arrastrarLab = {
  id: 'arrastrar-lab',
  titulo: 'Un tablero de dos columnas',
  pagina: `<style>
  .tablero { display: flex; gap: 12px; }
  .col { flex: 1; min-height: 120px; padding: 8px; border: 2px dashed rgba(236,234,226,.35); border-radius: 8px; }
  .tarjeta { padding: 6px 10px; background: rgba(247,223,30,.12); border-radius: 6px; cursor: grab; }
</style>
<div class="tablero">
  <section class="col" id="por-hacer">
    <h3>Por hacer</h3>
    <p class="tarjeta" id="t1" draggable="true">Comprar pan</p>
    <p class="tarjeta" id="t2" draggable="true">Llamar a Ana</p>
  </section>
  <section class="col" id="hecho">
    <h3>Hecho</h3>
  </section>
</div>`,
  inicial: `const columnas = document.querySelectorAll(".col");
const tarjetas = document.querySelectorAll(".tarjeta");

// 1. Al empezar a arrastrar una tarjeta, guarda su id en e.dataTransfer (tipo "text/plain")
// 2. En cada columna: permite soltar (dragover) y, al soltar (drop), mueve la tarjeta
//    al final de esa columna. Ojo: se puede soltar encima del título o de otra tarjeta.


// Para probar sin mouse: arrastra una tarjeta y la suelta sobre un elemento
function arrastrar(idTarjeta, selectorDestino) {
  const datos = new DataTransfer();
  document.getElementById(idTarjeta).dispatchEvent(new DragEvent("dragstart", { dataTransfer: datos, bubbles: true }));
  document.querySelector(selectorDestino).dispatchEvent(new DragEvent("drop", { dataTransfer: datos, bubbles: true, cancelable: true }));
}
arrastrar("t1", "#hecho");
`,
  verificaciones: [
    { texto: 'La tarjeta soltada en «Hecho» pasa a esa columna', prueba: 'return document.querySelector("#hecho > #t1") !== null;' },
    { texto: 'Las columnas aceptan que les suelten algo (cancelan <code>dragover</code>)', prueba: 'const ev = new DragEvent("dragover", { dataTransfer: new DataTransfer(), bubbles: true, cancelable: true }); document.querySelector("#hecho").dispatchEvent(ev); return ev.defaultPrevented;' },
    { texto: 'Soltar sobre el título también mueve la tarjeta a la columna', prueba: 'arrastrar("t1", "#por-hacer h3"); return document.querySelector("#por-hacer > #t1") !== null && document.querySelector("#por-hacer").lastElementChild.id === "t1";' },
  ],
  pistas: [
    'En cada tarjeta: <code>t.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", t.id));</code>',
    'En cada columna, <code>dragover</code> solo necesita <code>e.preventDefault()</code>.',
    'En <code>drop</code>, la columna es <code>e.currentTarget</code> (no <code>e.target</code>, que puede ser el título): <code>e.currentTarget.append(document.getElementById(id));</code>',
  ] as [string, string, string],
  solucion: `const columnas = document.querySelectorAll(".col");
const tarjetas = document.querySelectorAll(".tarjeta");

for (const t of tarjetas) {
  t.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", t.id));
}
for (const col of columnas) {
  col.addEventListener("dragover", (e) => e.preventDefault());
  col.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    e.currentTarget.append(document.getElementById(id));
  });
}

function arrastrar(idTarjeta, selectorDestino) {
  const datos = new DataTransfer();
  document.getElementById(idTarjeta).dispatchEvent(new DragEvent("dragstart", { dataTransfer: datos, bubbles: true }));
  document.querySelector(selectorDestino).dispatchEvent(new DragEvent("drop", { dataTransfer: datos, bubbles: true, cancelable: true }));
}
arrastrar("t1", "#hecho");`,
  explicacion:
    '<p>El evento <code>drop</code> burbujea desde donde se soltó: si cae sobre el título, <code>e.target</code> es el <code>&lt;h3&gt;</code>. <code>e.currentTarget</code>, en cambio, es siempre la columna que tiene el listener. En un tablero real, agrega además un botón o un menú en cada tarjeta para moverla sin arrastrar.</p>',
};

/* ── 13.8 Texto editable y selección ─────────────────────── */
export const editableAuto = {
  id: 'editable-auto',
  titulo: 'Señalar un trozo de texto',
  preguntas: [
    {
      pregunta: '¿Qué hace el atributo <code>contenteditable="true"</code>?',
      opciones: ['Permite editar el HTML con las DevTools', 'Convierte el elemento en una caja donde la persona puede escribir, borrar y pegar', 'Lo convierte en un <code>&lt;textarea&gt;</code>'],
      correcta: 1,
      explicacion: 'Cada cambio de la persona dispara <code>input</code>. Lo que se pega es HTML: sanéalo antes de guardarlo o mostrarlo.',
    },
    {
      pregunta: 'En un nodo de texto, ¿qué cuentan las posiciones de un <code>Range</code>?',
      opciones: ['Píxeles', 'Caracteres desde el principio del texto', 'Palabras'],
      correcta: 1,
      explicacion: '<code>setStart(texto, 0)</code> y <code>setEnd(texto, 4)</code> abarcan los cuatro primeros caracteres. Si el extremo es un elemento, la posición cuenta hijos.',
    },
    {
      pregunta: '¿Qué devuelve <code>getSelection()</code>?',
      opciones: ['Solo el texto seleccionado', 'Un objeto <code>Selection</code> con lo que marcó la persona: se lee con <code>toString()</code> y sus rangos con <code>getRangeAt(0)</code>', 'El elemento enfocado'],
      correcta: 1,
      explicacion: 'Si no hay nada marcado, la selección está "colapsada" (<code>isCollapsed</code>): es solo la posición del cursor.',
    },
    {
      pregunta: 'En un <code>&lt;textarea&gt;</code>, ¿cómo sabes qué parte del texto está seleccionada?',
      opciones: ['Con <code>getSelection()</code>', 'Con <code>selectionStart</code> y <code>selectionEnd</code>, posiciones dentro de <code>value</code>', 'No se puede'],
      correcta: 1,
      explicacion: '<code>t.value.slice(t.selectionStart, t.selectionEnd)</code> es el texto marcado, y <code>setRangeText</code> lo reemplaza.',
    },
  ],
};

export const editableOrden = {
  id: 'editable-orden',
  titulo: 'Un rango que se mueve',
  codigo: `document.body.innerHTML = \`<p id="p">uno dos tres</p>\`;
const p = document.querySelector("#p");
const texto = p.firstChild;

const r = document.createRange();
r.setStart(texto, 4);
r.setEnd(texto, 7);
console.log(r.toString());

r.collapse(true);
console.log(r.collapsed, r.toString().length);

r.selectNodeContents(p);
console.log(r.toString().length);

r.setStart(texto, 8);
console.log(r.toString());`,
  salida: ['dos', 'true 0', '12', 'tres'],
  inicio: [2, 3, 0, 1],
  explicacion:
    'Del carácter 4 al 7 está "dos". <code>collapse(true)</code> junta el final con el principio: el rango queda vacío, como un cursor. <code>selectNodeContents(p)</code> abarca todo el párrafo, 12 caracteres, y después el principio se mueve al carácter 8, donde empieza "tres".',
};

export const editableDetective = {
  id: 'editable-detective',
  titulo: 'Un resaltador que se traba',
  codigo: `<p id="texto">Hola <b>mundo</b> cruel</p>

<script>
  const p = document.querySelector("#texto");
  const rango = document.createRange();
  rango.setStart(p.firstChild, 0);                   // al principio de "Hola "
  rango.setEnd(p.querySelector("b").firstChild, 3);  // a mitad de "mundo"
  rango.surroundContents(document.createElement("mark"));
</script>`,
  error: `Uncaught InvalidStateError: Failed to execute 'surroundContents' on 'Range': The Range has partially selected a non-Text node.
    at index.html:8:9`,
  culpable: 8,
  hallazgo:
    'El rango empieza fuera del <code>&lt;b&gt;</code> y termina dentro de él: lo abarca <b>a medias</b>. <code>surroundContents</code> solo funciona si cada elemento queda entero dentro del rango o entero fuera, porque no puede envolver medio <code>&lt;b&gt;</code> sin romper el árbol.',
  pista: 'El rango empieza en "Hola " y termina dentro del <code>&lt;b&gt;</code>. ¿Queda el <code>&lt;b&gt;</code> entero dentro del rango?',
  arreglos: [
    {
      texto: 'Sacar el contenido y envolverlo a mano: <code>const mark = document.createElement("mark"); mark.append(rango.extractContents()); rango.insertNode(mark);</code>',
      correcta: true,
      porque: '<code>extractContents</code> sí sabe partir elementos: devuelve "Hola <b>mun</b>" y deja "<b>do</b>" en su lugar. Luego <code>insertNode</code> pone el <code>&lt;mark&gt;</code> donde estaba.',
    },
    {
      texto: 'Usar <code>rango.selectNode(p.querySelector("b"))</code> antes de envolver',
      correcta: false,
      porque: 'Deja de fallar, pero resalta solo "mundo": cambia lo que se quería marcar.',
    },
    {
      texto: 'Usar <code>document.execCommand("hiliteColor", false, "yellow")</code>',
      correcta: false,
      porque: '<code>execCommand</code> está obsoleto, trabaja sobre la selección (no sobre un rango cualquiera) y cada navegador genera un HTML distinto.',
    },
  ],
};

export const editableLab = {
  id: 'editable-lab',
  titulo: 'Resaltar una palabra',
  pagina: `<p id="texto">Con JavaScript puedes hacer casi todo en el navegador.</p>`,
  inicial: `const p = document.querySelector("#texto");

// resaltar(palabra): busca la palabra en el texto del párrafo (es un solo nodo de texto)
// y la envuelve en un <mark> usando un Range. Devuelve true si la encontró y false si no
// (sin cambiar nada).
function resaltar(palabra) {
}

resaltar("JavaScript");
`,
  verificaciones: [
    { texto: 'Envuelve <code>JavaScript</code> en un <code>&lt;mark&gt;</code>', prueba: 'return p.innerHTML === "Con <mark>JavaScript</mark> puedes hacer casi todo en el navegador.";' },
    { texto: 'Si la palabra no está, devuelve <code>false</code> y no cambia nada', prueba: 'p.textContent = "Hola mundo"; return resaltar("Python") === false && p.innerHTML === "Hola mundo";' },
    { texto: 'Devuelve <code>true</code> y usa un rango (<code>createRange</code>)', prueba: String.raw`p.textContent = "uno dos tres"; return resaltar("dos") === true && p.innerHTML === "uno <mark>dos</mark> tres" && /createRange\s*\(/.test(__codigo);` },
  ],
  pistas: [
    'La posición de la palabra: <code>const i = p.textContent.indexOf(palabra);</code> (vale <code>-1</code> si no está).',
    'El rango va de <code>i</code> a <code>i + palabra.length</code> dentro de <code>p.firstChild</code>: <code>rango.setStart(p.firstChild, i); rango.setEnd(p.firstChild, i + palabra.length);</code>',
    'Para terminar: <code>rango.surroundContents(document.createElement("mark")); return true;</code>',
  ] as [string, string, string],
  solucion: `const p = document.querySelector("#texto");

function resaltar(palabra) {
  const i = p.textContent.indexOf(palabra);
  if (i === -1) return false;
  const rango = document.createRange();
  rango.setStart(p.firstChild, i);
  rango.setEnd(p.firstChild, i + palabra.length);
  rango.surroundContents(document.createElement("mark"));
  return true;
}

resaltar("JavaScript");`,
  explicacion:
    '<p>Como el párrafo es un solo nodo de texto, la posición que da <code>indexOf</code> sirve directamente para el rango. Si el texto tuviera etiquetas dentro, habría que recorrer sus nodos de texto (por ejemplo, con <code>document.createTreeWalker</code>) para encontrar en cuál cae la palabra.</p>',
};

/* ── 13.9 Diálogos y popovers ────────────────────────────── */
export const dialogoAuto = {
  id: 'dialogo-auto',
  titulo: 'Ventanas que ya vienen hechas',
  preguntas: [
    {
      pregunta: '¿Qué diferencia hay entre <code>dialogo.show()</code> y <code>dialogo.showModal()</code>?',
      opciones: ['Ninguna', '<code>showModal()</code> lo abre encima de todo, vuelve inerte el resto de la página y lo cierra con Esc; <code>show()</code> lo abre sin bloquear nada', '<code>show()</code> es la versión antigua'],
      correcta: 1,
      explicacion: 'Con <code>showModal()</code> también aparece el fondo <code>::backdrop</code> y el foco entra al diálogo.',
    },
    {
      pregunta: 'Dentro de un diálogo hay un <code>&lt;form method="dialog"&gt;</code>. ¿Qué pasa al pulsar uno de sus botones?',
      opciones: ['Se envía al servidor', 'El diálogo se cierra y el <code>value</code> del botón queda en <code>dialogo.returnValue</code>', 'Se recarga la página'],
      correcta: 1,
      explicacion: 'Así se arma una confirmación sin código para cerrar: solo lees la respuesta en el evento <code>close</code>.',
    },
    {
      pregunta: 'La persona pulsa Esc en un diálogo con cambios sin guardar. ¿Cómo lo impides?',
      opciones: ['No se puede', 'Escuchando <code>cancel</code>, que llega antes de cerrar, y llamando a <code>e.preventDefault()</code>', 'Con <code>close</code>'],
      correcta: 1,
      explicacion: '<code>close</code> llega cuando ya se cerró; <code>cancel</code>, antes, y se puede cancelar.',
    },
    {
      pregunta: '¿Qué necesitas para un menú que se abre con un botón y se cierra al hacer clic afuera?',
      opciones: ['Un <code>&lt;dialog&gt;</code> y bastante JavaScript', 'El atributo <code>popover</code> en el menú y <code>popovertarget</code> en el botón, sin JavaScript', 'Un <code>&lt;select&gt;</code>'],
      correcta: 1,
      explicacion: 'Un popover se cierra solo con un clic afuera o con Esc, y el navegador se ocupa del foco y la accesibilidad.',
    },
  ],
};

export const dialogoOrden = {
  id: 'dialogo-orden',
  titulo: 'Abrir, cerrar y responder',
  codigo: `document.body.innerHTML = \`<dialog id="d"><p>¿Guardar los cambios?</p></dialog>\`;
const d = document.querySelector("#d");
d.addEventListener("close", () => console.log("close:", d.returnValue));

console.log(d.open);
d.showModal();
console.log(d.open);
d.close("guardar");
console.log(d.open, d.returnValue);`,
  salida: ['false', 'true', 'false guardar', 'close: guardar'],
  inicio: [3, 1, 2, 0],
  explicacion:
    '<code>open</code> cambia en el momento, y <code>close("guardar")</code> deja el valor en <code>returnValue</code> enseguida. El evento <code>close</code>, en cambio, llega como una tarea aparte: corre después de todo el código síncrono.',
};

export const dialogoDetective = {
  id: 'dialogo-detective',
  titulo: 'Un aviso ya abierto',
  codigo: `<dialog id="aviso" open>
  <p>Tienes cambios sin guardar.</p>
  <form method="dialog"><button>Entendido</button></form>
</dialog>
<button id="mostrar">Mostrar aviso</button>

<script>
  const aviso = document.querySelector("#aviso");
  document.querySelector("#mostrar").addEventListener("click", () => {
    aviso.showModal();
  });
</script>`,
  error: `Uncaught InvalidStateError: Failed to execute 'showModal' on 'HTMLDialogElement': The dialog is already open as a non-modal dialog, and therefore cannot be opened as a modal dialog.
    at HTMLButtonElement.<anonymous> (index.html:10:11)`,
  culpable: 1,
  hallazgo:
    'El atributo <code>open</code> en el HTML abre el diálogo de entrada, como <b>no modal</b>. Un diálogo abierto así no se puede pasar a modal: <code>showModal()</code> lanza el error. El atributo <code>open</code> no es para abrir diálogos, sino para que el navegador indique si está abierto.',
  pista: '¿En qué estado está el diálogo cuando se carga la página, antes de pulsar el botón?',
  arreglos: [
    {
      texto: 'Quitar el atributo <code>open</code> del <code>&lt;dialog&gt;</code> y abrirlo solo con <code>showModal()</code>',
      correcta: true,
      porque: 'Así el diálogo empieza cerrado y se abre como modal, con el fondo inerte, el foco adentro y Esc para cerrar. Si tiene que verse al cargar, llama a <code>showModal()</code> al iniciar.',
    },
    {
      texto: 'Cambiar <code>showModal()</code> por <code>show()</code>',
      correcta: false,
      porque: 'Ya no da error, pero el aviso deja de ser modal: la página de atrás sigue activa y Esc no lo cierra.',
    },
    {
      texto: 'Poner <code>aviso.open = true</code> antes de <code>showModal()</code>',
      correcta: false,
      porque: 'Es lo mismo que el atributo: lo deja abierto como no modal, y <code>showModal()</code> vuelve a fallar.',
    },
  ],
};

export const dialogoLab = {
  id: 'dialogo-lab',
  titulo: '¿Seguro que quieres borrarlo?',
  pagina: `<ul id="lista">
  <li data-nombre="notas.txt">notas.txt <button class="borrar">Borrar</button></li>
  <li data-nombre="foto.jpg">foto.jpg <button class="borrar">Borrar</button></li>
</ul>
<dialog id="confirmar">
  <form method="dialog">
    <p>¿Borrar <b id="que"></b>?</p>
    <button value="no">Cancelar</button>
    <button value="si">Borrar</button>
  </form>
</dialog>`,
  inicial: `const lista = document.querySelector("#lista");
const dialogo = document.querySelector("#confirmar");
const que = document.querySelector("#que");
let pendiente = null; // el <li> que se quiere borrar

// 1. Al pulsar un botón "Borrar" (con un solo listener en la lista):
//    guarda su <li> en pendiente, escribe su data-nombre en #que y abre el diálogo como modal
// 2. Cuando el diálogo se cierre: si la respuesta (returnValue) es "si", borra el <li> pendiente
`,
  verificaciones: [
    { texto: 'Al pulsar «Borrar», abre el diálogo como modal y dice qué se va a borrar', prueba: 'lista.querySelector(".borrar").click(); return dialogo.open && dialogo.matches(":modal") && que.textContent === "notas.txt";' },
    { texto: 'Con «Cancelar», no borra nada', prueba: 'dialogo.querySelector(\'[value="no"]\').click(); await new Promise((r) => setTimeout(r, 30)); return !dialogo.open && lista.children.length === 2;' },
    { texto: 'Con «Borrar», quita ese elemento de la lista', prueba: 'lista.querySelectorAll(".borrar")[1].click(); dialogo.querySelector(\'[value="si"]\').click(); await new Promise((r) => setTimeout(r, 30)); return lista.children.length === 1 && lista.children[0].dataset.nombre === "notas.txt";' },
  ],
  pistas: [
    'Delegación: <code>lista.addEventListener("click", (e) => { const boton = e.target.closest(".borrar"); if (!boton) return; … });</code>',
    'Dentro: <code>pendiente = boton.closest("li"); que.textContent = pendiente.dataset.nombre; dialogo.showModal();</code>',
    'Y al cerrar: <code>dialogo.addEventListener("close", () => { if (dialogo.returnValue === "si") pendiente.remove(); });</code>',
  ] as [string, string, string],
  solucion: `const lista = document.querySelector("#lista");
const dialogo = document.querySelector("#confirmar");
const que = document.querySelector("#que");
let pendiente = null;

lista.addEventListener("click", (e) => {
  const boton = e.target.closest(".borrar");
  if (!boton) return;
  pendiente = boton.closest("li");
  que.textContent = pendiente.dataset.nombre;
  dialogo.returnValue = "";   // que no quede la respuesta de la vez anterior
  dialogo.showModal();
});

dialogo.addEventListener("close", () => {
  if (dialogo.returnValue === "si") pendiente?.remove();
  pendiente = null;
});`,
  explicacion:
    '<p>El formulario con <code>method="dialog"</code> se ocupa de cerrar el diálogo y de dejar la respuesta en <code>returnValue</code>: tu código solo abre y lee. Un detalle: si la persona cierra con Esc, <code>returnValue</code> <b>no cambia</b> y conserva la respuesta anterior. Por eso la solución lo vacía antes de cada <code>showModal()</code>: así un Esc después de un «Borrar» no borra otro archivo.</p>',
};

/* ── 13.10 Accesibilidad con JavaScript ──────────────────── */
export const a11yAuto = {
  id: 'a11y-auto',
  titulo: 'Una página para todos',
  preguntas: [
    {
      pregunta: 'Necesitas algo que se pulse para guardar. ¿Qué elemento usas?',
      opciones: ['Un <code>&lt;div&gt;</code> con un listener de <code>click</code>', 'Un <code>&lt;button&gt;</code>: ya se enfoca con Tab, responde a Enter y a la barra espaciadora y se anuncia como botón', 'Un <code>&lt;span&gt;</code> con <code>role="button"</code>'],
      correcta: 1,
      explicacion: 'Imitar un botón con otro elemento exige <code>role</code>, <code>tabindex</code> y manejar el teclado a mano, y siempre se escapa algún detalle.',
    },
    {
      pregunta: 'Muestras "Guardado" en la página después de un cambio. ¿Cómo se entera quien usa un lector de pantalla?',
      opciones: ['Se entera solo', 'Poniendo el mensaje en una región viva (<code>role="status"</code>) que ya existía vacía antes del cambio', 'Con un <code>alert()</code>'],
      correcta: 1,
      explicacion: 'La región viva se lee cada vez que cambia su texto, sin mover el foco. Si la creas con el mensaje ya adentro, muchos lectores no la leen.',
    },
    {
      pregunta: '¿Qué hace el atributo <code>inert</code> en un bloque de la página?',
      opciones: ['Lo oculta', 'Lo vuelve inactivo: no recibe clics ni foco y el lector de pantalla lo ignora', 'Lo hace de solo lectura'],
      correcta: 1,
      explicacion: 'Sirve para desactivar el fondo mientras hay un panel encima. <code>showModal()</code> lo hace solo.',
    },
    {
      pregunta: 'Un botón abre y cierra un menú. ¿Qué atributo tienes que mantener al día?',
      opciones: ['<code>aria-label</code>', '<code>aria-expanded</code>, con <code>"true"</code> o <code>"false"</code> según el menú esté abierto', '<code>tabindex</code>'],
      correcta: 1,
      explicacion: 'Es lo que oye quien usa un lector de pantalla: "Opciones, botón, expandido".',
    },
  ],
};

export const a11yOrden = {
  id: 'a11y-orden',
  titulo: '¿Quién tiene el foco?',
  codigo: `document.body.innerHTML = \`
  <button id="a">A</button>
  <div id="b">B</div>
  <div id="c" tabindex="-1">C</div>\`;
const [a, b, c] = ["#a", "#b", "#c"].map((s) => document.querySelector(s));

a.focus();
console.log(document.activeElement.id);
b.focus();
console.log(document.activeElement.id);
c.focus();
console.log(document.activeElement.id);
console.log(a.tabIndex, b.tabIndex, c.tabIndex);`,
  salida: ['a', 'a', 'c', '0 -1 -1'],
  inicio: [2, 3, 0, 1],
  explicacion:
    'Un <code>&lt;div&gt;</code> común no se puede enfocar: <code>b.focus()</code> no hace nada y el foco sigue en A. Con <code>tabindex="-1"</code>, C sí se enfoca desde el código, aunque Tab lo salte. El <code>tabIndex</code> de B también es <code>-1</code>, pero por otra razón: es el valor por defecto de los elementos que no se enfocan.',
};

export const a11yDetective = {
  id: 'a11y-detective',
  titulo: 'El foco perdido',
  codigo: `<button id="abrir">Filtros</button>
<div id="panel" hidden>
  <button id="cerrar">Cerrar</button>
</div>

<script>
  const panel = document.querySelector("#panel");
  const anterior = document.querySelector(":focus");

  document.querySelector("#abrir").addEventListener("click", () => {
    panel.hidden = false;
    document.querySelector("#cerrar").focus();
  });
  document.querySelector("#cerrar").addEventListener("click", () => {
    panel.hidden = true;
    anterior.focus();   // devuelve el foco a donde estaba
  });
</script>`,
  error: `Uncaught TypeError: Cannot read properties of null (reading 'focus')
    at HTMLButtonElement.<anonymous> (index.html:16:14)`,
  culpable: 8,
  hallazgo:
    'El elemento enfocado se guarda <b>al cargar la página</b>, cuando todavía no hay nada enfocado: <code>anterior</code> vale <code>null</code> para siempre. Hay que guardarlo en el momento de abrir el panel, que es cuando se sabe desde dónde se abrió.',
  pista: '¿En qué momento se ejecuta la línea que guarda el elemento enfocado? ¿Qué tiene el foco en ese momento?',
  arreglos: [
    {
      texto: 'Declarar <code>let anterior;</code> y guardarlo al abrir: <code>anterior = document.activeElement;</code> como primera línea del listener de «Filtros»',
      correcta: true,
      porque: 'Así se guarda el botón que abrió el panel, y al cerrar el foco vuelve exactamente ahí, aunque el panel se pueda abrir desde varios lugares.',
    },
    {
      texto: 'Escribir <code>anterior?.focus()</code>',
      correcta: false,
      porque: 'El error desaparece, pero el foco no vuelve a ningún lado: al ocultarse el panel, el foco cae al principio de la página y quien usa el teclado pierde su lugar.',
    },
    {
      texto: 'Enfocar el panel: <code>panel.focus()</code>',
      correcta: false,
      porque: 'El panel está oculto y además es un <code>&lt;div&gt;</code> sin <code>tabindex</code>: no se puede enfocar.',
    },
  ],
};

export const a11yLab = {
  id: 'a11y-lab',
  titulo: 'Un menú para el teclado',
  pagina: `<button id="menu-boton" aria-expanded="false" aria-controls="menu">Opciones</button>
<ul id="menu" hidden>
  <li><button>Editar</button></li>
  <li><button>Duplicar</button></li>
  <li><button>Borrar</button></li>
</ul>`,
  inicial: `const boton = document.querySelector("#menu-boton");
const menu = document.querySelector("#menu");

// 1. Al pulsar el botón: abre o cierra el menú (menu.hidden) y actualiza aria-expanded.
//    Al abrirlo, lleva el foco al primer botón del menú.
// 2. Si se pulsa Escape con el foco dentro del menú: ciérralo y devuelve el foco al botón.
`,
  verificaciones: [
    { texto: 'Al pulsar «Opciones», se abre, dice <code>aria-expanded="true"</code> y el foco va a «Editar»', prueba: 'boton.click(); return !menu.hidden && boton.getAttribute("aria-expanded") === "true" && document.activeElement?.textContent === "Editar";' },
    { texto: 'Escape lo cierra y devuelve el foco a «Opciones»', prueba: 'document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); return menu.hidden && boton.getAttribute("aria-expanded") === "false" && document.activeElement === boton;' },
    { texto: 'Pulsar el botón dos veces lo abre y lo vuelve a cerrar', prueba: 'boton.click(); const abierto = !menu.hidden; boton.click(); return abierto && menu.hidden && boton.getAttribute("aria-expanded") === "false";' },
  ],
  pistas: [
    'Una función para cada cosa ayuda: <code>function abrir() { … }</code> y <code>function cerrar() { … }</code>, y en el clic <code>menu.hidden ? abrir() : cerrar();</code>',
    'Al abrir: <code>menu.hidden = false; boton.setAttribute("aria-expanded", "true"); menu.querySelector("button").focus();</code>',
    'Escape: <code>menu.addEventListener("keydown", (e) => { if (e.key === "Escape") { cerrar(); boton.focus(); } });</code>',
  ] as [string, string, string],
  solucion: `const boton = document.querySelector("#menu-boton");
const menu = document.querySelector("#menu");

function abrir() {
  menu.hidden = false;
  boton.setAttribute("aria-expanded", "true");
  menu.querySelector("button").focus();
}
function cerrar() {
  menu.hidden = true;
  boton.setAttribute("aria-expanded", "false");
}

boton.addEventListener("click", () => (menu.hidden ? abrir() : cerrar()));
menu.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrar();
    boton.focus();
  }
});`,
  explicacion:
    '<p>Con el mouse, la persona ve el menú y hace clic. Con el teclado, necesita que el foco entre al menú al abrirlo y que vuelva al botón al cerrarlo: si no, al ocultarse el menú el foco cae al principio de la página. <code>aria-expanded</code> es lo que le dice al lector de pantalla si el menú está abierto. Para una versión completa, agrega las flechas para moverse entre las opciones.</p>',
};

/* ── 13.12 Tiempo real ───────────────────────────────────── */
export const tiempoRealAuto = {
  id: 'tiempo-real-auto',
  titulo: 'Conexiones que se quedan abiertas',
  preguntas: [
    {
      pregunta: 'Quieres mostrar notificaciones apenas el servidor las genera. Tu página no necesita mandarle nada. ¿Qué usas?',
      opciones: ['WebRTC', 'Server-Sent Events, con <code>EventSource</code>: el servidor escribe los avisos en una respuesta que no cierra', 'Un <code>fetch</code> cada segundo'],
      correcta: 1,
      explicacion: 'SSE va en un solo sentido, del servidor al navegador, y se reconecta solo. Es lo más simple para avisos.',
    },
    {
      pregunta: '¿Qué pasa si se corta la conexión de un <code>EventSource</code>? ¿Y la de un <code>WebSocket</code>?',
      opciones: ['Los dos se reconectan solos', '<code>EventSource</code> se reconecta solo; con un <code>WebSocket</code> tienes que programar la reconexión', 'Ninguno se reconecta'],
      correcta: 1,
      explicacion: 'Para el WebSocket, lo habitual es reintentar esperando cada vez un poco más (1 s, 2 s, 4 s…).',
    },
    {
      pregunta: '¿Cuándo puedes llamar a <code>ws.send()</code>?',
      opciones: ['Apenas creas el WebSocket', 'Cuando la conexión ya está abierta: después del evento <code>open</code> (<code>readyState === 1</code>)', 'Solo dentro de <code>message</code>'],
      correcta: 1,
      explicacion: 'Mientras conecta, <code>readyState</code> vale 0 y <code>send</code> lanza un <code>InvalidStateError</code>.',
    },
    {
      pregunta: 'WebRTC conecta dos navegadores directamente. ¿Para qué hace falta igualmente un servidor?',
      opciones: ['Para pasar el video', 'Para que los dos navegadores se "presenten": intercambian la oferta y la respuesta de la conexión a través de él', 'No hace falta ninguno'],
      correcta: 1,
      explicacion: 'Esa "señalización" suele hacerse con un WebSocket. Además, para atravesar routers se usan servidores STUN y TURN.',
    },
  ],
};

export const tiempoRealOrden = {
  id: 'tiempo-real-orden',
  titulo: 'Mensajes de varios tipos',
  codigo: `const canal = new EventTarget();   // en tu página, sería un WebSocket
canal.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  switch (m.tipo) {
    case "chat": console.log(\`\${m.de}: \${m.texto}\`); break;
    case "escribiendo": console.log(\`\${m.de} está escribiendo…\`); break;
    default: console.log("tipo desconocido:", m.tipo);
  }
});

const llega = (m) => canal.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(m) }));
llega({ tipo: "escribiendo", de: "Ana" });
console.log("--");
llega({ tipo: "chat", de: "Ana", texto: "¡Hola!" });
llega({ tipo: "reaccion", de: "Luis" });`,
  salida: ['Ana está escribiendo…', '--', 'Ana: ¡Hola!', 'tipo desconocido: reaccion'],
  inicio: [2, 3, 0, 1],
  explicacion:
    'Cada mensaje llega como texto en <code>e.data</code>: primero se convierte con <code>JSON.parse</code> y después se decide según su <code>tipo</code>. Un <code>default</code> para los tipos que no conoces evita errores cuando el servidor agrega mensajes nuevos.',
};

export const tiempoRealDetective = {
  id: 'tiempo-real-detective',
  titulo: 'Hablar antes de tiempo',
  codigo: `const ws = new WebSocket("wss://chat.ejemplo.com");

ws.addEventListener("message", (e) => {
  console.log("llegó:", e.data);
});

ws.send(JSON.stringify({ tipo: "hola", nombre: "Ana" }));`,
  error: `Uncaught InvalidStateError: Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.
    at app.js:7:4`,
  culpable: 7,
  hallazgo:
    'Crear el WebSocket solo <b>empieza</b> a conectar: la conexión tarda un poco en abrirse. En la línea siguiente todavía está en estado <code>CONNECTING</code> (<code>readyState</code> 0), y <code>send</code> no acepta mensajes hasta que se abre.',
  pista: '¿Ya está abierta la conexión en la línea inmediatamente siguiente a crearla?',
  arreglos: [
    {
      texto: 'Mandar el saludo cuando se abra: <code>ws.addEventListener("open", () => ws.send(JSON.stringify({ tipo: "hola", nombre: "Ana" })));</code>',
      correcta: true,
      porque: 'El evento <code>open</code> llega cuando la conexión está lista. Todo lo que se manda al conectar va ahí.',
    },
    {
      texto: 'Esperar un segundo con <code>setTimeout(() => ws.send(…), 1000)</code>',
      correcta: false,
      porque: 'Con una red lenta, un segundo puede no alcanzar, y con una rápida es demora de más. Hay que esperar el evento, no un tiempo fijo.',
    },
    {
      texto: 'Usar <code>await new WebSocket(…)</code>',
      correcta: false,
      porque: 'El constructor no devuelve una promesa: <code>await</code> no espera nada y el error sigue igual.',
    },
  ],
};

export const tiempoRealLab = {
  id: 'tiempo-real-lab',
  titulo: 'El cliente de un chat',
  pagina: `<ul id="mensajes"></ul>
<form id="chat"><input name="texto" autocomplete="off" aria-label="Mensaje"> <button disabled>Enviar</button></form>
<script>
  // Imita a un WebSocket conectado a un servidor que contesta: aquí no hay red
  class SocketDePrueba extends EventTarget {
    readyState = 0;
    enviados = [];
    constructor() {
      super();
      setTimeout(() => {
        this.readyState = 1;
        this.dispatchEvent(new Event("open"));
      }, 10);
    }
    send(datos) {
      if (this.readyState !== 1) throw new DOMException("Still in CONNECTING state.", "InvalidStateError");
      this.enviados.push(datos);
      const m = JSON.parse(datos);
      const respuesta = { tipo: "chat", de: "Eco", texto: String(m.texto).toUpperCase() };
      setTimeout(() => this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(respuesta) })), 10);
    }
  }
</script>`,
  inicial: `const ws = new SocketDePrueba();   // en tu página: new WebSocket("wss://…")
const form = document.querySelector("#chat");
const lista = document.querySelector("#mensajes");
const boton = form.querySelector("button");

// 1. Cuando se abra la conexión ("open"), habilita el botón
// 2. Al enviar el formulario: evita la recarga, manda { tipo: "chat", texto } como JSON
//    y vacía el campo
// 3. Con cada mensaje que llega ("message"): agrega un <li> con "de: texto"
`,
  verificaciones: [
    { texto: 'Habilita «Enviar» cuando se abre la conexión', prueba: String.raw`return boton.disabled === false && /["']open["']/.test(__codigo);` },
    { texto: 'Manda el mensaje como JSON y vacía el campo', prueba: 'form.texto.value = "hola"; form.requestSubmit(); const m = JSON.parse(ws.enviados.at(-1) ?? "{}"); return m.tipo === "chat" && m.texto === "hola" && form.texto.value === "";' },
    { texto: 'Muestra la respuesta que llega: <code>Eco: HOLA</code>', prueba: 'await new Promise((r) => setTimeout(r, 50)); return lista.lastElementChild?.textContent === "Eco: HOLA";' },
  ],
  pistas: [
    '<code>ws.addEventListener("open", () => (boton.disabled = false));</code>',
    'En el <code>submit</code>: <code>e.preventDefault(); ws.send(JSON.stringify({ tipo: "chat", texto: form.texto.value })); form.texto.value = "";</code>',
    'En <code>message</code>: <code>const m = JSON.parse(e.data);</code> y después crea el <code>&lt;li&gt;</code> con <code>`${m.de}: ${m.texto}`</code>.',
  ] as [string, string, string],
  solucion: `const ws = new SocketDePrueba();
const form = document.querySelector("#chat");
const lista = document.querySelector("#mensajes");
const boton = form.querySelector("button");

ws.addEventListener("open", () => (boton.disabled = false));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ws.send(JSON.stringify({ tipo: "chat", texto: form.texto.value }));
  form.texto.value = "";
});

ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  const li = document.createElement("li");
  li.textContent = \`\${m.de}: \${m.texto}\`;
  lista.append(li);
});`,
  explicacion:
    '<p>Con un <code>WebSocket</code> de verdad, el código es el mismo: solo cambia la primera línea. El botón empieza deshabilitado para que nadie mande nada antes de que la conexión esté abierta, que es justo el error del ejercicio anterior. El mensaje se muestra con <code>textContent</code>, nunca con <code>innerHTML</code>: viene de otra persona y podría traer HTML malicioso.</p>',
};

/* ── 13.13 APIs del dispositivo ──────────────────────────── */
export const dispositivoAuto = {
  id: 'dispositivo-auto',
  titulo: 'Pedir con cuidado',
  preguntas: [
    {
      pregunta: '¿Cuándo conviene pedir permiso para mandar notificaciones?',
      opciones: ['Apenas carga la página', 'Cuando la persona pulsa algo como «Avisarme», y se entiende para qué', 'Nunca hace falta pedirlo'],
      correcta: 1,
      explicacion: 'Si la persona dice que no, el navegador no vuelve a preguntar. Preguntar al entrar, sin contexto, casi siempre termina en un "no".',
    },
    {
      pregunta: '¿Por qué <code>navigator.clipboard.writeText</code> va con <code>await</code> dentro de un <code>try</code>?',
      opciones: ['Por estilo', 'Porque devuelve una promesa que puede rechazarse: sin <code>await</code>, el <code>catch</code> no se entera del error', 'Porque es síncrona'],
      correcta: 1,
      explicacion: 'Un <code>try/catch</code> solo atrapa los errores de las promesas que espera con <code>await</code>.',
    },
    {
      pregunta: 'Quieres usar el menú de compartir del sistema. ¿Qué haces si <code>navigator.share</code> no existe?',
      opciones: ['Mostrar un error', 'Ofrecer un plan B, como copiar el enlace al portapapeles', 'Recargar la página'],
      correcta: 1,
      explicacion: 'Comprueba antes de usar (<code>"share" in navigator</code> o <code>navigator.canShare?.(datos)</code>) y ten siempre otra salida.',
    },
    {
      pregunta: 'Tu página consulta el servidor cada 10 segundos. ¿Qué API te ayuda a no hacerlo mientras nadie la mira?',
      opciones: ['Geolocalización', 'Page Visibility: el evento <code>visibilitychange</code> y <code>document.hidden</code>', 'Wake Lock'],
      correcta: 1,
      explicacion: 'Cuando la pestaña se esconde, pausa los sondeos; cuando vuelve a la vista, retómalos.',
    },
  ],
};

export const dispositivoOrden = {
  id: 'dispositivo-orden',
  titulo: 'Un plan B para cada navegador',
  codigo: `function planParaCompartir(nav) {
  if (typeof nav.share === "function") return "menú del sistema";
  if (nav.clipboard) return "copiar el enlace";
  return "mostrar el enlace para copiarlo a mano";
}

// Tres navegadores imaginarios, con distintas APIs
console.log(planParaCompartir({ clipboard: {} }));
console.log(planParaCompartir({}));
console.log(planParaCompartir({ share() {}, clipboard: {} }));
console.log("share" in { share: undefined });`,
  salida: ['copiar el enlace', 'mostrar el enlace para copiarlo a mano', 'menú del sistema', 'true'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'La función prueba de la mejor opción a la más simple, y siempre devuelve algo. La última línea es una trampa: <code>in</code> pregunta si la propiedad <b>existe</b>, aunque valga <code>undefined</code>. Por eso, para saber si se puede llamar, es más seguro comprobar que sea una función.',
};

export const dispositivoDetective = {
  id: 'dispositivo-detective',
  titulo: '¡Copiado! (o no)',
  codigo: `<button id="copiar">Copiar enlace</button>

<script>
  const boton = document.querySelector("#copiar");
  boton.addEventListener("click", () => {
    try {
      navigator.clipboard.writeText(location.href);
      boton.textContent = "¡Copiado!";
    } catch {
      boton.textContent = "No se pudo copiar";
    }
  });
</script>`,
  error: `Uncaught (in promise) NotAllowedError: Failed to execute 'writeText' on 'Clipboard': Document is not focused.`,
  culpable: 7,
  hallazgo:
    '<code>writeText</code> devuelve una promesa, y el código no la espera. La línea 8 corre enseguida, antes de saber si se copió, y cuando la promesa se rechaza el <code>try</code> ya terminó: el error queda "sin atrapar" (<i>in promise</i>) y el botón miente.',
  pista: '¿Qué devuelve <code>writeText</code>? ¿Puede el <code>try</code> atrapar el rechazo de una promesa que no espera?',
  arreglos: [
    {
      texto: 'Hacer async el listener y esperar: <code>boton.addEventListener("click", async () => { try { await navigator.clipboard.writeText(location.href); …</code>',
      correcta: true,
      porque: 'Con <code>await</code>, el rechazo se convierte en una excepción en esa línea: la atrapa el <code>catch</code> y el botón dice la verdad.',
    },
    {
      texto: 'Agregar <code>.catch(() => {})</code> después de <code>writeText(…)</code>',
      correcta: false,
      porque: 'El error deja de verse, pero el botón sigue diciendo «¡Copiado!» aunque no se haya copiado nada.',
    },
    {
      texto: 'Cambiar a <code>document.execCommand("copy")</code>',
      correcta: false,
      porque: 'Está obsoleto, y además necesita un texto seleccionado en la página. La forma actual es la Clipboard API, bien esperada.',
    },
  ],
};

export const dispositivoLab = {
  id: 'dispositivo-lab',
  titulo: 'Un «Copiar» a prueba de todo',
  pagina: `<p>Tu código de invitación: <code id="codigo">JS-2026-ANA</code></p>
<button id="copiar">Copiar</button>`,
  inicial: `const boton = document.querySelector("#copiar");
const codigo = document.querySelector("#codigo").textContent;

// Al hacer clic:
// - si no existe navigator.clipboard, el botón dice "Cópialo a mano" y no hace nada más
// - si existe, copia el código con navigator.clipboard.writeText (esperando la promesa)
// - si se copió, el botón dice "¡Copiado!"; si falló, "No se pudo copiar"
`,
  verificaciones: [
    {
      texto: 'Si se puede, copia el código y dice <code>¡Copiado!</code>',
      prueba: 'let copiado = ""; Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (t) => { copiado = t; } } }); boton.click(); await new Promise((r) => setTimeout(r, 20)); return copiado === "JS-2026-ANA" && boton.textContent === "¡Copiado!";',
    },
    {
      texto: 'Si el navegador se niega, dice <code>No se pudo copiar</code>',
      prueba: 'Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new DOMException("Write permission denied.", "NotAllowedError"); } } }); boton.click(); await new Promise((r) => setTimeout(r, 20)); return boton.textContent === "No se pudo copiar";',
    },
    {
      texto: 'Si no hay portapapeles, dice <code>Cópialo a mano</code>',
      prueba: 'Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }); boton.click(); await new Promise((r) => setTimeout(r, 20)); return boton.textContent === "Cópialo a mano";',
    },
  ],
  pistas: [
    'El listener tiene que ser <code>async</code> para poder usar <code>await</code> adentro.',
    'Primero: <code>if (!navigator.clipboard) { boton.textContent = "Cópialo a mano"; return; }</code>',
    'Después: <code>try { await navigator.clipboard.writeText(codigo); boton.textContent = "¡Copiado!"; } catch { boton.textContent = "No se pudo copiar"; }</code>',
  ] as [string, string, string],
  solucion: `const boton = document.querySelector("#copiar");
const codigo = document.querySelector("#codigo").textContent;

boton.addEventListener("click", async () => {
  if (!navigator.clipboard) {
    boton.textContent = "Cópialo a mano";
    return;
  }
  try {
    await navigator.clipboard.writeText(codigo);
    boton.textContent = "¡Copiado!";
  } catch {
    boton.textContent = "No se pudo copiar";
  }
});`,
  explicacion:
    '<p>Las pruebas reemplazan <code>navigator.clipboard</code> por imitaciones para simular los tres casos, porque aquí no se puede tocar tu portapapeles de verdad. En tu página, el caso "sin portapapeles" aparece en páginas sin <code>https://</code> o en navegadores viejos. Un buen siguiente paso: mostrar el código seleccionado para que la persona lo copie con Ctrl+C.</p>',
};

/* ── 13.14 Audio, video y cámara ─────────────────────────── */
export const multimediaAuto = {
  id: 'multimedia-auto',
  titulo: 'Sonido, imagen y permisos',
  preguntas: [
    {
      pregunta: '¿Por qué <code>video.play()</code> devuelve una promesa?',
      opciones: ['Porque descarga el video entero', 'Porque el navegador puede negarse, por ejemplo si quieres reproducir con sonido antes de que la persona interactúe con la página', 'Por compatibilidad con navegadores viejos'],
      correcta: 1,
      explicacion: 'Si se rechaza, recibes un <code>NotAllowedError</code>. Un video con <code>muted</code> sí puede empezar solo.',
    },
    {
      pregunta: 'Terminaste de usar la cámara que pediste con <code>getUserMedia</code>. ¿Qué haces?',
      opciones: ['Nada, se apaga sola', 'Detienes cada pista del flujo: <code>flujo.getTracks().forEach((p) => p.stop())</code>', 'Recargas la página'],
      correcta: 1,
      explicacion: 'Mientras alguna pista siga activa, la cámara sigue encendida, con su luz y el aviso del navegador.',
    },
    {
      pregunta: '¿Cómo se muestra en un <code>&lt;video&gt;</code> el flujo de la cámara?',
      opciones: ['Con <code>video.src = flujo</code>', 'Con <code>video.srcObject = flujo</code>', 'Con <code>URL.createObjectURL(flujo)</code>'],
      correcta: 1,
      explicacion: '<code>src</code> es para direcciones de archivos; un flujo en vivo va en <code>srcObject</code>.',
    },
    {
      pregunta: 'Creaste un <code>AudioContext</code> al cargar la página, pero no suena nada. ¿Qué falta?',
      opciones: ['Subir el volumen', 'Llamar a <code>audio.resume()</code> como respuesta a un gesto de la persona: empieza suspendido', 'Usar un <code>&lt;audio&gt;</code>'],
      correcta: 1,
      explicacion: 'La misma regla de la reproducción automática vale para Web Audio: sin un gesto, no hay sonido.',
    },
  ],
};

export const multimediaOrden = {
  id: 'multimedia-orden',
  titulo: 'Un video sin archivo',
  codigo: `document.body.innerHTML = \`<video id="v" muted></video>\`;
const video = document.querySelector("#v");

console.log("pausado:", video.paused);
console.log("duración:", video.duration);
video.volume = 0.25;
console.log("volumen:", video.volume, "silencio:", video.muted);
console.log("listo para reproducir:", video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA);`,
  salida: ['pausado: true', 'duración: NaN', 'volumen: 0.25 silencio: true', 'listo para reproducir: false'],
  inicio: [2, 0, 3, 1],
  explicacion:
    'Un video recién creado está en pausa. Sin archivo no se sabe cuánto dura, así que <code>duration</code> es <code>NaN</code>, y <code>readyState</code> está en <code>0</code> (<code>HAVE_NOTHING</code>). El atributo <code>muted</code> del HTML deja la propiedad <code>muted</code> en <code>true</code>, y el volumen se puede cambiar igual, aunque esté en silencio.',
};

export const multimediaDetective = {
  id: 'multimedia-detective',
  titulo: 'La bienvenida que no suena',
  codigo: `<video id="intro" src="bienvenida.mp4"></video>
<p id="estado">Cargando…</p>

<script>
  const video = document.querySelector("#intro");
  video.addEventListener("loadedmetadata", () => {
    video.play();
    document.querySelector("#estado").textContent = "Reproduciendo";
  });
</script>`,
  error: `Uncaught (in promise) NotAllowedError: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD`,
  culpable: 7,
  hallazgo:
    'El video tiene sonido y la persona todavía no tocó la página, así que el navegador no deja reproducirlo: la promesa de <code>play()</code> se rechaza. Como nadie la espera, el rechazo queda sin atrapar y la línea 8 escribe «Reproduciendo» de todos modos.',
  pista: '¿Qué devuelve <code>play()</code>, y qué pasa si el navegador no deja reproducir?',
  arreglos: [
    {
      texto: 'Manejar la promesa: <code>video.play().then(() => (estado.textContent = "Reproduciendo")).catch(() => (estado.textContent = "Pulsa ▶ para ver la bienvenida"))</code>',
      correcta: true,
      porque: 'El mensaje dice la verdad en los dos casos, y la persona tiene una forma de empezar el video con un gesto. Si no necesita sonido, también sirve agregar <code>muted</code> al video.',
    },
    {
      texto: 'Envolver <code>video.play()</code> en un <code>try/catch</code>',
      correcta: false,
      porque: 'Sin <code>await</code>, el <code>try</code> no atrapa el rechazo de la promesa: todo sigue igual.',
    },
    {
      texto: 'Esperar un poco: <code>setTimeout(() => video.play(), 2000)</code>',
      correcta: false,
      porque: 'El tiempo no cambia nada: lo que falta es un gesto de la persona, no que cargue el video.',
    },
  ],
};

export const multimediaLab = {
  id: 'multimedia-lab',
  titulo: 'Un reproductor que no miente',
  pagina: `<audio id="pista" src="data:audio/wav;base64,AAAA"></audio>
<button id="play">Reproducir</button> <span id="tiempo">0:00</span>
<p id="aviso" role="status"></p>`,
  inicial: `const audio = document.querySelector("#pista");
const boton = document.querySelector("#play");
const aviso = document.querySelector("#aviso");

// 1. formatearTiempo(segundos) devuelve "m:ss": 5 → "0:05", 65 → "1:05", 600 → "10:00".
//    Ignora los decimales.
function formatearTiempo(segundos) {
}

// 2. Al hacer clic en el botón, espera audio.play():
//    - si funciona, el botón dice "Pausa"
//    - si falla (aquí va a fallar: el archivo no sirve), escribe "No se pudo reproducir"
//      en #aviso y deja el botón como estaba
`,
  verificaciones: [
    { texto: '<code>formatearTiempo</code> devuelve <code>0:05</code>, <code>1:05</code>, <code>10:00</code> y <code>0:59</code> (para 59,9)', prueba: 'return formatearTiempo(5) === "0:05" && formatearTiempo(65) === "1:05" && formatearTiempo(600) === "10:00" && formatearTiempo(59.9) === "0:59";' },
    { texto: 'Si <code>play()</code> falla, avisa y el botón sigue diciendo «Reproducir»', prueba: 'boton.click(); for (let i = 0; i < 40 && !aviso.textContent; i++) await new Promise((r) => setTimeout(r, 20)); return aviso.textContent === "No se pudo reproducir" && boton.textContent === "Reproducir";' },
    { texto: 'Si <code>play()</code> funciona, el botón dice «Pausa»', prueba: 'audio.play = async () => {}; boton.click(); await new Promise((r) => setTimeout(r, 20)); return boton.textContent === "Pausa";' },
  ],
  pistas: [
    'Minutos y segundos: <code>const m = Math.floor(segundos / 60); const s = Math.floor(segundos % 60);</code>',
    'Dos cifras para los segundos: <code>`${m}:${String(s).padStart(2, "0")}`</code>',
    'El listener: <code>boton.addEventListener("click", async () => { try { await audio.play(); boton.textContent = "Pausa"; } catch { aviso.textContent = "No se pudo reproducir"; } });</code>',
  ] as [string, string, string],
  solucion: `const audio = document.querySelector("#pista");
const boton = document.querySelector("#play");
const aviso = document.querySelector("#aviso");

function formatearTiempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return \`\${m}:\${String(s).padStart(2, "0")}\`;
}

boton.addEventListener("click", async () => {
  try {
    await audio.play();
    boton.textContent = "Pausa";
  } catch {
    aviso.textContent = "No se pudo reproducir";
  }
});`,
  explicacion:
    '<p>En un reproductor completo, <code>formatearTiempo</code> se usa en el evento <code>timeupdate</code>: <code>tiempo.textContent = formatearTiempo(audio.currentTime)</code>. El aviso va en una región viva (<code>role="status"</code>) para que también lo oiga quien usa un lector de pantalla. La tercera prueba reemplaza <code>audio.play</code> por una imitación que funciona, porque aquí no hay un archivo de verdad.</p>',
};

/* ── 13.17 Rendimiento de la página ──────────────────────── */
export const rendimientoAuto = {
  id: 'rendimiento-auto',
  titulo: 'Rápida de verdad',
  preguntas: [
    {
      pregunta: 'Al hacer clic en un botón, la página tarda medio segundo en reaccionar. ¿Qué métrica empeora?',
      opciones: ['LCP', 'INP: el tiempo entre una interacción y el siguiente dibujo de la página', 'CLS'],
      correcta: 1,
      explicacion: 'Un buen INP es de hasta 200 ms. La causa típica es una tarea larga de JavaScript que ocupa el hilo.',
    },
    {
      pregunta: 'Tienes que procesar 20.000 elementos y la página se congela. ¿Qué haces?',
      opciones: ['Usar <code>var</code> en vez de <code>let</code>', 'Partir el trabajo en trozos y ceder el turno entre ellos (<code>await scheduler.yield()</code>), o moverlo a un Web Worker', 'Agregar más <code>console.log</code>'],
      correcta: 1,
      explicacion: 'Mientras tu código corre, el navegador no puede atender clics ni pintar. Ceder el turno le da huecos para hacerlo.',
    },
    {
      pregunta: '¿Por qué conviene no alternar <code>elemento.offsetWidth</code> y <code>elemento.style.width = …</code> dentro de un bucle?',
      opciones: ['No importa', 'Porque cada lectura después de una escritura obliga al navegador a recalcular el diseño en ese momento', 'Porque <code>offsetWidth</code> es asíncrono'],
      correcta: 1,
      explicacion: 'Lee todo primero y escribe todo después: así el navegador recalcula una sola vez.',
    },
    {
      pregunta: 'Las imágenes de una página hacen saltar el texto mientras cargan. ¿Qué lo evita?',
      opciones: ['<code>loading="lazy"</code>', 'Poner <code>width</code> y <code>height</code> en cada imagen, para que el navegador reserve su lugar', 'Comprimirlas más'],
      correcta: 1,
      explicacion: 'Eso mejora el CLS. <code>loading="lazy"</code> ayuda a cargar menos, pero no evita el salto.',
    },
  ],
};

export const rendimientoOrden = {
  id: 'rendimiento-orden',
  titulo: 'Un fragmento que se muda',
  codigo: `document.body.innerHTML = \`<ul id="lista"><li>vieja</li></ul>\`;
const lista = document.querySelector("#lista");

const fragmento = document.createDocumentFragment();
fragmento.append(document.createElement("li"), document.createElement("li"));
console.log(fragmento.childNodes.length);

lista.append(fragmento);
console.log(fragmento.childNodes.length);
console.log(lista.children.length);

const nuevos = ["a", "b", "c"].map((t) => Object.assign(document.createElement("li"), { textContent: t }));
lista.replaceChildren(...nuevos);
console.log(lista.textContent);`,
  salida: ['2', '0', '3', 'abc'],
  inicio: [3, 1, 0, 2],
  explicacion:
    'Al agregar un fragmento, sus hijos se <b>mudan</b> a la lista y el fragmento queda vacío: la lista pasa a tener la vieja más las dos nuevas. <code>replaceChildren</code> saca todo lo que había y pone los nodos nuevos, también en un solo cambio.',
};

export const rendimientoDetective = {
  id: 'rendimiento-detective',
  titulo: 'Una marca que no existe',
  codigo: `performance.mark("inicio-carga");
const datos = Array.from({ length: 50_000 }, (_, i) => ({ id: i, nombre: \`item \${i}\` }));
const visibles = datos.filter((d) => d.id % 2 === 0);
performance.mark("fin-carga");

const medida = performance.measure("carga", "inicio-carga", "fin_carga");
console.log(\`Tardó \${medida.duration.toFixed(1)} ms\`);`,
  error: `Uncaught SyntaxError: Failed to execute 'measure' on 'Performance': The mark 'fin_carga' does not exist.
    at app.js:6:28`,
  culpable: 6,
  hallazgo:
    'La marca se llama <code>"fin-carga"</code>, con guion, pero <code>measure</code> pide <code>"fin_carga"</code>, con guion bajo. Como esa marca no existe, <code>measure</code> lanza un error (un <code>SyntaxError</code>, aunque no sea de sintaxis: así lo define la especificación).',
  pista: 'Compara, letra por letra, los nombres de las marcas de las líneas 1 y 4 con los de la línea 6.',
  arreglos: [
    {
      texto: 'Usar el nombre real: <code>performance.measure("carga", "inicio-carga", "fin-carga")</code>',
      correcta: true,
      porque: 'Con los nombres bien escritos, <code>measure</code> calcula el tiempo entre las dos marcas.',
    },
    {
      texto: 'Quitar el tercer argumento: <code>performance.measure("carga", "inicio-carga")</code>',
      correcta: false,
      porque: 'Ya no falla, pero mide hasta <b>ahora</b>, no hasta el final de la carga: si agregas código en el medio, el número deja de ser el que querías.',
    },
    {
      texto: 'Usar <code>Date.now()</code> en lugar de las marcas',
      correcta: false,
      porque: 'Funcionaría, pero <code>Date.now()</code> tiene menos precisión y puede saltar si cambia el reloj del sistema. El error es solo un nombre mal escrito.',
    },
  ],
};

export const rendimientoLab = {
  id: 'rendimiento-lab',
  titulo: 'Mil productos, un solo cambio',
  pagina: `<ul id="lista"></ul>
<script>
  // Cuenta cuántos cambios recibe la lista (cada append, cada innerHTML…)
  var cambios = 0;
  new MutationObserver((registros) => (cambios += registros.length)).observe(document.querySelector("#lista"), { childList: true });
</script>`,
  inicial: `const lista = document.querySelector("#lista");
const productos = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, nombre: \`Producto \${i + 1}\` }));

// Muestra cada producto como un <li> con "1. Producto 1", "2. Producto 2"…
// Ya funciona, pero hace 1000 cambios en la página: haz que sea UNO solo.
for (const p of productos) {
  const li = document.createElement("li");
  li.textContent = \`\${p.id}. \${p.nombre}\`;
  lista.append(li);
}
`,
  verificaciones: [
    { texto: 'La lista tiene los 1000 productos', prueba: 'return lista.children.length === 1000;' },
    { texto: 'Con el texto correcto, del primero al último', prueba: 'return lista.firstElementChild.textContent === "1. Producto 1" && lista.lastElementChild.textContent === "1000. Producto 1000";' },
    { texto: 'Con un solo cambio en la página', prueba: 'await new Promise((r) => setTimeout(r, 0)); return cambios === 1;' },
  ],
  pistas: [
    'Crea un fragmento antes del bucle: <code>const fragmento = document.createDocumentFragment();</code>',
    'Dentro del bucle, agrega cada <code>&lt;li&gt;</code> al fragmento en lugar de a la lista.',
    'Después del bucle, un solo <code>lista.append(fragmento);</code> (o arma un array de <code>&lt;li&gt;</code> y usa <code>lista.replaceChildren(...items)</code>).',
  ] as [string, string, string],
  solucion: `const lista = document.querySelector("#lista");
const productos = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, nombre: \`Producto \${i + 1}\` }));

const fragmento = document.createDocumentFragment();
for (const p of productos) {
  const li = document.createElement("li");
  li.textContent = \`\${p.id}. \${p.nombre}\`;
  fragmento.append(li);
}
lista.append(fragmento);`,
  explicacion:
    '<p>Un <code>MutationObserver</code> cuenta los cambios que recibe la lista: con el código original son 1000, uno por <code>append</code>. Con el fragmento, todos los <code>&lt;li&gt;</code> llegan juntos en un único cambio. Con <code>lista.replaceChildren(...productos.map(…))</code> también sería uno, y además reemplaza lo que hubiera antes.</p>',
};
