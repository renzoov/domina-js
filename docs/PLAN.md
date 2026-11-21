# Plan — domina-js

Web pública y gratuita para aprender JavaScript en español, paso a paso, con visualizadores interactivos para los conceptos que no se ven (pila de llamadas, event loop, scope…).

- Producto: ver `PRODUCT.md`.
- Stack: Astro 7 + MDX + JS puro (sin React), sitio estático. Despliegue probable: Cloudflare Pages.
- v1: portada + temario completo (temas futuros como "próximamente") + la lección **La pila de llamadas**.

---

## 1. El temario

### Cómo se armó

- **Fuente de conocimiento:** el índice de *JavaScript: The Definitive Guide, 7.ª ed.* (Flanagan, 2020). Lo usé para no dejar huecos, no para copiar su orden ni sus títulos. El libro llega hasta ES2020.
- **Puesto al día a 2026:** todo lo que el lenguaje y la plataforma sumaron después (ES2021 → ES2026), más lo que hoy es práctica normal y el libro no trata:
  - el event loop en detalle,
  - `AbortController`,
  - `structuredClone`,
  - Web Components,
  - View Transitions,
  - Node moderno, Deno y Bun,
  - Vite, Vitest y TypeScript.
- **Orden propio:** el libro es una referencia que va del lenguaje a la plataforma. Aquí el orden es de aprendizaje, y la sección "Cómo se ejecuta JS por dentro" llega temprano porque explica todo lo demás.

### Marcas de cada tema

- 👁 lleva visualizador paso a paso.
- 🆕 incluye novedades posteriores al libro (ES2021+ o APIs nuevas), con la edición indicada.
- ⏳ todavía es una propuesta (no está terminada en TC39). Se enseña marcando su estado.

Lo que TC39 ya terminó (Stage 4) pero se publica en **ES2027** (como Temporal y `using`) no lleva ⏳: se enseña normal, con la insignia 🆕 ES2027 y una nota de compatibilidad (Baseline).

### Secciones y temas

**0. Antes de empezar**
1. Qué es JavaScript hoy: ECMAScript, TC39, una edición por año, motores y runtimes 🆕
2. Tu entorno: consola de DevTools, Node.js y editor
3. Tu primer programa
4. Cómo leer documentación: MDN y la etiqueta *Baseline* de compatibilidad 🆕

**1. Fundamentos del lenguaje**
1. Sintaxis básica: sentencias, comentarios, punto y coma (ASI), identificadores, Unicode
2. Variables: `let`, `const` y por qué ya no `var`
3. Valores primitivos y objetos: copia por valor y por referencia 👁
4. Números: el problema de `0.1 + 0.2`, `BigInt`, separadores `1_000_000` (ES2021) y `Math.sumPrecise` (ES2026) 🆕
5. Texto: strings, template literals, `at()`, `replaceAll` (ES2021), `isWellFormed` (ES2024) 🆕
6. Booleanos, *truthy/falsy*, `null` y `undefined`
7. Symbols
8. Conversión de tipos: coerción, `==` vs `===`
9. Operadores: lógicos, `??`, `?.` y asignación lógica `??=`, `||=`, `&&=` (ES2021) 🆕

**2. Control de flujo y errores**
1. Condicionales: `if`, `switch`, ternario
2. Bucles: `for`, `while`, `for…of`, `for…in`, y cuándo usar cada uno
3. `break`, `continue` y etiquetas
4. Errores y excepciones: `try/catch/finally`, `throw`, `Error` con `cause` (ES2022), `AggregateError` (ES2021), `Error.isError` (ES2026) 🆕

**3. Funciones**
1. Declaraciones, expresiones y funciones flecha
2. Parámetros: valores por defecto, *rest* y desestructuración
3. Funciones como valores: callbacks y funciones de orden superior
4. `this`: cómo se decide su valor (`call`, `apply`, `bind`, flechas) 👁
5. Estilo funcional: funciones puras, composición, currying

**4. Cómo se ejecuta JS por dentro ★**
1. Motor y runtime: qué hace V8, el JIT y por qué hay un solo hilo
2. **La pila de llamadas** 👁 ← *lección de la v1*
3. Contextos de ejecución y hoisting, incluida la *Temporal Dead Zone* 👁
4. Scope y cadena de scopes 👁
5. Closures 👁
6. Recursión y *stack overflow* 👁
7. Memoria y recolector de basura: heap, alcanzabilidad, `WeakMap`, `WeakRef` y `FinalizationRegistry` (ES2021) 👁 🆕

**5. Objetos**
1. Objetos literales: atajos, propiedades calculadas, getters y setters
2. Recorrer objetos: `Object.keys/entries/fromEntries`, `Object.hasOwn` (ES2022) 🆕
3. Desestructuración y *spread*
4. Copias superficiales y profundas: `structuredClone` 👁 🆕
5. JSON: `parse`/`stringify` e importar JSON como módulo (ES2025) 🆕
6. Prototipos y la cadena de prototipos 👁
7. Inmutabilidad: `freeze`, `seal` y descriptores de propiedad

**6. Clases**
1. Sintaxis `class`: qué hay debajo (prototipos)
2. Campos públicos y privados `#`, `#x in obj` y bloques `static` (ES2022) 🆕
3. Herencia: `extends` y `super`
4. Composición frente a herencia; mixins
5. Decorators ⏳: propuesta en Stage 2.7, y el uso que ya tienen en TypeScript

**7. Colecciones y datos**
1. Arrays: crear, leer y modificar; `at()` (ES2022) 🆕
2. Métodos de array: `map`, `filter`, `reduce`, `find`, `flat`, `flatMap`… 👁 (`reduce`)
3. Cambiar sin mutar: `toSorted`, `toReversed`, `toSpliced`, `with`, `findLast` (ES2023) 🆕
4. Agrupar: `Object.groupBy` y `Map.groupBy` (ES2024) 🆕
5. `Map` y `Set`: operaciones de conjuntos `union`, `intersection`, `difference`… (ES2025) y `getOrInsert` / `getOrInsertComputed` (*upsert*, ES2026) 🆕
6. `WeakMap` y `WeakSet`
7. Datos binarios: `ArrayBuffer`, typed arrays, buffers redimensionables (ES2024), `Float16Array` (ES2025), base64/hex en `Uint8Array` (ES2026) 🆕

**8. Iteradores y generadores**
1. El protocolo iterable 👁
2. Generadores y `yield` 👁
3. *Iterator helpers*: `map`, `filter`, `take`, `drop`, `Iterator.from` (ES2025) 🆕. Lo que llega en ES2027: dividir en bloques (*chunking*), `includes`, `join` y recorrer varios iteradores a la vez (`Iterator.zip`) 🆕
4. Iteración asíncrona: `for await`, generadores asíncronos y `Array.fromAsync` (ES2026) 🆕

**9. Asincronía ★**
1. Si JS tiene un solo hilo, ¿cómo espera? (continúa la lección de la pila)
2. El event loop 👁: pila + Web APIs + cola de tareas + cola de microtareas
3. Callbacks y el "callback hell"
4. Promesas: estados, `then/catch/finally` 👁
5. Combinadores: `all`, `allSettled`, `race`, `any` (ES2021), `Promise.withResolvers` (ES2024), `Promise.try` (ES2025) 🆕
6. `async`/`await`, manejo de errores y `await` de nivel superior (ES2022) 🆕
7. Microtareas y macrotareas: `queueMicrotask`, `setTimeout`, `requestAnimationFrame` 👁
8. Cancelar: `AbortController`, `AbortSignal.timeout` y `AbortSignal.any` 🆕
9. Patrones: concurrencia limitada, reintentos, debounce y throttle

**10. Módulos**
1. ES Modules: `import`/`export`, `import()` dinámico e `import.meta`
2. CommonJS frente a ESM, y `require(esm)` en Node 🆕
3. Import maps y atributos de importación `with { type: "json" }` (ES2025) 🆕
4. Organizar un proyecto en módulos

**11. Biblioteca estándar**
1. Fechas: los problemas de `Date` y la API **Temporal** (terminada en TC39, se publica en ES2027; ya llega a los navegadores) 🆕
2. Expresiones regulares: grupos con nombre, flags `d` (ES2022) y `v` (ES2024), `RegExp.escape` (ES2025), modificadores 🆕
3. Internacionalización con `Intl`: números, fechas, tiempo relativo, listas, plurales y `Segmenter` 🆕
4. Unicode y emojis: normalización y contar "caracteres" de verdad
5. URL y `URLSearchParams`
6. Timers y la consola a fondo
7. Gestión explícita de recursos: `using`, `await using` y `Symbol.dispose` (ES2027) 🆕

**12. Metaprogramación**
1. Descriptores y atributos de propiedades
2. Symbols conocidos: `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.asyncIterator`…
3. `Proxy` y `Reflect` 👁 (las trampas)
4. Template tags

**13. JavaScript en el navegador**
1. Cómo carga una página: `<script>`, `defer`, `async`, `type="module"` 👁
2. El DOM: seleccionar, crear y modificar
3. Eventos: captura, burbujeo y delegación 👁
4. Formularios y validación
5. Estilos y animación: `classList`, Web Animations API y View Transitions API 🆕
6. Observers: `IntersectionObserver`, `ResizeObserver`, `MutationObserver` 🆕
7. `fetch` y HTTP: `Request`, `Response`, CORS y streams
8. Guardar datos: `localStorage`, IndexedDB, Cache API y cookies
9. Navegación: History API y Navigation API 🆕
10. Web Workers y mensajería: `postMessage` y `BroadcastChannel`
11. Service Workers y PWA 🆕
12. Web Components: custom elements y shadow DOM 🆕
13. Gráficos: Canvas y SVG desde JS
14. Seguridad: XSS, CSP, Trusted Types y Web Crypto 🆕

**14. JavaScript en el servidor**
1. Node.js hoy: ESM, prefijo `node:`, `fetch` nativo, `--watch`, `--env-file` 🆕
2. El event loop de Node y sus fases 👁
3. Archivos y streams
4. Un servidor HTTP desde cero
5. Procesos e hilos: `child_process` y `worker_threads`
6. Deno y Bun: otros runtimes 🆕
7. Seguridad en Node: el modelo de permisos 🆕

**15. Herramientas y ecosistema**
1. npm, pnpm, `package.json`, lockfiles y seguridad de dependencias 🆕
2. Vite y el bundling moderno 🆕
3. Lint y formato: ESLint (*flat config*), Prettier y Biome 🆕
4. Testing: Vitest y `node:test` 🆕
5. TypeScript para quien ya sabe JS: tipos, JSDoc y ejecutar `.ts` directo en Node 🆕
6. Depurar con DevTools: breakpoints, perfiles de rendimiento y fugas de memoria

**16. Novedades por edición** (se actualiza cada año)
- Una página por edición, de **ES2021 a ES2026**.
- Una página para **ES2027**, ya terminada en TC39: Temporal, `using`, más *iterator helpers* y `Atomics.pause`.
- Una página "lo que viene" con propuestas en curso: Decorators (Stage 2.7) y, en Stage 3, `import defer`, importar texto (*Import Text*) y *source phase imports*.
- Cada página enlaza a los temas que tratan esas novedades. Se arma sola a partir del campo `es` de cada lección (sección 2).

**Fuera de alcance por ahora:** frameworks (React, Vue, Svelte, JSX), backend avanzado y bases de datos. Pueden ser secciones más adelante.

En total son unos 105 temas. No se escriben todos de una vez: el sitio los muestra como "próximamente" y se publican de a uno.

### Orden sugerido para escribir lecciones

Primero el "núcleo invisible", que es donde los visualizadores aportan más:

1. 4.2 Pila de llamadas (v1)
2. 9.1 y 9.2 Event loop
3. 4.3 a 4.6 Hoisting, scope, closures y recursión
4. 9.4 a 9.7 Promesas y microtareas
5. 3.4 `this`
6. 5.6 Prototipos

Después, las secciones 0 a 3 completas, para quien empieza de cero.

---

## 2. Arquitectura técnica

- **Contenido:** content collections de Astro.
  - `src/content/secciones/*.json`: `titulo`, `orden`, `descripcion`.
  - `src/content/lecciones/*.mdx`, con este frontmatter:
    - `titulo`, `seccion`, `orden`;
    - `estado` (`disponible` o `proximamente`);
    - `minutos`, `resumen`;
    - `es` (edición que introduce las novedades: `2021`, `2022`…);
    - `visualizador` (verdadero o falso);
    - `enCamino` (verdadero o falso; es la marca ⏳).
  - Integración `@astrojs/mdx`.
- **Rutas:**
  - `/`
  - `/temario`
  - `/[seccion]/[tema]`, por ejemplo `/como-se-ejecuta-js/pila-de-llamadas`
  - `/novedades/[edicion]`
- **`LessonLayout`:**
  - Barra lateral con secciones y temas, con el estado de cada uno.
  - Índice "En esta lección".
  - Indicador "Lección X de N".
  - Enlaces Anterior/Siguiente.
  - Enlace "¿Encontraste un error?".
- **`StepVisualizer.astro`**, la pieza central:
  - Funciona con datos: recibe el código y una lista de pasos, por ejemplo `{ lineas, pila, consola, colas, texto }`.
  - Paneles configurables: v1 trae Call Stack y Consola. Para el event loop se suman Web APIs, Cola de tareas y Microtareas sin reescribir el componente.
  - Controles: Anterior / Siguiente / Reiniciar, flechas ← →, un indicador de paso clicable y "Paso N de M".
  - Accesibilidad: `aria-live` en la explicación, foco visible y animaciones de apilar y desapilar que respetan `prefers-reduced-motion`.
- **Componentes de apoyo:** código con Shiki, `Callout` (consejo, cuidado, error común), insignias 🆕 ES20XX y ⏳, y `Próximamente`.

## 3. La lección v1: "La pila de llamadas"

1. **Un solo hilo:** qué significa que JS haga una cosa a la vez.
2. **Qué es una pila (LIFO):** el último en entrar es el primero en salir, con la analogía de una pila de platos.
3. **Visualizador** con el ejemplo `saludar` / `mostrar`, en 8 pasos:
   1. `mostrar()` entra a la pila.
   2. Se encuentra `saludar("Mundo")`.
   3. `saludar()` se apila y `mostrar()` queda suspendida.
   4. Se ejecuta el `return`.
   5. `saludar()` sale de la pila y `msg = "Hola, Mundo!"`.
   6. `console.log(msg)` entra a la pila.
   7. Imprime en la consola y sale.
   8. `mostrar()` termina y la pila queda vacía.
4. **Stack overflow:** un segundo visualizador con una recursión sin caso base, que termina en `RangeError: Maximum call stack size exceeded`.
5. **"Si es de un solo hilo, ¿cómo espera un `setTimeout`?":** puente al event loop (próximamente).
6. **Resumen**.
7. **Ejercicios** (formatos de la sección 4.3):
   - Sé el motor: apilar y desapilar `a()` → `b()` → `c()`.
   - Ordena la salida: los `console.log` de funciones anidadas.
   - Detective: un stack trace de `RangeError`.
   - Laboratorio: `cuentaAtras(n)` con caso base, y luego "Mira tu solución".

Los dos visualizadores de la lección ya traen línea de tiempo, gráfico de profundidad y 2–3 paradas de "Predice antes de ver".

## 4. Visualizadores y ejercicios propios

Referencia revisada: aprenderust.dev usa diagramas que avanzan paso a paso y ejercicios con este formato: editor, botón Ejecutar, salida esperada, tests ocultos, pista de una mascota y "ver solución". **No vamos a repetir ese formato.** Lo nuestro parte de una ventaja que Rust no tiene en la web: **JavaScript se ejecuta en el propio navegador del lector**. El sitio puede ejecutar código de verdad y mostrar lo que hace el motor por dentro, sin servidor.

Sin mascota: aquí el protagonista es *el motor*.

### 4.1 El visualizador: tres capas propias

1. **Línea de tiempo con barra deslizable**, en lugar de solo "Siguiente".
   - Cada paso es una marca en una barra; se puede arrastrar para ir hacia adelante o hacia atrás, o reproducir a una velocidad elegida.
   - Las marcas tienen forma según el evento: *entra a la pila*, *sale de la pila*, *imprime*, *encola*.
   - Así se lee la ejecución entera de un vistazo.
2. **Gráfico de profundidad de la pila**: mientras avanzas, se dibuja una gráfica de "llamas" (alto = profundidad de la pila, ancho = tiempo).
   - Es el mismo tipo de gráfico que usa DevTools en la pestaña Performance.
   - Al terminar la lección, el lector ya sabe leer esa herramienta real.
   - En recursión, la gráfica muestra la "montaña"; en stack overflow, la montaña que nunca baja.
3. **"Predice antes de ver"**: en los pasos clave, el visualizador se detiene y pregunta, por ejemplo:
   - "¿Qué entra a la pila ahora?"
   - "¿Qué imprime la consola?"

   El lector toca su respuesta en el panel mismo y luego se revela el paso. Predecir antes de ver es lo que más ayuda a fijar un concepto, y el sitio guarda cuántas acertaste.

### 4.2 Modo Rayos X: tu propio código, visualizado

Esta es la pieza más original.

- **Qué hace:** el lector edita el código del ejemplo, o escribe el suyo, y pulsa **Rayos X**. El visualizador genera los pasos solo: pila, scopes, consola y colas del event loop.
- **Cómo funciona:** el código se analiza con Acorn y se ejecuta paso a paso con un intérprete instrumentado en un Web Worker, con límite de pasos y de tiempo para que un bucle infinito no congele la página.
- **Alcance:**
  - Se empieza por un subconjunto de JS: funciones, variables, condicionales, bucles, `console.log`.
  - Luego se suman `setTimeout` y promesas para el event loop.
  - Si el código usa algo que todavía no está soportado, se dice claramente qué es.
- **Por qué importa:** las lecciones dejan de ser un ejemplo fijo; cada duda del lector ("¿y si llamo a otra función aquí?") se puede probar en el momento.

### 4.3 Ejercicios: seis formatos, no solo "escribe y ejecuta"

Cada lección mezcla los formatos que tienen sentido para su tema:

| Formato | Qué hace el lector | Ejemplo con la pila de llamadas |
|---|---|---|
| **Sé el motor** | Hace el trabajo del motor: arrastra marcos a la pila y los saca, o mueve tareas a las colas. El sitio valida cada movimiento. Tiene alternativa con teclado. | Apilar y desapilar en orden las llamadas de `a()` → `b()` → `c()` |
| **Ordena la salida** | Ordena tarjetas con las líneas que imprime la consola | Orden de los `console.log` en funciones anidadas (y en el event loop: síncrono, microtareas, timers) |
| **Detective** | Recibe un error real con su *stack trace*, toca la línea culpable y luego la corrige | Leer `RangeError: Maximum call stack size exceeded` y encontrar la recursión sin caso base |
| **Rómpelo** | Al revés que un ejercicio normal: tiene código que funciona y debe modificarlo para provocar un error concreto | Hacer que el código desborde la pila, o dispare un error de TDZ |
| **Laboratorio** | Escribe código real en un editor. Los tests son una **lista visible** que se pone en verde mientras escribe (no tests ocultos) | Escribir `cuentaAtras(n)` recursiva, con caso base |
| **Mira tu solución** | Después de resolver un laboratorio, pasa su propio código por Rayos X y ve su pila y su gráfica, junto a la del ejemplo | Comparar la "montaña" de su recursión con la del ejemplo |

- **Pistas:** tres niveles que se piden de a uno.
  1. Una pregunta que orienta.
  2. El concepto que falta.
  3. La línea donde mirar.

  La solución completa recién aparece después de intentarlo, y viene explicada paso a paso en el visualizador, no como texto de solo lectura.
- **Al final de cada sección:** un **"Reto del motor"** (no un examen), que mezcla los formatos de toda la sección con preguntas de predecir.
- **Progreso:** se guarda en el navegador (localStorage): temas leídos, ejercicios resueltos y aciertos al predecir. El temario lo muestra como un mapa. No hay cuentas ni certificados en esta etapa.

### 4.4 Piezas técnicas

- **Editor:** CodeMirror 6, liviano y accesible, cargado solo en las páginas que lo usan.
- **Ejecución:**
  - El código del lector corre en un Web Worker o un iframe `sandbox`, con tiempo máximo y la consola capturada.
  - Nunca corre en la página principal.
- **Tests de laboratorio:** funciones de verificación escritas por lección; cada una tiene un texto en español que se muestra como ítem de la lista.
- **Datos:**
  - Los ejercicios viven como datos en `src/data/ejercicios/` (un archivo `.ts` por sección), con su enunciado, pistas, solución y verificaciones; cada lección los lista en su frontmatter (`ejercicios`) y los coloca con los componentes de `src/components/ejercicios/`.
  - Crear un ejercicio nuevo es agregar un objeto de datos, sin tocar los componentes.
- **Accesibilidad:**
  - Todo lo que se arrastra se puede hacer también con teclado (seleccionar y mover).
  - Las predicciones y los resultados se anuncian con `aria-live`.

## 5. Diseño con impeccable

- **Modos:** las lecciones y el temario son de lectura (*Read*): importan la claridad, la navegación y leer con comodidad. La portada sirve para convencer al visitante (*Persuade*): muestra el visualizador funcionando en la primera pantalla, no un hero genérico.
- **Estilo visual:** todavía no hay uno. Se elige al empezar, con la página de decisión de impeccable. No se copia aprenderust.dev ni el look de Claude Desktop.
- **Cómo se construye:** directo en código, porque no hay generación de imágenes. La ambición queda escrita en el brief de diseño (*direction contract*).
- **Al terminar:**
  - Capturas en escritorio y móvil.
  - El detector de impeccable.
  - Una revisión independiente (finish reviewer).
  - `DESIGN.md` generado a partir de lo construido.

## 6. Fases

1. **Estilo visual:** elegir la dirección visual y escribir el brief de diseño.
2. **Base:** MDX, colecciones, el temario completo de la sección 1 cargado como datos, layouts y barra lateral.
3. **Visualizador:** `StepVisualizer` con:
   - pila y consola,
   - línea de tiempo deslizable,
   - gráfico de profundidad,
   - paradas de "Predice antes de ver",
   - teclado y accesibilidad.
4. **Ejercicios:** el motor de ejercicios con Sé el motor, Ordena la salida, Detective y Laboratorio (con CodeMirror y ejecución en Worker), más pistas en tres niveles y progreso en localStorage.
5. **Lección:** "La pila de llamadas" completa, con sus dos visualizadores y sus ejercicios.
6. **Portada:** con el visualizador funcionando en la primera pantalla.
7. **Revisión:** capturas, detector, revisión independiente y `DESIGN.md`.
8. **Modo Rayos X:**
   - el intérprete instrumentado, empezando por el subconjunto de JS;
   - "Mira tu solución";
   - el formato Rómpelo.
9. **Después:**
   - buscador (Pagefind),
   - glosario,
   - páginas de novedades,
   - "Reto del motor" por sección,
   - despliegue en Cloudflare Pages,
   - la lección del event loop (Rayos X con colas).

## Notas de verificación

- Las ediciones de cada novedad se comprueban contra la tabla de *finished proposals* de TC39 al escribir cada lección.
Verificado el 2026-11-20 contra `tc39/proposals` (*finished-proposals* y README):

- **ES2026:** upsert (`Map.getOrInsert`), base64/hex en `Uint8Array`, `Math.sumPrecise`, `Error.isError` y `Array.fromAsync`.
- **ES2025:** `RegExp.escape`, Float16, `Promise.try`, *iterator helpers*, JSON modules, import attributes, modificadores de RegExp y métodos nuevos de `Set`.
- **ES2027 (terminadas):** Temporal, gestión explícita de recursos (`using`), *iterator chunking*, `Iterator.includes` y `join`, recorrer iteradores a la vez y `Atomics.pause`.
- **Decorators:** Stage 2.7, no terminada.
- **ES2021–ES2024:** verificado el 2026-11-21 fila por fila (24 propuestas). Las páginas de novedades las cubren todas y cada edición citada en las lecciones coincide. Se agregaron los temas que faltaban: símbolos como claves débiles (WeakMap y WeakSet), hashbang (Node.js hoy) y `Atomics.waitAsync` (Web Workers), además de las marcas de edición que faltaban en el temario.
