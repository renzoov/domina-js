# Plan: sección «Proyectos»

> Estado: **planificado, sin implementar.** En la navegación ya está el botón «Proyectos», tachado y con el aviso «Próximamente».
> Falta decidir la lista de proyectos. Cuando se decida, se agrega en la sección 10 de este plan. Los huecos del curso que pueden cubrir los proyectos están en [`COBERTURA.md`](COBERTURA.md).

## 1. Objetivo

Mucha gente aprende mejor construyendo algo. Después de las lecciones, los ejercicios, los Retos del motor y Rayos X, la sección **Proyectos** propone entre 5 y 8 aplicaciones completas, de la más fácil a la más difícil. Cada una toca varios temas del curso y **profundiza un poco más** que la lección. El último proyecto es grande y junta temas de casi todas las secciones.

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
├── BotonProyectos.astro         el botón de la navegación (ya existe, en modo «Próximamente»)
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

- Entre todos los proyectos deben tocarse **las 16 secciones** del temario. Cada proyecto declara sus temas en el frontmatter, y el verificador arma una tabla de cobertura para ver qué secciones quedan sin proyecto.
- Los proyectos son el lugar para **profundizar y para cubrir huecos** del curso que se entienden mejor construyendo. La lista de huecos está en [`COBERTURA.md`](COBERTURA.md): archivos, tiempo real, arrastrar y soltar, APIs del dispositivo, gráficos a fondo con Canvas y SVG, multimedia, accesibilidad, eventos propios, `contenteditable`, etc. Cada hueco que cubra un proyecto va en su bloque «Lo nuevo de este proyecto».
- **La dificultad sube de a poco:** proyectos fáciles y visuales al principio, uno o dos con servidor hacia el final y un proyecto final grande que junta varias secciones.
- **Proyectos con servidor:** se hacen con Node sin librerías siempre que se pueda. Por ejemplo, un chat con Server-Sent Events y `fetch` usa solo `node:http`. Si un proyecto necesita WebSocket del lado del servidor, se ofrece la versión con Deno o Bun, que lo traen incluido, y se explica que en Node hace falta la librería `ws`.
- **Si un proyecto usa una API que no funciona igual en todos los navegadores** (por ejemplo, File System Access, que es solo de Chromium), se avisa y se ofrece una alternativa que funcione en todos.
- **Ideas en evaluación** (no es la lista definitiva): calculadora, juego de memoria, lista de tareas, quiz con cuenta regresiva, explorador de países, galería que sube fotos, control de gastos con gráfico, pizarra para dibujar con Canvas y con SVG, juego en Canvas, editor de Markdown, API de notas con Node, chat en tiempo real y el proyecto final Kanban offline.

## 8. Fases

1. **Base:** la colección, las dos páginas, el bento, el componente de paso, el progreso, el empaquetado de zips y el verificador.
2. **Proyecto piloto:** el primero completo, para probar la experiencia y ajustar el formato de la guía.
3. **El resto**, de a uno, del más fácil al más difícil, cada uno verificado antes de publicarse.
4. **Lanzamiento:** el botón de la navegación pasa de «Próximamente» a enlace, se suma la tarjeta en la portada y las invitaciones, y se actualizan el README (con capturas), DESIGN.md y este plan.

## 9. Decisiones pendientes

- **La lista de proyectos** (sección 10): nombres, orden y temas. Hay una propuesta de 8; se puede reducir a 5 o 6.
- Si el proyecto con servidor (Node) entra o no. Es el único que no se abre en el navegador.
- Si el proyecto final usa herramientas (npm, Vite, Vitest) o se mantiene sin dependencias.
- Si «Proyectos» aparece también en la barra lateral, debajo del temario.
- Qué huecos de `COBERTURA.md` se cubren con lecciones nuevas antes de los proyectos, y cuáles solo dentro de los proyectos.

## 10. Lista de proyectos

*Por decidir.* Cuando se elija, aquí irá la tabla definitiva con el número, el nombre, de qué trata, el nivel y los temas del curso que toca.
