// Ejercicios de la sección 17: «¿Y ahora qué?». Es una sección de orientación, a alto nivel:
// cada lección cierra con una autoevaluación corta, sin laboratorios (los frameworks no corren en el sandbox).

/* ── 17.1 Después de JavaScript ──────────────────────────── */
export const despuesAuto = {
  id: 'ahora-despues-auto',
  titulo: 'El mapa',
  preguntas: [
    {
      pregunta: '¿Qué diferencia hay entre una librería y un framework?',
      opciones: ['Ninguna, son sinónimos', 'Tu código llama a una librería cuando la necesita; un framework llama a tu código y decide la estructura de la aplicación', 'Las librerías son más nuevas'],
      correcta: 1,
      explicacion: 'Es la "inversión de control": con un framework, tú completas las piezas que él organiza.',
    },
    {
      pregunta: '¿Qué agrega un meta-framework como Next.js o Nuxt?',
      opciones: ['Otro lenguaje', 'Lo que una aplicación completa necesita alrededor de la librería de interfaz: rutas, renderizado en el servidor, carga de datos y la parte de backend', 'Solo estilos'],
      correcta: 1,
      explicacion: 'React o Vue resuelven los componentes; el meta-framework resuelve la aplicación entera.',
    },
    {
      pregunta: '¿Qué conviene más antes de elegir un framework?',
      opciones: ['Aprender todos a la vez', 'Tener firmes los fundamentos de JavaScript y el navegador: todos los frameworks están hechos de eso', 'Elegir el más nuevo'],
      correcta: 1,
      explicacion: 'Eventos, el DOM, la asincronía y los módulos aparecen en todos. Lo que cambia es la forma de organizarlos.',
    },
  ],
};

/* ── 17.2 TypeScript ─────────────────────────────────────── */
export const tsAuto = {
  id: 'ahora-typescript-auto',
  titulo: 'Tipos antes de ejecutar',
  preguntas: [
    {
      pregunta: '¿Cuándo detecta TypeScript un error de tipos?',
      opciones: ['Cuando el programa se ejecuta', 'Antes de ejecutar, mientras escribes o al comprobar el proyecto', 'Nunca, solo documenta'],
      correcta: 1,
      explicacion: 'Esa es su ventaja: el error aparece en el editor, no en la pantalla de quien usa la aplicación.',
    },
    {
      pregunta: '¿Qué llega al navegador cuando escribes TypeScript?',
      opciones: ['TypeScript tal cual', 'JavaScript: los tipos se borran al compilar (o al ejecutar, en los runtimes que lo hacen solos)', 'Un archivo binario'],
      correcta: 1,
      explicacion: 'Los tipos no existen al ejecutar. Por eso los datos que llegan de afuera hay que validarlos igual.',
    },
    {
      pregunta: '¿Hay que reaprender JavaScript para usar TypeScript?',
      opciones: ['Sí, es otro lenguaje', 'No: todo JavaScript válido es TypeScript válido, y se le agregan tipos encima', 'Solo las clases'],
      correcta: 1,
      explicacion: 'Por eso se puede adoptar de a poco, archivo por archivo, incluso con JSDoc en archivos .js.',
    },
  ],
};

/* ── 17.3 React ──────────────────────────────────────────── */
export const reactAuto = {
  id: 'ahora-react-auto',
  titulo: 'La interfaz como función del estado',
  preguntas: [
    {
      pregunta: 'En React, ¿cómo se cambia lo que muestra un componente?',
      opciones: ['Tocando el DOM con <code>querySelector</code>', 'Cambiando su estado (con la función que da <code>useState</code>): React vuelve a ejecutar el componente y actualiza el DOM', 'Recargando la página'],
      correcta: 1,
      explicacion: 'Describes cómo se ve la interfaz para cada estado, y React se ocupa de los cambios.',
    },
    {
      pregunta: '¿Qué es JSX?',
      opciones: ['Un lenguaje nuevo', 'Una sintaxis parecida a HTML dentro de JavaScript, que se convierte en llamadas a funciones', 'Un formato de estilos'],
      correcta: 1,
      explicacion: 'Las llaves <code>{…}</code> dentro de JSX son expresiones de JavaScript normales.',
    },
    {
      pregunta: '¿Qué agrega Next.js sobre React?',
      opciones: ['Nada, es lo mismo', 'Rutas según los archivos, renderizado en el servidor, componentes de servidor y la parte de backend', 'Solo una plantilla de estilos'],
      correcta: 1,
      explicacion: 'React es la librería de componentes; Next.js arma la aplicación completa alrededor de ella.',
    },
  ],
};

/* ── 17.4 Vue ────────────────────────────────────────────── */
export const vueAuto = {
  id: 'ahora-vue-auto',
  titulo: 'Reactividad con ref',
  preguntas: [
    {
      pregunta: '¿Qué hay en un archivo <code>.vue</code>?',
      opciones: ['Solo HTML', 'Un componente completo: su lógica (<code>&lt;script&gt;</code>), su plantilla (<code>&lt;template&gt;</code>) y sus estilos (<code>&lt;style&gt;</code>)', 'Una configuración'],
      correcta: 1,
      explicacion: 'Se llaman componentes de un solo archivo (<i>Single-File Components</i>).',
    },
    {
      pregunta: 'En Vue, ¿qué pasa al cambiar <code>cuenta.value</code> si <code>cuenta</code> es un <code>ref</code>?',
      opciones: ['Nada, hay que avisar a mano', 'Vue se entera solo y actualiza las partes de la página que lo usan', 'Se recarga el componente entero'],
      correcta: 1,
      explicacion: 'Por dentro, Vue intercepta las lecturas y escrituras (con Proxy y getters), como viste en Metaprogramación.',
    },
    {
      pregunta: '¿Qué es Nuxt?',
      opciones: ['Una versión vieja de Vue', 'El meta-framework de Vue: rutas por archivos, renderizado en el servidor y backend', 'Una librería de animaciones'],
      correcta: 1,
      explicacion: 'Nuxt es a Vue lo que Next.js es a React.',
    },
  ],
};

/* ── 17.5 Angular ────────────────────────────────────────── */
export const angularAuto = {
  id: 'ahora-angular-auto',
  titulo: 'Todo incluido',
  preguntas: [
    {
      pregunta: '¿Qué diferencia a Angular de React o Vue?',
      opciones: ['Que no usa componentes', 'Que es un framework completo: trae rutas, formularios, peticiones HTTP, inyección de dependencias y pruebas, todo con TypeScript', 'Que no se puede usar en empresas'],
      correcta: 1,
      explicacion: 'Con React o Vue eliges esas piezas aparte; Angular ya las trae decididas.',
    },
    {
      pregunta: '¿Qué era Angular Universal?',
      opciones: ['Un framework distinto de Angular', 'El nombre antiguo del renderizado en el servidor de Angular: hoy es parte del propio Angular, como el paquete <code>@angular/ssr</code>', 'Una versión de AngularJS'],
      correcta: 1,
      explicacion: 'Desde Angular 17 se activa al crear el proyecto (<code>ng new --ssr</code>) o con <code>ng add @angular/ssr</code>. Vas a ver el nombre viejo en tutoriales.',
    },
    {
      pregunta: '¿Tiene Angular un meta-framework como Next.js o Nuxt?',
      opciones: ['Sí, oficial: Angular Universal', 'No uno oficial: Angular trae su propio SSR, y el más parecido a Next o Nuxt es Analog, hecho por la comunidad', 'No se puede renderizar Angular en el servidor'],
      correcta: 1,
      explicacion: 'Analog agrega rutas por archivos, rutas de API y Vite sobre Angular.',
    },
  ],
};

/* ── 17.6 Svelte ─────────────────────────────────────────── */
export const svelteAuto = {
  id: 'ahora-svelte-auto',
  titulo: 'Un compilador',
  preguntas: [
    {
      pregunta: '¿Qué hace distinto a Svelte?',
      opciones: ['Que no usa JavaScript', 'Que es un compilador: convierte tus componentes en JavaScript que actualiza el DOM directamente, sin cargar una librería grande en el navegador', 'Que solo sirve para el servidor'],
      correcta: 1,
      explicacion: 'Mucho del trabajo que otros frameworks hacen en el navegador, Svelte lo hace al compilar.',
    },
    {
      pregunta: 'En Svelte 5, ¿cómo se declara un valor reactivo?',
      opciones: ['Con <code>useState</code>', 'Con la <i>rune</i> <code>$state</code>: <code>let cuenta = $state(0)</code>', 'Con <code>ref</code>'],
      correcta: 1,
      explicacion: 'Las <i>runes</i> (<code>$state</code>, <code>$derived</code>, <code>$effect</code>) le dicen al compilador qué es reactivo.',
    },
    {
      pregunta: '¿Qué es SvelteKit?',
      opciones: ['Un juego de íconos', 'El meta-framework de Svelte: rutas por archivos, renderizado en el servidor y backend', 'La versión vieja de Svelte'],
      correcta: 1,
      explicacion: 'Cumple el mismo papel que Next.js para React o Nuxt para Vue.',
    },
  ],
};

/* ── 17.7 Astro ──────────────────────────────────────────── */
export const astroAuto = {
  id: 'ahora-astro-auto',
  titulo: 'Islas de interactividad',
  preguntas: [
    {
      pregunta: 'Por defecto, ¿cuánto JavaScript manda Astro al navegador?',
      opciones: ['El de React completo', 'Ninguno: la página llega como HTML, y solo los componentes que lo piden cargan su JavaScript', 'Lo mismo que cualquier framework'],
      correcta: 1,
      explicacion: 'Por eso los sitios de contenido (blogs, documentación, cursos como este) cargan muy rápido.',
    },
    {
      pregunta: '¿Qué es una "isla" en Astro?',
      opciones: ['Una página aparte', 'Un componente interactivo dentro de una página de HTML estático, que se activa solo, por ejemplo con <code>client:visible</code>', 'Un servidor'],
      correcta: 1,
      explicacion: 'El resto de la página es HTML que no necesita JavaScript.',
    },
    {
      pregunta: '¿Puede una página de Astro usar componentes de React o de Svelte?',
      opciones: ['No, solo los suyos', 'Sí: se pueden mezclar componentes de React, Vue, Svelte, Solid y otros en el mismo sitio', 'Solo de React'],
      correcta: 1,
      explicacion: 'Se instala la integración de cada uno y se usan como islas.',
    },
  ],
};

/* ── 17.8 Otras librerías conocidas ──────────────────────── */
export const otrasAuto = {
  id: 'ahora-otras-auto',
  titulo: 'Más opciones',
  preguntas: [
    {
      pregunta: '¿Qué tienen en común Solid, Preact (con sus signals) y las versiones recientes de Angular y Vue?',
      opciones: ['Nada', 'La reactividad fina con <b>signals</b>: cada valor sabe qué partes de la página dependen de él y actualiza solo esas', 'Que están escritas en Go'],
      correcta: 1,
      explicacion: 'Las signals son tan populares que TC39 estudia una propuesta para tenerlas en el propio lenguaje.',
    },
    {
      pregunta: 'Quieres algo de interactividad en una página que tu servidor ya genera como HTML. ¿Qué es lo más simple?',
      opciones: ['Reescribirla entera en React', 'Una librería que se usa desde el HTML, como Alpine.js o htmx, sin un proyecto aparte', 'Usar WebGL'],
      correcta: 1,
      explicacion: 'Alpine agrega comportamiento con atributos; htmx pide HTML al servidor y lo inserta en la página.',
    },
    {
      pregunta: '¿Por qué en un proyecto nuevo ya no hace falta jQuery?',
      opciones: ['Porque está prohibida', 'Porque el navegador ya trae lo que resolvía: <code>querySelector</code>, <code>classList</code>, <code>fetch</code> y los mismos comportamientos en todos los navegadores', 'Porque es muy lenta'],
      correcta: 1,
      explicacion: 'Sigue en muchísimos sitios existentes, así que vale la pena saber leerla.',
    },
  ],
};

/* ── 17.9 JavaScript en el backend ───────────────────────── */
export const backendAuto = {
  id: 'ahora-backend-auto',
  titulo: 'Servidores de verdad',
  preguntas: [
    {
      pregunta: '¿Qué es un <i>middleware</i> en Express, Koa o Hono?',
      opciones: ['Una base de datos', 'Una función que corre en el camino de cada petición, antes de la ruta (para registrar, autenticar, leer el cuerpo…), y decide si sigue', 'Un tipo de ruta'],
      correcta: 1,
      explicacion: 'Encadenar middlewares es la forma de armar un servidor con piezas pequeñas.',
    },
    {
      pregunta: 'Tu API tiene que correr en Node hoy y quizás en Cloudflare Workers mañana. ¿Qué framework encaja mejor?',
      opciones: ['Express', 'Hono: está hecho sobre <code>Request</code> y <code>Response</code>, las APIs web, y corre igual en Node, Deno, Bun y Workers', 'Ninguno'],
      correcta: 1,
      explicacion: 'Express depende de las APIs propias de Node, como <code>http</code>.',
    },
    {
      pregunta: '¿Qué ofrece NestJS que Express no?',
      opciones: ['Nada', 'Una estructura completa: módulos, controladores, servicios con inyección de dependencias y decorators, todo con TypeScript', 'Un lenguaje propio'],
      correcta: 1,
      explicacion: 'Se parece mucho a Angular, y por dentro usa Express o Fastify para atender las peticiones.',
    },
  ],
};

/* ── 17.10 Más allá del navegador clásico ────────────────── */
export const masAllaAuto = {
  id: 'ahora-mas-alla-auto',
  titulo: 'Otros caminos',
  preguntas: [
    {
      pregunta: '¿Para qué sirve WebAssembly?',
      opciones: ['Para reemplazar a JavaScript', 'Para ejecutar en el navegador, a gran velocidad, código escrito en otros lenguajes (C, C++, Rust, Go), junto a JavaScript', 'Para escribir CSS'],
      correcta: 1,
      explicacion: 'JavaScript sigue manejando la página; WebAssembly hace el cálculo pesado, como editar video o correr un juego.',
    },
    {
      pregunta: '¿Qué usan WebGL y WebGPU?',
      opciones: ['El disco', 'La tarjeta gráfica, para 3D y cálculos en paralelo; casi siempre a través de librerías como Three.js', 'Solo el procesador'],
      correcta: 1,
      explicacion: 'WebGPU es el sucesor moderno de WebGL, y además sirve para cálculo general, como correr modelos de IA.',
    },
    {
      pregunta: 'Quieres una aplicación de escritorio hecha con tecnologías web. ¿Qué diferencia a Tauri de Electron?',
      opciones: ['Ninguna', 'Tauri usa el navegador que ya trae el sistema y un backend en Rust, así que las aplicaciones pesan mucho menos; Electron incluye su propio Chromium y Node.js', 'Tauri solo funciona en teléfonos'],
      correcta: 1,
      explicacion: 'Electron es el más usado (VS Code está hecho con él); Tauri es la opción liviana.',
    },
  ],
};
