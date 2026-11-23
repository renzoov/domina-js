# Cobertura de JavaScript: qué enseña el curso y qué falta

> Revisión del 2026-11-22, buscando cada tema en las 111 lecciones.
> Sirve para decidir, paso a paso, qué se agrega como **lección nueva**, como **sección nueva** o dentro de un **proyecto** (ver [`PROYECTOS.md`](PROYECTOS.md)).
> Las secciones 2 y 3 quedaron hechas el 2026-11-22; lo que falta está marcado como pendiente o descartado.

## 1. Lo que el curso ya cubre bien

- **El lenguaje, casi completo:** tipos, conversión, operadores, control de flujo, errores (con `cause` y `AggregateError`), funciones, `this`, closures, scope, hoisting, la pila, la memoria (pila y heap, recolector, fugas, `WeakRef`), objetos, prototipos, clases (campos privados, `static`, decorators), colecciones, datos binarios, iteradores, generadores, iterator helpers, asincronía completa (event loop, microtareas, promesas, combinadores, `AbortController`, patrones), módulos, metaprogramación (descriptores, Proxy, Reflect, symbols conocidos, template tags) y las novedades de ES2021 a ES2027.
- **Navegador:** DOM, eventos, `fetch`, formularios y `FormData`, almacenamiento (`localStorage`, IndexedDB, cookies), navegación (History y Navigation API), observers, estilos y animación (Web Animations, View Transitions), Canvas y SVG (una lección), Web Components, Web Workers (`BroadcastChannel`, `SharedArrayBuffer`), Service Workers y seguridad (XSS, CSP, CSRF).
- **Servidor y herramientas:** Node.js hoy, archivos y streams, servidor HTTP, el event loop de Node, procesos e hilos, seguridad, Deno y Bun, DevTools, lint, npm, testing, TypeScript y Vite.

## 2. APIs del navegador (hecho el 2026-11-22)

| Tema | Cómo quedó |
|---|---|
| **Archivos** | Lección nueva *Archivos* (13): `input type=file`, `File`, `text()`/`arrayBuffer()`, `FileReader`, `createObjectURL`, descargas con `Blob`, subida con progreso (`XMLHttpRequest.upload`) y la File System Access API |
| **Tiempo real** | Lección nueva *Tiempo real: SSE, WebSocket y WebRTC* (13) |
| **Arrastrar y soltar** | Lección nueva *Arrastrar y soltar* (13), con archivos soltados y la alternativa con teclado |
| **APIs del dispositivo** | Lección nueva *APIs del dispositivo* (13): portapapeles, Web Share, notificaciones, ubicación, pantalla completa, Page Visibility, Wake Lock y vibración |
| **Multimedia** | Lección nueva *Audio, video y cámara* (13): `HTMLMediaElement`, la política de reproducción, `getUserMedia`, `getDisplayMedia`, `MediaRecorder` y Web Audio |
| **`<dialog>` y Popover** | Lección nueva *Diálogos y popovers* (13) |
| **Web Crypto** | Ampliada *Seguridad en el navegador*: `getRandomValues`, `randomUUID`, `crypto.subtle.digest` |
| **Texto editable** | Lección nueva *Texto editable y selección* (13): `contenteditable`, Range, Selection, la selección en `input`/`textarea` y `beforeinput` |
| **Otras** | Compression Streams en *Datos binarios*; Storage API en *Guardar datos*; Web Locks en *Web Workers y mensajería*; `requestIdleCallback` y `scheduler.yield()` en *Rendimiento de la página* |

## 3. Temas de JavaScript (hecho el 2026-11-22, salvo lo indicado)

| Tema | Cómo quedó |
|---|---|
| **Accesibilidad con JavaScript** | Lección nueva *Accesibilidad con JavaScript* (13): el elemento correcto, mover y devolver el foco, regiones vivas, estados ARIA, `inert` y *roving tabindex* |
| **Eventos propios** | Lección nueva *Eventos propios* (13): `CustomEvent`, `dispatchEvent`, `bubbles`, `cancelable`, `EventTarget` en clases y publicar/suscribir |
| **Patrones de diseño y arquitectura** | **Descartado**: va en otro sitio, dedicado a esos temas |
| **Algoritmos y estructuras de datos** | **Descartado**: va en otro sitio, dedicado a esos temas |
| **Programación funcional, más a fondo** | Ampliada *Estilo funcional*: currificación y cambios profundos sin mutar (compartir lo que no cambió) |
| **Operadores bit a bit** | Ampliada *Operadores*: la tabla de operadores y las banderas con bits |
| **`arguments`, `eval` y `new Function`** | Ampliadas *Parámetros* (`arguments`) y *Seguridad en el navegador* (`eval`, `new Function`, textos en `setTimeout`) |
| **Rendimiento web** | Lección nueva *Rendimiento de la página* (13): Web Vitals, tareas largas, reflow, lotes con `DocumentFragment`, carga diferida y medición |
| **Gráficos a fondo** | Ampliada *Gráficos: Canvas y SVG*: transformaciones, píxeles, exportar con `toBlob`, CORS en el canvas y un gráfico de barras en SVG. Una pizarra completa queda para Proyectos |
| **WebGL, WebGPU y WebAssembly** | Pendiente: irán en la sección nueva «¿Y ahora qué?» (ver 5) |
| **Pruebas de punta a punta** | Ampliada *Testing*: Playwright, localizadores por rol y `expect` que espera |
| **Bases de datos en Node y línea de comandos** | Lecciones nuevas *Bases de datos con node:sqlite* y *Programas de línea de comandos* (14) |
| **Después del curso** | Pendiente: la sección nueva «¿Y ahora qué?» (ver 5) |

También se agregaron al glosario: CustomEvent, Blob, Foco, Región viva, Popover, WebSocket, Tarea larga, Web Vitals, Inyección de SQL y Currificación.

## 4. La web en sí (no el contenido)

**Todo hecho el 2026-11-22:** página 404 propia, vista previa al compartir (Open Graph y Twitter, con `og.jpg`), `sitemap.xml`, `robots.txt` y URL canónica, exportar e importar el progreso («Tu progreso», en el temario), buscador (Pagefind, en la barra lateral) y revisión de accesibilidad con axe (0 fallas en las 132 páginas). El detalle está en el README.

## 5. Secciones nuevas

- **Patrones y arquitectura** y **Algoritmos y estructuras de datos:** descartadas para este sitio (2026-11-22). Esos temas tendrán su propio sitio.
- **«¿Y ahora qué?» (cierre):** aprobada la idea, pendiente de aprobar el contenido. Qué aprender después de JavaScript, a alto nivel: TypeScript con un ejemplo de JS y su versión con tipos, React (y Next.js), Vue (y Nuxt), Angular, Svelte y otras librerías conocidas, más WebAssembly, WebGL y WebGPU. Sin profundizar: cada uno de esos temas tendrá su propio sitio.

## 6. Cómo decidir

Para cada fila hay tres caminos:

1. **Lección nueva:** el tema es base y le sirve a todo el mundo (archivos, accesibilidad, eventos propios).
2. **Dentro de un proyecto:** el tema se entiende mejor construyendo. Por ejemplo, Canvas a fondo en una pizarra para dibujar, o Selection y Range en un editor. El proyecto lo explica en su bloque «Lo nuevo de este proyecto» antes de programar (ver `PROYECTOS.md`, 2.2).
3. **Mención:** basta con nombrarlo y enlazar a MDN (Web Locks, Compression Streams).
