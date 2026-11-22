# domina-js

**Aprende JavaScript viendo lo que hace el motor.** Un curso gratis, en español y sin cuentas: lecciones cortas, un pizarrón que avanza paso a paso y ejercicios que se corrigen solos. Va de cero a cómo funciona JavaScript por dentro, al día con 2026.

**👉 [domina-js.pages.dev](https://domina-js.pages.dev)**

![Portada de domina-js: el título «Aprende JavaScript viendo lo que hace el motor» junto a un pizarrón con código y la pila de llamadas](docs/capturas/portada.webp)

| | |
|---|---|
| **17 secciones** | de «Antes de empezar» a las novedades de cada edición de ECMAScript |
| **111 lecciones** | todas publicadas |
| **400 ejercicios** | con corrección automática y progreso guardado en el navegador |
| **34 pizarrones** | visualizadores paso a paso de la pila, los scopes, la memoria y el event loop |

## Qué lo hace distinto

### Un pizarrón que muestra lo invisible

Cada tema difícil trae un visualizador: el código a la izquierda, con la línea que se ejecuta subrayada en amarillo, y a la derecha lo que el motor tiene en ese momento (pila de llamadas, variables, consola, colas del event loop). Avanzas con «Siguiente» o con las flechas del teclado, y en algunos pasos el pizarrón te pide que **predigas** qué viene antes de mostrártelo.

![Lección «La pila de llamadas»: el pizarrón en el paso 4, con saludar() encima de mostrar() en la pila y una pregunta para predecir](docs/capturas/leccion-visualizador.webp)

![Lección «El event loop»: la pila ya vacía y el callback de setTimeout esperando en la cola de tareas](docs/capturas/event-loop.webp)

### Ejercicios que no son solo «escribe y ejecuta»

Al costado de cada lección hay un pizarrón de práctica con varios formatos:

- **Sé el motor:** haces tú el trabajo del motor, apilando y desapilando llamadas en el orden correcto.
- **Ordena la salida:** ordenas las líneas que imprimiría la consola.
- **Detective:** recibes un error real con su *stack trace*, encuentras la línea culpable y eliges el arreglo.
- **Laboratorio:** escribes código en un editor y una lista de pruebas visibles se pone en verde mientras escribes.
- **Autoevaluación:** preguntas cortas para comprobar que entendiste.

Las pistas se piden de a una y la solución se explica. El progreso se guarda solo en tu navegador.

Cada sección cierra con un **Reto del motor**: no es un examen, sino cuatro ejercicios que mezclan los temas de toda la sección (predecir, ordenar la salida, encontrar el error y programar), como pasa en un programa de verdad.

![El pizarrón de práctica de la pila de llamadas, con el ejercicio «Sé el motor»](docs/capturas/practica.webp)

### Rayos X: tu propio pizarrón

En [`/rayos-x`](https://domina-js.pages.dev/rayos-x) eliges un pizarrón (la pila, recursión, closures, `var` y `let` en un bucle…), le cambias lo que quieras y lo ejecutas: el sitio corre tu código con un intérprete propio, escrito sobre Acorn, y arma el pizarrón solo, con la pila, las variables (también las que recuerda un closure), la consola y una explicación de cada paso. Abajo hay desafíos de refuerzo que se comprueban mirando lo que pasa en el pizarrón: «haz que la pila llegue a 3 funciones», «desborda la pila a propósito», «cambia una sola palabra para que imprima `0 1 2`».

### Ejemplos que se ejecutan

Los bloques de código de las lecciones tienen un botón **Ejecutar**. El código corre aislado, en un Web Worker o en un iframe con *sandbox*, con un tiempo máximo y la consola capturada.

### Al día con el lenguaje

El temario cubre lo que JavaScript sumó hasta hoy. Cada novedad lleva la insignia de su edición (ES2021 a ES2026), y las ediciones se verificaron contra la tabla de propuestas terminadas de TC39. También hay páginas para ES2027, ya cerrada, y para lo que viene en camino.

### Un glosario enlazado

En [`/glosario`](https://domina-js.pages.dev/glosario) están los términos del curso (closure, hoisting, microtarea, zona muerta temporal…) explicados en una o dos frases, con su nombre en inglés y un enlace al apartado exacto de la lección donde se ven a fondo. Se puede filtrar escribiendo, también en inglés.

## El temario

0. Antes de empezar
1. Fundamentos del lenguaje
2. Control de flujo y errores
3. Funciones
4. Cómo se ejecuta JS por dentro
5. Objetos
6. Clases
7. Colecciones y datos
8. Iteradores y generadores
9. Asincronía
10. Módulos
11. Biblioteca estándar
12. Metaprogramación
13. JavaScript en el navegador
14. JavaScript en el servidor
15. Herramientas y ecosistema
16. Novedades por edición

![La página del temario, con las secciones, sus lecciones e insignias de edición](docs/capturas/temario.webp)

## También en el teléfono

En pantallas chicas el temario se abre con un botón y los controles del pizarrón quedan fijos al pie mientras lo tienes a la vista.

<img src="docs/capturas/movil.webp" alt="La lección «La pila de llamadas» en un teléfono" width="320">

## Diseño

La dirección visual es **«Pizarrón y tiza amarilla»**: un tablero verde oscuro, solo con fondo oscuro, y una paleta que sale del amarillo del logo de JavaScript (`#F7DF1E`). Los títulos van en Tiza Domina (ver abajo), el texto en Atkinson Hyperlegible y el código en Fira Code. El sistema completo está en [`DESIGN.md`](DESIGN.md) y las direcciones que no se eligieron quedan archivadas en [`docs/disenos/`](docs/disenos/).

## Hecho con

- [Astro](https://astro.build) 7 con MDX y *content collections*
- [CodeMirror](https://codemirror.net) 6 para el editor de los laboratorios
- [Shiki](https://shiki.style), con un tema propio de tiza, para resaltar el código
- Sin frameworks de interfaz: componentes de Astro y TypeScript

### Fuentes

- **Tiza Domina**, la letra de los títulos, es una versión modificada de [Cabin Sketch](https://fonts.google.com/specimen/Cabin+Sketch) (© 2011 The Cabin Project Authors): recortada a los caracteres que usa el sitio y con los contornos simplificados, para que pese la mitad y el navegador la dibuje más rápido. Como Cabin Sketch es un nombre reservado de su licencia, la versión modificada lleva otro nombre. Se distribuye bajo la [SIL Open Font License 1.1](src/fuentes/OFL.txt) y se regenera con `python herramientas/tiza-domina.py`.
- [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) y [Fira Code](https://github.com/tonsky/FiraCode), sin cambios, desde Fontsource (OFL 1.1).

## Cómo correrlo

Necesitas Node.js 22 o superior.

```sh
npm install
npm run dev       # servidor de desarrollo en http://localhost:4321
npm run build     # sitio estático en ./dist
npm run preview   # sirve ./dist para revisarlo antes de publicar
```

El sitio se publica en Cloudflare Pages con cada `git push` a `main`. `public/_headers` deja en caché por un año los archivos de `/_astro/`, que llevan un hash en el nombre, y las páginas se generan como archivos (`build.format: 'file'`) para que se sirvan sin redirección.

## Estructura

```text
src/
├── content/
│   ├── lecciones/      una lección por archivo .mdx (frontmatter: sección, tema, minutos, ejercicios…)
│   └── retos/          el Reto del motor de cada sección, uno por archivo .mdx
├── content.config.ts   el esquema de las lecciones y los retos
├── data/
│   ├── temario.ts      el temario completo: secciones, descripciones, temas e insignias de edición
│   ├── glosario.ts     los términos del glosario y las lecciones donde se explican
│   ├── rayos-x.ts      los pizarrones listos y los desafíos de Rayos X
│   ├── ejercicios/     los ejercicios de cada sección, como datos (los de los retos, en ejercicios/retos/)
│   └── visualizaciones.ts   los pasos de cada pizarrón
├── components/         StepVisualizer, menú del temario y los formatos de ejercicio
├── layouts/            BaseLayout (barra lateral) y LessonLayout
├── scripts/            visualizador, corrección de ejercicios, sandbox y progreso
└── styles/global.css   tokens del pizarrón y estilos compartidos
docs/
├── PLAN.md             el plan del proyecto: temario, arquitectura y fases
├── capturas/           las imágenes de este README
└── disenos/            direcciones de diseño archivadas
herramientas/
├── verificar-ejercicios.mjs   ejecuta los ejercicios en Node y comprueba salidas, soluciones y errores
└── tiza-domina.py             genera la fuente de los títulos
```

Para agregar una lección: crea el `.mdx` en `src/content/lecciones/`, regístrala en `src/data/temario.ts` y, si lleva ejercicios, agrégalos como datos en `src/data/ejercicios/`. Después, `node herramientas/verificar-ejercicios.mjs` comprueba que cada «Ordena la salida» imprima lo que dice, que cada laboratorio se resuelva con su solución y que cada Detective lance el error que muestra.

## Lo que viene

- **Rayos X, etapa 2:** `setTimeout`, promesas y las colas del event loop en el pizarrón generado.
- **Mira tu solución:** pasar por Rayos X el código de un laboratorio.
- Un **buscador** en la barra lateral.

El detalle está en [`docs/PLAN.md`](docs/PLAN.md).
