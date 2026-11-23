# Cobertura de JavaScript: qué enseña el curso y qué falta

> Revisión del 2026-11-22, buscando cada tema en las 111 lecciones.
> Sirve para decidir, paso a paso, qué se agrega como **lección nueva**, como **sección nueva** o dentro de un **proyecto** (ver [`PROYECTOS.md`](PROYECTOS.md)).
> Estado de cada fila: **por decidir**, salvo que diga otra cosa.

## 1. Lo que el curso ya cubre bien

- **El lenguaje, casi completo:** tipos, conversión, operadores, control de flujo, errores (con `cause` y `AggregateError`), funciones, `this`, closures, scope, hoisting, la pila, la memoria (pila y heap, recolector, fugas, `WeakRef`), objetos, prototipos, clases (campos privados, `static`, decorators), colecciones, datos binarios, iteradores, generadores, iterator helpers, asincronía completa (event loop, microtareas, promesas, combinadores, `AbortController`, patrones), módulos, metaprogramación (descriptores, Proxy, Reflect, symbols conocidos, template tags) y las novedades de ES2021 a ES2027.
- **Navegador:** DOM, eventos, `fetch`, formularios y `FormData`, almacenamiento (`localStorage`, IndexedDB, cookies), navegación (History y Navigation API), observers, estilos y animación (Web Animations, View Transitions), Canvas y SVG (una lección), Web Components, Web Workers (`BroadcastChannel`, `SharedArrayBuffer`), Service Workers y seguridad (XSS, CSP, CSRF).
- **Servidor y herramientas:** Node.js hoy, archivos y streams, servidor HTTP, el event loop de Node, procesos e hilos, seguridad, Deno y Bun, DevTools, lint, npm, testing, TypeScript y Vite.

## 2. APIs del navegador que faltan

| Tema | Hoy | Dónde podría ir |
|---|---|---|
| **Archivos:** `input type=file multiple`, `File`, `FileReader`, `URL.createObjectURL`, descargas con `Blob` y `<a download>`, progreso de subida (`XMLHttpRequest.upload`), File System Access API | Solo `FormData` y una mención de `blob()` | Lección nueva en la sección 13 y un proyecto (galería que sube fotos) |
| **Tiempo real:** `WebSocket`, Server-Sent Events (`EventSource`), WebRTC | `WebSocket` solo se menciona; SSE y WebRTC no aparecen | Lección nueva en la sección 13 y un proyecto (chat) |
| **Arrastrar y soltar** (la API de drag & drop de HTML) | No aparece | Lección nueva en la sección 13. La necesita el Kanban |
| **APIs del dispositivo:** portapapeles, notificaciones, ubicación, compartir (Web Share), pantalla completa, Page Visibility, vibración, Screen Wake Lock | No aparecen | Lección nueva en la sección 13 |
| **Multimedia:** Web Audio, cámara y micrófono (`getUserMedia`), grabar (`MediaRecorder`), `<video>` y `<audio>` desde JS | No aparecen | Lección nueva o un proyecto |
| **Elementos de HTML con API:** `<dialog>` (`showModal`) y la Popover API | No aparecen | Dentro de una lección de accesibilidad o del DOM |
| **Web Crypto:** `crypto.subtle` (hash, cifrado), `getRandomValues`, `randomUUID` en el navegador | `randomUUID` solo se menciona en Node | Ampliar «Seguridad en el navegador» |
| **Texto editable:** `contenteditable`, Selection y Range | No aparecen | Dentro de un proyecto (un editor) |
| **Otras:** Compression Streams, Storage API (`navigator.storage`), Web Locks, `requestIdleCallback` y `scheduler.yield()` | No aparecen | Menciones dentro de lecciones existentes |

## 3. Temas de JavaScript (no APIs) que faltan

| Tema | Hoy | Dónde podría ir |
|---|---|---|
| **Accesibilidad con JavaScript:** manejo del foco, teclado, `aria-live`, `inert`, `<dialog>` accesible, no romper la navegación | No hay lección | Lección nueva en la sección 13. Es importante: toca cualquier interfaz |
| **Eventos propios:** `EventTarget`, `CustomEvent`, `dispatchEvent`, el patrón publicar/suscribir | Solo se menciona | Lección nueva («Eventos propios y comunicación entre partes») |
| **Patrones de diseño y arquitectura sin frameworks:** módulo, fábrica, observador, estado de la aplicación, separar datos y vista | No hay lección | Sección nueva (ver 5) |
| **Algoritmos y estructuras de datos:** Big O, buscar y ordenar, pila, cola, lista enlazada, árbol, grafo, memoización, cuándo usar Map o Set por rendimiento | Big O aparece de pasada; la memoización solo en un reto | Sección nueva (ver 5) |
| **Programación funcional, más a fondo:** currificación, composición, inmutabilidad estructural | Composición y aplicación parcial, sin currificación | Ampliar «Estilo funcional» |
| **Operadores bit a bit** (`&`, `|`, `^`, `<<`, `>>>`) y banderas con bits | No aparecen | Ampliar «Operadores» o «Datos binarios» |
| **`arguments`, `eval` y `new Function`:** qué son y por qué evitarlos | Menciones sueltas | Ampliar «Parámetros» y «Seguridad» |
| **Rendimiento web:** reflow y repintado, `DocumentFragment` y lotes, Web Vitals (LCP, INP, CLS), carga diferida | El panel Rendimiento de DevTools, sin profundidad | Lección nueva en la sección 13 o en la 15 |
| **Gráficos a fondo:** Canvas (transformaciones, imágenes, píxeles, exportar PNG con `toBlob`) y SVG desde JavaScript (formas editables, exportar), gráficos de datos | Una sola lección | Dos proyectos: «Pizarra para dibujar» con Canvas y su versión con SVG, y el gráfico del control de gastos |
| **WebGL, WebGPU y WebAssembly** | Solo se mencionan | Una lección de orientación («Qué más hay»), sin entrar a fondo |
| **Pruebas de punta a punta** (Playwright) | Solo se mencionan | Ampliar «Testing» |
| **Bases de datos en Node** (`node:sqlite`) y **herramientas de línea de comandos** (`parseArgs`, `process.stdin`) | Solo se mencionan | Lecciones nuevas en la sección 14, o un proyecto |
| **Después del curso:** frameworks (React, Vue, Svelte), signals y qué aprender después | Se mencionan sueltos | Una lección de cierre («¿Y ahora qué?») |

## 4. La web en sí (no el contenido)

**Todo hecho el 2026-11-22:** página 404 propia, vista previa al compartir (Open Graph y Twitter, con `og.jpg`), `sitemap.xml`, `robots.txt` y URL canónica, exportar e importar el progreso («Tu progreso», en el temario), buscador (Pagefind, en la barra lateral) y revisión de accesibilidad con axe (0 fallas en las 132 páginas). El detalle está en el README.

## 5. Secciones nuevas posibles

- **Patrones y arquitectura:** eventos propios, patrones de diseño en JS, estado de una aplicación sin frameworks, separar datos y vista, cómo organizar un proyecto mediano. Prepara para el proyecto final.
- **Algoritmos y estructuras de datos en JavaScript:** Big O explicado con el pizarrón, buscar y ordenar, pila, cola, árbol y grafo, recursión aplicada, memoización. Encaja con Rayos X, que puede mostrar la pila de la recursión.
- **Más allá del curso (cierre):** frameworks, signals, WebAssembly, WebGL y WebGPU, y qué aprender después.

## 6. Cómo decidir

Para cada fila hay tres caminos:

1. **Lección nueva:** el tema es base y le sirve a todo el mundo (archivos, accesibilidad, eventos propios).
2. **Dentro de un proyecto:** el tema se entiende mejor construyendo. Por ejemplo, Canvas a fondo en una pizarra para dibujar, o Selection y Range en un editor. El proyecto lo explica en su bloque «Lo nuevo de este proyecto» antes de programar (ver `PROYECTOS.md`, 2.2).
3. **Mención:** basta con nombrarlo y enlazar a MDN (Web Locks, Compression Streams).
