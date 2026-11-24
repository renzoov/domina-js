# Plan: sección «Proyectos»

> Estado: **planificado, sin implementar.** En la navegación ya está el botón «Proyectos», tachado y con el aviso «Próximamente».
> La lista ya está decidida (2026-11-23): son **30 proyectos**, en la sección 10. Falta elegir el piloto y construir la base (sección 8).

## 1. Objetivo

Mucha gente aprende mejor construyendo algo. Después de las lecciones, los ejercicios, los Retos del motor y Rayos X, la sección **Proyectos** propone 30 aplicaciones completas, de la más fácil a la más difícil, hechas solo con JavaScript. Cada una toca varios temas del curso y **profundiza un poco más** que la lección. El último proyecto es grande y junta temas de casi todas las secciones.

La regla de oro: **el HTML y el CSS ya vienen hechos.** Quien sigue el proyecto escribe sobre todo JavaScript, paso a paso, en el editor que prefiera. Si algún paso obliga a tocar el HTML o el CSS, el paso lo dice claramente.

## 2. Lo que ve quien aprende

### 2.1 La página `/proyectos`

- Cabecera como las demás páginas: título en letra de tiza («Proyectos»), subrayado amarillo y un párrafo corto que explica la idea y para quién es: «para cuando ya terminaste las lecciones, o casi».
- Una **cuadrícula tipo bento** con una tarjeta por proyecto:
  - **número** en un óvalo de tiza (1, 2, 3…);
  - **título** en letra de tiza (por ejemplo «Calculadora»);
  - **descripción breve**, de una o dos líneas y como máximo unos 110 caracteres, para que la tarjeta respire. Ejemplo: «Crearemos una calculadora que funciona con el mouse y el teclado, y no se rompe con los decimales»;
  - **nivel** (Fácil, Intermedio o Avanzado) con la tiza de su color, y **hasta tres temas** como etiquetas pequeñas;
  - una marca ✓ si quien aprende ya lo completó (progreso en el navegador, como los ejercicios).
- Las tarjetas tienen tamaños distintos, como en un bento: las primeras más chicas, las intermedias medianas y **el proyecto final ocupa el espacio más grande**, con un tratamiento destacado.
- En el teléfono, la cuadrícula pasa a una sola columna en orden.

### 2.2 La página de cada proyecto, `/proyectos/<slug>`

1. **Cabecera:** número, título, nivel, tiempo estimado y los temas que toca. Cada tema enlaza a su lección.
2. **Vista previa:** una captura del proyecto terminado, o una demo en un `iframe` con *sandbox*.
3. **Descargas**, dos botones grandes:
   - **`proyecto-inicial.zip`:** el HTML y el CSS completos, y un `app.js` con el esqueleto y comentarios `// PASO 3: …` donde va cada parte;
   - **`proyecto-final.zip`:** el proyecto completo, para quien solo quiere el código o quiere comparar.
4. **Lo nuevo de este proyecto:** antes de programar, una mini lección con lo que el proyecto usa y el curso todavía no enseña, o enseña sin profundidad. Por ejemplo, `input type=file` y `Blob` en la galería, o Server-Sent Events en el chat. Tiene explicación corta, un ejemplo que se ejecuta (como los de las lecciones), un pizarrón o Rayos X cuando ayuda, y enlaces a MDN. La idea es que nadie llegue a un paso sin saber qué está usando. Los temas que el curso sí cubre se enlazan a su lección y no se repiten.
5. **Antes de empezar:** cómo abrir el proyecto. En los primeros basta con abrir `index.html`. Los que usan módulos o `fetch` necesitan un servidor local, como la extensión Live Server de VS Code o `npx serve`, y el paso explica por qué: con `file://` no funcionan.
6. **El paso a paso**, en pasos numerados. Cada paso tiene:
   - **qué vas a lograr** y **qué archivo tocar**, con una etiqueta visible si es HTML o CSS;
   - la explicación, con enlaces a las lecciones y al glosario;
   - **cómo comprobarlo**: qué deberías ver en la página o en la consola;
   - **pistas** en tres niveles, como en los laboratorios, y el **código del paso** oculto tras «Ver solución»;
   - una casilla **«Hecho»** que guarda el progreso en el navegador.
7. **Lo que aprendiste:** un resumen con enlaces a las lecciones.
8. **Llévalo más lejos:** dos o tres ideas para seguir sin guía.
9. Al final, el enlace de siempre para reportar un error y «Continúa con» el siguiente proyecto.

### 2.3 Cómo se llega

- El **botón «Proyectos»** de la navegación principal, con un diseño especial como el de Rayos X pero con su propio color. Mientras no exista la sección, va tachado, sin enlace y con un aviso «Próximamente» al pasar el mouse o al enfocarlo.
- Una invitación al final de la **última lección** del temario y del último Reto del motor.
- Un enlace desde la página de Rayos X.
- Cuando se publique, una tarjeta en la portada, como la de Rayos X.

## 3. Qué trae cada zip

```text
proyecto-inicial.zip
├── index.html      completo: estructura, textos y atributos data-* que usará el JavaScript
├── estilos.css     completo: incluye las clases de estado (.activo, .error, .oculto…)
├── app.js          esqueleto con los comentarios // PASO n que coinciden con la guía
├── datos/          si el proyecto los usa (JSON de ejemplo, imágenes)
└── LEEME.md        cómo abrirlo, qué hace cada archivo y el enlace a la guía

proyecto-final.zip
├── (los mismos archivos, con todo el JavaScript terminado)
└── LEEME.md        además: qué se puede mejorar (las ideas de «Llévalo más lejos»)
```

Reglas para todos los proyectos:

- **Sin dependencias ni herramientas** en los primeros proyectos: JavaScript del navegador y nada más. Las herramientas (npm, Vite, pruebas) entran recién en los últimos, porque son parte de lo que se enseña.
- Comentarios y nombres en español, con el mismo estilo que el curso.
- Diseño propio de cada proyecto, cuidado pero sencillo. Fondo oscuro, como el sitio, salvo que el proyecto pida otra cosa.
- Cada `// PASO n` del esqueleto coincide con un paso de la guía. El final es el inicial con todos los pasos resueltos, y nada más.

## 4. Cómo se arma en el repositorio

```text
proyectos/
└── 01-calculadora/
    ├── inicial/                 los archivos del zip inicial
    ├── final/                   los archivos del zip final
    └── pruebas.mjs              comprobaciones automáticas (ver 5)
src/content/proyectos/
└── calculadora.mdx              la guía paso a paso
src/pages/proyectos/
├── index.astro                  la cuadrícula bento
└── [slug].astro                 la página de cada proyecto
src/components/
├── BotonSeccion.astro           el botón de la navegación (ya existe, en modo «Próximamente»; lo comparte con Librerías)
└── PasoProyecto.astro           un paso: objetivo, archivo, comprobación, pistas, solución y «Hecho»
```

- **La colección `proyectos`** tiene este frontmatter: `numero`, `titulo`, `slug`, `resumen` (máx. 110 caracteres), `nivel`, `minutos`, `temas` (claves `seccion/tema` que se validan contra el temario, como el glosario), `tamano` (en el bento: `chico`, `mediano` o `grande`), `servidor` (si necesita un servidor local) y `publicado`.
- **Los zips se generan al construir**, no se guardan en git. Un script, `herramientas/empaquetar-proyectos.mjs`, o un hook `astro:build:done`, comprime `inicial/` y `final/` con una biblioteca pequeña, por ejemplo `fflate`, y los deja en `dist/proyectos/<slug>/`. Así el zip siempre coincide con el código del repositorio.
- **La guía en MDX** usa `<PasoProyecto>` para cada paso. El código de las soluciones se lee de `final/` por número de paso, con marcas `// PASO n` y `// FIN PASO n`, para no copiarlo a mano y que nunca se desincronice.

## 5. Verificación (como `verificar-ejercicios.mjs`)

`herramientas/verificar-proyectos.mjs`, con Playwright y Brave, como las pruebas que ya usamos:

1. Abre `final/index.html` y ejecuta `pruebas.mjs`: clics, teclado y lo que debe aparecer en la página y en la consola. Todo debe pasar.
2. Abre `inicial/index.html`: la página carga sin errores de JavaScript, pero las pruebas de los pasos fallan.
3. Comprueba que cada `// PASO n` del esqueleto tenga su paso en la guía, y al revés.
4. Comprueba que `final/` y `inicial/` tengan los mismos HTML y CSS, salvo en los pasos marcados como «toca el HTML» o «toca el CSS».
5. Comprueba que los temas del frontmatter existan en el temario.

## 6. Diseño

- La página sigue el sistema de siempre: pizarrón, tiza y fondo oscuro.
- **El color de la sección es el lila** (`--lila`), para distinguirla del azul de Rayos X y del amarillo de las acciones principales. El botón de la navegación y los acentos de la sección lo usan.
- **Bento:** una rejilla de 12 columnas con filas automáticas. Tarjetas chicas de 4 columnas, medianas de 6 y el proyecto final de 12 columnas, o de 8 columnas y 2 filas en pantallas anchas. El borde y el número toman la tiza del nivel: lima para Fácil, azul para Intermedio, naranja para Avanzado y lila para el proyecto final. Al pasar el mouse, la tarjeta se levanta un poco y su borde se aclara, como «Continúa con».
- **Los pasos** se parecen a los ejercicios: una tarjeta por paso con su número en óvalo de tiza y la etiqueta del archivo en Fira Code (`app.js`, `index.html`, `estilos.css`). El código de las soluciones va coloreado como en el resto del sitio.
- **Los botones de descarga** usan la letra de tiza y un ícono de caja. El de «inicial» es amarillo, porque es la acción principal. El de «final» es discreto.

## 7. Cobertura y criterios para elegir los proyectos

- Entre todos los proyectos deben tocarse **las secciones 0 a 16** del temario (la 17 habla de librerías y frameworks, que aquí no se usan). Cada proyecto declara sus temas en el frontmatter, y el verificador arma una tabla de cobertura para ver qué secciones quedan sin proyecto.
- Los proyectos son el lugar para **profundizar y para cubrir huecos** del curso que se entienden mejor construyendo. La lista de huecos está en [`COBERTURA.md`](COBERTURA.md): archivos, tiempo real, arrastrar y soltar, APIs del dispositivo, gráficos a fondo con Canvas y SVG, multimedia, accesibilidad, eventos propios, `contenteditable`, etc. Cada hueco que cubra un proyecto va en su bloque «Lo nuevo de este proyecto».
- **La dificultad sube de a poco:** proyectos fáciles y visuales al principio, uno o dos con servidor hacia el final y un proyecto final grande que junta varias secciones.
- **Proyectos con servidor:** se hacen con Node sin librerías siempre que se pueda. Por ejemplo, un chat con Server-Sent Events y `fetch` usa solo `node:http`. Si un proyecto necesita WebSocket del lado del servidor, se ofrece la versión con Deno o Bun, que lo traen incluido, y se explica que en Node hace falta la librería `ws`.
- **Si un proyecto usa una API que no funciona igual en todos los navegadores** (por ejemplo, File System Access, que es solo de Chromium), se avisa y se ofrece una alternativa que funcione en todos.

## 8. Fases

1. **Base:** la colección, las dos páginas, el bento, el componente de paso, el progreso, el empaquetado de zips y el verificador.
2. **Proyecto piloto:** el primero completo, para probar la experiencia y ajustar el formato de la guía.
3. **El resto**, de a uno, del más fácil al más difícil, cada uno verificado antes de publicarse.
4. **Lanzamiento:** el botón de la navegación pasa de «Próximamente» a enlace, se suma la tarjeta en la portada y las invitaciones, y se actualizan el README (con capturas), DESIGN.md y este plan.

## 9. Decisiones

**Tomadas (2026-11-23):**

- **Son 30 proyectos**, del más fácil al proyecto final (sección 10). Cubren todas las lecciones de las secciones 0 a 16, salvo las pocas que quedan solo en las lecciones (al final de la sección 10). La sección 17 («¿Y ahora qué?») no entra: los proyectos son solo con JavaScript, sin librerías ni frameworks.
- **Hay tres proyectos con servidor** (el chat, el acortador de enlaces y el blog por terminal), hechos con Node sin librerías. Nada con Bun ni con Deno.
- **El proyecto final usa herramientas:** Vite, Vitest, ESLint y TypeScript. Los demás van sin dependencias.
- Los huecos de `COBERTURA.md` ya se cubrieron con lecciones; los proyectos los profundizan.
- **Dos repositorios (2026-11-23).** El código de los proyectos vive en [`renzoov/domina-js-proyectos`](https://github.com/renzoov/domina-js-proyectos), con un README que tiene la tabla de los 30 y otro README por carpeta. En `domina-js` está como **submódulo** en `proyectos/`, para que las guías lean la solución de cada paso desde `final/`. Al cambiar un proyecto: commit y push en `domina-js-proyectos`, y después se actualiza el submódulo en `domina-js`.
- **Las demos se publican aparte**, en un proyecto propio de Cloudflare Pages conectado a `domina-js-proyectos` (publicado desde el 23-nov-2026), en `domina-js-proyectos.pages.dev/<carpeta>/final/`. La raíz del sitio redirige a la lista de proyectos del curso con un archivo `_redirects`. Al estar en otro dominio, su almacenamiento y sus Service Workers no se mezclan con el progreso del curso. Cada proyecto usa igual sus propias claves de almacenamiento. Los proyectos con servidor (28 y 29, y la parte B del 26) se muestran con un video o capturas.
- **Cada proyecto tiene su propio diseño**, nunca el pizarrón del sitio. Se elige en una ronda de direcciones visuales y queda en su `DESIGN.md`, dentro de su carpeta.

**Pendientes:**

- Si «Proyectos» aparece también en la barra lateral, debajo del temario.
- Cuál es el proyecto piloto.
- **Después de esta sección, una segunda: «Librerías».** Ya decidida: 10 proyectos con 24 librerías, en [`LIBRERIAS.md`](LIBRERIAS.md).

## 10. Lista de proyectos

**Origen de cada idea:** *propio* (idea nueva de este curso), *tuyo* (pedido del autor del sitio) o *mejorado* (la idea existe en [javascript100.dev](https://www.javascript100.dev/), de midudev, y aquí se hace más completa, muchas veces combinando dos o tres proyectos suyos en uno). No se copia ningún proyecto: cada uno tiene su propio diseño, sus pasos y sus temas.

### Fácil

**1. Generador de paletas** · *mejorado*
La barra espaciadora genera colores armónicos; se pueden fijar los que gustan y deshacer. Calcula el contraste WCAG de cada color, exporta variables CSS y, como paso extra, saca una paleta de una foto tuya.
Temas: números y operadores (HSL ↔ hex), arrays como pila para deshacer, eventos de teclado, URL y URLSearchParams (la paleta vive en la dirección), portapapeles, Canvas y `getImageData`.

**2. Temporizador Pomodoro** · *mejorado*
Bloques de trabajo y descanso que no se atrasan aunque la pestaña esté oculta.
Temas: timers y por qué `setInterval` se atrasa, el event loop, Page Visibility, notificaciones, Wake Lock, vibración, un pitido con Web Audio, `document.title` y guardar datos.

**3. Reto de mecanografía** · *mejorado*
Escribir un texto contra reloj; cuenta bien los acentos, la ñ, la ü y los signos de apertura (¿ ¡), aunque lleguen escritos de dos formas distintas en Unicode.
Temas: texto y Unicode (`Intl.Segmenter`), expresiones regulares, eventos de teclado, `performance.now()` para las palabras por minuto, un gráfico SVG del resultado y récords guardados.

**4. Relojes del mundo** · *mejorado*
Relojes analógicos en SVG, uno por ciudad elegida, que se reordenan arrastrando.
Temas: Temporal (con plan B en Date), `Intl.DateTimeFormat` y `Intl.supportedValuesOf`, trigonometría en SVG, `requestAnimationFrame`, arrastrar y soltar y guardar datos.

### Intermedio

**5. Tienda pequeña** · *tuyo*
Un catálogo de 30 a 40 productos, 10 por página, con la paginación en la URL (el botón Atrás funciona). Al agregar, el número del carrito sube sin recargar, también en otra pestaña. El carrito permite cambiar cantidades, tiene una vista rápida en un popover y termina con un pago simulado («Procesando…» y «¡Pago confirmado!»).
Temas: clases con campos privados (el carrito extiende `EventTarget`), eventos propios, Map, URLSearchParams y navegación, `Intl.NumberFormat`, formularios y validación, guardar datos y el evento `storage`, diálogos y la Popover API, async con estados de carga y `aria-live`.

**6. Explorador con scroll infinito** · *mejorado*
Un catálogo de obras de arte con la API abierta del Art Institute of Chicago (imágenes de dominio público), que carga más al llegar al final. Hace par con la tienda: paginación con botones frente a scroll infinito.
Temas: fetch, `Promise.allSettled`, IntersectionObserver, `<template>`, caché con Map, imágenes con carga diferida, un diálogo de detalle y errores con reintento.

**7. Buscador con autocompletado** · *mejorado*
Busca en Wikipedia mientras escribes. Es un combobox accesible de verdad, encuentra sin importar las tildes y resalta lo que coincide.
Temas: debounce con closures, AbortController, patrones asíncronos, `normalize()`, `RegExp.escape` (ES2025), caché con Map, navegación con las flechas y accesibilidad (`aria-activedescendant`).

**8. Notificaciones toast** · *mejorado*
Una pequeña librería propia, `<zona-toasts>`, que se reutiliza en otros proyectos. `await toast.mostrar()` termina cuando la persona lo cierra.
Temas: Web Components y Shadow DOM, eventos propios como API, ES Modules, Web Animations, `aria-live`, una cola con promesas, `Promise.withResolvers` (ES2024), deslizar para cerrar (Pointer Events) y template tags para escapar el HTML.

**9. Calendario con eventos** · *mejorado*
Un calendario mensual para anotar eventos, moverlos de día y exportarlos.
Temas: Temporal y Date, Intl (en qué día empieza la semana, los nombres de los meses), `Object.groupBy`, una grilla accesible con *roving tabindex*, `<dialog>` con formulario, IndexedDB, arrastrar y soltar, y exportar a `.ics` (Blob).

**10. Control de gastos con reactividad propia** · *mejorado*
Gastos en varias monedas, con gráfico y filtros que se combinan. El estado es un sistema reactivo hecho con Proxy, la idea de Vue y las signals.
Temas: Proxy y Reflect, descriptores, `queueMicrotask` para redibujar una sola vez, `Object.freeze` en desarrollo, currificación y composición de filtros, `Object.groupBy`, cambiar sin mutar (`toSorted`), `structuredClone` para deshacer, un gráfico SVG, Intl, tasas de cambio con `fetch` y caché, e importar y exportar CSV.

**11. Puzzle deslizante con tu foto** · *mejorado*
El clásico rompecabezas de 15 piezas, con tu propia imagen y un desorden que siempre tiene solución.
Temas: matrices con arrays (inversiones y paridad), archivos (`createObjectURL`), Canvas para cortar la imagen, animación FLIP con Web Animations, teclado y tacto (Pointer Events), cronómetro y récords.

**12. Dividir la cuenta** · *propio*
Cada persona del grupo anota lo que pagó, y la aplicación dice quién le debe a quién con la menor cantidad de transferencias. Se comparte un solo enlace, sin cuentas ni servidor.
Temas: `reduce`, `Object.groupBy` y Map para los saldos, montos en centavos y `Math.sumPrecise` (ES2026), `Intl.NumberFormat` e `Intl.ListFormat`, `CompressionStream` y base64url para guardar el estado en la URL, Web Share con plan B de portapapeles, formularios, import maps y un JSON de monedas importado con atributos de importación (sin bundler).

**13. Reserva de asientos** · *propio*
El mapa de una sala en SVG: eliges butacas, quedan apartadas 5 minutos y al confirmar se descarga la entrada. Si dos pestañas intentan el mismo asiento, solo una lo consigue.
Temas: SVG creado desde JavaScript, delegación de eventos, una grilla accesible con anuncios `aria-live`, composición de capacidades (accesible, preferencial) en lugar de herencia, métodos de Set (ES2025), timers, Web Locks y BroadcastChannel, la entrada en Canvas con `toBlob` e `Intl.DateTimeFormat`.

**14. Tarjetas de idiomas con voz** · *propio*
Mazos de vocabulario con repetición espaciada: cada tarjeta vuelve cuando estás por olvidarla. La aplicación pronuncia la palabra y te escucha decirla.
Temas: Temporal para la próxima repetición, `SpeechSynthesis` y `SpeechRecognition` con plan B, Symbols y el protocolo iterable (el `Mazo` es iterable con `*[Symbol.iterator]()`), generadores, `Intl.Collator`, importar CSV (archivos y regex) e IndexedDB.

**15. Recetario en modo cocina** · *propio*
Recetas que escalan las porciones y un modo cocina con la pantalla siempre encendida, temporizadores por paso y lectura en voz alta.
Temas: fracciones y `Intl.NumberFormat` con unidades, temporizadores que corren a la vez (promesas y AbortController), Wake Lock, `SpeechSynthesis`, la lista de compras con `Object.groupBy` y una hoja de estilos para imprimir.

**16. Bitácora de paseos con GPS** · *propio*
Registra un paseo o una salida en bicicleta y dibuja el recorrido, sin librerías de mapas. Funciona sin conexión y se instala en el teléfono.
Temas: `geolocation.watchPosition`, la fórmula de Haversine, Wake Lock, el recorrido en SVG con ResizeObserver, `Intl.NumberFormat` con unidades, Temporal, IndexedDB y `navigator.storage.persist()`, exportar a GPX con un template tag y un Service Worker con manifest.

### Avanzado

**17. Galería SPA con compresor** · *mejorado* (junta tres proyectos de javascript100.dev: galería, router y compresor)
Una galería de una sola página con su propio router y transiciones animadas. Las fotos se suben arrastrándolas, se comprimen sin salir del navegador y se guardan.
Temas: router propio (History y Navigation API, `URLPattern`), View Transitions, `import()` por ruta, el foco al cambiar de página, un Web Worker con `OffscreenCanvas` y `toBlob` en WebP, comparar antes y después, e IndexedDB.

**18. Editor de Markdown** · *mejorado*
Un editor con vista previa, varios documentos, abrir y guardar archivos, y el parser escrito por ti.
Temas: expresiones regulares, recursión y un generador de tokens, sanear el HTML (XSS) y Trusted Types, vista partida con el scroll sincronizado, la barra de formato con `setRangeText`, IndexedDB, File System Access con plan B, contador de palabras y un Web Worker para documentos grandes.

**19. Bóveda de secretos** · *mejorado* (junta el generador de contraseñas y los mensajes cifrados)
Genera contraseñas seguras y cifra mensajes que se comparten por un enlace.
Temas: `getRandomValues` y el cálculo de entropía, Web Crypto (AES-GCM y PBKDF2), TextEncoder, base64 de Uint8Array (ES2026, con plan B), el mensaje cifrado en el `#` de la URL, portapapeles que se borra solo y datos binarios.

**20. Visor de JSON gigante** · *mejorado* (junta el visor de JSON y la lista virtual)
Abre un JSON de cualquier tamaño, lo muestra como un árbol que aguanta 100.000 nodos, busca y copia la ruta de cada dato. Señala la línea exacta de un error de sintaxis.
Temas: JSON, recursión, generadores e iterator helpers, Web Workers, rendimiento (lista virtual), accesibilidad (`role="tree"`), archivos y `Object.groupBy` para las estadísticas.

**21. Grabador de pantalla y cámara** · *mejorado*
Graba la pantalla con tu cámara en un recuadro y el micrófono, y descarga el video.
Temas: `getDisplayMedia` y `getUserMedia`, `MediaRecorder`, Canvas con `captureStream`, mezcla de audio con Web Audio, Blob y descarga, errores de permisos y `using` para apagar todo al terminar.

**22. Editor de subtítulos** · *propio*
Cargas un video, escribes los subtítulos sobre una línea de tiempo y descargas el archivo `.vtt`.
Temas: `HTMLMediaElement` y la API de pistas de texto (`TextTrack`, `VTTCue`), Pointer Events para la línea de tiempo, el formato WebVTT con regex, `contenteditable` con Selection y Range (negrita y cursiva), atajos J, K y L, Media Session, Fullscreen y descarga con Blob.

**23. Auditor de accesibilidad** · *propio*
Un script que se pega en cualquier página y la revisa: imágenes sin `alt`, botones sin nombre, títulos fuera de orden, contraste insuficiente. Marca cada problema y arma un informe.
Temas: `TreeWalker`, `getComputedStyle` y el contraste de WCAG, clases con herencia (`Regla` → `ReglaContraste`, `ReglaAlt`…), Shadow DOM, MutationObserver y exportar el informe en JSON.

**24. La aplicación rota** · *propio*
Una aplicación que funciona mal a propósito. Hay que encontrar cada problema con las DevTools y arreglarlo.
Temas: depurar con DevTools (puntos de interrupción condicionales, paneles Rendimiento y Memoria), consola a fondo, fugas de memoria (listeners con `AbortController`, caché con `WeakMap`), alternar lecturas y escrituras del DOM, promesas rechazadas sin atrapar, `this` perdido en un callback, un `Array.prototype` modificado, la zona muerta temporal, un script que bloquea la carga y medir cada arreglo con `performance.mark`.

**25. Terminal en el navegador** · *propio*
Una terminal con `ls`, `cd`, `mkdir`, `cat`, `chmod`, redirecciones, tuberías, historial y autocompletado. Los archivos quedan en el sistema de archivos privado del navegador.
Temas: OPFS (`navigator.storage.getDirectory()`) e iteración asíncrona, un intérprete de comandos con regex, generadores para las tuberías, operadores bit a bit (permisos de `chmod`), `URL` para las rutas, `localStorage`, accesibilidad y errores con mensajes claros.

**26. Chat en tiempo real** · *mejorado* (la parte B es propia)
Parte A: chat entre pestañas, sin servidor. Parte B: el mismo chat con un servidor Node sin librerías.
Temas: BroadcastChannel y Web Locks (una pestaña líder), `node:http` y Server-Sent Events, `node:sqlite` para el historial, el event loop de Node, reconexión, «está escribiendo…», `Intl.RelativeTimeFormat` y seguridad (límite de mensajes, texto escapado).

**27. Transferencia de archivos entre dispositivos** · *propio*
Pasar un archivo del teléfono a la computadora directamente, sin subirlo a ningún servidor.
Temas: WebRTC (`RTCDataChannel`), el archivo en trozos (`File.slice`, `ArrayBuffer`) con una cabecera binaria en `DataView`, progreso, un hash SHA-256 con `crypto.subtle` y la presentación entre dispositivos con un código o con el servidor del chat.

**28. Acortador de enlaces con estadísticas** · *propio*
Un servidor Node que acorta enlaces, redirige y cuenta los clics.
Temas: `node:http` y redirecciones, `node:sqlite`, validar URLs (que nadie lo use para engañar), cookies `HttpOnly` y `SameSite`, CSP y encabezados de seguridad, `--watch` y `--env-file`, un gráfico SVG de los clics y pruebas con `node:test`.

**29. Blog estático por terminal** · *propio*
Un comando que convierte una carpeta de archivos Markdown en un sitio, reutilizando el parser del proyecto 18.
Temas: programas de línea de comandos (`parseArgs`, `styleText`), archivos y streams, `for await`, `worker_threads` para las imágenes, el modelo de permisos de Node (`--permission`), ES Modules, pruebas con `node:test`, `npm link` y el campo `bin`.

### Proyecto final

**30. Kanban offline** · *mejorado*
Un tablero de tareas instalable que funciona sin conexión.
Temas: Vite, TypeScript, Vitest y ESLint, organizar un proyecto, Web Components, arrastrar y soltar con su alternativa de teclado, IndexedDB, Service Worker y manifest, sincronización entre pestañas, deshacer e importar y exportar.

### Origen

13 son ideas nuevas: uno pedido por el autor (5) y 12 propias (12–16, 22–25, 27–29). Los otros 17 parten de una idea de javascript100.dev y la amplían; el 26 suma una parte propia con servidor.

### Cobertura del temario (secciones 0 a 16)

| Sección | Proyectos |
|---|---|
| 0 Antes de empezar | todos (el entorno y las DevTools, de fondo) |
| 1 Fundamentos | 1, 3, 12, 14, 25 |
| 2 Control de flujo y errores | 5, 20, 21, 24, 25 |
| 3 Funciones | 7, 10, 24 |
| 4 Por dentro (event loop, closures, recursión, memoria) | 2, 7, 18, 20, 24 |
| 5 Objetos | 10, 20, 24 |
| 6 Clases | 5, 8, 13, 23 |
| 7 Colecciones y datos | 9, 10, 11, 12, 13, 19, 27 |
| 8 Iteradores y generadores | 14, 18, 20, 25, 29 |
| 9 Asincronía | 5, 6, 7, 8, 10, 15 |
| 10 Módulos | 8, 12, 17, 29, 30 |
| 11 Biblioteca estándar | 2, 3, 4, 7, 9, 12, 21, 26 |
| 12 Metaprogramación | 8, 10, 14 |
| 13 Navegador | todos |
| 14 Servidor | 26, 28, 29 |
| 15 Herramientas | 24, 28, 29, 30 |
| 16 Novedades | 4, 7, 8, 9, 10, 12, 13, 19, 20, 21 |

**Quedan solo en las lecciones, a propósito:**

- WebSocket. Node no trae servidor de WebSocket; irá en la sección «Proyectos con librerías», con `ws`.
- La programación precisa del audio (`AudioContext.currentTime`) y la Gamepad API.
- `break` y `continue` con etiquetas, MessageChannel, SharedArrayBuffer y Atomics. SharedArrayBuffer además exige encabezados de aislamiento.
- Decorators (todavía son una propuesta), CommonJS, y Deno y Bun.
