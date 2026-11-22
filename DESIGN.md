---
name: domina-js
description: JavaScript en español, paso a paso, escrito con tiza en un pizarrón.
colors:
  board: "#1b2a23"
  board-hi: "#22342b"
  board-lo: "#15211b"
  edge: "#0f1712"
  tray: "#0b120e"
  chalk: "#eceae2"
  chalk-70: "#b8bcb4"
  chalk-45: "#7f8a82"
  chalk-15: "rgba(236, 234, 226, 0.15)"
  chalk-08: "rgba(236, 234, 226, 0.08)"
  chalk-04: "rgba(236, 234, 226, 0.04)"
  comment: "#97a29a"
  js-yellow: "#f7df1e"
  js-yellow-90: "rgba(247, 223, 30, 0.9)"
  js-yellow-12: "rgba(247, 223, 30, 0.12)"
  js-yellow-06: "rgba(247, 223, 30, 0.06)"
  chalk-pink: "#f2a7b8"
  chalk-blue: "#8fd0f7"
  chalk-orange: "#ffb36b"
  chalk-lilac: "#cdb0ff"
  chalk-lime: "#c4ec8c"
  chalk-red: "#f08a7e"
  sage: "#8fb7a1"
  well: "rgba(0, 0, 0, 0.14)"
  well-deep: "rgba(0, 0, 0, 0.18)"
typography:
  display:
    fontFamily: "Tiza Domina, Atkinson Hyperlegible, cursive"
    fontSize: "clamp(2.6rem, 5.2vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "Tiza Domina, Atkinson Hyperlegible, cursive"
    fontSize: "clamp(1.6rem, 2.4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "Tiza Domina, Atkinson Hyperlegible, cursive"
    fontSize: "1.65rem"
    fontWeight: 700
    lineHeight: 1
  annotation:
    fontFamily: "Tiza Domina, Atkinson Hyperlegible, cursive"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
  subhead:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  lead:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.62
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  ui:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
  code:
    fontFamily: "Fira Code, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'liga' 0, 'calt' 0"
  code-panel:
    fontFamily: "Fira Code, ui-monospace, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: "1.45rem"
    fontFeature: "'liga' 0, 'calt' 0"
  counter:
    fontFamily: "Fira Code, ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  chalk: "5px 9px 4px 8px / 8px 4px 9px 5px"
  chalk-2: "4px 8px 5px 7px / 7px 5px 8px 4px"
  node: "48% 52% 45% 55% / 55% 45% 52% 48%"
  board: "6px"
  practice-frame: "12px"
  pill: "999px"
  key: "4px"
  stroke: "3px"
  soft: "8px"
spacing:
  gutter: "clamp(16px, 3vw, 36px)"
  measure: "66ch"
  sidebar: "300px"
  text-column: "720px"
  practice-column-min: "420px"
  column-gap: "40px"
  stack: "8px"
  panel: "14px"
  exercise: "48px"
  next-lesson: "72px"
  section: "120px"
components:
  button-chalk:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.chalk-2}"
    padding: "10px 16px"
  button-chalk-hover:
    backgroundColor: "{colors.chalk-04}"
    textColor: "{colors.chalk}"
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.js-yellow}"
    rounded: "{rounded.chalk-2}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.js-yellow-06}"
    textColor: "{colors.js-yellow}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-blue}"
    rounded: "{rounded.chalk-2}"
    padding: "10px 16px"
  code-file-bar-action:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-70}"
    padding: "6px 10px"
  code-file-bar-run:
    backgroundColor: "transparent"
    textColor: "{colors.js-yellow}"
    padding: "6px 10px"
  code-block:
    backgroundColor: "{colors.board-lo}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.chalk}"
    typography: "{typography.code}"
  code-panel:
    backgroundColor: "rgba(0, 0, 0, 0.14)"
    textColor: "{colors.chalk}"
    rounded: "{rounded.chalk}"
    typography: "{typography.code-panel}"
    padding: "10px 0"
  stack-frame:
    backgroundColor: "rgba(0, 0, 0, 0.08)"
    textColor: "{colors.chalk}"
    rounded: "{rounded.chalk}"
    padding: "8px 12px"
  stack-frame-top:
    backgroundColor: "{colors.js-yellow-06}"
    textColor: "{colors.js-yellow}"
    rounded: "{rounded.chalk}"
  step-node:
    backgroundColor: "{colors.board}"
    textColor: "{colors.chalk-70}"
    rounded: "{rounded.node}"
    size: "30px"
  step-node-current:
    backgroundColor: "{colors.js-yellow}"
    textColor: "{colors.board-lo}"
    rounded: "{rounded.node}"
    size: "30px"
  note:
    textColor: "{colors.chalk}"
    rounded: "6px 10px 5px 9px / 9px 5px 10px 6px"
    padding: "14px 18px"
  practice-board:
    backgroundColor: "{colors.board-lo}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.practice-frame}"
    padding: "26px 30px 54px"
  practice-count:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  practice-count-done:
    backgroundColor: "{colors.chalk-lime}"
    textColor: "{colors.board-lo}"
    rounded: "{rounded.pill}"
  challenge-step:
    backgroundColor: "{colors.board-lo}"
    rounded: "{rounded.node}"
    size: "44px"
  format-tag:
    textColor: "{colors.chalk-orange}"
    rounded: "{rounded.chalk-2}"
    padding: "6px 12px 7px"
  solved-tag:
    backgroundColor: "{colors.chalk-lime}"
    textColor: "{colors.board-lo}"
    rounded: "{rounded.chalk-2}"
    padding: "7px 12px 7px 9px"
  next-lesson:
    backgroundColor: "{colors.js-yellow-06}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.chalk}"
    padding: "20px 22px 20px 26px"
  edition-tag:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-blue}"
    rounded: "{rounded.chalk-2}"
    padding: "4px 6px"
---

# Design System: domina-js

## Overview

**Creative North Star: "Pizarrón y tiza amarilla"**

Cada página es una clase en el pizarrón. Un tablero verde-negro con polvo de tiza vive dentro de un marco más oscuro con su bandeja de tizas al pie; el maestro escribe en tiza blanca, subraya en amarillo lo que importa ahora y saca tizas de colores para separar las ideas. El sistema rechaza la documentación por defecto (barra lateral más tarjetas sobre gris neutro) y la consola oscura de editor: aquí lo oscuro es pizarra, no IDE.

La densidad es la de una clase con mesa de práctica: una barra lateral fija con el temario, una columna de lectura a 66ch y, en pantallas anchas, un pizarrón de práctica enmarcado al lado que se desplaza por su cuenta. Las superficies no flotan; se dibujan. Los contenedores son trazos de tiza con radios irregulares, los iconos son trazos a mano del mismo grosor, y el movimiento sigue la gramática de la tiza: escribir (revelado de izquierda a derecha) y borrar (borrón y fundido).

El fondo es oscuro siempre y la paleta se ancla en el amarillo de JavaScript (#F7DF1E), compromisos fijados en PRODUCT.md. El amarillo es la tiza que marca; las tizas de colores (azul, naranja, rosa, lila, lima) son las que se leen sobre el verde. La salvia ya no escribe texto: verde sobre verde no se lee.

**Key Characteristics:**
- Tablero verde-negro texturizado con gradientes finos y manchas de borrado, enmarcado por un borde casi negro y una bandeja con tizas.
- Tiza blanca para el texto; amarillo para lo activo, lo subrayado y la acción principal; tizas de colores claras para rótulos, código y formatos.
- Cabin Sketch escribe a mano los títulos; Atkinson Hyperlegible se lee; Fira Code (sin ligaduras) muestra el código tal como se escribe.
- Bordes de tiza con radios asimétricos; los marcos de madera son los únicos rectángulos regulares.
- Escribir 280ms, borrar 220ms; con reduced-motion todo es instantáneo.

## Colors

Una pizarra verde-negra, tiza blanca gastada en tres intensidades, la tiza amarilla de JavaScript y una caja de tizas de colores claros que se leen sobre el verde.

### Primary
- **Tiza amarilla JS** (js-yellow): la marca de lo que importa ahora. Subrayado de títulos display y de la línea activa del código, el tema actual en el menú, el marco en la cima de la pila, el paso actual del visualizador, el número del contador, la acción principal («Siguiente», «Siguiente reto», «Ejecutar»), la tarjeta «Continúa con …», el anillo de foco, la selección y el cursor del editor. El subrayado usa la variante al 90% como franja baja (82–94% de la altura de la línea), nunca como fondo completo. Además es una de las cuatro tizas que rotan en los subrayados de h2.

### Secondary
- **Tiza azul** (chalk-blue): rótulos y metadatos. Línea de metadatos bajo el título, rótulos de panel, encabezados de tabla, contador «Paso N de M», números de línea, palabras clave del código, botones discretos, etiquetas de edición (ES2025), pasos vistos del visualizador, la tiza de «tip» y del formato Ordena la salida.
- **Tiza naranja** (chalk-orange): lo literal y lo contado. Código en línea, números del código, rayas y números de lista, y el formato Sé el motor.
- **Tiza rosa** (chalk-pink): la voz de la mano del maestro. Notas «¡ojo!», anotaciones a mano junto a la pila, la marca «sale» del visualizador, las cadenas del código y el formato Detective.

### Tertiary
- **Tiza lila** (chalk-lilac): el Laboratorio (marco del editor, «se ejecuta mientras escribes») y los atributos en el código.
- **Tiza lima** (chalk-lime, alias `--ok` en el código): acierto y resuelto. Etiqueta «Resuelto», pastilla completa, casillas cumplidas, comentarios de acierto, marca «entra», progreso del menú y el formato Autoevaluación.
- **Tiza roja** (chalk-red): errores y respuestas equivocadas. Traza de error en Detective, opción o tarjeta mal elegida, nota «¡cuidado!», salida con error, marca de evento «error».
- **Salvia** (sage): token heredado. Solo se conserva en `global.css`; ningún texto, rótulo, número ni viñeta la usa.

### Neutral
- **Pizarra** (board): el tablero; también el fondo de la barra lateral y de los nodos del visualizador.
- **Pizarra clara / oscura** (board-hi, board-lo): board-lo es el fondo de los bloques de código y del pizarrón de práctica, y el texto sobre superficies amarillas o lima.
- **Marco** (edge) y **Bandeja** (tray): el borde exterior de la página y del pizarrón de práctica, y la repisa de tizas al pie.
- **Tiza** (chalk): texto principal, títulos, código, texto de las notas.
- **Tiza gastada** (chalk-70): texto secundario, explicaciones, navegación inactiva, nombre de archivo (≥4.5:1 sobre la pizarra).
- **Tiza tenue** (chalk-45): bordes de botón y de caja, separadores. Solo decoración o texto grande.
- **Comentario** (comment): comentarios del código, en itálica (≥4.5:1 sobre la pizarra).
- **Polvo** (chalk-15, chalk-08, chalk-04): líneas punteadas, bordes suaves, hover de fondo, manchas del tablero.

### Named Rules
**The Yellow Chalk Rule.** El amarillo solo, como único color de un elemento, marca lo que importa ahora: subrayado, línea activa, marco activo, paso actual, acción principal y foco. Como una tiza más en una rotación (subrayados de h2, puntos de la barra de archivo, bandeja) puede decorar.

**The Readable Chalk Rule.** Todo color que escribe texto sobre el pizarrón es una tiza clara: chalk, chalk-70, amarillo, azul, naranja, rosa, lila, lima o rojo. La salvia nunca escribe texto, rótulos, números ni viñetas.

**The One Job Per Chalk Rule.** Cada tiza de color tiene su trabajo: azul rotula, naranja es literal y contado, rosa es la mano del maestro, lila es el Laboratorio, lima es el acierto, rojo es el error. Los colores de formato siguen ese reparto.

**The Red Is Wrong Rule.** El rojo aparece solo cuando algo está mal (error del programa o respuesta del lector). El acierto es lima.

**The Tint Not Paint Rule.** Una tiza de color colorea superficies solo como tinte (7–12%) con un borde al 45%; los rellenos plenos quedan para el estado (paso actual, «Resuelto», pastilla completa, flecha de «Continúa con»).

**The Worn Chalk Rule.** El texto que se lee usa chalk o chalk-70. chalk-45 es para trazos y texto grande, nunca para letra de lectura.

## Typography

**Display Font:** Cabin Sketch, servida como «Tiza Domina»: la misma letra recortada y con contornos simplificados (herramientas/tiza-domina.py), que pesa la mitad y se dibuja más rápido (con Atkinson Hyperlegible, cursive)
**Body Font:** Atkinson Hyperlegible (con system-ui, sans-serif)
**Label/Mono Font:** Fira Code (con ui-monospace, monospace), ligaduras apagadas

**Character:** La letra de tiza del maestro arriba, la letra más legible posible abajo. Cabin Sketch da el gesto a mano en pocas palabras; Atkinson carga toda la lectura; Fira Code muestra `<=` y `===` tal como se teclean.

### Hierarchy
- **Display** (Cabin Sketch 700, clamp(2.6rem, 5.2vw, 4.5rem), 1): título de lección y de temario, con el subrayado SVG amarillo debajo y un halo de tiza. La portada sube hasta 5rem.
- **Headline** (Cabin Sketch 700, clamp(1.6rem, 2.4vw, 2rem), 1.15): h2 de la prosa (con su trazo de tiza de color), secciones del temario, «¡A practicar!» (hasta 2.2rem) y el título de «Continúa con …».
- **Title** (Cabin Sketch 700, 1.55–1.7rem, 1): título del visualizador y del menú «Temario».
- **Annotation** (Cabin Sketch 700, 1.1–1.5rem, rotada −1.5° a −6°): etiquetas de nota, anotaciones a mano, etiqueta de formato de ejercicio, «Continúa con», números de paso de reto y de lista ordenada.
- **Subhead** (Atkinson 700, 1.25rem, 1.3): h3 de la prosa; título del ejercicio a clamp(1.25rem, 2vw, 1.5rem).
- **Lead** (Atkinson 400, 1.15rem, 1.62): el párrafo inicial de cada página.
- **Body** (Atkinson 400, 1.0625rem, 1.65, máx. 66ch): lectura.
- **Label** (Atkinson 700, 0.74–0.78rem, 0.12em, mayúsculas, azul): rótulos de panel, encabezados de tabla y la línea de metadatos.
- **Code** (Fira Code 400, 0.875rem/1.6 en la prosa; 0.8–0.82rem con línea de 1.45–1.5rem en paneles y consolas): código, números de línea, marcos de la pila, consola, nombre de archivo.
- **Counter** (Fira Code 400–600, 0.78–0.85rem): «Paso N de M» (azul con el número en amarillo) y la pastilla «N/M resueltos».

### Named Rules
**The Three Hands Rule.** Cabin Sketch solo para títulos, encabezados, anotaciones a mano y numerales dibujados; Atkinson Hyperlegible para lectura y etiquetas de interfaz (incluidos botones); Fira Code solo para código, números de línea, contadores, etiquetas de edición, nombres de archivo y consola. Un botón con texto nunca va en Cabin Sketch.

**The Literal Code Rule.** Todo lo monoespaciado desactiva ligaduras (`'liga' 0, 'calt' 0`). Quien aprende tiene que ver los caracteres que escribe.

## Layout

La página es un pizarrón con 12px de margen sobre el marco oscuro y relleno lateral fluido (clamp(16px, 3vw, 36px)); por debajo de 640px el pizarrón ocupa toda la pantalla sin margen ni radio.

A la izquierda, una barra lateral fija de 300px y toda la altura (12px arriba y abajo) con el logo y el menú del temario; tiene su propio scroll, separado del contenido por una raya discontinua; al navegar conserva la posición en que la dejaste y solo se desplaza si el tema actual quedó fuera de la vista. El contenido se desplaza por su cuenta a la derecha, con la navegación principal arriba a la derecha y el nombre de la sección en Cabin Sketch arriba a la izquierda. Por debajo de 960px la barra pasa arriba y el temario se abre con el botón «Secciones y temas».

La lección es una rejilla de dos columnas: texto en minmax(0, 720px) y práctica en minmax(420px, 1fr), con 40px entre ambas y un margen izquierdo del 8% dentro de la columna de práctica. La apertura ocupa todo el ancho cuando hay visualizador (título arriba; intro y apoyo a la izquierda, visualizador a la derecha) y comparte fila con la práctica cuando no lo hay. El pizarrón de práctica es sticky (16px del borde superior, alto máximo 100vh − 56px) y se desplaza por su cuenta. Por debajo de 1400px la práctica vuelve debajo de la lección, en su lugar del HTML; por debajo de 1280px la apertura se apila (título, intro, visualizador, apoyo). La prosa se limita a 66ch; los visualizadores dentro del artículo llegan a 900px.

Ritmo vertical: 8px entre marcos de pila y botones, 14px dentro de paneles, 48px entre ejercicios, 72px antes de la tarjeta «Continúa con», 120px entre secciones de la portada (80px en móvil). En móvil (≤720px) los controles del visualizador se fijan al pie mientras el pizarrón está a la vista.

## Transiciones (View Transitions)

Las transiciones (solo dentro de la página) siguen la misma gramática de la tiza que los pizarrones: lo viejo se **borra** (fundido con desenfoque de 6px y 12px hacia la izquierda, 180–200ms, ease-in) y lo nuevo se **escribe** (revelado de izquierda a derecha con clip-path, 300–340ms, ease-out exponencial).

- **Entre páginas no hay animación.** Se probó con View Transitions nativas entre documentos, pero durante la transición Chromium muestra una imagen de la barra lateral en vez de la barra real, y al elegir un tema el menú parpadeaba. La página se reemplaza de una vez; la barra se pinta completa antes del primer cuadro (progreso y scroll restaurados por el script en línea de BaseLayout, con `<link rel="expect" blocking="render">`) y las fuentes principales se precargan con `font-display: optional`, así no hay cambio de fuente a la vista.
- **Dentro de la página:** `conTransicion()` (src/scripts/transiciones.ts) envuelve los cambios de reto en el pizarrón de práctica (`view-transition-name: practica`) y de pregunta en la Autoevaluación. Durante esas transiciones el documento lleva la clase `vt-local` y la página entera no se anima, solo lo que tiene nombre.
- **Movimiento reducido:** con `prefers-reduced-motion: reduce` no hay animación; sin soporte del navegador, la navegación es normal.

## Elevation & Depth

Plano por naturaleza: la profundidad viene del material, no de sombras de interfaz. El tablero tiene una viñeta interior; los bloques de código se hunden en board-lo o en negro translúcido (12–18%). Las sombras que existen son halos de tiza o sombras de objetos físicos del aula: la bandeja y el pizarrón de práctica colgado.

### Shadow Vocabulary
- **Viñeta del tablero** (`box-shadow: inset 0 0 0 2px rgba(0,0,0,0.4), inset 0 0 90px rgba(0,0,0,0.45)`): solo el pizarrón principal.
- **Pizarrón de práctica** (`box-shadow: inset 0 0 0 2px rgba(236,234,226,0.06), inset 0 0 60px rgba(0,0,0,0.45), 0 10px 26px rgba(0,0,0,0.35)`): viñeta propia y la sombra suave del objeto enmarcado.
- **Halo de tiza** (`box-shadow: 0 0 3px rgba(236,234,226,0.12)`): cajas de tiza.
- **Brillo activo** (`box-shadow: 0 0 5px rgba(247,223,30,0.25)`; 6px al 40% en el paso actual): el marco en la cima y el paso actual.
- **Anillo de tiza** (`box-shadow: 0 0 0 3–4px` del color de la tiza al 25%, o al 8% en el marco del Laboratorio): paso de reto seleccionado, pregunta actual, editor del Laboratorio.
- **Repisa** (`box-shadow: 0 -4px 10px rgba(0,0,0,0.35)`, y `0 -8px 16px` en la barra fija de móvil): objetos que se apoyan en el borde inferior.

### Named Rules
**The Chalk Glows Rule.** Lo escrito brilla un poco (halo o anillo sin desplazamiento). Solo los objetos físicos del aula (la bandeja, el pizarrón de práctica) proyectan sombra, y siempre difusa; ningún botón, tarjeta o nota se levanta del tablero.

## Shapes

Los trazos de tiza no son rectángulos perfectos. Las cajas de tiza usan radios asimétricos (radio de tiza; la variante ajustada para botones, etiquetas y formatos), los círculos son óvalos a mano (radio de nodo) para nodos de pasos, pasos de reto, números de sección, números de lista y casillas. Los bordes son de 2px (2.5px en pasos de reto y la tarjeta «Continúa con»). Los separadores son trazos discontinuos (rayas de 2px discontinuas, repeating-linear-gradient con tramos desiguales). El suelo de la pila es una línea punteada de 3px. Los subrayados de título display son un SVG trazado a mano en dos pasadas (Subrayado); los de h2 son una máscara CSS con un trazo curvo de 220×12.

Las viñetas de lista son rayas de tiza de 4px giradas −8°, que rotan naranja, azul y rosa; los números de lista ordenada van en óvalos de tiza con la misma rotación de color.

**The Irregular Radius Rule.** Todo trazo de tiza usa un radio de tiza o de nodo. Son regulares solo los objetos que no son tiza: el pizarrón (6px), el marco del pizarrón de práctica (12px), la pastilla «N/M resueltos» (999px), las teclas `kbd` (4px) y los puntos pequeños (puntos de la barra de archivo, de progreso y de lectura).

**The Framed Board Rule.** El pizarrón de práctica es un tablero dentro del tablero: marco de 10px en edge, superficie board-lo y bandeja con tizas propia. Dentro de él sí hay cajas de tiza (formato, editor, opciones). Fuera de la práctica, una caja de tiza no contiene otra: la prosa agrupa con espacio, rótulos y rayas.

## Components

### Buttons
Trazos de tiza con letra legible: tranquilos y táctiles.
- **Shape:** radio de tiza ajustado, borde 2px, Atkinson 700 a 0.95rem, icono de 18px a 8px del texto.
- **Default:** borde chalk-45, texto chalk, fondo transparente.
- **Primary:** borde y texto amarillos. Una por grupo de controles («Siguiente», «Siguiente reto», «Siguiente pregunta»).
- **Quiet:** borde transparente, texto azul; para Reiniciar, Ver la solución, Restaurar.
- **Hover / Focus:** el borde sube a chalk y aparece polvo (chalk-04); en primario, fondo amarillo al 6%. Foco: contorno amarillo discontinuo de 2px a 3px de distancia. Transiciones de 160ms ease-out. Deshabilitado: 40% de opacidad.

### Chips
- **Etiqueta de edición:** Fira Code 600 a 0.66rem, azul, borde 1.5px azul al 50%, radio de tiza ajustado. «propuesta» cambia a Atkinson con borde discontinuo chalk-45.
- **Etiqueta de formato:** Cabin Sketch 700 a 1.1rem en la tiza del formato, borde 2px del mismo color, tinte al 10%, girada −1.5°.
- **Resuelto:** Atkinson 700 a 0.85rem, board-lo sobre lima, con la palomita de tiza.

### Cards / Containers
- **Corner Style:** radio de tiza.
- **Background:** transparente, tinte de color al 6–10%, board-lo, o negro al 8–18% sobre el tablero.
- **Shadow Strategy:** halo de tiza (ver Elevation & Depth).
- **Border:** 2px chalk-45 por defecto, chalk-70 en paneles del visualizador, chalk-15 en bloques de código, color al 45% en notas y en el marco del Laboratorio.
- **Internal Padding:** 10–14px vertical, 14–18px horizontal; los paneles con números de línea usan 10px vertical y 0 lateral.

### Bloques de código vivos
Cada bloque de código de la lección es una pizarra de prueba: caja de tiza en board-lo con borde chalk-15. Arriba, una barra de archivo con tres puntos de tiza (rosa, amarillo, azul), el nombre en Fira Code chalk-70 («ejemplo.js») y, a la derecha, «Copiar» (chalk-70) y «Ejecutar» (amarillo), este último solo si el código usa `console.log`. La salida aparece debajo, tras una raya discontinua, como consola: `$ node ejemplo.js` en azul y la salida en chalk (en rojo si hay error o se agotó el tiempo de 3 s). El código corre en un Web Worker aislado que espera a lo asíncrono (temporizadores, promesas, `await` de nivel superior) y formatea los valores como Node.js. Si el ejemplo usa `document` o `window`, corre en cambio en una página aislada (iframe con `sandbox`), y su vista aparece entre el código y la consola, en una franja de 170px sobre `#14201a` con raya discontinua chalk-08 arriba; la consola dice «Consola del navegador». Se dejan solo para copiar los ejemplos que necesitan red, almacenamiento, archivos, un runtime de servidor o sintaxis que los navegadores aún no ejecutan. El resaltado es el tema de tiza: palabras clave azules, cadenas rosas, números naranjas, funciones en chalk 600, atributos lila, comentarios en itálica gris (comment).

### Tablas de tiza
Ancho de la medida, encabezados como rótulo azul sobre una raya chalk-45 de 2px, filas separadas por rayas discontinuas chalk-15, primera columna en chalk 700 y el resto en chalk-70.

### Inputs / Fields
- **Editor del Laboratorio:** dentro de un marco lila (borde lila al 45% y anillo al 8%) con barra de archivo «programa.js» y la nota lila «se ejecuta mientras escribes». Fira Code 0.85rem, cursor amarillo, sin contorno propio; consola embebida debajo con `$ node programa.js`.
- **Laboratorio con página** (sección del navegador): la barra dice «app.js» y, entre el editor y la consola, aparece «La página» (rótulo azul, `index.html` en Fira Code chalk-45) con un iframe de 240px redimensionable, borde chalk-15 de 2px y radio suave, sobre `#14201a`. La vista muestra solo lo que hizo el código del lector; las verificaciones (que hacen clics y envíos) corren en una copia oculta. La página de prueba tiene su propia hoja mínima: fondo pizarrón, texto chalk, botones amarillos, títulos amarillos.
- **Error:** la salida se vuelve roja; la verificación fallida marca su óvalo en rojo, la cumplida lo rellena de lima.
- **Filtro del glosario:** campo de búsqueda sobre el pozo (`--pozo`), borde chalk-45 de 2px con radio de tiza; al enfocar, borde amarillo y anillo amarillo al 12%. Etiqueta visible en Atkinson 700 encima y la cuenta de resultados en Fira Code chalk-70 al lado.

### Navigation
- **Principal:** Temario, Glosario y Empezar, en Atkinson 700 0.95rem en chalk-70; hover a chalk; página actual en chalk con la franja amarilla baja.
- **Rayos X (botón):** su propia estética de radiografía, distinta de los botones amarillos: fondo casi negro con un resplandor azul arriba, borde azul al 70% con anillo y halo azules, ícono de costilla en un visor y el texto en la letra de tiza con un brillo azul. Al pasar el mouse, una franja de luz barre el botón (sin animación con movimiento reducido). En la navegación va pequeño y apenas girado, y en la página actual cambia el azul por amarillo. En la portada y al final de cada Reto del motor va grande.
- **Rayos X (página):** el título lleva la X en azul con resplandor. Tres pasos con número en óvalo azul: elegir un pizarrón (tarjetas; la elegida con borde y tinte azules), cambiarlo y ejecutarlo (el editor de los laboratorios, con marco azul) y los desafíos (tarjetas con número en óvalo naranja, verde al superarlas). El desafío activo es un recuadro naranja con sus objetivos: un círculo vacío, rojo si no se cumple o lima si se cumple. Al superarlo todo se vuelve lima.
- **Invitación a Rayos X (Reto del motor):** al final del reto, antes de «Continúa con»: «Crea tu propio pizarrón y sigue practicando con los desafíos de» en letra de tiza, una flecha curva de tiza rosa y el botón grande.
- **Reportar un problema:** en el pie, después del autor y del ícono de GitHub, separado por un punto medio: «Reportar un problema» en chalk-70, subrayado chalk-45 y amarillo al pasar. Al final de cada lección y de cada reto, tras una raya discontinua: «¿Viste un error en esta lección? **Avísame en GitHub** y lo corrijo», en 0.9rem chalk-70 con el enlace en chalk 700. Los dos se abren en otra pestaña.
- **Glosario:** fila de letras en óvalos de tiza (Cabin Sketch, borde chalk-15; amarillo al pasar; las letras sin términos quedan en chalk-45 al 45% y las que el filtro vacía, al 30%). Cada letra es un encabezado amarillo con halo y raya discontinua; cada término, una fila de dos columnas (nombre en Atkinson 700 y su nombre en inglés en itálica chalk-70; definición a la medida de lectura, con el código en naranja). Debajo, «Lo ves en» (etiqueta Fira Code en mayúsculas) con enlaces subrayados en amarillo a la lección y su apartado, y «Relacionado» con enlaces azules a otros términos. El término enlazado (`:target`) se resalta con el tinte y el borde amarillos del tema actual del menú.
- **Menú del temario (barra lateral):** «Temario» en Cabin Sketch y la cuenta de temas publicados; secciones desplegables con número en óvalo de tiza, cuenta «n/m» en Fira Code y flecha que gira; cada tema empieza con un guion de tiza (8×2px, chalk-45, apenas inclinado) y el texto lleva sangría, así un nombre de dos líneas queda alineado; los temas publicados en chalk 700, sin subrayado (más claros al pasar); el actual en tiza amarilla con un leve halo, fondo y borde amarillos muy tenues y el guion amarillo más largo; los futuros en chalk-70. El menú no muestra los apartados de la lección. La palomita lima marca temas con todos los ejercicios resueltos. Cada sección cierra con «Reto del motor» en itálica: en lugar del guion lleva un punto de tiza amarilla de 6px.
- **Reto del motor:** usa el mismo diseño que una lección. La meta dice «Cierre de la sección N» en lugar de «Lección N de M», el título de la pestaña agrega la sección y la práctica tiene cuatro retos que mezclan formatos. En el temario, el reto es la última fila de cada sección: una estrella amarilla en lugar del número, el título en itálica y la etiqueta «cierre de sección» en Fira Code chalk-70.
- **Continúa con …:** tarjeta de tiza alineada a la izquierda con el texto, a todo el ancho de la medida: borde amarillo de 2.5px, tinte amarillo al 6% (12% al pasar, y se desplaza 4px), «Continúa con» en Cabin Sketch amarillo, el título de la lección en Cabin Sketch, la sección en azul si cambia, y una flecha en óvalo amarillo relleno. Sin lección publicada, la tarjeta es discontinua chalk-45 y dice «Lo que sigue». Debajo, «Volver a «…»» en chalk-70.

### Notas
Bloque de una caja con radio de tiza amplio, teñido por tipo: borde de la tiza al 45% y fondo al 7%. La etiqueta a mano va a la izquierda en Cabin Sketch 1.5rem, girada −4°: «¡ojo!» rosa, «tip» azul, «¡cuidado!» rojo. El texto va en chalk; el código en línea en naranja y las negritas en la tiza de la nota.

### Iconos
Trazos de tiza SVG en una rejilla de 24px, trazo 2.1 redondeado, color heredado (Icono.astro). Cuando el icono es parte de una anotación a mano o de un dibujo (la tiza de «¡A practicar!»), pasa por el filtro `#tiza` (turbulencia más desplazamiento y huecos de grano) definido una vez en el layout base.

### El pizarrón (StepVisualizer)
Cabecera con título en Cabin Sketch y contador «Paso N de M». Debajo, código y pila lado a lado (la pila en una columna de 170–210px; se apilan bajo 560px). La línea en ejecución lleva el subrayado amarillo y su número en amarillo; los demás números de línea en azul al 75%. La pila crece hacia arriba sobre un suelo punteado; el marco en la cima es amarillo con brillo; los marcos que entran se escriben (clip-path de izquierda a derecha, 280ms ease-out exponencial) y los que salen se borran (blur 6px, desplazamiento 14px, fundido, 220ms). Una anotación rosa a mano indica «entra» o «sale». Siguen la consola, la explicación (aria-live), la pregunta de predicción opcional, la gráfica de profundidad y la línea de pasos con nodos ovalados: visto en azul, actual relleno de amarillo, marcas de evento encima (entra lima, sale rosa, error raya roja). Controles Anterior / **Siguiente** / Reiniciar y teclado con flechas.

Tres modos para la columna de la derecha: **pila** (la pila de llamadas, de abajo arriba, con la gráfica de profundidad), **variables** (variables y objetos de arriba abajo; los objetos en lila discontinuo, con sangría) y **event loop** (rótulo «Pila, APIs y colas»): cada tarjeta lleva encima, en Fira Code 0.62rem en mayúsculas, el nombre de su zona, y la zona da el color de tiza: pila en chalk, Web API en naranja, cola de tareas en azul discontinuo, microtareas en rosa discontinuo. En los modos variables y event loop no hay suelo ni gráfica de profundidad.

Una lección nueva no escribe código: aporta datos con el formato de `src/lib/visualizador.ts`.

### Pizarrón de práctica (Practica)
El tablero enmarcado de ejercicios, un reto a la vez. Marco de 10px en edge (8px al lado de la lección, 6px en móvil), superficie board-lo con polvo, bandeja inferior de 18px con tizas amarilla, rosa, azul y lila. Cabecera: dibujo de tiza amarilla filtrado, «¡A practicar!» en Cabin Sketch, «Tu progreso se guarda en este navegador» en chalk-70 (se oculta en la columna lateral) y la pastilla «N/M resueltos» en Fira Code (borde chalk-15; rellena de lima al completar). Debajo, los pasos: óvalos de tiza de 44px en la tiza del formato de cada reto, unidos por rayas discontinuas; el seleccionado se rellena con su tiza y lleva anillo al 25%; el resuelto muestra la palomita; los no alcanzados quedan bloqueados al 40%. Al pie, tras una raya discontinua, un aviso (chalk-70, lima cuando está resuelto) y Anterior / **Siguiente reto**, que solo se habilita al resolver el reto actual.

### Ejercicios
Cinco formatos, cada uno con su tiza: Sé el motor naranja, Ordena la salida azul, Detective rosa, Laboratorio lila, Autoevaluación lima. Cabecera: etiqueta de formato, título en Atkinson 700 chalk y «Resuelto» a la derecha. El código en línea del enunciado toma la tiza del formato sobre un tinte al 12%. Comentarios de acierto en lima, de error en rojo. La Autoevaluación muestra una pregunta a la vez, con «Pregunta n de m» en azul, puntos de progreso (lima los respondidos, anillo lima el actual) y «Siguiente pregunta» bloqueado hasta responder.

**Nunca código en blanco plano.** El código de las preguntas, las opciones, las pistas, los hallazgos y las explicaciones se colorea con los mismos tokens que el editor: palabras clave en azul, textos en rosa, números en naranja, comentarios en gris itálica y llamadas en chalk 600 (`resaltarHtml` y `resaltarEnLinea` en `src/lib/resaltar.ts`). Las líneas seguidas que son solo `<code>` forman un bloque sobre el pozo, con borde chalk-15 y radio de tiza, que se desplaza dentro de su caja si una línea es larga. El código nunca lleva ligaduras: `...` y `===` se ven tal como se escriben.

## Do's and Don'ts

### Do:
- **Do** mantener el fondo oscuro siempre: tablero #1B2A23 dentro del marco #0F1712.
- **Do** anclar la paleta en el amarillo JS #F7DF1E y usarlo solo, como único color, para subrayado, línea activa, marco activo, paso actual, acción principal y foco.
- **Do** escribir rótulos, metadatos, encabezados de tabla y palabras clave en azul; código en línea, números y marcadores de lista en naranja; acierto en lima; error en rojo.
- **Do** dar a cada formato de ejercicio su tiza: Sé el motor naranja, Ordena la salida azul, Detective rosa, Laboratorio lila, Autoevaluación lima.
- **Do** teñir notas y marcos de color con la tiza al 7–12% y borde al 45%, no con relleno pleno.
- **Do** subrayar con la franja amarilla baja (82–94% de la línea), con el SVG Subrayado bajo los títulos display y con el trazo de tiza rotatorio (amarillo, rosa, azul, naranja) bajo los h2.
- **Do** dibujar bordes con radios de tiza irregulares y trazos de 2px.
- **Do** convertir los bloques de código de la lección en pizarras de prueba (barra de archivo, Copiar, Ejecutar si imprime, consola `$ node ejemplo.js`) y ejecutar en un Worker aislado.
- **Do** presentar los ejercicios en el pizarrón de práctica, un reto a la vez, con el siguiente bloqueado hasta resolver el actual.
- **Do** usar iconos de Icono.astro, y el filtro `#tiza` cuando el icono forma parte de una anotación o dibujo a mano.
- **Do** animar con la gramática de la tiza: escribir 280ms ease-out (cubic-bezier(0.16, 1, 0.3, 1)), borrar 220ms; instantáneo con prefers-reduced-motion.
- **Do** describir cada visualizador nuevo como datos en el formato de `src/lib/visualizador.ts`.

### Don't:
- **Don't** usar fondos claros ni superficies grises neutras de documentación.
- **Don't** escribir texto, rótulos, números ni viñetas en salvia (#8fb7a1): verde sobre verde no se lee.
- **Don't** pintar con amarillo fondos completos, bordes decorativos o títulos enteros (la tarjeta «Continúa con» usa solo un tinte al 6%).
- **Don't** poner un rótulo o kicker sobre los títulos; el título va primero y los metadatos debajo.
- **Don't** anidar cajas de tiza en la prosa; solo el pizarrón de práctica contiene cajas.
- **Don't** usar Cabin Sketch en párrafos, botones o etiquetas de interfaz, ni Fira Code fuera del código, sus contadores y la consola.
- **Don't** activar ligaduras en ningún texto monoespaciado.
- **Don't** usar iconos de fuente, emojis ni glifos como iconos; solo trazos de tiza SVG.
- **Don't** proyectar sombras desde botones, tarjetas o notas; solo la bandeja y el pizarrón de práctica, como objetos físicos, llevan sombra difusa.
- **Don't** usar chalk-45 para texto de lectura.
